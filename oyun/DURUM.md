# DURUM · Çip Hattı (orkestratör günceller)

> Tek doğruluk kaynağı. Orkestratör her ajan bitişinde günceller, commit + push eder.
> Durumlar: `bekliyor` · `calisiyor` · `bitti` · `yarim` · `engelli`.
> Başka hesapla devam edilirse önce bu dosyayı ve `oyun/ilerleme/*.md` dosyalarını oku.

**Çalışma dalı (DAL):** claude/chip-hatti-orchestration-2rxxtg
**Aşama:** M1 (oynanabilir dilim)
**Son güncelleme:** 2026-11-11

## Paketler

| ID | Ad | Efor | Aşama | Durum | Commit | Not |
|---|---|---|---|---|---|---|
| A1 | Çekirdek | low | M1 | bitti | ffdedc5 | 7 birim test geçti, 2026-11-11 |
| A2 | Koşu motoru | medium | M1 | bitti | | dalga 1 başladı |
| A3 | Savaş | low | M1 | bitti | 079a355 | 7 test geçti; Q.ui entegrasyonu A9 tarayıcı testinde denenecek |
| A4 | Arayüz | medium | M1 | bitti | | dalga 1 başladı |
| A5a | Karakter çizimi | low | M1 | bitti | | dalga 2, sınır kaldırıldı |
| A5b | Koşucu/engel/dünya | medium | M1 | bitti | | dalga 1 başladı |
| A6 | Claude istemcisi | medium | M1 | bitti | 7acd258 | 11 test geçti |
| A8 | Ayarlar ve harita | medium | M1 | bitti | | dalga 1 başladı |
| A9 | Ana akış/derleme/test | medium | M1 | bitti | | erken başlatıldı (hız önceliği) |
| H1 | hikaye + sandık | low | M1 | bitti | | dalga 2, sınır kaldırıldı |
| H2 | düşman + tuzak | low | M1 | bitti | | dalga 2, sınır kaldırıldı |
| H3 | kavram + tahmin | medium | M1 | bitti | | dalga 2, sınır kaldırıldı |
| H4 | köprü | medium | M1 | bitti | | dalga 2, sınır kaldırıldı |
| H5 | patron | medium | M1 | bitti | | dalga 1 başladı |
| S1 | sim kristal_tur | medium | M1 | bitti | | dalga 1 başladı |
| S3 | sim kafes | low | M1 | bitti | | dalga 2, sınır kaldırıldı |
| S4 | sim miller | low | M1 | bitti | | dalga 2, sınır kaldırıldı |
| S5 | sim karacisim | medium | M1 | bitti | | dalga 2, sınır kaldırıldı |
| S6 | sim fotoelektrik | low | M1 | bitti | | dalga 2, sınır kaldırıldı |
| E1 | veri s01 | low | M1 | bitti | | dalga 2, sınır kaldırıldı |
| E2 | veri s02 | low | M1 | bitti | | dalga 2, sınır kaldırıldı |
| E3 | veri s03 | low | M1 | bitti | | dalga 2, sınır kaldırıldı |
| S2 | sim czochralski | medium | M2 | bitti | | |
| S7 | sim bohr | medium | M2 | bitti | | |
| S8 | sim kuyu | low | M2 | bitti | | |
| S9 | sim basamak | medium | M2 | bitti | | |
| S10 | sim olcum | medium | M2 | bitti | | |
| S11 | sim belirsizlik | low | M2 | bitti | | |
| S12 | sim bant | medium | M2 | bitti | | |
| E4 | veri s04 | low | M2 | bitti | | |
| E5 | veri s05 | low | M2 | bitti | | |
| E6 | veri s06 | low | M2 | bitti | | |
| E7 | veri s07 | low | M2 | bitti | | |
| E8 | veri s08 | low | M2 | bitti | | |
| E9 | veri s09 | low | M3 | bitti | | |
| E10 | veri s10 | low | M3 | bekliyor | | istasyon dosyası henüz yok olabilir |
| S13 | sim fermi | low | M3 | bekliyor | | |
| A7 | Final Sınav Günü | medium | M3 | bekliyor | | |
| A5c | Ses | low | M3 | bekliyor | | isteğe bağlı |
| D1 | Hata denetimi M1 | low | M1 sonu | bekliyor | | |
| D2 | Dil denetimi M1 | low | M1 sonu | bekliyor | | |
| D1 | Hata denetimi M2 | low | M2 sonu | bekliyor | | |
| D2 | Dil denetimi M2 | low | M2 sonu | bekliyor | | |
| D1 | Hata denetimi M3 | low | M3 sonu | bekliyor | | |
| D2 | Dil denetimi M3 | low | M3 sonu | bekliyor | | |

## Aşama kapıları

- [ ] M1: [x] build hatasız · [x] veri doğrulama (s01-s03) · [x] smoke 9/9 · [ ] D1 kritik hata yok · [ ] D2 işlendi
- [ ] M2: s01-s08 oynanır · D1 + D2 tekrar
- [ ] M3: 9 istasyon + final · son denetim · README güncel

## Bilinen sorunlar
_(orta/düşük bulgular buraya)_

## Notlar
_(orkestratör kararları, kota/yarım kalan işler)_
- 2026-11-11: Kullanıcı isteğiyle 8 ajan sınırı kaldırıldı (hız önceliği). Denetim aşama sonu yerine ajan bitince hafif (node --check + paket testi); tek D1 A9 derlemesinden sonra.

- 2026-11-11 (devam oturumu): paylaşılan dalda silinen dosyalar geri yüklendi (A4,A5a,A5b,A8,S1,E1,E2 + testler). dist/oyun.html derleniyor, smoke 9/9. S6 ilerleme dosyası 'calisiyor' kalmış ama modül ve test sayfası mevcut.
- Kullanıcı isteği: sürümler arası kayıt korunsun (kayıt artık v>=1 kabul ediyor, dışa/içe aktarma Ayarlar'da); istenen istasyon/engelden başlama (harita panelinde 'İstediğin engele atla' her açık istasyonda); 'Her yere eriş' ile tüm istasyonlar açılır. Yol sırasında 'bu engeli atla' düğmesi YOK, sonraki iş.

- 2026-11-12 (D1 + düzeltmeler): D1 BUG-1: kritik 0, orta 3 (O1 engele atla indeksi, O2 menü çakışması, O3 sağ şerit) DÜZELTİLDİ (74d6a7b, 804d0b4). Düşük bulgular düzeltildi (e0637bc). 1366x768 dock yerleşimi düzeltildi (111ba7b). s02/s03 tuzak-köprü-patron oynandı (BUG-s02b, BUG-s03b); baloncuk etiketi ve çift hüküm metni düzeltildi.
- AÇIK: s02/s03 sandık, istasyon sonu, kayıt ve haritaya dönüş tam doğrulanmadı; karacisim sim gerçek oynanışı; "Claude yok, çoktan seçmeli soru:" metni oyuncuya görünüyor (kasıtlı mı?); S9 başarı aralığı (a=1.5'te T=7.6e-5); köprüde alt panel kayması, Kontrol düğmesi cevaptan sonra aktif; D2 dil denetimi yapılmadı; s09, s10, S13, A7 yok.
- KURAL (kullanıcı): oynama ajanları artık aynı istasyonu parçalayıp birkaç ajanla paralel oynasın (örn. her ajan bir engel grubu), uzun tek koşu zaman aşımına uğruyor.
