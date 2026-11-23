// Test motoru: sayfadaki TEST_SORULARI dizisini #test alanına çizer.
(function () {
  var alan = document.getElementById("test");
  if (!alan || typeof TEST_SORULARI === "undefined") return;

  var harfler = ["A", "B", "C", "D", "E"];
  var toplam = TEST_SORULARI.length;
  var cevaplanan, dogruSayisi;

  // Üst kısım: ilerleme çubuğu ve sayaç
  var ust = document.createElement("div");
  ust.className = "test-ust";
  var cubuk = document.createElement("div");
  cubuk.className = "test-ilerleme";
  var dolgu = document.createElement("div");
  cubuk.appendChild(dolgu);
  var sayac = document.createElement("span");
  sayac.className = "test-sayac";
  ust.appendChild(cubuk);
  ust.appendChild(sayac);

  var sorular = document.createElement("div");

  // Sonuç kartı
  var sonuc = document.createElement("div");
  sonuc.className = "sonuc";
  var sonucBaslik = document.createElement("div");
  sonucBaslik.textContent = "Test Sonucun";
  var puan = document.createElement("div");
  puan.className = "sonuc-puan";
  var mesaj = document.createElement("p");
  mesaj.className = "sonuc-mesaj";
  var tekrar = document.createElement("button");
  tekrar.type = "button";
  tekrar.className = "btn btn-sari";
  tekrar.textContent = "Testi Tekrar Çöz ↻";
  sonuc.appendChild(sonucBaslik);
  sonuc.appendChild(puan);
  sonuc.appendChild(mesaj);
  sonuc.appendChild(tekrar);

  alan.appendChild(ust);
  alan.appendChild(sorular);
  alan.appendChild(sonuc);

  function guncelle() {
    dolgu.style.width = (cevaplanan / toplam * 100) + "%";
    sayac.textContent = cevaplanan + " / " + toplam + " soru";
  }

  function bitir() {
    puan.textContent = dogruSayisi + " / " + toplam;
    var oran = dogruSayisi / toplam;
    if (oran === 1) mesaj.textContent = "Mükemmel! Hepsini doğru yaptın 🏆";
    else if (oran >= 0.6) mesaj.textContent = "Çok iyi! Küçük bir tekrarla tam puan senin 👏";
    else mesaj.textContent = "Konuyu bir kez daha oku, sonra tekrar dene 💪";
    sonuc.style.display = "block";
    sonuc.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function ciz() {
    cevaplanan = 0;
    dogruSayisi = 0;
    sorular.innerHTML = "";
    sonuc.style.display = "none";
    guncelle();

    TEST_SORULARI.forEach(function (s, i) {
      var kutu = document.createElement("div");
      kutu.className = "soru";

      var metin = document.createElement("p");
      metin.textContent = (i + 1) + ". " + s.soru;
      kutu.appendChild(metin);

      var aciklama = document.createElement("div");
      aciklama.className = "aciklama";
      aciklama.textContent = "💡 " + s.aciklama;

      var butonlar = [];
      s.secenekler.forEach(function (secenek, j) {
        var b = document.createElement("button");
        b.className = "secenek";
        b.type = "button";
        var harf = document.createElement("span");
        harf.className = "harf";
        harf.textContent = harfler[j];
        var yazi = document.createElement("span");
        yazi.textContent = secenek;
        b.appendChild(harf);
        b.appendChild(yazi);
        b.addEventListener("click", function () {
          butonlar.forEach(function (x) { x.disabled = true; });
          butonlar[s.dogru].classList.add("dogru");
          if (j === s.dogru) {
            dogruSayisi++;
          } else {
            b.classList.add("yanlis");
          }
          aciklama.style.display = "block";
          cevaplanan++;
          guncelle();
          if (cevaplanan === toplam) bitir();
        });
        butonlar.push(b);
        kutu.appendChild(b);
      });

      kutu.appendChild(aciklama);
      sorular.appendChild(kutu);
    });
  }

  tekrar.addEventListener("click", function () {
    ciz();
    alan.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  ciz();
})();
