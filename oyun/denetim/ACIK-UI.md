# ACIK-UI: ICERIK-s05/s07/s08 UI maddeleri

Tarama: Playwright, 1366x768 ve 1440x900, tüm istasyonların kavram + tahmin sim'leri (kristal_tur, kafes, miller, karacisim, fotoelektrik, bohr, kuyu, basamak, olcum, belirsizlik, bant, fermi).

| Sorun | Durum | Düzeltme |
|---|---|---|
| Kavram sim'leri dock'a sığmıyor (1366x768: 8 sim, 1440x900: 8 sim; en kötü fermi +74 px, olcum +58 px; alt düğmeler kırpılıyor) | Düzeltildi, tarama temiz | `80-obs-kavram.js` `sigdir()`: dock taşarsa sim içeriğini zoom ile (en az 0,55) ölçekler, genişlik telafili; resize ve İpucu/Geç/ipucu satırı açılınca yeniden. |
| s05 kuyu sim: Wire/Well düğmesi dock dışında | Düzeltildi | `70-sim-kuyu.js`: Wire/Well düğmesi seviye satırına alındı (flex-wrap), alçak ekranda canvas yüksekliği 0,14·innerHeight (min 100). |
| "KISA DEVRE" rozeti review kartını örtüyor | Düzeltildi | `toast` seçeneği `ust:true`: body'ye eklenir, HUD altında (top:78px) gösterilir (`50-ui.js`, `60-battle.js`, `20-components.css`). |
| Hesap formül satırında boşluk çökmesi (q5-bolgeler "I: ...   II: ...") | Düzeltildi | `86-obs-hesap.js` `.hg-formul{white-space:pre-wrap}`. |
| Tahmin sim'leri (o05) dock'a sığıyor | Sorun yok | tarama temiz |

Açık (UI değil, pedagojik karar): s05/s07/s08 o02 kavram sim'i ile o05 tahmin aynı deney (ICERIK dosyalarında "karar gerekli"); s07 komütatör sorusu s08'de anlatılıyor (içerik/sıralama). Dokunulmadı.

Bilinen küçük: s06 basamak sim'inde canvas üstündeki "E" etiketi ölçeklenince kenara yakın (sim'in kendi çizimi).
