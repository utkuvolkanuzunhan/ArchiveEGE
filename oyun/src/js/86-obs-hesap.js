/* 86-obs-hesap.js · Engel işleyicisi: `hesap` (istasyon sonu hesap görevi, adım adım yönlendirmeli, öğretici).
 * Ekler: Q.obs.register('hesap', ...), Q.obsHesap {hataYaz(gorev, adimNo, ob, stId), kontrol}.
 * Veri: engel {id, tip:'hesap', baslik, hesapGorev:'gorevId'} + Q.data.hesap (87-data-hesap.js, Q.hesap.gorev(id)).
 * Örnek çözüm: görev başlamadan önce 'Önce bir örnek' paneli (Yöntem + FARKLI sayılarla çözülmüş örnek, ileri/geri; Q.tekrarHesap.ornekPanel),
 *   altta 'Hazırım, görevi göster'. hikayeAtla'dan ETKİLENMEZ (yalnız küçük 'Örneği geç' düğmesi var). Görev sırasında 'Örneği tekrar göster';
 *   yanlış adımda 'Örnekteki N. adıma bak'. gorev.sonucSoru varsa adımlardan sonra 'Sonuç kontrolü' adımı eklenir.
 * Akış: görev metni (EN) + verilenler solda sürekli görünür; sağda adımlar: her adimSoru sorulur (sayı ya da seçenek),
 *   doğruysa çözüm metni/formülü açılır ve sonraki adım gelir; yanlışsa "Cevabın yanlış. Doğru: ..." + "Adımı göster".
 *   CEZA/CAN KAYBI YOK. Yanlış adım hata defterine yazılır (kavram 'hesap_<konu>', hesap:<gorevId>, adim:<no>).
 *   Bitince Q.state.hesapCalisma[gorevId] = 'cozdum' (yanlış adım olduysa 'tekrar'; var olan 'cozdum' düşürülmez).
 * Atla/geri: runner'ın Esc menüsü işleyici sözünü yarıştırır; DOM dock'tan silinince dinleyiciler kendini temizler. */
(function(){
  'use strict';
  var Q = window.Q;

  function el(tag, cls, text){ var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function safe(fn){ try { return fn(); } catch (e) { return undefined; } }
  function yaz(host, metin){
    if (Q.tekrarHesap && Q.tekrarHesap.yaz) return Q.tekrarHesap.yaz(host, metin);
    host.textContent = String(metin == null ? '' : metin).replace(/[\^_]\{([^{}]*)\}/g, '$1'); return host;
  }
  function p(cls, metin, tag){ return yaz(el(tag || 'div', cls), metin); }
  function duz(s){ return String(s == null ? '' : s).replace(/[\^_]\{([^{}]*)\}/g, '$1'); }
  function kontrol(girdi, hedef, tol){
    if (Q.tekrarHesap && Q.tekrarHesap.kontrol) return Q.tekrarHesap.kontrol(girdi, hedef, tol);
    var v = parseFloat(String(girdi).replace(',', '.')), t = tol == null ? 0.02 : tol;
    if (!isFinite(v)) return { ok: false, gecersiz: true, v: v };
    return { ok: Math.abs(v - hedef) <= t * Math.abs(hedef), v: v, ters: false };
  }
  function sayiYaz(v){
    if (typeof v !== 'number') return String(v);
    var a = Math.abs(v);
    if (a !== 0 && (a < 1e-3 || a >= 1e6)) { var s = v.toExponential(3).replace(/\.?0+e/, 'e'); var m = /^(-?[\d.]+)e([+-]?)(\d+)$/.exec(s); return m ? m[1] + '×10^{' + (m[2] === '-' ? '-' : '') + m[3] + '}' : s; }
    return String(Math.round(v * 1e4) / 1e4).replace('.', ',');
  }

  /* ---------- hata defteri (geriye uyumlu: yeni isteğe bağlı alanlar hesap, adim) ---------- */
  function hataYaz(gorev, adimNo, ob, stId){
    var s = Q.state; if (!s || !Array.isArray(s.hataDefteri)) return null;
    var kavram = 'hesap_' + gorev.konu, d = s.hataDefteri, k = null, i;
    for (i = 0; i < d.length; i++) if (d[i].kavram === kavram && d[i].hesap === gorev.id && !d[i].cozuldu) { k = d[i]; break; }
    if (k) { k.tekrar = (k.tekrar || 0) + 1; k.adim = adimNo; }
    else {
      var n = 0; d.forEach(function(r){ var m = /^hd-(\d+)$/.exec(r.id); if (m) n = Math.max(n, +m[1]); });
      k = { id: 'hd-' + (n + 1), kavram: kavram, istasyon: stId || gorev.istasyon || null, tur: 'yanlis',
        engel: (ob && ob.id) || null, hesap: gorev.id, adim: adimNo, tarih: Date.now(), tekrar: 0, cozuldu: false };
      d.push(k);
    }
    safe(function(){ Q.bus.emit('hata:add', { kayit: k }); });
    safe(function(){ Q.save.write(); });
    return k;
  }

  function css(){
    if (document.getElementById('hg-css')) return;
    var s = el('style'); s.id = 'hg-css';
    s.textContent = '.hg-kok{display:flex;flex-direction:column;gap:6px;min-height:0;flex:1 1 auto;padding:2px 4px}' +
      '.hg-ust{display:flex;align-items:center;gap:10px;flex:0 0 auto}.hg-ust b{font-family:var(--font-d);font-size:20px;color:var(--accent)}.hg-ust span{color:var(--muted);font-size:var(--fs-small)}' +
      '.hg-ilerle{flex:1;height:8px;border-radius:99px;background:var(--track);border:2px solid var(--line);overflow:hidden}.hg-ilerle i{display:block;height:100%;background:var(--good);width:0;transition:width .3s}' +
      '.hg-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:10px;flex:1 1 auto;min-height:0}' +
      '.hg-sol,.hg-sag{min-height:0;overflow:auto;display:flex;flex-direction:column;gap:6px}' +
      '.hg-soru{font-size:16px;line-height:1.35;padding:8px 10px;border:2px solid var(--line);border-radius:8px;background:var(--panel2);color:var(--ink)}' +
      '.hg-ver-b{color:var(--muted);font-size:var(--fs-small)}.hg-ver{margin:0;padding-left:20px;color:var(--cyan);font-size:15px}.hg-ver li{margin:1px 0}' +
      '.hg-adim{padding:6px 10px;border:2px solid var(--line);border-radius:8px;background:var(--panel2);display:flex;flex-direction:column;gap:5px}' +
      '.hg-adim.bitti{opacity:.82}.hg-adim h4{margin:0;color:var(--cyan);font-size:16px}.hg-adim p{margin:0}' +
      '.hg-formul{font-family:Georgia,"Times New Roman",serif;font-size:18px;padding:4px 10px;border-left:4px solid var(--yellow);background:rgba(255,255,255,.06);overflow-wrap:anywhere}.hg-formul sup,.hg-formul sub{font-size:.7em}' +
      '.hg-kod{margin:0;padding:6px 8px;border-radius:6px;background:rgba(0,0,0,.35);font:12px/1.35 monospace;white-space:pre-wrap;overflow:auto}' +
      '.hg-gir{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.hg-gir input{background:var(--panel2);color:var(--ink);border:2px solid var(--line);border-radius:8px;padding:5px 10px;font:inherit;width:170px}' +
      '.hg-opts{display:flex;flex-direction:column;gap:5px}.hg-opts .opt{min-height:34px;text-align:left}' +
      '.hg-fb{padding:5px 10px;border-radius:8px;border:2px solid var(--line);font-weight:700}.hg-fb.iyi{border-color:var(--good)}.hg-fb.kotu{border-color:var(--bad)}' +
      '.hg-sonuc{padding:8px 10px;border:2px solid var(--good);border-radius:8px;background:var(--panel2);font-size:17px;color:var(--ink)}' +
      '.hg-not{padding:8px 10px;border:2px solid var(--accent);border-radius:8px;background:var(--panel2);color:var(--ink)}' +
      '@media (max-width:760px){.hg-grid{grid-template-columns:1fr;overflow:auto}}';
    document.head.appendChild(s);
  }

  Q.obs.register('hesap', {
    tip: 'hesap',
    async enter(ob, ctx){
      var host = ctx.host, st = ctx.state || Q.state, stId = ctx.stationId;
      var gorev = Q.hesap && Q.hesap.gorev ? Q.hesap.gorev(ob.hesapGorev) : null;
      if (!gorev) {
        safe(function(){ Q.ui.toast('Hesap görevi bulunamadı, devam ediyoruz', { tur: 'kotu' }); });
        return { dogru: true, eminlik: 1, kavram: null, agirlik: 0, notlar: 'hesap-yok' };
      }
      css();
      var adimlar = gorev.adimlar.slice();
      if (gorev.sonucSoru) adimlar.push({ baslik: 'Sonuç kontrolü', metin: 'Hesabın sonunda bulduğun sayıyı kontrol et.', formul: gorev.sonuc.metin, adimSoru: gorev.sonucSoru });
      var yanlisAdim = 0, toplam = adimlar.length;
      host.textContent = '';
      var kok = el('div', 'hg-kok'); kok.dataset.gorev = gorev.id; host.appendChild(kok);
      var TH = Q.tekrarHesap;
      /* kök dock'un iç yüksekliğine sabitlenir: örnek paneli/kaplaması ve görev ızgarası içeride kayar, düğmeler hep görünür */
      function sigdir(){
        if (!kok.isConnected) { window.removeEventListener('resize', sigdir); return; }
        var d = kok.closest('#dock'); if (!d) return;
        var cs = getComputedStyle(d), h = d.clientHeight - parseFloat(cs.paddingTop || 0) - parseFloat(cs.paddingBottom || 0);
        if (h > 120) kok.style.height = Math.floor(h) + 'px';
      }
      sigdir(); window.addEventListener('resize', sigdir);
      /* 1) Örnek çözüm: görevden önce (hikayeAtla'ya bakmaz) */
      if (gorev.ornek && TH && TH.ornekPanel) {
        TH.css();
        await new Promise(function(res){
          kok.dataset.asama = 'ornek';
          TH.ornekPanel(kok, gorev, { birincil: 'Hazırım, görevi göster', gec: 'Örneği geç', bitir: function(){ res(); } });
        });
        if (!kok.isConnected) return { dogru: true, eminlik: 1, kavram: null, agirlik: 0 };
        kok.textContent = ''; kok.dataset.asama = 'gorev';
      }
      function ornekAc(adimNo){ if (gorev.ornek && TH && TH.ornekKaplama) TH.ornekKaplama(kok, gorev, adimNo || 0); }
      function ovlAcik(){ return !!kok.querySelector(':scope > .hc-ovl'); }
      /* üst şerit */
      var ust = el('div', 'hg-ust');
      ust.appendChild(el('b', '', 'Hesap görevi'));
      var sayac = el('span', '', ''); sayac.id = 'hg-sayac';
      var il = el('div', 'hg-ilerle'), ilI = el('i'); il.appendChild(ilI);
      ust.appendChild(sayac); ust.appendChild(il);
      if (gorev.ornek && TH && TH.ornekKaplama) { var ot = el('button', 'ho-link hg-ornek-tekrar', 'Örneği tekrar göster'); ot.type = 'button'; ot.addEventListener('click', function(){ ornekAc(0); }); ust.appendChild(ot); }
      kok.appendChild(ust);
      var grid = el('div', 'hg-grid'), sol = el('div', 'hg-sol'), sag = el('div', 'hg-sag');
      grid.appendChild(sol); grid.appendChild(sag); kok.appendChild(grid);
      /* sol: görev metni + verilenler (görev bitene kadar kalır) */
      var sr = p('hg-soru', gorev.soru); sr.id = 'hg-soru'; sol.appendChild(sr);
      if (gorev.veriler && gorev.veriler.length) {
        sol.appendChild(el('div', 'hg-ver-b', 'Verilenler (Given)'));
        var ul = el('ul', 'hg-ver'); ul.id = 'hg-veriler';
        gorev.veriler.forEach(function(v){ ul.appendChild(p('', v, 'li')); });
        sol.appendChild(ul);
      }
      function ilerleme(i){
        sayac.textContent = i < toplam ? 'Adım ' + (i + 1) + '/' + toplam : 'Tamam';
        ilI.style.width = Math.round(100 * Math.min(i, toplam) / toplam) + '%';
      }

      /* Enter ile devam: tek seferlik, host sökülünce kendini temizler */
      function bekleDevam(dugme, sec){
        return new Promise(function(res){
          var t0 = Date.now(), bitti = false;
          function fin(){ if (bitti) return; bitti = true; document.removeEventListener('keydown', onKey, true); res(); }
          function onKey(e){
            if (!dugme.isConnected) { document.removeEventListener('keydown', onKey, true); return; }
            if (e.key === 'Enter' && !ovlAcik() && Date.now() - t0 > 250 && !(e.target && e.target.tagName === 'INPUT' && !sec)) { e.preventDefault(); e.stopPropagation(); fin(); }
          }
          dugme.addEventListener('click', fin);
          document.addEventListener('keydown', onKey, true);
          try { dugme.focus(); dugme.scrollIntoView({ block: 'nearest' }); } catch (e) {}
        });
      }
      function acikla(kutu, adim, yer){
        yer.textContent = '';
        if (adim.metin) yer.appendChild(p('', adim.metin));
        if (adim.formul) yer.appendChild(p('hg-formul', adim.formul));
        if (adim.kod) yer.appendChild(el('pre', 'hg-kod', adim.kod));
        sag.scrollTop = sag.scrollHeight;
      }

      /* adım adım */
      for (var i = 0; i < toplam; i++) {
        var adim = adimlar[i], q = adim.adimSoru;
        ilerleme(i);
        var kutu = el('div', 'hg-adim'); kutu.dataset.adim = String(i + 1);
        kutu.appendChild(yaz(el('h4'), (i + 1) + '. ' + String(adim.baslik).replace(/^\s*\d+\s*[.)]\s*/, '')));
        var yer = el('div'); yer.style.cssText = 'display:flex;flex-direction:column;gap:5px';
        kutu.appendChild(yer); sag.appendChild(kutu);
        var ilkYanlis = true;
        if (q) {
          yer.appendChild(p('', q.soru));
          var fb = el('div'); fb.setAttribute('role', 'status'); fb.className = 'hg-fb-yer';
          var cozum = el('div'); cozum.style.cssText = 'display:flex;flex-direction:column;gap:5px';
          var sat = el('div', 'hg-gir'), dogruMetin, dogruSag = false, kontrolFn, giris = null, onay = null, secili = -1, optBtns = [];
          if (q.sayiCevap) {
            giris = el('input', 'hg-giris'); giris.type = 'text'; giris.setAttribute('inputmode', 'decimal'); giris.setAttribute('aria-label', 'Ara cevap');
            giris.placeholder = 'sayı' + (q.sayiCevap.birim ? ' (' + duz(q.sayiCevap.birim) + ')' : '');
            onay = el('button', 'btn primary hg-kontrol', 'Kontrol'); onay.type = 'button';
            dogruMetin = sayiYaz(q.sayiCevap.deger) + (q.sayiCevap.birim ? ' ' + q.sayiCevap.birim : '');
            kontrolFn = function(){
              var k = kontrol(giris.value, q.sayiCevap.deger, q.tolerans);
              if (k.gecersiz) return { gecersiz: true };
              return { ok: k.ok, ters: k.ters };
            };
            giris.addEventListener('keydown', function(e){ if (e.key === 'Escape') return; e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); onay.click(); } });
            sat.appendChild(giris); sat.appendChild(onay); yer.appendChild(sat);
          } else {
            var ops = el('div', 'hg-opts'); ops.setAttribute('role', 'group');
            var sirali = Q.util && Q.util.shuffle ? Q.util.shuffle(q.secenekler.map(function(s){ return s; })) : q.secenekler.slice();
            sirali.forEach(function(s, pos){
              var b = el('button', 'opt hg-sec'); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
              b.appendChild(el('span', 'num', String(pos + 1))); b.appendChild(el('span', 't', s.t));
              b.addEventListener('click', function(){
                if (dogruSag || b.disabled) return;
                secili = pos; optBtns.forEach(function(x, j){ x.setAttribute('aria-pressed', j === pos ? 'true' : 'false'); });
                onay.disabled = false;
              });
              optBtns.push(b); ops.appendChild(b);
            });
            onay = el('button', 'btn primary hg-kontrol', 'Onayla'); onay.type = 'button'; onay.disabled = true;
            dogruMetin = (q.secenekler.filter(function(s){ return s.dogru; })[0] || {}).t;
            kontrolFn = function(){ return secili < 0 ? { gecersiz: true } : { ok: !!sirali[secili].dogru }; };
            yer.appendChild(ops); sat.appendChild(onay); yer.appendChild(sat);
          }
          yer.appendChild(fb); yer.appendChild(cozum);
          var yardim = null;
          await new Promise(function(res){
            function dogruCoz(){ dogruSag = true; res(); }
            onay.addEventListener('click', function(){
              if (dogruSag) return;
              var k = kontrolFn();
              if (k.gecersiz) { fb.className = 'hg-fb kotu'; fb.textContent = q.sayiCevap ? 'Bir sayı gir (örnek: 1,5 ya da 2e-4).' : 'Önce bir şık seç.'; return; }
              if (k.ok) {
                fb.className = 'hg-fb iyi'; fb.textContent = 'Doğru.';
                if (giris) giris.disabled = true; onay.disabled = true; optBtns.forEach(function(x){ x.disabled = true; });
                dogruCoz();
              } else {
                if (ilkYanlis) { ilkYanlis = false; yanlisAdim++; hataYaz(gorev, i + 1, ob, stId); }
                fb.className = 'hg-fb kotu';
                fb.textContent = '';
                fb.appendChild(document.createTextNode('Cevabın yanlış. Doğru: '));
                var dm = el('span'); yaz(dm, dogruMetin); fb.appendChild(dm);
                fb.appendChild(document.createTextNode('.' + (k.ters ? ' (Mertebe ya da birim hatası olabilir.)' : '')));
                if (!yardim) {
                  yardim = el('div', 'hg-gir');
                  var ab = el('button', 'btn hg-adim-goster', 'Adımı göster'); ab.type = 'button';
                  ab.addEventListener('click', function(){ acikla(kutu, adim, cozum); ab.disabled = true; });
                  var dv = el('button', 'btn primary hg-adim-devam', 'Devam'); dv.type = 'button';
                  yardim.appendChild(ab);
                  if (gorev.ornek) {
                    var no = Math.min(i + 1, gorev.ornek.adimlar.length);
                    var ob2 = el('button', 'btn hg-ornek-adim', 'Örnekteki ' + no + '. adıma bak'); ob2.type = 'button';
                    ob2.addEventListener('click', function(){ ornekAc(no); });
                    yardim.appendChild(ob2);
                  }
                  yardim.appendChild(dv); yer.appendChild(yardim);
                  dv.addEventListener('click', function(){ if (giris) giris.disabled = true; onay.disabled = true; optBtns.forEach(function(x){ x.disabled = true; }); dogruSag = true; acikla(kutu, adim, cozum); res(); });
                }
                if (giris) { giris.select(); giris.focus(); }
                sag.scrollTop = sag.scrollHeight;
              }
            });
            if (giris) { try { giris.focus({ preventScroll: true }); } catch (e) {} }
            else {
              function onNum(e){
                if (!kutu.isConnected) { document.removeEventListener('keydown', onNum); return; }
                if (ovlAcik()) return;
                var n = parseInt(e.key, 10);
                if (n >= 1 && n <= optBtns.length && !dogruSag) optBtns[n - 1].click();
                else if (e.key === 'Enter' && !onay.disabled && !dogruSag) { e.preventDefault(); onay.click(); }
              }
              document.addEventListener('keydown', onNum);
            }
          });
          if (!kutu.isConnected) return { dogru: true, eminlik: 1, kavram: null, agirlik: 0 };
          acikla(kutu, adim, cozum);
        } else {
          acikla(kutu, adim, yer);
        }
        /* sonraki adıma geçiş */
        var son = i + 1 >= toplam;
        var gec = el('button', 'btn primary hg-sonraki', son ? 'Sonucu göster' : 'Sonraki adım'); gec.type = 'button';
        var gs = el('div', 'hg-gir'); gs.appendChild(gec); kutu.appendChild(gs);
        sag.scrollTop = sag.scrollHeight;
        await bekleDevam(gec, true);
        if (!kutu.isConnected) return { dogru: true, eminlik: 1, kavram: null, agirlik: 0 };
        gs.parentNode && gs.parentNode.removeChild(gs);
        kutu.className += ' bitti';
      }

      /* sonuç */
      ilerleme(toplam);
      sol.textContent = ''; sag.textContent = '';
      var sr2 = p('hg-soru', gorev.soru); sol.appendChild(sr2);
      if (gorev.veriler && gorev.veriler.length) {
        sol.appendChild(el('div', 'hg-ver-b', 'Verilenler (Given)'));
        var ul2 = el('ul', 'hg-ver'); gorev.veriler.forEach(function(v){ ul2.appendChild(p('', v, 'li')); }); sol.appendChild(ul2);
      }
      var sn = p('hg-sonuc', 'Sonuç: ' + gorev.sonuc.metin); sn.id = 'hg-sonuc'; sag.appendChild(sn);
      var oz = el('div', 'hg-adim'); oz.appendChild(el('h4', '', 'Formül özeti'));
      adimlar.forEach(function(a){ if (a.formul) oz.appendChild(p('hg-formul', a.formul)); });
      sag.appendChild(oz);
      var nt = p('hg-not', 'Sınavda dikkat: ' + gorev.sinavNotu); nt.id = 'hg-not'; sag.appendChild(nt);
      /* Çözdüm işareti */
      if (!st.hesapCalisma || typeof st.hesapCalisma !== 'object' || Array.isArray(st.hesapCalisma)) st.hesapCalisma = {};
      var mevcut = st.hesapCalisma[gorev.id];
      st.hesapCalisma[gorev.id] = (yanlisAdim === 0 || mevcut === 'cozdum') ? 'cozdum' : 'tekrar';
      safe(function(){ Q.save.write(); });
      var alt = el('div', 'hg-gir'), dur = el('span', '');
      dur.style.color = 'var(--muted)';
      function durum(){ var d = st.hesapCalisma[gorev.id]; dur.textContent = d === 'cozdum' ? 'İşaret: Çözdüm ✓' : 'İşaret: Tekrar çalış ↻'; }
      var tk = el('button', 'btn hg-tekrar', 'Tekrar çalış'); tk.type = 'button';
      tk.addEventListener('click', function(){ st.hesapCalisma[gorev.id] = 'tekrar'; safe(function(){ Q.save.write(); }); durum(); });
      var cz = el('button', 'btn hg-cozdum', 'Çözdüm'); cz.type = 'button';
      cz.addEventListener('click', function(){ st.hesapCalisma[gorev.id] = 'cozdum'; safe(function(){ Q.save.write(); }); durum(); });
      var dev = el('button', 'btn primary hg-devam', 'Devam'); dev.type = 'button';
      alt.appendChild(cz); alt.appendChild(tk);
      if (Q.tekrar && Q.tekrarHesap && Q.tekrarHesap.sec) {
        var tm = el('button', 'btn hg-merkez', 'Tekrar Merkezi\'nde aç'); tm.type = 'button';
        tm.addEventListener('click', function(){ safe(function(){ Q.tekrarHesap.sec(gorev.id); Q.tekrar.git('hesap'); }); });
        alt.appendChild(tm);
      }
      alt.appendChild(dur); alt.appendChild(dev); sag.appendChild(alt); durum();
      sag.scrollTop = 0;
      await bekleDevam(dev, true);
      return { dogru: true, eminlik: 1, kavram: null, agirlik: 0, hesapDurum: 'tamam', yanlisAdim: yanlisAdim };
    }
  });

  Q.obsHesap = { hataYaz: hataYaz };
})();
