// Type definitions for dynamic Firebase imports
declare module 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js' {
  export function initializeApp(config: any): any;
}

declare module 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js' {
  export function getAuth(app: any): any;
  export class GoogleAuthProvider {
    constructor();
  }
  export function signInWithPopup(auth: any, provider: any): Promise<any>;
  export function signOut(auth: any): Promise<void>;
  export function onAuthStateChanged(auth: any, callback: (user: any) => void): () => void;
}

// Global Firebase types
declare global {
  interface Window {
    firebase?: any;
  }
}

export {};