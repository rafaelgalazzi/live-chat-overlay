import { HttpHandler } from '../api/HttpHandler';
import { AuthService } from '../auth/AuthService';
import { BadgeMap, BadgeSet, BadgesResponse, EmoteMap, EmotesResponse } from '../types/TwitchTypes';

export class TwitchEmoteService {
  private clientId: string;
  private authService: AuthService;

  constructor(clientId: string, authService: AuthService) {
    this.clientId = clientId;
    this.authService = authService;
  }

  private async fetchTwitchEmotes(broadcasterId: string): Promise<EmoteMap> {
    const headers = {
      'Client-Id': this.clientId,
      Authorization: `Bearer ${this.authService.getAuthToken()}`,
    };

    const urls = [
      'https://api.twitch.tv/helix/chat/emotes/global',
      broadcasterId ? `https://api.twitch.tv/helix/chat/emotes?broadcaster_id=${broadcasterId}` : null,
    ].filter(Boolean) as string[];

    const out: EmoteMap = {};
    for (const url of urls) {
      try {
        const { data } = await HttpHandler.get<EmotesResponse>(url, { headers });
        for (const e of data.data ?? []) {
          out[e.name] = e.images.url_1x || e.images.url_2x || e.images.url_4x || '';
        }
      } catch (e) {
        console.log(e);
      }
    }
    return out;
  }

  private async fetchBTTVEmotes(broadcasterId: string): Promise<EmoteMap> {
    if (!broadcasterId) return {};
    try {
      const { data } = await HttpHandler.get(`https://api.betterttv.net/3/cached/users/twitch/${broadcasterId}`);
      const out: EmoteMap = {};
      for (const e of [...(data.channelEmotes || []), ...(data.sharedEmotes || [])]) {
        out[e.code] = `https://cdn.betterttv.net/emote/${e.id}/1x`;
      }
      return out;
    } catch {
      return {};
    }
  }

  private async fetchFFZEmotes(broadcasterId: string): Promise<EmoteMap> {
    if (!broadcasterId) return {};
    try {
      const { data } = await HttpHandler.get(`https://api.frankerfacez.com/v1/room/id/${broadcasterId}`);
      const out: EmoteMap = {};
      for (const setId of Object.keys(data.sets || {})) {
        const set = data.sets[setId];
        for (const e of set.emoticons || []) {
          out[e.name] = e.urls['1'] || e.urls['2'] || e.urls['4'] || '';
        }
      }
      return out;
    } catch {
      return {};
    }
  }

  private async fetchSevenTVEmotes(broadcasterId: string): Promise<EmoteMap> {
    if (!broadcasterId) return {};
    try {
      const { data } = await HttpHandler.get(`https://api.7tv.io/v2/users/${broadcasterId}/emotes`);
      const out: EmoteMap = {};
      for (const e of data || []) {
        out[e.name] = e.urls?.[0]?.[1] || '';
      }
      return out;
    } catch {
      return {};
    }
  }

  async getAllChannelBadges(broadcasterId: string): Promise<BadgeMap> {
    const headers = {
      'Client-Id': this.clientId,
      Authorization: `Bearer ${this.authService.getAuthToken()}`,
    };

    try {
      const [globalRes, channelRes] = await Promise.all([
        HttpHandler.get<BadgesResponse>('https://api.twitch.tv/helix/chat/badges/global', { headers }),
        broadcasterId
          ? HttpHandler.get<BadgesResponse>(`https://api.twitch.tv/helix/chat/badges?broadcaster_id=${broadcasterId}`, {
              headers,
            })
          : Promise.resolve({ data: { data: [] } as BadgesResponse }),
      ]);

      const map: BadgeMap = {};

      const merge = (sets: BadgeSet[]) => {
        for (const set of sets) {
          for (const v of set.versions ?? []) {
            map[`${set.set_id}/${v.id}`] = v.image_url_1x ?? v.image_url_2x ?? v.image_url_4x ?? '';
          }
        }
      };

      merge(globalRes.data.data ?? []);
      merge(channelRes.data.data ?? []);

      return map;
    } catch (err) {
      console.error('[fetchTwitchBadges] Erro ao buscar badges:', err);
      return {};
    }
  }

  async getAllChannelEmotes(broadcasterId: string): Promise<EmoteMap> {
    const map: EmoteMap = {};

    const merge = (source: Record<string, string>) => {
      for (const [name, url] of Object.entries(source)) {
        if (url) map[name] = url;
      }
    };

    const [twitch, bttv, ffz, seven] = await Promise.all([
      this.fetchTwitchEmotes(broadcasterId),
      this.fetchBTTVEmotes(broadcasterId),
      this.fetchFFZEmotes(broadcasterId),
      this.fetchSevenTVEmotes(broadcasterId),
    ]);

    merge(twitch);
    merge(bttv);
    merge(ffz);
    merge(seven);
    return map;
  }
}
