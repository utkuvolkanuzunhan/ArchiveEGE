/* 98-tekrar-hesap.js · Tekrar Merkezi > "Hesap çalıştayı" sekmesi (sınav tarzı küçük hesaplar, adım adım).
 * Ekler: Q.tekrarHesap {sayfa(host), kontrol(girdi, hedef, tol), sayiOku(metin), yaz(el, metin), adimUI(host, adim, bitti)}.
 * Veri: Q.data.hesap (87-data-hesap.js). Kayıt: Q.state.hesapCalisma = {gorevId: 'cozdum' | 'tekrar'} (cip-hatti-v1,
 * geriye uyumlu isteğe bağlı üst düzey alan; yoksa boş sayılır). Ana oyun ilerlemesine dokunmaz. */
(function(){
  'use strict';
  var Q = (typeof window !== 'undefined' ? window : globalThis).Q;

  function el(tag, cls, text){ var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function btn(text, cls, fn){ var b = el('button', 'btn' + (cls ? ' ' + cls : ''), text); b.type = 'button'; if (fn) b.addEventListener('click', fn); return b; }

  /* ^{üst} ve _{alt} işaretlerini sup/sub'a çevirir (innerHTML yok). */
  function yaz(host, metin){
    (function r(h, s){
      var i = 0, buf = '';
      while (i < s.length) {
        var c = s.charAt(i);
        if ((c === '^' || c === '_') && s.charAt(i + 1) === '{') {
          var d = 1, j = i + 2;
          while (j < s.length && d > 0) { var ch = s.charAt(j); if (ch === '{') d++; else if (ch === '}') d--; j++; }
          if (d === 0) {
            if (buf) { h.appendChild(document.createTextNode(buf)); buf = ''; }
            var t = el(c === '^' ? 'sup' : 'sub'); r(t, s.slice(i + 2, j - 1)); h.appendChild(t); i = j; continue;
          }
        }
        if (c === '_' && i > 0 && /[A-Za-z\u0370-\u03ff)\u27e9]/.test(s.charAt(i - 1))) {
          /* süslüsüz alt indis: φ_1, E_n, E_F, K_max -> sub (harf/rakam öbeği) */
          var mm = /^[A-Za-z0-9]{1,4}/.exec(s.slice(i + 1));
          if (mm) {
            if (buf) { h.appendChild(document.createTextNode(buf)); buf = ''; }
            h.appendChild(el('sub', null, mm[0])); i += 1 + mm[0].length; continue;
          }
        }
        buf += c; i++;
      }
      if (buf) h.appendChild(document.createTextNode(buf));
    })(host, String(metin == null ? '' : metin));
    return host;
  }
  function p(cls, metin, tag){ return yaz(el(tag || 'div', cls), metin); }

  /* "1,5", "1.5e-4", "1,96×10^-8", "2e4 cm" gibi girdileri sayıya çevirir; olmazsa NaN. */
  function sayiOku(m){
    var s = String(m == null ? '' : m).trim().replace(/−/g, '-').replace(',', '.');
    var r = /^([+-]?\d*\.?\d+)\s*(?:[x×*]\s*10\s*\^?\s*\(?\s*([+-]?\d+)\s*\)?)?/i.exec(s);
    if (!r) return NaN;
    var v = parseFloat(r[1]);
    if (r[2] != null) return v * Math.pow(10, parseInt(r[2], 10));
    var e = /^[+-]?\d*\.?\d+e([+-]?\d+)/i.exec(s);
    return e ? parseFloat(s) : v;
  }
  function kontrol(girdi, hedef, tol){
    var v = typeof girdi === 'number' ? girdi : sayiOku(girdi);
    if (!isFinite(v)) return { ok: false, gecersiz: true, v: v };
    var t = tol == null ? 0.02 : tol, fark = Math.abs(v - hedef);
    return { ok: hedef === 0 ? fark <= 1e-12 : fark <= t * Math.abs(hedef), v: v, ters: v !== 0 && hedef !== 0 && Math.abs(Math.log10(Math.abs(v / hedef))) > 0.9 };
  }

  function kayit(){ if (!Q.state.hesapCalisma || typeof Q.state.hesapCalisma !== 'object' || Array.isArray(Q.state.hesapCalisma)) Q.state.hesapCalisma = {}; return Q.state.hesapCalisma; }
  function isaretle(id, d){ var k = kayit(); if (d) k[id] = d; else delete k[id]; if (Q.save && Q.save.write) Q.save.write(); }

  function css(){
    if (document.getElementById('hc-css')) return;
    var s = el('style'); s.id = 'hc-css';
    s.textContent = '.hc-wrap{display:flex;gap:12px;flex:1;min-height:0}.hc-sol{flex:0 0 290px;display:flex;flex-direction:column;gap:8px;min-height:0}.hc-sag{flex:1;min-width:0;overflow:auto;display:flex;flex-direction:column;gap:10px;padding-right:4px}' +
      '.hc-liste{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:6px}.hc-sol select{width:100%;background:var(--panel2);color:var(--ink);border:2px solid var(--line);border-radius:8px;padding:6px 8px;font:inherit}' +
      '.hc-it{text-align:left;padding:6px 10px;border:2px solid var(--line);border-radius:8px;background:var(--panel2);color:var(--ink);font:inherit;cursor:pointer;display:flex;flex-direction:column;gap:2px}.hc-it[aria-current=true]{border-color:var(--cyan);background:var(--sel)}' +
      '.hc-it small{color:var(--muted)}.hc-it .cz{color:var(--lime)}.hc-it .tk{color:var(--yellow)}' +
      '.hc-bas{margin:0;font-family:var(--font-d);font-size:22px;color:var(--yellow)}.hc-soru{font-size:18px;line-height:1.35;padding:10px 12px;border:2px solid var(--line);border-radius:8px;background:var(--panel2)}' +
      '.hc-ver{margin:0;padding-left:20px;color:var(--cyan)}.hc-ver li{margin:2px 0}' +
      '.hc-gir{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.hc-gir input{background:var(--panel2);color:var(--ink);border:2px solid var(--line);border-radius:8px;padding:6px 10px;font:inherit;width:190px}' +
      '.hc-adim{padding:10px 12px;border:2px solid var(--line);border-radius:8px;background:var(--panel2);display:flex;flex-direction:column;gap:6px}.hc-adim h4{margin:0;color:var(--cyan)}' +
      '.hc-formul{font-family:Georgia,"Times New Roman",serif;font-size:19px;padding:6px 10px;border-left:4px solid var(--yellow);background:rgba(255,255,255,.05);overflow-wrap:anywhere}.hc-formul sup,.hc-formul sub{font-size:.7em}' +
      '.hc-kod{margin:0;padding:8px 10px;border-radius:6px;background:rgba(0,0,0,.35);font:13px/1.4 monospace;white-space:pre-wrap;overflow:auto}' +
      '.hc-fb{padding:6px 10px;border-radius:8px;border:2px solid var(--line)}.hc-fb.iyi{border-color:var(--lime)}.hc-fb.kotu{border-color:var(--red)}' +
      '.hc-sonuc{padding:10px 12px;border:2px solid var(--lime);border-radius:8px;background:var(--panel2);font-size:18px}.hc-not{padding:10px 12px;border:2px solid var(--yellow);border-radius:8px;background:var(--panel2)}' +
      '@media (max-width:820px){.hc-wrap{flex-direction:column}.hc-sol{flex:none;max-height:240px}}' +
      /* örnek çözüm paneli (ho-) */
      '.hg-kok:has(>.ho-panel){overflow:hidden}.ho-panel{display:flex;flex-direction:column;gap:5px;min-height:0;flex:1 1 auto;overflow:hidden}.ho-ust{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;flex:0 0 auto}' +
      '.ho-ust b{font-family:var(--font-d);font-size:22px;color:var(--accent,var(--yellow))}.ho-ust span{color:var(--muted);font-size:var(--fs-small,13px)}' +
      '.ho-govde{flex:1 1 auto;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:6px;padding-right:4px}' +
      '.ho-kutu{padding:7px 10px;border:2px solid var(--line);border-radius:8px;background:var(--panel2);display:flex;flex-direction:column;gap:4px}' +
      '.ho-yontem{border-color:var(--yellow)}.ho-yontem h4,.ho-adim h4{margin:0;font-size:16px}.ho-yontem h4{color:var(--yellow)}.ho-adim h4{color:var(--cyan)}' +
      '.ho-yontem ol{margin:0;padding-left:22px;font-size:15px}.ho-yontem li{margin:0}.ho-soru{font-size:15px;line-height:1.35}' +
      '.ho-ver{margin:0;padding-left:20px;color:var(--cyan);font-size:14px}.ho-ver li{margin:0}' +
      '.ho-adim p{margin:0}.ho-adim.vurgu{border-color:var(--yellow);box-shadow:0 0 0 2px rgba(255,220,80,.35)}.ho-adim .ho-sn{color:var(--lime,var(--good));font-weight:700}' +
      '.ho-formul{font-family:Georgia,"Times New Roman",serif;font-size:17px;padding:3px 10px;border-left:4px solid var(--yellow);background:rgba(255,255,255,.06);overflow-wrap:anywhere}.ho-formul sup,.ho-formul sub{font-size:.7em}' +
      '.ho-sonuc{border-color:var(--lime,var(--good));font-size:16px}' +
      '.ho-alt{display:flex;gap:8px;align-items:center;flex-wrap:wrap;flex:0 0 auto;padding-top:4px}.ho-alt .ho-bos{flex:1}' +
      '.ho-hazir{font-size:17px;min-height:40px;padding:4px 20px}.ho-gec{font-size:12px;min-height:26px;padding:2px 10px;opacity:.8}' +
      '.hc-ovl{position:absolute;inset:0;z-index:20;background:var(--bg,#101820);padding:8px 10px;display:flex;flex-direction:column;min-height:0;border-radius:8px}' +
      '.ho-link{background:none;border:0;color:var(--cyan);text-decoration:underline;cursor:pointer;font:inherit;padding:2px 6px}';
    document.head.appendChild(s);
  }


  /* ---------- Örnek çözüm paneli: Yöntem + çözülmüş küçük kardeş, adım adım (ileri/geri). Ceza yok.
   * host: panelin gireceği kök; g: görev (g.ornek); o: {birincil:'Hazırım, görevi göster', gec:'Örneği geç'|null, bitir(neden:'hazir'|'gec'), adim:N (o adımı vurgula)} */
  function ornekPanel(host, g, o){
    css(); o = o || {};
    var ork = g.ornek, n = ork.adimlar.length;
    var st = o.adim ? Math.min(o.adim, n) : (o.tam ? n + 1 : 0), vurgu = o.adim || 0;
    var kok = el('div', 'ho-panel'); kok.dataset.gorev = g.id; host.appendChild(kok);
    var ust = el('div', 'ho-ust'); ust.appendChild(el('b', '', o.baslik || 'Önce bir örnek'));
    var alt0 = el('span', '', 'Aynı yöntem, farklı sayılar: önce örneği izle, sonra görevi sen çöz. Bu panelde puan ya da ceza yok.'); ust.appendChild(alt0);
    var sayac = el('span', 'ho-sayac'); ust.appendChild(sayac); kok.appendChild(ust);
    var govde = el('div', 'ho-govde'); kok.appendChild(govde);
    var alt = el('div', 'ho-alt'); kok.appendChild(alt);
    var geri = btn('◀ Geri', 'ho-geri'), ileri = btn('İleri ▶', 'primary ho-ileri'), bos = el('span', 'ho-bos');
    alt.appendChild(geri); alt.appendChild(ileri); alt.appendChild(bos);
    if (o.gec) { var gb = btn(o.gec, 'ho-gec', function(){ o.bitir && o.bitir('gec'); }); alt.appendChild(gb); }
    var hz = btn(o.birincil || 'Hazırım, görevi göster', 'primary ho-hazir', function(){ o.bitir && o.bitir('hazir'); }); alt.appendChild(hz);
    function ciz(){
      govde.textContent = '';
      var y = el('div', 'ho-kutu ho-yontem'); y.appendChild(el('h4', '', 'Yöntem: kural'));
      var ol = el('ol'); ork.yontem.forEach(function(m){ ol.appendChild(p('', m, 'li')); }); y.appendChild(ol); govde.appendChild(y);
      var q = el('div', 'ho-kutu'); q.appendChild(p('', 'Örnek: ' + ork.baslik.replace(/^Worked example:\s*/, ''), 'b'));
      q.appendChild(p('ho-soru', ork.soru));
      if (ork.veriler && ork.veriler.length) { var ul = el('ul', 'ho-ver'); ork.veriler.forEach(function(v){ ul.appendChild(p('', v, 'li')); }); q.appendChild(ul); }
      govde.appendChild(q);
      var son = null;
      for (var k = 1; k <= Math.min(st, n); k++) {
        var a = ork.adimlar[k - 1], c = el('div', 'ho-kutu ho-adim'); c.dataset.adim = String(k);
        if (k === vurgu) c.className += ' vurgu';
        c.appendChild(yaz(el('h4'), 'Örnek adım ' + k + '. ' + String(a.baslik).replace(/^\s*\d+\s*[.)]\s*/, '')));
        if (a.metin) c.appendChild(p('', a.metin));
        if (a.formul) c.appendChild(p('ho-formul', a.formul));
        if (a.sonuc) c.appendChild(p('ho-sn', '→ ' + a.sonuc));
        govde.appendChild(c); son = c;
      }
      if (st > n) {
        var r = el('div', 'ho-kutu ho-sonuc'); r.appendChild(p('', 'Örnek sonuç: ' + ork.sonuc.metin));
        if (ork.ipucu) r.appendChild(p('', 'İpucu: ' + ork.ipucu)); govde.appendChild(r); son = r;
      }
      sayac.textContent = st === 0 ? 'Yöntem' : (st <= n ? 'Örnek adım ' + st + '/' + n : 'Örnek tamam');
      geri.disabled = st === 0;
      ileri.disabled = st > n;
      ileri.textContent = st === 0 ? 'Örneği adım adım göster ▶' : (st < n ? 'Sonraki adım ▶' : (st === n ? 'Örnek sonucu ▶' : 'İleri ▶'));
      var hedef = vurgu && st >= vurgu && st <= n ? govde.querySelector('.vurgu') : son;
      if (hedef) { try { hedef.scrollIntoView({ block: 'nearest' }); } catch (e) {} }
      else govde.scrollTop = 0;
    }
    geri.addEventListener('click', function(){ if (st > 0) { st--; vurgu = 0; ciz(); } });
    ileri.addEventListener('click', function(){ if (st <= n) { st++; vurgu = 0; ciz(); } });
    ciz();
    try { (o.tam ? hz : ileri).focus({ preventScroll: true }); } catch (e) {}
    return { kok: kok, git: function(k){ st = Math.max(0, Math.min(n + 1, k)); ciz(); } };
  }

  /* Çalışma ekranının üstüne binen örnek paneli (görevi/ilerlemeyi bozmaz). adim: yanlış adımın no'su (örnekteki aynı adım vurgulanır). */
  function ornekKaplama(kok, g, adim){
    if (!g.ornek || kok.querySelector(':scope > .hc-ovl')) return null;
    css();
    var ov = el('div', 'hc-ovl'); if (getComputedStyle(kok).position === 'static') kok.style.position = 'relative';
    kok.appendChild(ov);
    var oz = ornekPanel(ov, g, { adim: adim ? Math.min(adim, g.ornek.adimlar.length) : 0, tam: !adim, birincil: 'Göreve dön', baslik: 'Örnek çözüm',
      bitir: function(){ if (ov.parentNode) ov.parentNode.removeChild(ov); } });
    return oz;
  }

  var fKonu = 'hepsi', fTip = 'hepsi', fSt = 'hepsi', aktif = null, hostRef = null;

  /* Tek adım arayüzü: adimSoru varsa önce ara cevap istenir; doğru ya da "Çözümü göster" ile metin/formül açılır. bitti() çağrılır. */
  function adimUI(host, adim, bitti, no, ornekFn){
    var kutu = el('div', 'hc-adim'); kutu.dataset.adim = String(no || 0);
    kutu.appendChild(yaz(el('h4'), (no ? no + '. ' : '') + adim.baslik));
    var yer = el('div'); kutu.appendChild(yer); host.appendChild(kutu);
    function ac(){
      yer.textContent = '';
      if (adim.metin) yer.appendChild(p('', adim.metin));
      if (adim.formul) { var f = p('hc-formul', adim.formul); yer.appendChild(f); }
      if (adim.kod) yer.appendChild(el('pre', 'hc-kod', adim.kod));
      if (bitti) bitti();
    }
    function ornekLink(fb){
      if (!ornekFn || !no) return;
      var b = btn('Örnekteki ' + Math.min(no, ornekFn.n) + '. adıma bak', 'ho-link ho-adim-link', function(){ ornekFn.ac(no); });
      fb.appendChild(document.createTextNode(' ')); fb.appendChild(b);
    }
    var q = adim.adimSoru;
    if (!q) { ac(); return kutu; }
    yer.appendChild(p('', q.soru));
    var fb = el('div'); fb.setAttribute('role', 'status');
    var sat = el('div', 'hc-gir');
    if (q.sayiCevap) {
      var gi = el('input'); gi.type = 'text'; gi.className = 'hc-adim-giris'; gi.setAttribute('inputmode', 'decimal'); gi.setAttribute('aria-label', 'Ara cevap'); gi.placeholder = 'sayı' + (q.sayiCevap.birim ? ' (' + q.sayiCevap.birim.replace(/[\^_]\{([^{}]*)\}/g, '$1') + ')' : '');
      gi.addEventListener('keydown', function(e){ e.stopPropagation(); if (e.key === 'Enter') ok.click(); });
      var ok = btn('Kontrol', 'primary', function(){
        var k = kontrol(gi.value, q.sayiCevap.deger, q.tolerans);
        fb.className = 'hc-fb ' + (k.ok ? 'iyi' : 'kotu');
        if (k.ok) { fb.textContent = 'Doğru. Çözüm açılıyor.'; ac(); }
        else { fb.textContent = k.gecersiz ? 'Bir sayı gir (örnek: 1,5 ya da 2e-4).' : 'Olmadı' + (k.ters ? ' (mertebe/birim hatası olabilir)' : '') + '. Tekrar dene ya da çözümü göster.'; if (!k.gecersiz) ornekLink(fb); }
      });
      sat.appendChild(gi); sat.appendChild(ok);
    } else if (q.secenekler) {
      var secim = null, dgr = el('div', 'hc-gir');
      var sirali = Q.util && Q.util.shuffle ? Q.util.shuffle(q.secenekler.slice()) : q.secenekler.slice();
      sirali.forEach(function(s){
        var b = btn(s.t, '', function(){
          fb.className = 'hc-fb ' + (s.dogru ? 'iyi' : 'kotu');
          if (s.dogru) { fb.textContent = 'Doğru. Çözüm açılıyor.'; ac(); } else { fb.textContent = 'Cevabın yanlış. Tekrar dene ya da çözümü göster.'; ornekLink(fb); }
        });
        b.className += ' hc-sec'; dgr.appendChild(b);
      });
      yer.appendChild(dgr);
    }
    sat.appendChild(btn('Çözümü göster', '', function(){ ac(); }));
    yer.appendChild(sat); yer.appendChild(fb);
    return kutu;
  }

  function sayfa(host){
    css(); hostRef = host; host.textContent = '';
    var L = (Q.data && Q.data.hesap) || [];
    if (!L.length) { host.appendChild(el('div', 'tk-muted', 'Hesap görevi bulunamadı.')); return; }
    var wrap = el('div', 'hc-wrap'); host.appendChild(wrap);
    var sol = el('div', 'hc-sol'), sag = el('div', 'hc-sag'); wrap.appendChild(sol); wrap.appendChild(sag);
    function sel(etiket, deg, secenekler, fn){
      var s = el('select'); s.setAttribute('aria-label', etiket);
      secenekler.forEach(function(o){ var op = el('option', '', o[1]); op.value = o[0]; s.appendChild(op); });
      s.value = deg; s.addEventListener('change', function(){ fn(s.value); }); return s;
    }
    var konuOpt = [['hepsi', 'Tüm konular']].concat(Object.keys(Q.hesap.konular).filter(function(k){ return L.some(function(g){ return g.konu === k; }); }).map(function(k){ return [k, Q.hesap.konuAd(k)]; }));
    var stOpt = [['hepsi', 'Tüm istasyonlar']].concat(Object.keys(L.reduce(function(a, g){ a[g.istasyon] = 1; return a; }, {})).sort().map(function(s){ return [s, s.toUpperCase() + (Q.data.stations && Q.data.stations[s] ? ' · ' + Q.data.stations[s].ad : '')]; }));
    var sayac = el('div', 'tk-muted'), liste = el('div', 'hc-liste');
    sol.appendChild(sel('Konu filtresi', fKonu, konuOpt, function(v){ fKonu = v; ciz(); }));
    sol.appendChild(sel('İstasyon filtresi', fSt, stOpt, function(v){ fSt = v; ciz(); }));
    sol.appendChild(sel('Tür filtresi', fTip, [['hepsi', 'Sınav + alıştırma'], ['sinav', 'Yalnızca sınav tarzı'], ['alistirma', 'Yalnızca alıştırma']], function(v){ fTip = v; ciz(); }));
    sol.appendChild(sayac); sol.appendChild(liste);

    function gorunen(){ return L.filter(function(g){ return (fKonu === 'hepsi' || g.konu === fKonu) && (fSt === 'hepsi' || g.istasyon === fSt) && (fTip === 'hepsi' || g.tip === fTip); }); }
    function ciz(){
      liste.textContent = ''; var g = gorunen(), k = kayit(), cz = 0;
      g.forEach(function(x){ if (k[x.id] === 'cozdum') cz++; });
      sayac.textContent = g.length + ' görev · çözdüm: ' + cz;
      g.forEach(function(x){
        var b = el('button', 'hc-it'); b.type = 'button'; b.dataset.id = x.id;
        if (aktif === x.id) b.setAttribute('aria-current', 'true');
        var d = k[x.id] === 'cozdum' ? ' ✓' : (k[x.id] === 'tekrar' ? ' ↻' : '');
        var t = el('b'); yaz(t, x.baslik); b.appendChild(t);
        var m = el('small'); m.textContent = x.istasyon.toUpperCase() + ' · ' + (x.tip === 'sinav' ? 'sınav tarzı' : 'alıştırma') + ' · zorluk ' + x.zorluk + (x.istasyonSonu ? ' · istasyon sonu' : '');
        if (d) { var dd = el('span', k[x.id] === 'cozdum' ? 'cz' : 'tk', d); m.appendChild(dd); }
        b.appendChild(m);
        b.addEventListener('click', function(){ aktif = x.id; ciz(); detay(x); });
        liste.appendChild(b);
      });
      if (!g.length) liste.appendChild(el('div', 'tk-muted', 'Bu filtreyle görev yok.'));
    }
    function detay(g, ornekGoruldu){
      sag.textContent = ''; sag.scrollTop = 0;
      /* hesap isteyen her görevde önce 'Örnek çözüm' (Yöntem + çözülmüş küçük kardeş); 'Hazırım' ile görev gelir */
      if (g.ornek && !ornekGoruldu) {
        sag.style.overflow = 'hidden';
        ornekPanel(sag, g, { birincil: 'Hazırım, görevi göster', gec: 'Örneği geç', bitir: function(){ sag.style.overflow = ''; detay(g, true); } });
        return;
      }
      sag.style.overflow = '';
      if (g.ornek) {
        var ol = btn('Örneği tekrar göster', 'ho-link hc-ornek-tekrar', function(){ ornekKaplama(wrap, g, 0); });
        var ustSat = el('div', 'hc-gir'); ustSat.appendChild(p('hc-bas', g.baslik, 'h3')); ustSat.appendChild(ol); sag.appendChild(ustSat);
      } else sag.appendChild(p('hc-bas', g.baslik, 'h3'));
      sag.appendChild(p('tk-muted', Q.hesap.konuAd(g.konu) + ' · ' + g.istasyon.toUpperCase() + ' · ' + (g.tip === 'sinav' ? 'sınav tarzı' : 'alıştırma')));
      sag.appendChild(p('hc-soru', g.soru));
      if (g.veriler && g.veriler.length) {
        sag.appendChild(el('div', 'tk-muted', 'Verilenler (Given)'));
        var ul = el('ul', 'hc-ver'); g.veriler.forEach(function(v){ ul.appendChild(p('', v, 'li')); }); sag.appendChild(ul);
      }
      /* kendi cevabın */
      var gir = el('div', 'hc-gir'), gi = el('input'); gi.type = 'text'; gi.id = 'hc-cevap'; gi.setAttribute('inputmode', 'decimal'); gi.setAttribute('aria-label', 'Cevabın (sayı)');
      gi.placeholder = 'Cevabın (sayı)'; gi.addEventListener('keydown', function(e){ e.stopPropagation(); if (e.key === 'Enter') kb.click(); });
      var birim = p('tk-muted', 'Birim: ' + g.sonuc.birim + ' (cevabını bu birimde gir, ±%2 tolerans)', 'span');
      var kb = btn('Kontrol et', 'primary', function(){
        var k = kontrol(gi.value, g.sonuc.deger, 0.02);
        fb.className = 'hc-fb ' + (k.ok ? 'iyi' : 'kotu'); fb.id = 'hc-fb';
        if (k.ok) { fb.textContent = 'Doğru! (±%2 içinde)'; }
        else if (k.gecersiz) fb.textContent = 'Bir sayı gir (örnek: 0,25 ya da 1.5e-4).';
        else fb.textContent = 'Henüz olmadı' + (k.ters ? ': mertebe ya da birim hatası olabilir (birimi kontrol et)' : '') + '. Adımlara bak, tekrar dene.';
      });
      var fb = el('div'); fb.setAttribute('role', 'status');
      gir.appendChild(gi); gir.appendChild(kb); gir.appendChild(birim); sag.appendChild(gir); sag.appendChild(fb);
      /* adımlar */
      var adimlarYer = el('div'); adimlarYer.style.cssText = 'display:flex;flex-direction:column;gap:10px'; sag.appendChild(adimlarYer);
      var sonYer = el('div'); sonYer.style.cssText = 'display:flex;flex-direction:column;gap:10px';
      var i = 0, bekleyen = false;
      var ab = btn('Adım göster', 'primary', null); ab.id = 'hc-adim-goster';
      var tum = btn('Tümünü göster', '', null); tum.id = 'hc-tumu';
      var ctrl = el('div', 'hc-gir'); ctrl.appendChild(ab); ctrl.appendChild(tum);
      sag.appendChild(ctrl); sag.appendChild(adimlarYer); sag.appendChild(sonYer);
      function sonuc(){
        ctrl.style.display = 'none'; sonYer.textContent = '';
        var s = p('hc-sonuc', 'Sonuç: ' + g.sonuc.metin); s.id = 'hc-sonuc'; sonYer.appendChild(s);
        var oz = el('div', 'hc-adim'); oz.appendChild(el('h4', '', 'Formül özeti'));
        g.adimlar.forEach(function(a){ if (a.formul) oz.appendChild(p('hc-formul', a.formul)); });
        sonYer.appendChild(oz);
        var n = p('hc-not', 'Sınavda dikkat: ' + g.sinavNotu); n.id = 'hc-not'; sonYer.appendChild(n);
        var r = el('div', 'hc-gir'), dur = el('span', 'tk-muted');
        function durum(){ var d = kayit()[g.id]; dur.textContent = d === 'cozdum' ? 'İşaret: Çözdüm ✓' : (d === 'tekrar' ? 'İşaret: Tekrar çalış ↻' : ''); }
        var c1 = btn('Çözdüm', 'primary', function(){ isaretle(g.id, 'cozdum'); durum(); ciz(); }); c1.id = 'hc-cozdum';
        var c2 = btn('Tekrar çalış', '', function(){ isaretle(g.id, 'tekrar'); durum(); ciz(); }); c2.id = 'hc-tekrar';
        r.appendChild(c1); r.appendChild(c2); r.appendChild(dur); sonYer.appendChild(r); durum();
        var ayni = btn('Adımları yeniden aç', '', function(){ detay(g, true); }); r.appendChild(ayni);
      }
      var ornekFn = g.ornek ? { n: g.ornek.adimlar.length, ac: function(no){ ornekKaplama(wrap, g, Math.min(no, g.ornek.adimlar.length)); } } : null;
      function sonraki(){
        if (bekleyen) return;
        if (i >= g.adimlar.length) { sonuc(); return; }
        var a = g.adimlar[i]; i++;
        if (a.adimSoru) { bekleyen = true; ab.disabled = true; }
        adimUI(adimlarYer, a, function(){ bekleyen = false; ab.disabled = false; if (i >= g.adimlar.length) { ab.textContent = 'Sonucu göster'; } }, i, ornekFn);
        if (!a.adimSoru && i >= g.adimlar.length) ab.textContent = 'Sonucu göster';
      }
      ab.addEventListener('click', sonraki);
      tum.addEventListener('click', function(){
        adimlarYer.textContent = ''; i = 0; bekleyen = false;
        g.adimlar.forEach(function(a, j){ adimUI(adimlarYer, { baslik: a.baslik, metin: a.metin, formul: a.formul, kod: a.kod }, null, j + 1); });
        i = g.adimlar.length; sonuc();
      });
      sag.appendChild(el('div', 'tk-muted', 'İpucu: önce kendi cevabını yaz, sonra adımları tek tek aç. Bazı adımlar önce küçük bir ara cevap ister.'));
    }
    var ilk = gorunen()[0];
    if (aktif && L.some(function(g){ return g.id === aktif; })) ilk = Q.hesap.gorev(aktif);
    ciz();
    if (ilk) { aktif = ilk.id; ciz(); detay(ilk); }
  }

  /* Hesap çalıştayı sayfası açılırken verilen görevi seç (filtreleri sıfırla); oyun içi ve hata defteri bağlantısı */
  function sec(id){ aktif = id; fKonu = 'hepsi'; fTip = 'hepsi'; fSt = 'hepsi'; }

  Q.tekrarHesap = { ornekPanel: ornekPanel, ornekKaplama: ornekKaplama, css: css, sec: sec, sayfa: sayfa, kontrol: kontrol, sayiOku: sayiOku, yaz: yaz, adimUI: adimUI };
})();
