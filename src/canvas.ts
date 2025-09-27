import AuthService, { User } from './auth.js';

class CanvasApp {
  private authService: AuthService;
  private loadingState: HTMLElement | null = null;
  private userState: HTMLElement | null = null;
  private authRequiredState: HTMLElement | null = null;
  private userAvatarContainer: HTMLElement | null = null;
  private userName: HTMLElement | null = null;
  private userEmail: HTMLElement | null = null;
  private logoutButton: HTMLElement | null = null;
  private signInButton: HTMLElement | null = null;

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
      // Get UI elements
      this.loadingState = document.getElementById('loading-state');
      this.userState = document.getElementById('user-state');
      this.authRequiredState = document.getElementById('auth-required-state');
      this.userAvatarContainer = document.getElementById('user-avatar-container');
      this.userName = document.getElementById('user-name');
      this.userEmail = document.getElementById('user-email');
      this.logoutButton = document.getElementById('logout-btn');
      this.signInButton = document.getElementById('sign-in-btn');

      // Set up event listeners
      if (this.logoutButton) {
        this.logoutButton.addEventListener('click', () => this.handleLogout());
      }

      if (this.signInButton) {
        this.signInButton.addEventListener('click', () => this.handleSignIn());
      }

      // Wait for Firebase to initialize
      await this.authService.waitForInitialization();

      // Listen for auth state changes
      this.authService.onAuthStateChanged((user) => {
        this.updateUI(user);
      });

      // Initial UI update
      this.updateUI(this.authService.getCurrentUser());

    } catch (error) {
      console.error('Error setting up canvas UI:', error);
      this.showError('Failed to initialize authentication');
    }
  }

  private updateUI(user: User | null): void {
    console.log('Updating canvas UI for user:', user);
    
    // Hide loading state
    if (this.loadingState) {
      this.loadingState.style.display = 'none';
    }
    
    if (user) {
      // User is signed in - show user state
      this.showUserState(user);
    } else {
      // User is not signed in - show auth required state
      this.showAuthRequiredState();
    }
  }

  private showUserState(user: User): void {
    if (this.userState) {
      this.userState.style.display = 'block';
    }
    if (this.authRequiredState) {
      this.authRequiredState.style.display = 'none';
    }

    this.updateUserInfo(user);
  }

  private showAuthRequiredState(): void {
    if (this.userState) {
      this.userState.style.display = 'none';
    }
    if (this.authRequiredState) {
      this.authRequiredState.style.display = 'block';
    }
  }

  private updateUserInfo(user: User): void {
    // Update user avatar
    if (this.userAvatarContainer) {
      if (user.photoURL) {
        this.userAvatarContainer.innerHTML = `
          <img src="${user.photoURL}" 
               alt="Profile" 
               class="w-8 h-8 rounded-full object-cover border border-gray-300"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center text-sm font-medium" style="display: none;">
            ${this.getUserInitial(user)}
          </div>
        `;
      } else {
        this.userAvatarContainer.innerHTML = `
          <div class="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center text-sm font-medium">
            ${this.getUserInitial(user)}
          </div>
        `;
      }
    }

    // Update user name
    if (this.userName) {
      this.userName.textContent = user.displayName || 'Unknown User';
    }

    // Update user email
    if (this.userEmail) {
      this.userEmail.textContent = user.email || '';
    }
  }

  private getUserInitial(user: User): string {
    return user.displayName?.charAt(0)?.toUpperCase() || 
           user.email?.charAt(0)?.toUpperCase() || 
           'U';
  }

  private async handleSignIn(): Promise<void> {
    try {
      if (this.signInButton) {
        this.signInButton.textContent = 'Signing in...';
        (this.signInButton as HTMLButtonElement).disabled = true;
      }
      
      await this.authService.signInWithGoogle();
      console.log('User signed in successfully from canvas');
      
    } catch (error) {
      console.error('Sign-in failed:', error);
      alert(`Sign-in failed: ${error}`);
      
      // Restore button state on error
      if (this.signInButton) {
        this.signInButton.textContent = 'Sign in with Google';
        (this.signInButton as HTMLButtonElement).disabled = false;
      }
    }
  }

  private async handleLogout(): Promise<void> {
    try {
      if (this.logoutButton) {
        this.logoutButton.textContent = 'Signing out...';
        (this.logoutButton as HTMLButtonElement).disabled = true;
      }
      
      await this.authService.signOutUser();
      console.log('User signed out successfully from canvas');
      
      // No redirect needed since we're already on the canvas page
      
    } catch (error) {
      console.error('Logout failed:', error);
      alert(`Logout failed: ${error}`);
      
      // Restore button state on error
      if (this.logoutButton) {
        this.logoutButton.textContent = 'Log out';
        (this.logoutButton as HTMLButtonElement).disabled = false;
      }
    }
  }

  private showError(message: string): void {
    // Show error in the account zone
    const accountZone = document.getElementById('account-zone');
    if (accountZone) {
      accountZone.innerHTML = `
        <div class="text-center text-red-600 text-sm">
          <div class="mb-2">⚠️ Error</div>
          <div>${message}</div>
          <button onclick="location.reload()" class="mt-2 text-blue-600 hover:text-blue-700 underline text-xs">
            Retry
          </button>
        </div>
      `;
    }
  }
}

// Initialize the canvas app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CanvasApp();
});