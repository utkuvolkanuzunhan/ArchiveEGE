/* 80-obs-tuzak.js (H2) `tuzak` engel işleyicisi: yanlış iddia 3 parçada, hatalı
 * parçayı bul, eminlik, düzeltme + Devam. Hasarı uygulamaz (runner uygular).
 * Ekler: Q.obs.register('tuzak'). Bağımlılık: 00-q.js, Q.ui (confidence, toast),
 * Q.battle.tamirModu (isteğe bağlı), ctx.runway. */
(function(){
  'use strict';
  var Q = window.Q;

  function mk(tag, cls, text){
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function safe(fn){ try { return fn(); } catch (e) { return undefined; } }
  function waitContinue(host){
    return new Promise(function(res){
      var b = mk('button', 'btn primary', 'Devam');
      b.type = 'button';
      var done = false;
      function fin(){
        if (done) return; done = true;
        document.removeEventListener('keydown', onKey);
        res();
      }
      function onKey(e){ if (e.key === 'Enter') { e.preventDefault(); fin(); } }
      b.addEventListener('click', fin);
      document.addEventListener('keydown', onKey);
      host.appendChild(b);
      try { b.focus(); } catch (e) {}
    });
  }

  Q.obs.register('tuzak', {
    tip: 'tuzak',
    async enter(ob, ctx){
      try {
        var host = ctx.host, runway = ctx.runway || {};
        var parcalar = ob.parcalar || [];
        if (runway.setObstacleState) safe(function(){ runway.setObstacleState('aktif'); });
        if (runway.say) safe(function(){ runway.say('anlatici', ob.iddia); });

        if (ob.iddia) host.appendChild(mk('div', 'dusman-soru', ob.iddia));
        host.appendChild(mk('div', 'tuzak-talimat', 'Hatalı parçaya dokun.'));
        var cumle = mk('div', 'tuzak-cumle');
        cumle.setAttribute('role', 'group');
        host.appendChild(cumle);

        var btns = [];
        var secim = await new Promise(function(res){
          var kilit = false;
          function onKey(e){
            var n = parseInt(e.key, 10);
            if (n >= 1 && n <= btns.length) btns[n - 1].click();
          }
          parcalar.forEach(function(p, i){
            var b = mk('button', 'opt tuzak-parca', p);
            b.type = 'button';
            b.setAttribute('aria-pressed', 'false');
            b.addEventListener('click', function(){
              if (kilit) return; kilit = true;
              b.setAttribute('aria-pressed', 'true');
              btns.forEach(function(x){ x.disabled = true; });
              document.removeEventListener('keydown', onKey);
              res(i);
            });
            btns.push(b);
            cumle.appendChild(b);
          });
          document.addEventListener('keydown', onKey);
          if (btns[0]) { try { btns[0].focus(); } catch (e) {} }
        });

        var tamir = !!(Q.battle && Q.battle.tamirModu && safe(function(){ return Q.battle.tamirModu(ctx.stationId); }));
        if (tamir) host.appendChild(mk('div', 'tamir-ipucu', ob.ipucu || 'Soruyu yeniden oku'));

        var confHost = mk('div', 'tuzak-emin');
        host.appendChild(confHost);
        var em = await ctx.ui.confidence.ask({ host: confHost });
        confHost.style.display = 'none';
        var dogru = (secim === ob.yanlisParca);

        if (btns[ob.yanlisParca]) btns[ob.yanlisParca].classList.add('vurgu', 'dogru');
        if (!dogru && btns[secim]) btns[secim].classList.add('yanlis');
        if (dogru) {
          if (runway.anim) safe(function(){ runway.anim('tuzak-boz'); });
          host.appendChild(mk('div', 'aciklama iyi', 'Doğru. Düzeltilmiş hali: ' + ob.duzeltme));
        } else {
          if (runway.anim) safe(function(){ runway.anim('sendele'); });
          host.appendChild(mk('div', 'aciklama kotu',
            'Yanlış. Seçtiğin parça hatalı değil. Hatalı olan vurgulanan parça. Doğrusu: ' + ob.duzeltme));
        }
        await waitContinue(host);
        return { dogru: dogru, eminlik: em, kavram: ob.kavram || null,
                 agirlik: ob.agirlik || 1, notlar: 'tuzak' };
      } catch (err) {
        safe(function(){ Q.ui.toast('Bir şeyler ters gitti, devam ediyoruz', { tur: 'kotu' }); });
        return { dogru: false, eminlik: 1, kavram: null, agirlik: (ob && ob.agirlik) || 1, notlar: 'hata' };
      }
    }
  });
})();
