export interface NewsItem {
  id: string;
  title: string;
  translatedTitle?: string;
  summary: string;
  translatedSummary?: string;
  content?: string;
  sourceUrl: string;
  sourceName: string;
  category: string;
  timestamp: Date | string;
  imageUrl?: string;
  isTranslated?: boolean;
}
