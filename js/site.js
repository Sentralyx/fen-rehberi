// Telefonda açılır menü
(function () {
  var buton = document.querySelector(".menu-btn");
  var menu = document.querySelector(".menu");
  if (!buton || !menu) return;
  buton.addEventListener("click", function () {
    var acik = menu.classList.toggle("acik");
    buton.setAttribute("aria-expanded", acik ? "true" : "false");
  });
})();
