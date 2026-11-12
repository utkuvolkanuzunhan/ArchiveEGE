# BUG-FINAL-s08 (Kalibrasyon odası, son sürüm öncesi oyuncu denetimi)

Yöntem: Playwright 1366x768, hikayeAtla kapalı, kilitler kapalı (s01-s07 Q.state ile tamam). Doğru yol baştan sona oynandı: hikaye (3 satır + bilgi kartı), 6 bilgi kartı, kavram sim'i (slider ile gerçekten 1 nm'ye indirildi), 2 düşman, tahmin+sim, tuzak, köprü, patron 3 faz (Claude kapalı: faz 1 seçmeli, faz 2 ve 3 metin gönder, sonra yedek çoktan seçmeli), hesap engeli (örnek paneli adım adım, 1. adım yanlış sonra doğru, 2. adım, sonuç, Çözdüm), sandık, istasyon sonu, haritaya dönüş. Yanlış yol: düşman x2, tahmin, tuzak, köprü (doğru sıra + "Neden" açıklamaları gösteriliyor), patron faz 1 yanlış + ikinci şans yanlış, voltaj 0 ile kısa devre ("Temelden bir daha" 3 kart + sim, sonra istasyon başa dönüyor, hata defteri +1). Ek: Conjugate kapalıyken σx=1 nm görevi tamamlamıyor (doğru). Yenileme: istasyon sonu sonrası ilerleme.s08.tamam=true, fabrika.kurulu s08 ve kart "heis" korunuyor; istasyon ortasında yenileme haritaya dönüyor, ilerleme kaybolmuyor. Konsol/sayfa hatası: yok. Taşma: yok (köprü ve hesap panelleri 1366x768'de iç kaydırmayla sığıyor, Devam/Sonucu göster erişilebilir).

Fizik/sayı kontrolü: bilgi kartlarındaki örnekler (Δx=2 nm → 2,6×10⁻²⁶; 0,5 nm → 1,05×10⁻²⁵; top m=0,15 kg → Δv≈3,5×10⁻²⁵ m/s; sıfır noktası enerjisi ħ²/(8mL²)), tahmin (σx iki katına → σp yarıya) ve hesap (Δx=0,1 nm → Δp=5,275×10⁻²⁵, Δv=579 km/s; örnek 1 nm → 5,27×10⁻²⁶, 57,9 km/s) doğru. Sim değerleri (σx=3 nm → σp 1,8×10⁻²⁶; 1 nm → 5,3×10⁻²⁶) doğru.

Kavramlar sorulmadan önce öğretiliyor: wave packet, ΔxΔp ≥ ħ/2, eşlenik değişken/komütatör/özdurum, Δp bulma, günlük cisim, zincir sırası kartları; patronun "Önce bil" notu komütatörü hatırlatıyor. Öğretilmemiş terim bulunmadı.

| sorun | konum | önem | düzeltildi mi |
|---|---|---|---|
| Net hata bulunamadı (çökme, takılma, yanlış doğru-cevap, taşma, kayıp ilerleme, kırık düğme yok) | - | - | - |
| Sim'de σx değeri ondalık nokta ile ("σx = 3.0 nm"), metinler virgül kullanıyor (diğer istasyonlarda da aynı ortak biçim) | oyun/src/js/70-sim-belirsizlik.js | düşük | hayır (kozmetik, sim genelinde ortak) |
| Sim alt çubuğundaki "Not instrument (alet) error" etiketi acemi için kısa/kapalı; ilk kez görünce anlamı belirsiz (kavram kartı 2 "alet değil" ilkesini zaten anlatıyor) | oyun/src/js/70-sim-belirsizlik.js | düşük | hayır (kullanıcı teyit etsin: etiket "ΔxΔp ≥ ħ/2: alet kusuru değil" gibi açılabilir) |
| Yanlış düşman geri bildirimi "Cevabın yanlış. Doğru seçenek: X. neden... Senin seçtiğin: Y (neden)" uzun, iki cümle zinciri biraz ağır (işlevsel sorun yok; BUG-s08-A'da da not edilmişti) | oyun/src/js/80-obs-dusman.js | düşük | hayır |
| Hesap örneğinde Δp=5,275×10⁻²⁶ "5,27" yazılmış (yarıya yuvarlama; sonraki adımdaki 57,9 km/s ile tutarlı olduğundan bilerek bırakıldı) | oyun/src/js/87-data-hesap.js (X 'bel-v') | düşük | hayır (kullanıcı teyit etsin) |
