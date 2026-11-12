# BUG-FINAL-dil-icerik · Dil/içerik tutarlılığı son denetimi

Kapsam: 90-data-s01..s10, 86 (gerçek sınav), 87 (hesap), 88 (fabrika), 89 (kartlar), 79 (ön bilgi), 91-94 (sınav). Yöntem: tüm veri vm içinde yüklenip 5871 metin satırı düzleştirildi; script'lerle (English (Türkçe) çiftleri, tutarsız çeviri, sınav kelimelerinin öğretimde geçmesi, tekrar eden kelime, rakam/tarih çakışması) tarandı.

| Sorun | Konum | Önem | Düzeltildi mi |
|---|---|---|---|
| Hata defterinde ham iç anahtar görünüyordu: "tane siniri", "kati turleri", "hesap kuyu" (ASCII, İngilizce yok). Hata defteri paneli, Tekrar Merkezi > Hata defteri (kart başlığı, kavram filtresi, soru üst satırı) ve Final sonuç ekranı | 20-settings.js, 98-tekrar-hata.js, 96-final.js | orta | Evet: `Q.util.kavramAd` (tüm kavram/hesap kimlikleri için `English (Türkçe)` ad tablosu; bilinmeyen kimlik eski davranışa düşer) |
| Hesap görevi adım başlıkları Türkçe-only ders terimi ("Dalga fonksiyonu", "Normalizasyon", "Miller indisleri", "Foton enerjisi", "Doluluk oranı", "Sürüklenme hızı" vb., 72 yer) | 87-data-hesap.js | orta | Evet: `English (Türkçe)` biçimine çevrildi |
| Sınavda geçen Rayleigh-Jeans law, photocurrent, node, eigenfunction öğretimde (onBilgi/nasil/hikaye/kart) hiç tanıtılmamıştı | 90-data-s03.js (onBilgi), 90-data-s05.js (onBilgi) | orta | Evet: ilgili ön bilgi maddelerine bir cümle eklendi (kelime sınırı veri-dogrula ile doğrulandı) |
| Aynı olgu iki yerde farklı: germanium a = 0,565 nm (s01 nasıl yapılır) / 0,566 nm (hesap örneği) | 90-data-s01.js | düşük | Evet: s01 → 0,566 nm, V = 1,81×10⁻²² cm³ (n ≈ 4,4×10²² değişmedi) |
| Sınav/hesap İngilizcesinde İngiliz yazımı, öğretim metninde Amerikan: quantisation, crystallises, ionise, neighbour, behaviour, centre, tunnelling, randomise, Ionisation | 91-94, 86, 87, 90-data-s04.js | düşük | Evet: Amerikan yazımına çevrildi |
| Fabrika s08 rolünde "Konum ile momentum (momentum)" yarım çeviri (parantez içinde aynı sözcük) | 88-data-fabrika.js | düşük | Evet: "Position (konum) ile momentum ..." |
| Hesap/istasyon metinlerinde ikinci geçişte Türkçe-only terim kalıntıları (ör. "serbest yol kısalır", "tane sınırı artar", "bariyer", "taşıyıcı") ve Türkçe-only başlıklar ("Madde dalgasından tünellemeye", "Heisenberg ve belirsizlik ilkesi") | 90-data-s01/s06/s08/s10, 87 sinavNotu, kartlar | düşük | Hayır: ilk geçişte parantez var (DIL-1 kural 2 izin veriyor); toplu değişiklik riskli, son sürüm için bırakıldı |
| `oscillate (salınım)` (fiil/isim uyumsuz karşılık), `geçiş` hem transition hem transmission karşılığı | 90-data-s06 vb. | düşük | Hayır: bağlama göre doğru, kullanıcı karar versin |

Taramada bulunmayanlar: ham iç anahtar başka ekranda yok; undefined/NaN/boş parantez/çift boşluk yok; çift kayıtlı terim çelişkisi yok (sınır = boundary/limit ve hız = speed/velocity bağlama göre geçerli); kart tarihleri (Czochralski 1916, Miller 1839, Bohr 1913, Hertz 1887, Einstein 1905/Nobel 1921, Planck 1900/1918, Bloch 1928/1952, Kronig-Penney 1931, Shockley 1956 vb.) istasyon metinleriyle uyumlu; Si 1,12 eV, Ge 0,66 eV, GaAs 1,42 eV, hc = 1239,84 eV·nm, sc/bcc/fcc/elmas dolgu oranları (0,52/0,68/0,74/0,34) tüm kaynaklarda aynı.

Kullanıcı teyit etsin: fizik içeriği değiştirilmedi; yalnızca terim tanıtım cümleleri eklendi (Rayleigh-Jeans law, photocurrent ∝ intensity eşik üstünde, ψₙ'de n−1 düğüm). Bu üç cümlenin ifadesi gözden geçirilsin.
