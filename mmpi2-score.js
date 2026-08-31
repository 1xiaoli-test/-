/* ============================================================
 * MMPI-2 计分引擎 mmpi2-score.js
 * 计分规则严格对标 MMPI-2 使用手册（中文简体字版）：
 *  ① 原始分 = 命中的 T 方向"答是" + F 方向"答否"题数
 *  ② K 校正：Hs+0.5K, Pd+0.4K, Pt+1.0K, Sc+1.0K, Ma+0.2K
 *     Mf/Si 官方采用线性 T 分；本数据无线性参数，回退查表（tscale[raw+1]）
 *  ③ 效度判断：?>=30 无效、L T>=60 可疑、F raw>=116(男)/120(女) 无效、
 *     TRIN raw<=5 或 >=13 无效、VRIN T>=85(男)/87(女) 无效、ICH>=10 无效、F-K>=17 提示诈病
 *  ④ 结果解读：T>=60 临床升高、T>=70 高度显著、两点编码解读
 *  ⑤ KB/LW 关键条目无 T 分表，仅输出命中条目
 * ============================================================ */
var MMPI2Score = (function () {
  "use strict";

  var DATA = (typeof MMPI2_DATA !== "undefined") ? MMPI2_DATA : null;
  var INTERP = (typeof MMPI2_INTERP !== "undefined") ? MMPI2_INTERP : {};

  /* VRIN/TRIN 官方 T 分表随数据文件提供（DATA.rin.VRIN_T_MALE 等，索引=原始分）；
     TRIN 表为带方向字符串（如 "57T"/"114F"），需解析数值与方向。 */

  /* ---------- 工具函数 ---------- */
  function zhName(abbr) {
    if (INTERP.scale_names_zh && INTERP.scale_names_zh[abbr]) return INTERP.scale_names_zh[abbr];
    return abbr;
  }

  /* 取量表条目：Mf 按性别取对应条目（男用男表、女用女表） */
  function getScaleEntry(abbr, gender) {
    if (!DATA) return null;
    var list = DATA.scales.filter(function (s) { return s.abbr === abbr; });
    if (list.length === 0) return null;
    if (list.length === 1) return list[0];
    // 多条（Mf 男/女）：按 gender 字段匹配；找不到则返回第一个
    var want = (gender === "F") ? "F" : "M";
    for (var i = 0; i < list.length; i++) {
      if (list[i].gender === want) return list[i];
    }
    return list[0];
  }

  /* 原始分：命中 T 方向"答是" + F 方向"答否"题数 */
  function rawScore(scale, answers) {
    var raw = 0;
    var ti = scale.t_items || [];
    var fi = scale.f_items || [];
    var i;
    for (i = 0; i < ti.length; i++) {
      if (answers[ti[i]] === "T") raw++;
    }
    for (i = 0; i < fi.length; i++) {
      if (answers[fi[i]] === "F") raw++;
    }
    return raw;
  }

  /* 查表 T 分：tscale[raw+1]（表首 null 为占位，raw=0 时取 tscale[1]） */
  function tFromTable(tscale, raw) {
    if (!tscale || tscale.length === 0) return null;
    var idx = raw + 1;
    if (idx >= tscale.length) idx = tscale.length - 1; // 超界取表末
    var v = tscale[idx];
    return (v === null || v === undefined) ? null : v;
  }

  /* 取某量表 T 分（含 K 校正后原始分查表） */
  function tScore(scale, raw, gender) {
    var table = (gender === "F") ? scale.t_female : scale.t_male;
    if (!table || table.length === 0) return null; // KB/LW 无表
    return tFromTable(table, raw);
  }

  /* VRIN 原始分：配对两题作答均命中配对方向（内容矛盾）→ 计 1 */
  function vrinRaw(pairs, answers) {
    var raw = 0, i;
    for (i = 0; i < pairs.length; i++) {
      var p = pairs[i];
      var a = answers[p[0]], b = answers[p[2]]; // [q1, dir1, q2, dir2, w]
      if (a === null || a === undefined || b === null || b === undefined) continue;
      if (a === p[1] && b === p[3]) raw += p[4]; // p[4] 恒为 1
    }
    return raw;
  }

  /* TRIN 原始分：起始 9；T-T 一致对（两题均答 T）命中 +1，F-F 一致对（两题均答 F）命中 -1 */
  function trinRaw(pairs, answers) {
    var raw = 9, i;
    for (i = 0; i < pairs.length; i++) {
      var p = pairs[i];
      var a = answers[p[0]], b = answers[p[2]]; // [q1, dir1, q2, dir2, w]
      if (a === null || a === undefined || b === null || b === undefined) continue;
      if (a === p[1] && b === p[3]) raw += p[4]; // +1（T-T）或 -1（F-F）
    }
    return raw;
  }

  /* ---------- 效度判断 ---------- */
  function validityCheck(res, gender) {
    var checks = [];
    var notes = [];
    var invalidFlags = [];
    var unanswered = res.unanswered;

    // ? 未答题
    checks.push({ key: "?", label: "未答题数", raw: unanswered, t: null,
      status: unanswered >= 30 ? "invalid" : "ok",
      note: unanswered >= 30 ? "未答题 ≥30，剖析图无效" : "未答题未超标" });
    if (unanswered >= 30) invalidFlags.push("?");

    // L
    var L = res.scalesMap["L"];
    if (L) {
      var Ls = L.t >= 60 ? (L.t >= 70 ? "high" : "caution") : "ok";
      checks.push({ key: "L", label: "说谎 L", raw: L.raw, t: L.t, status: Ls,
        note: Ls === "high" ? "L T≥70，过度自我美饰" : Ls === "caution" ? "L T≥60 可疑" : "正常" });
    }

    // F
    var F = res.scalesMap["F"];
    if (F) {
      var cutoff = (gender === "F") ? 120 : 116;
      var Fs = (F.t !== null && F.t >= cutoff) ? "invalid" : (F.t !== null && F.t >= 90 ? "caution" : "ok");
      checks.push({ key: "F", label: "诈病 F", raw: F.raw, t: F.t, status: Fs,
        note: Fs === "invalid" ? ("F T=" + F.t + " ≥ " + cutoff + "，剖析图无效") : (Fs === "caution" ? ("F T=" + F.t + " ≥ 90，提示异常应答") : "正常") });
      if (Fs === "invalid") invalidFlags.push("F");
    }

    // K
    var K = res.scalesMap["K"];
    if (K) {
      var Ks = K.t >= 65 ? "caution" : "ok";
      checks.push({ key: "K", label: "校正/防御 K", raw: K.raw, t: K.t, status: Ks,
        note: Ks === "caution" ? "K T≥65，高防御倾向" : "正常" });
    }

    // Fb
    var Fb = res.scalesMap["Fb"];
    if (Fb) {
      var Fbs = (Fb.t !== null && Fb.t >= 80) ? "caution" : "ok";
      checks.push({ key: "Fb", label: "后部F Fb", raw: Fb.raw, t: Fb.t, status: Fbs,
        note: Fbs === "caution" ? "Fb 高分，后半程异常应答" : "正常" });
    }

    // Fp
    var Fp = res.scalesMap["Fp"];
    if (Fp) {
      var Fps = (Fp.t !== null && Fp.t >= 100) ? "caution" : "ok";
      checks.push({ key: "Fp", label: "精神病理F Fp", raw: Fp.raw, t: Fp.t, status: Fps,
        note: Fps === "caution" ? "Fp 高分，提示装作精神疾病" : "正常" });
    }

    // VRIN
    if (res.rin) {
      var vT = res.rin.VRIN.t;
      var vCut = (gender === "F") ? 87 : 85;
      var vCaution = 75;
      var vs = (vT !== null && vT >= vCut) ? "invalid" : (vT !== null && vT >= vCaution ? "caution" : "ok");
      checks.push({ key: "VRIN", label: "矛盾作答 VRIN", raw: res.rin.VRIN.raw, t: vT, status: vs,
        note: vs === "invalid" ? ("VRIN T " + vT + " ≥ " + vCut + "，应答不一致，剖析图不可解释") : (vs === "caution" ? ("VRIN T " + vT + " ≥ " + vCaution + "，应答一致性偏低") : "正常") });
      if (vs === "invalid") invalidFlags.push("VRIN");

      // TRIN
      var tRaw = res.rin.TRIN.raw;
      var tT = res.rin.TRIN.t;
      var ts = (tRaw <= 5 || tRaw >= 13) ? "invalid" : "ok";
      var tNote = (tT !== null) ? ("，T=" + tT.value + (tT.dir === "T" ? "（答是倾向）" : tT.dir === "F" ? "（答否倾向）" : "（居中）")) : "";
      checks.push({ key: "TRIN", label: "同向作答 TRIN", raw: tRaw, t: tT ? tT.value : null, status: ts,
        note: ts === "invalid" ? ("TRIN 原始分 " + tRaw + "（≤5 或 ≥13），全部答是/答否倾向，无效" + tNote) : "正常" + tNote });
      if (ts === "invalid") invalidFlags.push("TRIN");
    }

    // ICH（数据未含题号，显示未评估）
    checks.push({ key: "ICH", label: "中文F ICH", raw: null, t: null, status: "na",
      note: "数据未含 ICH 量表题号，本次未评估（官方标准：≥10 无效）" });

    // F-K 指数
    if (F && K) {
      var fk = F.raw - K.raw;
      var fks = fk >= 17 ? "caution" : "ok";
      checks.push({ key: "F-K", label: "F-K 指数", raw: fk, t: null, status: fks,
        note: fks === "caution" ? "F−K ≥17，提示诈病倾向" : "正常（0-11 正常，12-16 高分）" });
    }

    var status = "valid";
    if (invalidFlags.length > 0) status = "invalid";
    else if (checks.some(function (c) { return c.status === "caution" || c.status === "high"; })) status = "caution";

    return { status: status, flags: invalidFlags, checks: checks, notes: notes };
  }

  /* ---------- 两点编码 ---------- */
  function codeType(clinicalScales) {
    // 编码基于临床量表 1,2,3,4,6,7,8,9（排除 5-Mf 与 0-Si）
    var pool = clinicalScales.filter(function (s) {
      return ["1", "2", "3", "4", "6", "7", "8", "9"].indexOf(s.code) >= 0 && s.t !== null;
    }).sort(function (a, b) { return b.t - a.t; });
    if (pool.length < 2) return null;
    var top = pool[0], second = pool[1];
    if (top.t < 60 || second.t < 60) return null; // 两量表均达临床升高才编码
    var a = parseInt(top.code, 10), b = parseInt(second.code, 10);
    var code = (a <= b) ? ("" + a + b) : ("" + b + a);
    var rev = (a <= b) ? ("" + b + a) : ("" + a + b);
    var key = code + "/" + rev;
    return { code: code, rev: rev, key: key, top: top, second: second,
      text: (INTERP.code_interp && INTERP.code_interp[key]) ? INTERP.code_interp[key] : null };
  }

  /* ---------- 主入口 ---------- */
  function compute(answers, gender) {
    if (!DATA) return { error: "数据文件未加载（mmpi2-data.js）" };
    gender = (gender === "F") ? "F" : "M";
    answers = answers || {};

    var answeredCount = 0;
    for (var k in answers) {
      if (answers[k] === "T" || answers[k] === "F") answeredCount++;
    }
    var unanswered = DATA.questions.length - answeredCount;

    var scales = [];
    var scalesMap = {};
    var seen = {};

    for (var i = 0; i < DATA.scales.length; i++) {
      var base = DATA.scales[i];
      var abbr = base.abbr;
      var key = abbr;
      if (seen[key]) {
        // Mf 男女条目标记为 MfM / MfF
        key = abbr + (base.gender === "F" ? "F" : "M");
      }
      seen[key] = true;

      var entry = base;
      var raw = rawScore(entry, answers);
      var adjustedRaw = raw;

      // K 校正（仅临床量表 1,4,7,8,9；K 为原始分）
      if (base.k > 0 && scalesMap["K"]) {
        adjustedRaw = raw + base.k * scalesMap["K"].raw;
        adjustedRaw = Math.floor(adjustedRaw + 0.5); // 与原脚本一致：四舍五入取整后查表
      }

      // T 分
      var t = null;
      var hasTable = !!(base.t_male && base.t_male.length) || !!(base.t_female && base.t_female.length);
      if (hasTable) {
        if (base.gender === "F" || base.gender === "M") {
          // 性别专属条目（Mf）：用自身表
          t = tScore(base, adjustedRaw, base.gender === "F" ? "F" : "M");
        } else {
          t = tScore(base, adjustedRaw, gender);
        }
      }

      // 命中条目（KB/LW 展示用）
      var hitItems = [];
      if (!hasTable || abbr.indexOf("KB") === 0 || abbr.indexOf("LW") === 0) {
        var qmap = DATA.questionMap;
        [].concat(base.t_items || []).forEach(function (no) {
          if (answers[no] === "T") hitItems.push(no);
        });
        [].concat(base.f_items || []).forEach(function (no) {
          if (answers[no] === "F") hitItems.push(no);
        });
        hitItems.sort(function (x, y) { return x - y; });
      }

      var item = {
        code: base.code, abbr: key, baseAbbr: abbr, name: base.name,
        nameZh: zhName(abbr), k: base.k, raw: raw, adjustedRaw: adjustedRaw,
        t: t, hasTable: hasTable, gender: base.gender, hitItems: hitItems
      };
      scales.push(item);
      scalesMap[key] = item;
    }

    // VRIN / TRIN（rin 字段）
    var rin = null;
    if (DATA.rin && DATA.rin.VRIN && DATA.rin.TRIN) {
      var vRaw = vrinRaw(DATA.rin.VRIN, answers);
      var vTable = (gender === "F") ? DATA.rin.VRIN_T_FEMALE : DATA.rin.VRIN_T_MALE;
      // VRIN 表无 null 占位，直接按 raw 索引（与原脚本 rin[i][2+gender][raw] 一致）
      var vT = null;
      if (vTable && vRaw >= 0 && vRaw < vTable.length) {
        var vv = vTable[vRaw];
        if (vv !== null && vv !== undefined) vT = vv;
      }
      var tRaw = trinRaw(DATA.rin.TRIN, answers);
      var tTable = (gender === "F") ? DATA.rin.TRIN_T_FEMALE : DATA.rin.TRIN_T_MALE;
      var tT = null;
      if (tTable && tRaw >= 0 && tRaw < tTable.length) {
        var tv = tTable[tRaw];
        if (typeof tv === "string") {
          var m = tv.match(/^(\d+)([TF])?$/);
          if (m) tT = { value: parseInt(m[1], 10), dir: m[2] || "C" };
        } else if (tv !== null && tv !== undefined) {
          tT = { value: tv, dir: "C" };
        }
      }
      rin = {
        VRIN: { raw: vRaw, t: vT, pairCount: DATA.rin.VRIN.length, isApprox: false },
        TRIN: { raw: tRaw, t: tT, pairCount: DATA.rin.TRIN.length }
      };
    }

    // 分类（Mf 仅保留与受测性别匹配的条目，避免男女两行同时展示）
    var clinical = scales.filter(function (s) {
      if (s.code !== null && !isNaN(s.code)) {
        if (s.baseAbbr === "Mf") return s.gender === gender;
        return true;
      }
      return false;
    });
    var content = scales.filter(function (s) {
      return ["ANX","FRS","OBS","DEP","HEA","BIZ","ANG","CYN","ASP","TPA","LSE","SOD","FAM","WRK","TRT"].indexOf(s.baseAbbr) >= 0;
    });
    var additional = scales.filter(function (s) {
      return ["A","R","Es","Do","Re","O-H","MAC-R","AAS","APS","MDS","Ho","Mt","GM","GF","PK","PS"].indexOf(s.baseAbbr) >= 0;
    });
    var kb = scales.filter(function (s) { return s.baseAbbr.indexOf("KB") === 0; });
    var lw = scales.filter(function (s) { return s.baseAbbr.indexOf("LW") === 0; });
    var rc = scales.filter(function (s) { return ["RCd","RC1","RC2","RC3","RC4","RC6","RC7","RC8","RC9"].indexOf(s.code) >= 0; });
    var psy5 = scales.filter(function (s) { return ["AGGR","PSYC","DISC","NEGE","INTR"].indexOf(s.baseAbbr) >= 0; });

    // 效度
    var validity = validityCheck({ unanswered: unanswered, scalesMap: scalesMap, rin: rin }, gender);

    // 编码
    var code = codeType(clinical);

    // KB/LW 命中汇总
    var kbHits = kb.filter(function (s) { return s.hitItems.length > 0; });
    var lwHits = lw.filter(function (s) { return s.hitItems.length > 0; });

    // 解读：临床量表高低分
    var clinicalInterp = [];
    if (INTERP.clinical_interp) {
      clinical.forEach(function (s) {
        var ci = INTERP.clinical_interp[s.code];
        if (ci) {
          var txt = null;
          if (s.t !== null) {
            if (s.t >= 60) txt = ci.high;
            else if (s.t < 40) txt = ci.low;
          }
          if (txt) clinicalInterp.push({ abbr: s.baseAbbr, code: s.code, zh: ci.zh, t: s.t, text: txt });
        }
      });
    }
    // 内容量表解读
    var contentInterp = [];
    if (INTERP.content_interp) {
      content.forEach(function (s) {
        var ci = INTERP.content_interp[s.baseAbbr];
        if (ci && s.t !== null && s.t >= 60) {
          contentInterp.push({ abbr: s.baseAbbr, zh: zhName(s.baseAbbr), t: s.t, text: ci.high });
        }
      });
    }

    return {
      meta: {
        gender: gender,
        totalQuestions: DATA.questions.length,
        answeredCount: answeredCount,
        unanswered: unanswered,
        scaleCount: scales.length
      },
      validity: validity,
      code: code,
      clinical: clinical,
      content: content,
      additional: additional,
      rc: rc,
      psy5: psy5,
      kb: kb,
      lw: lw,
      kbHits: kbHits,
      lwHits: lwHits,
      clinicalInterp: clinicalInterp,
      contentInterp: contentInterp,
      rin: rin,
      allScales: scales
    };
  }

  function loadQuestions() {
    if (!DATA) return [];
    return DATA.questions;
  }

  return {
    compute: compute,
    loadQuestions: loadQuestions,
    getInterp: function () { return INTERP; }
  };
})();
