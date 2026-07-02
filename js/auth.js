// ==========================================================================
// OVATION — Authentication System (localStorage-backed, frontend-only)
// ==========================================================================

const USERS_STORAGE_KEY = 'ovation_users';
const SESSION_STORAGE_KEY = 'ovation_session';

// --- Validation Helpers ---

const Validators = {
  /**
   * Validates an email against a realistic pattern.
   * Accepts common providers, educational, and corporate domains.
   * Rejects clearly malformed addresses.
   */
  email(email) {
    if (!email || typeof email !== 'string') {
      return { valid: false, message: 'Email address is required.' };
    }

    const trimmed = email.trim().toLowerCase();

    // Structural check: must have exactly one @, a local part, and a domain part
    const parts = trimmed.split('@');
    if (parts.length !== 2) {
      return { valid: false, message: 'Email must contain exactly one "@" symbol.' };
    }

    const [local, domain] = parts;

    if (!local || local.length === 0) {
      return { valid: false, message: 'Email is missing a username before "@".' };
    }

    if (!domain || domain.length === 0) {
      return { valid: false, message: 'Email is missing a domain after "@".' };
    }

    // Local part: letters, digits, dots, hyphens, underscores, plus signs
    const localRegex = /^[a-zA-Z0-9._%+-]+$/;
    if (!localRegex.test(local)) {
      return { valid: false, message: 'Email username contains invalid characters.' };
    }

    // No leading/trailing/consecutive dots in local
    if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) {
      return { valid: false, message: 'Email username cannot start or end with a dot, or have consecutive dots.' };
    }

    // Domain: must have at least one dot, valid characters
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return { valid: false, message: 'Please enter a valid email domain (e.g. gmail.com).' };
    }

    return { valid: true, message: '' };
  },

  /**
   * Validates password against all rules.
   * Returns an object with overall validity and per-rule status.
   */
  password(password) {
    const rules = [
      { id: 'length', label: '8–16 characters', passed: password.length >= 8 && password.length <= 16 },
      { id: 'uppercase', label: 'One uppercase letter', passed: /[A-Z]/.test(password) },
      { id: 'lowercase', label: 'One lowercase letter', passed: /[a-z]/.test(password) },
      { id: 'number', label: 'One number', passed: /[0-9]/.test(password) },
      { id: 'special', label: 'One special character', passed: /[^A-Za-z0-9]/.test(password) },
    ];

    const allPassed = rules.every(r => r.passed);
    return { valid: allPassed, rules };
  },

  /**
   * Validates that the full name is at least 2 non-whitespace characters.
   */
  name(name) {
    if (!name || name.trim().length < 2) {
      return { valid: false, message: 'Full name must be at least 2 characters.' };
    }
    return { valid: true, message: '' };
  }
};

// --- Auth Manager ---

class AuthManager {
  constructor() {
    this.users = this._loadUsers();
    this.currentUser = this._loadSession();
    this.pendingAction = null;

    // Inject modal when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this._injectModal());
    } else {
      this._injectModal();
    }
  }

  // --- Storage ---

  _loadUsers() {
    if (window.OvationState) {
      return window.OvationState.get(USERS_STORAGE_KEY) || [];
    }
    return [];
  }

  _saveUsers() {
    if (window.OvationState) {
      window.OvationState.set(USERS_STORAGE_KEY, this.users);
    }
  }

  _loadSession() {
    if (window.OvationState) {
      return window.OvationState.get(SESSION_STORAGE_KEY) || null;
    }
    return null;
  }

  _saveSession(user) {
    this.currentUser = user;
    if (window.OvationState) {
      window.OvationState.set(SESSION_STORAGE_KEY, user || null);
    }
    // Notify UI components
    window.dispatchEvent(new CustomEvent('ovation:auth-change', { detail: { user } }));
  }

  // --- Public API ---

  isAuthenticated() {
    return this.currentUser !== null;
  }

  login(email, password) {
    const emailResult = Validators.email(email);
    if (!emailResult.valid) {
      return { success: false, message: emailResult.message };
    }

    const user = this.users.find(u => u.email === email.trim().toLowerCase() && u.password === password);
    if (user) {
      this._saveSession({ email: user.email, name: user.name });
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password.' };
  }

  signup(name, email, password, confirmPassword) {
    // Validate name
    const nameResult = Validators.name(name);
    if (!nameResult.valid) {
      return { success: false, message: nameResult.message };
    }

    // Validate email
    const emailResult = Validators.email(email);
    if (!emailResult.valid) {
      return { success: false, message: emailResult.message };
    }

    // Validate password
    const passResult = Validators.password(password);
    if (!passResult.valid) {
      return { success: false, message: 'Password does not meet all requirements.' };
    }

    // Confirm password match
    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match.' };
    }

    // Check for existing account
    const normalizedEmail = email.trim().toLowerCase();
    if (this.users.some(u => u.email === normalizedEmail)) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    // Create user
    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      password: password,
      registeredAt: new Date().toISOString()
    };
    this.users.push(newUser);
    this._saveUsers();
    this._saveSession({ email: newUser.email, name: newUser.name });
    return { success: true };
  }

  logout() {
    this._saveSession(null);
  }

  /**
   * Gates a protected action behind authentication.
   * If the user is logged in, runs the callback immediately.
   * Otherwise, opens the auth modal and queues the callback for after login.
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

  _injectModal() {
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

          <!-- ==================== LOGIN FORM ==================== -->
          <form id="auth-login-form" class="auth-form is-active" novalidate>
            <h2 id="auth-modal-title" class="auth-form__heading">Welcome Back</h2>
            <div id="login-error" class="auth-error"></div>

            <div class="form-group">
              <label for="login-email">Email Address</label>
              <input type="email" id="login-email" class="form-input" placeholder="you@example.com" required autocomplete="email" />
            </div>

            <div class="form-group">
              <label for="login-password">Password</label>
              <input type="password" id="login-password" class="form-input" placeholder="Enter your password" required autocomplete="current-password" />
            </div>
            <div class="auth-form__forgot-row">
              <button type="button" class="auth-link" id="forgot-password-link">Forgot password?</button>
            </div>

            <button type="submit" class="btn btn--primary btn--full auth-form__submit">Login</button>

            <div class="auth-form__switch">
              <span>Don't have an account?</span>
              <button type="button" class="auth-link auth-link--bold" id="switch-to-register">Register now</button>
            </div>
          </form>

          <!-- ==================== FORGOT PASSWORD FORM ==================== -->
          <form id="auth-forgot-form" class="auth-form" novalidate>
            <h2 class="auth-form__heading">Reset Password</h2>
            <p class="auth-form__subtitle">Enter your email and we'll send you a link to reset your password.</p>
            <div id="forgot-error" class="auth-error"></div>
            <div id="forgot-success" class="auth-success"></div>

            <div class="form-group">
              <label for="forgot-email">Email Address</label>
              <input type="email" id="forgot-email" class="form-input" placeholder="you@example.com" required autocomplete="email" />
            </div>

            <button type="submit" class="btn btn--primary btn--full auth-form__submit">Send Reset Link</button>
            <button type="button" class="btn btn--outline btn--full auth-form__back" id="back-to-login-link">Back to Login</button>
          </form>

          <!-- ==================== SIGN UP FORM ==================== -->
          <form id="auth-signup-form" class="auth-form" novalidate>
            <h2 class="auth-form__heading">Create Account</h2>
            <div id="signup-error" class="auth-error"></div>

            <div class="form-group">
              <label for="signup-name">Full Name</label>
              <input type="text" id="signup-name" class="form-input" placeholder="Jane Doe" required autocomplete="name" />
            </div>

            <div class="form-group">
              <label for="signup-email">Email Address</label>
              <input type="email" id="signup-email" class="form-input" placeholder="you@example.com" required autocomplete="email" />
              <span class="form-hint" id="signup-email-hint"></span>
            </div>

            <div class="form-group form-group--password">
              <label for="signup-password">Password</label>
              <input type="password" id="signup-password" class="form-input" placeholder="Create a strong password" required autocomplete="new-password" />
              <div class="password-tooltip" id="password-tooltip">
                <p class="password-tooltip__title">Password must contain:</p>
                <ul class="password-tooltip__list" id="password-rules-list">
                  <li data-rule="length"><span class="password-tooltip__icon">○</span> 8–16 characters</li>
                  <li data-rule="uppercase"><span class="password-tooltip__icon">○</span> One uppercase letter</li>
                  <li data-rule="lowercase"><span class="password-tooltip__icon">○</span> One lowercase letter</li>
                  <li data-rule="number"><span class="password-tooltip__icon">○</span> One number</li>
                  <li data-rule="special"><span class="password-tooltip__icon">○</span> One special character</li>
                </ul>
              </div>
            </div>

            <div class="form-group">
              <label for="signup-confirm">Confirm Password</label>
              <input type="password" id="signup-confirm" class="form-input" placeholder="Re-enter your password" required autocomplete="new-password" />
              <span class="form-hint" id="signup-confirm-hint"></span>
            </div>

            <button type="submit" class="btn btn--primary btn--full auth-form__submit" id="signup-submit-btn">Create Account</button>

            <div class="auth-form__switch">
              <span>Already have an account?</span>
              <button type="button" class="auth-link auth-link--bold" id="switch-to-login">Login</button>
            </div>
          </form>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this._setupListeners();
  }

  // --- Event Listeners ---

  _setupListeners() {
    const modal = document.getElementById('auth-modal');
    const overlay = modal.querySelector('.auth-modal__overlay');
    const closeBtn = modal.querySelector('.auth-modal__close');
    const tabs = modal.querySelectorAll('.auth-tab');
    const forms = modal.querySelectorAll('.auth-form');

    // --- Helper: switch to a specific form pane ---
    const showForm = (target) => {
      forms.forEach(f => f.classList.remove('is-active'));
      const targetForm = document.getElementById(`auth-${target}-form`);
      if (targetForm) targetForm.classList.add('is-active');
    };

    const activateTab = (target) => {
      tabs.forEach(t => t.classList.remove('is-active'));
      const tab = Array.from(tabs).find(t => t.dataset.target === target);
      if (tab) tab.classList.add('is-active');
    };

    // --- Close ---
    const closeModal = () => this.hideModal();
    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
        closeModal();
      }
    });

    // --- Tab switching ---
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        activateTab(tab.dataset.target);
        showForm(tab.dataset.target);
        this._clearErrors();
      });
    });

    // --- Forgot password link ---
    document.getElementById('forgot-password-link').addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      showForm('forgot');
      this._clearErrors();
    });

    // --- Back to login from forgot ---
    document.getElementById('back-to-login-link').addEventListener('click', () => {
      activateTab('login');
      showForm('login');
      this._clearErrors();
    });

    // --- "Register now" from login form ---
    document.getElementById('switch-to-register').addEventListener('click', () => {
      activateTab('signup');
      showForm('signup');
      this._clearErrors();
    });

    // --- "Login" from signup form ---
    document.getElementById('switch-to-login').addEventListener('click', () => {
      activateTab('login');
      showForm('login');
      this._clearErrors();
    });

    // --- Auto-clear login error when user edits fields ---
    const loginEmail = document.getElementById('login-email');
    const loginPass = document.getElementById('login-password');
    const loginErr = document.getElementById('login-error');

    const clearLoginError = () => {
      loginErr.style.display = 'none';
      loginErr.textContent = '';
    };
    loginEmail.addEventListener('input', clearLoginError);
    loginPass.addEventListener('input', clearLoginError);

    // --- Password tooltip logic (signup only) ---
    const signupPass = document.getElementById('signup-password');
    const tooltip = document.getElementById('password-tooltip');

    const showTooltip = () => {
      tooltip.classList.add('is-visible');
      this._updatePasswordRules(signupPass.value);
    };
    const hideTooltip = () => {
      tooltip.classList.remove('is-visible');
    };

    signupPass.addEventListener('focus', showTooltip);
    signupPass.addEventListener('input', () => {
      this._updatePasswordRules(signupPass.value);
    });
    signupPass.addEventListener('blur', hideTooltip);

    // --- Confirm password live hint ---
    const signupConfirm = document.getElementById('signup-confirm');
    const confirmHint = document.getElementById('signup-confirm-hint');

    signupConfirm.addEventListener('input', () => {
      if (signupConfirm.value.length === 0) {
        confirmHint.textContent = '';
        confirmHint.className = 'form-hint';
        return;
      }
      if (signupConfirm.value === signupPass.value) {
        confirmHint.textContent = 'Passwords match ✓';
        confirmHint.className = 'form-hint form-hint--success';
      } else {
        confirmHint.textContent = 'Passwords do not match';
        confirmHint.className = 'form-hint form-hint--error';
      }
    });

    // --- Email validation hint on signup ---
    const signupEmail = document.getElementById('signup-email');
    const emailHint = document.getElementById('signup-email-hint');

    signupEmail.addEventListener('blur', () => {
      if (signupEmail.value.length === 0) {
        emailHint.textContent = '';
        emailHint.className = 'form-hint';
        return;
      }
      const result = Validators.email(signupEmail.value);
      if (result.valid) {
        emailHint.textContent = '';
        emailHint.className = 'form-hint';
      } else {
        emailHint.textContent = result.message;
        emailHint.className = 'form-hint form-hint--error';
      }
    });

    signupEmail.addEventListener('input', () => {
      emailHint.textContent = '';
      emailHint.className = 'form-hint';
    });

    // ===================== FORM SUBMISSIONS =====================

    // --- Login ---
    document.getElementById('auth-login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginEmail.value;
      const password = loginPass.value;

      const result = this.login(email, password);
      if (result.success) {
        this.hideModal();
        if (this.pendingAction) {
          this.pendingAction();
          this.pendingAction = null;
        }
      } else {
        loginErr.textContent = result.message;
        loginErr.style.display = 'block';
      }
    });

    // --- Sign Up ---
    document.getElementById('auth-signup-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value;
      const email = signupEmail.value;
      const password = signupPass.value;
      const confirm = signupConfirm.value;
      const errEl = document.getElementById('signup-error');

      const result = this.signup(name, email, password, confirm);
      if (result.success) {
        this.hideModal();
        if (this.pendingAction) {
          this.pendingAction();
          this.pendingAction = null;
        }
      } else {
        errEl.textContent = result.message;
        errEl.style.display = 'block';
      }
    });

    // Auto-clear signup error on any input
    [document.getElementById('signup-name'), signupEmail, signupPass, signupConfirm].forEach(el => {
      el.addEventListener('input', () => {
        const errEl = document.getElementById('signup-error');
        errEl.style.display = 'none';
        errEl.textContent = '';
      });
    });

    // --- Forgot Password ---
    document.getElementById('auth-forgot-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email').value;
      const errEl = document.getElementById('forgot-error');
      const successEl = document.getElementById('forgot-success');

      // Validate email first
      const emailResult = Validators.email(email);
      if (!emailResult.valid) {
        errEl.textContent = emailResult.message;
        errEl.style.display = 'block';
        successEl.style.display = 'none';
        return;
      }

      // Simulate success
      errEl.style.display = 'none';
      successEl.textContent = 'If an account exists with this email, a password reset link has been sent.';
      successEl.style.display = 'block';
      document.getElementById('auth-forgot-form').querySelector('button[type="submit"]').disabled = true;
    });
  }

  // --- Password Rules UI ---

  _updatePasswordRules(password) {
    const result = Validators.password(password);
    const listItems = document.querySelectorAll('#password-rules-list li');

    result.rules.forEach(rule => {
      const li = document.querySelector(`#password-rules-list li[data-rule="${rule.id}"]`);
      if (!li) return;
      const icon = li.querySelector('.password-tooltip__icon');
      if (rule.passed) {
        li.classList.add('is-passed');
        li.classList.remove('is-failed');
        icon.textContent = '✓';
      } else {
        li.classList.remove('is-passed');
        if (password.length > 0) {
          li.classList.add('is-failed');
        } else {
          li.classList.remove('is-failed');
        }
        icon.textContent = '○';
      }
    });
  }

  // --- Modal Visibility ---

  showModal() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;

    modal.setAttribute('aria-hidden', 'false');
    this._resetForms();
    document.body.style.overflow = 'hidden';
  }

  hideModal() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;

    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  _resetForms() {
    document.getElementById('auth-login-form')?.reset();
    document.getElementById('auth-signup-form')?.reset();
    document.getElementById('auth-forgot-form')?.reset();
    this._clearErrors();

    // Reset tooltip
    const tooltip = document.getElementById('password-tooltip');
    if (tooltip) tooltip.classList.remove('is-visible');

    // Reset password rule icons
    document.querySelectorAll('#password-rules-list li').forEach(li => {
      li.classList.remove('is-passed', 'is-failed');
      const icon = li.querySelector('.password-tooltip__icon');
      if (icon) icon.textContent = '○';
    });

    // Reset confirm hint
    const confirmHint = document.getElementById('signup-confirm-hint');
    if (confirmHint) { confirmHint.textContent = ''; confirmHint.className = 'form-hint'; }

    // Reset email hint
    const emailHint = document.getElementById('signup-email-hint');
    if (emailHint) { emailHint.textContent = ''; emailHint.className = 'form-hint'; }

    // Re-enable forgot submit
    const forgotSubmit = document.querySelector('#auth-forgot-form button[type="submit"]');
    if (forgotSubmit) forgotSubmit.disabled = false;

    // Default to login tab
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    tabs.forEach(t => t.classList.remove('is-active'));
    forms.forEach(f => f.classList.remove('is-active'));
    if (tabs[0]) tabs[0].classList.add('is-active');
    document.getElementById('auth-login-form')?.classList.add('is-active');
  }

  _clearErrors() {
    document.querySelectorAll('.auth-error, .auth-success').forEach(el => {
      el.style.display = 'none';
      el.textContent = '';
    });
  }
}

// --- Instantiate globally ---
window.OvationAuth = new AuthManager();
