/* 87-data-hesap.js · Hesap çalıştayı (Calculation workshop) verisi + okuma API'si.
 * Ekler: Q.data.hesap (dizi) ve Q.hesap {liste(), gorev(id), istasyonSonu(sNN), konular, konuAd(k)}.
 * Görev: {id, istasyon:'s01'..'s10', istasyonSonu:bool, konu, baslik (EN), soru (EN, sınav tarzı), veriler:[string],
 *   adimlar:[{baslik, metin, formul, kod?, adimSoru?}], sonuc:{deger, birim, metin}, sinavNotu, zorluk:1..3, tip:'sinav'|'alistirma'}
 * adimSoru: {soru, sayiCevap:{deger, birim}, tolerans} VEYA {soru, secenekler:[{t, dogru}]} (adımı açmadan önce ara cevap).
 * Yazım: ^{üst} ve _{alt} işaretleri arayüzde sup/sub olur. Tüm sayılar oyun/test/hesap-dogrula.py ile bağımsız doğrulanır.
 * Sabitler: ħ²/2mₑ = 0,0381 eV·nm²; π²ħ²/2mₑ = 0,3760 eV·nm²; hc = 1239,84 eV·nm; k = 5,123·√E[eV] nm^{-1}. */
(function(){
  'use strict';
  var root = (typeof window !== 'undefined') ? window : globalThis;
  var Q = root.Q = root.Q || {};
  Q.data = Q.data || {};
  var L = Q.data.hesap = [];

  var KONU = {
    atom: 'Atoms per cell (hücre başına atom sayısı)',
    packing: 'Packing fraction (doluluk oranı)',
    miller: 'Miller indices & d-spacing (Miller indisleri, düzlem aralığı)',
    foton: 'Photon energy & photoelectric effect (foton enerjisi, fotoelektrik)',
    bohr: 'Bohr model (Bohr modeli)',
    debroglie: 'de Broglie wavelength (de Broglie dalga boyu)',
    kuyu: 'Infinite well (sonsuz kuyu)',
    olcum: 'Measurement & expectation value (ölçüm, beklenen değer)',
    belirsizlik: 'Uncertainty principle (belirsizlik ilkesi)',
    basamak: 'Potential step (basamak potansiyeli)',
    tunel: 'Barrier tunnelling (bariyer tünelleme)',
    bant: 'Bandgap & photon (yasak enerji aralığı, foton)',
    fermi: 'Fermi-Dirac distribution (Fermi-Dirac dağılımı)',
    np: 'Carrier concentration (taşıyıcı yoğunluğu, np = n_{i}²)',
    drift: 'Drift (sürüklenme)'
  };

  function N(soru, deger, birim){ return { soru: soru, sayiCevap: { deger: deger, birim: birim || '' }, tolerans: 0.02 }; }
  function C(soru, dogru, yanlislar){
    var s = [{ t: dogru, dogru: true }];
    yanlislar.forEach(function(y){ s.push({ t: y, dogru: false }); });
    return { soru: soru, secenekler: s };
  }
  function S(baslik, metin, formul, adimSoru, kod){
    var o = { baslik: baslik, metin: metin, formul: formul || '' };
    if (adimSoru) o.adimSoru = adimSoru;
    if (kod) o.kod = kod;
    return o;
  }
  function G(id, istasyon, sonu, konu, tip, zorluk, baslik, soru, veriler, adimlar, sonuc, sinavNotu){
    L.push({ id: id, istasyon: istasyon, istasyonSonu: !!sonu, konu: konu, tip: tip, zorluk: zorluk, baslik: baslik, soru: soru,
      veriler: veriler, adimlar: adimlar, sonuc: sonuc, sinavNotu: sinavNotu });
  }

  /* ================= s01 · Kristal yapı ================= */
  G('atom-fcc', 's01', true, 'atom', 'alistirma', 1, 'Atoms in an FCC unit cell',
    'An FCC conventional unit cell has atoms at the 8 corners and at the centres of the 6 faces. How many atoms belong to one conventional cell?',
    ['Corner atom: shared by 8 cells', 'Face-centre atom: shared by 2 cells'],
    [S('Köşe atomları', 'Bir köşe atomu 8 hücrenin ortak noktasıdır; hücreye yalnızca 1/8\'i düşer. 8 köşe toplam kaç atom eder?', '8 × 1/8', N('Köşelerden gelen toplam atom sayısı?', 1, 'atom')),
     S('Yüz merkezleri', 'Yüz merkezindeki atom iki hücre tarafından paylaşılır (1/2). 6 yüz toplam kaç atom eder?', '6 × 1/2', N('Yüzlerden gelen toplam atom sayısı?', 3, 'atom')),
     S('Toplam', 'İkisini topla. Karşılaştırma için: sc = 8·(1/8) = 1, bcc = 8·(1/8) + 1 = 2, diamond = fcc 4 + hücre içi 4 = 8.', 'N = 8·(1/8) + 6·(1/2) = 1 + 3 = 4')],
    { deger: 4, birim: 'atom/hücre', metin: 'N = 4 atoms per conventional cell' },
    'Köşe = 1/8, yüz = 1/2, hücre içi = 1. "14 atom" demek (tüm noktaları tam saymak) en sık puan kaybı. Hücre başına atom sayısı doluluk oranı ve yoğunluk hesabının ilk adımıdır.');

  G('si-yogunluk', 's01', true, 'atom', 'alistirma', 2, 'Atomic density of silicon',
    'Silicon has the diamond structure with a cubic conventional cell of side a = 0.543 nm containing 8 atoms. Calculate the atomic density in units of 10^{22} cm^{-3}.',
    ['a = 0,543 nm', 'Atoms per cell = 8 (diamond)', '1 nm = 10^{-7} cm'],
    [S('Hücre başına atom', 'Elmas yapı = fcc kafes + 2 atomlu baz: 4 × 2 = 8 atom.', 'N = 8', N('Hücre başına kaç atom?', 8, 'atom')),
     S('Hücre hacmi', 'Önce a\'yı cm\'ye çevir: 0,543 nm = 0,543×10^{-7} cm. Sonra küpünü al ve 10^{-22} cm³ biriminde yaz.', 'V = a³ = (0,543×10^{-7} cm)³', N('V = a³ kaç ×10^{-22} cm³?', 1.601, '×10^{-22} cm³')),
     S('Yoğunluk', 'Yoğunluk = atom sayısı / hacim.', 'n = 8 / 1,601×10^{-22} cm³ = 4,997×10^{22} cm^{-3}')],
    { deger: 4.997, birim: '×10^{22} cm^{-3}', metin: 'n ≈ 5.0×10^{22} atoms/cm³' },
    'Birim hatası klasik tuzak: nm → cm için 10^{-7}, nm → m için 10^{-9}. Sonucun cm^{-3} cinsinden ~5×10^{22} çıkması katılar için beklenen mertebedir.');

  /* ================= s02 · Kafes, Miller ================= */
  G('pack-fcc', 's02', true, 'packing', 'sinav', 2, 'Packing fraction of FCC',
    'Derive the packing fraction of an FCC lattice of identical hard spheres that touch their nearest neighbours.',
    ['FCC: 4 atoms per cell', 'Nearest neighbours touch along the face diagonal'],
    [S('Hücre başına atom', 'fcc için köşe + yüz katkısı toplam kaç atomdur?', 'N = 4', N('Hücre başına atom sayısı?', 4, 'atom')),
     S('Yarıçap ve kafes sabiti', 'fcc\'de atomlar yüz köşegeni boyunca temas eder: köşegen uzunluğu a√2 ve 4 yarıçapa eşittir.', '4r = a√2  →  r = a√2/4', N('r/a oranı?', 0.3536, '')),
     S('Doluluk oranı', 'Küre hacimleri toplamı / hücre hacmi.', 'f = 4·(4/3)πr³ / a³ = π√2/6 ≈ 0,7405')],
    { deger: 0.7405, birim: '(birimsiz)', metin: 'f = π√2/6 ≈ 0.74 (74%)' },
    'Temas yönünü doğru seç: sc kenar (2r = a), bcc cisim köşegeni (4r = a√3), fcc yüz köşegeni (4r = a√2). Cevabı hem kesirli hem sayısal yaz.');

  G('pack-bcc', 's02', false, 'packing', 'sinav', 2, 'Packing fraction of BCC',
    'Derive the packing fraction of a BCC lattice of identical touching hard spheres.',
    ['BCC: 2 atoms per cell', 'Nearest neighbours touch along the body diagonal'],
    [S('Hücre başına atom', 'Köşeler 8×1/8 = 1, merkez 1.', 'N = 2', N('Hücre başına atom sayısı?', 2, 'atom')),
     S('Yarıçap ve kafes sabiti', 'bcc\'de temas cisim köşegeni boyunca: uzunluğu a√3 ve 4 yarıçap.', '4r = a√3  →  r = a√3/4', N('r/a oranı?', 0.4330, '')),
     S('Doluluk oranı', 'Küre hacimleri toplamı / hücre hacmi.', 'f = 2·(4/3)πr³ / a³ = π√3/8 ≈ 0,680')],
    { deger: 0.6802, birim: '(birimsiz)', metin: 'f = π√3/8 ≈ 0.68 (68%)' },
    'sc 0,52 < bcc 0,68 < fcc 0,74 sıralamasını bil. Cisim köşegeni a√3, yüz köşegeni a√2: karıştırmak puan kaybettirir.');

  G('miller-326', 's02', true, 'miller', 'sinav', 2, 'Miller indices from intercepts and d_hkl',
    'A plane in a cubic crystal (silicon, a = 0.543 nm) intercepts the x, y and z axes at 2a, 3a and a. Determine its Miller indices and calculate the interplanar spacing d.',
    ['Intercepts: 2a, 3a, 1a', 'a = 0,543 nm', 'Cubic: d = a / √(h²+k²+l²)'],
    [S('Kesişimlerin tersi', 'Kesişimleri a biriminde yaz (2, 3, 1), tersini al (1/2, 1/3, 1), sonra en küçük ortak paydayla çarpıp tam sayılara çevir.', '(1/2, 1/3, 1) × 6 = (3, 2, 6)', N('Ortak payda (kesirleri tam sayı yapan en küçük sayı)?', 6, '')),
     S('Miller indisleri', 'Sonuç parantez içinde, virgülsüz yazılır. (hkl) = (326). Kesişim ∞ olsaydı indis 0 olurdu; negatif kesişimde indisin üstüne çizgi (bar) gelir.', '(hkl) = (3 2 6)', N('h² + k² + l² = ?', 49, '')),
     S('Düzlem aralığı', 'Kübik kristalde aralık formülünü uygula.', 'd = a / √49 = 0,543 nm / 7 = 0,0776 nm')],
    { deger: 0.07757, birim: 'nm', metin: '(326), d = a/7 ≈ 0.0776 nm' },
    'Önce ters al, sonra tam sayıya çevir (sıra ters olursa (236) bulunur). d formülü yalnızca kübikte geçerlidir; indisler zaten sadeleşmiş olmalı.');

  G('miller-210', 's02', false, 'miller', 'alistirma', 1, 'Plane parallel to an axis',
    'A plane intercepts the x and y axes at a and 2a and is parallel to the z axis (a = 0.5 nm, cubic crystal). Determine its Miller indices and the interplanar spacing d.',
    ['Intercepts: a, 2a, ∞', 'a = 0,5 nm'],
    [S('Ters al', 'z eksenine paralel düzlem: kesişim ∞, tersi 0. Terslerin: 1, 1/2, 0. 2 ile çarp.', '(1, 1/2, 0) × 2 = (2, 1, 0)', N('h² + k² + l² = ?', 5, '')),
     S('Aralık', 'Kübik formül.', 'd = a/√5 = 0,5 / 2,236 = 0,2236 nm')],
    { deger: 0.2236, birim: 'nm', metin: '(210), d ≈ 0.224 nm' },
    'Paralel eksen = ∞ kesişim = 0 indis. 0 yazmayı unutma, (21) eksik bir cevaptır.');

  /* ================= s03 · Foton, fotoelektrik ================= */
  G('foton-400', 's03', false, 'foton', 'alistirma', 1, 'Photon energy from wavelength',
    'Calculate the energy (in eV) of a photon of wavelength 400 nm.',
    ['λ = 400 nm', 'hc = 1239,84 eV·nm'],
    [S('Pratik formül', 'E = hf = hc/λ. hc = 1239,84 eV·nm olduğundan dalga boyunu nm olarak yazınca enerji doğrudan eV çıkar.', 'E[eV] = 1239,84 / λ[nm]', C('Dalga boyu azalırsa foton enerjisi?', 'artar', ['azalır', 'değişmez'])),
     S('Sayı', '1239,84 / 400:', 'E = 1239,84/400 = 3,10 eV')],
    { deger: 3.0996, birim: 'eV', metin: 'E ≈ 3.10 eV' },
    'λ nm ise 1240/λ kullan. Joule ile uğraşmak gereksiz (h = 6,626×10^{-34} J·s, 1 eV = 1,602×10^{-19} J).');

  G('foto-cu', 's03', true, 'foton', 'sinav', 2, 'Photoelectric effect: kinetic energy',
    'Light of wavelength 250 nm illuminates a copper surface (work function φ = 4.7 eV). Calculate the maximum kinetic energy of the emitted electrons in eV.',
    ['λ = 250 nm', 'φ = 4,7 eV'],
    [S('Foton enerjisi', 'E = 1239,84/λ.', 'E = 1239,84/250', N('Foton enerjisi kaç eV?', 4.959, 'eV')),
     S('Emisyon olur mu?', 'Elektron çıkması için foton enerjisi iş fonksiyonunu geçmeli.', 'hf > φ ?', C('4,96 eV ile 4,7 eV karşılaştırması?', 'hf > φ: elektron çıkar', ['hf < φ: elektron çıkmaz', 'Şiddete bağlı'])),
     S('Maksimum kinetik enerji', 'Einstein bağıntısı.', 'K_{max} = hf − φ = 4,959 − 4,7 = 0,259 eV')],
    { deger: 0.2594, birim: 'eV', metin: 'K_max ≈ 0.26 eV' },
    'Işık şiddeti K_max\'ı değiştirmez, yalnızca akım sayısını; frekans (enerji) K_max\'ı belirler. Sonucun eV olduğunu yaz.');

  G('foto-esik', 's03', true, 'foton', 'sinav', 2, 'Threshold wavelength',
    'The work function of sodium is φ = 2.3 eV. Calculate the threshold (cut-off) wavelength for the photoelectric effect.',
    ['φ = 2,3 eV'],
    [S('Eşik koşulu', 'Eşikte foton enerjisi tam olarak iş fonksiyonuna eşittir ve K = 0.', 'hf_{0} = φ  →  hc/λ_{0} = φ', C('λ > λ_{0} olan ışıkla?', 'Elektron çıkmaz', ['Elektron çıkar, yavaş', 'Şiddet yeterliyse çıkar'])),
     S('Dalga boyu', 'λ_{0} = hc/φ.', 'λ_{0} = 1239,84 / 2,3 = 539 nm')],
    { deger: 539.06, birim: 'nm', metin: 'λ_0 ≈ 539 nm (green)' },
    'Eşik altında şiddeti ne kadar artırırsan artır emisyon olmaz: klasik dalga teorisinin açıklayamadığı sonuç.');

  /* ================= s04 · Bohr, de Broglie ================= */
  G('bohr-gecis', 's04', true, 'bohr', 'sinav', 2, 'Hydrogen transition wavelength',
    'Calculate the wavelength of the photon emitted when a hydrogen atom makes the transition from n = 3 to n = 2.',
    ['E_{n} = −13,6 eV / n²', 'hc = 1239,84 eV·nm'],
    [S('Enerji farkı', 'E_{n} = −13,6/n² olduğundan iki seviye arasındaki fark:', 'ΔE = 13,6·(1/2² − 1/3²) = 13,6·(5/36)', N('ΔE kaç eV?', 1.8897, 'eV')),
     S('Dalga boyu', 'Yayılan foton ΔE kadar enerji taşır.', 'λ = hc/ΔE = 1239,84 / 1,89 = 656 nm')],
    { deger: 656.1, birim: 'nm', metin: 'λ ≈ 656 nm (red, H-alpha)' },
    '1/n₂² − 1/n₁² sırasını doğru kur (alt seviye önce). Sonuç görünür bölgede (Balmer, n = 2\'ye geçişler) çıkmalı.');

  G('bohr-iyon', 's04', false, 'bohr', 'alistirma', 1, 'Ionization from an excited state',
    'Calculate the energy needed to ionize a hydrogen atom that is in the n = 2 state.',
    ['E_{n} = −13,6 eV / n²'],
    [S('Seviye enerjisi', 'E_{2} = −13,6/4.', 'E_{2} = −3,40 eV', C('İyonlaşma enerjisi neye eşit?', 'E_{∞} − E_{2} = 0 − E_{2}', ['E_{2}', '13,6 eV her zaman'])),
     S('Sonuç', 'Elektronu serbest bırakmak için seviyenin mutlak değeri kadar enerji gerekir.', 'E_{iyon} = 0 − (−3,40) = 3,40 eV')],
    { deger: 3.4014, birim: 'eV', metin: 'E_ion = 3.40 eV' },
    '13,6 eV temel haldeki (n = 1) iyonlaşma enerjisidir; uyarılmış halde 13,6/n².');

  G('debroglie-100', 's04', true, 'debroglie', 'sinav', 1, 'de Broglie wavelength of an electron',
    'Calculate the de Broglie wavelength of an electron with kinetic energy 100 eV.',
    ['E = 100 eV', 'm = 9,109×10^{-31} kg'],
    [S('Dalga sayısı', 'k = √(2mE)/ħ elektron için pratik biçimde 5,123·√E[eV] nm^{-1}\'dir.', 'k = 5,123·√100 nm^{-1}', N('k kaç nm^{-1}?', 51.23, 'nm^{-1}')),
     S('Dalga boyu', 'λ = 2π/k = h/p.', 'λ = 2π/51,23 = 0,1226 nm   (kısa yol: λ = 1,2264/√E[eV] nm)')],
    { deger: 0.12264, birim: 'nm', metin: 'λ ≈ 0.123 nm (≈ atomic spacing)' },
    'Kinetik enerji eV ise p = √(2mE) kullan; foton formülü (hc/E) elektrona uygulanmaz. λ kristal aralığı mertebesinde: elektron kırınımı mümkün.');

  G('debroglie-lam', 's04', false, 'debroglie', 'alistirma', 1, 'Energy from de Broglie wavelength',
    'An electron has a de Broglie wavelength of 0.5 nm. Calculate its kinetic energy in eV.',
    ['λ = 0,5 nm'],
    [S('Pratik bağıntı', 'λ = 1,2264/√E ise E = (1,2264/λ)² = 1,504/λ² (λ nm, E eV).', 'E = h²/(2mλ²) = 1,504 / λ²[nm²] eV', C('λ yarıya inerse E?', '4 katına çıkar', ['2 katına çıkar', 'yarıya iner'])),
     S('Sayı', '', 'E = 1,504 / 0,25 = 6,02 eV')],
    { deger: 6.0165, birim: 'eV', metin: 'E ≈ 6.0 eV' },
    'E ∝ 1/λ²: kare almayı unutma.');

  /* ================= s05 · Sonsuz kuyu, SINAV SORU 5 ================= */
  G('q5-bolgeler', 's05', true, 'kuyu', 'sinav', 3, 'Exam Question 5: infinite well with a 9 eV barrier (setting up)',
    'For the given potential below, calculate the wave function and the allowed energies in electron-volts (eV). The potential is an infinite square well between x = 0 and x = 50 nm (infinite walls at x = 0 and x = 50 nm). Inside the well, between x = 20 nm and x = 30 nm, there is a barrier (box) of height 9 eV. Consider 0 < E < 9 eV. [Key quantity asked here: κd of the barrier.]',
    ['L = 50 nm', 'Barrier: 20 nm < x < 30 nm, thickness d = 10 nm', 'V_{0} = 9 eV (E < V_{0})', 'k = 5,123√E nm^{-1}, κ = 5,123√(V_{0}−E) nm^{-1}'],
    [S('1) Bölgelere ayır', 'Potansiyel parçalı sabit; her parçada Schrödinger denklemi sabit katsayılıdır. Bölge I: 0 < x < 20 nm (V = 0). Bölge II: 20 < x < 30 nm (V = 9 eV). Bölge III: 30 < x < 50 nm (V = 0). x = 0 ve 50 nm\'de sonsuz duvar: ψ = 0.', 'I: V = 0   II: V = V_{0} = 9 eV   III: V = 0', N('Kaç bölge gerekir (duvarların dışı hariç)?', 3, '')),
     S('2) Her bölgede çözüm', 'V = 0 bölgelerinde −ħ²ψ\'\'/2m = Eψ salınımlı çözüm verir. Engelde E < V₀ olduğu için ψ\'\' = κ²ψ, yani gerçek üstel. k = √(2mE)/ħ, κ = √(2m(V_{0}−E))/ħ.', 'ψ_{I} = A sin kx + A\' cos kx,   ψ_{II} = B e^{κx} + C e^{−κx},   ψ_{III} = D sin k(L−x) + D\' cos k(L−x)', C('Engel içinde (E < V₀) çözüm hangisi?', 'Gerçek üstel (e^{±κx}) veya cosh/sinh', ['sin ve cos (salınım)', 'Sabit ψ = c', 'Sadece e^{ikx}'])),
     S('3) Sınır ve süreklilik koşulları', 'Duvarlarda ψ(0) = 0 → cos terimi (A\') yok; ψ(L) = 0 → D\' = 0. x = 20 ve x = 30 nm\'de ψ ve ψ\' sürekli (V sonlu sıçrama yapar, ψ\' sürekli kalır). 4 bilinmeyen A, B, C, D; 4 denklem; homojen sistem: determinant = 0 öz değer koşulunu verir.', 'ψ(0) = 0, ψ(50) = 0;  ψ, ψ\' sürekli: x = 20, x = 30', C('4 homojen denklemden izinli E nasıl çıkar?', 'Katsayı determinantı = 0', ['A = 1 seçerek her E çözüm olur', 'Normalizasyon koşulundan', 'ψ\'\' = 0 koşulundan'])),
     S('4) Öz değer koşulu ve engelin ne kadar geçirgen olduğu', 'Engel orta noktaya (x = 25 nm) göre simetrik, bu yüzden çözümler çift ya da tek. w = 20 nm kuyu genişliği, d = 10 nm engel kalınlığı. Çift: k cot(kw) = −κ tanh(κd/2); tek: k cot(kw) = −κ coth(κd/2). E ≪ V₀ için κ ≈ 5,123√9 = 15,37 nm^{-1}; κd boyutsuz geçirgenlik ölçüsüdür.', 'k cot(kw) = −κ tanh(κd/2)   (çift),   k cot(kw) = −κ coth(κd/2)   (tek)', N('κ (E ≪ V₀) kaç nm^{-1}?', 15.37, 'nm^{-1}'))],
    { deger: 153.7, birim: '(birimsiz, κd)', metin: 'κd ≈ 154 ≫ 1: the barrier is practically impenetrable (e^{-κd} ~ 10^{-67}); see the next tasks for the energies' },
    'Bölgeleri, çözüm biçimlerini ve 4 sınır koşulunu (iki duvar + iki süreklilik) açıkça yazmak puanın büyük kısmıdır. κd ≫ 1 sonucunu söylersen iki bağımsız 20 nm\'lik kuyu yaklaşımını gerekçelendirmiş olursun.');

  G('q5-bos-kuyu', 's05', true, 'kuyu', 'sinav', 2, 'Exam Question 5, part A: the well without the barrier',
    'Ignore the 9 eV barrier first. An electron is in an infinite square well of width L = 50 nm. Write the normalized wave function ψ_n(x) and calculate the ground-state energy E_1 in meV.',
    ['L = 50 nm', 'E_{n} = n²π²ħ²/2mL² = 0,3760·n²/L²[nm] eV'],
    [S('Dalga fonksiyonu', 'ψ(0) = ψ(L) = 0 sınır koşulları sin kx çözümünü verir: kL = nπ. Normalizasyon: A²·L/2 = 1.', 'ψ_{n}(x) = √(2/L)·sin(nπx/L),   n = 1, 2, 3, …', N('A = √(2/L) kaç nm^{-1/2}?', 0.2, 'nm^{-1/2}')),
     S('İzinli enerjiler', 'E = ħ²k²/2m ve k = nπ/L. Elektron için π²ħ²/2m = 0,3760 eV·nm². n = 0 yok (ψ ≡ 0): sıfır noktası enerjisi sınır koşulundan gelir.', 'E_{n} = n²π²ħ²/(2mL²) = 0,3760·n² / L²[nm²] eV', N('L² kaç nm²?', 2500, 'nm²')),
     S('Sayı', 'L = 50 nm: E₁ = 0,3760/2500 = 1,504×10^{-4} eV = 0,1504 meV. E₂ = 4E₁ = 0,6016 meV, E₃ = 9E₁ = 1,354 meV.', 'E_{1} = 0,1504 meV,  E_{2} = 0,6016 meV,  E_{3} = 1,354 meV')],
    { deger: 0.1504, birim: 'meV', metin: 'E_1 ≈ 0.150 meV (before adding the barrier)' },
    'Önemli: bu sayılar engelsiz kuyunundur. Engel varken seviyeler değişir (sonraki görevler). Birim: nm/eV formülünde L nm, sonuç eV; meV için ×1000.');

  G('q5-perturbasyon', 's05', false, 'kuyu', 'sinav', 3, 'Exam Question 5, part B: barrier as first-order perturbation (does it work?)',
    'Treat the 9 eV barrier (20 nm < x < 30 nm) as a perturbation of the 50 nm well. Calculate the first-order shift ΔE_1 = ⟨ψ_1|V|ψ_1⟩ in eV, and decide whether perturbation theory is valid here.',
    ['ψ_{1} = √(2/L) sin(πx/L), L = 50 nm', 'V = 9 eV for 20 < x < 30 nm', 'E_{1}^{(0)} = 1,5×10^{-4} eV'],
    [S('Engeldeki olasılık', 'ΔE₁ = V₀ × (elektronun engel bölgesinde bulunma olasılığı). Düzgün yayılmış olsaydı olasılık d/L olurdu.', 'ΔE_{1} = V_{0}∫_{20}^{30} |ψ_{1}|² dx', N('d/L kaç?', 0.2, '')),
     S('İntegrali hesapla', 'sin² integralini al: ∫(2/L)sin²(πx/L)dx = x/L − sin(2πx/L)/(2π). Sınırlar 20 ve 30 nm. n = 1 durumu orta bölgede yoğun olduğu için olasılık 0,2\'den büyüktür.', 'P = d/L − [sin(2π·30/50) − sin(2π·20/50)]/(2π) = 0,2 + 0,1871 = 0,3871,   ΔE_{1} = 9 × 0,3871 = 3,484 eV'),
     S('Geçerlilik', 'Pertürbasyon teorisi için |ΔE| seviye aralığından çok küçük olmalı. Burada ΔE₁ = 3,48 eV, E_{1}^{(0)} = 1,5×10^{-4} eV, E₂−E₁ = 4,5×10^{-4} eV: ΔE yaklaşık 10^{4} kat büyük. Yaklaşım geçersiz. (Varyasyonel ilkeye göre bu sayı gerçek E₁ için bir üst sınırdır, ama işe yaramaz.)', '|ΔE_{1}| ≫ E_{2}^{(0)} − E_{1}^{(0)}  →  pertürbasyon geçersiz', C('Sonuç?', 'Pertürbasyon yaklaşımı bu engel için geçersiz; tam çözüm gerekir', ['Seviyeler 3,48 eV yukarı kayar', 'Engel etkisizdir', 'Yaklaşım çok iyi']))],
    { deger: 3.484, birim: 'eV', metin: 'ΔE_1^(1) = 3.48 eV ≫ E_1^(0) ~ 10^{-4} eV: first-order perturbation theory is NOT valid here' },
    'Bu hesap yalnızca "neden pertürbasyon değil de tam çözüm" demek için yapılır. Sınavda yaklaşım kullandığında geçerlilik koşulunu mutlaka yaz.');

  G('q5-sayisal', 's05', false, 'kuyu', 'sinav', 3, 'Exam Question 5, part C: allowed energies with the barrier (exact numerical solution)',
    'Find the lowest allowed energy (in meV) of the electron in the 50 nm well with the 9 eV, 10 nm thick barrier between x = 20 nm and x = 30 nm, and give the wave function in each region.',
    ['w = 20 nm (each side well)', 'd = 10 nm, V_{0} = 9 eV', 'κd ≈ 154 (previous task)'],
    [S('Geçirgen olmayan engel limiti', 'κd ≈ 154 olduğundan engel pratik olarak geçirimsizdir: sistem iki ayrı 20 nm\'lik sonsuz kuyu gibi davranır. E_{n} = 0,3760·n²/w² eV.', 'E_{n} ≈ 0,3760·n² / 20² eV;   E_{1} ≈ 0,9401 meV', N('E₁ (20 nm kuyu) kaç meV?', 0.9401, 'meV')),
     S('Çift katlılık', 'Her seviye iki kez vardır (elektron sol ya da sağ kuyuda); çift/tek birleşimleri ψ_{±} = (ψ_{L} ± ψ_{R})/√2 aralarındaki fark e^{−κd} ~ 10^{-67} mertebesinde, yani sıfır. ψ_{L} = √(2/w) sin(nπx/w) (0 < x < 20 nm); ψ_{R}(x) = ψ_{L}(50 − x) (30 < x < 50 nm); engelde ψ ~ e^{−κ(x−20)} ile sönümlenir.', 'ψ_{±}(x) = [ψ_{L}(x) ± ψ_{R}(x)] / √2'),
     S('Tam sayısal çözüm (Python)', 'Çift parite koşulunu k cot(kw) + κ tanh(κd/2) = 0 sayısal çözersek (brentq) E₁ = 0,9340 meV, E₂ = 3,7360 meV, E₃ = 8,4059 meV bulunur. Sonsuz kuyu değerinden %0,6 düşüktür: dalga fonksiyonu engelin içine 1/κ = 0,065 nm sızar, etkin genişlik w + 1/κ = 20,065 nm olur (0,3760/20,065² = 0,9340 meV).', 'E_{1} = 0,9340 meV,  E_{2} = 3,736 meV,  E_{3} = 8,406 meV  (her biri ikili)',
       null, 'from scipy.optimize import brentq\nimport numpy as np\nC = 0.0381          # hbar^2/2m, eV nm^2\nV0, d, w = 9.0, 10.0, 20.0\nk  = lambda E: np.sqrt(E/C)\nkp = lambda E: np.sqrt((V0-E)/C)\nf  = lambda E: k(E)/np.tan(k(E)*w) + kp(E)*np.tanh(kp(E)*d/2)\nE0 = (np.pi/w)**2*C            # n = 1, 20 nm well\nprint(brentq(f, 0.9*E0, E0*(1-1e-9))*1e3, "meV")')],
    { deger: 0.934, birim: 'meV', metin: 'E_1 ≈ 0.934 meV (two-fold degenerate); in the impenetrable-barrier limit 0.940 meV' },
    'Sınavda yaklaşımı açıkça yaz: "engel kalın (κd ≈ 154), iki bağımsız 20 nm kuyu". Tam öz değer koşulunu da yazarsan tam puan. Engelsiz 50 nm sonucunu (0,150 meV) engel varken vermek yanlış olur.');

  G('q5-basit', 's05', false, 'kuyu', 'alistirma', 2, 'Exam Question 5, simplified version: constant potential instead of the barrier',
    'Simplified version: replace the barrier by a constant potential V = 9 eV everywhere inside the 50 nm well (infinite walls at x = 0 and 50 nm). Calculate E_2 − E_1 in meV and write ψ_n.',
    ['V = 9 eV (sabit)', 'L = 50 nm'],
    [S('Sabit potansiyel', 'ψ\'\' + (2m/ħ²)(E − V₀)ψ = 0: aynı denklem, E yerine E − V₀. Sınır koşulları aynı, bu yüzden ψ_n değişmez; enerjiler V₀ kadar yukarı kayar.', 'ψ_{n} = √(2/L) sin(nπx/L),   E_{n} = V_{0} + n²π²ħ²/(2mL²)', C('Sabit potansiyel ψ_n\'i değiştirir mi?', 'Hayır, yalnızca E_n kayar', ['Evet, ψ_n kayar', 'Evet, ψ_n sönümlenir'])),
     S('Fark', 'Sabit V₀ farkta sadeleşir: E₂ − E₁ = 3E_{1}^{(0)} = 3 × 0,1504 meV.', 'E_{2} − E_{1} = 3π²ħ²/(2mL²) = 0,4512 meV')],
    { deger: 0.4512, birim: 'meV', metin: 'E_2 − E_1 = 0.451 meV (E_1 = 9 eV + 0.150 meV)' },
    'Sabit bir potansiyel enerji ölçeğinin sıfırını kaydırır, fiziği değiştirmez. Engel yalnızca bir bölgede olunca bu doğru değildir (bkz. diğer görevler).');

  G('kuyu-norm', 's05', false, 'kuyu', 'alistirma', 1, 'Normalization constant',
    'An electron is in the ground state of an infinite well of width L = 5 nm, ψ = A sin(πx/L). Find the normalization constant A.',
    ['L = 5 nm'],
    [S('Normalizasyon', 'Toplam olasılık 1 olmalı. ∫₀^L sin²(πx/L) dx = L/2.', '∫_{0}^{L} |ψ|² dx = A²·L/2 = 1', N('∫ sin² dx = L/2 kaç nm?', 2.5, 'nm')),
     S('A', '', 'A = √(2/L) = √(2/5 nm) = 0,632 nm^{-1/2}')],
    { deger: 0.6325, birim: 'nm^{-1/2}', metin: 'A = √(2/L) ≈ 0.632 nm^{-1/2}' },
    'Normalizasyon sabitinin birimi uzunluk^{-1/2}. Sınav: sadece "A = √(2/L)" yazmak yeterli, ama integrali göster.');

  G('kuyu-foton', 's05', false, 'kuyu', 'alistirma', 2, 'Photon emitted from a well transition',
    'An electron in an infinite well of width L = 2 nm makes the transition n = 2 → n = 1. Calculate the wavelength of the emitted photon in μm.',
    ['L = 2 nm', 'E_{n} = 0,3760 n²/L²[nm] eV'],
    [S('Temel seviye', 'E₁ = 0,3760/4.', 'E_{1} = 0,0940 eV', N('E₁ kaç eV?', 0.094, 'eV')),
     S('Geçiş', 'E₂ − E₁ = 3E₁ = 0,2820 eV. λ = 1239,84/ΔE nm = 4396 nm.', 'λ = hc/(3E_{1}) = 1239,84 / 0,2820 nm = 4,40 μm')],
    { deger: 4.396, birim: 'μm', metin: 'λ ≈ 4.4 μm (infrared)' },
    'E₂ − E₁ = (4 − 1)E₁ = 3E₁ ve nm → μm dönüşümü (÷1000).');

  /* ================= s06 · Basamak (SINAV SORU 6), tünelleme ================= */
  G('q6-e-gt', 's06', true, 'basamak', 'sinav', 3, 'Exam Question 6: potential step, E > V_0',
    'Calculate the wave function and the reflection coefficient of the electron for the given potential: V = 0 for x < 0 and V = V_0 for x > 0 (potential step); the electron arrives from the left. Case E > V_0: take E = 10 eV and V_0 = 5 eV.',
    ['V = 0 (x < 0), V = V_{0} = 5 eV (x > 0)', 'E = 10 eV', 'k = 5,123√E nm^{-1}'],
    [S('1) Bölge I (x < 0)', 'Gelen + yansıyan dalga. k₁ = √(2mE)/ħ.', 'ψ_{I}(x) = e^{ik_{1}x} + r e^{−ik_{1}x},   k_{1} = 5,123·√10 = 16,20 nm^{-1}', N('k₁ kaç nm^{-1}?', 16.20, 'nm^{-1}')),
     S('2) Bölge II (x > 0)', 'Sağdan gelen dalga yok, yalnızca geçen dalga. k₂ = √(2m(E−V₀))/ħ.', 'ψ_{II}(x) = t e^{ik_{2}x},   k_{2} = 5,123·√5 = 11,46 nm^{-1}', N('k₂ kaç nm^{-1}?', 11.456, 'nm^{-1}')),
     S('3) x = 0\'da süreklilik', 'ψ ve ψ\' sürekli: 1 + r = t ve k₁(1 − r) = k₂ t. İki denklemden r ve t.', 'r = (k_{1} − k_{2})/(k_{1} + k_{2}),   t = 2k_{1}/(k_{1} + k_{2})', C('Neden ψ\' de sürekli?', 'V sonlu sıçrama yapar; ψ\'\' sonlu kalır', ['V sonsuz olduğu için', 'Normalizasyon gereği', 'Enerji korunumu gereği'])),
     S('4) Yansıma katsayısı', 'R yansıyan olasılık akısı oranı = |r|². T = (k₂/k₁)|t|² ve R + T = 1.', 'R = [(k_{1} − k_{2})/(k_{1} + k_{2})]² = (4,745/27,66)² = 0,0294,   T = 1 − R = 0,971')],
    { deger: 0.02944, birim: '(birimsiz)', metin: 'R ≈ 0.029 (2.9%), T ≈ 0.971' },
    'E > V₀ iken bile R ≠ 0 (klasikte 0): dalga doğası. T için |t|² değil k₂/k₁ çarpanını kullan. Genel: R yalnızca E/V₀ oranına bağlıdır (E = 2V₀ için R = 0,0294).');

  G('q6-e-lt', 's06', true, 'basamak', 'sinav', 3, 'Exam Question 6: potential step, E < V_0',
    'Calculate the wave function and the reflection coefficient of the electron for the potential step (V = 0 for x < 0, V = V_0 for x > 0), for E = 3 eV and V_0 = 5 eV (E < V_0). Also find the penetration depth of the wave into the step region.',
    ['E = 3 eV', 'V_{0} = 5 eV', 'κ = 5,123√(V_{0} − E) nm^{-1}'],
    [S('1) Bölge II\'de çözüm', 'E < V₀: ψ\'\' = κ²ψ. e^{+κx} x → ∞\'da patlar, fiziksel değil; geriye sönümlenen çözüm kalır.', 'ψ_{II} = t e^{−κx},   κ = 5,123·√2 = 7,245 nm^{-1}', N('κ kaç nm^{-1}?', 7.245, 'nm^{-1}')),
     S('2) Süreklilik ve R', 'Bölge I: ψ_{I} = e^{ik₁x} + r e^{−ik₁x}. x = 0: 1 + r = t, ik₁(1 − r) = −κt. Buradan r karmaşık ve |r| = 1: tam yansıma. |t|² = 4k₁²/(k₁² + κ²) = 4E/V₀.', 'r = (k_{1} − iκ)/(k_{1} + iκ),   |r|² = R = 1,   |t|² = 4E/V_{0}', N('|t|² = 4E/V₀ kaç?', 2.4, '')),
     S('3) Sızma derinliği', 'Olasılık yoğunluğu e^{−2κx} ile söner. Dalga fonksiyonunun 1/e\'ye düştüğü uzaklık δ = 1/κ. R = 1 olduğu halde ψ ≠ 0 (akı yok, yoğunluk var).', 'δ = 1/κ = 1/7,245 nm^{-1} = 0,138 nm')],
    { deger: 0.1380, birim: 'nm', metin: 'R = 1 (total reflection); ψ_II = t e^{-κx}, δ = 1/κ ≈ 0.138 nm' },
    'E < V₀: R = 1, T = 0; ama ψ bölge II\'de sıfır değildir (üstel azalır). "Parçacık basamağın içine hiç giremez" demek klasik ve yanlış.');

  G('tunel-1nm', 's06', false, 'tunel', 'sinav', 2, 'Tunnelling probability through a barrier',
    'An electron with E = 1 eV is incident on a rectangular barrier of height V_0 = 4 eV and width a = 1 nm. Estimate the transmission probability using T ≈ e^{-2κa}.',
    ['E = 1 eV', 'V_{0} = 4 eV', 'a = 1 nm'],
    [S('Sönüm sabiti', 'κ = √(2m(V₀ − E))/ħ = 5,123·√(V₀ − E) nm^{-1}.', 'κ = 5,123·√3 = 8,874 nm^{-1}', N('κ kaç nm^{-1}?', 8.874, 'nm^{-1}')),
     S('Geçirgenlik', 'Kalın bariyer yaklaşımı: 2κa = 17,75. Cevabı 1,96e-8 biçiminde girebilirsin.', 'T ≈ e^{−2κa} = e^{−17,75} ≈ 2,0×10^{-8}')],
    { deger: 1.961e-8, birim: '(birimsiz, 1.96e-8 biçiminde gir)', metin: 'T ≈ 2×10^{-8} (exact formula: ≈ 6×10^{-8}; same order of magnitude)' },
    'Üstel çok duyarlıdır: a ikiye katlanırsa T karesi alınır. Tam formüldeki öndeki çarpan (burada ≈ 3) mertebeyi değiştirmez; sınavda yaklaşım yazdığını belirt.');

  /* ================= s07 · Ölçüm ================= */
  G('olc-p', 's07', true, 'olcum', 'sinav', 2, 'Measurement probabilities',
    'A particle in an infinite well is in the state ψ = A(φ_1 + 2φ_2), where φ_1 and φ_2 are normalized energy eigenstates. Find A and the probability of measuring E_2.',
    ['ψ = A(φ_{1} + 2φ_{2})', '⟨φ_{i}|φ_{j}⟩ = δ_{ij}'],
    [S('Normalizasyon', 'φ\'ler ortonormal: ⟨ψ|ψ⟩ = A²(1 + 4) = 1.', 'A²(1² + 2²) = 1  →  A = 1/√5 = 0,447', N('A kaç?', 0.4472, '')),
     S('Olasılık', 'ψ = Σ cₙφₙ ise E_n bulma olasılığı |cₙ|². Burada c₂ = 2A.', 'P(E_{2}) = |2A|² = 4/5 = 0,8,   P(E_{1}) = 1/5')],
    { deger: 0.8, birim: '(birimsiz)', metin: 'A = 1/√5; P(E_2) = 0.8' },
    'Ölçümden sonra ψ ölçülen özdurumuna çöker (E₂ bulunduysa ψ = φ₂); hemen tekrar ölçersen aynı değer çıkar. Schrödinger denklemi çökmez, çökme ölçümle olur.');

  G('olc-E', 's07', true, 'olcum', 'sinav', 2, 'Expectation value of energy',
    'An electron in an infinite well of width L = 2 nm is in the state ψ = (√3/2)φ_1 + (1/2)φ_2. Calculate the expectation value ⟨E⟩ in eV.',
    ['L = 2 nm', 'E_{n} = 0,0940·n² eV', '|c_{1}|² = 3/4, |c_{2}|² = 1/4'],
    [S('Seviyeler', 'E₁ = 0,3760/L² eV, E₂ = 4E₁.', 'E_{1} = 0,0940 eV,  E_{2} = 0,376 eV', N('E₁ kaç eV?', 0.094, 'eV')),
     S('Beklenen değer', '⟨E⟩ = Σ|cₙ|²Eₙ.', '⟨E⟩ = (3/4)(0,0940) + (1/4)(0,376) = 1,75·E_{1} = 0,1645 eV')],
    { deger: 0.1645, birim: 'eV', metin: '⟨E⟩ ≈ 0.165 eV' },
    '⟨E⟩ ölçümde bulacağın bir değer değildir: yalnızca 0,094 ya da 0,376 eV çıkar. Ortalama ağırlıkları |c|² ile hesapla.');

  /* ================= s08 · Belirsizlik ================= */
  G('bel-v', 's08', true, 'belirsizlik', 'sinav', 2, 'Uncertainty principle: velocity of a confined electron',
    'An electron is confined to a region of size Δx = 0.1 nm (atomic size). Using the uncertainty principle, calculate the minimum uncertainty in its momentum and in its velocity (give Δv in km/s).',
    ['Δx = 0,1 nm', 'ħ = 1,055×10^{-34} J·s', 'm = 9,109×10^{-31} kg'],
    [S('Momentum belirsizliği', 'ΔxΔp ≥ ħ/2. Δx = 0,1 nm = 10^{-10} m.', 'Δp ≥ ħ/(2Δx) = 5,273×10^{-25} kg·m/s', N('Δp kaç ×10^{-25} kg·m/s?', 5.273, '×10^{-25} kg·m/s')),
     S('Hız belirsizliği', 'Δv = Δp/m.', 'Δv ≥ 5,273×10^{-25} / 9,109×10^{-31} = 5,79×10^{5} m/s = 579 km/s')],
    { deger: 578.8, birim: 'km/s', metin: 'Δp ≥ 5.27×10^{-25} kg·m/s, Δv ≥ 579 km/s' },
    'ħ/2 mi ħ mi? Sınavda ΔxΔp ≥ ħ/2 yaz. Birim: nm → m. Belirsizlik ölçü aletinin kusuru değil, dalga doğasının sonucudur.');

  G('bel-t', 's08', true, 'belirsizlik', 'alistirma', 2, 'Energy-time uncertainty',
    'An excited atomic state has a lifetime of Δt = 1 ns. Estimate the minimum energy uncertainty (natural linewidth) of the emitted line in μeV.',
    ['Δt = 1 ns', 'ħ = 6,582×10^{-16} eV·s'],
    [S('İlke', 'Enerji ve zaman eşlenik değişkenler gibi davranır.', 'ΔE·Δt ≥ ħ/2', C('Kısa yaşam süresi → çizgi genişliği?', 'daha geniş', ['daha dar', 'değişmez'])),
     S('Sayı', 'ħ = 6,582×10^{-16} eV·s kullan.', 'ΔE ≥ ħ/(2Δt) = 6,582×10^{-16}/(2×10^{-9}) = 3,29×10^{-7} eV = 0,329 μeV')],
    { deger: 0.3291, birim: 'μeV', metin: 'ΔE ≈ 0.33 μeV' },
    'ΔE–Δt için Δt "ölçüm süresi/ömür" anlamında; dikkatli ifade et. Birim dönüşümü: 10^{-7} eV = 0,1 μeV.');

  /* ================= s09 · Bantlar ================= */
  G('bant-si', 's09', true, 'bant', 'sinav', 1, 'Absorption edge of silicon',
    'Silicon has a bandgap E_g = 1.12 eV. Calculate the longest wavelength of light that can create an electron-hole pair.',
    ['E_{g} = 1,12 eV', 'hc = 1239,84 eV·nm'],
    [S('Koşul', 'Elektronu valence band (değerlik bandı) → conduction band (iletim bandı) taşımak için hf ≥ E_g. Sınır durumda eşitlik.', 'hf ≥ E_{g}  →  λ ≤ hc/E_{g}', C('Daha uzun dalga boyu (E < E_g)?', 'Soğurulmaz (Si saydam)', ['Daha iyi soğurulur', 'Çift e-h üretir'])),
     S('Sayı', '', 'λ_{max} = 1239,84 / 1,12 = 1107 nm  (yakın kızılötesi)')],
    { deger: 1107.0, birim: 'nm', metin: 'λ_max ≈ 1.11 μm' },
    'Eg\'den küçük enerjili foton soğurulmaz. Soğurma eşiği = bandgap, fotoelektrik eşik ile aynı mantık.');

  G('bant-gaas', 's09', true, 'bant', 'alistirma', 1, 'GaAs bandgap and photon wavelength',
    'GaAs has a bandgap E_g = 1.42 eV. Calculate the wavelength of the photon emitted when an electron recombines across the gap, and decide whether a 1000 nm photon can be absorbed.',
    ['E_{g} = 1,42 eV'],
    [S('Yayılan foton', 'Rekombinasyonda yaklaşık E_g enerjili foton yayılır.', 'λ = 1239,84 / 1,42 = 873 nm'),
     S('1000 nm foton', '1000 nm → E = 1,24 eV < 1,42 eV.', 'E_{foton} = 1,24 eV < E_{g}', C('1000 nm foton GaAs\'ta?', 'Soğurulmaz', ['Soğurulur', 'Yalnızca ısıtırsa soğurulur']))],
    { deger: 873.1, birim: 'nm', metin: 'λ ≈ 873 nm; a 1000 nm photon is not absorbed' },
    'Foton enerjisi E_g\'den küçükse bantlar arası geçiş yok. GaAs doğrudan bant aralığı: verimli ışık yayar.');

  /* ================= s10 · Fermi, taşıyıcı, drift ================= */
  G('fd-100meV', 's10', true, 'fermi', 'sinav', 2, 'Fermi-Dirac occupation',
    'Calculate the probability that a state 0.1 eV above the Fermi level E_F is occupied at T = 300 K (k_B = 8.617×10^{-5} eV/K).',
    ['E − E_{F} = 0,1 eV', 'T = 300 K', 'k_{B} = 8,617×10^{-5} eV/K'],
    [S('kT', '', 'kT = 8,617×10^{-5} × 300 = 0,02585 eV = 25,85 meV', N('kT kaç meV?', 25.85, 'meV')),
     S('Üstel', '(E − E_F)/kT hesapla.', '(E − E_{F})/kT = 0,1/0,02585 = 3,868', N('(E−E_F)/kT kaç?', 3.868, '')),
     S('f(E)', 'Fermi-Dirac dağılımı.', 'f = 1/(1 + e^{3,868}) = 1/(1 + 47,9) = 0,0205')],
    { deger: 0.02047, birim: '(birimsiz)', metin: 'f ≈ 0.0205 (2%)' },
    'Üstelin işaretine dikkat: E > E_F için f < 1/2. E − E_F ≫ kT iken f ≈ e^{−(E−E_F)/kT} (Boltzmann).');

  G('fd-orta', 's10', false, 'fermi', 'alistirma', 1, 'Occupation at the Fermi level',
    'What is the Fermi-Dirac occupation probability exactly at E = E_F, for any temperature T > 0?',
    ['E = E_{F}'],
    [S('Yerine koy', 'E − E_F = 0 → e^0 = 1.', 'f(E_{F}) = 1/(1 + e^{0}) = 1/2', C('Sıcaklığa bağlı mı?', 'Hayır, T > 0 için hep 1/2', ['Evet, T ile artar', 'Evet, T ile azalır'])),
     S('Yorum', 'T → 0 K\'de f basamak fonksiyonuna döner: E < E_F için 1, E > E_F için 0. T > 0\'da basamak kT genişliğinde yuvarlanır, ama E_F noktasından hep 1/2 ile geçer.', 'T → 0:  f = 1 (E < E_{F}),  f = 0 (E > E_{F})')],
    { deger: 0.5, birim: '(birimsiz)', metin: 'f(E_F) = 1/2' },
    'Fermi seviyesi "%50 dolu olma ihtimali olan seviye" (orada durum olması gerekmez).');

  G('np-ni', 's10', false, 'np', 'sinav', 2, 'Mass-action law',
    'Silicon at 300 K has intrinsic carrier concentration n_i = 1.5×10^{10} cm^{-3}. It is doped with N_D = 10^{16} cm^{-3} donors (fully ionized). Calculate the hole concentration p in cm^{-3}.',
    ['n_{i} = 1,5×10^{10} cm^{-3}', 'N_{D} = 10^{16} cm^{-3}'],
    [S('Elektron yoğunluğu', 'N_D ≫ n_i olduğundan n ≈ N_D.', 'n ≈ N_{D} = 10^{16} cm^{-3}', C('Katkılı yarıiletken n tipi mi p tipi mi?', 'n tipi (donör)', ['p tipi (akseptör)', 'özgün (intrinsic)'])),
     S('Delik yoğunluğu', 'Kütle etkisi yasası np = n_i².', 'p = n_{i}²/n = (1,5×10^{10})² / 10^{16} = 2,25×10^{4} cm^{-3}')],
    { deger: 22500, birim: 'cm^{-3} (2.25e4 biçiminde gir)', metin: 'p ≈ 2.25×10^{4} cm^{-3}' },
    'Çoğunluk taşıyıcı (n) katkıdan, azınlık (p) np = n_i²\'den. Birimler cm^{-3}, n_i değerinin karesi alınırken 10^{20} → 10^{20}×2,25.');

  G('drift-v', 's10', false, 'drift', 'alistirma', 1, 'Drift velocity',
    'The electron mobility in silicon is μ_n = 1350 cm²/(V·s). Calculate the drift velocity in an electric field E = 100 V/cm, in m/s.',
    ['μ_{n} = 1350 cm²/Vs', 'E = 100 V/cm'],
    [S('Sürüklenme hızı', 'v_d = μE. Önce cm/s bul: 1350 × 100 = 1,35×10^{5} cm/s.', 'v_{d} = μ_{n}E = 1350 × 100 = 1,35×10^{5} cm/s'),
     S('Birim', '1 m = 100 cm.', 'v_{d} = 1,35×10^{3} m/s = 1350 m/s')],
    { deger: 1350, birim: 'm/s', metin: 'v_d = 1.35×10^5 cm/s = 1350 m/s' },
    'cm ve m karışmasın: μ cm²/Vs, E V/cm verilirse çarpım doğrudan cm/s.');

  G('drift-J', 's10', true, 'drift', 'sinav', 2, 'Drift current density',
    'Silicon is doped n-type with n = 10^{16} cm^{-3} (μ_n = 1350 cm²/Vs). Calculate the drift current density J for E = 10 V/cm, in A/cm².',
    ['n = 10^{16} cm^{-3}', 'μ_{n} = 1350 cm²/Vs', 'E = 10 V/cm', 'q = 1,602×10^{-19} C'],
    [S('İletkenlik', 'σ = qnμ_n.', 'σ = 1,602×10^{-19} × 10^{16} × 1350 = 2,163 S/cm', N('σ kaç S/cm?', 2.163, 'S/cm')),
     S('Akım yoğunluğu', 'J = σE.', 'J = qnμ_{n}E = 2,163 × 10 = 21,6 A/cm²')],
    { deger: 21.63, birim: 'A/cm²', metin: 'J ≈ 21.6 A/cm²' },
    'Birim kontrolü: C·cm^{-3}·cm²/(V·s)·V/cm = A/cm². Tek taşıyıcı baskınsa (n ≫ p) delik terimi ihmal edilir.');

  /* ================= okuma API'si ================= */
  Q.hesap = {
    konular: KONU,
    konuAd: function(k){ return KONU[k] || k; },
    liste: function(){ return L.slice(); },
    gorev: function(id){ for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i]; return null; },
    /* İstasyon sonu görevleri (sırası veri sırasıdır). */
    istasyonSonu: function(st){ return L.filter(function(g){ return g.istasyon === st && g.istasyonSonu; }); },
    istasyon: function(st){ return L.filter(function(g){ return g.istasyon === st; }); }
  };
})();
