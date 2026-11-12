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
      sec('Light (ışık) hiç yayılmaması', false, 'Hayır. Sorun infinite energy (sonsuz enerji) öngörüsüydü.'),
      sec('Temperature (sıcaklık) hep sabit kalması', false, 'Hayır. Temperature (sıcaklık) ile ilgili bir sorun değildi.')
    ],
    kusurSkin: 'vakans'
  };

  var o04 = {
    id: 's03-o04', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'planck_paket', agirlik: 1,
    soru: 'Planck–Einstein quantum (kuantum) fikrine göre bir photon (foton) energy (enerji) değeri neye bağlıdır?',
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
      sec('Time delay (gecikme) ile electron (elektron) kopar', false, 'Yanlış. Energy (enerji) birikmez, time delay (gecikme) gözlenmez.')
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
        onBilgi: [
          { baslik: "Foton enerjisi nasıl bulunur", madde: [
            "Nasıl yapılır: frequency (frekans) f biliniyorsa E = hf kullan; h = 4,14×10⁻¹⁵ eV·s.",
            "Wavelength (dalga boyu) λ verilmişse E = 1240/λ yaz; λ nanometre (nm), E elektronvolt (eV) çıkar.",
            "Örnek: λ = 620 nm ise E = 1240/620 = 2,0 eV. λ = 310 nm olsaydı E = 4,0 eV olurdu.",
            "Kural: λ yarıya inince E iki katına çıkar; kısa wavelength (dalga boyu) büyük photon (foton) energy (enerji) demektir." ] },
          { baslik: "Eşik kıyası: elektron kopar mı", madde: [
            "Adımlar: (1) tek photon (foton) energy (enerji) E değerini bul. (2) E değerini work function (iş fonksiyonu) φ ile kıyasla.",
            "E ≥ φ ise electron (elektron) kopar ve K = E − φ olur; E < φ ise o photon (foton) electron koparamaz.",
            "Intensity (şiddet) yalnızca saniyede gelen photon (foton) sayısını değiştirir; her electron (elektron) tek bir photon ile etkileşir.",
            "Örnek: φ = 4,3 eV, λ = 200 nm: E = 6,2 eV, K = 1,9 eV. Şiddet 10 kat artsa K aynı kalır." ] },
          { baslik: "Mantık zinciri nasıl kurulur", madde: [
            "Açıklama zincirinde her adım öncekinin sonucunu kullanır; sırayı 'önce neye ihtiyacım var' diye sorarak kur.",
            "Önce konunun ne olduğu gelir (ışık neyden oluşur). Sonra o parçanın tek başına bir özelliği (enerjisi).",
            "Sonra bu özelliğin bir koşulla kıyası (eşik) gelir; kıyas yapılmadan sonuç çıkmaz.",
            "Çoğaltan etken (şiddet) en sona kalır: kaç tane olduğu, ancak olay gerçekleşebiliyorsa anlamlıdır." ] }
        ],
        satirlar: [
          { kim: 'selin', metin: 'Işık-test odası light (ışık) ölçüyor. Classical physics (klasik fizik) burada tökezledi.' },
          { kim: 'planck', metin: 'Energy quantum (enerji paketi) fikriyle infinity (sonsuzluk) kayboldu. Çaresizlikten attığım bir adımdı.' },
          { kim: 'einstein', metin: 'Ben light (ışık) paketlere böldüm: photons (fotonlar). Photoelectric effect (fotoelektrik olay) böyle açıklandı.' }
        ]
      },
      {
        id: 's03-o02', tip: 'kavram', baslik: 'Kavram kapısı', kavram: 'karacisim_felaket', agirlik: 1,
        onBilgi: [
          { baslik: "Tarihçe: ışık ve enerji paketleri", madde: [
            "Blackbody (kara cisim): tüm ışığı soğuran ideal cisim. Klasik teori yüksek frequency (frekans) değerlerinde sonsuz energy (enerji) öngördü: ultraviolet catastrophe (mor ötesi felaketi).",
            "Atomlar da yalnızca belirli renklerde ışık yayar: discrete atomic spectra (ayrık atom spektrumları). Wave-particle duality (dalga-parçacık ikiliği) sonraki istasyonlarda.",
            "Max Planck (Berlin, 1900): enerji ancak paketler halinde alınıp verilir diyerek ölçümle uyuşan eğriyi buldu.",
            "Hertz (1887) photoelectric effect (fotoelektrik olay) gözledi; Einstein (1905) ışığı foton paketleriyle açıkladı, Nobel 1921." ] },
          { baslik: "Tanımlar ve sezgi", madde: [
            "Quantum (kuantum): enerjinin bölünemeyen en küçük paketi. Photon (foton): ışığın bir kuantumu.",
            "Intensity (şiddet): sabit frequency değerinde saniyede gelen photon sayısıyla orantılıdır; her photon (foton) kendi energy (enerji) değerini taşır.",
            "Photoelectric effect (fotoelektrik olay): ışık metalden electron (elektron) koparır. Her electron tek bir photon ile etkileşir.",
            "Work function (iş fonksiyonu) φ: electron (elektron) metalden çıkarmak için gereken en küçük energy (enerji)." ] },
          { baslik: "Formüller ve karışan noktalar", madde: [
            "E = hf; h = 6,626×10⁻³⁴ J·s, f hertz (Hz), E joule (J) veya eV. Threshold frequency (eşik frekansı): f₀ = φ/h.",
            "Maximum kinetic energy (en büyük kinetik enerji): K = hf − φ. Eşik üstünde frequency arttıkça K büyür; sayıyı intensity belirler.",
            "Karışan: wavelength (dalga boyu) kısaldıkça frequency (frekans) ve photon energy (foton enerjisi) artar; λf = c.",
            "Standart yorumda quantum randomness (kuantum rastgeleliği) bilgi eksikliği değil, probability (olasılık) temelli doğa kuralıdır." ] }
        ],
        gorev: 'Temperature (sıcaklık) değerini 5000 K yap, classical curve (klasik eğri) açık kalsın.',
        tanitim: "Yatay eksen wavelength (dalga boyu), dikey eksen yayılan intensity (şiddet). Temperature (sıcaklık) çubuğu Planck eğrisini değiştirir; Classical curve (klasik eğri) düğmesi klasik tahmini açıp kapatır. Kısa wavelength (dalga boyu) tarafına bak.",
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
        ipucu: 'Önce ışığın doğası, sonra tek bir paketin enerjisi, sonra elektronun kopması, en son şiddetin rolü.',
        nedenler: [
          'Her şey ışığın enerjiyi paketler (quanta, kuanta) halinde taşımasına dayanır; model bu fikirle başlar.',
          'Paketin enerjisi frekansa bağlıdır; bu bilgi olmadan bir paketin elektrona yetip yetmeyeceği söylenemez.',
          'Tek bir photon (foton) enerjisi iş fonksiyonunu aşarsa elektron kopar; karar paket başına verilir.',
          'Koparma koşulu sağlandıktan sonra daha fazla photon (foton) yalnızca daha çok elektron koparır; şiddet sayıyı artırır.'
        ],
        sonuc: 'Photon energy (foton enerjisi) frequency (frekans) ile belirlenir, threshold (eşik) aşılırsa electron (elektron) kopar, intensity (şiddet) sayıyı artırır.'
      },
      {
        id: 's03-o08', tip: 'patron', baslik: 'Photon (Foton) Canavarı', kavram: null, agirlik: 1,
        canavar: 'einstein', canavarAd: 'Photon (Foton) Canavarı',
        onNot: "Açık cevap şablonu: (1) classical physics (klasik fizik) neyi açıklayamadı, (2) hangi yeni fikir çözdü, (3) deneyle neden uyuştu. Not: classical wave (klasik dalga) modelinde şiddet arttıkça energy (enerji) artar; deneyde ise eşik var ve gecikme yok.",
        giris: 'Ben photon (foton) canavarıyım! Brightness (parlaklık) artırsam da seni threshold (eşik) değerinden geçirmem.',
        fazlar: [
          {
            tip: 'secmeli', kavram: 'fotoelektrik_siddet',
            soru: 'Photoelectric effect (fotoelektrik olay) içinde electron (elektron) kinetic energy (kinetik enerji) değeri neye bağlıdır?',
            secenekler: [
              sec('Light (ışık) frequency (frekans) değerine (K = hf − φ)', true, 'Doğru. Frequency (frekans) arttıkça kinetic energy (kinetik enerji) artar.'),
              sec('Light (ışık) intensity (şiddet) değerine', false, 'Hayır. Intensity (şiddet) electron (elektron) sayısını etkiler.'),
              sec('Metalin thickness (kalınlık) değerine', false, 'Hayır. Thickness (kalınlık) energy (enerji) değerini belirlemez.')
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
                sec('Metalin melting (erime) olması', false, 'Yanlış. Melting (erime) konusu değil.')
              ]
            },
            alt: { soru: 'Threshold frequency (eşik frekans) deneyi wave theory (dalga teorisi) modelini nasıl çürütür? Explain (açıkla).' }
          }
        ]
      },
      { id: 's03-h01', tip: 'hesap', baslik: 'Hesap görevi', kavram: null, agirlik: 0, hesapGorev: 'foto-cu' },
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
        { baslik: 'Quantized energy (paket enerji)', metin: 'Planck: energy (enerji) paket paket alınıp verilir, E = hf.' },
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
