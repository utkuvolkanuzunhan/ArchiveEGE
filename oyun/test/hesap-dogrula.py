#!/usr/bin/env python3
"""hesap-dogrula.py: Hesap çalıştayı (src/js/87-data-hesap.js) sayısal sonuçlarını bağımsız olarak yeniden hesaplar.
Kullanım: python3 oyun/test/hesap-dogrula.py [--yaz]   (--yaz: değer tablosunu stdout'a yazar; hata varsa çıkış kodu 1)
Her görevin sonuc.deger değeri ve her sayısal adimSoru.sayiCevap.deger değeri, burada numpy/scipy ile hesaplanan
değerle %0,5 içinde eşleşmek zorundadır. Kontrolü olmayan görev de hata sayılır (doğrulanamayan sonuç yayımlanmaz).
Sabitler: CODATA 2018. Birimler: enerji eV, uzunluk nm (aksi belirtilmedikçe)."""
import json, math, os, subprocess, sys
import numpy as np
from scipy.optimize import brentq
from scipy.linalg import eigh_tridiagonal

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
hb = 1.054571817e-34; me = 9.1093837015e-31; qe = 1.602176634e-19; hP = 6.62607015e-34; cL = 2.99792458e8
kB = 8.617333262e-5          # eV/K
HC = hP * cL / qe * 1e9      # eV nm  (1239.84)
C = hb**2 / (2 * me) / qe * 1e18   # hbar^2/2m, eV nm^2  (0.0381)
PI2C = math.pi**2 * C        # 0.37603 eV nm^2
RY = 13.605693              # eV
KNM = 1 / math.sqrt(C)       # k = KNM*sqrt(E[eV]) nm^-1  (5.1232)

def veri():
    js = r"""
const vm=require('vm'),fs=require('fs'),p=require('path');
const ctx={};ctx.globalThis=ctx;vm.createContext(ctx);
const d=process.argv[1];
vm.runInContext(fs.readFileSync(p.join(d,'src/js/00-q.js'),'utf8'),ctx);
vm.runInContext(fs.readFileSync(p.join(d,'src/js/87-data-hesap.js'),'utf8'),ctx);
console.log(JSON.stringify(ctx.Q.data.hesap));"""
    out = subprocess.run(['node', '-e', js, ROOT], capture_output=True, text=True)
    if out.returncode: print(out.stderr); sys.exit(1)
    return json.loads(out.stdout)

# ---------------- bağımsız hesaplar ----------------
def kuyu_tam(V0=9.0, d=10.0, w=20.0, n=1):
    """Sonsuz duvarlı L=2w+d kuyunun ortasında V0 yüksekliğinde, d kalınlığında engel: çift pariteli tam öz değer koşulu
    k cot(kw) = -kappa tanh(kappa d/2)."""
    k = lambda E: math.sqrt(E / C); kp = lambda E: math.sqrt((V0 - E) / C)
    f = lambda E: k(E) / math.tan(k(E) * w) + kp(E) * math.tanh(kp(E) * d / 2)
    e0 = (n * math.pi / w)**2 * C
    return brentq(f, e0 * 0.9, e0 * (1 - 1e-9), xtol=1e-16)

def kuyu_fd(dx=0.02, V0=9.0, L=50.0, a=20.0, b=30.0, n=6):
    x = np.arange(dx, L, dx); V = np.where((x > a) & (x < b), V0, 0.0)
    ev = eigh_tridiagonal(2 * C / dx**2 + V, -C / dx**2 * np.ones(len(x) - 1), select='i', select_range=(0, n - 1))[0]
    return ev

def R_basamak(E, V0):
    k1 = KNM * math.sqrt(E); k2 = KNM * math.sqrt(E - V0)
    return ((k1 - k2) / (k1 + k2))**2

def fermi(dE, T): return 1 / (1 + math.exp(dE / (kB * T)))

# id -> {'s': sonuc, 'a': {adim indeksi: değer}}
def kontroller():
    A = {}
    kap0 = KNM * math.sqrt(9.0)       # E<<V0 için kappa
    # s01
    A['atom-fcc'] = dict(s=4, a={0: 1, 1: 3})
    A['si-yogunluk'] = dict(s=8 / (0.543e-7)**3 / 1e22, a={0: 8, 1: (0.543e-7)**3 / 1e-22})
    # s02
    A['pack-fcc'] = dict(s=math.pi * math.sqrt(2) / 6, a={0: 4, 1: math.sqrt(2) / 4})
    A['pack-bcc'] = dict(s=math.pi * math.sqrt(3) / 8, a={0: 2, 1: math.sqrt(3) / 4})
    A['miller-326'] = dict(s=0.543 / 7, a={0: 6, 1: 49})
    A['miller-210'] = dict(s=0.5 / math.sqrt(5), a={0: 5})
    # s03
    A['foton-400'] = dict(s=HC / 400, a={})
    A['foto-cu'] = dict(s=HC / 250 - 4.7, a={0: HC / 250})
    A['foto-esik'] = dict(s=HC / 2.3, a={})
    # s04
    A['bohr-gecis'] = dict(s=HC / (RY * (1 / 4 - 1 / 9)), a={0: RY * (1 / 4 - 1 / 9)})
    A['bohr-iyon'] = dict(s=RY / 4, a={})
    A['debroglie-100'] = dict(s=2 * math.pi * math.sqrt(C / 100), a={0: KNM * math.sqrt(100)})
    A['debroglie-lam'] = dict(s=(2 * math.pi)**2 * C / 0.5**2, a={})
    # s05
    A['q5-bolgeler'] = dict(s=kap0 * 10, a={0: 3, 3: kap0})
    A['q5-bos-kuyu'] = dict(s=PI2C / 2500 * 1e3, a={0: 0.2, 1: 2500})
    A['q5-basit'] = dict(s=3 * PI2C / 2500 * 1e3, a={})
    A['q5-perturbasyon'] = dict(s=9.0 * (10 / 50 - (math.sin(2 * math.pi * 30 / 50) - math.sin(2 * math.pi * 20 / 50)) / (2 * math.pi)), a={0: 10 / 50})
    A['q5-sayisal'] = dict(s=kuyu_tam(n=1) * 1e3, a={0: PI2C / 400 * 1e3})
    A['kuyu-norm'] = dict(s=math.sqrt(2 / 5), a={0: 2.5})
    A['kuyu-foton'] = dict(s=HC / (3 * PI2C / 4) / 1000, a={0: PI2C / 4})
    # s06
    A['q6-e-gt'] = dict(s=R_basamak(10, 5), a={0: KNM * math.sqrt(10), 1: KNM * math.sqrt(5)})
    A['q6-e-lt'] = dict(s=1 / (KNM * math.sqrt(2)), a={0: KNM * math.sqrt(2), 1: 4 * 3 / 5})
    A['tunel-1nm'] = dict(s=math.exp(-2 * KNM * math.sqrt(3) * 1.0), a={0: KNM * math.sqrt(3)})
    # s07
    A['olc-p'] = dict(s=0.8, a={0: 1 / math.sqrt(5)})
    A['olc-E'] = dict(s=0.75 * PI2C / 4 + 0.25 * 4 * PI2C / 4, a={0: PI2C / 4})
    # s08
    A['bel-v'] = dict(s=hb / (2 * 0.1e-9) / me / 1e3, a={0: hb / (2 * 0.1e-9) * 1e25})
    A['bel-t'] = dict(s=hb / (2 * 1e-9) / qe * 1e6, a={})
    # s09
    A['bant-si'] = dict(s=HC / 1.12, a={})
    A['bant-gaas'] = dict(s=HC / 1.42, a={})
    # s10
    A['fd-100meV'] = dict(s=fermi(0.1, 300), a={0: kB * 300 * 1e3, 1: 0.1 / (kB * 300)})
    A['fd-orta'] = dict(s=fermi(0.0, 300), a={})
    A['np-ni'] = dict(s=1.5e10**2 / 1e16, a={})
    A['drift-v'] = dict(s=1350, a={})
    A['drift-J'] = dict(s=qe * 1e16 * 1350 * 10, a={0: qe * 1e16 * 1350})
    return A

def esles(a, b, tol=5e-3): return abs(a - b) <= tol * max(abs(b), 1e-300)

def main():
    yaz = '--yaz' in sys.argv
    veriler = veri(); A = kontroller(); hata = 0; n = 0
    # bağımsız çapraz denetimler (tam çözüm ~ FD ~ sınır ~ pert)
    e1 = kuyu_tam(n=1) * 1e3; e2 = kuyu_tam(n=2) * 1e3; e3 = kuyu_tam(n=3) * 1e3
    fd = kuyu_fd() * 1e3
    cap = [(e1, 0.5 * (fd[0] + fd[1])), (e2, 0.5 * (fd[2] + fd[3])), (e3, 0.5 * (fd[4] + fd[5]))]
    print('Q5 tam (meV): E1=%.5f E2=%.5f E3=%.5f | FD ortalama: %s | boş 50 nm: %s | iki kuyu sınırı 20 nm: %s'
          % (e1, e2, e3, ' '.join('%.5f' % c[1] for c in cap), ' '.join('%.5f' % (PI2C / 2500 * k * k * 1e3) for k in (1, 2, 3)),
             ' '.join('%.5f' % (PI2C / 400 * k * k * 1e3) for k in (1, 2, 3))))
    for (t, f) in cap:
        n += 1
        if not esles(t, f, 5e-3): print('HATA FD-tam uyumsuz', t, f); hata += 1
    print('kappa(E->0, V0=9)=%.4f nm^-1, kappa*d=%.2f, e^-kd=%.2e' % (KNM * 3, KNM * 30, math.exp(-KNM * 30)))
    print('basamak R(E=2V0)=%.5f ; E=10,V0=5: T=%.5f' % (R_basamak(10, 5), 1 - R_basamak(10, 5)))
    t_ust = 1 / (1 + 16 * math.sinh(KNM * math.sqrt(3))**2 / (4 * 1 * 3))
    print('tünel E=1,V0=4,a=1nm: e^-2ka=%.3e, tam T=%.3e' % (math.exp(-2 * KNM * math.sqrt(3)), t_ust))
    # metinde geçen sabit sayıların doğrulanması
    weff = PI2C / (20 + 1 / (KNM * 3)) ** 2 * 1e3
    P = 10 / 50 - (math.sin(2 * math.pi * 30 / 50) - math.sin(2 * math.pi * 20 / 50)) / (2 * math.pi)
    lit = [('Q5 E1', e1, 0.9340), ('Q5 E2', e2, 3.7360), ('Q5 E3', e3, 8.4059), ('w_eff E1', weff, 0.9340), ('1/kappa', 1 / (KNM * 3), 0.065),
           ('P engel', P, 0.3871), ('E2-E1 bos', 3 * PI2C / 2500 * 1e3, 0.4512), ('E2 bos', 4 * PI2C / 2500 * 1e3, 0.6016), ('E3 bos', 9 * PI2C / 2500 * 1e3, 1.354),
           ('tam T tunel', t_ust, 5.88e-8), ('T q6', 1 - R_basamak(10, 5), 0.971), ('R/(E=2V0)', R_basamak(2, 1), 0.0294), ('lambda 1000nm', HC / 1000, 1.24),
           ('E1 L=2nm', PI2C / 4, 0.0940), ('pert/spacing', 9 * P / (3 * PI2C / 2500), 7.7e3), ('Bohr 13.6 kullanimi', HC / (13.6 * 5 / 36), 656.4)]
    for ad, h, b in lit:
        n += 1
        if not esles(h, b, 1.5e-2 if ad in ('1/kappa', 'Bohr 13.6 kullanimi') else 5e-3): print('HATA metin sayisi', ad, h, b); hata += 1
    ids = set()
    for g in veriler:
        ids.add(g['id'])
        if g['id'] not in A: print('HATA kontrolsüz görev:', g['id']); hata += 1; continue
        k = A[g['id']]; n += 1
        if yaz: print('%-16s sonuc=%.6g (veri %.6g)' % (g['id'], k['s'], g['sonuc']['deger']))
        if not esles(g['sonuc']['deger'], k['s']): print('HATA %s sonuc: veri=%r hesap=%r' % (g['id'], g['sonuc']['deger'], k['s'])); hata += 1
        for i, ad in enumerate(g['adimlar']):
            q = ad.get('adimSoru')
            if q and q.get('sayiCevap'):
                n += 1
                if i not in k['a']: print('HATA %s adım %d sayısal ama kontrolsüz' % (g['id'], i)); hata += 1
                elif not esles(q['sayiCevap']['deger'], k['a'][i]): print('HATA %s adım %d: veri=%r hesap=%r' % (g['id'], i, q['sayiCevap']['deger'], k['a'][i])); hata += 1
    for i in A:
        if i not in ids: print('UYARI kontrol var, görev yok:', i)
    # her istasyon için en az bir istasyonSonu görevi
    for s in ['s%02d' % i for i in range(1, 11)]:
        c = [g for g in veriler if g.get('istasyon') == s and g.get('istasyonSonu')]
        n += 1
        if not c: print('HATA', s, 'için istasyonSonu görevi yok'); hata += 1
    print('%d kontrol, %d hata' % (n, hata))
    sys.exit(1 if hata else 0)

if __name__ == '__main__': main()
