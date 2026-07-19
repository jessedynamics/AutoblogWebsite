// visual-fx.js - Handles Vanta background, GSAP fly-ins, VanillaTilt and Page Transitions

(function() {
  // 1. Inject elements
  const vantaBg = document.createElement('div');
  vantaBg.id = 'vanta-bg';
  document.body.appendChild(vantaBg);

  const transitionOverlay = document.createElement('div');
  transitionOverlay.id = 'page-transition-overlay';
  Object.assign(transitionOverlay.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    background: '#0e0e0e',
    zIndex: '9999',
    pointerEvents: 'none'
  });
  document.body.appendChild(transitionOverlay);

  // 2. Load dependencies dynamically
  const scripts = [
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js',
    'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.0/vanilla-tilt.min.js'
  ];

  let scriptsLoaded = 0;
  scripts.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = () => {
      scriptsLoaded++;
      if (scriptsLoaded === scripts.length) {
        initVisualFX();
      }
    };
    document.head.appendChild(script);
  });

  function initVisualFX() {
    // A. Init Vanta NET
    if (window.VANTA) {
      VANTA.NET({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xe63b2e, // The red accent color
        backgroundColor: 0x0e0e0e, // matches --bg
        points: 12.00,
        maxDistance: 22.00,
        spacing: 18.00
      });
    }

    // B. Init GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate items with .gsap-fade-up or cards
    const animatedItems = document.querySelectorAll('.section-card, .card, .review-card, .emp-card, .gsap-fade-up, .news-row');
    
    animatedItems.forEach(item => {
      gsap.fromTo(item, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.7, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 95%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Hero animations
    if (document.querySelector('.hero-content')) {
      gsap.fromTo('.hero-content > *',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2 }
      );
    }
    
    if (document.querySelector('.page-hero')) {
      gsap.fromTo('.page-hero > *',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2 }
      );
    }

    // C. VanillaTilt
    if (window.VanillaTilt) {
      VanillaTilt.init(document.querySelectorAll(".section-card, .card, .review-card"), {
        max: 5,
        speed: 400,
        glare: true,
        "max-glare": 0.1
      });
    }

    // D. Page Entrance Transition
    gsap.to('#page-transition-overlay', {
      y: '-100%',
      duration: 0.8,
      ease: "power4.inOut"
    });

    // Page Exit Transition
    document.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function(e) {
        if (this.hostname === window.location.hostname && this.getAttribute('target') !== '_blank') {
          const target = this.href;
          
          // Don't transition if it's just a hash change or empty
          if (!target || target.includes('#') && target.split('#')[0] === window.location.href.split('#')[0]) return;
          
          e.preventDefault();
          gsap.fromTo('#page-transition-overlay',
            { y: '100%' },
            { 
              y: '0%', 
              duration: 0.6, 
              ease: "power4.inOut", 
              onComplete: () => {
                window.location.href = target;
              } 
            }
          );
        }
      });
    });
  }
})();
