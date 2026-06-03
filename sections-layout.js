/**
 * sections-layout.js — Shared header & footer for top-level section pages
 * (fotolijstjes, info, vakantie, and any future sections).
 *
 * HOW TO USE ON A NEW SECTION PAGE:
 *   1. Add  <div id="site-header"></div>  as the first child of <body>
 *   2. Add  <div id="site-footer"></div>  near the bottom, before </body>
 *   3. Add  <script src="../sections-layout.js"></script>  right before </body>
 *
 * The active section is detected automatically from the URL path.
 * Footer text can be overridden with  data-text="..."  on #site-footer.
 */
(function () {
  'use strict';

  /* ── All top-level sections ──────────────────────────────────────────────── */
  const SECTIONS = [
    { href: '../autoblog/',     label: 'Autoblog',     id: 'autoblog'     },
    { href: '../fotolijstjes/', label: 'Fotolijstjes', id: 'fotolijstjes' },
    { href: '../info/',         label: 'Info',         id: 'info'         },
    { href: '../vakantie/',     label: 'Vakantie',     id: 'vakantie'     },
  ];

  /* ── Detect current section from the URL path (e.g. /fotolijstjes/…) ────── */
  const currentSection = location.pathname.split('/').filter(Boolean)[0] || '';

  /* ── Build header HTML ───────────────────────────────────────────────────── */
  function buildHeader() {
    const links = SECTIONS.map(({ href, label, id }) => {
      const active = (id === currentSection) ? ' class="active"' : '';
      return `<a href="${href}"${active}>${label}</a>`;
    }).join('\n        ');

    return `<header>
    <div class="header-inner">
      <a href="../index.html" class="logo">
        <span class="logo-s">J</span>ESSE
        <span class="logo-sub">BEUMAN</span>
      </a>
      <nav>
        ${links}
      </nav>
    </div>
  </header>`;
  }

  /* ── Build footer HTML ───────────────────────────────────────────────────── */
  function buildFooter(el) {
    const note = (el && el.dataset.text) || 'jessebeuman.com';
    return `<footer>
    <div class="footer-inner">
      <div class="footer-logo">JESSE BEUMAN</div>
      <p>${note}</p>
    </div>
  </footer>`;
  }

  /* ── Inject (script runs at end of <body>, DOM already available) ────────── */
  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');
  if (headerEl) headerEl.outerHTML = buildHeader();
  if (footerEl) footerEl.outerHTML = buildFooter(footerEl);

  /* ── Inject Visual FX ──────────────────────────────────────────────────── */
  const fxScript = document.createElement('script');
  fxScript.src = '../visual-fx.js';
  document.body.appendChild(fxScript);
})();
