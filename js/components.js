// ==========================================================================
// OVATION — Shared Components & UI Rendering
// ==========================================================================

const Components = {
  // SVG Icons (replacing Lucide React)
  icons: {
    menu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--xl"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`,
    x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--xl"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    ticket: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--md"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>`,
    ticketLg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--base nav-icon"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>`,
    mapPin: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--md"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    home: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--base nav-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    compass: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--base nav-icon"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    arrowUp: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--base nav-icon"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>`,
    arrowUpRight: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--lg event-card__arrow"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>`,
    arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--md btn-icon"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--sm"><path d="m6 9 6 6 6-6"/></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--md"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  },

  // Render the header
  renderHeader(overlay = false) {
    const isLight = overlay; // If overlay is true, initially light text
    const headerClass = isLight ? "site-header site-header--transparent site-header--light" : "site-header site-header--solid site-header--dark";
    const selectedCity = window.OvationData ? window.OvationData.getSelectedCity() : "Ahmedabad";
    const cities = window.OvationData ? window.OvationData.POPULAR_CITIES : ["Ahmedabad", "Mumbai", "Delhi", "Bangalore"];
    const renderDropdownItems = (selected) => {
      return cities.map(city => `<div class="custom-dropdown__item ${city === selected ? 'is-selected' : ''}" data-value="${city}">${city}</div>`).join('');
    };

    const authUser = window.OvationAuth && window.OvationAuth.isAuthenticated() ? window.OvationAuth.currentUser : null;


    return `
      <header class="${headerClass}" id="main-header">
        <div class="site-header__inner">
          <a href="index.html" class="site-header__logo">OVATION</a>
          
          <nav class="site-header__nav">
            <a href="events.html" class="site-header__nav-link">Events</a>
            <a href="events.html?category=Music" class="site-header__nav-link">Music</a>
            <a href="events.html?category=Sports" class="site-header__nav-link">Sports</a>
            <a href="events.html?category=Arts" class="site-header__nav-link">Arts</a>
          </nav>

          <div class="site-header__actions">
            <div class="custom-dropdown site-header__city-dropdown" id="header-city-dropdown" tabindex="0">
              <div class="custom-dropdown__trigger">
                ${this.icons.mapPin}
                <span class="custom-dropdown__value">${selectedCity}</span>
                ${this.icons.chevronDown}
              </div>
              <div class="custom-dropdown__menu">
                ${renderDropdownItems(selectedCity)}
              </div>
            </div>

            ${authUser ? `
              <div class="custom-dropdown site-header__user-dropdown" id="user-dropdown" tabindex="0">
                <div class="custom-dropdown__trigger">
                  ${this.icons.user}
                  <span class="custom-dropdown__value">${authUser.name.split(' ')[0]}</span>
                  ${this.icons.chevronDown}
                </div>
                <div class="custom-dropdown__menu">
                  <div class="custom-dropdown__item custom-dropdown__item--greeting">Hi, ${authUser.name}</div>
                  <button type="button" class="custom-dropdown__item custom-dropdown__item--action" id="header-logout-btn">Logout</button>
                </div>
              </div>
            ` : `
              <button type="button" class="site-header__auth-btn" id="header-auth-btn" aria-label="Sign In">
                ${this.icons.user}
                <span class="site-header__auth-label" id="header-auth-label">Sign In</span>
              </button>
            `}

            <button type="button" class="site-header__menu-btn" id="mobile-menu-btn" aria-label="Toggle menu">
              ${this.icons.menu}
            </button>
          </div>
        </div>

        <div class="site-header__mobile-menu" id="mobile-menu">
          <nav class="site-header__mobile-nav">
            <div class="custom-dropdown custom-dropdown--mobile site-header__mobile-city-dropdown" id="mobile-city-dropdown" tabindex="0">
              <div class="custom-dropdown__trigger">
                <span>City: <span class="custom-dropdown__value">${selectedCity}</span></span>
                ${this.icons.chevronDown}
              </div>
              <div class="custom-dropdown__menu">
                ${renderDropdownItems(selectedCity)}
              </div>
            </div>
            <a href="events.html" class="site-header__mobile-link">Events</a>
            <a href="events.html?category=Music" class="site-header__mobile-link">Music</a>
            <a href="events.html?category=Sports" class="site-header__mobile-link">Sports</a>
            <a href="events.html?category=Arts" class="site-header__mobile-link">Arts</a>
          </nav>
        </div>
      </header>
    `;
  },

  // Render the footer
  renderFooter() {
    const categories = window.OvationData ? window.OvationData.CATEGORIES : ["Music", "Comedy", "Arts", "Food", "Sports", "Movies"];

    const categoryLinks = categories.map(c => `
      <li>
        <a href="events.html?category=${c}" class="site-footer__link">${c}</a>
      </li>
    `).join('');

    return `
      <footer class="site-footer">
        <div class="site-footer__inner">
          <div class="site-footer__grid">
            <div>
              <p class="site-footer__brand-name">OVATION</p>
              <p class="site-footer__brand-desc">
                Tickets to everything. Discover and book the nights you'll remember, all in one place.
              </p>
            </div>

            <div>
              <p class="site-footer__section-title">Browse</p>
              <ul class="site-footer__links">
                ${categoryLinks}
              </ul>
            </div>

            <div>
              <p class="site-footer__section-title">Company</p>
              <ul class="site-footer__links">
                <li><a href="about.html" class="site-footer__link">About</a></li>
                <li><a href="sell-tickets.html" class="site-footer__link">Sell Tickets</a></li>
                <li><a href="help-center.html" class="site-footer__link">Help Center</a></li>
                <li><a href="terms.html" class="site-footer__link">Terms</a></li>
              </ul>
            </div>
          </div>

          <div class="site-footer__bottom">
            <p>© 2026 Ovation Tickets. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `;
  },

  // Render floating nav
  renderFloatingNav(activePath = '/') {
    return `
      <div class="floating-nav-wrapper" id="floating-nav-wrapper">
        <nav class="floating-nav" id="floating-nav">
          <a href="index.html" class="floating-nav__link ${activePath === '/' || activePath === 'index.html' ? 'is-active' : ''}" aria-label="Home">
            ${this.icons.home}
            <span class="floating-nav__link-label">Home</span>
          </a>
          
          <a href="events.html" class="floating-nav__link ${activePath.includes('event') ? 'is-active' : ''}" aria-label="Events">
            ${this.icons.compass}
            <span class="floating-nav__link-label">Events</span>
          </a>

          <span class="floating-nav__separator" aria-hidden="true"></span>

          <button type="button" id="scroll-to-top" aria-label="Back to top" class="floating-nav__top-btn">
            ${this.icons.arrowUp}
          </button>
        </nav>
      </div>
    `;
  },

  // Render a single event card
  renderEventCard(event) {
    if (!window.OvationData) return '';
    const date = window.OvationData.formatEventDate(event.date);
    const fromPrice = Math.min(...event.tiers.map((t) => t.price));
    const formattedPrice = window.OvationData.formatCurrency(fromPrice);

    return `
      <a href="event.html?slug=${event.slug}" class="event-card group">
        <div class="event-card__image-wrap">
          <div class="fade-image-wrap" data-fade-image>
            <img 
              src="${event.image}" 
              alt="${event.title}" 
              class="event-card__image fade-image" 
              loading="lazy"
              decoding="async"
            />
          </div>
          <div class="event-card__date">
            <span class="event-card__date-month">${date.month}</span>
            <span class="event-card__date-day">${date.day}</span>
          </div>
          <span class="event-card__category">${event.category}</span>
        </div>

        <div class="event-card__info">
          <div>
            <h3 class="event-card__title">${event.title}</h3>
            <p class="event-card__venue">${event.venue} · ${event.city}</p>
          </div>
          ${this.icons.arrowUpRight}
        </div>
        
        <p class="event-card__price">
          From <strong>${formattedPrice}</strong>
        </p>
      </a>
    `;
  },

  renderEventCardSkeleton(count = 3) {
    return Array.from({ length: count }, () => `
      <div class="event-card event-card--skeleton" aria-hidden="true">
        <div class="event-card__image-wrap skeleton-block"></div>
        <div class="event-card__info">
          <div class="w-full">
            <div class="skeleton-line skeleton-line--title"></div>
            <div class="skeleton-line skeleton-line--short"></div>
          </div>
        </div>
        <div class="skeleton-line skeleton-line--price"></div>
      </div>
    `).join('');
  },

  renderEventDetailSkeleton() {
    return `
      <section class="event-hero skeleton-block"></section>
      <div class="event-detail">
        <div class="skeleton-line skeleton-line--short"></div>
        <div class="event-detail__grid mt-8">
          <div>
            <div class="event-meta">
              <div class="skeleton-line"></div>
              <div class="skeleton-line"></div>
              <div class="skeleton-line skeleton-line--title"></div>
            </div>
            <div class="mt-8">
              <div class="skeleton-line skeleton-line--title"></div>
              <div class="skeleton-paragraph mt-4"></div>
              <div class="skeleton-paragraph mt-4"></div>
            </div>
          </div>
          <div class="ticket-selector">
            <div class="ticket-selector__header skeleton-block"></div>
            <div class="p-5">
              <div class="skeleton-line skeleton-line--title"></div>
              <div class="skeleton-line mt-4"></div>
              <div class="skeleton-line mt-4"></div>
              <div class="skeleton-line skeleton-line--price mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderCheckoutSkeleton() {
    return `
      <div class="skeleton-line skeleton-line--heading"></div>
      <div class="checkout__grid">
        <div>
          <div class="skeleton-line skeleton-line--title"></div>
          <div class="mt-6 flex flex-col border-t border-border">
            <div class="booking-item" aria-hidden="true">
              <div class="booking-item__image-wrap skeleton-block"></div>
              <div class="booking-item__details">
                <div class="skeleton-line skeleton-line--title"></div>
                <div class="skeleton-line skeleton-line--short mt-2"></div>
                <div class="skeleton-line mt-4"></div>
              </div>
            </div>
            <div class="booking-item" aria-hidden="true">
              <div class="booking-item__image-wrap skeleton-block"></div>
              <div class="booking-item__details">
                <div class="skeleton-line skeleton-line--title"></div>
                <div class="skeleton-line skeleton-line--short mt-2"></div>
                <div class="skeleton-line mt-4"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="order-summary">
          <div class="order-summary__header skeleton-block"></div>
          <div class="order-summary__body">
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line skeleton-line--price"></div>
          </div>
        </div>
      </div>
    `;
  },

  // Initialize shared UI elements
  init(opts = {}) {
    // 1. Render Header
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
      headerContainer.innerHTML = this.renderHeader(opts.overlayHeader);
    }

    // 2. Render Footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
      footerContainer.innerHTML = this.renderFooter();
    }

    // 3. Render Floating Nav
    const navContainer = document.getElementById('floating-nav-container');
    if (navContainer) {
      const path = window.location.pathname.split('/').pop() || 'index.html';
      navContainer.innerHTML = this.renderFloatingNav(path);
    }

    // 4. Setup Header logic
    this.setupHeader(opts.overlayHeader);
    this.setupCityControls();

    // 5. Setup Floating Nav logic
    this.setupFloatingNav();

    // 6. Setup Auth listeners
    this.setupAuthListeners();

    // 7. Setup Image lazy loading/fading
    this.setupFadeImages();

    // 8. Shared micro interactions
    this.setupInteractionPolish();
  },

  setupHeader(isOverlay) {
    const header = document.getElementById('main-header');
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let isMenuOpen = false;

    if (!header) return;

    // Scroll effect
    if (isOverlay) {
      const handleScroll = () => {
        if (window.scrollY > 30) {
          header.classList.remove('site-header--transparent', 'site-header--light');
          header.classList.add('site-header--solid', 'site-header--dark');
        } else {
          header.classList.add('site-header--transparent', 'site-header--light');
          header.classList.remove('site-header--solid', 'site-header--dark');
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Init
    }

    // Mobile menu toggle
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
          mobileMenu.classList.add('is-open');
          menuBtn.innerHTML = this.icons.x;
          // Force solid header when menu is open
          header.classList.remove('site-header--transparent', 'site-header--light');
          header.classList.add('site-header--solid', 'site-header--dark');
        } else {
          mobileMenu.classList.remove('is-open');
          menuBtn.innerHTML = this.icons.menu;
          // Re-evaluate scroll position for header style
          if (isOverlay && window.scrollY <= 30) {
            header.classList.add('site-header--transparent', 'site-header--light');
            header.classList.remove('site-header--solid', 'site-header--dark');
          }
        }
      });
    }
  },

  setupCityControls() {
    if (!window.OvationData) return;

    const dropdowns = document.querySelectorAll('.site-header__city-dropdown, .site-header__mobile-city-dropdown');

    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.custom-dropdown__trigger');
      const items = dropdown.querySelectorAll('.custom-dropdown__item');

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close all other dropdowns
        dropdowns.forEach(d => {
          if (d !== dropdown) d.classList.remove('is-open');
        });
        dropdown.classList.toggle('is-open');
      });

      items.forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const city = item.getAttribute('data-value');
          dropdown.classList.remove('is-open');

          const newCity = window.OvationData.setSelectedCity(city);

          // Update all dropdown visuals
          dropdowns.forEach(d => {
            const valEl = d.querySelector('.custom-dropdown__value');
            if (valEl) valEl.textContent = newCity;
            d.querySelectorAll('.custom-dropdown__item').forEach(i => {
              if (i.getAttribute('data-value') === newCity) {
                i.classList.add('is-selected');
              } else {
                i.classList.remove('is-selected');
              }
            });
          });

          const path = window.location.pathname.split('/').pop() || 'index.html';
          if (path === 'event.html' || path === 'seats.html' || path === 'checkout.html' || path === 'confirmation.html') {
            window.location.href = 'events.html';
          }
        });
      });
    });

    // Close when clicking outside
    document.addEventListener('click', () => {
      dropdowns.forEach(d => d.classList.remove('is-open'));
    });

    window.addEventListener('ovation:city-change', (event) => {
      const newCity = event.detail.city;
      dropdowns.forEach(d => {
        const valEl = d.querySelector('.custom-dropdown__value');
        if (valEl) valEl.textContent = newCity;
        d.querySelectorAll('.custom-dropdown__item').forEach(i => {
          if (i.getAttribute('data-value') === newCity) {
            i.classList.add('is-selected');
          } else {
            i.classList.remove('is-selected');
          }
        });
      });
    });
  },

  setupFloatingNav() {
    const wrapper = document.getElementById('floating-nav-wrapper');
    const nav = document.getElementById('floating-nav');
    const topBtn = document.getElementById('scroll-to-top');

    if (!wrapper || !nav) return;

    // Visibility on scroll
    const handleScroll = () => {
      const isVisible = window.scrollY > window.innerHeight * 0.6;
      if (isVisible) {
        wrapper.classList.add('is-visible');
        if (window.gsap) {
          gsap.to(nav, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
        } else {
          nav.style.transform = 'translateY(0)';
          nav.style.opacity = '1';
        }
      } else {
        wrapper.classList.remove('is-visible');
        if (window.gsap) {
          gsap.to(nav, { y: 120, opacity: 0, duration: 0.5, ease: "power3.out" });
        } else {
          nav.style.transform = 'translateY(120px)';
          nav.style.opacity = '0';
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init

    // Scroll to top
    if (topBtn) {
      topBtn.addEventListener('click', () => {
        if (window.lenis) {
          window.lenis.scrollTo(0);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  },

  setupAuthListeners() {
    // Sign In button (shown when logged out)
    const authBtn = document.getElementById('header-auth-btn');
    if (authBtn) {
      authBtn.addEventListener('click', () => {
        if (window.OvationAuth) {
          window.OvationAuth.showModal();
        }
      });
    }

    // Logout button inside user dropdown (shown when logged in)
    const logoutBtn = document.getElementById('header-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (window.OvationAuth) {
          window.OvationAuth.logout();
        }
      });
    }

    // User dropdown toggle
    const userDropdown = document.getElementById('user-dropdown');
    if (userDropdown) {
      const trigger = userDropdown.querySelector('.custom-dropdown__trigger');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          userDropdown.classList.toggle('is-open');
        });
      }
      // Close on click outside
      document.addEventListener('click', (e) => {
        if (!userDropdown.contains(e.target)) {
          userDropdown.classList.remove('is-open');
        }
      });
    }

    // On auth change, re-render the entire header to swap between logged-in/out states
    window.addEventListener('ovation:auth-change', () => {
      // Re-initialize to re-render header with correct auth state
      const headerEl = document.querySelector('.site-header');
      const floatingNavEl = document.getElementById('floating-nav-wrapper');
      if (headerEl && floatingNavEl) {
        // Determine current page for active state
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const isOverlay = headerEl.classList.contains('site-header--transparent');
        headerEl.outerHTML = this.renderHeader(isOverlay);
        floatingNavEl.outerHTML = this.renderFloatingNav(currentPath);
        // Re-attach listeners
        this.setupScrollListener();
        this.setupFloatingNav();
        this.setupAuthListeners();
        this.setupCityControls();
        this.setupMobileMenu();
      }
    });
  },

  setupFadeImages() {
    const images = document.querySelectorAll('[data-fade-image] img:not([data-fade-ready])');
    if (!images.length) return;

    if (!('IntersectionObserver' in window)) {
      images.forEach(img => {
        img.dataset.fadeReady = 'true';
        img.classList.add('is-loaded');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const markLoaded = () => {
              img.classList.add('is-loaded');
              img.closest('.fade-image-wrap')?.classList.add('image-is-loaded');
            };

            // Wait for load if not already complete
            if (img.complete && img.naturalWidth > 0) {
              markLoaded();
            } else {
              img.onload = markLoaded;
              img.onerror = markLoaded;
            }

            observer.unobserve(img);
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    images.forEach(img => {
      img.dataset.fadeReady = 'true';

      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('is-loaded');
        img.closest('.fade-image-wrap')?.classList.add('image-is-loaded');
        return;
      }

      observer.observe(img);
    });
  },

  setupInteractionPolish() {
    this.setupPressedFeedback();
    this.setupInternalPageTransitions();
  },

  setupPressedFeedback() {
    const interactiveSelector = '.btn, .filter-btn, .popular-city-card, .qty-control__btn, .booking-item__qty-btn, .booking-item__remove-btn, .site-header__auth-btn, .floating-nav__link, .floating-nav__top-btn';

    document.addEventListener('pointerdown', (event) => {
      const target = event.target.closest(interactiveSelector);
      if (!target || target.disabled) return;
      target.classList.add('is-pressing');
    });

    document.addEventListener('pointerup', (event) => {
      const target = event.target.closest(interactiveSelector);
      if (!target) return;
      window.setTimeout(() => target.classList.remove('is-pressing'), 120);
    });

    document.addEventListener('pointercancel', () => {
      document.querySelectorAll('.is-pressing').forEach(el => el.classList.remove('is-pressing'));
    });
  },

  setupInternalPageTransitions() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;

      const href = link.getAttribute('href');
      const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
      if (
        isModifiedClick ||
        link.target ||
        link.hasAttribute('download') ||
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:')
      ) return;

      let url;
      try {
        url = new URL(href, window.location.href);
      } catch (e) {
        return; // Invalid URL, let the browser handle it
      }

      const isFileProtocol = window.location.protocol === 'file:' && url.protocol === 'file:';
      if (!isFileProtocol && url.origin !== window.location.origin) return;

      // Always append city state for persistence across navigation
      if (!url.searchParams.has('city') && window.OvationData) {
        url.searchParams.set('city', window.OvationData.getSelectedCity());
      }

      // Always append booking state for persistence across navigation
      if (!url.searchParams.has('booking') && window.OvationBooking && window.OvationBooking.currentBooking) {
        url.searchParams.set('booking', encodeURIComponent(JSON.stringify(window.OvationBooking.currentBooking)));
      }

      // Prevent default navigation so we can use our augmented URL
      event.preventDefault();

      if (reduceMotion) {
        // Skip animation, navigate immediately with state-augmented URL
        window.location.href = url.href;
      } else {
        // Show page transition overlay, then navigate
        let overlay = document.querySelector('.page-transition-overlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'page-transition-overlay';
          document.body.appendChild(overlay);
        }

        document.body.classList.add('is-page-leaving');
        overlay.classList.add('is-active');

        window.setTimeout(() => {
          window.location.href = url.href;
        }, 160);
      }
    });
  }
};

window.OvationComponents = Components;
