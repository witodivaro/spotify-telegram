import { config } from '../config';

export const createYoutubeVideoUrl = (videoId: string) => [config.YOUTUBE_WATCH_VIDEO_URL, videoId].join('');
