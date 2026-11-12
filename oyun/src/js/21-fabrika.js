/* 21-fabrika.js · Fabrika şeması: ham kum -> çip hattı (harita ekranının üst bölümü).
 * Ekler: Q.fabrika.render(ctx) -> { root, panel }, Q.fabrika.ozet(durumlar), Q.fabrika.cevapla(id, dogru).
 * ctx (20-settings.js verir): { st: [istasyonlar], durum(s) -> tamam|sirada|acik|kilitli, tamam(s), baslat(s, from),
 *   engelAtla(s, ob, i), final() -> bool|null }.
 * Kayıt: Q.state.fabrikaMini = { sNN: { dogru, deneme } } (üst düzey, geriye uyumlu ek alan).
 * Veri: Q.data.fabrika (88-data-fabrika.js). Bağımlılık: 00-q.js, 10-state.js. */
(function(){
  'use strict';
  var F = Q.fabrika = Q.fabrika || {};
  var NS = 'http://www.w3.org/2000/svg';
  var COLS = 6, W = 1100, NW = 148, NH = 104, ROW0 = 16, ROW1 = 186, H = 306;
  var son = null;   // son onarılan istasyon: harita açılınca paneli kendiliğinden açar

  function doc(){ return (typeof document !== 'undefined') ? document : null; }
  function el(tag, cls, text){ var e = Q.util.el(tag, cls); if (text != null) e.textContent = text; return e; }
  function sv(tag, attrs, parent){
    var e = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function(k){ e.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(e);
    return e;
  }
  function veri(id){ return (Q.data && Q.data.fabrika && Q.data.fabrika.istasyonlar && Q.data.fabrika.istasyonlar[id]) || null; }
  function mini(){
    if (!Q.state.fabrikaMini || typeof Q.state.fabrikaMini !== 'object' || Array.isArray(Q.state.fabrikaMini)) Q.state.fabrikaMini = {};
    return Q.state.fabrikaMini;
  }
  F.cevapla = function(id, dogru){
    var m = mini(), e = m[id] || { dogru: false, deneme: 0 };
    e.deneme++; if (dogru) e.dogru = true;
    m[id] = e; if (Q.save && Q.save.write) Q.save.write();
    return e;
  };
  F.ozet = function(st, tamamFn){
    var n = st.filter(function(s){ return tamamFn(s); }).length, t = st.length;
    return { tamam: n, toplam: t, yuzde: t ? Math.round(n * 100 / t) : 0 };
  };
  Q.bus.on('station:end', function(e){ if (e && e.sonuc === 'tamam') son = e.stationId; });

  /* ---------- şema çizimi ---------- */
  function pos(i){
    var satir = Math.floor(i / COLS), k = i % COLS;
    var kol = satir % 2 === 0 ? k : COLS - 1 - k;
    return { x: kol * (W - NW) / (COLS - 1), y: satir === 0 ? ROW0 : ROW1, satir: satir };
  }
  function lerp(a, b, t){ return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }; }
  function cizgi(a, b, attrs, parent){
    return sv('line', Object.assign({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, 'stroke-linecap': 'round' }, attrs), parent);
  }
  function boru(g, p1, p2, durum, renk){
    var yon = { x: Math.sign(p2.x - p1.x), y: Math.sign(p2.y - p1.y) };
    var ok = { x: p2.x - yon.x * 2, y: p2.y - yon.y * 2 };
    var grp = sv('g', { class: 'fb-boru fb-boru-' + durum }, g);
    if (durum === 'akis') {
      cizgi(p1, p2, { stroke: '#0b0620', 'stroke-width': 16 }, grp);
      cizgi(p1, p2, { stroke: renk, 'stroke-width': 10 }, grp);
      cizgi(p1, p2, { stroke: '#fff', 'stroke-width': 3, class: 'fb-akis', 'stroke-dasharray': '6 14' }, grp);
    } else {
      var a = lerp(p1, p2, 0.38), b = lerp(p1, p2, 0.62), m = lerp(p1, p2, 0.5);
      cizgi(p1, a, { stroke: '#0b0620', 'stroke-width': 14 }, grp); cizgi(p1, a, { stroke: '#6d6590', 'stroke-width': 8 }, grp);
      cizgi(b, p2, { stroke: '#0b0620', 'stroke-width': 14 }, grp); cizgi(b, p2, { stroke: '#6d6590', 'stroke-width': 8 }, grp);
      var x = sv('g', { class: 'fb-kirik', transform: 'translate(' + m.x + ',' + m.y + ')' }, grp);
      sv('path', { d: 'M-6 -6 L6 6 M6 -6 L-6 6', stroke: durum === 'kirik' ? '#ff4d6d' : '#8d86ad', 'stroke-width': 3.5, 'stroke-linecap': 'round', fill: 'none' }, x);
    }
    var d = 9, n = yon.x ? { x: 0, y: d } : { x: d, y: 0 };
    sv('polygon', { points: [ok.x + ',' + ok.y, (ok.x - yon.x * d * 1.3 + n.x) + ',' + (ok.y - yon.y * d * 1.3 + n.y), (ok.x - yon.x * d * 1.3 - n.x) + ',' + (ok.y - yon.y * d * 1.3 - n.y) ].join(' '),
      fill: durum === 'akis' ? renk : '#6d6590', stroke: '#0b0620', 'stroke-width': 2, 'stroke-linejoin': 'round' }, grp);
  }
  function makine(g, renk, durum, ox, oy){
    var m = sv('g', { transform: 'translate(' + ox + ',' + oy + ')', class: 'fb-makine' }, g);
    var f = durum === 'tamam' ? renk : (durum === 'sirada' ? '#3a5bff' : '#4a4468');
    sv('rect', { x: 4, y: 12, width: 40, height: 24, rx: 4, fill: f, stroke: '#0b0620', 'stroke-width': 3 }, m);
    sv('rect', { x: 12, y: 4, width: 8, height: 8, fill: '#25164f', stroke: '#0b0620', 'stroke-width': 3 }, m);
    if (durum === 'kilitli' || durum === 'acik') {
      sv('rect', { x: 18, y: 20, width: 12, height: 10, rx: 2, fill: '#9a93bd', stroke: '#0b0620', 'stroke-width': 2 }, m);
      sv('path', { d: 'M21 20v-3a3 3 0 0 1 6 0v3', fill: 'none', stroke: '#9a93bd', 'stroke-width': 2.5 }, m);
    } else {
      sv('circle', { cx: 24, cy: 26, r: 7, fill: '#0e0724', stroke: '#0b0620', 'stroke-width': 3 }, m);
      var sp = sv('g', { class: durum === 'tamam' ? 'fb-pervane' : '' }, m);
      sv('path', { d: 'M24 20v12M18 26h12', stroke: durum === 'tamam' ? '#39ff88' : '#00e5ff', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, sp);
      sp.style.transformOrigin = '24px 26px';
    }
    if (durum === 'tamam') { var du = sv('g', { class: 'fb-duman' }, m); sv('circle', { cx: 16, cy: 0, r: 3, fill: '#c4b9ec' }, du); }
  }
  var DURUM_AD = { tamam: 'Çalışıyor', sirada: 'Sıradaki', kilitli: 'Kilitli', acik: 'Bozuk' };

  function dugum(g, o){
    var d = o.durum, p = o.pos;
    var n = sv('g', { class: 'fb-node fb-' + d, transform: 'translate(' + p.x + ',' + p.y + ')', tabindex: 0, role: 'button',
      'aria-label': o.ad + ': ' + DURUM_AD[d], 'data-id': o.id, 'data-durum': d }, g);
    sv('rect', { class: 'fb-kutu', width: NW, height: NH, rx: 14, fill: d === 'tamam' ? '#1e1342' : '#1a1233', stroke: d === 'tamam' ? o.renk : d === 'sirada' ? '#00e5ff' : '#6d6590',
      'stroke-width': d === 'kilitli' ? 3 : 4, 'stroke-dasharray': d === 'kilitli' ? '7 6' : '' }, n);
    if (d === 'tamam') sv('rect', { x: 0, y: 0, width: NW, height: 8, rx: 4, fill: o.renk, opacity: .9 }, n);
    makine(n, o.renk, d, 8, 14);
    sv('text', { x: NW - 12, y: 36, 'text-anchor': 'end', class: 'fb-no', fill: d === 'tamam' ? o.renk : '#c4b9ec' }, n).textContent = o.no;
    sv('text', { x: NW / 2, y: 74, 'text-anchor': 'middle', class: 'fb-ad', fill: d === 'kilitli' ? '#9a93bd' : '#ffffff' }, n).textContent = o.kisa;
    sv('text', { x: NW / 2, y: 94, 'text-anchor': 'middle', class: 'fb-dr', fill: d === 'tamam' ? '#39ff88' : d === 'sirada' ? '#00e5ff' : '#9a93bd' }, n).textContent = DURUM_AD[d];
    return n;
  }
  function uc(g, tip, pos, hazir){
    var n = sv('g', { class: 'fb-uc fb-uc-' + tip + (hazir ? ' fb-hazir' : ''), transform: 'translate(' + pos.x + ',' + pos.y + ')' }, g);
    sv('rect', { width: NW, height: NH, rx: 14, fill: '#1a1233', stroke: hazir ? '#39ff88' : '#6d6590', 'stroke-width': 4, 'stroke-dasharray': hazir || tip === 'kaynak' ? '' : '7 6' }, n);
    if (tip === 'kaynak') {
      sv('path', { d: 'M24 62 Q74 20 124 62 Z', fill: '#e6c88a', stroke: '#0b0620', 'stroke-width': 3 }, n);
      [[46, 50], [66, 40], [86, 46], [104, 54], [76, 56]].forEach(function(c){ sv('circle', { cx: c[0], cy: c[1], r: 2.4, fill: '#b8924f' }, n); });
    } else {
      sv('rect', { x: 46, y: 18, width: 56, height: 44, rx: 5, fill: hazir ? '#39ff88' : '#4a4468', stroke: '#0b0620', 'stroke-width': 3 }, n);
      sv('rect', { x: 58, y: 30, width: 32, height: 20, rx: 2, fill: hazir ? '#0e5a30' : '#2a2540' }, n);
      for (var i = 0; i < 4; i++) { sv('rect', { x: 52 + i * 14, y: 10, width: 5, height: 8, fill: '#c4b9ec' }, n); sv('rect', { x: 52 + i * 14, y: 62, width: 5, height: 8, fill: '#c4b9ec' }, n); }
    }
    sv('text', { x: NW / 2, y: 92, 'text-anchor': 'middle', class: 'fb-ad', fill: hazir || tip === 'kaynak' ? '#ffffff' : '#9a93bd' }, n).textContent = tip === 'kaynak' ? Q.data.fabrika.kaynak.kisa : (hazir ? 'Çip hazır' : Q.data.fabrika.cikti.kisa);
  }

  F.render = function(ctx){
    var st = ctx.st, tamamFn = ctx.tamam;
    var oz = F.ozet(st, tamamFn), hepsi = oz.toplam > 0 && oz.tamam === oz.toplam;
    var root = el('section', 'fb-root'); root.setAttribute('aria-label', 'Fabrika şeması');
    /* başlık */
    var hd = el('div', 'fb-baslik');
    var t1 = el('div', 'fb-ozet');
    t1.appendChild(el('b', '', oz.tamam + '/' + oz.toplam + ' bölüm onarıldı'));
    t1.appendChild(el('span', 'fb-yuzde', 'Hat %' + oz.yuzde + ' çalışıyor'));
    hd.appendChild(t1);
    var bar = el('div', 'fb-bar'); bar.setAttribute('role', 'progressbar'); bar.setAttribute('aria-valuemin', '0'); bar.setAttribute('aria-valuemax', '100'); bar.setAttribute('aria-valuenow', String(oz.yuzde));
    var fill = el('div', 'fb-bar-dolu'); fill.style.width = oz.yuzde + '%'; bar.appendChild(fill); hd.appendChild(bar);
    if (hepsi) {
      var k = el('div', 'fb-kutlama'); k.setAttribute('role', 'status');
      for (var c = 0; c < 14; c++) { var cf = el('i', 'fb-konfeti'); cf.style.left = (4 + c * 7) + '%'; cf.style.animationDelay = (c % 5) * 0.15 + 's'; cf.style.background = ['#ffd23f', '#00e5ff', '#ff3df0', '#39ff88'][c % 4]; k.appendChild(cf); }
      k.appendChild(el('b', '', 'Hat tamamen çalışıyor!'));
      k.appendChild(el('span', '', 'Ham kum artık çipe dönüşüyor. Tüm bölümleri sen onardın.'));
      var fin = ctx.final && ctx.final();
      if (fin) { var fb = el('button', 'btn primary', 'Sınav Günü (Final)'); fb.type = 'button'; fb.id = 'fb-final'; fb.addEventListener('click', fin); k.appendChild(fb); }
      root.appendChild(k);
    }
    /* şema */
    var kap = el('div', 'fb-sema'); kap.tabIndex = -1;
    var svg = sv('svg', { viewBox: '-8 -8 ' + (W + 16) + ' ' + (H + 16), class: 'fb-svg', role: 'group', 'aria-label': 'Sand (kum) > çip üretim hattı' });
    var boruG = sv('g', {}, svg), dugG = sv('g', {}, svg);
    var seq = [{ tip: 'kaynak' }].concat(st.map(function(s){ return { tip: 'st', s: s }; })).concat([{ tip: 'cikti' }]);
    var done = seq.map(function(q){ return q.tip === 'kaynak' ? true : q.tip === 'cikti' ? hepsi : tamamFn(q.s); });
    var nodes = {};
    seq.forEach(function(q, i){
      var p = pos(i);
      if (i > 0) {
        var pa = pos(i - 1), A, B;
        if (pa.satir !== p.satir) { A = { x: pa.x + NW / 2, y: pa.y + NH }; B = { x: p.x + NW / 2, y: p.y }; }
        else if (p.x > pa.x) { A = { x: pa.x + NW, y: pa.y + NH / 2 }; B = { x: p.x, y: p.y + NH / 2 }; }
        else { A = { x: pa.x, y: pa.y + NH / 2 }; B = { x: p.x + NW, y: p.y + NH / 2 }; }
        var bd = done[i] && done[i - 1] ? 'akis' : done[i - 1] ? 'kirik' : 'olu';
        boru(boruG, A, B, bd, i - 1 === 0 ? '#e6c88a' : (seq[i - 1].s.renk || '#00e5ff'));
      }
      if (q.tip === 'kaynak') uc(dugG, 'kaynak', p, true);
      else if (q.tip === 'cikti') uc(dugG, 'cikti', p, hepsi);
      else {
        var s = q.s, vd = veri(s.id) || {};
        nodes[s.id] = dugum(dugG, { id: s.id, durum: ctx.durum(s), renk: s.renk || '#00e5ff', pos: p, no: String(s.sira), ad: s.ad, kisa: vd.kisa || s.ad });
      }
    });
    kap.appendChild(svg); root.appendChild(kap);
    var panel = ctx.panel;
    if (!panel) { panel = el('div', 'panel'); panel.id = 'a8-station-panel'; panel.style.padding = '12px'; panel.style.display = 'none'; root.appendChild(panel); }

    function sec(s){
      Object.keys(nodes).forEach(function(k){ nodes[k].classList.toggle('fb-sec', k === s.id); });
      if (ctx.onSec) ctx.onSec(s);
      F.panel(panel, s, ctx, function(){ sec(s); });
      if (!ctx.panel) { try { panel.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { /* eski tarayıcı */ } }
    }
    if (F._esc && doc()) { document.removeEventListener('keydown', F._esc, true); document.removeEventListener('focusin', F._fin, true); }
    var panelde = false;
    F._fin = function(e){ panelde = panel.contains(e.target); };
    document.addEventListener('focusin', F._fin, true);
    F._esc = function(e){
      if (e.key !== 'Escape' || !panelde) return;
      var cur = Object.keys(nodes).filter(function(k){ return nodes[k].classList.contains('fb-sec'); })[0];
      if (cur) setTimeout(function(){ try { if (panel.style.display === 'none') { nodes[cur].classList.remove('fb-sec'); nodes[cur].focus(); } } catch (x) { /* düğüm yok */ } }, 0);
    };
    document.addEventListener('keydown', F._esc, true);
    st.forEach(function(s){
      var n = nodes[s.id];
      n.addEventListener('click', function(){ sec(s); });
      n.addEventListener('keydown', function(e){
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); sec(s);
          var hh = panel.querySelector('.fb-p-ad'); if (hh) { try { hh.focus({ preventScroll: true }); } catch (x) { /* odak yok */ } }
          return;
        }
        var k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!k) return;
        e.preventDefault();
        var j = st.indexOf(s) + k, h = st[j];
        if (h && nodes[h.id]) nodes[h.id].focus();
      });
    });
    if (son) {
      var ss = st.filter(function(s){ return s.id === son; })[0];
      son = null;
      if (ss && tamamFn(ss)) { sec(ss); }
    }
    return { root: root, panel: panel, header: hd };
  };

  /* ---------- bölüm paneli ---------- */
  var PANEL_AD = { tamam: 'Çalışıyor', sirada: 'Sıradaki', kilitli: 'Kilitli', acik: 'Onarılabilir' };
  var IKON = {
    yapar: ['M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z', 'M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1'],
    neden: ['M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1', 'M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1'],
    kavram: ['M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z', 'M7.5 7.5h.01'],
    sure: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M12 7v5l3 2'],
    soru: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7', 'M12 17h.01']
  };
  function ikon(ad){
    var svg = sv('svg', { viewBox: '0 0 24 24', class: 'fb-ikon', 'aria-hidden': 'true', focusable: 'false', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    IKON[ad].forEach(function(d){ sv('path', { d: d }, svg); });
    return svg;
  }
  function kart(cls, ikonAd, baslik){
    var k = el('section', 'fb-kart ' + cls);
    var h = el('h4', 'fb-kart-bas'); var ib = el('span', 'fb-kart-ikon'); ib.appendChild(ikon(ikonAd)); h.appendChild(ib); h.appendChild(el('span', '', baslik));
    k.appendChild(h); return k;
  }
  function bant(s, d){
    var renk = s.renk || '#00e5ff';
    var b = el('div', 'fb-bant'); b.style.setProperty('--fb-renk', renk);
    var svg = sv('svg', { viewBox: '0 0 480 84', class: 'fb-bant-svg', 'aria-hidden': 'true', focusable: 'false', preserveAspectRatio: 'xMidYMid meet' });
    sv('line', { x1: 0, y1: 62, x2: 480, y2: 62, stroke: '#0b0620', 'stroke-width': 14 }, svg);
    sv('line', { x1: 0, y1: 62, x2: 480, y2: 62, stroke: d === 'tamam' ? renk : '#6d6590', 'stroke-width': 8 }, svg);
    if (d === 'tamam') sv('line', { x1: 0, y1: 62, x2: 480, y2: 62, stroke: '#fff', 'stroke-width': 2, 'stroke-dasharray': '6 14', class: 'fb-akis' }, svg);
    var g = sv('g', {}, svg);
    g.setAttribute('transform', 'translate(209,12) scale(1.35)'); makine(g, renk, d, 0, 0);
    sv('text', { x: 24, y: 58, class: 'fb-bant-no', fill: '#ffffff', opacity: .9 }, svg).textContent = String(s.sira);
    b.appendChild(svg);
    return b;
  }
  F.panel = function(panel, s, ctx, yenile){
    panel.textContent = ''; panel.style.display = '';
    var vd = veri(s.id) || {}, d = ctx.durum(s), tamam = d === 'tamam', acik = ctx.acik(s);
    var kok = el('div', 'fb-p fb-p-' + d); kok.style.setProperty('--fb-renk', s.renk || '#00e5ff');
    var govde = el('div', 'fb-p-govde');
    govde.appendChild(bant(s, d));
    var ic = el('div', 'fb-p-ic');
    var h3 = el('h3', 'fb-p-ad', s.ad); h3.tabIndex = -1; ic.appendChild(h3);
    var rozetSatir = el('div', 'fb-p-rozet');
    rozetSatir.appendChild(el('span', 'fb-durum fb-durum-' + d, PANEL_AD[d]));
    rozetSatir.appendChild(el('span', 'fb-p-sira', 'Bölüm ' + s.sira + ' / ' + ctx.st.length));
    ic.appendChild(rozetSatir);
    var k1 = kart('fb-k-yapar', 'yapar', 'Ne yapar'); k1.appendChild(el('p', '', vd.rol || s.konu)); ic.appendChild(k1);
    if (vd.neden) { var k2 = kart('fb-k-neden', 'neden', 'Çipte neden gerekli'); k2.appendChild(el('p', '', vd.neden)); ic.appendChild(k2); }
    if (vd.bagliKavramlar && vd.bagliKavramlar.length) {
      var k3 = kart('fb-k-kavram', 'kavram', 'Kavramlar'); var cl = el('div', 'fb-kav');
      vd.bagliKavramlar.forEach(function(t){ cl.appendChild(el('span', 'chip', t)); });
      k3.appendChild(cl); ic.appendChild(k3);
    }
    if (s.sure) {
      var su = el('p', 'fb-sure'); var si = el('span', 'fb-kart-ikon'); si.appendChild(ikon('sure')); su.appendChild(si);
      su.appendChild(el('span', '', 'Süre hedefi: yaklaşık ' + s.sure + ' dk')); ic.appendChild(su);
    }
    var p = ctx.prog(s.id);
    if (acik && tamam && vd.miniSoru) miniSoru(ic, s, vd.miniSoru);
    if (acik && s.engeller && s.engeller.length) {
      var det = el('details', 'fb-atla');
      det.appendChild(el('summary', '', 'İstediğin engele atla'));
      var l = el('ol', 'fb-atla-liste');
      s.engeller.forEach(function(ob, i){
        var x = el('li'); var eb = el('button', 'btn', (i + 1) + '. ' + (ob.baslik || ob.tip)); eb.type = 'button';
        eb.addEventListener('click', function(){ ctx.engelAtla(s, ob, i); });
        x.appendChild(eb); l.appendChild(x);
      });
      det.appendChild(l); ic.appendChild(det);
    }
    govde.appendChild(ic);
    kok.appendChild(govde);
    /* yapışkan alt şerit: birincil eylem büyük, Kapat küçük */
    var alt = el('div', 'fb-alt');
    if (acik) {
      var b = el('button', 'btn primary fb-eylem', tamam ? 'Yeniden oyna' : (p.enSon ? 'Devam et' : 'Onar')); b.type = 'button';
      b.addEventListener('click', function(){ ctx.baslat(s, p.enSon || 0); });
      alt.appendChild(b);
    } else {
      var i0 = ctx.st.indexOf(s), once = ctx.st[i0 - 1];
      var ip = el('div', 'fb-kilit'); ip.setAttribute('role', 'note');
      ip.appendChild(el('p', '', 'Önce önceki bölümü onar: ' + (once ? once.ad : '')));
      var oz = F.ozet(ctx.st, ctx.tamam);
      var pb = el('div', 'fb-kilit-bar'); var pd = el('i'); pd.style.width = oz.yuzde + '%'; pb.appendChild(pd); ip.appendChild(pb);
      ip.appendChild(el('span', 'fb-kilit-not', 'Hat ilerlemesi: ' + oz.tamam + '/' + oz.toplam + ' bölüm onarıldı'));
      alt.appendChild(ip);
    }
    if (ctx.ust) { var ub = ctx.ust(); ub.classList.add('fb-kapat'); alt.appendChild(ub); }
    kok.appendChild(alt);
    panel.appendChild(kok);
  };

  function miniSoru(panel, s, q){
    var kayit = mini()[s.id] || null;
    var box = el('div', 'fb-kart fb-mini'); box.dataset.mini = s.id;
    var mh = el('h4', 'fb-kart-bas'); var mi = el('span', 'fb-kart-ikon'); mi.appendChild(ikon('soru')); mh.appendChild(mi); mh.appendChild(el('span', '', 'Bu bölümü neden kurduk?'));
    box.appendChild(mh);
    box.appendChild(el('p', 'fb-mini-soru', q.soru));
    var seciliIdx = -1, bitti = false;
    var opts = el('div', 'opts'), btns = [];
    var ok = el('button', 'btn primary', 'Onayla'); ok.type = 'button'; ok.disabled = true; ok.className += ' fb-onay';
    var gb = el('p', 'fb-geri'); gb.setAttribute('role', 'status');
    var sira = Q.util.shuffle(q.secenekler.map(function(_, i){ return i; }));
    sira.forEach(function(orig, pos){
      var b = el('button', 'opt'); b.type = 'button'; b.dataset.i = String(orig);
      b.appendChild(el('span', 'num', String(pos + 1))); b.appendChild(el('span', 't', q.secenekler[orig].t));
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function(){
        if (bitti) return;
        seciliIdx = pos; ok.disabled = false;
        btns.forEach(function(x, j){ x.setAttribute('aria-pressed', j === pos ? 'true' : 'false'); });
      });
      opts.appendChild(b); btns.push(b);
    });
    ok.addEventListener('click', function(){
      if (seciliIdx < 0 || bitti) return;
      var se = q.secenekler[sira[seciliIdx]];
      F.cevapla(s.id, se.dogru);
      btns.forEach(function(x, j){
        x.classList.toggle('dogru', q.secenekler[sira[j]].dogru);
        x.classList.toggle('yanlis', j === seciliIdx && !se.dogru);
      });
      if (se.dogru) {
        bitti = true; ok.disabled = true;
        gb.textContent = 'Doğru. ' + se.neden; gb.className = 'fb-geri iyi';
      } else {
        var dg = q.secenekler.filter(function(x){ return x.dogru; })[0];
        gb.textContent = 'Cevabın yanlış. ' + se.neden + ' Doğru seçenek: ' + (dg ? dg.t : '');
        gb.className = 'fb-geri kotu';
        bitti = true; ok.disabled = true;
        var tk = el('button', 'btn', 'Tekrar dene'); tk.type = 'button';
        tk.addEventListener('click', function(){ var yeni = el('div'); box.parentNode.replaceChild(yeni, box); miniSoru2(yeni, panel, s, q); });
        gb.appendChild(document.createElement('br')); gb.appendChild(tk);
      }
    });
    box.appendChild(opts); box.appendChild(ok); box.appendChild(gb);
    if (kayit && kayit.dogru) {
      var ya = el('p', 'fb-geri iyi', 'Bu soruyu doğru yanıtladın.'); box.appendChild(ya);
    }
    panel.appendChild(box);
  }
  function miniSoru2(slot, panel, s, q){
    var tmp = el('div'); panel.appendChild(tmp);
    miniSoru(tmp, s, q);
    var yeni = tmp.firstChild; panel.removeChild(tmp);
    if (slot.parentNode) slot.parentNode.replaceChild(yeni, slot);
  }
})();
