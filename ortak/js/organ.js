// Vücut Haritası – organları sistemlere ayır, besinin ve kanın yolunu sırala (6-7. sınıf, canlılarda sistemler)
(function () {
  'use strict';

  var SISTEMLER = ['Sindirim', 'Dolaşım', 'Solunum', 'Boşaltım', 'Destek ve hareket', 'Sinir'];
  var ORGAN = {
    'Sindirim': [['🫃', 'Mide'], ['🌭', 'İnce bağırsak'], ['🟤', 'Karaciğer'], ['〰️', 'Yemek borusu'], ['🧻', 'Kalın bağırsak']],
    'Dolaşım': [['❤️', 'Kalp'], ['🩸', 'Atardamar'], ['💉', 'Toplardamar'], ['🔴', 'Kılcal damar']],
    'Solunum': [['🫁', 'Akciğer'], ['🌬️', 'Soluk borusu'], ['🌀', 'Bronş'], ['🫧', 'Alveol']],
    'Boşaltım': [['🫘', 'Böbrek'], ['💧', 'İdrar kesesi'], ['🧪', 'Üreter']],
    'Destek ve hareket': [['🦴', 'Kemik'], ['💪', 'Kas'], ['🦵', 'Eklem']],
    'Sinir': [['🧠', 'Beyin'], ['🧵', 'Omurilik'], ['⚡', 'Sinir']]
  };

  var GOREVLER = [
    { ad: 'Organ – sistem eşleştirme', tur: 'sinif', gorev: 'Organ kartını seç, sonra ait olduğu sistemin sepetine tıkla.',
      acik: 'İnsan vücudunda organlar ortak bir görev için sistemler hâlinde çalışır: sindirim sistemi besinleri parçalar, dolaşım sistemi madde taşır, solunum sistemi gaz alışverişi yapar, boşaltım sistemi atıkları uzaklaştırır, destek ve hareket sistemi şekil verip hareket sağlar, sinir sistemi denetler.' },
    { ad: 'Besinin yolculuğu', tur: 'sirala', liste: ['Ağız', 'Yemek borusu', 'Mide', 'İnce bağırsak', 'Kalın bağırsak', 'Anüs'],
      gorev: 'Besinin sindirim sistemindeki yolunu doğru sırayla tıkla: ağızdan başla.',
      acik: 'Besin ağızda çiğnenir ve tükürükle karışır, yemek borusundan mideye gider; mide ve ince bağırsakta kimyasal sindirim tamamlanır, besinler ince bağırsakta kana geçer. Kalın bağırsakta su emilir, artıklar anüsten atılır.' },
    { ad: 'Havanın yolu', tur: 'sirala', liste: ['Burun', 'Yutak', 'Gırtlak', 'Soluk borusu', 'Bronşlar', 'Alveoller'],
      gorev: 'Solunum sisteminde havanın izlediği yolu doğru sırayla tıkla: burundan başla.',
      acik: 'Soluk alırken hava burundan girer, yutak ve gırtlaktan geçerek soluk borusuna, oradan bronşlara ve akciğerlerdeki alveollere ulaşır. Gaz alışverişi (oksijen kana, karbondioksit alveole) alveollerde olur.' },
    { ad: 'Kanın yolculuğu', tur: 'sirala', liste: ['Sol karıncık', 'Aort (büyük atardamar)', 'Vücut kılcal damarları', 'Büyük toplardamar', 'Sağ kulakçık', 'Sağ karıncık', 'Akciğer atardamarı', 'Akciğer kılcal damarları', 'Akciğer toplardamarı', 'Sol kulakçık'],
      gorev: 'Kanın bir tam turunu doğru sırayla tıkla: sol karıncıktan başla (önce büyük dolaşım, sonra küçük dolaşım).',
      acik: 'Büyük dolaşımda temiz kan sol karıncıktan aort ile vücuda gider, kılcallarda oksijen verir; kirli kan büyük toplardamarla sağ kulakçığa döner. Küçük dolaşımda kirli kan sağ karıncıktan akciğere gider, alveollerde temizlenir ve akciğer toplardamarıyla sol kulakçığa gelir.' },
    { ad: 'Temiz kanın dönüşü', tur: 'soru', gorev: 'Dolaşım sistemini düşün.',
      soru: { q: 'Akciğerlerde oksijenlenen temiz kan kalbe ilk olarak hangi bölmeye gelir?', sec: ['Sol kulakçık', 'Sağ kulakçık', 'Sol karıncık', 'Sağ karıncık'],
        acik: 'Akciğer toplardamarları oksijence zengin kanı sol kulakçığa taşır; kan buradan sol karıncığa geçer ve aortla vücuda pompalanır.' } },
    { ad: 'Kas ve hareket', tur: 'soru', gorev: 'Hareket sistemini düşün.',
      soru: { q: 'Kolunu dirsekten bükerken ön koldaki pazı kası (iki başlı kol kası) ile arkadaki üç başlı kas nasıl çalışır?', sec: ['Pazı kası kasılır, arka kas gevşer', 'İkisi de kasılır', 'Pazı kası gevşer, arka kas kasılır', 'İkisi de gevşer'],
        acik: 'Kaslar kemiklere kirişlerle bağlıdır ve yalnızca kasılarak çeker. Hareketler zıt çalışan kas çiftleriyle olur: kol bükülürken pazı kası kasılır, arka kol kası gevşer; kol açılırken tersi olur.' } }
  ];

  OY.oyun({
    anahtar: 'fen-organ-sistemleri-v1', gorevler: GOREVLER, serbest: null,
    kur: function (g, i, api) {
      if (g.tur === 'soru') { api.soru(g.soru); return; }
      if (g.tur === 'sinif') sinif(g, api); else sirala(g, api);
    }
  });

  function sinif(g, api) {
    var e = api.e, kartlar = [];
    SISTEMLER.forEach(function (s) { api.karistir(ORGAN[s]).slice(0, 2).forEach(function (o) { kartlar.push({ em: o[0], ad: o[1], s: s }); }); });
    kartlar = api.karistir(kartlar);
    var secili = null, kalan = kartlar.length, hata = 0, dom = {};
    var havuz = e('div', { class: 'el-havuz' }), sepetler = e('div', { class: 'el-sepetler' });
    kartlar.forEach(function (k) {
      var d = e('div', { class: 'el-kart k-ametal adli', role: 'button', tabindex: 0 });
      d.innerHTML = '<b style="font-size:1.5rem">' + k.em + '</b><span>' + k.ad + '</span>';
      d.addEventListener('click', function () { if (secili) dom[secili.ad].classList.remove('secili'); secili = k; d.classList.add('secili'); api.mesaj(k.ad + ' seçildi. Şimdi sepete tıkla.', 'bilgi'); });
      dom[k.ad] = d; havuz.appendChild(d);
    });
    SISTEMLER.forEach(function (s) {
      var b = e('button', { type: 'button', class: 'el-sepet k-metal' }), ic = e('div', { class: 'el-sepet-ic' });
      b.appendChild(e('strong', {}, s)); b.appendChild(ic);
      b.addEventListener('click', function () {
        if (!secili) { api.mesaj('Önce bir organ kartı seç.', 'bilgi'); return; }
        if (secili.s === s) {
          var d = dom[secili.ad]; d.classList.remove('secili'); d.classList.add('mini'); ic.appendChild(d); secili = null; kalan--; api.mesaj('✓ Doğru!', 'iyi');
          if (!kalan) api.bitir('🎉 Tüm organları doğru yerleştirdin! (' + hata + ' hata)', g.acik);
        } else { hata++; api.mesaj('✗ ' + secili.ad + ' bu sisteme ait değil. Organın görevini düşün.', 'tehlike'); }
      });
      sepetler.appendChild(b);
    });
    api.alan.appendChild(havuz); api.alan.appendChild(sepetler);
  }

  function sirala(g, api) {
    var e = api.e, adim = 0, hata = 0;
    var yol = e('div', { class: 'org-yol' }), havuz = e('div', { class: 'org-havuz' });
    api.alan.appendChild(yol); api.alan.appendChild(havuz);
    api.karistir(g.liste).forEach(function (m) {
      var b = e('button', { type: 'button', class: 'hal-secenek org-btn' }, m);
      b.addEventListener('click', function () {
        if (m === g.liste[adim]) {
          b.disabled = true; b.classList.add('dogru'); yol.appendChild(e('span', { class: 'org-adim' }, (adim + 1) + '. ' + m)); adim++;
          api.mesaj('✓ Doğru, sıradaki durağı bul.', 'iyi');
          if (adim === g.liste.length) api.bitir('🎉 Yolculuğu tamamladın! (' + hata + ' hata)', g.acik);
        } else { hata++; api.mesaj('✗ Sıradaki durak bu değil. Yol: ' + (adim ? g.liste[adim - 1] + ' → ?' : 'başlangıç noktasını bul') , 'tehlike'); }
      });
      havuz.appendChild(b);
    });
    api.mesaj('Başlangıç noktasından başlayarak sırayla tıkla.', 'bilgi');
  }
})();
