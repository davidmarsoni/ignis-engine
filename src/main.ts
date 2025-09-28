import AuthService, { type User } from "./auth";


class App {
  private authService = new AuthService();
  private loginButton: HTMLButtonElement | null = null;
  private logoutButton: HTMLButtonElement | null = null;
  private userInfo: HTMLElement | null = null;
  private loginSection: HTMLElement | null = null;
  private userSection: HTMLElement | null = null;

  constructor() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  private setup(): void {
    this.loginButton = document.getElementById('login-btn') as HTMLButtonElement | null;
    this.logoutButton = document.getElementById('logout-btn') as HTMLButtonElement | null;
    this.userInfo = document.getElementById('user-info');
    this.loginSection = document.getElementById('login-section');
    this.userSection = document.getElementById('user-section');

    this.loginButton?.addEventListener('click', () => this.handleLogin());
    this.logoutButton?.addEventListener('click', () => this.handleLogout());

    this.authService.onAuthStateChanged((user) => this.render(user));
    this.render(this.authService.getCurrentUser());
  }

  private render(user: User | null): void {
    const isSignedIn = Boolean(user);

    if (this.loginSection) this.loginSection.hidden = isSignedIn;
    if (this.userSection) this.userSection.hidden = !isSignedIn;
    if (this.logoutButton) this.logoutButton.hidden = !isSignedIn;

    if (user) {
      this.updateUserInfo(user);
    } else if (this.userInfo) {
      this.userInfo.textContent = '';
    }
  }

  private updateUserInfo(user: User): void {
    if (!this.userInfo) return;

    const name = user.displayName ?? 'Anonymous user';
    const email = user.email ?? '';

    this.userInfo.innerHTML = `
      <div>
        <div>${name}</div>
        <div>${email}</div>
      </div>
    `;
  }

  private async handleLogin(): Promise<void> {
    if (this.loginButton) this.loginButton.disabled = true;
    try {
      await this.authService.signInWithGoogle();
      window.location.href = 'index.html';
    } finally {
      if (this.loginButton) this.loginButton.disabled = false;
    }
  }

  private async handleLogout(): Promise<void> {
    if (this.logoutButton) this.logoutButton.disabled = true;
    try {
      await this.authService.signOutUser();
    } finally {
      if (this.logoutButton) this.logoutButton.disabled = false;
    }
  }
}

new App();