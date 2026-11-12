# ICERIK-s01 · İstasyon 01 (Kristal fırını) kapsamlı içerik denetimi

Kapsam: `90-data-s01.js`, `91-data-sinav-1.js` / `93-data-sinav-3.js` (s01 soruları), `kuantum-calisma-plani.md` Blok 1. Sayılar Python ile doğrulandı: SC doluluk π/6 = 0,5236; BCC √3π/8 = 0,6802; FCC π/(3√2) = 0,7405; FCC a=0,50 nm için a/√2 = 0,354 nm; BCC a=0,40 nm için a√3/2 = 0,346 nm. Tüm s01 sınav sorularında doğru şık tekil ve doğru.

## Düzeltilenler (doğrudan uygulandı)
- Hikaye yeri "Polonya" -> "Berlin" (1916'daki çalışma Berlin'de; Polonya doğum yeri).
- Tarihçe kartı: "neredeyse hep CZ" -> "çoğunlukla CZ" (FZ wafer de var, aşırı iddia).
- o03 sorusunda "Amorf (amorphous)" -> "Amorphous (amorf)" (dil kuralı sırası).
- o03/o04 doğru şık çeldiricilerden belirgin uzundu; çeldiriciler uzatıldı. o04 çeldiricisi "dopant atom" büyük harfle başlatıldı.
- Patron faz 1: çeldirici "melt (eriyik) atılsın diye" saçmaydı; "Seed (tohum) melt içinde erisin diye" ile değiştirildi (açıklama da). Küçük harfle başlayan şıklar düzeltildi (tüm patron/tekrar şıkları).
- Patron faz 2 anahtar fikir 4 ve idealCevap: amorfta "tane sınırı" yoktur; "polycrystalline'de grain boundary, amorphous'ta dangling bond ve defect taşıyıcıyı saçar/tuzaklar" yapıldı (Blok 1 S1 cevabıyla uyumlu).
- Tekrar t04 şık dil bozukluğu ("Order atom üzerine aktarır"), t05 yarım çeviri "shiny (parlak)", "cheap (ucuz)", temelTur "Atom (atom)" ve "melt" parantezsiz kullanımı düzeltildi.
- Sınav k4 model cevabı dilbilgisi: "can therefore be predicted".

## Açık bırakılanlar
| sorun | konum | önerilen düzeltme | kesinlik |
|---|---|---|---|
| Sınav havuzunda s01 etiketli MCQ m1-m8 ve klasik k1-k3 (SC/BCC/FCC doluluk, atom sayısı, elmas yapı, koordinasyon, en yakın komşu mesafesi) istasyon s01'de HİÇ anlatılmıyor; bu içerik s02 onBilgi/sorularında. Oyuncu sınav öncesi s01'i bitirip bu sorularla karşılaşınca "öğretilmemiş" görür. | `91-data-sinav-1.js` s01 blok, `90-data-s01.js` onBilgi | Bu soruları station "s02" olarak etiketle (s01'de yalnız m9, m10, k4 kalsın) ve s01'e en az 2 yeni MCQ (kristal vs amorf vs polikristal, CZ) ekle; ya da s01 onBilgi'ye 4. kart (kafes+baz, SC/BCC/FCC) ekle. Sayım kısıtı (istasyon başına >=8 MCQ) nedeniyle yeniden etiketleme sinav-dogrula ve SECKI.md ile birlikte yapılmalı | yüksek (gözlem), karar sahibi gerekli |
| o03 düşman görseli "Vacancy (Boşluk) Kusuru" (kusurSkin vakans) amorf katı sorusuyla ilgisiz; t05 da aynı skin | `90-data-s01.js` o03, t05 | Mevcut skin listesinde amorfa yakın bir skin varsa kullan; yoksa kabul et | orta |
| yanlisKavramIds: "daha parlak" yanılgısı `kristal_pahali` kavramına bağlı (parlaklık ≠ pahalılık) | `90-data-s01.js` patron faz 2/3 | Yeni kavram id'si gerekir (kavramlar listesi, hata defteri); şimdilik zararsız | düşük |
| Tuzak o06'da yanlış parça (ilk parça) çok belli ("pahalı olduğu için") | `90-data-s01.js` o06 | Gerçek öğrenci yanılgısı (maliyet) ama kolay; isteğe bağlı: "Kristal daha parlak olduğu için" gibi ikinci yanılgı ekle | düşük |
