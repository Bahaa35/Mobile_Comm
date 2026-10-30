/* =========================================================
   Mobile Comms Midterm — app logic
   Hash routes (plain names only):
     home · learn · lesson-<id> · formulas · practice · exams
     quiz · results · builder · edit-<id> · take-<payload>
   ========================================================= */
(function () {
  "use strict";

  /* ---------------- helpers ---------------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const fmtTime = (s) => { s = Math.max(0, Math.round(s)); const m = Math.floor(s / 60), ss = s % 60; return (m >= 60 ? Math.floor(m / 60) + ":" + String(m % 60).padStart(2, "0") : m) + ":" + String(ss).padStart(2, "0"); };
  const fmtNum = (x) => { if (typeof x !== "number") return String(x); const a = Math.abs(x); if (a !== 0 && (a < 1e-3 || a >= 1e7)) return x.toExponential(3); return String(Math.round(x * 1e4) / 1e4); };

  const store = {
    get(k, d) { try { const v = localStorage.getItem("mcm." + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("mcm." + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
    del(k) { try { localStorage.removeItem("mcm." + k); } catch (e) { /* ignore */ } }
  };

  const ICON = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5Z"/><path d="M12 6.5v13"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
    hammer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M17.5 14v7M14 17.5h7"/></svg>',
    sigma: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M18 5H6l6 7-6 7h12"/></svg>',
    hex: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 2.5 20.2 7.2v9.6L12 21.5l-8.2-4.7V7.2Z"/><circle cx="12" cy="12" r="2.2" fill="currentColor"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 12h12"/></svg>',
    chev: '<svg class="chev" viewBox="0 0 10 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 2 6 6-6 6"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"/></svg>',
    auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17A8.5 8.5 0 0 0 12 3.5Z" fill="currentColor"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 15 6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M8 7l4-4 4 4M5 12v7.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V12"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.4-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5Z"/></svg>',
    restart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 12a8.5 8.5 0 1 0 2.5-6L3.5 8.5"/><path d="M3.5 3.5v5h5"/></svg>'
  };

  const LEC = {
    L1: { name: "Lecture 1", short: "Introduction & GSM" },
    L2: { name: "Lecture 2", short: "Cellular concept" },
    SIR: { name: "SIR notes", short: "Interference & SIR" },
    L3: { name: "Lecture 3", short: "Assignment & handoff" },
    Sheets: { name: "Sheets", short: "Solved sheets" }
  };
  const LEC_ORDER = ["L1", "L2", "SIR", "L3"];
  const TYPE_NAME = { mcq: "Multiple choice", multi: "Select all", tf: "True / False", num: "Numeric", text: "Short answer" };
  const DIFF_NAME = { 1: "Easy", 2: "Medium", 3: "Hard" };
  const BANK = window.QUESTION_BANK;
  const BANK_BY_ID = Object.fromEntries(BANK.map((q) => [q.id, q]));
  const LESSONS = window.LESSONS;

  const LESSON_FILTER = {
    basics: { lec: "L1", topics: ["Base station", "Uplink & downlink", "Waves & frequency", "UE–BTS steps"] },
    modes: { lec: "L1", topics: ["Transmission modes", "Generations"] },
    gsm: { lec: "L1", topics: ["GSM"] },
    cellular: { lec: "L2", topics: ["Cellular concept", "Cell shapes", "Excitation"] },
    reuse: { lec: "L2", topics: ["Clusters", "Reuse distance", "Capacity"] },
    sir: { lec: "SIR", topics: null },
    assignment: { lec: "L3", topics: ["Channel assignment"] },
    handoff: { lec: "L3", topics: ["Handoff", "Handoff types", "Handoff margin"] },
    sheet1: { ids: ["l2-019", "l2-016", "l2-018", "l2-032", "l2-033", "l2-035", "l2-037", "l2-038", "l2-039", "l2-040", "l2-041", "l2-042", "l2-043", "l2-044", "l2-045"] },
    sheet2: { ids: ["sir-029", "sir-030", "sir-031", "sir-032", "sir-033", "sir-034", "sir-035", "sir-036", "sir-040", "sir-041", "sir-042", "sir-043", "sir-044", "sir-045", "l3-034", "l3-035", "l3-036", "l3-037"] }
  };

  /* ---------------- built-in quiz templates ---------------- */
  const MIDTERM_A = [
    "l1-002", "l1-010", "l1-012", "l1-016", "l1-020", "l1-027", "l1-032", "l1-034", "l1-043", "l1-050", "l1-055", "l1-060", "l1-062",
    "l2-007", "l2-012", "l2-016", "l2-018", "l2-019", "l2-025", "l2-030", "l2-036", "l2-037", "l2-039", "l2-045",
    "sir-001", "sir-004", "sir-011", "sir-020", "sir-023", "sir-031", "sir-032", "sir-035", "sir-040", "sir-041",
    "l3-002", "l3-004", "l3-008", "l3-013", "l3-020", "l3-029", "l3-032", "l3-036"
  ];
  const SHEET_DRILL = LESSON_FILTER.sheet1.ids.concat(LESSON_FILTER.sheet2.ids);

  function balancedPaper() {
    const pickN = (pool, n) => shuffle(pool).slice(0, n);
    const out = [];
    const plan = { L1: [8, 1], L2: [6, 3], SIR: [5, 4], L3: [6, 2] }; // [concept, numeric]
    for (const lec of LEC_ORDER) {
      const concept = BANK.filter((q) => q.lec === lec && q.type !== "num");
      const numeric = BANK.filter((q) => q.lec === lec && q.type === "num");
      out.push(...pickN(concept, plan[lec][0]), ...pickN(numeric, plan[lec][1]));
    }
    const gens = shuffle(window.GENERATORS).slice(0, 4).map((g) => window.makeGenerated(g)).filter(Boolean);
    return out.concat(gens);
  }

  const TEMPLATES = [
    { id: "midterm-a", title: "Midterm Practice A", badge: "Full paper",
      desc: "A fixed 42-question paper that covers every lecture and both sheets: concepts, select-all, true/false and calculations.",
      timeLimit: 90, mode: "exam", build: () => MIDTERM_A.map((id) => BANK_BY_ID[id]) },
    { id: "midterm-b", title: "Midterm Practice B", badge: "New every time",
      desc: "A balanced random paper: 25 concept questions, 10 bank problems and 4 freshly generated calculations.",
      timeLimit: 75, mode: "exam", shuffleQ: true, build: balancedPaper },
    { id: "sheets", title: "Sheets 1 & 2 drill", badge: "Problems",
      desc: "Every sheet problem, split into steps, with instant feedback and the full worked answer after each one.",
      timeLimit: 0, mode: "practice", build: () => SHEET_DRILL.map((id) => BANK_BY_ID[id]) },
    { id: "sprint", title: "10-minute sprint", badge: "Quick",
      desc: "15 rapid concept questions from all lectures against the clock.",
      timeLimit: 10, mode: "exam", build: () => shuffle(BANK.filter((q) => q.type === "mcq" || q.type === "tf")).slice(0, 15) },
    { id: "calc", title: "Calculation workout", badge: "Generated",
      desc: "12 numeric problems with new values every attempt: capacity, reuse distance, SIR, path loss and handoff margin.",
      timeLimit: 0, mode: "practice", build: () => { const out = []; let gs = shuffle(window.GENERATORS); while (out.length < 12) { if (!gs.length) gs = shuffle(window.GENERATORS); const q = window.makeGenerated(gs.pop()); if (q) out.push(q); } return out; } }
  ];

  /* ---------------- theme ---------------- */
  function applyTheme(t) {
    if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");
    const b = $("#themeBtn");
    if (b) { b.innerHTML = t === "dark" ? ICON.moon : t === "light" ? ICON.sun : ICON.auto; b.setAttribute("aria-label", "Theme: " + (t || "system")); b.title = "Theme: " + (t || "system"); }
  }
  let theme = store.get("theme", "");
  applyTheme(theme);

  /* ---------------- toast & dialogs ---------------- */
  let toastTimer;
  function toast(msg) {
    let t = $(".toast"); if (t) t.remove();
    t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
    document.body.appendChild(t); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.remove(), 2200);
  }
  function openSheet(html, opts = {}) {
    closeSheet();
    const s = document.createElement("div"); s.className = "scrim"; s.id = "scrim";
    s.innerHTML = `<div class="sheet ${opts.cls || ""}" role="dialog" aria-modal="true">${html}</div>`;
    s.addEventListener("click", (e) => { if (e.target === s && !opts.modal) closeSheet(); });
    document.body.appendChild(s);
    const f = s.querySelector("[autofocus], .btn, input, button"); if (f) f.focus({ preventScroll: true });
    return s.firstElementChild;
  }
  function closeSheet() { const s = $("#scrim"); if (s) s.remove(); }
  function confirmBox(title, msg, okLabel, onOk, danger) {
    const el = openSheet(`<div class="title3">${esc(title)}</div><p class="muted">${esc(msg)}</p>
      <div class="row"><button class="btn gray" data-x="no">Cancel</button><button class="btn ${danger ? "danger" : ""}" data-x="yes">${esc(okLabel)}</button></div>`, { cls: "alert" });
    el.querySelector('[data-x="no"]').onclick = closeSheet;
    el.querySelector('[data-x="yes"]').onclick = () => { closeSheet(); onOk(); };
  }
  async function copyText(text, msg) {
    try { await navigator.clipboard.writeText(text); toast(msg || "Copied"); return true; }
    catch (e) { toast("Select the text and copy it manually"); return false; }
  }
  function download(name, text) {
    try {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
      a.download = name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    } catch (e) { toast("Download is blocked here. Use Copy instead."); }
  }

  /* ---------------- grading ---------------- */
  function parseNum(str) {
    if (str == null) return NaN;
    const s = String(str).trim().replace(/[−–—]/g, "-").replace(/,/g, "").replace(/\s+/g, "");
    const m = s.match(/^([-+]?(?:\d+\.?\d*|\.\d+))(?:e([-+]?\d+))?(?:[x×*]10\^?\(?([-+]?\d+)\)?)?/i);
    if (!m) return NaN;
    return parseFloat(m[1]) * Math.pow(10, +(m[2] || 0)) * Math.pow(10, +(m[3] || 0));
  }
  const normText = (s) => String(s || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  function numOk(q, x) {
    const a = Number(q.answer);
    if (!isFinite(x)) return false;
    if (q.abs != null && q.abs !== "") return Math.abs(x - a) <= Number(q.abs) + 1e-9 * Math.max(1, Math.abs(a));
    const tol = q.tol != null && q.tol !== "" ? Number(q.tol) : 0.02;
    if (a === 0) return Math.abs(x) <= 1e-9;
    return Math.abs(x - a) <= tol * Math.abs(a) + 1e-12;
  }
  function isBlank(q, resp) {
    return resp == null || resp === "" || (Array.isArray(resp) && resp.length === 0);
  }
  function grade(q, resp) {
    if (isBlank(q, resp)) return { score: 0, status: "skip" };
    switch (q.type) {
      case "mcq": return resp === q.answer ? { score: 1, status: "ok" } : { score: 0, status: "bad" };
      case "tf": return resp === q.answer ? { score: 1, status: "ok" } : { score: 0, status: "bad" };
      case "multi": {
        const ans = new Set(q.answer); let good = 0, wrong = 0;
        resp.forEach((i) => (ans.has(i) ? good++ : wrong++));
        const s = Math.max(0, (good - wrong) / ans.size);
        if (s === 1 && wrong === 0) return { score: 1, status: "ok" };
        return s > 0 ? { score: s, status: "part" } : { score: 0, status: "bad" };
      }
      case "num": return numOk(q, parseNum(resp)) ? { score: 1, status: "ok" } : { score: 0, status: "bad" };
      case "text": {
        const r = normText(resp); const ok = (q.answer || []).some((a) => normText(a) === r);
        return ok ? { score: 1, status: "ok" } : { score: 0, status: "bad" };
      }
    }
    return { score: 0, status: "bad" };
  }
  function correctAnswerText(q) {
    switch (q.type) {
      case "mcq": return q.options[q.answer];
      case "multi": return q.answer.map((i) => q.options[i]).join(" · ");
      case "tf": return q.answer ? "True" : "False";
      case "num": {
        let t = fmtNum(Number(q.answer)) + (q.unit ? " " + q.unit : "");
        if (q.abs != null && q.abs !== "" && Number(q.abs) > 0) t += `  (accepted ± ${fmtNum(Number(q.abs))})`;
        else if (q.abs == null || q.abs === "") t += `  (accepted ± ${Math.round((q.tol != null && q.tol !== "" ? Number(q.tol) : 0.02) * 1000) / 10}%)`;
        return t;
      }
      case "text": return (q.answer || []).join(" / ");
    }
    return "";
  }
  function responseText(q, resp) {
    if (isBlank(q, resp)) return "No answer";
    switch (q.type) {
      case "mcq": return q.options[resp];
      case "multi": return resp.slice().sort((a, b) => a - b).map((i) => q.options[i]).join(" · ");
      case "tf": return resp ? "True" : "False";
      default: return String(resp) + (q.type === "num" && q.unit && !/[a-z]/i.test(String(resp)) ? " " + q.unit : "");
    }
  }

  /* ---------------- quiz run state ---------------- */
  let RUN = store.get("run", null);
  if (RUN && RUN.submitted) RUN = null;
  let LAST = store.get("last", null);
  let timerInt = null;

  function startQuiz(cfg) {
    const qs = cfg.questions.filter(Boolean).map((q) => clone(q));
    if (!qs.length) { toast("No questions match. Try widening the filters."); return; }
    const order = cfg.shuffleQ ? shuffle(qs.map((_, i) => i)) : qs.map((_, i) => i);
    const views = qs.map((q) => {
      if ((q.type === "mcq" || q.type === "multi") && !q.fixed && cfg.shuffleO !== false) return shuffle(q.options.map((_, i) => i));
      if (q.type === "mcq" || q.type === "multi") return q.options.map((_, i) => i);
      return null;
    });
    RUN = {
      id: uid(), title: cfg.title, source: cfg.source || "", mode: cfg.mode || "exam",
      questions: qs, order, views, resp: {}, checked: {}, flags: {}, cur: 0,
      startedAt: Date.now(), limit: cfg.timeLimit ? cfg.timeLimit * 60 : 0, submitted: false, retryOf: cfg.retryOf || null
    };
    saveRun();
    go("quiz");
  }
  function saveRun() { store.set("run", RUN); }
  function curQ() { return RUN.questions[RUN.order[RUN.cur]]; }
  function curIdx() { return RUN.order[RUN.cur]; }
  function remaining() { return RUN.limit ? RUN.limit - (Date.now() - RUN.startedAt) / 1000 : Infinity; }

  function submitRun() {
    if (!RUN) return;
    clearInterval(timerInt);
    const items = RUN.order.map((qi) => {
      const q = RUN.questions[qi], resp = RUN.resp[qi], g = grade(q, resp);
      return { q, resp, g, earned: g.score * (q.pts || 1) };
    });
    const total = items.reduce((a, b) => a + (b.q.pts || 1), 0);
    const earned = items.reduce((a, b) => a + b.earned, 0);
    const used = Math.round((Date.now() - RUN.startedAt) / 1000);
    LAST = { title: RUN.title, source: RUN.source, mode: RUN.mode, items, total, earned, used, limit: RUN.limit, at: Date.now() };
    store.set("last", LAST);
    const hist = store.get("history", []);
    hist.unshift({ title: RUN.title, source: RUN.source, pct: total ? Math.round((earned / total) * 1000) / 10 : 0, earned: Math.round(earned * 100) / 100, total, n: items.length, used, at: Date.now() });
    store.set("history", hist.slice(0, 30));
    RUN = null; store.del("run");
    go("results");
  }

  /* ---------------- router ---------------- */
  const view = () => $("#view");
  function go(name) { if (location.hash.slice(1) === name) route(); else location.hash = name; }
  function setActiveNav(name) {
    const map = { home: "home", learn: "learn", lesson: "learn", formulas: "learn", practice: "practice", quiz: "practice", results: "practice", exams: "exams", builder: "builder", edit: "builder", take: "exams" };
    const key = map[name] || "home";
    $$("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === key));
  }
  function route() {
    clearInterval(timerInt);
    closeSheet();
    const v = view(); v.oninput = v.onchange = v.onclick = null;
    const h = decodeURIComponent(location.hash.slice(1) || "home");
    const [name, ...rest] = h.split("-");
    const arg = rest.join("-");
    setActiveNav(name);
    window.scrollTo(0, 0);
    switch (name) {
      case "learn": return renderLearn();
      case "lesson": return renderLesson(arg);
      case "formulas": return renderFormulas();
      case "practice": return renderPractice();
      case "exams": return renderExams();
      case "quiz": return RUN ? renderQuiz() : go("practice");
      case "results": return LAST ? renderResults() : go("exams");
      case "builder": return renderBuilder();
      case "edit": return renderEditor(arg);
      case "take": return renderTake(location.hash.slice(6));
      default: return renderHome();
    }
  }

  /* ---------------- shared bits ---------------- */
  const tag = (lec, label) => `<span class="tag tag-${esc(lec)}">${esc(label || (LEC[lec] ? LEC[lec].name : lec))}</span>`;
  const done = () => store.get("done", {});

  function heroGraphic() {
    // a 7-cell reuse picture drawn from the same engine as the explorer
    return hexSVG(2, 1, { compact: true });
  }

  /* ================= HOME ================= */
  function renderHome() {
    const d = done(); const nDone = LESSONS.filter((l) => d[l.id]).length;
    const hist = store.get("history", []);
    const resume = RUN ? `<div class="card" style="margin-bottom:24px;background:color-mix(in srgb,var(--blue) 9%,var(--card))">
        <div class="spread"><div><div class="title3">Continue “${esc(RUN.title)}”</div>
        <div class="muted small">Question ${RUN.cur + 1} of ${RUN.questions.length} · ${Object.keys(RUN.resp).length} answered</div></div>
        <div class="row"><button class="btn sm gray" id="discardRun">Discard</button><a class="btn sm" href="#quiz">Resume</a></div></div></div>` : "";
    const nGen = window.GENERATORS.length;
    view().innerHTML = `
      ${resume}
      <section class="hero">
        <div class="stack">
          <div class="eyebrow">Mobile Communications · Midterm</div>
          <h1 class="large-title">Learn it once. Prove it on the practice paper.</h1>
          <p class="lede">Every topic from Lectures 1–3, the SIR notes and Sheets 1–2, taught from zero, then tested with ${BANK.length} checked questions, ${nGen} problem generators and automatic marking.</p>
          <div class="row" style="margin-top:6px">
            <a class="btn lg" href="#learn">${ICON.book} Start learning</a>
            <a class="btn lg tinted" href="#exams">Take a midterm paper</a>
          </div>
        </div>
        <div class="hero-visual" aria-hidden="true">${heroGraphic()}
          <div class="legend" style="justify-content:center"><span><i style="background:var(--blue)"></i>Your cell (A)</span><span><i style="background:var(--orange)"></i>Co-channel cells, N = 7</span></div>
        </div>
      </section>

      <section class="grid grid-3" style="margin-bottom:40px">
        ${tile("#learn", "bg-indigo", ICON.book, "Learn", `${LESSONS.length} lessons with diagrams, worked examples and solved sheets. ${nDone ? nDone + " of " + LESSONS.length + " done." : "Written for someone who missed every lecture."}`, "Open lessons")}
        ${tile("#practice", "bg-blue", ICON.bolt, "Practice", "Pick lectures, question types and difficulty. Get instant feedback or mark it like an exam.", "Build a practice set")}
        ${tile("#exams", "bg-orange", ICON.doc, "Midterm papers", "Timed full papers, a sheet drill, a sprint and a calculation workout with fresh numbers.", "See papers")}
        ${tile("#builder", "bg-green", ICON.hammer, "Quiz builder", "Make your own quiz template, pull questions from the bank, then share it with a link.", "Create a quiz")}
        ${tile("#formulas", "bg-teal", ICON.sigma, "Formulas & tools", "One-page formula sheet, cluster/SIR designer, channel calculator and the reuse explorer.", "Open formula sheet")}
        ${tile("#lesson-sheet2", "bg-pink", ICON.check, "Solved sheets", "Sheets 1 and 2 worked step by step, with the small slips in the model answers corrected.", "Read solutions")}
      </section>

      <section class="grid grid-2" style="align-items:start">
        <div>
          <div class="section-head"><h2 class="title2">What the midterm covers</h2></div>
          <div class="list">
            ${LEC_ORDER.map((lec) => {
              const ls = LESSONS.filter((l) => l.lec === lec); const n = BANK.filter((q) => q.lec === lec).length;
              return `<a class="list-row" href="#lesson-${ls[0].id}">${tag(lec)}<div class="grow"><div class="title">${esc(LEC[lec].short)}</div>
                <div class="sub">${ls.map((l) => esc(l.title)).join(" · ")}</div></div><span class="small tnum">${n} Q</span>${ICON.chev}</a>`;
            }).join("")}
          </div>
        </div>
        <div>
          <div class="section-head"><h2 class="title2">Recent attempts</h2>${hist.length ? '<a href="#exams" class="small">All papers</a>' : ""}</div>
          ${hist.length ? `<div class="list">${hist.slice(0, 5).map((h) => `<div class="list-row"><div class="grow"><div class="title">${esc(h.title)}</div>
              <div class="sub">${new Date(h.at).toLocaleDateString(undefined, { month: "short", day: "numeric" })} · ${h.n} questions · ${fmtTime(h.used)}</div></div>
              <div class="title3 tnum" style="color:${pctColor(h.pct)}">${h.pct}%</div></div>`).join("")}</div>`
            : `<div class="card flat empty"><div class="title3">No attempts yet</div><p>Your scores will appear here after your first quiz.</p></div>`}
        </div>
      </section>`;
    const dr = $("#discardRun");
    if (dr) dr.onclick = () => confirmBox("Discard this quiz?", "Your answers so far will be lost.", "Discard", () => { RUN = null; store.del("run"); renderHome(); }, true);
  }
  function tile(href, bg, icon, title, text, go) {
    return `<a class="card tile" href="${href}"><div class="tile-icon ${bg}">${icon}</div><h3>${title}</h3><p>${text}</p><span class="go">${go} ›</span></a>`;
  }
  const pctColor = (p) => (p >= 75 ? "var(--green)" : p >= 50 ? "var(--orange)" : "var(--red)");

  /* ================= LEARN ================= */
  function renderLearn() {
    const d = done();
    const groups = ["L1", "L2", "SIR", "L3", "Sheets"];
    view().innerHTML = `
      <div class="stack" style="margin-bottom:28px">
        <div class="eyebrow">Learn</div>
        <h1 class="large-title">Lessons</h1>
        <p class="lede">Read in order if you are starting from zero. Each lesson ends with key points and a short practice set.</p>
      </div>
      <div class="stack-lg">
        ${groups.map((g) => {
          const ls = LESSONS.filter((l) => l.lec === g);
          return `<section><div class="list-header">${esc(LEC[g].name)} · ${esc(LEC[g].short)}</div><div class="list">
            ${ls.map((l) => `<a class="list-row" href="#lesson-${l.id}">
              <span class="check-dot ${d[l.id] ? "done" : ""}">${d[l.id] ? ICON.check : ""}</span>
              <div class="grow"><div class="title">${esc(l.title)}</div><div class="sub">${esc(l.subtitle)}</div></div>
              <span class="small tnum">${l.minutes} min</span>${ICON.chev}</a>`).join("")}
          </div></section>`;
        }).join("")}
        <section><div class="list-header">Reference</div><div class="list">
          <a class="list-row" href="#formulas"><span class="tile-icon bg-teal" style="width:30px;height:30px;border-radius:8px">${ICON.sigma}</span>
          <div class="grow"><div class="title">Formula sheet and calculators</div><div class="sub">Everything you need to memorize on one page</div></div>${ICON.chev}</a>
        </div></section>
      </div>`;
  }

  function renderLesson(id) {
    const i = LESSONS.findIndex((l) => l.id === id);
    if (i < 0) return go("learn");
    const L = LESSONS[i], prev = LESSONS[i - 1], next = LESSONS[i + 1];
    const isDone = !!done()[L.id];
    view().innerHTML = `
      <div class="row" style="margin-bottom:18px"><a href="#learn" class="btn plain sm">${ICON.left} Lessons</a></div>
      <div class="lesson-layout">
        <nav class="toc" aria-label="In this lesson">
          <div class="list-header" style="padding-left:10px">In this lesson</div>
          ${L.sections.map((s, k) => `<button type="button" data-sec="${k}">${esc(s.h)}</button>`).join("")}
          <button type="button" data-sec="kp">Key points</button>
        </nav>
        <article class="prose">
          <div class="row" style="margin-bottom:10px">${tag(L.lec)}<span class="small">${L.minutes} min read</span></div>
          <h1 class="large-title">${esc(L.title)}</h1>
          <p class="lede" style="margin-top:10px">${esc(L.subtitle)}</p>
          ${L.sections.map((s, k) => `<section id="sec-${k}"><h2>${esc(s.h)}</h2>${s.html}</section>`).join("")}
          <section id="sec-kp"><h2>Key points</h2><div class="keypoints"><div class="eyebrow">Remember for the exam</div><ul>${L.keyPoints.map((k) => `<li>${esc(k)}</li>`).join("")}</ul></div></section>
          <div class="card" style="margin-top:28px">
            <div class="spread"><div><div class="title3">Test yourself</div><div class="muted small">Practice questions from this lesson with instant feedback.</div></div>
            <div class="row"><button class="btn gray sm" id="markDone">${isDone ? ICON.check + " Done" : "Mark as done"}</button><button class="btn sm" id="practiceLesson">${ICON.bolt} Practice</button></div></div>
          </div>
          <div class="spread" style="margin-top:20px">
            ${prev ? `<a class="btn plain" href="#lesson-${prev.id}">${ICON.left} ${esc(prev.title)}</a>` : "<span></span>"}
            ${next ? `<a class="btn plain" href="#lesson-${next.id}">${esc(next.title)} ${ICON.right}</a>` : `<a class="btn plain" href="#exams">Midterm papers ${ICON.right}</a>`}
          </div>
        </article>
      </div>`;
    $$(".toc button").forEach((a) => (a.onclick = () => { const el = $("#sec-" + a.dataset.sec); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }));
    $("#markDone").onclick = () => { const d = done(); d[L.id] = !d[L.id]; store.set("done", d); toast(d[L.id] ? "Marked as done" : "Marked as not done"); renderLesson(id); };
    $("#practiceLesson").onclick = () => {
      const f = LESSON_FILTER[L.id];
      let qs = f.ids ? f.ids.map((x) => BANK_BY_ID[x]) : BANK.filter((q) => q.lec === f.lec && (!f.topics || f.topics.includes(q.topic)));
      if (!f.ids) qs = shuffle(qs).slice(0, 12);
      startQuiz({ title: "Practice: " + L.title, source: "lesson-" + L.id, questions: qs, mode: "practice", shuffleQ: !f.ids });
    };
    mountWidgets(view());
  }

  /* ================= HEX EXPLORER ================= */
  function hexSVG(i, j, opt = {}) {
    const s = 20, r3 = Math.sqrt(3);
    const N = i * i + i * j + j * j;
    const ang = Math.PI / 6;
    const u = (t) => [r3 * s * Math.cos(t), r3 * s * Math.sin(t)];
    const a1 = u(ang), a2 = u(ang + Math.PI / 3);
    const v1 = [i * a1[0] + j * a2[0], i * a1[1] + j * a2[1]];
    const rot = (v, k) => { const c = Math.cos(k * Math.PI / 3), sn = Math.sin(k * Math.PI / 3); return [v[0] * c - v[1] * sn, v[0] * sn + v[1] * c]; };
    const v2 = rot(v1, 1);
    const det = v1[0] * v2[1] - v1[1] * v2[0];
    const D = Math.hypot(v1[0], v1[1]);
    const viewR = opt.compact ? Math.max(D * 1.18, s * 4.6) : Math.max(D * 2.15, s * 5);
    const cells = [];
    const K = Math.ceil(viewR / (1.5 * s)) + 2;
    for (let q = -K; q <= K; q++) for (let rr = -K; rr <= K; rr++) {
      const x = 1.5 * s * q, y = r3 * s * (rr + q / 2);
      if (Math.hypot(x, y) > viewR) continue;
      cells.push([x, y]);
    }
    const classes = {}; let nextLabel = 0;
    const lab = (k) => (N <= 26 ? String.fromCharCode(65 + k) : String(k + 1));
    cells.sort((p, q2) => Math.hypot(p[0], p[1]) - Math.hypot(q2[0], q2[1]));
    const out = cells.map(([x, y]) => {
      let cls = "", label = "";
      if (det !== 0) {
        const a = (x * v2[1] - y * v2[0]) / det, b = (v1[0] * y - v1[1] * x) / det;
        const fa = ((a % 1) + 1) % 1, fb = ((b % 1) + 1) % 1;
        const key = (Math.round(fa * 1000) % 1000) + "," + (Math.round(fb * 1000) % 1000);
        if (!(key in classes)) classes[key] = nextLabel++;
        label = lab(classes[key]);
        const onLattice = classes[key] === 0;
        const dist = Math.hypot(x, y);
        if (dist < 1) cls = "ref";
        else if (onLattice) cls = Math.abs(dist - D) < 1 ? "co1" : "co2";
      }
      const pts = [0, 1, 2, 3, 4, 5].map((k) => { const t = (Math.PI / 3) * k; return (x + s * Math.cos(t)).toFixed(1) + "," + (-y + s * Math.sin(t)).toFixed(1); }).join(" ");
      return `<polygon class="hx ${cls}" points="${pts}"/>${N <= 27 && !opt.compact || (opt.compact && N <= 7) ? `<text class="hx-label" x="${x.toFixed(1)}" y="${(-y).toFixed(1)}" ${cls === "ref" ? 'style="fill:#fff;font-weight:700"' : cls === "co1" ? 'style="font-weight:700;fill:var(--label)"' : ""}>${label}</text>` : ""}`;
    }).join("");
    const p1 = [i * a1[0], i * a1[1]];
    const path = opt.compact ? "" : `<polyline class="hx-path" points="0,0 ${p1[0].toFixed(1)},${(-p1[1]).toFixed(1)} ${v1[0].toFixed(1)},${(-v1[1]).toFixed(1)}" marker-end="url(#hxArrow)"/>`;
    const pad = s * 1.2, vb = viewR + pad;
    return `<svg viewBox="${-vb} ${-vb} ${2 * vb} ${2 * vb}" role="img" aria-label="Hexagonal reuse pattern for i = ${i}, j = ${j}, N = ${N}">
      <defs><marker id="hxArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" class="d-ink-fill"/></marker></defs>
      ${out}${path}</svg>`;
  }
  function mountHex(el, i0 = 2, j0 = 1) {
    let i = i0, j = j0;
    el.innerHTML = `<div class="hex-tool">
      <div class="controls">
        <div class="row"><span class="field-label">i</span><div class="stepper"><button data-h="i-" aria-label="Decrease i">−</button><output data-o="i">${i}</output><button data-h="i+" aria-label="Increase i">+</button></div></div>
        <div class="row"><span class="field-label">j</span><div class="stepper"><button data-h="j-" aria-label="Decrease j">−</button><output data-o="j">${j}</output><button data-h="j+" aria-label="Increase j">+</button></div></div>
        <div class="readout" data-o="read"></div>
      </div>
      <div class="hex-svg-wrap" data-o="svg"></div>
      <div class="legend"><span><i style="background:var(--blue)"></i>Reference cell A</span><span><i style="background:var(--orange)"></i>First tier (6 at D)</span><span><i style="background:color-mix(in srgb,var(--orange) 35%,var(--card))"></i>Farther co-channel cells</span><span><i style="background:var(--label)"></i>Path: i cells, turn 60° CCW, j cells</span></div>
    </div>`;
    const draw = () => {
      const N = i * i + i * j + j * j, Q = Math.sqrt(3 * N);
      el.querySelector('[data-o="i"]').textContent = i; el.querySelector('[data-o="j"]').textContent = j;
      el.querySelector('[data-o="svg"]').innerHTML = hexSVG(i, j);
      const s4 = Math.pow(Q, 4) / 6, s3 = Math.pow(Q, 3) / 6;
      el.querySelector('[data-o="read"]').innerHTML = `<span>N = <b>${N}</b></span><span>Q = D/R = √${3 * N} = <b>${Q.toFixed(2)}</b></span><span>SIR (n=4) = <b>${(10 * Math.log10(s4)).toFixed(2)} dB</b></span><span>SIR (n=3) = <b>${(10 * Math.log10(s3)).toFixed(2)} dB</b></span>`;
    };
    el.addEventListener("click", (e) => {
      const b = e.target.closest("[data-h]"); if (!b) return;
      const h = b.dataset.h;
      if (h === "i+" && i < 4) i++; if (h === "i-" && i > 0) i--;
      if (h === "j+" && j < 4) j++; if (h === "j-" && j > 0) j--;
      if (i === 0 && j === 0) { if (h === "i-") i = 1; else j = 1; }
      if (i === 0 && j > 0) { i = j; j = 0; } // same pattern, keep i ≥ 1
      draw();
    });
    draw();
  }
  function mountWidgets(root) { $$('[data-widget="hex"]', root).forEach((el) => mountHex(el)); }

  /* ================= FORMULAS & TOOLS ================= */
  function renderFormulas() {
    view().innerHTML = `
      <div class="stack" style="margin-bottom:28px">
        <div class="eyebrow">Reference</div>
        <h1 class="large-title">Formulas & tools</h1>
        <p class="lede">The whole course on one page, plus calculators to check your own working.</p>
      </div>
      <div class="grid grid-2" style="align-items:start;margin-bottom:36px">
        ${window.FORMULAS.map((g) => `<div class="fs-group"><h3>${esc(g.group)}</h3><div class="list">${g.items.map(([k, v]) => `<div class="fs-row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("")}</div></div>`).join("")}
        <div class="fs-group"><h3>Valid cluster sizes</h3><div class="card flat" style="font-family:var(--font-mono)">${window.VALID_N.join(", ")}, …</div></div>
      </div>

      <h2 class="title2" style="margin-bottom:12px">Cluster designer</h2>
      <div class="card" style="margin-bottom:28px">
        <div class="inline-fields">
          <div class="field"><label for="cdS">Required SIR (dB)</label><input class="input" id="cdS" type="number" step="0.1" value="15"></div>
          <div class="field"><label for="cdN">Path-loss exponent n</label><input class="input" id="cdN" type="number" step="0.1" value="4"></div>
          <div class="field"><label for="cdI">Interferers i₀</label><input class="input" id="cdI" type="number" step="1" value="6"></div>
        </div>
        <div class="calc-out" id="cdOut"></div>
      </div>

      <h2 class="title2" style="margin-bottom:12px">Channel calculator</h2>
      <div class="card" style="margin-bottom:28px">
        <div class="inline-fields">
          <div class="field"><label for="ccB">Total bandwidth (MHz)</label><input class="input" id="ccB" type="number" step="0.1" value="33"></div>
          <div class="field"><label for="ccC">Simplex channel (kHz)</label><input class="input" id="ccC" type="number" step="0.5" value="25"></div>
          <div class="field"><label for="ccK">Cluster size N</label><input class="input" id="ccK" type="number" step="1" value="4"></div>
          <div class="field"><label for="ccT">Control bandwidth (MHz)</label><input class="input" id="ccT" type="number" step="0.1" value="1"></div>
          <div class="field"><label for="ccM">Clusters M</label><input class="input" id="ccM" type="number" step="1" value="1"></div>
        </div>
        <div class="calc-out" id="ccOut"></div>
      </div>

      <h2 class="title2" style="margin-bottom:4px">Reuse explorer</h2>
      <p class="muted" style="margin-bottom:6px">Change i and j to see the cluster letters, the path to the nearest co-channel cell, and the resulting SIR.</p>
      <div data-widget="hex"></div>`;
    mountWidgets(view());
    const stat = (k, v) => `<div class="stat"><div class="v">${v}</div><div class="k">${k}</div></div>`;
    const cd = () => {
      const req = parseFloat($("#cdS").value), n = parseFloat($("#cdN").value), i0 = parseFloat($("#cdI").value);
      if (!(n > 0) || !(i0 > 0) || !isFinite(req)) { $("#cdOut").innerHTML = '<p class="muted">Enter a SIR, an exponent above 0 and at least one interferer.</p>'; return; }
      const linv = Math.pow(10, req / 10);
      const nm = Math.pow(i0 * linv, 2 / n) / 3;
      const N = window.VALID_N.concat([31, 36, 37, 39, 43, 48, 49, 52, 57, 61, 63, 64]).find((v) => v >= nm - 1e-9);
      const ach = N ? Math.pow(Math.sqrt(3 * N), n) / i0 : NaN;
      $("#cdOut").innerHTML = stat("SIR (linear)", linv.toFixed(2)) + stat("N minimum", nm.toFixed(2)) + stat("Use N", N || "> 64") +
        stat("Q = √(3N)", N ? Math.sqrt(3 * N).toFixed(2) : "–") + stat("Achieved SIR", N ? (10 * Math.log10(ach)).toFixed(2) + " dB" : "–");
    };
    const cc = () => {
      const B = parseFloat($("#ccB").value), c = parseFloat($("#ccC").value), N = parseFloat($("#ccK").value), T = parseFloat($("#ccT").value) || 0, M = parseFloat($("#ccM").value) || 1;
      if (!(B > 0) || !(c > 0) || !(N > 0)) { $("#ccOut").innerHTML = '<p class="muted">Enter positive values for bandwidth, channel width and N.</p>'; return; }
      const dup = 2 * c, S = Math.floor((B * 1000) / dup + 1e-9), ctl = Math.floor((T * 1000) / dup + 1e-9);
      const valid = window.VALID_N.includes(N) || [31, 36, 37, 39, 43, 48, 49].includes(N);
      $("#ccOut").innerHTML = stat("Duplex channel", dup + " kHz") + stat("Total channels S", S) + stat("Per cell k = S/N", (S / N).toFixed(2)) +
        stat("Control / cell", T ? (ctl / N).toFixed(2) : "–") + stat("Voice / cell", T ? ((S - ctl) / N).toFixed(2) : "–") + stat("Capacity C = M·S", M * S) +
        `<div class="stat" style="grid-column:1/-1;background:${valid ? "color-mix(in srgb,var(--green) 12%,var(--card))" : "color-mix(in srgb,var(--red) 10%,var(--card))"}"><div class="k">${valid ? "N = " + N + " is a valid hexagonal cluster size" : "N = " + N + " is not a valid cluster size (N = i² + ij + j²)"}</div></div>`;
    };
    ["cdS", "cdN", "cdI"].forEach((id) => $("#" + id).addEventListener("input", cd));
    ["ccB", "ccC", "ccK", "ccT", "ccM"].forEach((id) => $("#" + id).addEventListener("input", cc));
    cd(); cc();
  }

  /* ================= PRACTICE SETUP ================= */
  function renderPractice() {
    const P = store.get("practiceCfg", { lecs: LEC_ORDER.slice(), types: ["mcq", "multi", "tf", "num", "text"], count: 20, mode: "practice", timer: 0, diff: 0, gen: true });
    const save = () => store.set("practiceCfg", P);
    const pool = () => BANK.filter((q) => P.lecs.includes(q.lec) && P.types.includes(q.type) && (!P.diff || q.diff === P.diff));
    const genPool = () => (P.gen && P.types.includes("num") || P.gen && P.types.includes("mcq") ? window.GENERATORS.filter((g) => P.lecs.includes(g.lec) && (!P.diff || g.diff === P.diff)) : []);
    const draw = () => {
      const n = pool().length, gp = genPool().length;
      view().innerHTML = `
        <div class="stack" style="margin-bottom:24px">
          <div class="eyebrow">Practice</div><h1 class="large-title">Build a practice set</h1>
          <p class="lede">Choose what to drill. Practice mode shows the answer after every question; exam mode marks everything at the end.</p>
        </div>
        <div class="stack">
          <div class="list">
            <div class="setting col"><div class="lbl">Lectures</div>
              <div class="chips">${LEC_ORDER.map((l) => `<button class="chip ${P.lecs.includes(l) ? "on" : ""}" data-lec="${l}" aria-pressed="${P.lecs.includes(l)}">${esc(LEC[l].name)} <span class="cnt">${BANK.filter((q) => q.lec === l).length}</span></button>`).join("")}</div></div>
            <div class="setting col"><div class="lbl">Question types</div>
              <div class="chips">${Object.keys(TYPE_NAME).map((t) => `<button class="chip ${P.types.includes(t) ? "on" : ""}" data-type="${t}" aria-pressed="${P.types.includes(t)}">${TYPE_NAME[t]}</button>`).join("")}</div></div>
            <div class="setting"><div><div class="lbl">Difficulty</div></div>
              <div class="seg" role="group">${[0, 1, 2, 3].map((d) => `<button class="${P.diff === d ? "on" : ""}" data-diff="${d}">${d ? DIFF_NAME[d] : "All"}</button>`).join("")}</div></div>
            <div class="setting"><div><div class="lbl">Include generated problems</div><div class="desc">Fresh numbers every time, marked exactly</div></div>
              <label class="switch"><input type="checkbox" id="genSw" ${P.gen ? "checked" : ""} aria-label="Include generated problems"><span></span></label></div>
          </div>
          <div class="list">
            <div class="setting"><div class="lbl">Mode</div>
              <div class="seg">${[["practice", "Practice"], ["exam", "Exam"]].map(([k, v]) => `<button class="${P.mode === k ? "on" : ""}" data-mode="${k}">${v}</button>`).join("")}</div></div>
            <div class="setting"><div class="lbl">Number of questions</div>
              <div class="stepper"><button data-cnt="-5" aria-label="Fewer">−</button><output>${P.count}</output><button data-cnt="5" aria-label="More">+</button></div></div>
            <div class="setting"><div class="lbl">Time limit</div>
              <div class="seg">${[0, 10, 20, 30, 60].map((t) => `<button class="${P.timer === t ? "on" : ""}" data-timer="${t}">${t ? t + " min" : "Off"}</button>`).join("")}</div></div>
          </div>
          <div class="spread card flat" style="padding:16px 20px">
            <div><div class="title3 tnum">${n} questions${gp ? " + " + gp + " generators" : ""}</div><div class="muted small">match your choices</div></div>
            <button class="btn lg" id="startPractice" ${n + gp === 0 ? "disabled" : ""}>${ICON.play} Start</button>
          </div>
        </div>`;
      $$("[data-lec]").forEach((b) => (b.onclick = () => { const l = b.dataset.lec; P.lecs = P.lecs.includes(l) ? P.lecs.filter((x) => x !== l) : P.lecs.concat(l); save(); draw(); }));
      $$("[data-type]").forEach((b) => (b.onclick = () => { const t = b.dataset.type; P.types = P.types.includes(t) ? P.types.filter((x) => x !== t) : P.types.concat(t); save(); draw(); }));
      $$("[data-diff]").forEach((b) => (b.onclick = () => { P.diff = +b.dataset.diff; save(); draw(); }));
      $$("[data-mode]").forEach((b) => (b.onclick = () => { P.mode = b.dataset.mode; save(); draw(); }));
      $$("[data-timer]").forEach((b) => (b.onclick = () => { P.timer = +b.dataset.timer; save(); draw(); }));
      $$("[data-cnt]").forEach((b) => (b.onclick = () => { P.count = Math.min(80, Math.max(5, P.count + +b.dataset.cnt)); save(); draw(); }));
      $("#genSw").onchange = (e) => { P.gen = e.target.checked; save(); draw(); };
      $("#startPractice").onclick = () => {
        const bankQs = shuffle(pool());
        const gens = genPool();
        let qs = [];
        const nGen = gens.length ? Math.min(Math.round(P.count * 0.25), P.count) : 0;
        qs = bankQs.slice(0, P.count - nGen);
        let gi = 0, guard = 0;
        while (qs.length < P.count && gens.length && guard++ < 200) {
          const q = window.makeGenerated(gens[gi++ % gens.length]);
          if (q && P.types.includes(q.type)) qs.push(q);
        }
        if (qs.length < P.count) qs = qs.concat(bankQs.slice(qs.length, P.count));
        startQuiz({ title: P.mode === "exam" ? "Custom exam" : "Practice set", source: "practice", questions: shuffle(qs), mode: P.mode, timeLimit: P.timer });
      };
    };
    draw();
  }

  /* ================= EXAMS / TEMPLATES ================= */
  function renderExams() {
    const mine = store.get("myquizzes", []);
    const hist = store.get("history", []);
    const meta = (t, n) => `<div class="meta"><span>${ICON.list} ${n} questions</span><span>${ICON.clock} ${t.timeLimit ? t.timeLimit + " min" : "Untimed"}</span><span>${t.mode === "exam" ? "Marked at the end" : "Instant feedback"}</span></div>`;
    view().innerHTML = `
      <div class="stack" style="margin-bottom:24px">
        <div class="eyebrow">Midterm papers</div><h1 class="large-title">Quiz templates</h1>
        <p class="lede">Ready-made papers built from the course material. Duplicate any of them into the builder to make your own version.</p>
      </div>
      <div class="grid grid-2" style="margin-bottom:36px">
        ${TEMPLATES.map((t) => {
          const n = t.id === "midterm-b" ? 39 : t.id === "sprint" ? 15 : t.id === "calc" ? 12 : t.build().length;
          return `<div class="card tpl"><div class="spread"><h3 class="title3">${esc(t.title)}</h3><span class="tag tag-plain">${esc(t.badge)}</span></div>
            <p class="muted">${esc(t.desc)}</p>${meta(t, n)}
            <div class="acts"><button class="btn" data-start="${t.id}">${ICON.play} Start</button><button class="btn gray" data-dup="${t.id}">${ICON.copy} Duplicate to builder</button></div></div>`;
        }).join("")}
      </div>
      ${mine.length ? `<div class="section-head"><h2 class="title2">My quizzes</h2><a href="#builder" class="small">Open builder</a></div>
        <div class="grid grid-2" style="margin-bottom:36px">${mine.map((m) => `<div class="card tpl"><h3 class="title3">${esc(m.title || "Untitled quiz")}</h3>
          ${m.desc ? `<p class="muted">${esc(m.desc)}</p>` : ""}${meta(m, m.questions.length)}
          <div class="acts"><button class="btn" data-mine="${m.id}" ${m.questions.length ? "" : "disabled"}>${ICON.play} Start</button><a class="btn gray" href="#edit-${m.id}">Edit</a></div></div>`).join("")}</div>` : ""}
      <div class="section-head"><h2 class="title2">History</h2>${hist.length ? '<button class="btn plain sm" id="clearHist">Clear</button>' : ""}</div>
      ${hist.length ? `<div class="list">${hist.map((h) => `<div class="list-row"><div class="grow"><div class="title">${esc(h.title)}</div>
          <div class="sub">${new Date(h.at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} · ${h.earned}/${h.total} pts · ${fmtTime(h.used)}</div></div>
          <div class="title3 tnum" style="color:${pctColor(h.pct)}">${h.pct}%</div></div>`).join("")}</div>`
        : `<div class="card flat empty"><div class="title3">No attempts yet</div><p>Start a paper above. Scores are kept on this device only.</p></div>`}`;
    $$("[data-start]").forEach((b) => (b.onclick = () => { const t = TEMPLATES.find((x) => x.id === b.dataset.start); startQuiz({ title: t.title, source: t.id, questions: t.build(), mode: t.mode, timeLimit: t.timeLimit, shuffleQ: t.shuffleQ }); }));
    $$("[data-dup]").forEach((b) => (b.onclick = () => {
      const t = TEMPLATES.find((x) => x.id === b.dataset.dup);
      const quiz = newQuiz({ title: t.title + " (copy)", desc: t.desc, timeLimit: t.timeLimit, mode: t.mode, questions: t.build().map(toPlainQ) });
      toast("Copied to your builder"); go("edit-" + quiz.id);
    }));
    $$("[data-mine]").forEach((b) => (b.onclick = () => takeMine(mine.find((m) => m.id === b.dataset.mine))));
    const ch = $("#clearHist"); if (ch) ch.onclick = () => confirmBox("Clear history?", "All saved scores on this device will be removed.", "Clear", () => { store.set("history", []); renderExams(); }, true);
  }

  /* ================= QUIZ RUNNER ================= */
  function renderQuiz() {
    const total = RUN.questions.length;
    const q = curQ(), qi = curIdx(), v = RUN.views[qi];
    const resp = RUN.resp[qi];
    const checked = RUN.mode === "practice" && RUN.checked[qi];
    const g = checked ? grade(q, resp) : null;
    const answered = Object.keys(RUN.resp).filter((k) => !isBlank(RUN.questions[k], RUN.resp[k])).length;
    const isLast = RUN.cur === total - 1;

    let body = "";
    if (q.type === "mcq" || q.type === "multi") {
      const multi = q.type === "multi";
      body = `<div class="options" role="${multi ? "group" : "radiogroup"}">${v.map((oi, k) => {
        const sel = multi ? (resp || []).includes(oi) : resp === oi;
        let cls = sel ? "sel" : "";
        if (checked) {
          const right = multi ? q.answer.includes(oi) : q.answer === oi;
          cls = right && sel ? "ok" : !right && sel ? "bad" : right ? "missed" : "";
        }
        return `<button class="opt ${multi ? "multi" : ""} ${cls}" data-opt="${oi}" ${checked ? "disabled" : ""} role="${multi ? "checkbox" : "radio"}" aria-checked="${sel}">
          <span class="key">${checked && cls === "ok" ? ICON.check : checked && cls === "bad" ? ICON.x : String.fromCharCode(65 + k)}</span><span>${esc(q.options[oi])}</span></button>`;
      }).join("")}</div>${multi ? '<div class="hint-line">Select every correct option. Wrong picks cancel right ones.</div>' : ""}`;
    } else if (q.type === "tf") {
      body = `<div class="tf-row" role="radiogroup">${[true, false].map((val) => {
        let cls = resp === val ? "sel" : "";
        if (checked) cls = q.answer === val ? (resp === val ? "ok" : "missed") : resp === val ? "bad" : "";
        return `<button class="opt ${cls}" data-tf="${val}" ${checked ? "disabled" : ""} role="radio" aria-checked="${resp === val}">${val ? "True" : "False"}</button>`;
      }).join("")}</div>`;
    } else if (q.type === "num") {
      body = `<div class="num-row"><input class="input ${checked ? (g.status === "ok" ? "ok" : "bad") : ""}" id="numIn" inputmode="decimal" autocomplete="off" placeholder="Your answer" value="${esc(resp || "")}" ${checked ? "disabled" : ""} aria-label="Numeric answer">
        ${q.unit ? `<span class="unit">${esc(q.unit)}</span>` : ""}</div><div class="hint-line">Type a number. 3.5e-3 and 3.5×10^-3 both work. Rounding to 2–3 significant figures is accepted.</div>`;
    } else if (q.type === "text") {
      body = `<div class="num-row"><input class="input ${checked ? (g.status === "ok" ? "ok" : "bad") : ""}" id="textIn" autocomplete="off" placeholder="Type your answer" value="${esc(resp || "")}" ${checked ? "disabled" : ""} style="max-width:420px" aria-label="Short answer"></div>`;
    }

    const fb = checked ? `<div class="feedback ${g.status === "ok" ? "ok" : g.status === "part" ? "part" : "bad"}" role="status">
        <div class="fb-h">${g.status === "ok" ? "Correct" : g.status === "part" ? "Partly correct" : g.status === "skip" ? "Skipped" : "Not quite"}</div>
        ${g.status !== "ok" ? `<div><b>Answer:</b> ${esc(correctAnswerText(q))}</div>` : ""}
        ${q.explain ? `<div style="margin-top:4px">${esc(q.explain)}</div>` : ""}</div>` : "";

    const timerHTML = RUN.limit ? `<span class="timer" id="timer">${ICON.clock}<span>${fmtTime(remaining())}</span></span>` : "";
    view().innerHTML = `<div class="quiz-shell">
      <div class="quiz-top">
        <div><div class="eyebrow">${RUN.mode === "exam" ? "Exam mode" : "Practice mode"}</div><div class="title3">${esc(RUN.title)}</div></div>
        <div class="row">${timerHTML}<button class="btn gray sm" id="navBtn">${ICON.list} ${answered}/${total}</button><button class="btn sm" id="submitBtn">Finish</button></div>
      </div>
      <div class="progress" aria-hidden="true"><div style="width:${((RUN.cur + 1) / total) * 100}%"></div></div>
      <div class="qcard">
        <div class="qmeta"><span class="qnum">Question ${RUN.cur + 1} of ${total}</span>${tag(q.gen ? "gen" : q.lec && LEC[q.lec] ? q.lec : "plain", q.gen ? "Generated" : q.lec && LEC[q.lec] ? LEC[q.lec].name : "Custom")}
          ${q.topic ? `<span class="tag tag-plain">${esc(q.topic)}</span>` : ""}<span class="tag tag-plain">${esc(TYPE_NAME[q.type])} · ${q.pts || 1} pt${(q.pts || 1) > 1 ? "s" : ""}</span></div>
        ${q.stem ? `<div class="qstem">${esc(q.stem)}</div>` : ""}
        <div class="qtext">${esc(q.q)}</div>
        ${body}${fb}
        <div class="quiz-actions">
          <button class="btn plain" id="prevBtn" ${RUN.cur === 0 ? "disabled" : ""}>${ICON.left} Previous</button>
          <div class="row">
            <button class="btn gray sm ${RUN.flags[qi] ? "flag-on" : ""}" id="flagBtn" aria-pressed="${!!RUN.flags[qi]}">${ICON.flag} ${RUN.flags[qi] ? "Flagged" : "Flag"}</button>
            ${RUN.mode === "practice" && !checked ? `<button class="btn tinted" id="checkBtn">Check</button>` : ""}
            ${isLast ? `<button class="btn" id="endBtn">Finish</button>` : `<button class="btn" id="nextBtn">Next ${ICON.right}</button>`}
          </div>
        </div>
      </div>
      <p class="small" style="text-align:center;margin-top:14px">Keys: A–F or 1–6 choose · ←/→ move · Enter ${RUN.mode === "practice" ? "checks" : "goes next"}</p>
    </div>`;

    // events
    $$("[data-opt]").forEach((b) => (b.onclick = () => {
      const oi = +b.dataset.opt;
      if (q.type === "multi") { const cur = new Set(RUN.resp[qi] || []); cur.has(oi) ? cur.delete(oi) : cur.add(oi); RUN.resp[qi] = Array.from(cur); }
      else RUN.resp[qi] = oi;
      saveRun(); renderQuiz();
    }));
    $$("[data-tf]").forEach((b) => (b.onclick = () => { RUN.resp[qi] = b.dataset.tf === "true"; saveRun(); renderQuiz(); }));
    const ni = $("#numIn") || $("#textIn");
    if (ni) {
      ni.addEventListener("input", () => { RUN.resp[qi] = ni.value; saveRun(); const nb = $("#navBtn"); if (nb) nb.innerHTML = ICON.list + " " + Object.keys(RUN.resp).filter((k) => !isBlank(RUN.questions[k], RUN.resp[k])).length + "/" + total; });
      ni.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); primaryAction(); } });
      if (!checked && window.matchMedia("(hover: hover)").matches) ni.focus();
    }
    $("#prevBtn").onclick = () => move(-1);
    const nx = $("#nextBtn"); if (nx) nx.onclick = () => move(1);
    const eb = $("#endBtn"); if (eb) eb.onclick = askSubmit;
    $("#submitBtn").onclick = askSubmit;
    $("#flagBtn").onclick = () => { RUN.flags[qi] = !RUN.flags[qi]; saveRun(); renderQuiz(); };
    const cb = $("#checkBtn"); if (cb) cb.onclick = () => { RUN.checked[qi] = true; saveRun(); renderQuiz(); };
    $("#navBtn").onclick = openNavigator;
    if (RUN.limit) {
      clearInterval(timerInt);
      timerInt = setInterval(() => {
        const left = remaining(); const t = $("#timer");
        if (!t || !RUN) { clearInterval(timerInt); return; }
        t.querySelector("span").textContent = fmtTime(left); t.classList.toggle("low", left < 60);
        if (left <= 0) { clearInterval(timerInt); toast("Time is up. Your answers were submitted."); submitRun(); }
      }, 1000);
      if (remaining() <= 0) submitRun();
    }
  }
  function primaryAction() {
    const qi = curIdx();
    if (RUN.mode === "practice" && !RUN.checked[qi]) { RUN.checked[qi] = true; saveRun(); renderQuiz(); return; }
    if (RUN.cur < RUN.questions.length - 1) move(1); else askSubmit();
  }
  function move(d) { const n = RUN.cur + d; if (n < 0 || n >= RUN.questions.length) return; RUN.cur = n; saveRun(); renderQuiz(); window.scrollTo({ top: 0 }); }
  function askSubmit() {
    const total = RUN.questions.length;
    const unanswered = RUN.order.filter((qi) => isBlank(RUN.questions[qi], RUN.resp[qi])).length;
    const flagged = Object.values(RUN.flags).filter(Boolean).length;
    const msg = unanswered ? `${unanswered} of ${total} questions are unanswered and will score zero.` : `All ${total} questions answered.`;
    confirmBox("Finish and mark?", msg + (flagged ? ` ${flagged} flagged for review.` : ""), "Finish", submitRun);
  }
  function openNavigator() {
    const el = openSheet(`<div class="sheet-head"><div class="title3">Questions</div><button class="icon-btn" data-x aria-label="Close">${ICON.x}</button></div>
      <div class="navgrid">${RUN.order.map((qi, k) => {
        const q = RUN.questions[qi]; let cls = isBlank(q, RUN.resp[qi]) ? "" : "ans";
        if (RUN.mode === "practice" && RUN.checked[qi]) { const g = grade(q, RUN.resp[qi]); cls = g.status === "ok" ? "r-ok" : g.status === "part" ? "r-part" : "r-bad"; }
        return `<button class="${cls} ${k === RUN.cur ? "cur" : ""} ${RUN.flags[qi] ? "flag" : ""}" data-go="${k}" aria-label="Question ${k + 1}">${k + 1}</button>`;
      }).join("")}</div>
      <div class="legend"><span><i style="background:color-mix(in srgb,var(--blue) 30%,var(--card))"></i>Answered</span><span><i style="background:var(--orange);border-radius:50%"></i>Flagged</span>${RUN.mode === "practice" ? '<span><i style="background:var(--green)"></i>Correct</span><span><i style="background:var(--red)"></i>Wrong</span>' : ""}</div>
      <div class="row" style="margin-top:18px;justify-content:space-between"><button class="btn danger sm" data-quit>Quit without marking</button><button class="btn sm" data-fin>Finish and mark</button></div>`);
    el.querySelector("[data-x]").onclick = closeSheet;
    $$("[data-go]", el).forEach((b) => (b.onclick = () => { RUN.cur = +b.dataset.go; saveRun(); closeSheet(); renderQuiz(); }));
    el.querySelector("[data-fin]").onclick = () => { closeSheet(); askSubmit(); };
    el.querySelector("[data-quit]").onclick = () => { closeSheet(); confirmBox("Quit this quiz?", "Your answers will be discarded and nothing is marked.", "Quit", () => { RUN = null; store.del("run"); go("home"); }, true); };
  }
  document.addEventListener("keydown", (e) => {
    if (!RUN || location.hash.slice(1) !== "quiz" || $("#scrim")) return;
    const tagName = (e.target.tagName || "").toLowerCase();
    if (tagName === "input" || tagName === "textarea") return;
    const q = curQ(), qi = curIdx();
    if (e.key === "ArrowRight") { move(1); return; }
    if (e.key === "ArrowLeft") { move(-1); return; }
    if (e.key === "Enter") { e.preventDefault(); primaryAction(); return; }
    if (RUN.mode === "practice" && RUN.checked[qi]) return;
    let k = -1;
    if (/^[1-9]$/.test(e.key)) k = +e.key - 1; else if (/^[a-f]$/i.test(e.key)) k = e.key.toLowerCase().charCodeAt(0) - 97;
    if (k < 0) return;
    if (q.type === "tf" && k < 2) { RUN.resp[qi] = k === 0; saveRun(); renderQuiz(); }
    else if ((q.type === "mcq" || q.type === "multi") && k < RUN.views[qi].length) {
      const oi = RUN.views[qi][k];
      if (q.type === "multi") { const cur = new Set(RUN.resp[qi] || []); cur.has(oi) ? cur.delete(oi) : cur.add(oi); RUN.resp[qi] = Array.from(cur); }
      else RUN.resp[qi] = oi;
      saveRun(); renderQuiz();
    }
  });

  /* ================= RESULTS ================= */
  function renderResults() {
    const R = LAST;
    const pct = R.total ? Math.round((R.earned / R.total) * 1000) / 10 : 0;
    const counts = { ok: 0, part: 0, bad: 0, skip: 0 };
    R.items.forEach((it) => counts[it.g.status]++);
    const byLec = {};
    R.items.forEach((it) => {
      const k = it.q.gen ? "Generated" : it.q.lec && LEC[it.q.lec] ? LEC[it.q.lec].name : "Custom";
      byLec[k] = byLec[k] || { e: 0, t: 0 }; byLec[k].e += it.earned; byLec[k].t += it.q.pts || 1;
    });
    const C = 2 * Math.PI * 70;
    const verdict = pct >= 85 ? "Excellent. You are ready." : pct >= 70 ? "Good work. Review the misses below." : pct >= 50 ? "Getting there. Revisit the weak lectures." : "Keep going. Read the lessons, then try again.";
    let filter = "all";
    const drawList = () => {
      const items = R.items.map((it, k) => ({ ...it, k })).filter((it) => filter === "all" || (filter === "wrong" ? it.g.status !== "ok" : it.g.status === "ok"));
      $("#reviewList").innerHTML = items.length ? items.map((it) => {
        const st = it.g.status, q = it.q;
        const vIcon = st === "ok" ? ICON.check : st === "part" ? ICON.minus : st === "skip" ? ICON.minus : ICON.x;
        return `<div class="review-item">
          <div class="spread" style="margin-bottom:8px"><span class="qnum">Question ${it.k + 1}</span>
          <span class="verdict ${st}">${vIcon} ${st === "ok" ? "Correct" : st === "part" ? "Partly correct" : st === "skip" ? "Skipped" : "Wrong"} · ${Math.round(it.earned * 100) / 100}/${q.pts || 1}</span></div>
          ${q.stem ? `<div class="qstem">${esc(q.stem)}</div>` : ""}
          <div class="qtext">${esc(q.q)}</div>
          <div class="ans-line"><span class="k">Your answer</span><span>${esc(responseText(q, it.resp))}</span>
          ${st !== "ok" ? `<span class="k">Correct</span><span><b>${esc(correctAnswerText(q))}</b></span>` : ""}</div>
          ${q.explain ? `<div class="feedback ${st === "ok" ? "ok" : st === "part" ? "part" : "bad"}" style="margin-top:12px">${esc(q.explain)}</div>` : ""}
        </div>`;
      }).join("") : `<div class="card flat empty"><div class="title3">Nothing here</div><p>No questions match this filter.</p></div>`;
    };
    view().innerHTML = `<div class="quiz-shell stack-lg">
      <div class="card">
        <div class="result-hero">
          <div class="ring"><svg viewBox="0 0 160 160"><circle class="track" cx="80" cy="80" r="70" fill="none" stroke-width="14"/>
            <circle class="val" cx="80" cy="80" r="70" fill="none" stroke-width="14" stroke-linecap="round" stroke="${pctColor(pct)}" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct / 100)}"/></svg>
            <div class="pct"><div>${pct}%<small>${Math.round(R.earned * 100) / 100} / ${R.total} pts</small></div></div></div>
          <div class="stack" style="gap:6px">
            <div class="eyebrow">${esc(R.title)}</div>
            <h1 class="large-title" style="font-size:30px">${verdict}</h1>
            <div class="stats">
              <div class="stat"><div class="v" style="color:var(--green)">${counts.ok}</div><div class="k">Correct</div></div>
              <div class="stat"><div class="v" style="color:var(--orange)">${counts.part}</div><div class="k">Partial</div></div>
              <div class="stat"><div class="v" style="color:var(--red)">${counts.bad}</div><div class="k">Wrong</div></div>
              <div class="stat"><div class="v">${counts.skip}</div><div class="k">Skipped</div></div>
              <div class="stat"><div class="v">${fmtTime(R.used)}</div><div class="k">Time used</div></div>
            </div>
          </div>
        </div>
        <div class="row" style="margin-top:20px">
          ${counts.ok < R.items.length ? `<button class="btn" id="retryWrong">${ICON.restart} Retry the ${R.items.length - counts.ok} missed</button>` : ""}
          <button class="btn gray" id="retryAll">Retake all</button>
          <a class="btn plain" href="#exams">More papers</a>
        </div>
      </div>
      <div class="card"><div class="title3" style="margin-bottom:14px">Score by section</div><div class="bars">
        ${Object.entries(byLec).map(([k, v]) => { const p = v.t ? Math.round((v.e / v.t) * 100) : 0; return `<div class="bar-row"><span>${esc(k)}</span><div class="bar"><div style="width:${p}%;background:${pctColor(p)}"></div></div><span class="pv">${p}%</span></div>`; }).join("")}
      </div></div>
      <div>
        <div class="spread" style="margin-bottom:14px"><h2 class="title2">Review</h2>
          <div class="seg">${[["all", "All"], ["wrong", "Missed"], ["right", "Correct"]].map(([k, v]) => `<button data-f="${k}" class="${k === "all" ? "on" : ""}">${v}</button>`).join("")}</div></div>
        <div class="stack" id="reviewList"></div>
      </div>
    </div>`;
    drawList();
    $$("[data-f]").forEach((b) => (b.onclick = () => { filter = b.dataset.f; $$("[data-f]").forEach((x) => x.classList.toggle("on", x === b)); drawList(); }));
    const rw = $("#retryWrong");
    if (rw) rw.onclick = () => startQuiz({ title: "Retry: " + R.title.replace(/^Retry: /, ""), source: R.source, questions: R.items.filter((it) => it.g.status !== "ok").map((it) => it.q), mode: "practice" });
    $("#retryAll").onclick = () => {
      const t = TEMPLATES.find((x) => x.id === R.source);
      if (t) startQuiz({ title: t.title, source: t.id, questions: t.build(), mode: t.mode, timeLimit: t.timeLimit, shuffleQ: t.shuffleQ });
      else startQuiz({ title: R.title, source: R.source, questions: R.items.map((it) => it.q), mode: R.mode, timeLimit: R.limit ? R.limit / 60 : 0 });
    };
  }

  /* ================= BUILDER ================= */
  const getMine = () => store.get("myquizzes", []);
  const setMine = (a) => store.set("myquizzes", a);
  function toPlainQ(q) {
    const o = { type: q.type, q: q.q, explain: q.explain || "", pts: q.pts || 1 };
    if (q.stem) o.stem = q.stem;
    if (q.type === "mcq" || q.type === "multi") { o.options = q.options.slice(); o.answer = clone(q.answer); if (q.fixed) o.fixed = true; }
    else if (q.type === "tf") o.answer = q.answer;
    else if (q.type === "num") { o.answer = q.answer; o.unit = q.unit || ""; if (q.abs != null) o.abs = q.abs; else o.tol = q.tol != null ? q.tol : 0.02; }
    else if (q.type === "text") o.answer = (q.answer || []).slice();
    return o;
  }
  function blankQ(type) {
    const b = { type, q: "", explain: "", pts: type === "num" || type === "multi" ? 2 : 1 };
    if (type === "mcq") { b.options = ["", "", "", ""]; b.answer = 0; }
    if (type === "multi") { b.options = ["", "", "", ""]; b.answer = []; }
    if (type === "tf") b.answer = true;
    if (type === "num") { b.answer = ""; b.unit = ""; b.tol = 0.02; }
    if (type === "text") b.answer = [];
    return b;
  }
  function newQuiz(init) {
    const quiz = Object.assign({ id: uid(), title: "Untitled quiz", desc: "", timeLimit: 0, mode: "exam", shuffleQ: false, shuffleO: true, questions: [], updated: Date.now() }, init || {});
    const all = getMine(); all.unshift(quiz); setMine(all); return quiz;
  }
  function validateQuiz(quiz) {
    const issues = [];
    if (!quiz.questions.length) issues.push("The quiz has no questions.");
    quiz.questions.forEach((q, k) => {
      const n = "Question " + (k + 1);
      if (!String(q.q || "").trim()) issues.push(n + " has no question text.");
      if (q.type === "mcq" || q.type === "multi") {
        const filled = (q.options || []).filter((o) => String(o).trim());
        if (filled.length < 2) issues.push(n + " needs at least two options.");
        if (q.type === "mcq" && (q.answer == null || !String(q.options[q.answer] || "").trim())) issues.push(n + " has no correct option marked.");
        if (q.type === "multi" && !(q.answer || []).length) issues.push(n + " has no correct options marked.");
      }
      if (q.type === "num" && !isFinite(parseFloat(q.answer))) issues.push(n + " needs a numeric answer.");
      if (q.type === "text" && !(q.answer || []).filter((a) => String(a).trim()).length) issues.push(n + " needs at least one accepted answer.");
    });
    return issues;
  }
  function cleanForRun(quiz) {
    return quiz.questions.map((q) => {
      const c = clone(q);
      if (c.type === "mcq" || c.type === "multi") {
        const keep = c.options.map((o, i) => [o, i]).filter(([o]) => String(o).trim());
        const map = {}; keep.forEach(([, i], k) => (map[i] = k));
        c.options = keep.map(([o]) => o);
        c.answer = c.type === "mcq" ? map[c.answer] : c.answer.filter((i) => i in map).map((i) => map[i]);
      }
      if (c.type === "num") { c.answer = parseFloat(c.answer); if (c.abs === "" || c.abs == null) delete c.abs; }
      if (c.type === "text") c.answer = c.answer.map((a) => String(a).trim()).filter(Boolean);
      return c;
    });
  }
  function takeMine(quiz, forceMode) {
    const issues = validateQuiz(quiz);
    if (issues.length) { openIssues(issues); return; }
    startQuiz({ title: quiz.title || "Untitled quiz", source: "mine-" + quiz.id, questions: cleanForRun(quiz), mode: forceMode || quiz.mode, timeLimit: +quiz.timeLimit || 0, shuffleQ: quiz.shuffleQ, shuffleO: quiz.shuffleO });
  }
  function openIssues(issues) {
    const el = openSheet(`<div class="sheet-head"><div class="title3">Fix these first</div><button class="icon-btn" data-x aria-label="Close">${ICON.x}</button></div>
      <ul style="margin:0;padding-left:20px">${issues.slice(0, 12).map((i) => `<li>${esc(i)}</li>`).join("")}</ul>${issues.length > 12 ? `<p class="muted small" style="margin-top:8px">and ${issues.length - 12} more</p>` : ""}`);
    el.querySelector("[data-x]").onclick = closeSheet;
  }

  // share encoding
  const b64u = (bytes) => { let s = ""; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
  const unb64u = (str) => { str = str.replace(/-/g, "+").replace(/_/g, "/"); while (str.length % 4) str += "="; const bin = atob(str); const out = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; };
  async function encodeQuiz(quiz) {
    const payload = { t: quiz.title, d: quiz.desc, l: +quiz.timeLimit || 0, m: quiz.mode, sq: !!quiz.shuffleQ, so: quiz.shuffleO !== false, q: cleanForRun(quiz) };
    const bytes = new TextEncoder().encode(JSON.stringify(payload));
    if (window.CompressionStream) {
      try { const cs = new Blob([bytes]).stream().pipeThrough(new CompressionStream("deflate-raw")); return "z" + b64u(new Uint8Array(await new Response(cs).arrayBuffer())); } catch (e) { /* fall through */ }
    }
    return "u" + b64u(bytes);
  }
  async function decodeQuiz(s) {
    const kind = s[0], bytes = unb64u(s.slice(1));
    let json;
    if (kind === "z") { const ds = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw")); json = await new Response(ds).text(); }
    else json = new TextDecoder().decode(bytes);
    const p = JSON.parse(json);
    return { title: p.t || "Shared quiz", desc: p.d || "", timeLimit: p.l || 0, mode: p.m || "exam", shuffleQ: !!p.sq, shuffleO: p.so !== false, questions: Array.isArray(p.q) ? p.q : [] };
  }
  function exportJSON(quiz) { return JSON.stringify({ format: "mobile-comms-quiz", version: 1, quiz: { title: quiz.title, desc: quiz.desc, timeLimit: quiz.timeLimit, mode: quiz.mode, shuffleQ: quiz.shuffleQ, shuffleO: quiz.shuffleO, questions: quiz.questions } }, null, 2); }
  function sanitizeImported(obj) {
    const src = obj && obj.quiz ? obj.quiz : obj;
    if (!src || !Array.isArray(src.questions)) throw new Error("This file has no questions list.");
    const okTypes = Object.keys(TYPE_NAME);
    const questions = src.questions.filter((q) => q && okTypes.includes(q.type)).map((q) => {
      const b = blankQ(q.type);
      b.q = String(q.q || ""); b.explain = String(q.explain || ""); b.pts = Math.max(0.5, +q.pts || b.pts); if (q.stem) b.stem = String(q.stem);
      if (q.type === "mcq" || q.type === "multi") { b.options = (q.options || []).map(String); b.answer = q.type === "mcq" ? (+q.answer || 0) : (q.answer || []).map(Number); if (q.fixed) b.fixed = true; }
      if (q.type === "tf") b.answer = !!q.answer;
      if (q.type === "num") { b.answer = q.answer; b.unit = String(q.unit || ""); if (q.abs != null && q.abs !== "") { b.abs = +q.abs; delete b.tol; } else b.tol = q.tol != null ? +q.tol : 0.02; }
      if (q.type === "text") b.answer = (q.answer || []).map(String);
      return b;
    });
    return { title: String(src.title || "Imported quiz"), desc: String(src.desc || ""), timeLimit: +src.timeLimit || 0, mode: src.mode === "practice" ? "practice" : "exam", shuffleQ: !!src.shuffleQ, shuffleO: src.shuffleO !== false, questions };
  }
  async function openShare(quiz) {
    const issues = validateQuiz(quiz); if (issues.length) { openIssues(issues); return; }
    const code = await encodeQuiz(quiz);
    const base = location.href.split("#")[0];
    const link = base + "#take-" + code;
    const local = /^(file:|blob:|about:)/.test(location.protocol) || /claude|claudeusercontent/.test(location.hostname);
    const el = openSheet(`<div class="sheet-head"><div class="title3">Share “${esc(quiz.title)}”</div><button class="icon-btn" data-x aria-label="Close">${ICON.x}</button></div>
      <p class="muted" style="margin-bottom:10px">The whole quiz is packed into this link, so anyone who opens it can take the quiz. Nothing is uploaded.</p>
      <div class="share-box" id="shareBox">${esc(link)}</div>
      <p class="small" style="margin-top:8px">${link.length.toLocaleString()} characters.${local ? " Links work once the site is published on GitHub Pages." : ""}</p>
      <div class="row" style="margin-top:14px"><button class="btn" data-copy>${ICON.copy} Copy link</button><button class="btn gray" data-json>Export file instead</button></div>`);
    el.querySelector("[data-x]").onclick = closeSheet;
    el.querySelector("[data-copy]").onclick = () => copyText(link, "Link copied");
    el.querySelector("[data-json]").onclick = () => openExport(quiz);
  }
  function openExport(quiz) {
    const txt = exportJSON(quiz);
    const el = openSheet(`<div class="sheet-head"><div class="title3">Export quiz</div><button class="icon-btn" data-x aria-label="Close">${ICON.x}</button></div>
      <p class="muted" style="margin-bottom:10px">Save this file and send it, or keep it as a backup. Import it from the builder.</p>
      <textarea class="textarea mono" id="exportTxt" style="min-height:200px;font-size:12px" readonly>${esc(txt)}</textarea>
      <div class="row" style="margin-top:14px"><button class="btn" data-dl>Download .json</button><button class="btn gray" data-cp>${ICON.copy} Copy</button></div>`, { cls: "wide" });
    el.querySelector("[data-x]").onclick = closeSheet;
    el.querySelector("[data-dl]").onclick = () => download((quiz.title || "quiz").replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-").toLowerCase() + ".json", txt);
    el.querySelector("[data-cp]").onclick = () => { $("#exportTxt").select(); copyText(txt, "JSON copied"); };
  }
  function openImport() {
    const el = openSheet(`<div class="sheet-head"><div class="title3">Import a quiz</div><button class="icon-btn" data-x aria-label="Close">${ICON.x}</button></div>
      <div class="stack">
        <div class="field"><label for="impFile">Choose a .json file</label><input class="input" type="file" id="impFile" accept=".json,application/json"></div>
        <div class="field"><label for="impTxt">or paste the JSON</label><textarea class="textarea mono" id="impTxt" style="min-height:140px;font-size:12px" placeholder='{"format":"mobile-comms-quiz", ...}'></textarea></div>
        <p class="small" id="impErr" style="color:var(--red)" hidden></p>
        <div class="row"><button class="btn" data-go>Import</button></div>
      </div>`, { cls: "wide" });
    el.querySelector("[data-x]").onclick = closeSheet;
    el.querySelector("#impFile").onchange = (e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { $("#impTxt").value = r.result; }; r.readAsText(f); };
    el.querySelector("[data-go]").onclick = () => {
      try { const q = sanitizeImported(JSON.parse($("#impTxt").value)); const quiz = newQuiz(q); closeSheet(); toast("Imported " + quiz.questions.length + " questions"); go("edit-" + quiz.id); }
      catch (err) { const p = $("#impErr"); p.hidden = false; p.textContent = "Could not read that: " + (err.message || "invalid JSON") + " Check that you pasted the whole file."; }
    };
  }

  function renderBuilder() {
    const mine = getMine();
    view().innerHTML = `
      <div class="stack" style="margin-bottom:24px">
        <div class="eyebrow">Quiz builder</div><h1 class="large-title">Your quiz templates</h1>
        <p class="lede">Write your own questions or pick them from the bank. Every question type is auto-marked. Share a quiz as a link or a file.</p>
        <div class="row"><button class="btn" id="newQuiz">${ICON.plus} New quiz</button><button class="btn gray" id="impQuiz">Import</button></div>
      </div>
      <div class="list-header">Start from a template</div>
      <div class="grid grid-3" style="margin-bottom:32px">
        <button class="card tile" style="text-align:left;border:0;cursor:pointer" data-from="blank"><div class="tile-icon bg-blue">${ICON.plus}</div><h3>Blank quiz</h3><p>Start empty and add your own questions.</p></button>
        <button class="card tile" style="text-align:left;border:0;cursor:pointer" data-from="midterm-a"><div class="tile-icon bg-orange">${ICON.doc}</div><h3>Midterm Practice A</h3><p>All 42 questions, ready to edit or trim.</p></button>
        <button class="card tile" style="text-align:left;border:0;cursor:pointer" data-from="sheets"><div class="tile-icon bg-teal">${ICON.sigma}</div><h3>Sheets drill</h3><p>Every sheet problem as an editable set.</p></button>
      </div>
      <div class="list-header">Saved on this device</div>
      ${mine.length ? `<div class="grid grid-2">${mine.map((m) => `<div class="card tpl">
          <div class="spread"><h3 class="title3">${esc(m.title || "Untitled quiz")}</h3><span class="small">${new Date(m.updated).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span></div>
          ${m.desc ? `<p class="muted">${esc(m.desc)}</p>` : ""}
          <div class="meta"><span>${ICON.list} ${m.questions.length} questions</span><span>${ICON.clock} ${m.timeLimit ? m.timeLimit + " min" : "Untimed"}</span><span>${m.mode === "exam" ? "Marked at end" : "Instant feedback"}</span></div>
          <div class="acts"><button class="btn sm" data-take="${m.id}">${ICON.play} Take</button><a class="btn sm gray" href="#edit-${m.id}">Edit</a>
          <button class="btn sm gray" data-share="${m.id}">${ICON.share} Share</button><button class="btn sm plain" data-del="${m.id}" aria-label="Delete">${ICON.trash}</button></div></div>`).join("")}</div>`
        : `<div class="card flat empty"><div class="title3">No quizzes yet</div><p>Create one above. Quizzes are saved in this browser; export them to keep a copy.</p></div>`}`;
    $("#newQuiz").onclick = () => { const q = newQuiz(); go("edit-" + q.id); };
    $("#impQuiz").onclick = openImport;
    $$("[data-from]").forEach((b) => (b.onclick = () => {
      const f = b.dataset.from;
      if (f === "blank") { const q = newQuiz(); go("edit-" + q.id); return; }
      const t = TEMPLATES.find((x) => x.id === f);
      const q = newQuiz({ title: t.title + " (copy)", desc: t.desc, timeLimit: t.timeLimit, mode: t.mode, questions: t.build().map(toPlainQ) });
      go("edit-" + q.id);
    }));
    $$("[data-take]").forEach((b) => (b.onclick = () => takeMine(getMine().find((m) => m.id === b.dataset.take))));
    $$("[data-share]").forEach((b) => (b.onclick = () => openShare(getMine().find((m) => m.id === b.dataset.share))));
    $$("[data-del]").forEach((b) => (b.onclick = () => {
      const m = getMine().find((x) => x.id === b.dataset.del);
      confirmBox("Delete “" + (m.title || "Untitled quiz") + "”?", "This removes it from this device. Export it first if you want a copy.", "Delete", () => { setMine(getMine().filter((x) => x.id !== m.id)); toast("Deleted"); renderBuilder(); }, true);
    }));
  }

  function renderEditor(id) {
    const all = getMine();
    const quiz = all.find((m) => m.id === id);
    if (!quiz) return go("builder");
    let saveT;
    const persist = (quiet) => {
      quiz.updated = Date.now();
      const list = getMine(); const k = list.findIndex((m) => m.id === quiz.id);
      if (k >= 0) list[k] = quiz; else list.unshift(quiz);
      setMine(list);
      if (!quiet) { const s = $("#saveState"); if (s) { s.textContent = "Saved"; } }
    };
    const soon = () => { const s = $("#saveState"); if (s) s.textContent = "Saving…"; clearTimeout(saveT); saveT = setTimeout(persist, 400); };

    const qCard = (q, k) => {
      const typeSel = `<select class="select" data-k="${k}" data-f="type" style="width:auto;min-height:36px;padding-top:6px;padding-bottom:6px" aria-label="Question type">${Object.entries(TYPE_NAME).map(([t, n]) => `<option value="${t}" ${q.type === t ? "selected" : ""}>${n}</option>`).join("")}</select>`;
      let ans = "";
      if (q.type === "mcq" || q.type === "multi") {
        const multi = q.type === "multi";
        ans = `<div class="field"><span class="field-label">Options · tap the circle to mark ${multi ? "every correct option" : "the correct one"}</span>
          <div class="stack" style="gap:8px">${q.options.map((o, oi) => {
            const on = multi ? q.answer.includes(oi) : q.answer === oi;
            return `<div class="opt-edit"><button class="mark ${multi ? "sq" : ""} ${on ? "on" : ""}" data-k="${k}" data-mark="${oi}" aria-label="Mark option ${oi + 1} correct" aria-pressed="${on}">${ICON.check}</button>
              <input class="input" data-k="${k}" data-opt="${oi}" value="${esc(o)}" placeholder="Option ${oi + 1}" aria-label="Option ${oi + 1}">
              <button class="icon-btn" data-k="${k}" data-delopt="${oi}" aria-label="Remove option" ${q.options.length <= 2 ? "disabled" : ""}>${ICON.x}</button></div>`;
          }).join("")}</div>
          <div class="row"><button class="btn plain sm" data-k="${k}" data-addopt ${q.options.length >= 8 ? "disabled" : ""}>${ICON.plus} Add option</button>
          <label class="row small" style="gap:8px;cursor:pointer"><input type="checkbox" data-k="${k}" data-f="fixed" ${q.fixed ? "checked" : ""}> Keep option order</label></div></div>`;
      } else if (q.type === "tf") {
        ans = `<div class="field"><span class="field-label">Correct answer</span><div class="seg">${[true, false].map((v) => `<button class="${q.answer === v ? "on" : ""}" data-k="${k}" data-tfv="${v}">${v ? "True" : "False"}</button>`).join("")}</div></div>`;
      } else if (q.type === "num") {
        const useAbs = q.abs != null && q.abs !== "";
        ans = `<div class="inline-fields">
          <div class="field"><label>Correct value</label><input class="input" data-k="${k}" data-f="answer" inputmode="decimal" value="${esc(q.answer)}" placeholder="e.g. 18.66"></div>
          <div class="field"><label>Unit</label><input class="input" data-k="${k}" data-f="unit" value="${esc(q.unit || "")}" placeholder="dB, km, channels…"></div>
          <div class="field"><label>Tolerance type</label><select class="select" data-k="${k}" data-f="tolType"><option value="rel" ${useAbs ? "" : "selected"}>Percent of answer</option><option value="abs" ${useAbs ? "selected" : ""}>Plus or minus</option></select></div>
          <div class="field"><label>${useAbs ? "± value" : "± percent"}</label><input class="input" data-k="${k}" data-f="${useAbs ? "abs" : "tolPct"}" inputmode="decimal" value="${useAbs ? esc(q.abs) : esc(Math.round((q.tol != null ? q.tol : 0.02) * 1000) / 10)}"></div>
        </div>`;
      } else if (q.type === "text") {
        ans = `<div class="field"><label>Accepted answers (separate with |)</label><input class="input" data-k="${k}" data-f="textAns" value="${esc((q.answer || []).join(" | "))}" placeholder="time | time domain"><span class="small" style="padding-left:4px">Case, spaces and punctuation are ignored when marking.</span></div>`;
      }
      return `<div class="bq" id="bq-${k}">
        <div class="bq-head"><span class="n">${k + 1}</span>${typeSel}<span class="grow"></span>
          <div class="row" style="gap:4px"><span class="small">Points</span><input class="input" data-k="${k}" data-f="pts" inputmode="decimal" value="${esc(q.pts || 1)}" style="width:64px;min-height:36px;padding:6px 10px" aria-label="Points">
          <button class="icon-btn" data-k="${k}" data-mv="-1" aria-label="Move up" ${k === 0 ? "disabled" : ""}>${ICON.up}</button>
          <button class="icon-btn" data-k="${k}" data-mv="1" aria-label="Move down" ${k === quiz.questions.length - 1 ? "disabled" : ""}>${ICON.down}</button>
          <button class="icon-btn" data-k="${k}" data-dupq aria-label="Duplicate">${ICON.copy}</button>
          <button class="icon-btn" data-k="${k}" data-delq aria-label="Delete question">${ICON.trash}</button></div></div>
        <div class="field"><label>Scenario (optional)</label><input class="input" data-k="${k}" data-f="stem" value="${esc(q.stem || "")}" placeholder="Shared data shown above the question"></div>
        <div class="field"><label>Question</label><textarea class="textarea" data-k="${k}" data-f="q" placeholder="Type the question">${esc(q.q)}</textarea></div>
        ${ans}
        <div class="field"><label>Explanation (shown after marking)</label><textarea class="textarea" data-k="${k}" data-f="explain" style="min-height:60px" placeholder="Why the answer is right">${esc(q.explain || "")}</textarea></div>
      </div>`;
    };

    const draw = () => {
      const y = window.scrollY;
      const pts = quiz.questions.reduce((a, q) => a + (+q.pts || 1), 0);
      view().innerHTML = `
        <div class="row" style="margin-bottom:14px"><a href="#builder" class="btn plain sm">${ICON.left} Builder</a><span class="grow"></span><span class="small" id="saveState">Saved</span></div>
        <div class="page narrow" style="padding:0;max-width:820px;margin:0 auto">
        <div class="stack">
          <div class="card stack">
            <div class="field"><label for="qzTitle">Quiz title</label><input class="input" id="qzTitle" data-meta="title" value="${esc(quiz.title)}" style="font-size:20px;font-weight:600"></div>
            <div class="field"><label for="qzDesc">Description</label><textarea class="textarea" id="qzDesc" data-meta="desc" style="min-height:60px" placeholder="What does this quiz cover?">${esc(quiz.desc || "")}</textarea></div>
            <div class="inline-fields">
              <div class="field"><label for="qzTime">Time limit (minutes, 0 = none)</label><input class="input" id="qzTime" data-meta="timeLimit" inputmode="numeric" value="${esc(quiz.timeLimit || 0)}"></div>
              <div class="field"><span class="field-label">Marking</span><div class="seg">${[["exam", "At the end"], ["practice", "After each question"]].map(([k, v]) => `<button class="${quiz.mode === k ? "on" : ""}" data-mode="${k}">${v}</button>`).join("")}</div></div>
            </div>
            <div class="row" style="gap:20px">
              <label class="row" style="gap:10px;cursor:pointer"><span class="switch"><input type="checkbox" data-meta="shuffleQ" ${quiz.shuffleQ ? "checked" : ""}><span></span></span> Shuffle questions</label>
              <label class="row" style="gap:10px;cursor:pointer"><span class="switch"><input type="checkbox" data-meta="shuffleO" ${quiz.shuffleO !== false ? "checked" : ""}><span></span></span> Shuffle options</label>
            </div>
          </div>
          <div class="spread"><div class="title3 tnum">${quiz.questions.length} questions · ${pts} points</div>
            <div class="row"><button class="btn sm gray" id="exportBtn">Export</button><button class="btn sm gray" id="shareBtn">${ICON.share} Share</button><button class="btn sm" id="takeBtn">${ICON.play} Take quiz</button></div></div>
          <div class="stack" id="qList">${quiz.questions.map(qCard).join("") || `<div class="card flat empty"><div class="title3">No questions yet</div><p>Add one below or pull ready-made questions from the bank.</p></div>`}</div>
          <div class="card flat" style="padding:16px">
            <div class="field-label" style="margin-bottom:10px">Add a question</div>
            <div class="chips">${Object.entries(TYPE_NAME).map(([t, n]) => `<button class="chip" data-addq="${t}">${ICON.plus.replace("<svg", '<svg style="width:14px;height:14px"')} ${n}</button>`).join("")}
            <button class="chip on" id="fromBank">From question bank</button></div>
          </div>
        </div></div>`;
      window.scrollTo(0, y);
    };
    draw();

    const root = view();
    root.oninput = (e) => {
      const t = e.target;
      if (t.dataset.meta) {
        const f = t.dataset.meta;
        if (t.type === "checkbox") quiz[f] = t.checked; else if (f === "timeLimit") quiz.timeLimit = Math.max(0, parseInt(t.value) || 0); else quiz[f] = t.value;
        return soon();
      }
      const k = +t.dataset.k; if (isNaN(k)) return;
      const q = quiz.questions[k];
      if (t.dataset.opt != null) { q.options[+t.dataset.opt] = t.value; return soon(); }
      const f = t.dataset.f;
      if (f === "q" || f === "explain" || f === "unit") q[f] = t.value;
      else if (f === "stem") { if (t.value) q.stem = t.value; else delete q.stem; }
      else if (f === "pts") q.pts = Math.max(0.5, parseFloat(t.value) || 1);
      else if (f === "answer") q.answer = t.value;
      else if (f === "abs") q.abs = t.value === "" ? 0 : parseFloat(t.value);
      else if (f === "tolPct") q.tol = Math.max(0, (parseFloat(t.value) || 0) / 100);
      else if (f === "textAns") q.answer = t.value.split("|").map((s) => s.trim()).filter(Boolean);
      else return;
      soon();
    };
    root.onchange = (e) => {
      const t = e.target; const k = +t.dataset.k;
      if (t.dataset.meta && t.type === "checkbox") { quiz[t.dataset.meta] = t.checked; persist(); return; }
      if (isNaN(k)) return;
      const q = quiz.questions[k];
      if (t.dataset.f === "type") {
        const nq = blankQ(t.value); nq.q = q.q; nq.explain = q.explain; nq.pts = q.pts; if (q.stem) nq.stem = q.stem;
        if ((t.value === "mcq" || t.value === "multi") && q.options) nq.options = q.options.slice();
        quiz.questions[k] = nq; persist(); draw();
      } else if (t.dataset.f === "tolType") {
        if (t.value === "abs") { q.abs = 0; delete q.tol; } else { delete q.abs; q.tol = 0.02; }
        persist(); draw();
      } else if (t.dataset.f === "fixed") { q.fixed = t.checked; persist(); }
    };
    root.onclick = (e) => {
      const b = e.target.closest("button"); if (!b) return;
      const k = +b.dataset.k; const q = quiz.questions[k];
      if (b.dataset.mode) { quiz.mode = b.dataset.mode; persist(); draw(); }
      else if (b.dataset.mark != null) { const oi = +b.dataset.mark; if (q.type === "multi") { q.answer = q.answer.includes(oi) ? q.answer.filter((x) => x !== oi) : q.answer.concat(oi).sort((a, c) => a - c); } else q.answer = oi; persist(); draw(); }
      else if (b.dataset.delopt != null) {
        const oi = +b.dataset.delopt; q.options.splice(oi, 1);
        if (q.type === "mcq") q.answer = q.answer === oi ? 0 : q.answer > oi ? q.answer - 1 : q.answer;
        else q.answer = q.answer.filter((x) => x !== oi).map((x) => (x > oi ? x - 1 : x));
        persist(); draw();
      }
      else if (b.dataset.addopt != null) { q.options.push(""); persist(); draw(); }
      else if (b.dataset.tfv != null) { q.answer = b.dataset.tfv === "true"; persist(); draw(); }
      else if (b.dataset.mv) { const d = +b.dataset.mv, n = k + d; [quiz.questions[k], quiz.questions[n]] = [quiz.questions[n], quiz.questions[k]]; persist(); draw(); }
      else if (b.dataset.dupq != null) { quiz.questions.splice(k + 1, 0, clone(q)); persist(); draw(); toast("Duplicated"); }
      else if (b.dataset.delq != null) { confirmBox("Delete question " + (k + 1) + "?", "This cannot be undone.", "Delete", () => { quiz.questions.splice(k, 1); persist(); draw(); }, true); }
      else if (b.dataset.addq) { quiz.questions.push(blankQ(b.dataset.addq)); persist(); draw(); const last = $("#bq-" + (quiz.questions.length - 1)); if (last) { last.scrollIntoView({ behavior: "smooth", block: "center" }); const ta = last.querySelector('[data-f="q"]'); if (ta) ta.focus({ preventScroll: true }); } }
      else if (b.id === "fromBank") openPicker(quiz, () => { persist(); draw(); });
      else if (b.id === "takeBtn") { persist(true); takeMine(quiz); }
      else if (b.id === "shareBtn") { persist(true); openShare(quiz); }
      else if (b.id === "exportBtn") { persist(true); openExport(quiz); }
    };
  }

  function openPicker(quiz, onDone) {
    const F = { lec: "all", type: "all", q: "" };
    const chosen = new Set();
    const el = openSheet(`<div class="sheet-head"><div class="title3">Add from the question bank</div><button class="icon-btn" data-x aria-label="Close">${ICON.x}</button></div>
      <div class="inline-fields">
        <div class="field"><label for="pkLec">Lecture</label><select class="select" id="pkLec"><option value="all">All lectures</option>${LEC_ORDER.map((l) => `<option value="${l}">${LEC[l].name} · ${LEC[l].short}</option>`).join("")}</select></div>
        <div class="field"><label for="pkType">Type</label><select class="select" id="pkType"><option value="all">All types</option>${Object.entries(TYPE_NAME).map(([t, n]) => `<option value="${t}">${n}</option>`).join("")}</select></div>
        <div class="field"><label for="pkQ">Search</label><input class="input" id="pkQ" placeholder="e.g. handoff, SIR, HLR"></div>
      </div>
      <div class="picker-list" id="pkList"></div>
      <div class="spread"><button class="btn plain sm" id="pkAll">Select all shown</button><button class="btn" id="pkAdd" disabled>Add</button></div>`, { cls: "wide" });
    const list = () => BANK.filter((q) => (F.lec === "all" || q.lec === F.lec) && (F.type === "all" || q.type === F.type) && (!F.q || (q.q + " " + q.topic + " " + (q.stem || "")).toLowerCase().includes(F.q.toLowerCase())));
    const draw = () => {
      const items = list();
      $("#pkList").innerHTML = items.length ? items.map((q) => `<label class="picker-item"><input type="checkbox" data-id="${q.id}" ${chosen.has(q.id) ? "checked" : ""}>
        <div class="grow"><div class="row" style="gap:6px;margin-bottom:4px">${tag(q.lec)}<span class="tag tag-plain">${TYPE_NAME[q.type]}</span><span class="small">${esc(q.topic)}</span></div>${q.stem ? `<div class="small">${esc(q.stem)}</div>` : ""}<div>${esc(q.q)}</div></div></label>`).join("")
        : '<p class="muted" style="padding:12px">No questions match.</p>';
      const btn = $("#pkAdd"); btn.disabled = !chosen.size; btn.textContent = chosen.size ? `Add ${chosen.size} question${chosen.size > 1 ? "s" : ""}` : "Add";
    };
    el.querySelector("[data-x]").onclick = closeSheet;
    $("#pkLec").onchange = (e) => { F.lec = e.target.value; draw(); };
    $("#pkType").onchange = (e) => { F.type = e.target.value; draw(); };
    $("#pkQ").oninput = (e) => { F.q = e.target.value; draw(); };
    $("#pkList").onchange = (e) => { const id = e.target.dataset.id; if (!id) return; e.target.checked ? chosen.add(id) : chosen.delete(id); draw(); };
    $("#pkAll").onclick = () => { list().forEach((q) => chosen.add(q.id)); draw(); };
    $("#pkAdd").onclick = () => { BANK.filter((q) => chosen.has(q.id)).forEach((q) => quiz.questions.push(toPlainQ(q))); closeSheet(); toast(`Added ${chosen.size} question${chosen.size > 1 ? "s" : ""}`); onDone(); };
    draw();
  }

  /* ================= SHARED QUIZ (take-<payload>) ================= */
  async function renderTake(code) {
    view().innerHTML = `<div class="card flat empty"><div class="title3">Opening shared quiz…</div></div>`;
    let quiz;
    try { quiz = await decodeQuiz(code); if (!quiz.questions.length) throw new Error("empty"); }
    catch (e) {
      view().innerHTML = `<div class="quiz-shell"><div class="card empty"><div class="title3">This link could not be opened</div><p>It may have been cut off when it was copied. Ask the sender for the full link or the exported .json file.</p><div class="row" style="justify-content:center;margin-top:14px"><a class="btn" href="#home">Go home</a></div></div></div>`;
      return;
    }
    view().innerHTML = `<div class="quiz-shell"><div class="card stack">
      <div class="eyebrow">Shared quiz</div><h1 class="large-title" style="font-size:32px">${esc(quiz.title)}</h1>
      ${quiz.desc ? `<p class="lede">${esc(quiz.desc)}</p>` : ""}
      <div class="tpl"><div class="meta"><span>${ICON.list} ${quiz.questions.length} questions</span><span>${ICON.clock} ${quiz.timeLimit ? quiz.timeLimit + " min" : "Untimed"}</span><span>${quiz.mode === "exam" ? "Marked at the end" : "Instant feedback"}</span></div></div>
      <div class="row"><button class="btn lg" id="takeShared">${ICON.play} Start quiz</button><button class="btn lg gray" id="saveShared">Save a copy</button></div>
    </div></div>`;
    $("#takeShared").onclick = () => startQuiz({ title: quiz.title, source: "shared", questions: quiz.questions, mode: quiz.mode, timeLimit: quiz.timeLimit, shuffleQ: quiz.shuffleQ, shuffleO: quiz.shuffleO });
    $("#saveShared").onclick = () => { const q = newQuiz(sanitizeImported(quiz)); toast("Saved to your builder"); go("edit-" + q.id); };
  }

  /* ================= boot ================= */
  function boot() {
    $("#themeBtn").onclick = () => { theme = theme === "" ? "light" : theme === "light" ? "dark" : ""; store.set("theme", theme); applyTheme(theme); toast("Theme: " + (theme || "match system")); };
    applyTheme(theme);
    window.addEventListener("hashchange", route);
    route();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
