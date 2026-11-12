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
     S('Sayı', '', 'λ_{max} = 1239,84 / 1,12 = 1107 nm  (yakın kızılötesi)', N('λ_max kaç nm? (hc/E_g)', 1107, 'nm'))],
    { deger: 1107.0, birim: 'nm', metin: 'λ_max ≈ 1.11 μm' },
    'Eg\'den küçük enerjili foton soğurulmaz. Soğurma eşiği = bandgap, fotoelektrik eşik ile aynı mantık.');

  G('bant-gaas', 's09', true, 'bant', 'alistirma', 1, 'GaAs bandgap and photon wavelength',
    'GaAs has a bandgap E_g = 1.42 eV. Calculate the wavelength of the photon emitted when an electron recombines across the gap, and decide whether a 1000 nm photon can be absorbed.',
    ['E_{g} = 1,42 eV'],
    [S('Yayılan foton', 'Rekombinasyonda yaklaşık E_g enerjili foton yayılır.', 'λ = 1239,84 / 1,42 = 873 nm', N('Yayılan fotonun dalga boyu kaç nm?', 873.1, 'nm')),
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

  /* ================= Örnek çözüm (worked example) =================
   * Her görevin FARKLI SAYILARLA tam çözülmüş küçük kardeşi. Oyuncu görevi görmeden önce bunu okur (86-obs-hesap.js, 98-tekrar-hesap.js).
   * ornek: {baslik, soru (EN, kısa), yontem:[3-5 madde: "Yöntem: kural"], veriler:[string],
   *   adimlar:[{baslik, metin, formul, sonuc, say?}] (görevin adımlarıyla aynı sırada: "Örnekteki N. adıma bak"), sonuc:{metin, deger, birim}, ipucu}
   * say: adımın sayısal sonucu, sonuc.deger: nihai sayı (ikisi de oyun/test/hesap-dogrula.py ile bağımsız doğrulanır). */
  function X(id, baslik, soru, yontem, veriler, adimlar, sonucMetin, deger, birim, ipucu){
    var g = null; for (var i = 0; i < L.length; i++) if (L[i].id === id) g = L[i];
    if (!g) throw new Error('ornek: görev yok ' + id);
    g.ornek = { baslik: baslik, soru: soru, yontem: yontem, veriler: veriler,
      adimlar: adimlar.map(function(a){ var o = { baslik: a[0], metin: a[1], formul: a[2], sonuc: a[3] }; if (a[4] != null) o.say = a[4]; return o; }),
      sonuc: { metin: sonucMetin, deger: deger, birim: birim }, ipucu: ipucu };
  }

  /* ---- s01 ---- */
  X('atom-fcc', 'Worked example: atoms in a BCC unit cell', 'How many atoms belong to one BCC conventional cell (atoms at the 8 corners and one in the centre)?',
    ['Atomun hücrede nerede durduğuna bak: köşe, yüz, kenar ya da hücrenin içi.', 'Her konumun payını yaz: köşe = 1/8, yüz merkezi = 1/2, hücre içi = 1.', 'Konum sayısı × payı çarp.', 'Hepsini topla: bu, hücre başına atom sayısıdır.'],
    ['8 corner atoms (each shared by 8 cells)', '1 atom at the body centre (inside the cell)'],
    [['Köşe atomları', 'Köşe atomu 8 hücreye ortaktır, payı 1/8. Köşe sayısı 8.', '8 × 1/8 = 1', '1 atom', 1],
     ['Merkez atomu', 'Cisim merkezindeki atom yalnızca bu hücreye aittir, payı 1.', '1 × 1 = 1', '1 atom', 1],
     ['Toplam', 'İki katkıyı topla.', 'N = 1 + 1 = 2', 'N = 2 atom/hücre', 2]],
    'BCC: N = 2 atoms per conventional cell', 2, 'atom', 'Bu örnekte yüz atomu yok. Senin görevinde yüz merkezleri var: onların payı 1/2.');

  X('si-yogunluk', 'Worked example: atomic density of germanium', 'Germanium (diamond structure, 8 atoms per cell) has a = 0.566 nm. Find the atomic density in units of 10^{22} cm^{-3}.',
    ['Hücre başına atom sayısı N\'yi yaz (elmas yapı: 8).', 'Kenarı cm\'ye çevir: 1 nm = 10^{-7} cm.', 'Hacmi bul: V = a³ (cm³).', 'Yoğunluk n = N / V; sonucu 10^{22} cm^{-3} biriminde yaz.'],
    ['a = 0,566 nm', 'N = 8 atoms per cell', '1 nm = 10^{-7} cm'],
    [['Hücre başına atom', 'Elmas yapı: 8 atom.', 'N = 8', 'N = 8', 8],
     ['Hücre hacmi', 'a = 0,566×10^{-7} cm. Küpünü al: 0,566³ = 0,1813.', 'V = (0,566×10^{-7})³ = 1,813×10^{-22} cm³', 'V = 1,813×10^{-22} cm³', 1.8132],
     ['Yoğunluk', 'Atom sayısı / hacim.', 'n = 8 / 1,813×10^{-22} = 4,41×10^{22} cm^{-3}', 'n ≈ 4,41×10^{22} cm^{-3}', 4.412]],
    'n ≈ 4.41×10^{22} atoms/cm³', 4.412, '×10^{22} cm^{-3}', 'nm → cm için 10^{-7}. Katılarda sonuç hep 10^{22} mertebesinde çıkar.');

  /* ---- s02 ---- */
  X('pack-fcc', 'Worked example: packing fraction of simple cubic', 'Find the packing fraction of a simple cubic (sc) lattice of identical touching hard spheres.',
    ['Hücre başına atom sayısı N\'yi bul.', 'Hangi atomlar birbirine değiyor? Temas çizgisini a ve r ile yaz (sc: kenar boyunca 2r = a).', 'r/a oranını çıkar.', 'f = N · (4/3)πr³ / a³ ile doluluk oranını hesapla.'],
    ['sc: 8 corner atoms', 'Atoms touch along the cube edge'],
    [['Hücre başına atom', '8 köşe × 1/8.', 'N = 8 × 1/8 = 1', 'N = 1', 1],
     ['Yarıçap ve kafes sabiti', 'sc\'de komşu atomlar kenar boyunca değer: kenar uzunluğu iki yarıçap.', '2r = a  →  r/a = 0,5', 'r/a = 0,5', 0.5],
     ['Doluluk oranı', 'Küre hacmi / hücre hacmi.', 'f = 1·(4/3)π(0,5)³ = π/6 = 0,5236', 'f ≈ 0,524', 0.5236]],
    'sc: f = π/6 ≈ 0.52', 0.5236, '(birimsiz)', 'Temas yönü değişince r/a değişir: kenar (sc) 0,5; yüz köşegeni (fcc) a√2/4; cisim köşegeni (bcc) a√3/4.');

  X('pack-bcc', 'Worked example: packing fraction of diamond', 'Find the packing fraction of the diamond lattice (8 atoms per cell); nearest neighbours touch along a quarter of the body diagonal.',
    ['Hücre başına atom sayısını yaz (elmas: 8).', 'Temas çizgisini bul: elmasta komşu uzaklığı cisim köşegeninin 1/4\'ü, yani 2r = a√3/4.', 'r/a oranını çıkar.', 'f = N · (4/3)πr³ / a³.'],
    ['N = 8 atoms per cell', 'Touching distance 2r = a√3/4'],
    [['Hücre başına atom', 'fcc 4 + hücre içi 4.', 'N = 8', 'N = 8', 8],
     ['Yarıçap ve kafes sabiti', 'Komşu uzaklığı a√3/4 ve bu uzaklık 2r\'ye eşit.', '2r = a√3/4  →  r/a = √3/8 = 0,2165', 'r/a = 0,2165', 0.2165],
     ['Doluluk oranı', 'Küre hacimleri toplamı / hücre hacmi.', 'f = 8·(4/3)π(0,2165)³ = π√3/16 = 0,340', 'f ≈ 0,340', 0.3401]],
    'Diamond: f = π√3/16 ≈ 0.34', 0.3401, '(birimsiz)', 'Elmas yapı seyrektir (0,34); fcc\'nin yarısından az. Köşegen çarpanı (√3/4) komşu uzaklığını verir.');

  X('miller-326', 'Worked example: Miller indices and d_hkl', 'A plane in a cubic crystal (a = 0.4 nm) intercepts the axes at a, 2a and 2a. Find (hkl) and the interplanar spacing d.',
    ['Kesişimleri a biriminde yaz (örnek: 1, 2, 2).', 'Her birinin tersini al (1, 1/2, 1/2).', 'En küçük ortak payda ile çarpıp tam sayıya çevir (ortak çarpan kalmaz).', 'Parantez içinde, virgülsüz yaz: (hkl).', 'Kübikte d = a / √(h²+k²+l²).'],
    ['Intercepts: 1a, 2a, 2a', 'a = 0,4 nm'],
    [['Ters al, tam sayıya çevir', 'Kesişimler 1, 2, 2: tersleri 1, 1/2, 1/2. Ortak payda 2: hepsini 2 ile çarp.', '(1, 1/2, 1/2) × 2 = (2, 1, 1)', 'Ortak payda = 2', 2],
     ['Miller indisleri', 'Sonucu parantez içinde yaz: (211). Sonra h²+k²+l² hesapla.', '(hkl) = (2 1 1),   h²+k²+l² = 4+1+1 = 6', 'h²+k²+l² = 6', 6],
     ['Düzlem aralığı', 'Kübik formül.', 'd = a/√6 = 0,4 / 2,449 = 0,1633 nm', 'd ≈ 0,163 nm', 0.1633]],
    '(211), d ≈ 0.163 nm', 0.1633, 'nm', 'Sıra: önce ters, sonra tam sayı. Kesişimleri doğrudan indis yaparsan (122) gibi yanlış bir sonuç çıkar.');

  X('miller-210', 'Worked example: plane parallel to two axes', 'A plane intercepts the x axis at 2a and is parallel to the y and z axes (a = 0.4 nm, cubic). Find (hkl) and d.',
    ['Kesişimleri a biriminde yaz; paralel olan eksende kesişim ∞ olur.', 'Tersini al: 1/∞ = 0.', 'Ortak payda ile çarp, tam sayı yap.', 'Kübikte d = a / √(h²+k²+l²).'],
    ['Intercepts: 2a, ∞, ∞', 'a = 0,4 nm'],
    [['Ters al', 'Kesişimler 2, ∞, ∞. Tersleri 1/2, 0, 0. Ortak payda 2 ile çarp: sıfırlar sıfır kalır.', '(1/2, 0, 0) × 2 = (1, 0, 0)', '(hkl) = (100); h²+k²+l² = 1', 1],
     ['Aralık', 'Kübik formül.', 'd = a/√1 = 0,4 nm', 'd = 0,4 nm', 0.4]],
    '(100), d = 0.4 nm', 0.4, 'nm', '∞ kesişim → 0 indis. Sıfırı yazmayı unutma: (1) değil (100).');

  /* ---- s03 ---- */
  X('foton-400', 'Worked example: photon energy', 'Calculate the energy (in eV) of a photon of wavelength 620 nm.',
    ['Dalga boyunu nm olarak yaz.', 'Pratik formülü kullan: E[eV] = 1239,84 / λ[nm].', 'Sonucu eV olarak yaz ve mantığını kontrol et (dalga boyu büyüdükçe enerji düşer).'],
    ['λ = 620 nm', 'hc = 1239,84 eV·nm'],
    [['Pratik formül', 'hc = 1239,84 eV·nm olduğu için λ nm iken enerji doğrudan eV çıkar.', 'E[eV] = 1239,84 / λ[nm]', 'Formül hazır'],
     ['Sayı', 'Böl.', 'E = 1239,84 / 620 = 2,00 eV', 'E = 2,00 eV', 2.0]],
    'E = 2.00 eV (orange-red light)', 2.0, 'eV', '620 nm turuncu-kırmızı ışıktır; görünür ışık yaklaşık 1,7-3,1 eV aralığındadır.');

  X('foto-cu', 'Worked example: photoelectric effect on zinc', 'Light of wavelength 200 nm illuminates a zinc surface (work function φ = 4.3 eV). Find the maximum kinetic energy of the emitted electrons.',
    ['Foton enerjisini bul: E = 1239,84 / λ[nm].', 'Karşılaştır: hf > φ ise elektron çıkar, değilse çıkmaz.', 'K_{max} = hf − φ.', 'Sonucu eV yaz.'],
    ['λ = 200 nm', 'φ = 4,3 eV'],
    [['Foton enerjisi', 'E = 1239,84/λ.', 'E = 1239,84 / 200 = 6,20 eV', 'E = 6,20 eV', 6.1992],
     ['Emisyon olur mu?', '6,20 eV, 4,3 eV\'den büyük mü?', 'hf = 6,20 > φ = 4,3 → elektron çıkar', 'Evet, çıkar'],
     ['Maksimum kinetik enerji', 'Einstein bağıntısı.', 'K_{max} = 6,20 − 4,3 = 1,90 eV', 'K_{max} ≈ 1,90 eV', 1.8992]],
    'K_max ≈ 1.90 eV', 1.8992, 'eV', 'Önce emisyon var mı diye bak; hf < φ ise K_max sorusu anlamsızdır.');

  X('foto-esik', 'Worked example: threshold wavelength of caesium', 'The work function of caesium is φ = 1.9 eV. Calculate the threshold wavelength.',
    ['Eşikte foton enerjisi iş fonksiyonuna eşittir: hf₀ = φ.', 'λ₀ = 1239,84 / φ[eV] (nm).', 'Eşikten uzun dalga boyunda elektron çıkmaz.'],
    ['φ = 1,9 eV'],
    [['Eşik koşulu', 'Eşikte K = 0 olur.', 'hc/λ_{0} = φ', 'Koşul yazıldı'],
     ['Dalga boyu', 'Çöz.', 'λ_{0} = 1239,84 / 1,9 = 652,5 nm', 'λ_{0} ≈ 652,5 nm', 652.55]],
    'λ_0 ≈ 652.5 nm (red)', 652.55, 'nm', 'φ küçüldükçe eşik dalga boyu uzar: sezyum görünür kırmızı ışıkla bile elektron verir.');

  /* ---- s04 ---- */
  X('bohr-gecis', 'Worked example: hydrogen transition n = 4 → 2', 'Calculate the wavelength of the photon emitted when a hydrogen atom goes from n = 4 to n = 2.',
    ['Enerji farkını yaz: ΔE = 13,6 · (1/n_{alt}² − 1/n_{üst}²) eV.', 'Sayıyı hesapla.', 'Dalga boyu: λ = 1239,84 / ΔE (nm).', 'Alt ve üst seviyenin sırasını karıştırma.'],
    ['E_{n} = −13,6 eV / n²', 'n = 4 → 2'],
    [['Enerji farkı', 'Alt seviye n = 2, üst seviye n = 4.', 'ΔE = 13,6·(1/4 − 1/16) = 13,6·(3/16) = 2,55 eV', 'ΔE = 2,55 eV', 2.55],
     ['Dalga boyu', 'Foton ΔE kadar enerji taşır.', 'λ = 1239,84 / 2,55 = 486 nm', 'λ ≈ 486 nm (H-beta, mavi-yeşil)', 486.2]],
    'λ ≈ 486 nm (blue-green, H-beta)', 486.2, 'nm', '1/n_{alt}² önce gelir; n = 2\'ye inen çizgiler görünür bölgededir (Balmer serisi).');

  X('bohr-iyon', 'Worked example: ionization from n = 3', 'Calculate the energy needed to ionize a hydrogen atom that is in the n = 3 state.',
    ['Seviye enerjisini yaz: E_{n} = −13,6 / n².', 'İyonlaşma: elektron E = 0\'a çıkarılır.', 'E_{iyon} = 0 − E_{n} = |E_{n}|.'],
    ['E_{n} = −13,6 eV / n²', 'n = 3'],
    [['Seviye enerjisi', 'E₃ = −13,6/9.', 'E_{3} = −1,51 eV', 'E_{3} = −1,51 eV', -1.5111],
     ['Sonuç', 'Elektronu serbest bırakmak için mutlak değer kadar enerji gerekir.', 'E_{iyon} = 0 − (−1,51) = 1,51 eV', 'E_{iyon} ≈ 1,51 eV', 1.5111]],
    'E_ion = 1.51 eV', 1.5111, 'eV', 'Üst seviyeler gevşek bağlıdır: n büyüdükçe iyonlaşma enerjisi 13,6/n² ile azalır.');

  X('debroglie-100', 'Worked example: electron at 25 eV', 'Calculate the de Broglie wavelength of an electron with kinetic energy 25 eV.',
    ['Kinetik enerjiyi eV olarak yaz.', 'Dalga sayısını bul: k = 5,123·√E[eV] nm^{-1}.', 'Dalga boyunu bul: λ = 2π / k.', 'Kısa yol: λ = 1,2264 / √E[eV] nm.'],
    ['E = 25 eV'],
    [['Dalga sayısı', 'Kök al ve 5,123 ile çarp.', 'k = 5,123·√25 = 25,62 nm^{-1}', 'k = 25,62 nm^{-1}', 25.616],
     ['Dalga boyu', 'λ = 2π/k.', 'λ = 6,283 / 25,62 = 0,2453 nm', 'λ ≈ 0,245 nm', 0.2453]],
    'λ ≈ 0.245 nm', 0.2453, 'nm', 'Kontrol: 1,2264/√25 = 0,2453 nm. Enerji 4 katına çıkarsa λ yarıya iner.');

  X('debroglie-lam', 'Worked example: energy from wavelength', 'An electron has a de Broglie wavelength of 0.2 nm. Calculate its kinetic energy in eV.',
    ['Bağıntıyı yaz: E = 1,504 / λ²  (λ nm, E eV).', 'λ\'nın karesini al.', 'Böl ve eV yaz.'],
    ['λ = 0,2 nm'],
    [['Bağıntı', 'λ = 1,2264/√E ise E = (1,2264/λ)² = 1,504/λ².', 'E = 1,504 / λ²[nm²]', 'Formül hazır'],
     ['Sayı', 'λ² = 0,04.', 'E = 1,504 / 0,04 = 37,6 eV', 'E ≈ 37,6 eV', 37.6]],
    'E ≈ 37.6 eV', 37.6, 'eV', 'Karesini unutma: λ yarıya inerse E dört katına çıkar.');

  /* ---- s05 ---- */
  X('q5-bolgeler', 'Worked example: well with a 4 eV barrier (setting up)', 'An infinite well spans x = 0 to 40 nm with a 4 eV barrier between x = 17 and 23 nm (E < 4 eV). Set up the regions and find κd of the barrier.',
    ['Potansiyeli bölgelere ayır (V sabit olan her parça bir bölge).', 'Her bölgede çözümü yaz: V = 0 → sin/cos (k); E < V₀ → e^{±κx} (κ).', 'Sınır koşulları: duvarlarda ψ = 0; ara sınırlarda ψ ve ψ\' sürekli.', 'k = 5,123√E, κ = 5,123√(V₀−E) nm^{-1}; geçirgenlik ölçüsü κd.'],
    ['L = 40 nm', 'Barrier 17 nm < x < 23 nm, d = 6 nm', 'V_{0} = 4 eV, E ≪ V_{0}'],
    [['Bölgelere ayır', 'Bölge I: 0-17 nm (V=0), bölge II: 17-23 nm (V=4 eV), bölge III: 23-40 nm (V=0).', 'I: V=0   II: V=V_{0}   III: V=0', '3 bölge', 3],
     ['Her bölgede çözüm', 'V=0 bölgelerinde salınım, engelde gerçek üstel (E < V₀).', 'ψ_{I} = A sin kx + A\' cos kx,   ψ_{II} = B e^{κx} + C e^{−κx}', 'sin/cos ve e^{±κx}'],
     ['Sınır koşulları', 'ψ(0) = ψ(40) = 0; x = 17 ve 23\'te ψ, ψ\' sürekli: 4 bilinmeyen, 4 denklem.', 'ψ(0)=0, ψ(40)=0; süreklilik x=17, x=23', '4 koşul', 4],
     ['Engelin geçirgenliği', 'E ≪ V₀ için κ = 5,123·√4 = 10,25 nm^{-1}. κd ne kadar büyükse engel o kadar geçirimsizdir.', 'κd = 10,25 × 6 = 61,5', 'κd ≈ 61,5', 61.478]],
    'κd ≈ 61.5 ≫ 1: practically impenetrable', 61.478, '(birimsiz)', 'κd ≫ 1 ise engel pratikte geçirimsizdir: iki ayrı kuyu gibi düşünebilirsin.');

  X('q5-bos-kuyu', 'Worked example: well of width 20 nm', 'An electron is in an infinite square well of width L = 20 nm. Give ψ_n and the ground-state energy E_1 in meV.',
    ['Sınır koşulları ψ(0) = ψ(L) = 0 → ψ = A sin(nπx/L).', 'Normalizasyon: A²·L/2 = 1 → A = √(2/L).', 'E_{n} = 0,3760·n² / L²[nm] eV.', 'n = 1 için hesapla ve meV\'e çevir (×1000).'],
    ['L = 20 nm', 'π²ħ²/2m = 0,3760 eV·nm²'],
    [['Dalga fonksiyonu', 'sin kx, kL = nπ; A²·L/2 = 1.', 'ψ_{n} = √(2/L) sin(nπx/L);  A = √(2/20) = 0,316 nm^{-1/2}', 'A = 0,316 nm^{-1/2}', 0.3162],
     ['İzinli enerjiler', 'L² = 400 nm².', 'E_{n} = 0,3760·n² / 400 eV', 'L² = 400 nm²', 400],
     ['Sayı', 'n = 1: 0,3760/400 = 9,40×10^{-4} eV.', 'E_{1} = 0,940 meV,  E_{2} = 3,76 meV', 'E_{1} ≈ 0,940 meV', 0.94]],
    'E_1 ≈ 0.940 meV', 0.9401, 'meV', 'E ∝ n² / L²: kuyu 2 kat genişlerse enerji 4 kat azalır.');

  X('q5-perturbasyon', 'Worked example: a weak bump as a perturbation', 'A weak bump V = 0.1 meV fills 10 nm < x < 20 nm of a 30 nm infinite well. Find ΔE_1 = ⟨ψ_1|V|ψ_1⟩ (in meV) and check if perturbation theory is valid.',
    ['ΔE₁ = V₀ × P, P = ψ₁\'in engel bölgesindeki olasılığı.', 'P = d/L − [sin(2πx₂/L) − sin(2πx₁/L)] / (2π).', 'ΔE₁\'i hesapla.', 'Geçerlilik: |ΔE₁| ≪ E₂ − E₁ olmalı.'],
    ['L = 30 nm', 'V = 0,1 meV for 10 < x < 20 nm', 'E_{1}^{(0)} = 0,418 meV'],
    [['Engeldeki olasılık', 'd/L = 10/30 = 0,3333. Sin farkı: sin(240°) − sin(120°) = −1,732.', 'P = 1/3 − (−1,732)/(2π) = 0,3333 + 0,2757 = 0,609', 'P ≈ 0,609', 0.609],
     ['Birinci mertebe kayma', 'V₀ ile çarp.', 'ΔE_{1} = 0,1 meV × 0,609 = 0,0609 meV', 'ΔE_{1} ≈ 0,061 meV', 0.0609],
     ['Geçerlilik', 'E₂ − E₁ = 3 × 0,418 = 1,25 meV. 0,061 ≪ 1,25 olduğu için yaklaşım geçerli.', '|ΔE_{1}| ≪ E_{2}^{(0)} − E_{1}^{(0)}  →  geçerli', 'Geçerli']],
    'ΔE_1 ≈ 0.061 meV ≪ 1.25 meV: perturbation theory is valid', 0.0609, 'meV', 'Bu örnekte engel zayıf, bu yüzden yaklaşım geçerli. Senin görevinde engel 9 eV: sonucu karşılaştır.');

  X('q5-sayisal', 'Worked example: two wells divided by a thick barrier', 'Two 15 nm regions are separated by an 8 nm thick, 5 eV barrier inside an infinite well. Find the lowest allowed energy in meV.',
    ['κd\'yi hesapla; ≫ 1 ise engel pratikte geçirimsizdir.', 'Geçirimsiz limit: iki ayrı kuyu, E₁ ≈ 0,3760 / w² (w = tek kuyunun genişliği).', 'Her seviye iki kat (sol/sağ kuyu).', 'Tam öz değer koşulu k cot(kw) = −κ tanh(κd/2) sayısal çözülürse E₁ biraz düşer (dalga engele sızar).'],
    ['w = 15 nm', 'd = 8 nm', 'V_{0} = 5 eV'],
    [['Geçirimsiz limit', 'κ = 5,123·√5 = 11,46 nm^{-1}; κd = 91,6 ≫ 1. Tek kuyu: E₁ = 0,3760/15².', 'E_{1} ≈ 0,3760 / 225 = 1,671 meV', 'E_{1} ≈ 1,671 meV', 1.6712],
     ['Çift katlılık', 'ψ_{±} = (ψ_L ± ψ_R)/√2; fark e^{−κd} mertebesinde, yani sıfır.', 'ψ_{±}(x) = [ψ_{L}(x) ± ψ_{R}(x)] / √2', 'İkili seviye'],
     ['Tam çözüm', 'Sızma etkin genişliği w + 1/κ = 15,087 nm yapar.', 'E_{1} = 0,3760 / 15,087² = 1,652 meV', 'E_{1} ≈ 1,652 meV', 1.652]],
    'E_1 ≈ 1.652 meV (two-fold degenerate)', 1.652, 'meV', 'Sınavda yaklaşımı açıkça yaz: "engel kalın (κd ≫ 1), iki bağımsız kuyu".');

  X('q5-basit', 'Worked example: constant potential inside a 20 nm well', 'Replace the barrier by a constant V = 4 eV everywhere inside a 20 nm well. Find E_2 − E_1 in meV and write ψ_n.',
    ['Sabit potansiyel: denklemde E yerine E − V₀ girer.', 'ψ_n değişmez, yalnızca E_n V₀ kadar kayar.', 'E_n = V₀ + 0,3760·n²/L².', 'Fark alınca V₀ sadeleşir: E₂ − E₁ = 3E₁⁽⁰⁾.'],
    ['V = 4 eV (sabit)', 'L = 20 nm'],
    [['Sabit potansiyel', 'ψ\'\' + (2m/ħ²)(E − V₀)ψ = 0: aynı denklem, aynı sınır koşulları.', 'ψ_{n} = √(2/L) sin(nπx/L),   E_{n} = V_{0} + 0,3760 n²/L²', 'ψ_n değişmez'],
     ['Fark', 'V₀ sadeleşir: E₂ − E₁ = 3 × 0,3760/400.', 'E_{2} − E_{1} = 3 × 0,940 meV = 2,82 meV', 'E_{2} − E_{1} ≈ 2,82 meV', 2.8203]],
    'E_2 − E_1 = 2.82 meV', 2.8203, 'meV', 'Sabit bir kayma fiziği değiştirmez; engel yalnızca bir bölgedeyse bu doğru değildir.');

  X('kuyu-norm', 'Worked example: normalization in an 8 nm well', 'An electron is in the ground state ψ = A sin(πx/L) of an infinite well with L = 8 nm. Find A.',
    ['Toplam olasılık 1: ∫|ψ|²dx = 1.', '∫₀^L sin²(πx/L)dx = L/2 değerini kullan.', 'A²·L/2 = 1 → A = √(2/L).'],
    ['L = 8 nm'],
    [['Normalizasyon', '∫ sin² dx = L/2 = 4 nm.', 'A²·L/2 = 1,   L/2 = 4 nm', 'L/2 = 4 nm', 4],
     ['A', 'A² = 2/L.', 'A = √(2/8 nm) = 0,5 nm^{-1/2}', 'A = 0,5 nm^{-1/2}', 0.5]],
    'A = √(2/L) = 0.5 nm^{-1/2}', 0.5, 'nm^{-1/2}', 'A\'nın birimi uzunluk^{-1/2}\'dir.');

  X('kuyu-foton', 'Worked example: photon from a 1 nm well', 'An electron in an infinite well of width L = 1 nm falls from n = 2 to n = 1. Find the photon wavelength in μm.',
    ['E₁ = 0,3760 / L²[nm] eV.', 'E₂ − E₁ = 3E₁.', 'λ = 1239,84 / ΔE (nm), sonra μm\'ye çevir (÷1000).'],
    ['L = 1 nm', 'E_{n} = 0,3760 n²/L²'],
    [['Temel seviye', 'L = 1 nm → L² = 1.', 'E_{1} = 0,3760 eV', 'E_{1} = 0,376 eV', 0.376],
     ['Geçiş', 'ΔE = 3E₁ = 1,128 eV; λ = 1239,84/1,128 = 1099 nm.', 'λ = 1239,84 / 1,128 = 1099 nm = 1,10 μm', 'λ ≈ 1,10 μm', 1.0991]],
    'λ ≈ 1.10 μm (near infrared)', 1.0991, 'μm', 'Kuyu daraldıkça enerji artar, dalga boyu kısalır.');

  /* ---- s06 ---- */
  X('q6-e-gt', 'Worked example: potential step, E = 8 eV, V_0 = 2 eV', 'An electron with E = 8 eV hits a step V = 0 (x < 0), V_0 = 2 eV (x > 0). Find the wave function and the reflection coefficient R.',
    ['Bölge I: ψ = e^{ik₁x} + r e^{−ik₁x}, k₁ = 5,123√E.', 'Bölge II: ψ = t e^{ik₂x}, k₂ = 5,123√(E−V₀).', 'x = 0\'da ψ ve ψ\' sürekli → r = (k₁−k₂)/(k₁+k₂).', 'R = |r|², T = 1 − R.'],
    ['E = 8 eV', 'V_{0} = 2 eV'],
    [['Bölge I', 'Gelen + yansıyan dalga.', 'k_{1} = 5,123·√8 = 14,49 nm^{-1}', 'k_{1} = 14,49 nm^{-1}', 14.4905],
     ['Bölge II', 'Yalnızca geçen dalga.', 'k_{2} = 5,123·√6 = 12,55 nm^{-1}', 'k_{2} = 12,55 nm^{-1}', 12.5491],
     ['Süreklilik', '1 + r = t ve k₁(1 − r) = k₂t.', 'r = (14,49 − 12,55)/(14,49 + 12,55) = 0,0718,   t = 1,0718', 'r ≈ 0,0718', 0.0718],
     ['Yansıma katsayısı', 'R = r².', 'R = 0,0718² = 0,00515,   T = 0,9948', 'R ≈ 0,0052', 0.005155]],
    'R ≈ 0.0052, T ≈ 0.995', 0.005155, '(birimsiz)', 'Basamak küçükse (V₀ ≪ E) R de küçüktür. Senin görevinde V₀ / E = 1/2: R daha büyük.');

  X('q6-e-lt', 'Worked example: potential step, E = 2 eV, V_0 = 6 eV', 'For the step V_0 = 6 eV and E = 2 eV (E < V_0), find R, |t|² and the penetration depth.',
    ['E < V₀: bölge II\'de ψ = t e^{−κx}, κ = 5,123√(V₀−E).', 'Süreklilik → |r| = 1, yani R = 1; |t|² = 4E/V₀.', 'Sızma derinliği δ = 1/κ.'],
    ['E = 2 eV', 'V_{0} = 6 eV'],
    [['Bölge II çözümü', 'Sönümlenen üstel.', 'κ = 5,123·√4 = 10,25 nm^{-1}', 'κ = 10,25 nm^{-1}', 10.2463],
     ['R ve |t|²', 'Tam yansıma; dalga fonksiyonu yine de sıfır değil.', 'R = 1,   |t|² = 4E/V_{0} = 4·2/6 = 1,333', '|t|² = 1,33', 1.3333],
     ['Sızma derinliği', '1/e uzaklığı.', 'δ = 1/κ = 1/10,25 = 0,0976 nm', 'δ ≈ 0,098 nm', 0.0976]],
    'R = 1; δ = 1/κ ≈ 0.098 nm', 0.0976, 'nm', 'κ büyüdükçe sızma derinliği azalır. R = 1 ama ψ ≠ 0.');

  X('tunel-1nm', 'Worked example: tunnelling through a 0.6 nm barrier', 'An electron with E = 2 eV meets a barrier V_0 = 5 eV, a = 0.6 nm. Estimate T ≈ e^{-2κa}.',
    ['κ = 5,123·√(V₀ − E) nm^{-1}.', '2κa üssünü hesapla.', 'T ≈ e^{−2κa}; sonucu 2,37e-5 gibi bilimsel yaz.'],
    ['E = 2 eV', 'V_{0} = 5 eV', 'a = 0,6 nm'],
    [['Sönüm sabiti', 'V₀ − E = 3 eV.', 'κ = 5,123·√3 = 8,874 nm^{-1}', 'κ = 8,874 nm^{-1}', 8.8736],
     ['Geçirgenlik', '2κa = 2·8,874·0,6 = 10,65.', 'T ≈ e^{−10,65} = 2,37×10^{-5}', 'T ≈ 2,4×10^{-5}', 2.374e-5]],
    'T ≈ 2.4×10^{-5}', 2.374e-5, '(birimsiz)', 'a küçülünce üstel hızla artar: a büyüdükçe T çok hızlı düşer.');

  /* ---- s07 ---- */
  X('olc-p', 'Worked example: measurement probabilities', 'A particle is in ψ = A(3φ_1 + 4φ_2) with orthonormal eigenstates φ_n. Find A and the probability of measuring E_1.',
    ['Normalizasyon: katsayıların karelerinin toplamı × A² = 1.', 'A\'yı çöz.', 'E_n bulma olasılığı = |c_n|² (c_n = A × katsayı).'],
    ['ψ = A(3φ_{1} + 4φ_{2})', '⟨φ_{i}|φ_{j}⟩ = δ_{ij}'],
    [['Normalizasyon', 'A²(3² + 4²) = 1.', 'A²·25 = 1  →  A = 1/5 = 0,2', 'A = 0,2', 0.2],
     ['Olasılık', 'c₁ = 3A = 0,6.', 'P(E_{1}) = |3A|² = 9/25 = 0,36,   P(E_{2}) = 16/25', 'P(E_{1}) = 0,36', 0.36]],
    'A = 1/5; P(E_1) = 0.36', 0.36, '(birimsiz)', 'Kontrol: olasılıklar toplamı 0,36 + 0,64 = 1 olmalı.');

  X('olc-E', 'Worked example: expectation value', 'An electron in an infinite well of width L = 1 nm is in ψ = (3/5)φ_1 + (4/5)φ_2. Find ⟨E⟩ in eV.',
    ['Olasılıkları yaz: |c_n|².', 'Seviyeleri hesapla: E_n = 0,3760 n²/L².', '⟨E⟩ = Σ |c_n|² E_n.'],
    ['L = 1 nm', '|c_{1}|² = 9/25, |c_{2}|² = 16/25'],
    [['Seviyeler', 'L = 1 nm: E₁ = 0,376 eV, E₂ = 4E₁.', 'E_{1} = 0,376 eV,  E_{2} = 1,504 eV', 'E_{1} = 0,376 eV', 0.376],
     ['Beklenen değer', 'Ağırlıklı ortalama.', '⟨E⟩ = 0,36·0,376 + 0,64·1,504 = 0,1354 + 0,9626 = 1,098 eV', '⟨E⟩ ≈ 1,098 eV', 1.098]],
    '⟨E⟩ ≈ 1.10 eV', 1.098, 'eV', '⟨E⟩ ölçümde bulunan bir değer değil, ortalamadır: yalnızca 0,376 ya da 1,504 eV çıkar.');

  /* ---- s08 ---- */
  X('bel-v', 'Worked example: uncertainty for a confined electron', 'An electron is confined within Δx = 1 nm. Find the minimum Δp and Δv (in km/s).',
    ['Belirsizlik ilkesi: Δx·Δp ≥ ħ/2.', 'Δx\'i metreye çevir (1 nm = 10^{-9} m).', 'Δp = ħ/(2Δx).', 'Δv = Δp / m.'],
    ['Δx = 1 nm', 'ħ = 1,055×10^{-34} J·s', 'm = 9,109×10^{-31} kg'],
    [['Momentum belirsizliği', 'Δx = 10^{-9} m.', 'Δp ≥ 1,055×10^{-34}/(2×10^{-9}) = 5,27×10^{-26} kg·m/s', 'Δp ≈ 5,27×10^{-26}', 5.273],
     ['Hız belirsizliği', 'Δp / m.', 'Δv ≥ 5,27×10^{-26} / 9,109×10^{-31} = 5,79×10^{4} m/s = 57,9 km/s', 'Δv ≈ 57,9 km/s', 57.88]],
    'Δv ≥ 57.9 km/s', 57.88, 'km/s', 'Δx 10 kat büyürse Δv 10 kat küçülür. Birim: nm → m.');

  X('bel-t', 'Worked example: energy-time uncertainty', 'An excited state has lifetime Δt = 10 ns. Estimate the minimum energy uncertainty in μeV.',
    ['İlke: ΔE·Δt ≥ ħ/2.', 'ΔE = ħ/(2Δt), ħ = 6,582×10^{-16} eV·s.', 'Birimi μeV\'a çevir (1 μeV = 10^{-6} eV).'],
    ['Δt = 10 ns', 'ħ = 6,582×10^{-16} eV·s'],
    [['İlke', 'Yaşam süresi uzadıkça çizgi daralır.', 'ΔE·Δt ≥ ħ/2', 'İlke yazıldı'],
     ['Sayı', 'Δt = 10^{-8} s.', 'ΔE ≥ 6,582×10^{-16}/(2×10^{-8}) = 3,29×10^{-8} eV = 0,0329 μeV', 'ΔE ≈ 0,033 μeV', 0.03291]],
    'ΔE ≈ 0.033 μeV', 0.03291, 'μeV', '10^{-8} eV = 0,01 μeV: dönüşümü dikkatle yap.');

  /* ---- s09 ---- */
  X('bant-si', 'Worked example: absorption edge of germanium', 'Germanium has a bandgap E_g = 0.66 eV. Calculate the longest wavelength that can create an electron-hole pair.',
    ['Koşul: foton enerjisi ≥ E_g.', 'Sınır durumda eşitlik: λ_{max} = 1239,84 / E_g.', 'Daha uzun dalga boyu soğurulmaz.'],
    ['E_{g} = 0,66 eV'],
    [['Koşul', 'Elektronu valence band\'den conduction band\'e çıkarmak için hf ≥ E_g.', 'λ ≤ hc / E_{g}', 'Koşul yazıldı'],
     ['Sayı', 'Böl.', 'λ_{max} = 1239,84 / 0,66 = 1879 nm', 'λ_{max} ≈ 1879 nm', 1878.5]],
    'λ_max ≈ 1.88 μm', 1878.5, 'nm', 'Küçük bandgap = uzun dalga boyu eşiği (kızılötesi).');

  X('bant-gaas', 'Worked example: GaN bandgap', 'GaN has E_g = 3.4 eV. Find the wavelength emitted on recombination and decide whether a 400 nm photon is absorbed.',
    ['Yayılan foton: λ = 1239,84 / E_g.', 'Verilen fotonun enerjisini bul: E = 1239,84 / λ.', 'E ≥ E_g ise soğurulur, değilse soğurulmaz.'],
    ['E_{g} = 3,4 eV'],
    [['Yayılan foton', 'E ≈ E_g.', 'λ = 1239,84 / 3,4 = 365 nm (mor ötesi)', 'λ ≈ 365 nm', 364.66],
     ['400 nm foton', 'E = 1239,84/400 = 3,10 eV.', 'E_{foton} = 3,10 eV < E_{g} = 3,4 eV → soğurulmaz', 'Soğurulmaz']],
    'λ ≈ 365 nm; a 400 nm photon is not absorbed', 364.66, 'nm', 'Geniş bandgap = kısa dalga boyu (mavi/mor ötesi LED).');

  /* ---- s10 ---- */
  X('fd-100meV', 'Worked example: Fermi-Dirac at 50 meV', 'Find the probability that a state 0.05 eV above E_F is occupied at T = 300 K.',
    ['kT hesapla: k_B·T (k_B = 8,617×10^{-5} eV/K).', 'x = (E − E_F)/kT bul.', 'f = 1/(1 + e^{x}).', 'E > E_F ise f < 1/2 olmalı (kontrol).'],
    ['E − E_{F} = 0,05 eV', 'T = 300 K'],
    [['kT', 'Çarp.', 'kT = 8,617×10^{-5} × 300 = 25,85 meV', 'kT = 25,85 meV', 25.85],
     ['Üstel', 'x = 0,05 / 0,02585.', 'x = 1,934', 'x = 1,934', 1.934],
     ['f(E)', 'Yerine koy.', 'f = 1/(1 + e^{1,934}) = 1/(1 + 6,92) = 0,126', 'f ≈ 0,126', 0.1263]],
    'f ≈ 0.126 (12.6%)', 0.1263, '(birimsiz)', 'E, E_F\'e yaklaştıkça f 1/2\'ye gider.');

  X('fd-orta', 'Worked example: occupation one kT above E_F', 'What is the Fermi-Dirac occupation probability at E = E_F + kT?',
    ['E − E_F\'i kT cinsinden yaz.', 'f = 1/(1 + e^{x}) formülüne x\'i koy.', 'Sonucu 1/2 ile karşılaştır.'],
    ['E − E_{F} = kT'],
    [['x', 'E − E_F = kT → x = 1.', 'x = (E − E_{F})/kT = 1', 'x = 1', 1],
     ['f', 'Yerine koy.', 'f = 1/(1 + e) = 1/3,718 = 0,269', 'f ≈ 0,269', 0.2689]],
    'f ≈ 0.269', 0.2689, '(birimsiz)', 'x = 0 (E = E_F) için f = 1/2; x arttıkça f azalır.');

  X('np-ni', 'Worked example: p-type silicon', 'Silicon (n_i = 1.5×10^{10} cm^{-3}) is doped with N_A = 2×10^{16} cm^{-3} acceptors. Find the electron concentration n.',
    ['Katkıya bak: N_A ≫ n_i ise çoğunluk taşıyıcı p ≈ N_A (p tipi).', 'Kütle etkisi yasası: n·p = n_i².', 'Azınlık taşıyıcı: n = n_i² / p.'],
    ['n_{i} = 1,5×10^{10} cm^{-3}', 'N_{A} = 2×10^{16} cm^{-3}'],
    [['Çoğunluk taşıyıcı', 'Akseptör katkısı delik yoğunluğunu belirler.', 'p ≈ N_{A} = 2×10^{16} cm^{-3}', 'p tipi'],
     ['Elektron yoğunluğu', 'n = n_i² / p.', 'n = (1,5×10^{10})² / 2×10^{16} = 2,25×10^{20}/2×10^{16} = 1,125×10^{4} cm^{-3}', 'n ≈ 1,13×10^{4} cm^{-3}', 11250]],
    'n ≈ 1.13×10^{4} cm^{-3}', 11250, 'cm^{-3}', 'Azınlık taşıyıcı katkı arttıkça azalır: np sabit.');

  X('drift-v', 'Worked example: hole drift velocity', 'Hole mobility in silicon is μ_p = 480 cm²/(V·s). Find the drift velocity in E = 50 V/cm, in m/s.',
    ['v_d = μ·E.', 'Birimleri kontrol et: cm²/(V·s) × V/cm = cm/s.', 'cm/s → m/s için ÷100.'],
    ['μ_{p} = 480 cm²/Vs', 'E = 50 V/cm'],
    [['Sürüklenme hızı', 'Çarp.', 'v_{d} = 480 × 50 = 2,4×10^{4} cm/s', 'v_{d} = 2,4×10^{4} cm/s', 24000],
     ['Birim', '1 m = 100 cm.', 'v_{d} = 240 m/s', 'v_{d} = 240 m/s', 240]],
    'v_d = 240 m/s', 240, 'm/s', 'Alan 2 kat → hız 2 kat (doğrusal rejim).');

  X('drift-J', 'Worked example: drift current density', 'n-type silicon: n = 5×10^{15} cm^{-3}, μ_n = 1000 cm²/Vs. Find J for E = 20 V/cm, in A/cm².',
    ['İletkenlik: σ = q·n·μ.', 'Akım yoğunluğu: J = σ·E.', 'Birim kontrolü: C·cm^{-3}·cm²/(V·s)·V/cm = A/cm².'],
    ['n = 5×10^{15} cm^{-3}', 'μ_{n} = 1000 cm²/Vs', 'E = 20 V/cm', 'q = 1,602×10^{-19} C'],
    [['İletkenlik', 'Çarp.', 'σ = 1,602×10^{-19} × 5×10^{15} × 1000 = 0,801 S/cm', 'σ = 0,801 S/cm', 0.801],
     ['Akım yoğunluğu', 'J = σE.', 'J = 0,801 × 20 = 16,0 A/cm²', 'J ≈ 16,0 A/cm²', 16.02]],
    'J ≈ 16.0 A/cm²', 16.02, 'A/cm²', 'n ya da E iki katına çıkarsa J de iki katına çıkar.');

  /* ---- Soru 5 görevleri: son sonucu oyuncuya da sor (sonucSoru; adımlardan sonra, 'Sonuç kontrolü' adımı) ---- */
  function SS(id, q){ for (var i = 0; i < L.length; i++) if (L[i].id === id) L[i].sonucSoru = q; }
  SS('q5-bolgeler', N('Sonuç kontrolü: κd = κ × d kaç? (κ = 15,37 nm^{-1}, d = 10 nm)', 153.7, ''));
  SS('q5-bos-kuyu', N('Sonuç kontrolü: E₁ kaç meV? (L = 50 nm)', 0.1504, 'meV'));
  SS('q5-sayisal', N('Sonuç kontrolü: engelli sistemin en düşük enerjisi kaç meV?', 0.934, 'meV'));
  SS('q5-basit', N('Sonuç kontrolü: E₂ − E₁ kaç meV?', 0.4512, 'meV'));

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
