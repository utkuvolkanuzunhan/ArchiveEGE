/* A1 birim testleri: node oyun/test/core.test.js */
'use strict';
var assert = require('assert'), H = require('./harness.js');
var n = 0;
function t(ad, fn){ fn(); n++; }

t('bus on/off/emit + hata izolasyonu', function(){
  var Q = H.loadCore().Q, got = [];
  var off = Q.bus.on('x', function(p){ got.push(p); });
  Q.bus.on('x', function(){ throw new Error('boom'); });
  Q.bus.on('x', function(p){ got.push(p * 2); });
  var oe = console.error; console.error = function(){};
  Q.bus.emit('x', 2); console.error = oe;
  assert.strictEqual(JSON.stringify(got), JSON.stringify([2, 4]));
  off();
  console.error = function(){}; Q.bus.emit('x', 5); console.error = oe;
  assert.strictEqual(JSON.stringify(got), JSON.stringify([2, 4, 10]));
});
t('util', function(){
  var U = H.loadCore().Q.util;
  assert.strictEqual(U.fmtDur(3725), '1s 02dk');
  assert.strictEqual(U.fmtDur(0), '0s 00dk');
  assert.strictEqual(U.clamp(5, 0, 3), 3);
  var r1 = U.rng(7), r2 = U.rng(7);
  for (var i = 0; i < 5; i++) assert.strictEqual(r1(), r2());
  var a = [1,2,3,4,5,6,7,8], s = U.shuffle(a, U.rng(3));
  assert.strictEqual(JSON.stringify(s.slice().sort()), JSON.stringify(a));
  assert.strictEqual(JSON.stringify(a), JSON.stringify([1,2,3,4,5,6,7,8]));
  assert.strictEqual(JSON.stringify(U.shuffle(a, U.rng(3))), JSON.stringify(s));
});
t('sim.mount kayıtsız modül ve kayıtlı modül', function(){
  var Q = H.loadCore().Q, host = {};
  var r = Q.sim.mount('yok', host, {}, {});
  assert.strictEqual(host.textContent, 'Simülasyon yüklenemedi');
  r.destroy(); assert.strictEqual(JSON.stringify(r.getState()), JSON.stringify({}));
  var called = null;
  Q.sim.register('a', { mount: function(h, p){ called = p; return { destroy: function(){} }; } });
  Q.sim.mount('a', host, { k: 1 }, {});
  assert.strictEqual(JSON.stringify(called), JSON.stringify({ k: 1 }));
});
t('obs ve data', function(){
  var Q = H.loadCore().Q;
  Q.obs.register('dusman', { tip: 'dusman' });
  assert.strictEqual(Q.obs.handlers.dusman.tip, 'dusman');
  Q.data.addStation({ id: 's01' });
  assert.ok(Q.data.stations.s01);
});
t('save: bozuk içerikte varsayılan', function(){
  var ls = H.memStorage(); ls.setItem('cip-hatti-v1', '{bozuk');
  var Q = H.loadCore({ localStorage: ls }).Q;
  Q.save.load();
  assert.strictEqual(Q.state.voltaj, 100);
  assert.strictEqual(Q.state.ayarlar.modelAdi, 'claude-sonnet-5-5');
  ls.setItem('cip-hatti-v1', JSON.stringify({ v: 1, ilerleme: 5 }));
  Q.save.load();
  assert.strictEqual(JSON.stringify(Q.state.ilerleme), JSON.stringify({}));
});
t('save: localStorage yok veya hata fırlatır', function(){
  [null, 'throw'].forEach(function(m){
    var Q = H.loadCore({ localStorage: m }).Q;
    Q.save.load(); Q.save.flush(); Q.save.reset();
    assert.strictEqual(Q.state.voltaj, 100);
    assert.ok(Q.save.importText(Q.save.exportText()));
  });
});
t('save: yaz/oku, export/import, reset', function(){
  var ls = H.memStorage(), Q = H.loadCore({ localStorage: ls }).Q, done = 0;
  Q.bus.on('save:done', function(){ done++; });
  Q.state.voltaj = 42; Q.state.kartlar.push('einstein'); Q.save.flush();
  assert.strictEqual(done, 1);
  var txt = Q.save.exportText();
  Q.state.voltaj = 1; Q.save.load();
  assert.strictEqual(Q.state.voltaj, 42);
  assert.strictEqual(JSON.stringify(Q.state.kartlar), JSON.stringify(['einstein']));
  assert.strictEqual(Q.save.importText('saçma'), false);
  assert.strictEqual(Q.save.importText('{"v":2}'), false);
  Q.save.reset();
  assert.strictEqual(Q.state.voltaj, 100);
  assert.strictEqual(Q.save.importText(txt), true);
  assert.strictEqual(Q.state.voltaj, 42);
  var ref = Q.state; Q.save.reset();
  assert.strictEqual(Q.state, ref);
});
t('save: import/export kayıpsız ve alan doğrulama', function(){
  var Q = H.loadCore({ localStorage: H.memStorage() }).Q;
  Q.state.ekAlan = { x: 1 }; Q.state.ayarlar.yeniAyar = 'a';
  Q.state.ilerleme.s01 = { tamam: true };
  var a = Q.save.exportText();
  assert.ok(Q.save.importText(a));
  assert.strictEqual(Q.save.exportText(), a);
  var o = JSON.parse(a); o.ayarlar.hiz = 99; o.voltaj = -50; o.ilerleme.s01.tamam = 'x';
  assert.ok(Q.save.importText(JSON.stringify(o)));
  assert.strictEqual(Q.state.ayarlar.hiz, 1); assert.strictEqual(Q.state.voltaj, 0);
  assert.strictEqual(typeof Q.state.ilerleme.s01.tamam, 'boolean');
});
process.stdout.write('core.test: ' + n + ' test geçti\n');
process.exit(0);
