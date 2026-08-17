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
  var LS_THEME = "tt_theme";

  /* ---------- 全局状态 ---------- */
  var state = {
    view: "home",
    test: null,          // 当前测试配置
    answers: [],         // 当前答案（每项为选项索引）
    qIndex: 0,
    startedAt: null,
    search: ""           // 首页搜索关键词
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

  /* ---------- 自定义模态对话框（替代原生 confirm） ---------- */
  /*
   * showConfirm(options) 返回 Promise<boolean>
   * options: { title, message, okText, cancelText, danger }
   *   title:      对话框标题，默认"温馨提示"
   *   message:    提示内容（支持 \n 换行）
   *   okText:     确定按钮文字，默认"确定"
   *   cancelText: 取消按钮文字，默认"取消"
   *   danger:     是否红色强调确定按钮，默认 false
   */
  function showConfirm(options) {
    options = options || {};
    var modal = $("modal");
    $("modal-title").textContent = options.title || "温馨提示";
    $("modal-body").textContent = options.message || "";
    $("modal-ok").textContent = options.okText || "确定";
    $("modal-cancel").textContent = options.cancelText || "取消";
    if (options.danger) {
      $("modal-ok").style.color = "var(--danger)";
    } else {
      $("modal-ok").style.color = "";
    }
    modal.hidden = false;

    return new Promise(function (resolve) {
      function cleanup(result) {
      $("modal-ok").removeEventListener("click", onOk);
        $("modal-cancel").removeEventListener("click", onCancel);
        $("modal-mask").removeEventListener("click", onCancel);
        document.removeEventListener("keydown", onKey);
        modal.hidden = true;
        resolve(result);
      }
      function onOk() { cleanup(true); }
      function onCancel() { cleanup(false); }
      function onKey(e) {
        if (e.key === "Escape") onCancel();
        else if (e.key === "Enter") onOk();
      }
      $("modal-ok").addEventListener("click", onOk);
      $("modal-cancel").addEventListener("click", onCancel);
      $("modal-mask").addEventListener("click", onCancel);
      document.addEventListener("keydown", onKey);
    });
  }

  /* ---------- 主题切换（auto/light/dark 三态循环） ---------- */
  var THEME_ORDER = ["auto", "light", "dark"];
  var THEME_LABEL = { auto: "跟随系统", light: "浅色", dark: "深色" };

  function getTheme() {
    var t = null;
    try { t = localStorage.getItem(LS_THEME); } catch (e) { /* ignore */ }
    return (t === "light" || t === "dark") ? t : "auto";
  }
  function applyTheme(theme) {
    var root = document.documentElement;
    if (theme === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
    var btn = $("theme-toggle");
    if (btn) btn.title = "主题：" + THEME_LABEL[theme] + "（点击切换）";
  }
  function cycleTheme() {
    var cur = getTheme();
    var next = THEME_ORDER[(THEME_ORDER.indexOf(cur) + 1) % THEME_ORDER.length];
    try {
      if (next === "auto") localStorage.removeItem(LS_THEME);
      else localStorage.setItem(LS_THEME, next);
    } catch (e) { /* ignore */ }
    applyTheme(next);
  }
  applyTheme(getTheme());
  var themeBtn = $("theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", cycleTheme);

  /* ---------- 视图切换 ---------- */
  function showView(name) {
    // 离开答题页时清理状态和定时器，避免残留
    if (state.view === "test" && name !== "test") {
      clearAutoJump();
      state.test = null;
      state.answers = [];
    }
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
  // 初始化：显示首页（确保 HTML 默认状态与 JS state 同步）
  showView("home");

  /* ---------- 首页 ---------- */
  /* 测试卡片单卡渲染（供分组复用） */
  function renderTestCard(t) {
    var card = document.createElement("button");
    card.className = "test-card";
    card.style.setProperty("--card-accent", t.color || "#0071e3");
    card.innerHTML =
      '<span class="test-icon" style="background:' + (t.color || "#0071e3") + '">' + esc(t.icon || t.id.slice(0, 2).toUpperCase()) + "</span>" +
      '<span class="test-name">' + esc(t.name) + "</span>" +
      '<span class="test-desc">' + esc(t.description || "") + "</span>" +
      '<span class="test-meta"><span>' + esc(t.questions.length) + " 题</span><span>" + esc(t.time || "") + "</span></span>";
    card.addEventListener("click", function () { startTest(t.id); });
    return card;
  }

  /* 关键词是否匹配某测试 */
  function matchTest(t, kw) {
    if (!kw) return true;
    var name = (t.name || "").toLowerCase();
    var desc = (t.description || "").toLowerCase();
    var id = (t.id || "").toLowerCase();
    return name.indexOf(kw) > -1 || desc.indexOf(kw) > -1 || id.indexOf(kw) > -1;
  }

  function renderHome() {
    var box = $("test-groups");
    var kw = (state.search || "").trim().toLowerCase();

    // 1. 解析分组配置；若未配置则退化为单个「全部测试」分组
    var groups = (window.TEST_GROUPS && window.TEST_GROUPS.length)
      ? window.TEST_GROUPS.map(function (g) { return { id: g.id, name: g.name, icon: g.icon, open: g.open !== false, testIds: g.testIds || [] }; })
      : [{ id: "_all", name: "全部测试", icon: "📋", open: true, testIds: window.TESTS.map(function (t) { return t.id; }) }];

    // 2. 收集已被任何分组引用的 id，未引用的归入「其他」
    var referenced = {};
    groups.forEach(function (g) { g.testIds.forEach(function (id) { referenced[id] = true; }); });
    var orphans = window.TESTS.filter(function (t) { return !referenced[t.id]; }).map(function (t) { return t.id; });
    if (orphans.length) groups.push({ id: "_other", name: "其他", icon: "📦", open: true, testIds: orphans });

    // 3. 按分组渲染
    var hint = $("search-hint");
    var totalMatch = 0;
    box.innerHTML = "";

    groups.forEach(function (g) {
      var tests = g.testIds
        .map(function (id) { return window.TESTS.find(function (t) { return t.id === id; }); })
        .filter(function (t) { return t && matchTest(t, kw); });

      if (kw) {
        // 搜索时：隐藏无匹配的分组，有匹配的强制展开
        if (!tests.length) return;
        totalMatch += tests.length;
      }

      var group = document.createElement("div");
      group.className = "test-group" + (kw || g.open ? " open" : "");
      group.dataset.gid = g.id;

      var header = document.createElement("button");
      header.className = "group-header";
      header.type = "button";
      header.innerHTML =
        '<span class="group-icon">' + esc(g.icon || "📁") + "</span>" +
        '<span class="group-name">' + esc(g.name || "分组") + "</span>" +
        '<span class="group-count">' + tests.length + "</span>" +
        '<span class="group-chev">▶</span>';
      header.addEventListener("click", function () {
        // 搜索时不允许收起（保持展开方便查看结果）
        if (kw) return;
        group.classList.toggle("open");
      });

      var body = document.createElement("div");
      body.className = "group-body";
      var grid = document.createElement("div");
      grid.className = "test-grid";
      tests.forEach(function (t) { grid.appendChild(renderTestCard(t)); });
      body.appendChild(grid);

      group.appendChild(header);
      group.appendChild(body);
      box.appendChild(group);
    });

    // 4. 搜索提示
    if (kw) {
      hint.hidden = false;
      hint.textContent = totalMatch
        ? "找到 " + totalMatch + " 个匹配「" + kw + "」的测试"
        : "没有找到匹配「" + kw + "」的测试";
      if (!totalMatch) {
        box.innerHTML = '<div class="empty-state"><div class="empty-title">暂无匹配测试</div>换个关键词试试吧~</div>';
      }
    } else {
      hint.hidden = true;
      hint.textContent = "";
    }
  }

  /* 首页搜索框绑定 */
  var searchInput = $("test-search");
  var searchClear = $("search-clear");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      state.search = searchInput.value;
      if (searchClear) searchClear.hidden = !searchInput.value;
      renderHome();
    });
  }
  if (searchClear) {
    searchClear.addEventListener("click", function () {
      if (searchInput) searchInput.value = "";
      state.search = "";
      searchClear.hidden = true;
      renderHome();
      if (searchInput) searchInput.focus();
    });
  }

  /* ---------- 性别选择（MMPI-2 等需按性别计分） ---------- */
  function showGenderPicker() {
    return new Promise(function (resolve) {
      var modal = $("modal");
      $("modal-title").textContent = "请选择性别";
      $("modal-body").innerHTML = '<div style="display:flex;gap:12px;justify-content:center;padding:8px 0">' +
        '<button class="btn primary" id="gender-m" style="flex:1">男</button>' +
        '<button class="btn primary" id="gender-f" style="flex:1">女</button></div>';
      var actions = modal.querySelector(".modal-actions");
      actions.style.display = "none";
      modal.hidden = false;
      function done(g) {
        $("gender-m").removeEventListener("click", onM);
        $("gender-f").removeEventListener("click", onF);
        $("modal-mask").removeEventListener("click", onMask);
        document.removeEventListener("keydown", onKey);
        actions.style.display = "";
        modal.hidden = true;
        resolve(g);
      }
      function onM() { done("M"); }
      function onF() { done("F"); }
      function onMask() { done(null); }
      function onKey(e) { if (e.key === "Escape") done(null); }
      $("gender-m").addEventListener("click", onM);
      $("gender-f").addEventListener("click", onF);
      $("modal-mask").addEventListener("click", onMask);
      document.addEventListener("keydown", onKey);
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
    if (t.needGender) {
      showGenderPicker().then(function (g) {
        if (!g) { state.test = null; return; }
        state.gender = g;
        _doStartTest(t);
      });
      return;
    }
    _doStartTest(t);
  }

  function _doStartTest(t) {
    var id = t.id;
    // 断点续答：检测未完成的进度
    var prog = Store.get(LS_PROGRESS, null);
    if (prog && prog.testId === id && Array.isArray(prog.answers)) {
      if (prog.gender) state.gender = prog.gender;
      var doneCount = prog.answers.filter(function (a) { return a !== null && a !== undefined; }).length;
      showConfirm({
        title: "温馨提示",
        message: "检测到上次未完成的「" + t.name + "」答题进度（已完成 " + doneCount + " 题），是否继续？\n\n点「确定」继续上次进度，点「取消」重新开始。",
        okText: "确定",
        cancelText: "取消"
      }).then(function (keep) {
        if (keep) {
          state.answers = prog.answers.slice(0, t.questions.length);
          state.qIndex = Math.min(prog.qIndex || 0, t.questions.length - 1);
          state.startedAt = prog.startedAt || Date.now();
        } else {
          Store.remove(LS_PROGRESS);
        }
        _enterTestView();
      });
    } else {
      _enterTestView();
    }
  }

  function _enterTestView() {
    showView("test");
    $("quiz-name").textContent = state.test.name;
    renderQuestion();
  }

  function renderQuestion() {
    var t = state.test;
    var q = t.questions[state.qIndex];
    var total = t.questions.length;
    var answeredCount = state.answers.filter(function (a) { return a !== null && a !== undefined; }).length;
    var pct = Math.round(answeredCount / total * 100);

    $("quiz-progress-bar").style.width = pct + "%";
    $("quiz-progress-text").textContent = "已完成 " + answeredCount + " / " + total + " 题";
    // 底部进度条与百分比
    var spFill = $("save-progress-fill");
    var spText = $("save-progress-text");
    if (spFill) spFill.style.width = pct + "%";
    if (spText) spText.textContent = pct + "%";
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
  }

  /* 自动跳转定时器：选中选项后延迟跳到下一题（让用户看到选中反馈） */
  var autoJumpTimer = null;
  var AUTO_JUMP_DELAY = 320;

  function clearAutoJump() {
    if (autoJumpTimer) { clearTimeout(autoJumpTimer); autoJumpTimer = null; }
  }

  function selectOption(idx) {
    clearAutoJump();
    state.answers[state.qIndex] = idx;
    saveProgress();
    renderQuestion();

    autoJumpTimer = setTimeout(function () {
      autoJumpTimer = null;
      if (!state.test) return; // 已离开答题页
      if (state.qIndex < state.test.questions.length - 1) {
        state.qIndex++;
        renderQuestion();
      } else {
        finishTest();
      }
    }, AUTO_JUMP_DELAY);
  }

  $("btn-prev").addEventListener("click", function () {
    clearAutoJump();
    if (state.qIndex > 0) {
      state.qIndex--;
      renderQuestion();
    }
  });

  /* 答题页返回首页：清除定时器和状态，保留进度给断点续答 */
  var quitBtn = $("btn-quit");
  if (quitBtn) {
    quitBtn.addEventListener("click", function () {
      clearAutoJump();
      state.test = null;
      state.answers = [];
      showView("home");
    });
  }

  function saveProgress() {
    if (!state.test) return;
    Store.set(LS_PROGRESS, {
      testId: state.test.id,
      answers: state.answers,
      qIndex: state.qIndex,
      startedAt: state.startedAt,
      gender: state.gender || null
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
    if (scoring.type === "mmpi2") {
      // 将选项索引映射为 {题号: "T"/"F"/"X"}，交给 MMPI-2 计分引擎
      var ansMap = {};
      answers.forEach(function (idx, qi) {
        if (idx === null || idx === undefined) return;
        var q = test.questions[qi];
        var opt = q.options[idx];
        if (!opt || !opt.value) return;
        ansMap[q.no] = opt.value;
      });
      var res = (typeof MMPI2Score !== "undefined")
        ? MMPI2Score.compute(ansMap, state.gender || "M")
        : { error: "MMPI-2 计分引擎未加载" };
      return { mmpi2: res };
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

    if (test.scoring.type === "mmpi2") {
      var mr = raw.mmpi2;
      if (mr && mr.error) {
        record.summary = mr.error;
      } else if (mr) {
        record.type = (mr.code && mr.code.code) ? mr.code.code : "";
        record.typeName = (mr.code && mr.code.code) ? ("MMPI-2 " + mr.code.code + " 两点编码") : "MMPI-2";
        var vStatus = (mr.validity && mr.validity.status) || "unknown";
        record.summary = vStatus === "valid" ? "效度良好，结果可解释"
          : vStatus === "caution" ? "效度需谨慎（见效度检查）"
          : vStatus === "invalid" ? "效度异常，结果需谨慎解读"
          : "";
        record.gender = state.gender || "M";
        // 临床量表 T 分作为维度展示（供通用列表与导出使用）
        if (Array.isArray(mr.clinical)) {
          record.dimensions = mr.clinical.map(function (s) {
            var t = s.t || 0;
            return {
              key: s.baseAbbr || s.abbr || "",
              label: s.nameZh || s.name || s.abbr || "",
              score: t,
              max: 120,
              percent: Math.min(100, Math.round(t / 120 * 100))
            };
          });
        }
      }
    }

    return record;
  }

  /* ---------- 结果渲染 ---------- */
  function finishTest() {
    clearAutoJump();
    var test = state.test;
    var unanswered = test.questions.some(function (_, i) {
      return state.answers[i] === null || state.answers[i] === undefined;
    });
    var doFinish = function () {
      var record = buildResultRecord(test, state.answers);
      saveHistory(record);
      clearProgress();
      state.test = null;
      state.answers = [];
      renderResult(record);
      showView("result");
    };
    if (unanswered) {
      showConfirm({
        title: "温馨提示",
        message: "还有题目未作答，确定提交吗？未作答题目将按未计分处理。",
        okText: "确定提交",
        cancelText: "继续作答",
        danger: true
      }).then(function (ok) {
        if (ok) doFinish();
      });
    } else {
      doFinish();
    }
  }

  function renderResult(record) {
    // MMPI-2 专用渲染（效度/临床/内容/附加/RC/PSY-5/KB-LW）
    if (record.testId === "mmpi2") { renderMmpi2Result(record); return; }
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

  /* ---------- MMPI-2 专用结果渲染 ---------- */
  function renderMmpi2Result(record) {
    var box = $("result-content");
    var res = record.raw && record.raw.mmpi2;
    var html = "";

    html += '<div class="result-hero">';
    if (record.type) html += '<div class="result-type">' + esc(record.type) + "</div>";
    if (record.typeName) html += '<div class="result-name">' + esc(record.typeName) + "</div>";
    html += '<div class="result-test-meta">' + esc(record.testName) + " · " + fmtTime(record.time) + (record.gender ? " · " + (record.gender === "F" ? "女性常模" : "男性常模") : "") + "</div>";
    if (record.summary) html += '<div class="result-summary">' + esc(record.summary) + "</div>";
    html += "</div>";

    // 操作栏
    html += '<div class="result-actions">';
    html += '<button class="btn primary" onclick="window.__ttExport(\'html\')">导出 HTML 报告</button>';
    html += '<button class="btn ghost" onclick="window.__ttExport(\'md\')">导出 Markdown</button>';
    html += '<button class="btn ghost" onclick="window.__ttExport(\'json\')">导出 JSON</button>';
    html += '<button class="btn ghost" onclick="showView(\'home\')">返回首页</button>';
    html += "</div>";

    if (!res || res.error) {
      html += '<div class="result-section"><p>' + esc((res && res.error) || "计分结果缺失") + "</p></div>";
      box.innerHTML = html;
      window.__currentRecord = record;
      window.__ttExport = function (fmt) { exportRecord(record, fmt); };
      return;
    }

    var interp = (typeof MMPI2Score !== "undefined") ? MMPI2Score.getInterp() : { k_notes: "", t_notes: "", kb_lw_notes: "", disclaimer: "" };

    // 概要
    var v = res.validity || { status: "unknown", checks: [] };
    var badgeLabel = v.status === "valid" ? "有效" : (v.status === "caution" ? "需谨慎" : (v.status === "invalid" ? "无效" : "未知"));
    var badgeClass = v.status === "valid" ? "valid" : (v.status === "caution" ? "caution" : "invalid");
    html += '<div class="result-section">';
    html += '<h3>测验概览</h3>';
    html += '<div class="stat-grid">';
    html += '<div class="stat-item"><div class="stat-value">' + (res.meta ? res.meta.answeredCount : "-") + '</div><div class="stat-label">已作答 / 共 ' + (res.meta ? res.meta.totalQuestions : "-") + " 题</div></div>";
    html += '<div class="stat-item"><div class="stat-value">' + (res.meta ? res.meta.unanswered : "-") + '</div><div class="stat-label">未回答</div></div>';
    html += '<div class="stat-item"><div class="stat-value"><span class="badge ' + badgeClass + '">' + badgeLabel + '</span></div><div class="stat-label">效度状态</div></div>';
    html += "</div></div>";

    // 效度
    html += '<div class="result-section"><h3>效度检查</h3>';
    html += '<table class="scale-table"><thead><tr><th>指标</th><th>原始分</th><th>T分</th><th>状态</th><th>说明</th></tr></thead><tbody>';
    v.checks.forEach(function (c) {
      var st = c.status === "ok" ? '<span class="badge valid">正常</span>' : (c.status === "na" ? '<span class="badge neutral">未评估</span>' : (c.status === "invalid" ? '<span class="badge invalid">无效</span>' : '<span class="badge caution">异常</span>'));
      html += "<tr><td><strong>" + esc(c.label) + "</strong></td><td>" + (c.raw === null || c.raw === undefined ? "—" : c.raw) + "</td><td>" + (c.t === null || c.t === undefined ? "—" : (+c.t).toFixed(1)) + "</td><td>" + st + "</td><td class='hit-list'>" + esc(c.note) + "</td></tr>";
    });
    html += "</tbody></table>";
    if (v.status === "invalid") {
      html += '<div class="warn-box"><strong>警告：</strong>本份作答未通过效度检验，临床量表结果不可解释。建议重新施测或由专业人员面谈核实。</div>';
    }
    html += '<p class="text-muted" style="margin-top:10px;">' + esc(interp.k_notes || "") + "</p>";
    html += '<p class="text-muted">' + esc(interp.t_notes || "") + "</p>";
    html += "</div>";

    // 临床量表
    html += '<div class="result-section"><h3>临床量表剖析图（T 分）</h3>';
    html += mmpiScaleTable(res.clinical || []);
    html += '<p class="text-muted" style="margin-top:8px;">中国常模分界：T≥60 临床升高（橙），T≥70 高度显著（红）。绿色为正常。</p>';
    html += "</div>";

    // 两点编码
    html += '<div class="result-section"><h3>两点编码</h3>';
    if (res.code && res.code.code) {
      html += '<div class="code-card">';
      html += '<div class="code-title">两点编码：' + esc(res.code.code + "/" + res.code.rev) + "</div>";
      html += "<p>最高两个临床量表：<strong>" + esc(res.code.top.baseAbbr + " " + res.code.top.nameZh) + "</strong>（T=" + res.code.top.t.toFixed(1) + "）、<strong>" + esc(res.code.second.baseAbbr + " " + res.code.second.nameZh) + "</strong>（T=" + res.code.second.t.toFixed(1) + "）</p>";
      html += '<p style="margin-top:10px;">' + (res.code.text ? esc(res.code.text) : "该编码组合手册未提供专门解读，请结合各量表分数综合判断。") + "</p>";
      html += "</div>";
    } else {
      html += '<div class="code-card"><div class="code-title">两点编码：未形成</div><p>无两个临床量表同时达到 T≥60，未构成标准两点编码。</p></div>';
    }
    html += "</div>";

    // 临床量表解读
    if (res.clinicalInterp && res.clinicalInterp.length) {
      html += '<div class="result-section"><h3>临床量表解读（T≥60 或 T&lt;40）</h3><ul class="interp-list">';
      res.clinicalInterp.forEach(function (it) {
        html += "<li><strong>" + esc(it.zh) + "</strong>（T=" + it.t.toFixed(1) + "）：" + esc(it.text) + "</li>";
      });
      html += "</ul></div>";
    }

    // 内容量表
    html += '<div class="result-section"><h3>内容量表（T 分）</h3>';
    html += mmpiScaleTable(res.content || []);
    if (res.contentInterp && res.contentInterp.length) {
      html += '<h4 style="margin-top:16px;">内容量表解读（T≥60）</h4><ul class="interp-list">';
      res.contentInterp.forEach(function (it) {
        html += "<li><strong>" + esc(it.zh) + "</strong>（T=" + it.t.toFixed(1) + "）：" + esc(it.text) + "</li>";
      });
      html += "</ul>";
    }
    html += "</div>";

    // 附加 / RC / PSY-5 / 全部量表
    html += '<details><summary>附加量表（A/R/Es/Do/Re 等，共 ' + (res.additional || []).length + "）</summary>" + mmpiScaleTable(res.additional || []) + "</details>";
    html += '<details><summary>再构临床量表 RC（' + (res.rc || []).length + "）</summary>" + mmpiScaleTable(res.rc || []) + "</details>";
    html += '<details><summary>PSY-5 人格病理量表（' + (res.psy5 || []).length + "）</summary>" + mmpiScaleTable(res.psy5 || []) + "</details>";
    html += '<details><summary>全部 147 个量表明细</summary>' + mmpiScaleTable(res.allScales || []) + "</details>";

    // KB/LW
    html += '<div class="result-section"><h3>关键条目（KB / LW）命中</h3>';
    html += '<p class="text-muted">' + esc(interp.kb_lw_notes || "") + "</p>";
    var QUESTIONS = (typeof MMPI2Score !== "undefined") ? MMPI2Score.loadQuestions() : [];
    if (!(res.kbHits && res.kbHits.length) && !(res.lwHits && res.lwHits.length)) {
      html += "<p>本次作答未命中任何关键条目。</p>";
    } else {
      if (res.kbHits && res.kbHits.length) {
        html += "<h4>KB（Koss-Butcher）关键条目</h4>";
        res.kbHits.forEach(function (s) {
          var items = s.hitItems.map(function (no) {
            var q = QUESTIONS.find(function (x) { return x.no === no; });
            return "#" + no + " " + (q ? q.zh : "");
          }).join("；");
          html += "<p><strong>" + esc(s.baseAbbr + " " + s.nameZh) + "</strong>：" + esc(items) + "</p>";
        });
      }
      if (res.lwHits && res.lwHits.length) {
        html += "<h4>LW（Lachar-Wrobel）关键条目</h4>";
        res.lwHits.forEach(function (s) {
          var items = s.hitItems.map(function (no) {
            var q = QUESTIONS.find(function (x) { return x.no === no; });
            return "#" + no + " " + (q ? q.zh : "");
          }).join("；");
          html += "<p><strong>" + esc(s.baseAbbr + " " + s.nameZh) + "</strong>：" + esc(items) + "</p>";
        });
      }
    }
    html += "</div>";

    // 免责声明
    html += '<div class="result-section warn-box"><strong>免责声明：</strong>' + esc(interp.disclaimer || "") + "</div>";

    box.innerHTML = html;
    window.__currentRecord = record;
    window.__ttExport = function (fmt) { exportRecord(record, fmt); };
  }

  function mmpiScaleTable(scales) {
    function tClass(t) {
      if (t === null || t === undefined) return "";
      if (t >= 70) return "t-high";
      if (t >= 60) return "t-mid";
      return "";
    }
    function tBar(t) {
      if (t === null || t === undefined) return '<span class="text-muted">—</span>';
      var w = Math.min(100, Math.max(4, t / 120 * 100));
      var color = t >= 70 ? "var(--danger)" : (t >= 60 ? "var(--warning)" : "var(--success)");
      return '<div class="tbar-wrap"><div class="tbar" style="width:' + w + "%;background:" + color + '"></div></div> ' + (+t).toFixed(1);
    }
    var rows = scales.map(function (s) {
      return "<tr><td><strong>" + esc(s.baseAbbr) + "</strong></td><td>" + esc(s.nameZh || s.name) + "</td><td>" + s.raw + "</td><td>" + (s.k ? (+s.k).toFixed(1) : "—") + "</td><td class='" + tClass(s.t) + "'>" + tBar(s.t) + "</td></tr>";
    }).join("");
    return '<table class="scale-table"><thead><tr><th>量表</th><th>名称</th><th>原始分</th><th>K系数</th><th>T分</th></tr></thead><tbody>' + rows + "</tbody></table>";
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
        '<button class="icon-btn compare" data-act="compare" data-idx="' + idx + '" title="对比">🆚 对比</button>' +
        '<button class="icon-btn del" data-act="del" data-idx="' + idx + '" title="删除">🗑 删除</button>' +
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
        showConfirm({
          title: "温馨提示",
          message: "确定删除这条记录吗？",
          okText: "删除",
          cancelText: "取消",
          danger: true
        }).then(function (ok) {
          if (!ok) return;
          var l = getHistory();
          l.splice(idx, 1);
          Store.set(LS_HISTORY, l);
          renderHistory();
        });
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
    if (rec.testId === "mmpi2") { exportMmpi2(rec, fmt, base); return; }
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

  /* ---------- MMPI-2 专用导出 ---------- */
  function exportMmpi2(rec, fmt, base) {
    var res = rec.raw && rec.raw.mmpi2;
    if (!res || res.error) { alert((res && res.error) || "计分结果缺失，无法导出"); return; }
    var interp = (typeof MMPI2Score !== "undefined") ? MMPI2Score.getInterp() : { k_notes: "", t_notes: "", kb_lw_notes: "", disclaimer: "" };
    var QUESTIONS = (typeof MMPI2Score !== "undefined") ? MMPI2Score.loadQuestions() : [];

    function mdTable(scales, cols) {
      if (!scales || !scales.length) return "";
      var lines = ["| 量表 | 名称 | 原始分 | K系数 | T分 |", "|---|---|---|---|---|"];
      scales.forEach(function (s) {
        lines.push("| " + s.baseAbbr + " | " + s.nameZh + " | " + s.raw + " | " + (s.k ? (+s.k).toFixed(1) : "—") + " | " + (s.t === null || s.t === undefined ? "—" : (+s.t).toFixed(1)) + " |");
      });
      return lines.join("\n");
    }
    function hitMd(hits, title) {
      if (!hits || !hits.length) return "";
      var out = "### " + title + "\n\n";
      hits.forEach(function (s) {
        var items = s.hitItems.map(function (no) {
          var q = QUESTIONS.find(function (x) { return x.no === no; });
          return "#" + no + " " + (q ? q.zh : "");
        }).join("；");
        out += "- **" + s.baseAbbr + " " + s.nameZh + "**：" + items + "\n";
      });
      return out + "\n";
    }
    function hitHtml(hits, title) {
      if (!hits || !hits.length) return "";
      var out = "<h3 style=\"color:#0071e3;margin:14px 0 6px\">" + title + "</h3>";
      hits.forEach(function (s) {
        var items = s.hitItems.map(function (no) {
          var q = QUESTIONS.find(function (x) { return x.no === no; });
          return "#" + no + " " + (q ? q.zh : "");
        }).join("；");
        out += "<p style=\"font-size:13px;margin:6px 0\"><strong>" + esc(s.baseAbbr + " " + s.nameZh) + "</strong>：" + esc(items) + "</p>";
      });
      return out;
    }

    if (fmt === "md") {
      var md = "# " + rec.testName + " 测试报告\n\n";
      md += "- 时间：" + fmtTime(rec.time) + "\n";
      md += "- 常模：" + (rec.gender === "F" ? "女性" : "男性") + "\n";
      md += "- 效度状态：" + res.validity.status + "\n\n";
      md += "## 效度检查\n\n";
      md += "| 指标 | 原始分 | T分 | 状态 | 说明 |\n|---|---|---|---|---|\n";
      res.validity.checks.forEach(function (c) {
        md += "| " + c.label + " | " + (c.raw === null || c.raw === undefined ? "—" : c.raw) + " | " + (c.t === null || c.t === undefined ? "—" : (+c.t).toFixed(1)) + " | " + c.status + " | " + (c.note || "") + " |\n";
      });
      md += "\n## 两点编码：" + (res.code ? res.code.code + "/" + res.code.rev : "未形成") + "\n\n";
      if (res.code && res.code.text) md += res.code.text + "\n\n";
      md += "## 临床量表（T 分）\n\n" + mdTable(res.clinical) + "\n\n";
      if (res.clinicalInterp && res.clinicalInterp.length) {
        md += "## 临床量表解读\n\n";
        res.clinicalInterp.forEach(function (it) { md += "- **" + it.zh + "**（T=" + it.t.toFixed(1) + "）：" + it.text + "\n"; });
        md += "\n";
      }
      md += "## 内容量表（T 分）\n\n" + mdTable(res.content) + "\n\n";
      md += "## 附加量表\n\n" + mdTable(res.additional) + "\n\n";
      md += "## 再构临床量表 RC\n\n" + mdTable(res.rc) + "\n\n";
      md += "## PSY-5 人格病理量表\n\n" + mdTable(res.psy5) + "\n\n";
      md += "## 关键条目命中\n\n" + (res.kbHits && res.kbHits.length ? hitMd(res.kbHits, "KB（Koss-Butcher）") : "") + (res.lwHits && res.lwHits.length ? hitMd(res.lwHits, "LW（Lachar-Wrobel）") : "本次作答未命中任何关键条目。\n");
      md += "\n---\n\n" + interp.disclaimer + "\n";
      download(base + ".md", md, "text/markdown;charset=utf-8");
      return;
    }

    // html
    function htmlTable(scales) {
      if (!scales || !scales.length) return "<p style=\"color:#86868b\">—</p>";
      var rows = scales.map(function (s) {
        var tCls = s.t >= 70 ? "color:#ff3b30;font-weight:700" : (s.t >= 60 ? "color:#ff9500;font-weight:600" : "");
        return "<tr><td><strong>" + esc(s.baseAbbr) + "</strong></td><td>" + esc(s.nameZh) + "</td><td>" + s.raw + "</td><td>" + (s.k ? (+s.k).toFixed(1) : "—") + "</td><td style=\"" + tCls + "\">" + (s.t === null || s.t === undefined ? "—" : (+s.t).toFixed(1)) + "</td></tr>";
      }).join("");
      return "<table style=\"width:100%;border-collapse:collapse;font-size:13px\"><thead><tr style=\"color:#86868b;font-size:12px;text-align:left\"><th style=\"padding:6px 8px;border-bottom:1px solid #eee\">量表</th><th style=\"padding:6px 8px;border-bottom:1px solid #eee\">名称</th><th style=\"padding:6px 8px;border-bottom:1px solid #eee\">原始分</th><th style=\"padding:6px 8px;border-bottom:1px solid #eee\">K系数</th><th style=\"padding:6px 8px;border-bottom:1px solid #eee\">T分</th></tr></thead><tbody>" + rows + "</tbody></table>";
    }
    var html = "<!DOCTYPE html><html lang=\"zh-CN\"><head><meta charset=\"utf-8\"><title>" + esc(rec.testName) + " 测试报告</title></head>" +
      "<body style=\"font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;max-width:720px;margin:40px auto;padding:0 20px;color:#1d1d1f\">" +
      "<h1>" + esc(rec.testName) + " 测试报告</h1>" +
      "<p style=\"color:#86868b;font-size:13px\">" + fmtTime(rec.time) + " · " + (rec.gender === "F" ? "女性" : "男性") + "常模</p>" +
      (rec.type ? "<div style=\"font-size:34px;font-weight:800;color:#0071e3;margin:14px 0\">两点编码 " + esc(rec.type) + "</div>" : "") +
      (rec.summary ? "<p>" + esc(rec.summary) + "</p>" : "") +
      "<h2 style=\"color:#0071e3\">效度检查</h2>" + htmlTable(res.validity.checks.map(function (c) {
        return { baseAbbr: c.label, nameZh: c.note || "", raw: c.raw === null || c.raw === undefined ? "—" : c.raw, k: null, t: c.t };
      })) +
      "<h2 style=\"color:#0071e3\">临床量表（T 分）</h2>" + htmlTable(res.clinical) +
      (res.clinicalInterp && res.clinicalInterp.length ? "<h2 style=\"color:#0071e3\">临床量表解读</h2>" + res.clinicalInterp.map(function (it) {
        return "<p style=\"font-size:14px;line-height:1.8\"><strong>" + esc(it.zh) + "</strong>（T=" + it.t.toFixed(1) + "）：" + esc(it.text) + "</p>";
      }).join("") : "") +
      "<h2 style=\"color:#0071e3\">内容量表（T 分）</h2>" + htmlTable(res.content) +
      "<h2 style=\"color:#0071e3\">附加量表</h2>" + htmlTable(res.additional) +
      "<h2 style=\"color:#0071e3\">再构临床量表 RC</h2>" + htmlTable(res.rc) +
      "<h2 style=\"color:#0071e3\">PSY-5 人格病理量表</h2>" + htmlTable(res.psy5) +
      "<h2 style=\"color:#0071e3\">关键条目命中</h2>" + (res.kbHits && res.kbHits.length ? hitHtml(res.kbHits, "KB（Koss-Butcher）") : "") + (res.lwHits && res.lwHits.length ? hitHtml(res.lwHits, "LW（Lachar-Wrobel）") : "<p style=\"color:#86868b\">本次作答未命中任何关键条目。</p>") +
      "<p style=\"color:#86868b;font-size:12px;margin-top:24px\">" + esc(interp.disclaimer) + "</p>" +
      "<p style=\"color:#aaa;font-size:12px;margin-top:16px\">由测试小站生成 · 数据仅存于本地</p></body></html>";
    download(base + ".html", html, "text/html;charset=utf-8");
  }

  $("btn-export-all").addEventListener("click", exportAll);
  $("btn-export-all-2").addEventListener("click", exportAll);
  function exportAll() {
    var list = getHistory();
    if (!list.length) { alert("暂无记录可导出"); return; }
    download("测试记录备份_" + new Date().toISOString().slice(0, 10) + ".json", JSON.stringify(list, null, 2), "application/json;charset=utf-8");
  }

  $("btn-clear-data").addEventListener("click", function () {
    showConfirm({
      title: "温馨提示",
      message: "确定清空全部测试记录吗？此操作不可恢复，建议先导出备份。",
      okText: "清空",
      cancelText: "取消",
      danger: true
    }).then(function (ok) {
      if (!ok) return;
      Store.set(LS_HISTORY, []);
      Store.remove(LS_PROGRESS);
      renderHistory();
      $("data-status").textContent = "已清空全部数据";
      $("data-status").className = "status-line ok";
    });
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
