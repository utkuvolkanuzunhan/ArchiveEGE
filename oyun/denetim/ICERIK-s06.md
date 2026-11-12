# ICERIK-s06 (İstasyon 6: Tünel istasyonu, kapsamlı içerik denetimi)

Kapsam: 90-data-s06.js, 87-data-hesap.js (q6-e-gt, q6-e-lt, tunel-1nm), 92-data-sinav-2.js (s06-m1..m10, k1..k4), 89-data-kartlar.js (gamow, broglie), 88-data-fabrika.js (s06), istasyonlar/06-tunel-istasyonu.md, kuantum-calisma-plani.md Blok 6.

Python ile yeniden hesaplanan sayılar (5,123 sabiti): k1=16,200; k2=11,455; R=0,02944; T=0,9706; E<V0 örneği κ=7,245 nm⁻¹, δ=0,138 nm, |t|²=4E/V0=2,4; tunel-1nm κ=8,873, 2κa=17,75, e^-17,75=1,96e-8 (tam formül 5,9e-8); sınav m2 R=0,029, m3 0,196 nm, m5 e^-5,1=6,1e-3, m7 e^-2=0,135 (7,4 kat), k2 e^-8,16=2,9e-4 ve e^-4,08=1,7e-2 (59 kat). Hepsi doğru.

## Düzeltildi (5)
- Yanlış sayı: o05 `acik` "milyarlarca kat düşüyor" yanlış. E=2, V0=4 eV, a: 0,3 -> 1,5 nm tam çözümle T 0,050 -> 1,5e-9, yani yaklaşık 35 milyon kat. "yaklaşık 35 milyon kat" yapıldı (md dosyası da).
- Belirsiz tuzak: o06 `yanlisParca` 1 ("quantum fiziğinde de") idi; yanlış olan iddia "kesinlikle geçemez" (parça 2). 2 yapıldı (md dosyası da).
- Dil: kavram onBilgi "Orada ψ oscillate (salınmaz)" bozuk, "oscillate (salınım) yapmaz" yapıldı.
- Öğretim boşluğu: sınavda sorulup istasyonda hiç anlatılmayan r=(k1−k2)/(k1+k2), E<V0 iken R=1 (patron faz 1 sorusu), penetration depth δ=1/κ (m3, k4 öncesi), κ'nın √m ile artması (m6, m10), κ≈5,123√(V0−E) nm⁻¹ ve STM akımı I ∝ e^(−2κd) (m7, k4) için hikaye engeline 2 onBilgi sayfası eklendi (toplam 3, sınır içinde).
- veri-dogrula.js ve sinav-dogrula.js temiz; hesap-engel.test.js (94 kontrol) geçti.

## Doğrulananlar (hata yok)
Sınav s06-m1..m10 tek doğru şık ve doğru indeks, açıklamalar doğru; k1..k4 ideal cevaplar doğru. Hesap görevi q6-e-gt adımları (k1, k2, r, t, R, T), q6-e-lt (κ, δ, |t|²) ve tunel-1nm sonuçları baştan hesaplanıp tutuyor; adimSoru cevapları/birimleri doğru. Tarihler: de Broglie 1924, Davisson-Germer 1927, Gamow 1928 doğru. o02 sim hedefi R 0,1-0,2 kaydırıcıyla erişilebilir (E/V0 ≈ 1,2-1,4).

## Odak testi (Playwright 1366x768, hikayeAtla KAPALI)
Hikaye + 3 onBilgi sayfası, kavram (sim sarmalandı), o03/o04 düşman, o05 tahmin, o06 tuzak, o07 köprü, patron 3 faz (seçmeli, 2 açık uçlu + yedek seçmeli) ve hesap engeli (adım 1/4) takılmadan açıldı; taşma yok (en alt düğme y=757 < 768), sayfa hatası yok. Betikteki ilk "Devam" tıklama hatası betik kaynaklıydı ("devam eder" şıkkıyla metin eşleşmesi), oyun hatası değil.

## Açık sorunlar
| sorun | konum | önerilen düzeltme | kesinlik |
|---|---|---|---|
| Fabrika metni "Transmission (geçirme)" kullanıyor, istasyon verisi "transmission (geçiş)" | 88-data-fabrika.js s06.bagliKavramlar | "Transmission (geçiş)" yap (başka istasyonun dosyası/ortak veri olduğu için dokunulmadı) | düşük |
| Hesap görevi tunel-1nm hiçbir engelde kullanılmıyor (yalnız alıştırma havuzunda) | 87-data-hesap.js | bilgi amaçlı, sorun değil | düşük |
| Tuzak iddiasında "quantum fiziğinde de" parçası da tartışılabilir | o06 | parça 2 seçildi; öğretmen onayı iyi olur | düşük |

## Açık maddelerin çözümü (ACIK-ICERIK-A turu)
- Fabrika "Transmission (geçirme)" -> "(geçiş)" yapıldı. tunel-1nm: bilgi amaçlı. Tuzak parçası DEĞİŞTİRİLMEDİ; kullanıcı teyit etsin.
