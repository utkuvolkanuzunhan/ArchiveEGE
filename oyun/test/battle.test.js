/* A3 birim testleri: node oyun/test/battle.test.js */
'use strict';
var assert = require('assert'), H = require('./harness.js');
var n = 0;
function t(ad, fn){ fn(); n++; }
function yeni(){
  var Q = H.loadCore({ files: ['00-q.js', '10-state.js', '60-battle.js'] }).Q;
  Q.state.aktif = { stationId: 's02', index: 3 };
  return Q;
}
function eq(a, b){ assert.strictEqual(JSON.stringify(a), JSON.stringify(b)); }

t('1 doğru+eminim', function(){
  eq(yeni().battle.damageTable(true, 2, 1), { verilen: 50, alinan: 0, sarj: 8, kritik: true });
});
t('2 yanlış+eminim', function(){
  eq(yeni().battle.damageTable(false, 2, 1), { verilen: 0, alinan: 40, sarj: 0, kritik: false });
});
t('3 yanlış hasarları', function(){
  var B = yeni().battle;
  assert.strictEqual(B.damageTable(false, 0, 1).alinan, 6);
  assert.strictEqual(B.damageTable(false, 1, 1.5).alinan, 30);
});
t('4 kısmen', function(){
  var d = yeni().battle.damageTable('kismen', 1, 2);
  assert.strictEqual(d.verilen, 30);
  assert.strictEqual(d.alinan, 20);
});
t('5 voltaj sınırları', function(){
  var Q = yeni(), olaylar = [];
  Q.bus.on('voltaj:change', function(p){ olaylar.push(p); });
  Q.battle.apply({ dogru: false, eminlik: 2 });
  assert.strictEqual(Q.state.voltaj, 60);
  eq(olaylar[0], { deger: 60, fark: -40 });
  Q.battle.apply({ dogru: false, eminlik: 2 });
  Q.battle.apply({ dogru: false, eminlik: 2 });
  assert.strictEqual(Q.state.voltaj, 0);
  Q.battle.reset(95);
  Q.battle.apply({ dogru: true, eminlik: 2 });
  assert.strictEqual(Q.state.voltaj, 100);
});
t('6 hata defteri birleşir ve ağırlaşır', function(){
  var Q = yeni();
  Q.battle.apply({ dogru: false, eminlik: 0, kavram: 'k1' });
  Q.battle.apply({ dogru: false, eminlik: 2, kavram: 'k1' });
  assert.strictEqual(Q.state.hataDefteri.length, 1);
  assert.strictEqual(Q.state.hataDefteri[0].tur, 'emin-yanlis');
  assert.strictEqual(Q.state.hataDefteri[0].tekrar, 1);
  Q.battle.apply({ dogru: true, eminlik: 2, kavram: 'k1' });
  assert.strictEqual(Q.state.hataDefteri[0].cozuldu, true);
  assert.strictEqual(Q.state.hataDefteri.length, 1);
});
t('7 reviewPick', function(){
  var Q = yeni();
  assert.strictEqual(Q.battle.reviewPick(5, 3).length, 0);
  function st(sira, kavramlar){
    Q.data.stations['s0' + sira] = { id: 's0' + sira, sira: sira, engeller: [],
      tekrarHavuzu: kavramlar.map(function(k){ return { tip: 'dusman', kavram: k, id: 'x-' + k }; }) };
  }
  st(1, ['a', 'b']); st(2, ['c']); st(5, ['z']);
  function kayit(id, ist, kavram, tur, tekrar){
    Q.state.hataDefteri.push({ id: id, kavram: kavram, istasyon: ist, tur: tur, engel: 'e', tarih: 0, tekrar: tekrar, cozuldu: false });
  }
  kayit('h1', 's01', 'a', 'sans', 0);
  kayit('h2', 's02', 'c', 'emin-yanlis', 2);
  kayit('h3', 's01', 'b', 'yanlis', 0);
  kayit('h4', 's05', 'z', 'emin-yanlis', 0);
  var r = Q.battle.reviewPick(5, 3);
  eq(r.map(function(o){ return o.tekrarKayitId; }), ['h2', 'h3', 'h1']);
  assert.strictEqual(Q.battle.reviewPick(5, 2).length, 2);
});
process.stdout.write('battle.test.js: ' + n + ' test gecti\n');
