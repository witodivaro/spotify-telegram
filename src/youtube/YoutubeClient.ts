import { Tags } from 'node-id3';
import YoutubeSearchAPI, { Video } from 'youtube-search-api';
import { Downloader } from '../VideoDownloader';
import { ONE_MINUTE_IN_MS, ONE_SECOND_IN_MS } from '../consts';
import { THRESHOLD_DURATION_DIFFERENCE_IN_MS } from './consts';
import { createYoutubeVideoUrl } from './utils';

class YoutubeClient {
  private downloader = new Downloader();

  async searchVideo(query: string, durationInMs: number): Promise<Video | null> {
    let { items } = await YoutubeSearchAPI.GetListByKeyword(
      query,
      false,
      50,
      JSON.stringify([{ type: 'video' }])
    );

    const video = this.validateVideosList(items, durationInMs);

    return video || null;
  }

  validateVideosList(items: Video[], durationInMs: number) {
    const itemsWithLengthInMs = items
      .filter((item) => item.length?.simpleText.split(':').length <= 2)
      .map((item) => {
        const videoLengthParts = item.length.simpleText.split(':');

        const lengthInMs =
          Number(videoLengthParts[0]) * ONE_MINUTE_IN_MS + Number(videoLengthParts[1]) * ONE_SECOND_IN_MS;

        return { ...item, length: { ...item.length, ms: lengthInMs } };
      })
      .filter((item) => Number.isInteger(item.length.ms));

    const properItem = itemsWithLengthInMs.find((item) => {
      const differenceInMs = Math.abs(item.length.ms - durationInMs);

      return differenceInMs < THRESHOLD_DURATION_DIFFERENCE_IN_MS;
    });

    return properItem || null;
  }

  async downloadMp3(videoId: string, songTags: Tags) {
    for (let i = 0; i < 3; i++) {
      try {
        const musicPath = await this.downloader.downloadSong(createYoutubeVideoUrl(videoId), songTags);
        return musicPath;
      } catch (error) {
        console.log(`Attempt ${i + 1} to download ${videoId} failed.`);
      }
    }

    return null;
  }
}

export default new YoutubeClient();
