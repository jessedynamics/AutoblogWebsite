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

  /* ── Navigation sections ───────────────────────────── */
  const RESUME_SECTIONS = [
    { href: 'index.html#hero',       label: 'Home' },
    { href: 'index.html#about',      label: 'About' },
    { href: 'index.html#experience', label: 'Experience' },
    { href: 'index.html#skills',     label: 'Skills' },
    { href: 'index.html#contact',    label: 'Contact' },
  ];

  const HIDDEN_SECTIONS = [
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
  const pathname   = location.pathname;
  const isHiddenItems = pathname.includes('/hiddenitems') || pathname.includes('/autoblog') || pathname.includes('/fotolijstjes') || pathname.includes('/info') || pathname.includes('/vakantie');
  // Check if we are in a subdirectory so we can prepend '../' to links if necessary
  const pathDepth = pathname.replace(/^\/+|\/+$/g, '').split('/').length;
  // This is a naive way to get depth, but we know if pathDepth > 1 we probably need '../'
  // Actually, we can just look if the script is loaded with a prefix.
  // Instead, let's just prepend '../' if we are in a subdirectory.
  const isSubFolder = isHiddenItems && !pathname.endsWith('/hiddenitems') && !pathname.endsWith('/hiddenitems/') && pathname.split('/').filter(Boolean).length > 1;
  const prefix = isSubFolder ? '../' : '';

  const page       = pathname.split('/').pop() || 'index.html';
  const isHomepage = (page === 'index.html' || page === '') && !isHiddenItems;

  /* ── Build header HTML ───────────────────────────────────────────────────  */
  function buildHeader() {
    const activeNav = isHiddenItems ? HIDDEN_SECTIONS : RESUME_SECTIONS;
    
    /* Secties links */
    const sectionLinks = activeNav.map(({ href, label }) => {
      // Don't prefix anchor links
      const finalHref = href.startsWith('index.html#') ? href : prefix + href;
      const isActive = (!isHomepage && href === 'autoblog/' && pathname.includes('/autoblog')) || 
                       (pathname.includes(href.replace('/', '')));
      return `<a href="${finalHref}"${isActive ? ' class="active"' : ''}>${label}</a>`;
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
