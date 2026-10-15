# 03 — Tuzak Dosyalar ve Varyantlar (Sızıntı Avı)

## Amaç

Filigranın yetersiz kaldığı durumlarda sızdıranı bulmak. Filigran dosyanın **üzerine** basılır ve kırpılabilir, silinebilir veya içerik elle yeniden yazılarak atlatılabilir (bkz. [manipülasyon/04](../manipulasyon/04-sizinti.md)). Varyantlar ise içeriğin **kendisine** gömülür.

## Yöntem 1: İçerik varyantları

Aynı dosyanın, anlamı değişmeyen küçük farklılıklarla birden fazla sürümü hazırlanır ve her kullanıcıya farklı bir kombinasyon gönderilir.

Değiştirilebilecek, anlamı etkilemeyen ayrıntılar:

| Değişken | Varyant A | Varyant B |
|---|---|---|
| İfade | "Şekil 3'teki devrede" | "Şekil 3'te verilen devrede" |
| Soru sırası (bağımsız sorularda) | 1-2-3-4 | 1-3-2-4 |
| Birim yazımı | "5 kΩ" | "5kΩ" |
| Ara adım gösterimi | Ara sonuç kesir olarak | Ara sonuç ondalık olarak |
| Sayfa düzeni | Şekil sorunun üstünde | Şekil sorunun yanında |

**Matematik:** Her biri 2 seçenekli 10 değişken, 2¹⁰ = 1024 farklı kombinasyon verir. Bu da yaklaşık 1000 kullanıcıyı tek tek ayırt etmeye yeter. Sızan bir kopyada (fotoğraf, elle yazılmış hali, WhatsApp'a atılmış ekran görüntüsü) bu değişkenlere bakılarak kombinasyon, oradan da kullanıcı bulunur.

**Neden güçlü?** Kişi içeriği elle yeniden yazsa bile ifadeleri ve sırayı büyük olasılıkla korur. Görünür filigranın aksine, kişi neyin işaret olduğunu bilmez.

**Maliyet:** Varyant hazırlamak emek ister. Bu yüzden sadece en değerli içerikte (Altın seviye, son dönem çözümleri) kullanılır. Basit değişkenler (birim yazımı, sayfa düzeni) otomatik üretilebilir; ifade değişiklikleri moderatör tarafından hazırlanır.

## Yöntem 2: İkili arama ile şüpheli daraltma

Bir dosyanın sızdığı biliniyor ama kimin sızdırdığı bilinmiyorsa:

1. O içeriği indiren 64 kişi var.
2. Bir sonraki değerli dosya bu 64 kişiye iki farklı varyantla gönderilir: 32 kişiye A, 32 kişiye B.
3. Dışarıda B görülürse şüpheli 32 kişiye iner. Sonraki dosyada 16-16 ayrılır.
4. 6 adımda (2⁶ = 64) tek kişiye inilir.

Bu yöntem, kişiye özel kodlar silinse bile çalışır.

## Kesin sınırlar: Yapılmayacaklar

| Yapılmayacak | Neden |
|---|---|
| **Yanlış çözüm veya yanlış bilgi içeren tuzak dosya** | Sızan dosya masum öğrencilerin eline geçer ve onları sınavda yanıltır. Arşivin güvenilirliği yok olur. Varyantlar **sadece anlamı değiştirmeyen** ayrıntılarda yapılır. |
| **Açılınca dışarıya haber veren dosyalar** (PDF içine izleme bağlantısı, "kanarya bağlantısı") | Dosyayı açan üçüncü kişinin IP adresi gibi verileri, onun haberi ve rızası olmadan toplanmış olur. KVKK'ya aykırıdır. |
| **Kışkırtma (tuzağa düşürme)** | Birine özellikle sızdırmaya teşvik edici bir dosya göndermek veya "bunu paylaşabilirsin" diyerek sonra cezalandırmak. Bu hem haksız hem de güveni yok eder. |

## Gizlilik düzeyi

- Kullanım koşullarında "dosyalar size özel farklılıklar içerebilir" ifadesi **yer alır** (KVKK aydınlatma ve caydırıcılık için).
- Hangi değişkenlerin kullanıldığı, varyant tablosu ve ikili arama süreci **gizli tutulur**; sadece yöneticiler erişir.
- Varyant tablosuna her erişim işlem kaydına yazılır (bkz. [manipülasyon/06](../manipulasyon/06-yetkili-kotuye-kullanimi.md)).

## Bilinen açıklar

- İki veya daha fazla kişi kopyalarını karşılaştırıp farkları bulabilir ve "ortalama" bir sürüm yayabilir. Değişken sayısı arttıkça bu zorlaşır ama imkânsızlaşmaz.
- Sızıntı sadece sözlü veya özet halinde olursa ("Finalde şu konular çıktı") hiçbir yöntem işe yaramaz.
