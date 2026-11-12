/* 96-final.js (A7) Final "Sınav Günü": 11 tek soruluk kapı (s01-s10), sonda Sınav Raporu.
 * Ekler: Q.final {start, acik, hazirla, rapor, son}. Bağımlı (çalışma anında): Q.data.stations.s01..s09, Q.data.sinav,
 * Q.runner, Q.obs, Q.ui, Q.claude, Q.settings. Sınav dili İngilizce (DIL-1); arayüz Türkçe.
 * Kalıcı ilerlemeye DOKUNMAZ: 'final' istasyonu yalnızca çalışma anında Q.data.stations içinde bulunur, bitince silinir;
 * kayıt anahtarı (cip-hatti-v1) bozulmaz. Son rapor ayrı anahtarda: cip-hatti-final-v1.
 * Engeller tip:'patron' + final:true taşır; patron işleyicisi sarılır, final engeli bu dosyadaki işleyiciye gider. */
(function(){
  'use strict';

  var KEY = 'cip-hatti-final-v1';
  var NOTLAR = { s05: 1, s06: 1 };   /* hesap sorusu: sayısal sonuç yerine mantık açıklaması */
  var calisiyor = false;
  var kayit = null;                  /* geçerli koşunun cevapları: { idx: kayıt } */
  var son = null;

  function el(tag, cls, text){
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function btn(text, primary, fn){
    var b = el('button', 'btn' + (primary ? ' primary' : ''), text);
    b.type = 'button';
    if (fn) b.addEventListener('click', fn);
    return b;
  }
  function sleep(ms){ return Q.util && Q.util.sleep ? Q.util.sleep(ms) : new Promise(function(r){ setTimeout(r, ms); }); }
  function swallow(p){ try { if (p && p.catch) p.catch(function(){}); } catch (e) { /* yut */ } return p; }
  function toast(m, tur){ try { if (Q.ui && Q.ui.toast) Q.ui.toast(m, { tur: tur || 'bilgi' }); } catch (e) { /* ui yok */ } }
  function stIds(){
    return Object.keys(Q.data.stations || {}).filter(function(k){ return /^s\d\d$/.test(k); }).sort();
  }

  /* ---------- kullanılabilirlik ---------- */
  function acik(){
    var ids = stIds();
    var ayar = Q.state && Q.state.ayarlar || {};
    if (ayar.kilitleriAc) return ids.length > 0;
    var il = Q.state && Q.state.ilerleme || {};
    return ids.length >= 9 && ids.slice(0, 9).every(function(id){ return il[id] && il[id].tamam; });
  }

  /* ---------- soru ve istasyon üretimi ---------- */
  function mcqOf(stId, n){
    var l = ((Q.data.sinav && Q.data.sinav.mcq) || []).filter(function(m){ return m.station === stId; });
    return l.length ? l[n % l.length] : null;
  }
  /* s10 patron fazlarında pdfSoru yok: klasik (kavramsal) İngilizce sorular, faz sırasıyla; yalnızca ilki (toplam 11 kapı) */
  var S10_EK = [
    { soru: 'State the Fermi-Dirac distribution f(E). What is f at E = E_F, and how does the curve change as the temperature falls toward 0 K?',
      anahtarFikirler: ['f(E) = 1/(1+exp((E−E_F)/kT)) is the occupation probability of a state.', 'At E = E_F, f = 1/2 at any temperature.', 'At T = 0 K, f is a step function: filled below E_F, empty above.', 'As T rises the transition region around E_F widens (about kT).'],
      yanlisKavramlar: ['f(E_F) equals 1 at every temperature', 'Raising the temperature makes the curve steeper'],
      yanlisKavramIds: ['fermi_hep_dolu', 'fermi_dagilim'],
      idealCevap: 'The Fermi-Dirac distribution f(E) = 1/(1+exp((E−E_F)/kT)) gives the probability that a state at energy E is occupied. At E = E_F it equals 1/2 for any T. At T = 0 K it is a step function (1 below E_F, 0 above); as T increases the transition region of width about kT broadens and some electrons occupy states above E_F.' }
  ];
  /* Soru seti: Q.data.gercekSinav (hocanın örnek sınavı, 10 soru AYNEN, sınav sırasıyla). Veri yoksa eski davranış: patron pdfSoru'ları. */
  function patronOf(stId){
    var st = Q.data.stations[stId], p = null;
    ((st && st.engeller) || []).forEach(function(e){ if (!p && e.tip === 'patron') p = e; });
    return p;
  }
  function hazirlaGercek(){
    var G = Q.data && Q.data.gercekSinav, engeller = [], ilk = null;
    if (!G || !G.sorular || !G.sorular.length) return null;
    G.sorular.forEach(function(g){
      var st = Q.data.stations[g.st], p = patronOf(g.st);
      if (!st || !p) return;
      ilk = ilk || st;
      engeller.push({
        id: 'final-' + g.no, tip: 'patron', final: true, no: g.no, kaynak: g.st, kaynakAd: st.ad,
        baslik: 'Question ' + g.no, kavram: null, agirlik: 1, sekil: g.sekil || null,
        canavar: p.canavar, canavarAd: p.canavarAd, soru: g.text,
        anahtarFikirler: g.anahtar.slice(), yanlisKavramlar: g.hatalar.slice(),
        yanlisKavramIds: [], idealCevap: g.model.join(' '),
        mcq: mcqOf(g.st, g.no)
      });
    });
    return engeller.length ? { engeller: engeller, ilk: ilk } : null;
  }
  function hazirla(){
    var engeller = [], n = 0, ilk = null, G = hazirlaGercek();
    if (G) { engeller = G.engeller; ilk = G.ilk; }
    (G ? [] : stIds()).forEach(function(id){
      var st = Q.data.stations[id];
      ilk = ilk || st;
      (st.engeller || []).forEach(function(e){
        if (e.tip !== 'patron') return;
        var ek = 0;
        (e.fazlar || []).forEach(function(f){
          if (f.tip !== 'acik') return;
          var x = f.pdfSoru ? null : (id === 's10' ? S10_EK[ek++] : null);
          if (!f.pdfSoru && !x) return;
          if (x) f = { kavram: f.kavram, pdfSoru: x.soru, anahtarFikirler: x.anahtarFikirler, yanlisKavramlar: x.yanlisKavramlar, yanlisKavramIds: x.yanlisKavramIds, idealCevap: x.idealCevap };
          n++;
          var soru = f.pdfSoru;
          if (NOTLAR[id]) soru += ' (In this final, explain the reasoning and method step by step; the final number is not required.)';
          engeller.push({
            id: 'final-' + n, tip: 'patron', final: true, no: n, kaynak: id, kaynakAd: st.ad,
            baslik: 'Question ' + n, kavram: f.kavram || null, agirlik: 1,
            canavar: e.canavar, canavarAd: e.canavarAd, soru: soru,
            anahtarFikirler: f.anahtarFikirler || [], yanlisKavramlar: f.yanlisKavramlar || [],
            yanlisKavramIds: f.yanlisKavramIds || [], idealCevap: f.idealCevap || '',
            mcq: mcqOf(id, n)
          });
        });
      });
    });
    if (!engeller.length) return null;
    engeller.forEach(function(e){ e.toplam = engeller.length; e.giris = 'Soru ' + e.no + '/' + engeller.length + '. Süre yok, sakin ol.'; });
    return {
      id: 'final', sira: 0, ad: 'Sınav Günü', konu: 'Final: ' + engeller.length + ' soru, süre baskısı yok.', renk: (ilk && ilk.renk) || '#ffd166',
      sureHedefDk: 30, patronId: engeller[0].canavar, temelTur: null, tekrarHavuzu: [], kavramlar: [], engeller: engeller
    };
  }

  /* ---------- engel işleyicisi ---------- */
  async function finalEnter(ob, ctx){
    var host = ctx.host, runway = ctx.runway, ui = ctx.ui || Q.ui, claude = ctx.claude || Q.claude;
    var rec = { idx: ob.no, kaynak: ob.kaynak, kaynakAd: ob.kaynakAd, soru: ob.soru, dogruluk: 0, eminlik: 1, eksik: [], mod: 'bos', geri: [] };
    function newArea(){
      host.textContent = '';
      var a = el('div', 'fn-area');
      host.appendChild(a);
      var h = el('div', 'fn-head');
      h.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:8px';
      h.appendChild(el('span', 'chip', 'Soru ' + ob.no + '/' + ob.toplam));
      h.appendChild(el('span', 'chip', 'Süre yok'));
      a.appendChild(h);
      var q = el('div', 'fn-soru', ob.soru);
      q.style.cssText = 'font-weight:800;font-size:17px;line-height:1.35;margin:0 0 8px';
      a.appendChild(q);
      if (ob.sekil && Q.gercekSinav && Q.gercekSinav.sekilEl) { var sk = Q.gercekSinav.sekilEl(ob.sekil); if (sk) { sk.style.maxWidth = '440px'; sk.style.padding = '0 6px'; var sv = sk.querySelector('svg'); if (sv) sv.style.maxHeight = '125px'; a.appendChild(sk); } }
      return a;
    }
    function bekle(area, etiket){
      return new Promise(function(res){
        var b = btn(etiket || 'Devam', true, function(){ document.removeEventListener('keydown', k, true); if (b.parentNode) b.parentNode.removeChild(b); res(); });
        function k(e){ if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); b.click(); } }
        document.addEventListener('keydown', k, true);
        b.style.marginTop = '10px';
        area.appendChild(b);
        try { b.focus(); } catch (e) { /* odak yok */ }
      });
    }
    function iki(area, a, b){
      return new Promise(function(res){
        var row = el('div', 'fn-row');
        row.style.cssText = 'display:flex;gap:10px;margin-top:10px;flex-wrap:wrap';
        [[a, true], [b, false]].forEach(function(x, i){
          row.appendChild(btn(x[0], x[1], function(){ if (row.parentNode) row.parentNode.removeChild(row); res(i); }));
        });
        area.appendChild(row);
      });
    }
    function kutu(area, m, iyi){
      var b = el('div', 'fn-box', m);
      b.style.cssText = 'margin-top:8px;padding:8px 12px;border:2px solid var(' + (iyi ? '--good' : '--bad') + ');border-radius:var(--rs)';
      area.appendChild(b);
    }

    /* çoktan seçmeli yedek: Claude yokken sınav havuzundaki İngilizce MCQ */
    async function mcqYedek(area, em){
      var m = ob.mcq;
      if (!m) { rec.mod = 'bos'; return false; }
      area.appendChild(el('div', 'fn-ipucu', 'Claude yok: aynı istasyondan çoktan seçmeli soru.')).style.cssText = 'color:var(--muted);font-size:var(--fs-small);margin:6px 0';
      var q = el('div', 'fn-mcq', m.q);
      q.style.cssText = 'font-weight:700;margin:6px 0';
      area.appendChild(q);
      var kb = el('div', 'fn-opts');
      area.appendChild(kb);
      var i = await ui.options.ask({ host: kb, secenekler: m.options.map(function(o){ return { t: o }; }), tek: true });
      var dogru = i === m.answer;
      rec.mod = 'mcq'; rec.dogruluk = dogru ? 100 : 0; rec.eminlik = em;
      kutu(area, (dogru ? 'Correct. ' : 'Not quite. Correct answer: ' + m.options[m.answer] + '. ') + (m.explanation || ''), dogru);
      if (!dogru) rec.eksik = ob.anahtarFikirler.slice();
      await bekle(area);
      return true;
    }

    try {
      await runway.showBoss(ob.canavar, { ad: ob.canavarAd, renk: ctx.istasyon && ctx.istasyon.renk });
      swallow(runway.say(ob.canavar, ob.giris));
      var area = newArea(), cevap = '', bitti = false;
      while (!bitti) {
        var it = el('div', 'fn-iter');
        area.appendChild(it);
        var tb = el('div', 'fn-tb');
        it.appendChild(tb);
        var v = await ui.textbox.ask({ host: tb, soru: 'Cevabını yaz (İngilizce)', maks: 1500, kesme: 4000, rows: ob.sekil ? 2 : 5, deger: cevap });
        if (v == null || !String(v).trim() || /^\s*(bilmiyorum|i don'?t know)\s*\.?\s*$/i.test(String(v))) {
          rec.mod = 'bos'; rec.dogruluk = 0; rec.eminlik = 0; rec.eksik = ob.anahtarFikirler.slice();
          area.textContent = '';
          area = newArea();
          kutu(area, 'Boş bıraktın, sorun değil. Örnek cevap: ' + ob.idealCevap, false);
          await bekle(area);
          break;
        }
        cevap = String(v);
        var em = await ui.confidence.ask({ host: it });
        var iptal = false, jsonHata = 0;
        while (!iptal) {
          var av = null;
          try { av = await claude.available(); } catch (e) { av = { backend: 'none' }; }
          if (!av || av.backend === 'none') { area.textContent = ''; area = newArea(); await mcqYedek(area, em); bitti = true; break; }
          var th = el('div', 'fn-th');
          it.appendChild(th);
          swallow(runway.say(ob.canavar, '…'));
          ui.thinking.show(th, { metin: 'Canavar cevabını okuyor…' });
          var puan = null, hata = null;
          try {
            puan = await claude.grade({ soru: ob.soru, anahtarFikirler: ob.anahtarFikirler, yanlisKavramlar: ob.yanlisKavramlar,
              idealCevap: ob.idealCevap, cevap: cevap, eminlik: em });
          } catch (e) { hata = e || {}; }
          try { ui.thinking.hide(); } catch (e) { /* ui yok */ }
          if (th.parentNode) th.parentNode.removeChild(th);
          if (puan) {
            rec.mod = 'claude'; rec.dogruluk = +puan.dogruluk || 0; rec.eminlik = em;
            rec.eksik = (puan.fikirler || []).filter(function(f){ return !f['var']; }).map(function(f){ return f.fikir; });
            rec.geri = puan.geriBildirim || [];
            area.textContent = '';
            area = newArea();
            area.appendChild(el('div', 'fn-puan', 'Doğruluk: %' + rec.dogruluk)).style.cssText = 'font-weight:800;margin:6px 0';
            var ul = el('ul', 'fn-fikirler');
            ul.style.cssText = 'margin:6px 0;padding-left:0;list-style:none';
            (puan.fikirler || []).forEach(function(f){ ul.appendChild(el('li', f['var'] ? 'iyi' : 'kotu', (f['var'] ? '✓ ' : '✗ ') + f.fikir)); });
            area.appendChild(ul);
            rec.geri.forEach(function(g){ area.appendChild(el('div', 'fn-gb', g)); });
            await bekle(area);
            bitti = true;
            break;
          }
          var code = (hata && hata.code) || 'gecici';
          if (code === 'iptal') { iptal = true; break; }
          if (code === 'izin_yok' || code === 'yok' || (code === 'json' && ++jsonHata >= 2)) {
            toast('Claude kapalı, çoktan seçmeliye geçtik');
            area.textContent = ''; area = newArea(); await mcqYedek(area, em); bitti = true; break;
          }
          var m = el('div', 'fn-hata', code === 'sinir' ? 'Biraz bekle, Claude yoruldu.' : 'Bağlantı sorunu.');
          it.appendChild(m);
          var sec = await iki(it, 'Tekrar dene', 'Çoktan seçmeliye geç');
          if (m.parentNode) m.parentNode.removeChild(m);
          if (sec === 1) { area.textContent = ''; area = newArea(); await mcqYedek(area, em); bitti = true; break; }
        }
        if (!bitti && it.parentNode) it.parentNode.removeChild(it);
      }
    } catch (e) {
      console.error('final', e);
      toast('Soru sahnesinde bir aksilik oldu', 'kotu');
    }
    if (kayit) kayit[ob.no] = rec;
    host.textContent = '';
    try { await runway.hideBoss(); } catch (e) { /* panel yok */ }
    return { dogru: true, eminlik: rec.eminlik, dogruluk: null, kavram: null, agirlik: 0, notlar: 'final' };
  }

  /* patron işleyicisini sar: final engelleri bizim işleyiciye, diğerleri eskisine */
  function sar(){
    var H = Q.obs.handlers, eski = H.patron;
    if (eski && eski._finalSarildi) return;
    var yeni = {
      tip: 'patron', _finalSarildi: true,
      enter: function(ob, ctx){
        if (ob && ob.final) {
          return finalEnter(ob, ctx).catch(function(e){
            console.error('final', e);
            return { dogru: true, eminlik: 1, dogruluk: null, kavram: null, agirlik: 0, notlar: 'hata' };
          });
        }
        if (eski && eski.enter) return eski.enter(ob, ctx);
        return Promise.resolve({ dogru: true, eminlik: 1, dogruluk: null, kavram: null, agirlik: 0, notlar: '' });
      }
    };
    Q.obs.register('patron', yeni);
  }

  /* ---------- rapor ---------- */
  function ortalama(l){
    if (!l.length) return 0;
    return Math.round(l.reduce(function(a, r){ return a + (r.dogruluk || 0); }, 0) / l.length);
  }
  function temelTur(stId, geri){
    var st = Q.data.stations[stId], tt = st && st.temelTur;
    if (!tt) { toast('Bu istasyonun temel turu yok'); return; }
    var kok = el('div', 'fn-temel'), i = 0, sim = null;
    var kartlar = tt.kartlar || [];
    function kapat(){
      if (sim && sim.destroy) { try { sim.destroy(); } catch (e) { /* sim kapandı */ } }
      sim = null;
      geri();
    }
    function kart(){
      kok.textContent = '';
      if (i >= kartlar.length) return simGoster();
      var k = kartlar[i];
      kok.appendChild(el('div', 'chip', (i + 1) + ' / ' + kartlar.length));
      kok.appendChild(el('h3', null, k.baslik));
      kok.appendChild(el('p', null, k.metin));
      kok.appendChild(btn(i + 1 < kartlar.length ? 'Sonraki' : 'Dene bakalım', true, function(){ i++; kart(); }));
    }
    function simGoster(){
      kok.textContent = '';
      var h = el('div', 'fn-sim'), ip = el('p', 'fn-sim-ip');
      kok.appendChild(h); kok.appendChild(ip);
      kok.appendChild(btn('Raporuma dön', true, kapat));
      if (tt.sim && tt.sim.modul) {
        sim = Q.sim.mount(tt.sim.modul, h, tt.sim.params || {}, { done: function(){}, hint: function(m){ ip.textContent = m; }, onFail: function(){} });
      }
    }
    kart();
    Q.ui.modal.open(kok, { baslik: 'Temel tur · ' + st.ad });
  }
  function rapor(sonuc, ad){
    sonuc = sonuc || son;
    if (!sonuc) return Promise.resolve();
    return new Promise(function(res){
      var kok = el('div', 'fn-rapor');
      kok.style.cssText = 'max-height:68vh;overflow:auto;padding-right:6px;text-align:left';
      var ort = ortalama(sonuc.sorular);
      kok.appendChild(el('h3', null, 'Sınav Raporu')).style.margin = '0 0 4px';
      var ozet = el('p', null, 'Genel doğruluk: %' + ort + '. ' + (ort >= 80 ? 'Sınava hazırsın.' : ort >= 50 ? 'İyi gidiyorsun; zayıf yerleri tekrar et.' : 'Temelleri biraz daha çalışalım.'));
      ozet.style.margin = '0 0 8px';
      kok.appendChild(ozet);
      sonuc.sorular.forEach(function(r){
        var satir = el('div', 'fn-satir');
        satir.style.cssText = 'margin:6px 0';
        var top = el('div');
        top.style.cssText = 'display:flex;justify-content:space-between;gap:8px;font-size:var(--fs-small)';
        top.appendChild(el('span', null, 'Q' + r.idx + ' · ' + (r.kaynak || '').toUpperCase() + ' · ' + r.kaynakAd));
        top.appendChild(el('b', null, r.mod === 'atla' ? 'Atlandı' : '%' + r.dogruluk));
        satir.appendChild(top);
        var cubuk = el('div', 'fn-cubuk');
        cubuk.style.cssText = 'height:10px;border-radius:5px;background:var(--panel2);overflow:hidden;border:1px solid var(--line)';
        var dolu = el('div');
        dolu.style.cssText = 'height:100%;width:' + Math.max(2, r.dogruluk || 0) + '%;background:var(' + (r.dogruluk >= 70 ? '--good' : r.dogruluk >= 40 ? '--yellow' : '--bad') + ')';
        cubuk.appendChild(dolu);
        satir.appendChild(cubuk);
        if (r.eksik && r.eksik.length) {
          var d = el('details');
          d.appendChild(el('summary', null, 'Eksik kalan anahtar fikirler (' + r.eksik.length + ')'));
          var ul = el('ul');
          r.eksik.forEach(function(x){ ul.appendChild(el('li', null, x)); });
          d.appendChild(ul);
          satir.appendChild(d);
        }
        kok.appendChild(satir);
      });
      /* hata defteri */
      var acikK = ((Q.state && Q.state.hataDefteri) || []).filter(function(h){ return !h.cozuldu; });
      var by = {};
      acikK.forEach(function(h){ by[h.kavram] = (by[h.kavram] || 0) + 1; });
      var kv = Object.keys(by).sort(function(a, b){ return by[b] - by[a]; }).slice(0, 5);
      kok.appendChild(el('h4', null, 'Hata defteri')).style.margin = '12px 0 4px';
      kok.appendChild(el('p', null, acikK.length ? acikK.length + ' açık kayıt: ' + kv.map(function(k){ return String(k).replace(/_/g, ' ') + ' (' + by[k] + ')'; }).join(', ') : 'Açık kayıt yok.'));
      /* tekrar önerisi */
      var zayif = sonuc.sorular.filter(function(r){ return (r.dogruluk || 0) < 80; })
        .sort(function(a, b){ return (a.dogruluk || 0) - (b.dogruluk || 0); });
      var gor = {}, oner = [];
      zayif.forEach(function(r){ if (!gor[r.kaynak] && oner.length < 3) { gor[r.kaynak] = 1; oner.push(r); } });
      kok.appendChild(el('h4', null, 'Tekrar çalışma önerisi')).style.margin = '12px 0 4px';
      if (!oner.length) kok.appendChild(el('p', null, 'Hepsi sağlam görünüyor.'));
      oner.forEach(function(r){
        var s = el('div');
        s.style.cssText = 'display:flex;gap:10px;align-items:center;margin:4px 0;flex-wrap:wrap';
        s.appendChild(el('span', null, r.kaynak.toUpperCase() + ' · ' + r.kaynakAd + ' (%' + r.dogruluk + ')'));
        s.appendChild(btn('Temel tura git', false, function(){ temelTur(r.kaynak, function(){ rapor(sonuc, ad).then(res); }); }));
        kok.appendChild(s);
      });
      var son2 = el('div');
      son2.style.cssText = 'display:flex;gap:10px;margin-top:14px;justify-content:center';
      son2.appendChild(btn('Haritaya dön', true, function(){ try { Q.ui.modal.close(); } catch (e) { /* modal yok */ } res(); }));
      kok.appendChild(son2);
      Q.ui.modal.open(kok, { baslik: '' });
      kok.scrollTop = 0;
    });
  }

  /* ---------- koşu ---------- */
  function yaz(sonuc){
    try { localStorage.setItem(KEY, JSON.stringify(sonuc)); } catch (e) { /* kapalı */ }
  }
  function oku(){
    try { var r = JSON.parse(localStorage.getItem(KEY)); if (r && Array.isArray(r.sorular)) return r; } catch (e) { /* yok */ }
    return null;
  }
  function haritaAc(){ try { if (Q.settings && Q.settings.openMap) Q.settings.openMap(); } catch (e) { /* ayar yok */ } }

  async function start(){
    if (calisiyor) return 'zaten';
    if (!acik()) { toast('Final için önce 9 istasyonu bitir (ya da Ayarlar: Her yere eriş).', 'bilgi'); return 'kilitli'; }
    var st = hazirla();
    if (!st) { toast('Final soruları bulunamadı', 'kotu'); return 'yok'; }
    sar();
    calisiyor = true;
    kayit = {};
    var eskiVoltaj = Q.state.voltaj, eskiAktif = Q.state.aktif;
    var eskiIlerleme = Q.state.ilerleme && Q.state.ilerleme.final;
    Q.data.stations.final = st;
    try { if (Q.settings && Q.settings.closeMap) Q.settings.closeMap(); } catch (e) { /* harita yok */ }
    try { if (Q.ui && Q.ui.modal) Q.ui.modal.close(); } catch (e) { /* modal yok */ }
    var onStart = function(o){
      if (!o || o.stationId !== 'final') return;
      var h = document.getElementById('hud-station');
      if (h) h.textContent = 'Sınav Günü · Final';
    };
    Q.bus.on('station:start', onStart);
    var sonuc = 'cikis';
    try {
      Q.state.voltaj = 100;
      sonuc = await Q.runner.start('final', 0);
    } catch (e) {
      console.error('final', e);
    }
    try { Q.bus.off('station:start', onStart); } catch (e) { /* off yok */ }
    delete Q.data.stations.final;
    if (Q.state.ilerleme) { if (eskiIlerleme) Q.state.ilerleme.final = eskiIlerleme; else delete Q.state.ilerleme.final; }
    Q.state.voltaj = eskiVoltaj;
    Q.state.aktif = eskiAktif;
    try { if (Q.ui && Q.ui.hud && Q.ui.hud.setVoltaj) Q.ui.hud.setVoltaj(eskiVoltaj); } catch (e) { /* hud yok */ }
    try { Q.save.write(); } catch (e) { /* kayıt yok */ }
    var cevaplar = kayit || {};
    kayit = null;
    calisiyor = false;
    if (sonuc !== 'tamam') { haritaAc(); return sonuc; }
    var liste = st.engeller.map(function(e){
      return cevaplar[e.no] || { idx: e.no, kaynak: e.kaynak, kaynakAd: e.kaynakAd, soru: e.soru, dogruluk: 0, eminlik: 1, eksik: e.anahtarFikirler.slice(), mod: 'atla', geri: [] };
    });
    son = { tarih: Date.now(), sorular: liste };
    yaz(son);
    await sleep(300);
    await rapor(son);
    haritaAc();
    return 'tamam';
  }

  Q.final = {
    start: start, acik: acik, hazirla: hazirla, rapor: rapor,
    son: function(){ return son || oku(); },
    calisiyor: function(){ return calisiyor; }
  };
})();
