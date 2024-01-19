import { config } from '../config';

export const createPlaylistUrl = (playlistId: string) => [config.SPOTIFY_API_URL, 'playlists', playlistId].join('/');
export const createTrackUrl = (trackId: string) =>
  [config.SPOTIFY_API_URL, 'tracks', trackId].join('/') + '?' + new URLSearchParams({ market: 'RU' });