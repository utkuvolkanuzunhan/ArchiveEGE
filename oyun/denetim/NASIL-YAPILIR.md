# Nasıl yapılır: ön öğretim denetimi

Kural: sayısal ya da prosedür isteyen her soru/görev, ilk sorudan ÖNCE öğretilmiş olmalı.

## Ortak mekanizma (tüm istasyonlar)

Veri alanları (`90-data-sNN.js`):

| alan | engel | sınır | anlam |
|---|---|---|---|
| `nasil` | `kavram` | 1-4 sayfa; başlık ≤6 kelime; sayfa başına 1-4 madde, madde ≤25 kelime (`veri-dogrula.js`) | "Nasıl yapılır" sayfaları: numaralı tarif, çözülmüş örnek (soruyla FARKLI sayılar), sim kullanımı. `onBilgi` kartlarından sonra, sim'den ÖNCE otomatik açılır ("Göreve geç"). `onBilgi` değişmez (1-3 sayfa). |
| `ipucu` | `kopru` | ≤25 kelime | Köprü ekranında kartların üstündeki "İpucu:" satırı. Yoksa genel bir cümle gösterilir. |
| `nedenler` | `kopru` | `bloklar` ile AYNI uzunluk (doğru sıraya göre), her biri ≤25 kelime | Yanlış sırada "Doğru sıra" listesinde her adımın altında "Neden: ..." yazar. |

Arayüz:
- `Q.onBilgi.ac(sid, {hepsi})`: kartları ekran üstü kaplamada açar (Kapat / ✕); alttaki engel durumu bozulmaz. `nasil` sayfası varsa yalnızca onlar, yoksa istasyonun bütün kartları; `{hepsi:true}` her zaman tüm kartlar (hikaye + kavram onBilgi + nasil).
- `Q.onBilgi.dugme(sid, etiket, opt)`: düğme üretir. Kavram sim ekranı ("Nasıl yapılır?"), köprü ("Önceki bilgiyi aç"), düşman/tahmin/tuzak/patron (dock sağ üst köşesi, `95-runner.js`).
- `Q.onBilgi.hepsi(sid)` artık `nasil` sayfalarını da içerir.
- Not: `hikayeAtla` açıksa otomatik açılış atlanır; düğmeler her zaman çalışır.

## s01-s02 envanteri: engel | eksik öğretim | eklenen

| engel | eksik öğretim | eklenen |
|---|---|---|
| s01-o02 kavram (kristal_tur sim) | sim düğmeleri (Single/Poly/Amorphous) ne yapar, ne gözlenir | `nasil[0]` sim kullanımı |
| s01-o05 tahmin (mean free path) | bozukluk → saçılma → serbest yol karşılaştırma yöntemi | `nasil[1]` + sayısal örnek (tane 50 nm / 10 nm) |
| s01-h01 hesap (atom yoğunluğu) | n = N/a³ prosedürü, nm→cm | `nasil[2]` germanium örneği (a=0,565 nm, 4,4×10²² cm⁻³) |
| s01-o07 köprü | sıralama sorusu nasıl çözülür; adımların nedeni | `nasil[3]`, `ipucu`, `nedenler` |
| s01-o03/o04/o06/o08 | kavram tanımları zaten `onBilgi`/`tanitim`/`onNot` içinde | değişiklik yok |
| s02-o05 tahmin (2,∞,∞ → Miller) | kesişim → ters → ortak katla tam sayı yöntemi HİÇ yoktu | `nasil[0]` 4 adımlı tarif, `nasil[1]` çözülmüş örnek (3, 1, 3/2 → (132); 3, 3, ∞ → (110)) |
| s02-o07 köprü (Miller adımları) | doğru sıra ve nedeni anlatılmamıştı | tarif sırası `nasil[0]`'da, `ipucu`, `nedenler` (yanlış sırada Neden: ...) |
| s02-o02 kavram (kafes sim) | Say/−/+/Kontrol kullanımı; atom paylaşımı | `nasil[2]` atom sayma kuralı + `nasil[3]` sim kullanımı |
| s02-o03 düşman (bcc atom sayısı) | sayma tarifi + örnek yoktu | `nasil[2]` (8·1/8 + 6·1/2 + 1 = 5, farazi hücre) |
| s02-o08 patron (d, yön, indis) | d = a/√(h²+k²+l²) ve yön indirgeme örneksizdi | `nasil[2]` (a=0,40 nm (111) → 0,231 nm; [200] → [100]) |
| s02 Miller sim | adımlar şeridi (Intercept/Reciprocal/Integers/Result) ve 1/2/3/∞ düğmeleri | `nasil[3]` |

Sayısal örnekler Python ile doğrulandı: (3, 1, 3/2) → (132); (3, 3, ∞) → (110); 0,40/√3 = 0,2309 nm; 8/8+6/2+1 = 5; 8/(0,565×10⁻⁷)³ = 4,436×10²² cm⁻³.

## s03-s10
Başka ajanlar yazıyor; aynı `nasil`/`ipucu`/`nedenler` alanlarını kullanır.
