# Fabrika şeması (harita ekranı)

Harita ekranındaki istasyon karoları, ham kum > çip hattını gösteren işlevli bir şemayla değiştirildi.

## Dosyalar
- `src/js/21-fabrika.js`: şema (SVG), borular, bölüm paneli, mini soru, kutlama. `Q.fabrika.render(ctx)`.
- `src/js/88-data-fabrika.js`: `Q.data.fabrika.istasyonlar[sNN] = { kisa, rol, neden, bagliKavramlar, miniSoru }` (s01-s10).
- `src/styles/40-fabrika.css`: şema, animasyon (akış, parlama, pervane), kutlama.
- `src/js/20-settings.js`: `renderMap` yalnızca fabrika çağrısı ekledi (eski karo kodu yedek dal olarak duruyor); harita kutusu `max-width:1280px` oldu. Kart koleksiyonu bölümüne dokunulmadı.
- `test/fabrika.test.js`: 30 kontrol (durumlar, borular, panel, mini soru, kayıt, taşma, kutlama, 9/10 bölüm).

## Davranış
- Hat: Ham kum > s01 > ... > s10 > Çip (6 sütun, yılan düzeni). Her bölüm: bozuk/kilitli (gri, kesik çerçeve, kırık boru), sıradaki (cyan parıltı, kırmızı X'li kırık boru), onarılmış (renkli, akan boru, dönen pervane).
- Başlık: `3/9 bölüm onarıldı · Hat %33 çalışıyor` + ilerleme çubuğu (`istasyon10` kapalıysa 9 bölüm, açıksa 10).
- Bölüme tıklayınca panel: Ne işe yarar / Çipte neden gerekli / Kavramlar (English (Türkçe)) / süre, `Onar` (devam varsa `Onar (devam et)`, onarılmışsa `Yeniden oyna`), `İstediğin engele atla`. `Onar` istasyonu oynatır.
- Onarılmış bölümde "Bu bölümü neden kurduk?" mini sorusu: şık seçilir, `Onayla` ile gider, yanlışsa "Cevabın yanlış..." + Tekrar dene. Bir istasyon bitince harita açılırken o bölümün paneli kendiliğinden açılır.
- Hepsi onarılınca kutlama bandı + (Q.final.acik ise) "Sınav Günü (Final)" düğmesi.
- Dar ekranda şema yatay kaydırılır (min 1000px), sayfa taşmaz. 1366x768 ve 1440x900 doğrulandı.

## Tam ekran yerleşim (ek istek)
- Üst çubuk: Fabrika haritası, Üretim (wafer/saat), `n/N bölüm onarıldı`, `Hat %x`, ilerleme çubuğu; düğmeler: Ana menü (`Q.hosGeldin`), Kartlar (kart bölümüne kaydırır), Hata defteri (n), Tekrar Merkezi, Ayarlar, Sınav Günü (Final).
- >=900px: ekranı doldurur; solda büyük şema + altında kart koleksiyonu (sol sütun kayar, çok kart taşmaz), sağda ayrıntı paneli (bölüm ya da kart). <900px: alt alta, panel alttan açılan sayfa (kart ajanının düzeni).
- Eski istasyon karo sırası ve boş çerçeve kaldırıldı. Ok tuşları şemada bölümler arası gezer, Esc ayrıntı panelini kapatır.
- Geri/Kapat düğmesi eklenmedi: harita oyunun ana ekranı, kapatılacak bir üst ekran yok (panel için Kapat (Esc) var).

## Kayıt
`cip-hatti-v1` anahtarı korundu, `v:1`. Eklenen tek alan: üst düzey `fabrikaMini: { sNN: { dogru, deneme } }` (yoksa boş sayılır). `fabrika.kurulu`, `ilerleme.tamam`, Her yere eriş, İstediğin engele atla aynen.

## Ek görev
`test/ui.test.js` options testi şık seç > Onayla akışına uyarlandı (ui testi tamamen geçiyor).

## Açık / not
- Mini sorular elle yazıldı (3 şık); `bagliKavramlar` metinleri ders notuna karşı bir kez gözden geçirilmeli.
- Mini soru cevabı hata defterine yazılmıyor.
