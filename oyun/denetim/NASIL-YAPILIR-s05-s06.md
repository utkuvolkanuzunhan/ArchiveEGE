# Nasıl yapılır taraması: s05 ve s06

Not: onBilgi yalnızca hikaye ve kavram kapısında açılır; dusman, tahmin, tuzak, köprü ve patron engellerinden ÖNCE bu kartlar görülür. Sayfa sınırı 3'ten 6'ya çıkarıldı (`79-onbilgi.js` slice, `veri-dogrula.js`). Sayısal örnekler Python ile doğrulandı. Sim kontrolleri kavram `tanitim` alanında (sim ekranında görünür).

## s05 Dalga odası

| Engel | Eksik öğretim | Eklenen |
|---|---|---|
| o02 kavram (kuyu sim) | Sim kontrolleri (L kaydırıcısı, n düğmeleri, n=0 dene, Wire/Well) tanıtılmamıştı | `tanitim` alanı; gorev "L kaydırıcısıyla ..." |
| o03 düşman (ψ) | Yok, kart 1 kapsıyor | `ipucu` kart yönlendirmesi |
| o04 düşman (girdi/çıktı) | Yok, kart 2 kapsıyor | `ipucu` |
| o05 tahmin (L yarıya, E₁) | E_yeni/E_eski = (L_eski/L_yeni)² yöntemi ve sayısal örnek yoktu | Kart "Nasıl yapılır: L değişince E": 2 adım + örnek L 6→2 nm (9 kat), tersi örnek |
| o06 tuzak (sıcaklık) | Sıcaklığın hesapta yer almadığı açık değildi | "ψ ve izinli E" kartında madde + `ipucu` |
| o07 köprü (quantization zinciri) | Sıranın nedeni öğretilmemişti | "ψ ve izinli E" kartında "zincir sırası nedensellik sırasıdır" maddesi (bloklardan farklı cümle) + `ipucu` |
| o08 patron açık (ψ, E bul) | 0,376·n²/L² kullanımı ve ψ yazımı örneksizdi | Örnek L=0,5 nm, n=2: ψ = 2 sin(4πx), E = 6,02 eV |
| h01 hesap | Dokunulmadı | |

## s06 Tünel istasyonu

| Engel | Eksik öğretim | Eklenen |
|---|---|---|
| o02 kavram (basamak sim, R 0,1-0,2) | r formülü, E/V₀ ile R ilişkisi ve sim kontrolleri yoktu | Kart "Nasıl yapılır: step'te R ve T"; `tanitim`; gorev "E'yi V₀'a yaklaştırarak R'yi 0,1-0,2 yap; E > V₀ kalsın." (E=1,25, V₀=1 için R=0,146) |
| o03 düşman (E>V₀ yansıma) | k₁≠k₂ ise r≠0 | `ipucu` + örnek E=2, V₀=1 (R=0,029) |
| o04 düşman (bariyerde ψ) | Yok, kartlar kapsıyor | `ipucu` |
| o05 tahmin (kalınlık) | κ hesabı ve e^(−2κa) karşılaştırma örneği yoktu | Kart "Nasıl yapılır: bariyerde T": V₀−E=1 eV, a 0,2→0,6 nm, T yaklaşık 60 kat düşer; üstel ≠ lineer |
| o06 tuzak | Yok, kartlar kapsıyor | `ipucu` |
| o07 köprü (step çözüm sırası) | Sıra ve nedeni öğretilmemişti | Kartta "Sıra: ψ yaz, süreklilik koy, r ve t çöz, R ve T" + örnek k₁=2, k₂=1 (r=1/3, R=1/9, T=8/9) + `ipucu` |
| o08 patron | R=1 (E<V₀) başka ajanın hikaye kartında var | r ve R hesap örnekleri yeterli |
| h01 hesap | Dokunulmadı | |
