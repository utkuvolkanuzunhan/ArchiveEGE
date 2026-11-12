# ICERIK-s08 · İstasyon 08 (Kalibrasyon odası) kapsamlı içerik denetimi

Kapsam: `90-data-s08.js`, `87-data-hesap.js` (bel-v, bel-t), `92-data-sinav-2.js` (s08-m1..m10, s08-k1..k4), `89-data-kartlar.js` (kennard), `88-data-fabrika.js` (s08), `istasyonlar/08-*.md`.

Python ile yeniden hesaplandı: Δp = ħ/(2Δx) = 5,275e-25 kg·m/s, Δv = 579,1 km/s (ħ = 1,055e-34, m = 9,109e-31); bel-t ΔE = 0,3291 µeV; m2 5,3e-25, m3 5,8e5 m/s, m4 3,6e-31 m/s, m5 3,3e-8 eV, m9 ħ²/(8mL²), m10 5e5 m⁻¹, k3 0,95 eV hepsi doğru; sınav doğru şıkları tekil.
Playwright 1366x768, hikayeAtla KAPALI: hikaye, bilgi kartları, kavram sim, o03-o05, tuzak, köprü, patron (3 faz, açık uç yalnız kendi puanlama) ve hesap engeli takılmadan çalıştı; konsol hatası yok. Hesap adım 1'de 5,275 doğru kabul edildi.

## Düzeltilenler
- bel-v: Δp 5,273 yazılıydı, listedeki ħ = 1,055e-34 ile 5,275 olmalı; sonuç 578,8 -> 579,1 km/s (adimSoru cevabı ve sonuç metni).
- bel-t ipucu: "dikkatli ifade et" yazar notu öğrenciye görünüyordu; "Burada Δt durumun ömrüdür" yapıldı.
- Kavram kapısı: sınav (m10, m6, k1) wavenumber Δk soruyor, anlatılmıyordu; p = ħk, Δx Δk ≥ 1/2 eklendi. m9/k3 (hapsolma enerji tahmini) ve m5/k4/bel-t (ΔE Δt ≥ ħ/2) hiç anlatılmıyordu; ilgili maddeler eklendi (maddeler birleştirilerek 4 madde sınırı korundu). x ile p_y commute örneği (m7) eklendi.
- s08-k2 ideal cevap: "10³¹ kat daha küçük" doğrulanamaz iddiaydı; "ölçülebilir her şeyin çok altında" yapıldı.

## Açık bırakılanlar
| sorun | konum | önerilen düzeltme | kesinlik |
|---|---|---|---|
| Kavram sim'i (sx 3->daralt) ile o05 tahmin (σx 2->1) aynı deney; cevap kapıda görülüyor. | `90-data-s08.js` o02/o05 | Tahmini farklı soruya çevir (ör. σx üçte birine inerse σp) | orta (pedagojik karar) |
| s08-m7 çeldiricisi L_x, L_y (açısal momentum) ve m6 "Fourier-conjugate" oyunda anlatılmıyor; eleme ile çözülür. | `92-data-sinav-2.js` | Çeldiriciyi anlatılmış bir çiftle değiştir ya da s08 kapısına açısal momentum notu | düşük |
| o03 "Δx küçülürse Δp büyür" ifadesi kesin değil (alt sınır; Δp zaten büyükse küçülmeyebilir); sınav düzeyinde kabul edilebilir. | `90-data-s08.js` o03 | "en az ... büyümek zorunda" | düşük |
| Patron faz 2 yanlisKavramIds ikisi de belirsizlik_alet; ikinci yanılgı (ölçüm bozar) ayrı kavram id'si gerektirir. | `90-data-s08.js` o08 faz 2 | Yeni kavram id'si ya da mevcut en yakını | düşük |
