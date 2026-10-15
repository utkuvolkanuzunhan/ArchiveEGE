# Gizli Katmanlar

Bu klasör, ArchiveEGE'de içeriğin herkese aynı şekilde açık olmadığı, kontrollü ve gizli yürüyen mekanizmaları tanımlar.

| No | Katman | Amaç |
|---|---|---|
| [01](01-erisim-seviyeleri.md) | Kapalı erişim seviyeleri | Katkı verene daha değerli içerik açmak |
| [02](02-ozel-paylasim.md) | Sistem içi özel paylaşım | Küçük çalışma gruplarının kendi aralarında paylaşması |
| [03](03-tuzak-dosyalar.md) | Tuzak dosyalar ve varyantlar | Sızdıranı, filigran silinse bile bulmak |
| [04](04-gizli-yaptirim.md) | Gizli hile tespiti ve yaptırım | Hileciyi fark ettirmeden etkisiz bırakmak |

## Temel kural: Kurallar açık, içerik ve teknik gizli

Gizlilik iki ayrı şeyi kapsayabilir ve bunları karıştırmamak gerekir:

- **Gizli olabilecekler:** Kilitli içeriğin kendisi, sızıntı tespit tekniklerinin ayrıntıları, hangi kullanıcının incelemede olduğu.
- **Gizli olmaması gerekenler:** Seviyelerin nasıl kazanıldığı, hangi davranışın yasak olduğu, cezaların neler olduğu, kredi kurallarının kendisi.

Neden? Bu projenin çıkış noktası, bilginin sır gibi saklanmasından doğan güvensizlik. Kuralları da gizli olan bir sistem, aynı güvensizliği yeniden üretir. Kullanıcı neyin ödüllendirildiğini ve neyin cezalandırıldığını bilmezse ne katkı verir ne de sisteme güvenir.

## Yasal çerçeve (KVKK)

Kullanım koşullarında şu ifadeler genel olarak yer almalı (tekniğin ayrıntısını vermeden):

- "İndirdiğiniz her dosya size özel olarak işaretlenir ve size özel küçük farklılıklar içerebilir."
- "Kötüye kullanım tespit edildiğinde oylarınızın ve raporlarınızın etkisi azaltılabilir."
- "Kredi kesintisi ve uzaklaştırma kararları size gerekçesiyle bildirilir; itiraz hakkınız vardır."

KVKK 11. madde, kişinin "münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhine bir sonucun ortaya çıkmasına itiraz etme" hakkını tanır. Bu yüzden aleyhe sonuç doğuran her kararın bildirilmesi ve insan tarafından gözden geçirilmesi gerekir. Ayrıntılar [04](04-gizli-yaptirim.md) dosyasında.
