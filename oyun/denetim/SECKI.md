# SECKI · Deneme sınavı seçkisi (50 MCQ + 20 klasik)

**Bu bir TAHMİNDİR.** Gerçek sınav sorularını bilmiyoruz; seçki yalnızca aşağıdaki dayanaklarla "çıkma olasılığı yüksek" sorulara ağırlık verir. Kullanıcı geçmiş sınav/hoca vurgusu verirse `93-data-sinav-3.js` içindeki `SECKI_MCQ` / `SECKI_KLASIK` listeleri (s10 payı `94-data-sinav-4.js` sonunda) ve bu dosya güncellenmeli.

## Nasıl çalışır
- Sorular `secki:true` ile işaretli (`oyun/src/js/93-data-sinav-3.js` sonundaki iki liste, 91/92 dosyalarına dokunmadan).
- Tekrar > Deneme sınavı ekranında varsayılan küme "Seçki (50 + 20)"; "Tüm havuz" düğmesi eski davranışı verir (havuzdan rastgele 50 MCQ + 20 klasik). Havuz: 94 MCQ + 41 klasik.
- `node oyun/test/sinav-dogrula.js` seçki sayılarını (50, 20, istasyon dağılımı) denetler.

## Dayanaklar
1. **Örnek sınavın 10 sorusu** (kuantum-calisma-plani.md haritası). Hepsinin İngilizce karşılığı klasik 20'nin içinde:
   | Örnek soru | Seçkideki klasik |
   |---|---|
   | S1 kristal katılar neden yarıiletken endüstrisinde | sv-s01-k4 |
   | S2 CZ'de tek kristal büyütmenin nedeni | sv-s02-k4 |
   | S3 kuantumun doğuş ve başarı nedenleri | sv-s03-k4 |
   | S4 hidrojen atomunun kararlılığı | sv-s04-k4 |
   | S5 potansiyel için ψ ve izinli enerjiler | s05-k1 (+ s05-k3, s05-k4) |
   | S6 basamak potansiyeli, yansıma | s06-k3 |
   | S7 periyodik yapıda bant | sv-s09-k1 (+ sv-s09-k2) |
   | S8 kuantum mekaniğinin ilkeleri | sv-s07-k5 |
   | S9 özdurum değilse ölçüm | sv-s07-k6 (+ s07-k3) |
   | S10 belirsizlik ilkesi | s08-k1 (+ s08-k3) |
2. **Kullanıcı önceliği:** Konu 1-2 (kristal, kafes, Miller) en önemli, bu yüzden MCQ'nun 20'si (s01 10 + s02 10) ve klasiğin 5'i buradan. Hoca "kolay soracağım" dedi: işlemli uzun sorular (tünelleme sayıları, enerji-zaman hesapları) seçkiye az girdi, kavramsal açıklama sorularına öncelik verildi.
3. **Zayıf noktalar:** "Schrödinger denklemi çökmez, çökme ölçümle olur" (s07-k3, sv-s07-k6, s07-m4/m5/m10), "sıfır noktası enerjisi sınır koşulundan gelir" (s05-k3, s05-m8, s08-k3), "bantların mekanizması" (sv-s09-k1/k2, sv-s09-m1/m2), TISE girdi/çıktı (s05-k4, s05-m10).

## MCQ dağılımı (50)
s01 10, s02 10, s03 4, s04 4, s05 6, s06 4, s07 5, s08 3, s09 2, s10 2. Klasik (20): s01 3, s02 2, s03 1, s04 2, s05 3, s06 1, s07 3, s08 2, s09 2, s10 1.
s01/s02'de havuz 8 MCQ olduğundan 2'şer yeni MCQ eklendi (tek kristal/polikristal, zincblende, {hkl} ailesi, negatif kesişim).

## Açık noktalar
- s10 (Fermi/drift) seçkiye girdi: 2 MCQ (sv-s10-m1 f(E_F)=1/2, sv-s10-m4 np=nᵢ²) + 1 klasik (sv-s10-k3 drift/J). Yer açmak için en düşük öncelikli olanlar çıkarıldı: MCQ `sv-s03-m7` (fotoelektrik şiddet, ayrıntı; s03'te sv-s03-m1/2/3/5 ve klasik k4 kaldı) ve `s06-m10` (tünelleme olasılığı; s06'da 4 MCQ + s06-k3 kaldı); klasik `sv-s03-k1` (fotoelektrik; sv-s03-k4 aynı konuyu kapsıyor). Örnek sınavın 10 İngilizce karşılığı yerinde duruyor.
- Seçki ağırlıkları kullanıcı geri bildirimiyle güncellenebilir.
