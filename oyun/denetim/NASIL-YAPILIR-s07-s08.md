# Nasıl yapılır taraması: s07 ve s08

Yöntem: her engel için "cevap için gereken bilgi, o engelden ÖNCE verildi mi?" kontrol edildi. Kartlar kavram kapısı `onBilgi` (sayfa sınırı 6) içine, sim tanıtımı `tanitim`, engel yönlendirmesi `ipucu`, köprü `nedenler`, patron `onNot` alanına yazıldı. Sayısal örnekler Python ile doğrulandı. Hesap görevleri (h01) dokunulmadı. Playwright 1366x768: kartlar sim/soru öncesi açılıyor, sim ve patron ön kartı sığıyor.

## s07 Measurement (ölçüm) laboratuvarı

| Engel | Eksik öğretim | Eklenen |
|---|---|---|
| o02 kavram (olcum sim) | Sim kontrolleri (c₁² kaydırıcı, Measure, Tekrar measure, 100 times) tanıtılmamıştı; görev satırı belirsizdi | `tanitim` ile dört kontrol; gorev "Önce Measure (ölç), sonra Tekrar measure (ölç) düğmesine bas." |
| o03 düşman (ölçüm değerleri) | Kartta vardı, hangi kart belli değildi | `ipucu` -> "Measurement, collapse" kartı |
| o04 düşman (|c₁|²) | Katsayıdan olasılığa adım adım yöntem ve örnek yoktu | Kart "Nasıl yapılır: |c|² ile olasılık": 2 adım, örnek ψ = 0,6φ₁ + 0,8φ₂ (0,36 / 0,64), toplam kontrolü, katsayı toplama hatası; `ipucu` |
| o05 tahmin (tekrar ölçüm) | Kartta vardı | `ipucu` |
| o06 tuzak (denklem çökertir) | Kartta vardı | `ipucu` |
| o07 köprü (ölçüm döngüsü) | Sıra ve NEDENİ öğretilmemişti | Kart "Nasıl yapılır: ölçüm döngüsü" (blok cümlelerinden farklı), `ipucu`, 4 `nedenler` |
| o08 patron (açık cevaplar) | Cevap yazma sırası ve ⟨E⟩ yöntemi yoktu | `onNot` cevap sırası + örnek; ⟨E⟩ için kart "Nasıl yapılır: ⟨E⟩ hesabı": E₁=1, E₂=4 eV, |c|²=0,2/0,8, ⟨E⟩ = 3,4 eV, tek ölçümde görülmez |
| h01 hesap | Dokunulmadı | ⟨E⟩ kartı yöntemi önceden verir |

## s08 Calibration (kalibrasyon) odası

| Engel | Eksik öğretim | Eklenen |
|---|---|---|
| o02 kavram (belirsizlik sim) | σx kaydırıcısı, iki grafik, Conjugate düğmesi ve başarı eşiği (σx ≤ 1 nm, Conjugate açık) yazmıyordu | `tanitim`; gorev "σx kaydırıcısını 1 nm'ye indir; Conjugate açık kalsın." |
| o03 düşman (Δx küçülünce Δp) | Δp = ħ/(2Δx) hesabı ve ters orantı örneği yoktu | Kart "Nasıl yapılır: Δp bulmak": 3 adım, örnek Δx = 2 nm (Δp ≈ 2,6×10⁻²⁶), 0,5 nm (≈ 1,05×10⁻²⁵), kural; `ipucu` |
| o04 düşman (bilardo topu) | Δv = Δp/m ile büyük cisimde neden görünmediği hesapla gösterilmemişti | Kart "Nasıl yapılır: günlük cisim": m = 0,15 kg, Δx = 1 nm, Δv ≈ 3,5×10⁻²⁵ m/s; `ipucu` |
| o05 tahmin (σx yarıya) | Ters orantı yöntemi | Δp kartı (4 kat örneği) + `ipucu` |
| o06 tuzak (alet kusuru) | Kartta vardı | `ipucu` |
| o07 köprü (zincir) | Sıra ve NEDENİ öğretilmemişti | Kart "Nasıl yapılır: zincir sırası", `ipucu`, 4 `nedenler` |
| o08 patron (commutator, açık cevap) | [A,B] = AB − BA yöntemi ve commute eden çift örneği yoktu | `onNot`: tanım, sıfır/sıfırdan farklı yorumu, x ile V(x) örneği, cevap sırası |
| h01 hesap | Dokunulmadı | Δp kartı yöntemi önceden verir |
