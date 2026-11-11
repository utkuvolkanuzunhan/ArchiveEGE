/* 90-data-s03.js · İstasyon 03 "Işık-test odası" verisi (E3)
 * Q.data.stations.s03 alanını doldurur. Metinler oyun/istasyonlar/03-isik-test-odasi.md'den aynen alınır.
 * Bağımlılık: 00-q.js (Q.data). Çalışma anında yalnızca veri okunur, fonksiyon çağrılmaz.
 * Şema: oyun/01-veri-semalari.md §3.
 */
(function(){
  'use strict';

  function sec(t, dogru, neden){ return { t: t, dogru: dogru, neden: neden }; }

  var o03 = {
    id: 's03-o03', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'karacisim_felaket', agirlik: 1,
    soru: 'Ultraviolet catastrophe (mor ötesi felaketi), klasik teorinin neyi yanlış öngörmesidir?',
    secenekler: [
      sec('Kısa wavelength (dalga boyu) değerinde sonsuz enerji', true, 'Doğru. Klasik teori yüksek frequency (frekans) değerinde enerjiyi sonsuz buluyordu.'),
      sec('Işığın hiç yayılmaması', false, 'Hayır. Sorun sonsuz enerji öngörüsüydü.'),
      sec('Sıcaklığın hep sabit kalması', false, 'Hayır. Sıcaklıkla ilgili bir sorun değildi.')
    ],
    kusurSkin: 'vakans'
  };

  var o04 = {
    id: 's03-o04', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'planck_paket', agirlik: 1,
    soru: 'Planck\'a göre bir ışık paketinin (photon, foton) enerjisi neye bağlıdır?',
    secenekler: [
      sec('Frekansına (E = hf)', true, 'Doğru. Yüksek frekans, büyük paket.'),
      sec('Intensity (şiddet) değerine', false, 'Hayır. Intensity paket sayısını belirler.'),
      sec('Hızına', false, 'Hayır. Işığın hızı sabit; enerji frekansla değişir.')
    ],
    kusurSkin: 'tane_siniri'
  };

  var o05 = {
    id: 's03-o05', tip: 'tahmin', baslik: 'Tahmin çukuru', kavram: 'fotoelektrik_siddet', agirlik: 1.5,
    soru: 'Threshold frequency (eşik frekans) altındaki ışığı 10 kat parlatırsan kaç elektron kopar? Explain (açıkla).',
    secenekler: [
      sec('Çok sayıda', false, 'Yanlış. Tek photon (foton) yetmezse kaç photon olursa olsun elektron kopmaz.'),
      sec('Hiç', true, 'Doğru. Intensity (şiddet) photon sayısını artırır, photon başına enerjiyi değil.'),
      sec('Gecikmeyle kopar', false, 'Yanlış. Enerji birikmez, time delay (gecikme) gözlenmez.')
    ],
    sim: {
      modul: 'fotoelektrik',
      onceki: { f: 3.0, I: 1, metal: 'Na' },
      sonraki: { f: 3.0, I: 10, metal: 'Na' }
    },
    acik: 'hf < φ: photon başına enerji yetmiyor, parlaklık işe yaramaz.'
  };

  Q.data.stations.s03 = {
    id: 's03',
    sira: 3,
    ad: 'Işık-test odası',
    makine: 'Işık-test odası',
    renk: '#ffd23f',
    konu: 'Neden quantum mechanics (kuantum mekaniği)? Blackbody (kara cisim), photoelectric effect (fotoelektrik olay)',
    sinavSorulari: ['S3'],
    sureHedefDk: 22,
    patronId: 'einstein',
    kavramlar: ['karacisim_felaket', 'planck_paket', 'fotoelektrik_siddet', 'kuantum_rastgele_sanisi'],
    engeller: [
      {
        id: 's03-o01', tip: 'hikaye', baslik: 'Zaman kapısı', kavram: null, agirlik: 1,
        yer: 'Berlin', yil: 1900, rivayet: false,
        satirlar: [
          { kim: 'selin', metin: 'Işık-test odası ışığı ölçüyor. Classical physics (klasik fizik) burada tökezledi.' },
          { kim: 'planck', metin: 'Energy quantum (enerji paketi) fikriyle sonsuzluk kayboldu. Çaresizlikten attığım bir adımdı.' },
          { kim: 'einstein', metin: 'Ben ışığı paketlere böldüm: photons (fotonlar). Photoelectric effect (fotoelektrik olay) böyle açıklandı.' }
        ]
      },
      {
        id: 's03-o02', tip: 'kavram', baslik: 'Kavram kapısı', kavram: 'karacisim_felaket', agirlik: 1,
        gorev: 'Temperature (sıcaklık) değerini 5000 K yap, classical curve (klasik eğri) açık kalsın.',
        sim: {
          modul: 'karacisim',
          params: { T: 3000 },
          basari: { T: [4900, 5100], klasikGoster: true }
        },
        ogrenilen: 'Classical curve (klasik eğri) kısa wavelength (dalga boyu) değerinde patlıyor; Planck curve (Planck eğrisi) patlamıyor.'
      },
      o03,
      o04,
      o05,
      {
        id: 's03-o06', tip: 'tuzak', baslik: 'Yanılgı tuzağı', kavram: 'fotoelektrik_siddet', agirlik: 1,
        iddia: 'Işığı yeterince parlatırsan threshold (eşik) altında da elektron koparabilirsin.',
        parcalar: ['Işığı yeterince parlatırsan', 'threshold (eşik) altında da', 'elektron koparabilirsin.'],
        yanlisParca: 0,
        duzeltme: 'Threshold (eşik) altında parlaklık işe yaramaz; elektron için photon (foton) başına yeterli enerji gerekir.'
      },
      {
        id: 's03-o07', tip: 'kopru', baslik: 'Mantık köprüsü', kavram: 'fotoelektrik_siddet', agirlik: 1,
        soru: 'Photoelectric effect (fotoelektrik olay) mantığını sıraya diz',
        bloklar: [
          'Işık photon (foton) paketlerinden oluşur',
          'Photon energy (foton enerjisi) E = hf',
          'hf, work function (iş fonksiyonu) aşarsa elektron kopar',
          'Intensity (şiddet) yalnızca elektron sayısını artırır'
        ],
        sonuc: 'Photon energy (foton enerjisi) frequency (frekans) ile belirlenir, threshold (eşik) aşılırsa elektron kopar, intensity (şiddet) sayıyı artırır.'
      },
      {
        id: 's03-o08', tip: 'patron', baslik: 'Foton Canavarı', kavram: null, agirlik: 1,
        canavar: 'einstein', canavarAd: 'Foton Canavarı',
        giris: 'Ben photon (foton) canavarıyım! Parlaklığımı artırsam da seni threshold (eşik) değerinden geçirmem.',
        fazlar: [
          {
            tip: 'secmeli', kavram: 'fotoelektrik_siddet',
            soru: 'Photoelectric effect (fotoelektrik olay) içinde elektronun kinetic energy (kinetik enerji) değeri neye bağlıdır?',
            secenekler: [
              sec('Işığın frequency (frekans) değerine (K = hf − φ)', true, 'Doğru. Frequency arttıkça kinetic energy artar.'),
              sec('Işığın intensity (şiddet) değerine', false, 'Hayır. Intensity elektron sayısını etkiler.'),
              sec('Metalin kalınlığına', false, 'Hayır. Thickness (kalınlık) enerjiyi belirlemez.')
            ],
            alt: {
              soru: 'Frequency (frekans) değerini ikiye katlarsan photon energy (foton enerjisi) ne olur?',
              secenekler: [
                sec('İki katına çıkar', true, 'Doğru. E = hf, frequency ile orantılı.'),
                sec('Aynı kalır', false, 'Hayır. Enerji frequency ile artar.'),
                sec('Yarıya iner', false, 'Hayır. Frequency artınca enerji düşmez.')
              ]
            }
          },
          {
            tip: 'acik',
            pdfSoru: 'Explain the reasons for the emergence and success of quantum mechanics.',
            soru: 'Quantum mechanics (kuantum mekaniği) neden doğdu ve neden başarılı oldu? Explain (açıkla).',
            anahtarFikirler: [
              'Classical physics (klasik fizik) blackbody radiation (kara cisim ışıması) ve ultraviolet catastrophe sorununu açıklayamadı.',
              'Photoelectric effect (fotoelektrik olay) ve discrete atomic spectra (ayrık atom spektrumları) da açıklanamadı.',
              'Çözüm: quantized energy (paketli enerji, E = hf), wave-particle duality (dalga-parçacık ikiliği).',
              'Başarı: bu gözlemleri ve atom ile solid (katı) özelliklerini doğru öngördü.'
            ],
            yanlisKavramlar: [
              'Işığın intensity (şiddet) değeri artarsa threshold (eşik) altında da elektron kopar',
              'Quantum (kuantum) küçük cisimlerde bilgi eksikliğinden doğan randomness (rastgelelik) demektir'
            ],
            yanlisKavramIds: ['fotoelektrik_siddet', 'kuantum_rastgele_sanisi'],
            idealCevap: 'Classical physics (klasik fizik) blackbody radiation (kara cisim ışıması), photoelectric effect (fotoelektrik olay) ve discrete spectrum (ayrık spektrum) olaylarını açıklayamadı. Planck enerjiyi quantized (paketli, E = hf) kabul etti, Einstein ışığı photon (foton) olarak aldı, madde wave behavior (dalga davranışı) gösterdi. Quantum mechanics (kuantum mekaniği) bu gözlemleri ve atom ile solid (katı) özelliklerini doğru öngördüğü için başarılıdır.',
            yedekSecmeli: {
              soru: 'Quantum mechanics (kuantum mekaniği) neden doğdu?',
              secenekler: [
                sec('Classical physics (klasik fizik) blackbody, photoelectric, spectra olaylarını açıklayamadı', true, 'Doğru. Üç temel başarısızlık.'),
                sec('Bilgisayarlar icat edildiği için', false, 'Yanlış. Kuantum bilgisayardan öncedir.'),
                sec('Newton yanıldığı için her şey değişti', false, 'Yanlış. Klasik fizik büyük ölçekte hâlâ geçerli.'),
                sec('Işık hiç wave (dalga) olmadığı için', false, 'Yanlış. Işık hem dalga hem parçacık gibi davranır.')
              ]
            },
            alt: { soru: 'Classical physics (klasik fizik) için açıklanamayan üç gözlemi state (belirt).' }
          },
          {
            tip: 'acik',
            pdfSoru: null,
            soru: 'Photoelectric effect (fotoelektrik olay) için classical wave theory (klasik dalga teorisi) neden açıklama yapamaz? Explain (açıkla).',
            anahtarFikirler: [
              'Classical wave (klasik dalga) modelinde intensity (şiddet) arttıkça enerji artar, threshold (eşik) beklenmez.',
              'Deneyde threshold frequency (eşik frekans) altında elektron hiç kopmaz.',
              'Elektron tek bir photon (foton) enerjisi alır, enerji birikmez.',
              'Kinetic energy (kinetik enerji) frequency ile artar, intensity ile değil.'
            ],
            yanlisKavramlar: [
              'Elektronlar enerjiyi biriktirip time delay (gecikme) ile çıkar',
              'Brightness (parlaklık) elektronun enerjisini artırır'
            ],
            yanlisKavramIds: ['fotoelektrik_siddet', 'fotoelektrik_siddet'],
            idealCevap: 'Classical wave theory (klasik dalga teorisi) içinde intensity (şiddet) arttıkça enerji artar, yani yeterince parlak ışık her frequency (frekans) değerinde elektron koparmalıydı. Deneyde threshold frequency (eşik frekans) altında hiç elektron kopmaz, üstünde ise gecikmesiz kopar. Einstein: elektron tek bir photon (foton) enerjisi alır, kinetic energy (kinetik enerji) frequency ile artar, intensity yalnızca sayıyı artırır.',
            yedekSecmeli: {
              soru: 'Classical theory (klasik teori) photoelectric effect (fotoelektrik olay) için neyi yanlış bekler?',
              secenekler: [
                sec('Yeterince parlak ışığın her frequency (frekans) değerinde elektron koparmasını', true, 'Doğru. Deneyde threshold (eşik) altında hiç kopmaz.'),
                sec('Elektronun hiç kopmamasını', false, 'Yanlış. Klasik teori kopacağını söyler.'),
                sec('Işığın hızının değişmesini', false, 'Yanlış. Hız konusu değil.'),
                sec('Metalin erimesini', false, 'Yanlış. Erime konusu değil.')
              ]
            },
            alt: { soru: 'Threshold frequency (eşik frekans) deneyi wave theory (dalga teorisi) modelini nasıl çürütür? Explain (açıkla).' }
          }
        ]
      },
      {
        id: 's03-o09', tip: 'sandik', baslik: 'Sandık', kavram: null, agirlik: 1,
        kart: { id: 'einstein', yil: 1905, tekCumle: 'Işığı photon (foton) paketlerine bölüp photoelectric effect (fotoelektrik olay) olayını açıkladı.' },
        ozet: ['Classical physics (klasik fizik) üç yerde tökezledi', 'E = hf: enerji paket paket (quantized, paketli)', 'Threshold (eşik) altı: intensity (şiddet) işe yaramaz'],
        kontrolNoktasi: true
      }
    ],
    temelTur: {
      kartlar: [
        { baslik: 'Ultraviolet catastrophe (mor ötesi felaketi)', metin: 'Klasik teori kısa wavelength (dalga boyu) değerinde sonsuz enerji buluyordu.' },
        { baslik: 'Quantized energy (paket enerji)', metin: 'Planck: ışık paket paket yayılır, E = hf.' },
        { baslik: 'Threshold (eşik)', metin: 'Tek photon (foton) yetmezse parlaklık işe yaramaz.' }
      ],
      sim: { modul: 'fotoelektrik', params: { f: 3.0, I: 1, metal: 'Na' } }
    },
    tekrarHavuzu: [
      Object.assign({}, o03, { id: 's03-t01' }),
      Object.assign({}, o04, { id: 's03-t02' }),
      {
        id: 's03-t03', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'fotoelektrik_siddet', agirlik: 1,
        soru: o05.soru,
        secenekler: o05.secenekler,
        kusurSkin: 'vakans'
      },
      {
        id: 's03-t04', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'kuantum_rastgele_sanisi', agirlik: 1,
        soru: 'Quantum randomness (kuantum rastgeleliği) neden bilgi eksikliği değildir? Explain (açıkla).',
        secenekler: [
          sec('Doğanın temel yapısıdır, daha çok bilgiyle ortadan kalkmaz', true, 'Doğru. Standart yorumda probability (olasılık) temeldir.'),
          sec('Aletler yetersiz olduğu için', false, 'Hayır. Daha iyi alet randomness (rastgelelik) durumunu gidermez.'),
          sec('Yalnızca sıcaklıkla oluşur', false, 'Hayır. Sıcaklıktan bağımsızdır.')
        ],
        kusurSkin: 'safsizlik'
      }
    ]
  };
})();
