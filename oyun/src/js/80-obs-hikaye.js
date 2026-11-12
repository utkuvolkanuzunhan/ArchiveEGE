/* 80-obs-hikaye.js (H1) "hikaye" engeli: zaman kapısı, 3 satırlık sahne.
 * Ekler: Q.obs.handlers.hikaye (Q.obs.register ile). Çağırır: ctx.runway.anim/say, Q.art.cameo, Q.ui.toast.
 * Bağımlılık: 00-q.js. Hasar uygulamaz; Sonuc döndürür, asla reject etmez. */
(function(){
  'use strict';
  var Q = window.Q;

  function el(tag, cls, text){
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function cameo(id){
    try {
      if (id && id !== 'anlatici' && Q.art && typeof Q.art.cameo === 'function') {
        return Q.art.cameo(id, { cls: 'hk-cameo' }) || null;
      }
    } catch (e) {}
    return null;
  }
  function sleep(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }
  function sonuc(){ return { dogru: true, eminlik: 1, kavram: null, agirlik: 1, notlar: '' }; }

  async function enter(ob, ctx){
    try {
      var ayar = (ctx.state && ctx.state.ayarlar) || {};
      if (ayar.hikayeAtla) return sonuc();
      var satirlar = (ob.satirlar || []).slice(0, 3);
      try { await ctx.runway.anim('kapi-ac'); } catch (e) {}

      var host = ctx.host;
      host.textContent = '';
      var wrap = el('div', 'hk-sahne');
      wrap.style.cssText = 'display:flex;gap:16px;align-items:flex-start;padding:12px 16px;';
      var sol = el('div', 'hk-sol');
      sol.style.cssText = 'flex:1 1 auto;min-width:0;';
      var ust = el('div', 'hk-ust');
      ust.style.cssText = 'display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap;';
      var etiket = el('span', 'hk-etiket', (ob.yer || '') + ' · ' + (ob.yil != null ? ob.yil : ''));
      etiket.style.cssText = 'font-family:var(--font-d);font-size:20px;color:var(--accent-ink);background:var(--accent);border:var(--bw) solid var(--ink-dark);border-radius:var(--rs);padding:2px 12px;box-shadow:var(--shadow-sm);';
      ust.appendChild(etiket);
      if (ob.rivayet) {
        var riv = el('span', 'hk-rivayet', 'rivayet');
        riv.style.cssText = 'font-size:16px;font-weight:800;color:var(--ink);border:2px dashed var(--magenta);border-radius:var(--rs);padding:2px 10px;';
        ust.appendChild(riv);
      }
      sol.appendChild(ust);
      var liste = el('div', 'hk-liste');
      liste.setAttribute('aria-live', 'polite');
      liste.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
      sol.appendChild(liste);
      var alt = el('div', 'hk-alt');
      alt.style.cssText = 'margin-top:12px;min-height:44px;';
      sol.appendChild(alt);
      wrap.appendChild(sol);

      var kameoId = null, i;
      for (i = 0; i < satirlar.length; i++) {
        if (satirlar[i].kim && satirlar[i].kim !== 'anlatici' && satirlar[i].kim !== 'selin') { kameoId = satirlar[i].kim; break; }
      }
      if (!kameoId) for (i = 0; i < satirlar.length; i++) {
        if (satirlar[i].kim && satirlar[i].kim !== 'anlatici') { kameoId = satirlar[i].kim; break; }
      }
      var svg = cameo(kameoId);
      if (svg) {
        var sag = el('div', 'hk-sag');
        sag.style.cssText = 'flex:0 0 auto;width:clamp(110px,14vw,170px);';
        sag.innerHTML = svg; /* Q.art.cameo kendi ürettiği güvenilir SVG; kullanıcı girdisi değil */
        wrap.appendChild(sag);
      }
      host.appendChild(wrap);

      var ilerle = null, bitti = false;
      function onKey(e){ if (!wrap.isConnected) { document.removeEventListener('keydown', onKey); return; } if (e.key === 'Enter' && !bitti && ilerle) { e.preventDefault(); ilerle(); } }
      document.addEventListener('keydown', onKey);
      wrap.addEventListener('click', function(){ if (!bitti && ilerle) ilerle(); });

      for (var n = 0; n < satirlar.length; n++) {
        var sr = satirlar[n];
        var balon = el('div', 'hk-balon');
        balon.style.cssText = 'display:flex;gap:10px;align-items:center;background:var(--bubble);color:var(--bubble-ink);border:var(--bw) solid var(--bubble-line);border-radius:var(--r);box-shadow:4px 4px 0 var(--bubble-shadow);padding:8px 12px;font-size:var(--fs-body);font-weight:700;opacity:0;transition:opacity .4s;';
        if (sr.kim && sr.kim !== 'anlatici') {
          balon.appendChild(el('b', 'hk-kim', String(sr.kim).charAt(0).toUpperCase() + String(sr.kim).slice(1) + ':'));
        }
        balon.appendChild(el('span', 'hk-metin', sr.metin));
        liste.appendChild(balon);
        void balon.offsetWidth;
        balon.style.opacity = '1';
        try { ctx.runway.say(sr.kim, sr.metin); } catch (e) {}
        await sleep(250);
        await new Promise(function(res){
          var t = setTimeout(function(){ ilerle = null; res(); }, 1400);
          ilerle = function(){ clearTimeout(t); ilerle = null; res(); };
        });
      }

      bitti = true;
      document.removeEventListener('keydown', onKey);
      if (ob.onBilgi && ob.onBilgi.length && Q.onBilgi) {
        await Q.onBilgi.goster(host, ob.onBilgi);
        host.textContent = '';
        host.appendChild(wrap);
      }
      await new Promise(function(res){
        var b = el('button', 'hk-devam', 'Devam');
        b.type = 'button';
        b.style.cssText = 'font-family:var(--font-d);font-size:20px;background:var(--accent);color:var(--accent-ink);border:var(--bw) solid var(--ink-dark);border-radius:var(--rs);padding:8px 22px;box-shadow:var(--shadow-sm);cursor:pointer;';
        function onEnter(e){ if (!b.isConnected) { document.removeEventListener('keydown', onEnter); return; } if (e.key === 'Enter') { e.preventDefault(); bitir(); } }
        function bitir(){ document.removeEventListener('keydown', onEnter); res(); }
        b.addEventListener('click', bitir);
        document.addEventListener('keydown', onEnter);
        alt.appendChild(b);
        b.focus();
      });
      return sonuc();
    } catch (err) {
      try { if (Q.ui && Q.ui.toast) Q.ui.toast('Sahne yüklenemedi, devam ediyoruz', { tur: 'kotu' }); } catch (e) {}
      return { dogru: false, eminlik: 1, kavram: null, agirlik: (ob && ob.agirlik) || 1, notlar: 'hata' };
    }
  }

  Q.obs.register('hikaye', { tip: 'hikaye', enter: enter });
})();
