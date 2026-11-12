# ICERIK-s02 (İstasyon 2: Kesim testeresi, kapsamlı içerik denetimi)

Kapsam: 90-data-s02.js, istasyonlar/02-kesim-testeresi.md, sınav havuzu (sv-s02-m1..m10, k1..k4), kuantum-calisma-plani.md. Sayısal doğrulama Python ile yapıldı (210 indisi, 0.5/√2=0.354 nm, 4/8-6/2 hücre sayımı, a/√3=0.577a, (110) alan yoğunluğu 1/(√2a²)).

## Düzeltildi (6)
- temelTur kart 3: bozuk cümle ("plane (düzlem) the axis (eksen) at ∞ keser") sade Türkçeye çevrildi.
- o06 tuzak iddia/parça/düzeltme: "Axis parallel plane için" kırık sözdizimi "Axis (eksen) ile parallel (paralel) plane (düzlem) için ..." yapıldı (düzeltme metnine eksik virgül eklendi).
- t04 tekrar sorusu: "hangi axis için parallel olur" dilbilgisi "hangi axis (eksen) ile parallel (paralel) olur" yapıldı.
- Öğretim boşluğu: patron onNot'a "kübikte [hkl] yönü (hkl) düzlemine diktir" (alt soru sorulmadan önce anlatılmıyordu) ve düzlem seçiminin atomic density/surface özelliklerini değiştirdiği (faz 3) eklendi.
- Öğretim boşluğu: sınavda çıkan ama istasyonda hiç anlatılmayan bar (negatif indis) gösterimi, d = a/√(h²+k²+l²) ve Czochralski/wafer bilgisi hikaye engeline tek sayfalık onBilgi olarak eklendi.
- veri-dogrula.js ve sinav-dogrula.js temiz.

## Doğrulananlar (hata yok)
Tüm doğru şıklar tek ve doğru: bcc=2, diamond 4 komşu, (2,∞,∞)->(100), (111) kesişim 1,1,1, [111]⊥(111), [100]∥x. Tarihçe: Miller 1839 Cambridge, Bravais 1848 (14 kafes), Bragg 1913 (X-ışını) doğru. Sınav havuzu s02 (m1-m10, k1-k4) İngilizce, cevap ve açıklamalar doğru, Si erime 1414 °C doğru. Oynanış 1366x768: hikaye+onBilgi, kavram sim (doğru ve yanlış), o03/o04/o05/o06/o07, patron faz 1 yanlış yol, temel tur akışı takılmadan çalıştı; konsol hatası yok.

## Açık sorunlar
| sorun | konum | önerilen düzeltme | kesinlik |
|---|---|---|---|
| Miller sim'inde x/y/z seçici düğmeleri 1366x768'de panelin altına taşıyor (y=776-868); yalnız ilk satır görünüyor (tahmin o05 ve temel tur) | 70-sim-miller.js / tahmin dock yerleşimi | sim yüksekliğini küçült (SVG yüksekliği ~%70) veya düğmeleri kompakt tek satıra al | yüksek (ekran görüntüsüyle doğrulandı) |
| o04 (elmas) birim hücre yapısı yalnız onNot'ta tek cümleyle anlatılıyor, görseli yok; "fcc kafes + 2 atomlu baz" sınavda s01'de soruluyor | 90-data-s02.js o04 onNot | isteğe bağlı: "diamond = fcc + iki atomlu baz, sp3 bağı" cümlesi | orta (öneri) |
| Doğru şık konumu veri dosyasında çoğunlukla 1. veya 2.; çalışma zamanında karıştırıldığı görüldü (sorun değil) | - | yok | düşük |
| Boss faz 2/3 doğru yol ve sandık bu turda yeniden oynanmadı (BUG-s02-C önceki turda geçti) | 80-obs-patron.js | gerek yok | düşük |
