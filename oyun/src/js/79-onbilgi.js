/* 79-onbilgi.js "Bilgi kartı" gezgini: hikaye/kavram engelinin opsiyonel ob.onBilgi alanını gösterir.
 * Q.onBilgi.goster(host, kartlar, {son:'Devam'}) -> Promise (kartlar bitince çözülür). Ok tuşları/Enter/düğmeler.
 * Kartlar: [{ baslik, madde:[...] }] (1-3 sayfa). Esc'e dokunmaz (çalıştırıcı menüsü çalışır).
 * Q.onBilgi.hepsi(stationId) -> istasyondaki tüm kartların düz listesi (Tekrar Merkezi için). */
(function(){
  'use strict';
  var Q = window.Q;
  function el(tag, cls, text){ var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function goster(host, kartlar, opt){
    kartlar = (kartlar || []).slice(0, 3);
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
      geri.addEventListener('click', once);
      ileri.addEventListener('click', sonra);
      document.addEventListener('keydown', key, true);
      ciz();
    });
  }

  function hepsi(stationId){
    var st = Q.data && Q.data.stations && Q.data.stations[stationId], out = [];
    ((st && st.engeller) || []).forEach(function(o){ if (Array.isArray(o.onBilgi)) out = out.concat(o.onBilgi); });
    return out;
  }

  Q.onBilgi = { goster: goster, hepsi: hepsi };
})();
