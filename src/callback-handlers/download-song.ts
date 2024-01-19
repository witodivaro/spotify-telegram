import { Filter } from 'grammy';
import { MyContext } from '../conversations/types';
import SpotifyClient from '../spotify/SpotifyClient';
import { Worker } from 'worker_threads';
import { Reply } from '../workers/download-song';

export async function onDownloadSong(ctx: Filter<MyContext, 'callback_query:data'>) {
  if (!ctx.callbackQuery.message?.chat.id || !ctx.callbackQuery.message?.message_id) return;

  const chatId = ctx.callbackQuery.message.chat.id;
  const messageId = ctx.callbackQuery.message.message_id;

  try {
    await SpotifyClient.authorize();
    const track = await SpotifyClient.getTrack(ctx.callbackQuery.data);

    if (!track) {
      await ctx.answerCallbackQuery();
      return await ctx.api.editMessageText(chatId, messageId, 'This song is not available any longer');
    }

    const worker = new Worker('./src/workers/download-song.ts', {
      workerData: {
        track,
      },
    });

    worker.on('message', async (data: Reply) => {
      console.log('Worker shared some data');
      console.log({ data });

      if (data.type === 'audio') {
        const trackArtistNames = track.artists.map((artist) => artist.name).join(', ');

        return await ctx.replyWithAudio(data.path, {
          caption: '@' + ctx.session.botInfo.username,
          thumbnail: data.thumbnail,
          title: track.name,
          performer: trackArtistNames,
        });
      }

      if (data.type === 'edit') {
        return await ctx.api.editMessageText(chatId, messageId, data.text);
      }

      if (data.type === 'delete') {
        return await ctx.api.deleteMessage(chatId, messageId);
      }
    });

    await ctx.answerCallbackQuery();
  } catch (error: any) {
    if (error.message) {
      await ctx.api.editMessageText(chatId, messageId, `Download failed: ${error.message || 'Unknown error'}`);
    }
    console.log(error);
  }
}
