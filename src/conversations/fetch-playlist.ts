import { InlineKeyboard, InputFile, Keyboard } from 'grammy';
import { ONE_HOUR_IN_MS } from '../consts';
import SpotifyClient from '../spotify/SpotifyClient';
import { MyContext, MyConversation } from './types';
import { convertMsToSimplifiedText, isSpotifyPlaylistUrl } from './utils';
import { SimplifiedTrack } from '../callback-handlers/types';
import mongo from '../repositories/db';
import { temporarilyFetchImage } from '../utils/images';

export async function fetchPlaylist(conversation: MyConversation, ctx: MyContext) {
  try {
    if (!ctx.message?.text || !ctx.chat) return;

    const {
      message: { text: playlistLinkText },
    } = await conversation.waitFor('message:text');

    if (ctx.message.text && !isSpotifyPlaylistUrl(playlistLinkText)) {
      return await ctx.reply('The URL is invalid.');
    }

    const spotifyPlaylistId = playlistLinkText.split('/').at(-1);

    if (!spotifyPlaylistId) {
      return await ctx.reply('The URL is invalid.');
    }

    const temporaryMessage = await ctx.reply('Opening the playlist..');

    await SpotifyClient.authorize();

    const playlist = await SpotifyClient.getPlaylist(spotifyPlaylistId);
    const tracks = await SpotifyClient.getPlaylistTracks(playlist.tracks.href);

    const tracksShorterThanHour = tracks.filter((track) => track.track.duration_ms < ONE_HOUR_IN_MS);

    const { path: imagePath, unlink } = await temporarilyFetchImage(playlist.images[0].url, playlist.id);

    await ctx.replyWithPhoto(new InputFile(imagePath), {
      caption: `<b>${playlist.name}</b> by ${playlist.owner.display_name}\n\n${playlist.description}`,
      parse_mode: 'HTML',
    });

    await ctx.reply(`The playlist contains ${tracksShorterThanHour.length} songs. Do you want to proceed?`, {
      reply_markup: Keyboard.from([[Keyboard.text('Yes'), Keyboard.text('No')]])
        .oneTime()
        .resized(),
    });

    await ctx.api.deleteMessage(ctx.chat.id, temporaryMessage.message_id);

    await unlink();

    const proceedMessage = await conversation.waitFor('message:text');

    if (proceedMessage.message.text !== 'Yes') {
      await ctx.reply('Ok, I will not download this playlist. To download another playlist, type /download.');
      return;
    };

    for (const track of tracksShorterThanHour) {
      const trackArtistNames = track.track.artists.map((artist) => artist.name).join(', ');
      const searchQuery = [trackArtistNames, track.track.name].join(' – ');

      await ctx.reply(`🎧 ${searchQuery}, ${convertMsToSimplifiedText(track.track.duration_ms)}`, {
        reply_markup: InlineKeyboard.from([[InlineKeyboard.text('⬇️ Download 💽', track.track.id)]]),
      });

      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    await ctx.reply(`Done! Now just click 'Download' to download a song.`);
  } catch (error) {
    console.log(error);
  }
}
