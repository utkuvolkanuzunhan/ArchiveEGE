# 04 — Kredili İçeriğin Dışarı Sızdırılması

## Tanım

Kredi harcanarak indirilen içeriğin, sisteme katkı vermeyen kişilere toplu olarak dağıtılması.

## Örnek senaryo

Emre 50 kredi harcayarak bir dersin tüm çıkmış sınavlarını indirir ve 200 kişilik sınıf WhatsApp grubuna atar. Grupta kimse artık sisteme katkı vermeye gerek görmez.

## Etki

- Ver-al dengesi bozulur: Katkı vermeden içeriğe ulaşmak mümkün hale gelir.
- Katkı verenlerin emeği değersizleşir; bencillik yeniden rasyonel hale gelir.

## Önlemler

| Önlem | Açıklama | Durum |
|---|---|---|
| İletme / kaydetme engeli | Dosyalar Telegram'da `protect_content=True` ile gönderilir; iletilemez, kaydedilemez. | `PİLOT` |
| Kişiye özel görünür filigran | Her sayfaya silik bir kod basılır (ör. `EGE·K7F3-QX9A`). Ekran görüntüsüne ve fotoğrafa dayanır. | `PİLOT` |
| Gizli metin + üst veri | Görünmez metin katmanı ve PDF üst verisine aynı kod yazılır. | `PİLOT` |
| Kopya özeti kaydı | Her kişiye özel kopyanın SHA-256 özeti, kullanıcı ve tarihle kaydedilir. | `PİLOT` |
| Açık duyuru | Kullanım koşullarında "Her dosya size özel işaretlenir" açıkça yazılır. Caydırıcılık ve KVKK aydınlatma yükümlülüğü için gerekli. | `PİLOT` |
| `/kaynak` komutu | Moderatör, sızan dosyayı bota yükler; bot kodu okuyup kimin indirdiğini bulur. | `PİLOT` |
| Piksel düzeyi gizli filigran | Görüntü piksellerine gömülü, gözle görülmeyen işaret. | `SONRA` |
| İçerik varyantları | Değerli içerikte her kullanıcıya anlamı değişmeyen küçük farklılıklar içeren bir sürüm gönderilir. Elle yeniden yazmaya karşı da işe yarar. Bkz. [gizli-katmanlar/03](../gizli-katmanlar/03-tuzak-dosyalar.md). | `SONRA` |
| Ortak havuz (commons) | 2-3 yıldan eski içerik herkese ücretsiz açılır ve filigran uygulanmaz. Bu içeriğin paylaşılması sızıntı sayılmaz. | `PİLOT` |

## Kademeli yaptırım

Bir kod bir hesabı gösterir, kişiyi değil. Bu yüzden:

1. Önce kişiyle konuşulur; açıklaması dinlenir.
2. İlk ihlal: uyarı.
3. Tekrar: kredi kesintisi.
4. Israr: uzaklaştırma (e-posta engellenir, bkz. [01](01-sahte-hesap.md)).

## Tespit (izlenecek işaretler)

- Bir dosya dışarıda görüldüğünde içindeki kod.
- Kısa sürede çok sayıda farklı dosya indiren hesaplar (toplu indirme).

## Bilinen açıklar

- **Yeniden yazma:** Sorular elle yeniden yazılırsa filigran işe yaramaz. İçerik varyantları bu açığı kısmen kapatır; ama içerik özetlenerek veya sözlü aktarılırsa hiçbir yöntem işe yaramaz.
- **İşbirliği saldırısı (collusion):** İki kişi kopyalarını karşılaştırıp kodları bulabilir. Pilot ölçeğinde düşük olasılık.
- **Kırpma / rötuş:** Görünür filigran emek harcanarak silinebilir.
- Telegram 20 MB üzerindeki dosyaları bota indirtmez; bu dosyalar filigranlanamaz (yerel Bot API sunucusu ile 2 GB'a çıkar).

## Açık sorular

- Ortak havuza geçiş süresi kaç yıl olmalı?
- Sınıf içinde birkaç arkadaşa gösterme ile toplu dağıtım arasındaki sınır nerede çizilecek?
