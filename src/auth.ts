export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJreCHVAfYD5seNkZCQqLfR_sIa3SKpDI",
  authDomain: "ignis-engine.firebaseapp.com",
  databaseURL: "https://ignis-engine-default-rtdb.firebaseio.com",
  projectId: "ignis-engine",
  storageBucket: "ignis-engine.firebasestorage.app",
  messagingSenderId: "94159870107",
  appId: "1:94159870107:web:ee79ed9ac1cf1112c38e3e",
  measurementId: "G-77K1LN21R1"
};

export class AuthService {
  private app: any = null;
  private auth: any = null;
  private provider: any = null;
  private currentUser: User | null = null;
  private listeners: Array<(user: User | null) => void> = [];
  private readonly initialization: Promise<void>;

  constructor() {
    this.initialization = this.initializeFirebase();
  }

  private async initializeFirebase(): Promise<void> {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js' as any);
    const { getAuth, GoogleAuthProvider, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js' as any);

    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    this.provider = new GoogleAuthProvider();

    onAuthStateChanged(this.auth, (firebaseUser: any) => {
      this.currentUser = firebaseUser ? this.mapUser(firebaseUser) : null;
      this.listeners.forEach((listener) => listener(this.currentUser));
    });
  }

  private mapUser(firebaseUser: any): User {
    return {
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL
    };
  }

  private async ensureReady(): Promise<void> {
    return this.initialization;
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentUser);

    return () => {
      const index = this.listeners.indexOf(callback);
      if (index >= 0) {
        this.listeners.splice(index, 1);
      }
    };
  }

  public async signInWithGoogle(): Promise<User | null> {
    await this.ensureReady();
    const { signInWithPopup } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js' as any);
    const result = await signInWithPopup(this.auth, this.provider);
    return this.mapUser(result.user);
  }

  public async signOutUser(): Promise<void> {
    await this.ensureReady();
    const { signOut } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js' as any);
    await signOut(this.auth);
  }

  public isSignedIn(): boolean {
    return this.currentUser !== null;
  }
}

export default AuthService;