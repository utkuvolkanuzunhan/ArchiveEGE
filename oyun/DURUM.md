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
| A2 | Koşu motoru | medium | M1 | calisiyor | | dalga 1 başladı |
| A3 | Savaş | low | M1 | bitti | 079a355 | 7 test geçti; Q.ui entegrasyonu A9 tarayıcı testinde denenecek |
| A4 | Arayüz | medium | M1 | bitti | 06b76b1 | ui.test.js geçti; Q.ui.boss.show A5a bekler |
| A5a | Karakter çizimi | low | M1 | calisiyor | | dalga 2, sınır kaldırıldı |
| A5b | Koşucu/engel/dünya | medium | M1 | calisiyor | | dalga 1 başladı |
| A6 | Claude istemcisi | medium | M1 | bitti | 7acd258 | 11 test geçti |
| A8 | Ayarlar ve harita | medium | M1 | bitti | 71cd0a7 | 6 kabul testi geçti (stub Q.ui); A4 CSS: #modal-layer z-index > 20 gerekli; A9 açılışta Q.settings.openMap() çağırmalı |
| A9 | Ana akış/derleme/test | medium | M1 | calisiyor | | erken başlatıldı (hız önceliği) |
| H1 | hikaye + sandık | low | M1 | calisiyor | | dalga 2, sınır kaldırıldı |
| H2 | düşman + tuzak | low | M1 | calisiyor | | dalga 2, sınır kaldırıldı |
| H3 | kavram + tahmin | medium | M1 | calisiyor | | dalga 2, sınır kaldırıldı |
| H4 | köprü | medium | M1 | calisiyor | | dalga 2, sınır kaldırıldı |
| H5 | patron | medium | M1 | calisiyor | | dalga 1 başladı |
| S1 | sim kristal_tur | medium | M1 | bitti | 6ba59b3 | Playwright geçti |
| S3 | sim kafes | low | M1 | calisiyor | | dalga 2, sınır kaldırıldı |
| S4 | sim miller | low | M1 | calisiyor | | dalga 2, sınır kaldırıldı |
| S5 | sim karacisim | medium | M1 | calisiyor | | dalga 2, sınır kaldırıldı |
| S6 | sim fotoelektrik | low | M1 | calisiyor | | dalga 2, sınır kaldırıldı |
| E1 | veri s01 | low | M1 | calisiyor | | dalga 2, sınır kaldırıldı |
| E2 | veri s02 | low | M1 | calisiyor | | dalga 2, sınır kaldırıldı |
| E3 | veri s03 | low | M1 | calisiyor | | dalga 2, sınır kaldırıldı |
| S2 | sim czochralski | medium | M2 | bekliyor | | |
| S7 | sim bohr | medium | M2 | bekliyor | | |
| S8 | sim kuyu | low | M2 | bekliyor | | |
| S9 | sim basamak | medium | M2 | bekliyor | | |
| S10 | sim olcum | medium | M2 | bekliyor | | |
| S11 | sim belirsizlik | low | M2 | bekliyor | | |
| S12 | sim bant | medium | M2 | bekliyor | | |
| E4 | veri s04 | low | M2 | bekliyor | | |
| E5 | veri s05 | low | M2 | bekliyor | | |
| E6 | veri s06 | low | M2 | bekliyor | | |
| E7 | veri s07 | low | M2 | bekliyor | | |
| E8 | veri s08 | low | M2 | bekliyor | | |
| E9 | veri s09 | low | M3 | bekliyor | | istasyon dosyası henüz yok olabilir |
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

- [ ] M1: build hatasız · veri doğrulama (s01-s03) · smoke testi · D1 kritik hata yok · D2 işlendi
- [ ] M2: s01-s08 oynanır · D1 + D2 tekrar
- [ ] M3: 9 istasyon + final · son denetim · README güncel

## Bilinen sorunlar
_(orta/düşük bulgular buraya)_

## Notlar
_(orkestratör kararları, kota/yarım kalan işler)_
- 2026-11-11: Kullanıcı isteğiyle 8 ajan sınırı kaldırıldı (hız önceliği). Denetim aşama sonu yerine ajan bitince hafif (node --check + paket testi); tek D1 A9 derlemesinden sonra.
