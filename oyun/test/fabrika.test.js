#!/usr/bin/env node
/* fabrika.test.js · Fabrika şeması (harita ekranı) testi. Önce: bash oyun/build.sh. Kullanım: node oyun/test/fabrika.test.js */
'use strict';
var path = require('path');
var fs = require('fs');
var chromium = require('playwright').chromium;
var DIST = path.join(__dirname, '..', 'dist', 'oyun.html');
var OUT = path.join(__dirname, 'ciktilar');
var kaldi = 0;
function ok(c, m){ process.stdout.write((c ? 'ok: ' : 'KALDI: ') + m + '\n'); if (!c) kaldi++; }

(async function(){
  fs.mkdirSync(OUT, { recursive: true });
  var br = await chromium.launch();
  async function ac(w, h){
    var ctx = await br.newContext({ viewport: { width: w, height: h } });
    var p = await ctx.newPage();
    p._errs = [];
    p.on('pageerror', function(e){ p._errs.push(String(e)); });
    p.on('console', function(m){ if (m.type() === 'error' && !/fonts\.|net::|ERR_/.test(m.text())) p._errs.push(m.text()); });
    await p.route(/fonts\.(googleapis|gstatic)\.com/, function(r){ r.abort(); });
    await p.goto('file://' + DIST);
    await p.waitForTimeout(600);
    await p.evaluate(function(){
      try { Q.ui.modal.close(); } catch (e) {}
      window.__start = null;
      Q.runner.start = function(id, from){ window.__start = [id, from]; return new Promise(function(){}); };
      Q.settings.openMap();
    });
    await p.waitForTimeout(300);
    return p;
  }

  /* 1) boş kayıt */
  var p = await ac(1440, 900);
  var r = await p.evaluate(function(){
    var n = document.querySelectorAll('.fb-node');
    return { n: n.length, sirada: [].map.call(document.querySelectorAll('.fb-node.fb-sirada'), function(x){ return x.dataset.id; }),
      kilitli: document.querySelectorAll('.fb-node.fb-kilitli').length, akis: document.querySelectorAll('.fb-boru-akis').length,
      kirik: document.querySelectorAll('.fb-boru-kirik').length, olu: document.querySelectorAll('.fb-boru-olu').length,
      baslik: document.querySelector('.fb-ozet').textContent, kart: document.querySelectorAll('[data-kart]').length };
  });
  ok(r.n === 10, 'şemada 10 bölüm düğümü (' + r.n + ')');
  ok(r.sirada.join() === 's01' && r.kilitli === 9, 'yalnızca s01 sıradaki, 9 kilitli');
  ok(r.akis === 0 && r.kirik === 1 && r.olu === 10, 'borular: akış 0, kırık(sıradaki önü) 1, ölü 10 (' + [r.akis, r.kirik, r.olu] + ')');
  ok(/0\/10 bölüm onarıldı/.test(r.baslik) && /Hat %0 çalışıyor/.test(r.baslik), 'başlık: ' + r.baslik);
  ok(r.kart > 0, 'kart bölümü yerinde');
  await p.screenshot({ path: path.join(OUT, 'fabrika-0.png') });

  /* kilitli bölüm paneli: Onar yok */
  await p.locator('.fb-node[data-id=s03]').click();
  r = await p.evaluate(function(){ var pn = document.getElementById('a8-station-panel'); return { gorunur: pn.style.display !== 'none', onar: !!pn.querySelector('.btn.primary'), t: pn.textContent }; });
  ok(r.gorunur && !r.onar && /kilitli/.test(r.t), 'kilitli bölüm: panel açılır, Onar yok');
  /* sıradaki bölüm paneli */
  await p.locator('.fb-node[data-id=s01]').click();
  r = await p.evaluate(function(){ var pn = document.getElementById('a8-station-panel');
    return { madde: pn.querySelectorAll('.fb-madde > li').length, kav: pn.querySelectorAll('.fb-kav .chip').length,
      onar: [].map.call(pn.querySelectorAll('.btn.primary'), function(b){ return b.textContent; }), mini: !!pn.querySelector('.fb-mini'), engel: pn.querySelectorAll('ol li').length, t: pn.textContent }; });
  ok(r.madde >= 3 && r.madde <= 4, 'panelde 3-4 madde (' + r.madde + ')');
  ok(r.kav >= 3, 'kavram rozetleri English (Türkçe) (' + r.kav + ')');
  ok(r.onar[0] === 'Onar' && !r.mini && r.engel === 9, 'Onar düğmesi, mini soru henüz yok, 9 engele atla düğmesi');
  await p.locator('#a8-station-panel .btn.primary', { hasText: 'Onar' }).click();
  await p.waitForTimeout(200);
  r = await p.evaluate(function(){ return { s: window.__start, harita: !document.querySelector('.fb-root') }; });
  ok(r.s && r.s[0] === 's01' && r.s[1] === 0, 'Onar -> runner.start(s01, 0) ' + JSON.stringify(r.s));
  ok(r.harita, 'Onar haritayı kapatır');
  ok(p._errs.length === 0, 'konsol hatası yok ' + p._errs.join('|'));
  await p.context().close();

  /* 2) s01+s02 onarılmış */
  p = await ac(1366, 768);
  await p.evaluate(function(){
    Q.state.ilerleme.s01 = { tamam: true, enSon: 9 }; Q.state.ilerleme.s02 = { tamam: true, enSon: 9 };
    Q.state.fabrika.kurulu = ['s01', 's02']; Q.settings.openMap();
  });
  r = await p.evaluate(function(){
    return { tamam: document.querySelectorAll('.fb-node.fb-tamam').length, sirada: [].map.call(document.querySelectorAll('.fb-node.fb-sirada'), function(x){ return x.dataset.id; }),
      akis: document.querySelectorAll('.fb-boru-akis').length, kirik: document.querySelectorAll('.fb-boru-kirik').length,
      baslik: document.querySelector('.fb-ozet').textContent, w: document.querySelector('.fb-bar-dolu').style.width,
      anim: !!document.querySelector('.fb-boru-akis .fb-akis'), uretim: document.body.textContent.indexOf('12 wafer/saat') >= 0 };
  });
  ok(r.tamam === 2 && r.sirada.join() === 's03', 's01,s02 çalışıyor, s03 sıradaki');
  ok(r.akis === 2 && r.kirik === 1, 'borular: kum>s01>s02 akıyor (2), s02>s03 kırık (1) ' + [r.akis, r.kirik]);
  ok(/2\/10/.test(r.baslik) && /%20/.test(r.baslik) && r.w === '20%', 'ilerleme ' + r.baslik);
  ok(r.anim && r.uretim, 'akış animasyonu ve üretim satırı (fabrika.kurulu) duruyor');
  await p.screenshot({ path: path.join(OUT, 'fabrika-2.png') });
  /* mini soru */
  await p.locator('.fb-node[data-id=s01]').click();
  r = await p.evaluate(function(){ var m = document.querySelector('.fb-mini'); return { var: !!m, soru: m && m.querySelector('.fb-mini-soru').textContent, opt: m ? m.querySelectorAll('.opt').length : 0, onay: m && m.querySelector('.fb-onay').disabled }; });
  ok(r.var && r.opt === 3 && r.onay === true, 'onarılan bölümde mini soru (şık seçilmeden Onayla kapalı)');
  ok(/single crystal/.test(r.soru), 'soru İngilizce terimli: ' + r.soru);
  var yanlis = await p.evaluate(function(){ var o = [].slice.call(document.querySelectorAll('.fb-mini .opt')); return o.map(function(b){ return +b.dataset.i; }); });
  var yi = yanlis.indexOf(1);
  await p.locator('.fb-mini .opt').nth(yi).click();
  await p.locator('.fb-mini .fb-onay').click();
  r = await p.evaluate(function(){ return { g: document.querySelector('.fb-geri').textContent, e: Q.state.fabrikaMini && Q.state.fabrikaMini.s01 }; });
  ok(/Cevabın yanlış/.test(r.g) && r.e && r.e.dogru === false && r.e.deneme === 1, 'yanlış cevap geri bildirimi + kayıt');
  await p.locator('.fb-mini .btn', { hasText: 'Tekrar dene' }).click();
  var dz = await p.evaluate(function(){ return [].map.call(document.querySelectorAll('.fb-mini .opt'), function(b){ return +b.dataset.i; }).indexOf(0); });
  await p.locator('.fb-mini .opt').nth(dz).click();
  await p.locator('.fb-mini .fb-onay').click();
  r = await p.evaluate(function(){ return { g: document.querySelector('.fb-geri').textContent, e: Q.state.fabrikaMini.s01, kayit: Q.save.exportText() }; });
  ok(/^Doğru/.test(r.g) && r.e.dogru === true && r.e.deneme === 2, 'doğru cevap kaydedildi');
  ok(JSON.parse(r.kayit).fabrikaMini.s01.dogru === true && JSON.parse(r.kayit).v === 1, 'kayıt (cip-hatti-v1) fabrikaMini alanını taşır, v=1');
  await p.screenshot({ path: path.join(OUT, 'fabrika-mini.png') });
  /* içe aktarım geriye uyumlu: alansız eski kayıt */
  r = await p.evaluate(function(){
    var o = JSON.parse(Q.save.exportText()); delete o.fabrikaMini; var iyi = Q.save.importText(JSON.stringify(o)); Q.settings.openMap();
    var e1 = iyi && !!document.querySelector('.fb-root');
    var o2 = JSON.parse(Q.save.exportText()); o2.fabrikaMini = { s01: { dogru: true, deneme: 1 } };
    return { e1: e1, e2: Q.save.importText(JSON.stringify(o2)), m: Q.state.fabrikaMini && Q.state.fabrikaMini.s01 && Q.state.fabrikaMini.s01.dogru };
  });
  ok(r.e1 && r.e2 && r.m === true, 'eski kayıt (fabrikaMini yok) yüklenir; alan içe aktarımda korunur');
  /* sığma 1366x768 */
  r = await p.evaluate(function(){ var b = document.querySelector('.a8-back > .panel'); return { sx: document.documentElement.scrollWidth - innerWidth, bx: b.scrollWidth - b.clientWidth, sema: document.querySelector('.fb-sema').scrollWidth - document.querySelector('.fb-sema').clientWidth }; });
  ok(r.sx <= 0 && r.bx <= 0 && r.sema <= 0, '1366x768 yatay taşma yok ' + JSON.stringify(r));
  /* Her yere eriş: kilitli bölümde Onar var */
  r = await p.evaluate(function(){ Q.settings.set('kilitleriAc', true); return Q.settings.istasyonAcik('s08'); });
  await p.locator('.fb-node[data-id=s08]').click();
  var onar = await p.locator('#a8-station-panel .btn.primary').count();
  ok(r === true && onar === 1, 'Her yere eriş açıkken kilitli bölüm de onarılabilir (Onar var)');
  await p.locator('#a8-station-panel ol li button').nth(4).click();
  await p.waitForTimeout(200);
  r = await p.evaluate(function(){ return { s: window.__start, atladi: Q.state.ilerleme.s08 && Q.state.ilerleme.s08.atladi }; });
  ok(r.s && r.s[0] === 's08' && r.s[1] === 4 && r.atladi === true, 'İstediğin engele atla çalışıyor ' + JSON.stringify(r));
  ok(p._errs.length === 0, 'konsol hatası yok ' + p._errs.join('|'));
  await p.context().close();

  /* 3) hepsi onarılmış: kutlama + Final */
  p = await ac(1440, 900);
  await p.evaluate(function(){
    for (var i = 1; i <= 10; i++) Q.state.ilerleme['s' + (i < 10 ? '0' : '') + i] = { tamam: true, enSon: 9 };
    Q.settings.openMap();
  });
  r = await p.evaluate(function(){
    return { k: !!document.querySelector('.fb-kutlama'), f: !!document.getElementById('fb-final'), baslik: document.querySelector('.fb-ozet').textContent,
      akis: document.querySelectorAll('.fb-boru-akis').length, cip: !!document.querySelector('.fb-uc-cikti.fb-hazir') };
  });
  ok(r.k && r.f && /10\/10/.test(r.baslik) && /%100/.test(r.baslik), 'hepsi onarıldı: kutlama, Final düğmesi, 10/10 %100');
  ok(r.akis === 11 && r.cip, 'tüm borular akıyor (11), çip hazır');
  await p.screenshot({ path: path.join(OUT, 'fabrika-tam.png') });
  await p.context().close();

  /* 4) istasyon 10 kapalı: 9 bölüm, 3/9 -> %33 */
  p = await ac(1440, 900);
  await p.evaluate(function(){
    Q.settings.set('istasyon10', false);
    ['s01', 's02', 's03'].forEach(function(id){ Q.state.ilerleme[id] = { tamam: true, enSon: 9 }; });
    Q.settings.openMap();
  });
  r = await p.evaluate(function(){ return { n: document.querySelectorAll('.fb-node').length, b: document.querySelector('.fb-ozet').textContent }; });
  ok(r.n === 9 && /3\/9 bölüm onarıldı/.test(r.b) && /%33/.test(r.b), '9 bölüm: ' + r.b);
  await p.screenshot({ path: path.join(OUT, 'fabrika-3-9.png') });
  await p.context().close();

  /* 5) dar ekran: şema kaydırılabilir, sayfa taşmaz */
  p = await ac(700, 800);
  r = await p.evaluate(function(){ var s = document.querySelector('.fb-sema'); var b = document.querySelector('.a8-back > .panel');
    return { kay: s.scrollWidth > s.clientWidth, ov: getComputedStyle(s).overflowX, sx: document.documentElement.scrollWidth - innerWidth, bx: b.scrollWidth - b.clientWidth }; });
  ok(r.kay && r.ov === 'auto' && r.sx <= 0, 'dar ekranda şema kaydırılabilir, sayfa taşmaz ' + JSON.stringify(r));
  await p.screenshot({ path: path.join(OUT, 'fabrika-dar.png') });
  await p.context().close();

  /* 6) tam ekran yerleşim: üst çubuk düğmeleri, 3 çözünürlük */
  var boy = [[1366, 768], [1440, 900], [1920, 1080]];
  for (var bi = 0; bi < boy.length; bi++) {
    p = await ac(boy[bi][0], boy[bi][1]);
    r = await p.evaluate(function(){
      var ids = ['fm-ana', 'fm-kartlar', 'a8-hata', 'a10-tekrar', 'fm-ayarlar', 'a7-final'];
      var b = document.querySelector('.a8-back > .panel'), sm = document.querySelector('.fb-sema');
      return { ids: ids.filter(function(i){ return !document.getElementById(i); }), sx: document.documentElement.scrollWidth - innerWidth, sy: document.documentElement.scrollHeight - innerHeight,
        bx: b.scrollWidth - b.clientWidth, sema: sm.scrollWidth - sm.clientWidth, govde: !!document.querySelector('.fm-govde .a8-yan'), eski: document.querySelectorAll('.a8-istasyonlar').length };
    });
    ok(r.ids.length === 0 && r.govde && r.eski === 0, boy[bi].join('x') + ' üst çubuk düğmeleri tam, eski karo yok ' + r.ids);
    ok(r.sx <= 0 && r.sy <= 0 && r.bx <= 0 && r.sema <= 0, boy[bi].join('x') + ' taşma yok ' + JSON.stringify(r));
    await p.keyboard.press('Escape');
    await p.context().close();
  }

  await br.close();
  if (kaldi) { process.stdout.write(kaldi + ' KALDI\n'); process.exit(1); }
  process.stdout.write('TÜMÜ GEÇTİ\n');
})().catch(function(e){ console.error(e); process.exit(1); });
