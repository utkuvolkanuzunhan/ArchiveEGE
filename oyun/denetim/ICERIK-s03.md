# ICERIK-s03 (İstasyon 3: Işık-test odası, kapsamlı içerik denetimi)

Kapsam: 90-data-s03.js, 87-data-hesap.js (foto-cu, ayrıca foton-400 ve foto-esik), 91/93 sınav verisi (sv-s03-m1..m8, k1..k4), 89-data-kartlar.js (planck, hertz), 88-data-fabrika.js (s03 bölümü), istasyonlar/03-isik-test-odasi.md. Hesaplar Python ile baştan yapıldı: 1239,84/250 = 4,9594 eV, K_max = 0,2594 eV; λ₀ = 1239,84/2,3 = 539,06 nm; 1240/500 = 2,48 eV; 1240/400 = 3,10 eV, K = 0,80 eV, V₀ = 0,80 V. Hepsi doğru; adimSoru değerleri, tolerans ve birimler tutarlı.

## Düzeltildi (11)
- onBilgi öğretim boşluğu: "ultraviolet catastrophe" terimi o03'te soruluyor ama kapıda adı geçmiyordu; tanıma eklendi.
- onBilgi öğretim boşluğu: patron faz 2 anahtar fikirleri discrete atomic spectra ve wave-particle duality istiyor ama istasyonda anlatılmıyordu; kart 1'e eklendi (kart 1 iki maddeyi birleştirerek 4 madde sınırında tutuldu).
- Fizik inceliği: "Intensity = saniyede gelen photon sayısı" ifadesi yalnız sabit frequency için doğru; "sabit frequency değerinde ... ile orantılıdır" yapıldı.
- "Kinetic energy K = hf − φ" ifadesi "Maximum kinetic energy" yapıldı (formül K_max'tir).
- o04 sorusu "Planck'a göre bir photon..." tarihsel olarak yanlış atıf (foton kavramı Einstein'ındır); "Planck–Einstein quantum fikrine göre" yapıldı.
- temelTur kartı "Planck: light paket paket yayılır" yanlıştı (Planck enerji alışverişini nicemledi); "energy paket paket alınıp verilir" yapıldı.
- o03 yanlış şık "No emission (yayılma) of light" yarım çeviri/bozuk Türkçeydi; "Light (ışık) hiç yayılmaması" yapıldı.
- o05 üçüncü şık küçük harfle başlıyordu; düzeltildi.
- patron yedek şıklar "Metal (metal) thickness/melting": gereksiz tekrar çeviri; "Metalin thickness (kalınlık) değerine" ve "Metalin melting (erime) olması" yapıldı.
- 88-data-fabrika.js s03 miniSoru: "ışığı hakkında" yazım hatası, "ışık hakkında" yapıldı.
- veri-dogrula.js ve sinav-dogrula.js temiz.

## Doğrulananlar (hata yok)
Tüm doğru şıklar tek ve doğru. Tarihçe: Planck 1900 Berlin, Hertz 1887, Einstein 1905, Nobel 1921 (1921 fizik ödülü) doğru. Sınav havuzu s03 (m1-m8, k1-k4) İngilizce, cevap ve açıklamalar doğru (Wien yasası sabiti 2,9×10⁻³ m·K, Rayleigh-Jeans f² mod sayısı). Hesap görevi foto-cu: 3 adım, ara sorular doğru. test/hesap-engel.test.js s03 maddeleri geçti.

## Açık sorunlar
| sorun | konum | önerilen düzeltme | kesinlik |
|---|---|---|---|
| Blackbody tanımındaki "ısınınca sıcaklığına göre ışık yayar" cümlesi kart sınırı (4 madde, 25 kelime) yüzünden çıkarıldı; Wien kayması (yüksek T = daha kısa λ_max) sınavda (sv-s03-m8) soruluyor ama istasyonda anlatılmıyor | 90-data-s03.js o02 onBilgi | kavram sim'ine (karacisim) "T arttıkça tepe kısa dalga boyuna kayar" ipucu veya 4. sayfa; kart sınırı 3 sayfa olduğu için şema değişikliği gerekir | orta |
| Stopping potential (V₀ = K_max/e) sınavda (m4, k2) ve istasyon dışı hesapta var, onBilgi'de yok | 90-data-s03.js onBilgi | formüller kartına "eV₀ = K_max" maddesi (şu an kart dolu) | orta |
| Sınav "photoelectric effect: no time delay" (anlık emisyon) sınavda kullanılıyor, onBilgi'de yalnız tahmin açıklamasında geçiyor | 90-data-s03.js onBilgi | Intensity maddesine "emisyon gecikmesiz" eklemek | düşük |
| Doğru şık dosyada genellikle 1. sırada; çalışma zamanında karıştırılıyor | - | yok | düşük |
