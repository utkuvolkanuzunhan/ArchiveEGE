/* 89-data-kartlar.js — Bilim insanı kartlarının "derse katkı" metinleri.
 * Q.data.kartlar[kartId] = { p1, p2, p3?, sinav: [2-3 madde] }
 *   p1: kim / ne zaman / hangi bağlam (genel özet)
 *   p2: bilime ve çip teknolojisine katkı (genel özet)
 *   p3: YALNIZCA gerekliyse sezgi ya da yaygın yanılgı (yoksa alanı hiç yazma)
 *   sinav: "Sınavda kesin bilmem gereken" maddeleri (kısa, formül/ilişki dahil)
 * Kart kimlikleri sandık engelindeki kart.id ile aynıdır (s01-s10).
 * KURAL: yalnızca kesin bilinen gerçekler. Emin olunmayan tarih/ülke/ödül yazılmaz.
 * Dil: Türkçe anlatım, ders terimleri English (Türkçe). */
(function(){
  'use strict';
  var Q = window.Q;
  Q.data = Q.data || {};
  Q.data.kartlar = {
    czoch: {
      p1: 'Jan Czochralski, Polonyalı bir kimyager ve metalurjistti. 1916\'da metallerin crystallization (kristalleşme) hızını incelerken, eriyik bir metalin içine daldırılan küçük bir kristalin yavaşça yukarı çekilerek büyütülebileceğini buldu. Bu yönteme bugün Czochralski (CZ) method (CZ yöntemi) denir.',
      p2: 'CZ yönteminde melt (eriyik) içine seed crystal (tohum kristal) değdirilir, yavaşça döndürülerek yukarı çekilir; eriyik tohumun kristal düzenini sürdürerek katılaşır ve ortaya single crystal (tek kristal) bir ingot (külçe) çıkar. Yarıiletken endüstrisinin kullandığı silicon wafer (silisyum dilim) bu külçeden kesilir. Dopant (katkı) atomları eriyiğe eklenerek büyüme sırasında kristale yerleştirilebilir.',
      sinav: [
        'CZ: seed crystal (tohum kristal) melt (eriyik) içine değer, döndürülerek yavaşça çekilir; sonuç single crystal (tek kristal) ingot (külçe).',
        'Neden tek kristal: grain boundary (tane sınırı) yok; electron saçılması ve defect (kusur) etkisi azalır.',
        'Silisyumun melting point (erime noktası) yaklaşık 1414 °C.'
      ]
    },
    miller: {
      p1: 'William Hallowes Miller, Cambridge\'de çalışan Galli bir mineralogist (mineralog) ve crystallographer (kristalograf) idi. 1839\'da yayımladığı kristalografi kitabında crystal plane (kristal düzlemi) adlandırmak için bugün Miller indices (Miller indisleri) dediğimiz sistemi kullandı.',
      p2: 'Miller indices (Miller indisleri), bir düzlemin lattice (kafes) içindeki yönelimini üç küçük integer (tam sayı) ile yazmayı sağlar: (hkl). Yarıiletkende wafer yüzeyi bu notasyonla belirtilir, örneğin (100) ve (111). Farklı düzlemlerde atom yoğunluğu farklıdır; bu, etching (aşındırma), oxide (oksit) büyümesi ve surface (yüzey) özelliklerini etkiler.',
      sinav: [
        'Adımlar: intercepts (kesişimler) → reciprocals (terslerin) → en küçük integers (tam sayılar) → (hkl).',
        'Örnek: kesişimler 2, ∞, ∞ ise terslerin 1/2, 0, 0 olur; düzlem (100).',
        '(hkl) bir plane (düzlem), [uvw] bir direction (yön), {hkl} eş değer düzlemler ailesi; cubic (kübik) kristalde [hkl] ⊥ (hkl).'
      ]
    },
    einstein: {
      p1: 'Albert Einstein 1905\'te, Max Planck\'ın 1900\'de önerdiği enerji paketleri fikrini ışığın kendisine uyguladı. Photoelectric effect (fotoelektrik olay) için, light (ışık) enerjisinin photon (foton) denen paketler hâlinde taşındığını öne sürdü. Bu çalışmaya Nobel Fizik Ödülü verildi.',
      p2: 'Bir photon (foton) enerjisi E = hf\'dir. Bir electron (elektron) metalden kopmak için work function (iş fonksiyonu) φ kadar enerji gerektirir; kinetik enerji K_max = hf − φ olur. Eşik frequency (frekans) f₀ = φ/h\'dir. Bu fikir, photodetector (foto algılayıcı), solar cell (güneş pili) ve image sensor (görüntü algılayıcı) gibi ışıkla çalışan aygıtların temelidir ve classical wave theory (klasik dalga teorisi) ile açıklanamayan sonuçları çözdü.',
      p3: 'Yanılgı: ışığı çok parlatırsak electron mutlaka kopar sanılır. Eşiğin altındaki frequency (frekans) için intensity (şiddet) ne kadar artarsa artsın electron kopmaz; intensity yalnızca kopan electron sayısını (akımı) belirler, her electron\'un enerjisini hf belirler.',
      sinav: [
        'E = hf; K_max = hf − φ; eşik f₀ = φ/h.',
        'Eşiğin altında intensity (şiddet) artsa da emission (salım) olmaz.',
        'Intensity (şiddet) → electron sayısı (akım); frequency (frekans) → K_max.'
      ]
    },
    bohr: {
      p1: 'Niels Bohr, Danimarkalı bir fizikçiydi. 1913\'te hydrogen atom (hidrojen atomu) için bir model önerdi ve bu çalışması sayesinde atomik spectrum (spektrum) çizgilerini ilk kez sayısal olarak açıkladı. 1922\'de Nobel Fizik Ödülü\'nü aldı.',
      p2: 'Modelin ana fikri: electron (elektron) yalnızca belirli discrete energy levels (ayrık enerji seviyeleri) üzerinde bulunabilir ve bu durumlarda ışıma yapmaz; seviyeler arası transition (geçiş) sırasında hf = E_i − E_f enerjili photon (foton) yayılır ya da soğurulur. Hydrogen için E_n = −13,6 eV / n² olur. Bu, atomdaki energy level (enerji seviyesi) fikrinin başlangıcıdır; katılarda bu seviyeler birleşip energy band (enerji bandı) oluşturur.',
      p3: 'Yanılgı: Bohr modeli "elektron gerçekten yörüngede döner" demek değildir. Sonradan wave function (dalga fonksiyonu) tanımı bu resmin yerini aldı. Sezgi: ground state (temel hâl) n = 1 en düşük seviyedir; electron daha aşağı inemez, bu yüzden atom çöküp yok olmaz.',
      sinav: [
        'E_n = −13,6 eV / n²; ground state (temel hâl) n = 1.',
        'Photon (foton) enerjisi: hf = E_i − E_f.',
        'Seviyeler discrete (ayrık); spektrum çizgili.'
      ]
    },
    schro: {
      p1: 'Erwin Schrödinger, Avusturyalı bir fizikçiydi. 1926\'da madde dalgası fikrini bir wave equation (dalga denklemi) hâline getirdi ve 1933\'te Nobel Fizik Ödülü\'nü paylaştı. Ünlü "kedi" düşünce deneyi sonraki yıllarda ortaya atıldı.',
      p2: 'Time-independent Schrödinger equation (zamandan bağımsız Schrödinger denklemi): −(ħ²/2m) ψ″ + V(x) ψ = E ψ. Potansiyel V(x) ve boundary conditions (sınır koşulları) verildiğinde izin verilen energy levels (enerji seviyeleri) ve wave functions (dalga fonksiyonları) bu denklemden çıkar. Sonsuz potansiyel kuyusunda E_n = n²π²ħ² / (2mL²) olur. Katıların band structure (bant yapısı) hesabı bu denklemin periyodik potansiyelde çözülmesine dayanır.',
      p3: 'Yanılgı: Schrödinger equation (Schrödinger denklemi) wave function\'ı "çökertir" sanılır. Denklem ψ\'yi deterministic (belirlenimci) olarak zamanla evriltir; collapse (çökme) ise measurement (ölçüm) postülasıdır. Sezgi: en düşük energy (enerji) sıfır olamaz; zero-point energy (sıfır noktası enerjisi) boundary condition (sınır koşulu) sonucudur, n = 0 çözümü ψ = 0 verir.',
      sinav: [
        '−(ħ²/2m) ψ″ + Vψ = Eψ; sonsuz kuyuda E_n = n²π²ħ² / (2mL²), n = 1, 2, 3, …',
        'Energy quantization (enerji nicemlenmesi) boundary condition (sınır koşulu) sonucudur.',
        'Denklem ψ\'yi çökertmez; collapse (çökme) measurement (ölçüm) ile olur.'
      ]
    },
    broglie: {
      p1: 'Louis de Broglie, Fransız bir fizikçiydi. 1924\'teki doktora tezinde ışığın hem dalga hem parçacık gibi davranmasının madde için de geçerli olabileceğini önerdi ve 1929\'da Nobel Fizik Ödülü\'nü aldı. Fikir, 1927\'de Davisson ve Germer\'in nikel kristalinden electron diffraction (elektron kırınımı) gözlemesiyle deneysel olarak desteklendi.',
      p2: 'De Broglie wavelength (de Broglie dalga boyu): λ = h/p. Electron (elektron) gibi küçük kütleli parçacıkların dalga boyu kristal lattice (kafes) aralığıyla karşılaştırılabilir olabilir; bu yüzden kristalden diffraction (kırınım) gösterirler. Bu, Schrödinger\'in wave function (dalga fonksiyonu) yaklaşımının ve electron microscope (elektron mikroskobu) gibi araçların fiziksel temelidir.',
      sinav: [
        'λ = h/p; kinetik enerjiden p = √(2mE).',
        'Electron diffraction (elektron kırınımı) matter wave (madde dalgası) kanıtıdır.',
        'Büyük p → küçük λ; makroskobik cisimde dalga etkisi ihmal edilir.'
      ]
    },
    born: {
      p1: 'Max Born, Alman bir fizikçiydi. 1926\'da wave function (dalga fonksiyonu) ψ\'nin kendisinin ölçülemediğini, karesinin ise olasılığı belirlediğini öne sürdü. Bu probabilistic interpretation (olasılıksal yorum) çalışması için 1954\'te Nobel Fizik Ödülü\'nü aldı.',
      p2: '|ψ(x)|² bir probability density (olasılık yoğunluğu)dur; [a, b] aralığında bulma olasılığı ∫|ψ|² dx ile verilir. Toplam olasılık 1 olmalıdır: normalization (normalizasyon) ∫|ψ|² dx = 1. Bir parçacığın nerede bulunacağı yalnızca olasılıkla söylenir; yarıiletkende electron\'un belirli bölgelerde bulunma olasılığı bu yorumla hesaplanır.',
      p3: 'Yanılgı: ψ\'nin kendisi olasılıktır sanılır. ψ genel olarak complex (karmaşık) bir fonksiyondur ve doğrudan gözlenemez; gözlenen, |ψ|² ile verilen olasılıktır. Ayrıca |ψ|² olasılık değil, birim uzunluk başına olasılık yoğunluğudur.',
      sinav: [
        'P(a ≤ x ≤ b) = ∫ₐᵇ |ψ|² dx.',
        'Normalization (normalizasyon): ∫ |ψ|² dx = 1.',
        'Measurement (ölçüm) bir eigenvalue (özdeğer) verir; olasılığı |cₙ|².'
      ]
    },
    heis: {
      p1: 'Werner Heisenberg, Alman bir fizikçiydi. 1925\'te matrix mechanics (matris mekaniği) yaklaşımını geliştirdi, 1927\'de uncertainty principle (belirsizlik ilkesi)ni yayımladı ve 1932 Nobel Fizik Ödülü\'nü aldı.',
      p2: 'Uncertainty principle (belirsizlik ilkesi): Δx Δp ≥ ħ/2. Position (konum) ne kadar keskin belirlenirse momentum o kadar belirsizleşir. Bu, confinement (hapsolma) altında zero-point energy (sıfır noktası enerjisi)nin neden sıfır olamadığını açıklar: parçacık küçük bir bölgeye sıkıştırıldıkça momentum yayılımı artar. Nano ölçekli aygıtlarda quantum confinement (kuantum hapsolma) etkisinin temel nedenidir.',
      p3: 'Yanılgı: ilkenin ölçüm aletinin kusurundan ya da ölçümün sistemi "bozmasından" kaynaklandığı sanılır. Sebep, parçacığın wave nature (dalga doğası)dır: dar bir dalga paketi geniş bir momentum aralığı gerektirir. Günlük cisimlerde ħ çok küçük olduğundan etki fark edilmez.',
      sinav: [
        'Δx Δp ≥ ħ/2.',
        'Neden: wave nature (dalga doğası); alet hatası değil.',
        'Daha dar confinement (hapsolma) → daha büyük momentum belirsizliği → daha yüksek enerji.'
      ]
    },
    pauli: {
      p1: 'Wolfgang Pauli, Avusturya doğumlu bir fizikçiydi. 1925\'te exclusion principle (dışlama ilkesi)ni ortaya koydu ve 1945\'te Nobel Fizik Ödülü\'nü aldı.',
      p2: 'Pauli exclusion principle (Pauli dışlama ilkesi): iki electron (elektron) aynı quantum state (kuantum durumu) içinde bulunamaz. Bir orbital ya da enerji seviyesinde zıt spin (dönü) ile en çok iki electron yer alır. Katıda N atom, N tane yakın enerji seviyesi verir; electron\'lar bu seviyeleri alttan doldurur, böylece energy band (enerji bandı) yapısı ve Fermi level (Fermi seviyesi) ortaya çıkar. Bir bandın dolu olup olmaması malzemenin conductor (iletken), semiconductor (yarıiletken) ya da insulator (yalıtkan) olmasını belirler.',
      sinav: [
        'İki electron aynı quantum state (kuantum durumu) içinde olamaz; seviye başına en çok 2 electron (zıt spin).',
        'N atom → N energy level (enerji seviyesi) → band (bant).',
        'Dolu band akım taşımaz; iletim için kısmen dolu ya da bandgap (yasak enerji aralığı) üstüne uyarılma gerekir.'
      ]
    },
    fermi: {
      p1: 'Enrico Fermi, İtalyan bir fizikçiydi. 1926\'da electron gibi spin ½ taşıyan parçacıklar için statistics (istatistik) geliştirdi; aynı sonuca Paul Dirac da ulaştı, bu yüzden dağılıma Fermi-Dirac distribution (Fermi-Dirac dağılımı) denir. 1938\'de Nobel Fizik Ödülü\'nü aldı.',
      p2: 'Fermi-Dirac dağılımı bir enerji seviyesinin dolu olma olasılığını verir: f(E) = 1 / (1 + exp((E − E_F)/kT)). Burada E_F, Fermi level (Fermi seviyesi)dir. Yarıiletkenlerde electron ve hole (delik) yoğunluğu bu dağılımla ve density of states (durum yoğunluğu) ile hesaplanır; Fermi level\'in bandgap (yasak enerji aralığı) içindeki konumu doping (katkılama) türünü belirler.',
      p3: 'Sezgi: T = 0 K\'de f(E) bir step function (basamak fonksiyonu)dur: E_F altı tamamen dolu, üstü tamamen boş. Yanılgı: Fermi level\'de mutlaka bir enerji durumu bulunması gerekmez; yarıiletkenin bandgap içine düşebilir.',
      sinav: [
        'f(E) = 1 / (1 + exp((E − E_F)/kT)); her T için f(E_F) = 1/2.',
        'T = 0 K\'de f(E) basamak fonksiyonu: E < E_F için 1, E > E_F için 0.',
        'Oda sıcaklığında kT ≈ 0,0259 eV.'
      ]
    },
    planck: {
      p1: 'Max Planck, Alman bir fizikçiydi. 1900\'de blackbody radiation (kara cisim ışıması) spektrumunu açıklamaya çalışırken, ışıyan osilatörlerin enerjiyi yalnızca belirli paketler hâlinde alıp verdiğini varsaydı. Bu varsayım quantum theory (kuantum kuramı)nın başlangıcı sayılır; Planck 1918\'de Nobel Fizik Ödülü\'nü aldı.',
      p2: 'Planck enerji paketini E = hf ile verdi; h, Planck constant (Planck sabiti) olup yaklaşık 6,63×10⁻³⁴ J·s\'dir. Classical physics (klasik fizik) kısa dalga boylarında toplam enerjinin sonsuz çıkmasını öngörüyordu; Planck yasası ise ölçülen spektrumla uyuştu. Planck paketlemeyi ışımayı alıp veren osilatörlere uygulamıştı; ışığın kendisinin foton olduğunu 1905\'te Einstein öne sürdü.',
      sinav: [
        'Classical theory (klasik kuram): kısa dalga boyunda spektrum sonsuza gider; Planck\'ın E = hf paketleri ölçümle uyuşur.',
        'Planck: osilatörün salım/soğurma enerjisi nicemli; photon (foton) fikri Einstein\'ındır (1905).',
        'Blackbody (kara cisim): T arttıkça tepe daha kısa dalga boyuna kayar (Wien).'
      ]
    },
    hertz: {
      p1: 'Heinrich Hertz, Alman bir fizikçiydi. 1880\'lerin sonunda electromagnetic waves (elektromanyetik dalgalar)ı deneyle üretip algıladı. 1887\'de kıvılcım aralığı deneyinde ultraviyole ışığın kıvılcımı kolaylaştırdığını fark etti; bu, photoelectric effect (fotoelektrik olay)ın ilk gözlemidir.',
      p2: 'Gözlem, ışığın metal yüzeyinden electron (elektron) koparabildiğini gösterdi ama nedenini açıklamadı. Classical wave theory (klasik dalga teorisi) intensity (şiddet) arttıkça kopan electron enerjisinin artmasını beklerdi; deneyler frequency (frekans) eşiği gösterdi. Çelişkiyi 1905\'te Einstein hf paketleriyle çözdü. Frequency birimi hertz (Hz) Hertz\'in adını taşır.',
      sinav: [
        'Photoelectric effect (fotoelektrik olay) ilk kez Hertz tarafından gözlendi (1887); açıklamasını Einstein verdi (1905).',
        'Klasik beklenti: intensity (şiddet) ↑ → K_max ↑. Gözlem: eşik frequency (frekans) var; K_max frekansa bağlı.'
      ]
    },
    bravais: {
      p1: 'Auguste Bravais, Fransız bir fizikçi ve kristalograftı. 1848\'de uzayda düzenli dizilmiş noktaları sistematik biçimde inceledi ve lattice (kafes) türlerini sınıflandırdı.',
      p2: 'Üç boyutta 14 Bravais lattice (Bravais kafesi) vardır; bunlar 7 crystal system (kristal sistemi) içinde yer alır. Kübik sistemde simple cubic (basit kübik), body-centered cubic (hacim merkezli kübik, BCC) ve face-centered cubic (yüzey merkezli kübik, FCC) bulunur. Silisyum diamond cubic (elmas kübik) yapıdadır: FCC kafesi ve her kafes noktasında iki atomlu basis (baz). Lattice + basis = crystal structure (kristal yapı).',
      sinav: [
        '3B\'de 14 Bravais lattice (Bravais kafesi), 7 crystal system (kristal sistemi).',
        'Crystal structure (kristal yapı) = lattice (kafes) + basis (baz).',
        'Cubic (kübik) conventional cell (birim hücre) başına atom: SC 1, BCC 2, FCC 4.'
      ]
    },
    bragg: {
      p1: 'William Henry Bragg ve oğlu William Lawrence Bragg, İngiliz fizikçilerdi. 1912-1913\'te X-ray diffraction (X ışını kırınımı) ile kristal yapıyı çözmeyi başardılar ve 1915\'te Nobel Fizik Ödülü\'nü paylaştılar. X ışınlarının kristalden kırınımını 1912\'de von Laue ve çalışma arkadaşları göstermişti.',
      p2: 'Bragg law (Bragg yasası): nλ = 2d sinθ; d, parallel planes (paralel düzlemler) arası mesafedir. Dalga boyu bilinen X-ray ile ölçülen açıdan d, dolayısıyla lattice constant (kafes sabiti) bulunur. d, Miller indices (Miller indisleri) ile adlandırılan düzlem aileleri için hesaplanır. X-ray diffraction, kristalin yönelimini ve kalitesini denetlemek için kullanılabilir.',
      sinav: [
        'Bragg law (Bragg yasası): nλ = 2d sinθ; θ, gelen ışının düzlemle yaptığı açıdır.',
        'Constructive interference (yapıcı girişim) için yol farkı nλ olmalı; kırınım için λ ≤ 2d.'
      ]
    },
    rutherford: {
      p1: 'Ernest Rutherford, Yeni Zelandalı bir fizikçiydi. Ekibindeki Geiger ve Marsden\'in altın folyoda alpha particle (alfa parçacığı) saçılması deneyini yorumlayarak 1911\'de nuclear atom (çekirdekli atom) modelini önerdi. 1908\'de Nobel Kimya Ödülü\'nü almıştı.',
      p2: 'Alfa parçacıklarının çoğu folyodan doğrudan geçti, az sayısı büyük açıyla saçıldı. Sonuç: pozitif yük ve kütle küçük bir nucleus (çekirdek)te toplanmıştır, electron lar çevresindedir. Ama classical physics (klasik fizik)e göre çekirdek çevresinde dönen, yani ivmelenen electron ışıma yapar, enerji kaybeder ve çekirdeğe spiral çizerek düşer; atom kararsız çıkar. Bohr 1913\'te discrete energy levels (ayrık enerji seviyeleri) ile çıkış yolunu gösterdi.',
      sinav: [
        'Rutherford: pozitif yük küçük nucleus (çekirdek)te; atom çoğunlukla boşluk.',
        'Klasik sorun: ivmeli electron ışıma yapar, enerji kaybeder, çekirdeğe düşer; atom kararlı olamaz.',
        'Çözüm: discrete levels (ayrık seviyeler), ground state (temel hâl) altı yok (Bohr); zero-point energy (Schrödinger).'
      ]
    },
    davisson: {
      p1: 'Clinton Davisson ve Lester Germer, Amerikalı fizikçilerdi ve Bell Telephone Laboratories\'te çalışıyorlardı. 1927\'de nikel kristalinden saçılan electron (elektron) demetinde belirli açılarda şiddet tepeleri gözlediler. Davisson bu çalışma nedeniyle 1937 Nobel Fizik Ödülü\'nü G. P. Thomson ile paylaştı.',
      p2: 'Tepeler X-ray diffraction (X ışını kırınımı)na benzer bir girişim desenidir; electron\'un wave nature (dalga doğası)nı ve de Broglie\'nin λ = h/p ilişkisini deneysel olarak doğruladı. Kırınım için dalga boyunun kafes aralığıyla karşılaştırılabilir olması gerekir. Sonuç, matter wave (madde dalgası) fikrini ve Schrödinger\'in wave mechanics (dalga mekaniği) yaklaşımını destekledi.',
      sinav: [
        'Davisson-Germer: nikel kristalinde electron diffraction (elektron kırınımı); matter wave (madde dalgası) kanıtı.',
        'Ölçülen kırınım açısı, kristal aralığıyla λ = h/p değerinden beklenenle uyuştu.',
        'Kuantum mekaniğinin başarısı: wave-particle duality (dalga-parçacık ikiliği) deneyle doğrulandı.'
      ]
    },
    gamow: {
      p1: 'George Gamow, Odessa doğumlu bir fizikçiydi. 1928\'de alpha decay (alfa bozunması)nı quantum tunneling (kuantum tünelleme) ile açıkladı; Gurney ve Condon aynı sonuca bağımsız olarak ulaştı.',
      p2: 'Klasik olarak enerjisi yetmeyen parçacık barrier (bariyer)i aşamaz. Kuantum mekaniğinde wave function (dalga fonksiyonu) bariyerin içinde exponentially decaying (üstel sönümlü) sürer ve karşı tarafta sıfır olmayan amplitude (genlik) kalır. Transmission probability (geçirgenlik) yaklaşık T ≈ e^(−2κL), κ = √(2m(V₀−E))/ħ. Tünelleme, flash memory (flaş bellek) ve scanning tunneling microscope (taramalı tünelleme mikroskobu) gibi aygıtlarda rol oynar.',
      p3: 'Yanılgı: parçacık bariyerin üstünden aşar ya da içinde klasik hareket eder sanılır. E < V₀ iken ψ bariyerde sönümlüdür; geçiş, dalga fonksiyonunun karşı tarafa uzanan kuyruğundandır.',
      sinav: [
        'E < V₀ iken bariyerde ψ ∝ e^(−κx); T ≈ e^(−2κL).',
        'Bariyer kalınlaşırsa, yükselirse ya da parçacık ağırlaşırsa T üstel olarak düşer.'
      ]
    },
    neumann: {
      p1: 'John von Neumann, Macar doğumlu bir matematikçiydi. 1932\'de yayımladığı kitapta quantum mechanics (kuantum mekaniği)nı Hilbert space (Hilbert uzayı) üzerinde bir matematik çerçeveye oturttu: durumlar vektör, observable (gözlenebilir) nicelikler Hermitian operator (Hermitsel işlemci) olarak ele alındı.',
      p2: 'Measurement postulate (ölçüm postülatı): bir observable ölçüldüğünde sonuç, işlemcinin eigenvalue (özdeğer)idir; aᵢ sonucunun olasılığı |cᵢ|²dir (Born rule). İdeal ölçümden hemen sonra durum o eigenstate (özdurum)a collapse (çöker); ölçüm hemen tekrarlanırsa aynı sonuç alınır. Ölçüm dışında durum Schrödinger equation (Schrödinger denklemi) ile deterministic (belirlenimci) evrilir.',
      p3: 'Yanılgı: collapse (çökme) için bilinçli bir gözlemci gerektiği ya da Schrödinger denkleminin çökmeyi ürettiği sanılır. Postülat ölçümü ayrı bir kural olarak koyar; çökmenin mekanizması hâlâ yorum konusudur (measurement problem).',
      sinav: [
        'Sonuç yalnızca eigenvalue (özdeğer); ψ = Σcᵢφᵢ ise aᵢ olasılığı |cᵢ|².',
        'Ölçümden sonra durum ölçülen eigenstate (özdurum)a collapse (çöker); hemen tekrar ölçüm aynı değeri verir.',
        'Ölçüm dışında evrim Schrödinger equation (Schrödinger denklemi) ile deterministic (belirlenimci) ve linear (doğrusal).'
      ]
    },
    kennard: {
      p1: 'Earle Hesse Kennard, Amerikalı bir fizikçiydi. Heisenberg 1927\'de uncertainty principle (belirsizlik ilkesi)ni yaklaşık bir bağıntı olarak vermişti; Kennard aynı yıl, standard deviation (standart sapma) cinsinden kesin eşitsizliği türetti.',
      p2: 'Kesin biçim: σ_x σ_p ≥ ħ/2. Burada σ, |ψ|² dağılımının standart sapmasıdır. Eşitlik yalnızca Gaussian wave packet (Gauss dalga paketi) için sağlanır. Bu sınır, confinement (hapsolma) altındaki minimum enerjiyi belirler: parçacık dar bir bölgeye sıkıştıkça σ_p en az ħ/(2σ_x) olur, bu yüzden kinetic energy (kinetik enerji) sıfır olamaz.',
      p3: 'Yanılgı: ilkenin ölçüm aletinin yetersizliği olduğu ya da hep σ_x σ_p = ħ/2 olduğu sanılır. Bağıntı bir eşitsizliktir ve hazırlanan ψ durumunun özelliğidir; ölçüm hatası değildir.',
      sinav: [
        'σ_x σ_p ≥ ħ/2 (eşitsizlik); eşitlik yalnızca Gaussian wave packet (Gauss dalga paketi).',
        'Kaynak: x ve p dalga fonksiyonlarının Fourier ilişkisi, yani wave nature (dalga doğası); ölçüm hatası değil.',
        'Dar confinement (hapsolma) → büyük σ_p → zero-point energy (sıfır noktası enerjisi) > 0.'
      ]
    },
    bloch: {
      p1: 'Felix Bloch, İsviçre doğumlu bir fizikçiydi. 1928\'de doktora çalışmasında kristaldeki electron (elektron) dalgasının yapısını inceledi ve bugün Bloch theorem (Bloch teoremi) denen sonucu buldu. 1952\'de nükleer manyetik rezonans çalışmaları için Nobel Fizik Ödülü\'nü Edward Purcell ile paylaştı.',
      p2: 'Teorem: periodic potential (periyodik potansiyel) V(x+a) = V(x) için çözümler ψₖ(x) = e^(ikx) uₖ(x) biçimindedir ve uₖ(x+a) = uₖ(x). Yani electron, plane wave (düzlem dalga) çarpı kafesle periyodik bir zarftır. |ψ|² kafes periyodundadır: electron tek bir atoma ait değil, tüm kristale yayılmıştır. ħk, crystal momentum (kristal momentumu) olup E(k) band structure (bant yapısı)nı verir.',
      sinav: [
        'Bloch: ψₖ(x) = e^(ikx) uₖ(x), uₖ(x+a) = uₖ(x).',
        '|ψ|² kafes periyodundadır; electron kristalde delocalized (yayılmış).',
        'E(k) bantları verir; ħk crystal momentum (kristal momentumu) olup gerçek momentum değildir.'
      ]
    },
    kronig: {
      p1: 'Ralph Kronig ve William Penney, 1931\'de kristaldeki electron için basit bir periodic potential (periyodik potansiyel) modeli yayımladılar: dikdörtgen bariyerler ve kuyulardan oluşan tekrar eden bir potansiyel.',
      p2: 'Schrödinger denklemi bu potansiyel için çözüldüğünde, Bloch theorem (Bloch teoremi) biçimindeki çözümler yalnızca belirli enerji aralıklarında bulunur: allowed energy bands (izinli enerji bantları). Aralarında forbidden gap (yasak aralık) vardır. Bu, bandgap (yasak enerji aralığı)ın ilk basit gösterimidir. Bariyer güçlendikçe bantlar daralır ve izole kuyu seviyelerine yaklaşır.',
      sinav: [
        'İzinli enerji: |cos(αa) + P sin(αa)/(αa)| ≤ 1, α = √(2mE)/ħ; dışı forbidden gap (yasak aralık).',
        'Periodic potential (periyodik potansiyel) → energy bands (enerji bantları) + bandgap; P büyüdükçe bantlar daralır.',
        'Çözümler Bloch biçimindedir: ψ = e^(ikx) u(x), u periyodik.'
      ]
    },
    dirac: {
      p1: 'Paul Dirac, İngiliz bir fizikçiydi. 1926\'da Fermi\'den bağımsız olarak electron gibi parçacıkların istatistiğini türetti; Fermi-Dirac statistics (Fermi-Dirac istatistiği) adının iki isimli olması bundandır. 1933\'te Schrödinger ile Nobel Fizik Ödülü\'nü paylaştı.',
      p2: 'Fermi-Dirac distribution (dağılımı), Pauli exclusion principle (dışlama ilkesi)ne uyan identical (özdeş) fermion (fermiyon)ların her state (durum)u en çok bir kez doldurmasının sonucudur: f(E) = 1/(1 + exp((E − E_F)/kT)). Dirac 1928\'de relativistik electron denklemini yazdı; denklem antimatter (karşı madde) öngördü. Dirac delta fonksiyonu, Kronig-Penney gibi modellerde ince bariyerleri temsil eder.',
      sinav: [
        'Fermi-Dirac: fermiyonlar (spin ½, electron) için; Pauli gereği her state\'te en çok 1 parçacık.',
        'E − E_F ≫ kT iken f(E) ≈ exp(−(E − E_F)/kT) (Boltzmann kuyruğu).'
      ]
    },
    shockley: {
      p1: 'William Shockley, Bell Laboratories\'te çalışan Amerikalı bir fizikçiydi. 1947\'de ilk transistör orada Bardeen ve Brattain tarafından yapıldı; Shockley 1948\'de junction transistor (eklem transistörü) fikrini ve p-n junction (p-n eklem) kuramını geliştirdi. Üçü 1956\'da Nobel Fizik Ödülü\'nü paylaştı.',
      p2: 'Transistor, küçük bir gerilimle büyük bir akımı kontrol eden semiconductor (yarıiletken) anahtar ya da yükselticidir. İşlev, doped (katkılı) bölgelerdeki electron ve hole (delik) taşıyıcılarının p-n junction boyunca kontrolüne dayanır; Fermi level (Fermi seviyesi)ın bandgap içindeki konumu doping türünü belirler. Modern integrated circuit (tümleşik devre) milyarlarca transistör içerir.',
      sinav: [
        'n-type: çoğunluk taşıyıcısı electron, Fermi level iletim bandına yakın; p-type: hole, valans bandına yakın.',
        'Junction transistor (eklem transistörü): emitter–base–collector, iki p-n junction.'
      ]
    }
  };
  /* Bonus kartlar: istasyon BİTİNCE (ilerleme[ist].tamam) otomatik kazanılır; kayda yazılmaz (cip-hatti-v1 değişmedi).
   * kisi/yil/tekCumle koleksiyon satırı içindir; ayrıntı metni yukarıdaki Q.data.kartlar[id]. Portre: 40-art-chars.js cameo. */
  Q.data.bonusKartlar = [
    { id: 'bravais', ist: 's02', kisi: 'Auguste Bravais', yil: 1848, tekCumle: 'Lattice (kafes) türlerini sınıflandırdı: 3B\'de 14 Bravais lattice (Bravais kafesi).' },
    { id: 'bragg', ist: 's02', kisi: 'W. H. Bragg ve W. L. Bragg', yil: 1913, tekCumle: 'X-ray diffraction (X ışını kırınımı) ile kristal yapıyı çözdü: nλ = 2d sinθ.' },
    { id: 'planck', ist: 's03', kisi: 'Max Planck', yil: 1900, tekCumle: 'Enerji E = hf paketleriyle alınıp verilir, diyerek blackbody (kara cisim) spektrumunu açıkladı.' },
    { id: 'hertz', ist: 's03', kisi: 'Heinrich Hertz', yil: 1887, tekCumle: 'Ultraviyole ışığın kıvılcımı kolaylaştırdığını gördü: photoelectric effect (fotoelektrik olay) ilk gözlem.' },
    { id: 'rutherford', ist: 's04', kisi: 'Ernest Rutherford', yil: 1911, tekCumle: 'Alfa saçılmasından küçük, yüklü bir nucleus (çekirdek) çıkardı; klasik atom kararsızdı.' },
    { id: 'davisson', ist: 's04', kisi: 'Davisson ve Germer', yil: 1927, tekCumle: 'Nikel kristalinde electron diffraction (elektron kırınımı) gözleyip matter wave (madde dalgası) fikrini doğruladılar.' },
    { id: 'gamow', ist: 's06', kisi: 'George Gamow', yil: 1928, tekCumle: 'Alpha decay (alfa bozunması)nı quantum tunneling (kuantum tünelleme) ile açıkladı.' },
    { id: 'neumann', ist: 's07', kisi: 'John von Neumann', yil: 1932, tekCumle: 'Measurement postulate (ölçüm postülatı): sonuç eigenvalue (özdeğer), ardından collapse (çökme).' },
    { id: 'kennard', ist: 's08', kisi: 'Earle H. Kennard', yil: 1927, tekCumle: 'Belirsizlik bağıntısını kesin eşitsizlik olarak türetti: σ_x σ_p ≥ ħ/2.' },
    { id: 'bloch', ist: 's09', kisi: 'Felix Bloch', yil: 1928, tekCumle: 'Periodic potential (periyodik potansiyel) içinde çözüm e^(ikx) çarpı periyodik u(x): Bloch theorem (Bloch teoremi).' },
    { id: 'kronig', ist: 's09', kisi: 'Kronig ve Penney', yil: 1931, tekCumle: 'Tekrar eden bariyer modeliyle energy bands (enerji bantları) ve bandgap (yasak aralık) gösterdiler.' },
    { id: 'dirac', ist: 's10', kisi: 'Paul Dirac', yil: 1926, tekCumle: 'Fermi-Dirac statistics (Fermi-Dirac istatistiği)ni Fermi\'den bağımsız türetti.' },
    { id: 'shockley', ist: 's10', kisi: 'William Shockley', yil: 1948, tekCumle: 'p-n junction (p-n eklem) kuramı ve junction transistor (eklem transistörü) fikri.' }
  ];
})();
