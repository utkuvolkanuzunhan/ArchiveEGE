# ArchiveEGE
## Mimari görünümü (zorunlu, Volkan 14 Kasım 2026)

Bu depo, `volkan-merkez` deposundaki görsel arayüzle (klasör mahalle, dosya bina, ölçülen bağ yol) çizilir. **Her değişiklik bu görünüme uyar.**

- Ayar: kökteki `mimari-ayar.json` (ilk ekrandaki bölümler, dışarıda kalan üretilmiş çıktılar, test komutları, denetimler, akışlar). Kod paneli açıktır (`gorunum.kod`): betik ve test dosyalarının kodu yalnız üretilen sayfaya gömülür, kartın yanında istenince açılır.
- Üretilmiş çıktılar `yoksay` listesine yazılır, `haric` listesine değil: `haric` gizli yollar içindir ve o yollardaki dosya adlarını bütün metinlerde maskeler.
- Kartlardaki sade anlatım `mimari/anlatim/` altında durur; yalnız `volkan-merkez` içindeki `anlatim yaz` komutuyla yazılır, elle düzenlenmez.
- Yeni klasör, yeni test, yeni üretilmiş çıktı klasörü ya da bir akışın adımına dokunan değişiklik, ayarı **aynı değişiklikte** günceller.
- Ölçüm (`volkan-merkez` içinden; bu depoya yazmaz): `python araclar/mimari_cikar.py <ArchiveEGE yolu> --calistir --ozet`. Hata 0, kesilen dosya yok, denetimler yeşil ve ayardaki her akışta `dogrulanmamis` 0 olmalı.
- `oyun/test/runner.test.js` ve `oyun/test/smoke.js` tarayıcı ister; denetim listesinde değildir, elle koşulur.
- Kuralın tamamı: `volkan-merkez`, `mimari/06-arayuz-uyumu.md`.
