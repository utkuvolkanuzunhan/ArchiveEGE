/* 80-obs-dusman.js (H2) `dusman` engel işleyicisi: 1 cümlelik kavram sorusu,
 * 3 seçenek, eminlik, açıklama + Devam. Hasarı uygulamaz (runner uygular).
 * Ekler: Q.obs.register('dusman'). Bağımlılık: 00-q.js, Q.ui (options, confidence, toast),
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

  Q.obs.register('dusman', {
    tip: 'dusman',
    async enter(ob, ctx){
      try {
        var host = ctx.host;
        var runway = ctx.runway || {};
        var secs = ob.secenekler || [];
        if (runway.setObstacleState) safe(function(){ runway.setObstacleState('aktif'); });
        if (ob.tekrarKayitId) {
          var etiket = mk('div', 'chip', 'Hata defterinden geldim');
          etiket.setAttribute('data-etiket', 'tekrar');
          host.appendChild(etiket);
        }
        if (runway.say) safe(function(){ runway.say(ob.kusurSkin || 'dusman', ob.soru); });

        host.appendChild(mk('div', 'dusman-soru', ob.soru));
        var optHost = mk('div', 'dusman-sec');
        host.appendChild(optHost);

        var idx = await ctx.ui.options.ask({
          host: optHost,
          secenekler: secs.map(function(s){ return { t: s.t }; }),
          tek: true
        });
        var sec = secs[idx] || {};
        var tamir = !!(Q.battle && Q.battle.tamirModu && safe(function(){ return Q.battle.tamirModu(ctx.stationId); }));
        if (tamir) host.appendChild(mk('div', 'tamir-ipucu', ob.ipucu || 'Soruyu yeniden oku'));

        var confHost = mk('div', 'dusman-emin');
        host.appendChild(confHost);
        var em = await ctx.ui.confidence.ask({ host: confHost });
        var dogru = !!sec.dogru;

        if (runway.anim) safe(function(){ runway.anim(dogru ? 'saldir' : 'sendele'); });

        var temizNeden = function(s){ return String(s || '').replace(/^((Doğru|Yanlış|Hayır|Evet)\.\s*)+/, ''); };
        var dogruSec = null;
        for (var i = 0; i < secs.length; i++) if (secs[i].dogru) dogruSec = secs[i];
        var metin;
        if (dogru) {
          metin = (em === 0 ? 'İçgüdün iyi. Gerekçe: ' : 'Doğru. ') + temizNeden(sec.neden);
        } else {
          metin = (em === 0 ? 'Bilmiyorum dedin, sorun değil. ' : 'Cevabın yanlış. ') +
            (dogruSec ? 'Doğru seçenek: ' + dogruSec.t + '. ' + temizNeden(dogruSec.neden) : '') +
            (sec.t ? ' Senin seçtiğin: ' + sec.t + (sec.neden ? ' (' + temizNeden(sec.neden) + ')' : '') : '');
        }
        var kutu = mk('div', 'aciklama ' + (dogru ? 'iyi' : 'kotu'), metin);
        kutu.setAttribute('role', 'status');
        host.appendChild(kutu);
        confHost.style.display = 'none';
        Array.prototype.forEach.call(confHost.querySelectorAll('button'), function(b){ b.disabled = true; });
        await waitContinue(host);
        return { dogru: dogru, eminlik: em, kavram: ob.kavram || null,
                 agirlik: ob.agirlik || 1, notlar: sec.neden || '' };
      } catch (err) {
        safe(function(){ Q.ui.toast('Bir şeyler ters gitti, devam ediyoruz', { tur: 'kotu' }); });
        return { dogru: false, eminlik: 1, kavram: null, agirlik: (ob && ob.agirlik) || 1, notlar: 'hata' };
      }
    }
  });
})();
