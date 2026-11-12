# KART-DOGRULUK · 23 kartın olgusal doğrulaması

Yöntem: her kartın p1/p2/p3/sinav maddeleri ve bonus tekCumle satırları tek tek kontrol edildi. Değişiklik yalnız `src/js/89-data-kartlar.js`. `veri-dogrula.js` ve `kartlar.test.js` temiz.

## Değişiklikler
| kart | eski | yeni | neden | kesinlik |
|---|---|---|---|---|
| czoch | (Teal-Little yok) | p2: yöntemin 1950 dolaylarında Bell Labs'te Teal ve Little tarafından önce Ge'a, sonra Si'a uyarlandığı eklendi | 1916 buluşu metal içindir; yarıiletken uyarlaması 1950'ler işidir, karışmasın | yüksek (tam yıl: Ge 1950, Si 1952 civarı; "dolaylarında" denildi) |
| einstein | "Bu çalışmaya Nobel verildi" | "Nobel (1921) photoelectric effect yasasının keşfi için" | gerekçe ve yıl netleşti (görelilik için değil) | yüksek |
| schro | "postülasıdır" | "postülatıdır" | yazım | kesin |
| broglie | elektron mikroskobunun "fiziksel temeli" de Broglie | "yüksek çözünürlüğü küçük dalga boyuna dayanır"; Schrödinger'e "yol açtı" | mikroskobun temeli de Broglie'ye atfedilemez; fazla iddia | yüksek |
| born | 1954 Nobel (tek başına) | Walther Bothe ile paylaştı | ödül Born-Bothe ortak | kesin |
| heis | p2 "Δx Δp ≥ ħ/2" Heisenberg'e; "1932 Nobel aldı"; "temel nedenidir" | Heisenberg yaklaşık verdi, kesin biçim Kennard'ın; Nobel "quantum mechanics'in yaratılması" için; "nedenlerden biri" | ≥ħ/2 Kennard (1927); Nobel gerekçesi doğrudan belirsizlik ilkesi değil | kesin |
| fermi | 1938 Nobel cümlesi istatistikle bitişikti | Ödül istatistik için değil, nötron ışımalı yeni radyoaktif elementler ve yavaş nötron tepkimeleri için | Nobel konusu farklı | kesin |
| fermi | "Fermi level konumu doping türünü belirler" | "doping türünü yansıtır" | nedensellik tersti (doping konumu belirler) | yüksek |
| fermi | sınav: "her T için f(E_F)=1/2" | "T > 0 için" | T=0'da f(E_F) tanımsız (basamak) | kesin |
| rutherford | "electron lar" | "electron'lar" | yazım | kesin |
| rutherford | sınav: çözüm "zero-point energy (Schrödinger)" | "uncertainty principle ve zero-point energy" | sıfır noktası enerjisi Schrödinger'e atfedilmez; sebep belirsizlik | yüksek |
| dirac | "Fermi'den bağımsız türetti" (p1 ve bonus tekCumle) | "Fermi'nin çalışmasının ardından antisimetrik dalga fonksiyonlarından türetti" | Dirac, Fermi'nin makalesinden sonra yazdı; "bağımsız" tartışmalı | orta-yüksek |
| kronig | "bandgap'in ilk basit gösterimi" | "klasik basit model" | "ilk" ispatsız iddia | orta |
| shockley | "1948'de ... fikri ve p-n kuramı" | fikir 1948, p-n kuramı 1949'da yayımlandı | kuram yayını (BSTJ) 1949 | yüksek |
| bragg | yasanın sahibi belirtilmemişti | "W. L. Bragg, 1912" eklendi | yasayı oğul Bragg formüle etti | yüksek |

## Doğrulanıp değiştirilmeyenler
Czochralski 1916 / Si erime 1414 °C; Miller 1839, Galli, örnek (2,∞,∞)→(100); Einstein 1905, K_max=hf−φ; Bohr 1913, Nobel 1922, E_n=−13,6/n²; Schrödinger 1926, Nobel 1933 (Dirac ile), sonsuz kuyu E_n; de Broglie 1924, Nobel 1929, Davisson-Germer 1927 (Nobel 1937 Thomson ile, Germer almadı); Born 1926; Heisenberg 1925/1927; Pauli 1925, Nobel 1945 (dışlama ilkesi için); Planck 1900, h≈6,63×10⁻³⁴, Nobel 1918, Wien kayması; Hertz 1887; Bravais 14 kafes, SC/BCC/FCC=1/2/4; Bragg Nobel 1915, nλ=2d sinθ, Laue 1912; Rutherford 1911, Kimya Nobel 1908; Gamow 1928 (Gurney-Condon), T≈e^(−2κL); von Neumann 1932; Kennard 1927 eşitlik Gauss; Bloch 1928 tez, Nobel 1952 (Purcell); Kronig-Penney 1931 koşulu |cos αa + P sin αa/αa|≤1; Dirac denklemi 1928, Dirac Nobel 1933; Shockley transistör 1947 (Bardeen-Brattain), Nobel 1956; kT≈0,0259 eV.

## Kullanıcı ders notuyla teyit etsin
- Bravais 1848: sunum yılı 1848, makale basımı 1850 (kaynaklar değişir); ders 1848 diyorsa kalsın.
- Bloch 1928 (tez) / 1929 (yayın); kart "1928" diyor.
- Czochralski/Teal-Little tam yılları (Ge 1950, Si 1952) kartta kasıtlı olarak "1950 dolaylarında".
- Dirac'ın Fermi'den "bağımsızlığı"; ders "Fermi-Dirac" dışında ayrıntı beklemiyorsa metin yeterli.
- Heisenberg Nobel yılı: 1932 ödülü, 1933'te duyuruldu; kart "1932" diyor.
- Sandık engellerindeki tekCumle/yıl satırları (90-data-s*.js) bu denetimde değiştirilmedi; olgusal sorun görülmedi (Fermi 1926, Miller 1839, Bohr 1913 vb. doğru).
- Fermi kartında sınav maddesi "kT≈0,0259 eV" 300 K içindir (oda sıcaklığı).
