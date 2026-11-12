# KART · Kart koleksiyonu yeniden yazıldı

Sorun: haritadaki "Kart koleksiyonu" kartları `patronId` ile arıyordu, kayıtta ise sandık `kart.id` tutuluyor; ayrıca kilitli kartlar "?" idi ve tıklama yoktu.

## Yapılan
- `src/js/21-kartlar.js` (yeni): `Q.kartlar.liste/bul/detayDom/koleksiyon`. Kart listesi sandık engellerinden (`kart: {id, yil, tekCumle}`, s01-s10 = 10 kart: czoch, miller, einstein, bohr, schro, broglie, born, heis, pauli, fermi) türetilir; kazanma `Q.state.kartlar` (kayıt cip-hatti-v1 değişmedi).
- `src/js/89-data-kartlar.js` (yeni): `Q.data.kartlar[id] = { p1, p2, p3?, sinav:[2-3] }`. Yalnızca kesin bilinen gerçekler; p3 yalnızca sezgi/yanılgı gerektiren kartlarda.
- `src/styles/25-kartlar.css` (yeni).
- Harita (`20-settings.js`): iki sütun; solda istasyon karoları + istasyonlara göre gruplu koleksiyon (renkli şerit, makine ikonu, "x/y kart" ilerlemesi, kazanılan kart renkli portre + ad + yıl + tek cümle; kilitli kart silüet + "istasyonunu bitir" ipucu), sağda panel (istasyon paneli ve kart detayı aynı yerde). Dar ekranda (<900px) alttan açılan panel. Esc / Kapat ile kapanır, harita ekranda kalır, odak karta döner. Kartlar buton: Tab, ok tuşları, Enter. Kilitli kartın içeriği paneli açsa da sızmaz.
- Tekrar Merkezi "Açıklama kartları": sandık kartı yerine aynı detay görünümü (içerik kilitli olsa da açık), listenin başında.
- `veri-dogrula.js`: her sandık kartının metni var mı, p1/p2/p3 ≤90 kelime, sinav 2-3 madde, yetim kart yok.
- `test/kartlar.test.js`: 1366x768, 1440x900, 700x800; kazanılmış/kilitli, panel, kaydırma, taşma, Esc, klavye, Tekrar Merkezi.

## Notlar
- Her istasyonda 1 kart var (10 toplam); "2/3" gibi ilerleme olursa grup yapısı hazır.
- `Q.settings.machineIcon` dışa açıldı. Harita kutusu artık 1240px'e kadar genişler (eskiden 560px).
- Metinler "tarih/ödül" konusunda yalnızca emin olunanları içerir; Nobel yılları yalnızca bilinenler yazıldı (Bohr 1922, Heisenberg 1932, Schrödinger 1933, Fermi 1938, de Broglie 1929, Pauli 1945, Born 1954; Einstein yıl yazılmadı). İçeriği yine de ders notlarıyla karşılaştır.
