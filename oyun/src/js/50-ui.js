/* 50-ui.js (A4) Arayüz: Q.ui.* (dock, bubble, confidence, options, textbox, thinking, toast, hud, modal, confirm)
 * ve yol katmanı yardımcıları (Q.ui.fx, Q.ui.boss, Q.ui.card). Kullanıcı metni her yerde textContent ile eklenir.
 * Dinler: voltaj:change, boss:hp, claude:status. Bağımlılık: 00-q.js; Q.art.* varsa kullanılır (yoksa sessiz geçer). */
(function(){
  'use strict';
  var Q = window.Q, U = Q.util, ui = Q.ui;
  var $ = U.$;

  function el(tag, cls, text){
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function btn(text, cls, onclick){
    var b = el('button', 'btn' + (cls ? ' ' + cls : ''), text);
    b.type = 'button';
    if (onclick) b.addEventListener('click', onclick);
    return b;
  }
  function hostOf(h){ return h || $('dock'); }
  function typing(ev){
    var t = ev.target && ev.target.tagName;
    return t === 'TEXTAREA' || t === 'INPUT';
  }
  function svgEl(inner, vb){
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', vb || '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = inner; // yalnızca sabit şekil metni
    return s;
  }

  /* ---------- dock ---------- */
  ui.dock = {
    clear: function(){ var d = $('dock'); if (d) d.textContent = ''; ui.thinking.hide(); },
    mount: function(node){
      var d = $('dock'); node = node || el('div', 'dock-host');
      if (d) { d.textContent = ''; d.appendChild(node); }
      return node;
    }
  };

  /* ---------- bubble ---------- */
  var bubbleTimers = [];
  ui.bubble = {
    say: function(o){
      o = o || {};
      var layer = $('bubble-layer'), konum = o.konum || 'anlatici';
      return new Promise(function(res){
        if (!layer) { res(); return; }
        if (konum === 'canavar' && $('boss-panel') && !$('boss-panel').hidden) {
          var bb = $('boss-panel').querySelector('.boss-bubble');
          if (bb) { bb.textContent = o.metin || ''; }
        }
        var b = el('div', 'bubble ' + konum);
        if (o.kim) {
          var AD = { anlatici: 'Anlatıcı', selin: 'Selin', runner: 'Koşucu', kosucu: 'Koşucu',
            vakans: 'Vacancy (Boşluk) Kusuru', safsizlik: 'Impurity (Safsızlık) Kusuru', tane_siniri: 'Grain Boundary (Tane Sınırı) Kusuru',
            dislokasyon: 'Dislocation (Dislokasyon) Kusuru',
            pauli_cift: 'Defect (kusur) Pauli Çifti', bant_bosluk: 'Defect (kusur) Bandgap Aralığı', dusman: 'Kusur Düşmanı' };
          var ch = Q.data && Q.data.chars && Q.data.chars[o.kim];
          b.appendChild(el('span', 'kim', AD[o.kim] || (ch && (ch.kisi || ch.canavar)) || (/^[a-z0-9_]+$/.test(String(o.kim)) ? 'Kusur düşmanı' : o.kim)));
        }
        b.appendChild(el('span', 'metin', o.metin || ''));
        layer.appendChild(b);
        var kelime = String(o.metin || '').split(/\s+/).filter(Boolean).length;
        var ms = o.ms == null ? Math.min(9000, Math.max(2500, 1500 + kelime * 280)) : o.ms;
        /* Baloncuk süre dolunca KAYBOLMAZ: yalnızca tıklanınca, aynı konumdan yeni baloncuk gelince
         * ya da bubble.clear() (engel bitişi) ile kapanır. Süre yalnızca söz (promise) için okuma payıdır. */
        Array.prototype.slice.call(layer.querySelectorAll('.bubble.' + konum)).forEach(function(eski){
          if (eski !== b && eski.parentNode) eski.parentNode.removeChild(eski);
        });
        /* Farklı konumdaki balonlar üst üste binmesin: çakışırsa yeni balon eskinin altına kayar (katman içinde kalır). */
        (function ayir(){
          var cp = b.offsetParent || layer, lr = cp.getBoundingClientRect(), br = b.getBoundingClientRect();
          var digerleri = Array.prototype.slice.call(layer.querySelectorAll('.bubble')).filter(function(x){ return x !== b; });
          var top = br.top - lr.top, h = br.height, kaydi = false;
          digerleri.forEach(function(o){
            var orr = o.getBoundingClientRect();
            var ot = orr.top - lr.top;
            if (br.left < orr.right && br.right > orr.left && top < ot + orr.height + 8 && top + h > ot - 8) { top = ot + orr.height + 16; kaydi = true; }
          });
          if (kaydi) {
            var maks = Math.max(0, lr.height - h - 14);
            b.style.top = Math.min(top, maks) + 'px';
          }
        })();
        var bitti = false;
        function bitir(){ if (bitti) return; bitti = true; res(); }
        b.style.pointerEvents = 'auto'; b.style.cursor = 'pointer'; b.title = 'Kapatmak için tıkla';
        b.addEventListener('click', function(){ if (b.parentNode) b.parentNode.removeChild(b); bitir(); });
        bubbleTimers.push(setTimeout(bitir, ms));
      });
    },
    clear: function(){
      bubbleTimers.splice(0).forEach(clearTimeout);
      var l = $('bubble-layer'); if (l) l.textContent = '';
    }
  };

  /* ---------- confidence ---------- */
  var CONF = [
    { t: 'Bilmiyorum', ip: 'Yanlışsa hasar az' },
    { t: 'Emin değilim', ip: 'Normal' },
    { t: 'Eminim', ip: 'Doğruysa 2× vuruş, yanlışsa 2× hasar' }
  ];
  ui.confidence = {
    ask: function(o){
      var host = hostOf(o && o.host);
      return new Promise(function(res){
        var wrap = el('div', 'conf-wrap');
        wrap.appendChild(el('div', 'ask-label', 'Ne kadar eminsin?'));
        var row = el('div', 'conf'), done = false;
        function finish(i, b){
          if (done) return; done = true;
          document.removeEventListener('keydown', onkey, true);
          b.setAttribute('aria-pressed', 'true');
          setTimeout(function(){ res(i); }, 150);
        }
        var btns = CONF.map(function(c, i){
          var b = el('button', 'cbtn'); b.type = 'button';
          b.appendChild(el('span', null, (i + 1) + ' · ' + c.t));
          b.appendChild(el('small', null, c.ip));
          b.setAttribute('aria-pressed', 'false');
          b.addEventListener('click', function(){ finish(i, b); });
          row.appendChild(b);
          return b;
        });
        function onkey(ev){
          if (!wrap.isConnected) { document.removeEventListener('keydown', onkey, true); return; }  /* engel atlanınca sahipsiz kalan dinleyici */
          if (typing(ev) || ev.ctrlKey || ev.metaKey || ev.altKey) return;
          var k = String(ev.key).toLowerCase(), i = '123'.indexOf(k);
          if (i < 0 || k.length !== 1) i = 'qwe'.indexOf(k);
          if (i < 0 || k.length !== 1) return;
          ev.preventDefault(); finish(i, btns[i]);
        }
        document.addEventListener('keydown', onkey, true);
        wrap.appendChild(row); host.appendChild(wrap);
        try { wrap.scrollIntoView({ block: 'nearest' }); } catch (e) {}  /* dock taşarsa eminlik düğmeleri görünür kalsın */
      });
    }
  };

  /* ---------- options ---------- */
  ui.options = {
    ask: function(o){
      o = o || {};
      var host = hostOf(o.host), list = o.secenekler || [];
      var order = U.shuffle(list.map(function(_, i){ return i; }));
      return new Promise(function(res){
        var wrap = el('div', 'opts'), done = false, btns = [], picked = -1;
        var ok = el('button', 'btn primary opt-onay'); ok.type = 'button'; ok.textContent = 'Onayla'; ok.disabled = true;
        function pick(pos){
          if (done) return; picked = pos;
          btns.forEach(function(x, j){ x.setAttribute('aria-pressed', j === pos ? 'true' : 'false'); x.classList.toggle('sec', j === pos); });
          ok.disabled = false;
        }
        function confirm(){
          if (done || picked < 0) return; done = true;
          document.removeEventListener('keydown', onkey, true);
          ok.disabled = true;
          res(order[picked]);
        }
        order.forEach(function(orig, pos){
          var b = el('button', 'opt'); b.type = 'button';
          b.appendChild(el('span', 'num', String(pos + 1)));
          b.appendChild(el('span', 't', list[orig].t));
          b.setAttribute('aria-pressed', 'false');
          b.dataset.i = String(orig);
          b.addEventListener('click', function(){ pick(pos); });
          wrap.appendChild(b); btns.push(b);
        });
        ok.addEventListener('click', confirm);
        function onkey(ev){
          if (!wrap.isConnected) { document.removeEventListener('keydown', onkey, true); return; }  /* engel atlanınca sahipsiz kalan dinleyici */
          if (typing(ev) || ev.ctrlKey || ev.metaKey || ev.altKey) return;
          if (ev.key === 'Enter') { ev.preventDefault(); confirm(); return; }
          var i = '123456789'.indexOf(ev.key);
          if (ev.key.length !== 1 || i < 0 || i >= btns.length) return;
          ev.preventDefault(); pick(i);
        }
        document.addEventListener('keydown', onkey, true);
        wrap.appendChild(ok);
        host.appendChild(wrap);
      });
    }
  };

  /* ---------- textbox ---------- */
  ui.textbox = {
    ask: function(o){
      o = o || {};
      var host = hostOf(o.host), maks = o.maks || 280, kesme = 400;
      return new Promise(function(res){
        var wrap = el('div', 'tb');
        if (o.soru) wrap.appendChild(el('div', 'tb-soru', o.soru));
        var ta = el('textarea'); ta.maxLength = kesme; ta.rows = 3;
        ta.setAttribute('aria-label', 'Cevabın');
        var row = el('div', 'row'), sayac = el('span', 'sayac', '0/' + maks);
        var bil = btn('Bilmiyorum', '', function(){ res(null); });
        var gon = btn('Gönder', 'primary', function(){ res(ta.value.slice(0, kesme)); });
        ta.addEventListener('input', function(){
          if (ta.value.length > kesme) ta.value = ta.value.slice(0, kesme);
          sayac.textContent = ta.value.length + '/' + maks;
          sayac.style.color = ta.value.length > maks ? 'var(--yellow)' : '';
        });
        var acts = el('div', 'row'); acts.appendChild(bil); acts.appendChild(gon);
        row.appendChild(sayac); row.appendChild(acts);
        wrap.appendChild(ta); wrap.appendChild(row); host.appendChild(wrap);
        try { ta.focus(); } catch (e) {}
      });
    }
  };

  /* ---------- thinking ---------- */
  var thinkNode = null;
  ui.thinking = {
    show: function(host, o){
      ui.thinking.hide();
      var n = el('div', 'thinking');
      var dots = el('span', 'dots'); dots.innerHTML = '<span></span><span></span><span></span>';
      n.appendChild(dots);
      n.appendChild(el('span', null, (o && o.metin) || 'Düşünüyor…'));
      n.appendChild(btn('Dur', '', function(){
        try { if (Q.claude && Q.claude.cancel) Q.claude.cancel(); } catch (e) { console.error(e); }
      }));
      hostOf(host).appendChild(n); thinkNode = n;
      return n;
    },
    hide: function(){
      if (thinkNode && thinkNode.parentNode) thinkNode.parentNode.removeChild(thinkNode);
      thinkNode = null;
    }
  };

  /* ---------- toast ---------- */
  ui.toast = function(metin, o){
    o = o || {};
    var layer = $('toast-layer'); if (!layer) return null;
    var t = el('div', 'toast ' + (o.tur || 'bilgi') + (o.buyuk ? ' buyuk' : ''), metin);
    t.setAttribute('role', 'status');
    layer.appendChild(t);
    setTimeout(function(){ if (t.parentNode) t.parentNode.removeChild(t); }, o.ms || (o.buyuk ? 1800 : 2600));
    return t;
  };

  /* ---------- hud ---------- */
  var NODE_SHAPE = {
    hikaye: '<circle cx="12" cy="12" r="9"/>',
    kavram: '<rect x="4" y="4" width="16" height="16"/>',
    dusman: '<polygon points="12,3 22,21 2,21"/>',
    tahmin: '<polygon points="12,2 22,12 12,22 2,12"/>',
    tuzak: '<polygon points="2,21 6,6 10,21 14,6 18,21 22,8 22,21"/>',
    kopru: '<rect x="1" y="9" width="22" height="6"/>',
    patron: '<polygon points="12,1 15,9 23,9 17,14 19,23 12,18 5,23 7,14 1,9 9,9"/>',
    sandik: '<rect x="3" y="8" width="18" height="12"/><rect x="3" y="4" width="18" height="5"/>'
  };
  var TIP_AD = { hikaye: 'hikaye', kavram: 'kavram', dusman: 'düşman', tahmin: 'tahmin', tuzak: 'tuzak', kopru: 'köprü', patron: 'patron', sandik: 'sandık' };
  ui.hud = {
    setVoltaj: function(n){
      n = U.clamp(Math.round(+n || 0), 0, 100);
      var bar = $('voltaj-bar'), num = $('voltaj-n');
      if (bar) { bar.style.width = n + '%'; bar.classList.toggle('dusuk', n <= 25); }
      if (num) num.textContent = String(n);
    },
    setStation: function(ad, sira, toplam){
      var s = $('hud-station'); if (!s) return;
      s.textContent = 'İstasyon ' + sira + '/' + toplam + ' · ' + ad;
    },
    setPath: function(nodes){
      var ol = $('hud-path'); if (!ol) return;
      ol.textContent = '';
      (nodes || []).forEach(function(n){
        var li = el('li', 'path-node ' + (n.durum || 'bekliyor'));
        li.title = (TIP_AD[n.tip] || n.tip) + ' · ' + (n.durum || 'bekliyor');
        li.appendChild(svgEl(NODE_SHAPE[n.tip] || NODE_SHAPE.kavram));
        ol.appendChild(li);
      });
    },
    setTimer: function(sn){
      var t = $('hud-timer'); if (t) t.textContent = 'Geçen ' + U.fmtDur(sn);
    },
    setClaude: function(backend){
      var c = $('hud-claude'); if (!c) return;
      c.textContent = 'Claude: ' + (backend && backend !== 'none' ? 'açık' : 'kapalı');
    }
  };

  /* ---------- modal / confirm ---------- */
  var modalPrevFocus = null;
  ui.modal = {
    open: function(node, o){
      var layer = $('modal-layer'); if (!layer) return null;
      layer.textContent = '';
      var m = el('div', 'modal'); m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
      if (o && o.baslik) m.appendChild(el('div', 'm-baslik', o.baslik));
      if (node) m.appendChild(node);
      layer.appendChild(m); layer.hidden = false;
      modalPrevFocus = document.activeElement;
      var f = m.querySelector('button,textarea,input'); if (f) { try { f.focus(); } catch (e) {} }
      return m;
    },
    close: function(){
      var layer = $('modal-layer'); if (!layer) return;
      layer.textContent = ''; layer.hidden = true;
      try { if (modalPrevFocus && modalPrevFocus.focus) modalPrevFocus.focus(); } catch (e) {}
      modalPrevFocus = null;
    }
  };
  ui.confirm = function(o){
    o = o || {};
    return new Promise(function(res){
      var body = el('div', 'confirm');
      body.appendChild(el('p', null, o.metin || 'Emin misin?'));
      var alt = el('div', 'm-alt');
      function bitir(v){ ui.modal.close(); res(v); }
      alt.appendChild(btn(o.hayir || 'Vazgeç', '', function(){ bitir(false); }));
      alt.appendChild(btn(o.evet || 'Evet', 'primary', function(){ bitir(true); }));
      body.appendChild(alt);
      ui.modal.open(body, {});
    });
  };

  /* ---------- yol katmanı: hasar, afiş, sarsıntı ---------- */
  var STAR = '<polygon points="65,4 80,36 115,22 98,55 126,70 94,84 104,120 70,104 56,126 44,98 8,104 32,76 6,52 42,48 40,12 62,34"/>';
  ui.fx = {
    /* sayı: gösterilecek metin/sayı; o: {tur:'verilen'|'alinan'|'kritik', x, y (yol içi 0..1 oran)} */
    damage: function(sayi, o){
      o = o || {};
      var layer = $('dmg-layer'); if (!layer) return null;
      var d = el('div', 'dmg ' + (o.tur || 'verilen'));
      d.style.left = ((o.x == null ? 0.5 : o.x) * 100) + '%';
      d.style.top = ((o.y == null ? 0.45 : o.y) * 100) + '%';
      d.appendChild(svgEl(STAR, '0 0 130 130'));
      d.appendChild(el('span', null, String(sayi)));
      layer.appendChild(d);
      setTimeout(function(){ if (d.parentNode) d.parentNode.removeChild(d); }, 1300);
      return d;
    },
    banner: function(metin){
      var b = $('stage-banner'); if (!b) return;
      b.textContent = metin || '';
      b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
    },
    shake: function(hedef){
      var n = hedef === 'canavar' ? document.querySelector('#boss-panel .monwrap') : $('runway');
      if (!n) return;
      var c = hedef === 'canavar' ? 'hit' : 'runway-hit';
      n.classList.remove(c); void n.offsetWidth; n.classList.add(c);
      setTimeout(function(){ n.classList.remove(c); }, 500);
    }
  };

  /* ---------- patron paneli ---------- */
  var bossState = null;
  ui.boss = {
    /* o: {id, ad, kisa, renk, soru} */
    show: function(o){
      o = o || {};
      var p = $('boss-panel'); if (!p) return null;
      p.textContent = '';
      var b = el('div', 'bubble boss-bubble', o.soru || '');
      var w = el('div', 'monwrap');
      try { if (Q.art && Q.art.monster) w.innerHTML = Q.art.monster(o.id, { renk: o.renk, cls: 'idle' }); } catch (e) { console.error(e); }
      var pl = el('div', 'boss-plate');
      pl.appendChild(el('b', null, o.ad || ''));
      pl.appendChild(el('span', null, o.kisa || ''));
      var hp = el('div', 'boss-hp');
      var tr = el('div', 'track'), bar = el('i'); tr.appendChild(bar);
      hp.appendChild(tr); hp.appendChild(el('b', null, '120'));
      p.appendChild(b); p.appendChild(w); p.appendChild(pl); p.appendChild(hp);
      p.hidden = false;
      p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter');
      bossState = { max: o.hpMax || 120 };
      return p;
    },
    hide: function(){
      var p = $('boss-panel'); if (!p) return;
      p.hidden = true; p.textContent = ''; bossState = null;
    },
    say: function(metin){
      var b = document.querySelector('#boss-panel .boss-bubble'); if (b) b.textContent = metin || '';
    },
    mood: function(hal){ /* idle|konus|vuruldu|guldu */
      var m = document.querySelector('#boss-panel .mon'); if (!m) return;
      ['idle', 'konus', 'vuruldu', 'guldu'].forEach(function(c){ m.classList.remove(c); });
      m.classList.add(hal);
      if (hal === 'vuruldu') ui.fx.shake('canavar');
    },
    setHp: function(n){
      var p = $('boss-panel'); if (!p || p.hidden) return;
      var max = bossState ? bossState.max : 120;
      n = U.clamp(Math.round(+n || 0), 0, max);
      var bar = p.querySelector('.boss-hp i'), num = p.querySelector('.boss-hp b');
      if (bar) bar.style.width = (100 * n / max) + '%';
      if (num) num.textContent = String(n);
    }
  };

  /* ---------- bilim insanı kartı ---------- */
  /* o: {id, ad, yil, cumle, kilitli} -> .card düğümü */
  ui.card = function(o){
    o = o || {};
    var c = el('div', 'card' + (o.kilitli ? ' kilitli' : ''));
    var pt = el('div', 'portre');
    if (o.kilitli) pt.textContent = '?';
    else { try { if (Q.art && Q.art.cameo) pt.innerHTML = Q.art.cameo(o.id, {}); } catch (e) { console.error(e); } }
    c.appendChild(pt);
    c.appendChild(el('b', null, o.kilitli ? '???' : (o.ad || '')));
    c.appendChild(el('span', 'yil', o.kilitli ? '' : (o.yil || '')));
    if (!o.kilitli && o.cumle) c.appendChild(el('p', null, o.cumle));
    return c;
  };

  /* ---------- olaylar ---------- */
  Q.bus.on('voltaj:change', function(p){ if (p) ui.hud.setVoltaj(p.deger); });
  Q.bus.on('boss:hp', function(p){ if (p) ui.boss.setHp(p.deger); });
  Q.bus.on('claude:status', function(p){ ui.hud.setClaude(p && p.backend); });
})();
