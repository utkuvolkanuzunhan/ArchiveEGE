/* 80-obs-tahmin.js (H3) Engel işleyicisi: "tahmin" (tahmin çukuru).
 * Akış: soru + 3 seçenek, eminlik, simülasyon önceki -> sonraki (set), atla/dus animasyonu, açıklama, Devam.
 * Ekler: Q.obs.handlers.tahmin. Bekleme ctx.sureler.tahminBekle (ms, varsayılan 1500) ile kısaltılabilir.
 * Bağımlılık: 00-q.js (Q.util, Q.sim, Q.obs); çalışma anında ctx.ui (options, confidence), Q.battle.tamirModu. */
(function(){
  'use strict';
  var U = Q.util;

  function safe(fn){ try { return fn(); } catch (e) { console.error('obs-tahmin', e); } }
  function run(ctx, name){
    var a = Array.prototype.slice.call(arguments, 2);
    try {
      var r = ctx && ctx.runway && ctx.runway[name] ? ctx.runway[name].apply(ctx.runway, a) : null;
      return Promise.resolve(r).catch(function(){});
    } catch (e) { return Promise.resolve(); }
  }
  function devam(host){
    return new Promise(function(res){
      var b = U.el('button', 'btn primary'), t0 = Date.now(), bitti = false;
      b.type = 'button'; b.textContent = 'Devam';
      function bit(){
        if (bitti) return; bitti = true;
        document.removeEventListener('keydown', key, true);
        res();
      }
      function key(e){
        if (e.key === 'Enter' && Date.now() - t0 > 250) { e.preventDefault(); bit(); }
      }
      b.addEventListener('click', bit);
      document.addEventListener('keydown', key, true);
      host.appendChild(b);
      try { b.focus(); } catch (e) {}
    });
  }
  /* sayısal parametreleri yaklaşık 0.9 sn'de ara değerlerle sonrakine taşır; değilse tek set() */
  async function gecis(simObj, onceki, sonraki){
    if (!simObj || typeof simObj.set !== 'function' || !sonraki) return;
    var keys = Object.keys(sonraki);
    var sayisal = keys.length > 0 && keys.every(function(k){
      return typeof sonraki[k] === 'number' && onceki && typeof onceki[k] === 'number';
    });
    if (!sayisal || U.reduceMotion()) { safe(function(){ simObj.set(sonraki); }); return; }
    var adim = 12;
    for (var i = 1; i <= adim; i++) {
      var p = {}, f = i / adim;
      keys.forEach(function(k){ p[k] = onceki[k] + (sonraki[k] - onceki[k]) * f; });
      safe(function(){ simObj.set(p); });
      await U.sleep(75);
    }
  }

  Q.obs.register('tahmin', {
    tip: 'tahmin',
    async enter(ob, ctx){
      var simObj = null;
      try {
        var host = ctx.host;
        host.textContent = '';
        var sure = ctx.sureler || (Q.obs && Q.obs.sureler) || {};
        var bekle = sure.tahminBekle != null ? sure.tahminBekle : 1500;

        var soru = U.el('p', 'tahmin-soru'); soru.textContent = ob.soru || '';
        var opsHost = U.el('div', 'tahmin-secenek');
        var ipucu = U.el('p', 'tahmin-ipucu');
        host.appendChild(soru); host.appendChild(opsHost); host.appendChild(ipucu);
        var tamir = false;
        safe(function(){ tamir = !!Q.battle.tamirModu(ctx.stationId); });
        if (tamir) ipucu.textContent = ob.ipucu || 'Soruyu yeniden oku';

        var ui = ctx.ui || Q.ui;
        var idx = await ui.options.ask({
          host: opsHost, tek: true,
          secenekler: ob.secenekler.map(function(s){ return { t: s.t }; })
        });
        var secili = ob.secenekler[idx];
        var dogru = !!(secili && secili.dogru);
        var dIdx = 0;
        ob.secenekler.forEach(function(s, i){ if (s.dogru) dIdx = i; });

        host.textContent = '';
        host.appendChild(soru);
        var eminHost = U.el('div', 'tahmin-eminlik'); host.appendChild(eminHost);
        var em = await ui.confidence.ask({ host: eminHost });

        host.textContent = '';
        var simHost = U.el('div', 'tahmin-sim');
        var sonucSatiri = U.el('p', 'tahmin-sonuc');
        sonucSatiri.textContent = 'Doğrulayalım...';
        host.appendChild(simHost); host.appendChild(sonucSatiri);
        simObj = Q.sim.mount(ob.sim && ob.sim.modul, simHost, ob.sim && ob.sim.onceki, {
          done: function(){}, hint: function(){}, onFail: function(){}
        });
        await U.sleep(bekle);
        await gecis(simObj, ob.sim && ob.sim.onceki, ob.sim && ob.sim.sonraki);

        sonucSatiri.className = 'tahmin-acik ' + (dogru ? 'dogru' : 'yanlis');
        sonucSatiri.textContent = dogru
          ? 'Doğru tahmin. ' + (ob.acik || '')
          : 'Yanlış. Doğrusu: ' + ob.secenekler[dIdx].t + '. ' + (ob.acik || '');
        await run(ctx, 'anim', dogru ? 'atla' : 'dus');
        await devam(host);

        return { dogru: dogru, eminlik: em, kavram: ob.kavram || null,
                 agirlik: ob.agirlik || 1.5, notlar: ob.acik || '' };
      } catch (e) {
        console.error('obs-tahmin', e);
        safe(function(){ Q.ui.toast('Çukurda bir aksilik oldu.', { tur: 'kotu' }); });
        return { dogru: false, eminlik: 1, kavram: null, agirlik: (ob && ob.agirlik) || 1, notlar: 'hata' };
      } finally {
        if (simObj && typeof simObj.destroy === 'function') safe(function(){ simObj.destroy(); });
      }
    }
  });
})();
