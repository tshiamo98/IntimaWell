// auth.js
class AuthSystem {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    // Listen for auth state changes
    auth.onAuthStateChanged((user) => {
      this.currentUser = user;
      this.updateUI();
      this.saveUserToFirestore(user);
    });
  }

  // Sign up new user
  async signUp(email, password, userData) {
    try {
      // Create user with email and password
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Save additional user data to Firestore
      await this.saveUserData(user.uid, {
        email: user.email,
        displayName: userData.displayName || '',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        themePreference: 'luxurious',
        ageVerified: false,
        ...userData
      });

      // Send email verification
      await user.sendEmailVerification();
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Sign in existing user
  async signIn(email, password) {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Check if email is verified
      if (!user.emailVerified) {
        await user.sendEmailVerification();
        return { 
          success: true, 
          user, 
          requiresVerification: true,
          message: 'Please verify your email address. A new verification link has been sent.'
        };
      }
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Sign out
  async signOut() {
    try {
      await auth.signOut();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      await auth.sendPasswordResetEmail(email);
      return { success: true, message: 'Password reset email sent!' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Save/update user data in Firestore
  async saveUserData(uid, userData) {
    try {
      await db.collection('users').doc(uid).set(userData, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error saving user data:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user data from Firestore
  async getUserData(uid) {
    try {
      const doc = await db.collection('users').doc(uid).get();
      if (doc.exists) {
        return { success: true, data: doc.data() };
      } else {
        return { success: false, error: 'User data not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update user profile
  async updateProfile(updates) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');
      
      // Update Firebase Auth profile if displayName is provided
      if (updates.displayName) {
        await user.updateProfile({
          displayName: updates.displayName
        });
      }
      
      // Update Firestore
      await this.saveUserData(user.uid, updates);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update UI based on auth state
  updateUI() {
    const authUI = document.getElementById('auth-ui');
    const userMenu = document.getElementById('user-menu');
    const loginBtn = document.querySelector('.login-btn');
    const userAvatar = document.querySelector('.user-avatar');
    
    if (this.currentUser) {
      // User is logged in
      if (loginBtn) loginBtn.style.display = 'none';
      if (userMenu) userMenu.style.display = 'block';
      if (userAvatar) {
        userAvatar.textContent = this.currentUser.displayName 
          ? this.currentUser.displayName.charAt(0).toUpperCase()
          : this.currentUser.email.charAt(0).toUpperCase();
      }
    } else {
      // User is logged out
      if (loginBtn) loginBtn.style.display = 'block';
      if (userMenu) userMenu.style.display = 'none';
    }
  }

  // Save user to Firestore after login/signup
  async saveUserToFirestore(user) {
    if (!user) return;
    
    const userData = {
      email: user.email,
      displayName: user.displayName || '',
      lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
      photoURL: user.photoURL || '',
      emailVerified: user.emailVerified
    };
    
    await this.saveUserData(user.uid, userData);
  }

  // Social login (Google)
  async signInWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const userCredential = await auth.signInWithPopup(provider);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Social login (Facebook)
  async signInWithFacebook() {
    try {
      const provider = new firebase.auth.FacebookAuthProvider();
      const userCredential = await auth.signInWithPopup(provider);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Initialize Auth System
const authSystem = new AuthSystem();