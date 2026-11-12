# Fabrika bölüm paneli: okunabilirlik yenilemesi

Sorun: harita sağ paneli (bölüm detayı) dört madde aynı ağırlıkta, uzun birleşik terim yığını ve küçük yazıyla zor okunuyordu.

## Yeni düzen (`src/js/21-fabrika.js` `F.panel`, `src/styles/40-fabrika.css`)
- Üstte bölüm renginde ilüstrasyon bandı (makine + boru + büyük bölüm no; kilitli/sıradaki/çalışıyor durumuna göre).
- Büyük başlık (24px, mobilde 22px), altında ayrı satırda renkli durum rozeti: Kilitli (gri-lila), Sıradaki (cyan), Çalışıyor (lime), Onarılabilir (sarı; "Her yere eriş" açıkken sıra dışı açık bölüm) + "Bölüm n / N".
- Bilgi blokları kart: SVG ikonlu başlıklar Ne yapar / Çipte neden gerekli / Kavramlar; Süre küçük ikonlu ipucu satırı. Gövde 17px, satır aralığı 1.6, beyaz metin koyu zeminde (AA üstü), sol kenarda bölüm rengi.
- Kavramlar: 3-4 çip, bir çip = bir terim (`English (Türkçe)`).
- Yapışkan alt şerit (`.fb-alt`): birincil eylem büyük (56px) `Onar` / `Devam et` / `Yeniden oyna`; ikincil `Kapat (Esc)` küçük, altında. Panel kaydırılsa da şerit görünür kalır.
- Kilitli bölüm: gri düğme yok. Tek satır `Önce önceki bölümü onar: <ad>` + hat ilerleme çubuğu (`2/10 bölüm onarıldı`).
- Mini soru (Bu bölümü neden kurduk?) aynı kart diliyle: 17px soru, 16px şıklar, geri bildirim 16px; şıklar kısaltıldı.
- `İstediğin engele atla` kapalı bir `<details>` içinde (karmaşıklığı azaltır).
- Sağ panel genişliği `clamp(360px, 28vw, 460px)`; mobilde (<900px) alt çekmece yüksekliği 82vh.
- Şema düğümü etiketleri: Kilitli / Sıradaki / Çalışıyor / Bozuk.

## Metinler (`src/js/88-data-fabrika.js`)
10 bölümün `rol` ve `neden` alanı baştan yazıldı: en çok 18 kelime, günlük dil, benzetmeli (merdiven, gitar teli, apartman katı, nehir eğimi vb.). `bagliKavramlar` 3-4 tek terimli çip. Fizik: yalnızca emin olunan ifadeler (ör. tünelleme transistör kapısı ve flash bellekte hem işe yarar hem sızıntı yapar; belirsizlik çip küçülmesinin sınırlarından biridir).

## Erişilebilirlik
- Odak halkası: düğüm, başlık, `details` özeti, düğmeler (cyan 3px).
- Klavye: ok tuşları bölümler arası; Enter/Boşluk paneli açar ve odağı başlığa alır; Esc paneli kapatır ve odağı bölüm düğümüne geri verir.

## Doğrulama
1366x768, 1440x900, 1920x1080 ve 700x800'de kilitli / sıradaki / onarılmış üç durumun ekran görüntüsü alındı, yatay taşma yok, alt şerit görünür. `test/fabrika.test.js` (50+ kontrol): veri sınırları (18 kelime, çip = tek terim), yazı boyutları (başlık >= 22, gövde >= 16, satır >= 1.5), yapışkan şerit, klavye. core, battle, claude, runner, ui, kartlar, hesap, veri-dogrula, sinav-dogrula, smoke 9/9 geçti.
`tekrar-hata.test.js` "Biliyorum terimi ana listeden çıkarır" adımı bu işten bağımsız (Tekrar Merkezi Terimler sekmesi) kalıyor.
