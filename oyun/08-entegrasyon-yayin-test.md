# 08 · Entegrasyon, Derleme, Test, Yayın (Paket A9)

> Yazan ajan: **A9**. Dosyalar: `oyun/build.sh`, `src/js/99-main.js`, `oyun/test/smoke.js`, `oyun/test/veri-dogrula.js`, `oyun/README.md` (kullanım).
> Önce oku: hepsini (`00`-`09`).

## 1. Derleme (`oyun/build.sh`)

Bash betiği. **Bağımlılık yok.** `oyun/referans/build.sh` örnektir.

```
1. dist/oyun.html = 
   <title>Çip Hattı</title>
   <meta name="claude:viewport-fit-sides" content="cover">
   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Nunito:wght@600;800&display=swap">
   <style> src/styles/*.css (dosya adı sırasıyla) </style>
   src/html/shell.html
   <script> src/js/*.js (dosya adı sırasıyla; 00 → 99) </script>
```
- `src/js/*.js` **alfabetik sırada** birleştirilir (dosya adı sayı öneki bunu garanti eder). `01 §1` listesindeki sırayı bozan bir dosya adı **kabul edilmez**.
- Çıktı 16 MB altında olmalı (beklenen < 1 MB).
- Derleme sonunda `node --check` ile birleşik script'in sözdizimi doğrulanır (script `dist/oyun.html` içinden ayıklanıp kontrol edilir).
- Dosya yoksa derleme **hata ile durur** ve eksik dosya adını yazar (`01 §1` listesine göre zorunlu dosyalar kontrol edilir, patron/sim/istasyon dosyaları dahil).

## 2. Ana akış (`99-main.js`)

1. `Q.save.load()`.
2. `Q.claude.available()` arka planda başlatılır (beklenmez); `claude:status` olayı HUD'u günceller.
3. Hoş geldin ekranı (modal, kısa): oyun adı "Çip Hattı", tek cümle ("Kumdan çipe: 9 istasyon, engelleri geç."), **Başla / Devam** ve **Ayarlar**. Başlangıç animasyonu kısa.
4. `Q.settings.openMap()` ile istasyon seçimi → `Q.runner.start(...)`.
5. İstasyon bitince: istasyon sonu kutlaması (kart + makine) zaten `sandik`ta; `station:end` ile harita yeniden açılır ve bir sonraki istasyon "sıradaki" olur.
6. Tüm 9 istasyon tamamlanınca **Final: Sınav Günü** (aşağıda §3) açılır.
7. Süre sayacı (`Q.state.sure.toplamSn`) başlatılır; `visibilitychange` ile durdurulur.
8. `Q.runner.start` çağrısından önce **veri doğrulama** (§4).

## 3. Final: "Sınav Günü" (**A7** yazar: `src/js/96-final.js`, `Q.final.start()`; A9 yalnızca `99-main.js` içinde tüm istasyonlar bitince `Q.final.start()` çağırır)

- Özel bir istasyon objesi çalışma anında üretilir (`id:'final'`): `engeller` = 10 `patron` benzeri **tek fazlı** engel; her biri örnek sınavdaki S1-S10 sorularından biri (istasyon verilerindeki `patron.fazlar[*].acik` içinden, `pdfSoru` olan her soru için bir tane; S5 ve S6 hesap içerdiği için sayısal kısım yerine "mantığı açıkla" biçiminde `soru` alanı kullanılır).
- Sırayla yol üzerinde 10 kapı. Her kapıda yalnızca **bir açık uçlu soru** + eminlik + Claude puanı. Süre baskısı **yok**.
- Sonunda "Sınav Raporu": her sorunun doğruluğu çubuk olarak, **eksik kalan anahtar fikirler** listesi ve hata defterindeki açık kayıtlar. **Tekrar çalışma önerisi**: en düşük 3 sorunun istasyonuna "Temel tura git" düğmesi.

## 4. Veri doğrulama (`oyun/test/veri-dogrula.js`, Node)

`90-data-*.js` dosyalarını sahte `Q` ile yükleyip şunları kontrol eder (hata varsa dosya:alan ile listeler):
1. 10 istasyon (`s01..s10`) var, her birinde `engeller` sırası `hikaye,kavram,dusman,dusman,tahmin,tuzak,kopru,patron,sandik`.
2. Her `dusman`/`tahmin` tam 3 seçenek, tam 1 doğru; `patron.secmeli` aynı.
3. `tuzak`: `parcalar.length === 3`, `yanlisParca ∈ {0,1,2}`, `iddia === parcalar.join(' ')`.
4. `kopru`: `bloklar.length ∈ {4,5}`.
5. `patron.fazlar[].acik`: `anahtarFikirler.length === 4`, `yanlisKavramlar.length ≥ 2`, `yedekSecmeli.secenekler.length === 4` (1 doğru), `alt.soru` dolu.
6. Metin uzunlukları `01` şemasındaki kelime sınırlarını aşmaz (kelime sayısı ile kontrol).
7. Her `kavram` id'si istasyonun `kavramlar` listesinde.
8. `tekrarHavuzu` en az 4 öğe; hepsi `tip:'dusman'`, `kavram` dolu, en az 4 farklı kavramı kapsar.
9. Her `sim.modul` `06`'daki modül adlarından biri.

## 5. Duman testi (`oyun/test/smoke.js`, Playwright)

Chromium (önceden kurulu) ile `dist/oyun.html` açılır (`file://`):
1. Konsol hatası yok.
2. Hoş geldin → Başla → harita açılır; `s01` açık, `s02` kilitli.
3. Ayarlar → "Her yere eriş" aç → `s02..s09` açık görünür → kapat → tekrar kilitli.
4. `s01`'i başlat: ilk engelde koşucu yavaşlayıp durur (<2 sn), dock dolar.
5. `hikaye` → Devam; `kavram` simülasyonu açılır (görev başarı koşulunu `api.done` ile testte tetikle).
6. `dusman`: seçenek → eminlik → açıklama → Devam.
7. Voltajı doğrudan 0'a ayarla (`Q.state.voltaj=0; Q.battle.apply(...)`) → "KISA DEVRE" → temel tur açılır → kontrol noktasına dönüş.
8. Yol ölçüsü: 1440×900'de `#runway` en az 1380×450 px.
9. Ekran görüntüleri: harita, yol (engelde durmuş), patron paneli (sağda), ayarlar, hata defteri → `oyun/test/ekran/`.

## 6. Yayın

1. `oyun/dist/oyun.html` derlenir.
2. Artifact olarak yayınlama (ana ajan/kullanıcı yapar): **`capabilities: {sample: {}}`** bildirilir. Başka yetenek gerekmez (`db` yok; kayıt `localStorage`). Başlık: `Çip Hattı` (sabit). `icon`: `chip`.
3. Yayın sonrası bir kez: sayfa açılır, Ayarlar → "Bağlantıyı dene" ile Claude izin penceresi çıkar, **izin verilir**, test geçer.
4. `Q.claude.available()` yayınlanmış sayfada `sample` döner, yerel dosyada `none` (veya anahtar girildiyse `apikey`).

## 7. Çakışma kuralları (paralel ajanlar için)

1. Her ajan **yalnızca kendi dosyalarını** oluşturur/değiştirir (`01 §1` tablosundaki etiketler).
2. Başkasının dosyasında hata bulursan **dokunma**; `oyun/SORULAR.md` dosyasına satır ekle: `[paket] dosya:satır — sorun`.
3. `git pull --rebase` ile çek, kendi dosyalarını commit'le, `git push`. Dosyalar ayrı olduğu için çakışma beklenmez. Çakışırsa kendi dosyanı koru, başkasınınkini olduğu gibi bırak.
4. Commit mesajı: `[A3] battle: hasar tablosu` (köşeli parantezde paket kimliği).

## 8. Bitti sayılma ölçütü (tüm oyun)
- `dist/oyun.html` hatasız açılıyor, 9 istasyon baştan sona oynanabiliyor (Claude yokken `yedekSecmeli` ile).
- Claude varken patron açık fazları puanlanıyor.
- Yol ekranın ≥ %96 genişliğinde, ≥ %50 yüksekliğinde.
- "Her yere eriş" anahtarı her an açılıp kapanabiliyor.
- Hiçbir ekranda 2 cümleyi aşan metin kutusu yok (smoke testinde `max-words` taraması: dock ve balon metinleri ≤ 25 kelime).
