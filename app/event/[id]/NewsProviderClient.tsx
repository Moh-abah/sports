"use client";
import { ReactNode } from "react";
import { NewsProvider } from "./news/contaxt";
import type { NewsItem } from "./news/contaxt";

export default function NewsProviderClient({ children, initialNews = [] }: { children: ReactNode; initialNews?: NewsItem[] }) {
    return <NewsProvider initialNews={initialNews}>{children}</NewsProvider>;
}
