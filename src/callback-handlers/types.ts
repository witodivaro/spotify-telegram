export interface SimplifiedTrack {
  search_query: string;
  duration_ms: number;
  artist_names: string;
  album_name: string;
  name: string;
  cover_image_url: string;
  track_id: string;
  message_id: number;
  chat_id: number;
  date_created: Date;
  tg_username?: string;
  playlist_url: string;
}
