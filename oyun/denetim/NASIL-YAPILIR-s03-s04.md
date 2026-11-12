# NASIL-YAPILIR · s03 ve s04 (yöntem öğretilmeden sorulan engeller)

Yöntem: her engel için "cevaplamak için gereken bilgi/yöntem, engelden önce verildi mi?" kontrol edildi. Eksikler veri dosyalarına (90-data-s03.js, 90-data-s04.js) eklendi; sayısal örnekler Python ile doğrulandı. Playwright 1366x768: kartlar (düğme y ≤ 674) ve onNot kartı sığıyor, sim tanıtımı görev satırının altında kalıyor.

## s03 Işık-test odası
| Engel | Eksik öğretim | Eklenen |
|---|---|---|
| o02 kavram (kara cisim sim) | Eksenler ve iki kontrol (sıcaklık çubuğu, Classical curve düğmesi) tanıtılmamıştı | `tanitim`: eksenler, çubuk, düğme, nereye bakılacağı |
| o04 düşman (E = hf) | E değerinin f veya λ'dan nasıl bulunacağı yoktu | o01 kart 1 "Foton enerjisi nasıl bulunur": E = hf, E = 1240/λ, örnek 620 nm = 2,0 eV (310 nm = 4,0 eV) |
| o05 tahmin, o06 tuzak (eşik) | Eşik kıyası adımları ve şiddetin rolü yöntem olarak verilmemişti | o01 kart 2 "Eşik kıyası": E bul, φ ile kıyasla, E ≥ φ ise K = E − φ; örnek φ = 4,3 eV, λ = 200 nm: E = 6,2 eV, K = 1,9 eV, şiddet 10 kat: K aynı |
| o07 köprü (sıralama) | Sıranın doğru düzeni ve nedeni öğretilmemişti | o01 kart 3 "Mantık zinciri nasıl kurulur": nesne, tek parçanın özelliği, eşik kıyası, çoğaltan etken; neden: her adım öncekinin sonucunu kullanır (köprü cümleleri kopyalanmadı) |
| o08 patron faz 1 (K, E = hf ikiye katla) | Kart 1 ve 2 ile karşılandı | ek yok |
| o08 patron faz 2-3 (açık cevap) | Klasik dalga modelinin ne öngördüğü ve cevap şablonu yoktu | patron `onNot`: 3 adımlı şablon + "klasik modelde şiddet energy artırır; deneyde eşik var, gecikme yok" |
| o03 düşman, h01 hesap | Önceden karşılanmıştı (kart 1) / hesap dosyasına dokunulmadı | ek yok |

## s04 Atom mikroskobu
| Engel | Eksik öğretim | Eklenen |
|---|---|---|
| o02 kavram (Bohr sim) | Initial n / Final m / Photon düğmesi ve bilgi satırı tanıtılmamıştı | `tanitim`: üst/alt seviye seçimi, düğme, ΔE-λ satırı |
| o02 görev (3 den 2 ye rengi), o03 | ΔE ve λ hesabı adımları yoktu | o01 kart 3 "Geçiş ve dalga hesabı nasıl yapılır": ΔE = 13,6·abs(1/n_alt² − 1/n_üst²), λ = 1240/ΔE; örnek 4 den 3 e: ΔE = 0,66 eV, λ ≈ 1880 nm (kızıl ötesi); görünür aralık 380-750 nm |
| o04 düşman (bilardo topu) | p = mv, λ = h/p ile büyüklük hesabı yoktu | aynı kart: 0,06 kg top, 30 m/s: p = 1,8, λ ≈ 3,7×10⁻³⁴ m |
| o05 tahmin (n=1 altı) | n'nin yalnızca tam sayı (1, 2, 3...) olduğu belirtilmemişti | aynı kart: Eₙ yalnızca tam sayı n için tanımlı (sonuç yazılmadı) |
| o06 tuzak | Kartlarda karşılanmıştı | ek yok |
| o07 köprü (kararlılık zinciri) | Sıra ve nedeni yoktu | o01 kart 2'ye madde (model, kısıt, enerjiye etkisi, sonuç; gitar teli benzetmesi) + köprü `onNot` "Önce bil" (her adım öncekinin sonucunu kullanır) |
| o08 patron (açık cevaplar) | Cevap şablonu ve madde dalgası gerekçesi yoktu | patron `onNot`: klasik / quantum / sonuç şablonu, λ = h/p ile günlük cisim - atom karşılaştırması |
| h01 hesap | Hesap dosyasına dokunulmadı | ek yok |

Notlar: sayfa ≤4 madde ve madde ≤25 kelime sınırları için veri-dogrula.js temiz; sinav-dogrula.js temiz. Köprü "İpucu", "Önceki bilgiyi aç" ve "neden" mekanizması diğer ajanda; s03/s04 köprü verisine `neden`/`ipucu` alanı o mekanizma hazır olunca eklenebilir.
