# 03 — Değersiz İçerikle Kredi Kasma

## Tanım

Gerçek bir katkı yapmadan, yükleme kurallarını kullanarak kredi kazanmaya çalışmak.

## Örnek senaryolar

- **Tekrar yükleme:** Aynı PDF'i farklı isimlerle 10 kez yüklemek.
- **Hafif değiştirilmiş kopya:** Arşivdeki bir dosyayı indirip sayfalarını döndürerek veya tekrar tarayarak "yeni" diye yüklemek.
- **Başkasının notunu çalmak:** Bir arkadaşının notunu izinsiz kendi adına yüklemek.
- **Boş / alakasız dosya:** Boş sayfalar, başka dersin içeriği veya yanlış yıl etiketi.
- **Parçalama:** Tek bir 20 sayfalık notu 20 ayrı dosya olarak yüklemek.

## Etki

- Arşiv çöple dolar, arama zorlaşır.
- Kredi enflasyonu: Herkesin bolca kredisi olunca ver-al dengesi çöker.
- Gerçek emeğiyle not hazırlayan kişi haksızlığa uğrar.

## Önlemler

| Önlem | Açıklama | Durum |
|---|---|---|
| Moderatör onayı | Yükleme, moderatör onaylayana kadar kredi kazandırmaz. Onay, moderatör grubunda `[Onayla] [Reddet]` butonlarıyla yapılır. | `PİLOT` |
| Dosya özeti (hash) kontrolü | Birebir aynı dosya ikinci kez yüklenemez. | `PİLOT` |
| Kredinin kademeli verilmesi | Onayda küçük bir temel kredi; asıl kredi indirme ve iyi puan geldikçe verilir. Kimsenin indirmediği dosya az kazandırır. | `PİLOT` |
| Zorunlu etiketler | Ders, yıl ve tür (vize/final/not/çözüm) seçilmeden yükleme tamamlanmaz. | `PİLOT` |
| Günlük yükleme kredi sınırı | Bir kullanıcının bir günde yüklemeden kazanabileceği kredi sınırlanır. | `PİLOT` |
| Benzerlik kontrolü | Metin veya görüntü benzerliği ile "hafif değiştirilmiş kopya" tespiti. | `SONRA` |
| Hak sahipliği itirazı | "Bu benim notum" itirazı; kanıtlanırsa kredi asıl sahibine aktarılır, yükleyene ceza verilir. | `SONRA` |
| Birleştirme kuralı | Aynı ders/yıl/türdeki parçalar moderatör tarafından tek dosyada birleştirilir. | `AÇIK` |

## Tespit (izlenecek işaretler)

- Reddedilen yükleme oranı yüksek kullanıcılar.
- Kısa sürede çok sayıda küçük dosya yükleyen kullanıcılar.
- Yüklenen dosyanın, kullanıcının daha önce indirdiği bir dosyaya benzemesi.

## Bilinen açıklar

- Hash kontrolü, tek bir pikseli değişmiş dosyayı yakalamaz; bu yüzden moderatör onayı şarttır.
- Moderatörler kalabalıklaşan yüklemelerde darboğaz olabilir (bkz. [06](06-yetkili-kotuye-kullanimi.md)).

## Açık sorular

- Başlangıç kredisi ve temel yükleme kredisi miktarları nedir? Simülasyonla belirlenmeli.
- Bir öğrencinin kendi el yazısı notu ile çıkmış sınav sorusu aynı krediyi mi almalı?
