/* 80-obs-sandik.js (H1) "sandik" engeli: bilim insanı kartı, yeni makine, özet, kontrol noktası.
 * Ekler: Q.obs.handlers.sandik. Yazar: Q.state.kartlar, Q.state.fabrika.kurulu; çağırır Q.save.write.
 * Bağımlılık: 00-q.js, 10-state.js. Hasar uygulamaz; asla reject etmez. */
(function(){
  'use strict';
  var Q = window.Q;

  function el(tag, cls, text){
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function sleep(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }
  function box(){
    var d = el('div', 'sd-kutu');
    d.style.cssText = 'background:var(--panel2);color:var(--ink);border:var(--bw) solid var(--line);border-radius:var(--r);box-shadow:var(--shadow-sm);padding:8px 12px;font-size:var(--fs-body);opacity:0;transition:opacity .4s;';
    return d;
  }
  function goster(d){ void d.offsetWidth; d.style.opacity = '1'; }
  function cap(s){ s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }

  async function enter(ob, ctx){
    try {
      try { await ctx.runway.anim('zafer'); } catch (e) {}
      var st = ctx.state || Q.state;
      var ist = ctx.istasyon || {};
      var host = ctx.host;
      host.textContent = '';
      var wrap = el('div', 'sd-sahne');
      wrap.style.cssText = 'display:flex;flex-direction:column;gap:8px;padding:10px 16px;';
      host.appendChild(wrap);

      /* 1. Kart */
      var kart = ob.kart || {};
      var k1 = box();
      k1.style.display = 'flex'; k1.style.gap = '14px'; k1.style.alignItems = 'center';
      var pt = el('div', 'sd-portre');
      pt.style.cssText = 'flex:0 0 auto;width:96px;height:96px;';
      try {
        if (kart.id && Q.art && typeof Q.art.cameo === 'function') pt.innerHTML = Q.art.cameo(kart.id, { cls: 'sd-cameo' }) || ''; /* güvenilir SVG */
      } catch (e) {}
      k1.appendChild(pt);
      var kt = el('div', 'sd-kart');
      var ad = el('div', 'sd-kart-ad', cap(kart.id) + ' · ' + (kart.yil != null ? kart.yil : ''));
      ad.style.cssText = 'font-family:var(--font-d);font-size:22px;color:var(--accent);';
      kt.appendChild(ad);
      kt.appendChild(el('div', 'sd-kart-cumle', kart.tekCumle || ''));
      k1.appendChild(kt);
      wrap.appendChild(k1); goster(k1);
      if (kart.id && st.kartlar && st.kartlar.indexOf(kart.id) < 0) st.kartlar.push(kart.id);
      await sleep(600);

      /* 2. Fabrika */
      var k2 = box();
      k2.className += ' sd-fabrika';
      k2.style.borderColor = ist.renk || 'var(--accent2)';
      k2.appendChild(el('span', '', 'Yeni makine kuruldu: '));
      var mk = el('b', 'sd-makine', ist.makine || ist.ad || '');
      mk.style.color = 'var(--accent)';
      k2.appendChild(mk);
      wrap.appendChild(k2); goster(k2);
      var sid = ctx.stationId || ist.id;
      if (sid && st.fabrika && st.fabrika.kurulu.indexOf(sid) < 0) st.fabrika.kurulu.push(sid);
      await sleep(600);

      /* 3. Özet */
      var ozet = (ob.ozet || []).slice(0, 3);
      var ul = el('ul', 'sd-ozet');
      ul.style.cssText = 'margin:0;padding-left:22px;font-size:var(--fs-body);';
      wrap.appendChild(ul);
      for (var i = 0; i < ozet.length; i++) {
        var li = el('li', '', ozet[i]);
        li.style.cssText = 'opacity:0;transition:opacity .4s;';
        ul.appendChild(li); goster(li);
        await sleep(500);
      }

      /* 4. Kontrol noktası */
      var alt = el('div', 'sd-alt');
      alt.style.cssText = 'display:flex;gap:12px;align-items:center;margin-top:4px;';
      var rozet = el('span', 'sd-rozet', 'Kayıt alındı');
      rozet.style.cssText = 'font-weight:800;color:var(--ink-dark);background:var(--good);border:var(--bw) solid var(--ink-dark);border-radius:var(--rs);padding:2px 12px;box-shadow:var(--glow-lime);';
      alt.appendChild(rozet);
      try { if (Q.save && Q.save.write) Q.save.write(); } catch (e) {}
      wrap.appendChild(alt);

      await new Promise(function(res){
        var b = el('button', 'sd-devam', 'Devam');
        b.type = 'button';
        b.style.cssText = 'font-family:var(--font-d);font-size:20px;background:var(--accent);color:var(--accent-ink);border:var(--bw) solid var(--ink-dark);border-radius:var(--rs);padding:8px 22px;box-shadow:var(--shadow-sm);cursor:pointer;';
        function onEnter(e){ if (!b.isConnected) { document.removeEventListener('keydown', onEnter); return; } if (e.key === 'Enter') { e.preventDefault(); bitir(); } }
        function bitir(){ document.removeEventListener('keydown', onEnter); res(); }
        b.addEventListener('click', bitir);
        document.addEventListener('keydown', onEnter);
        alt.appendChild(b);
        b.focus();
      });
      return { dogru: true, eminlik: 1, kavram: null, agirlik: 1 };
    } catch (err) {
      try { if (Q.ui && Q.ui.toast) Q.ui.toast('Sandık açılamadı, devam ediyoruz', { tur: 'kotu' }); } catch (e) {}
      return { dogru: false, eminlik: 1, kavram: null, agirlik: (ob && ob.agirlik) || 1, notlar: 'hata' };
    }
  }

  Q.obs.register('sandik', { tip: 'sandik', enter: enter });
})();
