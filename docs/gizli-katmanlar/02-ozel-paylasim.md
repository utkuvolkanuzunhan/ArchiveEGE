# 02 — Sistem İçi Özel Paylaşım

## Amaç

Küçük çalışma gruplarının, içeriği tüm arşive açmadan önce kendi aralarında paylaşabilmesi. Örneğin dört arkadaşın final öncesi ortak çözüm hazırlaması.

## Dikkat: Bu özellik projenin amacına ters çalışabilir

Sınırsız özel paylaşım, bugünkü durumun aynısını sistemin içinde yeniden kurar: Herkes kendi kapalı grubunda paylaşır, arşive kimse katkı vermez. Bu yüzden özel paylaşım **geçici ve sınırlı** olmalı ve sonunda arşive akmalıdır.

## Kurallar

| Kural | Açıklama |
|---|---|
| **Grup boyutu sınırı** | Bir çalışma grubu en fazla 8 kişi. |
| **Doğrulanmış üyeler** | Sadece e-postası doğrulanmış kullanıcılar gruba katılabilir. |
| **Kredi yok** | Grup içi paylaşım kredi ve itibar kazandırmaz. Böylece "sahte hesaplarla grup kurup kredi kasma" anlamsızlaşır. |
| **Kredi transferi yok** | Kullanıcılar birbirine kredi gönderemez (kredi aklamayı önler). |
| **Süre sınırı** | Grup içi dosyalar dönem sonunda (ör. finaller bittikten 2 hafta sonra) yükleyene "Arşive aç" önerisiyle döner. |
| **Yayınlama bonusu** | Grup içeriğini arşive açan, normal yükleme kredisine ek bonus alır. Bonus, grubun tüm katkıcıları arasında paylaştırılır. |
| **Filigran devam eder** | Grup içinde de her kopya kişiye özel işaretlenir. Grup içeriğini dışarı sızdıran tespit edilebilir. |

## Akış örneği

1. Ali `/grup olustur Devre Final` ile grup açar, bot bir davet bağlantısı verir.
2. Ayşe, Can ve Deniz bağlantıyla katılır.
3. Dört kişi çözümlerini gruba yükler; dosyalar sadece onlara görünür.
4. Finaller biter. Bot iki hafta sonra Ali'ye sorar: "Grubunuzdaki 6 dosyayı arşive açmak ister misiniz? Açarsanız 4 kişiye toplam 40 bonus kredi dağıtılacak."
5. Açılan dosyalar normal moderasyondan geçer ve **Altın** seviyeden başlayarak kademeli inişe girer.

## Hedefli paylaşım (tek kişiye)

Bir kullanıcının tek bir arkadaşına dosya göndermesi de aynı kurallarla yapılır: kredi kazandırmaz, filigranlıdır, süre sonunda arşive açma önerisi gelir.

## Riskler ve önlemler

| Risk | Önlem |
|---|---|
| Kapalı kartellerin oluşması | Süre sınırı, yayınlama bonusu, grup boyutu sınırı. |
| Arşivdeki kilitli içeriğin grup içinde dağıtılması (seviye atlatma) | Arşivden indirilen dosya, grup içine yeniden yüklenemez (hash ve benzerlik kontrolü). |
| Kredi aklama | Grup paylaşımı kredi kazandırmaz; kredi transferi yoktur. |

## Açık sorular

- Bir kullanıcı aynı anda en fazla kaç gruba üye olabilir?
- Arşive açılmayan grup içeriği süre sonunda silinsin mi, yoksa grupta kalmaya devam etsin mi?
