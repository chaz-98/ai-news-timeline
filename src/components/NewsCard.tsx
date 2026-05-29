import { NewsItem } from "@/types/news";
import { Clock } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface NewsCardProps {
  news: NewsItem;
}

const categoryColors: Record<string, { light: string; dark: string }> = {
  "LLM": { light: "bg-blue-100 text-blue-800", dark: "bg-blue-900/30 text-blue-400" },
  "多模态": { light: "bg-purple-100 text-purple-800", dark: "bg-purple-900/30 text-purple-400" },
  "AI 医疗": { light: "bg-green-100 text-green-800", dark: "bg-green-900/30 text-green-400" },
  "开源": { light: "bg-orange-100 text-orange-800", dark: "bg-orange-900/30 text-orange-400" },
  "AI 安全": { light: "bg-red-100 text-red-800", dark: "bg-red-900/30 text-red-400" },
  "科技": { light: "bg-cyan-100 text-cyan-800", dark: "bg-cyan-900/30 text-cyan-400" },
  "AI": { light: "bg-indigo-100 text-indigo-800", dark: "bg-indigo-900/30 text-indigo-400" },
  "技术": { light: "bg-teal-100 text-teal-800", dark: "bg-teal-900/30 text-teal-400" },
};

export default function NewsCard({ news }: NewsCardProps) {
  const { isDark } = useTheme();
  
  const formatTime = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    
    // 如果时间是未来的，显示"刚刚"
    if (diffMs < 0) {
      return "刚刚";
    }
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) {
      return "刚刚";
    } else if (diffMins < 60) {
      return `${diffMins} 分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours} 小时前`;
    } else {
      return dateObj.toLocaleDateString("zh-CN");
    }
  };

  const colorKey = categoryColors[news.category] || { 
    light: "bg-gray-100 text-gray-800", 
    dark: "bg-gray-800 text-gray-300" 
  };
  const categoryColor = isDark ? colorKey.dark : colorKey.light;

  return (
    <div className="relative pl-8 pb-8 last:pb-0">
      {/* Timeline dot */}
      <div className={`absolute left-0 top-2 w-4 h-4 rounded-full border-4 shadow-sm z-10 ${
        isDark ? "bg-white border-gray-900" : "bg-black border-white"
      }`}></div>
      
      {/* Timeline line */}
      <div className={`absolute left-[7px] top-6 bottom-0 w-0.5 ${
        isDark ? "bg-gray-700" : "bg-gray-200"
      }`}></div>
      
      {/* Card - clickable */}
      <a
        href={news.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`block rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300 cursor-pointer ${
          isDark 
            ? "bg-gray-800 border-gray-700 hover:border-gray-600" 
            : "bg-white border-gray-100 hover:border-gray-200"
        }`}
      >
        
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
              {news.category}
            </span>
            <div className={`flex items-center gap-1.5 text-xs ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}>
              <Clock size={14} />
              <span>{formatTime(news.timestamp)}</span>
            </div>
          </div>
          
          <h3 className={`text-lg font-semibold mb-2 leading-tight ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            {news.translatedTitle || news.title}
            {news.translatedTitle && (
              <span className={`text-sm font-normal mt-1 block ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                {news.title}
              </span>
            )}
          </h3>
          
          <p className={`text-sm leading-relaxed ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}>
            {news.translatedSummary || news.summary}
            {news.translatedSummary && (
              <span className={`text-xs mt-2 block ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}>
                {news.summary}
              </span>
            )}
          </p>
          
          <div className="mt-3">
            <span className={`text-xs ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}>
              {news.sourceName}
            </span>
          </div>
        </div>
      </a>
    </div>
  );
}
