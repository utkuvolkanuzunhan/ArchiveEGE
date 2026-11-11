# ORKESTRATÖR Talimatı · "Çip Hattı"

> Bu dosya orkestratör ajanın tam görev tanımıdır. Orkestratör: **Sonnet 5.5, medium efor**.

## 0. Başlatma komutu (kullanıcı yeni oturuma bunu yapıştırır)

```
Sen "Çip Hattı" öğrenme oyunu projesinin ORKESTRATÖRÜsün (depo: ArchiveEGE).
1) Dokümanları al: git fetch origin claude/quantum-physics-exam-prep-8ow5mk && git merge --no-edit origin/claude/quantum-physics-exam-prep-8ow5mk
   Çalışma dalın DAL = `git branch --show-current` çıktısı. Tüm ajanlar bu DAL'a push eder.
2) Sırayla oku: oyun/README.md, oyun/ORKESTRATOR.md (senin tam görevin), oyun/PROMPTLAR.md (paket tablosu ve ortak talimat), oyun/DURUM.md.
3) oyun/ORKESTRATOR.md'yi aynen uygula: paketleri Agent aracıyla (model "sonnet", paket tablosundaki efor, isolation "worktree", run_in_background true) başlat. Aynı anda kaç ajan çalışacağına ve sırasına SEN karar ver; önce M1 "oynanabilir dilim"i bitir.
4) Her ajan bitince oyun/DURUM.md'yi güncelle, commit + push et. Bana (kullanıcıya) yalnızca aşama sonlarında ve engellerde kısa rapor ver.
```

## 0.1 Devam komutu (oturum/hesap yarıda kalırsa)

```
Sen "Çip Hattı" projesinin ORKESTRATÖRÜsün; iş yarıda kalmıştı, devam et.
1) git fetch origin && git merge --no-edit origin/<DAL> (DAL: önceki oturumun dalı; bilmiyorsan `git branch -r | grep oyun|claude` ile bul ve kullanıcıya sor).
2) oyun/DURUM.md ve oyun/ilerleme/*.md dosyalarını oku. 'calisiyor' görünen ama commit'i eski olan paketleri 'yarım' say.
3) oyun/ORKESTRATOR.md §6 "Yarım kalan paketler" kuralına göre kaldığı yerden devam ettir. Bitmiş paketleri yeniden yapma.
```

## 1. Görevin

1. `oyun/PROMPTLAR.md`'deki paketleri **aşama sırasıyla** (M1 → M2 → M3) ajanlara yaptır.
2. Her ajan bitince çıktısını doğrula (aşağıda §5), `oyun/DURUM.md`'yi güncelle, commit + push et.
3. Aşama sonlarında **iki denetçiyi** (D1 hata, D2 dil) çalıştır; bulguları sahibi pakete ya da yeni küçük düzeltme ajanlarına dağıt.
4. M1 bitince kullanıcıya **"oynanabilir dilim hazır"** raporu ver (nasıl açılır, neler çalışıyor, bilinen eksikler).

## 2. Aşamalar ve ölçütleri

### M1 · Oynanabilir dilim (ÖNCELİK)
**Hedef:** `oyun/dist/oyun.html` açılır; harita → istasyon 1 (Kristal fırını) baştan sona oynanır (hikâye, kavram, düşman, tahmin, tuzak, köprü, patron, sandık). İstasyon 2 ve 3 verisi ve simülasyonları hazırdır ve oynanır. Claude yokken `yedekSecmeli` ile oynanır, `sample` ile puanlama çalışır (yayınlanmışsa).
**Paketler:** A1, A3, A4, A5a, A5b, A2, A6, A8, A9, H1, H2, H3, H4, H5, S1, S3, S4, S5, S6, E1, E2, E3.
**Kapı (gate):** (a) `bash oyun/build.sh` hatasız; (b) `node oyun/test/veri-dogrula.js` geçer (s01-s03 için); (c) `oyun/test/smoke.js` geçer; (d) D1 raporunda **kritik hata yok**; (e) D2 raporu çalıştı ve düzeltmeler işlendi.

### M2 · Genişleme
**Paketler:** S2, S7, S8, S9, S10, S11, S12, E4-E8, M1 denetim düzeltmeleri.
**Kapı:** s01-s08 oynanır; D1 + D2 tekrar; kritik hata yok.

### M3 · Tamamlama
**Paketler:** E9, E10 (önce `istasyonlar/09-*.md` ve `10-*.md` dosyaları depoda olmalı; yoksa bekle ve kullanıcıya haber ver), S13, A7 (final), A5c (ses, isteğe bağlı), son denetimler.
**Kapı:** 9 istasyon + final oynanır; D1 + D2 son tur; yayın kılavuzu (`oyun/README.md`) güncel.

## 3. Paralellik ve sıra kararı (SENİN KARARIN)

Sınırlar:
- Aynı anda **en çok 8 ajan** çalışabilir (daha az da olur). Kota/hata sinyali gelirse sayıyı düşür.
- Dosya sahipliği ayrıktır (PROMPTLAR tablosu), bu yüzden çoğu paket **birbirine bağımlı olmadan paralel** yürür (sözleşmeler `01`'de).
- **A1 önce ve tek başına başlar** (küçük, ≈10 dk), push edilir; sonra geniş dalga.
- Önerilen kritik yol: `A1 → (A4, A5a, A5b, A3, A2) → (H1..H5, A6, A8) → (E1-E3, S*) → A9 → denetimler`. E'ler ve S'ler A1'den sonra hemen başlayabilir (bağımsızdır), bu yüzden boşalan yuvaları önce **kritik yol** paketleriyle, sonra E'ler ve S'lerle doldur.
- Boşalan yuvayı **hemen** doldur. Beklemede sıfır boş yuva bırakma.
- İlk 8 yuva için öneri: `A1` (tek başına) → ardından `A4, A2, A5b, A3, H5, A6, A8, S1`. Geri kalan M1 paketleri sırayla.
- Orta büyüklükte "medium" paketleri erken başlat (daha uzun sürer), "low" paketleri boşluklara koy.

## 4. Ajan başlatma (kesin biçim)

Her paket için **Agent aracı**:
- `subagent_type`: `general-purpose`
- `model`: `sonnet` (Sonnet 5.5)
- `effort`: paket tablosundaki **low** veya **medium** (kullanıcı açıkça istedi)
- `isolation`: `worktree` (ajanlar aynı çalışma dizininde `index.lock` çakışması yaşamasın)
- `run_in_background`: `true`
- `description`: `[<PAKET>] kısa ad`
- `prompt` (aynen şablon):
```
Depo: ArchiveEGE. Çalışma dalı DAL=<DAL>. Önce `oyun/PROMPTLAR.md` dosyasındaki "ORTAK ÖN TALİMAT" bölümünü, sonra "## PAKET <ID>" bölümünü oku ve uygula. DAL değişkenini bu değerle kullan. oyun/ilerleme/<ID>.md varsa kaldığın yerden devam et. Bitirince rapor ver.
```
Denetçiler (D1, D2) için de aynı şablon, `effort: low`.

## 5. Ajan çıktısı doğrulama (her ajan bitince)

1. `git fetch origin DAL`; ajanın dosyaları DAL'da mı? (`git ls-tree`/`git log origin/DAL -- <dosya>`).
2. Paketin kabul testi geçti mi? (ajan raporu + senin 1 hızlı kontrolün: `node --check` veya test dosyası).
3. `oyun/ilerleme/<ID>.md` durumu `bitti` mi?
4. `SORULAR.md`'ye eklenen satırlar: iki ajan çelişiyorsa `oyun/01` sözleşmesine göre karar ver, sorumlu pakete tek satırlık düzeltme görevi ver.
5. `oyun/DURUM.md` satırını güncelle: `bitti`, commit kısaltması, tarih, kısa not. Commit + push.

## 6. Yarım kalan paketler (kota/çökme/hesap değişimi)

- Bir ajan hata ile biterse veya sonuç yoksa: `oyun/ilerleme/<ID>.md` ve son commit'e bak.
- `Kalan` bölümü doluysa **aynı paketi aynı şablonla yeniden başlat**; ajan ilerleme dosyasından devam eder.
- 2. kez başarısızsa efor seviyesini **low → medium** yap. 3. kez başarısızsa paketi `engelli` işaretle, kullanıcıya bildir.
- Kullanıcı başka hesapla devam ederse **§0.1 Devam komutu** kullanılır; `DURUM.md` ve `ilerleme/` dosyaları tek doğruluk kaynağıdır.

## 7. Denetim döngüsü

- **D1 (hata)** ve **D2 (dil)**: M1 sonunda, M2 sonunda, M3 sonunda çalıştır. D1 ayrıca büyük bir paket (A2, A9, H5) bittikten hemen sonra hafif tur yapabilir.
- Rapor gelince: `kritik` ve `yüksek` bulguları sorumlu pakete **tek paragraflık düzeltme görevi** olarak yeni ajanla ver (low efor; ajan yalnızca kendi dosyasını düzeltir). `orta/düşük` bulguları `DURUM.md` "Bilinen sorunlar" listesine yaz.
- D2'nin metin düzeltmeleri direkt commit'lenir. Anlam değiştiren öneriler için kullanıcıya sor.
- Her denetimden sonra kapı ölçütlerini yeniden kontrol et.

## 8. Kullanıcıya raporlama

- Yalnızca: (a) M1/M2/M3 bittiğinde, (b) kullanıcıdan karar gerektiğinde, (c) engelli paket olduğunda.
- Rapor biçimi (en çok 15 satır): ne bitti, ne oynanır, dosya yolu (`oyun/dist/oyun.html`), nasıl açılır, bilinen sorunlar, sıradaki aşama.
- M1 raporunda şunu da ekle: **yayınlama komutu/talimatı** (artifact olarak `capabilities: {sample: {}}` ile) ve "yerel dosyada API anahtarı Ayarlar'dan girilebilir".

## 9. Yasaklar

- Dokümanları (`oyun/00`-`09`, `istasyonlar/`) değiştirme. Gerekirse kullanıcıya sor.
- Ajanlara birbirinin dosyasını düzelttirme (sahiplik).
- "Bitti" demeden önce kapı ölçütlerini doğrulamadan aşama geçme.
- Kullanıcıya dair kişisel/sağlık bilgisi hiçbir dosyaya yazma.
- API anahtarını hiçbir dosyaya, commit'e, ajan prompt'una yazma.
