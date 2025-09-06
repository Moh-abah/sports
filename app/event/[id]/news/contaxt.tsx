"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export interface NewsItem {
  title?: string;
  headline?: string;
  description?: string;
  published?: string;
  images?: { url?: string; name?: string }[];
  links?: { web?: { href?: string }; api?: { self?: { href?: string } } };
}

interface NewsContextType {
  news: NewsItem[];
  setNews: (n: NewsItem[]) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider = ({ children, initialNews = [] }: { children: ReactNode; initialNews?: NewsItem[] }) => {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  return <NewsContext.Provider value={{ news, setNews }}>{children}</NewsContext.Provider>;
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) throw new Error("useNews must be used within NewsProvider");
  return context;
};
