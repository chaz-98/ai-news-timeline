import { useEffect, useState } from "react";
import NewsCard from "@/components/NewsCard";
import { RefreshCw, Zap, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { fetchNews, syncNews } from "@/lib/api";
import { NewsItem } from "@/types/news";

export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const loadNews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchNews();
      setNews(data);
    } catch (error: any) {
      console.error("Error loading news:", error);
      setError(error.message || "加载新闻失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setError(null);
    try {
      const data = await syncNews();
      setNews(data);
    } catch (error: any) {
      console.error("Error syncing news:", error);
      setError(error.message || "刷新失败");
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  // 获取所有可用来源
  const sources = [...new Set(news.map((n) => n.sourceName))];

  // 筛选和排序新闻
  const newsFiltered = selectedSource
    ? news.filter((n) => n.sourceName === selectedSource)
    : news;

  const newsSorted = [...newsFiltered].sort((a, b) => {
    const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
    const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
    return timeB - timeA;
  });

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDark ? "bg-white" : "bg-black"
              }`}>
                <Zap size={18} className={isDark ? "text-gray-900" : "text-white"} />
              </div>
              <h1 className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}>AI 动态</h1>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? "text-gray-300 hover:text-white hover:bg-gray-700" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={handleSync}
                disabled={isSyncing}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? "text-gray-300 hover:text-white hover:bg-gray-700" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                } disabled:opacity-50`}
              >
                <RefreshCw size={20} className={isSyncing ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Intro */}
        <div className="mb-6">
          <div className={`rounded-2xl p-5 ${
            isDark ? "bg-gray-800 border border-gray-700" : "bg-gray-900"
          }`}>
            <h2 className={`text-lg font-semibold mb-2 ${
              isDark ? "text-white" : "text-white"
            }`}>AI 行业最新情报</h2>
            <p className={`text-sm ${
              isDark ? "text-gray-300" : "text-gray-300"
            }`}>每小时更新，让你第一时间掌握 AI 领域最新动态</p>
          </div>
        </div>

        {/* Source Filter */}
        {!isLoading && sources.length > 0 && (
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedSource(null)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedSource === null
                    ? (isDark ? "bg-white text-gray-900" : "bg-black text-white")
                    : (isDark
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200")
                }`}
              >
                全部
              </button>
              {sources.map((source) => (
                <button
                  key={source}
                  onClick={() => setSelectedSource(source)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedSource === source
                      ? (isDark ? "bg-white text-gray-900" : "bg-black text-white")
                      : (isDark
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200")
                  }`}
                >
                  {source}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative pl-8 pb-8">
                <div className={`absolute left-0 top-2 w-4 h-4 rounded-full ${
                  isDark ? "bg-gray-700" : "bg-gray-300"
                }`}></div>
                <div className={`rounded-2xl p-5 ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-3 animate-pulse"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="py-12 text-center">
            <div className={`rounded-2xl p-8 ${
              isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
            }`}>
              <p className={`text-lg font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                加载失败
              </p>
              <p className={`text-sm mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {error}
              </p>
              <button
                onClick={loadNews}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                重试
              </button>
            </div>
          </div>
        ) : newsSorted.length === 0 ? (
          /* Empty State */
          <div className="py-12 text-center">
            <div className={`rounded-2xl p-8 ${
              isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
            }`}>
              <p className={`text-lg font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                {selectedSource ? `暂无来自 ${selectedSource} 的新闻` : "暂无新闻"}
              </p>
              <p className={`text-sm mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {selectedSource
                  ? "尝试切换到其他来源或点击刷新"
                  : "点击右上角刷新按钮获取最新新闻"}
              </p>
              {selectedSource && (
                <button
                  onClick={() => setSelectedSource(null)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    isDark
                      ? "bg-white text-gray-900 hover:bg-gray-100"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  查看全部
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Timeline */
          <div className="pt-2">
            {newsSorted.map((newsItem) => (
              <NewsCard key={newsItem.id} news={newsItem} />
            ))}
          </div>
        )}

        {/* End of feed indicator */}
        {!isLoading && newsSorted.length > 0 && (
          <div className="text-center py-8">
            <div className={`inline-flex items-center gap-2 text-sm ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isDark ? "bg-gray-600" : "bg-gray-300"
              }`}></div>
              <span>已加载全部内容</span>
              <div className={`w-2 h-2 rounded-full ${
                isDark ? "bg-gray-600" : "bg-gray-300"
              }`}></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
