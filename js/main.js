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
  var nav = document.querySelector('.nav-links');
  if (!nav) return;

  var header = document.querySelector('.site-header');

  // Every nav target divides the page into a stretch it owns, the CTA's
  // included. The CTA cannot carry an underline, so its stretch — the contact
  // band at the foot of the page — simply clears the nav instead.
  var stops = [];
  [].forEach.call(nav.querySelectorAll('a[href^="#"]'), function (a) {
    var el = document.getElementById(a.getAttribute('href').slice(1));
    if (el) stops.push({ el: el, link: a.classList.contains('btn') ? null : a });
  });
  var links = stops.map(function (s) { return s.link; }).filter(Boolean);
  if (!links.length) return;

  // Nav order is not guaranteed to be page order, so sort by document position
  // before walking the list top to bottom.
  stops.sort(function (a, b) {
    return (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1;
  });

  // The reading line: a few pixels below where a section lands when you click
  // its nav link. Read from scroll-margin-top so the two can never drift apart.
  var line = 100;
  function measure() {
    var pad = parseFloat(window.getComputedStyle(stops[0].el).scrollMarginTop);
    if (!isFinite(pad)) pad = (header ? header.offsetHeight : 68) + 28;
    line = pad + 4;
  }

  var active;

  function paint() {
    // A link lights up the moment its section's top edge slides under the
    // header, and holds until the next target reaches the same line. Above the
    // first target nothing is underlined, rather than a section the reader has
    // not arrived at yet.
    var current = null;
    for (var i = 0; i < stops.length; i++) {
      if (stops[i].el.getBoundingClientRect().top > line) break;
      current = stops[i].link;
    }
    if (current === active) return;
    active = current;
    links.forEach(function (a) { a.classList.toggle('active', a === current); });
  }

  var queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    if (!window.requestAnimationFrame) { queued = false; paint(); return; }
    window.requestAnimationFrame(function () { queued = false; paint(); });
  }

  measure();
  paint();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); onScroll(); });
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
