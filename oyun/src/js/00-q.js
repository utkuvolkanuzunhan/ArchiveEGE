/* 00-q.js (A1) Cekirdek: global Q nesnesi, Q.bus, Q.util, Q.sim.register/mount,
 * Q.obs.register + Q.obs.handlers, Q.data.addStation.
 * Eklediği alanlar: Q.bus, Q.util, Q.sim, Q.obs, Q.data. Bağımlılık: yok (ilk yüklenir).
 * Node (vm) ve tarayıcıda çalışır. */
(function(){
  'use strict';
  var root = (typeof window !== 'undefined') ? window : globalThis;
  var Q = root.Q = root.Q || {};
  ['bus','util','state','save','settings','claude','art','ui','battle','sim','obs','runner'].forEach(function(k){
    if (!Q[k]) Q[k] = {};
  });
  if (!Q.data) Q.data = {};
  if (!Q.data.stations) Q.data.stations = {};
  if (!Q.data.chars) Q.data.chars = {};

  /* ---------- bus ---------- */
  var subs = {};
  Q.bus.on = function(name, fn){
    (subs[name] = subs[name] || []).push(fn);
    return function(){ Q.bus.off(name, fn); };
  };
  Q.bus.off = function(name, fn){
    var l = subs[name]; if (!l) return;
    var i = l.indexOf(fn); if (i >= 0) l.splice(i, 1);
  };
  Q.bus.emit = function(name, payload){
    var l = subs[name]; if (!l) return;
    l.slice().forEach(function(fn){
      try { fn(payload); } catch (e) { console.error('bus:' + name, e); }
    });
  };

  /* ---------- util ---------- */
  var U = Q.util;
  U.$ = function(id){ return document.getElementById(id); };
  U.el = function(tag, cls, html){
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  U.clamp = function(x, a, b){ return Math.min(b, Math.max(a, x)); };
  U.rng = function(seed){
    var a = (seed >>> 0) || 1;
    return function(){
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  U.shuffle = function(arr, rng){
    var r = rng || Math.random, a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(r() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  U.reduceMotion = function(){
    try {
      return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) { return false; }
  };
  U.sleep = function(ms){
    return new Promise(function(res){ setTimeout(res, U.reduceMotion() ? 0 : ms); });
  };
  U.fmtDur = function(sn){
    sn = Math.max(0, Math.floor(+sn || 0));
    var s = Math.floor(sn / 3600), d = Math.floor((sn % 3600) / 60);
    return s + 's ' + (d < 10 ? '0' : '') + d + 'dk';
  };

  /* ---------- sim ---------- */
  var sims = {};
  Q.sim.register = function(modul, impl){ sims[modul] = impl; };
  Q.sim.has = function(modul){ return !!sims[modul]; };
  Q.sim.mount = function(modul, host, params, api){
    var impl = sims[modul], nop = { destroy: function(){}, getState: function(){ return {}; } };
    if (!impl || typeof impl.mount !== 'function') {
      if (host) host.textContent = 'Simülasyon yüklenemedi';
      return nop;
    }
    return impl.mount(host, params || {}, api || {});
  };

  /* ---------- obs ---------- */
  Q.obs.handlers = Q.obs.handlers || {};
  Q.obs.register = function(tip, handler){ Q.obs.handlers[tip] = handler; };

  /* ---------- data ---------- */
  Q.data.addStation = function(st){
    if (st && st.id) Q.data.stations[st.id] = st;
    return st;
  };
})();
