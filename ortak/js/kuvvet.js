// Kuvvet Arenası – itme kuvveti, sürtünme ve hareket (5-7. sınıf, kuvvet ve hareket üniteleri)
(function () {
  'use strict';
  var YUZEY = { buz: { ad: 'Buz', mu: 0.05, renk: '#bae6fd' }, ahsap: { ad: 'Ahşap', mu: 0.3, renk: '#d6a76b' }, hali: { ad: 'Halı', mu: 0.6, renk: '#c084fc' } };
  var G = 10, PX = 56; // yerçekimi ivmesi (N/kg) ve piksel/metre
  var W = 600, H = 240, YER = 190, KUTU = 0.9;

  var GOREVLER = [
    { ad: 'Harekete geçir', yuzey: 'ahsap', m: 10, kilit: true, gorev: 'Ahşap zemindeki 10 kg’lık kutuyu itme kuvvetini artırarak harekete geçir.',
      soru: { q: 'Kutu harekete geçmeden önce, uyguladığın kuvvet artarken kutu neden yerinde kaldı?', sec: ['Sürtünme kuvveti uyguladığım kuvvete eşit olarak onu dengeledi', 'Kutuya hiç kuvvet uygulanmadı', 'Yerçekimi kuvveti itme kuvvetinden daha büyüktü', 'Kutunun kütlesi o anda arttı'],
        acik: 'Durgun kutuda sürtünme kuvveti, uygulanan kuvvete eşit büyüklükte ve zıt yöndedir; kuvvetler dengelendiği için kutu hareket etmez. Uygulanan kuvvet sürtünmeyi (burada yaklaşık 30 N) aşınca kutu harekete geçer.' } },
    { ad: 'Sabit hızla git', yuzey: 'ahsap', m: 10, kilit: true, gorev: 'Kutuyu hızlandır, sonra kuvveti ayarlayarak kutunun yaklaşık 3 saniye boyunca sabit hızla (en az 1 m/s) gitmesini sağla.',
      acik: 'Sabit hızla hareket eden cisme etki eden kuvvetler dengelenmiştir. İtme kuvveti sürtünme kuvvetine (burada 30 N) eşit olunca net kuvvet sıfır olur ve cisim hızını değiştirmeden gider.' },
    { ad: 'Yüzey farkı', yuzey: 'buz', m: 10, gorev: 'Kuvveti 40 N yap. Kutuyu önce buz, sonra halı üzerinde en az 3’er saniye it ve farkı gözle.', denenen: { buz: 0, hali: 0 },
      soru: { q: 'Aynı 40 N kuvvet uygulandığında hangi yüzeyde kutu daha çok hızlanır ve neden?', sec: ['Buzda; çünkü buzda sürtünme kuvveti daha küçüktür', 'Halıda; çünkü halıda sürtünme kuvveti daha küçüktür', 'İkisinde de aynı; çünkü uygulanan kuvvet aynıdır', 'Halıda; çünkü sürtünme hareketi kolaylaştırır'],
        acik: 'Sürtünme kuvveti yüzeyin cinsine bağlıdır: pürüzlü yüzeyde büyük, kaygan yüzeyde küçüktür. Net kuvvet = itme kuvveti − sürtünme kuvveti olduğundan, aynı itme kuvvetinde buzda net kuvvet ve ivme daha büyüktür.' } },
    { ad: 'Kütle etkisi', yuzey: 'buz', m: 5, gorev: 'Buz üzerinde kuvveti 20 N yap. 5, 10 ve 20 kg’lık kutuları en az 2’şer saniye it ve ivmelerini karşılaştır.', denenen: { 5: 0, 10: 0, 20: 0 },
      soru: { q: 'Aynı kuvvet uygulandığında hangi kutunun hızı daha çabuk artar?', sec: ['Kütlesi en küçük olan kutunun', 'Kütlesi en büyük olan kutunun', 'Hepsinin aynı', 'Hiçbirinin hızı artmaz'],
        acik: 'Aynı net kuvvet altında kütlesi küçük cismin hızı daha çabuk değişir; yani kütle büyüdükçe ivme azalır. Bu yüzden dolu bir arabayı itmek boş arabayı itmekten daha zordur.' } },
    { ad: 'Hedefte dur', yuzey: 'ahsap', m: 10, kilit: true, hedef: [6.0, 7.2], gorev: 'Kutuyu it, sonra kuvveti bırak: sürtünme onu yavaşlatsın ve kutu yeşil alanda dursun.',
      acik: 'Kuvvet kesilince kutuya yalnızca sürtünme kuvveti etki eder ve hızı azalır. Durma mesafesi başlangıç hızı büyüdükçe artar; bu yüzden aracın hızı ne kadar fazlaysa fren mesafesi o kadar uzundur.' }
  ];
  var SERBEST = { ad: 'Serbest mod', gorev: 'Yüzey, kütle ve kuvveti değiştirerek kutunun hareketini incele.', yuzey: 'ahsap', m: 10 };

  OY.oyun({
    anahtar: 'fen-kuvvet-arenasi-v1', gorevler: GOREVLER, serbest: SERBEST,
    kur: function (g, i, api) {
      var e = api.e;
      var S = { yuzey: g.yuzey, m: g.m, F: 0, x: 0.3, v: 0, a: 0, ff: 0, t: 0, sabit: 0, soruAcildi: false, bitti: false, denenen: g.denenen ? JSON.parse(JSON.stringify(g.denenen)) : null };
      var cv = e('canvas', { class: 'hal-cv kuv-cv', width: W * (window.devicePixelRatio || 1), height: H * (window.devicePixelRatio || 1) });
      cv.style.maxWidth = '100%'; cv.style.aspectRatio = W + ' / ' + H;
      api.alan.appendChild(cv);
      var ctx = cv.getContext('2d'), dpr = window.devicePixelRatio || 1; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var bil = e('div', { class: 'eko-sayac' }); api.alan.appendChild(bil);
      var ctl = e('div', { class: 'hal-ctl' });
      ctl.appendChild(e('span', { class: 'hal-soguk' }, '👉 İtme kuvveti'));
      var sl = e('input', { type: 'range', min: 0, max: 150, value: 0, step: 1, class: 'hal-sl', 'aria-label': 'İtme kuvveti' });
      var fy = e('b', { class: 'kuv-f' }, '0 N');
      sl.addEventListener('input', function () { S.F = +sl.value; fy.textContent = S.F + ' N'; });
      ctl.appendChild(sl); ctl.appendChild(fy);
      var bas = e('button', { type: 'button', class: 'oy-arac oy-sifir' }, '↺ Kutuyu başa al');
      bas.addEventListener('click', function () { S.x = 0.3; S.v = 0; S.sabit = 0; });
      ctl.appendChild(bas);
      api.alan.appendChild(ctl);
      var opt = e('div', { class: 'oy-araclar' });
      if (!g.kilit) {
        Object.keys(YUZEY).forEach(function (k) {
          var b = e('button', { type: 'button', class: 'oy-arac' + (S.yuzey === k ? ' aktif' : '') }, YUZEY[k].ad);
          b.addEventListener('click', function () { S.yuzey = k; [].forEach.call(opt.querySelectorAll('.ky'), function (c) { c.classList.remove('aktif'); }); b.classList.add('aktif'); }); b.classList.add('ky');
          opt.appendChild(b);
        });
        [5, 10, 20].forEach(function (k) {
          var b = e('button', { type: 'button', class: 'oy-arac' + (S.m === k ? ' aktif' : '') }, k + ' kg');
          b.addEventListener('click', function () { S.m = k; [].forEach.call(opt.querySelectorAll('.km'), function (c) { c.classList.remove('aktif'); }); b.classList.add('aktif'); }); b.classList.add('km');
          opt.appendChild(b);
        });
        api.alan.appendChild(opt);
      }

      function ciz() {
        ctx.clearRect(0, 0, W, H);
        var gk = ctx.createLinearGradient(0, 0, 0, H); gk.addColorStop(0, '#e0f2fe'); gk.addColorStop(1, '#f8fafc');
        ctx.fillStyle = gk; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = YUZEY[S.yuzey].renk; ctx.fillRect(0, YER, W, H - YER);
        ctx.fillStyle = 'rgba(15,23,42,.15)'; ctx.fillRect(0, YER, W, 3);
        if (g.hedef) { ctx.fillStyle = 'rgba(34,197,94,.35)'; ctx.fillRect(g.hedef[0] * PX, YER - 16, (g.hedef[1] - g.hedef[0]) * PX, 16); ctx.fillStyle = '#15803d'; ctx.font = '700 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('HEDEF', (g.hedef[0] + g.hedef[1]) / 2 * PX, YER - 22); }
        for (var k = 0; k <= 10; k++) { ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(k + ' m', k * PX, H - 8); }
        var bx = S.x * PX, bw = KUTU * PX, bh = 30 + S.m * 1.5;
        ctx.fillStyle = '#f59e0b'; ctx.strokeStyle = '#b45309'; ctx.lineWidth = 3;
        ctx.fillRect(bx, YER - bh, bw, bh); ctx.strokeRect(bx, YER - bh, bw, bh);
        ctx.fillStyle = '#7c2d12'; ctx.font = '800 14px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(S.m + ' kg', bx + bw / 2, YER - bh / 2 + 5);
        function ok(x1, x2, y, renk, yaz) {
          if (Math.abs(x2 - x1) < 2) return;
          ctx.strokeStyle = renk; ctx.fillStyle = renk; ctx.lineWidth = 5;
          ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
          var d = x2 > x1 ? 1 : -1; ctx.beginPath(); ctx.moveTo(x2, y); ctx.lineTo(x2 - 10 * d, y - 7); ctx.lineTo(x2 - 10 * d, y + 7); ctx.fill();
          ctx.font = '800 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(yaz, (x1 + x2) / 2, y - 10);
        }
        ok(bx, bx + S.F * 1.6, YER - bh / 2, '#2563eb', 'İtme ' + S.F + ' N');
        ok(bx + bw, bx + bw - S.ff * 1.6, YER - 8, '#dc2626', 'Sürtünme ' + Math.round(S.ff) + ' N');
        bil.innerHTML = '<span>Net kuvvet: <b>' + Math.round(S.a * S.m) + ' N</b></span><span>İvme: <b>' + S.a.toFixed(1).replace('.', ',') + ' m/s²</b></span><span>Hız: <b>' + S.v.toFixed(1).replace('.', ',') + ' m/s</b></span>';
      }

      api.raf(function (dt) {
        var N = YUZEY[S.yuzey].mu * S.m * G, adim = 5, h = dt / adim;
        for (var k = 0; k < adim; k++) {
          if (S.v <= 0.001 && S.F <= N) { S.v = 0; S.ff = S.F; S.a = 0; }
          else {
            S.ff = N;
            S.a = (S.F - N) / S.m;
            S.v += S.a * h;
            if (S.v < 0) { S.v = 0; S.a = 0; }
            S.x += S.v * h;
            if (S.x > W / PX - KUTU) { S.x = W / PX - KUTU; S.v = 0; }
          }
        }
        ciz();
        if (S.bitti) return;
        gorevKontrol(dt);
      });

      function gorevKontrol(dt) {
        if (g.serbest) return;
        var N = YUZEY[S.yuzey].mu * S.m * G;
        if (i === 0 && S.v > 0.5 && !S.soruAcildi) { S.soruAcildi = true; S.F = 0; sl.value = 0; fy.textContent = '0 N'; api.soru(g.soru, '🎯 Kutu harekete geçti! Şimdi yanıtla'); }
        if (i === 1) {
          var stab = S.v >= 1 && S.F > 0 && Math.abs(S.a) < 0.05;
          S.sabit = stab ? S.sabit + dt : 0;
          api.mesaj(stab ? '⏱ Sabit hız: ' + S.sabit.toFixed(1).replace('.', ',') + ' / 3 sn' : 'Önce kutuyu hızlandır, sonra kuvveti sürtünmeye eşitle (kaydırıcıyı 1 N hassasiyetle ayarla).', stab ? 'iyi' : 'bilgi');
          if (S.sabit >= 3) { S.bitti = true; api.bitir('🎉 Kutu sabit hızla gidiyor!', g.acik); }
        }
        if ((i === 2 || i === 3) && S.denenen && !S.soruAcildi) {
          var anahtar = i === 2 ? S.yuzey : S.m;
          if (S.denenen[anahtar] !== undefined && S.F >= (i === 2 ? 40 : 20) && (S.v > 0.1 || S.F > N)) S.denenen[anahtar] += dt;
          var hedefSure = i === 2 ? 3 : 2, tamam = Object.keys(S.denenen).every(function (k) { return S.denenen[k] >= hedefSure; });
          api.mesaj('Denenen: ' + Object.keys(S.denenen).map(function (k) { return (i === 2 ? YUZEY[k].ad : k + ' kg') + ' ' + (S.denenen[k] >= hedefSure ? '✓' : Math.min(S.denenen[k], hedefSure).toFixed(1).replace('.', ',') + '/' + hedefSure + ' sn'); }).join(' · '), 'bilgi');
          if (tamam) { S.soruAcildi = true; S.F = 0; sl.value = 0; fy.textContent = '0 N'; api.soru(g.soru, '🔎 Gözleminle yanıtla'); }
        }
        if (i === 4 && g.hedef && S.v === 0 && S.x > 1 && S.F === 0) {
          var orta = S.x + KUTU / 2;
          if (orta >= g.hedef[0] && orta <= g.hedef[1]) { S.bitti = true; api.bitir('🎉 Tam hedefte durdun!', g.acik); }
          else { api.mesaj('Hedefi ' + (orta < g.hedef[0] ? 'tutturamadın (kısa kaldın)' : 'geçtin') + '. “Kutuyu başa al”a basıp tekrar dene.', 'tehlike'); }
        } else if (i === 4 && !S.bitti && S.v > 0) { api.mesaj('Kutu hareket ediyor: kuvveti ne zaman bırakacağına karar ver.', 'bilgi'); }
      }
      ciz();
    }
  });
})();
