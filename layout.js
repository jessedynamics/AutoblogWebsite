/**
 * layout.js — Shared header & footer for the root-level pages.
 *
 * HOW TO USE ON A NEW PAGE:
 *   1. Add  <div id="site-header"></div>  as the first child of <body>
 *   2. Add  <div id="site-footer"></div>  near the bottom, before </body>
 *   3. Add  <script src="layout.js"></script>  right before </body>
 *
 * Active nav links are detected automatically from the page filename.
 * Footer text can be overridden with  data-text="..."  on #site-footer.
 * Footer logo can be overridden with  data-logo="..."  on #site-footer.
 */
(function () {
  'use strict';

  /* ── Top-level sections (shown on every page) ───────────────────────────── */
  const SECTIONS = [
    { href: 'autoblog/',     label: 'Autoblog' },
    { href: 'fotolijstjes/', label: 'Fotolijstjes' },
    { href: 'info/',         label: 'Info' },
    { href: 'vakantie/',     label: 'Vakantie' },
  ];

  /* ── Autoblog sub-nav (shown on autoblog pages, not the homepage) ────────── */
  const AUTOBLOG_NAV = [
    { href: 'index.html',         label: 'Home' },
    { href: 'reviews.html',       label: 'Reviews' },
    { href: 'news.html',          label: 'Car News' },
    { href: 'employee-cars.html', label: 'Employee Cars' },
  ];

  /* ── Detect current page ─────────────────────────────────────────────────  */
  const page       = location.pathname.split('/').pop() || 'index.html';
  const isHomepage = (page === 'index.html' || page === '');

  /* ── Build header HTML ───────────────────────────────────────────────────  */
  function buildHeader() {
    /* Secties links — mark Autoblog active when on any non-homepage root page */
    const sectionLinks = SECTIONS.map(({ href, label }) => {
      const isActive = !isHomepage && href === 'autoblog/';
      return `<a href="${href}"${isActive ? ' class="active"' : ''}>${label}</a>`;
    }).join('\n        ');

    /* Autoblog sub-nav — only rendered on non-homepage pages */
    let subnav = '';
    if (!isHomepage) {
      const autoblogLinks = AUTOBLOG_NAV.map(({ href, label }) => {
        const active = (href === page) ? ' class="active"' : '';
        return `<a href="${href}"${active}>${label}</a>`;
      }).join('\n          ');

      subnav = `
    <div class="subnav-bar">
      <div class="subnav-inner">
        <div class="subnav-label">
          <span class="logo-s">S</span>ORMAC
          <span class="logo-sub">AUTOBLOG</span>
        </div>
        <nav class="subnav">
          ${autoblogLinks}
        </nav>
      </div>
    </div>`;
    }

    return `<header>
    <div class="header-inner">
      <a href="index.html" class="logo">
        <span class="logo-s">J</span>ESSE
        <span class="logo-sub">BEUMAN</span>
      </a>
      <nav>
        ${sectionLinks}
      </nav>
    </div>${subnav}
  </header>`;
  }

  /* ── Build footer HTML ───────────────────────────────────────────────────  */
  function buildFooter(el) {
    const note = (el && el.dataset.text)
      || 'An internal passion project by car enthusiasts, for car enthusiasts.';
    const logo = (el && el.dataset.logo) || 'JESSE BEUMAN';
    return `<footer>
    <div class="footer-inner">
      <div class="footer-logo">${logo}</div>
      <p>${note}</p>
    </div>
  </footer>`;
  }

  /* ── Inject (script runs at end of <body>, DOM already available) ──────── */
  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');
  if (headerEl) headerEl.outerHTML = buildHeader();
  if (footerEl) footerEl.outerHTML = buildFooter(footerEl);

  /* ── Inject Visual FX ──────────────────────────────────────────────────── */
  const fxScript = document.createElement('script');
  fxScript.src = 'visual-fx.js';
  document.body.appendChild(fxScript);
})();
