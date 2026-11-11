/* 70-sim-czochralski.js (S2) Czochralski kristal çekme.
 * Q.sim.register("czochralski", ...) dışında bir şey yapmaz. */
(function(){
  'use strict';
  function kalite(v, rpm){ return 1 - 0.6 * Math.max(0, v - 1.0) - 0.3 * Math.abs(rpm - 15) / 15; }
  function kisit(x, a, b){ return Math.max(a, Math.min(b, x)); }

  var impl = {
    mount: function(host, params, api){
      params = params || {}; api = api || {};
      var b0 = params.baslangic || {};
      var v = kisit(+(params.v != null ? params.v : (b0.v != null ? b0.v : 0.6)), 0.2, 2.0);
      var rpm = kisit(+(params.rpm != null ? params.rpm : (b0.rpm != null ? b0.rpm : 15)), 0, 30);
      var ilerle = 0.4, cekiyor = false, tamam = false, sonQ = null, bitti = false, destroyed = false;
      var raf = 0, ro = null, onWin = null, ang = 0, tPrev = 0, gecis = null;

      host.innerHTML = '';
      var wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;flex-direction:column;gap:8px;width:100%;';
      var cv = document.createElement('canvas');
      cv.style.cssText = 'display:block;width:100%;height:clamp(180px,22vh,260px);background:var(--track,#0b0620);border:3px solid var(--line,#f4f0ff);border-radius:10px;';
      cv.setAttribute('role','img');
      var bar = document.createElement('div');
      bar.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;';
      wrap.appendChild(cv); wrap.appendChild(bar); host.appendChild(wrap);

      var fb = 'font:700 16px var(--font-b,Nunito,sans-serif);color:var(--ink,#fff);';
      function slider(etiket, min, max, step, val, fn){
        var l = document.createElement('label');
        l.style.cssText = 'display:flex;flex-direction:column;gap:2px;flex:1 1 150px;' + fb;
        var t = document.createElement('span');
        var r = document.createElement('input');
        r.type = 'range'; r.min = min; r.max = max; r.step = step; r.value = val;
        r.style.cssText = 'width:100%;min-height:40px;accent-color:var(--cyan,#00e5ff);';
        r.addEventListener('input', function(){ gecis = null; fn(+r.value); guncelle(); });
        l.appendChild(t); l.appendChild(r); bar.appendChild(l);
        return { l: l, t: t, r: r, etiket: etiket };
      }
      var sV = slider('Çekme hızı', 0.2, 2.0, 0.05, v, function(x){ v = x; yeniden(); });
      var sR = slider('Dönme', 0, 30, 1, rpm, function(x){ rpm = x; yeniden(); });
      var btn = document.createElement('button');
      btn.type = 'button'; btn.textContent = 'Çek';
      btn.style.cssText = 'min-height:40px;padding:0 20px;font:700 16px var(--font-b,Nunito,sans-serif);color:var(--accent-ink,#0b0620);background:var(--accent,#ffd23f);border:3px solid var(--line,#f4f0ff);border-radius:8px;cursor:pointer;';
      btn.addEventListener('click', cek);
      bar.appendChild(btn);
      var info = document.createElement('div');
      info.style.cssText = 'flex:1 1 100%;' + fb;
      info.setAttribute('aria-live','polite');
      bar.appendChild(info);
      var note = document.createElement('span');
      note.textContent = 'oyun modeli';
      note.style.cssText = 'font:600 16px var(--font-b,Nunito,sans-serif);color:var(--muted,#c4b9ec);';
      bar.appendChild(note);

      function col(n, f){ try { var x = getComputedStyle(host).getPropertyValue(n).trim(); return x || f; } catch (e) { return f; } }
      function yeniden(){ if (!cekiyor) { tamam = false; sonQ = null; ilerle = 0.4; } }
      function Qn(){ return kalite(v, rpm); }

      function guncelle(){
        if (destroyed) return;
        sV.t.textContent = sV.etiket + ': ' + v.toFixed(2) + ' mm/dk';
        sR.t.textContent = sR.etiket + ': ' + Math.round(rpm) + ' devir/dk';
        sV.r.value = v; sR.r.value = rpm;
        var q = Qn();
        var s = 'Kalite Q = ' + q.toFixed(2);
        if (tamam) s += ' · ' + (sonQ >= 0.9 ? 'Tek kristal ✓' : 'Tane sınırı ✗');
        else if (cekiyor) s += ' · çekiliyor…';
        else s += q >= 0.9 ? ' · tek kristal bekleniyor' : ' · çok kristalli riski';
        info.textContent = s;
        btn.disabled = cekiyor;
        btn.style.opacity = cekiyor ? '0.6' : '1';
        cv.setAttribute('aria-label', 'Czochralski: çekme hızı ' + v.toFixed(2) + ' mm/dk, dönme ' + Math.round(rpm) + ' devir/dk, kalite ' + q.toFixed(2));
        ciz();
      }

      function cek(){
        if (destroyed || cekiyor) return;
        ilerle = 0; tamam = false; sonQ = null; cekiyor = true; tPrev = 0;
        guncelle(); dongu();
      }
      function bitir(){
        cekiyor = false; tamam = true; ilerle = 1; sonQ = Qn();
        if (sonQ >= 0.9 && params.basari && params.basari.tekKristal && !bitti) {
          bitti = true;
          try { if (api.done) api.done({ basari: true, olcum: { v: v, rpm: rpm, Q: sonQ } }); } catch (e) {}
        }
        guncelle();
      }
      function dongu(){
        if (destroyed || raf) return;
        raf = requestAnimationFrame(function(t){
          raf = 0;
          if (destroyed) return;
          var dt = tPrev ? Math.min(0.05, (t - tPrev) / 1000) : 0.016; tPrev = t;
          ang += rpm * dt * 0.7;
          if (cekiyor) {
            ilerle += dt / (6.2 - 1.9 * v);
            if (ilerle >= 1) bitir();
          }
          if (gecis) {
            var k = Math.min(1, (t - gecis.t0) / 1000), e = k * k * (3 - 2 * k);
            v = gecis.v0 + (gecis.v1 - gecis.v0) * e; rpm = gecis.r0 + (gecis.r1 - gecis.r0) * e;
            if (k >= 1) gecis = null;
            guncelle();
          } else ciz();
          if (cekiyor || gecis) dongu();
        });
      }

      var W = 0, H = 0, dpr = 1;
      function boyutla(){
        if (destroyed) return;
        var r = cv.getBoundingClientRect();
        dpr = window.devicePixelRatio || 1;
        W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
        ciz();
      }

      function ciz(){
        if (destroyed || !W) return;
        var c = cv.getContext('2d');
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        c.clearRect(0, 0, W, H);
        var ink = col('--ink','#fff'), mut = col('--muted','#c4b9ec'), cy = col('--cyan','#00e5ff'),
            yel = col('--yellow','#ffd23f'), mag = col('--magenta','#ff3df0'), lime = col('--lime','#39ff88');
        var cx = W * 0.4, yMelt = H * 0.78;
        var cw = Math.min(W * 0.46, 200), ch = H * 0.2;
        c.fillStyle = '#ff8a3d';
        c.fillRect(cx - cw / 2 + 4, yMelt, cw - 8, ch * 0.75);
        c.strokeStyle = mut; c.lineWidth = 4; c.lineJoin = 'round';
        c.beginPath();
        c.moveTo(cx - cw / 2, yMelt - 4); c.lineTo(cx - cw / 2, yMelt + ch * 0.7);
        c.quadraticCurveTo(cx - cw / 2, yMelt + ch, cx - cw / 2 + 24, yMelt + ch);
        c.lineTo(cx + cw / 2 - 24, yMelt + ch);
        c.quadraticCurveTo(cx + cw / 2, yMelt + ch, cx + cw / 2, yMelt + ch * 0.7);
        c.lineTo(cx + cw / 2, yMelt - 4); c.stroke();
        c.fillStyle = '#ffd08a'; c.fillRect(cx - cw / 2 + 4, yMelt, cw - 8, 3);
        var iw = Math.min(cw * 0.34, 54), seedW = iw * 0.28;
        var maxH = yMelt - 34;
        var ih = 14 + (maxH - 14) * ilerle;
        var q = tamam ? sonQ : Qn();
        var tek = q >= 0.9;
        var yBot = yMelt + 2, yTop = yBot - ih;
        c.strokeStyle = mut; c.lineWidth = 2;
        c.beginPath(); c.moveTo(cx, 0); c.lineTo(cx, yTop - 12); c.stroke();
        c.fillStyle = '#8fd3ff'; c.fillRect(cx - seedW / 2, yTop - 12, seedW, 12);
        var grd = c.createLinearGradient(cx - iw / 2, 0, cx + iw / 2, 0);
        grd.addColorStop(0, tek ? '#6fb8e8' : '#7d8fb0'); grd.addColorStop(0.5, tek ? '#bfe6ff' : '#b4c0d8'); grd.addColorStop(1, tek ? '#6fb8e8' : '#7d8fb0');
        c.fillStyle = grd; c.fillRect(cx - iw / 2, yTop, iw, ih);
        c.save(); c.beginPath(); c.rect(cx - iw / 2, yTop, iw, ih); c.clip();
        if (!tek) {
          c.strokeStyle = mag; c.lineWidth = 2;
          var n = Math.max(3, Math.round(ih / 14)), i;
          for (i = 0; i < n; i++) {
            var y0 = yTop + (i + 0.5) * ih / n, sg = (i % 2) ? 1 : -1;
            c.beginPath(); c.moveTo(cx - iw / 2, y0 + sg * 8); c.lineTo(cx - iw * 0.1, y0 - sg * 4); c.lineTo(cx + iw / 2, y0 + sg * 10); c.stroke();
          }
          c.strokeStyle = '#0b0620'; c.lineWidth = 1.5;
          for (i = 0; i < 3; i++) {
            var yy = yTop + (i + 0.7) * ih / 3.4, xx = cx + (i - 1) * iw * 0.28;
            c.beginPath(); c.moveTo(xx, yy); c.lineTo(xx + 5, yy + 8); c.lineTo(xx - 3, yy + 15); c.stroke();
          }
        } else {
          c.fillStyle = 'rgba(255,255,255,0.45)';
          for (var gy = yTop + 6; gy < yBot; gy += 12) for (var gx = cx - iw / 2 + 6; gx < cx + iw / 2; gx += 12) { c.beginPath(); c.arc(gx, gy, 1.8, 0, 6.283); c.fill(); }
        }
        c.restore();
        c.strokeStyle = ink; c.lineWidth = 2; c.strokeRect(cx - iw / 2, yTop, iw, ih);
        if (rpm > 0.5) {
          c.strokeStyle = cy; c.lineWidth = 3;
          var ey = Math.max(16, yTop - 24);
          c.beginPath(); c.ellipse(cx, ey, iw * 0.9, 6, 0, ang, ang + 4.2); c.stroke();
        }
        var lx = cx + cw / 2 + 18, bw = Math.max(40, W - lx - 14), by = Math.round(H * 0.16);
        c.textBaseline = 'middle'; c.textAlign = 'left';
        c.font = '700 16px ' + col('--font-b','Nunito, sans-serif');
        c.fillStyle = mut; c.fillText('Q', lx, by);
        c.strokeStyle = ink; c.lineWidth = 2; c.strokeRect(lx + 20, by - 8, bw - 20, 16);
        c.fillStyle = tek ? lime : mag;
        c.fillRect(lx + 20, by - 8, (bw - 20) * kisit(q, 0, 1), 16);
        c.fillStyle = yel; c.fillRect(lx + 20 + (bw - 20) * 0.9 - 1, by - 12, 3, 24);
        if (tamam) {
          c.font = '400 ' + Math.round(Math.min(30, H * 0.12)) + 'px ' + col('--font-d','Impact, sans-serif');
          c.fillStyle = sonQ >= 0.9 ? lime : mag;
          c.fillText(sonQ >= 0.9 ? 'Tek kristal ✓' : 'Tane sınırı ✗', lx, H * 0.42);
        }
      }

      if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(boyutla); ro.observe(cv); }
      else { onWin = boyutla; window.addEventListener('resize', onWin); }
      if (api.hint) { try { api.hint('Yavaş çek, orta hızda döndür: Q en az 0,9 olsun.'); } catch (e) {} }
      boyutla(); guncelle();

      return {
        destroy: function(){
          destroyed = true;
          if (raf) { try { cancelAnimationFrame(raf); } catch (e) {} raf = 0; }
          if (ro) { try { ro.disconnect(); } catch (e) {} ro = null; }
          if (onWin) { window.removeEventListener('resize', onWin); onWin = null; }
          host.innerHTML = '';
        },
        getState: function(){ return { v: v, rpm: rpm, Q: Qn(), cekiyor: cekiyor, tamam: tamam, ilerle: ilerle }; },
        set: function(p){
          if (!p || destroyed) return;
          var v1 = p.v != null ? kisit(+p.v, 0.2, 2.0) : v, r1 = p.rpm != null ? kisit(+p.rpm, 0, 30) : rpm;
          yeniden();
          gecis = { t0: performance.now(), v0: v, v1: v1, r0: rpm, r1: r1 };
          dongu();
        }
      };
    }
  };
  if (typeof Q !== 'undefined' && Q.sim && Q.sim.register) Q.sim.register('czochralski', impl);
})();
