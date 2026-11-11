# BUG s06 grup A (o02 kavram, o03/o04 düşman) - kısa not

- o02 basamak sim: başarı R:[0.1,0.2] kaydırıcılarla erişilebilir (E=3.00, V0=2.40 -> R=0.15; analitik V0/E in [0.73,0.855], adım 0.05'te 5+ nokta). Düzeltme gerekmedi.
- Bilinen S9 hatası (T:[1e-3,1], a=1.5, T=7.6e-5): s06 verisinde `basari.tunel/T` kullanan engel YOK (o05 yalnızca onceki/sonraki gösterimi, basari yok), dolayısıyla s06 oynanışını etkilemiyor. Başka istasyon bariyer+T hedefi kullanırsa E/V0 oranı ve a<=0.6 seçilmeli (a=1.5 nm, V0-E=2 eV için T~1e-4 ile 1e-5 civarı); sim kodu değiştirilmedi.
- Gözlem (düzeltilmedi): 1366x768'de sim açılınca görev paneli kaydırılmış görünüyor, canvas üst kısmı (potansiyel profili, R çubuğu) kırpılıyor; panel yüksekliği (Q.runner/arayüz) dar. Konsol hatası yok (yalnızca engellenen Google Fonts).
- o03/o04 düşman akışı DOĞRU/YANLIŞ tam oynanmadı (süre sınırı); veri-dogrula ile veri tutarlılığı denetlendi.
