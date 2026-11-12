/* 98-tekrar-hata.js · Tekrar Merkezi: "Hata defterini çalış" ve "AI'a sor" sayfaları.
 * Ekler: Q.tekrarHata {hata(host, ctx), ai(host, ctx), sistemIstemi(), enCokYanlis(n), soruBul(kayit), cevapla(kayit, ok)}.
 * Hata defteri kaydı (Q.state.hataDefteri, anahtar cip-hatti-v1) geriye uyumlu genişler: isteğe bağlı alanlar
 * seri (art arda doğru), ogrenildi (bool), cz (deneme sayısı). 2 art arda doğru -> cozuldu=true (defterden çıkar).
 * Sohbet geçmişi yalnızca bellekte (oturum). API anahtarına hiç dokunulmaz; Q.claude.chat kullanılır. */
(function(){
  'use strict';
  var Q = (typeof window !== 'undefined' ? window : globalThis).Q;
  var TUR_AD = { 'emin-yanlis': 'Emin olduğun yanlış', yanlis: 'Yanlış', bilinmeyen: 'Bilmiyordum', sans: 'Şans eseri doğru' };
  var TIP_AD = { dusman: 'Düşman sorusu', tahmin: 'Tahmin sorusu', tuzak: 'Tuzak (yanlış parça)', patron: 'Patron sorusu' };
  var TIP_SIRA = { dusman: 0, tahmin: 1, tuzak: 2, patron: 3 };

  function el(tag, cls, text){ var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function btn(text, cls, fn){ var b = el('button', 'btn' + (cls ? ' ' + cls : ''), text); b.type = 'button'; if (fn) b.addEventListener('click', fn); return b; }
  function kavramAd(k){ return String(k || '?').replace(/_/g, ' '); }
  function stIds(){ return Object.keys(Q.data.stations || {}).sort(); }
  function stAd(id){ var s = Q.data.stations[id]; return id.toUpperCase() + ' · ' + (s && s.ad || id); }
  function defter(){ return Q.state.hataDefteri; }
  function kaydet(){ if (Q.save && Q.save.write) Q.save.write(); }

  function css(){
    if (document.getElementById('th-css')) return;
    var s = el('style'); s.id = 'th-css';
    s.textContent = '.th-kart{padding:10px 12px;border:2px solid var(--line);border-radius:8px;background:var(--panel2);display:flex;flex-direction:column;gap:6px}' +
      '.th-kart h4{margin:0;color:var(--yellow);font-size:18px}.th-rozet{display:inline-block;padding:1px 8px;border-radius:99px;border:1px solid var(--line);font-size:var(--fs-small);color:var(--muted)}' +
      '.th-bos{margin:auto;text-align:center;max-width:520px;padding:24px;display:flex;flex-direction:column;gap:12px;align-items:center}.th-bos .buyuk{font-size:64px;line-height:1}' +
      '.th-sohbet{display:flex;flex-direction:column;flex:1;min-height:0;gap:8px}.th-akis{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:8px;padding:4px}' +
      '.th-m{max-width:80%;padding:8px 12px;border-radius:10px;border:2px solid var(--line);white-space:pre-wrap;word-break:break-word}' +
      '.th-m.u{align-self:flex-end;background:var(--sel)}.th-m.a{align-self:flex-start;background:var(--panel2)}.th-m.h{align-self:center;border-color:var(--red);background:var(--panel2)}' +
      '.th-gir{display:flex;gap:8px;align-items:flex-end}.th-gir textarea{flex:1;min-height:44px;max-height:110px;resize:vertical;background:var(--panel2);color:var(--ink);border:2px solid var(--line);border-radius:8px;padding:8px 10px;font:inherit}';
    document.head.appendChild(s);
  }

  /* ---------- soru bulma ---------- */
  var idxCache = null;
  function indeks(){
    if (idxCache && idxCache.n === stIds().length) return idxCache.v;
    var v = {};
    function ekle(st, tip, soru, sec, kavram, ek){
      if (!kavram || !soru || !sec || sec.length < 2) return;
      if (sec.filter(function(s){ return s.dogru; }).length !== 1) return;
      (v[st + '|' + kavram] = v[st + '|' + kavram] || []).push({ st: st, tip: tip, soru: soru, secenekler: sec.map(function(s){ return { t: s.t, dogru: !!s.dogru, neden: s.neden || '' }; }), kavram: kavram, ek: ek || '' });
    }
    stIds().forEach(function(id){
      var s = Q.data.stations[id];
      (s.engeller || []).concat(s.tekrarHavuzu || []).forEach(function(e){
        if (e.tip === 'dusman') ekle(id, 'dusman', e.soru, e.secenekler, e.kavram);
        else if (e.tip === 'tahmin') ekle(id, 'tahmin', e.soru, e.secenekler, e.kavram, e.acik);
        else if (e.tip === 'tuzak' && e.parcalar && e.parcalar.length > 1)
          ekle(id, 'tuzak', 'Bu cümlenin hangi parçası yanlış? "' + e.iddia + '"',
            e.parcalar.map(function(p, i){ return { t: p, dogru: i === e.yanlisParca, neden: e.duzeltme ? 'Doğrusu: ' + e.duzeltme : '' }; }), e.kavram);
        else if (e.tip === 'patron') (e.fazlar || []).forEach(function(f){ if (f.tip === 'secmeli') ekle(id, 'patron', f.soru, f.secenekler, e.kavram); });
      });
    });
    idxCache = { n: stIds().length, v: v };
    return v;
  }
  function ogrenilen(kayit){
    var s = Q.data.stations[kayit.istasyon];
    var l = (s && s.engeller || []).concat(s && s.tekrarHavuzu || []);
    for (var i = 0; i < l.length; i++) if (l[i].kavram === kayit.kavram && l[i].ogrenilen) return l[i].ogrenilen;
    return '';
  }
  /* Kayda ait soru: deneme sayısına göre döner (aynı kavramda birden çok soru varsa değişir). null = soru yok. */
  function soruBul(kayit){
    var l = indeks()[kayit.istasyon + '|' + kayit.kavram];
    if (!l || !l.length) {
      var d = indeks();
      for (var k in d) if (k.split('|')[1] === kayit.kavram) { l = d[k]; break; }
    }
    if (!l || !l.length) return null;
    return l[(kayit.cz || 0) % l.length];
  }
  function dogruSecenek(q){ return q.secenekler.filter(function(s){ return s.dogru; })[0]; }
  function nedenMetni(q){
    var d = dogruSecenek(q);
    return (d.neden || '').replace(/^(Doğru|Hayır|Yanlış)\.\s*/, '') || q.ek || '';
  }
  function ipucu(q){
    var d = dogruSecenek(q).t, w = d.split(/\s+/).slice(0, 2).join(' ');
    return 'Doğru seçenek "' + w + '..." diye başlıyor.';
  }

  /* ---------- cevap kaydı ---------- */
  function cevapla(kayit, ok){
    kayit.cz = (kayit.cz || 0) + 1;
    if (ok) {
      kayit.seri = (kayit.seri || 0) + 1; kayit.ogrenildi = true;
      if (kayit.seri >= 2) { kayit.cozuldu = true; kayit.cozulduTarih = Date.now(); }
    } else { kayit.seri = 0; kayit.ogrenildi = false; }
    kaydet();
    return { cikti: !!kayit.cozuldu, seri: kayit.seri };
  }
  function acikKayitlar(){ return defter().filter(function(h){ return !h.cozuldu; }); }
  function enCokYanlis(n){
    var agirlik = { 'emin-yanlis': 3, yanlis: 2, bilinmeyen: 1, sans: 0.5 }, by = {};
    acikKayitlar().forEach(function(h){
      var o = by[h.kavram] = by[h.kavram] || { kavram: h.kavram, w: 0 };
      o.w += (agirlik[h.tur] || 1) + (h.tekrar || 0);
    });
    return Object.keys(by).map(function(k){ return by[k]; }).sort(function(a, b){ return b.w - a.w; }).slice(0, n || 3);
  }

  /* ---------- HATA DEFTERİ SAYFASI ---------- */
  var fSt = 'hepsi', fKv = 'hepsi', cozulenGoster = false;
  var hataTok = 0;

  function hataSayfasi(host){
    css();
    var tok = ++hataTok;
    host.textContent = '';
    liste(host, tok);
  }
  function canli(host, tok){ return tok === hataTok && host.isConnected; }

  function liste(host, tok){
    host.textContent = '';
    var tum = defter().filter(function(h){ return cozulenGoster || !h.cozuldu; });
    var acik = acikKayitlar();
    if (!defter().length || (!acik.length && !cozulenGoster && !defter().some(function(h){ return h.cozuldu; }))) return bosEkran(host, false);
    if (!acik.length && !cozulenGoster) return bosEkran(host, true, tok);

    var sSel = el('select'); sSel.setAttribute('aria-label', 'İstasyon filtresi');
    var kSel = el('select'); kSel.setAttribute('aria-label', 'Kavram filtresi');
    function opt(sel, v, t){ var o = el('option', '', t); o.value = v; sel.appendChild(o); }
    opt(sSel, 'hepsi', 'Tüm istasyonlar');
    var stler = {}, kvler = {};
    tum.forEach(function(h){ if (h.istasyon) stler[h.istasyon] = 1; });
    Object.keys(stler).sort().forEach(function(id){ opt(sSel, id, Q.data.stations[id] ? stAd(id) : id); });
    if (!stler[fSt]) fSt = 'hepsi'; sSel.value = fSt;
    function kvDoldur(){
      kSel.textContent = ''; opt(kSel, 'hepsi', 'Tüm kavramlar'); kvler = {};
      tum.forEach(function(h){ if (fSt === 'hepsi' || h.istasyon === fSt) kvler[h.kavram] = 1; });
      Object.keys(kvler).sort().forEach(function(k){ opt(kSel, k, kavramAd(k)); });
      if (!kvler[fKv]) fKv = 'hepsi'; kSel.value = fKv;
    }
    kvDoldur();
    var cb = el('input'); cb.type = 'checkbox'; cb.checked = cozulenGoster;
    var lbl = el('label', 'tk-row'); lbl.appendChild(cb); lbl.appendChild(el('span', '', 'Defterden çıkanları da göster'));
    var sayac = el('span', 'tk-muted');
    var ust = el('div', 'tk-row'); [sSel, kSel, lbl, sayac].forEach(function(x){ ust.appendChild(x); });
    var grid = el('div', 'tk-grid');
    var hepsi = btn('Görünenleri yeniden çöz', 'primary', null); hepsi.id = 'th-hepsi';
    var ustSag = el('div', 'tk-row'); ustSag.appendChild(hepsi);
    host.appendChild(ust); host.appendChild(ustSag); host.appendChild(grid);

    function gorunen(){
      return tum.filter(function(h){ return (fSt === 'hepsi' || h.istasyon === fSt) && (fKv === 'hepsi' || h.kavram === fKv); });
    }
    function ciz(){
      grid.textContent = '';
      var g = gorunen(), ac = g.filter(function(h){ return !h.cozuldu; });
      var ogr = defter().filter(function(h){ return h.ogrenildi && !h.cozuldu; }).length;
      sayac.textContent = g.length + ' kayıt · öğrenildi (1/2): ' + ogr;
      hepsi.disabled = !ac.some(function(h){ return soruBul(h); });
      g.forEach(function(h){ grid.appendChild(kart(h)); });
      if (!g.length) grid.appendChild(el('div', 'tk-muted', 'Bu filtreyle kayıt yok.'));
    }
    function kart(h){
      var c = el('div', 'th-kart'); c.dataset.kavram = h.kavram;
      c.appendChild(el('h4', '', kavramAd(h.kavram)));
      var meta = el('div', 'tk-row');
      meta.appendChild(el('span', 'th-rozet', TUR_AD[h.tur] || h.tur));
      if (h.istasyon) meta.appendChild(el('span', 'th-rozet', h.istasyon.toUpperCase()));
      meta.appendChild(el('span', 'th-rozet', h.cozuldu ? 'Defterden çıktı' : (h.ogrenildi ? 'Öğrenildi 1/2' : 'Öğrenilmedi 0/2')));
      c.appendChild(meta);
      var q = soruBul(h);
      if (q) {
        c.appendChild(el('div', 'tk-soru', q.soru));
        var d = dogruSecenek(q), nd = nedenMetni(q);
        c.appendChild(el('p', '', 'Doğru cevap: ' + d.t));
        if (nd) c.appendChild(el('p', 'tk-muted', 'Neden: ' + nd));
        var ip = el('p', 'tk-muted', ''); ip.style.display = 'none'; ip.textContent = 'İpucu: ' + ipucu(q);
        var ib = btn('İpucu göster', '', function(){ ip.style.display = ''; ib.style.display = 'none'; });
        c.appendChild(ip);
        var r = el('div', 'tk-row'); r.appendChild(ib);
        if (!h.cozuldu) r.appendChild(btn('Bu soruyu yeniden çöz', 'primary', function(){ coz(host, tok, [h]); }));
        r.appendChild(btn("Bunu AI'a sor / açıkla", '', function(){ Q.tekrar.git('ai', { kayit: h, soru: q }); }));
        c.appendChild(r);
      } else {
        var og = ogrenilen(h);
        c.appendChild(el('p', 'tk-muted', og || 'Bu kavram için kayıtlı bir soru bulunamadı.'));
        var r2 = el('div', 'tk-row');
        r2.appendChild(btn("Bunu AI'a sor / açıkla", '', function(){ Q.tekrar.git('ai', { kayit: h }); }));
        c.appendChild(r2);
      }
      return c;
    }
    sSel.addEventListener('change', function(){ fSt = sSel.value; kvDoldur(); ciz(); });
    kSel.addEventListener('change', function(){ fKv = kSel.value; ciz(); });
    cb.addEventListener('change', function(){ cozulenGoster = cb.checked; liste(host, tok); });
    hepsi.addEventListener('click', function(){ coz(host, tok, gorunen().filter(function(h){ return !h.cozuldu && soruBul(h); })); });
    ciz();
  }

  function bosEkran(host, hepsiCikti, tok){
    var b = el('div', 'th-bos'); b.id = 'th-bos';
    b.appendChild(el('div', 'buyuk', hepsiCikti ? '🏆' : '📒'));
    b.appendChild(el('h3', '', hepsiCikti ? 'Defterdeki tüm hatalar temizlendi!' : 'Hata defterin şu an boş'));
    b.appendChild(el('p', 'tk-muted', hepsiCikti
      ? 'Yanlış yaptığın her şeyi art arda iki kez doğru çözerek defterden çıkardın. Harika iş.'
      : 'Henüz yanlış yaptığın bir soru yok. Oyunda ilerledikçe yanlışların burada birikir; sonra buradan çalışırsın. Şimdilik Test sayfasında kendini sınayabilirsin.'));
    var r = el('div', 'tk-row');
    r.appendChild(btn('Teste git', 'primary', function(){ Q.tekrar.git('test'); }));
    if (hepsiCikti) r.appendChild(btn('Çıkanları göster', '', function(){ cozulenGoster = true; liste(host, tok); }));
    b.appendChild(r); host.appendChild(b);
  }

  /* Yeniden çöz: kayıtlar soru tipine göre gruplanıp sırayla sorulur */
  function coz(host, tok, kayitlar){
    var kuyruk = kayitlar.map(function(h){ return { h: h, q: soruBul(h) }; }).filter(function(x){ return x.q; });
    kuyruk.sort(function(a, b){ return (TIP_SIRA[a.q.tip] || 0) - (TIP_SIRA[b.q.tip] || 0); });
    var i = 0, dogru = 0, cikan = 0;
    function sor(){
      if (!canli(host, tok)) return;
      host.textContent = '';
      if (i >= kuyruk.length) return bitis();
      var x = kuyruk[i], q = x.q;
      host.appendChild(el('div', 'tk-muted', 'Soru ' + (i + 1) + '/' + kuyruk.length + ' · ' + (TIP_AD[q.tip] || q.tip) + ' · ' + kavramAd(x.h.kavram) + ' · ' + stAd(q.st)));
      host.appendChild(el('div', 'tk-soru', q.soru));
      var oh = el('div'); host.appendChild(oh);
      var iptal = btn('Listeye dön', '', function(){ hataTok++; hataSayfasi(host); }); iptal.id = 'th-liste-don';
      var ia = el('div', 'tk-row'); ia.appendChild(iptal); host.appendChild(ia);
      Q.ui.options.ask({ host: oh, secenekler: q.secenekler }).then(function(idx){
        if (!canli(host, tok)) return;
        var ok = !!q.secenekler[idx].dogru, d = dogruSecenek(q), r = cevapla(x.h, ok);
        if (ok) dogru++; if (r.cikti) cikan++;
        var fb = el('div', 'tk-fb ' + (ok ? 'iyi' : 'kotu')); fb.setAttribute('role', 'status');
        var nd = nedenMetni(q);
        fb.textContent = (ok ? 'Doğru! ' : 'Yanlış. Doğru seçenek: ' + d.t + '. ') + (nd ? 'Nedeni: ' + nd + ' ' : '') +
          (ok ? (r.cikti ? 'Art arda 2 doğru: defterden çıktı.' : 'Öğrenildi sayıldı (1/2); bir kez daha doğru yaparsan defterden çıkar.') : 'Defterde kalıyor.');
        oh.textContent = ''; oh.appendChild(fb);
        var dev = btn(i + 1 >= kuyruk.length ? 'Sonucu gör' : 'Sonraki soru', 'primary', function(){ i++; sor(); });
        dev.id = 'th-sonraki'; oh.appendChild(dev);
        try { dev.focus(); } catch (e) { /* odak yok */ }
      });
    }
    function bitis(){
      host.appendChild(el('div', 'tk-soru', 'Sonuç: ' + dogru + '/' + kuyruk.length + ' doğru'));
      host.appendChild(el('p', 'tk-muted', cikan + ' kayıt defterden çıktı.'));
      var r = el('div', 'tk-row'); r.appendChild(btn('Hata defterine dön', 'primary', function(){ hataTok++; hataSayfasi(host); })); host.appendChild(r);
    }
    if (!kuyruk.length) return;
    sor();
  }

  /* ---------- AI'A SOR ---------- */
  var mesajlar = [];   // {role:'user'|'assistant', content}
  var taslak = '';
  var bekliyor = false, hataMesaji = '', aiCtl = null, aiUI = null;
  var AI_TIMEOUT = 45000;

  function sistemIstemi(){
    var st = stIds().map(function(id){
      var s = Q.data.stations[id], kv = {};
      (s.engeller || []).forEach(function(e){ if (e.kavram) kv[e.kavram] = 1; });
      return '- ' + id + ' ' + (s.ad || '') + ': ' + Object.keys(kv).map(kavramAd).join(', ');
    }).join('\n');
    var top = enCokYanlis(3).map(function(t){ return kavramAd(t.kavram); });
    return 'Sen oyunlaştırılmış bir Aygıt Fiziği (kuantum mekaniği, kristal yapı, yarı iletken) çalışma oyunu "Çip Hattı" içindeki yardımcı öğretmensin. ' +
      'Öğrenci Türkçe konuşuyor. Sade, kısa ve anlaşılır Türkçe ile anlat; küçük örnekler ve benzetmeler kullan, gerekirse kısa maddelerle yaz. ' +
      'Ders terimlerini her zaman `English (Türkçe)` biçiminde yaz (örnek: Miller indices (Miller indisleri), bandgap (yasak enerji aralığı)). ' +
      'Sınav tamamen İngilizce olduğu için önemli terimlerin İngilizcesini mutlaka ver. Emin olmadığın şeyi uydurma, bilmediğini söyle. Konu dışı isteklere nazikçe ders konusuna dön.\n\n' +
      'OYUNDAKİ İSTASYONLAR VE KAVRAMLAR:\n' + st + '\n\n' +
      (top.length ? 'ÖĞRENCİNİN HATA DEFTERİNDE EN ÇOK YANLIŞ YAPTIĞI 3 KAVRAM: ' + top.join('; ') + '. İlk mesajda ya da uygun olduğunda "Bunlardan başlayayım mı?" diye öner.' : 'Öğrencinin hata defteri şu an boş.');
  }
  function soruMesaji(ctx){
    var k = ctx.kayit, q = ctx.soru, t = 'Hata defterimdeki bir kavramı anlamadım: ' + kavramAd(k && k.kavram) + '.';
    if (q) t += '\nSoru: ' + q.soru + '\nDoğru cevap: ' + dogruSecenek(q).t + '\nBunu yanlış yaptım. Neden doğru olduğunu ve neden diğer seçeneklerin yanlış olduğunu sade anlat.';
    else t += ' Bunu sade bir şekilde açıklar mısın?';
    return t;
  }
  function hataKodu(e){
    var c = e && e.code;
    if (c === 'zaman') return 'Yanıt gecikti (45 sn). İnternet bağlantını kontrol edip tekrar dene.';
    if (c === 'ag') return 'Bağlantı kurulamadı. İnternetini kontrol edip tekrar dene (yerel dosya olarak açtıysan anahtar çalışmayabilir).';
    if (c === 'sinir') return 'Çok fazla istek gönderildi. Biraz bekleyip tekrar dene.';
    if (c === 'yok') return 'Claude bağlı değil. Ayarlar sayfasından API anahtarını gir.';
    if (c === 'iptal') return 'İstek iptal edildi.';
    return 'Claude şu an yanıt veremedi. Biraz sonra tekrar dene.';
  }

  function gonder(metin){
    metin = String(metin || '').trim();
    if (!metin || bekliyor) return;
    mesajlar.push({ role: 'user', content: metin });
    taslak = ''; hataMesaji = '';
    iste();
  }
  function iste(){
    bekliyor = true; hataMesaji = ''; ciz();
    aiCtl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var son = mesajlar.slice(-20);
    while (son.length && son[0].role !== 'user') son.shift();
    Q.claude.chat({ system: sistemIstemi(), messages: son, signal: aiCtl && aiCtl.signal, timeoutMs: AI_TIMEOUT }).then(function(t){
      mesajlar.push({ role: 'assistant', content: t });
    }, function(e){
      hataMesaji = hataKodu(e);
    }).then(function(){ bekliyor = false; aiCtl = null; ciz(); });
  }

  function ciz(){
    if (!aiUI || !aiUI.host.isConnected) return;
    var u = aiUI, host = u.host;
    host.textContent = '';
    var wrap = el('div', 'th-sohbet'); host.appendChild(wrap);
    var akis = el('div', 'th-akis'); akis.id = 'th-akis'; wrap.appendChild(akis);
    if (!mesajlar.length) {
      var top = enCokYanlis(3), g = el('div', 'tk-kart');
      g.appendChild(el('h4', '', "AI'a sor"));
      g.appendChild(el('p', '', 'Bir kavramı sor, Claude sade Türkçe ile anlatsın. Ders terimleri English (Türkçe) biçiminde gelir.'));
      var ch = el('div', 'tk-row');
      ['Miller indisini anlat', 'Bandgap (yasak enerji aralığı) nedir?', 'Photoelectric effect (fotoelektrik olay) nasıl çalışır?'].forEach(function(s){
        var c = el('button', 'tk-chip', s); c.type = 'button'; c.addEventListener('click', function(){ if (u.hazir) gonder(s); }); ch.appendChild(c);
      });
      g.appendChild(ch);
      if (top.length) {
        var o = el('div', 'tk-row'); o.appendChild(el('span', '', 'Hata defterinde en çok yanlış: ' + top.map(function(t){ return kavramAd(t.kavram); }).join(', ') + '.'));
        o.appendChild(btn('Bunlardan başlayayım mı?', 'primary', function(){ if (u.hazir) gonder('Hata defterimdeki en çok yanlış yaptığım kavramlardan başlayalım: ' + top.map(function(t){ return kavramAd(t.kavram); }).join(', ') + '. Sırayla sade anlatır mısın?'); }));
        g.appendChild(o);
      }
      akis.appendChild(g);
    }
    mesajlar.forEach(function(m){ akis.appendChild(el('div', 'th-m ' + (m.role === 'user' ? 'u' : 'a'), m.content)); });
    if (bekliyor) {
      var y = el('div', 'th-m a tk-muted', 'Claude yazıyor...'); y.id = 'th-yaziyor'; akis.appendChild(y);
    }
    if (hataMesaji) {
      var h = el('div', 'th-m h', hataMesaji); h.id = 'th-hata'; h.setAttribute('role', 'alert'); akis.appendChild(h);
      if (mesajlar.length && mesajlar[mesajlar.length - 1].role === 'user') {
        var tb = btn('Tekrar dene', '', function(){ iste(); }); tb.id = 'th-tekrar-dene'; tb.style.alignSelf = 'center'; akis.appendChild(tb);
      }
    }
    var gir = el('div', 'th-gir'); wrap.appendChild(gir);
    var ta = el('textarea'); ta.id = 'th-giris'; ta.placeholder = 'Sorunu yaz (Enter: gönder, Shift+Enter: yeni satır)'; ta.setAttribute('aria-label', 'Mesajın'); ta.value = taslak;
    ta.addEventListener('input', function(){ taslak = ta.value; });
    ta.addEventListener('keydown', function(e){ e.stopPropagation(); if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); gonder(ta.value); } });
    gir.appendChild(ta);
    var gb = btn('Gönder', 'primary', function(){ gonder(ta.value); }); gb.id = 'th-gonder'; gb.disabled = bekliyor; gir.appendChild(gb);
    if (bekliyor) gir.appendChild(btn('İptal', '', function(){ if (aiCtl) aiCtl.abort(); }));
    if (mesajlar.length && !bekliyor) gir.appendChild(btn('Yeni sohbet', '', function(){ mesajlar = []; hataMesaji = ''; ciz(); }));
    akis.scrollTop = akis.scrollHeight;
    if (!bekliyor) { try { ta.focus(); } catch (e) { /* odak yok */ } }
  }

  function aiSayfasi(host, ctx){
    css();
    host.textContent = '';
    var u = aiUI = { host: host, hazir: false };
    var yukleniyor = el('div', 'tk-muted', 'Claude bağlantısı kontrol ediliyor...'); host.appendChild(yukleniyor);
    Q.claude.available().then(function(av){
      if (aiUI !== u || !host.isConnected) return;
      if (!av || av.backend === 'none') { uyari(host); return; }
      u.hazir = true;
      if (ctx && ctx.kayit) {
        var m = soruMesaji(ctx);
        if (!bekliyor) { mesajlar.push({ role: 'user', content: m }); taslak = ''; iste(); return; }
      }
      ciz();
    }, function(){ if (aiUI === u && host.isConnected) uyari(host); });
  }
  function uyari(host){
    host.textContent = '';
    var b = el('div', 'th-bos'); b.id = 'th-anahtar-yok';
    b.appendChild(el('div', 'buyuk', '🔑'));
    b.appendChild(el('h3', '', 'AI sohbeti için Claude bağlantısı gerekli'));
    b.appendChild(el('p', 'tk-muted', "Henüz bir API anahtarı tanımlı değil. Ayarlar'daki \"Gelişmiş: API anahtarı\" bölümüne anahtarını girersen burada Claude'a kavram sorabilirsin. Anahtar olmadan da Terimler, Test ve Hata defteri sayfaları çalışır."));
    var r = el('div', 'tk-row');
    r.appendChild(btn("Ayarlar'a git", 'primary', function(){ if (Q.tekrar && Q.tekrar.close) Q.tekrar.close(); if (Q.settings && Q.settings.open) Q.settings.open(); }));
    r.appendChild(btn('Tekrar kontrol et', '', function(){ aiSayfasi(host, null); }));
    b.appendChild(r); host.appendChild(b);
  }

  Q.tekrarHata = { hata: hataSayfasi, ai: aiSayfasi, sistemIstemi: sistemIstemi, enCokYanlis: enCokYanlis, soruBul: soruBul, cevapla: cevapla };
})();
