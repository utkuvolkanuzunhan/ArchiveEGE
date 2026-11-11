/* 80-obs-kopru.js (H4) Engel isleyicisi: kirik kopru (mantik zincirini siraya dizme).
 * Ekledigi alan: Q.obs.handlers.kopru (Q.obs.register ile). Karti pointer olaylariyla surukle-birak
 * VEYA dokun-siraya-ekle (klavye dahil); yuvaya dokunmak geri alir. Eminlik sorulmaz.
 * Bagimlilik: 00-q.js, 01 §3.5/§5.1; Q.ui.toast, Q.battle.tamirModu (varsa) kullanilir.
 */
(function(){
  'use strict';
  var Q = window.Q;

  function el(tag, cls, text){
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function shuffle(n){
    var a = [], i, j, t;
    for (i = 0; i < n; i++) a.push(i);
    for (i = n - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
    var same = true;
    for (i = 0; i < n; i++) if (a[i] !== i) same = false;
    if (same && n > 1) { t = a[0]; a[0] = a[1]; a[1] = t; }
    return a;
  }

  function safeAnim(ctx, name){
    try {
      if (ctx && ctx.runway && ctx.runway.anim) return Promise.resolve(ctx.runway.anim(name, {})).catch(function(){});
    } catch (e) {}
    return Promise.resolve();
  }

  function tamir(ctx){
    try { return !!(Q.battle && Q.battle.tamirModu && Q.battle.tamirModu(ctx.stationId)); } catch (e) { return false; }
  }

  function run(ob, ctx){
    return new Promise(function(resolve){
      var host = ctx.host;
      var blocks = ob.bloklar || [];
      var n = blocks.length;
      var slots = [];            // yuva i -> blok indeksi | null
      var order = shuffle(n);    // havuz sirasi (blok indeksleri)
      var locked = false;
      var lastTapAt = 0;
      var drag = null;
      var devamBtn = null, sonuc = null;
      var i;
      for (i = 0; i < n; i++) slots.push(null);

      var root = el('div', 'kopru');
      root.style.cssText = 'display:flex;flex-direction:column;gap:4px;';
      var head = el('div', 'kopru-soru', ob.soru || 'Zinciri sıraya diz');
      head.style.cssText = 'font-family:var(--font-d);font-size:17px;';
      var poolBox = el('div', 'kopru-havuz');
      poolBox.setAttribute('aria-label', 'Kartlar');
      poolBox.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;';
      var slotBox = el('ol', 'kopru-yuvalar');
      slotBox.style.cssText = 'display:flex;flex-direction:column;gap:4px;margin:0;padding:0;list-style:none;';
      var bar = el('div', 'kopru-bar');
      bar.style.cssText = 'display:flex;gap:10px;align-items:center;flex-wrap:wrap;position:sticky;bottom:0;z-index:2;padding:4px 0;background:var(--panel,var(--bg,#1a1033));';
      var kontrol = el('button', 'btn primary kopru-kontrol', 'Kontrol');
      kontrol.type = 'button';
      kontrol.disabled = true;
      bar.appendChild(kontrol);
      var msg = el('div', 'kopru-mesaj');
      msg.setAttribute('aria-live', 'polite');
      msg.style.cssText = 'display:flex;flex-direction:column;gap:6px;';
      root.appendChild(head);
      root.appendChild(poolBox);
      root.appendChild(slotBox);
      if (tamir(ctx)) {
        var ip = el('div', 'kopru-ipucu', ob.ipucu || 'Soruyu yeniden oku');
        ip.style.cssText = 'color:var(--muted);font-size:var(--fs-small);';
        root.appendChild(ip);
      }
      root.appendChild(bar);
      root.appendChild(msg);
      host.appendChild(root);

      var cardEls = [];  // blok indeksi -> buton
      var slotEls = [];  // yuva indeksi -> buton

      for (i = 0; i < n; i++) {
        var c = el('button', 'opt kopru-kart', blocks[i]);
        c.type = 'button';
        c.setAttribute('data-blok', String(i));
        c.style.touchAction = 'none';
        c.style.cursor = 'grab';
        c.style.userSelect = 'none';
        c.style.minHeight = '30px'; c.style.padding = '2px 12px';
        cardEls[i] = c;
      }

      for (i = 0; i < n; i++) {
        var li = el('li', 'kopru-yuva-sira');
        li.style.cssText = 'display:flex;align-items:stretch;gap:8px;';
        var no = el('b', 'kopru-no', String(i + 1));
        no.style.cssText = 'min-width:28px;display:flex;align-items:center;justify-content:center;font-family:var(--font-d);';
        var s = el('button', 'kopru-yuva');
        s.type = 'button';
        s.setAttribute('data-yuva', String(i));
        s.style.cssText = 'flex:1;min-height:34px;text-align:left;padding:2px;border:2px dashed var(--line);border-radius:var(--rs);background:transparent;color:var(--ink);font:inherit;font-size:var(--fs-body);cursor:pointer;';
        s.setAttribute('aria-label', 'Yuva ' + (i + 1) + ', boş');
        li.appendChild(no);
        li.appendChild(s);
        slotBox.appendChild(li);
        slotEls[i] = s;
      }

      function render(){
        var used = {}, k;
        for (k = 0; k < n; k++) if (slots[k] != null) used[slots[k]] = true;
        while (poolBox.firstChild) poolBox.removeChild(poolBox.firstChild);
        order.forEach(function(b){ if (!used[b]) poolBox.appendChild(cardEls[b]); });
        for (k = 0; k < n; k++) {
          var sl = slotEls[k];
          while (sl.firstChild) sl.removeChild(sl.firstChild);
          if (slots[k] != null) {
            sl.appendChild(cardEls[slots[k]]);
            sl.style.borderStyle = 'solid';
            sl.setAttribute('aria-label', 'Yuva ' + (k + 1) + ': ' + blocks[slots[k]] + ' (geri almak için dokun)');
          } else {
            sl.style.borderStyle = 'dashed';
            sl.setAttribute('aria-label', 'Yuva ' + (k + 1) + ', boş');
          }
        }
        var full = slots.every(function(v){ return v != null; });
        kontrol.disabled = locked || !full;
      }

      function firstEmpty(){
        for (var k = 0; k < n; k++) if (slots[k] == null) return k;
        return -1;
      }
      function slotOf(b){ return slots.indexOf(b); }

      function place(b, target){
        if (locked) return;
        var from = slotOf(b);
        if (from >= 0) slots[from] = null;
        if (target == null || target < 0) target = firstEmpty();
        if (target < 0) { render(); return; }
        var prev = slots[target];
        slots[target] = b;
        if (prev != null && from >= 0) slots[from] = prev; // yer değiştir
        render();
      }
      function unplace(k){
        if (locked || slots[k] == null) return;
        slots[k] = null;
        render();
      }

      /* ---- pointer ile surukle-birak / dokunma ---- */
      function onDown(e){
        if (locked) return;
        var cd = e.target && e.target.closest ? e.target.closest('.kopru-kart') : null;
        if (!cd || !root.contains(cd)) return;
        if (e.button != null && e.button > 0) return;
        drag = { b: +cd.getAttribute('data-blok'), x: e.clientX, y: e.clientY, moved: false, ghost: null, id: e.pointerId, card: cd };
        try { cd.setPointerCapture(e.pointerId); } catch (x) {}
      }
      function onMove(e){
        if (!drag || e.pointerId !== drag.id) return;
        var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (!drag.moved && Math.sqrt(dx * dx + dy * dy) > 6) {
          drag.moved = true;
          var r = drag.card.getBoundingClientRect();
          var g = drag.card.cloneNode(true);
          g.style.cssText += ';position:fixed;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;margin:0;z-index:9999;pointer-events:none;opacity:.92;box-shadow:var(--shadow-sm);';
          g.setAttribute('aria-hidden', 'true');
          document.body.appendChild(g);
          drag.ghost = g; drag.ox = r.left; drag.oy = r.top;
          drag.card.style.opacity = '.35';
        }
        if (drag.moved && drag.ghost) {
          drag.ghost.style.left = (drag.ox + dx) + 'px';
          drag.ghost.style.top = (drag.oy + dy) + 'px';
        }
      }
      function endDrag(e, cancel){
        if (!drag || (e && e.pointerId !== drag.id)) return;
        var d = drag; drag = null;
        try { d.card.releasePointerCapture(d.id); } catch (x) {}
        d.card.style.opacity = '';
        if (d.ghost && d.ghost.parentNode) d.ghost.parentNode.removeChild(d.ghost);
        if (cancel) return;
        lastTapAt = Date.now();
        var cur = slotOf(d.b);
        if (!d.moved) {                // dokun-yerlestir / geri al
          if (cur >= 0) unplace(cur); else place(d.b, -1);
          return;
        }
        var under = document.elementFromPoint(e.clientX, e.clientY);
        var sl = under && under.closest ? under.closest('.kopru-yuva') : null;
        if (sl && slotBox.contains(sl)) place(d.b, +sl.getAttribute('data-yuva'));
        else if (under && poolBox.contains(under) && cur >= 0) unplace(cur);
      }
      function onUp(e){ endDrag(e, false); }
      function onCancel(e){ endDrag(e, true); }

      /* ---- klavye (click detail 0) ve yuva dokunusu ---- */
      function onClick(e){
        if (locked) return;
        var t = e.target;
        var cd = t.closest ? t.closest('.kopru-kart') : null;
        if (cd) {
          if (e.detail === 0) {          // klavye: Enter/Bosluk
            var b = +cd.getAttribute('data-blok');
            var cur = slotOf(b);
            if (cur >= 0) unplace(cur); else place(b, -1);
          }
          return;                        // pointer ile zaten islendi
        }
        var sl = t.closest ? t.closest('.kopru-yuva') : null;
        if (sl && Date.now() - lastTapAt > 40) unplace(+sl.getAttribute('data-yuva'));
      }
      function onKey(e){
        if (e.key === 'Enter' && devamBtn && !e.repeat) {
          e.preventDefault();
          devamBtn.click();
        }
      }
      root.addEventListener('pointerdown', onDown);
      root.addEventListener('pointermove', onMove);
      root.addEventListener('pointerup', onUp);
      root.addEventListener('pointercancel', onCancel);
      root.addEventListener('click', onClick);
      document.addEventListener('keydown', onKey);

      function finish(){
        root.removeEventListener('pointerdown', onDown);
        root.removeEventListener('pointermove', onMove);
        root.removeEventListener('pointerup', onUp);
        root.removeEventListener('pointercancel', onCancel);
        root.removeEventListener('click', onClick);
        document.removeEventListener('keydown', onKey);
        if (drag && drag.ghost && drag.ghost.parentNode) drag.ghost.parentNode.removeChild(drag.ghost);
        resolve(sonuc);
      }

      function showDevam(){
        var b = el('button', 'btn primary kopru-devam', 'Devam');
        b.style.alignSelf = 'flex-start';
        b.type = 'button';
        b.addEventListener('click', function(){
          if (devamBtn !== b) return;
          devamBtn = null;
          b.disabled = true;
          finish();
        });
        devamBtn = b;
        msg.appendChild(b);
        try { b.focus(); } catch (x) {}
      }

      kontrol.addEventListener('click', function(){
        if (locked || kontrol.disabled) return;
        locked = true;
        kontrol.disabled = true;
        var wrong = [], k;
        for (k = 0; k < n; k++) if (slots[k] !== k) wrong.push(k);
        var dogru = wrong.length === 0;
        sonuc = { dogru: dogru, eminlik: 1, kavram: ob.kavram || null, agirlik: ob.agirlik || 1, notlar: ob.sonuc || '' };
        for (k = 0; k < n; k++) { cardEls[k].style.cursor = 'default'; cardEls[k].disabled = true; }
        if (dogru) {
          slotEls.forEach(function(sl){ sl.style.borderColor = 'var(--good)'; });
          var ok = el('div', 'kopru-dogru', ob.sonuc || '');
          ok.style.cssText = 'border:3px solid var(--good);border-radius:var(--rs);padding:8px 12px;';
          msg.appendChild(ok);
          safeAnim(ctx, 'kopru-kur').then(showDevam);
        } else {
          wrong.forEach(function(w){
            var sl = slotEls[w];
            sl.style.borderColor = 'var(--bad)';
            sl.style.borderStyle = 'solid';
            sl.classList.add('kopru-yanlis');
            try { sl.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(-4px)'},{transform:'translateX(0)'}], { duration: 450 }); } catch (x) {}
          });
          var yz = el('div', 'kopru-duzeltme');
          yz.style.cssText = 'border:3px solid var(--good);border-radius:var(--rs);padding:8px 12px;';
          yz.appendChild(el('b', null, 'Yanlış. Doğru sıra:'));
          var ol = el('ol', 'kopru-dogru-sira');
          ol.style.cssText = 'margin:4px 0 0;padding-left:22px;';
          blocks.forEach(function(t){ ol.appendChild(el('li', null, t)); });
          yz.appendChild(ol);
          msg.appendChild(yz);
          if (ob.sonuc) msg.appendChild(el('div', 'kopru-sonuc', ob.sonuc));
          safeAnim(ctx, 'sendele').then(showDevam);
        }
      });

      render();
    });
  }

  Q.obs.register('kopru', {
    tip: 'kopru',
    enter: function(ob, ctx){
      var p;
      try { p = run(ob || {}, ctx); } catch (e) { p = Promise.reject(e); }
      return p.catch(function(){
        try { if (Q.ui && Q.ui.toast) Q.ui.toast('Köprü kurulamadı.', { tur: 'kotu' }); } catch (e) {}
        return { dogru: false, eminlik: 1, kavram: null, agirlik: (ob && ob.agirlik) || 1, notlar: 'hata' };
      });
    }
  });
})();
