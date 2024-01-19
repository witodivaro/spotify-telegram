import { config } from '../config';

export const isSpotifyPlaylistUrl = (text: string) => {
  if (!config.SPOTIFY_PLAYLIST_BASE_URL) throw new Error('No ENV');

  return text.startsWith(config.SPOTIFY_PLAYLIST_BASE_URL);
};

export const convertMsToSimplifiedText = (ms: number) => {
  const seconds = Math.floor(ms / 1000);

  const minutes = Math.floor(seconds / 60);
  const secondsLeft = Math.floor(seconds % 60);

  return `${String(minutes).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
};
