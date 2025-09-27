import AuthService, { User } from './auth.js';

class App {
  private authService: AuthService;
  private loginButton: HTMLElement | null = null;
  private logoutButton: HTMLElement | null = null;
  private userInfo: HTMLElement | null = null;
  private loginSection: HTMLElement | null = null;
  private userSection: HTMLElement | null = null;

  constructor() {
    this.authService = new AuthService();
    this.init();
  }

  private init(): void {
    // Wait for DOM to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupUI());
    } else {
      this.setupUI();
    }
  }

  private async setupUI(): Promise<void> {
    try {
      // Wait for Firebase to initialize
      await this.authService.waitForInitialization();

      // Get UI elements
      this.loginButton = document.getElementById('login-btn');
      this.logoutButton = document.getElementById('logout-btn');
      this.userInfo = document.getElementById('user-info');
      this.loginSection = document.getElementById('login-section');
      this.userSection = document.getElementById('user-section');

      // Set up event listeners
      if (this.loginButton) {
        this.loginButton.addEventListener('click', () => this.handleLogin());
      }

      if (this.logoutButton) {
        this.logoutButton.addEventListener('click', () => this.handleLogout());
      }

      // Listen for auth state changes
      this.authService.onAuthStateChanged((user) => {
        this.updateUI(user);
      });

      // Initial UI update
      this.updateUI(this.authService.getCurrentUser());

    } catch (error) {
      console.error('Error setting up UI:', error);
      this.showError(`Failed to initialize application: ${error}`);
    }
  }

  private async handleLogin(): Promise<void> {
    try {
      if (this.loginButton) {
        this.loginButton.textContent = 'Signing in...';
        (this.loginButton as HTMLButtonElement).disabled = true;
      }
      
      await this.authService.signInWithGoogle();
      console.log('User signed in successfully');
      
      // Redirect to canvas page after successful login
      window.location.href = 'index.html';
      
    } catch (error) {
      console.error('Login failed:', error);
      alert(`Login failed: ${error}`);
    } finally {
      if (this.loginButton) {
        this.loginButton.textContent = 'Sign in with Google';
        (this.loginButton as HTMLButtonElement).disabled = false;
      }
    }
  }

  private async handleLogout(): Promise<void> {
    try {
      if (this.logoutButton) {
        (this.logoutButton as HTMLButtonElement).disabled = true;
      }
      
      await this.authService.signOutUser();
      console.log('User signed out successfully');
      
    } catch (error) {
      console.error('Logout failed:', error);
      alert(`Logout failed: ${error}`);
    } finally {
      if (this.logoutButton) {
        (this.logoutButton as HTMLButtonElement).disabled = false;
      }
    }
  }

  private updateUI(user: User | null): void {
    console.log('Updating UI for user:', user);
    
    if (user) {
      // User is signed in
      this.showUserSection();
      this.updateUserInfo(user);
    } else {
      // User is signed out
      this.showLoginSection();
    }
  }

  private showLoginSection(): void {
    if (this.loginSection) this.loginSection.style.display = 'block';
    if (this.userSection) this.userSection.style.display = 'none';
  }

  private showUserSection(): void {
    if (this.loginSection) this.loginSection.style.display = 'none';
    if (this.userSection) this.userSection.style.display = 'block';
  }

  private updateUserInfo(user: User): void {
    if (this.userInfo) {
      // Log user info for debugging
      console.log('User info:', {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      });

      // Get user initial for fallback only if no photo
      const userInitial = user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U';

      this.userInfo.innerHTML = `
        <div class="user-profile">
          ${user.photoURL ? `
            <img src="${user.photoURL}" 
                 alt="Profile" 
                 class="profile-image">
          ` : `
            <div class="profile-fallback" style="display: flex; width: 80px; height: 80px; border-radius: 50%; background: #667eea; color: white; align-items: center; justify-content: center; font-weight: bold; font-size: 32px; border: 3px solid #667eea;">${userInitial}</div>
          `}
          <div class="user-details">
            <h3>${user.displayName || 'Unknown User'}</h3>
            <p>${user.email || ''}</p>
          </div>
        </div>
      `;
    }
  }

  private showError(message: string): void {
    document.body.innerHTML = `
      <div class="container">
        <div class="logo">🔥 Ignis Engine</div>
        <div class="subtitle">Powered by Firebase</div>
        <div style="color: red; padding: 20px; text-align: center;">
          <h2>Error Loading Application</h2>
          <p>${message}</p>
          <button onclick="location.reload()" style="
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 16px;
          ">Retry</button>
        </div>
      </div>
    `;
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});