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

## EK KURAL (kullanıcı, KESİN): sınav %100 İngilizce
Kullanıcı sınavı tamamen İngilizce yazacak. Bu yüzden:
1. ŞIKLAR/seçenekler, tuzak parçaları, köprü kartları, tahmin seçenekleri, açıklama (neden), ipucu, kavram/sandık kartları, patron soruları, simülasyon etiketleri DAHİL HER metindeki HER ders terimi (isim, sıfat, ünlem değil) İngilizce yazılır, Türkçesi parantezde: `dopant atom (katkı atomu)`, `vacancy (boşluk)`, `interstitial atom (arayer atomu)`, `grain boundary (tane sınırı)`, `dislocation (dislokasyon)`, `impurity (safsızlık)`, `melt (eriyik)`, `seed crystal (tohum kristal)`, `ingot (külçe)`, `wafer (dilim)`, `conductivity (iletkenlik)`, `electron (elektron)`, `energy level (enerji seviyesi)`, `ground state (temel hâl)`, `excited state (uyarılmış hâl)`, `photon (foton)`, `threshold frequency (eşik frekansı)`, `work function (iş fonksiyonu)`, `blackbody (kara cisim)`, `boundary condition (sınır koşulu)`, `normalization (normalizasyon)`, `expectation value (beklenen değer)`, `operator (operatör)`, `commutator (komütatör)`, `barrier (bariyer)`, `transmission (geçirgenlik)`, `reflection (yansıma)`, `valence band (valans bandı)`, `conduction band (iletim bandı)`, `effective mass (etkin kütle)`, `Fermi level (Fermi seviyesi)` vb.
2. Bir terim şıkta geçiyorsa ŞIKTA da parantezli ver (ör. "Katkı atomlarının toplandığı yer" → "Where dopant atoms (katkı atomları) accumulate" değil, Türkçe cümle + `dopant atom (katkı atomu)`: "dopant atom (katkı atomu) toplanması"). Şık kısa kalmalı; kelime sınırı sayımı parantez içini saymaz.
3. Eksik tarama: Türkçe cümle içinde kalmış İNGİLİZCESİ OLAN her ders terimini bul (ör. katkı, boşluk, tane, kafes, hücre, dalga fonksiyonu, enerji bandı, olasılık, ölçüm, belirsizlik, tünelleme, kuyu, bariyer, özdeğer, özfonksiyon, operatör, kristal, kusur, yüzey, ara yüzey...). Tek tek `grep` ile kontrol et.
4. Hiçbir şık/terim Türkçe-only kalmasın. Yazım: ilk geçişte parantez; aynı soru+şık bloğunda ikinci geçiş yalnızca İngilizce olabilir ama ŞIKLARIN HER BİRİNDE terim ilk geçişteymiş gibi parantezli yazılmalıdır (şıklar bağımsız okunur).
