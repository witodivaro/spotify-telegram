import axios, { AxiosRequestConfig } from 'axios';
import { config } from '../config';
import { PlaylistTracks, SpotifyPlaylist, ExtendedSpotifyTrack, TokensResponse, SpotifyTrack } from './types';
import { createPlaylistUrl, createTrackUrl } from './utils';

const tokenUrl = [config.ACCOUNTS_SPOTIFY_URL, 'api', 'token'].join('/');

class SpotifyClient {
  private accessToken: string | null = null;

  private async fetchWithAuth<Response>(url: string, options?: AxiosRequestConfig) {
    return await axios<Response>({
      ...options,
      url,
      headers: {
        Authorization: 'Bearer ' + this.accessToken,
      },
    });
  }

  async getPlaylist(playlistId: string) {
    if (!this.accessToken) throw new Error('Unauthorized!');

    const playlistUrl = createPlaylistUrl(playlistId);

    const { data: playlist } = await this.fetchWithAuth<SpotifyPlaylist>(playlistUrl);

    return playlist;
  }

  async getTrack(trackId: string) {
    if (!this.accessToken) throw new Error('Unauthorized!');

    const trackUrl = createTrackUrl(trackId);

    const { data: track } = await this.fetchWithAuth<SpotifyTrack>(trackUrl);

    return track;
  }

  async getPlaylistTracks(nextUrl: string) {
    if (!this.accessToken) throw new Error('Unauthorized!');

    const allTracks = [];

    let urlToFetch = nextUrl;

    while (urlToFetch) {
      const { data: tracks } = await this.fetchWithAuth<PlaylistTracks>(urlToFetch);

      allTracks.push(...tracks.items);

      if (!tracks.next) break;

      urlToFetch = tracks.next;
    }

    return allTracks;
  }

  async authorize() {
    if (!config.SPOTIFY_SECRET) throw new Error('SPOTIFY_SECRET is not set');
    if (!config.SPOTIFY_CLIENT_ID) throw new Error('SPOTIFY_CLIENT_ID is not set');

    const { data: result } = await axios.post<TokensResponse>(
      tokenUrl,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: config.SPOTIFY_CLIENT_ID,
        client_secret: config.SPOTIFY_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    this.accessToken = result.access_token;
  }
}

export default new SpotifyClient();
