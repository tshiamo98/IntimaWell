// auth-ui.js
class AuthUI {
  constructor() {
    this.initEventListeners();
    this.checkAuthState();
  }

  initEventListeners() {
    // Login button
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('login-btn')) {
        this.showAuthModal('login');
      }
    });

    // Auth modal close
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('auth-modal-close') || 
          e.target.closest('.auth-modal-close')) {
        this.hideAuthModal();
      }
    });

    // Switch between login/signup tabs
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('auth-tab')) {
        const tab = e.target.dataset.tab;
        this.switchAuthTab(tab);
      }
    });

    // Login form submission
    document.getElementById('login-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    // Signup form submission
    document.getElementById('signup-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSignUp();
    });

    // Forgot password
    document.getElementById('forgot-password')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showForgotPassword();
    });

    // Social login
    document.querySelectorAll('.social-auth-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const provider = e.target.closest('.social-auth-btn').dataset.provider;
        this.handleSocialLogin(provider);
      });
    });

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleLogout();
    });

    // Close auth modal on background click
    document.getElementById('auth-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'auth-modal') {
        this.hideAuthModal();
      }
    });
  }

  showAuthModal(tab = 'login') {
    const modal = document.getElementById('auth-modal');
    modal.classList.add('active');
    this.switchAuthTab(tab);
  }

  hideAuthModal() {
    const modal = document.getElementById('auth-modal');
    modal.classList.remove('active');
    this.clearForms();
  }

  switchAuthTab(tab) {
    // Update active tab
    document.querySelectorAll('.auth-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tab);
    });

    // Show active form
    document.querySelectorAll('.auth-form').forEach(form => {
      form.classList.toggle('active', form.id === `${tab}-form`);
    });
  }

  async handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Show loading state
    const submitBtn = document.querySelector('#login-form .auth-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;

    // Clear previous errors
    this.clearErrors();

    const result = await authSystem.signIn(email, password);
    
    if (result.success) {
      if (result.requiresVerification) {
        this.showMessage('auth-error', result.message, 'warning');
      } else {
        this.showMessage('auth-success', 'Login successful!', 'success');
        setTimeout(() => {
          this.hideAuthModal();
          window.location.reload();
        }, 1500);
      }
    } else {
      this.showMessage('auth-error', result.error, 'error');
    }

    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }

  async handleSignUp() {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const displayName = document.getElementById('signup-name').value;
    const agreeTerms = document.getElementById('agree-terms').checked;

    // Validation
    if (!agreeTerms) {
      this.showMessage('auth-error', 'You must agree to the terms and conditions', 'error');
      return;
    }

    if (password !== confirmPassword) {
      this.showMessage('auth-error', 'Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      this.showMessage('auth-error', 'Password must be at least 6 characters', 'error');
      return;
    }

    // Show loading state
    const submitBtn = document.querySelector('#signup-form .auth-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;

    // Clear previous errors
    this.clearErrors();

    const userData = {
      displayName: displayName,
      createdAt: new Date().toISOString()
    };

    const result = await authSystem.signUp(email, password, userData);
    
    if (result.success) {
      this.showMessage('auth-success', 
        'Account created! Please check your email to verify your account.', 
        'success'
      );
      setTimeout(() => {
        this.switchAuthTab('login');
      }, 3000);
    } else {
      this.showMessage('auth-error', result.error, 'error');
    }

    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }

  async handleSocialLogin(provider) {
    let result;
    
    if (provider === 'google') {
      result = await authSystem.signInWithGoogle();
    } else if (provider === 'facebook') {
      result = await authSystem.signInWithFacebook();
    }

    if (result?.success) {
      this.showMessage('auth-success', 'Login successful!', 'success');
      setTimeout(() => {
        this.hideAuthModal();
        window.location.reload();
      }, 1500);
    } else if (result) {
      this.showMessage('auth-error', result.error, 'error');
    }
  }

  async handleLogout() {
    const result = await authSystem.signOut();
    if (result.success) {
      window.location.reload();
    }
  }

  async showForgotPassword() {
    const email = prompt('Please enter your email address to reset your password:');
    if (email) {
      const result = await authSystem.resetPassword(email);
      if (result.success) {
        alert('Password reset email sent! Please check your inbox.');
      } else {
        alert('Error: ' + result.error);
      }
    }
  }

  showMessage(elementId, message, type = 'info') {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = message;
      element.className = `auth-${type} show`;
      setTimeout(() => {
        element.classList.remove('show');
      }, 5000);
    }
  }

  clearErrors() {
    document.querySelectorAll('.auth-error, .auth-success').forEach(el => {
      el.classList.remove('show');
      el.textContent = '';
    });
  }

  clearForms() {
    // Clear all form inputs
    document.querySelectorAll('.auth-form input').forEach(input => {
      input.value = '';
    });
    this.clearErrors();
  }

  checkAuthState() {
    // Check if user is already logged in
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        console.log('User is logged in:', user.email);
      }
    });
  }
}

// Initialize Auth UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AuthUI();
});