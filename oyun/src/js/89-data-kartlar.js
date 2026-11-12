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
      p3: 'Sezgi: polycrystal (çok kristal) içinde her grain (tane) farklı yönde dizilidir. Grain boundary (tane sınırı) electron (elektron) saçar ve defect (kusur) merkezi gibi davranır; bu yüzden aygıt için tek kristal istenir. Yanılgı: wafer\'ın bir fabrikada atom atom "inşa edildiği" sanılır; aslında büyük bir tek kristal külçe çekilir ve dilimlenir.',
      sinav: [
        'CZ: seed crystal (tohum kristal) melt (eriyik) içine değer, döndürülerek yavaşça çekilir; sonuç single crystal (tek kristal) ingot (külçe).',
        'Neden tek kristal: grain boundary (tane sınırı) yok; electron saçılması ve defect (kusur) etkisi azalır.',
        'Silisyumun melting point (erime noktası) yaklaşık 1414 °C.'
      ]
    },
    miller: {
      p1: 'William Hallowes Miller, Cambridge\'de çalışan Galli bir mineralogist (mineralog) ve crystallographer (kristalograf) idi. 1839\'da yayımladığı kristalografi kitabında crystal plane (kristal düzlemi) adlandırmak için bugün Miller indices (Miller indisleri) dediğimiz sistemi kullandı.',
      p2: 'Miller indices (Miller indisleri), bir düzlemin lattice (kafes) içindeki yönelimini üç küçük integer (tam sayı) ile yazmayı sağlar: (hkl). Yarıiletkende wafer yüzeyi bu notasyonla belirtilir, örneğin (100) ve (111). Farklı düzlemlerde atom yoğunluğu farklıdır; bu, etching (aşındırma), oxide (oksit) büyümesi ve surface (yüzey) özelliklerini etkiler.',
      p3: 'Yanılgı: indisler kesişimin kendisi değildir. Önce intercepts (kesişimler) lattice constant (kafes sabiti) biriminde yazılır, sonra reciprocal (ters) alınır, sonra en küçük integer (tam sayı) oranına getirilir. Düzlem eksene paralelse intercept (kesişim) sonsuzdur ve indis 0 olur.',
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
      p3: 'Sezgi: günlük cisimler için momentum p çok büyüktür, bu yüzden λ = h/p fark edilemeyecek kadar küçüktür ve dalga davranışı görülmez. Dalga boyu momentuma ters orantılıdır: daha hızlı (daha yüksek p) parçacık, daha kısa λ.',
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
      p3: 'Sezgi: dolu bir band (bant)ta boş seviye kalmadığı için electron\'lar enerji kazanıp hareket edemez; bu yüzden tamamen dolu band net akım taşımaz.',
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
    }
  };
})();
