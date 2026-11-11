# 03 · Savaş, Eminlik, Voltaj, Geri Düşme, Hata Defteri (Paket A3)

> Yazan ajan: **A3**. Dosya: `src/js/60-battle.js`.
> Önce oku: `00`, `01`. Bu dosya **saf mantık**tır (çizim yok). Arayüz çağrıları `Q.ui.*` üzerinden, hepsi isteğe bağlı: `Q.ui` yoksa sessiz geç.

## 1. Eminlik

Oyuncu her cevapta üç düğmeden birini seçer: `0 = Bilmiyorum`, `1 = Emin değilim`, `2 = Eminim`.
Amaç: **doğru bilmek ile doğru sanmak arasındaki farkı** öğretmek. Yanlışı "emin" söylemek en pahalıdır. "Bilmiyorum" demek ucuzdur ve temel bilgi kartı açar.

## 2. Voltaj

- Oyuncunun tek kaynağı **voltaj**dır: `0..100`. Başlangıç 100 (yeni istasyonda 100'e döner; kısa devre sonrası 70).
- `Q.state.voltaj` her değişimde `voltaj:change` olayı yayılır ve `Q.ui.hud.setVoltaj` çağrılır.
- Oyunda **can sayısı yoktur**. Voltaj 0 olunca "kısa devre" olur (bölüm 5).

## 3. Hasar tablosu (kesin sayılar)

`damageTable(dogru, eminlik, agirlik)` saf fonksiyondur. `agirlik` engelin `agirlik` alanıdır (dusman 1, tahmin 1.5, tuzak 1, kopru 1, patron fazı 2).

| Sonuç | Eminlik 0 (Bilmiyorum) | Eminlik 1 (Emin değilim) | Eminlik 2 (Eminim) |
|---|---|---|---|
| **Doğru** | verilen 12, alınan 0, şarj 0, "içgüdü" ipucu | verilen 25, alınan 0, şarj 0 | verilen 50 (**kritik**), alınan 0, **şarj +8** |
| **Kısmen** (yalnızca patron açık uçlu, doğruluk 40-69) | verilen 8, alınan 3 | verilen 15, alınan 10 | verilen 20, alınan 20 |
| **Yanlış** | verilen 0, **alınan 6** | verilen 0, alınan 20 | verilen 0, **alınan 40** ("emin yanlış") |

- Dönen: `{verilen, alinan, sarj, kritik}`; `alinan` ve `verilen` `agirlik` ile çarpılıp yuvarlanır. `kritik = (dogru===true && eminlik===2)`.
- `sarj` voltaja eklenir (en çok 100).
- `verilen` yalnızca **patron HP**'sine uygulanır (bölüm 4). Normal engelde "verilen" sadece görsel (sayı gösterilir).
- Yanlış + eminlik 0 → hasar küçük **ve** "temel kart" (o kavramın tek cümlelik özeti) gösterilir (`Q.ui.toast` veya dock kartı).

## 4. Patron HP ve fazları

- Patron HP: `120`. Faz sayısı `fazlar.length` (3). Bir faz **doğru** (veya `dogruluk ≥ 70`) çözülünce HP'den `40` düşer (faz biter). Fazın içindeki `verilen` hasarı yalnızca animasyon/sayı içindir.
- Fazda **yanlış** cevap: oyuncu hasar alır (tablo), açıklama gösterilir, fazın **`alt` sorusu** gelir (ikinci şans). `alt` de yanlışsa: ek hasar tablo kadar, faz "kaybedildi" olarak kapanır, HP yine 40 düşer (patron yavaş yavaş zayıflar, oyun kilitlenmesin), hata defterine yazılır.
- Faz başına en çok 2 deneme. Üçüncü deneme yoktur.
- `Q.battle.bossStart(canavarId)`, `Q.battle.bossHit(verilen)`, `Q.battle.bossHp()` yardımcıları isteğe bağlıdır; HP `Q.state.aktif.bossHp` alanında tutulur ve `boss:hp` olayı yayılır.

## 5. Kısa devre (geri düşme) ve temel tur

Voltaj 0'a inince:
1. `Q.bus.emit('kisa-devre', {stationId, sayi})`; `Q.state.ilerleme[id].kisaDevre++`.
2. Ekranda büyük "KISA DEVRE!" patlaması (A4'ün `Q.ui.toast` büyük formu veya `Q.ui.modal`), sonra **temel tur** açılır.
3. **Temel tur** (≈ 2-3 dk): istasyon verisindeki `temelTur`:
   - 3 kart sırayla gösterilir (`baslik`, `metin`), her biri tek dokunuşla geçilir.
   - Ardından `temelTur.sim` simülasyonu `Q.sim.mount` ile açılır, kullanıcı **Anladım** diyene kadar açık kalır (görev şartı yok).
4. Sonra runner oyuncuyu son **kontrol noktasına** koyar (bkz. `02` §7), voltaj `70`.
5. Aynı istasyonda `kisaDevre ≥ 3` ise **Tamir modu**: o istasyonun kalan engellerinde her seçenekte kısa bir ipucu satırı görünür ve alınan hasar `×0.5` olur. HUD'a küçük "Tamir modu" etiketi.
6. `Q.battle.kisaDevre(stationId)` bir `Promise` döndürür, temel tur bitince çözülür.

## 6. Hata defteri

`apply(sonuc)` içinde, `sonuc.kavram` varsa:

| Durum | Kayıt türü | Not |
|---|---|---|
| yanlış, eminlik 2 | `emin-yanlis` | en öncelikli |
| yanlış, eminlik 1 | `yanlis` | |
| yanlış veya doğru, eminlik 0 | `bilinmeyen` (yanlış) / `sans` (doğru) | |
| doğru, eminlik 1-2 | kayıt yok. Ama aynı kavramın **açık** kaydı varsa tekrar sayacı artar; `eminlik 2` ve doğruysa `cozuldu = true` | |

- Aynı `kavram` için açık (çözülmemiş) kayıt varsa **yeni kayıt açılmaz**, mevcut kaydın `tur`'u daha ağır olana yükseltilir (`emin-yanlis` > `yanlis` > `bilinmeyen` > `sans`) ve `tekrar` artar.
- `hata:add` olayı yayılır. `Q.save.write()` çağrılır.

### 6.1 Tekrar (aralıklı tekrar)
`Q.battle.reviewPick(stationIndex, n)`:
1. Çözülmemiş (`cozuldu:false`) kayıtlardan **geçmiş istasyonlara** ait olanları al (şu anki istasyon hariç).
2. Sırala: önce `emin-yanlis`, sonra `yanlis`, `bilinmeyen`, `sans`; eşitse `tekrar` azı önce.
3. En çok `n` kayıt için, kayıtta `kavram`ın geldiği istasyonun `tekrarHavuzu` listesinden **o kavrama ait** bir `dusman` engeli seç (kavram eşleşmesi `ob.kavram`). Bulunamazsa o kayıt atlanır.
4. Seçilen engel kopyasına `tekrarKayitId` alanı eklenip döndürülür. Dönen dizi uzunluğu ≤ n. Hiç kayıt yoksa boş dizi.
5. Dusman handler'ı `ob.tekrarKayitId` varsa baloncukta "Hata defterinden geldim" etiketi gösterir.

## 7. Dışarıya açılan fonksiyonlar (tam liste)

```js
Q.battle.damageTable(dogru, eminlik, agirlik) -> {verilen, alinan, sarj, kritik}
Q.battle.apply(sonuc) -> {verilen, alinan, sarj, kritik}   // voltajı değiştirir, hata defterini günceller
Q.battle.kisaDevre(stationId) -> Promise<void>
Q.battle.reviewPick(stationIndex, n) -> Engel[]
Q.battle.reset(voltaj = 100)
Q.battle.bossStart(canavarId) / bossHit(n) / bossHp()
Q.battle.tamirModu(stationId) -> boolean
```

## 8. Birim testleri (A3 bunları yazar, `oyun/test/battle.test.js`, Node ile çalışır)

`Q` nesnesini sahte oluşturup `60-battle.js`'i `require`/`vm` ile yükleyerek şunları doğrula:
1. `damageTable(true,2,1)` → `{verilen:50, alinan:0, sarj:8, kritik:true}`.
2. `damageTable(false,2,1)` → `{verilen:0, alinan:40, sarj:0, kritik:false}`.
3. `damageTable(false,0,1)` → `alinan:6`. `damageTable(false,1,1.5)` → `alinan:30`.
4. `damageTable('kismen',1,2)` → `verilen:30, alinan:20`.
5. Voltaj 100'den 40 hasarla 60'a iner, 0'ın altına düşmez, şarj 100'ü geçmez.
6. Aynı kavramda iki yanlış tek kayıt oluşturur, tür ağırlaşır.
7. `reviewPick` boş hata defterinde `[]`, dolu defterde öncelik sırasını uygular.
