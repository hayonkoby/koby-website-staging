// תפריט: המבורגר במובייל + תפריטים נפתחים (עכבר/מקלדת/מגע).
// מצב התפריט נקבע רק לפי המחלקה open; ה-CSS לא פותח תפריט לפי focus-within, ולכן Escape סוגר באמת.
(function () {
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  var menus = Array.prototype.slice.call(document.querySelectorAll('.has-menu'));

  function setBurger(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'סגירת תפריט' : 'פתיחת תפריט');
  }
  burger.addEventListener('click', function () { setBurger(!nav.classList.contains('open')); });

  function setMenu(li, open) {
    li.classList.toggle('open', open);
    li.firstElementChild.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function closeAll(except) {
    menus.forEach(function (li) { if (li !== except && li.classList.contains('open')) setMenu(li, false); });
  }

  menus.forEach(function (li) {
    var btn = li.firstElementChild;
    btn.addEventListener('click', function (e) {
      var open = !li.classList.contains('open');
      closeAll(li);
      li.classList.remove('closed');
      setMenu(li, open);
      e.stopPropagation();
    });
    // פתיחה במעבר עכבר (דסקטופ בלבד); Escape משתיק את הפתיחה עד שהעכבר יוצא
    li.addEventListener('mouseenter', function () {
      if (window.matchMedia('(hover: hover) and (min-width: 901px)').matches && !li.classList.contains('closed')) { closeAll(li); setMenu(li, true); }
    });
    li.addEventListener('mouseleave', function () { li.classList.remove('closed'); if (window.matchMedia('(hover: hover) and (min-width: 901px)').matches) setMenu(li, false); });
    // מעבר פוקוס החוצה בטאב סוגר את התפריט
    li.addEventListener('focusout', function (e) { if (!li.contains(e.relatedTarget)) setMenu(li, false); });
  });

  // סגירה בלחיצה בחוץ / Esc (עם החזרת פוקוס לכפתור) / אחרי בחירת קישור
  document.addEventListener('click', function () { closeAll(); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    menus.forEach(function (li) {
      if (li.classList.contains('open')) {
        if (li.contains(document.activeElement)) li.firstElementChild.focus();
        li.classList.add('closed');
        setMenu(li, false);
      }
    });
    setBurger(false);
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { closeAll(); setBurger(false); });
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
