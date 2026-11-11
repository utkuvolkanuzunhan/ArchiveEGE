/* 90-data-s04.js · İstasyon 04 "Atom mikroskobu" verisi (E4)
 * Q.data.stations.s04 alanını doldurur. Metinler oyun/istasyonlar/04-atom-mikroskobu.md'den aynen alınır.
 * Şema: oyun/01-veri-semalari.md §3.
 */
(function(){
  'use strict';

  function sec(t, dogru, neden){ return { t: t, dogru: dogru, neden: neden }; }

  var o03 = {
    id: 's04-o03', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'ayrik_spektrum', agirlik: 1,
    soru: 'Hydrogen atom (hidrojen atomu) neden yalnızca belirli renklerde ışır?',
    secenekler: [
      sec('Energy levels (enerji seviyeleri) ayrık, geçiş farkı kadar photon (foton) çıkar', true, 'Doğru. Her renk bir energy level (enerji seviyesi) farkına karşılık gelir.'),
      sec('Atom temperature (sıcaklık) ile renk seçer', false, 'Hayır. Renkler energy level (enerji seviyesi) farklarından gelir, temperature (sıcaklık) değil.'),
      sec('Electron (elektron) her energy (enerji) değerinde dolaşabilir', false, 'Hayır. Yalnızca belirli energy levels (enerji seviyeleri) izinlidir.')
    ],
    kusurSkin: 'vakans'
  };

  var o04 = {
    id: 's04-o04', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'debroglie_dalga', agirlik: 1,
    soru: 'Bilardo topu neden wave (dalga) gibi davranmıyor?',
    secenekler: [
      sec('Wavelength (dalga boyu) (h/p) çok küçük kalıyor', true, 'Doğru. Büyük momentum (momentum), ihmal edilecek kadar küçük wavelength (dalga boyu).'),
      sec('Top atom (atom) içermediği için', false, 'Hayır. Top da atomdan oluşur; wavelength (dalga boyu) ölçülemeyecek kadar küçük.'),
      sec('Wave property (dalga özelliği) yalnızca light (ışık) için var', false, 'Hayır. Electron diffraction (elektron kırınımı) matter (madde) için de wave (dalga) davranışını gösterir.')
    ],
    kusurSkin: 'safsizlik'
  };

  var o05 = {
    id: 's04-o05', tip: 'tahmin', baslik: 'Tahmin çukuru', kavram: 'atom_kararlilik', agirlik: 1.5,
    soru: 'Hidrojende electron (elektron), n=1 level (seviye) (−13,6 eV) altına inebilir mi?',
    secenekler: [
      sec('Hayır, n=1 ground state (temel hal)', true, 'Doğru. Altında izinli level (seviye) yok, atom stable (kararlı).'),
      sec('Evet, radiation (ışıma) yaparak nucleus (çekirdek) içine düşer', false, 'Yanlış. Klasik tahmin buydu; quantum (kuantum) teoride lower limit (alt sınır) level var.'),
      sec('Evet, temperature (sıcaklık) düşerse', false, 'Yanlış. Sebep temperature (sıcaklık) değil, wave nature (dalga doğası).')
    ],
    sim: {
      modul: 'bohr',
      onceki: { n: 2, m: 1 },
      sonraki: { n: 1, m: 1, altinaDene: true }
    },
    acik: 'n=1\'in altında izinli level (seviye) yok; electron (elektron) daha aşağı inemez.'
  };

  Q.data.stations.s04 = {
    id: 's04',
    sira: 4,
    ad: 'Atom mikroskobu',
    makine: 'Atom mikroskobu',
    renk: '#7cf5a0',
    konu: 'H atomu kararlılığı, ayrık seviyeler, madde dalgası',
    sinavSorulari: ['S4'],
    sureHedefDk: 22,
    patronId: 'bohr',
    kavramlar: ['atom_kararlilik', 'ayrik_spektrum', 'debroglie_dalga', 'bohr_seviye', 'sifir_noktasi_sicaklik'],
    engeller: [
      {
        id: 's04-o01', tip: 'hikaye', baslik: 'Zaman kapısı', kavram: null, agirlik: 1,
        yer: 'Kopenhag', yil: 1913, rivayet: false,
        satirlar: [
          { kim: 'selin', metin: 'Atom mikroskobu bir electron (elektron) arıyor. O neden nucleus (çekirdek) içine düşmüyor?' },
          { kim: 'bohr', metin: 'Electron (elektron) yalnızca belirli energy levels (enerji seviyeleri) üzerinde durabilir. Levels arası atlarken photon (foton) yayar.' },
          { kim: 'anlatici', metin: 'On bir yıl sonra de Broglie ekledi: electron (elektron) da wave (dalga), orbit (yörünge) üzerine tam sayı wave (dalga) sığar.' }
        ]
      },
      {
        id: 's04-o02', tip: 'kavram', baslik: 'Kavram kapısı', kavram: 'bohr_seviye', agirlik: 1,
        gorev: 'n=3\'ten n=2\'ye transition (geçiş) rengini bul.',
        sim: {
          modul: 'bohr',
          params: { n: 4, m: 1 },
          basari: { gecis: [3, 2] }
        },
        ogrenilen: 'Levels (seviyeler) discrete (ayrık); transition sırasında level farkı kadar enerjili photon çıkar.'
      },
      o03,
      o04,
      o05,
      {
        id: 's04-o06', tip: 'tuzak', baslik: 'Yanılgı tuzağı', kavram: 'atom_kararlilik', agirlik: 1,
        iddia: 'Klasik fiziğe göre electron (elektron) nucleus (çekirdek) çevresinde sonsuza kadar kararlı döner.',
        parcalar: ['Klasik fiziğe göre', 'electron (elektron) nucleus (çekirdek) çevresinde', 'sonsuza kadar kararlı döner.'],
        yanlisParca: 2,
        duzeltme: 'Klasikte ivmeli electron radiation (ışıma) yapar, energy (enerji) kaybeder ve nucleus (çekirdek) içine düşer; quantum (kuantum) mekaniği bunu önler.'
      },
      {
        id: 's04-o07', tip: 'kopru', baslik: 'Mantık köprüsü', kavram: 'atom_kararlilik', agirlik: 1,
        soru: 'Stability (kararlılık) zincirini sıraya diz',
        bloklar: [
          'Electron (elektron) confined wave (hapsolmuş dalga) olarak davranır',
          'Yalnızca belirli wavelengths (dalga boyları) sığar',
          'Ground state (temel hal) enerjisi sıfır değildir',
          'Electron (elektron) daha aşağı düşemez, atom stable (kararlı)'
        ],
        sonuc: 'Confined wave (hapsolmuş dalga), discrete levels (ayrık seviyeler), alt sınır, stable atom (kararlı atom).'
      },
      {
        id: 's04-o08', tip: 'patron', baslik: 'Orbit (Yörünge) Canavarı', kavram: null, agirlik: 1,
        canavar: 'bohr', canavarAd: 'Orbit (Yörünge) Canavarı',
        giris: 'Electronunu (elektron) nucleus (çekirdek) içine düşüreceğim! Düşemez diyorsan justify (gerekçelendir).',
        fazlar: [
          {
            tip: 'secmeli', kavram: 'atom_kararlilik',
            soru: 'Atomun ground state (temel hal) enerjisi neden vardır?',
            secenekler: [
              sec('Electron wave (elektron dalgası) nucleus (çekirdek) çevresinde sığar, lower limit (alt sınır) oluşur', true, 'Doğru. Confined wave (hapsolmuş dalga) enerjisi sıfır olamaz.'),
              sec('Nucleus (çekirdek) electron (elektron) iter', false, 'Hayır. Nucleus (çekirdek) electron (elektron) çeker.'),
              sec('Temperature (sıcaklık) sıfıra inemez', false, 'Hayır. Sebep temperature (sıcaklık) değil, wave nature (dalga doğası).')
            ],
            alt: {
              soru: 'Electron nucleus (çekirdek) içine daha çok sıkıştırılırsa kinetic energy (kinetik enerji) ne olur?',
              secenekler: [
                sec('Artar', true, 'Doğru. Position (konum) daralır, momentum (momentum) ve kinetic energy (kinetik enerji) büyür.'),
                sec('Azalır', false, 'Hayır. Dar alanda wavelength (dalga boyu) kısalır, energy (enerji) artar.'),
                sec('Değişmez', false, 'Hayır. Uncertainty principle (belirsizlik ilkesi) sıkıştırmayı sınırlar.')
              ]
            }
          },
          {
            tip: 'acik',
            pdfSoru: 'Briefly explain the stability of the Hydrogen atom using quantum mechanical theory.',
            soru: 'Hydrogen atom (hidrojen atomu) stability (kararlılık) konusunu quantum theory (kuantum teorisi) ile kısaca explain (açıkla).',
            anahtarFikirler: [
              'Klasikte radiation (ışıma) yapan electron (elektron) nucleus (çekirdek) içine düşmeliydi.',
              'Quantum (kuantum) teoride electron (elektron) confined wave (hapsolmuş dalga), energy levels (enerji seviyeleri) discrete (ayrık).',
              'Ground state (temel hal) energy (enerji) sıfır değildir, altına inilemez.',
              'Nucleus (çekirdek) içine sıkışmak kinetic energy (kinetik enerji) artırır (uncertainty principle, belirsizlik ilkesi), denge oluşur.'
            ],
            yanlisKavramlar: [
              'Electron (elektron) nucleus (çekirdek) tarafından itildiği için düşmez',
              'Atom temperature (sıcaklık) yüzünden kararlıdır'
            ],
            yanlisKavramIds: ['atom_kararlilik', 'sifir_noktasi_sicaklik'],
            idealCevap: 'Klasik fizikte orbit (yörünge) üzerindeki electron (elektron) radiation (ışıma) yapıp energy (enerji) kaybeder ve nucleus (çekirdek) içine düşerdi. Quantum (kuantum) teoride electron confined wave (hapsolmuş dalga), energy levels (enerji seviyeleri) discrete (ayrık) ve ground state (temel hal) enerjisi sıfır değildir. Nucleus içine daha çok sıkışmak kinetic energy (kinetik enerji) artırdığından electron bir denge durumunda kalır.',
            yedekSecmeli: {
              soru: 'H atom (H atomu) neden stable (kararlı)?',
              secenekler: [
                sec('Ground state (temel hal) altı yok, electron (elektron) düşemez', true, 'Doğru. Confined wave (hapsolmuş dalga) için lower energy limit (alt enerji sınırı) var.'),
                sec('Electron nucleus (çekirdek) tarafından itilir', false, 'Yanlış. Nucleus (çekirdek) electron (elektron) çeker.'),
                sec('Atom çok cold (soğuk) olduğu için', false, 'Yanlış. Temperature (sıcaklık) sebep değil.'),
                sec('Electron (elektron) aslında durur', false, 'Yanlış. Electron durmaz, lowest energy (en düşük enerji) wave state (dalga durumu) içindedir.')
              ]
            },
            alt: { soru: 'Klasik atom modeli neden çöküyordu, quantum (kuantum) teori bunu nasıl çözdü? Explain (açıkla).' }
          },
          {
            tip: 'acik',
            pdfSoru: null,
            soru: 'Matter wave (madde dalgası) nedir, define (tanımla). Günlük hayatta neden wave behavior (dalga davranışı) görmeyiz?',
            anahtarFikirler: [
              'de Broglie: particle (parçacık) wavelength (dalga boyu) λ = h/p.',
              'Electron diffraction (elektron kırınımı) maddenin dalga davrandığını gösterir.',
              'Büyük cisimde momentum (momentum) büyük, λ ihmal edilebilir.',
              'Atom ölçeğinde λ boyutla kıyaslanabilir, wave effect (dalga etkisi) görünür.'
            ],
            yanlisKavramlar: [
              'Wave (dalga) yalnızca light (ışık) için geçerlidir',
              'Büyük cisimler random (rastgele) davranır'
            ],
            yanlisKavramIds: ['debroglie_dalga', 'kuantum_rastgele_sanisi'],
            idealCevap: 'de Broglie\'ye göre momentum (momentum) taşıyan her particle (parçacık) wavelength (dalga boyu) λ = h/p\'dir; electron diffraction (elektron kırınımı) bunu doğrular. Günlük cisimlerde momentum (momentum) çok büyük olduğundan λ ihmal edilecek kadar küçüktür. Atom boyutunda λ boyutla kıyaslanabilir olduğundan wave effect (dalga etkisi) görünür.',
            yedekSecmeli: {
              soru: 'Matter wavelength (madde dalga boyu) neye bağlıdır?',
              secenekler: [
                sec('Momentum (momentum), λ = h/p', true, 'Doğru. Momentum (momentum) büyüdükçe λ küçülür.'),
                sec('Color (renk)', false, 'Yanlış. Color (renk) bu kavramla ilgisiz.'),
                sec('Volume (hacim)', false, 'Yanlış. Volume (hacim) λ\'yı belirlemez.'),
                sec('Yalnızca temperature (sıcaklık)', false, 'Yanlış. Doğrudan momentum (momentum) bağlıdır.')
              ]
            },
            alt: { soru: 'Electron diffraction (elektron kırınımı) deneyi neyi kanıtlar? Justify (gerekçelendir).' }
          }
        ]
      },
      {
        id: 's04-o09', tip: 'sandik', baslik: 'Sandık', kavram: null, agirlik: 1,
        kart: { id: 'bohr', yil: 1913, tekCumle: 'Atomda electron (elektron) yalnızca belirli energy levels (enerji seviyeleri) üzerinde durabilir, diye gösterdi.' },
        ozet: ['Levels (seviyeler) discrete (ayrık), transition (geçiş) sırasında photon (foton) çıkar', 'n=1 ground state (temel hal), atom stable (kararlı)', 'λ = h/p: matter (madde) de wave (dalga)'],
        kontrolNoktasi: true
      }
    ],
    temelTur: {
      kartlar: [
        { baslik: 'Discrete levels (ayrık seviyeler)', metin: 'Electron (elektron) yalnızca belirli energies (enerjiler) üzerinde durur.' },
        { baslik: 'Ground state (temel hal)', metin: 'n=1\'in altı yok; electron nucleus (çekirdek) içine düşmez.' },
        { baslik: 'Matter wave (madde dalgası)', metin: 'Her particle (parçacık) λ = h/p wavelength (dalga boyu) taşır.' }
      ],
      sim: { modul: 'bohr', params: { n: 3, m: 2 } }
    },
    tekrarHavuzu: [
      Object.assign({}, o03, { id: 's04-t01' }),
      Object.assign({}, o04, { id: 's04-t02' }),
      {
        id: 's04-t03', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'atom_kararlilik', agirlik: 1,
        soru: o05.soru,
        secenekler: o05.secenekler,
        kusurSkin: 'vakans'
      },
      {
        id: 's04-t04', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'sifir_noktasi_sicaklik', agirlik: 1,
        soru: 'Confined particle (hapsolmuş parçacık) için lowest energy (en düşük enerji) neden sıfır değildir?',
        secenekler: [
          sec('Boundary condition (sınır koşulu) dalganın sığmasını gerektirir', true, 'Doğru. Temperature (sıcaklık) değil, boundary condition (sınır koşulu) sebep.'),
          sec('Temperature (sıcaklık) sıfıra inemez', false, 'Hayır. Absolute zero (mutlak sıfır) da E₁ > 0.'),
          sec('Measurement (ölçüm) energy (enerji) ekler', false, 'Hayır. Measurement (ölçüm) olmasa da lower energy (alt enerji) vardır.')
        ],
        kusurSkin: 'tane_siniri'
      }
    ]
  };
})();
