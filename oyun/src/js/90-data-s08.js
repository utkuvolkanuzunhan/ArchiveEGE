/* 90-data-s08.js · İstasyon 08 "Kalibrasyon odası" verisi (E8)
 * Q.data.stations.s08 alanını doldurur. Metinler oyun/istasyonlar/08-kalibrasyon-odasi.md'den aynen alınır.
 * Şema: oyun/01-veri-semalari.md §3.
 */
(function(){
  'use strict';

  function sec(t, dogru, neden){ return { t: t, dogru: dogru, neden: neden }; }

  var o03 = {
    id: 's08-o03', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'belirsizlik_dalga', agirlik: 1,
    soru: 'Δx küçülürse Δp (momentum) için alt sınır ne olur?',
    secenekler: [
      sec('Alt sınırı büyür (increases)', true, 'Doğru. ΔxΔp ≥ ħ/2 product (çarpım) en az sabit kalır; Δp alt sınırı büyür.'),
      sec('Küçülür (decreases)', false, 'Yanlış. Product (çarpım) sınırlı olduğundan biri küçülünce öbürü büyür.'),
      sec('Değişmez (unchanged)', false, 'Yanlış. ΔxΔp ≥ ħ/2 condition (koşul) bunu zorunlu kılar.')
    ],
    ipucu: 'Çarpım en az ħ/2 ise biri küçülünce öbürü? "Nasıl yapılır: Δp bulmak" kartına bak.',
    kusurSkin: 'vakans'
  };

  var o04 = {
    id: 's08-o04', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'belirsizlik_makro', agirlik: 1,
    soru: 'Bilardo topunda uncertainty (belirsizlik) neden fark edilmez?',
    secenekler: [
      sec('ħ çok küçük, ΔxΔp limit (sınır) ihmal edilebilir', true, 'Doğru. Uncertainty principle (belirsizlik ilkesi) her cisimde geçerli, etkisi görünmez.'),
      sec('Top uncertainty (belirsizlik) kapsamında değildir', false, 'Hayır. Principle (ilke) her cisim için geçerlidir.'),
      sec('Top bir wave (dalga) değildir', false, 'Hayır. Wavelength (dalga boyu) yalnızca ihmal edilecek kadar küçüktür.')
    ],
    ipucu: 'Top için Δv = Δp/m ne kadar çıkar? "Nasıl yapılır: günlük cisim" kartına bak.',
    kusurSkin: 'tane_siniri'
  };

  var o05 = {
    id: 's08-o05', tip: 'tahmin', baslik: 'Tahmin çukuru', kavram: 'belirsizlik_dalga', agirlik: 1.5,
    soru: 'Wave packet (dalga paketi) için position (konum) genişliğini iki katına çıkarırsan (σx 1 nm -> 2 nm) momentum spread (momentum yayılması) ne olur?',
    secenekler: [
      sec('Yarıya iner (halves)', true, 'Doğru. σp = ħ/(2σx); σx iki katına çıkınca σp yarıya iner.'),
      sec('İki katına çıkar (doubles)', false, 'Yanlış. Position (konum) genişleyince momentum yayılması daralır.'),
      sec('Aynı kalır (unchanged)', false, 'Yanlış. Position (konum) ve momentum yayılması ters orantılıdır.')
    ],
    sim: {
      modul: 'belirsizlik',
      onceki: { sx: 1 },
      sonraki: { sx: 2 }
    },
    ipucu: 'σp = ħ/(2σx): ters orantı. "Nasıl yapılır: Δp bulmak" kartına bak.',
    acik: 'σx 1\'den 2\'ye çıkınca σp yarıya indi; product (çarpım) ħ/2\'de kaldı.'
  };

  Q.data.stations.s08 = {
    id: 's08',
    sira: 8,
    ad: 'Calibration (kalibrasyon) odası',
    makine: 'Kalibrasyon',
    renk: '#39ff88',
    konu: 'Uncertainty (belirsizlik) principle, conjugate variable (eşlenik değişken)',
    sinavSorulari: ['S10'],
    sureHedefDk: 22,
    patronId: 'heis',
    kavramlar: ['belirsizlik_dalga', 'belirsizlik_alet', 'eslenik_degisken', 'belirsizlik_makro'],
    engeller: [
      {
        id: 's08-o01', tip: 'hikaye', baslik: 'Zaman kapısı', kavram: null, agirlik: 1,
        yer: 'Kopenhag', yil: 1927, rivayet: false,
        onBilgi: [
          { baslik: "Heisenberg ve belirsizlik ilkesi", madde: [
            "1925'te Heisenberg matrix mechanics (matris mekaniği) kurdu; Born ve Jordan [x,p] = iħ bağıntısını türetti.",
            "1927'de Heisenberg uncertainty principle (belirsizlik ilkesi) makalesini yayımladı; aynı yıl Kennard ΔxΔp ≥ ħ/2 biçimini verdi.",
            "1929'da Robertson bunu herhangi iki operator (operatör) için genelleştirdi.",
            "Bohr ve Heisenberg'in Copenhagen interpretation (Kopenhag yorumu) bu dönemde şekillendi." ] }
        ],
        satirlar: [
          { kim: 'selin', metin: 'Calibration (kalibrasyon) odası: measurement (ölçüm) mükemmelleştirmek istiyoruz.' },
          { kim: 'heis', metin: 'Position (konum) ve momentum aynı anda keyfi hassas ölçülemez. Sebep instrument (alet) değil.' },
          { kim: 'heis', metin: 'Doğa böyle: wave (dalga) isen keskin konum ve keskin momentum aynı anda olmaz.' }
        ]
      },
      {
        id: 's08-o02', tip: 'kavram', baslik: 'Kavram kapısı', kavram: 'belirsizlik_dalga', agirlik: 1,
        onBilgi: [
          { baslik: "Uncertainty (belirsizlik), wave packet", madde: [
            "Wave packet (dalga paketi): konumu sınırlı dalga; keskin konum için çok farklı wavelength (dalga boyu) toplanır.",
            "Çok wavelength (dalga boyu) geniş momentum demektir: p = h/λ = ħk, k = 2π/λ wavenumber (dalga sayısı). Bu yüzden Δx Δk ≥ 1/2 ve Δp = ħΔk.",
            "Δx, Δp: konum ve momentumun spread (yayılma) değeri; σx, σp aynı fikrin standart sapmasıdır.",
            "ħ = h/2π ≈ 1,05×10⁻³⁴ J·s: çok küçük sabit; ilke her cisimde geçerli ama büyükte görünmez." ] },
          { baslik: "ΔxΔp ≥ ħ/2 ilişkisi", madde: [
            "Formül: ΔxΔp ≥ ħ/2 (birim J·s). Çarpımın alt sınırı vardır; ikisi birden sıfıra gitmez.",
            "Gaussian wave packet (Gauss dalga paketi) sınıra eşit olur: σxσp = ħ/2 (minimum uncertainty, en az belirsizlik).",
            "Sık karışan nokta: ilke alet hatası ya da ölçümün parçacığı bozması değildir; ideal aletle ve ölçüm yapılmasa da geçerlidir, sebep wave nature (dalga doğası).",
            "Hapsolma: L boyuna sıkışan parçacıkta Δp ≳ ħ/(2L), kinetik enerji yaklaşık ħ²/(8mL²) olur: zero-point energy (sıfır noktası enerjisi), L küçüldükçe artar." ] },
          { baslik: "Conjugate variable (eşlenik değişken)", madde: [
            "Conjugate variables (eşlenik değişkenler): operator'leri commute (değişme) etmeyen çift; örnek x ve p.",
            "Commutator (komütatör): [x,p] = xp − px = iħ ≠ 0. Ortak eigenstate (özdurum) yoktur, bu yüzden iki büyüklük birden keskin olamaz.",
            "Sık karışan nokta: her çift belirsizlik vermez; x ve p_y commute (değişme) eder, kütle ve yük sayıdır.",
            "Energy (enerji) ve zaman için ΔE Δt ≥ ħ/2: Δt durumun ömrüdür. Kısa ömürlü durumun enerjisi geniş yayılır, sonsuz ömürlü durumunki keskindir." ] },
          { baslik: "Nasıl yapılır: Δp bulmak", madde: [
            "Adımlar: (1) Δx'i metreye çevir (1 nm = 10⁻⁹ m); (2) Δp ≥ ħ/(2Δx) yaz; (3) sayıyı koy.",
            "Örnek: Δx = 2 nm = 2×10⁻⁹ m ise Δp ≥ 1,05×10⁻³⁴ / (4×10⁻⁹) ≈ 2,6×10⁻²⁶ kg·m/s.",
            "Δx 4 kat daralıp 0,5 nm olursa Δp alt sınırı 4 kat büyür: ≈ 1,05×10⁻²⁵ kg·m/s. Çarpım hep ħ/2 kalır.",
            "Kural: Δp, Δx ile ters orantılıdır. Biri k kat daralırsa öbürünün alt sınırı k kat büyür." ] },
          { baslik: "Nasıl yapılır: günlük cisim", madde: [
            "Aynı yöntemle büyük cisme bak, sonra Δv = Δp/m al. Kütle büyükse Δv çok küçük kalır.",
            "Örnek: m = 0,15 kg top, Δx = 1 nm. Δp ≥ 5,3×10⁻²⁶ kg·m/s ve Δv ≥ 5,3×10⁻²⁶ / 0,15 ≈ 3,5×10⁻²⁵ m/s.",
            "Bu hız belirsizliği ölçülemeyecek kadar küçüktür. Elektronda (m ≈ 10⁻³⁰ kg) aynı hesap belirgin bir değer verir.",
            "Sonuç: ilke her cisimde geçerli kalır; yalnız sayısal etkisi, kütle büyüdükçe ihmal edilecek kadar küçük çıkar." ] },
          { baslik: "Nasıl yapılır: zincir sırası", madde: [
            "Zincir neden-sonuç sırasıdır: önce parçacığın dalga hâli, sonra dar konumun bedeli, sonra momentum, en son formül.",
            "Önce: konumu sınırlı bir dalga ancak wave packet (dalga paketi) olarak yazılır; tek düz dalga her yere yayılır.",
            "Sonra: dar paket için çok sayıda dalga üst üste gelir; her dalga farklı momentum taşıdığından momentum yayılır.",
            "En sonda iki yayılmanın çarpımı sayıya bağlanır: alt sınırı ħ/2 olan formül sonuçtur, başlangıç değildir." ] }
        ],
        tanitim: "σx kaydırıcısı wave packet (dalga paketi) genişliğini nm cinsinden değiştirir. Üst grafik konum, alt grafik momentum yayılmasıdır. Conjugate (eşlenik) düğmesi alt grafiği açıp kapatır.",
        gorev: 'σx kaydırıcısını 1 nm\'ye indir; Conjugate açık kalsın.',
        sim: {
          modul: 'belirsizlik',
          params: { sx: 3 },
          basari: { dar: true }
        },
        ogrenilen: 'Position (konum) daraldıkça momentum yayılır; product (çarpım) hep en az ħ/2.'
      },
      o03,
      o04,
      o05,
      {
        id: 's08-o06', tip: 'tuzak', baslik: 'Yanılgı tuzağı', kavram: 'belirsizlik_alet', agirlik: 1,
        iddia: 'Uncertainty (belirsizlik), measurement (ölçüm) instrument (aletimizin) yeterince hassas olmamasından kaynaklanır.',
        parcalar: ['Uncertainty (belirsizlik),', 'measurement (ölçüm) instrument (aletimizin) yeterince', 'hassas olmamasından kaynaklanır.'],
        yanlisParca: 1,
        duzeltme: 'Uncertainty (belirsizlik) instrument (alet) kusuru değil, wave nature (dalga doğası) temel sonucudur.',
        ipucu: 'Mükemmel aletle de geçerli mi? "ΔxΔp ≥ ħ/2 ilişkisi" kartına bak.'
      },
      {
        id: 's08-o07', tip: 'kopru', baslik: 'Mantık köprüsü', kavram: 'belirsizlik_dalga', agirlik: 1,
        soru: 'Uncertainty (belirsizlik) zincirini sıraya diz',
        bloklar: [
          'Parçacık bir wave packet (dalga paketi) olur',
          'Sharp position (keskin konum) çok wavelength (dalga boyu) toplamıdır',
          'Çok wavelength (dalga boyu) geniş momentum demektir',
          'ΔxΔp ≥ ħ/2'
        ],
        sonuc: 'Wave packet (dalga paketi), sharp position (keskin konum), broad momentum (geniş momentum), ΔxΔp ≥ ħ/2.',
        ipucu: 'Önce dalga hâli, sonra dar konumun bedeli, sonra momentum, en son formül. "Zincir sırası" kartına bak.',
        nedenler: [
          'Konumu sınırlı parçacık ancak dalga paketi olarak anlatılabilir; zincir buradan başlar.',
          'Dar paket için çok farklı dalga gerekir; konumu keskinleştirmenin bedeli budur.',
          'Her dalga ayrı momentum taşır, çok dalga geniş momentum aralığı demektir.',
          'İki yayılmanın çarpımı sayıya bağlanır; formül zincirin sonucudur.'
        ]
      },
      {
        id: 's08-o08', tip: 'patron', baslik: 'Uncertainty (Belirsizlik) Canavarı', kavram: null, agirlik: 1,
        onNot: "Commutator (komütatör) [A,B] = AB − BA. Sıfırsa ortak eigenstate (özdurum) vardır ve ikisi birden keskin olabilir; örnek x ile V(x) böyledir. Sıfırdan farklıysa conjugate (eşlenik) çift olur. Açık cevapta formül, sebep, commutator (komütatör), günlük cisim sırasını izle.",
        canavar: 'heis', canavarAd: 'Uncertainty (Belirsizlik) Canavarı',
        giris: 'Neredeyim? Ne kadar hızlıyım? İkisini birden bilemezsin!',
        fazlar: [
          {
            tip: 'secmeli', kavram: 'eslenik_degisken',
            soru: 'Position (konum) ve momentum neden aynı anda keyfi hassas ölçülemez?',
            secenekler: [
              sec('Operator (operatör) commute (değişme) yapmaz, ortak eigenstate (özdurum) yoktur', true, 'Doğru. [x,p] = iħ ≠ 0.'),
              sec('Instrument (alet) yetersizdir', false, 'Hayır. Instrument (alet) kusuru değil, doğanın yapısı.'),
              sec('Measurement (ölçüm) particle (parçacığı) bozar, tek sebep bu', false, 'Hayır. Measurement (ölçüm) olmasa da principle (ilke) geçerlidir.')
            ],
            alt: {
              soru: '[x, p] = iħ commutator (komütatör) ne anlama gelir?',
              secenekler: [
                sec('x ve p operator (operatör) commute (değişme) etmez', true, 'Doğru. Bu yüzden ortak eigenstate (özdurum) yok.'),
                sec('x ve p equal (eşittir)', false, 'Hayır. Bu bir equality (eşitlik) değil, commutation relation (değişme bağıntısı).'),
                sec('p sıfırdır', false, 'Hayır. p sıfır olmak zorunda değil.')
              ]
            }
          },
          {
            tip: 'acik',
            pdfSoru: 'Explain the uncertainty principle and why it is impossible to simultaneously measure conjugate variables with unlimited precision.',
            soru: 'Uncertainty principle (belirsizlik ilkesi) explain (açıkla). Conjugate variables (eşlenik değişkenler) neden aynı anda keyfi hassas ölçülemez?',
            anahtarFikirler: [
              'ΔxΔp ≥ ħ/2: biri keskinleşince öbürü yayılır.',
              'Wave packet (dalga paketi): keskin konum çok wavelength (dalga boyu) gerektirir.',
              'Position (konum) ve momentum operator (operatör) değişmez, yani commute (değişme) etmez ([x,p] = iħ).',
              'Instrument (alet) kusuru değil, doğanın (wave nature, dalga doğası) temel limit (sınırı).'
            ],
            yanlisKavramlar: [
              'Uncertainty (belirsizlik) measurement (ölçüm) instrument (aletinin) kusurudur',
              'Measurement (ölçüm) particle (parçacığı) bozduğu için olur, tek sebep bu'
            ],
            yanlisKavramIds: ['belirsizlik_alet', 'belirsizlik_alet'],
            idealCevap: 'Uncertainty principle (belirsizlik ilkesi) ΔxΔp ≥ ħ/2 der: biri keskinleşince öbürü yayılır. Sebep wave nature (dalga doğası) olup keskin bir konum çok sayıda wavelength (dalga boyu) toplamını gerektirir, bu da geniş bir momentum distribution (dağılımı) demektir. Position (konum) ve momentum operator (operatör) değişmediği için ortak eigenstate (özdurum) yoktur. Bu instrument (alet) kusuru değil, doğanın temel limit (sınır) özelliğidir.',
            yedekSecmeli: {
              soru: 'Uncertainty principle (belirsizlik ilkesi) neden vardır?',
              secenekler: [
                sec('Particle (parçacık) wave nature (dalga doğası) özelliğinden', true, 'Doğru. Keskin konum geniş momentum demektir.'),
                sec('Instrument (alet) yetersiz olduğundan', false, 'Yanlış. Ideal instrument (alet) için de geçerli.'),
                sec('Temperature (sıcaklık) yüzünden', false, 'Yanlış. Temperature (sıcaklık) etkisinden bağımsız.'),
                sec('Sadece electron (elektron) için', false, 'Yanlış. Her cisimde geçerli, büyükte ihmal edilir.')
              ]
            },
            alt: { soru: 'ΔxΔp ≥ ħ/2 neden wave nature (dalga doğası) kaynaklıdır? Explain (açıkla).' }
          },
          {
            tip: 'acik',
            pdfSoru: null,
            soru: 'Conjugate variable (eşlenik değişken) nedir? Define (tanımla), örnek ver ve günlük hayatta neden görmediğimizi explain (açıkla).',
            anahtarFikirler: [
              'Conjugate pair (eşlenik çift): aynı anda keyfi hassas ölçülemeyen iki büyüklük.',
              'Örnek: position (konum) x ve momentum p.',
              'Operator (operatör) commute (değişme) etmediği için ortak eigenstate (özdurum) yoktur.',
              'Günlük cisimde effect (etki) ihmal edilir, çünkü ħ çok küçüktür.'
            ],
            yanlisKavramlar: [
              'Her büyüklük çifti uncertainty (belirsizlik) gösterir',
              'Yalnızca electron (elektron) gibi küçük particle (parçacık) için geçerlidir'
            ],
            yanlisKavramIds: ['eslenik_degisken', 'belirsizlik_makro'],
            idealCevap: 'Conjugate variables (eşlenik değişkenler), aynı anda keyfi hassas ölçülemeyen büyüklük çiftidir; örneğin position (konum) ve momentum. Operator (operatör) commute (değişme) etmediği için ortak eigenstate (özdurum) yoktur. Günlük cisimlerde ħ çok küçük olduğundan limit (sınır) ihmal edilir.',
            yedekSecmeli: {
              soru: 'Hangisi bir conjugate pair (eşlenik çift) oluşturur?',
              secenekler: [
                sec('Position (konum) ve momentum', true, 'Doğru. Operator (operatör) commute (değişme) etmez.'),
                sec('Mass (kütle) ve volume (hacim)', false, 'Yanlış. Bu çift için principle (ilke) yok.'),
                sec('Temperature (sıcaklık) ve color (renk)', false, 'Yanlış. Conjugate pair (eşlenik çift) değil.'),
                sec('Velocity (hız) ve acceleration (ivme)', false, 'Yanlış. Bu conjugate pair (eşlenik çift) değil.')
              ]
            },
            alt: { soru: 'Position ve momentum neden conjugate variable sayılır? Justify (gerekçelendir).' }
          }
        ]
      },
      { id: 's08-h01', tip: 'hesap', baslik: 'Hesap görevi', kavram: null, agirlik: 0, hesapGorev: 'bel-v' },
      {
        id: 's08-o09', tip: 'sandik', baslik: 'Sandık', kavram: null, agirlik: 1,
        kart: { id: 'heis', yil: 1927, tekCumle: 'Position (konum) ve momentumun aynı anda sharp (keskin) olamayacağını gösterdi.' },
        ozet: ['ΔxΔp ≥ ħ/2', 'Sebep wave nature (dalga doğası), instrument (alet) değil', 'Günlük cisimde effect (etki) ihmal edilir'],
        kontrolNoktasi: true
      }
    ],
    temelTur: {
      kartlar: [
        { baslik: 'Wave packet (dalga paketi)', metin: 'Parçacık, wave packet gibi davranır.' },
        { baslik: 'Sharp position (keskin konum)', metin: 'Position (konum) daralırsa momentum yayılır.' },
        { baslik: 'Not instrument (alet değil)', metin: 'Uncertainty (belirsizlik) measurement (ölçüm) kusuru değil, doğanın limit (sınırı).' }
      ],
      sim: { modul: 'belirsizlik', params: { sx: 3 } }
    },
    tekrarHavuzu: [
      Object.assign({}, o03, { id: 's08-t01' }),
      Object.assign({}, o04, { id: 's08-t02' }),
      {
        id: 's08-t03', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'belirsizlik_dalga', agirlik: 1,
        soru: o05.soru,
        secenekler: o05.secenekler,
        kusurSkin: 'vakans'
      },
      {
        id: 's08-t04', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'eslenik_degisken', agirlik: 1,
        soru: 'Hangi operator (operatör) çifti commute etmez ve uncertainty (belirsizlik) verir?',
        secenekler: [
          sec('Position (konum) ve momentum', true, 'Doğru. [x,p] = iħ.'),
          sec('Position (konum) ve position (konum)', false, 'Hayır. Aynı operator (operatör) kendisiyle commute (değişme) eder.'),
          sec('Mass (kütle) ve charge (yük)', false, 'Hayır. Bunlar number (sayı), operator (operatör) değil.')
        ],
        kusurSkin: 'safsizlik'
      },
      {
        id: 's08-t05', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'belirsizlik_alet', agirlik: 1,
        soru: 'Uncertainty principle (belirsizlik ilkesi) neden alet kusuru değildir?',
        secenekler: [
          sec('Ideal instrument (alet) için de geçerli, wave nature (dalga doğası) sonucudur', true, 'Doğru. Instrument (alet) kusuru değil, doğanın limit (sınırı).'),
          sec('Instrument (alet) hep mükemmeldir', false, 'Hayır. Mesele instrument (alet) kalitesi değil.'),
          sec('Yalnızca temperature (sıcaklık) ile ilgilidir', false, 'Hayır. Temperature (sıcaklık) etkisinden bağımsızdır.')
        ],
        kusurSkin: 'tane_siniri'
      }
    ]
  };
})();
