# BUG-s02-C (İstasyon 2: patron o08, sandık o09, istasyon sonu, harita)
## Oynandı (1366x768, hikayeAtla+kilitleriAc, indeks o08'den)
- Patron 3 faz: faz 1 seçmeli yanlış yol (eminlik 3, "Cevabın yanlış, doğru: ..., senin seçtiğin: ..." + Devam) sonra "İkinci şans" alt soru doğru; faz 2 ve 3 açık uçlu, Claude yok -> yedek çoktan seçmeli ("Claude yok, çoktan seçmeli soru"), doğru + Devam. Soru metni her fazda cevap bitene kadar dock'ta kaldı.
- Sandık kartı (Miller 1839) + özet + "Kayıt alındı" + Devam; harita açıldı (Kesim testeresi çalışıyor).
- localStorage 'cip-hatti-v1': ilerleme.s02.tamam=true, enSon=8; fabrika.kurulu=["s02"].
- Terimler İngilizce (Türkçe) biçiminde (şıklar, geri bildirim, sandık özeti dahil); tasma yok; konsolda yalnızca font engeli hatası.
## Düzeltme
- Yok (hata bulunmadı).
## Kalan
- Sayfa yenileme sonrası kalıcılık betiği tamamlanmadan durduruldu (kayıt yazımı doğrulandı, reload okuması değil).
- Doğru yol (yanlışsız) ve gerçek Claude ile açık uçlu değerlendirme oynanmadı; core/battle/claude testleri çalıştırılmadı.
