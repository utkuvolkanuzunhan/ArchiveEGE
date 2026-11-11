## Durum
bitti

## Yapıldı
- src/js/41-art-runner.js: Q.art.drawRunner (7 durum), Q.art.drawObstacle (8 tip), Q.art.OBSTACLE_SIZE
- src/js/42-art-world.js: Q.art.drawWorld (4 katman, önbellekli)
- test/sanat.html: koşucu kareleri, engeller, dünya
- Playwright testi ilk çalıştırmada hatasız; maliyet ölçümü: dünya ~2.7 ms, diğerleri <1 ms (yazılım render)

## Kalan
Yok. (Test: 2 sn içinde 115 kare, hata yok.)

## Notlar
- Koordinat: x yatay merkez, y zemin. opts.p (0..1) isteğe bağlı durum ilerlemesi (cozuldu animasyonları).
- tema: string renk veya {renk, n}.
