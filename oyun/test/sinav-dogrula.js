/* A11 sinav verisi doğrulayıcı: node oyun/test/sinav-dogrula.js */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var dir = path.join(__dirname, '..', 'src', 'js');
var files = fs.readdirSync(dir).filter(function(f){ return /^9\d-data-sinav-.*\.js$/.test(f); }).sort();
var ctx = { console: console }; ctx.window = ctx; ctx.Q = { data: {} }; vm.createContext(ctx);
files.forEach(function(f){ vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx, { filename: f }); });
var S = ctx.Q.data.sinav, err = [], ids = {};
function chk(c, m){ if (!c) err.push(m); }
function uniq(id){ chk(id && !ids[id], 'id yok/çakışıyor: ' + id); ids[id] = 1; }
S.mcq.forEach(function(x){
  uniq(x.id); chk(x.station && x.q && x.explanation, x.id + ' eksik alan');
  chk(Array.isArray(x.options) && x.options.length === 4, x.id + ' 4 şık değil');
  chk(Array.isArray(x.options) && new Set(x.options).size === 4, x.id + ' şıklar tekrar');
  chk(Number.isInteger(x.answer) && x.answer >= 0 && x.answer <= 3, x.id + ' answer 0..3 değil');
});
S.klasik.forEach(function(x){
  uniq(x.id); chk(x.station && x.question && x.concept, x.id + ' eksik alan');
  chk(typeof x.modelAnswer === 'string' && x.modelAnswer.length > 40, x.id + ' modelAnswer yok');
  chk(Array.isArray(x.keyPoints) && x.keyPoints.length >= 3 && x.keyPoints.length <= 5, x.id + ' keyPoints 3-5 değil');
});
var by = {};
S.mcq.forEach(function(x){ (by[x.station] = by[x.station] || [0, 0])[0]++; });
S.klasik.forEach(function(x){ (by[x.station] = by[x.station] || [0, 0])[1]++; });
Object.keys(by).forEach(function(s){ chk(by[s][0] >= 8 && by[s][1] >= 3, s + ' yetersiz: ' + by[s]); });
console.log('dosyalar:', files.join(', '), '| mcq', S.mcq.length, 'klasik', S.klasik.length, JSON.stringify(by));
if (err.length) { console.log(err.join('\n')); process.exit(1); }
console.log('sinav-dogrula: OK');
