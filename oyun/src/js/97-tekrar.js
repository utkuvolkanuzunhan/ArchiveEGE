/* 97-tekrar.js (A10) Tekrar Merkezi: Terimler (glossary), Test (quiz), Açıklama kartları, Sınav tarzı.
 * Ekler: Q.tekrar {open, close, terimler, havuz}. Ana oyun ilerlemesine/voltaja/kısa devreye DOKUNMAZ.
 * Kayıt: yalnızca localStorage["cip-hatti-tekrar-v1"] (son skor, yanlış sorular), try/catch ile.
 * Bağımlı (çalışma anında): Q.data.stations.*, Q.ui.options/textbox, Q.claude (isteğe bağlı), Q.util.
 * Kilit durumundan bağımsız: tüm yüklü istasyonlar tekrar için açıktır. */
(function(){
  'use strict';

  var KEY = 'cip-hatti-tekrar-v1';
  var root = null, body = null, tabsEl = null, aktifSekme = 'terim', onEsc = null;

  /* ---------- kayıt ---------- */
  function yukle(){
    try { var r = JSON.parse(localStorage.getItem(KEY)); if (r && typeof r === 'object') return { son: r.son || null, yanlis: Array.isArray(r.yanlis) ? r.yanlis : [], sinav: r.sinav || null }; } catch (e) { /* bozuk/yok */ }
    return { son: null, yanlis: [], sinav: null };
  }
  function yaz(k){ try { localStorage.setItem(KEY, JSON.stringify(k)); } catch (e) { /* kapalı */ } }

  /* ---------- yardımcılar ---------- */
  function el(tag, cls, text){ var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function btn(text, cls, fn){ var b = el('button', 'btn' + (cls ? ' ' + cls : ''), text); b.type = 'button'; if (fn) b.addEventListener('click', fn); return b; }
  function stIds(){ return Object.keys(Q.data.stations || {}).sort(); }
  function stAd(id){ var s = Q.data.stations[id]; return id.toUpperCase() + ' · ' + (s && s.ad || id); }
  function mix(a){ return Q.util && Q.util.shuffle ? Q.util.shuffle(a) : a.slice().sort(function(){ return Math.random() - 0.5; }); }

  /* ---------- terim çıkarma ---------- */
  var STOP = {}; 've bir ile de da bu şu o en her hiç hic mi ne ya ki ama gibi için icin daha çok cok sadece yalnızca ise olan olarak bunu onu'.split(' ').forEach(function(w){ STOP[w] = 1; });
  var RE = /(?<![\p{L}'\-])([A-Za-z][A-Za-z'\-]*(?: [A-Za-z][A-Za-z'\-]*){0,3}) \(([^()0-9=+\/]{2,48})\)/gu;

  function metinler(o, out){
    if (typeof o === 'string') { if (o.indexOf('(') >= 0) out.push(o); }
    else if (Array.isArray(o)) o.forEach(function(x){ metinler(x, out); });
    else if (o && typeof o === 'object') Object.keys(o).forEach(function(k){ if (k !== 'sim' && k !== 'params') metinler(o[k], out); });
    return out;
  }
  function temizEn(s, tr){
    var w = s.split(' '), n = tr.split(',')[0].trim().split(/\s+/).length;
    while (w.length && (STOP[w[0].toLowerCase()] || w.length > n)) w.shift();
    if (!w.length) return '';
    var t = w.join(' ');
    if (/^[A-Z][a-z]/.test(t) && !/[A-Z]/.test(t.slice(1)) && t.indexOf(' ') < 0) t = t.toLowerCase();
    return t;
  }
  function cikar(metin, sink){
    RE.lastIndex = 0; var m;
    while ((m = RE.exec(metin))) {
      var en = m[1], tr = m[2].trim(), c = /^([A-Za-z][A-Za-z' \-]*), (.+)$/.exec(tr);
      if (c) { en = c[1]; tr = c[2]; }
      tr = tr.replace(/\s+/g, ' '); en = temizEn(en, tr); if (/,/.test(tr)) tr = tr.split(',')[0].trim();
      if (!en || en.length < 3 || tr.length < 2) continue;
      if (/^(ör|yani|bkz|kısaca)/i.test(tr)) continue;
      sink(en, tr);
    }
  }
  var CURATED = [
    ['wave function', 'dalga fonksiyonu'], ['probability density', 'olasılık yoğunluğu'], ['eigenvalue', 'özdeğer'], ['eigenfunction', 'özfonksiyon'],
    ['potential well', 'potansiyel kuyusu'], ['potential barrier', 'potansiyel bariyeri'], ['tunneling', 'tünelleme'], ['bandgap', 'yasak enerji aralığı'],
    ['valence band', 'değerlik bandı'], ['conduction band', 'iletim bandı'], ['Fermi level', 'Fermi seviyesi'], ['DOS (density of states)', 'durum yoğunluğu'],
    ['Miller indices', 'Miller indisleri'], ['unit cell', 'birim hücre'], ['lattice', 'kafes'], ['lattice constant', 'kafes sabiti'], ['crystal structure', 'kristal yapı'],
    ['basis', 'baz (atom grubu)'], ['primitive cell', 'ilkel hücre'], ['simple cubic (SC)', 'basit kübik'], ['body-centered cubic (BCC)', 'cisim merkezli kübik'],
    ['face-centered cubic (FCC)', 'yüzey merkezli kübik'], ['diamond structure', 'elmas yapı'], ['coordination number', 'koordinasyon sayısı'],
    ['packing fraction', 'doluluk oranı'], ['reciprocal lattice', 'ters kafes'], ['crystal plane', 'kristal düzlemi'], ['intercept', 'eksen kesim noktası'],
    ['single crystal', 'tek kristal'], ['polycrystalline', 'çok kristalli'], ['amorphous', 'amorf (düzensiz)'], ['grain boundary', 'tane sınırı'], ['vacancy', 'boşluk kusuru'],
    ['dislocation', 'dislokasyon'], ['impurity', 'safsızlık'], ['dopant', 'katkı atomu'], ['blackbody radiation', 'kara cisim ışıması'], ['photoelectric effect', 'fotoelektrik olay'],
    ['photon', 'foton'], ['work function', 'iş fonksiyonu'], ['threshold frequency', 'eşik frekansı'], ['stopping potential', 'durdurma potansiyeli'], ['quantization', 'nicemleme'],
    ['de Broglie wavelength', 'de Broglie dalga boyu'], ['wave-particle duality', 'dalga-parçacık ikiliği'], ['uncertainty principle', 'belirsizlik ilkesi'],
    ['Schrödinger equation', 'Schrödinger denklemi'], ['normalization', 'normalizasyon'], ['expectation value', 'beklenen değer'], ['operator', 'operatör'],
    ['Pauli exclusion principle', 'Pauli dışlama ilkesi'], ['spin', 'spin'], ['Bohr model', 'Bohr modeli'], ['energy level', 'enerji seviyesi'], ['ground state', 'temel hal'],
    ['excited state', 'uyarılmış hal'], ['boundary condition', 'sınır koşulu'], ['effective mass', 'etkin kütle'], ['intrinsic semiconductor', 'katkısız yarıiletken'],
    ['derive', 'türet'], ['calculate', 'hesapla'], ['explain', 'açıkla'], ['sketch', 'çiz'], ['show', 'göster'], ['justify', 'gerekçelendir'],
    ['compare', 'karşılaştır'], ['define', 'tanımla'], ['state', 'belirt'], ['determine', 'belirle']
  ];
  var terimCache = null;
  function terimler(){
    if (terimCache && terimCache.n === stIds().length) return terimCache.v;
    var v = [], gor = {};
    stIds().forEach(function(id){
      metinler(Q.data.stations[id], []).forEach(function(t){
        cikar(t, function(en, tr){
          var k = en.toLowerCase(); if (gor[k]) return; gor[k] = 1;
          v.push({ en: en, tr: tr, g: id });
        });
      });
    });
    CURATED.forEach(function(c){ v.push({ en: c[0], tr: c[1], g: 'temel' }); });
    var enler = {}; v.forEach(function(t){ enler[t.en.toLowerCase()] = 1; });
    v = v.filter(function(t){ return t.g === 'temel' || !enler[t.tr.toLowerCase()]; });
    terimCache = { n: stIds().length, v: v };
    return v;
  }

  /* ---------- soru havuzu ---------- */
  function kopya(sec){ return sec.map(function(s){ return { t: s.t, dogru: !!s.dogru, neden: s.neden || '' }; }); }
  function havuz(){
    var out = [], gor = {};
    function ekle(st, soru, sec, kavram, ek){
      if (!soru || !sec || sec.length < 2 || gor[soru]) return;
      if (sec.filter(function(s){ return s.dogru; }).length !== 1) return;
      gor[soru] = 1; out.push({ st: st, soru: soru, secenekler: kopya(sec), kavram: kavram || null, ek: ek || '' });
    }
    stIds().forEach(function(id){
      var s = Q.data.stations[id];
      (s.engeller || []).concat(s.tekrarHavuzu || []).forEach(function(e){
        if (e.tip === 'dusman') ekle(id, e.soru, e.secenekler, e.kavram);
        else if (e.tip === 'tahmin') ekle(id, e.soru, e.secenekler, e.kavram, e.acik);
        else if (e.tip === 'tuzak' && e.parcalar && e.parcalar.length > 1) {
          ekle(id, 'Bu cümlenin hangi parçası yanlış? "' + e.iddia + '"',
            e.parcalar.map(function(p, i){ return { t: p, dogru: i === e.yanlisParca, neden: e.duzeltme ? 'Doğrusu: ' + e.duzeltme : '' }; }), e.kavram);
        } else if (e.tip === 'patron') {
          (e.fazlar || []).forEach(function(f){
            if (f.tip === 'secmeli') ekle(id, f.soru, f.secenekler, e.kavram);
            if (f.yedekSecmeli) ekle(id, f.yedekSecmeli.soru, f.yedekSecmeli.secenekler, null);
          });
        }
      });
    });
    return out;
  }
  function acikSorular(){
    var out = [];
    stIds().forEach(function(id){
      ((Q.data.stations[id].engeller || [])).forEach(function(e){
        if (e.tip !== 'patron') return;
        (e.fazlar || []).forEach(function(f){ if (f.tip === 'acik' && f.soru) out.push({ st: id, f: f }); });
      });
    });
    return out;
  }

  /* ---------- arayüz iskeleti ---------- */
  function css(){
    if (document.getElementById('tk-css')) return;
    var s = el('style'); s.id = 'tk-css';
    s.textContent = '#tk-root{position:fixed;inset:0;z-index:2000;background:var(--bg);color:var(--ink);display:flex;flex-direction:column;font-family:var(--font-b);padding:12px 16px;gap:10px;box-sizing:border-box}' +
      '#tk-root h2{margin:0;font-family:var(--font-d);font-size:26px}.tk-top{display:flex;align-items:center;justify-content:space-between;gap:10px}' +
      '.tk-tabs{display:flex;gap:8px;flex-wrap:wrap}.tk-tabs .btn[aria-selected=true]{background:var(--accent);color:var(--accent-ink)}' +
      '.tk-body{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:10px}' +
      '.tk-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.tk-row input[type=search],.tk-row select{background:var(--panel2);color:var(--ink);border:2px solid var(--line);border-radius:8px;padding:6px 10px;font:inherit;min-width:200px}' +
      '.tk-g{margin:8px 0 2px;color:var(--cyan);font-family:var(--font-d);font-size:19px}.tk-t{display:flex;gap:10px;padding:5px 10px;border-bottom:1px dashed rgba(255,255,255,.18);align-items:baseline;flex-wrap:wrap}' +
      '.tk-t b{min-width:240px}.tk-t .tr{color:var(--muted)}.tk-t .gizli{cursor:pointer;color:var(--cyan);text-decoration:underline}' +
      '.tk-chip{padding:4px 10px;border:2px solid var(--line);border-radius:99px;cursor:pointer;background:var(--panel2);color:var(--ink);font:inherit;font-size:var(--fs-small)}.tk-chip[aria-pressed=true]{background:var(--sel);border-color:var(--cyan)}' +
      '.tk-soru{font-size:20px;font-weight:800}.tk-fb{padding:10px 12px;border-radius:8px;border:2px solid var(--line);background:var(--panel2)}.tk-fb.iyi{border-color:var(--lime)}.tk-fb.kotu{border-color:var(--red)}' +
      '.tk-kart{padding:10px 12px;border:2px solid var(--line);border-radius:8px;background:var(--panel2)}.tk-kart h4{margin:0 0 4px;color:var(--yellow)}.tk-kart p{margin:2px 0}' +
      '.tk-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px}.tk-muted{color:var(--muted)}';
    document.head.appendChild(s);
  }
  var SEKMELER = [['terim', 'Terimler'], ['test', 'Test'], ['kart', 'Açıklama kartları'], ['sinav', 'Sınav tarzı'], ['deneme', 'Deneme sınavı (Mock exam)']];
  function ac(){
    if (root) { git(aktifSekme); return; }
    css();
    root = el('div'); root.id = 'tk-root'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', 'Tekrar Merkezi');
    var top = el('div', 'tk-top'); top.appendChild(el('h2', '', 'Tekrar Merkezi'));
    top.appendChild(btn('Kapat', '', kapat)); root.appendChild(top);
    tabsEl = el('div', 'tk-tabs'); tabsEl.setAttribute('role', 'tablist');
    SEKMELER.forEach(function(s){ var b = btn(s[1], '', function(){ git(s[0]); }); b.dataset.sekme = s[0]; b.setAttribute('role', 'tab'); tabsEl.appendChild(b); });
    root.appendChild(tabsEl);
    body = el('div', 'tk-body'); root.appendChild(body);
    document.body.appendChild(root);
    onEsc = function(e){ if (e.key === 'Escape') kapat(); };
    document.addEventListener('keydown', onEsc);
    git('terim');
  }
  function kapat(){
    if (!root) return;
    denemeTok++; denemeDurdur();
    document.removeEventListener('keydown', onEsc);
    if (root.parentNode) root.parentNode.removeChild(root);
    root = body = tabsEl = null;
  }
  function git(s){
    if (!root) return; aktifSekme = s; denemeTok++; denemeDurdur(); body.textContent = '';
    Array.prototype.forEach.call(tabsEl.children, function(b){ b.setAttribute('aria-selected', b.dataset.sekme === s ? 'true' : 'false'); });
    if (s === 'terim') terimSekmesi(); else if (s === 'test') testKur(); else if (s === 'kart') kartSekmesi(); else if (s === 'deneme') denemeSekmesi(); else sinavSekmesi();
  }

  /* ---------- 1. terimler ---------- */
  function terimSekmesi(){
    var ara = el('input'); ara.type = 'search'; ara.placeholder = 'Terim ara (İngilizce veya Türkçe)'; ara.setAttribute('aria-label', 'Terim ara');
    var sel = el('select'); sel.setAttribute('aria-label', 'İstasyon filtresi');
    [['hepsi', 'Tüm istasyonlar'], ['temel', 'Temel liste']].concat(stIds().map(function(id){ return [id, stAd(id)]; })).forEach(function(o){ var op = el('option', '', o[1]); op.value = o[0]; sel.appendChild(op); });
    var lbl = el('label', 'tk-row'), cb = el('input'); cb.type = 'checkbox'; lbl.appendChild(cb); lbl.appendChild(el('span', '', 'Kendini sına: Türkçeyi gizle'));
    var sayac = el('span', 'tk-muted'), liste = el('div');
    var r = el('div', 'tk-row'); r.appendChild(ara); r.appendChild(sel); r.appendChild(lbl); r.appendChild(sayac);
    body.appendChild(r); body.appendChild(liste);
    function satir(t){
      var row = el('div', 'tk-t'); row.appendChild(el('b', '', t.en));
      if (cb.checked) {
        var g = el('span', 'tr gizli', 'göster'); g.tabIndex = 0;
        var goster = function(){ g.textContent = t.tr; g.className = 'tr'; };
        g.addEventListener('click', goster); g.addEventListener('keydown', function(e){ if (e.key === 'Enter') goster(); });
        row.appendChild(g);
      } else row.appendChild(el('span', 'tr', t.tr));
      return row;
    }
    function ciz(){
      liste.textContent = ''; var q = ara.value.trim().toLowerCase(), son = null, n = 0;
      terimler().filter(function(t){ return (sel.value === 'hepsi' || t.g === sel.value) && (!q || t.en.toLowerCase().indexOf(q) >= 0 || t.tr.toLowerCase().indexOf(q) >= 0); })
        .sort(function(a, b){ return a.g === b.g ? a.en.localeCompare(b.en) : ((a.g === 'temel') - (b.g === 'temel')) || (a.g < b.g ? -1 : 1); })
        .forEach(function(t){
          if (t.g !== son) { son = t.g; liste.appendChild(el('div', 'tk-g', t.g === 'temel' ? 'Temel terimler' : stAd(t.g))); }
          liste.appendChild(satir(t)); n++;
        });
      sayac.textContent = n + ' terim';
    }
    ara.addEventListener('input', ciz); sel.addEventListener('change', ciz); cb.addEventListener('change', ciz); ciz();
  }

  /* ---------- 2. test ---------- */
  var secili = {}, sayiSecim = 10;
  function testKur(){
    var h = havuz(), k = yukle(), sec = el('div', 'tk-row');
    if (!Object.keys(secili).length) stIds().forEach(function(id){ secili[id] = true; });
    stIds().forEach(function(id){
      var c = el('button', 'tk-chip', stAd(id) + ' (' + h.filter(function(x){ return x.st === id; }).length + ')'); c.type = 'button';
      c.setAttribute('aria-pressed', secili[id] ? 'true' : 'false');
      c.addEventListener('click', function(){ secili[id] = !secili[id]; c.setAttribute('aria-pressed', secili[id] ? 'true' : 'false'); ozet(); }); sec.appendChild(c);
    });
    var say = el('div', 'tk-row'); say.appendChild(el('span', '', 'Soru sayısı:'));
    var sb = [];
    [10, 20, 0].forEach(function(n){
      var b = el('button', 'tk-chip', n ? String(n) : 'Hepsi'); b.type = 'button'; b.setAttribute('aria-pressed', sayiSecim === n ? 'true' : 'false');
      b.addEventListener('click', function(){ sayiSecim = n; sb.forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); });
      sb.push(b); say.appendChild(b);
    });
    var bilgi = el('div', 'tk-muted'), go = btn('Testi başlat', 'primary', null);
    function secHavuz(){ return h.filter(function(x){ return secili[x.st]; }); }
    function ozet(){ var n = secHavuz().length; bilgi.textContent = 'Havuzda ' + n + ' soru var.' + (k.son ? ' Son skor: ' + k.son.skor + '/' + k.son.toplam + '.' : ''); go.disabled = !n; }
    go.addEventListener('click', function(){ var p = mix(secHavuz()); if (sayiSecim) p = p.slice(0, sayiSecim); basla(p); });
    body.appendChild(el('div', 'tk-muted', 'Sorular istasyonlardaki düşman, tahmin, tuzak ve patron sorularından gelir. Hasar ya da voltaj yok; oyun ilerlemen değişmez.'));
    body.appendChild(sec); body.appendChild(say); body.appendChild(bilgi);
    var ra = el('div', 'tk-row'); ra.appendChild(go);
    if (k.yanlis.length) ra.appendChild(btn('Kayıtlı yanlışlarım (' + k.yanlis.length + ')', '', function(){ var p = h.filter(function(x){ return k.yanlis.indexOf(x.soru) >= 0; }); if (p.length) basla(mix(p)); }));
    body.appendChild(ra); ozet();
  }
  function basla(sorular){
    var i = 0, dogru = 0, yanlislar = [], kayit = yukle();
    function sor(){
      if (!root) return;
      body.textContent = '';
      if (i >= sorular.length) return bitis();
      var s = sorular[i];
      body.appendChild(el('div', 'tk-muted', 'Soru ' + (i + 1) + '/' + sorular.length + ' · ' + stAd(s.st)));
      body.appendChild(el('div', 'tk-soru', s.soru));
      var host = el('div'); body.appendChild(host);
      Q.ui.options.ask({ host: host, secenekler: s.secenekler }).then(function(idx){
        if (!root) return;
        var ok = s.secenekler[idx].dogru, d = s.secenekler.filter(function(x){ return x.dogru; })[0];
        var neden = (d.neden || '').replace(/^(Doğru|Hayır|Yanlış)\.\s*/, '') || s.ek;
        if (ok) dogru++; else yanlislar.push(s);
        kayit.yanlis = kayit.yanlis.filter(function(q){ return q !== s.soru; }); if (!ok) kayit.yanlis.push(s.soru); yaz(kayit);
        var fb = el('div', 'tk-fb ' + (ok ? 'iyi' : 'kotu'));
        fb.textContent = ok ? ('Doğru! ' + (neden ? 'Nedeni: ' + neden : '')) : ('Cevabın yanlış. Doğru seçenek: ' + d.t + '. Nedeni: ' + neden);
        fb.setAttribute('role', 'status');
        host.textContent = ''; host.appendChild(fb);
        var dev = btn(i + 1 >= sorular.length ? 'Sonucu gör' : 'Sonraki soru', 'primary', function(){ i++; sor(); }); host.appendChild(dev);
        try { dev.focus(); } catch (e) { /* odak yok */ }
      });
    }
    function bitis(){
      kayit.son = { skor: dogru, toplam: sorular.length, tarih: Date.now() }; yaz(kayit);
      body.appendChild(el('div', 'tk-soru', 'Skor: ' + dogru + '/' + sorular.length));
      if (yanlislar.length) {
        body.appendChild(el('div', 'tk-g', 'Yanlışların'));
        yanlislar.forEach(function(s){
          var d = s.secenekler.filter(function(x){ return x.dogru; })[0], c = el('div', 'tk-kart');
          c.appendChild(el('p', '', s.soru)); c.appendChild(el('p', 'tk-muted', 'Doğru: ' + d.t)); body.appendChild(c);
        });
      } else body.appendChild(el('div', 'tk-fb iyi', 'Hepsi doğru. Harika!'));
      var r = el('div', 'tk-row');
      if (yanlislar.length) r.appendChild(btn('Yanlışları tekrar et', 'primary', function(){ basla(mix(yanlislar)); }));
      r.appendChild(btn('Yeni test', '', function(){ git('test'); })); body.appendChild(r);
    }
    sor();
  }

  /* ---------- 3. açıklama kartları ---------- */
  function kartSekmesi(){
    var sel = el('select'); sel.setAttribute('aria-label', 'İstasyon');
    stIds().forEach(function(id){ var o = el('option', '', stAd(id)); o.value = id; sel.appendChild(o); });
    var grid = el('div', 'tk-grid'), r = el('div', 'tk-row'); r.appendChild(sel); body.appendChild(r); body.appendChild(grid);
    function kart(b, satirlar){ var c = el('div', 'tk-kart'); c.appendChild(el('h4', '', b)); satirlar.forEach(function(t){ if (t) c.appendChild(el('p', '', t)); }); grid.appendChild(c); }
    function ciz(){
      grid.textContent = ''; var s = Q.data.stations[sel.value]; if (!s) return;
      ((s.temelTur && s.temelTur.kartlar) || []).forEach(function(k){ kart(k.baslik, [k.metin]); });
      (s.engeller || []).forEach(function(e){
        if (e.tip === 'kavram') kart('Kavram: ' + (e.baslik || ''), [e.gorev, e.ogrenilen]);
        else if (e.tip === 'sandik') kart('Sandık' + (e.kart ? ' · ' + e.kart.id + ' (' + e.kart.yil + ')' : ''), [e.kart && e.kart.tekCumle].concat(e.ozet || []));
        else if (e.tip === 'kopru') kart('Zincir', [e.sonuc]);
      });
      if (!grid.children.length) grid.appendChild(el('div', 'tk-muted', 'Bu istasyonda kart yok.'));
    }
    sel.addEventListener('change', ciz); ciz();
  }

  /* ---------- 4. sınav tarzı ---------- */
  function sinavSekmesi(){
    var p = acikSorular();
    if (!p.length) { body.appendChild(el('div', 'tk-muted', 'Açık uçlu soru bulunamadı.')); return; }
    body.appendChild(el('div', 'tk-muted', 'Bir açık uçlu soru gelir; cevabını kendi cümlelerinle yaz. Claude varsa puanlar, yoksa ideal cevapla kendin karşılaştırırsın.'));
    var yer = el('div'); body.appendChild(yer);
    function yeni(){
      var x = p[Math.floor(Math.random() * p.length)], f = x.f; yer.textContent = '';
      yer.appendChild(el('div', 'tk-muted', stAd(x.st)));
      if (f.pdfSoru) yer.appendChild(el('div', 'tk-muted', f.pdfSoru));
      yer.appendChild(el('div', 'tk-soru', f.soru));
      var host = el('div'); yer.appendChild(host);
      Q.ui.textbox.ask({ host: host }).then(function(cevap){
        if (!root) return; host.textContent = '';
        var fb = el('div', 'tk-fb'); host.appendChild(fb);
        fb.appendChild(el('p', '', 'İdeal cevap: ' + f.idealCevap));
        if (f.anahtarFikirler) fb.appendChild(el('p', 'tk-muted', 'Anahtar fikirler: ' + f.anahtarFikirler.join(' · ')));
        var son = el('div', 'tk-row'); host.appendChild(son);
        function bitir(){ son.textContent = ''; son.appendChild(btn('Başka soru', 'primary', yeni)); }
        function kendin(){
          if (!cevap) { son.appendChild(el('span', '', 'Bu sefer bilemedin; ideal cevaba bak.')); bitir(); return; }
          son.appendChild(el('span', '', 'Kendini işaretle:'));
          son.appendChild(btn('Doğru yazdım', '', function(){ fb.classList.add('iyi'); bitir(); }));
          son.appendChild(btn('Eksiğim var', '', function(){ fb.classList.add('kotu'); bitir(); }));
        }
        if (!cevap || !Q.claude || !Q.claude.grade || !Q.claude.available) return kendin();
        var bekle = el('p', 'tk-muted', 'Puanlanıyor...'); fb.appendChild(bekle);
        var zaman = new Promise(function(_, rj){ setTimeout(function(){ rj({ code: 'gecici' }); }, 25000); });
        Promise.race([Q.claude.available(), zaman]).then(function(a){
          if (!a || a.backend === 'none') throw { code: 'yok' };
          return Promise.race([Q.claude.grade({ soru: f.soru, anahtarFikirler: f.anahtarFikirler || [], yanlisKavramlar: f.yanlisKavramlar || [], idealCevap: f.idealCevap, cevap: cevap, eminlik: 1 }), zaman]);
        }).then(function(pu){
          bekle.textContent = 'Puanın: %' + pu.dogruluk + (pu.geriBildirim && pu.geriBildirim.length ? ' · ' + pu.geriBildirim.join(' ') : '');
          fb.classList.add(pu.dogruluk >= 60 ? 'iyi' : 'kotu'); bitir();
        }, function(){ bekle.textContent = 'Claude şu an yok; kendin işaretle.'; kendin(); });
      });
    }
    yeni();
  }

  /* ---------- 5. Deneme sınavı (Mock exam) ---------- */
  var denemeTok = 0, denemeTimer = null, denemeAyar = { sure: true, anlik: true, kume: 'secki' };
  function denemeDurdur(){ if (denemeTimer) { clearInterval(denemeTimer); denemeTimer = null; } }
  function sinavVeri(){ var d = Q.data && Q.data.sinav || {}; return { mcq: d.mcq || [], klasik: d.klasik || [] }; }
  function trMi(t){ return /[çğıöşüÇĞİÖŞÜ]/.test(t) || /(^|\s)(ve|bir|için|çünkü|olur|ile|değil|olarak)(\s|[.,]|$)/i.test(t); }
  function mmss(ms){ var s = Math.floor(ms / 1000), m = Math.floor(s / 60); s = s % 60; return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s; }

  function denemeSekmesi(){
    var v = sinavVeri(), k = yukle();
    var sm = v.mcq.filter(function(x){ return x.secki; }), sk = v.klasik.filter(function(x){ return x.secki; });
    var kume = (denemeAyar.kume === 'tum' || !sm.length) ? 'tum' : 'secki';
    var hm = kume === 'secki' ? sm : v.mcq, hk = kume === 'secki' ? sk : v.klasik;
    var nm = Math.min(50, hm.length), nk = Math.min(20, hk.length);
    body.appendChild(el('div', 'tk-muted', 'Gerçek sınav gibi: tüm sorular İngilizce, istasyonlar karışık. Önce çoktan seçmeli (MCQ), sonra klasik (yazılı) sorular. Cevaplarını İngilizce yaz; terim bilmiyorsan sınav sonundaki terim listesine bak.'));
    var kutu = el('div', 'tk-kart'); kutu.appendChild(el('h4', '', 'Bu sınavda'));
    kutu.appendChild(el('p', '', nm + ' çoktan seçmeli + ' + nk + ' klasik soru' + ((nm < 50 || nk < 20) ? ' (havuzda şimdilik bu kadar var; hedef 50 + 20)' : '') + '.'));
    if (kume === 'secki') kutu.appendChild(el('p', 'tk-muted', 'Seçki: çıkma olasılığı en yüksek olduğu tahmin edilen sorular (örnek sınav, öncelikli konular, zayıf noktalar). Bu bir tahmindir, gerçek soruları bilmiyoruz. Havuzda toplam ' + v.mcq.length + ' MCQ + ' + v.klasik.length + ' klasik var.'));
    if (k.sinav && k.sinav.son) { var o = k.sinav.son; kutu.appendChild(el('p', 'tk-muted', 'Son deneme: MCQ ' + o.mcq[0] + '/' + o.mcq[1] + ', klasik ' + o.klasik[0] + '/' + o.klasik[1] + ' puan' + (o.sure ? ', süre ' + mmss(o.sure) : '') + '.')); }
    body.appendChild(kutu);
    function secenek(ad, anahtar, a, b){
      var r = el('div', 'tk-row'); r.appendChild(el('span', '', ad));
      var bs = [];
      [[true, a], [false, b]].forEach(function(o){
        var c = el('button', 'tk-chip', o[1]); c.type = 'button'; c.setAttribute('aria-pressed', denemeAyar[anahtar] === o[0] ? 'true' : 'false');
        c.addEventListener('click', function(){ denemeAyar[anahtar] = o[0]; bs.forEach(function(x){ x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); }); });
        bs.push(c); r.appendChild(c);
      });
      body.appendChild(r);
    }
    if (sm.length) {
      var rk = el('div', 'tk-row'); rk.appendChild(el('span', '', 'Soru kümesi:'));
      var kb = [];
      [['secki', 'Seçki (' + sm.length + ' + ' + sk.length + ')'], ['tum', 'Tüm havuz']].forEach(function(o){
        var c = el('button', 'tk-chip', o[1]); c.type = 'button'; c.setAttribute('aria-pressed', kume === o[0] ? 'true' : 'false');
        c.addEventListener('click', function(){ denemeAyar.kume = o[0]; git('deneme'); });
        kb.push(c); rk.appendChild(c);
      });
      body.appendChild(rk);
    }
    secenek('Süre sayacı:', 'sure', 'Açık', 'Kapalı');
    secenek('MCQ geri bildirimi:', 'anlik', 'Her sorudan sonra', 'Sınav sonunda toplu');
    var go = btn('Sınavı başlat', 'primary', function(){ denemeBasla(mix(hm).slice(0, 50), mix(hk).slice(0, 20)); });
    if (!nm && !nk) { go.disabled = true; body.appendChild(el('div', 'tk-fb kotu', 'Sınav sorusu bulunamadı.')); }
    var r = el('div', 'tk-row'); r.appendChild(go); body.appendChild(r);
  }

  function denemeBasla(mq, kq){
    var tok = ++denemeTok, t0 = Date.now(), sonuc = { mcq: [], kl: [] }, zaman = el('span', 'tk-muted');
    denemeDurdur();
    function canli(){ return root && tok === denemeTok; }
    function tick(){ zaman.textContent = '⏱ ' + mmss(Date.now() - t0); }
    if (denemeAyar.sure) { tick(); denemeTimer = setInterval(tick, 1000); }
    function ust(metin){
      var r = el('div', 'tk-row'); r.appendChild(el('span', 'tk-muted', metin));
      if (denemeAyar.sure) r.appendChild(zaman);
      return r;
    }
    function mcqSor(i){
      if (!canli()) return;
      body.textContent = '';
      if (i >= mq.length) return klSor(0);
      var s = mq[i];
      body.appendChild(ust('MCQ ' + (i + 1) + '/' + mq.length));
      body.appendChild(el('div', 'tk-soru', s.q));
      var host = el('div'); body.appendChild(host);
      Q.ui.options.ask({ host: host, secenekler: s.options.map(function(t){ return { t: t }; }) }).then(function(idx){
        if (!canli()) return;
        var ok = idx === s.answer; sonuc.mcq.push({ s: s, idx: idx, ok: ok });
        if (!denemeAyar.anlik) return mcqSor(i + 1);
        host.textContent = '';
        var fb = el('div', 'tk-fb ' + (ok ? 'iyi' : 'kotu')); fb.setAttribute('role', 'status');
        fb.appendChild(el('p', '', ok ? 'Correct.' : 'Incorrect. Correct answer: ' + s.options[s.answer]));
        fb.appendChild(el('p', '', s.explanation));
        fb.appendChild(el('p', 'tk-muted', ok ? 'Doğru.' : 'Yanlış. Doğru şık: ' + s.options[s.answer] + '. Açıklamayı İngilizce okuyup terimleri not al.'));
        host.appendChild(fb);
        var dev = btn(i + 1 >= mq.length ? (kq.length ? 'Klasik sorulara geç' : 'Sonucu gör') : 'Sonraki soru', 'primary', function(){ mcqSor(i + 1); });
        host.appendChild(dev); try { dev.focus(); } catch (e) { /* odak yok */ }
      });
    }
    function klSor(i){
      if (!canli()) return;
      body.textContent = '';
      if (i >= kq.length) return bitis();
      var s = kq[i];
      body.appendChild(ust('Klasik ' + (i + 1) + '/' + kq.length + ' · answer in English'));
      body.appendChild(el('div', 'tk-soru', s.question));
      var host = el('div'); body.appendChild(host);
      var ta = el('textarea'); ta.rows = 9; ta.maxLength = 3000; ta.placeholder = 'Write your answer in English...'; ta.setAttribute('aria-label', 'Your answer');
      ta.style.cssText = 'width:100%;box-sizing:border-box;background:var(--panel2);color:var(--ink);border:2px solid var(--line);border-radius:8px;padding:8px 10px;font:inherit;resize:vertical';
      host.appendChild(ta);
      var ac2 = el('div', 'tk-row');
      function gonder(cevap){ ta.disabled = true; ac2.textContent = ''; degerlendir(s, cevap, host, function(p){ sonuc.kl.push({ s: s, puan: p }); klSor(i + 1); }, i + 1 >= kq.length); }
      ac2.appendChild(btn('Submit', 'primary', function(){ var t = ta.value.trim(); gonder(t || null); }));
      ac2.appendChild(btn('Bilmiyorum (skip)', '', function(){ gonder(null); }));
      host.appendChild(ac2);
      try { ta.focus(); } catch (e) { /* odak yok */ }
    }
    function degerlendir(s, cevap, host, bitti, son){
      var fb = el('div', 'tk-fb'); host.appendChild(fb);
      if (cevap && trMi(cevap)) fb.appendChild(el('p', 'tk-muted', 'Cevabın Türkçe görünüyor. İngilizce yazmayı dene; sınav İngilizce (Try to write in English).'));
      fb.appendChild(el('p', '', 'Model answer (örnek cevap): ' + s.modelAnswer));
      fb.appendChild(el('p', 'tk-muted', 'Key points (anahtar noktalar): ' + s.keyPoints.join(' · ')));
      var son2 = el('div', 'tk-row'); host.appendChild(son2);
      function ilerle(p, sinif){ if (sinif) fb.classList.add(sinif); son2.textContent = ''; var d = btn(son ? 'Sonucu gör' : 'Sonraki soru', 'primary', function(){ bitti(p); }); son2.appendChild(d); try { d.focus(); } catch (e) { /* odak yok */ } }
      function kendin(){
        if (!cevap) { son2.appendChild(el('span', '', 'Bu sefer boş; örnek cevaba bak.')); return ilerle(0, 'kotu'); }
        son2.appendChild(el('span', '', 'Kendini işaretle:'));
        [['✓ Doğru', 1, 'iyi'], ['Kısmen', 0.5, ''], ['✗ Yanlış', 0, 'kotu']].forEach(function(o){ son2.appendChild(btn(o[0], '', function(){ ilerle(o[1], o[2]); })); });
      }
      if (!cevap || !Q.claude || !Q.claude.grade || !Q.claude.available) return kendin();
      var bekle = el('p', 'tk-muted', 'Puanlanıyor...'); fb.appendChild(bekle);
      var tm = new Promise(function(_, rj){ setTimeout(function(){ rj({ code: 'gecici' }); }, 25000); });
      Promise.race([Q.claude.available(), tm]).then(function(a){
        if (!a || a.backend === 'none') throw { code: 'yok' };
        return Promise.race([Q.claude.grade({ soru: s.question, anahtarFikirler: s.keyPoints, yanlisKavramlar: [], idealCevap: s.modelAnswer, cevap: cevap, eminlik: 1 }), tm]);
      }).then(function(pu){
        if (!canli()) return;
        var p = Math.max(0, Math.min(1, (pu.dogruluk || 0) / 100));
        bekle.textContent = 'Puanın: %' + pu.dogruluk + (pu.geriBildirim && pu.geriBildirim.length ? ' · ' + pu.geriBildirim.join(' ') : '');
        ilerle(p, p >= 0.6 ? 'iyi' : 'kotu');
      }, function(){ if (!canli()) return; bekle.textContent = 'Claude şu an yok; kendin işaretle.'; kendin(); });
    }
    function bitis(){
      denemeDurdur(); var sure = Date.now() - t0;
      body.textContent = '';
      var dm = sonuc.mcq.filter(function(x){ return x.ok; }).length, pk = sonuc.kl.reduce(function(a, x){ return a + x.puan; }, 0);
      var kay = yukle(); kay.sinav = { son: { mcq: [dm, sonuc.mcq.length], klasik: [Math.round(pk * 10) / 10, sonuc.kl.length], tarih: Date.now(), sure: sure } }; yaz(kay);
      body.appendChild(el('div', 'tk-soru', 'MCQ: ' + dm + '/' + sonuc.mcq.length + ' · Klasik: ' + (Math.round(pk * 10) / 10) + '/' + sonuc.kl.length + ' puan · Süre: ' + mmss(sure)));
      /* zayıf konular */
      var agirlik = {};
      sonuc.mcq.forEach(function(x){ if (!x.ok) agirlik[stAd(x.s.station)] = (agirlik[stAd(x.s.station)] || 0) + 1; });
      var kavr = {};
      sonuc.kl.forEach(function(x){ if (x.puan < 0.6) kavr[x.s.concept + ' (' + x.s.station + ')'] = 1; });
      body.appendChild(el('div', 'tk-g', 'Zayıf konular'));
      var ag = Object.keys(agirlik), kv = Object.keys(kavr);
      if (!ag.length && !kv.length) body.appendChild(el('div', 'tk-fb iyi', 'Belirgin zayıf konu yok.'));
      ag.forEach(function(a){ body.appendChild(el('div', 'tk-t', a + ': ' + agirlik[a] + ' yanlış MCQ')); });
      if (kv.length) body.appendChild(el('div', 'tk-t', 'Klasik, tekrar edilecek kavramlar: ' + kv.join(', ')));
      /* yanlış MCQ listesi */
      var yan = sonuc.mcq.filter(function(x){ return !x.ok; });
      if (yan.length) {
        body.appendChild(el('div', 'tk-g', 'Yanlışların (' + yan.length + ')'));
        yan.forEach(function(x){
          var c = el('div', 'tk-kart'); c.appendChild(el('p', '', x.s.q));
          c.appendChild(el('p', 'tk-muted', 'Your answer: ' + x.s.options[x.idx] + ' · Correct: ' + x.s.options[x.s.answer]));
          c.appendChild(el('p', '', x.s.explanation)); body.appendChild(c);
        });
      }
      /* sınav sonrası terim listesi */
      var yanMetin = yan.map(function(x){ return x.s.q + ' ' + x.s.explanation; }).concat(sonuc.kl.filter(function(x){ return x.puan < 0.6; }).map(function(x){ return x.s.question + ' ' + x.s.modelAnswer; })).join(' ').toLowerCase();
      var tum = mq.map(function(s){ return s.q + ' ' + s.options.join(' ') + ' ' + s.explanation; }).concat(kq.map(function(s){ return s.question + ' ' + s.modelAnswer + ' ' + s.keyPoints.join(' '); })).join(' ').toLowerCase();
      function var2(t, m){ var i = m.indexOf(t.en.toLowerCase()); return i >= 0 && !/[a-z]/.test(m.charAt(i - 1) || ' ') ; }
      var tl = terimler().filter(function(t){ return t.en.length >= 5 && var2(t, tum); }).map(function(t){ return { t: t, w: var2(t, yanMetin) ? 1 : 0 }; })
        .sort(function(a, b){ return b.w - a.w || a.t.en.localeCompare(b.t.en); }).slice(0, 60);
      body.appendChild(el('div', 'tk-g', 'Sınav sonrası terim listesi (' + tl.length + ')'));
      if (!tl.length) body.appendChild(el('div', 'tk-muted', 'Eşleşen terim bulunamadı.'));
      tl.forEach(function(o){ var row = el('div', 'tk-t'); row.appendChild(el('b', '', o.t.en)); row.appendChild(el('span', 'tr', o.t.tr + (o.w ? ' · yanlış yaptığın konuda' : ''))); body.appendChild(row); });
      var r = el('div', 'tk-row'); r.appendChild(btn('Yeni deneme', 'primary', function(){ git('deneme'); })); body.appendChild(r);
    }
    mcqSor(0);
  }
  Q.tekrar = { open: ac, close: kapat, terimler: terimler, havuz: havuz };
})();
