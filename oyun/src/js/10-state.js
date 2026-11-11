/* 10-state.js (A1) Q.state varsayılanları ve Q.save (localStorage, anahtar "cip-hatti-v1").
 * Eklediği alanlar: Q.state.*, Q.save.load/write/flush/reset/exportText/importText, Q.save.defaults.
 * Bağımlılık: 00-q.js. Her localStorage erişimi try/catch içindedir; yoksa bellekte çalışır. */
(function(){
  'use strict';
  var KEY = 'cip-hatti-v1';
  var timer = null;

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
        ses: false, istasyon10: false, claudeBackend: 'auto',
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
    s.hataDefteri = Array.isArray(src.hataDefteri) ? src.hataDefteri : d.hataDefteri;
    s.kartlar = Array.isArray(src.kartlar) ? src.kartlar : d.kartlar;
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
    return isObj(o) && typeof o.v === 'number' && o.v >= 1 && isObj(o.ilerleme) && Array.isArray(o.hataDefteri) &&
      Array.isArray(o.kartlar) && isObj(o.fabrika) && Array.isArray(o.fabrika.kurulu);
  }
  function store(){
    try { return (typeof localStorage !== 'undefined') ? localStorage : null; } catch (e) { return null; }
  }

  Q.state = Q.state || {};
  Q.save.defaults = defaults;
  assign(defaults());

  Q.save.load = function(){
    var parsed = null;
    try {
      var ls = store();
      var raw = ls ? ls.getItem(KEY) : null;
      if (raw) parsed = JSON.parse(raw);
    } catch (e) { parsed = null; }
    assign(valid(parsed) ? parsed : defaults());
    return Q.state;
  };
  Q.save.flush = function(){
    if (timer) { clearTimeout(timer); timer = null; }
    try {
      var ls = store();
      if (ls) ls.setItem(KEY, JSON.stringify(Q.state));
    } catch (e) { /* kayıt yoksa bellekte devam */ }
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
      Q.save.write();
      return true;
    } catch (e) { return false; }
  };
})();
