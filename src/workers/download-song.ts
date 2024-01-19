import { InputFile } from 'grammy';
import { parentPort, workerData } from 'worker_threads';
import { temporarilyFetchImage } from '../utils/images';
import YoutubeClient from '../youtube/YoutubeClient';
import { bot } from '../telegram/bot';
import SpotifyClient from '../spotify/SpotifyClient';

export interface WorkerData {
  chatId: number;
  messageId: number;
  botUsername: string;
  trackId: string;
}

export enum Reply {
  'TRACK_NOT_FOUND',
}

const run = async () => {
  const { trackId, chatId, messageId, botUsername } = workerData as WorkerData;

  await SpotifyClient.authorize();
  const track = await SpotifyClient.getTrack(trackId);

  if (!track) {
    parentPort?.postMessage(Reply.TRACK_NOT_FOUND);
    return await bot.api.editMessageText(chatId, messageId, 'This song is not available any longer');
  }

  const trackArtistNames = track.artists.map((artist) => artist.name).join(', ');
  const searchQuery = [trackArtistNames, track.name].join(' – ');

  const musicVideo = await YoutubeClient.searchVideo(searchQuery, track.duration_ms);

  if (musicVideo) {
    const musicPath = await YoutubeClient.downloadMp3(musicVideo.id, {
      album: track.album.name,
      title: track.name,
      artist: trackArtistNames,
    });

    if (musicPath) {
      const { path: imagePath } = await temporarilyFetchImage(track.album.images[2].url);

      await bot.api.sendAudio(chatId, new InputFile(musicPath), {
        caption: '@' + botUsername,
        thumbnail: new InputFile(imagePath),
        title: track.name,
        performer: trackArtistNames,
      });

      await bot.api.deleteMessage(chatId, messageId);
    } else {
      await bot.api.editMessageText(chatId, messageId, `☠️ ${searchQuery} is not available`);
    }
  } else {
    await bot.api.editMessageText(chatId, messageId, `☠️ ${searchQuery} is not available`);
  }
};

run();
