/* 60-battle.js (A3) Savas mantigi: hasar tablosu, voltaj, kisa devre + temel tur,
 * hata defteri, aralikli tekrar secimi, patron HP yardimcilari. Cizim yok.
 * Ekledigi alanlar: Q.battle.* (03 §7). Bagimlilik: 00-q.js, 10-state.js; Q.ui ve Q.sim istege bagli. */
(function(){
  'use strict';
  var Q = window.Q, B = Q.battle;
  var AGIR = { 'emin-yanlis': 4, 'yanlis': 3, 'bilinmeyen': 2, 'sans': 1 };
  var BOSS_HP = 120, FAZ_HP = 40;

  /* [verilen, alinan, sarj], eminlik 0,1,2 */
  var TABLO = {
    dogru:  [[12, 0, 0], [25, 0, 0], [50, 0, 8]],
    kismen: [[8, 3, 0], [15, 10, 0], [20, 20, 0]],
    yanlis: [[0, 6, 0], [0, 20, 0], [0, 40, 0]]
  };

  function clamp(x, a, b){ return Math.min(b, Math.max(a, x)); }
  function hasUI(k){ return !!(Q.ui && Q.ui[k]); }

  B.damageTable = function(dogru, eminlik, agirlik){
    var e = (eminlik === 0 || eminlik === 1 || eminlik === 2) ? eminlik : 1;
    var w = (typeof agirlik === 'number' && agirlik > 0) ? agirlik : 1;
    var satir = TABLO[dogru === true ? 'dogru' : (dogru === 'kismen' ? 'kismen' : 'yanlis')][e];
    return {
      verilen: Math.round(satir[0] * w),
      alinan: Math.round(satir[1] * w),
      sarj: satir[2],
      kritik: dogru === true && e === 2
    };
  };

  function stationId(){ return Q.state.aktif && Q.state.aktif.stationId; }

  B.tamirModu = function(id){
    var p = Q.state.ilerleme && Q.state.ilerleme[id];
    return !!(p && p.kisaDevre >= 3);
  };

  function setVoltaj(v){
    var eski = Q.state.voltaj;
    var yeni = clamp(Math.round(v), 0, 100);
    Q.state.voltaj = yeni;
    Q.bus.emit('voltaj:change', { deger: yeni, fark: yeni - eski });
    if (hasUI('hud') && Q.ui.hud.setVoltaj) Q.ui.hud.setVoltaj(yeni);
  }

  function normDogru(s){
    var d = s.dogru;
    if (d === true || d === false || d === 'kismen') return d;
    if (typeof s.dogruluk === 'number') return s.dogruluk >= 70 ? true : (s.dogruluk >= 40 ? 'kismen' : false);
    return false;
  }

  function kavramOzeti(kavram, stId){
    var st = Q.data.stations[stId], i, ob;
    if (!st || !st.engeller) return null;
    for (i = 0; i < st.engeller.length; i++) {
      ob = st.engeller[i];
      if (ob.tip === 'kavram' && ob.kavram === kavram && ob.ogrenilen) return ob.ogrenilen;
    }
    return null;
  }

  function pad2(n){ return (n < 10 ? '0' : '') + n; }

  function hataYaz(s, dogru, e){
    if (!s.kavram) return;
    var defter = Q.state.hataDefteri, i, k = null, tur = null, st = s.istasyon || stationId();
    for (i = 0; i < defter.length; i++) {
      if (defter[i].kavram === s.kavram && !defter[i].cozuldu) { k = defter[i]; break; }
    }
    if (dogru === false) tur = e === 2 ? 'emin-yanlis' : (e === 1 ? 'yanlis' : 'bilinmeyen');
    else if (dogru === true && e === 0) tur = 'sans';
    else if (dogru === 'kismen' && e === 0) tur = 'bilinmeyen';
    /* doğru emin-değil/eminim ve kısmen: yeni kayıt yok */
    if (tur) {
      if (k) {
        if (AGIR[tur] > AGIR[k.tur]) k.tur = tur;
        k.tekrar++;
      } else {
        var n = 0;
        defter.forEach(function(r){ var m = /^hd-(\d+)$/.exec(r.id); if (m) n = Math.max(n, +m[1]); });
        var idx = Q.state.aktif && typeof Q.state.aktif.index === 'number' ? Q.state.aktif.index : 0;
        k = {
          id: 'hd-' + (n + 1), kavram: s.kavram, istasyon: st || null,
          tur: tur, engel: s.engel || (st ? st + '-o' + pad2(idx + 1) : null),
          tarih: Date.now(), tekrar: 0, cozuldu: false
        };
        defter.push(k);
      }
      Q.bus.emit('hata:add', { kayit: k });
    } else if (k) {
      k.tekrar++;
      if (dogru === true && e === 2) k.cozuldu = true;
    }
  }

  B.apply = function(sonuc){
    var s = sonuc || {};
    var dogru = normDogru(s);
    var e = (s.eminlik === 0 || s.eminlik === 1 || s.eminlik === 2) ? s.eminlik : 1;
    var d = B.damageTable(dogru, e, s.agirlik);
    var id = stationId();
    if (id && B.tamirModu(id)) d.alinan = Math.round(d.alinan * 0.5);
    setVoltaj(Q.state.voltaj - d.alinan + d.sarj);
    hataYaz(s, dogru, e);
    if (dogru === false && e === 0 && s.kavram && hasUI('toast')) {
      var oz = kavramOzeti(s.kavram, s.istasyon || id);
      if (oz) Q.ui.toast(oz, { tur: 'bilgi', ms: 6000 });
    }
    if (Q.save.write) Q.save.write();
    return d;
  };

  B.reset = function(voltaj){
    setVoltaj(voltaj === undefined ? 100 : voltaj);
    if (Q.state.aktif) delete Q.state.aktif.bossHp;
  };

  /* ---------- Patron HP ---------- */
  B.bossStart = function(canavarId){
    Q.state.aktif.bossHp = BOSS_HP;
    Q.state.aktif.bossId = canavarId || null;
    Q.bus.emit('boss:hp', { deger: BOSS_HP });
    return BOSS_HP;
  };
  B.bossHit = function(n){
    var a = Q.state.aktif;
    if (typeof a.bossHp !== 'number') a.bossHp = BOSS_HP;
    a.bossHp = clamp(a.bossHp - (n === undefined ? FAZ_HP : n), 0, BOSS_HP);
    Q.bus.emit('boss:hp', { deger: a.bossHp });
    return a.bossHp;
  };
  B.bossHp = function(){
    var h = Q.state.aktif && Q.state.aktif.bossHp;
    return typeof h === 'number' ? h : BOSS_HP;
  };

  /* ---------- Kisa devre ve temel tur ---------- */
  function temelTur(st){
    var tt = st && st.temelTur;
    if (!tt || !hasUI('modal') || typeof document === 'undefined') return Promise.resolve();
    return new Promise(function(resolve){
      var kok = Q.util.el('div', 'temel-tur');
      var kartlar = tt.kartlar || [], i = 0, sim = null, bitti = false;
      function bitir(){
        if (bitti) return;
        bitti = true;
        if (sim && sim.destroy) { try { sim.destroy(); } catch (x) { console.error('temelTur', x); } }
        Q.ui.modal.close();
        resolve();
      }
      function btn(metin, fn){
        var b = Q.util.el('button', 'btn primary');
        b.type = 'button';
        b.textContent = metin;
        b.addEventListener('click', fn);
        return b;
      }
      function kartGoster(){
        kok.textContent = '';
        if (i >= kartlar.length) return simGoster();
        var k = kartlar[i];
        var h = Q.util.el('h3'); h.textContent = k.baslik;
        var p = Q.util.el('p'); p.textContent = k.metin;
        var sayac = Q.util.el('div', 'chip'); sayac.textContent = (i + 1) + ' / ' + kartlar.length;
        kok.appendChild(sayac); kok.appendChild(h); kok.appendChild(p);
        kok.appendChild(btn(i + 1 < kartlar.length ? 'Sonraki' : 'Dene bakalım', function(){ i++; kartGoster(); }));
      }
      function simGoster(){
        kok.textContent = '';
        var host = Q.util.el('div', 'temel-sim');
        var ipucu = Q.util.el('p', 'temel-ipucu');
        kok.appendChild(host); kok.appendChild(ipucu);
        kok.appendChild(btn('Anladım', bitir));
        if (tt.sim && tt.sim.modul) {
          sim = Q.sim.mount(tt.sim.modul, host, tt.sim.params || {}, {
            done: function(){}, hint: function(m){ ipucu.textContent = m; }, onFail: function(){}
          });
        }
      }
      kartGoster();
      Q.ui.modal.open(kok, { baslik: 'Temelden bir daha' });
    });
  }

  B.kisaDevre = function(id){
    id = id || stationId();
    var ilr = Q.state.ilerleme;
    if (!ilr[id]) ilr[id] = { tamam: false, enSon: 0, kontrol: 0, kisaDevre: 0, denendi: true };
    ilr[id].kisaDevre = (ilr[id].kisaDevre || 0) + 1;
    var sayi = ilr[id].kisaDevre;
    Q.bus.emit('kisa-devre', { stationId: id, sayi: sayi });
    if (Q.save.write) Q.save.write();
    if (hasUI('toast')) Q.ui.toast('KISA DEVRE!', { tur: 'kotu', ms: 2200 });
    return temelTur(Q.data.stations[id]).then(function(){
      setVoltaj(70);
      if (sayi >= 3 && hasUI('toast')) Q.ui.toast('Tamir modu açıldı: hasar yarıya indi.', { tur: 'bilgi', ms: 3500 });
      if (Q.save.write) Q.save.write();
    });
  };

  /* ---------- Aralikli tekrar ---------- */
  /* stationIndex: şu anki istasyonun sira değeri (1 tabanlı); yalnızca sira < stationIndex olanlar */
  B.reviewPick = function(stationIndex, n){
    var out = [];
    var adaylar = Q.state.hataDefteri.filter(function(r){
      if (r.cozuldu) return false;
      var st = Q.data.stations[r.istasyon];
      return !!st && st.sira < stationIndex;
    });
    adaylar.sort(function(a, b){
      return (AGIR[b.tur] - AGIR[a.tur]) || (a.tekrar - b.tekrar);
    });
    for (var i = 0; i < adaylar.length && out.length < n; i++) {
      var r = adaylar[i], st = Q.data.stations[r.istasyon];
      var uyan = (st.tekrarHavuzu || []).filter(function(ob){ return ob.tip === 'dusman' && ob.kavram === r.kavram; });
      if (!uyan.length) continue;
      var kopya = {}, src = uyan[r.tekrar % uyan.length];
      Object.keys(src).forEach(function(k){ kopya[k] = src[k]; });
      kopya.tekrarKayitId = r.id;
      out.push(kopya);
    }
    return out;
  };
})();
