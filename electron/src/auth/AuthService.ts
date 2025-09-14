import Store from 'electron-store';

interface AuthData {
  twitch_oauth_token: string;
  twitch_oauth_expires: number;
}

export class AuthService {
  private store: Store<AuthData>;
  private tokenKey: keyof AuthData = 'twitch_oauth_token';
  private expiresKey: keyof AuthData = 'twitch_oauth_expires';

  constructor(encryptionKey: string) {
    try {
      this.store = new Store<AuthData>({
        name: 'auth-store',
        encryptionKey: encryptionKey || 'a_really_strong_password',
      });
    } catch (error) {
      console.error('Auth store corrupted. Resetting...', error);
      this.store = new Store<AuthData>({
        name: 'auth-store',
        encryptionKey: encryptionKey || 'a_really_strong_password',
        clearInvalidConfig: true,
      });
    }
    console.log('Auth store ready.');
  }

  saveAuthToken(token: string, expiresAt: number) {
    this.store.set(this.tokenKey, token);
    this.store.set(this.expiresKey, expiresAt);
  }

  verifyAuth(): boolean {
    const token = this.store.get(this.tokenKey);
    const expiresAt = this.store.get(this.expiresKey);
    if (!token || !expiresAt) return false;
    return Date.now() < Number(expiresAt);
  }

  getAuthToken(): string | null {
    if (this.verifyAuth()) {
      return String(this.store.get(this.tokenKey)) || null;
    }
    return null;
  }

  clearAuthToken() {
    this.store.delete(this.tokenKey);
    this.store.delete(this.expiresKey);
  }
}
