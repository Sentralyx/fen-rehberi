// Hâl Değiştirici – ısıtma/soğutma ile maddenin hâl değişimini keşfet (5-6. sınıf, madde ünitesi)
(function () {
  'use strict';
  var kok = document.getElementById('oyun');
  if (!kok) return;
  var KAYIT = 'fen-hal-degistirici-v1';

  var MADDE = {
    su: { ad: 'Su', Tm: 0, Tb: 100, cs: 2.1, cl: 4.18, cg: 2.0, Lf: 334, Lv: 2260, lo: -40, hi: 150, nm: 'Erime/donma noktası', nb: 'Kaynama noktası' },
    alkol: { ad: 'Etil alkol', Tm: -114, Tb: 78, cs: 1.9, cl: 2.44, cg: 1.4, Lf: 108, Lv: 846, lo: -150, hi: 110, nm: 'Erime/donma noktası', nb: 'Kaynama noktası' },
    kurubuz: { ad: 'Kuru buz (katı CO₂)', Ts: -78, cs: 0.85, cg: 0.85, Ls: 571, sub: true, lo: -120, hi: -40, ns: 'Süblimleşme noktası' }
  };
  function Hb(m) { return m.Lf + m.cl * (m.Tb - m.Tm); }

  // Isı içeriğinden (H) sıcaklık, hâl ve oran hesabı
  function hesapla(m, H) {
    if (m.sub) {
      if (H < 0) return { T: m.Ts + H / m.cs, faz: 'kati', f: 0 };
      if (H < m.Ls) return { T: m.Ts, faz: 'suplim', f: H / m.Ls };
      return { T: m.Ts + (H - m.Ls) / m.cg, faz: 'gaz', f: 1 };
    }
    var hb = Hb(m);
    if (H < 0) return { T: m.Tm + H / m.cs, faz: 'kati', f: 0 };
    if (H < m.Lf) return { T: m.Tm, faz: 'erime', f: H / m.Lf };
    if (H < hb) return { T: m.Tm + (H - m.Lf) / m.cl, faz: 'sivi', f: 1 };
    if (H < hb + m.Lv) return { T: m.Tb, faz: 'kaynama', f: (H - hb) / m.Lv };
    return { T: m.Tb + (H - hb - m.Lv) / m.cg, faz: 'gaz', f: 1 };
  }
  function hTemp(m, T, faz) {
    if (m.sub) return faz === 'gaz' ? m.Ls + m.cg * (T - m.Ts) : m.cs * (T - m.Ts);
    if (faz === 'kati') return m.cs * (T - m.Tm);
    if (faz === 'sivi') return m.Lf + m.cl * (T - m.Tm);
    return Hb(m) + m.Lv + m.cg * (T - m.Tb);
  }

  var GOREVLER = [
    { ad: 'Buzu erit', madde: 'su', T0: -20, faz: 'kati', hedef: 'sivi', gorev: 'Buz kalıbını tamamen sıvı suya dönüştür.',
      soru: 'Buz erirken (katı ve sıvı birlikteyken) termometre ne gösterdi?',
      sec: ['0 °C’ta sabit kaldı', 'Sürekli yükseldi', '0 °C’tan düşüktü', '100 °C’a çıktı'],
      acik: 'Saf bir madde erirken sıcaklığı sabit kalır (suda 0 °C). Verilen ısı sıcaklığı artırmak yerine tanecikleri bir arada tutan bağları gevşetmek için harcanır. Grafikte bu bölüm yatay çizgi olarak görünür.' },
    { ad: 'Suyu kaynat', madde: 'su', T0: 20, faz: 'sivi', hedef: 'gaz', gorev: 'Suyu tamamen buhar hâline getir.',
      soru: 'Grafikte kaynama basamağı, erime basamağından neden daha uzun?',
      sec: ['Sıvıyı gaza çevirmek, katıyı sıvıya çevirmekten çok daha fazla ısı gerektirir', 'Kaynarken ısıtıcı daha az ısı verir', 'Buhar suyu daha çok ısıtır', 'Kaynama sırasında sıcaklık hızla artar'],
      acik: 'Kaynarken tanecikler arasındaki bağlar tamamen koparılır; bunun için erimeye göre çok daha fazla enerji gerekir (buharlaşma ısısı > erime ısısı). Bu sırada sıcaklık 100 °C’ta sabit kalır.' },
    { ad: 'Buharı yoğuştur', madde: 'su', T0: 120, faz: 'gaz', hedef: 'sivi', gorev: 'Su buharını soğutarak sıvı suya dönüştür.',
      soru: 'Yoğuşma sırasında su, çevresiyle ısı alışverişi bakımından ne yapar?',
      sec: ['Çevresine ısı verir', 'Çevresinden ısı alır', 'Isı alışverişi yapmaz', 'Önce ısı alır, sonra ısı verir'],
      acik: 'Yoğuşma, buharlaşmanın tersidir: tanecikler bir araya gelirken enerji çevreye verilir. Soğuk bir bardağın dışında su damlacıklarının oluşması buna örnektir. Yoğuşma sırasında sıcaklık 100 °C’ta sabit kalır.' },
    { ad: 'Suyu dondur', madde: 'su', T0: 20, faz: 'sivi', hedef: 'kati', gorev: 'Sıvı suyu soğutarak buza dönüştür.',
      soru: 'Su donarken sıcaklık kaç °C’ta sabit kaldı ve bu sıcaklığa ne denir?',
      sec: ['0 °C; donma noktası, erime noktasıyla aynıdır', '0 °C; donma noktası, erime noktasından düşüktür', '100 °C; donma noktasıdır', '−20 °C; donma noktasıdır'],
      acik: 'Saf bir maddenin donma noktası, erime noktasına eşittir (su için 0 °C). Donma sırasında madde çevresine ısı verir ve sıcaklık hâl değişimi bitene kadar sabit kalır.' },
    { ad: 'Alkolü kaynat', madde: 'alkol', T0: 20, faz: 'sivi', hedef: 'gaz', gorev: 'Etil alkolü tamamen buhar hâline getir ve suyla karşılaştır.',
      soru: 'Aynı ısıtıcıyla 20 °C’taki su ve etil alkol ısıtılsaydı hangisi önce kaynamaya başlar?',
      sec: ['Etil alkol; kaynama noktası daha düşüktür', 'Su; kaynama noktası daha yüksek olduğu için', 'İkisi aynı anda kaynar', 'Etil alkol; erime noktası daha düşük olduğu için'],
      acik: 'Kaynama noktası maddeye özgüdür: etil alkol yaklaşık 78 °C’ta, su 100 °C’ta kaynar. Kaynama noktası düşük olan madde aynı koşullarda daha erken kaynar. Bu özellik karışımları ayırmada kullanılır (damıtma).' },
    { ad: 'Kuru buzu ısıt', madde: 'kurubuz', T0: -90, faz: 'kati', hedef: 'gaz', gorev: 'Kuru buzu ısıt. Dikkatle izle: sıvı hâl oluşuyor mu?',
      soru: 'Kuru buz ısıtılırken sıvı hâl gözlendi mi? Bu olaya ne denir?',
      sec: ['Hayır; katıdan doğrudan gaza geçti, buna süblimleşme denir', 'Evet; önce eridi, buna erime denir', 'Hayır; buna kırağılaşma denir', 'Evet; buna buharlaşma denir'],
      acik: 'Kuru buz (katı karbondioksit) normal basınçta erimeden doğrudan gaza geçer; bu olaya süblimleşme denir. Gazın doğrudan katıya dönmesine kırağılaşma denir. Naftalin ve iyot da süblimleşen maddelerdendir.' }
  ];

  var kayit = {};
  try { kayit = JSON.parse(localStorage.getItem(KAYIT) || '{}'); } catch (e) { kayit = {}; }
  kayit.bitti = kayit.bitti || [];
  function kaydet() { try { localStorage.setItem(KAYIT, JSON.stringify(kayit)); } catch (e) {} }

  function e(tag, attrs, ic) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (a) {
      if (a === 'class') n.className = attrs[a]; else if (a === 'html') n.innerHTML = attrs[a]; else n.setAttribute(a, attrs[a]);
    });
    if (ic) n.textContent = ic;
    return n;
  }

  /* ---------- Durum ---------- */
  var N = 64, W = 360, Ht = 300, ZEMIN = 288;
  var sev = 0, gorev = null, mad = MADDE.su, H = 0, guc = 0, hiz = 1, yon = 1;
  var parc = [], gecmis = [], tz = 0, sonKayit = 0, bitirildi = false, soruAcik = false;
  var el = {}, ctx, gctx, dpr = window.devicePixelRatio || 1, rafId = 0, sonZ = 0;

  function parcaciklariKur() {
    parc = [];
    var kol = 8, sat = 8, ax = 26, ay = 24;
    var x0 = (W - (kol - 1) * ax) / 2;
    for (var r = 0; r < sat; r++) for (var c = 0; c < kol; c++) {
      var hx = x0 + c * ax + (r % 2 ? 8 : 0), hy = ZEMIN - 10 - r * ay;
      parc.push({ hx: hx, hy: hy, x: hx, y: hy, vx: 0, vy: 0, tip: 0, rank: 0, satir: r });
    }
    // Üst satırlar önce erir: rank üstten alta
    var sirali = parc.slice().sort(function (a, b) { return (b.satir - a.satir) || (Math.random() - 0.5); });
    sirali.forEach(function (p, i) { p.rank = i; });
  }

  function yukle(i) {
    sev = i;
    gorev = i === 'serbest' ? null : GOREVLER[i];
    mad = gorev ? MADDE[gorev.madde] : MADDE.su;
    baslat(gorev ? gorev.T0 : 20, gorev ? gorev.faz : 'sivi');
    cizUI();
  }
  function baslat(T, faz) {
    H = hTemp(mad, T, faz);
    guc = 0; hiz = 1; bitirildi = false; soruAcik = false; gecmis = []; tz = 0; sonKayit = 0;
    parcaciklariKur();
    var d = hesapla(mad, H);
    parc.forEach(function (p) { p.tip = tipBul(p, d); if (p.tip > 0) { p.x = p.hx; p.y = p.hy; } });
    if (d.faz === 'gaz') parc.forEach(function (p) { p.x = 20 + Math.random() * (W - 40); p.y = 20 + Math.random() * (ZEMIN - 40); hizVer(p, d.T); });
    else if (d.faz === 'sivi') parc.forEach(function (p) { p.y = ZEMIN - 10 - Math.random() * 60; p.x = 20 + Math.random() * (W - 40); });
  }
  function tipBul(p, d) {
    var n = Math.round(d.f * N);
    switch (d.faz) {
      case 'kati': return 0;
      case 'sivi': return 1;
      case 'gaz': return 2;
      case 'erime': return p.rank < n ? 1 : 0;
      case 'kaynama': return p.rank < n ? 2 : 1;
      case 'suplim': return p.rank < n ? 2 : 0;
    }
    return 0;
  }
  function hizVer(p, T) {
    var a = Math.random() * 6.283, s = 2.2 * Math.sqrt((T + 273) / 300) + 0.8;
    p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s;
  }

  /* ---------- Arayüz ---------- */
  function cizUI() {
    cancelAnimationFrame(rafId);
    kok.innerHTML = '';
    var chips = e('div', { class: 'oy-chips' });
    GOREVLER.forEach(function (g, i) {
      var tamam = kayit.bitti.indexOf(i) >= 0;
      var b = e('button', { type: 'button', class: 'oy-chip' + (sev === i ? ' aktif' : '') + (tamam ? ' bitti' : '') }, (tamam ? '✓ ' : '') + (i + 1));
      b.title = g.ad;
      b.addEventListener('click', function () { yukle(i); });
      chips.appendChild(b);
    });
    var bs = e('button', { type: 'button', class: 'oy-chip' + (sev === 'serbest' ? ' aktif' : '') }, '🧪 Serbest');
    bs.addEventListener('click', function () { yukle('serbest'); });
    chips.appendChild(bs);
    kok.appendChild(chips);

    var gv = e('div', { class: 'oy-gorev' });
    gv.appendChild(e('h2', {}, gorev ? 'Görev ' + (sev + 1) + ': ' + gorev.ad : '🧪 Serbest mod'));
    if (gorev) {
      gv.appendChild(e('p', { class: 'oy-hedef' }, '🎯 ' + gorev.gorev));
      gv.appendChild(e('p', { class: 'oy-hikaye' }, 'Madde: ' + mad.ad + ' · Isıtıcıyı kaydır, grafiği izle.'));
    } else {
      var sc = e('p', { class: 'oy-hikaye' }, 'Madde seç: ');
      Object.keys(MADDE).forEach(function (k) {
        var b = e('button', { type: 'button', class: 'oy-chip' + (MADDE[k] === mad ? ' aktif' : '') }, MADDE[k].ad);
        b.addEventListener('click', function () {
          mad = MADDE[k];
          baslat(k === 'kurubuz' ? -90 : 20, k === 'kurubuz' ? 'kati' : 'sivi');
          cizUI();
        });
        sc.appendChild(b);
      });
      gv.appendChild(sc);
    }
    kok.appendChild(gv);

    var alan = e('div', { class: 'hal-alan' });
    var sol = e('div', { class: 'hal-sol' });
    el.cv = e('canvas', { class: 'hal-cv', width: W * dpr, height: Ht * dpr });
    el.cv.style.maxWidth = W + 'px';
    sol.appendChild(el.cv);
    alan.appendChild(sol);
    var sag = e('div', { class: 'hal-sag' });
    var ust = e('div', { class: 'hal-ust' });
    el.termo = e('div', { class: 'hal-termo' }, '');
    el.termo.innerHTML = '<div class="hal-civa"></div>';
    var bilgi = e('div', { class: 'hal-bilgi' });
    el.derece = e('div', { class: 'hal-derece' });
    el.faz = e('div', { class: 'hal-faz' });
    bilgi.appendChild(el.derece); bilgi.appendChild(el.faz);
    ust.appendChild(el.termo); ust.appendChild(bilgi);
    sag.appendChild(ust);
    el.gcv = e('canvas', { class: 'hal-gcv', width: 420 * dpr, height: 250 * dpr });
    el.gcv.style.maxWidth = '420px';
    sag.appendChild(e('div', { class: 'hal-gbaslik' }, '📈 Sıcaklık – zaman grafiği'));
    sag.appendChild(el.gcv);
    alan.appendChild(sag);
    kok.appendChild(alan);

    var ctl = e('div', { class: 'hal-ctl' });
    ctl.appendChild(e('span', { class: 'hal-soguk' }, '❄️ Soğut'));
    el.sl = e('input', { type: 'range', min: -100, max: 100, value: 0, step: 5, class: 'hal-sl', 'aria-label': 'Isıtıcı gücü' });
    el.sl.value = guc;
    el.sl.addEventListener('input', function () { guc = +el.sl.value; if (guc !== 0) yon = guc > 0 ? 1 : -1; });
    ctl.appendChild(el.sl);
    ctl.appendChild(e('span', { class: 'hal-sicak' }, '🔥 Isıt'));
    var hb = e('button', { type: 'button', class: 'oy-arac' }, '⏩ Hız ×' + hiz);
    hb.addEventListener('click', function () { hiz = hiz === 1 ? 3 : 1; hb.textContent = '⏩ Hız ×' + hiz; });
    ctl.appendChild(hb);
    var kapa = e('button', { type: 'button', class: 'oy-arac' }, '⏸ Dur');
    kapa.addEventListener('click', function () { guc = 0; el.sl.value = 0; });
    ctl.appendChild(kapa);
    var sf = e('button', { type: 'button', class: 'oy-arac oy-sifir' }, '↺ Baştan');
    sf.addEventListener('click', function () { yukle(sev); });
    ctl.appendChild(sf);
    kok.appendChild(ctl);

    el.sonuc = e('div', { class: 'oy-sonuc' });
    kok.appendChild(el.sonuc);

    ctx = el.cv.getContext('2d'); gctx = el.gcv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sonZ = performance.now();
    rafId = requestAnimationFrame(dongu);
  }

  /* ---------- Benzetim ---------- */
  function faradi(d) {
    var ad = {
      kati: 'Katı', sivi: 'Sıvı', gaz: 'Gaz',
      erime: yon > 0 ? 'Erime (katı + sıvı birlikte)' : 'Donma (sıvı + katı birlikte)',
      kaynama: yon > 0 ? 'Kaynama (sıvı + gaz birlikte)' : 'Yoğuşma (gaz + sıvı birlikte)',
      suplim: yon > 0 ? 'Süblimleşme (katı + gaz birlikte)' : 'Kırağılaşma (gaz + katı birlikte)'
    };
    return ad[d.faz];
  }

  function dongu(zaman) {
    var dt = Math.min(0.05, (zaman - sonZ) / 1000); sonZ = zaman;
    var d = hesapla(mad, H);
    if (guc !== 0 && !(bitirildi && soruAcik)) {
      var alt = hTemp(mad, mad.lo, 'kati'), ust = hTemp(mad, mad.hi, 'gaz');
      var dH = guc * 2.2 * dt * hiz, parca = Math.min(300, Math.ceil(Math.abs(dH) / 3));
      for (var q = 0; q < parca; q++) {
        H += dH / parca;
        if (H < alt) H = alt;
        if (H > ust) H = ust;
        d = hesapla(mad, H);
        if (gorev && d.faz === gorev.hedef) break;
      }
      tz += dt * hiz;
      if (tz - sonKayit >= 0.25) { gecmis.push([tz, d.T]); sonKayit = tz; if (gecmis.length > 1500) gecmis.shift(); }
    }
    var adim = Math.max(1, Math.round(dt * 60 * 1));
    for (var s = 0; s < adim; s++) fizik(d);
    ciz(d);
    gorevKontrol(d);
    rafId = requestAnimationFrame(dongu);
  }

  function fizik(d) {
    var sp = Math.sqrt((d.T + 273) / 300);
    var sivilar = [];
    parc.forEach(function (p) {
      var yeni = tipBul(p, d);
      if (yeni === 2 && p.tip !== 2) hizVer(p, d.T);
      p.tip = yeni;
      if (p.tip === 0) {
        p.vx += (p.hx - p.x) * 0.1; p.vy += (p.hy - p.y) * 0.1;
        p.vx *= 0.8; p.vy *= 0.8;
        var j = 0.25 + 0.5 * Math.max(0, Math.min(1, (d.T - mad.lo) / ((mad.sub ? mad.Ts : mad.Tm) - mad.lo)));
        p.vx += (Math.random() - 0.5) * j; p.vy += (Math.random() - 0.5) * j;
      } else if (p.tip === 1) {
        p.vy += 0.25;
        p.vx += (Math.random() - 0.5) * 0.9 * sp; p.vy += (Math.random() - 0.5) * 0.9 * sp;
        p.vx *= 0.94; p.vy *= 0.94;
        sivilar.push(p);
      } else {
        var v = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 1, hedef = 2.4 * sp + 0.6;
        p.vx *= 1 + (hedef / v - 1) * 0.1; p.vy *= 1 + (hedef / v - 1) * 0.1;
      }
      p.x += p.vx; p.y += p.vy;
      if (p.x < 10) { p.x = 10; p.vx = Math.abs(p.vx); } else if (p.x > W - 10) { p.x = W - 10; p.vx = -Math.abs(p.vx); }
      if (p.y > ZEMIN) { p.y = ZEMIN; p.vy = -Math.abs(p.vy) * (p.tip === 1 ? 0.3 : 1); }
      if (p.y < 12) { p.y = 12; p.vy = Math.abs(p.vy); }
    });
    for (var i = 0; i < sivilar.length; i++) for (var k = i + 1; k < sivilar.length; k++) {
      var a = sivilar[i], b = sivilar[k], dx = b.x - a.x, dy = b.y - a.y, m2 = dx * dx + dy * dy;
      if (m2 < 324 && m2 > 0.01) {
        var m = Math.sqrt(m2), it = (18 - m) / 2 / m;
        a.x -= dx * it; a.y -= dy * it; b.x += dx * it; b.y += dy * it;
      }
    }
  }

  function renk(T) {
    var t = Math.max(0, Math.min(1, (T - mad.lo) / (mad.hi - mad.lo)));
    return 'hsl(' + Math.round(215 - 215 * t) + ',80%,55%)';
  }

  function ciz(d) {
    ctx.clearRect(0, 0, W, Ht);
    // kap
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, Ht);
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(4, 4); ctx.lineTo(4, ZEMIN + 8); ctx.lineTo(W - 4, ZEMIN + 8); ctx.lineTo(W - 4, 4); ctx.closePath(); ctx.stroke();
    // ısıtıcı / soğutucu
    var g = Math.abs(guc) / 100;
    if (guc !== 0) {
      var gr = ctx.createLinearGradient(0, ZEMIN + 8, 0, Ht);
      if (guc > 0) { gr.addColorStop(0, 'rgba(249,115,22,' + (0.35 + 0.65 * g) + ')'); gr.addColorStop(1, 'rgba(250,204,21,0)'); }
      else { gr.addColorStop(0, 'rgba(56,189,248,' + (0.35 + 0.65 * g) + ')'); gr.addColorStop(1, 'rgba(186,230,253,0)'); }
      ctx.fillStyle = gr; ctx.fillRect(4, ZEMIN + 9, W - 8, Ht - ZEMIN - 9);
      ctx.font = (14 + 16 * g) + 'px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(guc > 0 ? '🔥🔥🔥' : '❄️❄️❄️', W / 2, Ht - 2);
    }
    // parçacıklar
    var c = renk(d.T);
    parc.forEach(function (p) {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.tip === 2 ? 6 : 8, 0, 6.283);
      ctx.fillStyle = c; ctx.globalAlpha = p.tip === 2 ? 0.75 : 1; ctx.fill();
      ctx.globalAlpha = 1; ctx.strokeStyle = 'rgba(15,23,42,.35)'; ctx.lineWidth = 1; ctx.stroke();
    });
    // arayüz
    var oran = Math.max(0, Math.min(1, (d.T - mad.lo) / (mad.hi - mad.lo)));
    el.termo.firstChild.style.height = (oran * 100) + '%';
    el.termo.firstChild.style.background = renk(d.T);
    el.derece.textContent = (Math.round(d.T * 10) / 10).toString().replace('.', ',') + ' °C';
    el.faz.textContent = faradi(d);
    grafik();
  }

  function grafik() {
    var gw = 420, gh = 250, L = 46, R = 12, T = 12, B = 30;
    gctx.clearRect(0, 0, gw, gh);
    gctx.fillStyle = '#fff'; gctx.fillRect(0, 0, gw, gh);
    var lo = mad.lo, hi = mad.hi;
    function Y(v) { return T + (hi - v) / (hi - lo) * (gh - T - B); }
    var xmax = Math.max(40, tz * 1.05);
    function X(t) { return L + t / xmax * (gw - L - R); }
    gctx.font = '11px sans-serif'; gctx.textAlign = 'right'; gctx.fillStyle = '#64748b'; gctx.strokeStyle = '#e5e9f0'; gctx.lineWidth = 1;
    var adim = (hi - lo) > 200 ? 50 : 20;
    for (var v = Math.ceil(lo / adim) * adim; v <= hi; v += adim) {
      gctx.beginPath(); gctx.moveTo(L, Y(v)); gctx.lineTo(gw - R, Y(v)); gctx.stroke();
      gctx.fillText(v + '', L - 6, Y(v) + 4);
    }
    // referans çizgileri
    gctx.setLineDash([5, 4]); gctx.lineWidth = 1.5; gctx.textAlign = 'left';
    function ref(deger, etiket, renkK) {
      gctx.strokeStyle = renkK; gctx.fillStyle = renkK;
      gctx.beginPath(); gctx.moveTo(L, Y(deger)); gctx.lineTo(gw - R, Y(deger)); gctx.stroke();
      gctx.fillText(etiket + ' (' + deger + ' °C)', L + 6, Y(deger) - 4);
    }
    if (mad.sub) ref(mad.Ts, mad.ns, '#7c3aed'); else { ref(mad.Tm, mad.nm, '#2563eb'); ref(mad.Tb, mad.nb, '#dc2626'); }
    gctx.setLineDash([]);
    // eksenler
    gctx.strokeStyle = '#475569'; gctx.lineWidth = 2;
    gctx.beginPath(); gctx.moveTo(L, T); gctx.lineTo(L, gh - B); gctx.lineTo(gw - R, gh - B); gctx.stroke();
    gctx.fillStyle = '#475569'; gctx.textAlign = 'center'; gctx.font = '12px sans-serif';
    gctx.fillText('Zaman →', (L + gw - R) / 2, gh - 8);
    gctx.save(); gctx.translate(12, (T + gh - B) / 2); gctx.rotate(-Math.PI / 2); gctx.fillText('Sıcaklık (°C)', 0, 0); gctx.restore();
    // eğri
    if (gecmis.length > 1) {
      gctx.strokeStyle = '#0d9488'; gctx.lineWidth = 3; gctx.lineJoin = 'round'; gctx.beginPath();
      gecmis.forEach(function (pt, i) { if (i === 0) gctx.moveTo(X(pt[0]), Y(pt[1])); else gctx.lineTo(X(pt[0]), Y(pt[1])); });
      gctx.stroke();
      var son = gecmis[gecmis.length - 1];
      gctx.fillStyle = '#0d9488'; gctx.beginPath(); gctx.arc(X(son[0]), Y(son[1]), 4.5, 0, 6.283); gctx.fill();
    } else {
      gctx.fillStyle = '#94a3b8'; gctx.textAlign = 'center'; gctx.font = '13px sans-serif';
      gctx.fillText('Isıtıcıyı kaydırınca grafik çizilir', (L + gw - R) / 2, (T + gh - B) / 2);
    }
  }

  /* ---------- Görev ---------- */
  function gorevKontrol(d) {
    if (!gorev || bitirildi) return;
    if (d.faz === gorev.hedef) {
      bitirildi = true; soruAcik = true; guc = 0; el.sl.value = 0;
      soruGoster();
    }
  }

  function karistir(a) {
    var r = a.map(function (m, i) { return { m: m, d: i === 0 }; });
    for (var i = r.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = r[i]; r[i] = r[j]; r[j] = t; }
    return r;
  }
  function soruGoster() {
    el.sonuc.innerHTML = '';
    var kutu = e('div', { class: 'oy-basari' });
    kutu.appendChild(e('h3', {}, '🎯 Hedefe ulaştın! Şimdi grafiğe bak ve yanıtla'));
    kutu.appendChild(e('p', {}, gorev.soru));
    var secs = e('div', { class: 'hal-secenekler' });
    var mesaj = e('p', { class: 'hal-mesaj' });
    karistir(gorev.sec).forEach(function (o) {
      var b = e('button', { type: 'button', class: 'hal-secenek' }, o.m);
      b.addEventListener('click', function () {
        if (o.d) {
          b.classList.add('dogru');
          if (kayit.bitti.indexOf(sev) < 0) { kayit.bitti.push(sev); kaydet(); }
          var chip = kok.querySelectorAll('.oy-chip')[sev];
          if (chip) { chip.classList.add('bitti'); chip.textContent = '✓ ' + (sev + 1); }
          kutu.innerHTML = '';
          kutu.appendChild(e('h3', {}, '🎉 Doğru, görev tamamlandı!'));
          kutu.appendChild(e('p', { html: '<strong>Neden böyle oldu?</strong> ' + gorev.acik }));
          var son = sev === GOREVLER.length - 1;
          var nb = e('button', { type: 'button', class: 'btn btn-sari' }, son ? '🧪 Serbest moda geç' : 'Sonraki görev ▶');
          nb.addEventListener('click', function () { yukle(son ? 'serbest' : sev + 1); });
          kutu.appendChild(nb);
        } else {
          b.classList.add('yanlis'); b.disabled = true;
          mesaj.textContent = 'Henüz değil. Grafiğe tekrar bak ve düşün.';
        }
      });
      secs.appendChild(b);
    });
    kutu.appendChild(secs); kutu.appendChild(mesaj);
    el.sonuc.appendChild(kutu);
  }

  yukle(0);
})();
