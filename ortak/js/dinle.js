// İngilizce sayfalarında «Dinle» düğmeleri (tarayıcının kendi seslendirmesi).
// .dinle öğesinin metnini okur; .dinle-hepsi düğmesi data-hedef içindeki bütün .dinle öğelerini sırayla okur.
(function () {
  var ses = window.speechSynthesis;
  var hepsi = document.querySelectorAll(".dinle-hepsi");
  if (!ses || typeof SpeechSynthesisUtterance === "undefined") {
    hepsi.forEach(function (b) { b.disabled = true; b.textContent = "Bu tarayıcı seslendirmeyi desteklemiyor"; });
    return;
  }

  var calan = null; // o an çalan düğme

  function sesSec() {
    var liste = ses.getVoices().filter(function (v) { return /^en([-_]|$)/i.test(v.lang); });
    return liste.filter(function (v) { return /en[-_]GB/i.test(v.lang); })[0] || liste[0] || null;
  }

  function temizle(metin) {
    return metin.replace(/[↘↗]/g, "").replace(/AmE:/g, "").replace(/\s+/g, " ").trim();
  }

  function durdur() {
    ses.cancel();
    if (calan) { calan.classList.remove("caliyor"); calan.setAttribute("aria-pressed", "false"); }
    calan = null;
  }

  function oku(parcalar, dugme) {
    var ayni = calan === dugme;
    durdur();
    if (ayni) return; // çalan düğmeye yeniden basmak durdurur
    calan = dugme;
    dugme.classList.add("caliyor");
    dugme.setAttribute("aria-pressed", "true");
    var v = sesSec();
    parcalar.forEach(function (m, i) {
      var u = new SpeechSynthesisUtterance(m);
      u.lang = v ? v.lang : "en-GB";
      if (v) u.voice = v;
      u.rate = 0.85;
      if (i === parcalar.length - 1) {
        u.onend = u.onerror = function () { if (calan === dugme) durdur(); };
      }
      ses.speak(u);
    });
  }

  // «Dinle» düğmesi eklenmeden ÖNCE metinler alınır; düğmenin simgesi okunmaz.
  var ogeler = Array.prototype.map.call(document.querySelectorAll(".dinle"), function (el) {
    return { el: el, metin: temizle(el.textContent) };
  });

  hepsi.forEach(function (dugme) {
    var hedef = dugme.getAttribute("data-hedef");
    var parcalar = ogeler.filter(function (o) { return o.el.closest("#" + hedef); }).map(function (o) { return o.metin; });
    dugme.addEventListener("click", function () { oku(parcalar, dugme); });
  });

  ogeler.forEach(function (o) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "dinle-dugme";
    b.textContent = "🔊";
    b.setAttribute("aria-label", "Dinle: " + o.metin);
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", function () { oku([o.metin], b); });
    o.el.appendChild(document.createTextNode(" "));
    o.el.appendChild(b);
  });

  // Cihazda ses var ama hiçbiri İngilizce değilse düğmeler kapatılır:
  // aksi hâlde İngilizce metin başka dilin sesiyle, yanlış söyleyişle okunabilir.
  function sesDurumu() {
    var yok = ses.getVoices().length > 0 && !sesSec();
    var uyari = document.getElementById("ses-uyari");
    if (yok) durdur();
    document.querySelectorAll(".dinle-dugme, .dinle-hepsi").forEach(function (b) { b.disabled = yok; });
    if (yok && !uyari && hepsi.length) {
      uyari = document.createElement("div");
      uyari.id = "ses-uyari";
      uyari.className = "ses-uyari";
      uyari.setAttribute("role", "status");
      uyari.textContent = "Bu cihazda ya da tarayıcıda İngilizce ses bulunamadı; bu yüzden «Dinle» düğmeleri kapalı. " +
        "Başka bir tarayıcı ya da cihaz dene veya cihaz ayarlarından İngilizce ses ekle. " +
        "Dinleyemiyorsan hikâyenin metnini açıp okuyabilirsin.";
      hepsi[0].parentNode.insertAdjacentElement("afterend", uyari);
    } else if (!yok && uyari) {
      uyari.remove();
    }
  }

  sesDurumu();
  if (ses.addEventListener) ses.addEventListener("voiceschanged", sesDurumu);
  window.addEventListener("pagehide", durdur);
})();
