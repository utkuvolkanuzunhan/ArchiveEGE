# BUG-s10-A (İstasyon 10 Paketleme/bonus, engel 1-3: hikaye, kavram, düşman o03/o04)
Kapsam: Playwright 1366x768 ve 1440x900; hikaye, kavram sim'i (gerçek kaydırıcı), o03 yanlış+doğru, o04 doğru, tahmin o05 doğru yol. Konsol/sayfa hatası yok (yalnızca abort edilen font isteği).

## Düzeltilen
- YÜKSEK (varsayılan): `istasyon10` anahtarı varsayılan KAPALIYDI (10-state.js). Varsayılan AÇIK yapıldı; yeni kayıtta harita s10 "Paketleme (bonus)" kartını gösteriyor. Not: kayıt anahtarı korunduğu için mevcut kayıtlarda kullanıcı değeri (false) kalır; Ayarlar'dan "Ders bu konuyu işledi (İstasyon 10)" ile açılır.
- DÜŞÜK (içerik doğruluğu): hikaye "1947'de Shockley'nin transistörü" diyordu; 1947 transistörü Bardeen-Brattain (nokta temaslı), Shockley'nin eklem transistörü 1948. Metin "1947'de ilk transistör (Bardeen, Brattain, Shockley) buna dayandı" yapıldı (90-data-s10.js).

## Doğrulananlar
- Açılış: s09 tamam olmadan s10 kilitli ("kilitli"), s09.tamam=true olunca istasyonAcik('s10') true; "Her yere eriş" (kilitleriAc) ile açık; Runner.indexOf('s10', 's10-o01..o04') = 0..3, "İstediğin engele atla" yolu (start ile indeks) çalışıyor.
- Hikaye: Fermi level (E_F, f=1/2), electron n / hole p, carrier, drift v_d = μE tanıtılıyor; 3 satır. İçerik doğru (Fermi-Dirac 1926 Roma).
- Kavram sim (fermi): T=100'de kapı açılmadı, T=50 K'e inince "Devam" çıktı; yerleşim 1366x768 ve 1440x900'de tam görünüyor. Sayısal model makul (Si benzeri: nᵢ ~ 10^10 cm⁻³ 300 K, Eg 1,1 eV, np=nᵢ² E_F'ten bağımsız).
- o03 (f(E_F)=1/2): yanlış şıkta "Cevabın yanlış. Doğru seçenek: ..." + neden; doğru yol çalışıyor. o04 (np=nᵢ²): doğru. o05 tahmin sim'i T 300->50 çalışıyor. Şıklar karışık sırada geliyor, doğru işaretleme tutarlı.

## Kalan / öneri (düzeltilmedi)
- DÜŞÜK: başlık ekranı "Kumdan çipe: 9 istasyon" (99-main.js:66) s10 açıkken yanlış; haritada 10 kart var.
- DÜŞÜK: o03 düşman skin'i `bant_bosluk` ("Defect (kusur) Bandgap Aralığı") Fermi f(E_F) sorusuyla ilgisiz (s09 skin'i yeniden kullanılıyor).
- DÜŞÜK (kavram kapısı): yalnızca T<=60 K şartı; E_F ve alan E kaydırıcıları kullanılmadan geçiliyor, drift ve np=nᵢ² sim'de görülmeden o04/o07'ye gelinebilir. Hikaye bunları söylüyor ama o02 `ogrenilen` metni sim ile sınanmıyor. Öneri: basari'ya E>0 koşulu.
- DÜŞÜK: hikayede np = nᵢ², mobility (μ) ve step function terimleri tanıtılmıyor; o04 np=nᵢ²'yi soruda veriyor, o05 şıkları step function'ı kullanıyor (o02 görevi "basamağa dönüşü" diyor). Kabul edilebilir.
- DÜŞÜK (dil): sim üst bilgi satırı "10^−36.0 cm⁻³" gibi çok küçük üsler gösteriyor (T=50 K); fizik doğru ama öğrenciyi şaşırtabilir. "oyun modeli" notu Türkçe, sorun değil.
- Gözlem: soru metni hem balonda hem panelde iki kez görünüyor (tüm istasyonlarda ortak).
- Doğrulanmadı (grup B/C): o06 tuzak, o07 köprü, o08 patron, sandık, istasyon sonu, kayıt.
