# 05 — Raporlama Sisteminin Kötüye Kullanımı

## Tanım

`⚠️ Raporla` özelliğinin, gerçek sorunları bildirmek yerine rakip dosyaları kaldırtmak veya moderatörleri meşgul etmek için kullanılması.

## Örnek senaryolar

- **Rakip temizleme:** Kendi dosyası öne çıksın diye aynı dersin diğer dosyalarını sürekli "Kopya/çalıntı" diye raporlamak.
- **Kişisel husumet:** Belirli bir kullanıcının tüm dosyalarını raporlamak.
- **Spam:** Moderatörleri bezdirmek için yüzlerce asılsız rapor göndermek.

## Etki

- Moderatörlerin zamanı tükenir; gerçek sorunlar gözden kaçar.
- Haksız yere kaldırılan dosyanın sahibi kredi ve motivasyon kaybeder.

## Önlemler

| Önlem | Açıklama | Durum |
|---|---|---|
| Rapor otomatik kaldırmaz | Rapor sadece moderatöre düşer; dosyayı moderatör kaldırır. | `PİLOT` |
| Sebep zorunluluğu | Rapor için sebep seçilir: `Yanlış ders`, `Okunmuyor`, `Kopya/çalıntı`, `Uygunsuz`, `Diğer`. | `PİLOT` |
| Sadece indiren raporlar | Dosyayı indirmemiş kullanıcı raporlayamaz. | `PİLOT` |
| Günlük rapor sınırı | Kişi başı günlük rapor sayısı sınırlanır. | `PİLOT` |
| Raporlayıcı isabet oranı | Raporları sık reddedilen kullanıcının raporları alt sıraya düşer. | `SONRA` |
| Asılsız rapor cezası | Açıkça kötü niyetli raporlar için kredi kesintisi. | `AÇIK` |

## Tespit (izlenecek işaretler)

- Raporlarının büyük kısmı reddedilen kullanıcılar.
- Bir kullanıcının raporlarının aynı yükleyiciye yoğunlaşması.

## Bilinen açıklar

- Kötü niyetli bir rapor ile iyi niyetli ama hatalı bir rapor her zaman ayırt edilemez. Ceza yerine önce isabet oranı kullanılmalı; aksi halde insanlar gerçek sorunları da raporlamaktan çekinir.

## Açık sorular

- Rapor eden kişinin kimliği yükleyiciye gösterilecek mi? (Önerilen: hayır.)
