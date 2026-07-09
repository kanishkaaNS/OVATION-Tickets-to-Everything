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
    this.users = this._loadUsers();
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

  signup(name, email, password, confirmPassword, securityQuestion, securityAnswer) {
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

    if (!securityQuestion || !securityAnswer || securityAnswer.trim() === '') {
      return { success: false, message: 'Please select a security question and provide an answer.' };
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
      securityQuestion: securityQuestion,
      securityAnswer: securityAnswer.trim().toLowerCase(),
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

  getSecurityQuestion(email) {
    this.users = this._loadUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.users.find(u => u.email === normalizedEmail);
    if (user && user.securityQuestion) {
      return { success: true, question: user.securityQuestion };
    }
    return { success: false, message: 'No account found with this email address, or account has no security question set.' };
  }

  verifySecurityAnswer(email, answer) {
    this.users = this._loadUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.users.find(u => u.email === normalizedEmail);
    if (user && user.securityAnswer === answer.trim().toLowerCase()) {
      return { success: true };
    }
    return { success: false, message: 'Incorrect security answer.' };
  }

  resetPassword(email, newPassword, confirmPassword) {
    this.users = this._loadUsers();
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists
    const userIndex = this.users.findIndex(u => u.email === normalizedEmail);
    if (userIndex === -1) {
      return { success: false, message: 'No account found with this email address.' };
    }

    // Validate password
    const passResult = Validators.password(newPassword);
    if (!passResult.valid) {
      return { success: false, message: 'Password does not meet all requirements.' };
    }

    // Confirm password match
    if (newPassword !== confirmPassword) {
      return { success: false, message: 'Passwords do not match.' };
    }

    // Update password
    this.users[userIndex].password = newPassword;
    this._saveUsers();
    
    // Clear session if they were logged in
    if (this.currentUser && this.currentUser.email === normalizedEmail) {
      this.logout();
    }

    return { success: true };
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
            <p class="auth-form__subtitle" id="forgot-subtitle">Enter your registered email address to begin.</p>
            <div id="forgot-error" class="auth-error"></div>
            <div id="forgot-success" class="auth-success"></div>

            <div id="forgot-step-1">
              <div class="form-group">
                <label for="forgot-email">Email Address</label>
                <input type="email" id="forgot-email" class="form-input" placeholder="you@example.com" required autocomplete="email" />
              </div>
              <button type="button" class="btn btn--primary btn--full auth-form__submit" id="forgot-btn-step-1">Continue</button>
            </div>

            <div id="forgot-step-2" style="display: none;">
              <div class="form-group">
                <label>Security Question</label>
                <p id="forgot-security-question-text" style="font-weight: 500; margin-bottom: 0.5rem;"></p>
                <input type="text" id="forgot-security-answer" class="form-input" placeholder="Enter your answer" required />
              </div>
              <button type="button" class="btn btn--primary btn--full auth-form__submit" id="forgot-btn-step-2">Verify Answer</button>
            </div>

            <div id="forgot-step-3" style="display: none;">
              <div class="form-group form-group--password">
                <label for="forgot-password">New Password</label>
                <input type="password" id="forgot-password" class="form-input" placeholder="Create a strong password" required autocomplete="new-password" />
                <div class="password-tooltip" id="forgot-password-tooltip">
                  <p class="password-tooltip__title">Password must contain:</p>
                  <ul class="password-tooltip__list" id="forgot-password-rules-list">
                    <li data-rule="length"><span class="password-tooltip__icon">○</span> 8–16 characters</li>
                    <li data-rule="uppercase"><span class="password-tooltip__icon">○</span> One uppercase letter</li>
                    <li data-rule="lowercase"><span class="password-tooltip__icon">○</span> One lowercase letter</li>
                    <li data-rule="number"><span class="password-tooltip__icon">○</span> One number</li>
                    <li data-rule="special"><span class="password-tooltip__icon">○</span> One special character</li>
                  </ul>
                </div>
              </div>

              <div class="form-group">
                <label for="forgot-confirm">Confirm New Password</label>
                <input type="password" id="forgot-confirm" class="form-input" placeholder="Re-enter your new password" required autocomplete="new-password" />
                <span class="form-hint" id="forgot-confirm-hint"></span>
              </div>
              
              <button type="submit" class="btn btn--primary btn--full auth-form__submit" id="forgot-btn-step-3">Reset Password</button>
            </div>

            <p class="auth-form__note" style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 1.5rem; margin-bottom: 1rem; text-align: center;">
              This project uses a security question for demonstration purposes. In a production application, password recovery would typically be completed using a secure email verification process.
            </p>

            <button type="submit" class="btn btn--primary btn--full auth-form__submit">Reset Password</button>
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

            <div class="form-group" style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border);">
              <label for="signup-security-question">Security Question</label>
              <select id="signup-security-question" class="form-input" required>
                <option value="" disabled selected>Select a security question</option>
                <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                <option value="What is your favourite movie?">What is your favourite movie?</option>
                <option value="What city were you born in?">What city were you born in?</option>
                <option value="What was the name of your first school?">What was the name of your first school?</option>
                <option value="What is your favourite food?">What is your favourite food?</option>
              </select>
            </div>

            <div class="form-group">
              <label for="signup-security-answer">Security Answer</label>
              <input type="text" id="signup-security-answer" class="form-input" placeholder="Enter your answer" required />
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

    // --- Password Tooltip visibility helper ---
    const updateTooltipVisibility = (passInput, tooltipEl, listId, isFocused) => {
      this._updatePasswordRules(passInput.value, listId);
      const isValid = Validators.password(passInput.value).valid;
      
      if (isFocused && !isValid) {
        tooltipEl.classList.add('is-visible');
      } else {
        tooltipEl.classList.remove('is-visible');
      }
    };

    // --- Password tooltip logic (signup) ---
    const signupPass = document.getElementById('signup-password');
    const tooltip = document.getElementById('password-tooltip');
    let isSignupFocused = false;

    signupPass.addEventListener('focus', () => {
      isSignupFocused = true;
      updateTooltipVisibility(signupPass, tooltip, 'password-rules-list', isSignupFocused);
    });
    signupPass.addEventListener('input', () => {
      updateTooltipVisibility(signupPass, tooltip, 'password-rules-list', isSignupFocused);
    });
    signupPass.addEventListener('blur', () => {
      isSignupFocused = false;
      updateTooltipVisibility(signupPass, tooltip, 'password-rules-list', isSignupFocused);
    });

    // --- Forgot Password Tooltip logic ---
    const forgotPass = document.getElementById('forgot-password');
    const forgotTooltip = document.getElementById('forgot-password-tooltip');
    let isForgotFocused = false;

    if (forgotPass && forgotTooltip) {
      forgotPass.addEventListener('focus', () => {
        isForgotFocused = true;
        updateTooltipVisibility(forgotPass, forgotTooltip, 'forgot-password-rules-list', isForgotFocused);
      });
      forgotPass.addEventListener('input', () => {
        updateTooltipVisibility(forgotPass, forgotTooltip, 'forgot-password-rules-list', isForgotFocused);
      });
      forgotPass.addEventListener('blur', () => {
        isForgotFocused = false;
        updateTooltipVisibility(forgotPass, forgotTooltip, 'forgot-password-rules-list', isForgotFocused);
      });
    }

    // --- Forgot Password Confirm hint ---
    const forgotConfirm = document.getElementById('forgot-confirm');
    const forgotConfirmHint = document.getElementById('forgot-confirm-hint');

    forgotConfirm.addEventListener('input', () => {
      if (forgotConfirm.value.length === 0) {
        forgotConfirmHint.textContent = '';
        forgotConfirmHint.className = 'form-hint';
        return;
      }
      if (forgotConfirm.value === forgotPass.value) {
        forgotConfirmHint.textContent = 'Passwords match ✓';
        forgotConfirmHint.className = 'form-hint form-hint--success';
      } else {
        forgotConfirmHint.textContent = 'Passwords do not match';
        forgotConfirmHint.className = 'form-hint form-hint--error';
      }
    });

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
      const securityQuestion = document.getElementById('signup-security-question').value;
      const securityAnswer = document.getElementById('signup-security-answer').value;
      const errEl = document.getElementById('signup-error');

      const result = this.signup(name, email, password, confirm, securityQuestion, securityAnswer);
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
    [document.getElementById('signup-name'), signupEmail, signupPass, signupConfirm, document.getElementById('signup-security-answer'), document.getElementById('signup-security-question')].forEach(el => {
      if (el) {
        el.addEventListener('input', () => {
          const errEl = document.getElementById('signup-error');
          errEl.style.display = 'none';
          errEl.textContent = '';
        });
      }
    });

    // --- Forgot Password Flow ---
    const forgotEmailInput = document.getElementById('forgot-email');
    const forgotStep1 = document.getElementById('forgot-step-1');
    const forgotStep2 = document.getElementById('forgot-step-2');
    const forgotStep3 = document.getElementById('forgot-step-3');
    const forgotSubtitle = document.getElementById('forgot-subtitle');
    const errElForgot = document.getElementById('forgot-error');
    const successElForgot = document.getElementById('forgot-success');

    // Step 1: Continue
    document.getElementById('forgot-btn-step-1').addEventListener('click', () => {
      const email = forgotEmailInput.value;
      errElForgot.style.display = 'none';

      const emailResult = Validators.email(email);
      if (!emailResult.valid) {
        errElForgot.textContent = emailResult.message;
        errElForgot.style.display = 'block';
        return;
      }

      const qResult = this.getSecurityQuestion(email);
      if (qResult.success) {
        document.getElementById('forgot-security-question-text').textContent = qResult.question;
        forgotStep1.style.display = 'none';
        forgotStep2.style.display = 'block';
        forgotSubtitle.textContent = 'Answer your security question to continue.';
      } else {
        errElForgot.textContent = qResult.message;
        errElForgot.style.display = 'block';
      }
    });

    // Step 2: Verify Answer
    document.getElementById('forgot-btn-step-2').addEventListener('click', () => {
      const email = forgotEmailInput.value;
      const answer = document.getElementById('forgot-security-answer').value;
      errElForgot.style.display = 'none';

      if (!answer.trim()) {
        errElForgot.textContent = 'Please enter your security answer.';
        errElForgot.style.display = 'block';
        return;
      }

      const verifyResult = this.verifySecurityAnswer(email, answer);
      if (verifyResult.success) {
        forgotStep2.style.display = 'none';
        forgotStep3.style.display = 'block';
        forgotSubtitle.textContent = 'Enter your new password.';
      } else {
        errElForgot.textContent = verifyResult.message;
        errElForgot.style.display = 'block';
      }
    });

    // Step 3: Reset Password
    document.getElementById('auth-forgot-form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (forgotStep3.style.display === 'none') return;

      const email = forgotEmailInput.value;
      const newPassword = document.getElementById('forgot-password').value;
      const confirmPassword = document.getElementById('forgot-confirm').value;

      errElForgot.style.display = 'none';
      successElForgot.style.display = 'none';

      const result = this.resetPassword(email, newPassword, confirmPassword);
      if (result.success) {
        successElForgot.textContent = 'Password has been successfully updated.';
        successElForgot.style.display = 'block';
        document.getElementById('auth-forgot-form').reset();
        
        setTimeout(() => {
          activateTab('login');
          showForm('login');
          this._clearErrors();
        }, 2000);
      } else {
        errElForgot.textContent = result.message;
        errElForgot.style.display = 'block';
      }
    });

    // Auto-clear forgot error on any input
    ['forgot-email', 'forgot-security-answer', 'forgot-password', 'forgot-confirm'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          const errEl = document.getElementById('forgot-error');
          errEl.style.display = 'none';
          errEl.textContent = '';
        });
      }
    });
  }

  // --- Password Rules UI ---

  _updatePasswordRules(password, listId = 'password-rules-list') {
    const result = Validators.password(password);
    const listItems = document.querySelectorAll(`#${listId} li`);

    result.rules.forEach(rule => {
      const li = document.querySelector(`#${listId} li[data-rule="${rule.id}"]`);
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
    document.querySelectorAll('#password-rules-list li, #forgot-password-rules-list li').forEach(li => {
      li.classList.remove('is-passed', 'is-failed');
      const icon = li.querySelector('.password-tooltip__icon');
      if (icon) icon.textContent = '○';
    });

    // Reset forgot password tooltip and hints
    const forgotTooltip = document.getElementById('forgot-password-tooltip');
    if (forgotTooltip) forgotTooltip.classList.remove('is-visible');

    const forgotConfirmHint = document.getElementById('forgot-confirm-hint');
    if (forgotConfirmHint) { forgotConfirmHint.textContent = ''; forgotConfirmHint.className = 'form-hint'; }

    // Reset confirm hint
    const confirmHint = document.getElementById('signup-confirm-hint');
    if (confirmHint) { confirmHint.textContent = ''; confirmHint.className = 'form-hint'; }

    // Reset email hint
    const emailHint = document.getElementById('signup-email-hint');
    if (emailHint) { emailHint.textContent = ''; emailHint.className = 'form-hint'; }

    // Reset forgot password step view
    const forgotStep1 = document.getElementById('forgot-step-1');
    const forgotStep2 = document.getElementById('forgot-step-2');
    const forgotStep3 = document.getElementById('forgot-step-3');
    const forgotSubtitle = document.getElementById('forgot-subtitle');
    if (forgotStep1) forgotStep1.style.display = 'block';
    if (forgotStep2) forgotStep2.style.display = 'none';
    if (forgotStep3) forgotStep3.style.display = 'none';
    if (forgotSubtitle) forgotSubtitle.textContent = 'Enter your registered email address to begin.';

    // Re-enable forgot submit
    const forgotSubmit = document.getElementById('forgot-btn-step-3');
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
