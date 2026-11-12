# KART-EK · Bonus bilim insanı kartları

## Mekanizma
- Sandık kartı (istasyon başına 1) sandıkla gelir, `Q.state.kartlar` içinde tutulur (değişmedi).
- 13 bonus kart `Q.data.bonusKartlar` (89-data-kartlar.js) içinde tanımlı: `{id, ist, kisi, yil, tekCumle}`. Metinleri `Q.data.kartlar[id]`.
- Bonus kart, `Q.state.ilerleme[ist].tamam` true olunca otomatik kazanılır. Kayda yazılmaz, hesaplanır; bu yüzden `cip-hatti-v1` geriye uyumludur ve eski kayıtlarda tamamlanmış istasyonların bonus kartları kendiliğinden görünür.
- `Q.kartlar.liste()` istasyonda önce sandık kartını, sonra bonusları verir (`bonus:true`). s10 kartları ayara (`istasyon10`) bağlı kalır.

## Dağılım (toplam 23 kart)
s01 Czochralski · s02 Miller, Bravais, W.H./W.L. Bragg · s03 Einstein, Planck, Hertz · s04 Bohr, Rutherford, Davisson-Germer · s05 Schrödinger · s06 de Broglie, Gamow · s07 Born, von Neumann · s08 Heisenberg, Kennard · s09 Pauli, Bloch, Kronig-Penney · s10 Fermi, Dirac, Shockley.

## Bloch kararı
Bloch s01'e değil s09'a kondu. s01 kristal büyütme (CZ); Bloch teoremi periyodik potansiyelde bant yapısının dayanağı olduğu için s09 (energy bands) ve sınav Q7 ile örtüşüyor. Bloch kartı ayrı, Kronig-Penney kartı Bloch biçimindeki çözümleri anıyor (içerik çoğaltılmadı). s01'de yalnızca Czochralski var.

## Arayüz
- Koleksiyonda grup ilerlemesi x/y (ör. 1/3 kart). Bonus kartlar küçük satır (50px portre, 2 satır özet) olduğundan 1366x768'de harita kaydırılır, yatay taşma yok.
- Kilitli bonus: "<istasyon> istasyonunu bitir (bonus kart)." ipucu; ad ve içerik sızmaz (panel dahil). Detayda "Bonus kart" rozeti.
- Tekrar Merkezi "Açıklama kartları": ana kartın altında istasyonun bonus kartları da açık görünür.
- Portreler `40-art-chars.js` içinde 11 yeni cameo (planck ve bloch zaten vardı).

## İçerik
- p3 yalnızca gerçekten gerekli kartlarda: kaldırılanlar czoch, miller, broglie, pauli; kalanlar einstein, bohr, schro, born, heis, fermi; yeni kartlarda yalnızca gamow, neumann, kennard.
- Sınav önceliği: Q3 (Planck, Hertz, Rutherford, Davisson-Germer, Bragg), Q4 (Rutherford klasik çöküş sorunu), Q7 (Bloch, Kronig-Penney, Dirac), Q9 (von Neumann), Q10 (Kennard).
- Yalnızca emin olunan gerçekler; Nobel yılları: Planck 1918, Rutherford (Kimya) 1908, Bragglar 1915, Davisson 1937 (G. P. Thomson ile), Bloch 1952 (Purcell ile), Dirac 1933 (Schrödinger ile), Shockley 1956 (Bardeen, Brattain). Hertz 1887, Gamow 1928, von Neumann 1932, Kennard 1927, Kronig-Penney 1931, Bravais 1848 yılları kart `yil` alanında; kesin tarihleri ders notuyla bir kez daha karşılaştır (özellikle Bravais 1848, Shockley 1948).

## Test
veri-dogrula bonus biçimini denetler (id çoğaltma, geçerli istasyon, kisi/yil, tekCumle ≤20 kelime, metin var). kartlar.test.js: 23 kart, ilerleme x/y, bonus açılma/kilit, kayda yazılmama, eski kayıt uyumu, detay/taşma (3 çözünürlük). core, battle, claude, runner, tekrar-hata, kartlar, veri, sinav doğrulama ve smoke 9/9 geçti.
