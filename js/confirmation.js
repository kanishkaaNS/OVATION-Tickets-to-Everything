// ==========================================================================
// OVATION — Confirmation Logic
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Shared Components
  window.OvationComponents.init({ overlayHeader: false });
  
  // 2. Initialize Confirmation Page
  initConfirmation();

  // 3. Initialize Global Animations
  window.OvationAnimations.init();
});

function initConfirmation() {
  const container = document.getElementById('confirmation-content');
  if (!container || !window.OvationCart) return;

  const order = window.OvationCart.lastOrder;

  if (!order) {
    container.innerHTML = `
      <div class="empty-state animate-reveal-up">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon text-muted"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <h1 class="empty-state__title mt-6">No recent orders</h1>
        <p class="empty-state__message">We couldn't find a recent order for this session.</p>
        <a href="events.html" class="btn btn--primary empty-state__action">Browse events</a>
      </div>
    `;
    return;
  }

  const linesHtml = order.lines.map(line => {
    const dateStr = window.OvationData.formatEventDate(line.eventDate);
    return `
      <div class="ticket-line text-left">
        <div class="ticket-line__header">
          <div>
            <p class="ticket-line__event-name">${line.eventTitle}</p>
            <p class="ticket-line__qty">${line.quantity} × ${line.tierName}</p>
          </div>
          <span class="ticket-line__price">$${(line.price * line.quantity).toFixed(2)}</span>
        </div>
        <div class="ticket-line__meta">
          <div class="ticket-line__meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--sm"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            ${dateStr.full} at ${dateStr.time}
          </div>
          <div class="ticket-line__meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--sm"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            ${line.venue}, ${line.city}
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="confirmation__icon rounded-full animate-scale-in">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M20 6 9 17l-5-5"/></svg>
    </div>
    
    <h1 class="confirmation__title animate-reveal-up animation-delay-100">
      You're going!
    </h1>
    
    <p class="confirmation__message animate-reveal-up animation-delay-200">
      Thanks for your order, ${order.name.split(' ')[0]}. We've sent a confirmation email with your digital tickets to <strong>${order.email}</strong>.
    </p>

    <p class="confirmation__order-id animate-reveal-up animation-delay-200">
      Order #<strong>${order.id}</strong>
    </p>

    <div class="w-full mt-10 border border-border animate-reveal-up animation-delay-300">
      <div class="border-b border-border bg-secondary p-4 text-left font-display font-medium text-foreground">
        Your Tickets
      </div>
      <div class="bg-background">
        ${linesHtml}
      </div>
      <div class="p-4 text-left bg-secondary/50 border-t border-border flex justify-between items-center text-sm">
        <span class="text-muted">Total Paid</span>
        <span class="font-mono text-foreground font-medium">$${order.total.toFixed(2)}</span>
      </div>
    </div>

    <div class="confirmation__actions w-full animate-reveal-up animation-delay-400">
      <button type="button" class="btn btn--outline" onclick="window.print()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon--md"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
        Print Receipt
      </button>
      <a href="events.html" class="btn btn--dark">
        Find more events
      </a>
    </div>
  `;
}
