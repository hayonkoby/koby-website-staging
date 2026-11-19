// מדידת אירועי פנייה (מוכן להפעלה). לא שולח שום דבר לשירות חיצוני בלי חיבור מפורש:
// האירועים נדחפים ל-window.dataLayer ול-gtag רק אם קיימים (ייטענו רק כשיוגדר מזהה מדידה אמיתי).
// אין כאן פרטים אישיים או תוכן הודעות: רק סוג הפעולה, שם השירות, העמוד ומיקום הכפתור.
// הערה: קליק הוא כוונה ולא ליד; קליק על קישור תשלום אינו רכישה. אל תדווחו עליהם כהמרה סופית.
(function () {
  window.dataLayer = window.dataLayer || [];
  function kind(href) {
    if (/^https:\/\/wa\.me\//.test(href)) return 'click_whatsapp';
    if (/^tel:/.test(href)) return 'click_phone';
    if (/^mailto:/.test(href)) return 'click_email';
    if (/calendly\.com/.test(href)) return 'click_calendar';
    if (/cardcom/i.test(href)) return 'click_payment_link';
    return '';
  }
  function service() {
    var h = document.querySelector('main h1');
    return (document.body.getAttribute('data-service') || (h ? h.textContent : document.title) || '').replace(/\s+/g, ' ').trim().slice(0, 80);
  }
  function placement(a) {
    var p = a.closest('[data-track-place], section[id], header, footer, nav, section');
    if (!p) return 'page';
    if (p.getAttribute('data-track-place')) return p.getAttribute('data-track-place');
    if (p.id) return p.id;
    if (p.tagName === 'SECTION') return (p.className || 'section').split(' ')[0];
    return p.tagName.toLowerCase();
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var name = kind(a.getAttribute('href') || '');
    if (!name) return;
    var params = { service_name: service(), page_path: location.pathname, button_location: placement(a), button_text: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40) };
    window.dataLayer.push(Object.assign({ event: name }, params));
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  });
})();
