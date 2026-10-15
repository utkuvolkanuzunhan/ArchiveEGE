# 01 — Sahte / Çoklu Hesap (Sybil Saldırısı)

## Tanım

Bir kişinin birden fazla hesap açarak başlangıç kredilerini toplaması, kendi dosyalarına oy vermesi veya cezadan kaçmak için yeni hesapla dönmesi.

## Örnek senaryo

Mehmet üç farklı Telegram hesabı açar. Her biri başlangıç kredisi alır; Mehmet bu kredileri kullanarak yükleme yapmadan arşivin çoğunu indirir. Ayrıca bu hesaplarla kendi dosyalarına 5 yıldız verir.

## Etki

- Başlangıç kredisi bedava kaynağa dönüşür, ver-al dengesi bozulur.
- Puanlar güvenilmez hale gelir (bkz. [02](02-puan-manipulasyonu.md)).
- Uzaklaştırılan kullanıcı yeni hesapla geri döner; cezalar anlamsızlaşır.

## Önlemler

| Önlem | Açıklama | Durum |
|---|---|---|
| Okul e-postası zorunluluğu | Kayıt için `@ege.edu.tr` uzantılı adrese gönderilen kod ile doğrulama. | `PİLOT` |
| Bir e-posta = bir hesap | Bir e-posta adresi yalnızca bir Telegram hesabına bağlanır. Değişiklik moderatör onayıyla yapılır. | `PİLOT` |
| Doğrulanmamış hesaba kredi yok | Başlangıç kredisi e-posta doğrulandıktan sonra verilir. | `PİLOT` |
| E-posta adresinin saklanma biçimi | Ceza kayıtları silinse bile aynı e-postayla yeniden kayıt engellenir (adres özetlenerek/hash saklanabilir). | `PİLOT` |
| Öğrenci numarası eşleştirme | E-posta yerine/ek olarak öğrenci numarası ile doğrulama. | `AÇIK` |

## Tespit (izlenecek işaretler)

- Aynı kısa sürede kaydolan ve birbirinin dosyalarına oy veren hesaplar.
- Hiç yükleme yapmadan sadece başlangıç kredisini harcayıp pasifleşen hesaplar.

## Bilinen açıklar

- Bir kişi, okul e-postasını kullanmayan bir arkadaşının e-postasını ödünç alabilir. Bu tamamen engellenemez; sadece oran düşük tutulur.
- Mezun / kaydı silinmiş öğrencilerin e-postaları bir süre daha çalışabilir.

## Açık sorular

- Bölüm dışından (başka mühendislik bölümleri) öğrenciler kabul edilecek mi?
- `@ege.edu.tr` ve `@mail.ege.edu.tr` gibi farklı uzantılar var mı? Kontrol edilmeli.
