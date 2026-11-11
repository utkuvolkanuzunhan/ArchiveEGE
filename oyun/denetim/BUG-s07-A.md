# BUG s07 grup A (o02 kavram, o03/o04 düşman) - oynama notu

Oynandı (Playwright, 1366x768 ve 1440x900, gerçek tıklama): o02 sim (Measure, Tekrar measure -> kapı açıldı, Devam), o03 YANLIŞ+Eminim (açıklama doğru gösterdi, voltaj 100->60), o04 DOĞRU+Eminim (voltaj 60->68). Konsol hatası yok.

- DÜZELTİLDİ: kavram simülasyon paneli (`#dock .kavram-sim`) `align-items:center` + `overflow:auto` yüzünden içerik taşınca üstü kırpılıyordu (canvas üstü, "superposition" etiketi, alttaki |c1|²/|c2|² durum satırı görünmüyordu; s06 notundaki 1366x768 gözlemiyle aynı neden). `align-items:safe center` ve max-height `-96px` -> `-56px` yapıldı; artık canvas ve durum satırı tam görünüyor (20-components.css).
- DÜZELTİLDİ: dusman baloncuğunda konuşan adı olarak ham skin kimliği ("vakans", "tane_siniri") görünüyordu; bilinmeyen küçük harfli kimlikler "Kusur düşmanı" olarak gösteriliyor (50-ui.js). Tüm istasyonları etkiler.
- Gözlem (düzeltilmedi): soru metni hem baloncukta hem dock'ta iki kez görünüyor (tasarım gereği olabilir).
- Gözlem: o02 görev satırı "Measure (ölç), sonra tekrar measure (ölç): result (sonuç) ne?" karışık dil; DIL-1 kuralına göre kabul edilebilir ama okunması ağır; veriye dokunulmadı.
- Seçenek sırası karışıyor, doğru işaretleme tutarlı: o03 doğru = "Yalnızca operator (operatör) eigenvalue (özdeğer) değerlerini", o04 doğru = "|c₁|²".
- Voltaj sayısı açıklama ekranında hemen güncellenmiyor, Devam sonrası güncelleniyor (60 -> 68); hasar uygulaması doğru.
