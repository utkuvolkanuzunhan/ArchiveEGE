/* 86-data-gercek-sinav.js · "Gerçek sınav (10 soru)": hocanın örnek sınavındaki 10 klasik soru AYNEN (İngilizce).
 * Q.data.gercekSinav = { sorular: [ {no, st, text, sekil, kavram, model:[cümleler], anahtar:[], hatalar:[], calis:[{st, not}]} ], not }.
 * Kullananlar: 98-gercek-sinav.js (sınav arayüzü), 96-final.js (Sınav Günü aynı soru seti).
 * Sınav metni, model cevaplar ve anahtar fikirler İNGİLİZCE (sınav dili); "hatalar" ve "calis" Türkçe (ders terimleri English (Türkçe)).
 * Q5 sayıları Python (mpmath + sonlu fark) ile doğrulandı: oyun/denetim/GERCEK-SINAV.md.
 * Not: Q5/Q6 şekil ayrıntıları (E, V0 sayısal değerleri) bilinmiyor; model çözümler genel parametrelerle yazıldı. */
(function(){
  'use strict';
  Q.data.gercekSinav = {
    not: 'Q5 ve Q6 şekilleri örnek sınav PDF\'inden yeniden çizilmiştir. Q5 varsayımı: elektron, 0-50 nm sonsuz duvarlı kuyu, 20-30 nm arasında 9 eV\'luk engel, kuyunun geri kalanında V = 0.',
    sorular: [
      {
        no: 1, st: 's01', kavram: 'crystalline solids in industry', sekil: null,
        text: 'Why are crystalline solids used in the semiconductor industry?',
        model: [
          'A crystalline solid has long-range order: a unit cell (a lattice plus a basis) is repeated by translation through the whole sample.',
          'This periodic arrangement of atoms produces a periodic potential for the electrons.',
          'Solving the Schrödinger equation in a periodic potential (Bloch theorem) gives allowed energy bands separated by a well-defined bandgap Eg.',
          'Because the band edges and the bandgap are sharply defined (Si: 1.12 eV, GaAs: 1.42 eV), the electrical and optical properties can be predicted, designed and reproduced from wafer to wafer.',
          'The crystal lattice also allows controlled doping: donor or acceptor atoms placed on lattice sites give a known density of electrons or holes, which is needed for p-n junctions and transistors.',
          'A single crystal can be made extremely pure and almost free of defects, which gives high carrier mobility and long carrier lifetime.',
          'In an amorphous solid there is no long-range order, so there are dangling bonds and localized states in the gap; the carriers are trapped or scatter strongly and the mobility is low.',
          'In a polycrystalline solid the grain boundaries scatter carriers, act as recombination centers and traps, and let dopants segregate, so the properties change from grain to grain.',
          'Crystal planes also allow orientation-dependent processing: wafers are cut along (100) or (111) planes, they can be etched or cleaved along planes, and epitaxial layers grow on the crystal as a template.',
          'Therefore only crystals give predictable, controllable and reproducible device behavior, which is why the semiconductor industry is built on single-crystal wafers.'
        ],
        anahtar: [
          'Crystal = long-range periodic order (lattice + basis), which gives a periodic potential.',
          'Periodic potential gives well-defined energy bands and a bandgap, so properties are predictable and reproducible.',
          'Doping on lattice sites controls the carrier type and density (n-type, p-type).',
          'Single crystals are pure and defect-free: high mobility and long lifetime.',
          'Amorphous: no long-range order, dangling bonds, localized states, low mobility.',
          'Polycrystalline: grain boundaries scatter or trap carriers, so properties vary.'
        ],
        hatalar: [
          'Sadece "kristal daha sağlamdır" demek: asıl neden periyodik potansiyel, bant yapısı ve kontrol edilebilir elektriksel özelliktir.',
          'Amorf yarıiletkenin hiç kullanılmadığını söylemek: kullanılır (ör. ince film güneş pili), ama taşıyıcı hareketliliği düşüktür; soru yüksek performanslı aygıtları kastediyor.',
          'Bandgap (yasak enerji aralığı) kavramını yazmamak: cevabın merkezi budur.'
        ],
        calis: [
          { st: 's01', not: 'Kristal = kafes + baz, tek kristal / çok kristalli (polycrystalline) / amorf farkı. Tane sınırı (grain boundary) kartı.' },
          { st: 's09', not: 'Periyodik potansiyelden bantların doğuşu (Q7 ile bağlantılı).' }
        ]
      },
      {
        no: 2, st: 's02', kavram: 'single crystal growth', sekil: null,
        text: 'Explain the main reason for single-crystal growth in the CZ method.',
        model: [
          'In the Czochralski (CZ) method, polycrystalline silicon is melted in a quartz crucible just above 1414 °C.',
          'A small seed crystal with a chosen orientation, for example (100) or (111), is dipped into the melt and pulled upwards slowly while it rotates.',
          'The silicon atoms of the melt attach to the seed and continue its lattice, so the whole ingot solidifies as one continuous crystal with the orientation of the seed.',
          'The main reason for growing a single crystal is that it has no grain boundaries; the whole wafer has the same, uninterrupted periodic lattice.',
          'Grain boundaries contain dangling bonds and defects that scatter carriers and act as traps and recombination centers, which lowers the mobility and carrier lifetime and causes leakage currents.',
          'In a single crystal the band structure is the same everywhere, so the device properties are uniform, predictable and reproducible over the whole wafer and between wafers.',
          'A single crystal also allows exact doping control, the choice of the surface orientation, and the growth of epitaxial layers on the wafer.',
          'Rotation and slow pulling keep the temperature and dopant distribution uniform and the diameter constant, so a large, round, nearly defect-free ingot is obtained and then sliced into wafers.',
          'Therefore CZ growth is used to turn cheap polycrystalline silicon into the high-quality single-crystal substrate that integrated circuits need.'
        ],
        anahtar: [
          'Seed crystal is dipped into the melt and pulled while rotating.',
          'The melt solidifies on the seed with the same lattice and orientation (one continuous crystal).',
          'Main reason: no grain boundaries, so no scattering/trapping of carriers.',
          'Higher mobility and lifetime, fewer leakage and recombination centers.',
          'Uniform, predictable, reproducible properties across the wafer; controlled orientation and doping.'
        ],
        hatalar: [
          'CZ yönteminin amacını "silisyumu saflaştırmak" diye yazmak: saflaştırma ayrı bir adımdır, CZ tek kristal büyütür.',
          'Tohumun (seed) rolünü yazmamak: kristal düzenini eriyiğe aktaran tohumdur.',
          'Neden sorusuna sadece süreci anlatarak cevap vermek: asıl cevap tane sınırı olmaması ve bunun taşıyıcılara etkisidir.'
        ],
        calis: [
          { st: 's02', not: 'Czochralski yöntemi (simülasyon), wafer yönelimi, tek kristalin nedeni.' },
          { st: 's01', not: 'Tek kristal / çok kristalli farkı ve tane sınırı.' }
        ]
      },
      {
        no: 3, st: 's03', kavram: 'why quantum mechanics', sekil: null,
        text: 'Explain the reasons for the emergence and success of quantum mechanics.',
        model: [
          'At the end of the 19th century classical physics (Newton, Maxwell, thermodynamics) failed in several experiments, and these failures led to quantum mechanics.',
          'Blackbody radiation: the classical Rayleigh-Jeans law predicts that the radiated energy diverges at high frequency (ultraviolet catastrophe); in 1900 Planck removed it by assuming that energy is exchanged in quanta E = hf.',
          'Photoelectric effect: electrons are emitted only if the frequency is above a threshold, independent of the light intensity, and with no delay; Einstein (1905) explained it with photons, Kmax = hf − φ, which a classical wave cannot do.',
          'Atomic spectra and atomic stability: atoms emit discrete lines instead of a continuum, and a classical orbiting electron should radiate and spiral into the nucleus; Bohr (1913) introduced quantized energy levels, E = −13.6 eV/n² for hydrogen.',
          'Other failures were the specific heat of solids at low temperature (Einstein, Debye) and the Compton effect, which shows that light behaves as a particle with momentum p = h/λ.',
          'De Broglie (1924) proposed that matter also has a wavelength λ = h/p, and the electron diffraction experiment of Davisson and Germer (1927) confirmed wave-particle duality.',
          'Heisenberg and Schrödinger (1925-26) built the complete theory: the wave function, the Schrödinger equation, operators and probabilities, together with the uncertainty principle.',
          'Success: it explains the spectrum and stability of the hydrogen atom, the periodic table (Pauli principle), chemical bonding, and the quantized energies of confined particles.',
          'Success in solids: it explains energy bands, metals, insulators and semiconductors, and therefore transistors, diodes, lasers, LEDs, tunnel devices and the whole semiconductor technology.',
          'Its predictions agree with experiments to extremely high precision, and it reduces to classical physics for large systems (correspondence principle).'
        ],
        anahtar: [
          'Blackbody radiation / ultraviolet catastrophe solved by Planck quanta E = hf.',
          'Photoelectric effect: threshold frequency, intensity-independent, photons (Einstein).',
          'Discrete atomic spectra and atomic stability: Bohr levels; classical atom would collapse.',
          'Wave-particle duality: de Broglie wavelength, electron diffraction, Compton effect.',
          'Complete theory: Schrödinger equation, wave function, probability, uncertainty.',
          'Successes: hydrogen atom, periodic table, bands and semiconductors, transistors, lasers.'
        ],
        hatalar: [
          'Sadece tek bir deney (örneğin fotoelektrik) anlatmak: en az üç klasik başarısızlık istenir.',
          'Planck sabitini ve E = hf ilişkisini yazmamak.',
          'Başarı kısmını (yarıiletken, transistör, lazer, periyodik tablo) unutmak: soru hem doğuş hem başarı diyor.'
        ],
        calis: [
          { st: 's03', not: 'Kara cisim, fotoelektrik olay, eşik frekansı. Planck ve Einstein kartları.' },
          { st: 's04', not: 'Atom spektrumları, Bohr modeli, de Broglie.' }
        ]
      },
      {
        no: 4, st: 's04', kavram: 'hydrogen atom stability', sekil: null,
        text: 'Briefly explain the stability of the Hydrogen atom using quantum mechanical theory.',
        model: [
          'In classical physics the electron orbits the proton and is therefore accelerating, so it should radiate electromagnetic energy, lose energy and spiral into the nucleus in about 10⁻¹¹ s; the atom could not be stable.',
          'In quantum mechanics the electron is described by a wave function that solves the Schrödinger equation with the Coulomb potential V = −e²/(4πε₀r).',
          'The boundary conditions (a normalizable ψ) allow only discrete energies, E_n = −13.6 eV/n² with n = 1, 2, 3, …',
          'The ground state n = 1 is the lowest allowed state, with E₁ = −13.6 eV, so there is no lower state to which the electron could fall.',
          'A stationary state has |ψ|² independent of time, so the charge distribution does not change and there is no radiation; light is emitted only in a transition between two levels, hν = E_i − E_f.',
          'The same result follows from the uncertainty principle: confining the electron to a radius r gives Δp ≈ ħ/r and a kinetic energy of about ħ²/(2mr²), which grows when r decreases.',
          'The Coulomb potential energy −e²/(4πε₀r) decreases when r decreases, so the total energy E(r) = ħ²/(2mr²) − e²/(4πε₀r) has a minimum.',
          'Setting dE/dr = 0 gives r = 4πε₀ħ²/(me²) = a₀ = 0.529 Å and E = −13.6 eV, exactly the Bohr radius and the ground-state energy.',
          'Therefore the electron cannot collapse into the nucleus: collapse would need a very small Δx and therefore a very large kinetic energy.',
          'The atom is stable because of the wave nature of the electron: quantized stationary states with a lowest energy level.'
        ],
        anahtar: [
          'Classical: accelerating charge radiates and the atom would collapse.',
          'Schrödinger equation with Coulomb potential gives quantized energies E_n = −13.6 eV/n².',
          'A lowest state (ground state, n = 1) exists, so the electron cannot fall further.',
          'Stationary states do not radiate; emission only in transitions between levels.',
          'Uncertainty/confinement: smaller r raises kinetic energy, which balances the Coulomb attraction at r = a₀.'
        ],
        hatalar: [
          'Kararlılığı "elektron çekirdeğe düşmez çünkü çekim kuvveti yörünge kuvvetine eşit" diye açıklamak: bu klasik argüman, klasik fizikte de radyasyon sorununu çözmez.',
          'Sıfır noktası enerjisini sıcaklığa bağlamak: enerji sınır koşulundan ve sıkışmadan gelir, ısıdan değil.',
          'Bohr yörüngelerini kuantum mekaniğinin cevabı saymak: soru Schrödinger dalga mekaniği ile açıklamayı istiyor.'
        ],
        calis: [
          { st: 's04', not: 'Bohr modeli, hidrojen spektrumu, atom kararlılığı kartları.' },
          { st: 's08', not: 'Belirsizlik ilkesinden minimum enerji tahmini (E ≈ ħ²/(8mL²)).' }
        ]
      },
      {
        no: 5, st: 's05', kavram: 'finite barrier inside infinite well', sekil: 'q5',
        text: 'For the given potential below, it is required to calculate the wave function and the allowed energies in electron-volts (eV).',
        model: [
          'Assumption (from the figure): an electron of mass m; V = ∞ for x ≤ 0 and x ≥ 50 nm; V = 0 for 0 < x < 20 nm and 30 < x < 50 nm; and a barrier V₀ = 9 eV for 20 < x < 30 nm. We use ħ²/2m = 0.0381 eV·nm².',
          'Regions and solutions for E < V₀: define k = √(2mE)/ħ and κ = √(2m(V₀ − E))/ħ. Region I (0 < x < 20): ψ = A sin kx, because ψ(0) = 0. Region II (20 < x < 30): ψ = B e^{κx} + C e^{−κx}. Region III (30 < x < 50): ψ = D sin k(50 − x), because ψ(50) = 0.',
          'Boundary conditions: ψ and dψ/dx are continuous at x = 20 nm and x = 30 nm. These four conditions determine B/A, C/A, D/A and the eigenvalue equation.',
          'The potential is symmetric about x = 25 nm, so the solutions are even or odd about the center. Putting x′ = x − 25 nm, region II is ψ = B cosh κx′ (even) or B sinh κx′ (odd).',
          'Matching ψ′/ψ at x′ = 5 nm (the well side is ψ ∝ sin k(25 − x′), so ψ′/ψ = −k cot 20k with lengths in nm) gives the eigenvalue equations: even: κ tanh(5κ) = −k cot(20k); odd: κ coth(5κ) = −k cot(20k).',
          'For energies far below the barrier, κ·5 nm ≈ 77 (κ ≈ 15.4 nm⁻¹ at E ≈ 0), so tanh(5κ) = coth(5κ) = 1 to within e^{−150}. Both equations become the same equation, tan(20k) = −k/κ.',
          'The tunneling factor is e^{−2κd} with d = 10 nm, κd ≈ 154, so e^{−2κd} ≈ 10⁻¹³⁴: the two 20-nm wells are completely decoupled. Every level is doubly degenerate (the splitting is about 10⁻⁷⁰ eV for n = 1).',
          'Approximation used: neglect the penetration into the barrier, ψ(20) = ψ(30) = 0. Then each well is an infinite well of width a = 20 nm: φ_n(x) = √(2/a) sin(nπx/a) = √(1/10 nm) sin(nπx/20 nm), n = 1, 2, 3, …, and E_n = n²π²ħ²/(2ma²) = 0.376 n²/a² eV (a in nm) = 0.94 n² meV.',
          'Wave functions: ψ_n^± = (1/√2)[φ_n(x) ± φ_n(50 nm − x)], with φ_n(x) = √(2/a) sin(nπx/a) for 0 < x < 20 nm and φ_n = 0 elsewhere; ψ⁺ is even and ψ⁻ is odd about x = 25 nm. Any combination, for example the electron localized in the left well, is also an eigenstate. In the barrier ψ decays as e^{−κ(20 nm − x)} and is practically zero.',
          'Exact eigenvalues (Python check of the equation above): the finite barrier lets the wave penetrate by 1/κ ≈ 0.065 nm, so the effective width is a + 1/κ and E_n ≈ 0.934 n² meV. Numerical values: E₁ = 0.934 meV, E₂ = 3.74 meV, E₃ = 8.41 meV, E₄ = 14.9 meV, E₅ = 23.3 meV, E₁₀ = 0.0934 eV, E₂₀ = 0.374 eV, E₅₀ = 2.33 eV, E₉₀ = 7.55 eV; each is a doublet.',
          'There are 98 doublets (196 states) below 9 eV; the highest one is about 8.92 eV. For E > 9 eV the electron passes over the barrier: in region II ψ = cos qx′ or sin qx′ with q = √(2m(E − V₀))/ħ, and the levels are no longer degenerate pairs (9.004, 9.015, 9.034, 9.059, 9.090 eV, …).'
        ],
        anahtar: [
          'Divide the potential into three regions; for E < 9 eV use sine waves where V = 0 and exponentials e^{±κx} in the barrier.',
          'Boundary conditions: ψ = 0 at 0 and 50 nm; ψ and ψ′ continuous at 20 and 30 nm.',
          'Eigenvalue equation from symmetry: κ tanh(5κ) = −k cot(20k) (even), κ coth(5κ) = −k cot(20k) (odd).',
          'κd ≈ 154, so the tunneling is negligible: two independent 20-nm infinite wells, doubly degenerate levels.',
          'ψ_n = √(2/a) sin(nπx/a) with a = 20 nm (or even/odd combinations of the two wells).',
          'E_n = n²π²ħ²/(2ma²) = 0.376 n²/a² eV = 0.94 n² meV (E₁ ≈ 0.94 meV).',
          'The approximation must be stated: valid for E ≪ V₀ (E < 9 eV); above 9 eV the electron is not confined to one well.'
        ],
        hatalar: [
          'Kuyuyu 50 nm genişliğinde tek bir sonsuz kuyu sayıp E_n = 0.376 n²/2500 eV yazmak: 9 eV\'luk engel bunu yalnızca E > 9 eV için doğru yapar.',
          'Engel içinde ψ = 0 koymak ve bunu yaklaşıklık olarak belirtmemek: sınırda ψ ve ψ\' sürekliliği temel koşuldur, yaklaşımı açıkça yaz.',
          'Birimleri karıştırmak: 0.376 eV·nm² / (20 nm)² = 0.94 meV, 0.94 eV değil.'
        ],
        calis: [
          { st: 's05', not: 'Sonsuz kuyu, sınır koşulları, E_n ve ψ_n; sıfır noktası enerjisi.' },
          { st: 's06', not: 'Engel içinde sönümlenme (κ) ve tünelleme çarpanı e^{−2κd}.' }
        ]
      },
      {
        no: 6, st: 's06', kavram: 'step potential reflection', sekil: 'q6',
        text: 'Calculate the wave function and the reflection coefficient of the electron for the given potential.',
        model: [
          'Potential: V = 0 for x < 0 and V = V₀ for x > 0; an electron of energy E comes from the left. Define k₁ = √(2mE)/ħ for x < 0.',
          'Case E > V₀: define k₂ = √(2m(E − V₀))/ħ. Region I (x < 0): ψ₁ = e^{ik₁x} + r e^{−ik₁x} (incident + reflected). Region II (x > 0): ψ₂ = t e^{ik₂x} (transmitted only, no wave comes from the right).',
          'Boundary conditions at x = 0: continuity of ψ gives 1 + r = t; continuity of dψ/dx gives k₁(1 − r) = k₂ t.',
          'Solving: r = (k₁ − k₂)/(k₁ + k₂) and t = 2k₁/(k₁ + k₂).',
          'The reflection coefficient is the ratio of the reflected to the incident probability current: R = |r|² = ((k₁ − k₂)/(k₁ + k₂))² = [(√E − √(E − V₀))/(√E + √(E − V₀))]².',
          'The transmission coefficient uses the current, T = (k₂/k₁)|t|² = 4k₁k₂/(k₁ + k₂)², and R + T = 1 (conservation of probability). T is not |t|², because the velocity changes.',
          'Example: E = 2V₀ gives k₂/k₁ = 0.707, R = 0.0294 and T = 0.971. Classically R would be 0, so quantum mechanics predicts reflection even though E > V₀ (a wave effect). R → 1 as E → V₀ and R → 0 as E ≫ V₀.',
          'Case E < V₀: define κ = √(2m(V₀ − E))/ħ. Then ψ₁ = e^{ik₁x} + r e^{−ik₁x} and ψ₂ = t e^{−κx} (decaying, evanescent wave).',
          'Continuity at x = 0 gives r = (k₁ − iκ)/(k₁ + iκ) and t = 2k₁/(k₁ + iκ), with |t|² = 4E/V₀.',
          '|r|² = 1, so R = 1 and T = 0: the electron is totally reflected, with only a phase shift. The probability density in x > 0 is |t|² e^{−2κx}, not zero: the wave penetrates a distance of about 1/(2κ) (classically forbidden region), but carries no current.'
        ],
        anahtar: [
          'Two regions: ψ = e^{ik₁x} + r e^{−ik₁x} for x < 0, ψ = t e^{ik₂x} for x > 0 (E > V₀).',
          'k₁ = √(2mE)/ħ and k₂ = √(2m(E − V₀))/ħ.',
          'Continuity of ψ and ψ′ at x = 0 gives r = (k₁ − k₂)/(k₁ + k₂), t = 2k₁/(k₁ + k₂).',
          'R = ((k₁ − k₂)/(k₁ + k₂))², T = 1 − R = 4k₁k₂/(k₁ + k₂)² (current, not |t|²).',
          'E < V₀: ψ = t e^{−κx} in x > 0, |r| = 1, so R = 1 (total reflection) with penetration depth 1/(2κ).'
        ],
        hatalar: [
          'E > V₀ iken R = 0 demek (klasik düşünce): dalga mekaniğinde R > 0.',
          'T = |t|² yazmak: geçiş katsayısı akıma göre T = (k₂/k₁)|t|².',
          'Süreklilik koşulunda sadece ψ\'yi yazıp ψ\' sürekliliğini unutmak; ya da E < V₀ durumunda ψ\'yi x > 0 için sıfır koymak.'
        ],
        calis: [
          { st: 's06', not: 'Basamak potansiyeli simülasyonu, yansıma ve geçiş, E < V₀ ve E > V₀.' },
          { st: 's05', not: 'Süreklilik koşulları ve dalga sayısı k.' }
        ]
      },
      {
        no: 7, st: 's09', kavram: 'energy bands', sekil: null,
        text: 'From a quantum mechanical perspective, why do allowed energies in periodic structures appear as continuous bands?',
        model: [
          'An isolated atom has discrete energy levels, because the electron is bound and its wave function must satisfy boundary conditions.',
          'In a crystal there are about N ~ 10²² atoms per cm³ at distances of a few ångströms, so the wave functions of neighboring atoms overlap and the electron feels the periodic potential of the whole lattice.',
          'Tight-binding picture: when N atoms are brought together, the N coupled systems have N slightly different states for each atomic level. Because of the Pauli exclusion principle, no two electrons can occupy the same state, so the original level must split into N distinct levels.',
          'The width of the band is set by the overlap (coupling) of neighboring atoms, a few eV, so the spacing between neighboring levels is about 10⁻²² eV, far below kT = 0.026 eV. The N levels therefore look like a continuous band.',
          'Wave picture: in a periodic potential V(x + a) = V(x) the solutions are Bloch waves ψ_k(x) = u_k(x) e^{ikx}, with u_k periodic (Bloch theorem), and the energy E(k) is a continuous function of the wave number k.',
          'Near k = nπ/a the wavelength satisfies the Bragg condition, so the wave is reflected by the lattice and forms standing waves. The two standing waves pile up the charge at different places (on the ions or between them) and have different energies.',
          'This produces an energy gap at the Brillouin-zone boundary: the allowed energies are continuous bands E(k) and the forbidden regions are the bandgaps (Kronig-Penney model).',
          'When the atoms are closer, the overlap is bigger and the bands are wider; when the atoms are far apart, the bands shrink back into the sharp atomic levels.',
          'Result: allowed energies form quasi-continuous bands separated by bandgaps. The filling of the bands (valence band, conduction band) with 2N states per band explains metals, insulators and semiconductors.'
        ],
        anahtar: [
          'Isolated atom: discrete levels; in a crystal neighboring wave functions overlap.',
          'Pauli exclusion principle: N atoms give N distinct (slightly shifted) levels for each atomic level.',
          'N ~ 10²² levels within a few eV: spacing ≪ kT, so the band is quasi-continuous.',
          'Periodic potential: Bloch waves ψ = u_k(x) e^{ikx} with continuous k and E(k).',
          'Bragg reflection at k = nπ/a gives standing waves with different energies: a bandgap opens.',
          'Allowed bands are separated by forbidden bandgaps; each band holds 2N electron states.'
        ],
        hatalar: [
          'Pauli ilkesini yazıp seviyelerin N parçaya neden yarıldığını açıklamamak: komşu atomların dalga fonksiyonlarının örtüşmesi (overlap) mekanizmanın kendisidir.',
          'Bantların sıcaklık yüzünden oluştuğunu söylemek: bantlar 0 K\'de de vardır, sıcaklık yalnızca doluluğu değiştirir.',
          'Bant aralığını (bandgap) ve iki yaklaşımı (sıkı bağ, Bloch/Bragg) hiç anmamak.'
        ],
        calis: [
          { st: 's09', not: 'Bant oluşumu simülasyonu: N atom, seviyelerin yarılması, metal/yalıtkan/yarıiletken doluluğu.' },
          { st: 's05', not: 'Tek kuyuda ayrık seviyeler (başlangıç noktası).' }
        ]
      },
      {
        no: 8, st: 's07', kavram: 'postulates of quantum mechanics', sekil: null,
        text: 'Explain the principles of quantum mechanics.',
        model: [
          'Postulate 1 (state): the state of a quantum system is described completely by a wave function ψ(x, t), and |ψ(x, t)|² dx is the probability of finding the particle between x and x + dx. ψ must be normalizable, ∫|ψ|² dx = 1.',
          'Postulate 2 (observables): every measurable physical quantity (observable) is represented by a Hermitian operator, for example x̂ = x, p̂ = −iħ ∂/∂x and the Hamiltonian Ĥ = p̂²/2m + V. Hermitian operators have real eigenvalues. Operators that do not commute, such as [x̂, p̂] = iħ, cannot be measured sharply together.',
          'Postulate 3 (measurement): the only possible results of a measurement of an observable A are the eigenvalues a_n of its operator, Âφ_n = a_n φ_n.',
          'If the state is ψ = Σ c_n φ_n, the probability of obtaining a_n is |c_n|² (Born rule), and Σ|c_n|² = 1. The expectation value is ⟨A⟩ = ∫ψ* Â ψ dx = Σ|c_n|² a_n.',
          'After the measurement the wave function collapses to the eigenfunction φ_n of the result, so an immediate repeated measurement gives the same value.',
          'Postulate 4 (time evolution): between measurements the wave function evolves deterministically and smoothly according to the time-dependent Schrödinger equation, iħ ∂ψ/∂t = Ĥψ.',
          'Stationary states ψ(x)e^{−iEt/ħ} come from the time-independent equation Ĥψ = Eψ, an eigenvalue problem whose boundary conditions give the quantization of energy.',
          'The superposition principle follows: any linear combination of allowed states is also an allowed state.',
          'Additional principles used with these: the uncertainty principle (a consequence of the commutator), the Pauli exclusion principle for identical fermions, and the correspondence principle, in which quantum mechanics reduces to classical mechanics for large systems.'
        ],
        anahtar: [
          'State is described by a wave function ψ; |ψ|² is the probability density (normalization).',
          'Observables are Hermitian operators (x̂, p̂ = −iħ d/dx, Ĥ); non-commuting operators cannot be sharp together.',
          'A measurement gives only an eigenvalue of the operator.',
          'Probability of a_n is |c_n|² for ψ = Σ c_n φ_n; collapse to φ_n after the measurement.',
          'Time evolution by the Schrödinger equation iħ ∂ψ/∂t = Ĥψ (deterministic between measurements).',
          'Superposition principle (and, optionally, the Pauli and uncertainty principles).'
        ],
        hatalar: [
          'Dalga fonksiyonunun fiziksel anlamını atlamak: ψ kendisi ölçülmez, |ψ|² olasılık yoğunluğudur.',
          'Schrödinger denkleminin dalga fonksiyonunu çökerttiğini yazmak: denklem belirlenimcidir, çökme ölçümle olur.',
          'Postülat numaralarını karıştırmak: hocanın "3. postülat = ölçüm" dediği sıralamayı kullan (1 durum, 2 operatör, 3 ölçüm, 4 zaman evrimi).'
        ],
        calis: [
          { st: 's07', not: 'Postülatlar, operatörler, özdeğer/özfonksiyon, ölçüm simülasyonu.' },
          { st: 's05', not: 'Schrödinger denklemi ve ψ\'nin olasılık yorumu.' }
        ]
      },
      {
        no: 9, st: 's07', kavram: 'measurement of a non-eigenstate', sekil: null,
        text: 'The third postulate of quantum mechanics concerns measurement; explain how the system changes its state if its current state is not an eigenstate of the observable being measured.',
        model: [
          'Postulate 3 says that a measurement of an observable A can only give one of the eigenvalues a_n of its operator Â, where Âφ_n = a_n φ_n.',
          'If the system is not in an eigenstate of Â, its state is a superposition of the eigenstates, ψ = Σ c_n φ_n, with c_n = ∫φ_n* ψ dx.',
          'Before the measurement the value of A is not defined; the system has only probabilities for the different results.',
          'The measurement gives one eigenvalue a_n at random; which one cannot be predicted for a single system, but the probability of a_n is |c_n|² and Σ|c_n|² = 1.',
          'At the moment of measurement the state changes abruptly: the wave function collapses (is projected) onto the eigenstate of the measured result, ψ → φ_n.',
          'If the eigenvalue is degenerate, the state is projected onto the subspace of the corresponding eigenfunctions and then normalized.',
          'Immediately after the measurement the system is in the eigenstate φ_n, so a repeated measurement of A gives the same value a_n with probability 1.',
          'The collapse is caused by the measurement (interaction with the apparatus), not by the Schrödinger equation: the Schrödinger equation evolves ψ smoothly and deterministically between measurements. This is the difference between postulate 3 and postulate 4.',
          'Example: for an electron in the superposition ψ = c₁φ₁ + c₂φ₂ of two energy eigenstates of an infinite well, an energy measurement gives E₁ with probability |c₁|² or E₂ with probability |c₂|², and the state becomes φ₁ or φ₂. The average over many identical systems is ⟨E⟩ = |c₁|²E₁ + |c₂|²E₂.',
          'If the system is already in an eigenstate, the result is certain and the state does not change.'
        ],
        anahtar: [
          'Only eigenvalues of the operator can be obtained as results.',
          'A non-eigenstate is a superposition ψ = Σ c_n φ_n of eigenstates.',
          'Probability of the result a_n is |c_n|² (Σ|c_n|² = 1); the individual outcome is random.',
          'The wave function collapses to the eigenstate φ_n of the measured result.',
          'Repeating the measurement immediately gives the same result (probability 1).',
          'Collapse is caused by the measurement, not by the Schrödinger equation (which is deterministic).'
        ],
        hatalar: [
          'Sonucun ⟨A⟩ ortalaması olduğunu söylemek: tek ölçüm yalnızca bir özdeğer verir, ortalama çok sayıda özdeş sistemin ortalamasıdır.',
          'Çökmeyi Schrödinger denkleminin yaptığını yazmak: çökme ölçümle olur, denklem belirlenimcidir.',
          'Ölçümden sonra durumun hâlâ süperpozisyon olduğunu düşünmek: ölçümden sonra durum özdurumdur ve tekrar ölçüm aynı sonucu verir.'
        ],
        calis: [
          { st: 's07', not: 'Ölçüm simülasyonu: süperpozisyon, olasılık |c_n|², çökme, tekrarlı ölçüm.' },
          { st: 's05', not: 'Enerji özdurumları (sonsuz kuyu) ve katsayılar.' }
        ]
      },
      {
        no: 10, st: 's08', kavram: 'uncertainty principle', sekil: null,
        text: 'Explain the uncertainty principle and why it is impossible to simultaneously measure conjugate variables with unlimited precision.',
        model: [
          'The Heisenberg uncertainty principle states that for position and momentum Δx Δp ≥ ħ/2, where Δx and Δp are the standard deviations of x and p in the same quantum state; ħ = h/2π = 1.055 × 10⁻³⁴ J·s.',
          'Position and momentum are conjugate variables; the energy-time pair obeys a similar relation, ΔE Δt ≥ ħ/2.',
          'In general, for any two observables, ΔA ΔB ≥ ½ |⟨[Â, B̂]⟩|. For x and p the commutator is [x̂, p̂] = iħ, which is not zero.',
          'Operators that do not commute have no common set of eigenfunctions. A state with a sharp position is not an eigenstate of p̂, and a state with a sharp momentum (a plane wave) is not an eigenstate of x̂, so both cannot be sharp at the same time.',
          'Wave picture: a particle is a wave packet. A plane wave e^{ikx} has a definite momentum p = ħk but is spread over all space (Δx = ∞).',
          'To localize the particle in a region Δx, many waves of different wavelengths must be added, so the wave number spreads by Δk ≳ 1/(2Δx), and Δp = ħΔk ≳ ħ/(2Δx). Position and momentum distributions are Fourier transforms of each other.',
          'Therefore the limit is not a defect of the measuring instruments or a disturbance caused by the measurement. It is a property of the quantum state itself, and it holds even for ideal measurements on identically prepared systems.',
          'Example: for an electron localized to Δx = 0.1 nm, Δp ≥ ħ/(2Δx) = 5.3 × 10⁻²⁵ kg·m/s, so Δv ≈ 5.8 × 10⁵ m/s, comparable with the speed of electrons in atoms. For a baseball (m = 0.145 kg, Δx = 1 mm) Δv ≈ 4 × 10⁻³¹ m/s, so it is unobservable.',
          'Consequences: confinement raises the kinetic energy (E ≳ ħ²/(8mL²)), so there is a zero-point energy and atoms (hydrogen) are stable; it also gives the natural linewidth of spectral lines through ΔE Δt ≥ ħ/2.'
        ],
        anahtar: [
          'Statement: Δx Δp ≥ ħ/2 (and ΔE Δt ≥ ħ/2).',
          'Conjugate variables correspond to non-commuting operators, [x̂, p̂] = iħ.',
          'No common eigenstates, so a state cannot be sharp in both x and p.',
          'Wave-packet / Fourier argument: narrow in x needs many wavelengths, so Δp is large.',
          'It is a fundamental property of quantum states, not due to apparatus imperfection or measurement disturbance.',
          'Consequences or numbers: zero-point energy, hydrogen stability, electron versus macroscopic body.'
        ],
        hatalar: [
          'Belirsizliği "ölçüm aleti ölçülen şeyi bozar" diye açıklamak: bu gözlemci etkisi, ilke ise durumun kendi özelliğidir.',
          'Δx Δp ≥ ħ/2 yerine eşitlik ya da ħ yerine h yazmak; Δ\'ların standart sapma olduğunu belirtmemek.',
          'Eşlenik (conjugate) değişken kavramını açıklamamak: komütatör [x, p] = iħ ve ortak özdurum yokluğu cevabın çekirdeğidir.'
        ],
        calis: [
          { st: 's08', not: 'Belirsizlik ilkesi, dalga paketi, ΔxΔp ve minimum enerji hesapları.' },
          { st: 's07', not: 'Operatörler ve komütatör, ölçüm.' }
        ]
      }
    ]
  };
})();
