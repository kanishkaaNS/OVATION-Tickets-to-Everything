// ==========================================================================
// OVATION — Direct Booking Management (backed by localStorage)
// ==========================================================================

const BOOKING_STORAGE_KEY = 'ovation_current_booking';
const ORDER_STORAGE_KEY = 'ovation_last_order';
const SERVICE_FEE_RATE = 0.12;

class BookingManager {
  constructor() {
    this.currentBooking = this.loadBooking();
    this.lastOrder = this.loadOrder();
  }

  // Persist to localStorage and sessionStorage
  saveBooking() {
    if (!this.currentBooking) {
      try {
        localStorage.removeItem(BOOKING_STORAGE_KEY);
        sessionStorage.removeItem(BOOKING_STORAGE_KEY);
      } catch (e) {}
      return;
    }
    const json = JSON.stringify(this.currentBooking);
    try {
      localStorage.setItem(BOOKING_STORAGE_KEY, json);
    } catch (e) {
      console.error('Failed to save booking to localStorage', e);
    }
    try {
      sessionStorage.setItem(BOOKING_STORAGE_KEY, json);
    } catch (e) {}
  }

  loadBooking() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlBooking = urlParams.get('booking');
      if (urlBooking) {
        try {
          const parsedBooking = JSON.parse(decodeURIComponent(urlBooking));
          if (parsedBooking) {
            return this.sanitizeBooking(parsedBooking);
          }
        } catch(e) {}
      }

      let stored = localStorage.getItem(BOOKING_STORAGE_KEY);
      if (!stored) {
        try { stored = sessionStorage.getItem(BOOKING_STORAGE_KEY); } catch (e) {}
      }
      return stored ? this.sanitizeBooking(JSON.parse(stored)) : null;
    } catch (e) {
      console.error('Failed to load booking', e);
      return null;
    }
  }

  saveOrder(order) {
    this.lastOrder = order;
    const json = JSON.stringify(order);
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, json);
    } catch (e) {}
    try {
      sessionStorage.setItem(ORDER_STORAGE_KEY, json);
    } catch (e) {}
  }

  loadOrder() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlOrder = urlParams.get('order');
      if (urlOrder) {
        try {
          const parsedOrder = JSON.parse(decodeURIComponent(urlOrder));
          if (parsedOrder) return parsedOrder;
        } catch(e) {}
      }

      let stored = localStorage.getItem(ORDER_STORAGE_KEY);
      if (!stored) {
        try { stored = sessionStorage.getItem(ORDER_STORAGE_KEY); } catch (e) {}
      }
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Failed to load order', e);
      return null;
    }
  }

  sanitizeBooking(booking) {
    if (!booking) return null;
    if (!window.OvationData) return booking;

    const event = window.OvationData.getEvent(booking.eventSlug);
    if (!event) return null;

    return {
      ...booking,
      eventTitle: event.title,
      eventImage: event.image,
      eventDate: event.date,
      venue: booking.venue || event.venue,
      city: booking.city || event.city,
      lines: booking.lines.map(line => ({
        ...line,
        quantity: Math.max(1, Math.min(Number(line.quantity) || 1, 8))
      }))
    };
  }

  // Booking actions
  setBooking(bookingDetails) {
    this.currentBooking = bookingDetails;
    this.saveBooking();
  }

  clear() {
    this.currentBooking = null;
    this.saveBooking();
  }

  // Getters
  get subtotal() {
    if (!this.currentBooking || !this.currentBooking.lines) return 0;
    return this.currentBooking.lines.reduce((sum, l) => sum + (l.price * l.quantity), 0);
  }

  get fees() {
    return Math.round(this.subtotal * SERVICE_FEE_RATE);
  }

  get total() {
    return this.subtotal + this.fees;
  }

  // Checkout
  placeOrder(details) {
    if (!this.currentBooking) return null;

    const order = {
      id: `OV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      name: details.name,
      email: details.email,
      booking: JSON.parse(JSON.stringify(this.currentBooking)), // Clone booking
      subtotal: this.subtotal,
      fees: this.fees,
      total: this.total,
      timestamp: new Date().toISOString()
    };

    this.saveOrder(order);
    this.clear(); // Clear booking after successful order
    return order;
  }
}

// Global instance
window.OvationBooking = new BookingManager();
