// תפריט: המבורגר במובייל + תפריטים נפתחים (מקלדת/מגע)
(function () {
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');

  function setBurger(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'סגירת תפריט' : 'פתיחת תפריט');
  }
  burger.addEventListener('click', function () { setBurger(!nav.classList.contains('open')); });

  document.querySelectorAll('.has-menu > button').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var li = btn.parentElement;
      var open = !li.classList.contains('open');
      document.querySelectorAll('.has-menu.open').forEach(function (o) {
        o.classList.remove('open');
        o.firstElementChild.setAttribute('aria-expanded', 'false');
      });
      li.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
      e.stopPropagation();
    });
  });

  // סגירה בלחיצה בחוץ / Esc / אחרי ניווט
  function closeAll() {
    document.querySelectorAll('.has-menu.open').forEach(function (o) {
      o.classList.remove('open');
      o.firstElementChild.setAttribute('aria-expanded', 'false');
    });
  }
  document.addEventListener('click', closeAll);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAll(); setBurger(false); } });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { closeAll(); setBurger(false); });
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
