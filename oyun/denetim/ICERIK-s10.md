# ICERIK-s10 · İstasyon 10 (Fermi, taşıyıcı, drift) kapsamlı içerik denetimi

Kapsam: `90-data-s10.js`, `87-data-hesap.js` (fd-100meV, fd-orta, np-ni, drift-v, drift-J ve örnekleri), `94-data-sinav-4.js` (sv-s10-m1..m8, k1..k3), `89-data-kartlar.js` (fermi, dirac), `88-data-fabrika.js` (s10), `istasyonlar/10-bonus-fermi-drift.md`, `kuantum-calisma-plani.md`.

Hesap Python ile baştan kontrol edildi: kT = 25,85 meV; (E−E_F)/kT = 3,868; f = 0,02047 (fd-100meV); örnek 0,05 eV için x = 1,934, f = 0,1263; E_F + kT için f = 0,2689; kapıdaki örnekler (0,06 eV/500 K: f ≈ 0,20; −0,05 eV/300 K: f ≈ 0,87; 600 K → 150 K: 51,7 → 12,9 meV) doğru. np-ni p = 2,25×10⁴ cm⁻³, örnek n = 1,125×10⁴ cm⁻³; drift-v 1,35×10⁵ cm/s = 1350 m/s, örnek 240 m/s; drift-J σ = 2,163 S/cm, J = 21,63 A/cm², örnek 0,801 / 16,02. adimSoru cevapları, toleranslar ve birimler doğru; `hesap-dogrula.py` 192 kontrol 0 hata.
Sınav m1..m8, k1..k3: doğru şıklar tekil ve doğru, açıklamalarda yanlış yok. Oyun içi o03-o08 (tuzak, köprü, patron fazları dahil) şıklarında yanlış ya da çoklu doğru yok. Fermi kartı (1926, Nobel 1938 nötron ışıması) ve Dirac kartı doğru.
Odak testi: Playwright 1366x768, hikayeAtla kapalı. Hikaye, bilgi kartları (7 sayfa), kavram sim'i, o03-o05, tuzak, köprü, patron 3 faz, hesap görevi (3 adım, doğru sayılarla) oynandı. Takılma, yatay taşma, konsol/sayfa hatası yok. Patron açık fazları Claude'suz (boş cevap) yedek akışıyla geçildi; hesap engeli ayrıca `hesap-engel.test.js` kapsamında.

## Düzeltilenler
- Hikaye ve oyun belgesi: "1947'de ilk transistör (Bardeen, Brattain, Shockley)" ve "Shockley'nin transistörü" hatalıydı (1947 transistörünü Bardeen ve Brattain yaptı; Shockley 1956 Nobel'i paylaştı) ve "buna dayandı" drift ile bağı abartıyordu. Hikaye satırı "Alanla taşıyıcı akışını denetlemek transistörün temelidir (ilk transistor: 1947)." yapıldı; onBilgi satırı "Bardeen ve Brattain ilk transistor'u yaptı; ikisi ve Shockley 1956 Nobel Fizik Ödülü'nü paylaştı." oldu; `10-bonus-fermi-drift.md` düzeltildi.
- Kavram kapısı: J = q(nμₙ + pμₚ)E'deki q (temel yük) ve μₙ/μₚ (electron/hole mobility) hiçbir yerde tanımlanmıyordu; eklendi.
- Kavram kapısı: sınav m8 (nᵢ ısınınca artar) kapıda yoktu; "nᵢ sıcaklık arttıkça hızla artar, bandgap büyüdükçe azalır" yazıldı.
- Hesap np-ni ipucu cümlesi ("10^{20} → 10^{20}×2,25") anlaşılmazdı; "(1,5×10^{10})² = 2,25×10^{20}" olarak yeniden yazıldı.

## Açık bırakılanlar
| sorun | konum | önerilen düzeltme | kesinlik |
|---|---|---|---|
| Tahmin o05 (300 K → 50 K) kavram sim'iyle aynı deney; kapıda cevap görülüyor | `90-data-s10.js` o02/o05 | Tahmini farklı soruya çevir (ör. T iki katına çıkınca f(E_F)) | orta (pedagojik karar) |
| o05 yanlış şıkkı "E_F noktası kaybolur" zayıf çeldirici | `90-data-s10.js` o05 | "f(E_F) 1/2'den büyük olur" gibi gerçek yanılgı | düşük |
| Sınav m5 "moderate fields" ifadesi, kapıda yüksek alanda drift hızı doygunluğu anlatılmıyor | `94-data-sinav-4.js` | Kapıya tek cümle (yüksek alanda v_d μE'den sapar) ya da m5'ten kaldır | düşük |
| kT değeri 0,026 / 0,0259 / 0,02585 farklı yerlerde (hepsi tutarlı yuvarlama) | kapı, kart, hesap | Gerek yok; sınıfa 25,85 meV @300 K notu verilebilir | düşük |
| Terim biçimi "Fermi (Fermi) Canavarı" anlamsız tekrar | `90-data-s10.js` o08 | Diğer istasyonlardaki gibi "Fermi-Dirac (Fermi) Canavarı" ya da düz "Fermi Canavarı" | düşük (kozmetik) |
| np-ni sayiCevap birimi "cm^{-3} (2.25e4 biçiminde gir)" arayüzde kaba görünebilir | `87-data-hesap.js` | Birimi "cm^{-3}", biçim notunu verilere taşı | düşük |
