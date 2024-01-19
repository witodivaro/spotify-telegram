import ytdl from 'ytdl-core';
import path from 'path';
import NodeID3, { Tags } from 'node-id3';
import type { videoInfo as VideoInfo } from 'ytdl-core';
import { FormatConverter } from './FormatConverter';
import { v1 as uuid } from 'uuid';

export interface DownloaderOptions {
  outputDir: string;
}

export class Downloader {
  outputDir: string;

  constructor({ outputDir }: DownloaderOptions) {
    this.outputDir = outputDir;
  }

  async downloadSong(url: string, songTags: Tags): Promise<string> {
    const videoInfo = await ytdl.getInfo(url).catch((error) => {
      console.log(`Failed to fetch info for video with URL: ${url}`);
      throw new Error(error);
    });

    const formatConverter = new FormatConverter();

    const outputFile = this.getOutputFile();
    const videoData = await this.downloadVideo(videoInfo);

    formatConverter.videoToAudio(videoData, outputFile);

    NodeID3.write(songTags, outputFile);

    return outputFile;
  }

  /** Returns the content from the video as a buffer */
  private async downloadVideo(videoInfo: VideoInfo): Promise<Buffer> {
    const buffers: Buffer[] = [];
    const stream = ytdl.downloadFromInfo(videoInfo, { quality: 'highestaudio' }); // .pipe(fs.createWriteStream(outputFile));
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk: Buffer) => {
        buffers.push(chunk);
      });
      stream.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      stream.on('error', (err) => {
        reject(err);
      });
    });
  }

  /** Returns the absolute path to the audio file to be downloaded */
  private getOutputFile(): string {
    const baseFileName = uuid();
    return path.join(this.outputDir, baseFileName + '.mp3');
  }
}
