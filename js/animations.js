// ==========================================================================
// OVATION — Animations & Scroll Logic
// Uses GSAP & Lenis via CDN
// ==========================================================================

const Animations = {
  init() {
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    this.initSmoothScroll();
    this.initPageTransition();
    this.initMagnetic();
    this.initParallax();
    this.initReveals();
  },

  // ------------------------------------------------------------------------
  // Smooth Scroll (Lenis)
  // ------------------------------------------------------------------------
  initSmoothScroll() {
    if (this.reducedMotion || typeof Lenis === 'undefined' || typeof gsap === 'undefined') return;

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.05,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.05,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    window.lenis = lenis;

    // Sync GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Anchor link handling
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (!target) return;
      
      const id = target.getAttribute('href');
      if (!id || id === '#') return;
      
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el, { 
          offset: -80,
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    });
  },

  // ------------------------------------------------------------------------
  // Page Transition
  // ------------------------------------------------------------------------
  initPageTransition() {
    // Create overlay element if it doesn't exist
    let overlay = document.querySelector('.page-transition-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'page-transition-overlay';
      document.body.appendChild(overlay);
    }

    // Find main content to animate
    const mainContent = document.querySelector('main');
    if (!mainContent) return;

    if (this.reducedMotion) {
      mainContent.style.opacity = '1';
      return;
    }

    if (typeof gsap !== 'undefined') {
      // Reset styles for GSAP
      gsap.set(overlay, { opacity: 1 });
      gsap.set(mainContent, { opacity: 0, y: 16 });

      // Entrance animation timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(overlay, { opacity: 0, duration: 0.28, ease: "power2.out" })
        .to(mainContent, { opacity: 1, y: 0, duration: 0.5 }, "-=0.12");
    } else {
      overlay.style.opacity = '0';
      mainContent.classList.add('page-enter');
      requestAnimationFrame(() => mainContent.classList.add('is-visible'));
    }
  },

  // ------------------------------------------------------------------------
  // Magnetic Hover Effect
  // ------------------------------------------------------------------------
  initMagnetic() {
    if (this.reducedMotion || typeof gsap === 'undefined') return;

    const magneticElements = document.querySelectorAll('[data-magnetic]');
    
    magneticElements.forEach(el => {
      const strength = parseFloat(el.getAttribute('data-strength')) || 0.35;
      
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        xTo(x * strength);
        yTo(y * strength);
      });

      el.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
      });
    });
  },

  // ------------------------------------------------------------------------
  // Parallax Effect
  // ------------------------------------------------------------------------
  initParallax() {
    if (this.reducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-speed')) || 12;
      
      gsap.fromTo(
        el,
        { yPercent: -speed },
        {
          yPercent: speed,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });
  },

  // ------------------------------------------------------------------------
  // Scroll Reveal Animations
  // ------------------------------------------------------------------------
  initReveals() {
    if (this.reducedMotion) return;

    const revealContainers = document.querySelectorAll('[data-reveal]');

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      if (!('IntersectionObserver' in window)) {
        revealContainers.forEach(container => container.classList.add('is-visible'));
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });

      revealContainers.forEach(container => {
        if (container.dataset.revealReady === 'true') return;
        container.dataset.revealReady = 'true';
        container.classList.add('reveal-fallback');
        observer.observe(container);
      });
      return;
    }
    
    revealContainers.forEach(container => {
      if (container.dataset.revealReady === 'true') return;
      container.dataset.revealReady = 'true';

      const direction = container.getAttribute('data-direction') || 'up';
      const distance = parseInt(container.getAttribute('data-distance')) || 48;
      const staggerAmount = parseFloat(container.getAttribute('data-stagger')) || 0;
      const duration = parseFloat(container.getAttribute('data-duration')) || 0.9;
      const delay = parseFloat(container.getAttribute('data-delay')) || 0;

      const isStaggered = staggerAmount > 0;
      const targets = isStaggered ? Array.from(container.children) : [container];

      // Initial state
      let offset = {};
      switch (direction) {
        case "up": offset = { y: distance }; break;
        case "down": offset = { y: -distance }; break;
        case "left": offset = { x: distance }; break;
        case "right": offset = { x: -distance }; break;
        case "scale": offset = { scale: 0.92 }; break;
      }

      gsap.set(targets, { opacity: 0, ...offset });

      // Create scroll trigger
      gsap.to(targets, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration,
        ease: "power3.out",
        delay,
        stagger: isStaggered ? staggerAmount : 0,
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          once: true,
        },
      });
    });
  }
};

window.OvationAnimations = Animations;
