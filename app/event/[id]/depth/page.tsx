// app/event/[id]/depth/page.tsx (Server Component)
import { fetchEventDetails, fetchTeamRoster } from "@/lib/api";
import EventDepthClient from "./EventDepthClient";
import Header from "@/components/header";
import Footer from "@/components/footer";
import EventNavbar from "../navbar";
import Link from "next/link";
import { Metadata } from "next";


interface PageProps {
    params: Promise<{ id: string }>;
}

// تعريف الأنواع
interface TeamShort {
    id?: string;
    name?: string;
    displayName?: string;
    abbreviation?: string;
    logo?: string;
    score?: number;
    standingSummary?: string;
    recordSummary?: string;
}

interface EventDetailsLoose {
    id?: string;
    league?: { id?: string; name?: string; abbreviation?: string };
    homeTeam?: TeamShort;
    awayTeam?: TeamShort;
    status?: { description?: string; state?: string; period?: number; displayClock?: string; isLive?: boolean };
    dateEvent?: string;
    venue?: { id?: string; name?: string; city?: string; country?: string; capacity?: number | null };
    season?: { year?: number; type?: number; name?: string };
    links?: { web?: string; mobile?: string };
}

interface Coach {
    id: string;
    firstName: string;
    lastName: string;
    experience?: number;
}

interface Player {
    id: string;
    displayName: string;
    position?: { abbreviation?: string };
    jersey?: string;
    headshot?: { href: string };
    displayHeight?: string;
    displayWeight?: string;
    age?: number;
    status?: { name?: string };
    college?: { name?: string };
}

interface AthleteGroup {
    position: string;
    players: Player[];
}

interface TeamRoster {
    team: TeamShort;
    coaches: Coach[];
    athletes: AthleteGroup[];
}

// تحديد مسار الرياضة حسب ESPN API
function getSportPath(sport: string): string {
    switch (sport) {
        case "nba": return "basketball/nba";
        case "nfl": return "football/nfl";
        case "mlb": return "baseball/mlb";
        case "nhl": return "hockey/nhl";
        case "mls": return "soccer/usa.1";
        default: return "basketball/nba"; // Default fallback
    }
}

function getSportFromEventId(eventId: string): string {
    return eventId.split("_")[0].toLowerCase();
}




export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const event = await fetchEventDetails(id);
    const home = event?.homeTeam;
    const away = event?.awayTeam;

    return {
        title: event ? `${home?.name} vs ${away?.name} | ${event.league?.name}` : "Event Details",
        description: event
            ? `Live score and details for ${home?.name} vs ${away?.name} - ${event.league?.name}.`
            : "Event details not available.",
        keywords: event
            ? `Live Score, ${home?.name}, ${away?.name}, ${event.league?.abbreviation}, Sports, Teams, Players`
            : "Sports, Event",
        openGraph: {
            title: event ? `${home?.name} vs ${away?.name}` : "Event Details",
            description: event ? `Live score for ${home?.name} vs ${away?.name}` : "Event details",
            url: `https://sports.digitalworldhorizon.com/event/${id}/depth`,
            siteName: "Live Sports Results",
            images: [
                { url: home?.logo || "/logo.png", width: 1200, height: 630, alt: home?.name || "Event" }
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: event ? `${home?.name} vs ${away?.name}` : "Event Details",
            description: event ? `Live score for ${home?.name} vs ${away?.name}` : "Event details",
            images: [home?.logo || "/logo.png"],
        },
    };
}


export default async function EventDepthPage({ params }: PageProps) {
    const { id } = await params;
    let event: EventDetailsLoose | null = null;
    let homeTeamRoster: TeamRoster | null = null;
    let awayTeamRoster: TeamRoster | null = null;
    let error: string | null = null;

    try {
        // جلب بيانات الحدث
        event = await fetchEventDetails(id);

        if (event) {
            const sport = getSportFromEventId(id);
           
            // جلب قوائم الفريقين إذا كانا موجودين
            if (event.homeTeam?.id) {
                homeTeamRoster = await fetchTeamRoster(event.homeTeam.id, getSportPath(sport));
                
            }

            if (event.awayTeam?.id) {
                awayTeamRoster = await fetchTeamRoster(event.awayTeam.id, getSportPath(sport));
               
            }
        }
    } catch (e: any) {
        console.error("Error fetching data:", e);
        error = e?.message || "Failed to fetch event or roster data";
    }
    // تجهيز JSON-LD للـ Rich Results
    const jsonLd = event ? {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        "name": `${event.homeTeam?.name} vs ${event.awayTeam?.name}`,
        "startDate": event.dateEvent, // استخدم التاريخ الفعلي
        "eventStatus": (() => {
            if (!event.status) return "https://schema.org/EventScheduled";
            switch (event.status.state) {
                case "pre": return "https://schema.org/EventScheduled";
                case "in": return "https://schema.org/EventInProgress";
                case "post": return "https://schema.org/EventCompleted";
                default: return "https://schema.org/EventScheduled";
            }
        })(),
        "location": event.venue ? {
            "@type": "SportsActivityLocation",
            "name": event.venue.name,
            "address": {
                "@type": "PostalAddress",
                "addressLocality": event.venue.city,
                "addressCountry": event.venue.country
            }
        } : undefined,
        "competitor": [
            event.homeTeam ? {
                "@type": "SportsTeam",
                "name": event.homeTeam.name,
                "logo": event.homeTeam.logo,
                "score": event.homeTeam.score,
                "standingSummary": event.homeTeam.standingSummary,
                "recordSummary": event.homeTeam.recordSummary,
                "coaches": homeTeamRoster?.coaches?.map(c => ({
                    "@type": "Person",
                    "name": `${c.firstName} ${c.lastName}`,
                    "experience": c.experience
                })),
                "athletes": homeTeamRoster?.athletes?.map(group => ({
                    "position": group.position,
                    "players": group.players.map(p => ({
                        "@type": "Person",
                        "name": p.displayName,
                        "jersey": p.jersey,
                        "position": p.position?.abbreviation,
                        "headshot": p.headshot?.href,
                        "height": p.displayHeight,
                        "weight": p.displayWeight,
                        "age": p.age,
                        "status": p.status?.name,
                        "college": p.college?.name
                    }))
                }))
            } : undefined,
            event.awayTeam ? {
                "@type": "SportsTeam",
                "name": event.awayTeam.name,
                "logo": event.awayTeam.logo,
                "score": event.awayTeam.score,
                "standingSummary": event.awayTeam.standingSummary,
                "recordSummary": event.awayTeam.recordSummary,
                "coaches": awayTeamRoster?.coaches?.map(c => ({
                    "@type": "Person",
                    "name": `${c.firstName} ${c.lastName}`,
                    "experience": c.experience
                })),
                "athletes": awayTeamRoster?.athletes?.map(group => ({
                    "position": group.position,
                    "players": group.players.map(p => ({
                        "@type": "Person",
                        "name": p.displayName,
                        "jersey": p.jersey,
                        "position": p.position?.abbreviation,
                        "headshot": p.headshot?.href,
                        "height": p.displayHeight,
                        "weight": p.displayWeight,
                        "age": p.age,
                        "status": p.status?.name,
                        "college": p.college?.name
                    }))
                }))
            } : undefined
        ].filter(Boolean),
        "url": `https://sports.digitalworldhorizon.com/event/${id}/depth`
    } : null;

    


    // إذا كان هناك خطأ، عرض صفحة الخطأ
    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
                <Header />
                <EventNavbar eventId={id} />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md">
                        <p className="text-red-700 dark:text-red-300">{error}</p>
                    </div>
                    <div className="mt-6">
                        <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            Back to Home
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // إذا لم يتم العثور على الحدث
    if (!event) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
                <Header />
                <EventNavbar eventId={id} />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">Event not found.</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

  
    return (
        <>
            {/* Structured Data */}
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}

        <EventDepthClient
            event={event}
            homeTeamRoster={homeTeamRoster}
            awayTeamRoster={awayTeamRoster}
            eventId={id}
        />
        </>
    );
}
