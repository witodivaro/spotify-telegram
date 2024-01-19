declare module 'youtube-search-api' {
  interface Thumbnail {
    url: string;
    width: number;
    height: number;
  }

  interface ShortBylineTextRun {
    text: string;
    navigationEndpoint: {
      clickTrackingParams: string;
      commandMetadata: {
        webCommandMetadata: {
          url: string;
          webPageType: string;
          rootVe: number;
          apiUrl: string;
        };
      };
      browseEndpoint: {
        browseId: string;
        canonicalBaseUrl: string;
      };
    };
  }

  interface ShortBylineText {
    runs: ShortBylineTextRun[];
  }

  interface AccessibilityData {
    label: string;
  }

  interface Length {
    accessibility: {
      accessibilityData: AccessibilityData;
    };
    simpleText: string;
  }

  interface ThumbnailData {
    thumbnails: Thumbnail[];
  }

  interface Video {
    id: string;
    type: 'video';
    thumbnail: ThumbnailData;
    title: string;
    channelTitle: string;
    shortBylineText: ShortBylineText;
    length: Length;
    isLive: boolean;
  }

  interface NextPage {
    nextPageToken: string;
    nextPageContext: Object;
  }

  interface GetListByKeywordsResult {
    items: Video[];
    nextPage: NextPage;
  }

  export default class YoutubeSearchAPI {
    static GetListByKeyword: (
      keywords: string,
      isPlaylist?: boolean,
      limit?: number,
      options?: string
    ) => Promise<GetListByKeywordsResult>;

    static NextPage(nextPage: NextPage, playlist?: boolean, limit?: number): Promise<GetListByKeywordsResult>;
  }
}
