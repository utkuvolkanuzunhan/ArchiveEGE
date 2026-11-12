# HATA-CALIS · Hata defterini çalış, AI'a sor, Biliyorum

Dosyalar: `src/js/98-tekrar-hata.js` (yeni), `97-tekrar.js` (3 sekme + Biliyorum), `30-claude.js` (`Q.claude.chat`), `test/tekrar-hata.test.js`.

- Hata defterini çalış: istasyon/kavram filtresi, kayıt başına doğru cevap, neden, ipucu. "Bu soruyu yeniden çöz" ve "Görünenleri yeniden çöz" (soru tipine göre sıralı: düşman, tahmin, tuzak, patron). Doğru: `ogrenildi=true`, `seri=1`; art arda 2 doğru: `cozuldu=true` (defterden çıkar). Yanlış: `seri=0`, kayıt kalır. Boş defter ve "hepsi temizlendi" ekranları var. Kayıt şeması geriye uyumlu: yalnızca isteğe bağlı `seri/ogrenildi/cz/cozulduTarih` eklendi; `cip-hatti-v1` anahtarı ve mevcut alanlar aynı.
- AI'a sor: `Q.claude.chat` (sample veya API anahtarı; 45 sn zaman aşımı, iptal, hata kodları yok/ag/zaman/sinir). Sistem istemi: English (Türkçe) kuralı, istasyon/kavram listesi, en çok yanlış 3 kavram ("Bunlardan başlayayım mı?"). Hata defteri kartında "Bunu AI'a sor / açıkla" sohbeti o soruyla açar. Anahtar yoksa uyarı + Ayarlar'a git; ağ hatasında mesaj + "Tekrar dene", yazı ve geçmiş ekranda kalır. Geçmiş oturum belleğinde. Anahtar loga/ekrana/isteme yazılmaz.
- Biliyorum (ek istek): terimlerde "Biliyorum" düğmesi, son sekmede liste + "Geri al", sayaç "Biliyorum: N / toplam", kalıcı alan `Q.state.biliyorum` (cip-hatti-v1, bilinmeyen üst alan olarak korunur). Test, Deneme ve Kartlar'da "Biliyorum terimlerini içerenleri atla" kutusu (varsayılan açık; eşleşme: terim metinde geçiyorsa, 4+ harf).
- Test: Playwright 1366x768 sahte `api.anthropic.com` route, 27 kontrol geçti.
- Sınır: kayıtlarda soru metni tutulmadığı için soru, istasyon+kavram eşleşmesiyle verilerden bulunur; eşleşme yoksa kart açıklama + AI düğmesi gösterir.
