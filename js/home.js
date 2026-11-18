// טאבים של סדנאות בעמוד הבית (עם תמיכה בקישורים כמו index.html#ws-orgs)
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.tabpanel'));
  if (!tabs.length) return;

  function show(id, focusTab) {
    var ok = false;
    panels.forEach(function (p) {
      var on = p.id === id;
      p.classList.toggle('active', on);
      if (on) ok = true;
    });
    tabs.forEach(function (t) {
      var on = t.getAttribute('aria-controls') === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && focusTab) t.focus();
    });
    return ok;
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(t.getAttribute('aria-controls')); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowLeft' ? 1 : e.key === 'ArrowRight' ? -1 : 0; // RTL
      if (!d) return;
      var n = tabs[(i + d + tabs.length) % tabs.length];
      show(n.getAttribute('aria-controls'), true);
      e.preventDefault();
    });
  });

  function fromHash() {
    var id = location.hash.slice(1);
    if (id && panels.some(function (p) { return p.id === id; })) {
      show(id);
      var s = document.getElementById('workshops');
      if (s) setTimeout(function () { s.scrollIntoView(); }, 0);
    }
  }
  window.addEventListener('hashchange', fromHash);
  show(panels[0].id);
  fromHash();
})();
