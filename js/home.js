// טאבים של סדנאות בעמוד הבית. מקור האמת היחיד: ה-hash בכתובת (#ws-business / #ws-orgs / #programs).
// תומך בכניסה ישירה, לחיצה חוזרת על אותו עוגן, ניווט מהתפריט ומהכרטיסים, מקלדת ו-Back/Forward.
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.tabpanel'));
  if (!tabs.length) return;
  var ids = panels.map(function (p) { return p.id; });

  // מציג פאנל ומסנכרן aria-selected, tabindex והפאנל הגלוי
  function show(id, focusTab) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('aria-controls') === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && focusTab) t.focus();
    });
    panels.forEach(function (p) { p.classList.toggle('active', p.id === id); });
  }

  // מעדכן את הכתובת בלי לקפוץ בעמוד; pushState כדי ש-Back יחזיר ללשונית הקודמת
  function setHash(id) {
    if (location.hash.slice(1) !== id) history.pushState(null, '', '#' + id);
  }

  // גולל כך שהלשוניות והכותרת נראות מתחת לכותרת הנעוצה (scroll-margin על .tabpanel ב-CSS)
  function scrollToPanel(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  function select(id, opts) {
    opts = opts || {};
    show(id, opts.focus);
    if (opts.push) setHash(id);
    if (opts.scroll) scrollToPanel(id);
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t.getAttribute('aria-controls'), { push: true }); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowLeft' ? 1 : e.key === 'ArrowRight' ? -1 : 0; // RTL
      if (e.key === 'Home') d = -i; else if (e.key === 'End') d = tabs.length - 1 - i;
      if (!d && e.key !== 'Home') return;
      var n = tabs[(i + d + tabs.length) % tabs.length];
      select(n.getAttribute('aria-controls'), { push: true, focus: true });
      e.preventDefault();
    });
  });

  // כל קישור פנימי לעוגן של לשונית (כרטיסי קהל, תפריט, כפתורים) מפעיל את הלשונית גם אם ה-hash כבר זהה
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    var u;
    try { u = new URL(a.href, location.href); } catch (x) { return; }
    var id = u.hash.slice(1);
    if (u.pathname !== location.pathname || ids.indexOf(id) < 0) return;
    e.preventDefault();
    select(id, { push: true, scroll: true });
  });

  function fromHash() {
    var id = location.hash.slice(1);
    if (ids.indexOf(id) >= 0) show(id); else if (!id || location.hash === '#workshops') show(ids[0]);
  }
  window.addEventListener('hashchange', fromHash);
  window.addEventListener('popstate', fromHash);

  show(ids.indexOf(location.hash.slice(1)) >= 0 ? location.hash.slice(1) : ids[0]);
})();
