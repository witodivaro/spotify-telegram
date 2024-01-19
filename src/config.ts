import dotenv from 'dotenv';
dotenv.config();

const {
  BOT_TOKEN,
  SPOTIFY_SECRET,
  SPOTIFY_PLAYLIST_BASE_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_API_URL,
  ACCOUNTS_SPOTIFY_URL,
  YOUTUBE_WATCH_VIDEO_URL,
  MONGO_URL,
  MONGO_USER,
  MONGO_PASS,
  MONGO_DB_NAME,
  SIMULTANIOUS_TRACK_DOWNLOADS,
} = process.env;

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not defined');
}

if (!SPOTIFY_PLAYLIST_BASE_URL) {
  throw new Error('SPOTIFY_PLAYLIST_BASE_URL is not defined');
}

if (!SPOTIFY_SECRET) {
  throw new Error('SPOTIFY_SECRET is not defined');
}

if (!SPOTIFY_CLIENT_ID) {
  throw new Error('SPOTIFY_CLIENT_ID is not defined');
}

if (!SPOTIFY_API_URL) {
  throw new Error('SPOTIFY_API_URL is not defined');
}

if (!ACCOUNTS_SPOTIFY_URL) {
  throw new Error('ACCOUNTS_SPOTIFY_URL is not defined');
}

if (!YOUTUBE_WATCH_VIDEO_URL) {
  throw new Error('YOUTUBE_WATCH_VIDEO_URL is not defined');
}

if (!MONGO_DB_NAME) {
  throw new Error('MONGO_DB_NAME is not defined');
}

if (!MONGO_PASS) {
  throw new Error('MONGO_PASS is not defined');
}

if (!MONGO_URL) {
  throw new Error('MONGO_URL is not defined');
}

if (!SIMULTANIOUS_TRACK_DOWNLOADS) {
  throw new Error('SIMULTANIOUS_TRACK_DOWNLOADS is not defined');
}

if (!MONGO_USER) {
  throw new Error('MONGO_USER is not defined');
}

export const config = {
  BOT_TOKEN,
  SPOTIFY_PLAYLIST_BASE_URL,
  SPOTIFY_SECRET,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_API_URL,
  ACCOUNTS_SPOTIFY_URL,
  YOUTUBE_WATCH_VIDEO_URL,
  MONGO_URL,
  MONGO_USER,
  MONGO_PASS,
  MONGO_DB_NAME,
  SIMULTANIOUS_TRACK_DOWNLOADS,
};
