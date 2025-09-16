import { TikTokLiveConnection } from 'tiktok-live-connector';

export class TikTokService {
  private tiktokLiveConnection: TikTokLiveConnection | null = null;

  constructor() {}

  startClient(username: string) {
    this.tiktokLiveConnection = new TikTokLiveConnection(username);
    return this.tiktokLiveConnection;
  }

  stopClient() {
    if (!this.tiktokLiveConnection) return;
    this.tiktokLiveConnection.disconnect();
    this.tiktokLiveConnection = null;
  }
}
