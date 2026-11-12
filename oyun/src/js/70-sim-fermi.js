/* 70-sim-fermi.js (S13) Fermi-Dirac fonksiyonu f(E), T ve E_F kaydırıcıları, taşıyıcı dolumu (n, p, np=ni^2) ve elektrik alanı altında drift.
 * Q.sim.register("fermi", ...) dışında bir şey yapmaz. */
(function(){
  'use strict';
  var KB = 8.617333e-5;            /* eV/K */
  var EG = 1.1;                    /* eV (Si benzeri) */
  var NC = 2.8e19, NV = 1.0e19;    /* cm^-3 */
  var MUN = 1350, MUP = 480;       /* cm^2/(V s) */
  var TMIN = 50, TMAX = 600, EMAXF = 1000; /* V/cm */
  var EMIN = -0.4, EMAXE = EG + 0.4, TILT = 0.3;
  var NP = 22;

  function fermi(E, EF, T){
    var x = (E - EF) / (KB * T);
    if (x > 700) return 0;
    if (x < -700) return 1;
    return 1 / (1 + Math.exp(x));
  }
  /* log10 n, log10 p (EF: valans bandı üstünden ölçülür, Ec = EG) */
  function logn(EF, T){ return Math.log(NC) / Math.LN10 - (EG - EF) / (KB * T * Math.LN10); }
  function logp(EF, T){ return Math.log(NV) / Math.LN10 - EF / (KB * T * Math.LN10); }
  function ussu(x){ return '10^' + (Math.round(x * 10) / 10).toFixed(1).replace('-', '−'); }
  /* n/p: 1 cm⁻³'ten az taşıyıcı fiziksel olarak ≈ 0; üssü parantezde göster (öğrenciyi yanıltmasın) */
  function yogun(x){ return x < 0 ? '≈ 0 (' + ussu(x) + ')' : '= ' + ussu(x); }
  function clamp(v, a, b){ return v < a ? a : (v > b ? b : v); }

  var impl = {
    mount: function(host, params, api){
      params = params || {}; api = api || {};
      var b0 = params.baslangic || {};
      function pick(k, d){ return params[k] != null ? params[k] : (b0[k] != null ? b0[k] : d); }
      var T = clamp(+pick('T', 300), TMIN, TMAX);
      var EF = clamp(+pick('EF', EG / 2), 0, EG);
      var Ef = clamp(+pick('E', 0), 0, EMAXF);
      var T0goruldu = false, Egoruldu = false, bitti = false, destroyed = false, raf = 0, ro = null, onWin = null, tw = 0, lastT = 0;
      var parts = [], i;
      for (i = 0; i < NP; i++) parts.push({ x: Math.random(), y: Math.random(), u: Math.random() });

      host.innerHTML = '';
      var wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;flex-direction:column;gap:6px;width:100%;';
      var cv = document.createElement('canvas');
      cv.style.cssText = 'display:block;width:100%;height:clamp(180px,22vh,260px);background:var(--track,#0b0620);border:3px solid var(--line,#f4f0ff);border-radius:10px;';
      cv.setAttribute('role', 'img');
      var bar = document.createElement('div');
      bar.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;';
      wrap.appendChild(cv); wrap.appendChild(bar); host.appendChild(wrap);

      function mkSlider(aria, min, max, step, val, fn){
        var box = document.createElement('label');
        box.style.cssText = 'display:flex;align-items:center;gap:6px;font:700 15px var(--font-b,Nunito,sans-serif);color:var(--ink,#fff);';
        var tx = document.createElement('span');
        var s = document.createElement('input');
        s.type = 'range'; s.min = String(min); s.max = String(max); s.step = String(step); s.value = String(val);
        s.setAttribute('aria-label', aria);
        s.style.cssText = 'min-height:40px;width:110px;accent-color:var(--cyan,#00e5ff);';
        s.addEventListener('input', function(){ fn(parseFloat(s.value)); });
        box.appendChild(tx); box.appendChild(s); bar.appendChild(box);
        return { s: s, t: tx };
      }
      var sT = mkSlider('Temperature T (sıcaklık)', TMIN, TMAX, 5, T, function(v){ tw = 0; T = v; guncelle(); });
      var sF = mkSlider('Fermi level E_F (Fermi seviyesi)', 0, EG, 0.01, EF, function(v){ tw = 0; EF = v; guncelle(); });
      var sE = mkSlider('Electric field E (elektrik alanı)', 0, EMAXF, 10, Ef, function(v){ tw = 0; Ef = v; guncelle(); });
      var info = document.createElement('div');
      info.style.cssText = 'flex:1 1 100%;font:700 15px var(--font-b,Nunito,sans-serif);color:var(--ink,#fff);line-height:1.3;';
      bar.appendChild(info);
      var note = document.createElement('span');
      note.textContent = 'oyun modeli';
      note.style.cssText = 'font:600 14px var(--font-b,Nunito,sans-serif);color:var(--muted,#c4b9ec);';
      bar.appendChild(note);

      function col(n, fb){
        try { var v = getComputedStyle(host).getPropertyValue(n).trim(); return v || fb; } catch (e) { return fb; }
      }

      function guncelle(){
        if (destroyed) return;
        sT.t.textContent = 'T = ' + Math.round(T) + ' K';
        sF.t.textContent = 'E_F = ' + EF.toFixed(2).replace('.', ',') + ' eV';
        sE.t.textContent = 'E = ' + Math.round(Ef) + ' V/cm';
        if (!tw) { sT.s.value = String(T); sF.s.value = String(EF); sE.s.value = String(Ef); }
        var ln = logn(EF, T), lp = logp(EF, T), vd = MUN * Ef;
        info.textContent = 'f(E_F) = ½ · n ' + yogun(ln) + ' · p ' + yogun(lp) + ' cm⁻³ · np = nᵢ² ' + yogun(ln + lp)
          + ' · drift v_d = μ E = ' + (vd >= 1e5 ? (vd / 1e5).toFixed(1).replace('.', ',') + '×10⁵' : Math.round(vd)) + ' cm/s';
        cv.setAttribute('aria-label', 'Fermi-Dirac f(E) (Fermi-Dirac dağılımı) T=' + Math.round(T) + ' K, E_F=' + EF.toFixed(2) + ' eV, E=' + Math.round(Ef) + ' V/cm');
        if (T <= 60) T0goruldu = true;
        if (Ef > 0) Egoruldu = true;
        ciz();
        kontrolBasari();
      }
      function kontrolBasari(){
        if (bitti || !params.basari) return;
        if (params.basari.T0 && !T0goruldu) return;
        if (params.basari.E && !Egoruldu) return;
        bitti = true;
        try { if (api.done) api.done({ basari: true, olcum: { T: T, EF: EF, E: Ef } }); } catch (e) {}
      }

      var CW = 0, CH = 0, dpr = 1;
      function boyutla(){
        if (destroyed) return;
        var r = cv.getBoundingClientRect();
        dpr = window.devicePixelRatio || 1;
        CW = Math.max(1, Math.round(r.width)); CH = Math.max(1, Math.round(r.height));
        cv.width = Math.round(CW * dpr); cv.height = Math.round(CH * dpr);
        ciz();
      }
      function ciz(){
        if (destroyed || !CW) return;
        var c = cv.getContext('2d');
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        c.clearRect(0, 0, CW, CH);
        var cyan = col('--cyan', '#00e5ff'), mag = col('--magenta', '#ff3df0'), yel = col('--yellow', '#ffd23f'),
            lime = col('--lime', '#39ff88'), ink = col('--ink', '#ffffff'), muted = col('--muted', '#c4b9ec');
        var font = col('--font-b', 'Nunito, sans-serif');
        var top = 16, bot = CH - 20, ph = bot - top, k;
        function Y(e){ return bot - ((e - EMIN) / (EMAXE - EMIN)) * ph; }
        c.textBaseline = 'middle';
        /* sol: f(E) (E dikey, f yatay) */
        var fx0 = 34, fx1 = Math.max(fx0 + 60, CW * 0.34);
        function FX(f){ return fx0 + f * (fx1 - fx0); }
        c.globalAlpha = 0.14; c.fillStyle = mag; c.fillRect(fx0, top, fx1 - fx0, Math.max(0, Y(EG) - top));
        c.fillStyle = cyan; c.fillRect(fx0, Y(0), fx1 - fx0, bot - Y(0)); c.globalAlpha = 1;
        c.strokeStyle = muted; c.lineWidth = 1.5; c.globalAlpha = 0.7;
        c.beginPath(); c.moveTo(fx0, top); c.lineTo(fx0, bot); c.lineTo(fx1, bot); c.stroke();
        c.setLineDash([3, 4]); c.beginPath(); c.moveTo(FX(0.5), top); c.lineTo(FX(0.5), bot); c.stroke(); c.setLineDash([]);
        c.globalAlpha = 1;
        c.font = '700 13px ' + font; c.fillStyle = muted; c.textAlign = 'center';
        c.fillText('0', fx0, CH - 8); c.fillText('½', FX(0.5), CH - 8); c.fillText('1', fx1, CH - 8);
        c.textAlign = 'left'; c.fillText('E', 8, top + 2);
        c.strokeStyle = yel; c.lineWidth = 3; c.beginPath();
        var M = 160;
        for (k = 0; k <= M; k++) {
          var e = EMIN + (EMAXE - EMIN) * k / M, x = FX(fermi(e, EF, T)), y = Y(e);
          if (k === 0) c.moveTo(x, y); else c.lineTo(x, y);
        }
        c.stroke();
        c.fillStyle = yel; c.beginPath(); c.arc(FX(0.5), Y(EF), 5, 0, Math.PI * 2); c.fill();
        c.fillStyle = ink; c.textAlign = 'left'; c.fillText('f(E)', FX(0.5) + 8, top + 8);
        /* sağ: bant diyagramı */
        var bx0 = Math.max(fx1 + 20, CW * 0.4), bx1 = CW - 14;
        function tilt(u){ return TILT * (Ef / EMAXF) * (u - 0.5); }
        function BX(u){ return bx0 + u * (bx1 - bx0); }
        c.globalAlpha = 0.16; c.fillStyle = mag;
        c.beginPath(); c.moveTo(BX(0), top); c.lineTo(BX(1), top); c.lineTo(BX(1), Y(EG + tilt(1))); c.lineTo(BX(0), Y(EG + tilt(0))); c.closePath(); c.fill();
        c.fillStyle = cyan;
        c.beginPath(); c.moveTo(BX(0), bot); c.lineTo(BX(1), bot); c.lineTo(BX(1), Y(tilt(1))); c.lineTo(BX(0), Y(tilt(0))); c.closePath(); c.fill();
        c.globalAlpha = 1; c.lineWidth = 3;
        c.strokeStyle = mag; c.beginPath(); c.moveTo(BX(0), Y(EG + tilt(0))); c.lineTo(BX(1), Y(EG + tilt(1))); c.stroke();
        c.strokeStyle = cyan; c.beginPath(); c.moveTo(BX(0), Y(tilt(0))); c.lineTo(BX(1), Y(tilt(1))); c.stroke();
        c.strokeStyle = yel; c.lineWidth = 2; c.setLineDash([6, 5]);
        c.beginPath(); c.moveTo(fx0, Y(EF)); c.lineTo(bx1, Y(EF)); c.stroke(); c.setLineDash([]);
        c.font = '700 13px ' + font; c.fillStyle = ink; c.textAlign = 'left';
        c.fillText('conduction band (iletim bandı)', BX(0) + 4, top + 8);
        c.fillText('valence band (valans bandı)', BX(0) + 4, bot - 8);
        c.fillStyle = yel; c.textAlign = 'right';
        c.fillText('E_F', bx1, Y(EF) + (EF > EG * 0.5 ? 10 : -10));
        c.fillStyle = lime; c.textAlign = 'center';
        c.fillText('Eg = 1,1 eV', BX(0.5), (Y(EG) + Y(0)) / 2 + (Math.abs(EF - EG / 2) < 0.15 ? 20 : 0));
        /* taşıyıcılar: elektron (dolu daire) iletim bandında, delik (halka) valans bandında */
        var nd = clamp(Math.round(logn(EF, T) * 1.1), 0, NP), pd = clamp(Math.round(logp(EF, T) * 1.1), 0, NP);
        var kT = KB * T, r = 4.5;
        for (k = 0; k < NP; k++) {
          var p = parts[k], dy = 0.04 + Math.min(0.3, -Math.log(1 - 0.98 * p.u) * kT * 2);
          if (k < nd) {
            var ye = Y(EG + tilt(p.x) + dy);
            c.fillStyle = cyan; c.beginPath(); c.arc(BX(p.x), ye, r, 0, Math.PI * 2); c.fill();
          }
          if (k < pd) {
            var yh = Y(tilt(p.y) - dy);
            c.strokeStyle = mag; c.lineWidth = 2; c.beginPath(); c.arc(BX(p.y), yh, r, 0, Math.PI * 2); c.stroke();
          }
        }
        if (Ef > 0) {
          c.strokeStyle = ink; c.fillStyle = ink; c.lineWidth = 2;
          var ay = top + 8, ax0 = bx1 - 70, ax1 = ax0 + 12 + 30 * Ef / EMAXF;
          c.beginPath(); c.moveTo(ax0, ay); c.lineTo(ax1, ay); c.stroke();
          c.beginPath(); c.moveTo(ax1, ay); c.lineTo(ax1 - 6, ay - 4); c.lineTo(ax1 - 6, ay + 4); c.closePath(); c.fill();
          c.textAlign = 'right'; c.fillText('E', ax0 - 4, ay);
        }
        c.textAlign = 'right'; c.fillStyle = cyan; c.fillText('● e-', bx1 - 44, bot - 8);
        c.fillStyle = mag; c.fillText('○ h+', bx1, bot - 8);
      }

      function anim(t){
        if (destroyed) return;
        var dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0.016; lastT = t;
        var vis = Ef / EMAXF * 0.5;                 /* görsel drift hızı (genişlik/sn) */
        var jit = 0.05 * Math.sqrt(T / 300);
        for (var k = 0; k < NP; k++) {
          var p = parts[k];
          p.x += (-vis + (Math.random() - 0.5) * jit) * dt;       /* elektron: E'ye ters */
          p.y += (vis * (MUP / MUN) + (Math.random() - 0.5) * jit) * dt; /* delik: E yönünde */
          if (p.x < 0) p.x += 1;
          if (p.x > 1) p.x -= 1;
          if (p.y < 0) p.y += 1;
          if (p.y > 1) p.y -= 1;
          p.u = clamp(p.u + (Math.random() - 0.5) * 0.08, 0, 1);
        }
        if (tw) {
          var f = Math.min(1, (t - tw.t0) / 1000), e = f * f * (3 - 2 * f);
          T = tw.T0 + (tw.T1 - tw.T0) * e; EF = tw.F0 + (tw.F1 - tw.F0) * e; Ef = tw.E0 + (tw.E1 - tw.E0) * e;
          if (f >= 1) { tw = 0; T = Math.round(T); }
          guncelle();
        } else ciz();
        raf = requestAnimationFrame(anim);
      }

      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(boyutla); ro.observe(cv);
      } else { onWin = boyutla; window.addEventListener('resize', onWin); }
      if (api.hint) { try { api.hint('T düşünce f(E) step function (basamak fonksiyonu) olur; np = nᵢ² çarpımı E_F konumuna bağlı değildir.'); } catch (e) {} }
      boyutla(); guncelle();
      raf = requestAnimationFrame(anim);

      return {
        destroy: function(){
          destroyed = true;
          if (raf) { cancelAnimationFrame(raf); raf = 0; }
          if (ro) { try { ro.disconnect(); } catch (e) {} ro = null; }
          if (onWin) { window.removeEventListener('resize', onWin); onWin = null; }
          host.innerHTML = '';
        },
        getState: function(){ return { T: T, EF: EF, E: Ef, logn: logn(EF, T), logp: logp(EF, T), fEF: 0.5 }; },
        set: function(p){
          if (!p) return;
          tw = { t0: performance.now(), T0: T, T1: p.T != null ? clamp(+p.T, TMIN, TMAX) : T,
                 F0: EF, F1: p.EF != null ? clamp(+p.EF, 0, EG) : EF, E0: Ef, E1: p.E != null ? clamp(+p.E, 0, EMAXF) : Ef };
        }
      };
    }
  };
  if (typeof Q !== 'undefined' && Q.sim && Q.sim.register) Q.sim.register('fermi', impl);
})();
