/* 90-data-s06.js · İstasyon 06 "Tünel istasyonu" verisi (E6)
 * Q.data.stations.s06 alanını doldurur. Metinler oyun/istasyonlar/06-tunel-istasyonu.md'den aynen alınır.
 * Bağımlılık: 00-q.js (Q.data). Şema: oyun/01-veri-semalari.md §3.
 */
(function(){
  'use strict';

  function sec(t, dogru, neden){ return { t: t, dogru: dogru, neden: neden }; }

  var o03 = {
    id: 's06-o03', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'basamak_yansima', agirlik: 1,
    soru: 'E > V₀ iken particle (parçacık) için step (basamak) potential (potansiyel) değerinden reflection (yansıma) olasılığı nedir?',
    secenekler: [
      sec('Zero (sıfır) değerinden büyük, wave (dalga) kısmen yansır', true, 'Doğru. k₁ ≠ k₂ olduğundan reflection (yansıma) vardır.'),
      sec('Zero (sıfır), classical physics (klasik fizik) gibi', false, 'Hayır. Classical (klasik) modelde sıfır, wave mechanics (dalga mekaniği) içinde değil.'),
      sec('One hundred percent (yüzde yüz)', false, 'Hayır. E > V₀ ise bir kısmı transmitted (geçer).')
    ],
    ipucu: 'k₁ ≠ k₂ ise r ≠ 0. "Nasıl yapılır: step\'te R ve T" kartına bak.',
    kusurSkin: 'vakans'
  };

  var o04 = {
    id: 's06-o04', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'bariyer_sonumlenme', agirlik: 1,
    soru: 'E < V₀ iken wave function (dalga fonksiyonu) ψ, barrier (bariyer) içinde ne yapar?',
    secenekler: [
      sec('Exponentially decays (üstel olarak sönümlenir) ama sıfır olmaz', true, 'Doğru. Forbidden region (yasak bölge) içinde wave (dalga) oscillate (salınım) yapmaz, decays (sönümlenir).'),
      sec('Suddenly (aniden) sıfır olur', false, 'Hayır. ψ ve derivative (türev) continuous (sürekli) olmalıdır, aniden sıfır olamaz.'),
      sec('Oscillation (salınım) devam eder', false, 'Hayır. Forbidden region (yasak bölge) içinde wave (dalga) oscillate (salınım) yapmaz.')
    ],
    ipucu: '"Continuity ve forbidden region" kartında ψ\'nin bariyer içindeki davranışına bak.',
    kusurSkin: 'tane_siniri'
  };

  var o05 = {
    id: 's06-o05', tip: 'tahmin', baslik: 'Tahmin çukuru', kavram: 'tunelleme_kalinlik', agirlik: 1.5,
    soru: 'Barrier (bariyer) kalınlaşırsa transmission probability (geçiş olasılığı) ne olur?',
    secenekler: [
      sec('Exponentially (üstel olarak) azalır', true, 'Doğru. Exponential decay (üstel azalma): T ∝ e^(−2κa).'),
      sec('Linearly (doğrusal) azalır', false, 'Yanlış. Azalma exponential (üstel), çok hızlıdır.'),
      sec('Değişmez', false, 'Yanlış. Thickness (kalınlık) arttıkça decay (sönümlenme) büyür.')
    ],
    sim: {
      modul: 'basamak',
      onceki: { mod: 'bariyer', E: 2, V0: 4, a: 0.3 },
      sonraki: { mod: 'bariyer', E: 2, V0: 4, a: 1.5 }
    },
    ipucu: 'T ∝ e^(−2κa): "Nasıl yapılır: bariyerde T" kartındaki örneğe bak.',
    acik: 'Thickness (kalınlık) 0,3\'ten 1,5 nm\'ye çıkınca transmission (geçiş) olasılığı yaklaşık 35 milyon kat düşüyor.'
  };

  Q.data.stations.s06 = {
    id: 's06',
    sira: 6,
    ad: 'Tünel istasyonu',
    makine: 'Tünel istasyonu',
    renk: '#7a5cff',
    konu: 'Step potential (basamak potansiyeli), reflection (yansıma), barrier (bariyer), tunneling (tünelleme)',
    sinavSorulari: ['S5', 'S6'],
    sureHedefDk: 22,
    patronId: 'broglie',
    kavramlar: ['basamak_yansima', 'bariyer_sonumlenme', 'tunelleme_kalinlik', 'dalga_surekli'],
    engeller: [
      {
        id: 's06-o01', tip: 'hikaye', baslik: 'Zaman kapısı', kavram: null, agirlik: 1,
        yer: 'Paris', yil: 1924, rivayet: false,
        onBilgi: [
          { baslik: "Madde dalgasından tünellemeye", madde: [
            "1924'te de Broglie, electron (elektron) gibi parçacıklar için matter wave (madde dalgası) önerdi.",
            "1927'de Davisson ve Germer, electron diffraction (elektron kırınımı) ile dalga davranışını gösterdi.",
            "1928'de Gamow, alpha decay (alfa bozunumu) olayını tunneling (tünelleme) ile açıkladı.",
            "Tunneling, tunnel diode (tünel diyodu) ve flash memory (flash bellek) gibi aygıtların temelindedir." ] },
          { baslik: "Step (basamak) sonuçları", madde: [
            "E > V₀ iken r = (k₁−k₂)/(k₁+k₂) ve R = |r|²; k₂ ≠ k₁ olduğundan R sıfırdan büyüktür.",
            "E < V₀ iken region 2 (bölge 2) içinde ψ sönümlenir ve sağa giden flux (akı) yoktur; bu yüzden R = 1 olur.",
            "Buna rağmen ψ orada sıfır değildir: probability density (olasılık yoğunluğu) vardır, flux (akı) yoktur." ] },
          { baslik: "Penetration depth (sızma derinliği)", madde: [
            "Forbidden region (yasak bölge) içinde ψ ∝ e^(−κx); penetration depth (sızma derinliği) δ = 1/κ.",
            "κ=√(2m(V₀−E))/ħ: mass (kütle) m veya V₀−E büyürse κ büyür ve tunneling (tünelleme) azalır.",
            "Elektron için κ ≈ 5,123·√(V₀−E) nm⁻¹ (V₀−E eV cinsinden).",
            "Scanning tunneling microscope (taramalı tünelleme mikroskobu) akımı I ∝ e^(−2κd) ile gap (aralık) d'ye çok duyarlıdır." ] }
        ],
        satirlar: [
          { kim: 'selin', metin: 'Tünel istasyonunda electron (elektron) bir duvarla karşılaşıyor. Geçer mi?' },
          { kim: 'broglie', metin: 'Matter wave (madde dalgası) ise ışık gibi davranır: engelde hem yansır hem geçebilir.' },
          { kim: 'selin', metin: 'Önce step (basamak), sonra barrier (bariyer). Wave (dalga) davranışı hep aynı.' }
        ]
      },
      {
        id: 's06-o02', tip: 'kavram', baslik: 'Kavram kapısı', kavram: 'basamak_yansima', agirlik: 1,
        onBilgi: [
          { baslik: "Step potential (basamak potansiyeli)", madde: [
            "Step potential (basamak potansiyeli): x = 0'da potential (potansiyel) V = 0'dan V₀'a sıçrar.",
            "Region (bölge) 1 ve region 2 için ayrı ψ yazılır; k₁=√(2mE)/ħ ve k₂=√(2m(E−V₀))/ħ.",
            "Işığın cam yüzeyinde kısmen yansıması gibi: dalganın ortamı değişince bir kısmı reflect (yansır) olur.",
            "R = reflection (yansıma) olasılığı, T = transmission (geçiş) olasılığı; R + T = 1." ] },
          { baslik: "Continuity (süreklilik) ve forbidden region", madde: [
            "Boundary (sınır) noktasında ψ ve ψ' continuous (sürekli) olmalı; bu şart katsayıları (r, t) belirler.",
            "Bunun nedeni: equation (denklem) second derivative (ikinci türev) içerir, süreksizlik taşıyamaz.",
            "E < V₀ ise klasikte yasak olan bölge: forbidden region (yasak bölge).",
            "Orada ψ oscillate (salınım) yapmaz; exponentially decays (üstel sönümlenir) ama bir anda sıfırlanmaz." ] },
          { baslik: "Tunneling (tünelleme), barrier (bariyer)", madde: [
            "Barrier (bariyer): V₀ yüksekliğinde, a kalınlığında engel; E < V₀ olsa bile öbür yanda ψ sıfır değildir.",
            "Tunneling (tünelleme): ψ'nin sönümlenip karşı tarafa ulaşması; parçacık engelin üstünden zıplamaz.",
            "T ∝ e^(−2κa), κ=√(2m(V₀−E))/ħ: thickness (kalınlık) a arttıkça T exponential (üstel) azalır.",
            "Sık karışan nokta: tunneling sırasında parçacık energy (enerji) kaybetmez, yalnızca olasılık küçülür." ] },
          { baslik: "Nasıl yapılır: step'te R ve T", madde: [
            "Sıra: her region (bölge) için ψ yaz, x = 0'da süreklilik koy, r ve t'yi çöz, sonra R = r², T = 1 − R al.",
            "Örnek: k₁ = 2, k₂ = 1 nm⁻¹ ise r = (2−1)/(2+1) = 1/3, R = 1/9, T = 8/9.",
            "Enerjiyle örnek: E = 2 eV, V₀ = 1 eV. k₂/k₁ = √(1−V₀/E) = 0,707; r ≈ 0,172; R ≈ 0,029.",
            "E, V₀'a yaklaştıkça k₂ küçülür, k₁'den uzaklaşır ve R artar; E ≫ V₀ iken R küçüktür." ] },
          { baslik: "Nasıl yapılır: bariyerde T", madde: [
            "Adımlar: (1) κ = √(2m(V₀−E))/ħ bul; (2) T ∝ e^(−2κa) yaz; (3) farklı a değerlerinde T'yi oranla.",
            "Örnek: V₀−E = 1 eV ise κ ≈ 5,12 nm⁻¹ (electron, elektron). a = 0,2 nm için e^(−2κa) ≈ 0,13.",
            "Aynı örnekte a = 0,6 nm için e^(−2κa) ≈ 0,0021. Kalınlık 3 kat olunca T yaklaşık 60 kat düştü.",
            "Azalma lineer değil üsteldir: a her 0,1 nm arttığında T sabit bir çarpanla (burada yaklaşık 0,36) küçülür." ] }
        ],
        tanitim: "Sarı çizgi E, mor basamak V₀; kaydırıcılar bunları oynatır. Alttaki yazı R (reflection, yansıma) ve T değerini verir.",
        gorev: 'E\'yi V₀\'a yaklaştırarak R\'yi 0,1-0,2 yap; E > V₀ kalsın.',
        sim: {
          modul: 'basamak',
          params: { mod: 'basamak', V0: 1.0, E: 3.0 },
          basari: { R: [0.1, 0.2] }
        },
        ogrenilen: 'E > V₀ iken bile wave (dalga) kısmen yansır; klasikte reflection (yansıma) olmazdı.'
      },
      o03,
      o04,
      o05,
      {
        id: 's06-o06', tip: 'tuzak', baslik: 'Yanılgı tuzağı', kavram: 'bariyer_sonumlenme', agirlik: 1,
        iddia: 'Energy (enerji) değeri barrier (bariyer) height (yükseklik) değerinden düşük particle (parçacık), quantum (kuantum) fiziğinde de kesinlikle geçemez.',
        parcalar: ['Energy (enerji) değeri barrier (bariyer) height (yükseklik) değerinden düşük particle (parçacık),', 'quantum (kuantum) fiziğinde de', 'kesinlikle geçemez.'],
        yanlisParca: 2,
        ipucu: 'ψ bariyer içinde hangi davranışı gösterir? "Continuity ve forbidden region" kartına bak.',
        duzeltme: 'Quantum (kuantum) fiziğinde ψ barrier (bariyer) içinde decays (sönümlenir) ama sıfır olmaz; ince barrier (bariyer) içinde tunneling (tünelleme) olasılığı vardır.'
      },
      {
        id: 's06-o07', tip: 'kopru', baslik: 'Mantık köprüsü', kavram: 'dalga_surekli', agirlik: 1,
        soru: 'Step potential (basamak) çözümünü sıraya diz',
        bloklar: [
          'ψ iki region (bölge) için de yazılır',
          'x = 0\'da ψ ve ψ\' continuous (sürekli) olmalı',
          'Continuity (süreklilik) coefficients (katsayıları) (r, t) belirler',
          'R=|r|² ve T=1−R (reflection, transmission)'
        ],
        ipucu: 'Önce bilinmeyenleri tanımla, sonra bağla, sonra çöz, en son olasılığa çevir. "Nasıl yapılır: step\'te R ve T" kartına bak.',
        sonuc: 'Her region (bölge) için ψ, boundary condition (sınır koşulu) olarak süreklilik, coefficients (katsayılar), R ve T.'
      },
      {
        id: 's06-o08', tip: 'patron', baslik: 'Wave (Dalga) Canavarı', kavram: null, agirlik: 1,
        canavar: 'broglie', canavarAd: 'Wave (Dalga) Canavarı',
        giris: 'Ben wave (dalga)! Wall (duvar) üzerine çarparım, bazen içinden geçerim.',
        fazlar: [
          {
            tip: 'secmeli', kavram: 'basamak_yansima',
            soru: 'E < V₀ olan step (basamak) potansiyelinde reflection coefficient (yansıma katsayısı) R kaçtır?',
            secenekler: [
              sec('R = 1', true, 'Doğru. Hepsi yansır; region 2 (bölge 2) içinde yalnızca decaying (sönümlü) ψ var.'),
              sec('R = 0', false, 'Hayır. R = 0 hiç reflection (yansıma) olmaması demek; E < V₀ iken hepsi yansır.'),
              sec('R = 0,5', false, 'Hayır. E < V₀ iken region 2 (bölge 2) içine flux (akı) gitmez, yani R = 1.')
            ],
            alt: {
              soru: 'Tunneling (tünelleme) hangi wave (dalga) özelliğinin sonucudur?',
              secenekler: [
                sec('ψ\'nin barrier (bariyer) içinde decays (sönümlenip) sıfır olmaması', true, 'Doğru. Öbür yanda ψ sıfırdan farklı kalır.'),
                sec('Particle (parçacık) barrier (bariyer) üzerinden zıplaması', false, 'Hayır. Zıplama classical (klasik) bir fikir.'),
                sec('Barrier (bariyer) melting (erimesi)', false, 'Hayır. Barrier (bariyer) değişmez.')
              ]
            }
          },
          {
            tip: 'acik',
            pdfSoru: 'Calculate the wave function and the reflection coefficient of the electron for the given potential.',
            soru: 'Step potential (basamak potansiyeli) için wave function (dalga fonksiyonu) ve reflection coefficient (yansıma katsayısı) nasıl bulunur? Explain (açıkla): mantığı anlat.',
            anahtarFikirler: [
              'İki region (bölge) için ψ yazılır: incident (gelen), reflected (yansıyan) ve transmitted (geçen) wave (dalga).',
              'x = 0\'da ψ ve ψ\' continuous (sürekli) olmalı.',
              'k₁=√(2mE)/ħ, k₂=√(2m(E−V₀))/ħ ile r=(k₁−k₂)/(k₁+k₂).',
              'R = |r|², T = 1 − R; E < V₀ ise R = 1.'
            ],
            yanlisKavramlar: [
              'E > V₀ ise hiç reflection (yansıma) olmaz',
              'ψ barrier (bariyer) içinde aniden sıfır olur'
            ],
            yanlisKavramIds: ['basamak_yansima', 'bariyer_sonumlenme'],
            idealCevap: 'Her iki region (bölge) içinde ψ yazılır: solda incident (gelen) ve reflected (yansıyan), sağda transmitted (geçen) wave (dalga). x = 0\'da ψ ve ψ\' continuous (sürekli) olmalıdır. Buradan r = (k₁−k₂)/(k₁+k₂) çıkar, reflection coefficient (yansıma katsayısı) R = |r|², transmission (geçiş) T = 1 − R\'dir. E < V₀ ise region 2 (bölge 2) içinde ψ decays (sönümlenir) ve R = 1\'dir.',
            yedekSecmeli: {
              soru: 'R = |r|² nasıl bulunur?',
              secenekler: [
                sec('ψ ve ψ\' continuity (süreklilik) ile r bulunur', true, 'Doğru. Boundary (sınır) noktasında continuity coefficients (katsayıları) belirler.'),
                sec('E\'yi V₀\'a dividing (bölerek)', false, 'Yanlış. Bu doğrudan R vermez.'),
                sec('Temperature (sıcaklık) ile', false, 'Yanlış. Temperature (sıcaklık) gerekmez.'),
                sec('ψ\'nin square (karesini) alarak', false, 'Yanlış. Önce r bulunur.')
              ]
            },
            alt: { soru: 'Step (basamak) potansiyelinde ψ continuity (sürekliliği) neden gerekir ve neyi belirler? Justify (gerekçelendir).' }
          },
          {
            tip: 'acik',
            pdfSoru: null,
            soru: 'Tunneling (tünelleme) nedir? Define (tanımla) ve transmission probability (geçiş olasılığı) neden thickness (kalınlık) ile azalır, explain (açıkla).',
            anahtarFikirler: [
              'E < V₀ iken klasik geçiş yok; kuantumda ψ barrier (bariyer) içinde decays (sönümlenir).',
              'ψ sıfırdan farklı kaldığından öbür yanda probability (olasılık) vardır.',
              'Geçiş olasılığı T ∝ e^(−2κa), thickness (kalınlık) ile exponential decay (üstel azalma) olur.',
              'Tunnel diode (tünel diyodu) ve flash memory (flash bellek) gibi aygıtlarda önemlidir.'
            ],
            yanlisKavramlar: [
              'Particle (parçacık) barrier (bariyer) üzerinden zıplar',
              'Geçerken energy (enerji) kaybeder'
            ],
            yanlisKavramIds: ['tunelleme_kalinlik', 'tunelleme_kalinlik'],
            idealCevap: 'E < V₀ iken classical physics (klasik fizik) geçişi yasaklar. Quantum (kuantum) fiziğinde ψ barrier (bariyer) içinde exponentially (üstel olarak) decays (sönümlenir) ama sıfır olmaz, bu yüzden öbür tarafta probability (olasılık) vardır. Transmission probability (geçiş olasılığı) T ∝ e^(−2κa) olduğundan barrier (bariyer) thickness (kalınlık) arttıkça çok hızlı azalır. Tunnel diode (tünel diyodu) ve flash memory (flash bellek) gibi aygıtlarda kullanılır.',
            yedekSecmeli: {
              soru: 'Tunneling (tünelleme) neden olur?',
              secenekler: [
                sec('ψ barrier (bariyer) içinde decays (sönümlenir) ama sıfır olmaz', true, 'Doğru. Öbür yanda ψ kalır.'),
                sec('Particle (parçacık) energy (enerji) kazanır', false, 'Yanlış. Energy (enerji) aynı kalır.'),
                sec('Barrier (bariyer) heats up (ısınır)', false, 'Yanlış. Heat (ısı) sebep değil.'),
                sec('Particle (parçacık) wave (dalga) değildir', false, 'Yanlış. Tunneling wave (dalga) davranışıdır.')
              ]
            },
            alt: { soru: 'Tunneling (tünelleme) olasılığı neden thickness (kalınlık) ile exponentially (üstel) azalır?' }
          }
        ]
      },
      { id: 's06-h01', tip: 'hesap', baslik: 'Hesap görevi', kavram: null, agirlik: 0, hesapGorev: 'q6-e-gt' },
      {
        id: 's06-o09', tip: 'sandik', baslik: 'Sandık', kavram: null, agirlik: 1,
        kart: { id: 'broglie', yil: 1924, tekCumle: 'Matter (madde) için de wave (dalga) davranışı önerdi.' },
        ozet: ['E > V₀ iken bile partial reflection (kısmi yansıma)', 'E < V₀: ψ barrier (bariyer) içinde decays (sönümlenir)', 'Tunneling (tünelleme) thickness (kalınlık) ile exponentially (üstel) azalır'],
        kontrolNoktasi: true
      }
    ],
    temelTur: {
      kartlar: [
        { baslik: 'Step (basamak)', metin: 'Wave (dalga) step (basamak) üzerinde kısmen reflected (yansır), kısmen transmitted (geçer).' },
        { baslik: 'Forbidden region (yasak bölge)', metin: 'E < V₀ iken ψ decays (sönümlenir), sıfır olmaz.' },
        { baslik: 'Tunneling (tünelleme)', metin: 'İnce barrier (bariyer) için transmission (geçiş) olasılığı var, kalınlıkla azalır.' }
      ],
      sim: { modul: 'basamak', params: { mod: 'bariyer', E: 2, V0: 4, a: 0.3 } }
    },
    tekrarHavuzu: [
      Object.assign({}, o03, { id: 's06-t01' }),
      Object.assign({}, o04, { id: 's06-t02' }),
      {
        id: 's06-t03', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'tunelleme_kalinlik', agirlik: 1,
        soru: o05.soru,
        secenekler: o05.secenekler,
        kusurSkin: 'vakans'
      },
      {
        id: 's06-t04', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'dalga_surekli', agirlik: 1,
        soru: 'Boundary (sınır) noktasında neden ψ ve ψ\' continuous (sürekli) olmalıdır?',
        secenekler: [
          sec('Equation (denklem) second derivative (ikinci türev) içerir', true, 'Doğru. Discontinuity (süreksizlik) equation (denklem) tarafından sağlanmaz.'),
          sec('Continuity (süreklilik) şart değildir', false, 'Hayır. Continuity (süreklilik) coefficients (katsayıları) belirler.'),
          sec('Yalnızca E < V₀ için gerekir', false, 'Hayır. Her case (durum) için gerekir.')
        ],
        kusurSkin: 'safsizlik'
      }
    ]
  };
})();
