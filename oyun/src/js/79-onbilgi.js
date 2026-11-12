/* 79-onbilgi.js "Bilgi kartı" gezgini: hikaye/kavram engelinin opsiyonel ob.onBilgi alanını gösterir.
 * Q.onBilgi.goster(host, kartlar, {son:'Devam'}) -> Promise (kartlar bitince çözülür). Ok tuşları/Enter/düğmeler.
 * Kartlar: [{ baslik, madde:[...] }] (1-3 sayfa). Esc'e dokunmaz (çalıştırıcı menüsü çalışır).
 * Q.onBilgi.hepsi(stationId) -> istasyondaki tüm kartların düz listesi (Tekrar Merkezi için). */
(function(){
  'use strict';
  var Q = window.Q;
  function el(tag, cls, text){ var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function goster(host, kartlar, opt){
    kartlar = (kartlar || []).slice(0, 12);
    if (!kartlar.length) return Promise.resolve();
    opt = opt || {};
    return new Promise(function(res){
      var i = 0, t0 = Date.now(), bitti = false;
      host.textContent = '';
      var wrap = el('div', 'ob-onbilgi');
      wrap.style.cssText = 'padding:10px 16px;max-height:100%;overflow:auto;';
      var ust = el('div', 'ob-onbilgi-ust');
      ust.style.cssText = 'display:flex;gap:10px;align-items:center;margin-bottom:8px;flex-wrap:wrap;';
      var etiket = el('span', 'ob-onbilgi-etiket', 'Bilgi kartı');
      etiket.style.cssText = 'font-family:var(--font-d);font-size:18px;color:var(--accent-ink);background:var(--accent);border:var(--bw) solid var(--ink-dark);border-radius:var(--rs);padding:2px 12px;box-shadow:var(--shadow-sm);';
      var sayfa = el('span', 'ob-onbilgi-sayfa');
      sayfa.style.cssText = 'font-weight:800;font-size:15px;';
      ust.appendChild(etiket); ust.appendChild(sayfa);
      var baslik = el('h3', 'ob-onbilgi-baslik');
      baslik.style.cssText = 'margin:0 0 6px;font-family:var(--font-d);font-size:22px;';
      var liste = el('ul', 'ob-onbilgi-liste');
      liste.setAttribute('aria-live', 'polite');
      liste.style.cssText = 'margin:0 0 10px;padding-left:22px;display:flex;flex-direction:column;gap:5px;font-size:var(--fs-body);font-weight:700;line-height:1.3;';
      var alt = el('div', 'ob-onbilgi-alt');
      alt.style.cssText = 'display:flex;gap:10px;align-items:center;';
      function mk(txt, cls){ var b = el('button', 'btn' + (cls ? ' ' + cls : ''), txt); b.type = 'button'; return b; }
      var geri = mk('◀ Geri'), ileri = mk('İleri ▶', 'primary');
      geri.classList.add('ob-onbilgi-geri'); ileri.classList.add('ob-onbilgi-ileri');
      alt.appendChild(geri); alt.appendChild(ileri);
      wrap.appendChild(ust); wrap.appendChild(baslik); wrap.appendChild(liste); wrap.appendChild(alt);
      host.appendChild(wrap);

      function ciz(){
        var k = kartlar[i] || {};
        baslik.textContent = k.baslik || '';
        liste.textContent = '';
        (k.madde || []).slice(0, 4).forEach(function(m){ liste.appendChild(el('li', null, m)); });
        sayfa.textContent = (i + 1) + ' / ' + kartlar.length;
        geri.disabled = i === 0;
        ileri.textContent = i === kartlar.length - 1 ? (opt.son || 'Devam') : 'İleri ▶';
        try { ileri.focus(); } catch (e) {}
      }
      function bit(){
        if (bitti) return; bitti = true;
        if (opt.ref) opt.ref.bit = null;
        document.removeEventListener('keydown', key, true);
        host.textContent = '';
        res();
      }
      function sonra(){ if (i < kartlar.length - 1) { i++; ciz(); } else bit(); }
      function once(){ if (i > 0) { i--; ciz(); } }
      function key(e){
        if (e.key === 'ArrowRight') { e.preventDefault(); sonra(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); once(); }
        else if (e.key === 'Enter' && Date.now() - t0 > 250) { e.preventDefault(); e.stopPropagation(); sonra(); }
      }
      if (opt.ref) opt.ref.bit = bit;
      geri.addEventListener('click', once);
      ileri.addEventListener('click', sonra);
      document.addEventListener('keydown', key, true);
      ciz();
    });
  }

  /* İstasyon engellerinden kart listesi. alan: 'onBilgi' | 'nasil' | ikisi birden (varsayılan, engel sırasıyla).
   * 'nasil' = kavram engelindeki "Nasıl yapılır" sayfaları (tarif + çözülmüş örnek + sim kullanımı). */
  function topla(stationId, alanlar){
    var st = Q.data && Q.data.stations && Q.data.stations[stationId], out = [];
    ((st && st.engeller) || []).forEach(function(o){
      alanlar.forEach(function(a){ if (Array.isArray(o[a])) out = out.concat(o[a]); });
    });
    return out;
  }
  function hepsi(stationId){ return topla(stationId, ['onBilgi', 'nasil']); }
  function nasilKartlari(stationId){ return topla(stationId, ['nasil']); }
  /* Düğmeyle açılan kart seti: nasil varsa yalnızca onlar, yoksa (hepsi:true ise her zaman) bütün kartlar */
  function acKartlar(stationId, opt){
    var n = nasilKartlari(stationId);
    return (n.length && !(opt && opt.hepsi)) ? n : hepsi(stationId);
  }
  var acikOv = null;
  /* Üstte bir kaplama açar, kartları gezdirir, bitince/Kapat ile kapanır. Alttaki engel durumunu değiştirmez. */
  function ac(stationId, opt){
    var kartlar = acKartlar(stationId, opt);
    if (!kartlar.length || acikOv) return Promise.resolve();
    var ov = el('div', 'ob-onbilgi-kaplama');
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Bilgi kartları');
    ov.style.cssText = 'position:fixed;inset:0;z-index:55;background:rgba(11,6,32,.82);display:flex;align-items:center;justify-content:center;padding:12px;';
    var panel = el('div', 'ob-onbilgi-panel');
    panel.style.cssText = 'position:relative;background:var(--panel,#1a1033);color:var(--ink,#fff);border:var(--bw) solid var(--ink-dark);border-radius:var(--rs);box-shadow:var(--shadow-sm);max-width:780px;width:100%;max-height:94vh;overflow:auto;';
    var ref = {};
    var x = el('button', 'btn ob-onbilgi-kapat', '✕ Kapat'); x.type = 'button';
    x.style.cssText = 'position:absolute;top:8px;right:10px;z-index:2;';
    x.addEventListener('click', function(){ if (ref.bit) ref.bit(); });
    panel.appendChild(x);
    var govde = el('div'); panel.appendChild(govde); ov.appendChild(panel);
    document.body.appendChild(ov); acikOv = ov;
    return goster(govde, kartlar, { son: 'Kapat', ref: ref }).then(function(){
      if (ov.parentNode) ov.parentNode.removeChild(ov); acikOv = null;
    });
  }
  function var_(stationId, opt){ return acKartlar(stationId, opt).length > 0; }
  /* Küçük "Nasıl yapılır?" düğmesi; tıklayınca ac(). etiket verilmezse 'Nasıl yapılır?' */
  function dugme(stationId, etiket, opt){
    var b = el('button', 'btn ob-onbilgi-ac', etiket || 'Nasıl yapılır?'); b.type = 'button';
    b.setAttribute('aria-haspopup', 'dialog');
    b.addEventListener('click', function(){ ac(stationId, opt); });
    return b;
  }

  Q.onBilgi = { goster: goster, hepsi: hepsi, nasil: nasilKartlari, ac: ac, var: var_, dugme: dugme };
})();
