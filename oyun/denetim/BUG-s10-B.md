# BUG s10 grup B (o05 tahmin, o06 tuzak, o07 kopru) - 1366x768 / 1440x900

Oynandı (tahmin doğru; tuzak yanlış parça; köprü yanlış + doğru sıra); konsol hatası yok (yalnızca engellenen Google Fonts isteği). Ayarlar'da istasyon10 anahtarı Q.settings.set('istasyon10',true) ile açıldı.

1. Köprü yerleşim: Kontrol düğmesi 1366x768'de y=465-511, 1440x900'de y=565-611 (tam görünür); yanlış sonrası Devam 1366x768'de y=704-749, 1440x900'de y=844-889 (ekranda). Sorun yok.
2. Köprü: yanlış sıra (v_d, E, n/p, J) -> "Yanlış. Doğru sıra:" + doğru dizi + sonuç metni; doğru sıra (E, v_d, n/p, J) -> sonuç metni, Devam. Çalışıyor.
3. Tahmin: T 300->50 K, doğru şık (basamak fonksiyonuna yaklaşır) -> sim T=166 -> 50 K animasyonu, f(E_F)=1/2 sabit, E_F=0,55 eV; açıklama doğru. İçerik doğru (Fermi-Dirac, np=nᵢ², v_d=μE, J=q(nμₙ+pμₚ)E).
4. Tuzak: yanlış parça "1 değerini alır." (indeks 2); düzeltme metni fizikçe doğru (T>0 için f(E_F)=1/2).
5. Küçük (düzeltilmedi): tahmin sim aşamasında panel kısa kaldığından soru metninin ilk satırı panel üstünde kırpılıyor (1366x768). Sim satırında "n = 10^−36.0 cm⁻³" (50 K) fiziksel olarak <1 taşıyıcı demek; yalnızca "oyun modeli" göstergesi, öğretimi bozmuyor.
6. Köprü blok sırası notu: "Hareketli n ve p yük taşır" 3. blok; kavramsal olarak hız kazanımından önce de gelebilir, ama doğru cevap ve açıklama tutarlı.
7. Dil: soru/şık Türkçe, ders terimleri `English (Türkçe)` biçiminde; Türkçe-only ders terimi bulunmadı.
