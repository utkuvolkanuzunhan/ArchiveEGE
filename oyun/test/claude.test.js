/* A6 testleri: node oyun/test/claude.test.js */
'use strict';
var assert = require('assert'), H = require('./harness.js');
var FILES = ['00-q.js', '10-state.js', '30-claude.js'];
var n = 0;
async function t(ad, fn){ await fn(); n++; }

var GIRDI = { soru: 'Neden tünelleme olur?', anahtarFikirler: ['a1', 'a2', 'a3', 'a4'],
  yanlisKavramlar: ['y1', 'y2'], idealCevap: 'ideal metin', cevap: 'öğrenci cevabı', eminlik: 1 };
var IYI = { dogruluk: 75, fikirler: [{ fikir: 'a1', 'var': true }], yanlisKavram: null, geriBildirim: ['1','2','3','4'], ipucu: 'ip' };

function withSample(sample){
  var c = H.loadCore({ files: FILES });
  c.win.AbortController = AbortController;
  c.win.claude = { use: function(k){ return Promise.resolve(k === 'sample' ? sample : null); } };
  return c;
}
async function rejects(p){ try { await p; } catch (e) { return e; } assert.fail('reddedilmedi'); }
function errSample(code){ return { json: async function(){ var e = new Error(code); e.code = code; throw e; } }; }

(async function(){
  await t('claude yok -> none', async function(){
    var Q = H.loadCore({ files: FILES }).Q;
    var a = await Q.claude.available();
    assert.strictEqual(a.backend, 'none');
    assert.strictEqual((await rejects(Q.claude.grade(GIRDI))).code, 'yok');
    assert.strictEqual((await Q.claude.test()).ok, false);
  });
  await t('sample başarılı', async function(){
    var args;
    var c = withSample({ json: async function(p, o){ args = o; return IYI; } });
    var p = await c.Q.claude.grade(GIRDI);
    assert.strictEqual(p.dogruluk, 75); assert.strictEqual(p.backend, 'sample');
    assert.strictEqual(p.geriBildirim.length, 3); assert.strictEqual(p.fikirler[0]['var'], true);
    assert.strictEqual(args.cache, false); assert.strictEqual(args.model, 'claude-sonnet-5-5');
    assert.strictEqual(args.effort, 'medium');
  });
  await t('dogruluk kıskaç + eksik fikirler', async function(){
    var c = withSample({ json: async function(){ return { dogruluk: 400, geriBildirim: [] }; } });
    var p = await c.Q.claude.grade(GIRDI);
    assert.strictEqual(p.dogruluk, 100); assert.strictEqual(p.fikirler.length, 4);
    assert.ok(p.fikirler.every(function(f){ return f['var'] === false; }));
  });
  await t('invalid_json -> json', async function(){
    var c = withSample(errSample('invalid_json'));
    assert.strictEqual((await rejects(c.Q.claude.grade(GIRDI))).code, 'json');
    assert.strictEqual((await c.Q.claude.available()).backend, 'sample');
  });
  await t('hata eşleme', async function(){
    var codes = { cancelled: 'iptal', rate_limited: 'sinir', upstream_error: 'gecici', empty_completion: 'gecici', session_expired: 'gecici', prompt_too_large: 'gecici' };
    for (var k in codes) {
      var c = withSample(errSample(k));
      var oe = console.error; console.error = function(){};
      var e = await rejects(c.Q.claude.grade(GIRDI)); console.error = oe;
      assert.strictEqual(e.code, codes[k], k);
    }
  });
  await t('not_granted -> izin_yok ve backend none', async function(){
    var c = withSample(errSample('not_granted'));
    assert.strictEqual((await rejects(c.Q.claude.grade(GIRDI))).code, 'izin_yok');
    assert.strictEqual((await c.Q.claude.available()).backend, 'none');
    assert.strictEqual((await rejects(c.Q.claude.grade(GIRDI))).code, 'yok');
  });
  await t('iptal', async function(){
    var c = withSample({ json: function(p, o){ return new Promise(function(res, rej){
      o.signal.addEventListener('abort', function(){ var e = new Error('c'); e.code = 'cancelled'; rej(e); }); }); } });
    var pr = c.Q.claude.grade(GIRDI);
    await new Promise(function(r){ setTimeout(r, 5); });
    c.Q.claude.cancel();
    assert.strictEqual((await rejects(pr)).code, 'iptal');
  });
  await t('prompt şablonu', async function(){
    var cap;
    var c = withSample({ json: async function(p){ cap = p; return IYI; } });
    await c.Q.claude.grade(GIRDI);
    assert.ok(!/\{\{|\}\}/.test(cap));
    assert.ok(cap.indexOf('"""\nöğrenci cevabı\n"""') >= 0);
    ['1. a1', '2. a2', '3. a3', '4. a4', '- y1', '- y2', 'ideal metin', 'Neden tünelleme olur?'].forEach(function(s){ assert.ok(cap.indexOf(s) >= 0, s); });
    assert.strictEqual((cap.match(/^\d\. a\d$/gm) || []).length, 4);
    var p2 = c.Q.claude.buildPrompt({ cevap: 'x """ y', anahtarFikirler: ['a'], yanlisKavramlar: [] });
    assert.strictEqual((p2.match(/"""/g) || []).length, 2);
  });
  await t('apikey: localStorage yazılmaz, sessionStorage yalnız hatırla', async function(){
    var sets = [], ssets = [];
    var ls = H.memStorage(), oset = ls.setItem; ls.setItem = function(k, v){ sets.push(k); oset.call(ls, k, v); };
    var c = H.loadCore({ files: FILES, localStorage: ls });
    var sm = H.memStorage(); var so = sm.setItem; sm.setItem = function(k, v){ ssets.push(k); so.call(sm, k, v); };
    c.win.sessionStorage = sm;
    var fetched;
    c.win.fetch = async function(u, o){ fetched = { u: u, o: o };
      return { ok: true, status: 200, json: async function(){ return { content: [{ text: '```json\n' + JSON.stringify(IYI) + '\n```' }] }; } }; };
    var a = await c.Q.claude.setApiKey('sk-test', false);
    assert.strictEqual(a.backend, 'apikey');
    var p = await c.Q.claude.grade(GIRDI);
    assert.strictEqual(p.dogruluk, 75); assert.strictEqual(p.backend, 'apikey');
    assert.strictEqual(fetched.o.headers['x-api-key'], 'sk-test');
    assert.strictEqual(JSON.parse(fetched.o.body).max_tokens, 700);
    assert.strictEqual(sets.length, 0); assert.strictEqual(ssets.length, 0);
    await c.Q.claude.setApiKey('sk-test', true);
    assert.strictEqual(ssets.length, 1); assert.strictEqual(sets.length, 0);
    assert.strictEqual(ls.getItem('ch_apikey_oturum'), null);
  });
  await t('apikey ağ hatası -> gecici, backend none', async function(){
    var c = H.loadCore({ files: FILES });
    c.win.fetch = async function(){ throw new TypeError('blocked'); };
    await c.Q.claude.setApiKey('k', false);
    assert.strictEqual((await rejects(c.Q.claude.grade(GIRDI))).code, 'gecici');
    assert.strictEqual((await c.Q.claude.available()).backend, 'none');
  });
  await t('test() sample', async function(){
    var c = withSample({ text: async function(){ return 'tamam'; } });
    assert.strictEqual((await c.Q.claude.test()).ok, true);
  });
  console.log('claude.test.js: ' + n + ' test gecti');
})().catch(function(e){ console.error(e); process.exit(1); });
