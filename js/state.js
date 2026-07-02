// ==========================================================================
// OVATION — Centralized State Management
// ==========================================================================
// Handles state persistence across file:// protocol by using window.name
// and falls back to localStorage/sessionStorage for HTTP environments.

class StateManager {
  constructor() {
    this.state = this._loadState();
  }

  _loadState() {
    // 1. Try window.name (persists across cross-origin file:// navigation in the same tab)
    try {
      if (window.name && window.name.startsWith('ovation_state:')) {
        return JSON.parse(window.name.substring('ovation_state:'.length));
      }
    } catch (e) {
      console.warn("Could not parse window.name state");
    }

    // 2. Try sessionStorage
    try {
      const stored = sessionStorage.getItem('ovation_app_state');
      if (stored) return JSON.parse(stored);
    } catch (e) {}

    // 3. Try localStorage
    try {
      const stored = localStorage.getItem('ovation_app_state');
      if (stored) return JSON.parse(stored);
    } catch (e) {}

    return {};
  }

  _saveState() {
    const json = JSON.stringify(this.state);
    
    // Save to window.name for file:// cross-page navigation
    window.name = 'ovation_state:' + json;

    // Save to regular storages for http:// usage
    try { sessionStorage.setItem('ovation_app_state', json); } catch (e) {}
    try { localStorage.setItem('ovation_app_state', json); } catch (e) {}
  }

  get(key) {
    return this.state[key] !== undefined ? this.state[key] : null;
  }

  set(key, value) {
    if (value === null || value === undefined) {
      delete this.state[key];
    } else {
      this.state[key] = value;
    }
    this._saveState();
  }
}

// Instantiate globally
window.OvationState = new StateManager();
