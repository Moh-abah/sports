import React from "react";
import NewsProviderClient from "./NewsProviderClient";
import EventNavbar from "./navbar";
import { fetchEventDetails } from "@/lib/api"; // تأكد أن هذه الدالة تعمل في server-side (أو استبدلها بfetch)
import type { NewsItem } from "./news/contaxt";

interface Props {
    children: React.ReactNode;
    params: { id: string };
}

export default async function EventLayout({ children, params }: Props) {
    const eventId = params.id;

    // جلب بيانات الحدث على مستوى الـ layout (server-side)
    let newsList: NewsItem[] = [];
    try {
        const data = await fetchEventDetails(eventId); // يجب أن ترجع بيانات الحدث بما فيها event.news
        if (data?.news) {
            if (Array.isArray(data.news)) newsList = data.news;
            else if (Array.isArray(data.news?.articles)) newsList = data.news.articles;
        }
    } catch (e) {
        console.error("Failed to fetch event in layout:", e);
    }

    return (
        <NewsProviderClient initialNews={newsList}>
            {/* Navbar موجود هنا علشان يظهر في كل صفحات الحدث */}
           
            <div>{children}</div>
        </NewsProviderClient>
    );
}
