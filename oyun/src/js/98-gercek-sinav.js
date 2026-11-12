/* 98-gercek-sinav.js · Tekrar Merkezi > "Gerçek sınav (10 soru)": hocanın örnek sınavı AYNEN (10 klasik soru, İngilizce).
 * Ekler: Q.gercekSinav {render(host), sekilEl(ad), sorular(), skor(no), sifirla()}. Veri: Q.data.gercekSinav (86-data-gercek-sinav.js).
 * Akış: yaz (soru gezgini + büyük yazı alanı) -> değerlendir (model cevap + anahtar fikir kontrol listesi, isteğe bağlı Claude puanı)
 * -> sonuç (eksik fikirler + çalışma bağlantıları). Süre sayacı YOK (kullanıcı kararı).
 * Kayıt: yalnızca localStorage["cip-hatti-gercek-sinav-v1"] (taslak, işaretler, aşama); try/catch, ana kayda dokunmaz. */
(function(){
  'use strict';
  var KEY = 'cip-hatti-gercek-sinav-v1';
  var S = null;          /* { cur, asama, cevap:{no:text}, isaret:{no:[bool]}, claude:{no:{dogruluk,geri}} } */

  function el(tag, cls, text){ var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function btn(text, cls, fn){ var b = el('button', 'btn' + (cls ? ' ' + cls : ''), text); b.type = 'button'; if (fn) b.addEventListener('click', fn); return b; }
  function veri(){ return (Q.data && Q.data.gercekSinav) || { sorular: [] }; }
  function sorular(){ return veri().sorular; }
  function soruNo(no){ return sorular()[no - 1]; }

  /* ---------- kayıt ---------- */
  function bos(){ return { cur: 1, asama: 'yaz', cevap: {}, isaret: {}, claude: {} }; }
  function yukle(){
    var r = null;
    try { r = JSON.parse(localStorage.getItem(KEY)); } catch (e) { r = null; }
    var s = bos();
    if (r && typeof r === 'object') {
      s.cur = Math.max(1, Math.min(10, +r.cur || 1));
      s.asama = (r.asama === 'degerlendir' || r.asama === 'sonuc') ? r.asama : 'yaz';
      if (r.cevap && typeof r.cevap === 'object') s.cevap = r.cevap;
      if (r.isaret && typeof r.isaret === 'object') s.isaret = r.isaret;
      if (r.claude && typeof r.claude === 'object') s.claude = r.claude;
    }
    return s;
  }
  function yaz(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* kapalı: oturum belleğinde kalır */ } }
  function durum(){ if (!S) S = yukle(); return S; }

  function cevapli(no){ return !!(durum().cevap[no] && String(S.cevap[no]).trim()); }
  function sayiCevapli(){ var n = 0; sorular().forEach(function(q){ if (cevapli(q.no)) n++; }); return n; }
  function isaretler(no){
    var q = soruNo(no), a = durum().isaret[no];
    if (!Array.isArray(a) || a.length !== q.anahtar.length) a = S.isaret[no] = q.anahtar.map(function(){ return false; });
    return a;
  }
  /* soru puanı 0-100: işaretlenen anahtar fikir oranı; işaret yoksa ve Claude puanı varsa o */
  function skor(no){
    var q = soruNo(no), a = isaretler(no), n = a.filter(Boolean).length;
    if (!n && S.claude[no] && typeof S.claude[no].dogruluk === 'number') return S.claude[no].dogruluk;
    return Math.round(100 * n / q.anahtar.length);
  }

  /* ---------- şekiller ---------- */
  function sekilEl(ad){
    var w = el('div', 'gs-sekil');
    var ink = 'var(--ink)', cy = 'var(--cyan)', ye = 'var(--yellow)';
    var tx = function(x, y, t, ek){ return '<text x="' + x + '" y="' + y + '" fill="' + ink + '" font-size="14" font-family="Nunito,system-ui,sans-serif" ' + (ek || '') + '>' + t + '</text>'; };
    if (ad === 'q5') {
      var X = function(nm){ return 60 + nm * 10.8; };
      w.setAttribute('role', 'img'); w.setAttribute('aria-label', 'Potential V(x): infinite walls at x = 0 and 50 nm, 9 eV barrier between 20 and 30 nm');
      w.innerHTML = '<svg viewBox="0 0 660 230" width="100%" style="max-width:640px;max-height:200px">' +
        '<line x1="' + X(0) + '" y1="22" x2="' + X(0) + '" y2="190" stroke="' + ink + '" stroke-width="5"/>' +
        '<line x1="' + X(50) + '" y1="22" x2="' + X(50) + '" y2="190" stroke="' + ink + '" stroke-width="5"/>' +
        '<rect x="' + X(20) + '" y="60" width="' + (X(30) - X(20)) + '" height="130" fill="' + cy + '" fill-opacity=".28" stroke="' + cy + '" stroke-width="3"/>' +
        '<polyline points="' + X(0) + ',190 ' + X(20) + ',190" stroke="' + ye + '" stroke-width="4" fill="none"/>' +
        '<polyline points="' + X(30) + ',190 ' + X(50) + ',190" stroke="' + ye + '" stroke-width="4" fill="none"/>' +
        '<line x1="' + X(20) + '" y1="60" x2="' + X(30) + '" y2="60" stroke="' + ye + '" stroke-width="4"/>' +
        '<line x1="30" y1="190" x2="640" y2="190" stroke="' + ink + '" stroke-width="1.5" stroke-dasharray="3 4" opacity=".6"/>' +
        '<line x1="42" y1="60" x2="' + X(20) + '" y2="60" stroke="' + ink + '" stroke-width="1" stroke-dasharray="4 4" opacity=".7"/>' +
        tx(2, 64, '9 eV') + tx(22, 194, '0') + tx(X(0) - 12, 14, 'V = ∞') + tx(X(50) - 12, 14, 'V = ∞') +
        tx(X(8), 180, 'V = 0') + tx(X(36), 180, 'V = 0') + tx(X(22), 52, 'V = 9 eV') +
        [0, 20, 30, 50].map(function(n){ return '<line x1="' + X(n) + '" y1="190" x2="' + X(n) + '" y2="198" stroke="' + ink + '" stroke-width="2"/>' + tx(X(n) - 8, 214, n); }).join('') +
        tx(X(50) - 30, 228, 'x (nm)') + '</svg>';
    } else if (ad === 'q6') {
      w.setAttribute('role', 'img'); w.setAttribute('aria-label', 'Step potential: V = 0 for x < 0 and V = V0 for x > 0, electron incident from the left');
      w.innerHTML = '<svg viewBox="0 0 660 200" width="100%" style="max-width:640px;max-height:180px">' +
        '<defs><marker id="gsar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="' + ye + '"/></marker></defs>' +
        '<polyline points="40,160 330,160 330,70 620,70" stroke="' + ye + '" stroke-width="4" fill="none"/>' +
        '<rect x="330" y="70" width="290" height="90" fill="' + cy + '" fill-opacity=".22"/>' +
        '<line x1="330" y1="30" x2="330" y2="180" stroke="' + ink + '" stroke-width="1.5" stroke-dasharray="4 4" opacity=".7"/>' +
        '<line x1="70" y1="105" x2="250" y2="105" stroke="' + ye + '" stroke-width="3" marker-end="url(#gsar)"/>' +
        '<line x1="250" y1="125" x2="90" y2="125" stroke="' + ye + '" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#gsar)" opacity=".85"/>' +
        '<circle cx="62" cy="105" r="7" fill="' + cy + '" stroke="' + ink + '" stroke-width="2"/>' +
        tx(48, 88, 'electron, energy E') + tx(120, 176, 'V = 0  (x &lt; 0)') + tx(440, 56, 'V = V₀  (x &gt; 0)') + tx(321, 194, 'x = 0') +
        tx(120, 144, 'reflected', 'opacity=".85"') + tx(600, 190, 'x') + tx(8, 74, 'V') + '</svg>';
    } else return null;
    return w;
  }

  /* ---------- stil ---------- */
  function css(){
    if (document.getElementById('gs-css')) return;
    var s = el('style'); s.id = 'gs-css';
    s.textContent = '.gs-wrap{display:flex;flex-direction:column;gap:8px;min-height:0}' +
      '.gs-nav{display:flex;gap:6px;flex-wrap:wrap;align-items:center}' +
      '.gs-n{min-width:42px;padding:6px 8px;border:3px solid var(--line);border-radius:8px;background:var(--panel2);color:var(--ink);font:inherit;font-weight:800;cursor:pointer}' +
      '.gs-n[data-d=dolu]{border-color:var(--lime)}.gs-n[data-d=bos]{border-style:dashed}.gs-n[aria-current=true]{background:var(--sel);box-shadow:0 0 0 3px var(--cyan)}' +
      '.gs-n small{display:block;font-size:11px;font-weight:600;color:var(--muted)}' +
      '.gs-q{font-size:21px;font-weight:800;line-height:1.3}.gs-sekil{background:var(--panel2);border:2px solid var(--line);border-radius:8px;padding:4px 8px;align-self:flex-start;width:100%;max-width:660px;box-sizing:border-box}' +
      '.gs-ta{width:100%;box-sizing:border-box;min-height:230px;height:36vh;background:var(--panel2);color:var(--ink);border:3px solid var(--line);border-radius:8px;padding:10px 12px;font:inherit;font-size:18px;line-height:1.4;resize:vertical}' +
      '.gs-row{display:flex;gap:10px;align-items:stretch}.gs-row .gs-sekil{flex:none;width:470px;align-self:flex-start}.gs-row .gs-ta{flex:1;min-width:0;height:300px}' +
      '.gs-ta:focus{outline:none;border-color:var(--cyan)}' +
      '.gs-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:900px){.gs-2{grid-template-columns:1fr}}' +
      '.gs-box{border:2px solid var(--line);border-radius:8px;background:var(--panel2);padding:8px 12px}.gs-box h4{margin:0 0 4px;color:var(--yellow)}.gs-box p{margin:3px 0}' +
      '.gs-model p{margin:4px 0;line-height:1.35}' +
      '.gs-chk{display:flex;gap:8px;align-items:flex-start;padding:5px 0;cursor:pointer;border-bottom:1px dashed rgba(255,255,255,.15)}.gs-chk input{width:20px;height:20px;margin-top:2px;flex:none}' +
      '.gs-bar{height:12px;border-radius:6px;background:var(--panel);border:1px solid var(--line);overflow:hidden}.gs-bar i{display:block;height:100%}' +
      '.gs-sat{display:flex;justify-content:space-between;gap:8px;margin-top:8px}.gs-uyari{padding:8px 12px;border:2px solid var(--yellow);border-radius:8px}';
    document.head.appendChild(s);
  }

  /* ---------- ana çizim ---------- */
  var host = null, claudeVar = null;
  function render(h){
    css(); host = h; durum(); host.textContent = '';
    if (!sorular().length) { host.appendChild(el('div', 'tk-fb kotu', 'Gerçek sınav verisi bulunamadı.')); return; }
    if (S.asama === 'sonuc') sonuc(); else if (S.asama === 'degerlendir') degerlendir(); else yazEkrani();
  }
  function yenile(){ if (host && host.isConnected) render(host); }
  function git(a){ S.asama = a; yaz(); yenile(); }

  function gezgin(mod){
    var nav = el('div', 'gs-nav'); nav.setAttribute('role', 'tablist'); nav.setAttribute('aria-label', 'Soru gezgini');
    sorular().forEach(function(q){
      var b = el('button', 'gs-n', 'Q' + q.no); b.type = 'button'; b.dataset.no = q.no;
      var dolu = cevapli(q.no);
      b.dataset.d = dolu ? 'dolu' : 'bos';
      var alt = el('small', '', mod === 'yaz' ? (dolu ? 'yanıtlandı' : 'boş') : '%' + skor(q.no));
      b.appendChild(alt);
      if (q.no === S.cur) b.setAttribute('aria-current', 'true');
      b.addEventListener('click', function(){ S.cur = q.no; yaz(); yenile(); });
      nav.appendChild(b);
    });
    return nav;
  }

  function yazEkrani(){
    var q = soruNo(S.cur);
    var w = el('div', 'gs-wrap'); host.appendChild(w);
    w.appendChild(el('div', 'tk-muted', 'Gerçek sınav (10 soru) · Hocanın örnek sınavı, soru metinleri aynen. Yanıtlandı: ' + sayiCevapli() + '/10 · Taslak otomatik kaydedilir.'));
    w.appendChild(gezgin('yaz'));
    w.appendChild(el('div', 'gs-q', 'Q' + q.no + '. ' + q.text));
    var se = q.sekil ? sekilEl(q.sekil) : null, satir = el('div', se ? 'gs-row' : ''); w.appendChild(satir); if (se) satir.appendChild(se);
    var ta = el('textarea', 'gs-ta'); ta.id = 'gs-ta'; ta.maxLength = 12000; ta.value = S.cevap[q.no] || '';
    ta.placeholder = 'Write your answer in English...'; ta.setAttribute('aria-label', 'Your answer to question ' + q.no);
    ta.addEventListener('input', function(){
      S.cevap[q.no] = ta.value; yaz();
      var b = host.querySelector('.gs-n[data-no="' + q.no + '"]');
      if (b) { b.dataset.d = ta.value.trim() ? 'dolu' : 'bos'; b.querySelector('small').textContent = ta.value.trim() ? 'yanıtlandı' : 'boş'; }
    });
    ta.addEventListener('keydown', function(e){ if (e.key === 'Escape') e.stopPropagation(); });
    satir.appendChild(ta);
    var sat = el('div', 'gs-sat'), sol = el('div', 'tk-row'), sag = el('div', 'tk-row');
    var geri = btn('← Önceki', '', function(){ S.cur = Math.max(1, S.cur - 1); yaz(); yenile(); }); geri.disabled = S.cur <= 1;
    var ileri = btn('Sonraki →', '', function(){ S.cur = Math.min(10, S.cur + 1); yaz(); yenile(); }); ileri.disabled = S.cur >= 10;
    sol.appendChild(geri); sol.appendChild(ileri);
    sag.appendChild(yeniDugme());
    sag.appendChild(btn('Bitir ve değerlendir', 'primary', function(){ git('degerlendir'); }));
    sat.appendChild(sol); sat.appendChild(sag); w.appendChild(sat);
    try { ta.focus(); } catch (e) { /* odak yok */ }
  }

  function yeniDugme(){
    var onay = false, b = btn('Yeni sınav (taslağı sil)', '', null);
    b.addEventListener('click', function(){
      if (!onay) { onay = true; b.textContent = 'Emin misin? Tüm cevaplar silinir'; b.className += ' danger'; setTimeout(function(){ if (b.isConnected && onay) { onay = false; b.textContent = 'Yeni sınav (taslağı sil)'; b.classList.remove('danger'); } }, 5000); return; }
      sifirla();
    });
    return b;
  }
  function sifirla(){ S = bos(); yaz(); yenile(); }

  /* ---------- değerlendirme ---------- */
  function paragraflar(arr){ var d = el('div', 'gs-model'); arr.forEach(function(t){ d.appendChild(el('p', '', t)); }); return d; }
  function degerlendir(){
    var q = soruNo(S.cur), a = isaretler(q.no);
    var w = el('div', 'gs-wrap'); host.appendChild(w);
    w.appendChild(el('div', 'tk-muted', 'Değerlendirme: model cevapla karşılaştır, anahtar fikirlerden yazdıklarını işaretle (dürüst ol: kelimeyi değil fikri yazdıysan işaretle).'));
    w.appendChild(gezgin('deg'));
    var ust = el('div', 'tk-row');
    var cb = btn('Claude ile puanla', '', null); cb.id = 'gs-claude'; cb.style.display = 'none'; ust.appendChild(cb);
    var cd = el('span', 'tk-muted', ''); ust.appendChild(cd);
    ust.appendChild(btn('← Yazma ekranına dön', '', function(){ git('yaz'); }));
    ust.appendChild(btn('Sonucu gör', 'primary', function(){ git('sonuc'); }));
    w.appendChild(ust);
    claudeHazir(cb, cd);
    w.appendChild(el('div', 'gs-q', 'Q' + q.no + '. ' + q.text));
    var se = q.sekil ? sekilEl(q.sekil) : null; if (se) w.appendChild(se);
    var iki = el('div', 'gs-2'); w.appendChild(iki);
    var sol = el('div', 'gs-box'); sol.appendChild(el('h4', '', 'Senin cevabın'));
    sol.appendChild(el('p', cevapli(q.no) ? '' : 'tk-muted', cevapli(q.no) ? S.cevap[q.no] : '(boş bıraktın)')).style.whiteSpace = 'pre-wrap';
    var cl = S.claude[q.no];
    if (cl) {
      var cbk = el('div', 'tk-fb ' + (cl.dogruluk >= 60 ? 'iyi' : 'kotu'), 'Claude puanı: %' + cl.dogruluk + (cl.geri && cl.geri.length ? ' · ' + cl.geri.join(' ') : ''));
      cbk.style.marginTop = '8px'; sol.appendChild(cbk);
    }
    iki.appendChild(sol);
    var sag = el('div', 'gs-box'); sag.appendChild(el('h4', '', 'Model answer (örnek cevap)')); sag.appendChild(paragraflar(q.model)); iki.appendChild(sag);
    var kb = el('div', 'gs-box'); w.appendChild(kb);
    var bas = el('h4', '', ''); kb.appendChild(bas);
    function say(){ bas.textContent = 'Key ideas (anahtar fikirler): ' + a.filter(Boolean).length + '/' + q.anahtar.length + ' işaretli · Soru puanı %' + skor(q.no); }
    say();
    q.anahtar.forEach(function(f, i){
      var l = el('label', 'gs-chk'), c = el('input'); c.type = 'checkbox'; c.checked = !!a[i];
      c.addEventListener('change', function(){ a[i] = c.checked; yaz(); say(); var nb = host.querySelector('.gs-n[data-no="' + q.no + '"] small'); if (nb) nb.textContent = '%' + skor(q.no); });
      l.appendChild(c); l.appendChild(el('span', '', f)); kb.appendChild(l);
    });
    kb.appendChild(el('h4', '', 'Sık yapılan hatalar')).style.marginTop = '8px';
    var ul = el('ul'); ul.style.margin = '2px 0'; q.hatalar.forEach(function(h){ ul.appendChild(el('li', '', h)); }); kb.appendChild(ul);
    var nav2 = el('div', 'gs-sat'), s1 = el('div', 'tk-row');
    var g = btn('← Önceki', '', function(){ S.cur = Math.max(1, S.cur - 1); yaz(); yenile(); }); g.disabled = S.cur <= 1;
    var i2 = btn('Sonraki →', '', function(){ S.cur = Math.min(10, S.cur + 1); yaz(); yenile(); }); i2.disabled = S.cur >= 10;
    s1.appendChild(g); s1.appendChild(i2); nav2.appendChild(s1); w.appendChild(nav2);
  }

  /* Claude varsa: cevaplanan sorular sırayla puanlanır; fikir listesi uzunluğu eşleşirse işaretler önceden doldurulur (kullanıcı değiştirebilir) */
  function claudeHazir(cb, cd){
    var va = (Q.claude && Q.claude.available && Q.claude.grade);
    if (!va) { cd.textContent = 'Claude yok: model cevapla kendini değerlendir.'; return; }
    var tok = {};
    Promise.resolve(Q.claude.available()).then(function(av){
      if (!host || !host.isConnected) return;
      if (!av || av.backend === 'none') { cd.textContent = 'Claude yok (API anahtarı girilmemiş): model cevapla kendini değerlendir.'; return; }
      cb.style.display = '';
      cb.addEventListener('click', async function(){
        cb.disabled = true; var ok = 0, hata = null;
        var liste = sorular().filter(function(q){ return cevapli(q.no) && !S.claude[q.no]; });
        for (var i = 0; i < liste.length && !hata; i++) {
          var q = liste[i], bitti = false;
          cd.textContent = 'Puanlanıyor: Q' + q.no + ' (' + (i + 1) + '/' + liste.length + ')…';
          for (var deneme = 0; deneme < 3 && !bitti; deneme++) {
            try {
              var pu = await Q.claude.grade({ soru: q.text, anahtarFikirler: q.anahtar, yanlisKavramlar: [], idealCevap: q.model.join(' '), cevap: S.cevap[q.no], eminlik: 1 });
              S.claude[q.no] = { dogruluk: pu.dogruluk, geri: pu.geriBildirim || [] };
              if (Array.isArray(pu.fikirler) && pu.fikirler.length === q.anahtar.length) S.isaret[q.no] = pu.fikirler.map(function(f){ return !!f['var']; });
              yaz(); ok++; bitti = true;
            } catch (e) {
              var kod = (e && e.code) || 'gecici';
              if (kod === 'sinir' || kod === 'gecici') await new Promise(function(r){ setTimeout(r, 2500); }); else break;
            }
          }
          if (!bitti) hata = { code: 'puanlanamadi' };
        }
        if (!host || !host.isConnected) return;
        if (hata) { cd.textContent = 'Claude şu an puanlayamadı (' + ok + ' soru puanlandı); kalanları kendin işaretle.'; cb.disabled = false; }
        yenile();
      });
    }, function(){ cd.textContent = 'Claude yok: model cevapla kendini değerlendir.'; });
  }

  /* ---------- sonuç ---------- */
  function istasyonAc(id){
    try {
      if (Q.settings && Q.settings.istasyonAcik && !Q.settings.istasyonAcik(id)) { Q.ui.toast('Bu istasyon henüz kilitli (Ayarlar: Her yere eriş).', { tur: 'bilgi' }); return; }
      if (Q.tekrar && Q.tekrar.close) Q.tekrar.close();
      if (Q.settings && Q.settings.closeMap) Q.settings.closeMap();
      Q.state.voltaj = 100;
      Q.runner.start(id, 0);
    } catch (e) { console.error('gercek-sinav', e); }
  }
  function kartAc(id){
    if (!Q.tekrar || !Q.tekrar.git) return;
    Q.tekrar.git('kart');
    setTimeout(function(){ var s = document.querySelector('#tk-root .tk-body select'); if (s) { s.value = id; s.dispatchEvent(new Event('change')); } }, 0);
  }
  function stAd(id){ var s = Q.data.stations && Q.data.stations[id]; return id.toUpperCase() + ' · ' + (s && s.ad || id); }

  function sonuc(){
    var w = el('div', 'gs-wrap'); host.appendChild(w);
    var puanlar = sorular().map(function(q){ return skor(q.no); });
    var ort = Math.round(puanlar.reduce(function(a, b){ return a + b; }, 0) / puanlar.length);
    w.appendChild(el('div', 'tk-soru', 'Gerçek sınav sonucu: ortalama %' + ort + ' · Yanıtlanan: ' + sayiCevapli() + '/10'));
    w.appendChild(el('div', 'tk-muted', ort >= 80 ? 'Sınava hazır görünüyorsun; yine de eksik fikirlere bak.' : ort >= 50 ? 'İyi gidiyorsun; eksik fikirleri çalış, sonra yeniden yaz.' : 'Temel fikirleri çalış, model cevabı oku ve cevabı sıfırdan yeniden yaz.'));
    sorular().forEach(function(q, i){
      var p = puanlar[i], a = isaretler(q.no);
      var kutu = el('div', 'gs-box'); kutu.dataset.no = q.no; w.appendChild(kutu);
      var ust = el('div'); ust.style.cssText = 'display:flex;justify-content:space-between;gap:8px';
      ust.appendChild(el('b', '', 'Q' + q.no + ' · ' + q.text.slice(0, 90) + (q.text.length > 90 ? '…' : '')));
      ust.appendChild(el('b', '', '%' + p)); kutu.appendChild(ust);
      var bar = el('div', 'gs-bar'), dolgu = el('i'); dolgu.style.cssText = 'width:' + Math.max(2, p) + '%;background:var(' + (p >= 70 ? '--lime' : p >= 40 ? '--yellow' : '--red') + ')';
      bar.appendChild(dolgu); kutu.appendChild(bar);
      var eksik = q.anahtar.filter(function(f, k){ return !a[k]; });
      if (eksik.length) {
        var d = el('details'); d.open = p < 70; d.appendChild(el('summary', '', 'Eksik fikirler (' + eksik.length + ')'));
        var ul = el('ul'); ul.style.margin = '2px 0'; eksik.forEach(function(f){ ul.appendChild(el('li', '', f)); }); d.appendChild(ul); kutu.appendChild(d);
        var cal = el('div', 'tk-row'); cal.style.marginTop = '4px';
        cal.appendChild(el('span', 'tk-muted', 'Çalış:'));
        q.calis.forEach(function(c){
          cal.appendChild(btn(stAd(c.st) + ' istasyonu', '', function(){ istasyonAc(c.st); }));
          cal.appendChild(btn('Kartlar (' + c.st.toUpperCase() + ')', '', function(){ kartAc(c.st); }));
        });
        if ((q.no === 5 || q.no === 6) && Q.tekrarHesap) cal.appendChild(btn('Hesap çalıştayı (Q5/Q6 görevleri)', '', function(){ Q.tekrar.git('hesap'); }));
        kutu.appendChild(cal);
        q.calis.forEach(function(c){ kutu.appendChild(el('p', 'tk-muted', c.st.toUpperCase() + ': ' + c.not)); });
      } else kutu.appendChild(el('p', 'tk-muted', 'Tüm anahtar fikirler işaretli.'));
    });
    var r = el('div', 'tk-row');
    r.appendChild(btn('← Değerlendirmeye dön', '', function(){ git('degerlendir'); }));
    r.appendChild(btn('Yazma ekranına dön', '', function(){ git('yaz'); }));
    r.appendChild(yeniDugme());
    w.appendChild(r);
  }

  /* ---------- harita düğmesi (20-settings.js'ye dokunmadan): Tekrar Merkezi düğmesinin yanına eklenir ---------- */
  function haritayaEkle(){
    var t = document.getElementById('a10-tekrar');
    if (!t || document.getElementById('gs-harita')) return;
    var b = btn('Gerçek sınav (10 soru)', '', function(){ if (Q.tekrar && Q.tekrar.git) Q.tekrar.git('gercek'); });
    b.id = 'gs-harita';
    if (t.parentNode) t.parentNode.insertBefore(b, t.nextSibling);
  }
  try {
    var kok = document.body || document.documentElement;
    if (kok && typeof MutationObserver !== 'undefined') new MutationObserver(haritayaEkle).observe(kok, { childList: true, subtree: true });
    haritayaEkle();
  } catch (e) { /* gözlemci yok */ }

  Q.gercekSinav = { render: render, sekilEl: sekilEl, sorular: sorular, skor: skor, sifirla: sifirla, durum: durum, cevapli: cevapli };
})();
