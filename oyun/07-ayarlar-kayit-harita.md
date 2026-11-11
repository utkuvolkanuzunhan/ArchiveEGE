# 07 · Ayarlar, Kayıt, Harita ve "Her Yere Erişim" (Paket A8)

> Yazan ajan: **A8**. Dosya: `src/js/20-settings.js`.
> Önce oku: `00`, `01`, `05` (modal ve bileşen sınıfları).

## 1. Neden önemli?

Kullanıcı oyunu yaklaşık **4 saatte** bitirmeyi hedefliyor. Zaman yetmezse **istediği anda** tüm bölümlere erişebilmeli ve bunu **istediği anda kapatıp açabilmeli**. Bu yüzden ayarlar penceresi baştan her yerde erişilebilir olmalı.

## 2. Ayarlar penceresi

Açma: üst şeritteki **⚙** düğmesi veya `S` tuşu veya `Esc` menüsünden. Her yerde (koşu sırasında da) çalışır. Açıkken yol donar. Kapanınca devam eder.

Pencere (modal) içeriği, yukarıdan aşağıya, **tam bu sırayla**:

| # | Ayar | Tür | Varsayılan | Davranış |
|---|---|---|---|---|
| 1 | **Her yere eriş (kilitleri aç)** | anahtar | kapalı | Açıkken harita menüsünde tüm istasyonlar ve tüm engeller seçilebilir. Kapalıyken yalnızca tamamlanan + sıradaki istasyon açık. Anahtar **istenildiği an** açılıp kapatılır, ilerleme kaydına etki etmez. |
| 2 | Hızlı mod: yalnızca patronlar | anahtar | kapalı | Açıkken her istasyonda yalnızca `hikaye`'nin ilk satırı + `patron` + `sandik` oynanır (≈ 6-7 dk/istasyon). |
| 3 | Hikâye sahnelerini atla | anahtar | kapalı | `hikaye` engeli çözülmüş sayılır, sahne gösterilmez. |
| 4 | Oyun hızı | slider 0.6–1.4 | 1.0 | `Q.state.ayarlar.hiz`. |
| 5 | Ders bu konuyu işledi (İstasyon 10) | anahtar | kapalı | Haritada istasyon 10 görünür. |
| 6 | Ses | anahtar | kapalı | |
| 7 | **Claude durumu** | bilgi + düğme | otomatik | Backend (`sample`/`apikey`/`none`) ve model adı yazar. **Bağlantıyı dene** düğmesi `Q.claude.test()` çağırır. |
| 8 | Model ve efor | iki seçici | `claude-sonnet-5-5`, `medium` | `Q.state.ayarlar.modelAdi`, `efor` (`low/medium/high`). |
| 9 | Gelişmiş: API anahtarı | katlanır bölüm | kapalı | `type=password` alan + "Bu oturum için hatırla" onay kutusu (varsayılan kapalı) + **Kaydet** düğmesi → `Q.claude.setApiKey`. Bölümde şu not: *"Yayınlanmış sayfada çalışmaz. Yerel dosyada çalışır."* |
| 10 | Haritaya dön | düğme | | |
| 11 | İlerlemeyi kopyala / yapıştır | iki düğme + metin kutusu | | `Q.save.exportText()` panoya kopyalanır (başarısızsa metin kutusunda seçili gösterilir), yapıştırınca `importText`. |
| 12 | **Her şeyi sıfırla** | düğme | | İki adımlı: önce `Q.ui.confirm({metin:'Tüm ilerleme silinir. Emin misin?'})`. `confirm()` yok. |

Her değişiklik `Q.state.ayarlar`'a yazılır, `settings:change` yayılır, `Q.save.write()` çağrılır.

## 3. Harita menüsü (istasyon seçimi)

Açılışta ve "Haritaya dön" ile görünür. **Tam ekran modal**: yolun görünümünü örter.

- 9 istasyon (veya 10) **fabrika haritası** olarak: yan yana kutular, her birinde makine ikonu, ad, durum.
  - Durumlar: `tamam` (yeşil çerçeve, "çalışıyor"), `sirada` (cyan parıltı, "sıradaki"), `kilitli` (soluk, kesik çerçeve, kilit ikonu), `acik` (kilitler açıkken kilitli olanlar normal görünür).
- Üstte **Üretim:** `kurulu makine sayısı × 6 wafer/saat`.
- Bir istasyona tıklanınca küçük bir panel açılır: konu (1 cümle), süre hedefi, **Başla** (veya **Devam et** `enSon` varsa), ve `kilitleriAc` açıkken **Engele atla** listesi (engel adları sırayla, tıkla = o engelin kontrol noktasından başla; ayrıntı §4).
- Altta **Kart koleksiyonu**: kazanılan bilim insanı kartları (kilitli olanlar gri silüet).
- Altta **Hata defteri** özeti: `X açık kayıt` ve en ağır 3 kavram adı. Tıklayınca liste modalı: kavram adı, tür (`emin-yanlış` kırmızı, `yanlış` turuncu, `bilinmeyen` sarı), tekrar sayısı.

### 3.1 Kilit kuralı (kesin)
```
istasyonAcik(sira) =
   ayarlar.kilitleriAc
   || sira == 1
   || ilerleme[onceki].tamam
   || (sira == 10 && ayarlar.istasyon10 && ilerleme.s09.tamam)
```
`istasyonAcik` fonksiyonu `Q.settings.istasyonAcik(stationId)` olarak dışarı açılır.

## 4. "Engele atla" (yalnızca `kilitleriAc` açıkken)

- `Q.runner.start(stationId, fromIndex)` seçilen engelin indeksiyle çağrılır. Atlanan engeller **tamamlanmış sayılmaz**; istasyon `tamam` olması için `sandik` engelinin çözülmesi yeterlidir ve oyuncu atlayarak bile istasyonu bitirdiyse kart/makine yine kazanılır.
- Voltaj atlamada 100'e döner.
- Atlama kullanıldığında HUD'da küçük "Atlamalı mod" etiketi görünür, ilerleme kaydına `atladi:true` yazılır (yalnızca bilgi için).

## 5. Süre göstergesi ve otomatik öneri

- `Q.state.sure.toplamSn` oyun açıkken her saniye artar (sekme gizliyse artmaz). Üst şeritte "Geçen 1s 12dk".
- **Öneri kuralı:** geçen süre `toplam hedef 240 dk`'nın **%70'ini (168 dk)** aşmış ve tamamlanan istasyon sayısı `5`ten azsa (yani geride) bir kez `Q.ui.toast` yerine küçük bir kutu çıkar: *"Süre azalıyor. Hızlı mod açılsın mı?"* **Aç** ve **Hayır** düğmeleri. `Aç` → `sadecePatron = true` (ve `kilitleriAc = true`). Aynı oturumda ikinci kez sorma.
- Kutu üstündeki küçük "Geçen" yazısının yanında **Kalan tahmini** gösterilmez (baskı yaratmasın).

## 6. Kayıt ayrıntıları (`Q.save`, ama dosya A1'indir; A8 yalnızca UI'dan çağırır)

A1 `10-state.js` içinde `Q.save.*` yazar. A8 bu API'yi kullanır. Değişen ayarlar `Q.state.ayarlar` altındadır.

## 7. Dışarıya açılan fonksiyonlar (A8)
```js
Q.settings.open()                 // ayarlar penceresi
Q.settings.close()
Q.settings.openMap()              // harita menüsü
Q.settings.istasyonAcik(id) -> boolean
Q.settings.get(anahtar) / set(anahtar, deger)
Q.settings.refreshClaudeStatus()
```

## 8. Kabul testleri (A8)
1. `kilitleriAc` kapalıyken `s02` kilitli; anahtarı aç → `s02` açık; kapat → tekrar kilitli (ilerleme bozulmadan).
2. `sadecePatron` açıkken `Q.settings.get('sadecePatron')` true döner; runner bunu okur (A2 bu alanı okuyup engel listesini filtreler: `hikaye(1)`, `patron`, `sandik`).
3. Ayarlar penceresi `S` tuşu ve ⚙ ile açılır, `Esc` ile kapanır, koşu açılışta donar.
4. "Sıfırla" iki adımlıdır ve `confirm()` kullanmaz.
5. İlerleme dışa aktar → sıfırla → içe aktar ile birebir geri gelir.
6. 169 dakika ve 4 tamamlanmış istasyon senaryosu (sahte süre) öneri kutusunu bir kez gösterir.
