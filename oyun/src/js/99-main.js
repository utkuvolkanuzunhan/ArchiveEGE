/* 99-main.js (A9) — başlatma ve istasyon akışı.
 * Ekler: Q.main {init, hosGeldin, startStation, dogrulaIstasyon, tumTamam}.
 * Akış: save.load -> claude.available (arka plan) -> hoş geldin -> harita -> runner.start -> harita.
 * Q.runner.start sarılır: veri doğrulama + süre sayacı + bitişte haritayı yeniden açma burada olur.
 * Bağımlı: 00-q, 10-state, 20-settings, 30-claude, 50-ui, 95-runner (hepsi çalışma anında çağrılır). */
(function () {
  'use strict';

  var SIRA = ['hikaye', 'kavram', 'dusman', 'dusman', 'tahmin', 'tuzak', 'kopru', 'patron', 'hesap', 'sandik'];
  var TOPLAM = 9;
  var finalBasladi = false;
  var timerId = null;
  var sarildi = false;

  function ids() {
    var a = [];
    for (var i = 1; i <= TOPLAM; i++) a.push('s' + (i < 10 ? '0' : '') + i);
    return a;
  }

  function tumTamam() {
    var il = (Q.state && Q.state.ilerleme) || {};
    return ids().every(function (id) { return il[id] && il[id].tamam; });
  }

  // Hafif çalışma-anı doğrulama; tam doğrulama test/veri-dogrula.js içinde. Hata varsa liste döner.
  function dogrulaIstasyon(st) {
    var hata = [];
    if (!st) return ['istasyon verisi yok'];
    var eng = st.engeller || [];
    if (eng.length !== SIRA.length) hata.push('engel sayısı ' + eng.length + ' (beklenen ' + SIRA.length + ')');
    eng.forEach(function (e, i) {
      if (SIRA[i] && e.tip !== SIRA[i]) hata.push('engel ' + (i + 1) + ' tipi ' + e.tip + ' (beklenen ' + SIRA[i] + ')');
      if (e.tip === 'hesap' && !(Q.hesap && Q.hesap.gorev && Q.hesap.gorev(e.hesapGorev))) hata.push('engel ' + (i + 1) + ' hesapGorev yok: ' + e.hesapGorev);
      if ((e.tip === 'dusman' || e.tip === 'tahmin') && (!e.secenekler || e.secenekler.length !== 3 ||
        e.secenekler.filter(function (s) { return s.dogru; }).length !== 1)) hata.push('engel ' + (i + 1) + ' seçenekleri');
    });
    return hata;
  }

  function butonlar(liste) {
    var kap = Q.util.el('div', 'btnrow');
    kap.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:14px';
    liste.forEach(function (b) {
      var d = Q.util.el('button', 'btn' + (b.birincil ? ' primary' : ''));
      d.type = 'button';
      d.textContent = b.ad;
      d.addEventListener('click', b.fn);
      kap.appendChild(d);
    });
    return kap;
  }

  function haritaAc() {
    try { Q.ui.modal.close(); } catch (e) { /* modal yok */ }
    if (Q.settings && Q.settings.openMap) Q.settings.openMap();
  }

  function hosGeldin() {
    var devamVar = Object.keys((Q.state && Q.state.ilerleme) || {}).length > 0;
    var kutu = Q.util.el('div', 'hosgeldin');
    kutu.style.textAlign = 'center';
    var h = Q.util.el('h2');
    h.textContent = 'Çip Hattı';
    h.style.margin = '0 0 8px';
    var p = Q.util.el('p');
    p.textContent = 'Kumdan çipe: istasyonları sırayla geç. Engele varınca soru ya da görev açılır; cevapla, ilerle.';
    kutu.appendChild(h);
    kutu.appendChild(p);
    kutu.appendChild(butonlar([
      { ad: devamVar ? 'Devam' : 'Başla', birincil: true, fn: haritaAc },
      { ad: 'Ayarlar', fn: function () { if (Q.settings && Q.settings.open) Q.settings.open(); } }
    ]));
    if (Q.ui && Q.ui.modal) Q.ui.modal.open(kutu, { baslik: '' });
    else haritaAc();
  }

  Q.hosGeldin = hosGeldin;

  function sayaci() {
    if (!Q.state.sure) Q.state.sure = { toplamSn: 0, oturumBaslangic: 0 };
    Q.state.sure.oturumBaslangic = Date.now();
    var sonKayit = 0;
    function tik() {
      if (document.hidden) return;
      Q.state.sure.toplamSn++;
      try { if (Q.ui && Q.ui.hud && Q.ui.hud.setTimer) Q.ui.hud.setTimer(Q.state.sure.toplamSn); } catch (e) { /* hud yok */ }
      if (++sonKayit >= 15) { sonKayit = 0; if (Q.save && Q.save.write) Q.save.write(); }
    }
    function dur() { if (timerId) { clearInterval(timerId); timerId = null; } }
    function basla() { if (!timerId) timerId = setInterval(tik, 1000); }
    document.addEventListener('visibilitychange', function () { if (document.hidden) dur(); else basla(); });
    if (!document.hidden) basla();
  }

  function final() {
    if (Q.final && typeof Q.final.start === 'function') return Q.final.start();
    if (Q.ui && Q.ui.toast) Q.ui.toast('Final yakında: Sınav Günü hazırlanıyor.', { tur: 'bilgi', ms: 4000 });
    return Promise.resolve();
  }

  function sarRunner() {
    if (sarildi || !Q.runner || typeof Q.runner.start !== 'function') return;
    sarildi = true;
    var orijinal = Q.runner.start;
    Q.runner.start = function (stationId, fromIndex) {
      if (stationId === 'final') return orijinal.call(Q.runner, stationId, fromIndex || 0);  // Q.final kendi akışını yönetir
      var st = Q.data && Q.data.stations && Q.data.stations[stationId];
      var hata = dogrulaIstasyon(st);
      if (hata.length) {
        console.error('Veri doğrulama (' + stationId + '): ' + hata.join('; '));
        if (Q.ui && Q.ui.toast) Q.ui.toast('Bu istasyonun verisinde sorun var; yine de deniyoruz.', { tur: 'kotu', ms: 3500 });
      }
      try { if (Q.ui && Q.ui.modal) Q.ui.modal.close(); } catch (e) { /* modal yok */ }
      try { if (Q.settings && Q.settings.closeMap) Q.settings.closeMap(); } catch (e) { /* harita yok */ }
      var p;
      try { p = Promise.resolve(orijinal.call(Q.runner, stationId, fromIndex || 0)); }
      catch (e) { console.error(e); p = Promise.resolve('cikis'); }
      return p.then(function (sonuc) {
        if (sonuc === 'tamam' && tumTamam() && !finalBasladi) {
          finalBasladi = true;
          return Promise.resolve(final()).then(function () { haritaAc(); return sonuc; });
        }
        /* aynı anda yeni bir koşu başlamışsa (eskisi iptal edilmişti) haritayı üstüne açma */
        if (!(Q.runner.info && Q.runner.info().aktif)) haritaAc();
        return sonuc;
      }, function (e) { console.error(e); if (!(Q.runner.info && Q.runner.info().aktif)) haritaAc(); return 'cikis'; });
    };
  }

  function startStation(stationId, fromIndex) {
    return Q.runner.start(stationId, fromIndex || 0);
  }

  function init() {
    if (Q.save && Q.save.load) Q.save.load();
    sarRunner();
    if (Q.claude && Q.claude.available) {
      Q.claude.available().then(function () { /* claude:status olayını A6 yayar */ },
        function () { /* claude yok: oyun yedekle çalışır */ });
    }
    Q.bus.on('claude:status', function () {
      try { if (Q.settings && Q.settings.refreshClaudeStatus) Q.settings.refreshClaudeStatus(); } catch (e) { /* ayar kapalı */ }
    });
    sayaci();
    hosGeldin();
  }

  Q.main = { init: init, hosGeldin: hosGeldin, startStation: startStation, dogrulaIstasyon: dogrulaIstasyon, tumTamam: tumTamam };

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  }
})();
