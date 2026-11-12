# BUG-FINAL-s04 (Atom mikroskobu, son sürüm öncesi oyuncu denetimi)

Yöntem: Playwright 1366x768, hikayeAtla kapalı. Doğru yol baştan sona gerçekten oynandı (hikaye, 3 bilgi kartı, kavram sim'i n=3→m=2 + Photon, 2 düşman, tahmin+sim, tuzak, köprü, patron 3 faz, hesap engeli: önce yanlış sonra doğru adım, sandık, istasyon sonu). Yanlış yol (patron: yanlış, İkinci şans, voltaj 0 → kısa devre → "Temelden bir daha" kartı). Yenileme sonrası kayıt: ilerleme.s04 tamam, kart "bohr", fabrika.kurulu ["s04"] korunuyor. Konsol hatası: yok.

| sorun | konum | önem | düzeltildi mi |
|---|---|---|---|
| Patron/düşman yanlış cevap geri bildirim kutusunun son sözcükleri dock köşesindeki "Nasıl yapılır?" düğmesinin altında kalıyordu ("lower energy limit (alt enerji sınırı)" okunamıyordu) | oyun/src/styles/20-components.css (dock geri bildirim kutuları) | orta | evet (`.aciklama`/`.p5-box` sağ boşluk 140px; patron testi ve runner testi geçti, ekranla doğrulandı) |
| Patron Faz 2 yedek soru başlığı "H atom (H atomu) neden stable (kararlı)?" biçimi biraz tuhaf | 90-data-s04.js patron yedekSecmeli | düşük | hayır (kozmetik) |
| Patron balonunda hasar sayısı ("40") balon yazısının üstünden geçiyor (geçici animasyon) | patron sahnesi | düşük | hayır |
| Hesap adımı 1'in doğru cevabı 1,8897 eV (13,6 yerine 13,6057 ile); öğrenci 1,889 yazarsa %2 toleransla kabul | 87-data-hesap.js bohr-gecis | düşük | hayır (kullanıcı teyit etsin; fizik değişmedi) |

## Gözlemler (hata değil)
- Soru/balon cevap bitene kadar ekranda kalıyor; şık → Onayla → eminlik akışı çalışıyor; yanlış geri bildirim "Cevabın yanlış. Doğru seçenek: ..." (hesapta "Cevabın yanlış. Doğru: ...").
- Kavram öncesi kartlar (Bohr varsayımları, seviye/geçiş, ΔE ve λ=1240/ΔE, madde dalgası) terimleri öğretiyor; öğretilmemiş terim bulunmadı, kart eklenmedi.
- Hesap engeli örnek paneli (λ n=4→2) ve "Hazırım, görevi göster" akışı çalışıyor; yanlış adımda "Adımı göster / Örnekteki 1. adıma bak / Devam", doğru adımda "Sonraki adım".
- Sandık, istasyon sonu ve haritaya dönüş çalışıyor.
