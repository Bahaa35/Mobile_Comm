/* =========================================================
   Problem generators. Each call creates a fresh numeric
   problem with new values and an exact, computed answer,
   so practice never runs out.
   ========================================================= */
(function () {
  const { dB, lin, sir1, nmin, r } = window.QMATH;
  const VALID_N = [1, 3, 4, 7, 9, 12, 13, 16, 19, 21, 25, 27, 28];
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const int = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const fmt = (x, d = 2) => Number(r(x, d)).toLocaleString("en-US", { maximumFractionDigits: d });

  const G = [];
  function gen(id, lec, topic, diff, make) { G.push({ id, lec, topic, diff, make }); }

  gen("g-cap", "L2", "Capacity", 1, () => {
    const N = pick([3, 4, 7, 9, 12]), k = int(8, 60), M = int(2, 20);
    return { type: "num", unit: "channels", abs: 0, answer: M * k * N,
      q: `A cellular system has ${N} cells per cluster and ${k} channels per cell. The cluster is replicated ${M} times. Find the total capacity C.`,
      explain: `C = M × k × N = ${M} × ${k} × ${N} = ${M * k * N} channels.` };
  });

  gen("g-kpercell", "L2", "Capacity", 2, () => {
    const sbw = pick([12.5, 15, 25, 30]), N = pick([3, 4, 7, 9, 12]);
    const S = pick([300, 360, 420, 480, 600, 720, 840]);
    const BW = S * 2 * sbw / 1000; // MHz
    const k = S / N;
    return { type: "num", unit: "channels", abs: Number.isInteger(k) ? 0 : 1, answer: Number.isInteger(k) ? k : Math.floor(k),
      q: `A total of ${fmt(BW, 3)} MHz is allocated to a system that uses two ${sbw} kHz simplex channels per duplex channel. Find the number of channels per cell for ${N}-cell reuse${Number.isInteger(k) ? "" : " (round down)"}.`,
      explain: `Duplex channel = 2 × ${sbw} = ${2 * sbw} kHz. S = ${fmt(BW, 3)} MHz / ${2 * sbw} kHz = ${S}. k = S/N = ${S}/${N} = ${fmt(k)}${Number.isInteger(k) ? "" : " → " + Math.floor(k)}.` };
  });

  gen("g-totalbw", "L2", "Capacity", 2, () => {
    const sbw = pick([20, 25, 30, 35]), N = pick([3, 4, 7, 12]), k = pick([40, 50, 60, 80, 100, 120]);
    const BW = k * N * 2 * sbw / 1000;
    return { type: "num", unit: "MHz", tol: 0.005, answer: r(BW, 3),
      q: `A system uses a cluster size of ${N}, two ${sbw} kHz simplex channels per duplex channel, and ${k} channels per cell. Compute the total allocated bandwidth.`,
      explain: `Duplex channel = ${2 * sbw} kHz. S = k × N = ${k} × ${N} = ${k * N}. BW = ${k * N} × ${2 * sbw} kHz = ${fmt(BW, 3)} MHz.` };
  });

  gen("g-control", "L2", "Capacity", 3, () => {
    const N = pick([3, 4, 12]);
    const ctlMHz = pick([0.6, 1.2, 1.8, 2.4]);
    const sbw = 25, S = pick([480, 600, 720, 960]);
    const BW = S * 2 * sbw / 1000;
    const ctl = Math.round(ctlMHz * 1000 / (2 * sbw));
    const cpc = ctl / N, voice = (S - ctl) / N;
    if (!Number.isInteger(cpc) || !Number.isInteger(voice)) return null;
    return { type: "num", unit: "channels", abs: 0, answer: voice,
      stem: `${fmt(BW, 3)} MHz total, two ${sbw} kHz simplex channels, ${ctlMHz} MHz reserved for control, N = ${N}`,
      q: `How many voice channels does each cell get?`,
      explain: `S = ${fmt(BW, 3)} MHz / 50 kHz = ${S}. Control = ${ctlMHz} MHz / 50 kHz = ${ctl}. Voice = ${S - ctl}. Per cell: ${S - ctl}/${N} = ${voice} voice (and ${cpc} control).` };
  });

  gen("g-nij", "L2", "Clusters", 1, () => {
    const i = int(1, 5), j = int(0, 4), N = i * i + i * j + j * j;
    return { type: "num", unit: "cells", abs: 0, answer: N,
      q: `Find the cluster size N for i = ${i}, j = ${j}.`,
      explain: `N = i² + ij + j² = ${i * i} + ${i * j} + ${j * j} = ${N}.` };
  });

  gen("g-q", "L2", "Reuse distance", 1, () => {
    const N = pick([3, 4, 7, 9, 12, 13, 19, 21]);
    return { type: "num", unit: "", tol: 0.01, answer: r(Math.sqrt(3 * N), 2),
      q: `Find the co-channel reuse ratio Q = D/R for a cluster size N = ${N}.`,
      explain: `Q = √(3N) = √${3 * N} = ${fmt(Math.sqrt(3 * N))}.` };
  });

  gen("g-d", "L2", "Reuse distance", 2, () => {
    const N = pick([3, 4, 7, 9, 12, 13, 19]), R = pick([0.5, 1, 1.5, 2, 2.5, 3, 5]);
    const D = Math.sqrt(3 * N) * R;
    return { type: "num", unit: "km", tol: 0.01, answer: r(D, 2),
      q: `Cells have radius R = ${R} km and the cluster size is N = ${N}. Find the co-channel reuse distance D.`,
      explain: `D = √(3N)·R = √${3 * N} × ${R} = ${fmt(Math.sqrt(3 * N), 3)} × ${R} = ${fmt(D)} km.` };
  });

  gen("g-sir", "SIR", "SIR formula", 2, () => {
    const N = pick([3, 4, 7, 9, 12, 13, 19]), n = pick([2.5, 3, 3.5, 4]);
    const s = sir1(N, n);
    return { type: "num", unit: "dB", abs: 0.06, answer: r(dB(s), 2),
      q: `Find the first-tier SIR in dB for N = ${N} and path-loss exponent n = ${n} (six co-channel interferers at equal distance).`,
      explain: `Q = √${3 * N} = ${fmt(Math.sqrt(3 * N), 3)}. SIR = Qⁿ/6 = ${fmt(s, 2)} → 10·log10(${fmt(s, 2)}) = ${fmt(dB(s))} dB.` };
  });

  gen("g-nreq", "SIR", "Cluster design", 3, () => {
    const req = pick([12, 13, 14, 15, 16, 17, 18, 20]), n = pick([3, 3.5, 4]);
    const nm = nmin(req, n);
    const N = VALID_N.find((v) => v >= nm - 1e-9);
    const opts = [N];
    const pool = VALID_N.filter((v) => v !== N && v > 1 && v <= 28);
    while (opts.length < 4) { const c = pick(pool); if (!opts.includes(c)) opts.push(c); }
    const s = sir1(N, n);
    return { type: "mcq", answer: 0, options: opts.map((v) => `N = ${v}`),
      q: `A system needs SIR ≥ ${req} dB and the path-loss exponent is n = ${n}. Assuming six first-tier co-channel interferers, which cluster size gives maximum capacity?`,
      explain: `${req} dB = ${fmt(lin(req), 2)}. N ≥ (6 × ${fmt(lin(req), 2)})^(2/${n}) / 3 = ${fmt(nm)}. Smallest valid N ≥ ${fmt(nm)} is ${N}. Check: SIR = ${fmt(s)} = ${fmt(dB(s))} dB ≥ ${req} dB.` };
  });

  gen("g-pr", "SIR", "Path loss", 2, () => {
    const P0 = pick([0, 10, 20, -10]), n = pick([2, 2.5, 3, 3.5, 4]), d = pick([50, 100, 200, 500, 1000, 2000]);
    const Pr = P0 - 10 * n * Math.log10(d);
    return { type: "num", unit: "dBm", abs: 0.1, answer: r(Pr, 2),
      q: `The reference power is P0 = ${P0} dBm at d0 = 1 m and n = ${n}. Find the received power at d = ${d} m.`,
      explain: `Pr = P0 − 10·n·log10(d/d0) = ${P0} − ${10 * n} × ${fmt(Math.log10(d), 3)} = ${fmt(Pr)} dBm.` };
  });

  gen("g-db", "SIR", "Path loss", 1, () => {
    if (Math.random() < 0.5) {
      const d = pick([9, 12, 13, 15, 17, 18, 20]);
      return { type: "num", unit: "", tol: 0.01, answer: r(lin(d), 2),
        q: `Convert ${d} dB to a linear power ratio.`,
        explain: `10^(${d}/10) = ${fmt(lin(d))}.` };
    }
    const x = pick([20, 36, 50, 73.5, 100, 150]);
    return { type: "num", unit: "dB", abs: 0.05, answer: r(dB(x), 2),
      q: `Convert the power ratio ${x} to dB.`,
      explain: `10·log10(${x}) = ${fmt(dB(x))} dB.` };
  });

  gen("g-delta", "L3", "Handoff margin", 3, () => {
    const v = pick([10, 15, 20, 25, 30]), dt = pick([2, 3, 4, 4.5, 5]), n = pick([2.5, 2.9, 3, 3.5, 4]);
    const Pmin = pick([-80, -85, -88, -90, -95]);
    const dmin = Math.pow(10, -Pmin / (10 * n));
    const dist = v * dt;
    if (dist >= dmin * 0.5) return null;
    const delta = 10 * n * Math.log10(dmin / (dmin - dist));
    return { type: "num", unit: "dB", abs: 0.05, answer: r(delta, 2),
      stem: `P0 = 0 dBm at d0 = 1 m, n = ${n}, P(r,min) = ${Pmin} dBm`,
      q: `A mobile moves at ${v} m/s straight away from its base station and a handoff takes ${dt} s. Find the minimum margin Δ = P(r,HO) − P(r,min).`,
      explain: `Distance during handoff = ${v} × ${dt} = ${dist} m. d_min = 10^(${-Pmin}/${10 * n}) = ${fmt(dmin, 1)} m. Δ = ${10 * n}·log10(${fmt(dmin, 1)} / ${fmt(dmin - dist, 1)}) = ${fmt(delta)} dB.` };
  });

  gen("g-interf", "SIR", "Sheet problems", 2, () => {
    const N = pick([3, 4, 7, 9, 12]), n = pick([3, 3.2, 3.5, 4]), S = pick([1, 2, 5, 10]);
    const s = sir1(N, n);
    return { type: "num", unit: "W", tol: 0.02, answer: r(S / s, 4),
      stem: `Hexagonal cells, N = ${N}, propagation constant n = ${n}`,
      q: `The carrier power is ${S} W. Find the interference power level.`,
      explain: `SIR = (√${3 * N})^${n} / 6 = ${fmt(s)}. I = S / SIR = ${S} / ${fmt(s)} = ${fmt(S / s, 4)} W.` };
  });

  window.GENERATORS = G;
  window.makeGenerated = function (g) {
    for (let t = 0; t < 20; t++) {
      const q = g.make();
      if (q) {
        q.id = g.id + "-" + Math.random().toString(36).slice(2, 8);
        q.lec = g.lec; q.topic = g.topic; q.diff = g.diff; q.gen = true;
        if (q.pts == null) q.pts = q.type === "num" ? (g.diff >= 3 ? 3 : 2) : 1;
        return q;
      }
    }
    return null;
  };
  window.VALID_N = VALID_N;
})();
