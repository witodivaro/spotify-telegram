import { Filter } from 'grammy';
import { MyContext } from '../conversations/types';
import { Worker } from 'worker_threads';
import fastq from 'fastq';
import { WorkerData } from '../workers/download-song';
import { config } from '../config';

export const createWorker = (workerData: WorkerData) => {
  return new Worker('./build/src/workers/download-song.js', {
    workerData,
  });
};

const runWorker = async (workerData: WorkerData) => {
  const worker = createWorker(workerData);

  return new Promise((resolve, reject) => {
    worker.on('exit', (err) => {
      if (!err) return resolve(null);

      reject(err);
    });
  });
};

const queue = fastq.promise(runWorker, Number(config.SIMULTANIOUS_TRACK_DOWNLOADS));

export const queueWorker = async (workerData: WorkerData) => {
  queue.push(workerData);
};

export async function onDownloadSong(ctx: Filter<MyContext, 'callback_query:data'>) {
  if (!ctx.callbackQuery.message?.chat.id || !ctx.callbackQuery.message?.message_id) return;

  const chatId = ctx.callbackQuery.message.chat.id;
  const messageId = ctx.callbackQuery.message.message_id;

  try {
    await ctx.answerCallbackQuery();

    await ctx.api.editMessageText(chatId, messageId, `🕺 Downloading ${ctx.callbackQuery.message.text}..`);

    queueWorker({
      trackId: ctx.callbackQuery.data,
      chatId,
      messageId,
      botUsername: ctx.session.botInfo.username,
    });
  } catch (error: any) {
    if (error.message) {
      await ctx.api.editMessageText(chatId, messageId, `Download failed: ${error.message || 'Unknown error'}`);
    }
    console.log(error);
  }
}
