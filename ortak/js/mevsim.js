// Mevsim Makinesi – Dünya'nın eksen eğikliği ve mevsimler (8. sınıf, mevsimler ve iklim)
(function () {
  'use strict';
  var AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  var AYGUN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var RAD = Math.PI / 180;
  function tarih(gun) { var a = 0; while (gun > AYGUN[a]) { gun -= AYGUN[a]; a++; } return gun + ' ' + AYLAR[a]; }
  function sapma(gun) { return 23.44 * Math.sin(2 * Math.PI * (gun - 80) / 365); }
  function gunduz(lat, dec) { var x = -Math.tan(lat * RAD) * Math.tan(dec * RAD); x = Math.max(-1, Math.min(1, x)); return 24 / Math.PI * Math.acos(x); }
  function mevsimK(gun) { return gun >= 80 && gun < 172 ? 'İlkbahar' : gun >= 172 && gun < 266 ? 'Yaz' : gun >= 266 && gun < 355 ? 'Sonbahar' : 'Kış'; }
  function mevsimG(gun) { return { 'İlkbahar': 'Sonbahar', 'Yaz': 'Kış', 'Sonbahar': 'İlkbahar', 'Kış': 'Yaz' }[mevsimK(gun)]; }
  function fark(a, b) { var d = Math.abs(a - b); return Math.min(d, 365 - d); }

  var GOREVLER = [
    { ad: 'En uzun gündüz (Türkiye)', hedef: 172, tol: 5, gorev: 'Dünya’yı yörüngesinde kaydırarak Kuzey Yarım Küre’de (Türkiye) gündüzün en uzun olduğu tarihi bul ve onayla.',
      acik: 'Yaklaşık 21 Haziran’da Kuzey Yarım Küre Güneş’e doğru eğiktir; Güneş ışınları Yengeç Dönencesi’ne dik gelir. Bu tarihte Kuzey Yarım Küre’de gündüzler en uzun, geceler en kısadır ve yaz başlar.' },
    { ad: 'Güney Yarım Küre’de yaz', hedef: 355, tol: 5, gorev: 'Güney Yarım Küre’de gündüzün en uzun olduğu (yazın başladığı) tarihi bul ve onayla.',
      acik: 'Yaklaşık 21 Aralık’ta Güney Yarım Küre Güneş’e doğru eğiktir; orada gündüzler en uzun, yaz başlar. Aynı tarihte Kuzey Yarım Küre’de gündüzler en kısadır, kış başlar. İki yarım kürede mevsimler zıttır.' },
    { ad: 'Gece gündüz eşit', hedef: [80, 266], tol: 4, gorev: 'Gece ve gündüzün her yerde yaklaşık eşit (12 saat) olduğu bir tarih bul ve onayla.',
      acik: '21 Mart ve 23 Eylül’de Dünya’nın ekseni Güneş’e ne yaklaşır ne uzaklaşır; Güneş ışınları Ekvator’a dik gelir ve her yerde gece ile gündüz yaklaşık eşittir (ekinoks).' },
    { ad: 'Mevsimlerin nedeni', gorev: 'Mevsimlerin neden oluştuğunu düşün.', soru: { q: 'Mevsimlerin oluşmasının asıl nedeni hangisidir?', sec: ['Dünya’nın dönme ekseninin yörünge düzlemine göre eğik olması ve Güneş’in etrafında dolanması', 'Dünya’nın Güneş’e olan uzaklığının yıl boyunca çok değişmesi', 'Dünya’nın kendi ekseni etrafında dönmesi', 'Ay’ın Dünya çevresindeki hareketi'],
        acik: 'Eksen eğikliği nedeniyle yıl boyunca Güneş ışınlarının geliş açısı ve gündüz süresi değişir. Dik gelen ışınlar yüzeyi daha çok ısıtır; gündüz uzadıkça ısınma artar. Dünya’nın kendi ekseni etrafındaki dönmesi ise gece ile gündüzü oluşturur.' } },
    { ad: 'Ocak’ta Güneş’e yakınlık', gorev: 'Dünya–Güneş uzaklığı ile mevsimleri karşılaştır.', soru: { q: 'Dünya Güneş’e en yakın olduğu 3-4 Ocak civarında Türkiye’de kış yaşanıyor. Bu durum neyi gösterir?', sec: ['Mevsimler Güneş’e olan uzaklıkla değil, eksen eğikliğiyle oluşur', 'Güneş kışın daha az ışık yayar', 'Dünya ocak ayında yörüngesinden uzaklaşır', 'Dünya’nın ekseni ocak ayında düzelir'],
        acik: 'Dünya Güneş’e Ocak başında en yakın (günberi), Temmuz başında en uzak (günöte) konumdadır; ancak Kuzey Yarım Küre’de ocakta kış, temmuzda yazdır. Mevsimlerin nedeni uzaklık değil, eksen eğikliğine bağlı olarak değişen ışık geliş açısı ve gündüz süresidir.' } }
  ];
  var SERBEST = { ad: 'Serbest mod', gorev: 'Dünya’yı yörüngede kaydır ya da “Yılı oynat” düğmesine bas; mevsimlerin, gündüz sürelerinin ve Güneş ışınlarının değişimini izle.' };

  OY.oyun({
    anahtar: 'fen-mevsim-makinesi-v1', gorevler: GOREVLER, serbest: SERBEST,
    kur: function (g, i, api) {
      if (g.soru) { api.soru(g.soru); return; }
      var e = api.e, sv = api.sv, gun = 80, oynat = false;
      var sahne = e('div', { class: 'oy-sahne' });
      var s = sv('svg', { viewBox: '0 0 600 340', class: 'isik-svg', role: 'img', 'aria-label': 'Güneş çevresinde Dünya ve mevsimler' });
      sahne.appendChild(s); api.alan.appendChild(sahne);
      var bil = e('div', { class: 'eko-sayac' }); api.alan.appendChild(bil);
      var ctl = e('div', { class: 'hal-ctl' });
      ctl.appendChild(e('span', { class: 'hal-soguk' }, '📅 Tarih'));
      var sl = e('input', { type: 'range', min: 1, max: 365, value: gun, class: 'hal-sl', 'aria-label': 'Yılın günü' });
      ctl.appendChild(sl);
      var op = e('button', { type: 'button', class: 'oy-arac' }, '▶ Yılı oynat');
      op.addEventListener('click', function () { oynat = !oynat; op.textContent = oynat ? '⏸ Durdur' : '▶ Yılı oynat'; });
      ctl.appendChild(op);
      if (!g.ad.startsWith('Serbest')) {
        var on = e('button', { type: 'button', class: 'btn btn-sari ay-onay' }, '✔ Onayla'); ctl.appendChild(on);
        on.addEventListener('click', function () {
          var hs = [].concat(g.hedef);
          if (hs.some(function (h) { return fark(gun, h) <= g.tol; })) api.bitir('🎉 Doğru tarih: ' + tarih(gun) + '!', g.acik);
          else api.mesaj('Henüz değil. Seçtiğin tarihte (' + tarih(gun) + ') Kuzey Yarım Küre’de ' + mevsimK(gun).toLocaleLowerCase('tr') + ', Güney Yarım Küre’de ' + mevsimG(gun).toLocaleLowerCase('tr') + ' mevsimi yaşanıyor.', 'bilgi');
        });
      }
      api.alan.appendChild(ctl);
      sl.addEventListener('input', function () { gun = +sl.value; oynat = false; op.textContent = '▶ Yılı oynat'; ciz(); });
      api.raf(function (dt) { if (oynat) { gun += dt * 40; if (gun > 365) gun -= 365; sl.value = Math.round(gun); ciz(); } });

      function ciz() {
        var gn = Math.round(gun), CX = 300, CY = 160, RX = 230, RY = 70;
        s.innerHTML = '';
        sv('rect', { x: 0, y: 0, width: 600, height: 340, rx: 16, fill: '#0f172a' }, s);
        sv('ellipse', { cx: CX, cy: CY, rx: RX, ry: RY, fill: 'none', stroke: '#475569', 'stroke-width': 2, 'stroke-dasharray': '6 6' }, s);
        sv('circle', { cx: CX, cy: CY, r: 38, fill: '#facc15' }, s);
        sv('circle', { cx: CX, cy: CY, r: 50, fill: '#facc15', 'fill-opacity': 0.2 }, s);
        var al = (180 + 360 * (gn - 172) / 365) * RAD;
        var ex = CX + RX * Math.cos(al), ey = CY + RY * Math.sin(al), r = 24 + 6 * Math.sin(al);
        var dxs = CX - ex, dys = CY - ey, kar = Math.atan2(-dys, -dxs) * 180 / Math.PI;
        sv('circle', { cx: ex, cy: ey, r: r, fill: '#3b82f6' }, s);
        var gru = sv('g', { transform: 'translate(' + ex + ' ' + ey + ') rotate(' + kar + ')' }, s);
        sv('path', { d: 'M0 ' + (-r) + ' A' + r + ' ' + r + ' 0 0 1 0 ' + r + ' Z', fill: '#020617', 'fill-opacity': 0.55 }, gru);
        var tilt = 23.44 * RAD;
        sv('line', { x1: ex - Math.sin(tilt) * r * 1.7 * -1, y1: ey - Math.cos(tilt) * r * 1.7, x2: ex + Math.sin(tilt) * r * 1.7 * -1, y2: ey + Math.cos(tilt) * r * 1.7, stroke: '#f8fafc', 'stroke-width': 2.5 }, s);
        var kt = sv('text', { x: ex + Math.sin(tilt) * r * 1.7 + 6, y: ey - Math.cos(tilt) * r * 1.7 - 2, 'font-size': 12, 'font-weight': 800, fill: '#bfdbfe' }, s); kt.textContent = 'K';
        // Etiketler
        [[172, 'Haz 21'], [266, 'Eyl 23'], [355, 'Ara 21'], [80, 'Mar 21']].forEach(function (p) {
          var a = (180 + 360 * (p[0] - 172) / 365) * RAD, x = CX + (RX + 34) * Math.cos(a), y = CY + (RY + 22) * Math.sin(a);
          var t = sv('text', { x: x, y: y + 4, 'text-anchor': 'middle', 'font-size': 11, fill: '#94a3b8', 'font-weight': 700 }, s); t.textContent = p[1];
        });
        var dec = sapma(gn), gk = gunduz(40, dec), gg = gunduz(-40, dec);
        var t1 = sv('text', { x: 300, y: 300, 'text-anchor': 'middle', 'font-size': 14, fill: '#e2e8f0', 'font-weight': 800 }, s);
        t1.textContent = 'Güneş ışınları ' + (dec >= 0 ? Math.abs(dec).toFixed(1) + '° Kuzey' : Math.abs(dec).toFixed(1) + '° Güney') + ' enlemine dik geliyor';
        var t2 = sv('text', { x: 300, y: 322, 'text-anchor': 'middle', 'font-size': 12, fill: '#94a3b8' }, s);
        t2.textContent = '(Dünya’nın ekseni her zaman aynı yöne eğiktir — beyaz çizgi, K: Kuzey Kutbu)';
        bil.innerHTML = '<span>📅 <b>' + tarih(gn) + '</b></span><span>🇹🇷 Kuzey Yarım Küre: <b>' + mevsimK(gn) + '</b> · gündüz <b>' + gk.toFixed(1).replace('.', ',') + ' sa</b> (40° K)</span><span>🦘 Güney Yarım Küre: <b>' + mevsimG(gn) + '</b> · gündüz <b>' + gg.toFixed(1).replace('.', ',') + ' sa</b> (40° G)</span>';
      }
      ciz();
    }
  });
})();
