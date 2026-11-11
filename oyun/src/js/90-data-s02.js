(function(){
  function s(t, dogru, neden){ return { t: t, dogru: dogru, neden: neden }; }
  function kopya(x){ return s(x.t, x.dogru, x.neden); }

  var o03 = {
    id: "s02-o03", tip: "dusman", baslik: "Kusur düşmanı", kavram: "atom_sayisi", agirlik: 1,
    soru: "bcc birim hücresinde hücre başına kaç atom düşer?",
    secenekler: [
      s("1", false, "Hayır. Hücre başına 1 atom basit kübikte (sc) düşer."),
      s("2", true, "Doğru. 8 köşe × 1/8 + 1 merkez atomu = 2."),
      s("4", false, "Hayır. Hücre başına 4 atom yüzey merkezli kübikte (fcc) düşer.")
    ],
    kusurSkin: "vakans"
  };

  var o04 = {
    id: "s02-o04", tip: "dusman", baslik: "Kusur düşmanı", kavram: "birim_hucre", agirlik: 1,
    soru: "Elmas yapıda her atomun kaç en yakın komşusu vardır?",
    secenekler: [
      s("4", true, "Doğru. Elmas yapıda her atom tetrahedral, 4 komşulu."),
      s("6", false, "Hayır. 6 komşu basit kübik düzende olur."),
      s("12", false, "Hayır. 12 komşu fcc (sıkı paket) düzeninde olur.")
    ],
    kusurSkin: "safsizlik"
  };

  var o05 = {
    id: "s02-o05", tip: "tahmin", baslik: "Tahmin çukuru", kavram: "miller_duzlem", agirlik: 1.5,
    soru: "Eksenleri 2, ∞, ∞ noktasında kesen düzlemin Miller indisi nedir?",
    secenekler: [
      s("(200)", false, "Yanlış. Önce tersini al: ½, 0, 0. Sonra tam sayıya çevir: (100)."),
      s("(100)", true, "Doğru. Ters: ½, 0, 0. İki ile çarp: (100)."),
      s("(210)", false, "Yanlış. ∞ kesişim indisi 0 yapar; (210) farklı kesişimler ister.")
    ],
    sim: { modul: "miller", onceki: { c: [1, 1, 1] }, sonraki: { c: [2, "inf", "inf"] } },
    acik: "Kesişim 2, ∞, ∞. Ters ½, 0, 0. İki ile çarpınca (100)."
  };

  Q.data.stations.s02 = {
    id: "s02",
    sira: 2,
    ad: "Kesim testeresi",
    makine: "Kesim testeresi",
    renk: "#ff5d73",
    konu: "Kafes, birim hücre, Miller indisleri",
    sinavSorulari: [],
    sureHedefDk: 23,
    patronId: "miller",
    kavramlar: ["atom_sayisi", "birim_hucre", "miller_duzlem", "miller_yon", "duzlem_neden"],
    engeller: [
      { id: "s02-o01", tip: "hikaye", baslik: "Zaman kapısı", kavram: null, agirlik: 1,
        yer: "Cambridge", yil: 1839, rivayet: false,
        satirlar: [
          { kim: "selin", metin: "Külçe hazır. Şimdi wafer kesilecek, ama hangi düzlemden?" },
          { kim: "selin", metin: "Cevap 1839'da, Cambridge'de. Zaman kapısına!" },
          { kim: "miller", metin: "Düzlemleri üç küçük tam sayıyla adlandırdım: (hkl). Kristalcilerin dili oldu." }
        ] },
      { id: "s02-o02", tip: "kavram", baslik: "Kavram kapısı", kavram: "atom_sayisi", agirlik: 1,
        gorev: "fcc hücresinde kaç atom olduğunu bul.",
        sim: { modul: "kafes", params: { tur: "fcc" }, basari: { say: { tur: "fcc", atom: 4 } } },
        ogrenilen: "Köşe atomu 1/8, yüz atomu 1/2 sayılır: fcc hücresinde toplam 4 atom." },
      o03,
      o04,
      o05,
      { id: "s02-o06", tip: "tuzak", baslik: "Yanılgı tuzağı", kavram: "miller_duzlem", agirlik: 1,
        iddia: "Eksene paralel düzlemin indisi sonsuzdur.",
        parcalar: ["Eksene paralel", "düzlemin indisi", "sonsuzdur."],
        yanlisParca: 2,
        duzeltme: "Eksene paralel düzlem o ekseni ∞'da keser; indisi 0 olur." },
      { id: "s02-o07", tip: "kopru", baslik: "Mantık köprüsü", kavram: "miller_duzlem", agirlik: 1,
        soru: "Miller adımlarını sıraya diz",
        bloklar: [
          "Eksen kesişimlerini bul",
          "Kesişimlerin tersini al",
          "Kesirleri en küçük tam sayılara çevir",
          "Parantez içine yaz: (hkl)"
        ],
        sonuc: "Kesişim, ters, tam sayı, (hkl): her düzlem için aynı dört adım." },
      { id: "s02-o08", tip: "patron", baslik: "Düzlem Canavarı", kavram: null, agirlik: 1,
        canavar: "miller", canavarAd: "Düzlem Canavarı",
        giris: "Hangi düzlemdeyim? Bil bakalım, yoksa seni yanlış açıdan keserim!",
        fazlar: [
          { tip: "secmeli", kavram: "miller_duzlem",
            soru: "(111) düzlemi eksenleri nerede keser?",
            secenekler: [
              s("1, 1, 1", true, "Doğru. Ters 1, 1, 1; tam sayı zaten (111)."),
              s("1, ∞, ∞", false, "Hayır. Bu (100) düzlemidir."),
              s("1, 2, 3", false, "Hayır. (123) kesişimleri 1, ½, ⅓'tür.")
            ],
            alt: {
              soru: "Kübikte [111] yönü hangi düzleme diktir?",
              secenekler: [
                s("(111)", true, "Doğru. Kübikte [hkl] yönü (hkl) düzlemine diktir."),
                s("(100)", false, "Hayır. (100), [100] yönüne diktir."),
                s("(110)", false, "Hayır. (110), [110] yönüne diktir.")
              ]
            } },
          { tip: "acik", kavram: "miller_duzlem",
            pdfSoru: null,
            soru: "Miller indisi nasıl bulunur? (hkl), {hkl} ve [uvw] ne anlama gelir?",
            anahtarFikirler: [
              "Eksen kesişimleri bulunur, tersleri alınır.",
              "Kesirler en küçük tam sayılara çevrilir, ∞ indisi 0 yapar.",
              "(hkl) tek düzlemdir, {hkl} eşdeğer düzlem ailesidir.",
              "[uvw] bir yöndür, ⟨uvw⟩ yön ailesidir."
            ],
            yanlisKavramlar: ["Miller indisi kesişimin kendisidir", "Paralel düzlemin indisi sonsuzdur"],
            yanlisKavramIds: ["miller_duzlem", "miller_duzlem"],
            idealCevap: "Düzlemin eksenleri kestiği noktalar bulunur, tersleri alınır, kesirler en küçük tam sayılara çevrilir. Eksene paralel kesişim ∞'dur, indis 0 olur. (hkl) tek bir düzlem, {hkl} simetri ile eşdeğer düzlem ailesidir. [uvw] bir yöndür, ⟨uvw⟩ eşdeğer yönlerdir.",
            yedekSecmeli: {
              soru: "Miller indisini bulurken ilk adım nedir?",
              secenekler: [
                s("Eksen kesişimlerini bulmak", true, "Doğru. Sonra tersleri alınır."),
                s("Tam sayıya çevirmek", false, "Yanlış. Bu üçüncü adım."),
                s("Parantez yazmak", false, "Yanlış. Bu son adım."),
                s("Hücre atom sayısını saymak", false, "Yanlış. Miller indisiyle ilgisiz.")
              ]
            },
            alt: { soru: "Kesişimleri 1, 2, ∞ olan düzlemin indisini adımlarıyla bul." } },
          { tip: "acik", kavram: "duzlem_neden",
            pdfSoru: null,
            soru: "Silisyum wafer neden belirli bir kristal düzlemi boyunca kesilir?",
            anahtarFikirler: [
              "Düzlemler farklı atom yoğunluğuna sahiptir.",
              "Yüzey özellikleri düzleme göre değişir.",
              "Arayüz kusur yoğunluğu aygıt performansını etkiler.",
              "Bu yüzden (100) veya (111) gibi belirli düzlemler seçilir."
            ],
            yanlisKavramlar: ["Hangi düzlemden kesildiği fark etmez", "Düzlem seçimi sadece wafer şekli içindir"],
            yanlisKavramIds: ["duzlem_neden", "duzlem_neden"],
            idealCevap: "Her kristal düzleminin atom yoğunluğu ve yüzey özellikleri farklıdır. Yüzeydeki arayüz kusurları aygıt performansını etkiler, bu yüzden aygıta uygun (100) veya (111) gibi belirli bir düzlem seçilir.",
            yedekSecmeli: {
              soru: "Wafer yönü neden önemlidir?",
              secenekler: [
                s("Düzleme göre yüzey ve arayüz özellikleri değişir", true, "Doğru. Atom yoğunluğu ve kusur yoğunluğu düzleme bağlıdır."),
                s("Yalnızca wafer daha parlak olsun diye", false, "Yanlış. Parlaklık sebep değil."),
                s("Hiç önemi yoktur", false, "Yanlış. Aygıt performansını etkiler."),
                s("Atomlar düzleme göre kaybolur", false, "Yanlış. Atom kaybolmaz.")
              ]
            },
            alt: { soru: "(100) ve (111) düzlemleri arasındaki fark aygıt için neden önemlidir?" } }
        ] },
      { id: "s02-o09", tip: "sandik", baslik: "Sandık", kavram: null, agirlik: 1,
        kart: { id: "miller", yil: 1839, tekCumle: "Düzlemleri üç küçük tam sayıyla adlandırdı: Miller indisleri." },
        ozet: [
          "Hücre başına atom: sc 1, bcc 2, fcc 4",
          "Miller: kesişim, ters, tam sayı",
          "(hkl) düzlem, [uvw] yön"
        ],
        kontrolNoktasi: true }
    ],
    temelTur: {
      kartlar: [
        { baslik: "Hücre ve atom", metin: "Birim hücre tekrar eder. Köşe 1/8, yüz 1/2, içeri 1 sayılır." },
        { baslik: "Miller adımları", metin: "Kesişim, ters al, tam sayı yap, (hkl) yaz." },
        { baslik: "∞ ne olur?", metin: "Eksene paralel düzlem o ekseni ∞'da keser, indis 0." }
      ],
      sim: { modul: "miller", params: { c: [1, 1, 1] } }
    },
    tekrarHavuzu: [
      { id: "s02-t01", tip: "dusman", baslik: "Kusur düşmanı", kavram: "atom_sayisi", agirlik: 1,
        soru: o03.soru, secenekler: o03.secenekler.map(kopya), kusurSkin: "vakans" },
      { id: "s02-t02", tip: "dusman", baslik: "Kusur düşmanı", kavram: "birim_hucre", agirlik: 1,
        soru: o04.soru, secenekler: o04.secenekler.map(kopya), kusurSkin: "safsizlik" },
      { id: "s02-t03", tip: "dusman", baslik: "Kusur düşmanı", kavram: "miller_duzlem", agirlik: 1,
        soru: o05.soru, secenekler: o05.secenekler.map(kopya), kusurSkin: "vakans" },
      { id: "s02-t04", tip: "dusman", baslik: "Kusur düşmanı", kavram: "miller_yon", agirlik: 1,
        soru: "[100] yönü hangi eksene paraleldir?",
        secenekler: [
          s("x ekseni", true, "Doğru. [100] = (1,0,0) vektörü, x yönü."),
          s("y ekseni", false, "Hayır. y yönü [010]."),
          s("z ekseni", false, "Hayır. z yönü [001].")
        ],
        kusurSkin: "dislokasyon" }
    ]
  };
})();
