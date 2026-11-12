# ICERIK-s04 (İstasyon 4: Atom mikroskobu, kapsamlı içerik denetimi)

Kapsam: 90-data-s04.js, istasyonlar/04-atom-mikroskobu.md, sınav havuzu (sv-s04-m1..m8, k1..k4), kuantum-calisma-plani.md. Sayısal doğrulama: E2 = -13,6/4 = -3,4 eV; E(3->2) = 13,6*5/36 = 1,889 eV; lambda = 1240/1,89 = 656 nm; 1,226/sqrt(100) = 0,1226 nm; 4->1 = 12,75 eV, 97 nm (sim başlangıcı); a0 = 0,0529 nm; klasik çökme süresi ~1e-11 s mertebesi.

## Düzeltildi (11)
- Fizik/öğretim: "ground state enerjisi sıfır değildir" ifadesi hidrojen için yanıltıcıydı (toplam enerji zaten -13,6 eV). Köprü bloğu 3, patron faz 1 nedeni ve faz 2 anahtar fikir/ideal cevap "hapsolmuş dalganın kinetic energy (kinetik enerji) değeri sıfır olamaz / altına inilemez" olarak düzeltildi.
- Yanlış açıklama: alt soru "Değişmez" seçeneğinin nedeni "belirsizlik ilkesi sıkıştırmayı sınırlar" idi (ilke sıkıştırmayı sınırlamaz, Δp'yi büyütür); "Δx küçülünce Δp büyür" yapıldı.
- Öğretim boşluğu: sınavda çıkan ama istasyonda hiç anlatılmayan Bohr varsayımları (L = nħ), 2πr = nλ, ionisation energy (iyonlaşma enerjisi), hc ≈ 1240 eV·nm, Bohr yarıçapı ve "sıkışma -> kinetik enerji artar / potansiyel düşer -> denge" hikaye engeline 2 sayfalık onBilgi olarak eklendi (patron alt sorusundan önce).
- Dil: yedek seçmeli yanlış şık "Because the atom is too cold (...)" karışık dil idi, Türkçe cümle yapıldı; köprü sonucu "alt sınır" -> "lower limit (alt sınır)"; patron girişi "Electronunu (elektron)" bozuk ek -> düzgün cümle; hikaye satırı "Levels arası" -> "Levels (seviyeler) arasında"; birkaç eksik/bozuk Türkçe ek (momentum değerine bağlıdır, mutlak sıfır sıcaklığında).
- Patron faz 1 sorusu "ground state enerjisi neden vardır?" belirsizdi, "Atom için neden bir lowest energy level vardır?" yapıldı.
- Sınav sv-s04-m6: doğru şık diğerlerinden belirgin uzundu (uzunluk ipucu), kısaltıldı.
- veri-dogrula.js ve sinav-dogrula.js temiz.

## Doğrulananlar (hata yok)
Tüm doğru şıklar tek ve doğru. Tarihler: Balmer 1885, Rutherford 1911, Bohr 1913, de Broglie 1924 (1913+11), Davisson-Germer 1927 doğru. Sınav havuzu s04: m1-m8 cevapları ve açıklamaları doğru (1,89 eV, 656 nm H-alpha kırmızı, 0,123 nm, 13,6 eV iyonlaşma, p iki katına çıkınca λ yarıya iner), k1-k4 doğru. Şıklar eşit uzunlukta ve inandırıcı, tuzaklar gerçek öğrenci yanılgılarına dayanıyor (sıcaklık, itme, yalnızca ışık dalgadır).

## Odak testi (Playwright 1366x768, hikayeAtla kapalı)
Hikaye + onBilgi (yeni 2 sayfa dahil), kavram kartları + Bohr sim, o03/o04/o05 (sim'li tahmin), o06 tuzak, o07 köprü, patron 3 faz (seçmeli, açık uçlu, yedek seçmeli) ve sandık/yeni makine akışı takılmadan tamamlandı; taşma yok (en alt düğme y=757, 768 içinde), konsol hatası yok. Betik parçalı çalıştırıldı (o01-o04, o05, o06-sandık) çünkü koşucu engeller arası yavaş yürüyor.
Not: açık uçlu fazda 'ne kadar eminsin' düğmeleri 1366x768'de y=757'ye iniyor (sıkı ama sığıyor).

## Açık sorunlar
| sorun | konum | önerilen düzeltme | kesinlik |
|---|---|---|---|
| kuantum-calisma-plani.md "en düşük durumun enerjisi sıfır olamaz" diyor (sınav k4 doğru yazılmış); H için toplam enerji -13,6 eV'dir, sıfır olamayan kinetik (sıfır noktası) enerjidir | kuantum-calisma-plani.md Blok 3 | "en düşük durumun kinetik enerjisi sıfır olamaz" ifadesine çevir (kullanıcı belgesi, değiştirilmedi) | yüksek |
| onBilgi sayfa 1 "ışıma yapıp enerji kaybeder" ifadesi o05/o06 cevabını önceden veriyor (tarihçe olarak doğru ve gerekli) | 90-data-s04.js o02 onBilgi | tasarım gereği bırakıldı | düşük |
