# ICERIK-s07 · İstasyon 07 (Ölçüm laboratuvarı) kapsamlı içerik denetimi

Kapsam: `90-data-s07.js`, `87-data-hesap.js` (olc-p, olc-E), `92-data-sinav-2.js` (s07-m1..m10, s07-k1..k4), `93-data-sinav-3.js` (sv-s07-k5/k6), `89-data-kartlar.js` (neumann), `88-data-fabrika.js` (s07), `istasyonlar/07-*.md`.

Hesap yeniden hesaplandı: olc-p A = 1/√5 = 0,4472, P(E₂) = 4/5 = 0,8; olc-E E₁ = 0,3760/4 = 0,0940 eV, E₂ = 0,376 eV, ⟨E⟩ = 0,75·0,094 + 0,25·0,376 = 0,1645 eV = 1,75·E₁. adimSoru cevapları (A = 0,4472; E₁ = 0,094 eV) ve sonuçlar doğru.
Sınav: m1..m10 ve k1..k6 doğru şıkları tekil ve doğru (m2 3E₁, m3 4/5, m9 3E₁/ħ, m7 iħ, k2 P = 1/3, 2/3, ⟨E⟩ = 3E₁). Oyun içi o03-o05, tuzak, köprü, patron fazlarında yanlış cevap/çoklu doğru yok.
Playwright ile tam oyun testi bu ortamda yapılmadı (yalnız statik inceleme + doğrulayıcılar).

## Düzeltilenler
- Hikaye kartı: "bu yorum sonradan Nobel aldı" (yorum değil Born aldı) -> "Born bu çalışmasıyla 1954'te Nobel aldı."
- Kavram kapısı: sınav (m6, k4) ve hesap görevi (olc-E) Hermitian operatör ve beklenen değeri istiyor, hiçbir yerde anlatılmıyordu. Sayfa 1'e Hermitian (Hermityen) maddesi, sayfa 3'e ⟨E⟩ = Σ|cₙ|²Eₙ (expectation value) eklendi.

## Açık bırakılanlar
| sorun | konum | önerilen düzeltme | kesinlik |
|---|---|---|---|
| Sınav s07-m7/k4 komütatör [x̂,p̂] = iħ'yi soruyor; anlatım s08'de (sonraki istasyon). | `92-data-sinav-2.js`, `90-data-s08.js` | Soruları s08 havuzuna taşı ya da s07 kapısına komütatör maddesi ekle (kavram kapısı 3 sayfa/4 madde dolu) | yüksek (gözlem) |
| s07-m8/m9/m10/k3 (stationary state, e^(−iEt/ħ), |ψ|² salınımı) s07'de anlatılmıyor; s05'te var sayılıyor. | `92-data-sinav-2.js` | s05 kapısında stationary state (durağan durum) var mı kontrol et; yoksa ekle | orta |
| Kavram sim'i (c1sq 0,3, ölç-tekrar ölç) ile o05 tahmin sorusu aynı deney; cevap kapıda görülüyor. | `90-data-s07.js` o02/o05 | Tahmini farklı soruya çevir (ör. ikinci ölçümde öteki sonuç olasılığı) | orta (pedagojik karar) |
| Hikaye "ölçüm üçüncü ve dördüncüde" postülat numarası kursa bağlı (k5 listesinde 3 ve 4 ölçüm; tutarlı) ama başka kaynaklarda farklı numaralanabilir. | `90-data-s07.js` o01 | Gerekirse "ölçüm postülatları" de | düşük |
| Faz 1 yanlış şıkkı "Zero energy" zayıf çeldirici. | `90-data-s07.js` o08 faz 1 | "Enerji değeri her zaman kesin" gibi gerçek yanılgı | düşük |
