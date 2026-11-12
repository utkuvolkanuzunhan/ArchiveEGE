# SINAV-4 · s10 sınav maddeleri ve seçki payı

- Dosya: `oyun/src/js/94-data-sinav-4.js` (tamamı İngilizce). build.sh `src/js/*.js` glob'uyla otomatik alıyor; 93'ten sonra, 97-tekrar'dan önce yüklenir.
- Eklenenler: s10 için 8 MCQ + 3 klasik (90-data-s10.js ile tutarlı): Fermi-Dirac f(E), f(E_F)=1/2, T=0 basamak, T artınca geçiş genişler, np=nᵢ², v_d=μE, J=q(nμₙ+pμₚ)E, saçılma ile v_d sabitlenmesi, nᵢ sıcaklık artışı. Kavramsal ağırlık.
- Seçki: s10'dan 2 MCQ (m1, m4) + 1 klasik (k3). Çıkarılanlar: MCQ sv-s03-m7, s06-m10; klasik sv-s03-k1 (gerekçe SECKI.md). Toplam 50 MCQ + 20 klasik korundu; örnek sınav karşılıkları yerinde.
- Havuz: 94 MCQ + 41 klasik.
- Test: `node oyun/test/sinav-dogrula.js` (MCQ ve klasik seçki dağılımı s10'u kapsıyor) OK; `node oyun/test/veri-dogrula.js` temiz.
