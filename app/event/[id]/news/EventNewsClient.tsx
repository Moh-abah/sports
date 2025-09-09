// app/event/[id]/news/EventNewsClient.tsx
"use client";

import React from "react";
import Link from "next/link";
import EventNavbar from "../navbar";
import Footer from "@/components/footer";
import Header from "@/components/header";

// تعريف الأنواع (نفس الأنواع المستخدمة في Server Component)
interface TeamShort {
    id?: string;
    name?: string;
    displayName?: string;
    abbreviation?: string;
    logo?: string;
    score?: number;
    record?: any[];
}

interface EventDetailsLoose {
    id?: string;
    league?: { id?: string; name?: string; abbreviation?: string; links?: any[] };
    homeTeam?: TeamShort;
    awayTeam?: TeamShort;
    status?: { description?: string; state?: string; period?: number; displayClock?: string; isLive?: boolean };
    dateEvent?: string;
    venue?: { id?: string; name?: string; city?: string; country?: string; capacity?: number | null; indoor?: boolean };
    season?: { year?: number; type?: number; name?: string };
    description?: string;
    highlights?: any[];
    news?: any;
    boxscore?: { teams?: any[]; players?: any[] };
    competitors?: any[];
    playByPlay?: any[];
    links?: { web?: string; mobile?: string; tickets?: any[] };
}

interface NewsItem {
    headline?: string;
    title?: string;
    description?: string;
    published?: string;
    images?: Array<{ url: string; name?: string }>;
    links?: any;
}

interface EventNewsClientProps {
    event: EventDetailsLoose;
    news: NewsItem[];
    eventId: string;
}

// دالة مساعدة لتحويل التاريخ
const formatDateTime = (iso?: string) => {
    if (!iso) return { date: "TBA", time: "TBA" };
    try {
        const d = new Date(iso);
        const date = new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "Asia/Aden"
        }).format(d);
        const time = new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Aden"
        }).format(d);
        return { date, time };
    } catch (e) {
        return { date: "TBA", time: "TBA" }
    }
};

// دالة مساعدة للتحقق من القيم
const safeString = (v: any, fallback = "") => (v == null ? fallback : String(v));

export default function EventNewsClient({ event, news, eventId }: EventNewsClientProps) {
    // استخراج البيانات من event
    const league = event.league ?? {};
    const season = event.season ?? {};
    const home = event.homeTeam ?? {};
    const away = event.awayTeam ?? {};
    const status = event.status ?? {};
    const venue = event.venue ?? {};
    const { date, time } = formatDateTime(event.dateEvent);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Header />
            <EventNavbar eventId={eventId} />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="mb-6 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold">{league.name} <span className="text-sm opacity-70">({league.abbreviation})</span></h1>
                        <div className="text-sm text-gray-600">{season.year ? `${season.year} Season` : (season.name || "Current Season")}</div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={event.links?.web || "#"} target="_blank" className="text-sm text-blue-600">Open source</Link>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <div className="text-sm mb-1">{date} • {time}</div>
                                <div className="text-sm mb-1">{venue.name || "TBD"} {venue.city ? `• ${venue.city}` : ''}</div>
                                <div className="mt-3">
                                    <div className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full ${status.isLive ? 'bg-red-500' : 'bg-gray-200 text-gray-900'}`}>
                                        {status.isLive ? (
                                            <>
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                                </span>
                                                LIVE
                                            </>
                                        ) : (
                                            safeString(status.description || 'Scheduled')
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 md:gap-16 justify-center w-full md:w-auto">
                                {/* TeamCard للفريق الأول */}
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full bg-white p-2 flex items-center justify-center shadow">
                                        {home.logo ? (
                                            <img src={home.logo} alt={home.name} className="w-full h-full object-contain" loading="lazy" />
                                        ) : (
                                            <div className="text-sm font-bold text-gray-500">{home.abbreviation || "N/A"}</div>
                                        )}
                                    </div>
                                    <div className="mt-2 text-center font-semibold">{home.name}</div>
                                    <div className="text-3xl font-extrabold mt-1">{home.score ?? 0}</div>
                                </div>

                                <div className="text-center">
                                    <div className="text-xl font-bold bg-white inline-block px-4 py-2 rounded-lg text-blue-800">VS</div>
                                </div>

                                {/* TeamCard للفريق الثاني */}
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full bg-white p-2 flex items-center justify-center shadow">
                                        {away.logo ? (
                                            <img src={away.logo} alt={away.name} className="w-full h-full object-contain" loading="lazy" />
                                        ) : (
                                            <div className="text-sm font-bold text-gray-500">{away.abbreviation || "N/A"}</div>
                                        )}
                                    </div>
                                    <div className="mt-2 text-center font-semibold">{away.name}</div>
                                    <div className="text-3xl font-extrabold mt-1">{away.score ?? 0}</div>
                                </div>
                            </div>
                        </div>

                        {status.isLive && (
                            <div className="mt-4 text-center">
                                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                    {status.period ? `Period ${status.period}` : ''} {status.displayClock || ''}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">News</h1>

                {news.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-gray-600 dark:text-gray-400 text-lg">No news available at the moment</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {news.map((n, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
                                {n.images?.[0]?.url && (
                                    <div className="aspect-video overflow-hidden">
                                        <img
                                            src={n.images[0].url}
                                            alt={n.images[0].name || "News image"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="p-5">
                                    <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white line-clamp-2">
                                        {n.headline || n.title || "Untitled News"}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                                        {n.description || "No description available."}
                                    </p>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {n.published ? new Date(n.published).toLocaleDateString() : "Unknown date"}
                                        </span>
                                        <a
                                            href={n.links?.web?.href || n.links?.api?.self?.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                                        >
                                            Read more
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}