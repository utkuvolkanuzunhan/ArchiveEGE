(function(){
  function s(t, dogru, neden){ return { t: t, dogru: dogru, neden: neden }; }
  function kopya(x){ return s(x.t, x.dogru, x.neden); }

  var o03 = {
    id: "s02-o03", tip: "dusman", baslik: "Kusur düşmanı", kavram: "atom_sayisi", agirlik: 1,
    soru: "bcc unit cell (birim hücre) başına kaç atom düşer? Calculate (hesapla).",
    secenekler: [
      s("1", false, "Hayır. Hücre başına 1 atom simple cubic (basit kübik, sc) yapıda düşer."),
      s("2", true, "Doğru. 8 corner (köşe) × 1/8 + 1 body-center (merkez) atomu = 2."),
      s("4", false, "Hayır. Hücre başına 4 atom face-centered cubic (yüzey merkezli kübik, fcc) yapıda düşer.")
    ],
    kusurSkin: "vakans"
  };

  var o04 = {
    id: "s02-o04", tip: "dusman", baslik: "Kusur düşmanı", kavram: "birim_hucre", agirlik: 1,
    soru: "diamond structure (elmas yapı) içinde her atomun kaç nearest neighbor (en yakın komşu) sayısı vardır?",
    secenekler: [
      s("4", true, "Doğru. Diamond structure (elmas yapı) içinde her atom tetrahedral (dörtyüzlü), 4 komşulu."),
      s("6", false, "Hayır. 6 komşu simple cubic (basit kübik) düzende olur."),
      s("12", false, "Hayır. 12 komşu fcc (close-packed, sıkı paket) düzeninde olur.")
    ],
    kusurSkin: "safsizlik"
  };

  var o05 = {
    id: "s02-o05", tip: "tahmin", baslik: "Tahmin çukuru", kavram: "miller_duzlem", agirlik: 1.5,
    soru: "Eksenleri 2, ∞, ∞ noktasında kesen plane (düzlem) için Miller indices (Miller indisleri) nedir? Determine (belirle).",
    secenekler: [
      s("(200)", false, "Yanlış. Önce reciprocal (ters) al: ½, 0, 0. Sonra integer (tam sayı) yap: (100)."),
      s("(100)", true, "Doğru. Reciprocal (ters): ½, 0, 0. İki ile çarp: (100)."),
      s("(210)", false, "Yanlış. ∞ intercept (kesişim) indisi 0 yapar; (210) farklı kesişimler ister.")
    ],
    sim: { modul: "miller", onceki: { c: [1, 1, 1] }, sonraki: { c: [2, "inf", "inf"] } },
    acik: "Intercept (kesişim) 2, ∞, ∞. Reciprocal (ters) ½, 0, 0. İki ile çarpınca (100)."
  };

  Q.data.stations.s02 = {
    id: "s02",
    sira: 2,
    ad: "Kesim testeresi",
    makine: "Kesim testeresi",
    renk: "#ff5d73",
    konu: "Lattice (kafes), unit cell (birim hücre), Miller indices (Miller indisleri)",
    sinavSorulari: [],
    sureHedefDk: 23,
    patronId: "miller",
    kavramlar: ["atom_sayisi", "birim_hucre", "miller_duzlem", "miller_yon", "duzlem_neden"],
    engeller: [
      { id: "s02-o01", tip: "hikaye", baslik: "Zaman kapısı", kavram: null, agirlik: 1,
        yer: "Cambridge", yil: 1839, rivayet: false,
        satirlar: [
          { kim: "selin", metin: "Ingot (külçe) hazır. Şimdi wafer kesilecek, ama hangi plane (düzlem) boyunca?" },
          { kim: "selin", metin: "Cevap 1839'da, Cambridge'de. Zaman kapısına!" },
          { kim: "miller", metin: "Planes (düzlemleri) üç küçük integer (tam sayı) ile adlandırdım: (hkl). Kristalcilerin dili oldu." }
        ] },
      { id: "s02-o02", tip: "kavram", baslik: "Kavram kapısı", kavram: "atom_sayisi", agirlik: 1,
        gorev: "fcc unit cell (birim hücre) içinde kaç atom olduğunu determine (belirle).",
        sim: { modul: "kafes", params: { tur: "fcc" }, basari: { say: { tur: "fcc", atom: 4 } } },
        ogrenilen: "Corner (köşe) atomu 1/8, face (yüz) atomu 1/2 sayılır: fcc unit cell (birim hücre) içinde toplam 4 atom." },
      o03,
      o04,
      o05,
      { id: "s02-o06", tip: "tuzak", baslik: "Yanılgı tuzağı", kavram: "miller_duzlem", agirlik: 1,
        iddia: "Eksene paralel plane (düzlem) için indis sonsuzdur.",
        parcalar: ["Eksene paralel", "plane (düzlem) için indis", "sonsuzdur."],
        yanlisParca: 2,
        duzeltme: "Eksene paralel plane (düzlem) o ekseni ∞'da keser (intercept, kesişim); indisi 0 olur." },
      { id: "s02-o07", tip: "kopru", baslik: "Mantık köprüsü", kavram: "miller_duzlem", agirlik: 1,
        soru: "Miller indices (Miller indisleri) adımlarını sıraya diz",
        bloklar: [
          "Axis intercepts (eksen kesişimlerini) bul",
          "Reciprocals (tersleri) al",
          "Fractions (kesirleri) en küçük integers (tam sayılara) çevir",
          "Parantez içine yaz: (hkl)"
        ],
        sonuc: "Intercept (kesişim), reciprocal (ters), integer (tam sayı), (hkl): her plane (düzlem) için aynı dört adım." },
      { id: "s02-o08", tip: "patron", baslik: "Düzlem Canavarı", kavram: null, agirlik: 1,
        canavar: "miller", canavarAd: "Düzlem Canavarı",
        giris: "Hangi düzlemdeyim? Bil bakalım, yoksa seni yanlış açıdan keserim!",
        fazlar: [
          { tip: "secmeli", kavram: "miller_duzlem",
            soru: "(111) plane (düzlem) eksenleri nerede keser? Determine (belirle): intercepts (kesişimler).",
            secenekler: [
              s("1, 1, 1", true, "Doğru. Reciprocal (ters) 1, 1, 1; integer (tam sayı) zaten (111)."),
              s("1, ∞, ∞", false, "Hayır. Bu (100) plane (düzlem)."),
              s("1, 2, 3", false, "Hayır. (123) intercepts (kesişimleri) 1, ½, ⅓'tür.")
            ],
            alt: {
              soru: "cubic (kübik) yapıda [111] direction (yön) hangi plane (düzlem) için normal (dik)?",
              secenekler: [
                s("(111)", true, "Doğru. Cubic (kübik) yapıda [hkl] direction (yön), (hkl) plane (düzlem) için normaldir (diktir)."),
                s("(100)", false, "Hayır. (100), [100] yönüne diktir."),
                s("(110)", false, "Hayır. (110), [110] yönüne diktir.")
              ]
            } },
          { tip: "acik", kavram: "miller_duzlem",
            pdfSoru: null,
            soru: "Miller indices (Miller indisleri) nasıl bulunur? Explain (açıkla): (hkl), {hkl} ve [uvw] ne anlama gelir?",
            anahtarFikirler: [
              "Axis intercepts (eksen kesişimleri) bulunur, reciprocals (tersleri) alınır.",
              "Fractions (kesirler) en küçük integers (tam sayılara) çevrilir, ∞ indisi 0 yapar.",
              "(hkl) tek plane (düzlem), {hkl} equivalent planes (eşdeğer düzlemler) ailesidir.",
              "[uvw] bir direction (yön), ⟨uvw⟩ direction family (yön ailesi) demektir."
            ],
            yanlisKavramlar: ["Miller indisi kesişimin kendisidir", "Paralel düzlemin indisi sonsuzdur"],
            yanlisKavramIds: ["miller_duzlem", "miller_duzlem"],
            idealCevap: "Plane (düzlem) eksenleri kestiği noktalar (intercepts, kesişimler) bulunur, reciprocals (tersleri) alınır, fractions (kesirler) en küçük integers (tam sayılara) çevrilir. Eksene paralel intercept ∞'dur, indis 0 olur. (hkl) tek bir plane, {hkl} symmetry (simetri) ile equivalent planes (eşdeğer düzlemler) ailesidir. [uvw] bir direction (yön), ⟨uvw⟩ equivalent directions (eşdeğer yönler) demektir.",
            yedekSecmeli: {
              soru: "Miller index (Miller indisi) bulurken ilk adım nedir?",
              secenekler: [
                s("Axis intercepts (eksen kesişimlerini) bulmak", true, "Doğru. Sonra reciprocals (tersleri) alınır."),
                s("Integer (tam sayıya) çevirmek", false, "Yanlış. Bu üçüncü adım."),
                s("Parantez yazmak", false, "Yanlış. Bu son adım."),
                s("Hücre atom sayısını saymak", false, "Yanlış. Miller indices (Miller indisleri) ile ilgisiz.")
              ]
            },
            alt: { soru: "Intercepts (kesişimleri) 1, 2, ∞ olan plane (düzlem) için indisi adımlarıyla derive (türet)." } },
          { tip: "acik", kavram: "duzlem_neden",
            pdfSoru: null,
            soru: "Silisyum wafer neden belirli bir crystal plane (kristal düzlemi) boyunca kesilir? Explain (açıkla).",
            anahtarFikirler: [
              "Planes (düzlemler) farklı atomic density (atom yoğunluğu) taşır.",
              "Surface (yüzey) özellikleri düzleme göre değişir.",
              "Interface defect density (arayüz kusur yoğunluğu) aygıt performansını etkiler.",
              "Bu yüzden (100) veya (111) gibi belirli düzlemler seçilir."
            ],
            yanlisKavramlar: ["Hangi düzlemden kesildiği fark etmez", "Düzlem seçimi sadece wafer şekli içindir"],
            yanlisKavramIds: ["duzlem_neden", "duzlem_neden"],
            idealCevap: "Her crystal plane (kristal düzlemi) için atomic density (atom yoğunluğu) ve surface (yüzey) özellikleri farklıdır. Yüzeydeki interface defects (arayüz kusurları) aygıt performansını etkiler, bu yüzden aygıta uygun (100) veya (111) gibi belirli bir düzlem seçilir.",
            yedekSecmeli: {
              soru: "Wafer orientation (yönelimi) neden önemlidir?",
              secenekler: [
                s("Düzleme göre surface (yüzey) ve interface (arayüz) özellikleri değişir", true, "Doğru. Atomic density (atom yoğunluğu) ve defect density (kusur yoğunluğu) düzleme bağlıdır."),
                s("Yalnızca wafer daha parlak olsun diye", false, "Yanlış. Parlaklık sebep değil."),
                s("Hiç önemi yoktur", false, "Yanlış. Aygıt performansını etkiler."),
                s("Atomlar düzleme göre kaybolur", false, "Yanlış. Atom kaybolmaz.")
              ]
            },
            alt: { soru: "(100) ve (111) planes (düzlemleri) arasındaki farkı compare (karşılaştır): aygıt için neden önemli?" } }
        ] },
      { id: "s02-o09", tip: "sandik", baslik: "Sandık", kavram: null, agirlik: 1,
        kart: { id: "miller", yil: 1839, tekCumle: "Planes (düzlemleri) üç küçük integer (tam sayı) ile adlandırdı: Miller indices (Miller indisleri)." },
        ozet: [
          "Hücre başına atom: sc 1, bcc 2, fcc 4",
          "Miller: intercept (kesişim), reciprocal (ters), integer (tam sayı)",
          "(hkl) plane (düzlem), [uvw] direction (yön)"
        ],
        kontrolNoktasi: true }
    ],
    temelTur: {
      kartlar: [
        { baslik: "Hücre ve atom", metin: "Unit cell (birim hücre) tekrar eder. Corner (köşe) 1/8, face (yüz) 1/2, içeri 1 sayılır." },
        { baslik: "Miller adımları", metin: "Intercept (kesişim) bul, reciprocal (ters) al, integer (tam sayı) yap, (hkl) yaz." },
        { baslik: "∞ ne olur?", metin: "Eksene paralel plane (düzlem) o ekseni ∞'da keser, indis 0." }
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
        soru: "[100] direction (yön) hangi axis (eksen) için paraleldir?",
        secenekler: [
          s("x ekseni", true, "Doğru. [100] = (1,0,0) vector (vektör), x yönü."),
          s("y ekseni", false, "Hayır. y yönü [010]."),
          s("z ekseni", false, "Hayır. z yönü [001].")
        ],
        kusurSkin: "dislokasyon" }
    ]
  };
})();
