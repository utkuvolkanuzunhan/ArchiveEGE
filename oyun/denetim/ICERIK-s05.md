# ICERIK-s05 · İstasyon 05 (Dalga odası) kapsamlı içerik denetimi

Kapsam: `90-data-s05.js`, `87-data-hesap.js` (q5-* ve kuyu-* görevleri), `92-data-sinav-2.js` (s05-m1..m10, s05-k1..k4), `89-data-kartlar.js` (schro), `88-data-fabrika.js` (s05).

Python ile yeniden hesaplandı (scipy brentq, ħ²/2m = 0,038100 eV·nm²): κ = 15,369 nm⁻¹, κd = 153,7; E₁(50 nm) = 0,1504 meV; ΔE₁ = 9·0,3871 = 3,484 eV; 20 nm kuyu E₁ = 0,9401 meV; bariyerli tam çözüm E₁/E₂/E₃ = 0,9340 / 3,7360 / 8,4059 meV; kuyu-foton λ = 4,397 µm; kuyu-norm A = 0,6325; q5-basit 0,4512 meV. Hepsi veriyle uyumlu; adimSoru cevapları ve %2 tolerans doğru.

Sınav havuzunda s05 MCQ (m1-m10) ve klasik (k1-k4) doğru şıkları tekil ve doğru (m2 0,376 eV, m4 16 eV, m7 0,0908, m9 1/1836, k3 1,50 eV, k2 P = 1/2). Oyun içi şıklar karıştırılıyor.

Playwright 1366x768, hikayeAtla KAPALI: hikaye, bilgi kartları, kavram sim, o03/o04/o05, tuzak, köprü, patron ve hesap akışı takılmadan çalıştı; konsol hatası yok. Patronun açık uçlu fazları Claude bağlantısı olmadan yalnızca kendi kendine puanlama (Bilmiyorum/Gönder) ile denendi.

## Düzeltilenler (doğrudan uygulandı)
- Kavram kartı "ψ konum ya da enerji değeri vermez; yalnızca olasılık dağılımını taşır": position (konum), energy (enerji), probability distribution (olasılık dağılımı) parantezli yapıldı.
- Kavram kartı "ölçüm postülatı ... sonraki istasyonda gelir": ölçüm s07'de, sonraki istasyon s06 (tünelleme). "İlerleyen istasyonlarda" yapıldı; measurement postulate (ölçüm postülatı) parantezli.
- Patron faz 1 çeldirici "Measurement yapınca collapse olur" ölçüm postülatının doğru bir ifadesiydi (çoklu doğru izlenimi). "Her adımda ψ'yi collapse ile bir değere indirir" yapıldı, açıklama düzeltildi.
- Patron faz 3 yanlisKavramIds iki kez 'schrodinger_cokme'; ikinci yanılgı için 'psi_olasilik' yapıldı.
- q5-sayisal: doğrulanmamış "Sonlu fark yöntemi aynı sonucu ±%0,5 içinde verir" cümlesi kaldırıldı.

## Açık bırakılanlar
| sorun | konum | önerilen düzeltme | kesinlik |
|---|---|---|---|
| 1366x768'de kavram/tahmin kuyu sim'i dock'a sığmıyor (scrollHeight 368 > clientHeight 332): "Wire ⇄ Well" düğmesi kısmen, 15 sn sonra çıkan "İpucu" ekran dışında (dock kaydırılabilir ama oyuncu fark etmeyebilir). | `70-sim-kuyu.js` resize (H = max(150, 0,2·innerHeight)), `80-obs-kavram.js` | Düşük yükseklikte canvas ~110 px ve Wire/Well düğmesini seviye satırına al; yalnızca H'yi düşürmek 15 px kazandırdı, yetmedi | yüksek (gözlem) |
| Review kartında ("Temelden bir daha") "KISA DEVRE!" rozeti kart metninin ortasını örtüyor (voltaj 0 sonrası). | `60-battle.js` / review katmanı | Rozeti kartın dışına taşı ya da gösterim bitince kaldır | orta |
| Kavram sim'i (L: 2 -> 1) ile o05 tahmin sorusu (L yarıya inerse E₁?) aynı deney; cevap kavram kapısında görüldü. Kart "L yarıya inerse etkisi büyüktür" ifadesi belirsiz. | `90-data-s05.js` o02/o05 | Tahmini farklı değişkene çevir (L = 2 -> 2/3 gibi ya da n = 1 -> 2) | orta (pedagojik, karar gerekli) |
| Hesap görevi formül satırında üç boşluklu ayraç tek boşluğa çöküyor ("I: V = 0 II: V = V0 ... III: V = 0") | `87-data-hesap.js` q5-bolgeler adım 1 | Ayracı "; " yap ya da arayüzde pre-wrap kullan | düşük |
