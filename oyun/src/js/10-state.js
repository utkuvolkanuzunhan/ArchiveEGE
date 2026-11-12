/* 10-state.js (A1) Q.state varsayılanları ve Q.save (localStorage, anahtar "cip-hatti-v1").
 * Eklediği alanlar: Q.state.*, Q.save.load/write/flush/reset/exportText/importText, Q.save.defaults.
 * Bağımlılık: 00-q.js. Her localStorage erişimi try/catch içindedir; yoksa bellekte çalışır. */
(function(){
  'use strict';
  var KEY = 'cip-hatti-v1';
  var timer = null, uyarildi = false;

  function defaults(){
    return {
      v: 1,
      ilerleme: {},
      hataDefteri: [],
      kartlar: [],
      fabrika: { kurulu: [] },
      voltaj: 100,
      aktif: { stationId: null, index: 0 },
      sure: { toplamSn: 0, oturumBaslangic: 0 },
      ayarlar: {
        kilitleriAc: false, hikayeAtla: false, sadecePatron: false, hiz: 1.0,
        ses: false, istasyon10: true, claudeBackend: 'auto',
        modelAdi: 'claude-sonnet-5-5', efor: 'medium'
      }
    };
  }
  function isObj(x){ return !!x && typeof x === 'object' && !Array.isArray(x); }

  /* Q.state nesnesini yerinde günceller (başkaları referans tutabilir). */
  function assign(src){
    var d = defaults(), s = Q.state;
    Object.keys(s).forEach(function(k){ delete s[k]; });
    s.v = 1;
    s.ilerleme = isObj(src.ilerleme) ? src.ilerleme : d.ilerleme;
    s.hataDefteri = Array.isArray(src.hataDefteri) ? src.hataDefteri.filter(isObj) : d.hataDefteri;
    s.kartlar = Array.isArray(src.kartlar) ? src.kartlar.filter(function(x){ return x !== null && x !== undefined; }) : d.kartlar;
    s.fabrika = { kurulu: (isObj(src.fabrika) && Array.isArray(src.fabrika.kurulu)) ? src.fabrika.kurulu : [] };
    s.voltaj = (typeof src.voltaj === 'number' && isFinite(src.voltaj)) ? Math.min(100, Math.max(0, src.voltaj)) : 100;
    var a = isObj(src.aktif) ? src.aktif : {};
    s.aktif = { stationId: typeof a.stationId === 'string' ? a.stationId : null,
                index: (typeof a.index === 'number' && a.index >= 0) ? Math.floor(a.index) : 0 };
    var su = isObj(src.sure) ? src.sure : {};
    s.sure = { toplamSn: (typeof su.toplamSn === 'number' && su.toplamSn >= 0) ? su.toplamSn : 0,
               oturumBaslangic: typeof su.oturumBaslangic === 'number' ? su.oturumBaslangic : 0 };
    s.ayarlar = d.ayarlar;
    if (isObj(src.ayarlar)) {
      Object.keys(d.ayarlar).forEach(function(k){
        if (typeof src.ayarlar[k] === typeof d.ayarlar[k]) s.ayarlar[k] = src.ayarlar[k];
      });
      Object.keys(src.ayarlar).forEach(function(k){ if (!(k in d.ayarlar)) s.ayarlar[k] = src.ayarlar[k]; });
    }
    if (typeof s.ayarlar.hiz !== 'number' || !isFinite(s.ayarlar.hiz) || s.ayarlar.hiz < 0.25 || s.ayarlar.hiz > 3) s.ayarlar.hiz = 1.0;
    if (isObj(s.ilerleme)) {
      Object.keys(s.ilerleme).forEach(function(id){
        var e = s.ilerleme[id];
        if (!isObj(e)) { delete s.ilerleme[id]; return; }
        if ('tamam' in e && typeof e.tamam !== 'boolean') e.tamam = !!e.tamam && e.tamam !== 'x' && e.tamam !== 'false';
      });
    }
    /* bilinmeyen üst düzey alanlar (başka modüllerin eklediği) kayıpsız taşınır */
    Object.keys(src).forEach(function(k){ if (!(k in d)) s[k] = src[k]; });
  }
  function valid(o){
    /* eski sürüm kayıtları da kabul: eksik alanlar assign() içinde varsayılanla doldurulur */
    return isObj(o) && (o.v === undefined || (typeof o.v === 'number' && o.v >= 1)) && isObj(o.ilerleme) &&
      (o.hataDefteri === undefined || Array.isArray(o.hataDefteri)) &&
      (o.kartlar === undefined || Array.isArray(o.kartlar)) &&
      (o.fabrika === undefined || isObj(o.fabrika));
  }
  function store(){
    try { return (typeof localStorage !== 'undefined') ? localStorage : null; } catch (e) { return null; }
  }

  Q.state = Q.state || {};
  Q.save.defaults = defaults;
  assign(defaults());

  Q.save.load = function(){
    var parsed = null, raw = null;
    try {
      var ls = store();
      raw = ls ? ls.getItem(KEY) : null;
      if (raw) parsed = JSON.parse(raw);
    } catch (e) { parsed = null; }
    if (raw && !valid(parsed)) {
      /* bozuk kayıt: üzerine yazılmadan önce yedeğini sakla */
      try { var ls2 = store(); if (ls2) ls2.setItem(KEY + '-bozuk', String(raw)); } catch (e) { /* yer yok */ }
    }
    assign(valid(parsed) ? parsed : defaults());
    return Q.state;
  };
  Q.save.flush = function(){
    if (timer) { clearTimeout(timer); timer = null; }
    try {
      var ls = store();
      if (ls) ls.setItem(KEY, JSON.stringify(Q.state));
      uyarildi = false;
    } catch (e) {
      /* kayıt yoksa bellekte devam; kullanıcıya bir kez haber ver */
      if (!uyarildi) {
        uyarildi = true;
        try { if (Q.ui && Q.ui.toast) Q.ui.toast('İlerleme kaydedilemedi (tarayıcı belleği dolu veya kapalı). Ayarlar\'dan "İlerlemeyi kopyala" ile yedekle.', { tur: 'kotu', ms: 6000 }); } catch (e2) { /* arayüz yok */ }
      }
    }
    Q.bus.emit('save:done', {});
  };
  Q.save.write = function(){
    if (timer) clearTimeout(timer);
    timer = setTimeout(Q.save.flush, 400);
  };
  Q.save.reset = function(){
    assign(defaults());
    try { var ls = store(); if (ls) ls.removeItem(KEY); } catch (e) { /* yok say */ }
    Q.save.flush();
  };
  Q.save.exportText = function(){ return JSON.stringify(Q.state); };
  Q.save.importText = function(str){
    try {
      var o = JSON.parse(String(str).trim());
      if (!valid(o)) return false;
      assign(o);
      Q.save.flush();
      return true;
    } catch (e) { return false; }
  };
  /* sayfa kapanırken/yenilenirken bekleyen kayıt kaybolmasın */
  try {
    if (typeof window !== 'undefined') {
      window.addEventListener('pagehide', function(){ if (timer) Q.save.flush(); });
      window.addEventListener('beforeunload', function(){ if (timer) Q.save.flush(); });
    }
  } catch (e) { /* yok say */ }
})();
