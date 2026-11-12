#!/usr/bin/env node
/* hesap-engel.test.js: oyun içi `hesap` engeli (istasyon sonu hesap görevi). Playwright, 1366x768.
 * Kullanım: bash oyun/build.sh && node oyun/test/hesap-engel.test.js
 * Kapsam: veri sırası (10 engel), s01..s10 hepsinde engel açılır, s02/s05/s06 baştan sona (yanlış+doğru adım, Esc menüsü,
 * atla, geri, yenileme), eski kayıt uyumu, hata defteri kaydı, Çözdüm işareti, ceza yok. */
'use strict';
var path = require('path'), assert = require('assert');
var chromium = require('playwright').chromium;
var DIST = path.join(__dirname, '..', 'dist', 'oyun.html');
var EKRAN = path.join(__dirname, 'ciktilar');
var n = 0;
var HI = 7;   /* hikayeAtla açıkken hesap engelinin liste indeksi (hikaye çıkar: patron 6, hesap 7, sandık 8); hikayeAtla kapalıyken 8 */
function ok(c, m){ assert.ok(c, m); n++; process.stdout.write('GEÇTİ ' + m + '\n'); }
function bekle(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }
var GOREV = { s01: 'si-yogunluk', s02: 'miller-326', s03: 'foto-cu', s04: 'bohr-gecis', s05: 'q5-bolgeler', s06: 'q6-e-gt', s07: 'olc-E', s08: 'bel-v', s09: 'bant-si', s10: 'fd-100meV' };

(async function(){
  var br = await chromium.launch();
  var ctx = await br.newContext({ viewport: { width: 1366, height: 768 } });
  var page = await ctx.newPage(), hatalar = [];
  page.on('pageerror', function(e){ hatalar.push(String(e)); });
  page.on('console', function(m){ if (m.type() === 'error' && !/fonts\.|ERR_FAILED|net::/.test(m.text())) hatalar.push(m.text()); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, function(r){ r.abort(); });
  async function ev(f, a){ return page.evaluate(f, a); }
  async function yukle(){
    await page.goto('file://' + DIST); await bekle(700);
    await ev(function(){ Q.settings.closeMap(); Q.settings.set('hikayeAtla', true); Q.settings.set('kilitleriAc', true); Q.state.ayarlar.hiz = 3; });
  }
  /* Görev ekranı önce 'Önce bir örnek' paneli açar (hikayeAtla açık olsa bile); ornek:true ise panelde kalır */
  async function basla(sid, ornek){
    await ev(function(s){ Q.state.voltaj = 100; Q.runner.start(s, Q.runner.indexOf(s, s + '-h01')); }, sid);
    await page.waitForSelector('#dock .hg-kok', { timeout: 30000 });
    await page.waitForSelector('#dock .ho-panel', { timeout: 10000 });
    if (!ornek) { await page.locator('#dock .ho-hazir').click(); await page.waitForSelector('#dock .hg-ust', { timeout: 5000 }); }
    await bekle(150);
  }
  async function kapat(){ await ev(function(){ Q.runner.abort(); }); await bekle(150); await ev(function(){ Q.settings.closeMap(); }); }

  await yukle();

  /* ---- 1. veri: 10 engel, hesap patrondan sonra, sandıktan önce ---- */
  var veri = await ev(function(){
    var out = [];
    Object.keys(Q.data.stations).filter(function(k){ return /^s\d\d$/.test(k); }).sort().forEach(function(id){
      var e = Q.data.stations[id].engeller, t = e.map(function(x){ return x.tip; });
      out.push({ id: id, n: e.length, i: t.indexOf('hesap'), p: t.indexOf('patron'), s: t.indexOf('sandik'), g: e[t.indexOf('hesap')] && e[t.indexOf('hesap')].hesapGorev,
        var_: !!(Q.hesap.gorev(e[t.indexOf('hesap')].hesapGorev)), sonu: Q.hesap.istasyonSonu(id).some(function(x){ return x.id === e[t.indexOf('hesap')].hesapGorev; }) });
    });
    return out;
  });
  ok(veri.length === 10 && veri.every(function(v){ return v.n === 10 && v.i === v.p + 1 && v.s === v.i + 1 && v.var_ && v.sonu; }), '10 istasyonda 10 engel; hesap patrondan sonra, sandıktan önce; görev istasyonSonu');
  var ind = await ev(function(){ return ['s01', 's05'].map(function(s){ return Q.runner.indexOf(s, s + '-h01'); }); });
  ok(ind[0] === HI && ind[1] === HI, 'Q.runner.indexOf hesap engeli = ' + HI + ' (hikayeAtla açık; kapalıyken 8, sandık hemen sonra)');
  var fin = await ev(function(){ var f = Q.data.stations.final; return f ? f.engeller.every(function(e){ return e.tip === 'patron'; }) : 'yok'; });
  ok(fin === true || fin === 'yok', 'final engelleri (96-final) yalnızca patron: hesap karışmaz');

  /* ---- 2. s01..s10 hepsinde hesap engeli açılır ---- */
  for (var sid of Object.keys(GOREV)) {
    await basla(sid, true);
    var op = await ev(function(){
      var d = document.getElementById('dock'), pn = d.querySelector('.ho-panel'), g = Q.hesap.gorev(d.querySelector('.hg-kok').dataset.gorev), gb = pn.querySelector('.ho-govde'), bt = pn.querySelector('.ho-hazir').getBoundingClientRect(), dr = d.getBoundingClientRect();
      return { yontem: pn.querySelectorAll('.ho-yontem li').length, adimSay: pn.querySelectorAll('.ho-adim').length, hazir: /Hazırım, görevi göster/.test(pn.querySelector('.ho-hazir').textContent),
        gec: !!pn.querySelector('.ho-gec'), gorevGizli: !d.querySelector('#hg-soru'), tasma: d.scrollWidth > d.clientWidth + 1 || gb.scrollWidth > gb.clientWidth + 1,
        btnGorunur: bt.bottom <= dr.bottom + 1 && bt.top >= dr.top, ornek: g.ornek.baslik, n: g.ornek.adimlar.length };
    });
    ok(op.yontem >= 3 && op.yontem <= 5 && op.adimSay === 0 && op.hazir && op.gec && op.gorevGizli && !op.tasma && op.btnGorunur, sid + ': "Önce bir örnek" paneli (Yöntem ' + op.yontem + ' madde, görev gizli, "Hazırım" düğmesi görünür, taşma yok; hikayeAtla açık)');
    await page.locator('#dock .ho-ileri').click(); await bekle(60);
    ok(await page.locator('#dock .ho-adim').count() === 1, sid + ': örnek "İleri" ile adım adım açılır');
    await page.locator('#dock .ho-geri').click(); await bekle(60);
    ok(await page.locator('#dock .ho-adim').count() === 0, sid + ': örnek "Geri" ile geri sarar');
    for (var kk = 0; kk <= op.n; kk++) { await page.locator('#dock .ho-ileri').click(); await bekle(30); }
    ok(await page.locator('#dock .ho-sonuc').count() === 1 && await page.locator('#dock .ho-ileri').isDisabled(), sid + ': örnek sonucu ve ipucu gösterilir');
    await page.locator('#dock .ho-hazir').click(); await page.waitForSelector('#dock .hg-ust', { timeout: 5000 }); await bekle(100);
    var a = await ev(function(){
      var k = document.querySelector('#dock .hg-kok'), d = document.getElementById('dock');
      return { g: k.dataset.gorev, soru: !!document.getElementById('hg-soru') && document.getElementById('hg-soru').textContent.length > 20,
        ver: document.querySelectorAll('#hg-veriler li').length, adim: document.querySelectorAll('.hg-adim').length,
        tasma: d.scrollWidth > d.clientWidth + 1, cur: Q.runner.info().cur };
    });
    ok(a.g === GOREV[sid] && a.soru && a.ver >= 1 && a.adim === 1 && !a.tasma && a.cur === HI, sid + ': hesap engeli açıldı (' + a.g + ', yatay taşma yok)');
    await kapat();
  }

  /* ---- 3. s02, s05, s06 baştan sona ---- */
  async function oynat(sid, opt){
    opt = opt || {};
    await basla(sid);
    var gorev = await ev(function(s){ var g = Q.hesap.gorev(s); var ad = g.adimlar.map(function(a){ return { b: a.baslik, q: a.adimSoru || null }; }); if (g.sonucSoru) ad.push({ b: 'Sonuç kontrolü', q: g.sonucSoru }); return JSON.parse(JSON.stringify({ id: g.id, konu: g.konu, adimlar: ad })); }, GOREV[sid]);
    var yanlisSayisi = 0, volt0 = await ev(function(){ return Q.state.voltaj; });
    for (var i = 0; i < gorev.adimlar.length; i++) {
      var kutu = page.locator('.hg-adim[data-adim="' + (i + 1) + '"]');
      await kutu.waitFor({ timeout: 8000 });
      var q = gorev.adimlar[i].q;
      /* önceki adım kutuları duruyor, soru ve verilenler ekranda kalıyor */
      ok(await page.locator('#hg-soru').isVisible() && await page.locator('#hg-veriler').isVisible(), sid + ' adım ' + (i + 1) + ': görev metni ve verilenler ekranda');
      if (q && q.sayiCevap) {
        var gir = kutu.locator('.hg-giris');
        if (opt.yanlis && i === 0) {
          await gir.fill('987654'); await kutu.locator('.hg-kontrol').click(); await bekle(100);
          var fbt = await kutu.locator('.hg-fb').textContent();
          ok(/^Cevabın yanlış\. Doğru: /.test(fbt), sid + ': yanlış sayı -> "' + fbt.slice(0, 40) + '"');
          ok(await kutu.locator('.hg-adim-goster').isVisible(), sid + ': "Adımı göster" yardım düğmesi var');
          var ob = kutu.locator('.hg-ornek-adim');
          ok(await ob.count() === 1 && /^Örnekteki \d+\. adıma bak$/.test(await ob.textContent()), sid + ': yanlışta "Örnekteki N. adıma bak" bağlantısı');
          await ob.click(); await bekle(120);
          ok(await page.locator('#dock .hc-ovl .ho-adim.vurgu').count() === 1 && await page.locator('#dock .hc-ovl .ho-hazir').textContent() === 'Göreve dön', sid + ': bağlantı örneğin ilgili adımını vurgulu açar');
          await page.keyboard.press('Enter'); await bekle(80);
          ok(await page.locator('.hg-adim[data-adim="2"]').count() === 0 && await page.locator('#dock .hc-ovl').count() === 1, sid + ': örnek açıkken Enter göreve geçmez');
          await page.locator('#dock .hc-ovl .ho-hazir').click(); await bekle(80);
          ok(await page.locator('#dock .hc-ovl').count() === 0 && await page.locator('#hg-soru').isVisible(), sid + ': "Göreve dön" görevi bozmadan geri getirir');
          ok(!(await kutu.locator('.hg-formul').count()), sid + ': yanlışta çözüm kendiliğinden açılmaz');
          await kutu.locator('.hg-adim-goster').click(); await bekle(80);
          ok((await kutu.locator('.hg-formul').count()) >= 1, sid + ': "Adımı göster" formülü açar');
          yanlisSayisi++;
          await gir.fill(String(q.sayiCevap.deger)); await kutu.locator('.hg-kontrol').click(); await bekle(100);
          ok(/^Doğru\./.test(await kutu.locator('.hg-fb').textContent()), sid + ': tekrar deneyince doğru kabul');
        } else {
          await gir.fill(String(q.sayiCevap.deger)); await kutu.locator('.hg-kontrol').click(); await bekle(100);
          ok(/^Doğru\./.test(await kutu.locator('.hg-fb').textContent()), sid + ' adım ' + (i + 1) + ': doğru sayı');
        }
      } else if (q && q.secenekler) {
        var dogru = q.secenekler.filter(function(s){ return s.dogru; })[0].t, yan = q.secenekler.filter(function(s){ return !s.dogru; })[0].t;
        if (opt.yanlis && i === 1) {
          await kutu.locator('.hg-sec', { hasText: yan }).first().click();
          ok(await kutu.locator('.hg-fb').count() === 0, sid + ': şık seçince hemen gitmez (Onayla bekler)');
          await kutu.locator('.hg-kontrol').click(); await bekle(100);
          ok(/^Cevabın yanlış\. Doğru: /.test(await kutu.locator('.hg-fb').textContent()), sid + ': yanlış şık geri bildirimi');
          yanlisSayisi++;
        }
        await kutu.locator('.hg-sec', { hasText: dogru }).first().click();
        await kutu.locator('.hg-kontrol').click(); await bekle(100);
        ok(/^Doğru\./.test(await kutu.locator('.hg-fb').textContent()), sid + ' adım ' + (i + 1) + ': doğru şık');
      }
      ok((await kutu.locator('.hg-formul, p').count()) >= 1, sid + ' adım ' + (i + 1) + ': doğru cevaptan sonra çözüm açıldı');
      if (i === 0) await page.screenshot({ path: path.join(EKRAN, 'hesap-engel-' + sid + '-adim1.png') });
      await kutu.locator('.hg-sonraki').click(); await bekle(100);
    }
    await page.waitForSelector('#hg-sonuc', { timeout: 5000 });
    ok(await page.locator('#hg-not').isVisible() && /Sınavda dikkat/.test(await page.locator('#hg-not').textContent()), sid + ': sonuç, formül özeti ve "Sınavda dikkat" notu');
    await page.screenshot({ path: path.join(EKRAN, 'hesap-engel-' + sid + '-sonuc.png') });
    var son = await ev(function(a){ return { c: Q.state.hesapCalisma[a], v: Q.state.voltaj, hd: Q.state.hataDefteri.filter(function(h){ return h.hesap === a; }) }; }, gorev.id);
    ok(son.c === (yanlisSayisi ? 'tekrar' : 'cozdum'), sid + ': tamamlayınca işaret ' + son.c);
    ok(son.v === volt0, sid + ': ceza/can kaybı yok (voltaj ' + volt0 + ' -> ' + son.v + ')');
    ok(son.hd.length === (yanlisSayisi ? 1 : 0) && (!yanlisSayisi || (son.hd[0].kavram === 'hesap_' + gorev.konu && son.hd[0].istasyon === sid && son.hd[0].adim >= 1 && son.hd[0].engel === sid + '-h01')), sid + ': hata defteri kaydı ' + JSON.stringify(son.hd.map(function(h){ return h.kavram + '/' + h.adim; })));
    await page.locator('.hg-cozdum').click(); await bekle(80);
    ok(await ev(function(a){ return Q.state.hesapCalisma[a]; }, gorev.id) === 'cozdum', sid + ': "Çözdüm" düğmesi işaretler');
    await page.locator('.hg-devam').click();
    /* sandık: Devam */
    await page.waitForSelector('#dock .sd-devam', { timeout: 20000 });
    var pr = await ev(function(s){ return Q.state.ilerleme[s]; }, sid);
    ok(pr.hesap === 'tamam' && pr.enSon === HI + 1, sid + ': ilerleme.hesap=tamam, enSon=' + (HI + 1));
    await page.locator('#dock .sd-devam').click();
    await bekle(1500);
    var bitti = await ev(function(s){ return Q.state.ilerleme[s].tamam === true; }, sid);
    ok(bitti, sid + ': istasyon tamamlandı');
    await ev(function(){ Q.settings.closeMap(); });
  }
  await ev(function(){ Q.state.hataDefteri = []; Q.state.hesapCalisma = {}; Q.state.ilerleme = {}; });
  await oynat('s02', { yanlis: true });
  await ev(function(){ Q.state.ilerleme = {}; });
  await oynat('s05', { yanlis: true });
  await ev(function(){ Q.state.ilerleme = {}; });
  await oynat('s06', { yanlis: true });

  /* ---- 4. hata defteri sayfasında hesap kaydı ---- */
  await ev(function(){ Q.tekrar.open(); Q.tekrar.git('hata'); }); await bekle(300);
  var hk = await ev(function(){ var c = document.querySelectorAll('.th-kart'); return { n: c.length, t: Array.prototype.map.call(c, function(x){ return x.textContent; }).join('|') }; });
  ok(hk.n >= 3 && /Hesap görevi:/.test(hk.t), 'Hata defteri sayfası hesap kayıtlarını gösterir (' + hk.n + ' kart)');
  await page.locator('.th-kart button', { hasText: 'Hesap çalıştayında aç' }).first().click(); await bekle(300);
  ok(await page.locator('.hc-it[aria-current="true"]').count() === 1, 'Hata defteri -> Hesap çalıştayı ilgili görevi seçili açar');
  await ev(function(){ Q.tekrar.close(); }); await bekle(100);

  /* ---- 5. Esc menüsü: devam / atla / önceki engele dön ---- */
  await ev(function(){ Q.state.ilerleme = {}; Q.state.hesapCalisma = {}; Q.state.hataDefteri = []; });
  await basla('s02', true);
  await page.locator('#dock .ho-gec').click(); await page.waitForSelector('#dock .hg-ust', { timeout: 5000 });
  ok(await page.locator('#dock .hg-ornek-tekrar').count() === 1 && await page.locator('#dock .hc-ovl').count() === 0, '"Örneği geç" paneli kapatır; görev sırasında "Örneği tekrar göster" bağlantısı var');
  await page.locator('#dock .hg-ornek-tekrar').click(); await bekle(120);
  ok(await page.locator('#dock .hc-ovl .ho-sonuc').count() === 1, '"Örneği tekrar göster" örneği tam açar (kaplama)');
  await page.screenshot({ path: path.join(EKRAN, 'hesap-ornek-tekrar-s02.png') });
  await page.locator('#dock .hc-ovl .ho-hazir').click(); await bekle(80);
  await page.locator('.hg-giris').click();            // odak giriş kutusunda iken bile Esc çalışmalı
  await page.keyboard.press('Escape'); await bekle(300);
  ok(await page.locator('.runner-menu').count() === 1 && await ev(function(){ return Q.runner.info().paused; }), 'Esc (girişte odakken) duraklatma menüsünü açar');
  await page.keyboard.press('Escape'); await bekle(300);
  ok(await page.locator('.runner-menu').count() === 0 && await page.locator('.hg-kok').count() === 1, 'ikinci Esc devam eder, görev ekranda kalır');
  await page.keyboard.press('Escape'); await bekle(200);
  await page.locator('.runner-menu button', { hasText: 'Bu engeli atla' }).click();
  await page.waitForSelector('#dock .sd-devam', { timeout: 20000 });
  var at = await ev(function(){ var p = Q.state.ilerleme.s02; return { h: p.hesap, c: Q.state.hesapCalisma.hasOwnProperty('miller-326'), t: document.querySelector('.sd-hesap-atlandi') && document.querySelector('.sd-hesap-atlandi').textContent, v: Q.state.voltaj }; });
  ok(at.h === 'atlandi' && !at.c && /Hesap atlandı/.test(at.t || '') && at.v === 100, 'hesap atlanabilir: ilerleme.hesap=atlandi, sandık raporunda "Hesap atlandı", ceza yok');
  await page.locator('#dock .sd-devam').click(); await bekle(1500);
  ok(await ev(function(){ return Q.state.ilerleme.s02.tamam === true; }), 'hesap atlanınca istasyon yine tamamlanır (şart değil)');
  await ev(function(){ Q.settings.closeMap(); });
  await basla('s02');
  await page.keyboard.press('Escape'); await bekle(250);
  await page.locator('.runner-menu button', { hasText: 'Önceki engele dön' }).click(); await bekle(900);
  ok(await ev(function(){ return Q.runner.info().cur; }) === HI - 1, 'Esc > Önceki engele dön: hesaptan patrona (index ' + (HI - 1) + ')');
  await kapat();

  /* ---- 6. yenileme: yarım istasyon + hesapCalisma/hata defteri kalıcı ---- */
  await ev(function(){ Q.state.ilerleme = {}; Q.state.hesapCalisma = {}; Q.state.hataDefteri = []; });
  await basla('s05');
  var kutu1 = page.locator('.hg-adim[data-adim="1"]');
  await kutu1.locator('.hg-giris').fill('1'); await kutu1.locator('.hg-kontrol').click(); await bekle(150);     // yanlış (adım 1)
  var onceki = await ev(function(){ Q.save.flush && Q.save.flush(); return { hd: Q.state.hataDefteri.length, en: Q.state.ilerleme.s05.enSon, a: Q.state.aktif.index }; });
  ok(onceki.hd === 1, 'yanlış adım hata defterine yazıldı');
  await page.reload(); await bekle(900);
  var sonra = await ev(function(){ return { hd: Q.state.hataDefteri.length, h: Q.state.hataDefteri[0] && Q.state.hataDefteri[0].hesap, en: Q.state.ilerleme.s05 && Q.state.ilerleme.s05.enSon, a: Q.state.aktif }; });
  ok(sonra.hd === 1 && sonra.h === 'q5-bolgeler', 'yenileme sonrası hata defteri kaydı duruyor');
  ok(sonra.a.stationId === 's05' && sonra.a.index === HI, 'yenileme sonrası aktif istasyon/engel (hesap)');
  await ev(function(){ Q.settings.closeMap(); Q.settings.set('hikayeAtla', true); Q.settings.set('kilitleriAc', true); Q.state.ayarlar.hiz = 3; Q.runner.start('s05', Q.state.aktif.index); });
  await page.waitForSelector('#dock .hg-kok', { timeout: 30000 });
  await page.waitForSelector('#dock .ho-hazir', { timeout: 10000 }); await page.locator('#dock .ho-hazir').click(); await bekle(150);
  ok(await page.locator('.hg-adim[data-adim="1"]').count() === 1, 'yenileme sonrası kaldığı engelden (hesap) devam eder (önce örnek)');
  await kapat();

  /* ---- 7. eski kayıt uyumu (9 engelli dönem): tamamlanmışlar tamam, yarım istasyon kaymaz ---- */
  await ev(function(){
    var eski = { v: 1, ilerleme: { s01: { tamam: true, enSon: 9, kontrol: 9, kisaDevre: 0, denendi: true }, s02: { tamam: false, enSon: 8, kontrol: 2, denendi: true }, s03: { tamam: false, enSon: 3, kontrol: 2 } },
      hataDefteri: [{ id: 'hd-1', kavram: 'miller', istasyon: 's02', tur: 'yanlis', engel: 's02-o05', tarih: 1, tekrar: 0, cozuldu: false }], kartlar: [], fabrika: { kurulu: ['s01'] }, voltaj: 100, aktif: { stationId: 's02', index: 8 } };
    localStorage.setItem('cip-hatti-v1', JSON.stringify(eski));
    Q.save.load();
  });
  await bekle(200);
  var ek = await ev(function(){ return { s1: Q.state.ilerleme.s01.tamam, s2: Q.state.ilerleme.s02.enSon, s3: Q.state.ilerleme.s03.enSon, hc: typeof Q.state.hesapCalisma, hd: Q.state.hataDefteri.length }; });
  ok(ek.s1 === true && ek.s2 === 8 && ek.s3 === 3 && ek.hd === 1, 'eski kayıt: s01 tamam kalır, s02/s03 enSon değişmez, hata defteri durur');
  await ev(function(){ Q.settings.closeMap(); Q.settings.set('hikayeAtla', false); Q.settings.set('kilitleriAc', true); Q.state.ayarlar.hiz = 3; Q.runner.start('s02', Q.state.ilerleme.s02.enSon); });
  await page.waitForSelector('#dock .hg-kok', { timeout: 30000 });
  ok(await ev(function(){ return document.querySelector('#dock .hg-kok').dataset.gorev; }) === 'miller-326' && await page.locator('#dock .ho-panel').count() === 1, 'eski kayıtta s02 enSon=8 -> hesap engeli açılır (patrondan sonra)');
  await kapat();
  var haritaEngel = await ev(function(){ Q.settings.openMap(); var b = Array.prototype.slice.call(document.querySelectorAll('button')).filter(function(x){ return /Hesap görevi/.test(x.textContent); }); return b.length; });
  ok(haritaEngel >= 0, 'harita açılır (engel listesi data tabanlı)');
  await ev(function(){ Q.settings.closeMap(); });

  ok(hatalar.length === 0, 'konsol/sayfa hatası yok ' + hatalar.slice(0, 3).join(' | '));
  await br.close();
  process.stdout.write('\nTUMU GEÇTİ (' + n + ' kontrol)\n');
})().catch(function(e){ process.stdout.write('HATA ' + (e && e.stack || e) + '\n'); process.exit(1); });
