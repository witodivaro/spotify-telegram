import { InputFile } from 'grammy';
import fsPromises from 'fs/promises';
import { parentPort, workerData } from 'worker_threads';
import { SpotifyTrack } from '../spotify/types';
import { temporarilyFetchImage } from '../utils/images';
import YoutubeClient from '../youtube/YoutubeClient';

// const { InputFile } = require('grammy');
// const fsPromises = require('fs/promises');
// const { parentPort, workerData } = require('worker_threads');
// const { SpotifyTrack } = require('../spotify/types');
// const { temporarilyFetchImage } = require('../utils/images');
// const YoutubeClient = require('../youtube/YoutubeClient');

interface WorkerData {
  track: SpotifyTrack;
}

interface EditTemporaryMessageReply {
  type: 'edit';
  text: string;
}

interface DeleteTemporaryMessageReply {
  type: 'delete';
}

interface ReplyWithAudioReply {
  type: 'audio';
  path: InputFile;
  thumbnail: InputFile;
}

export type Reply = EditTemporaryMessageReply | DeleteTemporaryMessageReply | ReplyWithAudioReply;

const run = async () => {
  const { track } = workerData as WorkerData;

  const trackArtistNames = track.artists.map((artist) => artist.name).join(', ');
  const searchQuery = [trackArtistNames, track.name].join(' – ');

  console.log('Here I am');
  console.log({ track });

  const sendReply = async (replyMessage: Reply) => {
    parentPort?.postMessage(replyMessage);
  };

  const musicVideo = await YoutubeClient.searchVideo(searchQuery, track.duration_ms);

  if (musicVideo) {
    const musicPath = await YoutubeClient.downloadMp3(musicVideo.id, {
      album: track.album.name,
      title: track.name,
      artist: trackArtistNames,
    });

    if (musicPath) {
      const { path: imagePath, unlink: unlinkImage } = await temporarilyFetchImage(
        track.album.images[2].url,
        musicPath
      );

      sendReply({
        type: 'audio',
        path: new InputFile(musicPath),
        thumbnail: new InputFile(imagePath),
      });

      sendReply({
        type: 'delete',
      });

      await fsPromises.unlink(musicPath);
      await unlinkImage();
    } else {
      sendReply({
        type: 'edit',
        text: `${searchQuery} is not available`,
      });
    }
  } else {
    sendReply({
      type: 'edit',
      text: `${searchQuery} is not available`,
    });
  }
};

run();
