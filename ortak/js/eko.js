// Ekosistem Dengesi – besin zincirinde bir halkayı değiştir, sonuçları izle (6-8. sınıf, çevre üniteleri)
(function () {
  'use strict';
  var kok = document.getElementById('oyun');
  if (!kok) return;
  var KAYIT = 'fen-ekosistem-dengesi-v1';
  var DENGE = [64, 30, 4]; // ot, tavşan, tilki (denge noktası)
  var P = { rG: 0.8, c1: 0.9, e1: 0.5, mH: 0.2, c2: 0.6, e2: 0.8, mF: 0.25, sH: 0.002, sF: 0.01 };

  var GOREVLER = [
    { ad: 'Tilkileri avla', eylem: 'avla', bekle: 10,
      gorev: 'Ekosistem dengede. <strong>“Tilkileri avla”</strong> düğmesine bas ve yaklaşık 10 yıl boyunca tavşan ve otun grafiklerini izle.',
      soru: 'Tilkiler büyük ölçüde azaltılınca tavşan ve ot sayıları nasıl değişti?',
      sec: ['Tavşan arttı, ot azaldı', 'Tavşan azaldı, ot arttı', 'İkisi de arttı', 'Hiçbiri değişmedi'],
      acik: 'Avcı (tilki) azalınca otçul (tavşan) sayısı artar; çok sayıda tavşan da otu daha çok tüketir ve ot azalır. Besin zincirinde bir halkadaki değişim, diğer halkaları zincirleme etkiler.' },
    { ad: 'Kuraklık', eylem: 'kurak', bekle: 6,
      gorev: 'Şimdi <strong>“Kuraklık”</strong> düğmesine bas. Otlar azalınca zincirin diğer halkaları ne olacak? Birkaç yıl izle.',
      soru: 'Kuraklıkta otlar azaldıktan sonra tavşan ve tilki sayıları nasıl değişti?',
      sec: ['Besin azaldığı için önce tavşan, sonra tilki sayısı azaldı', 'Tilki sayısı arttı, tavşan sayısı azaldı', 'Tavşan sayısı arttı', 'Yalnızca ot etkilendi, diğerleri değişmedi'],
      acik: 'Üreticiler azalınca onlarla beslenen otçullar azalır; otçullar azalınca onlarla beslenen etçiller de besin bulamaz ve azalır. Üreticiler besin zincirinin temelidir.' },
    { ad: 'Enerji piramidi', piramit: true,
      gorev: 'Besin zincirinde enerji basamak basamak aktarılır. Piramide bak ve soruyu yanıtla.',
      soru: 'Ot 10 000 kJ enerji içeriyorsa ve her basamakta enerjinin yaklaşık %10’u bir üst basamağa aktarılıyorsa, tilkinin alabileceği enerji yaklaşık kaç kJ olur?',
      sec: ['100 kJ', '1 000 kJ', '10 kJ', '10 000 kJ'],
      acik: 'Ot → tavşan: 10 000 kJ’un %10’u = 1 000 kJ. Tavşan → tilki: 1 000 kJ’un %10’u = 100 kJ. Enerjinin geri kalanı her basamakta ısı olarak kaybolur; bu yüzden besin zincirleri kısadır ve üst basamaklarda canlı sayısı azalır.' },
    { ad: 'Dengeyi geri kazan', challenge: true,
      baslangic: [15, 80, 0], hedefSure: 12,
      gorev: 'Tilkiler yok olmuş, tavşanlar çoğalmış, otlar tükenmek üzere. Düğmeleri kullanarak ekosistemi <strong>ot, tavşan ve tilki birlikte yaşar</strong> hâle getir ve 12 yıl boyunca dengede tut.',
      acik: 'Yok olan avcıyı geri getirmek, aşırı çoğalan otçulu kontrol altına alır; otlar toparlanınca tüm halkalar birlikte yaşayabilir. Ekosistemdeki dengeyi canlılar arasındaki besin ilişkileri sağlar.' }
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

  var sev = 0, gorev = GOREVLER[0], S = DENGE.slice(), t = 0, hiz = 1, gecmis = [], son = 0;
  var eylemZ = null, eylemYapildi = false, soruAcildi = false, dengeSure = 0, tamam = false;
  var el = {}, rafId = 0, sonZ = 0, ctx, gctx, dpr = window.devicePixelRatio || 1, yer = [];
  var W = 360, Ht = 240;

  function yerlestir() {
    function r(n, y0, y1) { var a = []; for (var i = 0; i < n; i++) a.push([14 + Math.random() * (W - 40), y0 + Math.random() * (y1 - y0)]); return a; }
    yer = { ot: r(34, 175, 225), tav: r(42, 100, 190), til: r(15, 40, 130) };
  }

  function yukle(i) {
    sev = i; gorev = i === 'serbest' ? null : GOREVLER[i];
    S = (gorev && gorev.baslangic ? gorev.baslangic : DENGE).slice();
    t = 0; hiz = 1; gecmis = []; son = 0; eylemZ = null; eylemYapildi = false; soruAcildi = false; dengeSure = 0; tamam = false;
    yerlestir();
    cizUI();
  }

  function adim(dt) {
    var G = S[0], H = S[1], F = S[2];
    var dG = P.rG * G * (1 - G / 100) - P.c1 * H * G / (G + 30);
    var dH = P.e1 * P.c1 * H * G / (G + 30) - P.mH * H - P.c2 * F * H / (H + 20) - P.sH * H * H;
    var dF = P.e2 * P.c2 * F * H / (H + 20) - P.mF * F - P.sF * F * F;
    G = Math.max(G + dG * dt, 0.5); H = Math.max(H + dH * dt, 0.3); F = F + dF * dt;
    if (F < 0.15) F = 0;
    S = [Math.min(G, 100), H, F];
  }

  /* ---------- Arayüz ---------- */
  function cizUI() {
    cancelAnimationFrame(rafId);
    kok.innerHTML = '';
    var chips = e('div', { class: 'oy-chips' });
    GOREVLER.forEach(function (g, i) {
      var tm = kayit.bitti.indexOf(i) >= 0;
      var b = e('button', { type: 'button', class: 'oy-chip' + (sev === i ? ' aktif' : '') + (tm ? ' bitti' : '') }, (tm ? '✓ ' : '') + (i + 1));
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
    gv.appendChild(e('p', { class: 'oy-hedef', html: '🎯 ' + (gorev ? gorev.gorev : 'Canlıları ekle, azalt ya da doğal olayları başlat; ekosistemin nasıl tepki verdiğini izle.') }));
    if (gorev && gorev.challenge) { el.ilerleme = e('div', { class: 'oy-hedef-durum' }); gv.appendChild(el.ilerleme); }
    kok.appendChild(gv);

    el.sonuc = e('div', { class: 'oy-sonuc' });
    if (gorev && gorev.piramit) { piramit(); return; }

    var alan = e('div', { class: 'hal-alan' });
    var sol = e('div', { class: 'hal-sol' });
    el.cv = e('canvas', { class: 'hal-cv', width: W * dpr, height: Ht * dpr });
    el.cv.style.maxWidth = W + 'px'; el.cv.style.aspectRatio = W + ' / ' + Ht;
    sol.appendChild(el.cv);
    el.sayac = e('div', { class: 'eko-sayac' });
    sol.appendChild(el.sayac);
    alan.appendChild(sol);
    var sag = e('div', { class: 'hal-sag' });
    sag.appendChild(e('div', { class: 'hal-gbaslik' }, '📈 Canlı sayıları – zaman grafiği'));
    el.gcv = e('canvas', { class: 'hal-gcv', width: 420 * dpr, height: 250 * dpr });
    el.gcv.style.maxWidth = '420px';
    sag.appendChild(el.gcv);
    alan.appendChild(sag);
    kok.appendChild(alan);

    var ctl = e('div', { class: 'oy-araclar' });
    [['🐇 Tavşan ekle', 'tavsan'], ['🦊 Tilki ekle', 'tilki'], ['🏹 Tilkileri avla', 'avla'], ['🌵 Kuraklık', 'kurak'], ['🦠 Tavşan salgını', 'salgin']].forEach(function (x) {
      var b = e('button', { type: 'button', class: 'oy-arac' }, x[0]);
      b.addEventListener('click', function () { eylem(x[1]); });
      ctl.appendChild(b);
    });
    var hb = e('button', { type: 'button', class: 'oy-arac' }, '⏩ Hız ×' + hiz);
    hb.addEventListener('click', function () { hiz = hiz === 1 ? 3 : 1; hb.textContent = '⏩ Hız ×' + hiz; });
    ctl.appendChild(hb);
    var sf = e('button', { type: 'button', class: 'oy-arac oy-sifir' }, '↺ Baştan');
    sf.addEventListener('click', function () { yukle(sev); });
    ctl.appendChild(sf);
    kok.appendChild(ctl);
    kok.appendChild(el.sonuc);

    ctx = el.cv.getContext('2d'); gctx = el.gcv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sonZ = performance.now();
    rafId = requestAnimationFrame(dongu);
  }

  function eylem(ad) {
    if (ad === 'tavsan') S[1] = Math.min(100, S[1] + 15);
    if (ad === 'tilki') S[2] += 2;
    if (ad === 'avla') S[2] = S[2] * 0.1 < 0.15 ? 0 : S[2] * 0.1;
    if (ad === 'kurak') S[0] = S[0] * 0.15;
    if (ad === 'salgin') S[1] = S[1] * 0.3;
    if (gorev && gorev.eylem === ad && !eylemYapildi) { eylemYapildi = true; eylemZ = t; }
  }

  function dongu(z) {
    var dt = Math.min(0.2, (z - sonZ) / 1000); sonZ = z;
    var yil = dt * hiz;
    var n = Math.max(1, Math.round(yil / 0.05));
    for (var i = 0; i < n; i++) adim(yil / n);
    t += yil;
    if (t - son >= 0.4) { gecmis.push([t, S[0], S[1], S[2] * 3]); son = t; if (gecmis.length > 600) gecmis.shift(); }
    ciz();
    gorevKontrol(yil);
    rafId = requestAnimationFrame(dongu);
  }

  /* ---------- Çizim ---------- */
  function ciz() {
    ctx.clearRect(0, 0, W, Ht);
    var g = ctx.createLinearGradient(0, 0, 0, Ht);
    g.addColorStop(0, '#dbeafe'); g.addColorStop(0.55, '#ecfccb'); g.addColorStop(1, '#bef264');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, Ht);
    var otN = Math.round(S[0] / 100 * yer.ot.length), tN = Math.min(yer.tav.length, Math.round(S[1])), fN = Math.min(yer.til.length, Math.round(S[2] * 3));
    ctx.textAlign = 'center';
    ctx.font = '20px sans-serif';
    for (var i = 0; i < otN; i++) ctx.fillText('🌱', yer.ot[i][0], yer.ot[i][1]);
    ctx.font = '22px sans-serif';
    for (i = 0; i < tN; i++) ctx.fillText('🐇', yer.tav[i][0], yer.tav[i][1]);
    ctx.font = '26px sans-serif';
    for (i = 0; i < fN; i++) ctx.fillText('🦊', yer.til[i][0], yer.til[i][1]);
    if (S[2] === 0) { ctx.font = '700 14px sans-serif'; ctx.fillStyle = '#b91c1c'; ctx.fillText('🦊 Tilkiler yok oldu', W / 2, 24); }
    el.sayac.innerHTML = '<span>🌱 Ot yoğunluğu: <b>%' + Math.round(S[0]) + '</b></span><span>🐇 Tavşan: <b>' + Math.round(S[1]) + '</b></span><span>🦊 Tilki: <b>' + Math.round(S[2] * 3) + '</b></span><span>⏳ Yıl: <b>' + Math.floor(t) + '</b></span>';
    grafik();
  }

  function grafik() {
    var gw = 420, gh = 250, L = 40, R = 12, T = 12, B = 30;
    gctx.clearRect(0, 0, gw, gh);
    gctx.fillStyle = '#fff'; gctx.fillRect(0, 0, gw, gh);
    var pencere = Math.max(40, t);
    var t0 = Math.max(0, t - pencere);
    function X(v) { return L + (v - t0) / pencere * (gw - L - R); }
    function Y(v) { return T + (100 - Math.min(100, v)) / 100 * (gh - T - B); }
    gctx.font = '11px sans-serif'; gctx.textAlign = 'right'; gctx.fillStyle = '#64748b'; gctx.strokeStyle = '#e5e9f0'; gctx.lineWidth = 1;
    for (var v = 0; v <= 100; v += 25) { gctx.beginPath(); gctx.moveTo(L, Y(v)); gctx.lineTo(gw - R, Y(v)); gctx.stroke(); gctx.fillText(v + '', L - 6, Y(v) + 4); }
    gctx.strokeStyle = '#475569'; gctx.lineWidth = 2; gctx.beginPath(); gctx.moveTo(L, T); gctx.lineTo(L, gh - B); gctx.lineTo(gw - R, gh - B); gctx.stroke();
    gctx.fillStyle = '#475569'; gctx.textAlign = 'center'; gctx.font = '12px sans-serif'; gctx.fillText('Zaman (yıl) →', (L + gw - R) / 2, gh - 8);
    [[1, '#16a34a', 'Ot'], [2, '#ea580c', 'Tavşan'], [3, '#dc2626', 'Tilki']].forEach(function (s, k) {
      gctx.strokeStyle = s[1]; gctx.lineWidth = 3; gctx.lineJoin = 'round'; gctx.beginPath();
      gecmis.forEach(function (p, i) { if (i === 0) gctx.moveTo(X(p[0]), Y(p[s[0]])); else gctx.lineTo(X(p[0]), Y(p[s[0]])); });
      gctx.stroke();
      gctx.fillStyle = s[1]; gctx.fillRect(L + 8 + k * 70, T + 4, 14, 4); gctx.textAlign = 'left'; gctx.font = '12px sans-serif'; gctx.fillText(s[2], L + 26 + k * 70, T + 10);
    });
  }

  /* ---------- Görev ---------- */
  function gorevKontrol(yil) {
    if (!gorev) return;
    if (gorev.challenge && !tamam) {
      var ok = S[0] > 20 && S[1] > 10 && S[1] < 55 && S[2] > 0.4;
      dengeSure = ok ? dengeSure + yil : 0;
      el.ilerleme.textContent = '⏳ Denge süresi: ' + Math.min(gorev.hedefSure, Math.floor(dengeSure)) + ' / ' + gorev.hedefSure + ' yıl' + (ok ? ' ✅ denge sağlanıyor' : ' (üç canlı da yeterli sayıda olmalı)');
      if (dengeSure >= gorev.hedefSure) {
        tamam = true; basari();
        var kutu = e('div', { class: 'oy-basari' });
        kutu.appendChild(e('h3', {}, '🎉 Harika, ekosistemi kurtardın!'));
        kutu.appendChild(e('p', { html: '<strong>Neden böyle oldu?</strong> ' + gorev.acik }));
        var nb = e('button', { type: 'button', class: 'btn btn-sari' }, '🧪 Serbest moda geç');
        nb.addEventListener('click', function () { yukle('serbest'); });
        kutu.appendChild(nb);
        el.sonuc.innerHTML = ''; el.sonuc.appendChild(kutu);
      }
    } else if (gorev.eylem && eylemYapildi && !soruAcildi && t - eylemZ >= gorev.bekle) {
      soruAcildi = true; soruGoster();
    }
  }

  function basari() {
    if (kayit.bitti.indexOf(sev) < 0) { kayit.bitti.push(sev); kaydet(); }
    var chip = kok.querySelectorAll('.oy-chip')[sev];
    if (chip) { chip.classList.add('bitti'); chip.textContent = '✓ ' + (sev + 1); }
  }

  function soruGoster() {
    var kutu = e('div', { class: 'oy-basari' });
    kutu.appendChild(e('h3', {}, '🔎 Gözlemini yanıtla'));
    kutu.appendChild(e('p', {}, gorev.soru));
    var secs = e('div', { class: 'hal-secenekler' }), mesaj = e('p', { class: 'hal-mesaj' });
    var liste = gorev.sec.map(function (m, i) { return { m: m, d: i === 0 }; });
    for (var i = liste.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = liste[i]; liste[i] = liste[j]; liste[j] = x; }
    liste.forEach(function (o) {
      var b = e('button', { type: 'button', class: 'hal-secenek' }, o.m);
      b.addEventListener('click', function () {
        if (o.d) {
          basari();
          kutu.innerHTML = '';
          kutu.appendChild(e('h3', {}, '🎉 Doğru, görev tamamlandı!'));
          kutu.appendChild(e('p', { html: '<strong>Neden böyle oldu?</strong> ' + gorev.acik }));
          var nb = e('button', { type: 'button', class: 'btn btn-sari' }, sev === GOREVLER.length - 1 ? '🧪 Serbest moda geç' : 'Sonraki görev ▶');
          nb.addEventListener('click', function () { yukle(sev === GOREVLER.length - 1 ? 'serbest' : sev + 1); });
          kutu.appendChild(nb);
        } else { b.classList.add('yanlis'); b.disabled = true; mesaj.textContent = 'Henüz değil. Grafiğe tekrar bak.'; }
      });
      secs.appendChild(b);
    });
    kutu.appendChild(secs); kutu.appendChild(mesaj);
    el.sonuc.innerHTML = ''; el.sonuc.appendChild(kutu);
    if (!el.sonuc.parentNode) kok.appendChild(el.sonuc);
  }

  function piramit() {
    var p = e('div', { class: 'eko-piramit' });
    p.innerHTML = '<div class="pr3">🦊 Tilki<br><small>? kJ</small></div><div class="pr2">🐇 Tavşan<br><small>1 000 kJ</small></div><div class="pr1">🌱 Ot<br><small>10 000 kJ</small></div>' +
      '<div class="pr-not">Her basamakta enerjinin yaklaşık %10’u bir üst basamağa aktarılır.</div>';
    kok.appendChild(p);
    kok.appendChild(el.sonuc);
    soruGoster();
  }

  yukle(0);
})();
