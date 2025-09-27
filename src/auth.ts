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
  private authStateListeners: ((user: User | null) => void)[] = [];
  private initialized: boolean = false;

  constructor() {
    this.initializeFirebase();
  }

  private async initializeFirebase(): Promise<void> {
    try {
      // Import Firebase services from CDN
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js' as any);
      const { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } = 
        await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js' as any);

      // Initialize Firebase
      this.app = initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
      this.provider = new GoogleAuthProvider();

      // Set up auth state listener
      onAuthStateChanged(this.auth, (firebaseUser: any) => {
        this.currentUser = firebaseUser ? {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL
        } : null;
        
        this.notifyAuthStateListeners(this.currentUser);
      });

      this.initialized = true;
      console.log('Firebase initialized successfully');

    } catch (error) {
      console.error('Error initializing Firebase:', error);
      throw new Error(`Firebase initialization failed: ${error}`);
    }
  }

  // Wait for Firebase to be initialized
  public async waitForInitialization(): Promise<void> {
    while (!this.initialized) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Sign in with Google
  public async signInWithGoogle(): Promise<User | null> {
    await this.waitForInitialization();
    
    try {
      const { signInWithPopup } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js' as any);
      const result = await signInWithPopup(this.auth, this.provider);
      return {
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL
      };
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  // Sign out
  public async signOutUser(): Promise<void> {
    await this.waitForInitialization();
    
    try {
      const { signOut } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js' as any);
      await signOut(this.auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Get current user
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Add auth state listener
  public onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.authStateListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  // Check if user is signed in
  public isSignedIn(): boolean {
    return this.currentUser !== null;
  }

  private notifyAuthStateListeners(user: User | null): void {
    this.authStateListeners.forEach(listener => listener(user));
  }
}

export default AuthService;