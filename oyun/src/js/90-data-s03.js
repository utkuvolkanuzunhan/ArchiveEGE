/* 90-data-s03.js · İstasyon 03 "Işık-test odası" verisi (E3)
 * Q.data.stations.s03 alanını doldurur. Metinler oyun/istasyonlar/03-isik-test-odasi.md'den aynen alınır.
 * Bağımlılık: 00-q.js (Q.data). Çalışma anında yalnızca veri okunur, fonksiyon çağrılmaz.
 * Şema: oyun/01-veri-semalari.md §3.
 */
(function(){
  'use strict';

  function sec(t, dogru, neden){ return { t: t, dogru: dogru, neden: neden }; }

  var o03 = {
    id: 's03-o03', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'karacisim_felaket', agirlik: 1,
    soru: 'Ultraviolet catastrophe (mor ötesi felaketi), classical theory (klasik teori) neyi yanlış öngörmesidir?',
    secenekler: [
      sec('Kısa wavelength (dalga boyu) değerinde infinite energy (sonsuz enerji)', true, 'Doğru. Classical theory (klasik teori) yüksek frequency (frekans) değerinde energy (enerji) değerini sonsuz buluyordu.'),
      sec('No emission (yayılma) of light (ışık)', false, 'Hayır. Sorun infinite energy (sonsuz enerji) öngörüsüydü.'),
      sec('Temperature (sıcaklık) hep sabit kalması', false, 'Hayır. Temperature (sıcaklık) ile ilgili bir sorun değildi.')
    ],
    kusurSkin: 'vakans'
  };

  var o04 = {
    id: 's03-o04', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'planck_paket', agirlik: 1,
    soru: 'Planck\'a göre bir photon (foton) energy (enerji) değeri neye bağlıdır?',
    secenekler: [
      sec('Frequency (frekans) değerine (E = hf)', true, 'Doğru. Yüksek frequency (frekans), büyük paket.'),
      sec('Intensity (şiddet) değerine', false, 'Hayır. Intensity (şiddet) paket sayısını belirler.'),
      sec('Speed (hız) değerine', false, 'Hayır. Light (ışık) speed (hız) sabit; energy (enerji) frequency (frekans) ile değişir.')
    ],
    kusurSkin: 'tane_siniri'
  };

  var o05 = {
    id: 's03-o05', tip: 'tahmin', baslik: 'Tahmin çukuru', kavram: 'fotoelektrik_siddet', agirlik: 1.5,
    soru: 'Threshold frequency (eşik frekans) altındaki light (ışık) 10 kat parlatırsan kaç electron (elektron) kopar? Explain (açıkla).',
    secenekler: [
      sec('Çok sayıda electron (elektron)', false, 'Yanlış. Tek photon (foton) yetmezse kaç photon (foton) olursa olsun electron (elektron) kopmaz.'),
      sec('Hiç electron (elektron)', true, 'Doğru. Intensity (şiddet) photon (foton) sayısını artırır, photon başına energy (enerji) değerini değil.'),
      sec('time delay (gecikme) ile electron (elektron) kopar', false, 'Yanlış. Energy (enerji) birikmez, time delay (gecikme) gözlenmez.')
    ],
    sim: {
      modul: 'fotoelektrik',
      onceki: { f: 3.0, I: 1, metal: 'Na' },
      sonraki: { f: 3.0, I: 10, metal: 'Na' }
    },
    acik: 'hf < φ: photon (foton) başına energy (enerji) yetmiyor, brightness (parlaklık) işe yaramaz.'
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
          { kim: 'selin', metin: 'Işık-test odası light (ışık) ölçüyor. Classical physics (klasik fizik) burada tökezledi.' },
          { kim: 'planck', metin: 'Energy quantum (enerji paketi) fikriyle infinity (sonsuzluk) kayboldu. Çaresizlikten attığım bir adımdı.' },
          { kim: 'einstein', metin: 'Ben light (ışık) paketlere böldüm: photons (fotonlar). Photoelectric effect (fotoelektrik olay) böyle açıklandı.' }
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
        iddia: 'Light (ışık) yeterince parlatırsan threshold (eşik) altında da electron (elektron) koparabilirsin.',
        parcalar: ['Light (ışık) yeterince parlatırsan', 'threshold (eşik) altında da', 'electron (elektron) koparabilirsin.'],
        yanlisParca: 0,
        duzeltme: 'Threshold (eşik) altında brightness (parlaklık) işe yaramaz; electron (elektron) için photon (foton) başına yeterli energy (enerji) gerekir.'
      },
      {
        id: 's03-o07', tip: 'kopru', baslik: 'Mantık köprüsü', kavram: 'fotoelektrik_siddet', agirlik: 1,
        soru: 'Photoelectric effect (fotoelektrik olay) mantığını sıraya diz',
        bloklar: [
          'Light (ışık) photon (foton) paketlerinden oluşur',
          'Photon energy (foton enerjisi) E = hf',
          'hf, work function (iş fonksiyonu) aşarsa electron (elektron) kopar',
          'Intensity (şiddet) yalnızca electron (elektron) sayısını artırır'
        ],
        sonuc: 'Photon energy (foton enerjisi) frequency (frekans) ile belirlenir, threshold (eşik) aşılırsa electron (elektron) kopar, intensity (şiddet) sayıyı artırır.'
      },
      {
        id: 's03-o08', tip: 'patron', baslik: 'Photon (Foton) Canavarı', kavram: null, agirlik: 1,
        canavar: 'einstein', canavarAd: 'Photon (Foton) Canavarı',
        giris: 'Ben photon (foton) canavarıyım! Brightness (parlaklık) artırsam da seni threshold (eşik) değerinden geçirmem.',
        fazlar: [
          {
            tip: 'secmeli', kavram: 'fotoelektrik_siddet',
            soru: 'Photoelectric effect (fotoelektrik olay) içinde electron (elektron) kinetic energy (kinetik enerji) değeri neye bağlıdır?',
            secenekler: [
              sec('Light (ışık) frequency (frekans) değerine (K = hf − φ)', true, 'Doğru. Frequency (frekans) arttıkça kinetic energy (kinetik enerji) artar.'),
              sec('Light (ışık) intensity (şiddet) değerine', false, 'Hayır. Intensity (şiddet) electron (elektron) sayısını etkiler.'),
              sec('Metal (metal) thickness (kalınlık) değerine', false, 'Hayır. Thickness (kalınlık) energy (enerji) değerini belirlemez.')
            ],
            alt: {
              soru: 'Frequency (frekans) değerini ikiye katlarsan photon energy (foton enerjisi) ne olur?',
              secenekler: [
                sec('Doubles (iki katına çıkar)', true, 'Doğru. E = hf, frequency (frekans) ile orantılı.'),
                sec('Stays the same (aynı kalır)', false, 'Hayır. Energy (enerji) frequency (frekans) ile artar.'),
                sec('Halves (yarıya iner)', false, 'Hayır. Frequency (frekans) artınca energy (enerji) düşmez.')
              ]
            }
          },
          {
            tip: 'acik',
            pdfSoru: 'Explain the reasons for the emergence and success of quantum mechanics.',
            soru: 'Quantum mechanics (kuantum mekaniği) neden doğdu ve neden başarılı oldu? Explain (açıkla).',
            anahtarFikirler: [
              'Classical physics (klasik fizik) blackbody radiation (kara cisim ışıması) ve ultraviolet catastrophe (mor ötesi felaketi) sorununu açıklayamadı.',
              'Photoelectric effect (fotoelektrik olay) ve discrete atomic spectra (ayrık atom spektrumları) da açıklanamadı.',
              'Çözüm: quantized energy (paketli enerji, E = hf), wave-particle duality (dalga-parçacık ikiliği).',
              'Başarı: bu observations (gözlemleri) ve atom (atom) ile solid (katı) özelliklerini doğru öngördü.'
            ],
            yanlisKavramlar: [
              'Light (ışık) intensity (şiddet) artarsa threshold (eşik) altında da electron (elektron) kopar',
              'Quantum (kuantum) küçük cisimlerde lack of information (bilgi eksikliği) kaynaklı randomness (rastgelelik) demektir'
            ],
            yanlisKavramIds: ['fotoelektrik_siddet', 'kuantum_rastgele_sanisi'],
            idealCevap: 'Classical physics (klasik fizik) blackbody radiation (kara cisim ışıması), photoelectric effect (fotoelektrik olay) ve discrete spectrum (ayrık spektrum) olaylarını açıklayamadı. Planck energy (enerji) quantized (paketli, E = hf) kabul etti, Einstein light (ışık) photon (foton) olarak aldı, matter (madde) wave behavior (dalga davranışı) gösterdi. Quantum mechanics (kuantum mekaniği) bu observations (gözlemleri) ve atom (atom) ile solid (katı) özelliklerini doğru öngördüğü için başarılıdır.',
            yedekSecmeli: {
              soru: 'Quantum mechanics (kuantum mekaniği) neden doğdu?',
              secenekler: [
                sec('Classical physics (klasik fizik) blackbody (kara cisim), photoelectric effect (fotoelektrik olay), spectra (spektrum) olaylarını açıklayamadı', true, 'Doğru. Üç temel failure (başarısızlık).'),
                sec('Computers (bilgisayar) icat edildiği için', false, 'Yanlış. Quantum mechanics (kuantum mekaniği) computer (bilgisayar) öncesidir.'),
                sec('Newton yanıldığı için her şey değişti', false, 'Yanlış. Classical physics (klasik fizik) büyük ölçekte hâlâ geçerli.'),
                sec('Light (ışık) hiç wave (dalga) olmadığı için', false, 'Yanlış. Light (ışık) hem wave (dalga) hem particle (parçacık) gibi davranır.')
              ]
            },
            alt: { soru: 'Classical physics (klasik fizik) için açıklanamayan üç gözlemi state (belirt).' }
          },
          {
            tip: 'acik',
            pdfSoru: null,
            soru: 'Photoelectric effect (fotoelektrik olay) için classical wave theory (klasik dalga teorisi) neden açıklama yapamaz? Explain (açıkla).',
            anahtarFikirler: [
              'Classical wave (klasik dalga) modelinde intensity (şiddet) arttıkça energy (enerji) artar, threshold (eşik) beklenmez.',
              'Deneyde threshold frequency (eşik frekans) altında electron (elektron) hiç kopmaz.',
              'Electron (elektron) tek bir photon (foton) energy (enerji) alır, energy birikmez.',
              'Kinetic energy (kinetik enerji) frequency (frekans) ile artar, intensity (şiddet) ile değil.'
            ],
            yanlisKavramlar: [
              'Electron (elektron) energy (enerji) biriktirip time delay (gecikme) ile çıkar',
              'Brightness (parlaklık) electron (elektron) energy (enerji) değerini artırır'
            ],
            yanlisKavramIds: ['fotoelektrik_siddet', 'fotoelektrik_siddet'],
            idealCevap: 'Classical wave theory (klasik dalga teorisi) içinde intensity (şiddet) arttıkça energy (enerji) artar, yani yeterince parlak light (ışık) her frequency (frekans) değerinde electron (elektron) koparmalıydı. Deneyde threshold frequency (eşik frekans) altında hiç electron kopmaz, üstünde ise no time delay (gecikmesiz) kopar. Einstein: electron tek bir photon (foton) energy (enerji) alır, kinetic energy (kinetik enerji) frequency (frekans) ile artar, intensity (şiddet) yalnızca sayıyı artırır.',
            yedekSecmeli: {
              soru: 'Classical theory (klasik teori) photoelectric effect (fotoelektrik olay) için neyi yanlış bekler?',
              secenekler: [
                sec('Yeterince parlak light (ışık) her frequency (frekans) değerinde electron (elektron) koparmasını', true, 'Doğru. Deneyde threshold (eşik) altında hiç kopmaz.'),
                sec('Electron (elektron) hiç kopmaması', false, 'Yanlış. Classical theory (klasik teori) kopacağını söyler.'),
                sec('Light (ışık) speed (hız) değişmesi', false, 'Yanlış. Speed (hız) konusu değil.'),
                sec('Metal (metal) melting (erime)', false, 'Yanlış. Melting (erime) konusu değil.')
              ]
            },
            alt: { soru: 'Threshold frequency (eşik frekans) deneyi wave theory (dalga teorisi) modelini nasıl çürütür? Explain (açıkla).' }
          }
        ]
      },
      {
        id: 's03-o09', tip: 'sandik', baslik: 'Sandık', kavram: null, agirlik: 1,
        kart: { id: 'einstein', yil: 1905, tekCumle: 'Light (ışık) photon (foton) paketlerine bölüp photoelectric effect (fotoelektrik olay) olayını açıkladı.' },
        ozet: ['Classical physics (klasik fizik) üç yerde tökezledi', 'E = hf: energy (enerji) paket paket (quantized, paketli)', 'Threshold (eşik) altı: intensity (şiddet) işe yaramaz'],
        kontrolNoktasi: true
      }
    ],
    temelTur: {
      kartlar: [
        { baslik: 'Ultraviolet catastrophe (mor ötesi felaketi)', metin: 'Classical theory (klasik teori) kısa wavelength (dalga boyu) değerinde infinite energy (sonsuz enerji) buluyordu.' },
        { baslik: 'Quantized energy (paket enerji)', metin: 'Planck: light (ışık) paket paket yayılır, E = hf.' },
        { baslik: 'Threshold (eşik)', metin: 'Tek photon (foton) yetmezse brightness (parlaklık) işe yaramaz.' }
      ],
      sim: { modul: 'fotoelektrik', params: { f: 3.0, I: 1, metal: 'Na' } }
    },
    tekrarHavuzu: [
      Object.assign({}, o03, { id: 's03-t01' }),
      Object.assign({}, o04, { id: 's03-t02' }),
      {
        id: 's03-t03', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'fotoelektrik_siddet', agirlik: 1,
        soru: o05.soru,
        secenekler: o05.secenekler,
        kusurSkin: 'vakans'
      },
      {
        id: 's03-t04', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'kuantum_rastgele_sanisi', agirlik: 1,
        soru: 'Quantum randomness (kuantum rastgeleliği) neden bilgi eksikliği değildir? Explain (açıkla).',
        secenekler: [
          sec('Doğanın fundamental (temel) yapısıdır, daha çok information (bilgi) ile ortadan kalkmaz', true, 'Doğru. Standart yorumda probability (olasılık) temeldir.'),
          sec('Instruments (alet) yetersiz olduğu için', false, 'Hayır. Daha iyi instrument (alet) randomness (rastgelelik) durumunu gidermez.'),
          sec('Yalnızca temperature (sıcaklık) ile oluşur', false, 'Hayır. Temperature (sıcaklık) değerinden bağımsızdır.')
        ],
        kusurSkin: 'safsizlik'
      }
    ]
  };
})();
