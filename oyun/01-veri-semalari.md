# 01 · Veri Şemaları, Modül Sözleşmeleri, Dosya Yapısı

> **Paralel çalışmanın anayasası.** Her ajan yalnızca kendi dosyalarını yazar ve burada tanımlı arayüzlere uyar. Bu dosyadaki adları, alan adlarını ve fonksiyon imzalarını **değiştirme**. Eksik bir şey bulursan dosyayı düzenleme: `oyun/SORULAR.md` dosyasına tek satır ekle ve en makul varsayımla devam et.

## 1. Dosya yapısı ve yükleme sırası

Derleme (`oyun/build.sh`) dosyaları **aşağıdaki sırayla** tek HTML içine koyar. Her JS dosyası bir IIFE'dir ve global `Q` nesnesine ekleme yapar.

```
oyun/
  src/
    styles/
      00-tokens.css          (A4)   CSS değişkenleri, yazı tipleri
      10-layout.css          (A4)   ekran düzeni, dock, topbar
      20-components.css      (A4)   düğme, balon, çubuk, kart, modal
      30-runway-overlay.css  (A4)   patron paneli, hasar sayıları
    js/
      00-q.js                (A1)   Q nesnesi, Q.bus, Q.util
      10-state.js            (A1)   Q.state, Q.save (localStorage)
      20-settings.js         (A8)   Q.settings, ayarlar penceresi, harita menüsü
      30-claude.js           (A6)   Q.claude
      40-art-chars.js        (A5a)  Q.art karakter/canavar SVG üretici
      41-art-runner.js       (A5b)  koşucu ve engel sprite çizimleri (canvas)
      42-art-world.js        (A5b)  parallax dünya katmanları (canvas)
      43-art-sound.js        (A5c)  isteğe bağlı ses (M3)
      50-ui.js               (A4)   Q.ui (dock, bubble, confidence, toast, hud)
      60-battle.js           (A3)   Q.battle (hasar, voltaj, hata defteri, geri düşme)
      70-sim-<modul>.js      (S*)   her simülasyon ayrı dosya
      80-obs-<tip>.js        (H*)   her engel türü ayrı dosya
      85-obs-patron.js       (H5)   patron engeli
      90-data-<id>.js        (E*)   her istasyonun verisi (10 dosya)
      95-runner.js           (A2)   Q.runner (koşu motoru, engel akışı)
      96-final.js            (A7)   Q.final (Sınav Günü, M3)
      99-main.js             (A9)   başlatma, menüler, istasyon akışı
    html/
      shell.html             (A4)   sayfa iskeleti (topbar, runway, dock, modal kapları)
  dist/oyun.html             (build çıktısı, commit edilir)
  build.sh                   (A9)
  test/smoke.js              (A9)   Playwright duman testi
```

Kural: bir dosya yalnızca `Q.*` ve kendi yerel değişkenlerini kullanır. **Başka dosyada tanımlı bir fonksiyon, yükleme sırasında henüz yoksa çağrılmaz**; yalnızca çalışma anında (olay/handler içinde) çağrılır.

## 2. Global nesne `Q`

```js
// 00-q.js
window.Q = {
  bus:      {},   // olay yolu
  util:     {},   // küçük yardımcılar
  state:    {},   // oyun durumu
  save:     {},   // kayıt
  settings: {},   // ayarlar
  claude:   {},   // Claude istemcisi
  art:      {},   // çizim
  ui:       {},   // arayüz
  battle:   {},   // hasar/voltaj
  sim:      {},   // simülasyon kaydı
  obs:      {},   // engel işleyicileri kaydı
  data:     { stations: {}, chars: {} },
  runner:   {}    // koşu motoru
};
```

### 2.1 `Q.bus` (A1)
```js
Q.bus.on(name, fn)        // abone ol; kaldırma fonksiyonu döndürür
Q.bus.off(name, fn)
Q.bus.emit(name, payload) // senkron çağırır; handler hatası konsola yazılır, diğerlerini engellemez
```
Olay adları (başka ad **uydurma**):

| Olay | Payload | Kim yayar |
|---|---|---|
| `station:start` | `{stationId, fromIndex}` | runner |
| `station:end` | `{stationId, sonuc:'tamam'\|'cikis'}` | runner |
| `obstacle:enter` | `{stationId, index, ob}` | runner |
| `obstacle:done` | `{stationId, index, ob, result}` | runner |
| `voltaj:change` | `{deger, fark}` | battle |
| `boss:hp` | `{deger}` | patron handler |
| `kisa-devre` | `{stationId, sayi}` | battle |
| `hata:add` | `{kayit}` | battle |
| `settings:change` | `{anahtar, deger}` | settings |
| `claude:status` | `{backend}` | claude |
| `save:done` | `{}` | save |

### 2.2 `Q.util` (A1)
```js
Q.util.$(id)                     // getElementById
Q.util.el(tag, cls, html)        // eleman üretir
Q.util.clamp(x, a, b)
Q.util.shuffle(arr, rng)         // yeni karışık dizi, rng yoksa Math.random
Q.util.rng(seed)                 // tohumlu rastgele: () => 0..1 (mulberry32)
Q.util.sleep(ms)                 // Promise; reduced-motion'da 0
Q.util.reduceMotion()            // boolean
Q.util.fmtDur(sn)                // 3725 -> "1s 02dk"
```

### 2.3 `Q.state` ve `Q.save` (A1)
```js
Q.state = {
  v: 1,
  ilerleme: {              // istasyon başına
    // "s03": { tamam:false, enSon:4, kontrol:0, kisaDevre:1, denendi:true }
  },
  hataDefteri: [],         // HataKaydi[] (bkz. 4)
  kartlar: [],             // kazanılan bilim insanı kart id'leri ("einstein")
  fabrika: { kurulu: [] }, // kurulan istasyon id'leri ("s01","s02")
  voltaj: 100,
  aktif: { stationId:null, index:0 },
  sure: { toplamSn: 0, oturumBaslangic: 0 },
  ayarlar: {               // bkz. 07
    kilitleriAc:false, hikayeAtla:false, sadecePatron:false, hiz:1.0,
    ses:false, istasyon10:false, claudeBackend:'auto', modelAdi:'claude-sonnet-5-5', efor:'medium'
  }
};
Q.save.load()      // localStorage'tan Q.state'e okur, bozuksa varsayılan
Q.save.write()     // 400 ms debounce ile yazar, 'save:done' yayar
Q.save.reset()     // her şeyi sıfırlar (onay UI'da yapılır)
Q.save.exportText()// JSON string (kullanıcı panoya kopyalar)
Q.save.importText(str) // doğrular, state'e koyar, true/false döner
```
Anahtar: `localStorage["cip-hatti-v1"]`. Hepsi `try/catch`.

## 3. Veri şemaları

### 3.1 İstasyon (`Q.data.stations[id]`) — yazan: istasyon ajanları (E*)

Her `90-data-sNN.js` dosyası **tam olarak şunu yapar**:
```js
(function(){
  Q.data.stations.s03 = { ...İstasyon };
  // karakterler için gerekirse:
  // Q.data.chars.planck = { ... }  (bkz. 3.7, yalnızca sahnede konuşan ek karakterler)
})();
```

```js
/** @typedef {Object} Istasyon */
{
  id: "s03",                    // "s01".."s10"
  sira: 3,
  ad: "Işık-test odası",
  makine: "Işık-test odası",    // fabrika makinesi adı (00'daki tablo)
  renk: "#ffd23f",              // istasyon vurgu rengi (hex)
  konu: "Neden kuantum mekaniği?",
  sinavSorulari: ["S3"],
  sureHedefDk: 22,
  patronId: "einstein",         // Q.art karakter id
  kavramlar: ["fotoelektrik_siddet", "..."],   // bu istasyonun tüm kavram id'leri
  engeller: [ Engel, ... ],     // sırası: hikaye,kavram,dusman,dusman,tahmin,tuzak,kopru,patron,sandik
  temelTur: { kartlar:[ {baslik, metin} x3 ], sim: {modul, params} },
  tekrarHavuzu: [ DusmanEngeli, ... ]  // en az 4: hata defteri tekrarı için (tip:"dusman")
}
```

### 3.2 Ortak engel alanları
```js
{
  id: "s03-o05",            // sNN-oMM (MM = 01.. sıra)
  tip: "hikaye"|"kavram"|"dusman"|"tahmin"|"tuzak"|"kopru"|"patron"|"sandik",
  baslik: "Tahmin çukuru",  // en fazla 4 kelime, yolda tabelada görünür
  kavram: "fotoelektrik_siddet",   // hata defteri için (patron/sandık/hikaye'de null olabilir)
  agirlik: 1                // hasar çarpanı: dusman 1, tahmin 1.5, tuzak 1, kopru 1, patron faz 2
}
```

### 3.3 `hikaye`
```js
{ tip:"hikaye", yer:"Berlin", yil:1900,
  satirlar:[ { kim:"selin"|"anlatici"|<karakterId>, metin:"≤20 kelime" }, ...3 satır ],
  rivayet:false }          // true ise arayüz "rivayet" etiketi koyar
```

### 3.4 `kavram`
```js
{ tip:"kavram",
  gorev:"≤12 kelime talimat",
  sim:{ modul:"karacisim", params:{...}, basari:{ ...modüle özgü, bkz 06 } },
  ogrenilen:"≤20 kelimelik tek cümle" }
```

### 3.5 `dusman` / `tahmin` / `tuzak` / `kopru`
```js
// dusman
{ tip:"dusman", soru:"≤22 kelime",
  secenekler:[ {t:"≤10 kelime", dogru:false, neden:"≤18 kelime"}, ... tam 3 adet, tam 1 doğru ],
  kusurSkin:"vakans"|"tane_siniri"|"safsizlik"|"dislokasyon" }

// tahmin
{ tip:"tahmin", soru:"≤22 kelime",
  secenekler:[ ...3 adet, 1 doğru ... ],
  sim:{ modul:"fotoelektrik", onceki:{...params}, sonraki:{...params} },
  acik:"≤25 kelime: simülasyon sonrası açıklama" }

// tuzak
{ tip:"tuzak",
  iddia:"yanlış cümle (tam metin)",
  parcalar:["parça1","parça2","parça3"],   // iddia = parcalar.join(" ")
  yanlisParca:0,                            // hatalı parçanın indeksi
  duzeltme:"doğru cümle ≤25 kelime" }

// kopru
{ tip:"kopru", soru:"≤15 kelime (ör: 'Zinciri sıraya diz')",
  bloklar:["≤8 kelime", ...4 veya 5 adet],  // DOĞRU SIRADA yazılır; oyun karıştırır
  sonuc:"≤25 kelime: tamamlanmış zincir cümlesi" }
```

### 3.6 `patron` ve `sandik`
```js
{ tip:"patron", canavar:"einstein", canavarAd:"Foton Canavarı",
  giris:"≤14 kelime: canavarın girişte söylediği replik",
  fazlar:[
    { tip:"secmeli", soru:"...", secenekler:[ 3 adet, 1 doğru, her birinde neden ], alt:{ soru, secenekler }  },
    { tip:"acik",  ...AcikSoru },
    { tip:"acik",  ...AcikSoru }        // bazı istasyonlarda 2 açık faz, bazılarında 1 açık + 1 tuzak
  ] }

/** AcikSoru */
{ pdfSoru:"orijinal İngilizce sınav cümlesi (varsa), yoksa null",
  soru:"Türkçe soru ≤25 kelime",
  anahtarFikirler:["≤15 kelime", x4],        // Claude puanlaması bunlara göre
  yanlisKavramlar:["≤15 kelime", x2-3],      // bilinen tuzaklar; kavram id'leri
  yanlisKavramIds:["sifir_noktasi_sicaklik"],// aynı sırada
  idealCevap:"≤60 kelime",
  yedekSecmeli:{ soru, secenekler:[4 adet, 1 doğru, her birinde neden] },  // Claude yoksa kullanılır
  alt:{ soru:"aynı konuya farklı sorulmuş ≤25 kelime" }                  // ikinci şans sorusu
}

{ tip:"sandik",
  kart:{ id:"einstein", yil:1905, tekCumle:"≤16 kelime: bu kişi ne buldu" },
  ozet:["≤12 kelime", "≤12 kelime", "≤12 kelime"],   // 3 madde: istasyonun özeti
  kontrolNoktasi:true }
```

### 3.7 Karakter tanımı (`Q.data.chars[id]`, `Q.art.registerChar`) — yazan: A5 (sanat)
```js
{ id:"einstein", kisi:"Albert Einstein", yil:1905, canavar:"Foton Canavarı",
  konu:"Fotoelektrik olay",
  soru:"örnek replik", zayif:"Zayıf noktası: ...",
  hair:"wild"|"slick"|"side"|"sideburn"|"bald"|"curly",
  eyes:2|3, closed:false, mous:"bushy"|"thin"|null, glasses:false,
  rays:false, back:"cube"|"orbits"|"wave"|"ghost"|null,
  front:"bolts"|"crystals"|"ears"|"dice"|"boxes"|"sigmoid"|null,
  chest:"(hkl)"|"ψ"|"ΔxΔp"|null }
```
Karakter listesi (tam 10 canavar + 2 sahne karakteri): `czoch, miller, einstein, bohr, broglie, schro, born, heis, pauli, fermi` ve yalnızca konuşan sahne karakterleri `planck, bloch`. `selin` (vardiya amiri) çizimsiz, sadece konuşma balonunda ad etiketiyle konuşur.

### 3.8 Simülasyon sonucu
```js
// Q.sim modülü başarıyı bildirir
api.done({ basari:true, olcum:{...} })
```

## 4. Hata defteri kaydı (`Q.state.hataDefteri[i]`)
```js
{ id:"hd-173",           // otomatik
  kavram:"sifir_noktasi_sicaklik",
  istasyon:"s05",
  tur:"emin-yanlis"|"yanlis"|"bilinmeyen"|"sans",
  engel:"s05-o06",
  tarih:1731355200000,
  tekrar:0,              // kaç kez tekrar karşısına çıktı
  cozuldu:false }        // tekrarda doğru+emin bilinirse true
```

## 5. Modül sözleşmeleri

### 5.1 Engel işleyicisi `Q.obs.register(tip, handler)` (H*)
```js
Q.obs.register("dusman", {
  tip: "dusman",
  /** @returns {Promise<Sonuc>} engel bitince çözülür; asla reject etmez */
  async enter(ob, ctx) { ... }
});
```
`ctx` (runner üretir):
```js
{
  stationId, index, istasyon,         // veri
  host: HTMLElement,                  // dock içinde bu engelin kendi kabı (boş verilir)
  runway: {                           // yol üzerinde görsel kontrol (A2)
    stop(): Promise,                  // koşucuyu yavaşça durdurur (≈1.2 sn)
    resume(): Promise,                // yeniden koşturur
    anim(isim, opts): Promise,        // 'saldir','atla','dus','sendele','zafer','kapi-ac','kopru-kur','tuzak-boz'
    setObstacleState(durum),          // 'idle'|'intro'|'aktif'|'cozuldu'|'basarisiz'
    showBoss(charId, opts): Promise,  // patron panelini sağdan yavaşça getirir (≈1.7 sn)
    hideBoss(): Promise,
    say(kim, metin, opts): Promise,   // balon (bubble)
    damageNumber(sayi, tur)           // 'verilen'|'alinan'|'kritik'
  },
  ui: Q.ui, claude: Q.claude, sim: Q.sim, battle: Q.battle, art: Q.art, state: Q.state
}
```
`Sonuc`:
```js
{
  dogru: true|false|"kismen",
  eminlik: 0|1|2,            // 0 bilmiyorum, 1 emin değilim, 2 eminim; eminlik sorulmayan engelde 1
  dogruluk: 0..100|null,     // yalnızca Claude puanı varsa
  kavram: "fotoelektrik_siddet"|null,
  agirlik: 1,
  notlar: ""                 // hata defterine yazılacak kısa neden
}
```
Handler `Sonuc` döndürdükten sonra **hasarı runner uygular** (`Q.battle.apply(sonuc)`), handler uygulamaz. Patron handler'ı faz başına kendi `Q.battle.apply` çağırır (bkz. `03`).

### 5.2 Simülasyon `Q.sim.register(modul, impl)` (S*)
```js
Q.sim.register("kuyu", {
  /** host içine kendini çizer ve kontrolleri kurar */
  mount(host, params, api) {
    // api.done(sonuc)      görev tamamlandı
    // api.hint(metin)      ≤15 kelime ipucu satırı
    // api.onFail(fn)       isteğe bağlı
    return { destroy(){}, getState(){ return {...} }, set(params){ ... } };
  }
});
```
`Q.sim.register(modul, impl)` ve `Q.sim.mount(modul, host, params, api)` fonksiyonlarını **`00-q.js` içinde A1 tanımlar**. Simülasyon dosyaları yalnızca `Q.sim.register` çağırır. `Q.sim.mount` kayıtlı modülü bulur ve `impl.mount(host, params, api)` sonucunu döndürür. Modül kayıtlı değilse host'a "Simülasyon yüklenemedi" yazar ve `{destroy(){}, getState(){return {};}}` döndürür.

Zorunlu davranışlar: (a) canvas boyutu host genişliğine göre; (b) ResizeObserver; (c) `destroy()` tüm dinleyicileri/timer'ları temizler; (d) `prefers-reduced-motion` animasyonu kapatır; (e) başlangıç durumu yüklenir yüklenmez **dolu görünür** (boş kabuk değil).

### 5.3 Claude istemcisi (`Q.claude`, A6)
```js
Q.claude.available()  // Promise<{backend:'sample'|'apikey'|'none', model:string}>
Q.claude.grade(girdi) // Promise<Puan>
Q.claude.setApiKey(k, hatirla) // yalnızca bellek (hatirla true ise sessionStorage); localStorage'a ASLA
Q.claude.test()       // Promise<{ok:boolean, hata?:string}>  kısa deneme çağrısı
```
`grade` girdi:
```js
{ soru, anahtarFikirler:[], yanlisKavramlar:[], idealCevap, cevap, eminlik, signal? }
```
`Puan`:
```js
{ dogruluk:0..100, fikirler:[{fikir, var:true|false}], yanlisKavram:null|"cümle",
  geriBildirim:["≤12 kelime", ...en çok 3], ipucu:"≤15 kelime" , backend, model }
```
Hata: `reject({code, mesaj})`, `code` ∈ `iptal | izin_yok | sinir | gecici | json | yok`.

### 5.4 Arayüz (`Q.ui`, A4)
```js
Q.ui.dock.clear() / Q.ui.dock.mount(node) -> HTMLElement
Q.ui.bubble.say({kim, metin, konum:'runner'|'canavar'|'anlatici', ms}) -> Promise
Q.ui.confidence.ask({host}) -> Promise<0|1|2>        // 3 düğme, seçince çözülür
Q.ui.options.ask({host, secenekler:[{t}], tek:true}) -> Promise<index>
Q.ui.toast(metin, {tur:'bilgi'|'iyi'|'kotu', ms})
Q.ui.hud.setVoltaj(n) / setStation(ad, sira, toplam) / setPath(nodes) / setTimer(sn)
Q.ui.modal.open(node, {baslik}) / Q.ui.modal.close()
Q.ui.confirm({metin, evet, hayir}) -> Promise<boolean>   // sayfa içi, confirm() DEĞİL
Q.ui.textbox.ask({host, soru, maks:280}) -> Promise<string|null>   // null: vazgeçti
Q.ui.thinking.show(host, {metin}) / hide()          // Claude beklerken
```

### 5.5 Çizim (`Q.art`, A5)
```js
Q.art.registerChar(id, spec)        // 3.7
Q.art.monster(id, {cls})            // SVG string (viewBox -30 -10 360 360)
Q.art.cameo(id, {cls})              // canavar parçaları olmadan portre (planck, bloch dahil)
Q.art.drawWorld(ctx, cam, t, tema)  // parallax arka plan (42-art-world.js)
Q.art.drawRunner(ctx, x, y, durum, t)   // durum: 'kos'|'dur'|'atla'|'saldir'|'sendele'|'dus'|'zafer'
Q.art.drawObstacle(ctx, tip, x, y, durum, t, opts)  // opts.skin, opts.renk
Q.art.OBSTACLE_SIZE = { hikaye:{w:200,h:300}, ... }  // mantıksal piksel
```

### 5.6 Savaş (`Q.battle`, A3)
```js
Q.battle.apply(sonuc)            // voltajı/hata defterini günceller, 'voltaj:change' yayar
Q.battle.damageTable(dogru, eminlik, agirlik)  // {verilen, alinan, sarj}  (saf fonksiyon, test edilebilir)
Q.battle.kisaDevre(stationId)    // temel tur akışını başlatır (Promise)
Q.battle.reviewPick(stationIndex, n) // geçmiş istasyonlardan n tekrar engeli döndürür
Q.battle.reset(voltaj)
```

### 5.7 Koşu motoru (`Q.runner`, A2)
```js
Q.runner.start(stationId, fromIndex)   // Promise<'tamam'|'cikis'>
Q.runner.pause() / resume()
Q.runner.jumpTo(index)                 // ayar "kilitleri aç" ile
Q.runner.canvas                        // HTMLCanvasElement
```

## 6. Mantıksal koordinatlar (çizim ve motor)

Canvas mantıksal yüksekliği **720** birim; genişlik kapsayıcı oranına göre (`W = 720 × genişlik/yükseklik`). `devicePixelRatio` ile keskin çizilir. Zemin çizgisi `y = 600`. Koşucu `x = 0.26 × W` ekran konumunda sabit durur; dünya kayar (kamera). Ayrıntı: `02-motor-kosucu.md`.

## 7. Kod ve kalite kuralları (hepsi için)

1. Düz ES2017 JavaScript. `import/export` yok, modül yok, TypeScript yok, framework yok.
2. Her dosya `(function(){ 'use strict'; ... })();` ile sarılı.
3. `eval`, `innerHTML` ile **kullanıcı girdisi** ekleme yok (kullanıcı metni `textContent` ile).
4. Her dosya başına 5 satırlık başlık yorumu: ne yapar, hangi `Q.*` alanlarını ekler, hangi dosyalara bağlıdır.
5. Konsola `console.log` bırakma; yalnızca `console.error` gerçek hatada.
6. Renkler **CSS değişkeninden** (`05`'teki tokenlar). Canvas için `getComputedStyle(document.documentElement).getPropertyValue('--...')` ile okunur; sabit hex yalnızca istasyon rengi ve karakter paleti içinde.
7. Tüm yazılar Türkçe ve **şemadaki karakter sınırlarına** uyar.
8. Bir dosya 500 satırı geçerse mantıklı yerden ikiye böl (ek dosya adı: `NN-xxx-b.js`) ve `build.sh` sırasına ekle.
