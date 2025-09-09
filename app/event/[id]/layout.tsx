// import React from "react";
// import NewsProviderClient from "./NewsProviderClient";
// import EventNavbar from "./navbar";
// import { fetchEventDetails } from "@/lib/api"; // تأكد أن هذه الدالة تعمل في server-side (أو استبدلها بfetch)
// import type { NewsItem } from "./news/contaxt";

// interface Props {
//     children: React.ReactNode;
//     params: { id: string };
// }

// export default async function EventLayout({ children, params }: Props) {
//     const eventId = params.id;

//     // جلب بيانات الحدث على مستوى الـ layout (server-side)
    
//     let newsList: NewsItem[] = [];
//     try {
//         const data = await fetchEventDetails(eventId); // يجب أن ترجع بيانات الحدث بما فيها event.news
//         if (data?.news) {
//             if (Array.isArray(data.news)) newsList = data.news;
//             else if (Array.isArray(data.news?.articles)) newsList = data.news.articles;
//         }
//     } catch (e) {
//         console.error("Failed to fetch event in layout:", e);
//     }

//     return (
//         <NewsProviderClient initialNews={newsList}>
//             {/* Navbar موجود هنا علشان يظهر في كل صفحات الحدث */}
           
//             <div>{children}</div>
//         </NewsProviderClient>
//     );
// }
import React from "react";
import NewsProviderClient from "./NewsProviderClient";
import EventNavbar from "./navbar";
import { fetchEventDetails } from "@/lib/api"; // تأكد أن هذه الدالة تعمل في server-side (أو استبدلها بfetch)
import type { NewsItem } from "./news/contaxt";
import Script from "next/script";

interface Props {
    children: React.ReactNode;
    params: { id: string };
}

export default async function EventLayout({ children, params }: Props) {
    const eventId = params.id;

    // جلب بيانات الحدث على مستوى الـ layout (server-side)
    let eventData: any = null;
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
    const title =
        eventData?.awayTeam?.name && eventData?.homeTeam?.name
            ? `${eventData.awayTeam.name} vs ${eventData.homeTeam.name} - ${eventData.league?.name || "Game"} Live Score`
            : "Live Sports Event";

    const description =
        eventData?.league?.name
            ? `Follow the ${eventData.league.name} match between ${eventData.awayTeam?.name || "Away"} and ${eventData.homeTeam?.name || "Home"}. Live scores, stats, and updates.`
            : "Live sports scores and updates.";

    const images: string[] = [];
    if (eventData?.awayTeam?.logo) images.push(eventData.awayTeam.logo);
    if (eventData?.homeTeam?.logo) images.push(eventData.homeTeam.logo);
    if (eventData?.image) images.push(eventData.image);


    return (
        <>
            {eventData && (
                <Script id="event-structured-data" type="application/ld+json" strategy="afterInteractive">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SportsEvent",
                        "@id": `https://sports.digitalworldhorizon.com/event/${eventId}`,
                        name: title,
                        description,
                        startDate: eventData.dateEvent || new Date().toISOString(),
                        endDate: new Date(
                            new Date(eventData.dateEvent || new Date()).getTime() + 2 * 60 * 60 * 1000
                        ).toISOString(), // ساعتين افتراضياً
                        location: {
                            "@type": "Place",
                            name: eventData.venue?.name || "TBD",
                            address: {
                                "@type": "PostalAddress",
                                addressLocality: eventData.venue?.city || "",
                                addressCountry: eventData.venue?.country || "",
                            },
                        },
                        organizer: {
                            "@type": "SportsOrganization",
                            name: eventData.league?.name || "",
                            url: eventData.league?.url || undefined,
                        },
                        homeTeam: {
                            "@type": "SportsTeam",
                            name: eventData.homeTeam?.name || "Home Team",
                            logo: eventData.homeTeam?.logo || undefined,
                        },
                        awayTeam: {
                            "@type": "SportsTeam",
                            name: eventData.awayTeam?.name || "Away Team",
                            logo: eventData.awayTeam?.logo || undefined,
                        },
                        image: images.length > 0 ? images : undefined,
                    })}
                </Script>
            )}

            {/* OG Tags ديناميكية للحدث */}
            {eventData && (
                <head>
                    <meta property="og:title" content={title} />
                    <meta property="og:description" content={description} />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content={`https://sports.digitalworldhorizon.com/event/${eventId}`} />
                    {images[0] && <meta property="og:image" content={images[0]} />}
                    <meta property="og:site_name" content="Live Sports Results" />
                </head>
            )}
        
        <NewsProviderClient initialNews={newsList}>
           

            <div>{children}</div>
        </NewsProviderClient>
        </>
    );
}
