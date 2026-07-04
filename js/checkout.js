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
              
              <div class="field mt-6">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" id="bookForOther" class="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                  <span class="text-sm">Book for someone else</span>
                </label>
              </div>
              
              <div id="otherPersonFields" class="hidden mt-4 grid gap-4 p-4 border border-border rounded-lg bg-secondary/30">
                <h3 class="font-medium text-sm">Recipient Details</h3>
                <div class="grid form-grid-2 gap-4">
                  <div class="field">
                    <label for="recipientFirstName" class="field__label">Recipient First Name</label>
                    <input type="text" id="recipientFirstName" class="input-base" placeholder="John" />
                  </div>
                  <div class="field">
                    <label for="recipientLastName" class="field__label">Recipient Last Name</label>
                    <input type="text" id="recipientLastName" class="input-base" placeholder="Smith" />
                  </div>
                </div>
                <div class="field">
                  <label for="recipientEmail" class="field__label">Recipient Email</label>
                  <input type="email" id="recipientEmail" class="input-base" placeholder="john@example.com" />
                </div>
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
                    <p id="exp-error" class="text-destructive text-xs mt-1 hidden">Invalid month. Must be 01-12.</p>
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
      // 1. Auto-populate user data if available
      if (window.OvationAuth && window.OvationAuth.currentUser) {
        const user = window.OvationAuth.currentUser;
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const emailInput = document.getElementById('email');
        if (firstNameInput && user.name) {
          const parts = user.name.split(' ');
          firstNameInput.value = parts[0] || '';
          lastNameInput.value = parts.slice(1).join(' ') || '';
        }
        if (emailInput && user.email) {
          emailInput.value = user.email;
        }
      }

      // 2. "Book for someone else" toggle
      const bookForOther = document.getElementById('bookForOther');
      const otherPersonFields = document.getElementById('otherPersonFields');
      const recipientFirstName = document.getElementById('recipientFirstName');
      const recipientLastName = document.getElementById('recipientLastName');
      const recipientEmail = document.getElementById('recipientEmail');
      
      if (bookForOther && otherPersonFields) {
        bookForOther.addEventListener('change', (e) => {
          if (e.target.checked) {
            otherPersonFields.classList.remove('hidden');
            recipientFirstName.required = true;
            recipientLastName.required = true;
            recipientEmail.required = true;
          } else {
            otherPersonFields.classList.add('hidden');
            recipientFirstName.required = false;
            recipientLastName.required = false;
            recipientEmail.required = false;
          }
        });
      }

      // 3. Card Number Formatting
      const cardInput = document.getElementById('card');
      if (cardInput) {
        cardInput.addEventListener('input', function (e) {
          let position = this.selectionStart;
          let val = this.value;
          let spacesBefore = (val.substring(0, position).match(/ /g) || []).length;
          
          let cleanVal = val.replace(/\D/g, '');
          let formattedVal = '';
          for (let i = 0; i < cleanVal.length; i++) {
            if (i > 0 && i % 4 === 0) {
              formattedVal += ' ';
            }
            formattedVal += cleanVal[i];
          }
          this.value = formattedVal;
          
          let newSpacesBefore = (this.value.substring(0, position).match(/ /g) || []).length;
          position += (newSpacesBefore - spacesBefore);
          this.setSelectionRange(position, position);
        });
      }

      // 4. Expiry Date Formatting & Validation
      const expInput = document.getElementById('exp');
      const expError = document.getElementById('exp-error');
      let isValidExp = false;
      
      if (expInput) {
        expInput.addEventListener('input', function (e) {
          let val = this.value;
          let position = this.selectionStart;
          let slashesBefore = (val.substring(0, position).match(/\//g) || []).length;
          
          if (e.inputType === 'deleteContentBackward' && val.length === 2 && this.lastVal && this.lastVal.includes('/')) {
            val = val.substring(0, 1);
          }
          
          let cleanVal = val.replace(/\D/g, '');
          let formattedVal = cleanVal;
          if (cleanVal.length > 2) {
            formattedVal = cleanVal.substring(0, 2) + '/' + cleanVal.substring(2, 4);
          }
          
          this.value = formattedVal;
          this.lastVal = formattedVal;
          
          let newSlashesBefore = (this.value.substring(0, position).match(/\//g) || []).length;
          position += (newSlashesBefore - slashesBefore);
          this.setSelectionRange(position, position);
          
          if (cleanVal.length >= 2) {
            const month = parseInt(cleanVal.substring(0, 2), 10);
            if (month < 1 || month > 12) {
              expError.classList.remove('hidden');
              isValidExp = false;
            } else {
              expError.classList.add('hidden');
              isValidExp = cleanVal.length === 4;
            }
          } else {
            expError.classList.add('hidden');
            isValidExp = false;
          }
        });
      }

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Final validation
        if (expInput && expInput.value.replace(/\D/g, '').length !== 4) {
          isValidExp = false;
        }
        
        if (!isValidExp) {
          if (expError) expError.classList.remove('hidden');
          return;
        }

        const performCheckout = () => {
          const btn = document.getElementById('submit-order-btn');
          btn.disabled = true;
          btn.textContent = 'Processing...';

          setTimeout(() => {
            let finalFirstName = document.getElementById('firstName').value;
            let finalLastName = document.getElementById('lastName').value;
            let finalEmail = document.getElementById('email').value;

            if (bookForOther && bookForOther.checked) {
              finalFirstName = recipientFirstName.value;
              finalLastName = recipientLastName.value;
              finalEmail = recipientEmail.value;
            }

            const order = window.OvationBooking.placeOrder({
              name: `${finalFirstName} ${finalLastName}`,
              email: finalEmail
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
