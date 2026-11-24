// Element Kartları – ilk 20 element ve bazı yaygın elementlerle kart oyunları (7-8. sınıf, madde üniteleri)
(function () {
  'use strict';
  var kok = document.getElementById('oyun');
  if (!kok) return;
  var KAYIT = 'fen-element-kartlari-v1';

  // k: metal / ametal / yarı metal / soygaz ; dz: elektron dizilimi (yalnızca ilk 20) ; not: ilginç bilgi
  var EL = [
    { z: 1, s: 'H', ad: 'Hidrojen', k: 'ametal', dz: [1], m: '1', not: 'Evrendeki en bol ve en hafif elementtir. Periyodik sistemde 1A grubunda yer alsa da ametaldir.' },
    { z: 2, s: 'He', ad: 'Helyum', k: 'soygaz', dz: [2], m: '4', not: 'Havadan hafiftir, balonları uçurur. Son katmanı iki elektronla doludur.' },
    { z: 3, s: 'Li', ad: 'Lityum', k: 'metal', dz: [2, 1], m: '7', not: 'En hafif metaldir; şarj edilebilir pillerde kullanılır.' },
    { z: 4, s: 'Be', ad: 'Berilyum', k: 'metal', dz: [2, 2], m: '9', not: 'Hafif ve sert bir metaldir.' },
    { z: 5, s: 'B', ad: 'Bor', k: 'yarı metal', dz: [2, 3], m: '11', not: 'Yarı metaldir; ülkemiz dünyanın en büyük bor rezervlerine sahiptir.' },
    { z: 6, s: 'C', ad: 'Karbon', k: 'ametal', dz: [2, 4], m: '12', not: 'Elmas ve grafit, aynı elementin farklı yapılarıdır. Canlıların temel elementidir.' },
    { z: 7, s: 'N', ad: 'Azot', k: 'ametal', dz: [2, 5], m: '14', not: 'Havanın yaklaşık %78’ini oluşturur.' },
    { z: 8, s: 'O', ad: 'Oksijen', k: 'ametal', dz: [2, 6], m: '16', not: 'Havanın yaklaşık beşte birini oluşturur; yanmayı ve solunumu sağlar.' },
    { z: 9, s: 'F', ad: 'Flor', k: 'ametal', dz: [2, 7], m: '19', not: 'Diş macunlarında flor bileşikleri bulunur.' },
    { z: 10, s: 'Ne', ad: 'Neon', k: 'soygaz', dz: [2, 8], m: '20', not: 'Tabelalarda kırmızı-turuncu ışık verir.' },
    { z: 11, s: 'Na', ad: 'Sodyum', k: 'metal', dz: [2, 8, 1], m: '23', not: 'Yumuşak bir metaldir, suyla şiddetli tepkime verir. Sofra tuzunun (NaCl) bir bileşenidir. Sembolü Latince “natrium”dan gelir.' },
    { z: 12, s: 'Mg', ad: 'Magnezyum', k: 'metal', dz: [2, 8, 2], m: '24', not: 'Yanarken parlak beyaz ışık verir; bitkilerde klorofilin merkezindedir.' },
    { z: 13, s: 'Al', ad: 'Alüminyum', k: 'metal', dz: [2, 8, 3], m: '27', not: 'Hafif bir metaldir; içecek kutularında ve uçaklarda kullanılır.' },
    { z: 14, s: 'Si', ad: 'Silisyum', k: 'yarı metal', dz: [2, 8, 4], m: '28', not: 'Yarı metaldir; kumun ve bilgisayar çiplerinin temel elementidir.' },
    { z: 15, s: 'P', ad: 'Fosfor', k: 'ametal', dz: [2, 8, 5], m: '31', not: 'Kibrit başlarında ve kemiklerde bulunur.' },
    { z: 16, s: 'S', ad: 'Kükürt', k: 'ametal', dz: [2, 8, 6], m: '32', not: 'Sarı renkli katı bir ametaldir.' },
    { z: 17, s: 'Cl', ad: 'Klor', k: 'ametal', dz: [2, 8, 7], m: '35,5', not: 'Havuz sularını dezenfekte etmek için kullanılır; sofra tuzunun diğer bileşenidir.' },
    { z: 18, s: 'Ar', ad: 'Argon', k: 'soygaz', dz: [2, 8, 8], m: '40', not: 'Ampullerde koruyucu gaz olarak kullanılır.' },
    { z: 19, s: 'K', ad: 'Potasyum', k: 'metal', dz: [2, 8, 8, 1], m: '39', not: 'Yumuşak bir metaldir. Sembolü Latince “kalium”dan gelir.' },
    { z: 20, s: 'Ca', ad: 'Kalsiyum', k: 'metal', dz: [2, 8, 8, 2], m: '40', not: 'Kemik ve dişlerin yapısında bulunur.' },
    { z: 26, s: 'Fe', ad: 'Demir', k: 'metal', m: '56', not: 'Mıknatıs tarafından çekilir; çelik yapımında kullanılır. Sembolü Latince “ferrum”dan gelir.' },
    { z: 29, s: 'Cu', ad: 'Bakır', k: 'metal', m: '64', not: 'Kırmızımsı kahverengidir; elektriği çok iyi iletir, kablolarda kullanılır. Sembolü Latince “cuprum”dan gelir.' },
    { z: 30, s: 'Zn', ad: 'Çinko', k: 'metal', m: '65', not: 'Demiri paslanmaya karşı korumak için kaplamada kullanılır.' },
    { z: 47, s: 'Ag', ad: 'Gümüş', k: 'metal', m: '108', not: 'Elektriği ve ısıyı en iyi ileten metaldir. Sembolü Latince “argentum”dan gelir.' },
    { z: 79, s: 'Au', ad: 'Altın', k: 'metal', m: '197', not: 'Paslanmaz, parlak, sarı renkli bir metaldir. Sembolü Latince “aurum”dan gelir.' },
    { z: 80, s: 'Hg', ad: 'Cıva', k: 'metal', m: '201', not: 'Oda koşullarında sıvı olan tek metaldir; zehirlidir. Sembolü Latince “hydrargyrum”dan gelir.' },
    { z: 82, s: 'Pb', ad: 'Kurşun', k: 'metal', m: '207', not: 'Yoğun ve yumuşak bir metaldir; zehirlidir. Sembolü Latince “plumbum”dan gelir.' }
  ];
  var BY = {}; EL.forEach(function (x) { BY[x.s] = x; });
  var ILK20 = EL.filter(function (x) { return x.z <= 20; });
  var LATIN = ['Na', 'K', 'Fe', 'Cu', 'Ag', 'Au', 'Hg', 'Pb'].map(function (s) { return BY[s]; });
  var KATEGORI = ['metal', 'ametal', 'yarı metal', 'soygaz'];
  var KRENK = { 'metal': 'k-metal', 'ametal': 'k-ametal', 'yarı metal': 'k-yari', 'soygaz': 'k-soy' };

  var IPUCU = [
    { s: 'O', ip: ['Atom numarası 8’dir.', 'Havanın yaklaşık beşte birini oluşturur.', 'Yanmanın gerçekleşmesi için gereklidir.'] },
    { s: 'Na', ip: ['Atom numarası 11’dir.', 'Bıçakla kesilebilecek kadar yumuşak bir metaldir.', 'Sofra tuzunun bileşenlerinden biridir.'] },
    { s: 'Ne', ip: ['Atom numarası 10’dur.', 'Bir soygazdır.', 'Tabelalarda kırmızı-turuncu ışık verir.'] },
    { s: 'He', ip: ['Atom numarası 2’dir.', 'Soygazlardan biridir.', 'Havadan hafif olduğu için balonları uçurur.'] },
    { s: 'C', ip: ['Atom numarası 6’dır.', 'Elmas ve grafit bu elementin farklı yapılarıdır.', 'Kömürün ana bileşenidir.'] },
    { s: 'Fe', ip: ['Atom numarası 26’dır.', 'Mıknatıs tarafından çekilir.', 'Çelik yapımında kullanılır.'] },
    { s: 'Si', ip: ['Atom numarası 14’tür.', 'Bir yarı metaldir.', 'Kumun ve bilgisayar çiplerinin temel elementidir.'] },
    { s: 'Hg', ip: ['Atom numarası 80’dir.', 'Oda koşullarında sıvı olan tek metaldir.', 'Eskiden termometrelerde kullanılırdı.'] },
    { s: 'Cl', ip: ['Atom numarası 17’dir.', 'Sarı-yeşil renkli, zehirli bir gazdır.', 'Havuz sularının dezenfeksiyonunda kullanılır.'] },
    { s: 'Ca', ip: ['Atom numarası 20’dir.', 'Bir metaldir.', 'Kemik ve dişlerin yapısında bulunur.'] },
    { s: 'Mg', ip: ['Atom numarası 12’dir.', 'Yanarken parlak beyaz ışık verir.', 'Bitkilerde klorofilin merkezinde bulunur.'] },
    { s: 'Cu', ip: ['Atom numarası 29’dur.', 'Kırmızımsı kahverengi bir metaldir.', 'Elektrik kablolarında kullanılır.'] }
  ];

  var GOREVLER = [
    { ad: 'Eşleştirme', tur: 'hafiza', gorev: 'Her element adını kendi sembolüyle eşleştir. Kartları çevirerek çiftleri bul.' },
    { ad: 'Sembol avı', tur: 'quiz', havuz: 'ilk20', gorev: 'İlk 20 elementin ad, sembol ve atom numaralarını bil. 10 sorudan en az 8’ini doğru yap.' },
    { ad: 'Sınıflandır', tur: 'sinif', gorev: 'Kartları doğru sepete koy: metal, ametal, yarı metal ya da soygaz. Kartı seç, sonra sepete tıkla.' },
    { ad: 'Periyodik tablo', tur: 'tablo', gorev: 'Eksik elementleri tabloya yerleştir. Kartta elektron dizilimi yazıyor: katman sayısı periyodu, son katmandaki elektron sayısı A grubunu verir.' },
    { ad: 'Latince semboller', tur: 'quiz', havuz: 'latin', gorev: 'Bazı elementlerin sembolü Türkçe adından türemez, Latince adından gelir. 10 sorudan en az 8’ini doğru yap.' },
    { ad: 'Kim bu element?', tur: 'kim', gorev: 'İpuçlarından elementi tahmin et. Ne kadar az ipucu kullanırsan o kadar çok puan alırsın.' }
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
  function karistir(a) {
    var r = a.slice();
    for (var i = r.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = r[i]; r[i] = r[j]; r[j] = t; }
    return r;
  }
  function sec(a, n) { return karistir(a).slice(0, n); }

  var sev = 0, gorev = GOREVLER[0], alan, sonuc;

  function yukle(i) {
    sev = i; gorev = i === 'serbest' ? null : GOREVLER[i];
    kok.innerHTML = '';
    var chips = e('div', { class: 'oy-chips' });
    GOREVLER.forEach(function (g, k) {
      var tm = kayit.bitti.indexOf(k) >= 0;
      var b = e('button', { type: 'button', class: 'oy-chip' + (sev === k ? ' aktif' : '') + (tm ? ' bitti' : '') }, (tm ? '✓ ' : '') + (k + 1));
      b.title = g.ad;
      b.addEventListener('click', function () { yukle(k); });
      chips.appendChild(b);
    });
    var bs = e('button', { type: 'button', class: 'oy-chip' + (sev === 'serbest' ? ' aktif' : '') }, '📚 Kart koleksiyonu');
    bs.addEventListener('click', function () { yukle('serbest'); });
    chips.appendChild(bs);
    kok.appendChild(chips);
    var gv = e('div', { class: 'oy-gorev' });
    gv.appendChild(e('h2', {}, gorev ? 'Görev ' + (sev + 1) + ': ' + gorev.ad : '📚 Kart koleksiyonu'));
    gv.appendChild(e('p', { class: 'oy-hedef', html: '🎯 ' + (gorev ? gorev.gorev : 'Bir karta tıkla; elementin bilgilerini gör. Filtre ile gruplara bak.') }));
    kok.appendChild(gv);
    alan = e('div', { class: 'el-alan' });
    kok.appendChild(alan);
    sonuc = e('div', { class: 'oy-sonuc' });
    kok.appendChild(sonuc);
    if (!gorev) koleksiyon();
    else if (gorev.tur === 'hafiza') hafiza();
    else if (gorev.tur === 'quiz') quiz();
    else if (gorev.tur === 'sinif') sinif();
    else if (gorev.tur === 'tablo') tablo();
    else kim();
  }

  function bitir(baslik, aciklama, tekrar) {
    if (kayit.bitti.indexOf(sev) < 0) { kayit.bitti.push(sev); kaydet(); }
    var chip = kok.querySelectorAll('.oy-chip')[sev];
    if (chip) { chip.classList.add('bitti'); chip.textContent = '✓ ' + (sev + 1); }
    var kutu = e('div', { class: 'oy-basari' });
    kutu.appendChild(e('h3', {}, baslik));
    if (aciklama) kutu.appendChild(e('p', { html: aciklama }));
    var son = sev === GOREVLER.length - 1;
    var b = e('button', { type: 'button', class: 'btn btn-sari' }, son ? '📚 Kart koleksiyonuna geç' : 'Sonraki görev ▶');
    b.addEventListener('click', function () { yukle(son ? 'serbest' : sev + 1); });
    kutu.appendChild(b);
    var t = e('button', { type: 'button', class: 'oy-arac' }, '↺ Tekrar oyna');
    t.addEventListener('click', function () { yukle(sev); });
    kutu.appendChild(document.createTextNode(' ')); kutu.appendChild(t);
    sonuc.innerHTML = ''; sonuc.appendChild(kutu);
  }
  function basarisiz(mesaj) {
    var kutu = e('div', { class: 'oy-durum bilgi' }, mesaj + ' ');
    var t = e('button', { type: 'button', class: 'oy-arac' }, '↺ Tekrar dene');
    t.addEventListener('click', function () { yukle(sev); });
    kutu.appendChild(t);
    sonuc.innerHTML = ''; sonuc.appendChild(kutu);
  }
  function kart(x, ek) {
    var d = e('div', { class: 'el-kart ' + KRENK[x.k] + (ek ? ' ' + ek : '') });
    d.innerHTML = '<small>' + x.z + '</small><b>' + x.s + '</b><span>' + x.ad + '</span>';
    return d;
  }

  /* ---- 1. Eşleştirme (hafıza) ---- */
  function hafiza() {
    var secilen = sec(ILK20, 8), kartlar = [];
    secilen.forEach(function (x) { kartlar.push({ id: x.s, t: x.s, tip: 's' }); kartlar.push({ id: x.s, t: x.ad, tip: 'a' }); });
    kartlar = karistir(kartlar);
    var acik = [], kilit = false, bulunan = 0, hamle = 0;
    var bilgi = e('div', { class: 'eko-sayac' });
    var izg = e('div', { class: 'el-hafiza' });
    alan.appendChild(bilgi); alan.appendChild(izg);
    function yaz() { bilgi.innerHTML = '<span>🔁 Hamle: <b>' + hamle + '</b></span><span>✅ Bulunan çift: <b>' + bulunan + ' / 8</b></span>'; }
    yaz();
    kartlar.forEach(function (c) {
      var b = e('button', { type: 'button', class: 'el-hk', 'aria-label': 'Kart' });
      b.innerHTML = '<span class="on">?</span><span class="arka ' + (c.tip === 's' ? 'sem' : 'ad') + '">' + c.t + '</span>';
      b.addEventListener('click', function () {
        if (kilit || b.classList.contains('acik') || b.classList.contains('esles')) return;
        b.classList.add('acik'); acik.push({ b: b, c: c });
        if (acik.length === 2) {
          hamle++; kilit = true;
          var A = acik[0], B = acik[1];
          if (A.c.id === B.c.id && A.c.tip !== B.c.tip) {
            A.b.classList.add('esles'); B.b.classList.add('esles'); bulunan++; acik = []; kilit = false; yaz();
            if (bulunan === 8) bitir('🎉 Tüm çiftleri buldun! ' + hamle + ' hamlede.', 'Element sembolleri genellikle adının bir ya da iki harfidir. İlk harf büyük, ikinci harf küçük yazılır (örn. Ca, Cl).');
          } else {
            setTimeout(function () { A.b.classList.remove('acik'); B.b.classList.remove('acik'); acik = []; kilit = false; yaz(); }, 900);
          }
        }
      });
      izg.appendChild(b);
    });
  }

  /* ---- 2 ve 5. Quiz ---- */
  function quiz() {
    var havuz = gorev.havuz === 'latin' ? LATIN : ILK20;
    var secenekHavuz = gorev.havuz === 'latin' ? EL : ILK20;
    var sorular = [], secilen = karistir(havuz);
    while (secilen.length < 10) secilen = secilen.concat(karistir(havuz));
    secilen.slice(0, 10).forEach(function (x, i) {
      var tur = gorev.havuz === 'latin' ? (i % 2 ? 'sembol-ad' : 'ad-sembol') : ['ad-sembol', 'sembol-ad', 'z-ad', 'ad-z'][i % 4];
      sorular.push({ x: x, tur: tur });
    });
    var i = 0, dogru = 0, bilgi = e('div', { class: 'eko-sayac' }), kutu = e('div', { class: 'el-soru' });
    alan.appendChild(bilgi); alan.appendChild(kutu);
    function goster() {
      if (i >= 10) {
        if (dogru >= 8) bitir('🎉 Tamamlandı: ' + dogru + ' / 10 doğru!', gorev.havuz === 'latin' ? 'Na (natrium), K (kalium), Fe (ferrum), Cu (cuprum), Ag (argentum), Au (aurum), Hg (hydrargyrum), Pb (plumbum): bu elementlerin sembolleri Latince adlarından gelir.' : 'Atom numarası, elementin çekirdeğindeki proton sayısıdır.');
        else basarisiz('Sonuç: ' + dogru + ' / 10. Geçmek için en az 8 doğru gerekir.');
        return;
      }
      var q = sorular[i], x = q.x, soru, dg, sec4;
      function digerleri(f) { return sec(secenekHavuz.filter(function (y) { return y !== x; }), 3).map(f); }
      if (q.tur === 'ad-sembol') { soru = '“' + x.ad + '” elementinin sembolü hangisidir?'; dg = x.s; sec4 = digerleri(function (y) { return y.s; }); }
      else if (q.tur === 'sembol-ad') { soru = '“' + x.s + '” sembolü hangi elemente aittir?'; dg = x.ad; sec4 = digerleri(function (y) { return y.ad; }); }
      else if (q.tur === 'z-ad') { soru = 'Atom numarası ' + x.z + ' olan element hangisidir?'; dg = x.ad; sec4 = digerleri(function (y) { return y.ad; }); }
      else { soru = x.ad + ' elementinin atom numarası kaçtır?'; dg = String(x.z); sec4 = digerleri(function (y) { return String(y.z); }); }
      var liste = karistir([dg].concat(sec4));
      bilgi.innerHTML = '<span>Soru <b>' + (i + 1) + ' / 10</b></span><span>✅ Doğru: <b>' + dogru + '</b></span>';
      kutu.innerHTML = '';
      kutu.appendChild(e('p', { class: 'el-soru-metin' }, soru));
      var secs = e('div', { class: 'hal-secenekler' });
      var kilit = false;
      liste.forEach(function (m) {
        var b = e('button', { type: 'button', class: 'hal-secenek' }, m);
        b.addEventListener('click', function () {
          if (kilit) return; kilit = true;
          if (m === dg) { b.classList.add('dogru'); dogru++; } else { b.classList.add('yanlis'); [].forEach.call(secs.children, function (c) { if (c.textContent === dg) c.classList.add('dogru'); }); }
          setTimeout(function () { i++; goster(); }, 900);
        });
        secs.appendChild(b);
      });
      kutu.appendChild(secs);
    }
    goster();
  }

  /* ---- 3. Sınıflandır ---- */
  function sinif() {
    var kart12 = karistir([].concat(
      sec(ILK20.filter(function (x) { return x.k === 'metal'; }), 4),
      sec(ILK20.filter(function (x) { return x.k === 'ametal'; }), 4),
      ILK20.filter(function (x) { return x.k === 'yarı metal'; }),
      sec(ILK20.filter(function (x) { return x.k === 'soygaz'; }), 2)));
    var secili = null, hata = 0, kalan = kart12.length;
    var havuz = e('div', { class: 'el-havuz' }), sepetler = e('div', { class: 'el-sepetler' }), mesaj = e('div', { class: 'oy-durum bilgi', 'aria-live': 'polite' }, 'Bir kart seç.');
    var kartDom = {};
    kart12.forEach(function (x) {
      var d = kart(x); d.setAttribute('role', 'button'); d.tabIndex = 0;
      d.addEventListener('click', function () {
        if (secili) kartDom[secili.s].classList.remove('secili');
        secili = x; d.classList.add('secili'); mesaj.textContent = x.ad + ' (' + x.s + ') seçildi. Şimdi doğru sepete tıkla.';
      });
      kartDom[x.s] = d; havuz.appendChild(d);
    });
    KATEGORI.forEach(function (k) {
      var s = e('button', { type: 'button', class: 'el-sepet ' + KRENK[k] });
      var ic = e('div', { class: 'el-sepet-ic' });
      s.appendChild(e('strong', {}, k === 'yarı metal' ? 'Yarı metal' : k.charAt(0).toUpperCase() + k.slice(1))); s.appendChild(ic);
      s.addEventListener('click', function () {
        if (!secili) { mesaj.textContent = 'Önce bir kart seç.'; return; }
        if (secili.k === k) {
          var d = kartDom[secili.s]; d.classList.remove('secili'); d.classList.add('mini'); ic.appendChild(d); mesaj.textContent = '✓ Doğru!'; mesaj.className = 'oy-durum iyi';
          secili = null; kalan--;
          if (!kalan) bitir('🎉 Hepsini doğru yerleştirdin! (' + hata + ' hata)', 'Metaller parlak ve iyi iletkendir. Ametaller genellikle iletken değildir. Yarı metaller (B, Si) ikisinin özelliklerini taşır. Soygazlar (He, Ne, Ar) kararlıdır. Hidrojen periyodik sistemde 1A’da yer alsa da bir ametaldir.');
        } else {
          hata++; mesaj.textContent = '✗ ' + secili.ad + ' bu sepete ait değil. Özelliklerini düşün ve tekrar dene.'; mesaj.className = 'oy-durum tehlike';
        }
      });
      sepetler.appendChild(s);
    });
    alan.appendChild(havuz); alan.appendChild(mesaj); alan.appendChild(sepetler);
  }

  /* ---- 4. Periyodik tablo ---- */
  function tablo() {
    var konum = {}; // 'p-g' -> element
    ILK20.forEach(function (x) { var p = x.dz.length, g = x.z === 2 ? 8 : x.dz[x.dz.length - 1]; konum[p + '-' + g] = x; });
    var eksik = sec(ILK20.filter(function (x) { return x.z !== 2; }), 10);
    var yerlesen = {}; eksik.forEach(function (x) { yerlesen[x.s] = false; });
    var secili = null, hata = 0, kalan = eksik.length;
    var mesaj = e('div', { class: 'oy-durum bilgi', 'aria-live': 'polite' }, 'Bir kart seç, sonra tablodaki boş kutuya tıkla.');
    var havuz = e('div', { class: 'el-havuz' }), tb = e('div', { class: 'el-tablo' });
    var kartDom = {};
    eksik.forEach(function (x) {
      var d = e('div', { class: 'el-kart adli ' + KRENK[x.k], role: 'button', tabindex: 0 });
      d.innerHTML = '<small>' + x.z + '</small><b>' + x.ad + '</b><span>' + x.dz.join(' , ') + '</span>';
      d.addEventListener('click', function () { if (secili) kartDom[secili.s].classList.remove('secili'); secili = x; d.classList.add('secili'); mesaj.textContent = x.ad + ' seçildi (elektron dizilimi: ' + x.dz.join(', ') + ').'; mesaj.className = 'oy-durum bilgi'; });
      kartDom[x.s] = d; havuz.appendChild(d);
    });
    tb.appendChild(e('div', { class: 'et-baslik' }, ''));
    ['1A', '2A', '3A', '4A', '5A', '6A', '7A', '8A'].forEach(function (g) { tb.appendChild(e('div', { class: 'et-baslik' }, g)); });
    for (var p = 1; p <= 4; p++) {
      tb.appendChild(e('div', { class: 'et-baslik' }, p + '. periyot'));
      for (var g = 1; g <= 8; g++) {
        (function (p, g) {
          var x = konum[p + '-' + g];
          var h = e('button', { type: 'button', class: 'et-hucre' });
          if (!x) { h.classList.add('yok'); h.disabled = true; h.textContent = '·'; }
          else if (eksik.indexOf(x) < 0) { h.classList.add('dolu', KRENK[x.k]); h.innerHTML = '<small>' + x.z + '</small><b>' + x.s + '</b>'; h.disabled = true; }
          else {
            h.classList.add('bos'); h.textContent = '?';
            h.addEventListener('click', function () {
              if (!secili) { mesaj.textContent = 'Önce bir kart seç.'; mesaj.className = 'oy-durum bilgi'; return; }
              if (secili === x) {
                h.className = 'et-hucre dolu ' + KRENK[x.k]; h.innerHTML = '<small>' + x.z + '</small><b>' + x.s + '</b>'; h.disabled = true;
                kartDom[x.s].remove(); secili = null; kalan--; mesaj.textContent = '✓ Doğru!'; mesaj.className = 'oy-durum iyi';
                if (!kalan) bitir('🎉 Tabloyu tamamladın! (' + hata + ' hata)', 'Elementin periyot numarası elektron katmanı sayısına, A grubu numarası son katmandaki elektron sayısına eşittir. Aynı gruptaki elementler benzer özellik gösterir. (Helyum, son katmanında 2 elektron bulunmasına rağmen kararlı olduğu için 8A’da yer alır.)');
              } else {
                hata++; mesaj.textContent = '✗ Burası değil. Hatırla: katman sayısı = periyot, son katmandaki elektron sayısı = A grubu.'; mesaj.className = 'oy-durum tehlike';
              }
            });
          }
          tb.appendChild(h);
        })(p, g);
      }
    }
    alan.appendChild(havuz); alan.appendChild(mesaj); alan.appendChild(tb);
  }

  /* ---- 6. Kim bu element? ---- */
  function kim() {
    var turlar = sec(IPUCU, 6), i = 0, puan = 0, bilgi = e('div', { class: 'eko-sayac' }), kutu = e('div', { class: 'el-soru' });
    alan.appendChild(bilgi); alan.appendChild(kutu);
    function goster() {
      if (i >= 6) {
        if (puan >= 10) bitir('🎉 Toplam puan: ' + puan + ' / 18', 'Elementleri atom numarası, sınıfı (metal, ametal…) ve kullanım alanlarından tanıyabilirsin.');
        else basarisiz('Toplam puan: ' + puan + ' / 18. Geçmek için en az 10 puan gerekir.');
        return;
      }
      var q = turlar[i], x = BY[q.s], acilan = 1, bitti = false;
      var secs = sec(EL.filter(function (y) { return y !== x; }), 3).concat([x]);
      secs = karistir(secs);
      function yaz() {
        bilgi.innerHTML = '<span>Soru <b>' + (i + 1) + ' / 6</b></span><span>⭐ Puan: <b>' + puan + '</b></span>';
        kutu.innerHTML = '';
        var ul = e('ol', { class: 'el-ipucu' });
        for (var k = 0; k < acilan; k++) ul.appendChild(e('li', {}, q.ip[k]));
        kutu.appendChild(e('p', { class: 'el-soru-metin' }, 'Bu hangi element? (şu an ' + (4 - acilan) + ' puan değerinde)'));
        kutu.appendChild(ul);
        if (acilan < 3) {
          var ib = e('button', { type: 'button', class: 'oy-ipucu' }, '💡 Yeni ipucu');
          ib.addEventListener('click', function () { acilan++; yaz(); });
          kutu.appendChild(ib);
        }
        var sc = e('div', { class: 'hal-secenekler' });
        secs.forEach(function (y) {
          var b = e('button', { type: 'button', class: 'hal-secenek' }, y.ad + ' (' + y.s + ')');
          if (y._yanlis) { b.disabled = true; b.classList.add('yanlis'); }
          b.addEventListener('click', function () {
            if (bitti) return;
            if (y === x) { bitti = true; b.classList.add('dogru'); puan += 4 - acilan; setTimeout(function () { i++; goster(); }, 1100); }
            else { y._yanlis = true; b.classList.add('yanlis'); b.disabled = true; if (acilan < 3) acilan++; setTimeout(yaz, 500); }
          });
          sc.appendChild(b);
        });
        kutu.appendChild(sc);
      }
      secs.forEach(function (y) { delete y._yanlis; });
      yaz();
    }
    goster();
  }

  /* ---- Kart koleksiyonu ---- */
  function koleksiyon() {
    var filtre = 'hepsi';
    var fb = e('div', { class: 'oy-chips' }), izg = e('div', { class: 'el-izgara' }), detay = e('div', { class: 'oy-basari el-detay' }, 'Bir karta tıkla.');
    function ciz() {
      izg.innerHTML = '';
      EL.filter(function (x) { return filtre === 'hepsi' || x.k === filtre; }).forEach(function (x) {
        var d = kart(x); d.setAttribute('role', 'button'); d.tabIndex = 0;
        d.addEventListener('click', function () {
          var g = x.dz ? '<br><strong>Elektron dizilimi:</strong> ' + x.dz.join(', ') + ' · <strong>Periyot:</strong> ' + x.dz.length + ' · <strong>Grup:</strong> ' + (x.z === 2 ? '8A' : x.dz[x.dz.length - 1] + 'A') : '';
          detay.innerHTML = '<h3>' + x.ad + ' (' + x.s + ')</h3><p><strong>Atom numarası:</strong> ' + x.z + ' · <strong>Atom kütlesi:</strong> ≈ ' + x.m + ' · <strong>Sınıf:</strong> ' + x.k + g + '<br>' + x.not + '</p>';
        });
        izg.appendChild(d);
      });
    }
    ['hepsi'].concat(KATEGORI).forEach(function (k) {
      var b = e('button', { type: 'button', class: 'oy-chip' + (filtre === k ? ' aktif' : '') }, k === 'hepsi' ? 'Hepsi' : k);
      b.addEventListener('click', function () { filtre = k; [].forEach.call(fb.children, function (c) { c.classList.remove('aktif'); }); b.classList.add('aktif'); ciz(); });
      fb.appendChild(b);
    });
    alan.appendChild(fb); alan.appendChild(detay); alan.appendChild(izg);
    ciz();
  }

  yukle(0);
})();
