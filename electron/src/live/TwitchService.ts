import crypto from 'crypto';
import { HttpHandler } from '../api/HttpHandler';

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string[];
  token_type: string;
}

export class TwitchService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private scopes: string[];
  private codeVerifier: string = '';
  private accessToken: string = '';
  private expiresAt: number = 0;

  constructor(clientId: string, clientSecret: string, redirectUri: string, scopes: string[]) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.scopes = scopes;
  }

  private async generatePKCE(): Promise<{ codeVerifier: string; codeChallenge: string }> {
    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    const hash = crypto.createHash('sha256').update(codeVerifier).digest();
    const codeChallenge = hash.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return { codeVerifier, codeChallenge };
  }

  async getAuthUrl(): Promise<string> {
    const { codeVerifier, codeChallenge } = await this.generatePKCE();
    this.codeVerifier = codeVerifier;

    return `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${this.clientId}&redirect_uri=${encodeURIComponent(
      this.redirectUri
    )}&scope=${encodeURIComponent(this.scopes.join(' '))}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  }

  /** Troca o code por um Access Token */
  async exchangeCodeForToken(code: string): Promise<void> {
    try {
      const response = await HttpHandler.post<TokenResponse>(
        'https://id.twitch.tv/oauth2/token',
        new URLSearchParams({
          client_id: this.clientId,
          grant_type: 'authorization_code',
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
          code,
          code_verifier: this.codeVerifier,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      this.accessToken = response.data.access_token;
      this.expiresAt = Date.now() + response.data.expires_in * 1000;
    } catch (err) {
      console.error('Error by try to change code for token:', err);
      throw err;
    }
  }

  getToken(): string | null {
    if (this.accessToken && Date.now() < this.expiresAt) {
      return this.accessToken;
    }
    return null;
  }

  getTokenInfo(): { accessToken: string; expiresAt: number } | null {
    if (this.accessToken && Date.now() < this.expiresAt) {
      return { accessToken: this.accessToken, expiresAt: this.expiresAt };
    }
    return null;
  }

  async getUserInfo() {
    if (!this.getToken()) throw new Error('User not autenticated!');

    const response = await HttpHandler.get('https://api.twitch.tv/helix/users', {
      headers: {
        'Client-ID': this.clientId,
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    return response.data;
  }
}
