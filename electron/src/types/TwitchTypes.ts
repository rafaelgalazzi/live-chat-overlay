export interface BadgeVersion {
  id: string;
  image_url_1x?: string;
  image_url_2x?: string;
  image_url_4x?: string;
}

export interface BadgeSet {
  set_id: string;
  versions: BadgeVersion[];
}

export interface BadgesResponse {
  data: BadgeSet[];
}

export type BadgeMap = Record<string, string>;

export interface Emote {
  id: string;
  name: string;
  images: { url_1x: string; url_2x: string; url_4x: string };
}

export interface EmotesResponse {
  data: Emote[];
}

export type EmoteMap = Record<string, string>;
