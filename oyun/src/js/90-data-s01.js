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
    id: "s01-o03", tip: "dusman", baslik: "Kusur düşmanı", kavram: "kati_turleri", agirlik: 1,
    soru: "Amorf katıda atomlar uzun menzilde düzenli dizilir mi?",
    secenekler: [
      sec("Evet, kristal gibi", false, "Hayır. Uzun menzilli düzen yalnızca kristalde vardır."),
      sec("Hayır, düzen yalnızca yakın komşuluktadır", true, "Doğru. Amorfta yalnızca yakın komşular düzenlidir."),
      sec("Yalnızca soğuyunca düzenlenir", false, "Yanlış. Amorf kalan katıda uzun menzilli düzen hiç oluşmaz.")
    ],
    kusurSkin: "vakans"
  };

  var o04 = {
    id: "s01-o04", tip: "dusman", baslik: "Kusur düşmanı", kavram: "tane_siniri", agirlik: 1,
    soru: "Çok kristalli malzemede 'tane sınırı' nedir?",
    secenekler: [
      sec("İki kristal tanesi arasındaki düzensiz ara bölge", true, "Doğru. Kristal yönünün değiştiği ara yüzdür."),
      sec("Kristalin dış yüzeyi", false, "Hayır. Tane sınırı malzemenin içinde, tanelerin buluştuğu yerdir."),
      sec("Katkı atomlarının toplandığı yer", false, "Hayır. Tane sınırı, kristal yönünün değiştiği ara yüzdür.")
    ],
    kusurSkin: "tane_siniri"
  };

  var o05secenekler = [
    sec("Artar", false, "Yanlış. Tane sınırları elektronu saçar, serbest yol kısalır."),
    sec("Azalır", true, "Doğru. Her tane sınırı bir engeldir."),
    sec("Değişmez", false, "Yanlış. Tane sınırı ek saçılma getirir.")
  ];

  Q.data.stations.s01 = {
    id: "s01",
    sira: 1,
    ad: "Kristal fırını",
    makine: "Kristal fırını",
    renk: "#ff9f1c",
    konu: "Katı türleri, neden kristal, CZ ile tek kristal",
    sinavSorulari: ["S1", "S2"],
    sureHedefDk: 22,
    patronId: "czoch",
    kavramlar: ["kati_turleri", "tane_siniri", "cz_tohum", "kristal_neden", "kristal_pahali"],
    engeller: [
      {
        id: "s01-o01", tip: "hikaye", baslik: "Zaman kapısı", kavram: null, agirlik: 1,
        yer: "Polonya", yil: 1916, rivayet: true,
        satirlar: [
          { kim: "selin", metin: "Sipariş: 10.000 çip. Hammadde kum, ama kum önce kristal olmalı." },
          { kim: "selin", metin: "Zaman makinesi hazır. 1916'ya, kristal çekmenin doğduğu yere gidiyoruz." },
          { kim: "czoch", metin: "Rivayete göre kalemi mürekkep yerine eriyik kalaya batırdım. Tel tek kristal çıktı." }
        ]
      },
      {
        id: "s01-o02", tip: "kavram", baslik: "Kavram kapısı", kavram: "kati_turleri", agirlik: 1,
        gorev: "Elektronu üç malzemeden de geçir.",
        sim: { modul: "kristal_tur", params: { mod: "tur" }, basari: { hepsiniDene: true } },
        ogrenilen: "Düzen bozuldukça elektron daha çok saçılır; tek kristalde yolu en açıktır."
      },
      o03,
      o04,
      {
        id: "s01-o05", tip: "tahmin", baslik: "Tahmin çukuru", kavram: "tane_siniri", agirlik: 1.5,
        soru: "Tek kristal yerine çok kristalli malzeme kullanırsan elektronun serbest yolu ne olur?",
        secenekler: o05secenekler,
        sim: { modul: "kristal_tur", onceki: { mod: "serbest_yol" }, sonraki: { mod: "serbest_yol", gonder: true } },
        acik: "Tane sınırında elektron sekiyor; tek kristalde yol açık, serbest yol uzun."
      },
      {
        id: "s01-o06", tip: "tuzak", baslik: "Yanılgı tuzağı", kavram: "kristal_pahali", agirlik: 1,
        iddia: "Kristal pahalı olduğu için yarıiletken endüstrisinde tercih edilir.",
        parcalar: ["Kristal pahalı olduğu için", "yarıiletken endüstrisinde", "tercih edilir."],
        yanlisParca: 0,
        duzeltme: "Kristal periyodik olduğu için bantları öngörülebilir ve özellikleri kontrol edilebilir."
      },
      {
        id: "s01-o07", tip: "kopru", baslik: "Mantık köprüsü", kavram: "kristal_neden", agirlik: 1,
        soru: "Zinciri sıraya diz",
        bloklar: ["Kafes periyodik tekrar eder", "Elektron periyodik potansiyel görür", "Enerji bantları net oluşur", "Özellikler öngörülebilir ve tekrarlanabilir"],
        sonuc: "Periyodik kafes, periyodik potansiyel, net bantlar, öngörülebilir aygıt."
      },
      {
        id: "s01-o08", tip: "patron", baslik: "Tane Sınırı Canavarı", kavram: null, agirlik: 1,
        canavar: "czoch", canavarAd: "Tane Sınırı Canavarı",
        giris: "Ben tane sınırıyım! Elektronlarını sektiririm. Beni nasıl yenersin?",
        fazlar: [
          {
            tip: "secmeli", kavram: "cz_tohum",
            soru: "CZ yönteminde tohum kristalin görevi nedir?",
            secenekler: [
              sec("Eriyiği ısıtır", false, "Hayır. Isıtmayı fırın yapar."),
              sec("Katılaşan atomlara kristal düzenini tarif eder", true, "Doğru. Atomlar tohumun düzenini sürdürür."),
              sec("Eriyiği karıştırır", false, "Hayır. Karıştırma tohumun işi değil.")
            ],
            alt: {
              soru: "CZ'de külçe neden yavaşça döndürülerek çekilir?",
              secenekler: [
                sec("Tohumun düzeni homojen sürsün diye", true, "Doğru. Yavaş ve düzgün çekme tek kristali korur."),
                sec("Daha hızlı soğusun diye", false, "Hayır. Hızlı soğuma kusur yapar."),
                sec("Eriyik atılsın diye", false, "Hayır. Amaç eriyik atmak değil.")
              ]
            }
          },
          {
            tip: "acik", kavram: "kristal_neden",
            pdfSoru: "Why are crystalline solids used in the semiconductor industry?",
            soru: "Kristal katılar yarıiletken endüstrisinde neden kullanılır?",
            anahtarFikirler: [
              "Kristalde atomlar periyodik dizilir, potansiyel periyodiktir.",
              "Periyodiklik iyi tanımlı enerji bantları ve bant aralığı verir.",
              "Özellikler öngörülebilir ve tekrarlanabilir, katkıyla kontrol edilir.",
              "Çok kristalli veya amorfta taşıyıcılar tane sınırlarında saçılır."
            ],
            yanlisKavramlar: ["Kristal pahalı olduğu için tercih edilir", "Kristal sadece daha parlak olduğu için kullanılır"],
            yanlisKavramIds: ["kristal_pahali", "kristal_pahali"],
            idealCevap: "Kristalde atomlar periyodik dizilir. Bu periyodik potansiyel iyi tanımlı enerji bantları ve bant aralığı doğurur. Böylece iletkenlik öngörülebilir, katkılamayla kontrol edilir ve her aygıtta tekrarlanır. Çok kristalli veya amorf malzemede tane sınırları taşıyıcıları saçar.",
            yedekSecmeli: {
              soru: "Kristal neden yarıiletkende tercih edilir?",
              secenekler: [
                sec("Periyodik yapı öngörülebilir enerji bantları verir", true, "Doğru. Periyodik potansiyel net bantlar ve tekrarlanabilirlik sağlar."),
                sec("Kristal en ucuz malzemedir", false, "Yanlış. Maliyet sebep değil, tam tersine kristal büyütmek pahalıdır."),
                sec("Kristal ışığı daha çok yansıtır", false, "Yanlış. Yansıma elektriksel özelliklerle ilgisizdir."),
                sec("Kristalde elektron hiç saçılmaz", false, "Yanlış. Titreşim ve kusurlarda saçılır, ama çok daha az.")
              ]
            },
            alt: { soru: "Amorf silisyum yerine tek kristal silisyum neden tercih edilir?" }
          },
          {
            tip: "acik", kavram: "tane_siniri",
            pdfSoru: "Explain the main reason for single-crystal growth in the CZ method",
            soru: "CZ yönteminde tek kristal büyütmenin ana nedeni nedir?",
            anahtarFikirler: [
              "Tek kristalde tane sınırı yoktur.",
              "Tane sınırları taşıyıcıları saçar ve tuzaklar.",
              "Hareketlilik ve taşıyıcı ömrü böylece yüksek kalır.",
              "Tüm wafer boyunca aynı özellik, tekrarlanabilir aygıt."
            ],
            yanlisKavramlar: ["Tek kristal sadece daha güzel görünür", "Tane sınırı elektriği daha iyi iletir"],
            yanlisKavramIds: ["kristal_pahali", "tane_siniri"],
            idealCevap: "Tek kristalde tane sınırı yoktur. Tane sınırları taşıyıcıları saçar ve tuzaklar, hareketliliği ve ömrü düşürür. Tek kristal, wafer boyunca aynı bant yapısını ve tekrarlanabilir aygıt özelliklerini sağlar.",
            yedekSecmeli: {
              soru: "CZ'de tek kristal neden istenir?",
              secenekler: [
                sec("Tane sınırı yok, taşıyıcılar saçılmaz", true, "Doğru. Hareketlilik ve ömür yüksek kalır."),
                sec("Tek kristal daha hızlı büyür", false, "Yanlış. Tek kristal yavaş büyütülür."),
                sec("Tane sınırı akımı artırır", false, "Yanlış. Tane sınırı taşıyıcıları saçar."),
                sec("Kristal rengi daha homojen olur", false, "Yanlış. Renk sebep değil.")
              ]
            },
            alt: { soru: "Tane sınırı aygıt performansını nasıl bozar?" }
          }
        ]
      },
      {
        id: "s01-o09", tip: "sandik", baslik: "Sandık", kavram: null, agirlik: 1,
        kart: { id: "czoch", yil: 1916, tekCumle: "Eriyikten tohumla tek kristal çekmenin yolunu buldu." },
        ozet: ["Kristal: tekrar eden periyodik düzen", "Tane sınırı elektronu saçar", "CZ: tohumu eriyikten yavaşça çek"],
        kontrolNoktasi: true
      }
    ],
    temelTur: {
      kartlar: [
        { baslik: "Kristal nedir?", metin: "Atomlar uzun menzilde tekrar eden düzenle dizilir." },
        { baslik: "Neden saçılma?", metin: "Düzen bozuldukça elektron daha sık sekiyor." },
        { baslik: "CZ nedir?", metin: "Tohum kristal eriyikten yavaşça çekilir, düzen sürer." }
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
        id: "s01-t03", tip: "dusman", baslik: "Kusur düşmanı", kavram: "tane_siniri", agirlik: 1,
        soru: "Tek kristal yerine çok kristalli malzeme kullanırsan elektronun serbest yolu ne olur?",
        secenekler: kopya(o05secenekler), kusurSkin: "tane_siniri"
      },
      {
        id: "s01-t04", tip: "dusman", baslik: "Kusur düşmanı", kavram: "cz_tohum", agirlik: 1,
        soru: "CZ'de tohum kristal ne işe yarar?",
        secenekler: [
          sec("Düzeni atomlara aktarır", true, "Doğru. Katılaşan atomlar tohumun düzenini sürdürür."),
          sec("Eriyiği soğutur", false, "Hayır. Soğutma tohumun işi değil."),
          sec("Eriyiği temizler", false, "Hayır. Temizlik başka süreç.")
        ],
        kusurSkin: "dislokasyon"
      }
    ]
  };
})();
