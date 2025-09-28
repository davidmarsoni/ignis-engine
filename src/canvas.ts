import AuthService from './auth.js';
import type { User } from './auth.js';
import { startGame } from './game.js';

class CanvasApp {
  private authService = new AuthService();
  private signInButton: HTMLButtonElement | null = null;
  private signOutButton: HTMLButtonElement | null = null;
  private loadingState: HTMLElement | null = null;
  private userState: HTMLElement | null = null;
  private authRequiredState: HTMLElement | null = null;
  private userAvatarContainer: HTMLElement | null = null;
  private userName: HTMLElement | null = null;
  private userEmail: HTMLElement | null = null;
  private canvasArea: HTMLElement | null = null;
  private canvasLocked: HTMLElement | null = null;
  private canvasElement: HTMLCanvasElement | null = null;
  private hasReceivedAuthState = false;

  constructor() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  private setup(): void {
    this.signInButton = document.getElementById('sign-in-btn') as HTMLButtonElement | null;
    this.signOutButton = document.getElementById('logout-btn') as HTMLButtonElement | null;
    this.loadingState = document.getElementById('loading-state');
    this.userState = document.getElementById('user-state');
    this.authRequiredState = document.getElementById('auth-required-state');
    this.userAvatarContainer = document.getElementById('user-avatar-container');
    this.userName = document.getElementById('user-name');
    this.userEmail = document.getElementById('user-email');
  this.canvasArea = document.getElementById('canvas-area');
  this.canvasLocked = document.getElementById('canvas-locked');
  this.canvasElement = document.getElementById('canvas') as HTMLCanvasElement | null;

    this.signInButton?.addEventListener('click', () => this.handleSignIn());
    this.signOutButton?.addEventListener('click', () => this.handleSignOut());

    this.authService.onAuthStateChanged((user) => {
      this.hasReceivedAuthState = true;
      this.render(user);
    });

    this.render(this.authService.getCurrentUser());
    startGame();
  }

  private render(user: User | null): void {
    const showLoading = !this.hasReceivedAuthState;
    const isSignedIn = Boolean(user);

    this.toggleElement(this.loadingState, !showLoading);
    this.toggleElement(this.userState, !(isSignedIn && !showLoading));
    this.toggleElement(this.authRequiredState, !(!isSignedIn && !showLoading));
  this.toggleElement(this.canvasArea, !(isSignedIn && !showLoading));
  this.toggleElement(this.canvasLocked, !(!isSignedIn && !showLoading));

    if (this.signInButton) this.signInButton.hidden = isSignedIn;
    if (this.signOutButton) this.signOutButton.hidden = !isSignedIn;

    if (user && !showLoading) {
      this.updateUserCard(user);
    } else {
      this.clearUserCard();
    }
  }

  private toggleElement(element: HTMLElement | null, hidden: boolean): void {
    if (!element) return;
    if (hidden) {
      element.classList.add('hidden');
    } else {
      element.classList.remove('hidden');
    }
  }

  private updateUserCard(user: User): void {
    if (this.userName) this.userName.textContent = user.displayName ?? 'Anonymous user';
    if (this.userEmail) this.userEmail.textContent = user.email ?? '';

    if (!this.userAvatarContainer) return;

    const initial = this.getInitial(user);
    const photoURL = user.photoURL;
    this.userAvatarContainer.textContent = '';

    const fallback = document.createElement('div');
    fallback.className = 'w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center text-sm font-medium';
    fallback.textContent = initial;

    if (photoURL) {
      const image = document.createElement('img');
      image.src = photoURL;
      image.alt = 'Profile';
      image.className = 'w-8 h-8 rounded-full object-cover border border-gray-300';
      image.referrerPolicy = 'no-referrer';
      image.loading = 'lazy';
      image.addEventListener('error', () => {
        image.style.display = 'none';
        fallback.style.display = 'flex';
      });
      image.addEventListener('load', () => {
        fallback.style.display = 'none';
      });

      this.userAvatarContainer.append(image, fallback);
    } else {
      this.userAvatarContainer.append(fallback);
    }
  }

  private clearUserCard(): void {
    if (this.userName) this.userName.textContent = '';
    if (this.userEmail) this.userEmail.textContent = '';
    if (this.userAvatarContainer) this.userAvatarContainer.innerHTML = '';
  }

  private getInitial(user: User): string {
    return user.displayName?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? 'U';
  }

  private async handleSignIn(): Promise<void> {
    if (this.signInButton) this.signInButton.disabled = true;
    try {
      await this.authService.signInWithGoogle();
    } finally {
      if (this.signInButton) this.signInButton.disabled = false;
    }
  }

  private async handleSignOut(): Promise<void> {
    if (this.signOutButton) this.signOutButton.disabled = true;
    try {
      await this.authService.signOutUser();
    } finally {
      if (this.signOutButton) this.signOutButton.disabled = false;
    }
  }
}

new CanvasApp();