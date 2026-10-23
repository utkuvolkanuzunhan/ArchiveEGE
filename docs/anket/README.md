# İhtiyaç Anketi

Sistemi tasarlamadan önce öğrencilerin gerçekte neyle mağdur olduğunu ve neden paylaşmadığını ölçmek için hazırlanan anket.

## Dosyalar

| Dosya | İçerik |
|---|---|
| `form-olustur.gs` | Anketi Google Formlar'da otomatik oluşturan Google Apps Script kodu |

## Formu oluşturma (yaklaşık 3 dakika)

1. [script.google.com](https://script.google.com) adresinde **Yeni proje** açın.
2. `form-olustur.gs` dosyasının tamamını yapıştırıp kaydedin.
3. Üstte `anketiOlustur` fonksiyonunu seçip **Çalıştır**'a basın, izin isteğini onaylayın.
   "Google bu uygulamayı doğrulamadı" uyarısı çıkarsa: **Gelişmiş → (güvenli değil) sayfasına git**. Kodu kendiniz yapıştırdığınız için bu normaldir.
4. **Yürütme günlüğü**nde iki formun bağlantıları yazar. Formları açıp göz gezdirin, gerekirse elle düzenleyin.
5. Sınıf grubuna **sadece ana anketin paylaşım bağlantısını** atın. Gönüllü formu, anketin teşekkür ekranında zaten görünür.

## Neden iki ayrı form?

Ana anket tamamen anonimdir. Pilot ekibe katılmak isteyenlerin iletişim bilgisi ayrı bir formda toplanır. Tek formda toplansaydı, gönüllü olan kişinin ankete verdiği cevaplar (ör. "paylaşmıyorum çünkü...") ismiyle eşleşmiş olurdu ve insanlar dürüst cevap vermekten çekinirdi.

## Anketin yapısı

| Bölüm | Ne ölçülüyor? | Neden önemli? |
|---|---|---|
| Profil | Sınıf | 1. sınıf ile 4. sınıfın sorunları farklıdır; sonuçlar sınıfa göre ayrılır. |
| Bugünkü durum | Kaynağa ulaşma zorluğu, kaynaklar, mağduriyet sıklığı ve örnekleri | Sorunun gerçekten var olduğunu ve ne kadar yaygın olduğunu sayıyla gösterir. |
| Paylaşmama nedenleri | Neden paylaşmıyoruz? Bağıl notun etkisi | Sistemin hangi nedeni çözebileceğini, hangisini çözemeyeceğini gösterir. |
| Önerilen sistem | Katkı verme isteği, ihtiyaç duyulan içerik, rahatsız eden kurallar, **"Nasıl kandırırdınız?"** | Son soru, [manipülasyon kataloğuna](../manipulasyon/README.md) doğrudan girdi sağlar. |
| Platform | Telegram kullanımı, tercih edilen platform | Telegram botu kararının doğru olup olmadığını test eder. |

## Bilerek yapılan seçimler

- **Yönlendirici soru yok.** "Bencil davranışlar sizi mağdur etti mi?" gibi bir soru, cevabı baştan belirler ve paylaşmayan kişiyi savunmaya iter. Bunun yerine yaşanan deneyim soruluyor: "Başkalarının ulaşabildiği bir kaynağa ulaşamadığınız oldu mu?"
- **İsim istenmiyor.** Açık uçlu sorularda kişi veya hoca ismi verilmemesi açıkça isteniyor. Anket bir ihbar aracına dönüşürse hem güven kaybolur hem de KVKK açısından sorun çıkar.
- **"Paylaşmaktan çekinmiyorum" seçeneği var.** Herkesin paylaşmadığı varsayılmıyor; zaten paylaşanların oranı da önemli bir veri.
- **Ödev çözümleri seçenek olarak yok.** Aktif dönem ödev çözümleri kopya kapsamına girebilir; anket bu beklentiyi baştan yaratmamalı.

## Sınıf grubuna atılacak mesaj (örnek)

> Merhaba arkadaşlar,
>
> Geçen hafta bahsettiğim ortak not ve çıkmış sınav arşivi fikri için önce sizin yaşadığınız sorunları anlamak istiyorum. 5 dakikalık, **tamamen anonim** bir anket hazırladım; isim veya e-posta toplanmıyor.
>
> Özellikle şu soruya verdiğiniz cevaplar çok değerli: **"Bu sistemi kandırmak isteseydiniz nasıl yapardınız?"** Açıkları şimdiden bulursak sistemi baştan doğru kurarız.
>
> 👉 [ANKET BAĞLANTISI]
>
> Anket [TARİH] akşamına kadar açık. Sonuçları özetleyip burada paylaşacağım.

## Toplama ve analiz planı

1. **Süre:** Anketi 7-10 gün açık tutun. 3-4. gün bir kez hatırlatma atın. Daha fazlası rahatsız eder.
2. **Hedef:** Gruptaki kişilerin en az %30'u. Bunun altındaki sonuçlar, sadece konuyla zaten ilgilenenlerin görüşünü yansıtır.
3. **Sonuçlar:** Formun **Yanıtlar** sekmesinden **E-Tablolar'a bağla** ile cevapları tabloya aktarın.
4. **Açık uçlu cevapları kodlayın:** Her cevabı bir veya birkaç kategoriye etiketleyin (ör. "bağıl not", "güven", "emek karşılığı", "hile fikri"). Kategori sayıları, tek tek cevaplardan daha güvenilir bir tablo verir.
5. **Hile fikirlerini işleyin:** "Nasıl kandırırdınız?" cevaplarındaki her yeni fikir, [manipülasyon/SABLON.md](../manipulasyon/SABLON.md) ile yeni bir saldırı dosyası olur veya mevcut bir dosyaya eklenir.
6. **Sonuçları paylaşın:** Özeti sınıf grubuyla paylaşın ve "sizden gelen şu önerilere göre şu kuralları değiştirdik" deyin. Bir sonraki ankete katılımı en çok bu artırır.

## Sonuçlara göre verilecek kararlar

| Sonuç | Karar |
|---|---|
| Paylaşmama nedenlerinde "bağıl not" baskınsa | Kredi sistemi tek başına yetmez; içeriğin kademeli açılması ve sistemin herkesi aynı anda kazandırdığı vurgulanmalı. |
| "Telegram yüklü değil ve yüklemem" oranı yüksekse (ör. %25 üzeri) | Telegram botu yerine web arayüzü öne alınmalı. |
| "Katkı veririm" oranı düşükse | Kurallar katılımı zorlaştırıyor olabilir; "rahatsız eden kural" cevapları önceliklendirilmeli. |
| Belirli bir derste zorluk yoğunlaşıyorsa | Pilot o dersle başlatılmalı. |
