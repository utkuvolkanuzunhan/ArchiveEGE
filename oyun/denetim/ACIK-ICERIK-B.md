# ACIK-ICERIK-B (s08, s09, s10, s01, s02, s04 açık içerik maddeleri)

## Düzeltildi
- s08 o05: tahmin kavram sim'iyle aynı deneydi (daralt); "σx 1 -> 2 nm, σp yarıya iner" yapıldı (sim onceki/sonraki, açıklama, şık sırası). Python: σp = ħ/(2σx) ters orantı.
- s08 o03: "Büyür" -> "Alt sınırı büyür" (Δp için ΔxΔp ≥ ħ/2 alt sınırı).
- s08 m7: L_x/L_y çeldiricisi anlatılmayan kavramdı; "y and p_y" (eşlenik çift, kapıda anlatılıyor) yapıldı. m6: "Fourier-conjugate" -> "conjugate quantities".
- s08 patron faz 2: yanlisKavramIds iki kez belirsizlik_alet, ama kayıt tanımı ("alet kusuru / ölçüm bozar") iki yanılgıyı birlikte kapsıyor; değişiklik gerekmedi.
- s09: bandgap terimi tek biçime çekildi (88-data-fabrika.js, 89-data-kartlar.js kronig); o04 zayıf çeldirici "Atom hiç electron içermez" -> "Valence band boştur, electron atoma sıkı bağlıdır" (açıklama düzeltildi). Bardeen/Brattain ifadesi doğru (s10 denetimiyle tutarlı), değişmedi.
- s10 o05: tahmin kavram sim'iyle aynıydı; "E_F + 0,1 eV seviyesinde f, 300 -> 600 K" yapıldı. Python: f = 0,0205 -> 0,1263. Zayıf çeldirici "E_F kaybolur" değişti. "Fermi (Fermi) Canavarı" -> "Fermi Canavarı". np-ni birim metni "cm^{-3}" yapıldı. Sınav m5 açıklaması "low to moderate fields".
- s02 o04: onNot'a "fcc kafes + iki atomlu basis, sp3" eklendi.
- veri-dogrula.js ve sinav-dogrula.js temiz, build geçti.

## Kullanıcı teyit etsin (değiştirilmedi)
- s01: s01 etiketli sınav MCQ/klasik soruları (SC/BCC/FCC doluluk, elmas yapı vb.) s01'de anlatılmıyor; yeniden etiketleme (sinav-dogrula, SECKI.md) veya s01'e kart eklemek kapsam kararıdır.
- s01 o03 kusurSkin "vakans" amorf soruyla ilgisiz; uygun skin yok, kabul edildi. s01 yanlisKavramIds "daha parlak" yeni kavram id'si ister; o06 ikinci yanılgı isteğe bağlı.
- s02: Miller sim x/y/z düğmeleri 1366x768'de taşıyor (70-sim-miller.js, kod/arayüz işi).
- s04: kuantum-calisma-plani.md Blok 3 "enerjisi sıfır olamaz" -> "kinetik enerjisi" (kullanıcı belgesi).
- s09: k4/m10 için seviye aralığı alıştırması, hikaye satırı 2'nin o03'ü ele vermesi, sim'de band genişliği kaydırıcısı (pedagojik/kod kararı).
- s10: m5 için yüksek alanda drift doygunluğu kapıda anlatılmıyor (yalnız "low to moderate" ifadesi netleştirildi); kT yuvarlamaları tutarlı, gerek yok.
