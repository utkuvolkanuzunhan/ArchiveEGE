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
    soru: "Amorf (amorphous) katıda atomlar long-range order (uzun menzilli düzen) gösterir mi?",
    secenekler: [
      sec("Evet, kristal gibi", false, "Hayır. Long-range order yalnızca kristalde vardır."),
      sec("Hayır, düzen yalnızca yakın komşuluktadır", true, "Doğru. Amorfta yalnızca short-range order (kısa menzilli düzen) vardır."),
      sec("Yalnızca soğuyunca düzenlenir", false, "Yanlış. Amorf kalan katıda long-range order hiç oluşmaz.")
    ],
    kusurSkin: "vakans"
  };

  var o04 = {
    id: "s01-o04", tip: "dusman", baslik: "Kusur düşmanı", kavram: "tane_siniri", agirlik: 1,
    soru: "Polycrystalline (çok kristalli) malzemede grain boundary (tane sınırı) nedir?",
    secenekler: [
      sec("İki grain (tane) arasındaki düzensiz ara bölge", true, "Doğru. Kristal yönünün değiştiği interface (ara yüz) bölgesidir."),
      sec("Kristalin dış yüzeyi", false, "Hayır. Grain boundary malzemenin içinde, tanelerin buluştuğu yerdir."),
      sec("Katkı atomlarının toplandığı yer", false, "Hayır. Grain boundary, kristal yönünün değiştiği ara yüzdür.")
    ],
    kusurSkin: "tane_siniri"
  };

  var o05secenekler = [
    sec("Artar", false, "Yanlış. Grain boundary elektronu saçar (scattering), mean free path (serbest yol) kısalır."),
    sec("Azalır", true, "Doğru. Her grain boundary bir engeldir."),
    sec("Değişmez", false, "Yanlış. Grain boundary ek scattering (saçılma) getirir.")
  ];

  Q.data.stations.s01 = {
    id: "s01",
    sira: 1,
    ad: "Kristal fırını",
    makine: "Kristal fırını",
    renk: "#ff9f1c",
    konu: "Katı türleri, neden crystal (kristal), CZ ile single crystal (tek kristal)",
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
        gorev: "Elektronu üç malzemeden de geçir; scattering (saçılma) farkını gözle.",
        sim: { modul: "kristal_tur", params: { mod: "tur" }, basari: { hepsiniDene: true } },
        ogrenilen: "Düzen bozuldukça elektron daha çok saçılır (scattering); single crystal (tek kristal) içinde yolu en açıktır."
      },
      o03,
      o04,
      {
        id: "s01-o05", tip: "tahmin", baslik: "Tahmin çukuru", kavram: "tane_siniri", agirlik: 1.5,
        soru: "Single crystal (tek kristal) yerine polycrystalline (çok kristalli) malzeme kullanırsan mean free path (serbest yol) ne olur?",
        secenekler: o05secenekler,
        sim: { modul: "kristal_tur", onceki: { mod: "serbest_yol" }, sonraki: { mod: "serbest_yol", gonder: true } },
        acik: "Grain boundary elektronu saçıyor; single crystal içinde yol açık, mean free path uzun."
      },
      {
        id: "s01-o06", tip: "tuzak", baslik: "Yanılgı tuzağı", kavram: "kristal_pahali", agirlik: 1,
        iddia: "Kristal pahalı olduğu için semiconductor (yarıiletken) endüstrisinde tercih edilir.",
        parcalar: ["Kristal pahalı olduğu için", "semiconductor (yarıiletken) endüstrisinde", "tercih edilir."],
        yanlisParca: 0,
        duzeltme: "Crystal (kristal) periyodik olduğu için energy band (enerji bandı) yapısı öngörülebilir, özellikler kontrol edilebilir."
      },
      {
        id: "s01-o07", tip: "kopru", baslik: "Mantık köprüsü", kavram: "kristal_neden", agirlik: 1,
        soru: "Zinciri sıraya diz",
        bloklar: ["Lattice (kafes) periyodik tekrar eder", "Elektron periodic potential (periyodik potansiyel) görür", "Energy bands (enerji bantları) net oluşur", "Özellikler öngörülebilir ve tekrarlanabilir"],
        sonuc: "Periodic lattice, periodic potential, net bantlar, öngörülebilir aygıt."
      },
      {
        id: "s01-o08", tip: "patron", baslik: "Tane Sınırı Canavarı", kavram: null, agirlik: 1,
        canavar: "czoch", canavarAd: "Tane Sınırı Canavarı",
        giris: "Ben grain boundary (tane sınırı) canavarıyım! Elektronlarını saçarım. Beni nasıl yenersin?",
        fazlar: [
          {
            tip: "secmeli", kavram: "cz_tohum",
            soru: "CZ (Czochralski) yönteminde seed crystal (tohum kristal) görevi nedir?",
            secenekler: [
              sec("Eriyiği ısıtır", false, "Hayır. Isıtmayı fırın yapar, seed değil."),
              sec("Katılaşan atomlara kristal düzenini aktarır", true, "Doğru. Atomlar seed crystal düzenini sürdürür."),
              sec("Eriyiği karıştırır", false, "Hayır. Karıştırma tohumun işi değil.")
            ],
            alt: {
              soru: "CZ'de ingot (külçe) neden yavaşça döndürülerek çekilir?",
              secenekler: [
                sec("Tohumun düzeni homojen sürsün diye", true, "Doğru. Yavaş ve düzgün çekme single crystal yapısını korur."),
                sec("Daha hızlı soğusun diye", false, "Hayır. Hızlı soğuma defect (kusur) yapar."),
                sec("Eriyik atılsın diye", false, "Hayır. Amaç eriyik atmak değil.")
              ]
            }
          },
          {
            tip: "acik", kavram: "kristal_neden",
            pdfSoru: "Why are crystalline solids used in the semiconductor industry?",
            soru: "Crystalline solids (kristal katılar) semiconductor (yarıiletken) endüstrisinde neden kullanılır? Explain (açıkla).",
            anahtarFikirler: [
              "Kristalde atomlar periyodik dizilir, periodic potential (periyodik potansiyel) oluşur.",
              "Periyodiklik iyi tanımlı energy bands (enerji bantları) ve bandgap (yasak enerji aralığı) verir.",
              "Özellikler öngörülebilir ve tekrarlanabilir, doping (katkılama) ile kontrol edilir.",
              "Çok kristalli veya amorfta carriers (taşıyıcılar) grain boundary üzerinde saçılır."
            ],
            yanlisKavramlar: ["Kristal pahalı olduğu için tercih edilir", "Kristal sadece daha parlak olduğu için kullanılır"],
            yanlisKavramIds: ["kristal_pahali", "kristal_pahali"],
            idealCevap: "Kristalde atomlar periyodik dizilir. Bu periodic potential (periyodik potansiyel) iyi tanımlı energy bands (enerji bantları) ve bandgap (yasak enerji aralığı) doğurur. Böylece iletkenlik öngörülebilir, doping (katkılama) ile kontrol edilir ve her aygıtta tekrarlanır. Çok kristalli veya amorf malzemede grain boundary taşıyıcıları (carriers) saçar.",
            yedekSecmeli: {
              soru: "Kristal neden semiconductor (yarıiletken) aygıtta tercih edilir?",
              secenekler: [
                sec("Periyodik yapı öngörülebilir energy bands verir", true, "Doğru. Periodic potential net bantlar ve tekrarlanabilirlik sağlar."),
                sec("Kristal en ucuz malzemedir", false, "Yanlış. Maliyet sebep değil, tam tersine kristal büyütmek pahalıdır."),
                sec("Kristal ışığı daha çok yansıtır", false, "Yanlış. Yansıma elektriksel özelliklerle ilgisizdir."),
                sec("Kristalde elektron hiç saçılmaz", false, "Yanlış. Phonon (fonon) ve defect (kusur) saçılması vardır, ama çok daha az.")
              ]
            },
            alt: { soru: "Amorf silisyum yerine single crystal silicon (tek kristal silisyum) neden tercih edilir?" }
          },
          {
            tip: "acik", kavram: "tane_siniri",
            pdfSoru: "Explain the main reason for single-crystal growth in the CZ method",
            soru: "Explain (açıkla): CZ yönteminde single crystal (tek kristal) büyütmenin ana nedeni nedir?",
            anahtarFikirler: [
              "Single crystal içinde grain boundary yoktur.",
              "Grain boundary carriers (taşıyıcıları) saçar ve tuzaklar.",
              "Mobility (hareketlilik) ve carrier lifetime (taşıyıcı ömrü) yüksek kalır.",
              "Tüm wafer boyunca aynı özellik, tekrarlanabilir aygıt."
            ],
            yanlisKavramlar: ["Tek kristal sadece daha güzel görünür", "Tane sınırı elektriği daha iyi iletir"],
            yanlisKavramIds: ["kristal_pahali", "tane_siniri"],
            idealCevap: "Single crystal içinde grain boundary yoktur. Grain boundary carriers (taşıyıcıları) saçar ve tuzaklar, mobility (hareketlilik) ve lifetime (ömür) düşer. Single crystal, wafer boyunca aynı band structure (bant yapısı) ve tekrarlanabilir aygıt özelliklerini sağlar.",
            yedekSecmeli: {
              soru: "CZ'de single crystal (tek kristal) neden istenir?",
              secenekler: [
                sec("Grain boundary yok, carriers saçılmaz", true, "Doğru. Mobility ve lifetime yüksek kalır."),
                sec("Tek kristal daha hızlı büyür", false, "Yanlış. Tek kristal yavaş büyütülür."),
                sec("Tane sınırı akımı artırır", false, "Yanlış. Grain boundary carriers saçar."),
                sec("Kristal rengi daha homojen olur", false, "Yanlış. Renk sebep değil.")
              ]
            },
            alt: { soru: "Grain boundary aygıt performansını nasıl bozar? Justify (gerekçelendir)." }
          }
        ]
      },
      {
        id: "s01-o09", tip: "sandik", baslik: "Sandık", kavram: null, agirlik: 1,
        kart: { id: "czoch", yil: 1916, tekCumle: "Melt (eriyik) içinden seed (tohum) ile single crystal (tek kristal) çekmenin yolunu buldu." },
        ozet: ["Crystal (kristal): periyodik düzen", "Grain boundary elektronu saçar", "CZ: seed crystal melt içinden yavaşça çekilir"],
        kontrolNoktasi: true
      }
    ],
    temelTur: {
      kartlar: [
        { baslik: "Crystal (kristal) nedir?", metin: "Atomlar long-range order (uzun menzilli düzen) ile dizilir." },
        { baslik: "Neden scattering?", metin: "Düzen bozuldukça elektron daha sık saçılır (scattering)." },
        { baslik: "CZ nedir?", metin: "Seed crystal (tohum kristal) melt içinden yavaşça çekilir, düzen sürer." }
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
        soru: "Single crystal (tek kristal) yerine polycrystalline (çok kristalli) malzeme kullanırsan mean free path (serbest yol) ne olur?",
        secenekler: kopya(o05secenekler), kusurSkin: "tane_siniri"
      },
      {
        id: "s01-t04", tip: "dusman", baslik: "Kusur düşmanı", kavram: "cz_tohum", agirlik: 1,
        soru: "CZ'de seed crystal (tohum kristal) ne işe yarar?",
        secenekler: [
          sec("Düzeni atomlara aktarır", true, "Doğru. Katılaşan atomlar seed crystal düzenini sürdürür."),
          sec("Eriyiği soğutur", false, "Hayır. Cooling (soğutma) seed işi değil."),
          sec("Eriyiği temizler", false, "Hayır. Temizlik başka süreç.")
        ],
        kusurSkin: "dislokasyon"
      },
      {
        id: "s01-t05", tip: "dusman", baslik: "Kusur düşmanı", kavram: "kristal_neden", agirlik: 1,
        soru: "Çip için neden single crystal silicon (tek kristal silisyum) kullanılır?",
        secenekler: [
          sec("Elektron akışı düzenli dizilimde öngörülebilir olur", true, "Doğru. Düzenli lattice (kafes) elektronu rastgele saçmaz."),
          sec("Daha parlak göründüğü için", false, "Hayır. Parlaklık seçim nedeni değil."),
          sec("Her zaman daha ucuz olduğu için", false, "Hayır. Single crystal üretmek pahalıdır.")
        ],
        kusurSkin: "vakans"
      }
    ]
  };
})();
