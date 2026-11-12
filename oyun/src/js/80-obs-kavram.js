/* 80-obs-kavram.js (H3) Engel işleyicisi: "kavram" (kavram kapısı).
 * Dock'ta görev satırı + simülasyon; api.done ile kapı açılır, 45 sn sonra İpucu, 120 sn sonra Geç düğmesi.
 * Ekler: Q.obs.handlers.kavram. Süreler ctx.sureler ({ipucu, gec} ms) veya Q.obs.sureler ile kısaltılabilir.
 * Bağımlılık: 00-q.js (Q.util, Q.sim, Q.obs); çalışma anında Q.ui.toast, ctx.runway (isteğe bağlı). */
(function(){
  'use strict';
  var U = Q.util;

  function safe(fn){ try { return fn(); } catch (e) { console.error('obs-kavram', e); } }
  function run(ctx, name){
    var a = Array.prototype.slice.call(arguments, 2);
    try {
      var r = ctx && ctx.runway && ctx.runway[name] ? ctx.runway[name].apply(ctx.runway, a) : null;
      return Promise.resolve(r).catch(function(){});
    } catch (e) { return Promise.resolve(); }
  }
  function btn(label, primary){
    var b = U.el('button', 'btn' + (primary ? ' primary' : ''));
    b.type = 'button'; b.textContent = label;
    return b;
  }
  /* Devam düğmesi veya Enter; bir kez çözülür, dinleyici kaldırılır */
  function devam(host){
    return new Promise(function(res){
      var b = btn('Devam', true), t0 = Date.now(), bitti = false;
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

  Q.obs.register('kavram', {
    tip: 'kavram',
    async enter(ob, ctx){
      var simObj = null, timers = [];
      function temizle(){
        timers.forEach(function(t){ clearTimeout(t); });
        timers = [];
        if (simObj && typeof simObj.destroy === 'function') safe(function(){ simObj.destroy(); });
        simObj = null;
      }
      try {
        var host = ctx.host;
        host.textContent = '';
        var ay = (ctx.state && ctx.state.ayarlar) || {};
        if (ob.onBilgi && ob.onBilgi.length && Q.onBilgi && !ay.hikayeAtla) {
          await Q.onBilgi.goster(host, ob.onBilgi, { son: 'Göreve geç' });
          host.textContent = '';
        }
        var sure = ctx.sureler || (Q.obs && Q.obs.sureler) || {};
        var tIpucu = sure.ipucu != null ? sure.ipucu : 45000;
        var tGec = sure.gec != null ? sure.gec : 120000;

        var gorev = U.el('p', 'kavram-gorev'); gorev.textContent = ob.gorev || '';
        var simHost = U.el('div', 'kavram-sim');
        var hintLine = U.el('p', 'kavram-ipucu'); hintLine.hidden = true;
        var butonlar = U.el('div', 'kavram-butonlar');
        host.appendChild(gorev); host.appendChild(simHost);
        host.appendChild(hintLine); host.appendChild(butonlar);

        var sonHint = '', acildi = false, kapandi = false, bitir;
        var bitisSozu = new Promise(function(res){ bitir = res; });
        var api = {
          done: function(){ if (acildi || kapandi) return; acildi = true; bitir('done'); },
          hint: function(m){ if (typeof m === 'string' && m) sonHint = m; },
          onFail: function(){}
        };
        var simPrm = {}, simSrc = (ob.sim && ob.sim.params) || {};
        Object.keys(simSrc).forEach(function(k){ simPrm[k] = simSrc[k]; });
        if (ob.sim && ob.sim.basari && simPrm.basari == null) simPrm.basari = ob.sim.basari; /* basari veride sim.basari altinda */
        simObj = Q.sim.mount(ob.sim && ob.sim.modul, simHost, simPrm, api);

        var ipBtn = btn('İpucu'); ipBtn.hidden = true;
        var gecBtn = btn('Geç'); gecBtn.hidden = true;
        butonlar.appendChild(ipBtn); butonlar.appendChild(gecBtn);
        ipBtn.addEventListener('click', function(){
          hintLine.textContent = sonHint || 'Kontrolleri dene, kapı tepki verir.';
          hintLine.hidden = false;
        });
        gecBtn.addEventListener('click', function(){
          if (acildi || kapandi) return;
          kapandi = true; bitir('gec');
        });
        timers.push(setTimeout(function(){ ipBtn.hidden = false; }, tIpucu));
        timers.push(setTimeout(function(){ gecBtn.hidden = false; }, tGec));

        var how = await bitisSozu;
        kapandi = true;
        temizle();
        butonlar.textContent = ''; hintLine.hidden = true;

        var gecti = how === 'gec';
        if (!gecti) await run(ctx, 'anim', 'kapi-ac');
        var ogr = U.el('p', 'kavram-ogrenilen');
        ogr.textContent = (gecti ? 'Geçtin, konu defterde kalır. ' : '') + (ob.ogrenilen || '');
        host.appendChild(ogr);
        await devam(host);

        return { dogru: !gecti, eminlik: gecti ? 0 : 1, kavram: ob.kavram || null,
                 agirlik: ob.agirlik || 1, notlar: gecti ? 'gecildi' : '' };
      } catch (e) {
        console.error('obs-kavram', e);
        temizle();
        safe(function(){ Q.ui.toast('Kapıda bir aksilik oldu.', { tur: 'kotu' }); });
        return { dogru: false, eminlik: 1, kavram: null, agirlik: (ob && ob.agirlik) || 1, notlar: 'hata' };
      }
    }
  });
})();
