/* 70-sim-miller.js (S4) Miller indisleri: düzlem (hkl) ve yön [uvw].
 * Yalnızca Q.sim.register("miller", ...) çağırır. Bağımlılık: 00-q.js (Q.sim). */
(function () {
  'use strict';

  var INF = 'inf';
  var OPTS = [1, 2, 3, INF];

  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function lcm(a, b) { return a * b / gcd(a, b); }
  function isInf(c) { return c === INF || c === '∞' || c === Infinity || c === null; }

  function planeCalc(c) {
    var den = c.map(function (x) { return isInf(x) ? 0 : +x; });
    var L = 1;
    den.forEach(function (d) { if (d) { L = lcm(L, d); } });
    var tam = den.map(function (d) { return d ? L / d : 0; });
    var g = 0;
    tam.forEach(function (t) { g = gcd(g, t); });
    if (g > 1) { tam = tam.map(function (t) { return t / g; }); }
    return { den: den, tam: tam };
  }
  function dirCalc(v) {
    var g = 0;
    v.forEach(function (t) { g = gcd(g, t); });
    return g > 1 ? v.map(function (t) { return t / g; }) : v.slice();
  }
  function num(n) { return n < 0 ? '−' + (-n) : String(n); }
  function fmtNums(a) { return a.map(num).join(' '); }
  function fmtCompact(a, open, close) {
    var neg = a.some(function (t) { return t < 0; });
    return open + a.map(num).join(neg ? ' ' : '') + close;
  }
  function parseTarget(s) {
    if (!s) { return null; }
    var out = [], re = /(-|−)?(\d)(̄)?/g, m;
    while ((m = re.exec(String(s)))) { out.push((m[1] || m[3]) ? -(+m[2]) : +m[2]); }
    return out.length === 3 ? out : null;
  }
  function same(a, b) { return !!a && !!b && a[0] === b[0] && a[1] === b[1] && a[2] === b[2]; }

  /* izometrik izdüşüm: x sol-aşağı, y sağ-aşağı, z yukarı */
  function mkProj(scale, ox, oy) {
    var cs = Math.cos(Math.PI / 6) * scale, sn = Math.sin(Math.PI / 6) * scale;
    return function (x, y, z) { return [ox + (y - x) * cs, oy + (x + y) * sn - z * scale]; };
  }

  function mount(host, params, api) {
    params = params || {};
    var base = params.baslangic || {};
    var mod = params.mod === 'yon' ? 'yon' : 'duzlem';
    var c = (base.c || params.c || [1, 1, 1]).slice(0, 3);
    var vec = (base.v || [1, 1, 1]).slice(0, 3);
    var basari = params.basari || null;
    var hedef = (basari && (basari.hedef || basari.hedefYon)) || params.hedef || null;
    var hedefYon = (basari && basari.hedefYon) || (mod === 'yon' ? hedef : null);
    var hedefHkl = (basari && basari.hedef) || (mod === 'duzlem' ? hedef : null);
    var doneFired = false, destroyed = false, animDur = 350;
    var reduce = false;
    try { reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { reduce = false; }

    host.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:8px;width:100%;color:var(--ink);font-family:var(--font-b);';
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;border-radius:var(--rs);background:var(--sky);';
    canvas.setAttribute('role', 'img');
    var strip = document.createElement('div');
    strip.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:6px;font-size:var(--fs-small);text-align:center;';
    var dline = document.createElement('div');
    dline.style.cssText = 'font-size:var(--fs-small);color:var(--muted);text-align:center;';
    var ctrl = document.createElement('div');
    ctrl.style.cssText = 'display:flex;flex-direction:column;gap:6px;';
    wrap.appendChild(canvas); wrap.appendChild(strip); wrap.appendChild(dline); wrap.appendChild(ctrl);
    host.appendChild(wrap);

    var stepEls = [];
    var stepNames = mod === 'yon' ? ['Vektör', 'Böl', 'Tam sayı', 'Sonuç'] : ['Kesişim', 'Ters', 'Tam sayı', 'Sonuç'];
    stepNames.forEach(function (nm) {
      var d = document.createElement('div');
      d.style.cssText = 'background:var(--panel2);border:2px solid var(--line);border-radius:var(--rs);padding:4px 2px;min-width:0;';
      d.innerHTML = '<div style="color:var(--muted)"></div><div style="font-family:var(--font-d);font-size:17px;color:var(--ink);white-space:nowrap"></div>';
      d.firstChild.textContent = nm;
      strip.appendChild(d); stepEls.push(d);
    });

    var AX = ['x', 'y', 'z'], axCol = ['--magenta', '--cyan', '--lime'];
    var btnRows = [], selEls = [], listeners = [];
    function on(el, ev, fn) { el.addEventListener(ev, fn); listeners.push([el, ev, fn]); }

    function mkBtn(txt) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = txt;
      b.style.cssText = 'min-height:40px;min-width:40px;flex:1;border:2px solid var(--line);border-radius:var(--rs);background:var(--panel2);color:var(--ink);font-family:var(--font-d);font-size:17px;cursor:pointer;';
      return b;
    }
    function styleBtn(b, act) {
      b.style.background = act ? 'var(--sel)' : 'var(--panel2)';
      b.style.borderColor = act ? 'var(--cyan)' : 'var(--line)';
      b.setAttribute('aria-pressed', act ? 'true' : 'false');
    }

    function setC(ax, o) { c[ax] = o; animDur = 350; refresh(); }

    if (mod === 'duzlem') {
      for (var i = 0; i < 3; i++) {
        (function (ax) {
          var row = document.createElement('div');
          row.style.cssText = 'display:flex;gap:6px;align-items:center;';
          var lab = document.createElement('span');
          lab.textContent = AX[ax]; lab.style.cssText = 'width:20px;font-family:var(--font-d);font-size:17px;';
          lab.style.color = 'var(' + axCol[ax] + ')';
          row.appendChild(lab);
          var bs = OPTS.map(function (o) {
            var b = mkBtn(o === INF ? '∞' : String(o));
            b.setAttribute('aria-label', AX[ax] + ' ekseni kesişimi ' + (o === INF ? 'sonsuz' : o));
            on(b, 'click', function () { setC(ax, o); });
            row.appendChild(b); return b;
          });
          btnRows.push(bs); ctrl.appendChild(row);
        })(i);
      }
    } else {
      var srow = document.createElement('div');
      srow.style.cssText = 'display:flex;gap:6px;align-items:center;';
      for (var j = 0; j < 3; j++) {
        (function (ax) {
          var s = document.createElement('select');
          s.style.cssText = 'min-height:40px;flex:1;border:2px solid var(--line);border-radius:var(--rs);background:var(--panel2);color:var(--ink);font-family:var(--font-d);font-size:17px;';
          s.setAttribute('aria-label', 'Vektör bileşeni ' + ['u', 'v', 'w'][ax]);
          for (var q = -2; q <= 2; q++) {
            var o = document.createElement('option'); o.value = q; o.textContent = ['u', 'v', 'w'][ax] + ' = ' + num(q); s.appendChild(o);
          }
          s.value = vec[ax];
          on(s, 'change', function () { vec[ax] = +s.value; animDur = 350; refresh(); });
          srow.appendChild(s); selEls.push(s);
        })(j);
      }
      ctrl.appendChild(srow);
    }

    function recipOf(cc) { return cc.map(function (x) { return isInf(x) ? 0 : 1 / x; }); }
    var shown = recipOf(c);
    var shownV = vec.slice();
    var raf = 0;

    function result() {
      if (mod === 'duzlem') {
        if (c.every(isInf)) { return null; }
        return planeCalc(c).tam;
      }
      if (vec.every(function (t) { return t === 0; })) { return null; }
      return dirCalc(vec);
    }
    function setStep(i, t) { stepEls[i].lastChild.textContent = t; stepEls[i].style.borderColor = i === 3 ? 'var(--yellow)' : 'var(--line)'; }

    function refresh() {
      if (destroyed) { return; }
      var r = result();
      if (mod === 'duzlem') {
        btnRows.forEach(function (bs, ax) { bs.forEach(function (b, k) { styleBtn(b, String(OPTS[k]) === String(c[ax])); }); });
        var pc = planeCalc(c);
        setStep(0, c.map(function (x) { return isInf(x) ? '∞' : String(x); }).join(' '));
        setStep(1, pc.den.map(function (d) { return d ? '1/' + d : '0'; }).join(' '));
        setStep(2, r ? fmtNums(r) : '—');
        setStep(3, r ? fmtCompact(r, '(', ')') : '—');
        if (r) {
          var s2 = r[0] * r[0] + r[1] * r[1] + r[2] * r[2];
          dline.textContent = 'd = a / √(h²+k²+l²) = a / √' + s2 + ' = ' + (1 / Math.sqrt(s2)).toFixed(2) + ' a';
        } else { dline.textContent = 'Üç eksen de ∞ olamaz'; }
      } else {
        var g = vec.reduce(function (a, t) { return gcd(a, t); }, 0);
        setStep(0, fmtNums(vec));
        setStep(1, g > 1 ? '÷' + g : '÷1');
        setStep(2, r ? fmtNums(r) : '—');
        setStep(3, r ? fmtCompact(r, '[', ']') : '—');
        if (r) {
          var ln = Math.sqrt(r[0] * r[0] + r[1] * r[1] + r[2] * r[2]);
          dline.textContent = 'Uzunluk = a·√(u²+v²+w²) = ' + ln.toFixed(2) + ' a';
        } else { dline.textContent = 'Sıfır vektör yön belirtmez'; }
      }
      canvas.setAttribute('aria-label', mod === 'duzlem'
        ? 'Düzlem ' + (r ? fmtCompact(r, '(', ')') : 'yok') : 'Yön ' + (r ? fmtCompact(r, '[', ']') : 'yok'));
      animateTo();
      checkDone(r);
    }

    function checkDone(r) {
      if (doneFired || !basari || !r) { return; }
      var tg = mod === 'yon' ? parseTarget(hedefYon) : parseTarget(hedefHkl);
      if (same(r, tg)) {
        doneFired = true;
        api.done({ basari: true, olcum: mod === 'yon' ? { uvw: fmtCompact(r, '[', ']') } : { hkl: fmtCompact(r, '(', ')') } });
      }
    }

    function animateTo() {
      cancelAnimationFrame(raf);
      var tgt = mod === 'duzlem' ? recipOf(c) : vec.slice();
      var cur = mod === 'duzlem' ? shown : shownV;
      var i;
      if (reduce) { for (i = 0; i < 3; i++) { cur[i] = tgt[i]; } draw(); return; }
      var from = cur.slice(), t0 = null, dur = animDur;
      function step(ts) {
        if (destroyed) { return; }
        if (t0 === null) { t0 = ts; }
        var p = Math.min(1, (ts - t0) / dur), e = p * (2 - p);
        for (var n = 0; n < 3; n++) { cur[n] = from[n] + (tgt[n] - from[n]) * e; }
        draw();
        if (p < 1) { raf = requestAnimationFrame(step); }
      }
      raf = requestAnimationFrame(step);
    }

    function cssVar(n, fb) {
      var v = ''; try { v = getComputedStyle(host).getPropertyValue(n).trim(); } catch (e) { v = ''; }
      return v || fb;
    }
    var W = 300, H = 200;
    function resize() {
      if (destroyed) { return; }
      var dpr = window.devicePixelRatio || 1;
      W = Math.max(200, host.clientWidth || 300);
      H = Math.max(180, Math.min(260, Math.round((window.innerHeight || 800) * 0.22)));
      canvas.style.height = H + 'px';
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function seg(ctx, P, a, b, col, lw, dash) {
      var p = P(a[0], a[1], a[2]), q = P(b[0], b[1], b[2]);
      ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.setLineDash(dash || []);
      ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); ctx.setLineDash([]);
    }

    function planePoly(h, k, l, m) {
      var pts = [], i, j, cor = [];
      for (i = 0; i < 8; i++) { cor.push([(i & 1) * m, ((i >> 1) & 1) * m, ((i >> 2) & 1) * m]); }
      var f = function (p) { return h * p[0] + k * p[1] + l * p[2] - 1; };
      for (i = 0; i < 8; i++) {
        for (j = i + 1; j < 8; j++) {
          var d = (cor[i][0] !== cor[j][0]) + (cor[i][1] !== cor[j][1]) + (cor[i][2] !== cor[j][2]);
          if (d !== 1) { continue; }
          var fa = f(cor[i]), fb = f(cor[j]);
          if (Math.abs(fa) < 1e-9) { pts.push(cor[i].slice()); }
          if (Math.abs(fb) < 1e-9) { pts.push(cor[j].slice()); }
          if (fa * fb < 0) {
            var t = fa / (fa - fb);
            pts.push([0, 1, 2].map(function (n) { return cor[i][n] + (cor[j][n] - cor[i][n]) * t; }));
          }
        }
      }
      var uniq = [];
      pts.forEach(function (p) {
        if (!uniq.some(function (q) { return Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]) < 1e-6; })) { uniq.push(p); }
      });
      return uniq;
    }

    function draw() {
      if (destroyed) { return; }
      var ctx = canvas.getContext('2d');
      var ink = cssVar('--ink', '#fff'), muted = cssVar('--muted', '#c4b9ec'), yel = cssVar('--yellow', '#ffd23f');
      var cols = axCol.map(function (n, i) { return cssVar(n, ['#ff3df0', '#00e5ff', '#39ff88'][i]); });
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = cssVar('--sky', '#120a30'); ctx.fillRect(0, 0, W, H);
      var m = 1, ext = 1.3, i, P, scale;
      if (mod === 'duzlem') {
        shown.forEach(function (r) { if (r > 1e-6) { m = Math.max(m, 1 / r); } });
        m = Math.min(3, m); ext = m + 0.35;
        scale = Math.min(W * 0.8 / (1.74 * ext), H * 0.8 / (ext * 1.5 + 0.4));
        var o = mkProj(scale, 0, 0)(ext / 2, ext / 2, ext / 2);
        P = mkProj(scale, W / 2 - o[0], H * 0.52 - o[1]);
      } else {
        scale = Math.min(W * 0.8 / 4.3, H * 0.8 / 3.2);
        P = mkProj(scale, W / 2, H * 0.55);
      }
      var cu = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]];
      var ed = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
      if (mod === 'duzlem' && shown[0] + shown[1] + shown[2] > 1e-6) {
        var poly = planePoly(shown[0], shown[1], shown[2], m);
        if (poly.length >= 3) {
          var sp = poly.map(function (p) { return P(p[0], p[1], p[2]); });
          var cx = 0, cy = 0; sp.forEach(function (p) { cx += p[0]; cy += p[1]; }); cx /= sp.length; cy /= sp.length;
          sp.sort(function (a, b) { return Math.atan2(a[1] - cy, a[0] - cx) - Math.atan2(b[1] - cy, b[0] - cx); });
          ctx.beginPath(); sp.forEach(function (p, n) { if (n) { ctx.lineTo(p[0], p[1]); } else { ctx.moveTo(p[0], p[1]); } }); ctx.closePath();
          ctx.fillStyle = 'rgba(255,210,63,0.35)'; ctx.fill();
          ctx.strokeStyle = yel; ctx.lineWidth = 2.5; ctx.stroke();
        }
      }
      ed.forEach(function (e) { seg(ctx, P, cu[e[0]], cu[e[1]], muted, 1.5, [4, 4]); });
      var a0 = mod === 'yon' ? -1.2 : 0, a1 = mod === 'yon' ? 1.25 : ext;
      for (i = 0; i < 3; i++) {
        var s = [0, 0, 0], t = [0, 0, 0]; s[i] = a0; t[i] = a1;
        seg(ctx, P, s, t, cols[i], 2.5);
        var lp = [0, 0, 0]; lp[i] = a1 + 0.12; var lq = P(lp[0], lp[1], lp[2]);
        ctx.fillStyle = cols[i]; ctx.font = '700 15px ' + cssVar('--font-d', 'sans-serif'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(AX[i], lq[0], lq[1]);
        if (mod === 'duzlem') {
          for (var n = 1; n <= 3 && n <= a1; n++) {
            var tp = [0, 0, 0]; tp[i] = n; var tq = P(tp[0], tp[1], tp[2]);
            ctx.beginPath(); ctx.arc(tq[0], tq[1], 2.5, 0, 6.2832); ctx.fillStyle = cols[i]; ctx.fill();
            ctx.fillStyle = ink; ctx.font = '12px ' + cssVar('--font-b', 'sans-serif'); ctx.fillText(String(n), tq[0] + 8, tq[1] + 9);
          }
        }
      }
      if (mod === 'duzlem') {
        for (i = 0; i < 3; i++) {
          if (shown[i] > 1e-6) {
            var ip = [0, 0, 0]; ip[i] = 1 / shown[i]; var iq = P(ip[0], ip[1], ip[2]);
            ctx.beginPath(); ctx.arc(iq[0], iq[1], 5, 0, 6.2832); ctx.fillStyle = yel; ctx.fill();
            ctx.strokeStyle = cssVar('--ink-dark', '#0b0620'); ctx.lineWidth = 2; ctx.stroke();
          }
        }
      } else {
        var mx = Math.max(Math.abs(shownV[0]), Math.abs(shownV[1]), Math.abs(shownV[2]));
        if (mx > 1e-3) {
          var p0 = P(0, 0, 0), p1 = P(shownV[0] / mx, shownV[1] / mx, shownV[2] / mx);
          ctx.strokeStyle = yel; ctx.fillStyle = yel; ctx.lineWidth = 4; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
          var ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
          ctx.beginPath(); ctx.moveTo(p1[0], p1[1]);
          ctx.lineTo(p1[0] - 12 * Math.cos(ang - 0.4), p1[1] - 12 * Math.sin(ang - 0.4));
          ctx.lineTo(p1[0] - 12 * Math.cos(ang + 0.4), p1[1] - 12 * Math.sin(ang + 0.4));
          ctx.closePath(); ctx.fill();
        }
      }
      var r = result();
      ctx.fillStyle = yel; ctx.font = '700 22px ' + cssVar('--font-d', 'sans-serif'); ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText(r ? (mod === 'yon' ? fmtCompact(r, '[', ']') : fmtCompact(r, '(', ')')) : '—', 10, 8);
    }

    var ro = null;
    if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(function () { resize(); }); ro.observe(host); }
    else { on(window, 'resize', resize); }

    if (api && api.hint) {
      api.hint(mod === 'yon' ? 'Vektörü seç, en küçük tam sayılara indir.' : 'Kesişimin tersini al, kesirleri temizle.');
    }
    resize();
    refresh();

    return {
      destroy: function () {
        destroyed = true;
        cancelAnimationFrame(raf);
        listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2]); });
        listeners = [];
        if (ro) { ro.disconnect(); ro = null; }
        host.innerHTML = '';
      },
      getState: function () {
        var r = result();
        return { mod: mod, c: c.slice(), v: vec.slice(), hkl: r, sonuc: r ? (mod === 'yon' ? fmtCompact(r, '[', ']') : fmtCompact(r, '(', ')')) : null };
      },
      set: function (p) {
        if (!p || destroyed) { return; }
        if (p.c) { c = p.c.slice(0, 3); }
        if (p.v) { vec = p.v.slice(0, 3); selEls.forEach(function (s, k) { s.value = vec[k]; }); }
        if (p.basari) { basari = p.basari; hedefHkl = basari.hedef || hedefHkl; hedefYon = basari.hedefYon || hedefYon; }
        animDur = 1000;
        refresh();
      }
    };
  }

  Q.sim.register('miller', { mount: mount });
})();
