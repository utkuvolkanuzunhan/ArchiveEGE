/* 85-obs-patron.js (H5) Engel işleyicisi: `patron` (3 fazlı patron savaşı, ikinci şans, Claude puanlama).
 * Ekler: Q.obs.register('patron', ...). Hasarı bu işleyici uygular (Q.battle.apply, her denemede).
 * Bağımlılık: 00-q.js, Q.ui (A4), Q.claude (A6), Q.battle (A3), ctx.runway (A2), Q.art (A5, canavar duygu sınıfları).
 * Seçmeli ve açık fazlar; Claude yoksa yedekSecmeli. Şartname: oyun/09 H5, 03 §4, 04 §6. */
(function(){
  'use strict';
  var HP_FAZ = 40;

  function el(tag, cls, text){
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function btn(text, primary){
    var b = el('button', 'btn' + (primary ? ' primary' : ''), text);
    b.type = 'button';
    return b;
  }
  function sleep(ms){
    return (Q.util && Q.util.sleep) ? Q.util.sleep(ms) : new Promise(function(r){ setTimeout(r, ms); });
  }
  function swallow(p){ try { if (p && p.catch) p.catch(function(){}); } catch (e) {} return p; }

  /* items: [{t, deger, primary, cls}]. enterValue tanımlıysa Enter o değeri seçer. */
  function waitButtons(area, items, enterValue){
    return new Promise(function(resolve){
      var row = el('div', 'p5-row');
      row.style.cssText = 'display:flex;gap:10px;margin-top:10px;flex-wrap:wrap';
      var done = false;
      function fin(v){
        if (done) return;
        done = true;
        document.removeEventListener('keydown', onKey, true);
        if (row.parentNode) row.parentNode.removeChild(row);
        resolve(v);
      }
      function onKey(e){
        if (e.key === 'Enter' && enterValue !== undefined) { e.preventDefault(); e.stopPropagation(); fin(enterValue); }
      }
      items.forEach(function(it){
        var b = btn(it.t, it.primary);
        if (it.cls) b.className += ' ' + it.cls;
        b.addEventListener('click', function(){ fin(it.deger); });
        row.appendChild(b);
      });
      area.appendChild(row);
      document.addEventListener('keydown', onKey, true);
      var first = row.querySelector('button');
      if (first && first.focus) { try { first.focus(); } catch (e) {} }
    });
  }
  function waitContinue(area){
    return waitButtons(area, [{ t: 'Devam', primary: true, deger: true, cls: 'devam' }], true);
  }
  function box(text, tur){
    var b = el('div', 'p5-box ' + tur, text);
    b.style.cssText = 'margin-top:8px;padding:8px 12px;border:2px solid var(' + (tur === 'iyi' ? '--good' : '--bad') +
      ');border-radius:var(--rs)';
    return b;
  }
  function hint(area, text){
    var h = el('div', 'p5-ipucu', text);
    h.style.cssText = 'margin:6px 0;font-size:var(--fs-small);color:var(--muted)';
    area.appendChild(h);
  }

  async function handle(ob, ctx){
    var host = ctx.host, runway = ctx.runway, ui = ctx.ui || Q.ui, claude = ctx.claude || Q.claude, battle = ctx.battle || Q.battle;
    var istasyon = ctx.istasyon || {};
    var tamir = false;
    try { tamir = !!(battle.tamirModu && battle.tamirModu(ctx.stationId)); } catch (e) {}
    var sonEminlik = 1, kisaDevre = false;

    /* ---- yardımcılar ---- */
    function mood(m){
      try {
        var p = document.getElementById('boss-panel');
        var mon = p && (p.querySelector('.mon') || p.querySelector('svg'));
        if (!mon) return;
        ['idle', 'konus', 'vuruldu', 'guldu', 'dusunuyor'].forEach(function(c){ mon.classList.remove(c); });
        mon.classList.add(m);
      } catch (e) {}
    }
    function say(metin){ mood('konus'); swallow(runway.say(ob.canavar, metin)); }
    function newArea(){
      host.textContent = '';
      var a = el('div', 'p5-area');
      host.appendChild(a);
      return a;
    }
    function head(area, i, n, no){
      var h = el('div', 'p5-head');
      h.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:8px';
      h.appendChild(el('span', 'chip', 'Faz ' + (i + 1) + '/' + n));
      if (no === 2) h.appendChild(el('span', 'chip', 'İkinci şans'));
      if (tamir) h.appendChild(el('span', 'chip', 'Tamir modu'));
      area.appendChild(h);
    }
    function kavramOf(faz, ek){ return faz.kavram || ob.kavram || ek || null; }
    function sonucOf(r){
      return { dogru: r.dogru, eminlik: r.eminlik, dogruluk: r.dogruluk == null ? null : r.dogruluk,
               kavram: r.kavram || null, agirlik: 2, notlar: r.notlar || '' };
    }
    /* Sonucu uygula + görsel geri bildirim */
    function uygula(sonuc){
      var t = null;
      try { t = battle.damageTable(sonuc.dogru, sonuc.eminlik, sonuc.agirlik); } catch (e) {}
      try { battle.apply(sonuc); } catch (e) { console.error('patron:apply', e); }
      if (t) {
        if (sonuc.dogru !== false && t.verilen) swallow(runway.damageNumber(t.verilen, t.kritik ? 'kritik' : 'verilen'));
        if (t.alinan) swallow(runway.damageNumber(t.alinan, 'alinan'));
      }
      mood(sonuc.dogru === false ? 'guldu' : 'vuruldu');
      if (Q.state && Q.state.voltaj <= 0) kisaDevre = true;
    }
    function bossHit(){
      try {
        if (battle.bossHit) battle.bossHit(HP_FAZ);
        else if (Q.state && Q.state.aktif) {
          var h = Q.state.aktif.bossHp;
          Q.state.aktif.bossHp = Math.max(0, (h == null ? 120 : h) - HP_FAZ);
          Q.bus.emit('boss:hp', { hp: Q.state.aktif.bossHp });
        }
      } catch (e) { console.error('patron:bossHit', e); }
    }

    /* ---- seçmeli bir soru sunar (eminlik dahil), seçilen/doğru seçeneği döndürür ---- */
    async function secmeliSor(area, secenekler, faz, eminlikSor, eminlikHazir){
      var kutu = el('div', 'p5-opts');
      area.appendChild(kutu);
      if (tamir) hint(area, ob.ipucu || faz.ipucu || 'Soruyu yeniden oku');
      var idx = await ui.options.ask({ host: kutu, secenekler: secenekler.map(function(s){ return { t: s.t }; }), tek: true });
      var em = eminlikSor ? await ui.confidence.ask({ host: area }) : eminlikHazir;
      sonEminlik = em;
      var secilen = secenekler[idx] || {}, dogruSec = null;
      secenekler.forEach(function(s){ if (s.dogru) dogruSec = s; });
      return { dogru: !!secilen.dogru, eminlik: em, dogruluk: null, kavram: kavramOf(faz), agirlik: 2,
               notlar: secilen.neden || '', secilen: secilen, dogruSecenek: dogruSec };
    }
    async function secmeliAciklama(area, r){
      area.textContent = '';
      var neden = (r.secilen && r.secilen.neden) || '';
      if (r.dogru) {
        area.appendChild(box((r.eminlik === 0 ? 'İçgüdün iyi. Gerekçe: ' : 'Doğru. ') + neden, 'iyi'));
      } else {
        area.appendChild(box('Yanlış. ' + ((r.dogruSecenek && r.dogruSecenek.neden) || ''), 'kotu'));
        if (neden) hint(area, 'Seçtiğin: ' + neden);
      }
      await waitContinue(area);
    }

    /* ---- açık uçlu: cevap, eminlik, Claude. {kind:'bos'|'yedek'|'puan'} döndürür ---- */
    async function acikSor(area, soruMetni, faz, no){
      var cevap = '', jsonHata = 0;
      if (faz.pdfSoru && no === 1) {
        var d = el('details', 'p5-pdf');
        d.appendChild(el('summary', null, 'Sınav sorusu'));
        d.appendChild(el('div', null, faz.pdfSoru));
        area.appendChild(d);
      }
      for (;;) {
        var it = el('div', 'p5-iter');
        area.appendChild(it);
        var tb = el('div', 'p5-tb');
        it.appendChild(tb);
        var v = await ui.textbox.ask({ host: tb, soru: 'Cevabını yaz', maks: 280, deger: cevap });
        if (v == null || !String(v).trim() || /^\s*bilmiyorum\s*\.?\s*$/i.test(String(v))) {
          sonEminlik = 0;
          return { kind: 'bos', dogru: false, eminlik: 0, dogruluk: 0,
                   kavram: kavramOf(faz, faz.yanlisKavramIds && faz.yanlisKavramIds[0]) };
        }
        cevap = String(v);
        var em = await ui.confidence.ask({ host: it });
        sonEminlik = em;
        var iptal = false;
        while (!iptal) {
          var av = null;
          try { av = await claude.available(); } catch (e) { av = { backend: 'none' }; }
          if (!av || av.backend === 'none') return { kind: 'yedek', eminlik: em };
          var th = el('div', 'p5-th');
          it.appendChild(th);
          mood('dusunuyor');
          swallow(runway.say(ob.canavar, '…'));
          ui.thinking.show(th, { metin: 'Canavar cevabını okuyor…' });
          var puan = null, hata = null;
          try {
            puan = await claude.grade({ soru: soruMetni, anahtarFikirler: faz.anahtarFikirler || [],
              yanlisKavramlar: faz.yanlisKavramlar || [], idealCevap: faz.idealCevap || '', cevap: cevap, eminlik: em });
          } catch (e) { hata = e || {}; }
          try { ui.thinking.hide(); } catch (e) {}
          if (th.parentNode) th.parentNode.removeChild(th);
          mood('idle');
          if (puan) {
            var dr = +puan.dogruluk || 0, kv = null;
            if (puan.yanlisKavram && faz.yanlisKavramIds && faz.yanlisKavramIds.length) kv = faz.yanlisKavramIds[0];
            return { kind: 'puan', puan: puan, dogru: dr >= 70 ? true : dr >= 40 ? 'kismen' : false,
                     eminlik: em, dogruluk: dr, kavram: kavramOf(faz, kv) };
          }
          var code = hata.code || 'gecici';
          if (code === 'iptal') { iptal = true; break; }          /* cevap kutusuna dön, metin korunur */
          if (code === 'izin_yok' || code === 'yok') {
            try { ui.toast('Claude kapalı, çoktan seçmeliye geçtik', { tur: 'bilgi' }); } catch (e) {}
            return { kind: 'yedek', eminlik: em };
          }
          if (code === 'json' && ++jsonHata >= 2) return { kind: 'yedek', eminlik: em };
          var m = el('div', 'p5-hata', code === 'sinir' ? 'Biraz bekle, Claude yoruldu.' : 'Bağlantı sorunu.');
          it.appendChild(m);
          var sec = await waitButtons(it, [{ t: 'Tekrar dene', primary: true, deger: 'tekrar' }, { t: 'Yedek soruya geç', deger: 'yedek' }]);
          if (m.parentNode) m.parentNode.removeChild(m);
          if (sec === 'yedek') return { kind: 'yedek', eminlik: em };
        }
        if (it.parentNode) it.parentNode.removeChild(it);
      }
    }
    async function puanGoster(area, r){
      area.textContent = '';
      var p = r.puan;
      area.appendChild(el('div', 'p5-puan', 'Doğruluk: %' + r.dogruluk +
        (r.dogru === true ? ' · Tamam' : r.dogru === 'kismen' ? ' · Kısmen' : ' · Olmadı')));
      var ul = el('ul', 'p5-fikirler');
      ul.style.cssText = 'margin:6px 0;padding-left:0;list-style:none';
      (p.fikirler || []).forEach(function(f){
        ul.appendChild(el('li', f.var ? 'iyi' : 'kotu', (f.var ? '✓ ' : '✗ ') + f.fikir));
      });
      area.appendChild(ul);
      (p.geriBildirim || []).forEach(function(g){ area.appendChild(el('div', 'p5-gb', g)); });
      if (p.yanlisKavram) area.appendChild(box(p.yanlisKavram, 'kotu'));
      await waitContinue(area);
    }

    /* ---- bir deneme (no: 1 ya da 2) ---- */
    async function deneme(faz, i, n, no){
      var area = newArea();
      head(area, i, n, no);
      var alt = faz.alt || {}, r;
      if (faz.tip === 'secmeli') {
        say(no === 2 && alt.soru ? alt.soru : faz.soru);
        r = await secmeliSor(area, no === 2 && alt.secenekler ? alt.secenekler : faz.secenekler, faz, true);
        uygula(sonucOf(r));
        await secmeliAciklama(area, r);
        return r;
      }
      var sm = no === 2 && alt.soru ? alt.soru : faz.soru;
      say(sm);
      var a = await acikSor(area, sm, faz, no);
      if (a.kind === 'bos') {
        a.notlar = 'bilmiyorum';
        uygula(sonucOf(a));
        area.textContent = '';
        area.appendChild(box('Yanlış. ' + (faz.idealCevap || ''), 'kotu'));
        await waitContinue(area);
        return a;
      }
      if (a.kind === 'yedek') {
        var y = faz.yedekSecmeli;
        if (!y) { r = { dogru: false, eminlik: a.eminlik, kavram: kavramOf(faz), notlar: 'yedek yok' }; uygula(sonucOf(r)); return r; }
        area.textContent = '';
        head(area, i, n, no);
        say(y.soru);
        hint(area, 'Claude yok, çoktan seçmeli soru:');
        r = await secmeliSor(area, y.secenekler, faz, false, a.eminlik);
        uygula(sonucOf(r));
        await secmeliAciklama(area, r);
        return r;
      }
      a.notlar = (a.puan.geriBildirim && a.puan.geriBildirim[0]) || '';
      uygula(sonucOf(a));
      await puanGoster(area, a);
      return a;
    }

    /* ---- akış ---- */
    try {
      await runway.showBoss(ob.canavar, { ad: ob.canavarAd, renk: istasyon.renk });
      mood('idle');
      await runway.say(ob.canavar, ob.giris);
      if (battle.bossStart) battle.bossStart(ob.canavar);
      var fazlar = ob.fazlar || [];
      for (var i = 0; i < fazlar.length; i++) {
        var r1 = await deneme(fazlar[i], i, fazlar.length, 1);
        if (kisaDevre) break;
        if (r1.dogru === false) {
          await deneme(fazlar[i], i, fazlar.length, 2);
          if (kisaDevre) break;
        }
        bossHit();     /* doğru, kısmen ya da iki deneme de yanlış: HP yine 40 düşer */
        host.textContent = '';
        await sleep(200);
      }
      if (kisaDevre) {
        try { await runway.hideBoss(); } catch (e) {}
        host.textContent = '';
        return { dogru: false, kisaDevre: true, eminlik: sonEminlik, dogruluk: null, kavram: null, agirlik: 2, notlar: 'patron' };
      }
      await runway.anim('zafer');
      await runway.hideBoss();
      host.textContent = '';
      return { dogru: true, eminlik: sonEminlik, dogruluk: null, kavram: null, agirlik: 2, notlar: 'patron' };
    } catch (e) {
      console.error('patron', e);
      try { ui.toast('Patron sahnesinde bir aksilik oldu', { tur: 'kotu' }); } catch (e2) {}
      try { await runway.hideBoss(); } catch (e3) {}
      return { dogru: false, eminlik: 1, kavram: null, agirlik: ob.agirlik || 1, notlar: 'hata' };
    }
  }

  Q.obs.register('patron', {
    tip: 'patron',
    enter: function(ob, ctx){
      return handle(ob, ctx).catch(function(e){
        console.error('patron', e);
        return { dogru: false, eminlik: 1, kavram: null, agirlik: (ob && ob.agirlik) || 1, notlar: 'hata' };
      });
    }
  });
})();
