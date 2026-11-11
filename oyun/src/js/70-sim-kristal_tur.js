/* 70-sim-kristal_tur.js (S1) Simülasyon: katı türleri (tek kristal, çok kristalli, amorf) ve elektron saçılması.
 * Ekledigi alan: Q.sim.register("kristal_tur", ...) — başka şey yapmaz.
 * Bağımlılık: 00-q.js (Q.sim). params: mod ("tur"|"serbest_yol"), gonder, basari, baslangic.
 * Oyun modeli: adım başına saçılma p_tek=0.01, tane sınırı geçişi 0.5, p_amorf=0.12. */
(function(){
  'use strict';

  var P_TEK = 0.01, P_SINIR = 0.5, P_AMORF = 0.12;
  var VW = 100;            // sanal kutu genişliği
  var STEP = 1.2;          // sanal adım (kutuyu ≈ 83 adımda geçer)
  var STEPS_PER_FRAME = 2;
  var MAX_STEPS = 2500;
  var TRAIL = 34;
  var TUR_ADI = { tek: 'Single crystal (tek kristal)', cok: 'Polycrystalline (çok kristalli)', amorf: 'Amorphous (amorf)' };
  var TUR_KISA = { tek: 'Single crystal', cok: 'Polycrystal', amorf: 'Amorphous' };
  var SEEDS = [[0.2, 0.25], [0.72, 0.2], [0.48, 0.55], [0.16, 0.82], [0.84, 0.8]];
  var ACILAR = [0.35, 0.95, 0.1, 1.25, 0.62];
  var styleCount = 0;

  function css(){
    if (document.getElementById('sim-kt-style')) return;
    var s = document.createElement('style');
    s.id = 'sim-kt-style';
    s.textContent =
      '.sim-kt{display:block;width:100%}' +
      '.sim-kt canvas{display:block;width:100%;height:clamp(180px,22vh,260px);border-radius:var(--rs,8px)}' +
      '.sim-kt-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:8px}' +
      '.sim-kt-btn{min-height:40px;min-width:72px;padding:0 16px;cursor:pointer;font-family:var(--font-d,inherit);font-size:var(--fs-body,17px);' +
      'background:var(--yellow,#ffd23f);color:var(--ink-dark,#0b0620);border:var(--bw,3px) solid var(--ink-dark,#0b0620);border-radius:var(--rs,8px);' +
      'box-shadow:4px 4px 0 var(--magenta,#ff3df0)}' +
      '.sim-kt-btn:active{transform:translate(2px,2px);box-shadow:2px 2px 0 var(--magenta,#ff3df0)}' +
      '.sim-kt-btn:focus-visible{outline:3px solid var(--cyan,#00e5ff);outline-offset:2px}' +
      '.sim-kt-btn[disabled]{opacity:.55;cursor:default}' +
      '.sim-kt-note{margin-left:auto;font-size:var(--fs-small,14px);color:var(--muted,#c4b9ec)}';
    document.head.appendChild(s);
  }

  function colors(){
    var cs = getComputedStyle(document.documentElement);
    function g(n, d){ var v = cs.getPropertyValue(n); v = v && v.trim(); return v || d; }
    return { sky: g('--sky', '#120a30'), cyan: g('--cyan', '#00e5ff'), magenta: g('--magenta', '#ff3df0'),
      yellow: g('--yellow', '#ffd23f'), lime: g('--lime', '#39ff88'), ink: g('--ink', '#ffffff'),
      muted: g('--muted', '#c4b9ec'), blue: g('--blue', '#3a5bff'), line: g('--line', '#f4f0ff'),
      font: g('--font-b', 'sans-serif') };
  }

  function mulberry(a){
    return function(){
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function reduce(){
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
    catch (e) { return false; }
  }

  function mount(host, params, api){
    params = params || {};
    api = api || {};
    var base = params.baslangic || {};
    var mod = (params.mod || base.mod) === 'serbest_yol' ? 'serbest_yol' : 'tur';
    var basari = params.basari || null;
    var C = colors();
    var dead = false, raf = 0, timers = [], listeners = [], fade = 1;
    var doneCalled = false;
    var stats = { tek: { steps: 0, scat: 0, runs: 0 }, cok: { steps: 0, scat: 0, runs: 0 }, amorf: { steps: 0, scat: 0, runs: 0 } };
    var electrons = [], flashes = [];
    var boxes = [], W = 300, H = 200, dpr = 1;
    var bg = document.createElement('canvas');
    var lastSend = 0;

    css(); styleCount++;
    host.textContent = '';
    var wrap = document.createElement('div'); wrap.className = 'sim-kt';
    var cv = document.createElement('canvas');
    cv.setAttribute('role', 'img');
    cv.setAttribute('aria-label', 'Katı türlerinde elektron saçılması');
    var bar = document.createElement('div'); bar.className = 'sim-kt-bar';
    wrap.appendChild(cv); wrap.appendChild(bar); host.appendChild(wrap);
    var ctx = cv.getContext('2d');

    function on(el, ev, fn){ el.addEventListener(ev, fn); listeners.push([el, ev, fn]); }
    function later(fn, ms){ var id = setTimeout(function(){ fn(); }, ms); timers.push(id); return id; }

    /* ---------- geometri ---------- */
    function turler(){ return mod === 'tur' ? ['tek', 'cok', 'amorf'] : ['tek', 'cok']; }

    function layout(){
      var rect = cv.getBoundingClientRect();
      W = Math.max(120, Math.round(rect.width || host.clientWidth || 300));
      H = Math.max(120, Math.round(rect.height || 200));
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      bg.width = cv.width; bg.height = cv.height;
      var t = turler(), n = t.length, pad = 6, gap = 8, top = 22, bot = 26;
      var bw = (W - 2 * pad - gap * (n - 1)) / n, bh = H - top - bot;
      boxes = t.map(function(tur, i){
        var x = pad + i * (bw + gap), sc = bw / VW;
        return { tur: tur, x: x, y: top, w: bw, h: bh, sc: sc, vh: bh / sc, seeds: null, angs: ACILAR };
      });
      boxes.forEach(function(b){
        b.seeds = SEEDS.map(function(s){ return [s[0] * VW, s[1] * b.vh]; });
      });
      drawBg();
    }

    function nearest(b, x, y){
      var best = 0, bd = 1e12;
      for (var i = 0; i < b.seeds.length; i++) {
        var dx = x - b.seeds[i][0], dy = y - b.seeds[i][1], d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = i; }
      }
      return best;
    }

    function drawBg(){
      var g = bg.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      var palette = [C.cyan, C.lime, C.yellow, C.blue, C.ink];
      boxes.forEach(function(b, bi){
        g.fillStyle = C.sky; g.fillRect(b.x, b.y, b.w, b.h);
        g.save(); g.beginPath(); g.rect(b.x, b.y, b.w, b.h); g.clip();
        var s = Math.max(10, Math.min(18, b.w / 9)), r = 2.6;
        g.globalAlpha = 0.9;
        if (b.tur === 'tek') {
          g.fillStyle = C.cyan;
          for (var x = s / 2; x < b.w; x += s) for (var y = s / 2; y < b.h; y += s) {
            g.beginPath(); g.arc(b.x + x, b.y + y, r, 0, 6.2832); g.fill();
          }
        } else if (b.tur === 'cok') {
          var diag = Math.ceil(Math.sqrt(b.w * b.w + b.h * b.h) / s) + 2;
          for (var gi = 0; gi < b.seeds.length; gi++) {
            var th = b.angs[gi], cs = Math.cos(th), sn = Math.sin(th);
            var cx = b.seeds[gi][0] * b.sc, cy = b.seeds[gi][1] * b.sc;
            g.fillStyle = palette[gi % palette.length];
            for (var i = -diag; i <= diag; i++) for (var j = -diag; j <= diag; j++) {
              var px = cx + (i * cs - j * sn) * s, py = cy + (i * sn + j * cs) * s;
              if (px < 0 || py < 0 || px > b.w || py > b.h) continue;
              if (nearest(b, px / b.sc, py / b.sc) !== gi) continue;
              g.beginPath(); g.arc(b.x + px, b.y + py, r, 0, 6.2832); g.fill();
            }
          }
          g.globalAlpha = 1; g.fillStyle = C.magenta;
          var st = 3;
          for (var yy = 0; yy < b.h; yy += st) for (var xx = 0; xx < b.w; xx += st) {
            var a0 = nearest(b, xx / b.sc, yy / b.sc);
            if (a0 !== nearest(b, (xx + st) / b.sc, yy / b.sc) || a0 !== nearest(b, xx / b.sc, (yy + st) / b.sc)) {
              g.fillRect(b.x + xx, b.y + yy, 2.2, 2.2);
            }
          }
        } else {
          var rnd = mulberry(77 + bi), pts = [], want = Math.round(b.w * b.h / (s * s)), tries = 0, md = s * 0.62;
          while (pts.length < want && tries < want * 40) {
            tries++;
            var qx = rnd() * b.w, qy = rnd() * b.h, ok = true;
            for (var k = 0; k < pts.length; k++) {
              var ddx = pts[k][0] - qx, ddy = pts[k][1] - qy;
              if (ddx * ddx + ddy * ddy < md * md) { ok = false; break; }
            }
            if (ok) pts.push([qx, qy]);
          }
          g.fillStyle = C.muted;
          pts.forEach(function(p){ g.beginPath(); g.arc(b.x + p[0], b.y + p[1], r, 0, 6.2832); g.fill(); });
        }
        g.restore();
        g.globalAlpha = 1;
        g.strokeStyle = C.line; g.lineWidth = 2;
        g.strokeRect(b.x, b.y, b.w, b.h);
      });
    }

    /* ---------- elektron ---------- */
    function spawn(bi, y){
      var b = boxes[bi];
      if (!b) return;
      var e = { bi: bi, tur: b.tur, x: 0, y: y == null ? b.vh * (0.35 + Math.random() * 0.3) : y,
        ang: 0, steps: 0, scat: 0, alive: true, trail: [], grain: -1 };
      e.grain = b.tur === 'cok' ? nearest(b, e.x, e.y) : -1;
      e.trail.push([e.x, e.y]);
      electrons.push(e);
      return e;
    }

    function advance(e){
      var b = boxes[e.bi];
      if (!b) { e.alive = false; return; }
      e.x += Math.cos(e.ang) * STEP; e.y += Math.sin(e.ang) * STEP;
      if (e.y < 0) { e.y = -e.y; e.ang = -e.ang; }
      else if (e.y > b.vh) { e.y = 2 * b.vh - e.y; e.ang = -e.ang; }
      if (e.x < 0) { e.x = -e.x; e.ang = Math.PI - e.ang; }
      e.steps++;
      var p = 0;
      if (b.tur === 'tek') p = P_TEK;
      else if (b.tur === 'amorf') p = P_AMORF;
      else {
        p = P_TEK;
        var gn = nearest(b, e.x, e.y);
        if (gn !== e.grain) { e.grain = gn; p = P_SINIR; }
      }
      if (Math.random() < p) {
        e.ang = (Math.random() * 2 - 1) * 2.2;
        e.scat++;
        flashes.push({ bi: e.bi, x: e.x, y: e.y, t: 0 });
      }
      e.trail.push([e.x, e.y]);
      var cap = reduce() ? 700 : TRAIL;
      if (e.trail.length > cap) e.trail.shift();
      if (e.x >= VW || e.steps >= MAX_STEPS) finish(e);
    }

    function finish(e){
      e.alive = false;
      var s = stats[e.tur];
      s.steps += e.steps; s.scat += e.scat; s.runs++;
      if (!electrons.some(function(o){ return o.alive; })) checkSuccess();
    }

    function mfp(tur){
      var s = stats[tur];
      if (!s.runs) return null;
      return s.scat > 0 ? s.steps / s.scat : s.steps;
    }

    function olcum(){
      function r(t){ var v = mfp(t); return v == null ? null : Math.round(v); }
      return { tek: r('tek'), cok: r('cok'), amorf: r('amorf') };
    }

    function checkSuccess(){
      if (doneCalled || !basari || dead) return;
      var ok = false;
      if (basari.hepsiniDene) ok = stats.tek.runs > 0 && stats.cok.runs > 0 && stats.amorf.runs > 0;
      else if (basari.kiyas) ok = mod === 'serbest_yol' && stats.tek.runs > 0 && stats.cok.runs > 0 && mfp('tek') > mfp('cok');
      if (ok) {
        doneCalled = true;
        if (typeof api.done === 'function') api.done({ basari: true, olcum: olcum() });
      }
    }

    function send(tur){
      if (dead) return;
      var i = turler().indexOf(tur);
      if (i < 0) return;
      electrons = electrons.filter(function(e){ return e.alive || e.bi !== i; });
      var e = spawn(i);
      if (reduce() && e) {
        while (e.alive) advance(e);
        flashes = [];
      }
      kick();
    }

    function sendAll(){
      if (dead || electrons.some(function(e){ return e.alive; })) return;
      electrons = []; flashes = [];
      var n = 30;
      boxes.forEach(function(b, bi){
        for (var k = 0; k < n; k++) spawn(bi, b.vh * (0.06 + 0.88 * (k + 0.5) / n));
      });
      if (reduce()) {
        electrons.forEach(function(e){ while (e.alive) advance(e); });
        flashes = [];
      }
      kick();
    }

    /* ---------- çizim ---------- */
    function fitText(c, list, maxW){
      for (var i = 0; i < list.length; i++) if (c.measureText(list[i]).width <= maxW) return list[i];
      return list[list.length - 1];
    }

    function fmtMfp(tur){
      var s = stats[tur];
      if (!s.runs) return '—';
      var v = mfp(tur);
      return (s.scat > 0 ? '' : '>') + Math.round(v);
    }

    function draw(){
      var c = ctx;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, W, H);
      c.globalAlpha = fade;
      c.drawImage(bg, 0, 0, W, H);
      c.globalAlpha = 1;
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.font = '800 14px ' + C.font;
      var uzun = boxes.every(function(b){ return c.measureText('Serbest yol: >999').width <= b.w; });
      boxes.forEach(function(b, bi){
        c.font = '800 14px ' + C.font;
        c.fillStyle = C.ink; c.globalAlpha = fade;
        c.fillText(fitText(c, [TUR_ADI[b.tur], TUR_KISA[b.tur]], b.w), b.x + b.w / 2, b.y - 11);
        c.fillStyle = b.tur === 'tek' ? C.cyan : (b.tur === 'cok' ? C.lime : C.yellow);
        c.font = '800 14px ' + C.font;
        var v = fmtMfp(b.tur);
        c.fillText(fitText(c, uzun ? ['Mean free path: ' + v] : ['Yol: ' + v, v], b.w), b.x + b.w / 2, b.y + b.h + 14);
        c.globalAlpha = 1;
        // bekleyen elektron (kutunun solunda)
        if (!electrons.some(function(e){ return e.bi === bi && e.alive; })) {
          c.fillStyle = C.yellow; c.globalAlpha = 0.5 * fade;
          c.beginPath(); c.arc(b.x + 4, b.y + b.h / 2, 4, 0, 6.2832); c.fill();
          c.globalAlpha = 1;
        }
      });
      // izler
      electrons.forEach(function(e){
        var b = boxes[e.bi]; if (!b) return;
        var n = e.trail.length;
        c.lineWidth = 2; c.lineCap = 'round';
        for (var i = 1; i < n; i++) {
          c.strokeStyle = C.yellow;
          c.globalAlpha = (e.alive ? 0.15 : 0.12) + 0.6 * (i / n) * (e.alive ? 1 : 0.5);
          c.beginPath();
          c.moveTo(b.x + e.trail[i - 1][0] * b.sc, b.y + e.trail[i - 1][1] * b.sc);
          c.lineTo(b.x + e.trail[i][0] * b.sc, b.y + e.trail[i][1] * b.sc);
          c.stroke();
        }
        c.globalAlpha = 1;
        if (e.alive) {
          c.save();
          c.shadowColor = C.yellow; c.shadowBlur = 10; c.fillStyle = C.ink;
          c.beginPath(); c.arc(b.x + e.x * b.sc, b.y + e.y * b.sc, 3.6, 0, 6.2832); c.fill();
          c.restore();
        }
      });
      // saçılma halkaları
      flashes.forEach(function(f){
        var b = boxes[f.bi]; if (!b) return;
        c.strokeStyle = C.magenta; c.lineWidth = 2; c.globalAlpha = 1 - f.t / 14;
        c.beginPath(); c.arc(b.x + f.x * b.sc, b.y + f.y * b.sc, 3 + f.t * 0.9, 0, 6.2832); c.stroke();
      });
      c.globalAlpha = 1;
    }

    function frame(){
      raf = 0;
      if (dead) return;
      var active = false;
      electrons.forEach(function(e){
        if (!e.alive) return;
        for (var k = 0; k < STEPS_PER_FRAME && e.alive; k++) advance(e);
        if (e.alive) active = true;
      });
      flashes.forEach(function(f){ f.t++; });
      flashes = flashes.filter(function(f){ return f.t < 14; });
      if (fade < 1) { fade = Math.min(1, fade + 1 / 40); active = true; }
      draw();
      updateButtons();
      if (active || flashes.length) raf = requestAnimationFrame(frame);
    }

    function kick(){ if (!raf && !dead) raf = requestAnimationFrame(frame); }

    /* ---------- kontroller ---------- */
    var buttons = [];
    function buildBar(){
      listeners = listeners.filter(function(l){
        l[0].removeEventListener(l[1], l[2]); return false;
      });
      bar.textContent = ''; buttons = [];
      function btn(label, fn, aria){
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'sim-kt-btn'; b.textContent = label;
        if (aria) b.setAttribute('aria-label', aria);
        on(b, 'click', fn);
        bar.appendChild(b); buttons.push(b);
        return b;
      }
      if (mod === 'tur') {
        btn('Tek', function(){ send('tek'); }, 'Tek kristale elektron gönder');
        btn('Çok', function(){ send('cok'); }, 'Çok kristalliye elektron gönder');
        btn('Amorf', function(){ send('amorf'); }, 'Amorfa elektron gönder');
      } else {
        btn('Gönder', sendAll, '30 elektron gönder');
      }
      var note = document.createElement('span');
      note.className = 'sim-kt-note'; note.textContent = 'oyun modeli';
      bar.appendChild(note);
    }

    function updateButtons(){
      if (mod !== 'serbest_yol' || !buttons[0]) return;
      var busy = electrons.some(function(e){ return e.alive; });
      buttons[0].disabled = busy;
    }

    /* ---------- kurulum ---------- */
    buildBar();
    layout();
    if (typeof api.hint === 'function') {
      api.hint(mod === 'tur' ? 'Her türe bir elektron gönder, saçılmaları say.' : 'Gönder: tek mi çok kristalli mi daha uzağa gider?');
    }
    draw();

    var ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(function(){
        if (dead) return;
        var rect = cv.getBoundingClientRect();
        if (Math.round(rect.width) === W && Math.round(rect.height) === H) return;
        layout(); draw();
      });
      ro.observe(host);
    }

    if (params.gonder || base.gonder) {
      later(function(){ if (mod === 'tur') { send('tek'); send('cok'); send('amorf'); } else sendAll(); }, 350);
    }

    return {
      destroy: function(){
        if (dead) return;
        dead = true;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        timers.forEach(clearTimeout); timers = [];
        listeners.forEach(function(l){ l[0].removeEventListener(l[1], l[2]); });
        listeners = [];
        if (ro) ro.disconnect();
        ro = null;
        electrons = []; flashes = [];
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
        styleCount--;
        if (styleCount <= 0) {
          var st = document.getElementById('sim-kt-style');
          if (st && st.parentNode) st.parentNode.removeChild(st);
          styleCount = 0;
        }
      },
      getState: function(){
        return { mod: mod, serbestYol: olcum(), denenen: ['tek', 'cok', 'amorf'].filter(function(t){ return stats[t].runs > 0; }),
          calisiyor: electrons.some(function(e){ return e.alive; }), tamamlandi: doneCalled };
      },
      set: function(p){
        if (dead || !p) return;
        if (p.basari !== undefined) basari = p.basari;
        var yeniMod = p.mod === 'serbest_yol' ? 'serbest_yol' : (p.mod === 'tur' ? 'tur' : mod);
        if (yeniMod !== mod) {
          mod = yeniMod; electrons = []; flashes = [];
          fade = reduce() ? 1 : 0;
          buildBar(); layout();
          if (typeof api.hint === 'function') {
            api.hint(mod === 'tur' ? 'Her türe bir elektron gönder, saçılmaları say.' : 'Gönder: tek mi çok kristalli mi daha uzağa gider?');
          }
          draw(); kick();
        }
        if (p.gonder) later(function(){ if (mod === 'tur') { send('tek'); send('cok'); send('amorf'); } else sendAll(); }, 1000);
      }
    };
  }

  Q.sim.register('kristal_tur', { mount: mount });
})();
