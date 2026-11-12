/* 90-data-s01.js · İstasyon 01 · Kristal fırını verisi (E1)
 * Kaynak: oyun/istasyonlar/01-kristal-firini.md, şema: oyun/01-veri-semalari.md §3.
 * Ekler: Q.data.stations.s01
 * Bağımlılık: 00-q.js (Q.data). Yalnızca veri içerir, davranış yok.
 */
(function(){
  'use strict';

  function sec(t, dogru, neden){ return { t: t, dogru: dogru, neden: neden }; }
  function kopya(a){ return a.map(function(s){ return sec(s.t, s.dogru, s.neden); }); }

  var o03 = {
    id: "s01-o03", tip: "dusman", baslik: "Defect (kusur) düşmanı", kavram: "kati_turleri", agirlik: 1,
    soru: "Amorphous (amorf) katıda atomlar long-range order (uzun menzilli düzen) gösterir mi?",
    secenekler: [
      sec("Evet, crystal (kristal) gibi uzak atomlar da düzenlidir", false, "Hayır. Long-range order yalnızca crystal (kristal) içinde vardır."),
      sec("Hayır, order (düzen) yalnızca yakın neighbor (komşu) atomlardadır", true, "Doğru. Amorphous (amorf) katıda yalnızca short-range order (kısa menzilli düzen) vardır."),
      sec("Yalnızca yavaş cooling (soğuma) sonrası düzenlenir", false, "Yanlış. Amorphous (amorf) kalan katıda long-range order hiç oluşmaz.")
    ],
    kusurSkin: "vakans"
  };

  var o04 = {
    id: "s01-o04", tip: "dusman", baslik: "Defect (kusur) düşmanı", kavram: "tane_siniri", agirlik: 1,
    soru: "Polycrystalline (çok kristalli) malzemede grain boundary (tane sınırı) nedir?",
    secenekler: [
      sec("İki grain (tane) arasındaki disordered (düzensiz) interface (ara yüz) bölgesi", true, "Doğru. Crystal (kristal) yönünün değiştiği interface (ara yüz) bölgesidir."),
      sec("Crystal (kristal) dış surface (yüzey) üzerindeki ince katman", false, "Hayır. Grain boundary (tane sınırı) malzemenin içinde, grain (tane) buluşma yeridir."),
      sec("Dopant atom (katkı atomu) toplanma yeri", false, "Hayır. Grain boundary (tane sınırı), crystal (kristal) yönünün değiştiği interface (ara yüz) bölgesidir.")
    ],
    kusurSkin: "tane_siniri"
  };

  var o05secenekler = [
    sec("Artar (increase)", false, "Yanlış. Grain boundary (tane sınırı) electron (elektron) saçar (scattering), mean free path (serbest yol) kısalır."),
    sec("Azalır (decrease)", true, "Doğru. Her grain boundary (tane sınırı) bir barrier (engel) oluşturur."),
    sec("Değişmez (unchanged)", false, "Yanlış. Grain boundary (tane sınırı) ek scattering (saçılma) getirir.")
  ];

  Q.data.stations.s01 = {
    id: "s01",
    sira: 1,
    ad: "Kristal fırını",
    makine: "Kristal fırını",
    renk: "#ff9f1c",
    konu: "Types of solids (katı türleri), neden crystal (kristal), CZ ile single crystal (tek kristal)",
    sinavSorulari: ["S1", "S2"],
    sureHedefDk: 22,
    patronId: "czoch",
    kavramlar: ["kati_turleri", "tane_siniri", "cz_tohum", "kristal_neden", "kristal_pahali"],
    engeller: [
      {
        id: "s01-o01", tip: "hikaye", baslik: "Zaman kapısı", kavram: null, agirlik: 1,
        yer: "Berlin", yil: 1916, rivayet: true,
        satirlar: [
          { kim: "selin", metin: "Sipariş: 10.000 chip (çip). Hammadde sand (kum), ama kum önce crystal (kristal) olmalı." },
          { kim: "selin", metin: "Zaman makinesi hazır. 1916'ya, crystal (kristal) çekmenin doğduğu yere gidiyoruz." },
          { kim: "czoch", metin: "Rivayete göre kalemi mürekkep yerine melt (eriyik) kalaya batırdım. Wire (tel) single crystal (tek kristal) çıktı." }
        ]
      },
      {
        id: "s01-o02", tip: "kavram", baslik: "Kavram kapısı", kavram: "kati_turleri", agirlik: 1,
        onBilgi: [
          { baslik: "Tarihçe: kristal ve CZ", madde: [
            "Katıların atom düzeni 1900'lerin başında X-ray (X-ışını) kırınımıyla anlaşıldı; kristalin düzenli olduğu böyle gösterildi.",
            "Jan Czochralski (1916): eriyik metalden tek kristal çekme yöntemini buldu; yöntem onun adını taşır.",
            "Bell Labs'te 1950 dolaylarında Teal ve Little bu yöntemi yarıiletken kristallere uyguladı.",
            "Bugün chip (çip) için kullanılan wafer (dilim) çoğunlukla CZ ile çekilen silisyumdan kesilir." ] },
          { baslik: "Katı türleri ve kusurlar", madde: [
            "Single crystal (tek kristal): düzen tüm parçada kesintisiz sürer; long-range order (uzun menzilli düzen) vardır.",
            "Polycrystalline (çok kristalli): küçük kristal grain (tane) topluluğu; grain boundary (tane sınırı) taneleri ayırır.",
            "Amorphous (amorf): yalnızca yakın komşular düzenli; short-range order (kısa menzilli düzen) vardır, uzakta düzen kaybolur.",
            "Scattering (saçılma): electron (elektron) bozuk düzende yön değiştirir; mean free path (serbest yol) iki saçılma arası ortalama mesafedir." ] },
          { baslik: "Neden crystal, nasıl çekilir?", madde: [
            "Lattice (kafes) tekrar ettiği için electron (elektron) periodic potential (periyodik potansiyel) görür; bundan energy band (enerji bandı) doğar.",
            "CZ: melt (eriyik) silisyuma seed crystal (tohum kristal) batırılır, yavaşça döndürülerek çekilir; ingot (külçe) oluşur, dilimlenir; her dilim wafer (dilim) olur ve üstüne device (aygıt) yapılır.",
            "Sınavda sık karışan: crystal tercihinin nedeni maliyet veya görünüş değil, öngörülebilir ve tekrarlanabilir özelliklerdir.",
            "Dopant (katkı atomu): bilerek eklenen yabancı atom. Carrier (taşıyıcı): akım taşıyan yük; mobility (hareketlilik): ne kadar kolay ilerler; lifetime (ömür): ne kadar yaşar." ] }
        ],
        nasil: [
          {
            "baslik": "Nasıl yapılır: elektron simülasyonu",
            "madde": [
              "1) Single (Tek), Poly (Çok) ve Amorphous (Amorf) düğmelerinden birine bas; o malzemeye bir electron (elektron) gönderilir.",
              "2) Elektronun yoluna bak: düz gidiyorsa az saçılma, sık yön değiştiriyorsa çok saçılma var demektir.",
              "3) Üç malzemeyi de sırayla dene ve yolları karşılaştır.",
              "4) Üçünü de denediğinde kapı açılır; elektronun hangi malzemede en uzağa gittiğine dikkat et."
            ]
          },
          {
            "baslik": "Nasıl yapılır: karşılaştırma sorusu",
            "madde": [
              "1) Önce malzemede kaç bozukluk olduğuna bak: tane sınırı (grain boundary) ya da düzensiz atomlar.",
              "2) Bozukluk çoksa electron (elektron) daha sık saçılır (scattering); bu sebep-sonuç zincirinin ilk halkasıdır.",
              "3) Saçılma sıklaştıkça iki saçılma arası mesafe, yani mean free path (serbest yol), kısalır.",
              "4) Örnek: tane boyu 50 nm ise elektron en fazla yaklaşık 50 nm sonra sınıra çarpar; tane 10 nm ise yaklaşık 10 nm sonra."
            ]
          },
          {
            "baslik": "Nasıl yapılır: atom yoğunluğu",
            "madde": [
              "1) Hücre başına atom sayısı N: sc 1, bcc 2, fcc 4, diamond (elmas) 8.",
              "2) Kenar a'yı cm'ye çevir (1 nm = 10⁻⁷ cm), sonra hacmi bul: V = a³.",
              "3) Yoğunluk n = N/V. Örnek: germanium (germanyum), a = 0,565 nm, N = 8 → V = 1,80×10⁻²² cm³.",
              "4) n = 8 / 1,80×10⁻²² ≈ 4,4×10²² atom/cm³. Birimi her zaman yaz."
            ]
          },
          {
            "baslik": "Nasıl yapılır: sıralama sorusu",
            "madde": [
              "1) Önce kök sebebi bul: başka hiçbir adımdan çıkmayan adım en başa gider; sonuç ya da özellik en sona.",
              "2) Komşu iki adımı 'bu yüzden' ile bağla; bağlanmıyorsa sıra yanlıştır.",
              "3) Örnek (başka konu): tane sınırı artar → saçılma artar → serbest yol kısalır → direnç büyür.",
              "4) Yanlış sıra denersen oyun her adımın nedenini gösterir; ilk deneme öğrenme fırsatıdır."
            ]
          }
        ],
        gorev: "Electron (elektron) üç malzemeden de geçir; scattering (saçılma) farkını gözle.",
        tanitim: "Crystal (kristal): atomlar uzun menzilde düzenli. Polycrystalline (çok kristalli): düzenli taneler, aralarında grain boundary (tane sınırı). Amorphous (amorf): düzen yok. Mean free path (serbest yol): elektronun çarpmadan gittiği mesafe.",
        sim: { modul: "kristal_tur", params: { mod: "tur" }, basari: { hepsiniDene: true } },
        ogrenilen: "Order (düzen) bozuldukça electron (elektron) daha çok saçılır (scattering); single crystal (tek kristal) içinde yolu en açıktır."
      },
      o03,
      o04,
      {
        id: "s01-o05", tip: "tahmin", baslik: "Tahmin çukuru", kavram: "tane_siniri", agirlik: 1.5,
        soru: "Single crystal (tek kristal) yerine polycrystalline (çok kristalli) malzeme kullanırsan mean free path (serbest yol) ne olur?",
        secenekler: o05secenekler,
        sim: { modul: "kristal_tur", onceki: { mod: "serbest_yol" }, sonraki: { mod: "serbest_yol", gonder: true } },
        acik: "Grain boundary (tane sınırı) electron (elektron) saçıyor; single crystal (tek kristal) içinde yol açık, mean free path (serbest yol) uzun."
      },
      {
        id: "s01-o06", tip: "tuzak", baslik: "Yanılgı tuzağı", kavram: "kristal_pahali", agirlik: 1,
        iddia: "Crystal (kristal) pahalı olduğu için semiconductor (yarıiletken) endüstrisinde tercih edilir.",
        parcalar: ["Crystal (kristal) pahalı olduğu için", "semiconductor (yarıiletken) endüstrisinde", "tercih edilir."],
        yanlisParca: 0,
        duzeltme: "Crystal (kristal) periodic (periyodik) olduğu için energy band (enerji bandı) yapısı öngörülebilir, properties (özellikler) kontrol edilebilir."
      },
      {
        id: "s01-o07", tip: "kopru", baslik: "Mantık köprüsü", kavram: "kristal_neden", agirlik: 1,
        onNot: "Lattice (kafes): atomların tekrar eden dizilimi. Periodic potential (periyodik potansiyel): elektron, kafesin tekrar eden atom çekimini görür. Energy band (enerji bandı): elektronun sahip olabileceği izinli enerji aralığı.",
        soru: "Zinciri sıraya diz",
        bloklar: ["Lattice (kafes) periyodik tekrar eder", "Electron (elektron) periodic potential (periyodik potansiyel) görür", "Energy bands (enerji bantları) net oluşur", "Properties (özellikler) öngörülebilir ve tekrarlanabilir"],
        ipucu: "Kök sebep ilk sırada; ölçülebilir özellik (sonuç) en sonda.",
        nedenler: [
          "Her şey atomların tekrar eden dizilişinden başlar; kök sebep budur.",
          "Tekrar eden kafes, elektrona tekrar eden bir çekim manzarası sunar.",
          "Periyodik potansiyel, elektronun alabileceği enerjileri net aralıklara (bantlara) ayırır.",
          "Bantlar net olduğu için özellikler önceden hesaplanır ve her üretimde tekrarlanır."
        ],
        sonuc: "Periodic lattice (periyodik kafes), periodic potential (periyodik potansiyel), net energy bands (enerji bantları), öngörülebilir device (aygıt)."
      },
      {
        id: "s01-o08", tip: "patron", baslik: "Grain Boundary (Tane Sınırı) Canavarı", kavram: null, agirlik: 1,
        canavar: "czoch", canavarAd: "Grain Boundary (Tane Sınırı) Canavarı",
        onNot: "CZ (Czochralski) yöntemi: melt (eriyik) silisyuma seed crystal (tohum kristal) değdirilir, yavaşça döndürülerek yukarı çekilir. Katılaşan atomlar tohumun düzenini sürdürür; ingot (külçe) tek kristal olur. Patronda şıkkın yanında eminliğini de seç.",
        giris: "Ben grain boundary (tane sınırı) canavarıyım! Electron (elektron) saçarım. Beni nasıl yenersin?",
        fazlar: [
          {
            tip: "secmeli", kavram: "cz_tohum",
            soru: "CZ (Czochralski) yönteminde seed crystal (tohum kristal) görevi nedir?",
            secenekler: [
              sec("Melt (eriyik) ısıtır", false, "Hayır. Heating (ısıtma) işini furnace (fırın) yapar, seed (tohum) değil."),
              sec("Solidifying (katılaşan) atom üzerine crystal (kristal) order (düzen) aktarır", true, "Doğru. Atom, seed crystal (tohum kristal) düzenini sürdürür."),
              sec("Melt (eriyik) karıştırır", false, "Hayır. Stirring (karıştırma) seed (tohum) işi değil.")
            ],
            alt: {
              soru: "CZ'de ingot (külçe) neden yavaşça döndürülerek çekilir?",
              secenekler: [
                sec("Seed (tohum) order (düzen) homojen sürsün diye", true, "Doğru. Yavaş ve düzgün çekme single crystal (tek kristal) yapısını korur."),
                sec("Daha hızlı cooling (soğuma) olsun diye", false, "Hayır. Hızlı cooling defect (kusur) yapar."),
                sec("Seed (tohum) melt (eriyik) içinde erisin diye", false, "Hayır. Seed (tohum) erirse düzeni aktaramaz; amaç onu korumaktır.")
              ]
            }
          },
          {
            tip: "acik", kavram: "kristal_neden",
            pdfSoru: "Why are crystalline solids used in the semiconductor industry?",
            soru: "Crystalline solids (kristal katılar) semiconductor (yarıiletken) endüstrisinde neden kullanılır? Explain (açıkla).",
            anahtarFikirler: [
              "Crystal (kristal) içinde atom periyodik dizilir, periodic potential (periyodik potansiyel) oluşur.",
              "Periyodiklik iyi tanımlı energy bands (enerji bantları) ve bandgap (yasak enerji aralığı) verir.",
              "Properties (özellikler) öngörülebilir ve tekrarlanabilir, doping (katkılama) ile kontrol edilir.",
              "Polycrystalline (çok kristalli) malzemede grain boundary (tane sınırı), amorphous (amorf) malzemede dangling bond (sarkık bağ) ve defect (kusur) carriers (taşıyıcılar) saçar veya tuzaklar."
            ],
            yanlisKavramlar: ["Crystal (kristal) pahalı olduğu için tercih edilir", "Crystal (kristal) sadece daha parlak olduğu için kullanılır"],
            yanlisKavramIds: ["kristal_pahali", "kristal_pahali"],
            idealCevap: "Crystal (kristal) içinde atom periyodik dizilir. Bu periodic potential (periyodik potansiyel) iyi tanımlı energy bands (enerji bantları) ve bandgap (yasak enerji aralığı) doğurur. Böylece conductivity (iletkenlik) öngörülebilir, doping (katkılama) ile kontrol edilir ve her aygıtta tekrarlanır. Polycrystalline (çok kristalli) malzemede grain boundary (tane sınırı), amorphous (amorf) malzemede dangling bond (sarkık bağ) ve defect (kusur) carriers (taşıyıcılar) saçar veya tuzaklar.",
            yedekSecmeli: {
              soru: "Crystal (kristal) neden semiconductor (yarıiletken) device (aygıt) içinde tercih edilir?",
              secenekler: [
                sec("Periodic (periyodik) yapı öngörülebilir energy bands (enerji bantları) verir", true, "Doğru. Periodic potential (periyodik potansiyel) net energy bands (enerji bantları) ve tekrarlanabilirlik sağlar."),
                sec("Crystal (kristal) en ucuz malzemedir", false, "Yanlış. Maliyet sebep değil, tam tersine crystal (kristal) büyütmek pahalıdır."),
                sec("Crystal (kristal) light (ışık) daha çok yansıtır", false, "Yanlış. Reflection (yansıma) electrical properties (elektriksel özellikler) ile ilgisizdir."),
                sec("Crystal (kristal) içinde electron (elektron) hiç saçılmaz", false, "Yanlış. Phonon (fonon) ve defect (kusur) saçılması vardır, ama çok daha az.")
              ]
            },
            alt: { soru: "Amorphous silicon (amorf silisyum) yerine single crystal silicon (tek kristal silisyum) neden tercih edilir?" }
          },
          {
            tip: "acik", kavram: "tane_siniri",
            pdfSoru: "Explain the main reason for single-crystal growth in the CZ method",
            soru: "Explain (açıkla): CZ yönteminde single crystal (tek kristal) büyütmenin ana nedeni nedir?",
            anahtarFikirler: [
              "Single crystal (tek kristal) içinde grain boundary (tane sınırı) yoktur.",
              "Grain boundary (tane sınırı) carriers (taşıyıcılar) saçar ve trap (tuzak) oluşturur.",
              "Mobility (hareketlilik) ve carrier lifetime (taşıyıcı ömrü) yüksek kalır.",
              "Tüm wafer (dilim) boyunca aynı property (özellik), tekrarlanabilir device (aygıt)."
            ],
            yanlisKavramlar: ["Single crystal (tek kristal) sadece daha güzel görünür", "Grain boundary (tane sınırı) electric current (elektrik akımı) daha iyi iletir"],
            yanlisKavramIds: ["kristal_pahali", "tane_siniri"],
            idealCevap: "Single crystal (tek kristal) içinde grain boundary (tane sınırı) yoktur. Grain boundary carriers (taşıyıcılar) saçar ve trap (tuzak) oluşturur, mobility (hareketlilik) ve lifetime (ömür) düşer. Single crystal, wafer (dilim) boyunca aynı band structure (bant yapısı) ve tekrarlanabilir device (aygıt) properties (özellikleri) sağlar.",
            yedekSecmeli: {
              soru: "CZ'de single crystal (tek kristal) neden istenir?",
              secenekler: [
                sec("Grain boundary (tane sınırı) yok, carriers (taşıyıcılar) saçılmaz", true, "Doğru. Mobility (hareketlilik) ve lifetime (ömür) yüksek kalır."),
                sec("Single crystal (tek kristal) daha hızlı büyür", false, "Yanlış. Single crystal yavaş büyütülür."),
                sec("Grain boundary (tane sınırı) current (akım) artırır", false, "Yanlış. Grain boundary carriers (taşıyıcılar) saçar."),
                sec("Crystal (kristal) color (renk) daha homojen olur", false, "Yanlış. Color (renk) sebep değil.")
              ]
            },
            alt: { soru: "Grain boundary (tane sınırı) device (aygıt) performansını nasıl bozar? Justify (gerekçelendir)." }
          }
        ]
      },
      { id: "s01-h01", tip: "hesap", baslik: "Hesap görevi", kavram: null, agirlik: 0, hesapGorev: "si-yogunluk" },
      {
        id: "s01-o09", tip: "sandik", baslik: "Sandık", kavram: null, agirlik: 1,
        kart: { id: "czoch", yil: 1916, tekCumle: "Melt (eriyik) içinden seed (tohum) ile single crystal (tek kristal) çekmenin yolunu buldu." },
        ozet: ["Crystal (kristal): periodic order (periyodik düzen)", "Grain boundary (tane sınırı) electron (elektron) saçar", "CZ: seed crystal (tohum kristal) melt (eriyik) içinden yavaşça çekilir"],
        kontrolNoktasi: true
      }
    ],
    temelTur: {
      kartlar: [
        { baslik: "Crystal (kristal) nedir?", metin: "Atomlar long-range order (uzun menzilli düzen) ile dizilir." },
        { baslik: "Neden scattering (saçılma)?", metin: "Order (düzen) bozuldukça electron (elektron) daha sık saçılır (scattering)." },
        { baslik: "CZ nedir?", metin: "Seed crystal (tohum kristal) melt (eriyik) içinden yavaşça çekilir, düzen sürer." }
      ],
      sim: { modul: "kristal_tur", params: { mod: "tur" } }
    },
    tekrarHavuzu: [
      {
        id: "s01-t01", tip: "dusman", baslik: o03.baslik, kavram: o03.kavram, agirlik: 1,
        soru: o03.soru, secenekler: kopya(o03.secenekler), kusurSkin: o03.kusurSkin
      },
      {
        id: "s01-t02", tip: "dusman", baslik: o04.baslik, kavram: o04.kavram, agirlik: 1,
        soru: o04.soru, secenekler: kopya(o04.secenekler), kusurSkin: o04.kusurSkin
      },
      {
        id: "s01-t03", tip: "dusman", baslik: "Defect (kusur) düşmanı", kavram: "tane_siniri", agirlik: 1,
        soru: "Single crystal (tek kristal) yerine polycrystalline (çok kristalli) malzeme kullanırsan mean free path (serbest yol) ne olur?",
        secenekler: kopya(o05secenekler), kusurSkin: "tane_siniri"
      },
      {
        id: "s01-t04", tip: "dusman", baslik: "Defect (kusur) düşmanı", kavram: "cz_tohum", agirlik: 1,
        soru: "CZ'de seed crystal (tohum kristal) ne işe yarar?",
        secenekler: [
          sec("Order (düzen) katılaşan atomlara aktarır", true, "Doğru. Solidifying (katılaşan) atom seed crystal (tohum kristal) düzenini sürdürür."),
          sec("Melt (eriyik) soğutur", false, "Hayır. Cooling (soğutma) seed (tohum) işi değil."),
          sec("Melt (eriyik) temizler", false, "Hayır. Cleaning (temizlik) başka süreç.")
        ],
        kusurSkin: "dislokasyon"
      },
      {
        id: "s01-t05", tip: "dusman", baslik: "Defect (kusur) düşmanı", kavram: "kristal_neden", agirlik: 1,
        soru: "Chip (çip) için neden single crystal silicon (tek kristal silisyum) kullanılır?",
        secenekler: [
          sec("Electron (elektron) akışı ordered (düzenli) dizilimde öngörülebilir olur", true, "Doğru. Ordered lattice (düzenli kafes) electron (elektron) rastgele saçmaz."),
          sec("Daha parlak göründüğü için", false, "Hayır. Parlaklık seçim nedeni değil."),
          sec("Her zaman daha ucuz olduğu için", false, "Hayır. Single crystal (tek kristal) üretmek pahalıdır.")
        ],
        kusurSkin: "vakans"
      }
    ]
  };
})();
