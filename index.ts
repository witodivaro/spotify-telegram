import './src/telegram/bot';
import { bot } from './src/telegram/bot';

/**
 * TO-DO:
 * 1. Implement only 1 simultanious playlist fetch per time // automatically done
 * 2. Check if the user has blocked the bot and stop sending messages
 * 3. Save each user in the DB
 * 4. Save each user's spotify ID in the DB
 * 5. Fix bot crashing some times
 * 6. Check how much RAM does song download take
 * 7. Pass bot username to the conversation through session to render it under song names
 * 8. Make sure that the same songs are not stored twice
 * 9. Fetch track information from spotify API based on the button data 
 */

const run = async () => {
  bot.start();

  console.log('Bot is up and running!');
};

run();
