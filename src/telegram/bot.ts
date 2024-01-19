import { Bot, session } from 'grammy';
import { conversations, createConversation } from '@grammyjs/conversations';
import { MyContext, SessionData } from '../conversations/types';
import { fetchPlaylist } from '../conversations/fetch-playlist';
import { config } from '../config';
import { onDownloadSong } from '../callback-handlers/download-song';
import { sequentialize } from '@grammyjs/runner';
import { autoRetry } from '@grammyjs/auto-retry';

export const bot = new Bot<MyContext>(config.BOT_TOKEN);

function initial(): SessionData {
  return {
    botInfo: bot.botInfo,
  };
}

function getSessionKey(ctx: MyContext) {
  return ctx.chat?.id.toString();
}

bot.api.config.use(autoRetry());
bot.use(sequentialize(getSessionKey));
bot.use(
  session({
    initial,
  })
);

bot.use(conversations());
bot.use(createConversation(fetchPlaylist));

bot.command('start', async (ctx) => {
  await ctx.reply(
    'Hello! I am a Spotify Playlist Downloader bot.\n\nTo download a playlist, send me a playlist URL.\n\nExample: https://open.spotify.com/playlist/37i9dQZF1DWWY64wDtewQt\n\nAvailable commands:\n/download – download a playlist'
  );

  await ctx.conversation.enter('fetchPlaylist');
});

bot.command('download', async (ctx) => {
  await ctx.reply(
    `Now send me a Spotify Playlist URL (e.g. https://open.spotify.com/playlist/37i9dQZF1DWWY64wDtewQt):`
  );

  await ctx.conversation.enter('fetchPlaylist');
});

bot.on('callback_query:data', onDownloadSong);
