/* Raleigh Nightlife Vending
   Scroll reveal, mobile nav, footer year, and the contact form.
   Same approach as the Oakwood Marketing site: no dependencies, no build step. */

/* ---------- The one authored moment: the night band rises as it enters ----- */
(function () {
  var targets = document.querySelectorAll('.rise');
  if (!targets.length) return;

  // No IntersectionObserver (very old browser): just show everything.
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  targets.forEach(function (el) { observer.observe(el); });
})();

/* ---------- Header goes solid once the hero is behind it -------------------- */
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  var stuck = null;
  function sync() {
    var next = window.scrollY > 8;
    if (next !== stuck) { stuck = next; header.classList.toggle('is-stuck', next); }
  }
  sync();
  window.addEventListener('scroll', sync, { passive: true });
})();

/* ---------- Scroll spy: underline the nav link for the section in view ----- */
(function () {
  var links = [].slice.call(document.querySelectorAll('.nav-links a[href^="#"]:not(.btn)'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  var byId = {};
  var sections = [];
  links.forEach(function (a) {
    var el = document.getElementById(a.getAttribute('href').slice(1));
    if (el) { byId[el.id] = a; sections.push(el); }
  });
  if (!sections.length) return;

  // Nav order is not page order (For Your Venue sits above How It Works), so
  // sort by document position before picking the topmost visible section.
  sections.sort(function (a, b) {
    return (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1;
  });

  var visible = {};

  function paint() {
    // The last section in document order that is still in the band wins. The
    // outgoing section's tail overlaps the incoming section's head, and it is
    // the incoming one the reader has actually arrived at.
    var current = null;
    for (var i = 0; i < sections.length; i++) {
      if (visible[sections[i].id]) current = sections[i].id;
    }
    links.forEach(function (a) { a.classList.remove('active'); });
    if (current && byId[current]) byId[current].classList.add('active');
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
    paint();
  }, {
    // Ignore the sticky header, and only count a section once it really owns
    // the viewport rather than as its first pixel appears.
    rootMargin: '-68px 0px -55% 0px',
    threshold: 0
  });

  sections.forEach(function (s) { observer.observe(s); });
})();

/* ---------- Mobile nav ----------------------------------------------------- */
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  function setOpen(open) {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', function () {
    setOpen(!links.classList.contains('open'));
  });

  // Close after tapping a link, and whenever we grow back to desktop.
  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  window.matchMedia('(min-width: 821px)').addEventListener('change', function (e) {
    if (e.matches) setOpen(false);
  });
})();

/* ---------- Footer year ---------------------------------------------------- */
(function () {
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();

/* ---------- Contact form --------------------------------------------------- */
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var btn = document.getElementById('submitBtn');
  var note = document.getElementById('formNote');
  var success = document.getElementById('formSuccess');
  var error = document.getElementById('formError');

  var endpoint = form.getAttribute('data-endpoint');
  var live = endpoint && endpoint.indexOf('PASTE_YOUR') === -1;

  // Once an endpoint is set, the form posts for real and the "not connected"
  // note goes away on its own. No second edit needed.
  if (live) {
    form.setAttribute('action', endpoint);
    note.hidden = true;
  } else {
    // Say so up front. The required fields make the browser block submit until
    // the form is valid, so a visitor would otherwise fill the whole thing out
    // before finding out it goes nowhere.
    note.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    success.hidden = true;
    error.hidden = true;

    if (!live) {
      note.hidden = false;
      note.classList.add('form-note-flash');
      setTimeout(function () { note.classList.remove('form-note-flash'); }, 900);
      return;
    }

    if (!form.reportValidity()) return;

    var original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';

    fetch(endpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Bad response');
        form.reset();
        success.hidden = false;
      })
      .catch(function () {
        error.hidden = false;
      })
      .then(function () {
        btn.disabled = false;
        btn.textContent = original;
      });
  });
})();
