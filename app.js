/* ===== 测试小站 · 核心引擎 ===== */
(function () {
  "use strict";

  /* ---------- 存储工具 ---------- */
  var Store = {
    get: function (key, def) {
      try {
        var raw = localStorage.getItem(key);
        return raw === null ? def : JSON.parse(raw);
      } catch (e) { return def; }
    },
    set: function (key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* 容量满等 */ }
    },
    remove: function (key) {
      try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
    }
  };

  var LS_HISTORY = "tt_history";
  var LS_PROGRESS = "tt_progress";
  var LS_LLM = "tt_llm_config";

  /* ---------- 全局状态 ---------- */
  var state = {
    view: "home",
    test: null,          // 当前测试配置
    answers: [],         // 当前答案（每项为选项索引）
    qIndex: 0,
    startedAt: null
  };

  /* ---------- DOM 引用 ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var views = {
    home: $("view-home"),
    test: $("view-test"),
    result: $("view-result"),
    history: $("view-history"),
    settings: $("view-settings")
  };

  /* ---------- 工具函数 ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function fmtTime(ts) {
    var d = new Date(ts);
    var p = function (n) { return n < 10 ? "0" + n : "" + n; };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) +
      " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }
  function download(filename, content, mime) {
    var blob = new Blob([content], { type: mime || "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }

  /* ---------- 视图切换 ---------- */
  function showView(name) {
    Object.keys(views).forEach(function (k) {
      views[k].hidden = k !== name;
    });
    document.querySelectorAll(".nav-item").forEach(function (b) {
      b.classList.toggle("active", b.dataset.nav === name);
    });
    state.view = name;
    window.scrollTo({ top: 0 });
    if (name === "history") renderHistory();
    if (name === "settings") renderSettings();
  }
  document.querySelectorAll("[data-nav]").forEach(function (b) {
    b.addEventListener("click", function () { showView(b.dataset.nav); });
  });

  /* ---------- 首页 ---------- */
  function renderHome() {
    var grid = $("test-grid");
    grid.innerHTML = "";
    window.TESTS.forEach(function (t) {
      var card = document.createElement("button");
      card.className = "test-card";
      card.style.setProperty("--card-accent", t.color || "#0071e3");
      card.innerHTML =
        '<span class="test-icon" style="background:' + (t.color || "#0071e3") + '">' + esc(t.icon || t.id.slice(0, 2).toUpperCase()) + "</span>" +
        '<span class="test-name">' + esc(t.name) + "</span>" +
        '<span class="test-desc">' + esc(t.description || "") + "</span>" +
        '<span class="test-meta"><span>' + esc(t.questions.length) + " 题</span><span>" + esc(t.time || "") + "</span></span>";
      card.addEventListener("click", function () { startTest(t.id); });
      grid.appendChild(card);
    });
  }

  /* ---------- 答题 ---------- */
  function startTest(id) {
    var t = window.TESTS.find(function (x) { return x.id === id; });
    if (!t) return;
    state.test = t;
    state.answers = [];
    state.qIndex = 0;
    state.startedAt = Date.now();

    // 断点续答：检测未完成的进度
    var prog = Store.get(LS_PROGRESS, null);
    if (prog && prog.testId === id && Array.isArray(prog.answers)) {
      var keep = confirm("检测到上次未完成的「" + t.name + "」答题进度（已完成 " + prog.answers.filter(function (a) { return a !== null && a !== undefined; }).length + " 题），是否继续？\n\n点「确定」继续上次进度，点「取消」重新开始。");
      if (keep) {
        state.answers = prog.answers.slice(0, t.questions.length);
        state.qIndex = Math.min(prog.qIndex || 0, t.questions.length - 1);
        state.startedAt = prog.startedAt || Date.now();
      } else {
        Store.remove(LS_PROGRESS);
      }
    }

    showView("test");
    $("quiz-name").textContent = t.name;
    renderQuestion();
  }

  function renderQuestion() {
    var t = state.test;
    var q = t.questions[state.qIndex];
    var total = t.questions.length;
    var answeredCount = state.answers.filter(function (a) { return a !== null && a !== undefined; }).length;

    $("quiz-progress-bar").style.width = (answeredCount / total * 100) + "%";
    $("quiz-progress-text").textContent = "已完成 " + answeredCount + " / " + total + " 题";
    $("question-index").textContent = "第 " + (state.qIndex + 1) + " / " + total + " 题";
    $("question-text").textContent = q.text;

    var opts = $("options");
    opts.innerHTML = "";
    q.options.forEach(function (opt, i) {
      var btn = document.createElement("button");
      btn.className = "option-item" + (state.answers[state.qIndex] === i ? " selected" : "");
      btn.innerHTML = '<span class="option-mark"></span><span>' + esc(opt.label) + "</span>";
      btn.addEventListener("click", function () { selectOption(i); });
      opts.appendChild(btn);
    });

    $("btn-prev").disabled = state.qIndex === 0;
    var isLast = state.qIndex === total - 1;
    $("btn-next").textContent = isLast ? "完成测试" : "下一题";
    $("btn-next").disabled = state.answers[state.qIndex] === null || state.answers[state.qIndex] === undefined;
    $("btn-next").classList.toggle("primary", true);
  }

  function selectOption(idx) {
    state.answers[state.qIndex] = idx;
    saveProgress();
    renderQuestion();
  }

  $("btn-prev").addEventListener("click", function () {
    if (state.qIndex > 0) {
      state.qIndex--;
      renderQuestion();
    }
  });

  $("btn-next").addEventListener("click", function () {
    if (state.qIndex < state.test.questions.length - 1) {
      state.qIndex++;
      renderQuestion();
    } else {
      finishTest();
    }
  });

  function saveProgress() {
    if (!state.test) return;
    Store.set(LS_PROGRESS, {
      testId: state.test.id,
      answers: state.answers,
      qIndex: state.qIndex,
      startedAt: state.startedAt
    });
  }

  function clearProgress() {
    Store.remove(LS_PROGRESS);
  }

  /* ---------- 计分引擎 ---------- */
  function computeResult(test, answers) {
    var scoring = test.scoring;
    if (scoring.type === "dimension") {
      var dimScores = {};
      scoring.dimensions.forEach(function (d) { dimScores[d.key] = 0; });
      answers.forEach(function (idx, qi) {
        if (idx === null || idx === undefined) return;
        var opt = test.questions[qi].options[idx];
        if (!opt || !opt.value) return;
        Object.keys(opt.value).forEach(function (k) {
          if (dimScores[k] !== undefined) dimScores[k] += opt.value[k];
        });
      });
      return { dimScores: dimScores };
    }
    if (scoring.type === "type") {
      var typeScores = {};
      Object.keys(scoring.types).forEach(function (k) { typeScores[k] = 0; });
      answers.forEach(function (idx, qi) {
        if (idx === null || idx === undefined) return;
        var opt = test.questions[qi].options[idx];
        if (!opt || !opt.value) return;
        if (typeof opt.value === "string" && typeScores[opt.value] !== undefined) {
          typeScores[opt.value] += 1;
        } else if (typeof opt.value === "number") {
          // 题目级：直接加给该题所属量表（MMPI 风格）
          var dimKey = opt.dim;
          if (dimKey && typeScores[dimKey] !== undefined) typeScores[dimKey] += opt.value;
        }
      });
      return { typeScores: typeScores };
    }
    return {};
  }

  function buildResultRecord(test, answers) {
    var raw = computeResult(test, answers);
    var record = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      testId: test.id,
      testName: test.name,
      time: Date.now(),
      answers: answers.slice(),
      raw: raw,
      type: "",
      typeName: "",
      dimensions: [],
      summary: ""
    };

    if (test.scoring.type === "dimension") {
      var dims = test.scoring.dimensions;
      // 若有维度配对（如 MBTI E/I），生成类型字母
      if (test.scoring.pairs) {
        var letters = test.scoring.pairs.map(function (pair) {
          var a = raw.dimScores[pair[0]] || 0;
          var b = raw.dimScores[pair[1]] || 0;
          return a >= b ? pair[0] : pair[1];
        });
        record.type = letters.join("");
        record.dimensions = test.scoring.pairs.map(function (pair) {
          var a = raw.dimScores[pair[0]] || 0;
          var b = raw.dimScores[pair[1]] || 0;
          var da = dims.filter(function (d) { return d.key === pair[0]; })[0] || { label: pair[0] };
          var db = dims.filter(function (d) { return d.key === pair[1]; })[0] || { label: pair[1] };
          return {
            key: pair.join(""),
            label: da.label + " / " + db.label,
            score: Math.max(a, b),
            max: Math.max(a + b, 1),
            percent: (a + b) ? Math.round(Math.max(a, b) / (a + b) * 100) : 50,
            winner: a >= b ? pair[0] : pair[1],
            detail: a + " : " + b
          };
        });
      } else {
        record.dimensions = dims.map(function (d) {
          return {
            key: d.key,
            label: d.label,
            low: d.low,
            high: d.high,
            score: raw.dimScores[d.key] || 0,
            max: d.max || 100,
            percent: d.max ? Math.min(100, Math.round((raw.dimScores[d.key] || 0) / d.max * 100)) : 0
          };
        });
      }
      // 自定义分类（如依恋类型四分类：按维度组合定型）
      if (test.scoring.classify) {
        var cls = test.scoring.classify(raw.dimScores);
        if (cls) {
          record.type = cls.type || record.type;
          record.typeName = cls.typeName || record.typeName;
          record.summary = cls.summary || record.summary;
        }
      }
      // 类型解读
      if (test.interpretation && test.interpretation.types && test.interpretation.types[record.type]) {
        var ti = test.interpretation.types[record.type];
        record.typeName = ti.title || record.type;
        record.summary = ti.summary || "";
      }
    }

    if (test.scoring.type === "type") {
      var best = null, bestKey = null;
      Object.keys(raw.typeScores).forEach(function (k) {
        if (best === null || raw.typeScores[k] > best) { best = raw.typeScores[k]; bestKey = k; }
      });
      record.type = bestKey || "";
      if (test.interpretation && test.interpretation.types && test.interpretation.types[bestKey]) {
        var ti2 = test.interpretation.types[bestKey];
        record.typeName = ti2.title || bestKey;
        record.summary = ti2.summary || "";
      }
      record.dimensions = Object.keys(raw.typeScores).map(function (k) {
        return {
          key: k,
          label: (test.scoring.types[k] && test.scoring.types[k].label) || k,
          score: raw.typeScores[k] || 0,
          max: (test.scoring.maxScore) || Math.max.apply(null, Object.values(raw.typeScores)),
          percent: Math.min(100, Math.round((raw.typeScores[k] || 0) / ((test.scoring.maxScore) || Math.max.apply(null, Object.values(raw.typeScores))) * 100))
        };
      });
    }

    return record;
  }

  /* ---------- 结果渲染 ---------- */
  function finishTest() {
    var test = state.test;
    var unanswered = test.questions.some(function (_, i) {
      return state.answers[i] === null || state.answers[i] === undefined;
    });
    if (unanswered) {
      if (!confirm("还有题目未作答，确定提交吗？未作答题目将按未计分处理。")) return;
    }
    var record = buildResultRecord(test, state.answers);
    saveHistory(record);
    clearProgress();
    state.test = null;
    state.answers = [];
    renderResult(record);
    showView("result");
  }

  function renderResult(record) {
    var t = window.TESTS.find(function (x) { return x.id === record.testId; });
    var box = $("result-content");
    var html = "";

    html += '<div class="result-hero">';
    if (record.type) html += '<div class="result-type">' + esc(record.type) + "</div>";
    if (record.typeName) html += '<div class="result-name">' + esc(record.typeName) + "</div>";
    html += '<div class="result-test-meta">' + esc(record.testName) + " · " + fmtTime(record.time) + "</div>";
    if (record.summary) html += '<div class="result-summary">' + esc(record.summary) + "</div>";
    html += "</div>";

    // 操作栏
    html += '<div class="result-actions">';
    html += '<button class="btn primary" onclick="window.__ttExport(\'html\')">导出 HTML 报告</button>';
    html += '<button class="btn ghost" onclick="window.__ttExport(\'md\')">导出 Markdown</button>';
    html += '<button class="btn ghost" onclick="window.__ttExport(\'json\')">导出 JSON</button>';
    html += '<button class="btn ghost" onclick="showView(\'home\')">返回首页</button>';
    html += "</div>";

    // 维度得分
    if (record.dimensions && record.dimensions.length) {
      html += '<div class="result-section"><h3>维度得分</h3>';
      record.dimensions.forEach(function (d) {
        html += '<div class="dimension-row">';
        html += '<div class="dimension-label"><span class="dim-name">' + esc(d.label) + "</span><span class=\"dim-score\">" + d.score + " / " + d.max + "</span></div>";
        html += '<div class="dimension-track"><div class="dimension-fill" style="width:' + d.percent + '%"></div></div>';
        html += "</div>";
      });
      html += "</div>";
    }

    // 内置解读
    var blocks = buildInterpretation(t, record);
    if (blocks && blocks.length) {
      html += '<div class="result-section"><h3>详细解读</h3>';
      blocks.forEach(function (b) {
        html += '<div class="interpret-block"><h4>' + esc(b.h) + "</h4><p>" + b.p + "</p></div>";
      });
      html += "</div>";
    }

    // AI 深度解读面板
    var llm = Store.get(LS_LLM, null);
    var hasLlm = llm && llm.baseUrl && llm.apiKey && llm.model;
    html += '<div class="llm-panel"><h3>AI 深度解读</h3>';
    html += '<p class="block-desc">' + (hasLlm ? "已配置大模型接口，可生成个性化深度报告。" : "尚未配置大模型接口，可在「设置」中填写 OpenAI 兼容接口。") + "</p>";
    html += '<button class="btn primary" id="btn-llm-go" ' + (hasLlm ? "" : "disabled") + ">生成深度解读</button>";
    html += '<div id="llm-output"></div></div>';

    box.innerHTML = html;

    window.__currentRecord = record;
    window.__ttExport = function (fmt) { exportRecord(record, fmt); };
    var llmBtn = $("btn-llm-go");
    if (llmBtn) llmBtn.addEventListener("click", function () { deepInterpret(record); });
  }

  function buildInterpretation(t, record) {
    var out = [];
    var interp = t.interpretation || {};
    if (!interp) return out;

    // 维度解读
    if (interp.dims && record.dimensions) {
      if (record.type && record.type.length > 1 && interp.dims[record.type.charAt(0)]) {
        // 类型字母逐项解读（如 MBTI：E/S/T/J 各项倾向）
        record.type.split("").forEach(function (ch) {
          var info = interp.dims[ch];
          if (info && info.high) out.push({ h: (info.name || ch) + " · 你的倾向", p: info.high });
        });
      } else {
        record.dimensions.forEach(function (d) {
          var info = interp.dims[d.key];
          if (!info) return;
          var ratio = d.max ? d.score / d.max : 0;
          if (ratio >= 0.6 && info.high) out.push({ h: d.label + " · 高分表现", p: info.high });
          else if (ratio <= 0.4 && info.low) out.push({ h: d.label + " · 低分表现", p: info.low });
          else if (info.mid) out.push({ h: d.label + " · 中间状态", p: info.mid });
        });
      }
    }

    // 类型解读
    if (interp.types && record.type && interp.types[record.type]) {
      var ti = interp.types[record.type];
      if (ti.blocks) ti.blocks.forEach(function (b) { out.push({ h: b.h, p: b.p }); });
      else if (ti.summary) out.push({ h: "整体描述", p: ti.summary });
    }

    // 专用解读（SCL-90 等按因子列表）
    if (interp.special) {
      var special = interp.special(record);
      if (special) special.forEach(function (b) { out.push({ h: b.h, p: b.p }); });
    }

    return out;
  }

  /* ---------- 历史 ---------- */
  function getHistory() {
    return Store.get(LS_HISTORY, []);
  }
  function saveHistory(record) {
    var list = getHistory();
    list.unshift(record);
    Store.set(LS_HISTORY, list);
  }

  function renderHistory() {
    var list = getHistory();
    $("history-subtitle").textContent = list.length ? "共 " + list.length + " 条记录" : "";
    var box = $("history-list");
    if (!list.length) {
      box.innerHTML = '<div class="empty-state"><div class="empty-title">还没有测试记录</div>去首页挑一个测试开始吧~</div>';
      return;
    }
    box.innerHTML = "";
    list.forEach(function (rec, idx) {
      var item = document.createElement("div");
      item.className = "history-item-wrap";
      var resultText = rec.type ? (rec.type + (rec.typeName && rec.typeName !== rec.type ? " · " + rec.typeName : "")) : (rec.testName);
      item.innerHTML =
        '<button class="history-item" data-idx="' + idx + '">' +
        '<span class="history-left"><span class="history-name">' + esc(rec.testName) + "</span>" +
        '<span class="history-result">' + esc(resultText) + "</span>" +
        '<span class="history-time">' + fmtTime(rec.time) + "</span></span></button>" +
        '<div class="history-actions">' +
        '<button class="icon-btn" data-act="compare" data-idx="' + idx + '" title="对比">对</button>' +
        '<button class="icon-btn" data-act="del" data-idx="' + idx + '" title="删除">删</button>' +
        "</div>";
      box.appendChild(item);
    });

    box.querySelectorAll(".history-item").forEach(function (b) {
      b.addEventListener("click", function () {
        var idx = parseInt(b.dataset.idx, 10);
        renderResult(list[idx]);
        showView("result");
      });
    });
    box.querySelectorAll('[data-act="del"]').forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        var idx = parseInt(b.dataset.idx, 10);
        if (!confirm("确定删除这条记录吗？")) return;
        var l = getHistory();
        l.splice(idx, 1);
        Store.set(LS_HISTORY, l);
        renderHistory();
      });
    });
    box.querySelectorAll('[data-act="compare"]').forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        var idx = parseInt(b.dataset.idx, 10);
        compareHistory(list, idx);
      });
    });
  }

  function compareHistory(list, idx) {
    var rec = list[idx];
    var same = list.filter(function (r) { return r.testId === rec.testId; });
    var box = $("history-list");
    var wrap = box.querySelector('.history-item-wrap[data-cmp]');
    if (wrap) { wrap.remove(); }

    var holder = document.createElement("div");
    holder.className = "history-item-wrap";
    holder.dataset.cmp = "1";
    var html = '<div class="history-compare"><h4>「' + esc(rec.testName) + '」多次结果对比</h4>';
    same.slice(0, 8).forEach(function (r) {
      html += '<div class="compare-row">';
      html += '<div class="compare-cell"><div class="c-label">' + fmtTime(r.time) + "</div><div class=\"c-value\">" + esc(r.type || "-") + "</div></div>";
      html += '<div class="compare-cell"><div class="c-label">类型</div><div class="c-value">' + esc(r.typeName || "-") + "</div></div>";
      html += "</div>";
    });
    html += '<button class="btn ghost" style="margin-top:8px" onclick="this.closest(\'.history-item-wrap\').remove()">收起对比</button>';
    html += "</div>";
    holder.innerHTML = html;
    var target = box.children[idx] || box.appendChild(holder);
    if (target.nextSibling) box.insertBefore(holder, target.nextSibling);
    else box.appendChild(holder);
  }

  /* ---------- 导出 ---------- */
  function exportRecord(rec, fmt) {
    var t = window.TESTS.find(function (x) { return x.id === rec.testId; });
    var base = "测试_" + rec.testName + "_" + new Date(rec.time).toISOString().slice(0, 10);
    if (fmt === "json") {
      download(base + ".json", JSON.stringify(rec, null, 2), "application/json;charset=utf-8");
      return;
    }
    if (fmt === "md") {
      var md = "# " + rec.testName + " 测试报告\n\n";
      md += "- 时间：" + fmtTime(rec.time) + "\n";
      md += "- 结果：" + (rec.type ? rec.type + (rec.typeName ? " " + rec.typeName : "") : "-") + "\n\n";
      if (rec.dimensions && rec.dimensions.length) {
        md += "## 维度得分\n\n";
        rec.dimensions.forEach(function (d) {
          md += "- " + d.label + "：" + d.score + " / " + d.max + "\n";
        });
      }
      var blocks = buildInterpretation(t, rec);
      if (blocks.length) {
        md += "\n## 详细解读\n\n";
        blocks.forEach(function (b) { md += "### " + b.h + "\n\n" + b.p + "\n\n"; });
      }
      download(base + ".md", md, "text/markdown;charset=utf-8");
      return;
    }
    // html
    var dimHtml = "";
    if (rec.dimensions && rec.dimensions.length) {
      dimHtml = "<h2>维度得分</h2><div style=\"margin:12px 0\">";
      rec.dimensions.forEach(function (d) {
        dimHtml += '<div style="margin:8px 0"><div style="font-size:13px;color:#666;margin-bottom:4px">' + esc(d.label) + "：" + d.score + " / " + d.max + "</div>" +
          '<div style="background:#eee;border-radius:6px;height:8px;overflow:hidden"><div style="width:' + d.percent + "%;height:100%;background:#0071e3;border-radius:6px\"></div></div></div>";
      });
      dimHtml += "</div>";
    }
    var blocks2 = buildInterpretation(t, rec);
    var interpHtml = blocks2.length ? "<h2>详细解读</h2>" + blocks2.map(function (b) {
      return "<h3 style=\"color:#0071e3;margin:14px 0 6px\">" + esc(b.h) + "</h3><p style=\"font-size:14px;line-height:1.8\">" + esc(b.p) + "</p>";
    }).join("") : "";
    var htmlDoc = "<!DOCTYPE html><html lang=\"zh-CN\"><head><meta charset=\"utf-8\"><title>" + esc(rec.testName) + " 测试报告</title></head>" +
      "<body style=\"font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;max-width:720px;margin:40px auto;padding:0 20px;color:#1d1d1f\">" +
      "<h1>" + esc(rec.testName) + " 测试报告</h1>" +
      "<p style=\"color:#86868b;font-size:13px\">" + fmtTime(rec.time) + "</p>" +
      (rec.type ? "<div style=\"font-size:40px;font-weight:800;color:#0071e3;margin:16px 0\">" + esc(rec.type) + "</div>" : "") +
      (rec.typeName ? "<h2 style=\"margin-bottom:4px\">" + esc(rec.typeName) + "</h2>" : "") +
      (rec.summary ? "<p>" + esc(rec.summary) + "</p>" : "") +
      dimHtml + interpHtml +
      "<p style=\"color:#aaa;font-size:12px;margin-top:32px\">由测试小站生成 · 数据仅存于本地</p></body></html>";
    download(base + ".html", htmlDoc, "text/html;charset=utf-8");
  }

  $("btn-export-all").addEventListener("click", exportAll);
  $("btn-export-all-2").addEventListener("click", exportAll);
  function exportAll() {
    var list = getHistory();
    if (!list.length) { alert("暂无记录可导出"); return; }
    download("测试记录备份_" + new Date().toISOString().slice(0, 10) + ".json", JSON.stringify(list, null, 2), "application/json;charset=utf-8");
  }

  $("btn-clear-data").addEventListener("click", function () {
    if (!confirm("确定清空全部测试记录吗？此操作不可恢复，建议先导出备份。")) return;
    Store.set(LS_HISTORY, []);
    Store.remove(LS_PROGRESS);
    renderHistory();
    $("data-status").textContent = "已清空全部数据";
    $("data-status").className = "status-line ok";
  });

  /* ---------- 设置 / LLM ---------- */
  function renderSettings() {
    var llm = Store.get(LS_LLM, null);
    $("set-base-url").value = llm && llm.baseUrl || "";
    $("set-api-key").value = llm && llm.apiKey || "";
    $("set-model").value = llm && llm.model || "";
    $("llm-status").textContent = llm && llm.baseUrl ? "已保存配置" : "";
    $("llm-status").className = llm && llm.baseUrl ? "status-line ok" : "status-line";
  }

  $("btn-save-llm").addEventListener("click", function () {
    var cfg = {
      baseUrl: $("set-base-url").value.trim().replace(/\/+$/, ""),
      apiKey: $("set-api-key").value.trim(),
      model: $("set-model").value.trim()
    };
    if (!cfg.baseUrl || !cfg.apiKey || !cfg.model) {
      $("llm-status").textContent = "请完整填写 Base URL、API Key、模型名三项";
      $("llm-status").className = "status-line err";
      return;
    }
    Store.set(LS_LLM, cfg);
    $("llm-status").textContent = "配置已保存";
    $("llm-status").className = "status-line ok";
  });

  $("btn-test-llm").addEventListener("click", function () {
    var cfg = {
      baseUrl: $("set-base-url").value.trim().replace(/\/+$/, ""),
      apiKey: $("set-api-key").value.trim(),
      model: $("set-model").value.trim()
    };
    if (!cfg.baseUrl || !cfg.apiKey || !cfg.model) {
      $("llm-status").textContent = "请先完整填写配置";
      $("llm-status").className = "status-line err";
      return;
    }
    $("llm-status").textContent = "连接测试中...";
    $("llm-status").className = "status-line";
    callLLM(cfg, "你好，请回复「连接成功」。").then(function (text) {
      $("llm-status").textContent = "连接成功：" + String(text).slice(0, 60);
      $("llm-status").className = "status-line ok";
    }).catch(function (err) {
      $("llm-status").textContent = "连接失败：" + err.message;
      $("llm-status").className = "status-line err";
    });
  });

  function callLLM(cfg, prompt) {
    var url = cfg.baseUrl + "/chat/completions";
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + cfg.apiKey
      },
      body: JSON.stringify({
        model: cfg.model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (t) { throw new Error("HTTP " + res.status + (t ? " " + t.slice(0, 120) : "")); });
      }
      return res.json();
    }).then(function (data) {
      var content = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (!content) throw new Error("响应格式异常");
      return content;
    });
  }

  function deepInterpret(rec) {
    var llm = Store.get(LS_LLM, null);
    var out = $("llm-output");
    if (!llm || !llm.baseUrl) { out.textContent = "请先在设置页配置大模型接口"; return; }
    var t = window.TESTS.find(function (x) { return x.id === rec.testId; });
    var dimText = (rec.dimensions || []).map(function (d) { return d.label + " " + d.score + "/" + d.max; }).join("、");
    var prompt = "请基于以下心理测试结果，写一份详细的深度解读报告（中文，800字左右，分小节：核心特质、潜在盲区、发展建议、人际关系启示）。\n\n" +
      "测试：" + rec.testName + "\n" +
      "结果类型：" + rec.type + (rec.typeName ? "（" + rec.typeName + "）" : "") + "\n" +
      "维度得分：" + (dimText || "无") + "\n\n" +
      "请保持客观中立，避免过度绝对化的表述。";
    out.textContent = "正在调用大模型生成深度解读，请稍候...";
    callLLM(llm, prompt).then(function (text) {
      out.textContent = text;
    }).catch(function (err) {
      out.textContent = "调用失败：" + err.message + "\n\n提示：若报跨域（CORS）错误，说明该接口不支持浏览器直连，可在支持 CORS 的接口服务中使用。";
    });
  }

  /* ---------- 初始化 ---------- */
  renderHome();
})();
