# GERCEK-SINAV · "Gerçek sınav (10 soru)" modu

## Yapılanlar
- `src/js/86-data-gercek-sinav.js`: hocanın örnek sınavındaki 10 klasik soru AYNEN (İngilizce), her biri için model cevap (8-15 cümle; Q5/Q6 tam çözüm olduğu için daha uzun), 4-7 anahtar fikir, 2-3 sık hata (Türkçe), çalış bağlantısı (istasyon + not). Süre sayacı/duraklatma/süre önerisi YOK (kullanıcı kararı); mod adı "Gerçek sınav (10 soru)".
- `src/js/98-gercek-sinav.js`: Tekrar Merkezi sekmesi `gercek` (+ harita ekranında Tekrar Merkezi düğmesinin yanına "Gerçek sınav (10 soru)" düğmesi; `20-settings.js`'ye dokunulmadı, MutationObserver ile eklenir). Soru gezgini (Q1-Q10, yanıtlandı/boş), büyük yazı alanı, Q5/Q6 için SVG potansiyel şekilleri, taslak oturumda ve `localStorage["cip-hatti-gercek-sinav-v1"]` içinde (ana kayda dokunmaz), "Yeni sınav" iki adımlı silme.
- Değerlendirme: model cevap + anahtar fikir kontrol listesi (kullanıcı işaretler); Claude varsa "Claude ile puanla" (mevcut `Q.claude.grade`, işaretleri önceden doldurur), yoksa öz değerlendirme. Sonuç ekranı: soru başına yüzde, eksik fikirler, çalış bağlantıları (istasyonu aç, Kartlar, Q5/Q6 için Hesap çalıştayı).
- Final "Sınav Günü" (`96-final.js`): artık `Q.data.gercekSinav` ile aynı 10 soru, aynı sıra (s01,s02,s03,s04,s05,s06,s09,s07,s07,s08 patronları); s10 kapısı Final'den çıkarıldı (eski 11. kapı kodu yedek yol olarak duruyor, gercekSinav verisi varken kullanılmaz). Q5/Q6 şekli Final'de de gösterilir. `ui.textbox.ask` isteğe bağlı `kesme`/`rows` aldı (varsayılan 400/3 değişmedi), Final cevap sınırı 4000.
- Testler: `test/gercek-sinav.test.js` (yeni), `test/final.test.js` ve `test/final.html` 10 kapıya göre güncellendi.

## Q5 doğrulaması (Python, mpmath 80 hane + sonlu fark)
Varsayım: elektron, 0-50 nm sonsuz duvar, 20-30 nm arası 9 eV engel, kuyunun geri kalanında V = 0 (şeklin ayrıntısı bilinmiyor). ħ²/2m = 0.0380998 eV·nm². κ(E→0) = 15.37 nm⁻¹, κd = 153.7, e^(−2κd) ≈ 3×10⁻¹³⁴.
- Özdeğer denklemi: çift κ tanh(5κ) = −k cot(20k); tek κ coth(5κ) = −k cot(20k) (x′ = x − 25 nm). E ≪ V₀ için ikisi de tan(20k) = −k/κ (çift katlı).
- Sonuç: yaklaşım "iki bağımsız 20 nm sonsuz kuyu" E_n = 0.376 n²/400 eV = 0.940 n² meV; engel sızması (1/κ = 0.065 nm) dahil tam çözüm E_n ≈ 0.934 n² meV: E₁ 0.93399, E₂ 3.7360, E₃ 8.4059, E₄ 14.944, E₅ 23.350 meV; E₁₀ 0.093398, E₂₀ 0.37358, E₅₀ 2.33423, E₉₀ 7.55236 eV. Yarılma n = 1 için ~10⁻⁷² eV.
- Sonlu fark (dx = 0.01 nm) doğrulaması: E₁ = 0.93351 meV (çift), 9 eV altında 196 durum (98 çift; en üst ≈ 8.92 eV). E > 9 eV için tam denklem: 9.0038, 9.0151, 9.0338, 9.059, 9.090 eV, … (SY: 9.0038, 9.015, 9.0335, ...). Hesap çalıştayının (`87-data-hesap.js`) E₁ = 0.9340, 3.7360, 8.4059 meV değerleriyle tutarlı.
## Q6 doğrulaması
E > V₀: r = (k₁−k₂)/(k₁+k₂), t = 2k₁/(k₁+k₂), R = |r|², T = (k₂/k₁)|t|² = 4k₁k₂/(k₁+k₂)², R+T = 1 (Python): E/V₀ = 2 için R = 0.02944; 1.5 için 0.0718; 1.1 için 0.288. E < V₀: |r| = 1, |t|² = 4E/V₀ (Python doğruladı).

## (D) Seçki (SECKI.md) denetimi
10 sorunun hepsi seçkide: S1 sv-s01-k4, S2 sv-s02-k4, S3 sv-s03-k4, S4 sv-s04-k4, S5 s05-k1, S6 s06-k3, S7 sv-s09-k1, S8 sv-s07-k5, S9 sv-s07-k6, S10 s08-k1 (hepsi `secki:true`). Eksikler (kavramsal): Q5'in engelli kuyu varyantı (çift katlı seviyeler, κd ≫ 1 yaklaşımı) ve Q6'nın E < V₀ dalga fonksiyonu/ R = 1 sorusu seçkide ayrı klasik/MCQ olarak yok; Gerçek sınav modundaki model cevaplar bunları kapsıyor. Yeni soru eklenmedi.

## Açık notlar
- Q5/Q6 şekillerinin sayısal değerleri (E, V₀ ve 9 eV engelin kuyunun içinde olup olmadığı) PDF'ten doğrulanmalı; model çözümler genel parametrelerle yazıldı.
- Final'in yedek MCQ'su istasyon düzeyindedir (soruyla birebir eşleşmez).
