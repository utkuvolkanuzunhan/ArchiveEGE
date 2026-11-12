/* 21-kartlar.js — Bilim insanı kartları: liste, koleksiyon (istasyonlara göre gruplu) ve detay görünümü.
 * Ekler: Q.kartlar.liste(opt), Q.kartlar.bul(id), Q.kartlar.detayDom(id, opt), Q.kartlar.koleksiyon(host, opt).
 * Veri: kart kimliği/yıl/tek cümle sandık engelinden (90-data-sNN.js), derse katkı metni Q.data.kartlar (89-data-kartlar.js).
 * Kazanılma: Q.state.kartlar (kart.id listesi, kayıt cip-hatti-v1 değişmedi). Çizim: Q.art.cameo (40-art-chars.js). */
(function(){
  'use strict';
  var Q = window.Q;
  var K = Q.kartlar = Q.kartlar || {};

  function el(tag, cls, text){
    var e = Q.util.el(tag, cls);
    if (text != null) e.textContent = text;
    return e;
  }
  function stIds(){ return Object.keys(Q.data.stations || {}).sort(); }
  function sira(id){ return parseInt(String(id).replace(/\D/g, ''), 10) || 0; }

  /* Tüm kartlar: istasyon sırasıyla; her istasyonda önce sandık kartı, sonra bonus kartlar.
   * Bonus kartlar (Q.data.bonusKartlar) istasyon bitince (ilerleme[ist].tamam) otomatik kazanılır; kayda yazılmaz,
   * bu yüzden eski kayıtlarda tamamlanmış istasyonların bonus kartları kendiliğinden görünür.
   * opt.hepsi=true -> s10 dahil (ayara bakmadan). */
  K.liste = function(opt){
    opt = opt || {};
    var kaz = (Q.state && Q.state.kartlar) || [], ay = (Q.state && Q.state.ayarlar) || {};
    var il = (Q.state && Q.state.ilerleme) || {};
    var bonus = Q.data.bonusKartlar || [];
    var out = [];
    stIds().forEach(function(sid){
      var st = Q.data.stations[sid];
      if (!st) return;
      var tamam = !!(il[sid] && il[sid].tamam);
      var gizli10 = sira(sid) === 10 && !opt.hepsi && !ay.istasyon10;
      (st.engeller || []).forEach(function(e){
        if (e.tip !== 'sandik' || !e.kart || !e.kart.id) return;
        var ch = (Q.data.chars && Q.data.chars[e.kart.id]) || {};
        var kazandi = kaz.indexOf(e.kart.id) >= 0;
        if (gizli10 && !kazandi) return;
        out.push({ id: e.kart.id, ist: sid, istSira: sira(sid), istAd: st.ad || sid, renk: st.renk || '',
          kisi: ch.kisi || e.kart.id, yil: e.kart.yil, tekCumle: e.kart.tekCumle || '', kazandi: kazandi, bonus: false });
      });
      bonus.forEach(function(b){
        if (b.ist !== sid || (gizli10 && !tamam)) return;
        var ch = (Q.data.chars && Q.data.chars[b.id]) || {};
        out.push({ id: b.id, ist: sid, istSira: sira(sid), istAd: st.ad || sid, renk: st.renk || '',
          kisi: b.kisi || ch.kisi || b.id, yil: b.yil, tekCumle: b.tekCumle || '', kazandi: tamam, bonus: true });
      });
    });
    return out;
  };
  K.bul = function(id, opt){
    var l = K.liste(Object.assign({ hepsi: true }, opt || {}));
    for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
    return null;
  };

  /* Portre: Q.art.portre (41-art-portre.js); yoksa eski cameo. Kilitliyse gizli silüet. */
  function portreSvg(id, kilitli, cls){
    try {
      if (Q.art && Q.art.portre) return Q.art.portre(id, { cls: cls, sil: !!kilitli }) || '';
      if (Q.art && Q.art.cameo) return Q.art.cameo(id, { cls: 'mon ' + cls }) || '';
    } catch (e) { /* çizim yok */ }
    return '';
  }
  function portre(k, kilitli){
    var d = el('div', kilitli ? 'kk-por' : 'kk-por');
    d.innerHTML = portreSvg(k.id, kilitli, 'kk-cameo');
    d.setAttribute('aria-hidden', 'true');
    return d;
  }
  function ipucu(k){ return k.bonus ? '"' + k.istAd + '" istasyonunu bitir (bonus kart).' : '"' + k.istAd + '" istasyonunu bitir (sandığı aç).'; }

  /* Detay: Q.kartlar.detayDom(id, { acik: true }) -> eleman. acik: kilitli olsa da içeriği göster (Tekrar Merkezi). */
  K.detayDom = function(id, opt){
    opt = opt || {};
    var k = K.bul(id);
    var kok = el('div', 'kd');
    if (!k) { kok.appendChild(el('p', '', 'Kart bulunamadı.')); return kok; }
    var kilitli = !k.kazandi && !opt.acik;
    kok.dataset.kilitli = kilitli ? '1' : '0';
    kok.dataset.kart = k.id;
    if (k.renk) kok.style.setProperty('--kk-renk', k.renk);
    var ust = el('div', 'kd-ust');
    var por = el('div', 'kd-por');
    por.innerHTML = portreSvg(k.id, kilitli, 'kd-cameo');
    por.setAttribute('aria-hidden', 'true');
    ust.appendChild(por);
    var yz = el('div');
    var ad = el('h3', 'kd-ad', kilitli ? 'Gizli bilim insanı' : k.kisi);
    ad.tabIndex = -1;
    yz.appendChild(ad);
    var meta = el('div', 'kd-meta');
    if (!kilitli) meta.appendChild(el('span', 'chip', String(k.yil)));
    meta.appendChild(el('span', 'chip', k.istSira + '. ' + k.istAd));
    if (k.bonus) meta.appendChild(el('span', 'chip', 'Bonus kart'));
    meta.appendChild(el('span', 'chip', k.kazandi ? 'Kazanıldı' : 'Kilitli'));
    yz.appendChild(meta);
    ust.appendChild(yz);
    kok.appendChild(ust);
    if (kilitli) {
      kok.appendChild(el('div', 'kd-kilit', 'Kilitli kart. ' + ipucu(k)));
      return kok;
    }
    kok.appendChild(el('p', 'kd-cumle', k.tekCumle));
    var v = (Q.data.kartlar || {})[k.id];
    if (!v) return kok;
    var bol = [['Kim, ne zaman, hangi bağlamda?', v.p1], ['Bilime ve çip teknolojisine katkısı', v.p2]];
    if (v.p3) bol.push(['Sezgi ve yaygın yanılgı', v.p3]);
    bol.forEach(function(b){ kok.appendChild(el('h4', '', b[0])); kok.appendChild(el('p', '', b[1])); });
    if (v.sinav && v.sinav.length) {
      var kt = el('div', 'kd-sinav');
      kt.appendChild(el('h4', '', 'Sınavda kesin bilmem gereken'));
      var ul = el('ul');
      v.sinav.forEach(function(m){ ul.appendChild(el('li', '', m)); });
      kt.appendChild(ul); kok.appendChild(kt);
    }
    return kok;
  };

  /* Koleksiyon: istasyonlara göre gruplu. opt.onSec(kart), opt.secili (id). Döndürür { yenile, odak }. */
  K.koleksiyon = function(host, opt){
    opt = opt || {};
    host.textContent = '';
    var liste = K.liste();
    var kaz = liste.filter(function(k){ return k.kazandi; }).length;
    var bas = el('div', 'kk-baslik');
    bas.appendChild(el('h3', '', 'Kart koleksiyonu'));
    bas.appendChild(el('span', 'chip', kaz + '/' + liste.length + ' kart'));
    host.appendChild(bas);
    var izgara = el('div', 'kk-grup-izgara'); izgara.setAttribute('role', 'group'); izgara.setAttribute('aria-label', 'Bilim insanı kartları');
    var gruplar = {}, sirali = [];
    liste.forEach(function(k){ (gruplar[k.ist] = gruplar[k.ist] || []).push(k); if (sirali.indexOf(k.ist) < 0) sirali.push(k.ist); });
    var tuslar = [];
    sirali.forEach(function(sid){
      var ks = gruplar[sid], f = ks[0], k0 = ks.filter(function(k){ return k.kazandi; }).length;
      var g = el('section', 'kk-grup'); g.dataset.ist = sid; g.dataset.tam = k0 === ks.length ? '1' : '0';
      if (f.renk) g.style.setProperty('--kk-renk', f.renk);
      var ust = el('div', 'kk-grup-ust');
      if (Q.settings && Q.settings.machineIcon) ust.appendChild(Q.settings.machineIcon(f.renk, k0 === 0));
      ust.appendChild(el('span', 'kk-grup-ad', f.istSira + '. ' + f.istAd));
      var ilr = el('span', 'kk-ilerleme', k0 + '/' + ks.length + ' kart'); ilr.setAttribute('aria-label', ks.length + ' kartın ' + k0 + ' tanesi kazanıldı');
      ust.appendChild(ilr); g.appendChild(ust);
      var cb = el('div', 'kk-cubuk'), ic = el('i'); ic.style.width = Math.round(100 * k0 / ks.length) + '%'; cb.appendChild(ic); g.appendChild(cb);
      var ls = el('div', 'kk-liste');
      ks.forEach(function(k){
        var b = el('button', k.bonus ? 'kk-kart kk-bonus' : 'kk-kart'); b.type = 'button';
        b.dataset.kart = k.id; b.dataset.bonus = k.bonus ? '1' : '0'; b.dataset.kilitli = k.kazandi ? '0' : '1';
        b.setAttribute('aria-pressed', opt.secili === k.id ? 'true' : 'false');
        b.setAttribute('aria-label', k.kazandi ? (k.kisi + ', ' + k.yil + ', ' + k.istAd + '. Ayrıntı için seç.') : ('Kilitli kart. ' + ipucu(k)));
        b.appendChild(portre(k, !k.kazandi));
        var m = el('div', 'kk-metin');
        if (k.kazandi) {
          m.appendChild(el('span', 'kk-ad', k.kisi)); m.appendChild(el('span', 'kk-yil', String(k.yil)));
          m.appendChild(el('span', 'kk-cumle', k.tekCumle));
        } else {
          m.appendChild(el('span', 'kk-ad', '???')); m.appendChild(el('span', 'kk-ipucu', ipucu(k)));
        }
        b.appendChild(m);
        b.addEventListener('click', function(){
          tuslar.forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          if (opt.onSec) opt.onSec(k);
        });
        tuslar.push(b); ls.appendChild(b);
      });
      g.appendChild(ls); izgara.appendChild(g);
    });
    izgara.addEventListener('keydown', function(e){
      var yon = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!yon) return;
      var i = tuslar.indexOf(document.activeElement);
      if (i < 0) return;
      var j = Math.max(0, Math.min(tuslar.length - 1, i + yon));
      if (tuslar[j]) tuslar[j].focus();
      e.preventDefault();
    });
    host.appendChild(izgara);
    return {
      odak: function(id){ for (var i = 0; i < tuslar.length; i++) if (tuslar[i].dataset.kart === id) { tuslar[i].focus(); return true; } return false; },
      sec: function(id){ tuslar.forEach(function(x){ x.setAttribute('aria-pressed', x.dataset.kart === id ? 'true' : 'false'); }); }
    };
  };
})();
