import crypto from 'crypto';
import { HttpHandler } from '../api/HttpHandler';
import tmi, { type Client } from 'tmi.js';
import { AuthService } from '../auth/AuthService';

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
  private appName: string;
  private redirectUri: string;
  private scopes: string[];
  private codeVerifier: string = '';
  private tmiClient: Client | null = null;
  private authService: AuthService;

  constructor(
    clientId: string,
    clientSecret: string,
    appName: string,
    authService: AuthService,
    redirectUri: string,
    scopes: string[]
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.appName = appName;
    this.authService = authService;
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

      this.authService.saveAuthToken(response.data.access_token, Date.now() + response.data.expires_in * 1000);
    } catch (err) {
      console.error('Error by try to change code for token:', err);
      throw err;
    }
  }

  async getUserInfo() {
    if (!this.authService.getAuthToken()) throw new Error('User not authenticated !');

    const response = await HttpHandler.get('https://api.twitch.tv/helix/users', {
      headers: {
        'Client-ID': this.clientId,
        Authorization: `Bearer ${this.authService.getAuthToken()}`,
      },
    });

    return response.data;
  }

  startTmiClient(username: string): Client | null {
    if (!this.appName || !this.authService.getAuthToken()) {
      console.log('Erro by starting the chat!');
      return null;
    }

    this.tmiClient = new tmi.Client({
      options: { debug: true },
      identity: {
        username: this.appName,
        password: `oauth:${this.authService.getAuthToken()}`,
      },
      channels: [username],
    });
    return this.tmiClient;
  }

  stopTmiClient() {
    if (!this.tmiClient) {
      console.log('No tmi client running!');
      return;
    }
    this.tmiClient.disconnect();
    this.tmiClient = null;
  }

  async getBroadcasterId(channelName: string): Promise<string | null> {
    const headers = {
      'Client-Id': this.clientId,
      Authorization: `Bearer ${this.authService.getAuthToken()}`,
    };

    try {
      const { data } = await HttpHandler.get<{ data: { id: string; login: string }[] }>(
        `https://api.twitch.tv/helix/users?login=${channelName}`,
        { headers }
      );

      // Se existir usuário, retorna o primeiro ID
      return data.data?.[0]?.id || null;
    } catch (err) {
      console.error('[getBroadcasterId] Erro ao buscar usuário:', err);
      return null;
    }
  }
}
