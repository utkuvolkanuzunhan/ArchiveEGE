# UX-1 · Yeni oyuncu gözüyle s01 + s02 (1366x768, hikâye açık, kilitler kapalı)

Yöntem: ilk açılış, harita, ayarlar, sonra s01 ve s02 engelleri Playwright ekran görüntüsüyle oynandı.

## Bulgular ve düzeltmeler

### (1) Anlatılmadan sorulan terimler
| Yer | Sorun | Düzeltme |
|---|---|---|
| s01-o02 kavram | single/poly/amorphous, scattering, mean free path hiç tanımlı değil; sim yalnızca üç düğme gösteriyor | `tanitim` alanı (kavram kapısında görev satırının altında, görev bitene kadar ekranda) |
| s01-o03/o04 | amorphous, long-range order, grain boundary ancak o02 tanıtımıyla anlaşılır | o02 `tanitim` bunları kapsıyor |
| s01-o07 köprü | lattice, periodic potential, energy band s01'de hiç tanıtılmıyor (asıl konu s05) | `onBilgi` "Önce bil" kartı |
| s01-o08 patron | CZ yöntemi, seed crystal, ingot soruda geçiyor ama hiçbir yerde anlatılmıyor (yalnızca kısa devrede temel tur); eminlik seçimi de ilk kez burada | `onBilgi`: CZ anlatımı + "şıkkın yanında eminliğini de seç" |
| s02-o02 kavram | köşe 1/8, yüz 1/2 kuralı yalnızca görevden SONRA (`ogrenilen`) söyleniyordu | `tanitim` |
| s02-o04 | diamond structure ve nearest neighbor tanımsız | `onBilgi` |
| s02-o05 | Miller indices, intercept, reciprocal köprüden (o07) ÖNCE soruluyor | `onBilgi` (tek cümle tarif) |
| s02-o08 patron | (hkl)/{hkl}/[uvw] gösterimi ve wafer tanımsız | `onBilgi` |

Mekanizma: veride `tanitim` (kavram, satır içi, en çok 45 kelime) ve `onNot` (kavram dışı engeller; başka ajanın `onBilgi` Bilgi kartı sayfalarından ayrı, açılmadan önce tek kart + "Anladım"/Enter, en çok 50 kelime; Esc menüsünden atla/geri dönüşte kart kapanır). `veri-dogrula.js` iki alanı da denetliyor. Hikâye (3 satır ≤20) ve görev (≤12) sınırlarına dokunulmadı.

### (2) Yönlendirme
- Hoş geldin ekranı yalnızca "9 istasyon, engelleri geç" diyordu (istasyon sayısı da yanlış, s10 var). Yeni metin: istasyonları sırayla geç; engele varınca soru/görev açılır; cevapla, ilerle.
- HUD'da yalnızca "bağlı değil" yazıyordu, neyin olduğu belli değildi. Artık "Claude: bağlı değil".
- s02-o02 sim: gösterim "4 atoms" cevabı baştan veriyor; asıl görev "Say" düğmesine basınca başlıyor ama hiçbir yerde yazmıyordu. Görev: "Say düğmesine bas; ...". Düğme "Say (Count)"; "elmas" etiketi "diamond (elmas)".
- Köprü: ne yapılacağı yazmıyordu (kartlara dokun, sırayla dizilir, dolunca Kontrol). Soru satırına eklendi.
- Kavram kapısı İpucu 45 sn, Geç 120 sn sonra çıkıyordu: takılan kullanıcı 45 sn boşa bekliyordu. 15 sn / 60 sn yapıldı.

### (3) Hız
Engel başına ölü süre (koşu + yavaşlama + intro + çıkış) yaklaşık 7-8 sn idi. `BASE_V` 260 -> 360, `DECEL` 1.4 -> 1.0, `INTRO` 1.2 -> 0.7, `ACCEL` 0.8 -> 0.5; hikâye satırı bekleme 2.2 sn -> 1.65 sn (tıklayınca zaten geçiyor). `runner.test.js` T1 yavaşlama beklentisi 1.0 sn'ye güncellendi. Oyun hızı ayarı çalışmaya devam ediyor.

### (4) İngilizce terim yoğunluğu
Satır içi `English (Türkçe)` s01/s02'de okunur; en yoğun yerler köprü blokları ve patron şıkları (uzun parantezler). Dokunulmadı (DIL-1 kuralı). Tanıtım metinleri terimi tek seferde tanımlayıp parantezle veriyor, sonraki sorular kısa terimle devam ediyor.

## Açık / öneri (yapılmadı)
- s01 hikâye balonları iki karakteri üst üste bindirip koşucuyu kapatıyor; yalnızca görsel.
- `ui.test.js` "options orijinal indeks" adımı şık seçince Onayla beklenmediği için 30 sn zaman aşımına düşüyor (önceden var olan, Onayla akışından kalma test hatası).
- Patron ekranında "Ne kadar eminsin?" şıkların altında ve Onayla'nın altında; 1366x768'de sığıyor ama dock'u dolduruyor.
- Haritada ilerleme çubuğu (boş çerçeve) başlangıçta etiketsiz görünüyor.
