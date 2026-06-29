// ==========================================================================
// OVATION — Authentication State Management (backed by localStorage)
// ==========================================================================

const USERS_STORAGE_KEY = 'ovation_users';
const CURRENT_USER_KEY = 'ovation_current_user';

class AuthManager {
  constructor() {
    this.users = this.loadUsers();
    this.currentUser = this.loadCurrentUser();
    this.pendingAction = null;
    
    // Inject the modal HTML into the DOM when ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.injectModal());
    } else {
      this.injectModal();
    }
  }

  loadUsers() {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveUsers() {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
    } catch (e) {
      console.error('Failed to save users', e);
    }
  }

  loadCurrentUser() {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }

  saveCurrentUser(user) {
    this.currentUser = user;
    if (user) {
      try {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } catch (e) {}
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
    
    // Dispatch event to update UI
    window.dispatchEvent(new CustomEvent('ovation:auth-change', { detail: { user } }));
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  // --- Auth Actions ---

  login(email, password) {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.saveCurrentUser({ email: user.email, name: user.name });
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password' };
  }

  signup(name, email, password) {
    if (this.users.some(u => u.email === email)) {
      return { success: false, message: 'Email already exists' };
    }
    const newUser = { name, email, password };
    this.users.push(newUser);
    this.saveUsers();
    this.saveCurrentUser({ email: newUser.email, name: newUser.name });
    return { success: true };
  }

  logout() {
    this.saveCurrentUser(null);
  }

  // --- UI Interception ---

  /**
   * Requires the user to be authenticated to proceed.
   * If not authenticated, opens the auth modal and queues the action.
   */
  requireAuth(actionCallback) {
    if (this.isAuthenticated()) {
      actionCallback();
    } else {
      this.pendingAction = actionCallback;
      this.showModal();
    }
  }

  // --- Modal UI ---
  
  injectModal() {
    if (document.getElementById('auth-modal')) return;

    const modalHTML = `
      <div id="auth-modal" class="auth-modal" aria-hidden="true">
        <div class="auth-modal__overlay" tabindex="-1"></div>
        <div class="auth-modal__content" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
          <button type="button" class="auth-modal__close" aria-label="Close modal">&times;</button>
          
          <div class="auth-modal__tabs">
            <button class="auth-tab is-active" data-target="login">Login</button>
            <button class="auth-tab" data-target="signup">Sign Up</button>
          </div>

          <!-- Login Form -->
          <form id="auth-login-form" class="auth-form is-active">
            <h2 id="auth-modal-title" class="font-display text-2xl mb-4">Welcome Back</h2>
            <div id="login-error" class="auth-error"></div>
            
            <div class="form-group">
              <label for="login-email">Email</label>
              <input type="email" id="login-email" class="form-input" required />
            </div>
            
            <div class="form-group">
              <label for="login-password">Password</label>
              <input type="password" id="login-password" class="form-input" required />
            </div>
            
            <button type="submit" class="btn btn--primary btn--full mt-4">Login</button>
          </form>

          <!-- Sign Up Form -->
          <form id="auth-signup-form" class="auth-form">
            <h2 class="font-display text-2xl mb-4">Create Account</h2>
            <div id="signup-error" class="auth-error"></div>
            
            <div class="form-group">
              <label for="signup-name">Full Name</label>
              <input type="text" id="signup-name" class="form-input" required minlength="2" />
            </div>

            <div class="form-group">
              <label for="signup-email">Email</label>
              <input type="email" id="signup-email" class="form-input" required />
            </div>
            
            <div class="form-group">
              <label for="signup-password">Password</label>
              <input type="password" id="signup-password" class="form-input" required minlength="6" />
            </div>

            <div class="form-group">
              <label for="signup-confirm">Confirm Password</label>
              <input type="password" id="signup-confirm" class="form-input" required />
            </div>
            
            <button type="submit" class="btn btn--primary btn--full mt-4">Sign Up</button>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.setupModalListeners();
  }

  setupModalListeners() {
    const modal = document.getElementById('auth-modal');
    const overlay = modal.querySelector('.auth-modal__overlay');
    const closeBtn = modal.querySelector('.auth-modal__close');
    
    // Close actions
    const close = () => this.hideModal();
    overlay.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    
    // Tab switching
    const tabs = modal.querySelectorAll('.auth-tab');
    const forms = modal.querySelectorAll('.auth-form');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('is-active'));
        forms.forEach(f => f.classList.remove('is-active'));
        
        tab.classList.add('is-active');
        document.getElementById(\`auth-\${tab.dataset.target}-form\`).classList.add('is-active');
      });
    });

    // Login Form Submit
    const loginForm = document.getElementById('auth-login-form');
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      
      const res = this.login(email, pass);
      if (res.success) {
        this.hideModal();
        if (this.pendingAction) {
          this.pendingAction();
          this.pendingAction = null;
        }
      } else {
        document.getElementById('login-error').textContent = res.message;
        document.getElementById('login-error').style.display = 'block';
      }
    });

    // Sign Up Form Submit
    const signupForm = document.getElementById('auth-signup-form');
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      const pass = document.getElementById('signup-password').value;
      const confirm = document.getElementById('signup-confirm').value;
      
      const errEl = document.getElementById('signup-error');
      
      if (pass !== confirm) {
        errEl.textContent = "Passwords do not match";
        errEl.style.display = 'block';
        return;
      }
      
      const res = this.signup(name, email, pass);
      if (res.success) {
        this.hideModal();
        if (this.pendingAction) {
          this.pendingAction();
          this.pendingAction = null;
        }
      } else {
        errEl.textContent = res.message;
        errEl.style.display = 'block';
      }
    });
  }

  showModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.setAttribute('aria-hidden', 'false');
      // Reset forms
      document.getElementById('auth-login-form').reset();
      document.getElementById('auth-signup-form').reset();
      document.querySelectorAll('.auth-error').forEach(el => el.style.display = 'none');
    }
  }

  hideModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.setAttribute('aria-hidden', 'true');
      this.pendingAction = null; // Clear pending action if modal is closed
    }
  }
}

window.OvationAuth = new AuthManager();
