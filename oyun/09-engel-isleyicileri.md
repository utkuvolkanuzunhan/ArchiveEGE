# 09 · Engel İşleyicileri (Paketler H1-H5)

> Her engel türü **ayrı bir dosyadır**: `src/js/80-obs-<tip>.js` (patron: `85-obs-patron.js`).
> Önce oku: `00`, `01` (özellikle §3 şemalar, §5.1 sözleşme, §5.4 arayüz), `03` (hasar), `05` (bileşenler).
> Her işleyici `Q.obs.register(tip, { tip, async enter(ob, ctx){...} })` çağırır ve `Sonuc` döndürür. **Hasarı uygulamaz** (runner uygular; patron hariç).

## Ortak kurallar

1. `enter()` hiçbir zaman reject etmez. İçeride `try/catch`; hata olursa `{dogru:false, eminlik:1, kavram:null, agirlik:ob.agirlik||1, notlar:'hata'}` döndürüp `Q.ui.toast` ile bildirir.
2. Dock içeriği `ctx.host` içine kurulur. İşleyici bitince host'u temizlemek runner'ın işidir ama işleyici kendi dinleyicilerini kaldırır.
3. Metinler `ob` alanlarından `textContent` ile basılır. HTML enjekte etme.
4. Her seçeneği sunarken `Q.ui.options.ask` kullan (karıştırır, 1/2/3 tuşları). Eminlik için `Q.ui.confidence.ask`.
5. **Cevap sonrası açıklama zorunlu:** doğru ya da yanlış, ilgili `neden` metni dock'ta 1-2 cümle gösterilir ve oyuncu **Devam** düğmesine basana (veya `Enter`) kadar kalır. Yanlışta açıklama **net** olur: "Yanlış. <doğrusu>".
6. Yolda görsel olay için `ctx.runway.anim(...)`, balon için `ctx.runway.say(...)`.
7. `ctx.state.ayarlar.hikayeAtla` true ise `hikaye` işleyicisi sahneyi göstermeden `{dogru:true,eminlik:1,...}` döner.
8. **Tamir modu** (`Q.battle.tamirModu(ctx.stationId)` true): seçeneklerin altında tek satır ipucu göster (seçeneğin `neden`'inin ilk 6 kelimesi değil; `ob.ipucu` yoksa cevabı vermeyen genel hatırlatma "Soruyu yeniden oku").
9. Tüm metin sınırları `01` şemasına uyar; işleyici uzun metni **kesmez**, veri zaten sınırlıdır.

---

## H1 · `hikaye` ve `sandik` (`80-obs-hikaye.js`, `80-obs-sandik.js`)

### `hikaye`
- Koşucu zaman kapısına girer (`ctx.runway.anim('kapi-ac')`), ekranda kısa **sahne** açılır: dock'ta üstte `yer · yil` etiketi ("Berlin · 1900"), altında satırlar **sırayla** konuşma balonu olarak çıkar (`ctx.runway.say(kim, metin)`; `kim` karakter id'siyse `Q.art.cameo(kim)` portre balonun yanında).
- Her satır: balon belirir (0.4 sn), 1.8 sn **veya** `Enter`/tıklama ile geçilir. 3 satır sonunda **Devam** düğmesi.
- `rivayet:true` ise sahnede "rivayet" etiketi.
- Ek: sahne sağında `Q.art.cameo` portresi (yalnızca en az bir satırı `kim` id'li ise).
- Dönüş: `{dogru:true, eminlik:1, kavram:null, agirlik:1, notlar:''}`.

### `sandik`
- Sandık açılır (`ctx.runway.anim('zafer')`). Dock'ta sırayla:
  1. **Kart**: `ob.kart` bilim insanı kartı büyük (`Q.art.cameo`), yıl, `tekCumle`. `Q.state.kartlar`'a ekler.
  2. **Fabrika**: "Yeni makine kuruldu: <istasyon.makine>" (kısa animasyon, makine adı). `Q.state.fabrika.kurulu`'ya ekler.
  3. **Özet**: `ob.ozet` 3 madde, üç satır (her biri tek tek 0.5 sn arayla).
  4. **Kontrol noktası** rozeti ("Kayıt alındı"). `Q.save.write()`.
- **Devam** düğmesi. Dönüş: `{dogru:true, eminlik:1, kavram:null, agirlik:1}`.

---

## H2 · `dusman` ve `tuzak` (`80-obs-dusman.js`, `80-obs-tuzak.js`)

### `dusman`
- Yolda düşman (skin `ob.kusurSkin`). Balonunda `ob.soru`. `ob.tekrarKayitId` varsa balonda küçük etiket: "Hata defterinden geldim".
- Dock: 3 seçenek (`options.ask`), ardından eminlik (`confidence.ask`).
- Sonuç hesabı: seçilen seçenek `dogru` mu? `Sonuc.dogru` buna göre.
- Animasyon: doğru → `ctx.runway.anim('saldir')`; yanlış → `sendele`.
- Açıklama gösterimi (ortak kural 5). Doğru ve eminlik 0 ise "İçgüdün iyi. Gerekçe: <neden>".
- Dönüş: `{dogru, eminlik, kavram: ob.kavram, agirlik: ob.agirlik||1, notlar: seçilenin neden metni}`.

### `tuzak`
- Yolda dikenli plaka, üstünde yanlış `iddia` **tek cümle** olarak. Dock: `ob.parcalar` yan yana **3 dokunulabilir parça** (cümle gibi dizilmiş). Talimat: "Hatalı parçaya dokun."
- Oyuncu bir parça seçer, sonra eminlik sorulur.
- Doğru: `index === ob.yanlisParca`. Doğruysa düzeltilmiş cümle (`ob.duzeltme`) yeşil kutuda gösterilir, plaka söner (`tuzak-boz`).
- Yanlışsa: seçilen parçanın **yanlış olmadığı** açıkça söylenir, doğru parça vurgulanır, `duzeltme` gösterilir.
- Dönüş: `{dogru, eminlik, kavram: ob.kavram, agirlik: ob.agirlik||1, notlar:'tuzak'}`. Bu engel **hata defteri tohumudur**: yanlışta kavram her zaman defterde açık kalır (battle bunu yapar).

---

## H3 · `kavram` ve `tahmin` (`80-obs-kavram.js`, `80-obs-tahmin.js`)

### `kavram`
- Kavram kapısı. Dock'ta: `ob.gorev` (tek satır talimat) + `Q.sim.mount(ob.sim.modul, simHost, ob.sim.params, api)`. `api.done` çağrılınca kapı açılır (`anim('kapi-ac')`), dock'ta `ob.ogrenilen` cümlesi çıkar, **Devam** düğmesi.
- Görev yapılmadan **geçilemez**, ama 45 sn sonra küçük **İpucu** düğmesi çıkar (`api.hint` metnini gösterir) ve 120 sn sonra **Geç** düğmesi (ceza yok, hata defterine `bilinmeyen` yazılır).
- Dönüş: `{dogru:true (geçildiyse true), eminlik:1, kavram: ob.kavram, agirlik:1, notlar:''}`; **Geç** kullanıldıysa `{dogru:false, eminlik:0, ...}`.

### `tahmin`
- Tahmin çukuru. Akış:
  1. `ob.soru` ve 3 seçenek (`options.ask`).
  2. Eminlik (`confidence.ask`).
  3. Simülasyon açılır: `Q.sim.mount(ob.sim.modul, host, ob.sim.onceki)`; 1.5 sn sonra otomatik `set(ob.sim.sonraki)` ile parametreler **sonraki** değerlere animasyonla geçer ("doğrulama"). Sonuç gösterilir.
  4. Tahmin doğruysa `atla`, yanlışsa `dus` animasyonu. `ob.acik` açıklaması (ortak kural 5).
- Dönüş: `{dogru, eminlik, kavram: ob.kavram, agirlik: ob.agirlik||1.5, notlar: ob.acik}`.

---

## H4 · `kopru` (`80-obs-kopru.js`)

- Kırık köprü. Dock: `ob.bloklar` **karıştırılmış** olarak sürüklenebilir kartlar (HTML5 drag-drop **kullanma**; pointer olayları ile sürükle-bırak ya da dokun-sıraya-ekle). Altta numaralı **boş yuvalar** (1..N).
- **Erişilebilir alternatif (zorunlu):** karta dokununca sıradaki boş yuvaya girer, yuvaya dokunmak geri alır.
- **Kontrol** düğmesi tüm yuvalar dolunca açılır. Doğru sıra `bloklar` dizisinin orijinal sırasıdır.
- Doğru: köprü kurulur (`kopru-kur`), `ob.sonuc` zincir cümlesi gösterilir. Yanlış: yanlış yerdeki kartlar kırmızı çerçeveyle sallanır; **doğru sıra** gösterilir (net düzeltme), sonra `sendele`. **İkinci deneme yok**, ama kullanıcı doğru sırayı gördüğü için öğrenir.
- Eminlik **sorulmaz** (`eminlik:1`).
- Dönüş: `{dogru, eminlik:1, kavram: ob.kavram, agirlik: ob.agirlik||1, notlar: ob.sonuc}`.

---

## H5 · `patron` (`85-obs-patron.js`)

En karmaşık engel. **Medium efor ajanı** yazmalı.

### Akış
1. `await ctx.runway.showBoss(ob.canavar, {ad: ob.canavarAd, renk: istasyon.renk})` (sağdan yavaşça girer, 1.7 sn).
2. Canavarın girişi: `ctx.runway.say(ob.canavar, ob.giris)`.
3. `Q.battle.bossStart(ob.canavar)`: HP 120.
4. Her faz için (`ob.fazlar`):
   - Faz başlığı: "Faz 1/3".
   - **`secmeli` faz:** soru canavarın balonunda; dock'ta 3 seçenek + eminlik; `Sonuc` üret; `Q.battle.apply` çağır (patron fazlarında hasarı **bu işleyici** uygular; `agirlik: 2`).
   - **`acik` faz:** soru + (varsa) küçük "sınav sorusu" etiketi (`pdfSoru` varsa İngilizce metni de gösterilir, katlanır). `Q.ui.textbox.ask`; boş ya da "Bilmiyorum" ise `{dogru:false, eminlik:0, dogruluk:0}`. Sonra `Q.ui.confidence.ask`. Sonra:
     - `await Q.claude.available()` → backend `none` değilse: `Q.ui.thinking.show`, `Q.claude.grade({...})`, sonucu göster (`dogruluk`, `fikirler` listesi ✓/✗, `geriBildirim`, `yanlisKavram` varsa kırmızı kutu).
     - `dogruluk ≥ 70` → `dogru:true`; `40-69` → `dogru:'kismen'`; `<40` → `dogru:false`.
     - Backend `none` veya hata `izin_yok`/`json` ise **`yedekSecmeli`** sorusu (4 seçenek, 1 doğru) sunulur (eminlik zaten alındı).
     - Hata `sinir`/`gecici` ise **Tekrar dene** ve **Yedek soruya geç** düğmeleri.
   - Her faz sonunda `Q.battle.apply(sonuc)`; `ctx.runway.damageNumber(...)` ve canavar `vuruldu`/`guldu` hali; HP `boss:hp` olayı ile HUD'a yansır.
   - **İkinci şans:** faz yanlış (dogru=false) ise `alt` sorusu (aynı fazın `alt.soru`'su; secmeli fazda `alt.secenekler`, açık fazda `alt.soru` açık soru olarak yine Claude'a gider). Bu ikinci deneme de yanlışsa faz kapanır (bkz. `03` §4).
5. Voltaj 0 olursa: `Q.battle.kisaDevre` akışı runner'da başlar; işleyici `{dogru:false, kisaDevre:true}` döner ve `ctx.runway.hideBoss()` çağırır.
6. Üç faz bitince `await ctx.runway.anim('zafer')`; `hideBoss`; HP ≤ 0.
7. Dönüş: `{dogru:true, eminlik:2? (son fazınki), kavram:null, agirlik:2, notlar:'patron'}`.

### Ekran düzeni (kritik)
- Canavar `#boss-panel` içinde sağda (yolun %34'ü, %94 yüksekliği). Balon panelin üstünde. **Yol ortada boş kalmaz**: koşucu solda, ortada arena bandı.
- Dock'ta: soru metni **tekrarlanmaz** (balonda); seçenekler/metin kutusu + eminlik düğmeleri.

### Claude beklerken
Canavar "düşünüyor" haline geçer (kaşlar çatık, balonda "…"), dock'ta `thinking` + **Dur** düğmesi. Dur → `Q.claude.cancel()` → cevap kutusuna dön (metin korunur).

### Test hesapları (H5 sahte `Q.claude` ile yazar)
- `dogruluk 85` → dogru true; `55` → 'kismen'; `10` → false.
- Claude `none` iken açık faz `yedekSecmeli`'ye düşer.
- İkinci şans: ilk cevap false → `alt` gelir; ikinci false → faz kapanır, HP yine 40 düşer.
- Voltaj 0 → `kisaDevre:true`.

---

## Kabul (hepsi)
Her işleyici `oyun/test/obs-<tip>.html` ile tek başına açılabilir (sahte `ctx` ile, örnek bir `ob` verisiyle). Playwright ile bir tam akış (seçenek seç → eminlik → sonuç) çalıştırılır ve ekran görüntüsü alınır.
