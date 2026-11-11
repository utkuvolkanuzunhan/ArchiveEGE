# DIL-1 · Terim dili kuralı (kullanıcı isteği, KALICI)

Amaç: Kullanıcı sınavda klasik (yazılı) cevabı İngilizce yazabilsin; terimlerde tökezlemesin.

## Kural
1. Dersle ilgili TERİMLER İngilizce yazılır, Türkçesi parantez içinde: `wave function (dalga fonksiyonu)`, `Miller indices (Miller indisleri)`, `bandgap (yasak enerji aralığı)`, `tunneling (tünelleme)`, `potential well (potansiyel kuyusu)`, `eigenvalue (özdeğer)`, `lattice (kafes)`, `unit cell (birim hücre)`, `probability density (olasılık yoğunluğu)`.
2. İlk geçişte parantez ZORUNLU. Aynı metin/engel içinde tekrar geçerse yalnızca İngilizce kullanılabilir.
3. Sınavda sık kullanılan birkaç fiil de aynı biçimde: `derive (türet)`, `calculate (hesapla)`, `explain (açıkla)`, `sketch (çiz)`, `show (göster)`, `justify (gerekçelendir)`, `compare (karşılaştır)`, `define (tanımla)`, `state (belirt)`, `determine (belirle)`. Soru/ipucu/açıklama cümlelerinde doğal yerde kullan; her cümleye zorla sokma.
4. Geri kalan her şey (cümle yapısı, hikâye, arayüz düğmeleri, yönergeler) TÜRKÇE kalır.
5. Sembol/formül/birim değişmez. Doğru cevap ve fizik içeriği DEĞİŞMEZ; yalnızca terim dili.
6. Kısaltmalar: ilk geçişte `DOS (density of states, durum yoğunluğu)` gibi.
7. Kapsam: oyun/src/js/90-data-sNN.js (soru, seçenek, açıklama, ipucu, hikâye, patron fazları, sandık/kavram kartları), sim etiketleri (70-sim-*.js), hata defteri/tekrar kartları. İstasyon .md dosyaları belgedir, değiştirme.
8. Kelime sınırı: seçeneklerde parantezli Türkçe karşılık sayılan kelimeye dahil değil. `node oyun/test/veri-dogrula.js` kelime sayımını buna göre yapacak şekilde güncelle (parantez içi İngilizce terim karşılıkları sayım dışı) ve temiz geçmeli.
9. Claude puanlama istemi (30-claude.js): açık uçlu cevapta İngilizce terim kullanımı da doğru sayılsın; Türkçe de kabul.
