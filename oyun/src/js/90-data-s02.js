(function(){
  function s(t, dogru, neden){ return { t: t, dogru: dogru, neden: neden }; }
  function kopya(x){ return s(x.t, x.dogru, x.neden); }

  var o03 = {
    id: "s02-o03", tip: "dusman", baslik: "Defect (kusur) düşmanı", kavram: "atom_sayisi", agirlik: 1,
    soru: "bcc unit cell (birim hücre) başına kaç atom (atom) düşer? Calculate (hesapla).",
    secenekler: [
      s("1", false, "Hayır. 1 atom per unit cell (hücre başına atom) simple cubic (basit kübik, sc) lattice (kafes) içindir."),
      s("2", true, "Doğru. 8 corner (köşe) × 1/8 + 1 body-center atom (merkez atomu) = 2."),
      s("4", false, "Hayır. 4 atoms per unit cell (hücre başına atom) face-centered cubic (yüzey merkezli kübik, fcc) lattice (kafes) içindir.")
    ],
    kusurSkin: "vakans"
  };

  var o04 = {
    id: "s02-o04", tip: "dusman", baslik: "Defect (kusur) düşmanı", kavram: "birim_hucre", agirlik: 1,
    onNot: "Diamond structure (elmas yapı): silisyum ve germanyumun kafesi. Nearest neighbor (en yakın komşu): bir atoma en yakın duran atomlar; sayısı coordination number (koordinasyon sayısı) olur.",
    soru: "diamond structure (elmas yapı) içinde her atom (atom) için nearest neighbor (en yakın komşu) sayısı kaçtır?",
    secenekler: [
      s("4", true, "Doğru. Diamond structure (elmas yapı) içinde her atom tetrahedral (dörtyüzlü), 4 neighbors (komşu) ile."),
      s("6", false, "Hayır. 6 neighbors (komşu) simple cubic (basit kübik) lattice (kafes) içindir."),
      s("12", false, "Hayır. 12 neighbors (komşu) fcc (close-packed, sıkı paket) lattice (kafes) içindir.")
    ],
    kusurSkin: "safsizlik"
  };

  var o05 = {
    id: "s02-o05", tip: "tahmin", baslik: "Tahmin çukuru", kavram: "miller_duzlem", agirlik: 1.5,
    onNot: "Miller indices (Miller indisleri): düzlemin adı (hkl). Bul: axis intercepts (eksen kesişimleri), reciprocals (tersleri), en küçük integers (tam sayılar). Eksene parallel (paralel) düzlemde intercept ∞, index (indis) 0.",
    soru: "Axes (eksenleri) 2, ∞, ∞ noktasında kesen plane (düzlem) için Miller indices (Miller indisleri) nedir? Determine (belirle).",
    secenekler: [
      s("(200)", false, "Yanlış. Önce reciprocal (ters) al: ½, 0, 0. Sonra integer (tam sayı) yap: (100). Miller indices (Miller indisleri) en küçük integers (tam sayılar) olur."),
      s("(100)", true, "Doğru. Reciprocal (ters): ½, 0, 0. İki ile çarp, integer (tam sayı): (100)."),
      s("(210)", false, "Yanlış. ∞ intercept (kesişim), index (indis) 0 yapar; (210) farklı intercepts (kesişimler) ister.")
    ],
    sim: { modul: "miller", onceki: { c: [1, 1, 1] }, sonraki: { c: [2, "inf", "inf"] } },
    acik: "Intercept (kesişim) 2, ∞, ∞. Reciprocal (ters) ½, 0, 0. İki ile çarpınca integer (tam sayı): (100)."
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
          { kim: "selin", metin: "1848'de Bravais: atoms (atomlar) yalnızca 14 lattice (kafes) türünde dizilir. 1913'te Bragg'lar X-ray (X-ışını) ile gördü." },
          { kim: "selin", metin: "Cubic unit cell (kübik birim hücre): sc yalnızca köşelerde atom taşır, bcc ayrıca merkezde, fcc ayrıca yüz merkezlerinde. Önce sayacağız!" },
          { kim: "miller", metin: "Planes (düzlemleri) üç küçük integer (tam sayı) ile adlandırdım: (hkl). Crystal (kristal) bilimcilerin dili oldu." }
        ],
        onBilgi: [
          { baslik: "Miller indices (Miller indisleri): ek notlar", madde: [
            "Negatif intercept (kesişim) için indisin üstüne çizgi (bar) konur: (1 1 1̄).",
            "Cubic (kübik) kristalde komşu (hkl) planes (düzlemleri) arası mesafe: d = a/√(h² + k² + l²).",
            "Wafer (dilim): Czochralski yöntemiyle çekilen tek kristal külçeden kesilir; seed crystal (çekirdek kristal) yönelimi belirler." ] }
        ] },
      { id: "s02-o02", tip: "kavram", baslik: "Kavram kapısı", kavram: "atom_sayisi", agirlik: 1,
        onBilgi: [
          { baslik: "Crystal (kristal) nedir?", madde: [
            "Crystal (kristal): atoms (atomlar) düzenli ve tekrar eden biçimde dizilir.",
            "Bravais (1848): üç boyutta yalnızca 14 lattice (kafes) türü vardır.",
            "Bragg'lar (1913) X-ray (X-ışını) ile bu dizilimi ilk kez ölçtü." ] },
          { baslik: "Unit cell (birim hücre)", madde: [
            "Unit cell (birim hücre): kafesi tekrar ederek kuran en küçük kutu.",
            "Cubic (kübik) türler: sc, bcc, fcc.",
            "Bir köşe atomu 8 hücreyle paylaşılır, yüz atomu 2 hücreyle paylaşılır." ] }
        ],
        gorev: "Say düğmesine bas; fcc unit cell (birim hücre) atom sayısını determine (belirle).",
        sim: { modul: "kafes", params: { tur: "fcc" }, basari: { say: { tur: "fcc", atom: 4 } } },
        ogrenilen: "Corner (köşe) atom (atom) 1/8, face (yüz) atom 1/2 sayılır: fcc unit cell (birim hücre) içinde toplam 4 atoms." },
      o03,
      o04,
      o05,
      { id: "s02-o06", tip: "tuzak", baslik: "Yanılgı tuzağı", kavram: "miller_duzlem", agirlik: 1,
        iddia: "Axis (eksen) ile parallel (paralel) plane (düzlem) için index (indis) sonsuzdur.",
        parcalar: ["Axis (eksen) ile parallel (paralel)", "plane (düzlem) için index (indis)", "sonsuzdur."],
        yanlisParca: 2,
        duzeltme: "Axis (eksen) ile parallel (paralel) plane (düzlem), o axis (ekseni) ∞ noktasında keser (intercept, kesişim); index (indis) 0 olur." },
      { id: "s02-o07", tip: "kopru", baslik: "Mantık köprüsü", kavram: "miller_duzlem", agirlik: 1,
        soru: "Miller indices (Miller indisleri) adımlarını sıraya diz",
        bloklar: [
          "Axis intercepts (eksen kesişimlerini) bul",
          "Reciprocals (tersleri) al",
          "Fractions (kesirleri) en küçük integers (tam sayılara) çevir",
          "Parentheses (parantez) içine yaz: (hkl)"
        ],
        sonuc: "Intercept (kesişim), reciprocal (ters), integer (tam sayı), (hkl): her plane (düzlem) için aynı dört adım." },
      { id: "s02-o08", tip: "patron", baslik: "Plane (Düzlem) Canavarı", kavram: null, agirlik: 1,
        canavar: "miller", canavarAd: "Plane (Düzlem) Canavarı",
        onNot: "Gösterim: (hkl) tek plane (düzlem), {hkl} equivalent planes (eşdeğer düzlemler) ailesi, [uvw] bir direction (yön); cubic (kübik) yapıda [hkl], (hkl) plane için normaldir (diktir). Wafer (dilim): tek kristal külçeden kesilmiş ince silisyum disk; plane seçimi atomic density (atom yoğunluğu) ve surface (yüzey) özelliklerini değiştirir.",
        giris: "Hangi düzlemdeyim? Bil bakalım, yoksa seni yanlış açıdan keserim!",
        fazlar: [
          { tip: "secmeli", kavram: "miller_duzlem",
            soru: "(111) plane (düzlem) axes (eksenler) nerede keser? Determine (belirle): intercepts (kesişimler).",
            secenekler: [
              s("1, 1, 1", true, "Doğru. Reciprocal (ters) 1, 1, 1; integer (tam sayı) zaten (111)."),
              s("1, ∞, ∞", false, "Hayır. Bu (100) plane (düzlem), intercepts (kesişimler) 1, ∞, ∞."),
              s("1, 2, 3", false, "Hayır. (123) intercepts (kesişimleri) 1, ½, ⅓'tür.")
            ],
            alt: {
              soru: "cubic (kübik) yapıda [111] direction (yön) hangi plane (düzlem) için normal (dik)?",
              secenekler: [
                s("(111)", true, "Doğru. Cubic (kübik) yapıda [hkl] direction (yön), (hkl) plane (düzlem) için normaldir (diktir)."),
                s("(100)", false, "Hayır. (100), [100] direction (yön) için normaldir; (111) için [111]."),
                s("(110)", false, "Hayır. (110), [110] direction (yön) için normaldir; (111) için [111].")
              ]
            } },
          { tip: "acik", kavram: "miller_duzlem",
            pdfSoru: null,
            soru: "Miller indices (Miller indisleri) nasıl bulunur? Explain (açıkla): (hkl), {hkl} ve [uvw] ne anlama gelir?",
            anahtarFikirler: [
              "Axis intercepts (eksen kesişimleri) bulunur, reciprocals (tersleri) alınır.",
              "Fractions (kesirler) en küçük integers (tam sayılara) çevrilir, ∞ index (indis) 0 yapar.",
              "(hkl) tek plane (düzlem), {hkl} equivalent planes (eşdeğer düzlemler) ailesidir.",
              "[uvw] bir direction (yön), ⟨uvw⟩ direction family (yön ailesi) demektir."
            ],
            yanlisKavramlar: ["Miller index (Miller indisi) intercept (kesişim) değerinin kendisidir", "Parallel plane (paralel düzlem) için index (indis) sonsuzdur"],
            yanlisKavramIds: ["miller_duzlem", "miller_duzlem"],
            idealCevap: "Plane (düzlem) axes (eksenler) kestiği noktalar (intercepts, kesişimler) bulunur, reciprocals (tersleri) alınır, fractions (kesirler) en küçük integers (tam sayılara) çevrilir. Eksene parallel (paralel) intercept ∞'dur, index (indis) 0 olur. (hkl) tek bir plane, {hkl} symmetry (simetri) ile equivalent planes (eşdeğer düzlemler) ailesidir. [uvw] bir direction (yön), ⟨uvw⟩ equivalent directions (eşdeğer yönler) demektir.",
            yedekSecmeli: {
              soru: "Miller index (Miller indisi) bulurken ilk adım nedir?",
              secenekler: [
                s("Axis (eksen) intercepts (kesişimleri) bulmak", true, "Doğru. Sonra reciprocals (tersleri) alınır."),
                s("Integer (tam sayı) değerine çevirmek", false, "Yanlış. Bu üçüncü adım."),
                s("Parentheses (parantez) yazmak", false, "Yanlış. Bu son adım."),
                s("unit cell (birim hücre) atom (atom) sayısını saymak", false, "Yanlış. Miller indices (Miller indisleri) ile ilgisiz.")
              ]
            },
            alt: { soru: "Intercepts (kesişimleri) 1, 2, ∞ olan plane (düzlem) için indisi adımlarıyla derive (türet)." } },
          { tip: "acik", kavram: "duzlem_neden",
            pdfSoru: null,
            soru: "Silicon (silisyum) wafer (dilim) neden belirli bir crystal plane (kristal düzlemi) boyunca kesilir? Explain (açıkla).",
            anahtarFikirler: [
              "Planes (düzlemler) farklı atomic density (atom yoğunluğu) taşır.",
              "Surface (yüzey) özellikleri plane (düzlem) değerine göre değişir.",
              "Interface defect density (arayüz kusur yoğunluğu) device (aygıt) performansını etkiler.",
              "Bu yüzden (100) veya (111) gibi belirli planes (düzlemler) seçilir."
            ],
            yanlisKavramlar: ["Hangi plane (düzlem) boyunca kesildiği fark etmez", "Plane (düzlem) seçimi yalnızca wafer (dilim) şekli içindir"],
            yanlisKavramIds: ["duzlem_neden", "duzlem_neden"],
            idealCevap: "Her crystal plane (kristal düzlemi) için atomic density (atom yoğunluğu) ve surface (yüzey) özellikleri farklıdır. Surface (yüzey) üzerindeki interface defects (arayüz kusurları) device (aygıt) performansını etkiler, bu yüzden device için uygun (100) veya (111) gibi belirli bir plane (düzlem) seçilir.",
            yedekSecmeli: {
              soru: "Wafer (dilim) orientation (yönelim) neden önemlidir?",
              secenekler: [
                s("Surface (yüzey) ve interface (arayüz) özellikleri plane (düzlem) değerine göre değişir", true, "Doğru. Atomic density (atom yoğunluğu) ve defect density (kusur yoğunluğu) plane (düzlem) değerine bağlıdır."),
                s("Yalnızca wafer (dilim) daha parlak olsun diye", false, "Yanlış. Parlaklık (brightness) sebep değil."),
                s("Hiç önemi yoktur", false, "Yanlış. Device (aygıt) performansını etkiler."),
                s("Atoms (atom) plane (düzlem) değerine göre kaybolur", false, "Yanlış. Atom (atom) kaybolmaz.")
              ]
            },
            alt: { soru: "(100) ve (111) planes (düzlemleri) arasındaki farkı compare (karşılaştır): device (aygıt) için neden önemli?" } }
        ] },
      { id: "s02-h01", tip: "hesap", baslik: "Hesap görevi", kavram: null, agirlik: 0, hesapGorev: "miller-326" },
      { id: "s02-o09", tip: "sandik", baslik: "Sandık", kavram: null, agirlik: 1,
        kart: { id: "miller", yil: 1839, tekCumle: "Planes (düzlemleri) üç küçük integer (tam sayı) ile adlandırdı: Miller indices (Miller indisleri)." },
        ozet: [
          "Atoms per unit cell (hücre başına atom): sc 1, bcc 2, fcc 4",
          "Miller: intercept (kesişim), reciprocal (ters), integer (tam sayı)",
          "(hkl) plane (düzlem), [uvw] direction (yön)"
        ],
        kontrolNoktasi: true }
    ],
    temelTur: {
      kartlar: [
        { baslik: "Unit cell (birim hücre) ve atom (atom)", metin: "Unit cell (birim hücre) tekrar eder. Corner (köşe) 1/8, face (yüz) 1/2, inside (iç) atom 1 sayılır." },
        { baslik: "Miller indices (Miller indisleri) adımları", metin: "Intercept (kesişim) bul, reciprocal (ters) al, integer (tam sayı) yap, (hkl) yaz." },
        { baslik: "What happens at ∞ (infinity, sonsuz)?", metin: "Axis (eksen) ile parallel (paralel) plane (düzlem) o axis (ekseni) ∞ noktasında keser; index (indis) 0 olur." }
      ],
      sim: { modul: "miller", params: { c: [1, 1, 1] } }
    },
    tekrarHavuzu: [
      { id: "s02-t01", tip: "dusman", baslik: "Defect (kusur) düşmanı", kavram: "atom_sayisi", agirlik: 1,
        soru: o03.soru, secenekler: o03.secenekler.map(kopya), kusurSkin: "vakans" },
      { id: "s02-t02", tip: "dusman", baslik: "Defect (kusur) düşmanı", kavram: "birim_hucre", agirlik: 1,
        soru: o04.soru, secenekler: o04.secenekler.map(kopya), kusurSkin: "safsizlik" },
      { id: "s02-t03", tip: "dusman", baslik: "Defect (kusur) düşmanı", kavram: "miller_duzlem", agirlik: 1,
        soru: o05.soru, secenekler: o05.secenekler.map(kopya), kusurSkin: "vakans" },
      { id: "s02-t04", tip: "dusman", baslik: "Defect (kusur) düşmanı", kavram: "miller_yon", agirlik: 1,
        soru: "[100] direction (yön) hangi axis (eksen) ile parallel (paralel) olur?",
        secenekler: [
          s("x axis (x ekseni)", true, "Doğru. [100] = (1,0,0) vector (vektör), x direction (yön)."),
          s("y axis (y ekseni)", false, "Hayır. y direction (yön) [010]."),
          s("z axis (z ekseni)", false, "Hayır. z direction (yön) [001].")
        ],
        kusurSkin: "dislokasyon" }
    ]
  };
})();
