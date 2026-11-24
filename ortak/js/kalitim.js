// Kalıtım Laboratuvarı – bezelye çaprazlamaları ve Punnett karesi (8. sınıf, DNA ve genetik kod)
(function () {
  'use strict';
  var GEN = ['?', 'MM', 'Mm', 'mm'];

  var GOREVLER = [
    { ad: 'Saf döl çaprazlaması', tur: 'punnett', a: 'MM', b: 'mm',
      gorev: 'Mor çiçekli saf döl (MM) bezelye ile beyaz çiçekli (mm) bezelyeyi çaprazla. Punnett karesinin kutularına yavruların genotiplerini yaz (kutuya tıkla).',
      soru: { q: 'Bu çaprazlamada yavruların fenotipi (çiçek rengi) nasıldır?', sec: ['Hepsi mor çiçeklidir', 'Hepsi beyaz çiçeklidir', 'Yarısı mor, yarısı beyazdır', 'Üçte ikisi mor, üçte biri beyazdır'],
        acik: 'Tüm yavrular Mm genotipindedir. M aleli (mor) baskın olduğu için hepsi mor çiçeklidir; çekinik m aleli bu yavrularda fenotipte görünmez.' } },
    { ad: 'Melez × melez', tur: 'punnett', a: 'Mm', b: 'Mm',
      gorev: 'İki melez (Mm) bezelyeyi çaprazla ve Punnett karesini doldur.',
      soru: { q: 'Yavrularda mor : beyaz çiçek oranı nedir?', sec: ['3 : 1', '1 : 1', '1 : 2 : 1', '2 : 1'],
        acik: 'Yavrular 1 MM : 2 Mm : 1 mm genotip oranındadır. MM ve Mm mor, mm beyaz görünür; bu yüzden fenotip oranı 3 mor : 1 beyazdır (Mendel’in 3:1 oranı).' } },
    { ad: 'Melez × çekinik', tur: 'punnett', a: 'Mm', b: 'mm',
      gorev: 'Melez mor (Mm) bezelyeyi beyaz (mm) bezelyeyle çaprazla ve kareyi doldur.',
      soru: { q: 'Bu çaprazlamada beyaz çiçekli bir yavru çıkma olasılığı nedir?', sec: ['1/2 (%50)', '1/4 (%25)', '3/4 (%75)', '0 (hiç çıkmaz)'],
        acik: 'Yavruların yarısı Mm (mor), yarısı mm (beyaz) olur. Bu nedenle beyaz çiçekli yavru olasılığı 1/2’dir. Bilinmeyen genotipi anlamak için baskın bireyin çekinik bireyle çaprazlanmasına test çaprazlaması denir.' } },
    { ad: 'Gizli ebeveyn', tur: 'gizli',
      gorev: 'Bir ebeveyn beyaz çiçekli (mm). Yavruların yaklaşık yarısı mor, yarısı beyaz çıkıyor. Diğer ebeveynin genotipini seç, çaprazla ve sonucu doğrula.' },
    { ad: 'Gametler', tur: 'soru', gorev: 'Gamet oluşumunu düşün.',
      soru: { q: 'Genotipi Mm olan bir bezelye bitkisinin oluşturduğu gametlerin yüzde kaçı M aleli taşır?', sec: ['%50', '%100', '%25', '%75'],
        acik: 'Gamet oluşurken aleller ayrılır; her gamete alellerden yalnızca biri gider. Mm bireyin gametlerinin yarısı M, yarısı m taşır (Mendel’in ayrılma ilkesi).' } },
    { ad: 'Çekinik özellik', tur: 'soru', gorev: 'Baskın ve çekinik alelleri düşün.',
      soru: { q: 'Çekinik bir özellik fenotipte hangi durumda görülür?', sec: ['Çekinik alel iki kopya hâlinde (homozigot) bulunduğunda', 'Çekinik alel tek kopya hâlinde bulunduğunda', 'Baskın alel yokken ve çekinik alel hiç bulunmadığında', 'Yalnızca anneden gelen alel çekinikse'],
        acik: 'Çekinik alelin etkisi, baskın alel varken gizlenir. Çekinik özellik ancak iki alel de çekinik olduğunda (mm) fenotipte görünür.' } }
  ];

  function cicek(g, boyut) {
    var mor = g !== 'mm';
    return '<span class="kal-cicek" style="width:' + boyut + 'px;height:' + boyut + 'px;background:' + (mor ? '#a855f7' : '#f8fafc') + '"></span>';
  }
  function gametler(g) { return g === 'MM' ? ['M', 'M'] : g === 'mm' ? ['m', 'm'] : ['M', 'm']; }
  function dogruGen(x, y) { return (x + y).split('').sort().join(''); } // 'Mm' sıralı: M < m

  OY.oyun({
    anahtar: 'fen-kalitim-lab-v1', gorevler: GOREVLER, serbest: null,
    kur: function (g, i, api) {
      var e = api.e;
      if (g.tur === 'soru') { api.soru(g.soru); return; }
      if (g.tur === 'gizli') { gizli(g, api); return; }
      var gA = gametler(g.a), gB = gametler(g.b);
      var hucre = [0, 0, 0, 0], tablo = e('table', { class: 'kal-tablo' });
      var bil = e('div', { class: 'eko-sayac' });
      bil.innerHTML = '<span>Ebeveyn 1: <b>' + g.a + '</b> ' + cicek(g.a, 18) + '</span><span>Ebeveyn 2: <b>' + g.b + '</b> ' + cicek(g.b, 18) + '</span>';
      api.alan.appendChild(bil);
      var uzerinde = e('tr', {});
      uzerinde.appendChild(e('th', {}, '×'));
      gA.forEach(function (x) { uzerinde.appendChild(e('th', {}, x)); });
      tablo.appendChild(uzerinde);
      var tds = [];
      gB.forEach(function (y, r) {
        var tr = e('tr', {});
        tr.appendChild(e('th', {}, y));
        gA.forEach(function (x, c) {
          var td = e('td', { class: 'kal-hucre', tabindex: 0, role: 'button' }, '?');
          tds.push(td);
          td.addEventListener('click', function () {
            var k = r * 2 + c; hucre[k] = (hucre[k] + 1) % 4; yaz();
          });
          tr.appendChild(td);
        });
        tablo.appendChild(tr);
      });
      var sar = e('div', { class: 'kal-sar' }); sar.appendChild(tablo); api.alan.appendChild(sar);
      var tamam = false;
      function yaz() {
        var hepsi = true, hata = 0;
        tds.forEach(function (td, k) {
          var r = Math.floor(k / 2), c = k % 2, v = GEN[hucre[k]];
          td.innerHTML = v === '?' ? '?' : cicek(v, 22) + '<br>' + v;
          td.className = 'kal-hucre';
          if (v === '?') hepsi = false;
          else if (v !== dogruGen(gA[c], gB[r])) { td.classList.add('yanlis'); hata++; }
          else td.classList.add('dogru');
        });
        if (!hepsi) api.mesaj('Her kutuya, satır ve sütun başındaki gametlerin birleşimini yaz.', 'bilgi');
        else if (hata) api.mesaj('✗ ' + hata + ' kutu yanlış. Her kutuda sütundaki ve satırdaki aleli birleştir; baskın alel (M) önce yazılır.', 'tehlike');
        else if (!tamam) { tamam = true; api.mesaj('✅ Punnett karesi doğru!', 'iyi'); api.soru(g.soru, '🔎 Kareyi yorumla'); }
      }
      yaz();
    }
  });

  function gizli(g, api) {
    var e = api.e, secim = 'MM', sonuclar = null;
    var kutu = e('div', { class: 'oy-sahne kal-gizli' });
    kutu.appendChild(e('p', { html: 'Ebeveyn 1: <b>mm</b> ' + cicek('mm', 18) }));
    var sec = e('div', { class: 'oy-araclar' });
    sec.appendChild(e('span', { class: 'hal-soguk' }, 'Ebeveyn 2:'));
    ['MM', 'Mm', 'mm'].forEach(function (x) {
      var b = e('button', { type: 'button', class: 'oy-arac' + (x === secim ? ' aktif' : '') }, x);
      b.addEventListener('click', function () { secim = x; [].forEach.call(sec.querySelectorAll('.oy-arac'), function (c) { c.classList.remove('aktif'); }); b.classList.add('aktif'); });
      sec.appendChild(b);
    });
    var cap = e('button', { type: 'button', class: 'btn btn-yesil ay-onay' }, '🌼 Çaprazla (20 yavru)');
    var dog = e('button', { type: 'button', class: 'btn btn-sari ay-onay' }, '✔ Genotipi doğrula');
    sec.appendChild(cap); sec.appendChild(dog);
    kutu.appendChild(sec);
    var cikti = e('div', { class: 'kal-yavrular' });
    kutu.appendChild(cikti);
    api.alan.appendChild(kutu);
    cap.addEventListener('click', function () {
      var A = gametler('mm'), B = gametler(secim), mor = 0, html = '';
      for (var k = 0; k < 20; k++) {
        var ge = dogruGen(A[Math.floor(Math.random() * 2)], B[Math.floor(Math.random() * 2)]);
        if (ge !== 'mm') mor++;
        html += cicek(ge, 26);
      }
      sonuclar = mor;
      cikti.innerHTML = html + '<p><b>' + mor + '</b> mor, <b>' + (20 - mor) + '</b> beyaz çiçekli yavru.</p>';
    });
    dog.addEventListener('click', function () {
      if (sonuclar === null) { api.mesaj('Önce “Çaprazla” düğmesine basıp yavruları gör.', 'bilgi'); return; }
      if (secim === 'Mm') api.bitir('🎉 Doğru: ebeveyn Mm!', 'mm × Mm çaprazlamasında yavruların yarısı Mm (mor), yarısı mm (beyaz) olur. Yarı yarıya sonuç, baskın fenotipli ebeveynin melez (Mm) olduğunu gösterir; bu bir test çaprazlamasıdır. Küçük sayılarda oran tam 10:10 çıkmayabilir.');
      else if (secim === 'MM') api.mesaj('MM × mm çaprazlamasında tüm yavrular mor olur. Yarı yarıya sonucu veren genotipi dene.', 'tehlike');
      else api.mesaj('mm × mm çaprazlamasında tüm yavrular beyaz olur. Yarı yarıya sonucu veren genotipi dene.', 'tehlike');
    });
  }
})();
