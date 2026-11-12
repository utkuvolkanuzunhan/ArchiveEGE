# Nasıl yapılır taraması: s09 ve s10

Not: kartlar kavram kapısının `nasil` alanında (onBilgi'den sonra, sim'den önce; sim açıkken "Nasıl yapılır?" düğmesiyle yeniden açılır). Dusman/tahmin/tuzak/köprü/patron engellerinden ÖNCE görülür. Sayısal örnekler Python ile doğrulandı. Köprü `nedenler` ve engel `ipucu` alanları dolduruldu. 1366x768: 7 kartın hepsi taşmadan açıldı, İleri düğmesi görünür (en alt 720 px).

## s09 Bant testi

| Engel | Eksik öğretim | Eklenen |
|---|---|---|
| o02 kavram (bant sim) | Sim kontrolleri (N kaydırıcısı, 3 malzeme düğmesi, Fill) tanıtılmamıştı; malzemeyi doluluk+E_g ile sınıflama yöntemi örneksizdi | `tanitim`; kart "Nasıl yapılır: malzemeyi belirle" (kapasite 2N, yarı dolu/tam dolu, E_g; örnek N=10) ve "bant simülasyonu" |
| o03 düşman (Pauli kapasitesi) | Yok, kart 2 kapsıyor | `ipucu` |
| o04 düşman (yalıtkan) | Dolu band + E_g yöntemi adımsızdı | "malzemeyi belirle" kartı + `ipucu` |
| o05 tahmin (N atom, seviye) | Yok, kart 1 kapsıyor | `ipucu` |
| o06 tuzak (tek kuyu) | Yok, kart 1 kapsıyor | `ipucu` |
| o07 köprü (bant zinciri) | Sıranın nedeni öğretilmemişti | Kart "zincir ve cevap" (nedensellik sırası, neden etkileşme önce) + `ipucu` + `nedenler` (4) |
| o08 patron (açık cevap, dolu band) | Açık cevap şablonu ve dolu bandın akım taşımama gerekçesi yoktu | "zincir ve cevap" kartında şablon ve gerekçe |
| h01 hesap (Si eşik λ) | Dokunulmadı; yöntem için kart | "gap ve foton" kartı: λ_max = hc/E_g, örnek Ge 0,67 eV = 1850 nm |

## s10 Paketleme

| Engel | Eksik öğretim | Eklenen |
|---|---|---|
| o02 kavram (fermi sim) | Sim kontrolleri (T, E_F, E kaydırıcıları, alttaki satır) tanıtılmamıştı | `tanitim` |
| o03 düşman (f(E_F)) | f(E) hesap adımları ve örnek yoktu | Kart "f(E) hesabı": 3 adım, örnek 0,06 eV/500 K (f=0,20), −0,05 eV/300 K (f=0,87); E=E_F kullanıcıya bırakıldı (sızdırmadan) + `ipucu` |
| o04 düşman (np=nᵢ²) | Hesap örneği yoktu | Kart "np = nᵢ²": nᵢ=10¹⁰, n=10¹⁴ -> p=10⁶ + `ipucu` |
| o05 tahmin (T 300 -> 50 K) | kT ile geçiş genişliği ilişkisi örneksizdi | Kart "sıcaklık ve kT": 600 -> 150 K, kT 51,7 -> 12,9 meV + `ipucu` |
| o06 tuzak (f(E_F)=1) | Yok, f(E) kartı kapsıyor | `ipucu` |
| o07 köprü (drift zinciri) | Sıra ve nedeni öğretilmemişti | Kart "drift zinciri" + örnek v_d=500·20=10⁴ cm/s, J=1,6 A/cm² + `ipucu` + `nedenler` (4) |
| o08 patron (açık cevap) | Açık cevap şablonu yoktu | "sıcaklık ve kT" kartında şablon |
| h01 hesap (fd-100meV) | Dokunulmadı; yöntem için kart | "f(E) hesabı" kartı (farklı sayılarla) |
