/**
 * layout.js — Shared header & footer for every Sormac Autoblog page.
 *
 * HOW TO USE ON A NEW PAGE:
 *   1. Add  <div id="site-header"></div>  as the first child of <body>
 *   2. Add  <div id="site-footer"></div>  near the bottom, before </body>
 *   3. Add  <script src="layout.js"></script>  right before </body>
 *
 * The active nav link is detected automatically from the page filename.
 * To customise the footer note, add  data-text="..."  to #site-footer.
 */
(function () {
  'use strict';

  /* ── Nav items ──────────────────────────────────────────────────────────── */
  const NAV = [
    { href: 'index.html',         label: 'Home' },
    { href: 'reviews.html',       label: 'Reviews' },
    { href: 'news.html',          label: 'Car News' },
    { href: 'employee-cars.html', label: 'Employee Cars' },
  ];

  /* ── Detect current page ─────────────────────────────────────────────────  */
  const page = location.pathname.split('/').pop() || 'index.html';

  /* ── Build header HTML ───────────────────────────────────────────────────  */
  function buildHeader() {
    const links = NAV.map(({ href, label }) => {
      const active = (href === page || (href === 'index.html' && page === ''))
        ? ' class="active"' : '';
      return `<a href="${href}"${active}>${label}</a>`;
    }).join('\n        ');

    return `<header>
    <div class="header-inner">
      <div class="logo">
        <span class="logo-s">S</span>ORMAC
        <span class="logo-sub">AUTOBLOG</span>
      </div>
      <nav>
        ${links}
      </nav>
    </div>
  </header>`;
  }

  /* ── Build footer HTML ───────────────────────────────────────────────────  */
  function buildFooter(el) {
    const note = (el && el.dataset.text)
      || 'An internal passion project by car enthusiasts, for car enthusiasts.';
    return `<footer>
    <div class="footer-inner">
      <div class="footer-logo">SORMAC AUTOBLOG</div>
      <p>${note}</p>
    </div>
  </footer>`;
  }

  /* ── Inject (script runs at end of <body>, DOM already available) ──────── */
  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');
  if (headerEl) headerEl.outerHTML = buildHeader();
  if (footerEl) footerEl.outerHTML = buildFooter(footerEl);
})();
