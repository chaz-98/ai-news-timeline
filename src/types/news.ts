export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  sourceUrl: string;
  sourceName: string;
  category: string;
  timestamp: Date | string;
  imageUrl?: string;
}
