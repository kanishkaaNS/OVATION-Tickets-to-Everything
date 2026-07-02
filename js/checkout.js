// ==========================================================================
// OVATION — Checkout Logic
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Shared Components
  window.OvationComponents.init({ overlayHeader: false });

  // 2. Initialize Checkout Page
  initCheckout();

  // 3. Initialize Global Animations
  window.OvationAnimations.init();
});

function initCheckout() {
  const container = document.getElementById('checkout-content');
  if (!container || !window.OvationBooking) return;

  container.innerHTML = window.OvationComponents.renderCheckoutSkeleton();

  function render() {
    const booking = window.OvationBooking.currentBooking;

    if (!booking || !booking.lines || booking.lines.length === 0) {
      container.innerHTML = `
        <div class="empty-state animate-reveal-up">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon text-muted"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
          <h1 class="empty-state__title mt-6">No active booking</h1>
          <p class="empty-state__message">Looks like you haven't selected any tickets yet.</p>
          <a href="events.html" class="btn btn--primary empty-state__action">Browse events</a>
        </div>
      `;
      return;
    }

    const subtotal = window.OvationBooking.subtotal;
    const fees = window.OvationBooking.fees;
    const total = window.OvationBooking.total;

    const bookingHtml = booking.lines.map(line => {
      const dateStr = window.OvationData.formatEventDate(booking.eventDate);
      return `
        <div class="booking-item">
          <div class="booking-item__image-wrap">
            <img src="${booking.eventImage}" alt="${booking.eventTitle}" class="booking-item__image" />
          </div>
          <div class="booking-item__details">
            <a href="event.html?slug=${booking.eventSlug}" class="booking-item__event-link text-lg">${booking.eventTitle}</a>
            <p class="booking-item__tier">${line.tierName}</p>
            <p class="booking-item__meta mt-2">${dateStr.full} · ${booking.venue}</p>
            
            <div class="booking-item__controls">
              <div class="booking-item__qty" style="padding: 0; border: none; background: transparent;">
                <span class="booking-item__qty-value text-muted">${line.quantity} ${line.quantity === 1 ? 'ticket' : 'tickets'}</span>
              </div>
              
              <div class="booking-item__price-remove">
                <span class="booking-item__price">${window.OvationData.formatCurrency(line.price * line.quantity)}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <h1 class="checkout__title animate-reveal-up">Checkout</h1>
      
      <div class="checkout__grid">
        <!-- Left: Form -->
        <div class="animate-reveal-up" style="animation-delay: 100ms;">
          <div>
            <h2 class="font-display text-xl text-foreground">Your Tickets</h2>
            <div class="mt-6 flex flex-col border-t border-border">
              ${bookingHtml}
            </div>
          </div>

          <div class="mt-12">
            <h2 class="font-display text-xl text-foreground mb-6">Contact Information</h2>
            <form id="checkout-form" class="grid gap-4">
              <div class="grid form-grid-2 gap-4">
                <div class="field">
                  <label for="firstName" class="field__label">First name</label>
                  <input type="text" id="firstName" name="firstName" required class="input-base" placeholder="Jane" />
                </div>
                <div class="field">
                  <label for="lastName" class="field__label">Last name</label>
                  <input type="text" id="lastName" name="lastName" required class="input-base" placeholder="Doe" />
                </div>
              </div>
              <div class="field mt-2">
                <label for="email" class="field__label">Email address</label>
                <input type="email" id="email" name="email" required class="input-base" placeholder="jane@example.com" />
              </div>
              
              <div class="mt-8 border-t border-border pt-8">
                <h2 class="font-display text-xl text-foreground mb-6">Payment</h2>
                <div class="field">
                  <label for="card" class="field__label">Card number</label>
                  <input type="text" id="card" required class="input-base" placeholder="0000 0000 0000 0000" maxlength="19" />
                </div>
                <div class="grid form-grid-2 gap-4 mt-4">
                  <div class="field">
                    <label for="exp" class="field__label">Expiration date</label>
                    <input type="text" id="exp" required class="input-base" placeholder="MM/YY" maxlength="5" />
                  </div>
                  <div class="field">
                    <label for="cvc" class="field__label">CVC</label>
                    <input type="text" id="cvc" required class="input-base" placeholder="123" maxlength="4" />
                  </div>
                </div>
              </div>

              <button type="submit" class="btn btn--dark w-full mt-8" id="submit-order-btn">
                Pay ${window.OvationData.formatCurrency(total)}
              </button>
            </form>
          </div>
        </div>

        <!-- Right: Order Summary Sidebar -->
        <div class="animate-reveal-up" style="animation-delay: 200ms;">
          <div class="sticky-sidebar order-summary">
            <div class="order-summary__header">
              <h2 class="order-summary__title">Booking Summary</h2>
            </div>
            <div class="order-summary__body">
              <div class="order-summary__row">
                <span>Subtotal</span>
                <span class="order-summary__value">${window.OvationData.formatCurrency(subtotal)}</span>
              </div>
              <div class="order-summary__row">
                <span>Service Fee</span>
                <span class="order-summary__value">${window.OvationData.formatCurrency(fees)}</span>
              </div>
              <div class="order-summary__total-row">
                <span class="order-summary__total-label">Total</span>
                <span class="order-summary__total-value">${window.OvationData.formatCurrency(total)}</span>
              </div>
            </div>
            <div class="order-summary__footer">
              <p class="order-summary__note">All sales are final. By placing your order, you agree to our terms of service.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Setup form listener
    const form = document.getElementById('checkout-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const performCheckout = () => {
          const btn = document.getElementById('submit-order-btn');
          btn.disabled = true;
          btn.textContent = 'Processing...';

          // Fake network delay
          setTimeout(() => {
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;

            const order = window.OvationBooking.placeOrder({
              name: `${firstName} ${lastName}`,
              email: email
            });

            const orderData = encodeURIComponent(JSON.stringify(order));
            window.location.href = `confirmation.html?order=${orderData}`;
          }, 800);
        };

        if (window.OvationAuth) {
          window.OvationAuth.requireAuth(performCheckout);
        } else {
          performCheckout();
        }
      });
    }
  }

  // Initial render
  requestAnimationFrame(render);
}
