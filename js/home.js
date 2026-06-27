// ==========================================================================
// OVATION — Home Page Logic
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Shared Components
  // Use overlayHeader: true because the hero section is dark and requires the light/transparent header initially
  window.OvationComponents.init({ overlayHeader: true });
  
  // 2. Render Featured Events
  renderPopularCities();
  renderFeaturedEvents();
  
  // 3. Render Categories
  renderCategories();

  window.addEventListener('ovation:city-change', () => {
    renderPopularCities();
    renderFeaturedEvents();
    renderCategories();
  });

  // 4. Initialize Animations (GSAP, Lenis, etc.)
  window.OvationAnimations.init();
  
  // 5. Custom Hero Parallax Animation (replaces events-hero.tsx logic)
  initHeroParallax();
});

function renderFeaturedEvents() {
  const grid = document.getElementById('featured-events-grid');
  if (!grid || !window.OvationData) return;

  const selectedCity = window.OvationData.getSelectedCity();
  const title = document.getElementById('trending-events-title');
  const featured = window.OvationData.getCurrentCityEvents();

  if (title) {
    title.textContent = `Trending events in ${selectedCity}`;
  }
  
  const html = featured.map(event => `
    <div>
      ${window.OvationComponents.renderEventCard(event)}
    </div>
  `).join('');
  
  grid.innerHTML = html;

  window.OvationComponents.setupFadeImages();
}

function renderPopularCities() {
  const grid = document.getElementById('popular-cities-grid');
  const currentLabel = document.getElementById('current-city-label');
  if (!grid || !window.OvationData) return;

  const selectedCity = window.OvationData.getSelectedCity();

  if (currentLabel) {
    currentLabel.textContent = selectedCity;
  }

  grid.innerHTML = window.OvationData.POPULAR_CITIES.map(city => `
    <button type="button" class="popular-city-card ${city === selectedCity ? 'is-active' : ''}" data-city="${city}">
      <span class="popular-city-card__name">${city}</span>
      <span class="popular-city-card__count">3 events</span>
    </button>
  `).join('');

  grid.querySelectorAll('[data-city]').forEach(button => {
    button.addEventListener('click', () => {
      window.OvationData.setSelectedCity(button.getAttribute('data-city'));
    });
  });
}

function renderCategories() {
  const grid = document.getElementById('category-grid');
  if (!grid || !window.OvationData) return;

  const selectedCity = window.OvationData.getSelectedCity();

  const html = window.OvationData.CATEGORIES.map(category => `
    <a href="events.html?category=${category}&city=${encodeURIComponent(selectedCity)}" class="category-grid__item group">
      <img
        src="${window.OvationData.CATEGORY_IMAGES[category]}"
        alt="${category} events"
        class="category-grid__image"
        loading="lazy"
      />
      <span class="category-grid__overlay" aria-hidden="true"></span>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--lg category-grid__icon"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
      <span class="category-grid__name">${category}</span>
    </a>
  `).join('');

  grid.innerHTML = html;
}

function initHeroParallax() {
  const section = document.getElementById('hero-section');
  const image = document.getElementById('hero-image');
  const content = document.getElementById('hero-content');
  
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !section || !image || !content || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Ensure scroll trigger is registered
  gsap.registerPlugin(ScrollTrigger);

  // Background image drifts slower than the page for depth
  gsap.to(image, {
    yPercent: 25,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: true,
    }
  });

  // Headline and copy ease up and fade as the hero leaves
  gsap.to(content, {
    yPercent: -18,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: true,
    }
  });
}
