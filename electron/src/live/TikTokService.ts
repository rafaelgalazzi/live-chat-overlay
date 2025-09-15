import { TikTokLiveConnection, WebcastEvent } from 'tiktok-live-connector';

export class TikTokService {
  private tiktokLiveConnection: TikTokLiveConnection | null = null;

  constructor() {}

  startService(username: string) {
    this.tiktokLiveConnection = new TikTokLiveConnection(username);
    return this.tiktokLiveConnection;
  }

  getWebcastEnum() {
    return WebcastEvent;
  }

  stopService() {
    if (!this.tiktokLiveConnection) return;
    this.tiktokLiveConnection.disconnect();
    this.tiktokLiveConnection = null;
  }
}
