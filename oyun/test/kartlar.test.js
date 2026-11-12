#!/usr/bin/env node
/* kartlar.test.js — Kart koleksiyonu ve detay paneli. Önce: bash oyun/build.sh --zorunlu-degil
 * Kullanım: node oyun/test/kartlar.test.js  (Playwright; ekran görüntüleri oyun/test/ekran/kart-*.png) */
'use strict';
var fs = require('fs'), path = require('path');
var pw = require('playwright');
var DIST = path.join(__dirname, '..', 'dist', 'oyun.html');
var EKRAN = path.join(__dirname, 'ekran');
var fails = 0;
function ok(c, m){ if (!c) { fails++; console.log('FAIL: ' + m); } else console.log('ok: ' + m); }

(async function(){
  fs.mkdirSync(EKRAN, { recursive: true });
  var br = await pw.chromium.launch();
  for (var vp of [[1366, 768], [1440, 900], [700, 800]]) {
    var w = vp[0], h = vp[1], tag = w + 'x' + h;
    var page = await br.newPage({ viewport: { width: w, height: h } }), errs = [];
    page.on('pageerror', function(e){ errs.push(String(e)); });
    await page.route(/fonts\.(googleapis|gstatic)\.com/, function(r){ r.abort(); });
    await page.goto('file://' + DIST);
    await page.waitForTimeout(700);
    await page.evaluate(function(){ Q.state.kartlar = ['czoch', 'miller']; Q.state.ilerleme.s01 = { tamam: true }; Q.settings.openMap(); });
    var n = await page.evaluate(function(){ return document.querySelectorAll('.kk-kart').length; });
    ok(n === 23, tag + ': 10 sandık + 13 bonus = 23 kart listelendi: ' + n);
    ok(await page.evaluate(function(){ return document.querySelectorAll('.kk-kart[data-kilitli="0"]').length === 2; }), tag + ': 2 kazanılmış, kalanı kilitli');
    ok(await page.evaluate(function(){ var k = document.querySelector('.kk-kart[data-kart="czoch"]'); return /Czochralski/.test(k.textContent) && /1916/.test(k.textContent) && !!k.querySelector('svg'); }), tag + ': kazanılan kartta ad, yıl, çizim');
    ok(await page.evaluate(function(){ var k = document.querySelector('.kk-kart[data-kart="bohr"]'); return /istasyonunu bitir/.test(k.textContent) && /\?\?\?/.test(k.textContent); }), tag + ': kilitli kartta ipucu');
    ok(await page.evaluate(function(){ return document.querySelector('.kk-grup[data-ist="s01"] .kk-ilerleme').textContent === '1/1 kart'; }), tag + ': grup ilerlemesi');
    await page.screenshot({ path: path.join(EKRAN, 'kart-koleksiyon-' + tag + '.png') });
    await page.click('.kk-kart[data-kart="miller"]');
    var d = await page.evaluate(function(){
      var y = document.getElementById('a8-yan'), r = y.getBoundingClientRect(), p = document.querySelectorAll('#a8-kart-panel .kd > p, #a8-kart-panel .kd h4');
      return { acik: y.dataset.acik, h4: document.querySelectorAll('#a8-kart-panel .kd h4').length, li: document.querySelectorAll('#a8-kart-panel .kd-sinav li').length,
        sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, sag: r.right, alt: r.bottom, vw: innerWidth, vh: innerHeight,
        tasma: y.scrollWidth > y.clientWidth + 1, ad: document.querySelector('#a8-kart-panel .kd-ad').textContent };
    });
    ok(d.acik === '1' && /Miller/.test(d.ad), tag + ': tıklayınca panelde Miller açıldı');
    ok(d.h4 === 3 && d.li >= 2 && d.li <= 3, tag + ': p1 + p2 + sınav kutusu, gereksiz p3 yok (h4=' + d.h4 + ', madde=' + d.li + ')');
    ok(d.sw <= d.cw && d.sag <= d.vw && d.alt <= d.vh + 1 && !d.tasma, tag + ': taşma yok ' + JSON.stringify([d.sw, d.cw, d.sag, d.alt, d.vh]));
    await page.screenshot({ path: path.join(EKRAN, 'kart-detay-' + tag + '.png') });
    await page.evaluate(function(){ document.getElementById('a8-yan').scrollTop = 99999; });
    ok(await page.evaluate(function(){ var y = document.getElementById('a8-yan'); return y.scrollHeight <= y.clientHeight || y.scrollTop > 0; }), tag + ': uzun metinde panel kaydırılır');
    await page.keyboard.press('Escape');
    ok(await page.evaluate(function(){ return document.getElementById('a8-yan').dataset.acik === '0' && !!document.querySelector('.kk-kart') && document.getElementById('a8-layer').children.length > 0; }), tag + ': Esc paneli kapattı, harita ekranda');
    await page.click('.kk-kart[data-kart="bohr"]');
    ok(await page.evaluate(function(){ var k = document.querySelector('#a8-kart-panel .kd'); return k.dataset.kilitli === '1' && /Gizli bilim insanı/.test(k.textContent) && !/Niels/.test(k.textContent); }), tag + ': kilitli kart panelinde içerik sızmaz');
    await page.screenshot({ path: path.join(EKRAN, 'kart-kilitli-' + tag + '.png') });
    await page.click('#a8-yan-kapat');
    ok(await page.evaluate(function(){ return document.getElementById('a8-yan').dataset.acik === '0'; }), tag + ': Kapat düğmesi çalışır');

    /* ---- bonus kartlar: istasyon bitince otomatik; kilitliyken ipucu; kayda yazılmaz ---- */
    await page.evaluate(function(){
      Q.state.kartlar = ['czoch', 'miller', 'einstein']; Q.state.ilerleme.s01 = { tamam: true }; Q.state.ilerleme.s02 = { tamam: true };
      Q.state.ilerleme.s03 = { tamam: false }; Q.settings.closeMap(); Q.settings.openMap();
    });
    var bd = await page.evaluate(function(){
      function g(id){ return document.querySelector('.kk-kart[data-kart="' + id + '"]'); }
      return {
        ilr2: document.querySelector('.kk-grup[data-ist="s02"] .kk-ilerleme').textContent,
        ilr3: document.querySelector('.kk-grup[data-ist="s03"] .kk-ilerleme').textContent,
        ilr1: document.querySelector('.kk-grup[data-ist="s01"] .kk-ilerleme').textContent,
        brAcik: g('bravais').dataset.kilitli === '0' && /Bravais/.test(g('bravais').textContent) && g('bragg').dataset.kilitli === '0',
        plKilit: g('planck').dataset.kilitli === '1' && /istasyonunu bitir/.test(g('planck').textContent) && !/Planck/.test(g('planck').textContent),
        bonusIsaret: g('bravais').dataset.bonus === '1' && g('miller').dataset.bonus === '0',
        kayit: Q.state.kartlar.join(',')
      };
    });
    ok(bd.ilr2 === '3/3 kart' && bd.ilr3 === '1/3 kart' && bd.ilr1 === '1/1 kart', tag + ': grup ilerlemesi x/y: ' + [bd.ilr1, bd.ilr2, bd.ilr3]);
    ok(bd.brAcik, tag + ': s02 bitince Bravais ve Bragg bonus kartları açıldı');
    ok(bd.plKilit, tag + ': s03 bitmeden Planck kilitli, ipucu var, ad sızmaz');
    ok(bd.bonusIsaret && bd.kayit === 'czoch,miller,einstein', tag + ': bonus işareti var, bonus kart kayda yazılmadı');
    await page.click('.kk-kart[data-kart="bragg"]');
    var bp = await page.evaluate(function(){
      var y = document.getElementById('a8-yan'), r = y.getBoundingClientRect();
      return { ad: document.querySelector('#a8-kart-panel .kd-ad').textContent, bonus: /Bonus kart/.test(document.getElementById('a8-kart-panel').textContent),
        li: document.querySelectorAll('#a8-kart-panel .kd-sinav li').length, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, alt: r.bottom, vh: innerHeight };
    });
    ok(/Bragg/.test(bp.ad) && bp.bonus && bp.li >= 2, tag + ': bonus kart detayı açıldı (Bonus kart rozeti, sınav maddeleri)');
    ok(bp.sw <= bp.cw && bp.alt <= bp.vh + 1, tag + ': bonus detayı taşmıyor');
    await page.keyboard.press('Escape');
    await page.click('.kk-kart[data-kart="planck"]');
    ok(await page.evaluate(function(){ var k = document.querySelector('#a8-kart-panel .kd'); return k.dataset.kilitli === '1' && !/Max Planck/.test(k.textContent) && /istasyonunu bitir/.test(k.textContent); }), tag + ': kilitli bonus panelinde içerik sızmaz, ipucu görünür');
    await page.keyboard.press('Escape');
    var sg = await page.evaluate(function(){
      var m = document.getElementById('a8-layer'); var g = document.querySelectorAll('.kk-grup'); var tasan = 0;
      g.forEach(function(x){ var r = x.getBoundingClientRect(); if (r.right > innerWidth + 1) tasan++; });
      var sc = m.scrollHeight > m.clientHeight; var k = document.querySelector('.kk-kart[data-kart="bloch"]');
      return { tasan: tasan, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
    });
    ok(sg.tasan === 0 && sg.sw <= sg.cw, tag + ': 23 kartlık koleksiyon yatay taşmıyor');
    await page.screenshot({ path: path.join(EKRAN, 'kart-bonus-' + tag + '.png') });
    /* eski kayıt uyumu: s09 tamamlanmış, bonus kartlar kayıtta yok -> sonradan görünür */
    await page.evaluate(function(){ Q.state.ilerleme.s09 = { tamam: true }; Q.settings.closeMap(); Q.settings.openMap(); });
    ok(await page.evaluate(function(){ return document.querySelector('.kk-kart[data-kart="kronig"]').dataset.kilitli === '0' && document.querySelector('.kk-kart[data-kart="bloch"]').dataset.kilitli === '0'; }), tag + ': eski kayıtta tamamlanmış istasyonun bonus kartları kendiliğinden açık');
    await page.evaluate(function(){ Q.state.kartlar = ['czoch', 'miller']; Q.state.ilerleme.s01 = { tamam: true }; Q.state.ilerleme.s02 = {}; Q.state.ilerleme.s03 = {}; Q.state.ilerleme.s09 = {}; Q.settings.closeMap(); Q.settings.openMap(); });
    await page.focus('.kk-kart[data-kart="czoch"]');
    await page.keyboard.press('ArrowRight');
    ok(await page.evaluate(function(){ return document.activeElement.dataset.kart === 'miller'; }), tag + ': ok tuşu sonraki karta geçer');
    await page.keyboard.press('Enter');
    ok(await page.evaluate(function(){ return /Miller/.test(document.querySelector('#a8-kart-panel .kd-ad').textContent); }), tag + ': Enter ile detay açılır');
    ok(await page.evaluate(function(){ return JSON.parse(localStorage.getItem('cip-hatti-v1') || '{"kartlar":[]}').kartlar.length >= 0; }), tag + ': kayıt anahtarı cip-hatti-v1 okunur');
    ok(errs.length === 0, tag + ': sayfa hatası yok ' + errs.join('|'));
    if (w === 1366) {
      /* Tekrar Merkezi kartlar sekmesi aynı detay görünümünü kullanır */
      await page.keyboard.press('Escape');
      await page.evaluate(function(){ Q.tekrar.open(); });
      await page.waitForTimeout(300);
      await page.evaluate(function(){ var b = Array.prototype.filter.call(document.querySelectorAll('button'), function(x){ return /Açıklama kartları/.test(x.textContent); })[0]; if (b) b.click(); });
      await page.waitForTimeout(200);
      ok(await page.evaluate(function(){ var s = Array.prototype.filter.call(document.querySelectorAll('select'), function(x){ return x.getAttribute('aria-label') === 'İstasyon'; })[0]; if (!s) return false; s.value = 's02'; s.dispatchEvent(new Event('change')); return !!document.querySelector('.kd[data-kart="miller"] .kd-sinav'); }), 'Tekrar Merkezi kart sekmesi detay görünümünü kullanır');
      await page.screenshot({ path: path.join(EKRAN, 'kart-tekrar-' + tag + '.png') });
    }
    await page.close();
  }
  await br.close();
  console.log(fails ? fails + ' başarısız' : 'tüm kart testleri geçti');
  process.exit(fails ? 1 : 0);
})();
