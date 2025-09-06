// app/event/[id]/roster/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";

import { fetchEventDetails, fetchTeamRoster } from "@/lib/api";
import EventNavbar from "../navbar";

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
    position?: string;
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
    experience?: { years?: number };
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

// مكون بطاقة الفريق
const TeamCard: React.FC<{ team?: TeamShort }> = ({ team }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white p-2 flex items-center justify-center shadow">
                {team?.logo ? (
                    <img src={team.logo} alt={team.name} className="w-full h-full object-contain" loading="lazy" />
                ) : (
                    <div className="text-sm font-bold text-gray-500">{team?.abbreviation || "N/A"}</div>
                )}
            </div>
            <div className="mt-2 text-center font-semibold">{team?.name}</div>
            <div className="text-3xl font-extrabold mt-1">
                {team?.score ?? 0}
            </div>
        </div>
    );
};
// استخراج نوع الرياضة من eventId
function getSportFromEventId(eventId: string): string {
    return eventId.split("_")[0].toLowerCase();
}

// تحديد مسار الرياضة حسب ESPN API
function getSportPath(sport: string): string {
    switch (sport) {
        case "nba": return "basketball/nba";
        case "nfl": return "football/nfl";
        case "mlb": return "baseball/mlb";
        case "nhl": return "hockey/nhl";
        case "mls": return "soccer/usa.1";
        default: throw new Error(`Unsupported sport type: ${sport}`);
    }
}


export default function EventRosterPage() {
    const params = useParams();
    const eventId = params?.id as string;

    const [event, setEvent] = useState<EventDetailsLoose | null>(null);
    const [homeTeamRoster, setHomeTeamRoster] = useState<TeamRoster | null>(null);
    const [awayTeamRoster, setAwayTeamRoster] = useState<TeamRoster | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTeam, setSelectedTeam] = useState<"home" | "away">("home");
    const [activeTab, setActiveTab] = useState<"players" | "coaches">("players");

    useEffect(() => {
        if (!eventId) return;

        const loadEventAndRosters = async () => {
            try {
                setLoading(true);
                const eventData = await fetchEventDetails(eventId);
                if (!eventData) {
                    setError("No event data returned from API");
                    return;
                }

                setEvent(eventData);
                const sport = getSportFromEventId(eventId);

                if (eventData.homeTeam?.id) {
                    const homeRoster = await fetchTeamRoster(eventData.homeTeam.id, getSportPath(sport));
                    setHomeTeamRoster(homeRoster);
                }

                if (eventData.awayTeam?.id) {
                    const awayRoster = await fetchTeamRoster(eventData.awayTeam.id, getSportPath(sport));
                    setAwayTeamRoster(awayRoster);
                }

            } catch (e: any) {
                setError(e?.message || "Failed to fetch event or roster data");
            } finally {
                setLoading(false);
            }
        };

        loadEventAndRosters();
    }, [eventId]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
                <Header />
                <EventNavbar eventId={eventId} />
                <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading roster...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
                <Header />
                <EventNavbar eventId={eventId} />
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

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
                <Header />
                <EventNavbar eventId={eventId} />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">Event not found.</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // استخراج البيانات من event
    const league = event.league ?? {};
    const season = event.season ?? {};
    const home = event.homeTeam ?? {};
    const away = event.awayTeam ?? {};
    const status = event.status ?? {};
    const venue = event.venue ?? {};
    const { date, time } = formatDateTime(event.dateEvent);

    // تحديد بيانات الفريق المحدد
    const currentRoster = selectedTeam === "home" ? homeTeamRoster : awayTeamRoster;
    const currentTeam = selectedTeam === "home" ? home : away;

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
                                <TeamCard team={home} />
                                <div className="text-center">
                                    <div className="text-xl font-bold bg-white inline-block px-4 py-2 rounded-lg text-blue-800">VS</div>
                                </div>
                                <TeamCard team={away} />
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

                <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Team Roster</h1>

                {/* اختيار الفريق */}
                <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setSelectedTeam("home")}
                        className={`px-4 py-2 font-medium ${selectedTeam === "home" ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}
                    >
                        {home.name || "Home Team"}
                    </button>
                    <button
                        onClick={() => setSelectedTeam("away")}
                        className={`px-4 py-2 font-medium ${selectedTeam === "away" ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}
                    >
                        {away.name || "Away Team"}
                    </button>
                </div>

                {!currentRoster ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                        <p className="text-gray-600 dark:text-gray-400">Roster data not available for this team.</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        {/* Header الفريق */}
                        <div className="flex items-center gap-4 mb-6">
                            {currentTeam.logo && (
                                <Image
                                    src={currentTeam.logo}
                                    alt={currentTeam.displayName || currentTeam.name || "Team"}
                                    width={100}
                                    height={100}
                                    className="w-16 h-16 object-contain"
                                />
                            )}
                            <div>
                                <h2 className="text-3xl font-bold">{currentTeam.displayName || currentTeam.name} Roster</h2>
                                <p className="text-sm text-gray-500">
                                    {currentTeam.standingSummary || currentTeam.recordSummary || ""}
                                </p>
                            </div>
                        </div>

                        {/* تبويبات اللاعبين والمدربين */}
                        <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setActiveTab("players")}
                                className={`px-4 py-2 font-medium ${activeTab === "players" ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}
                            >
                                Players
                            </button>
                            <button
                                onClick={() => setActiveTab("coaches")}
                                className={`px-4 py-2 font-medium ${activeTab === "coaches" ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}
                            >
                                Coaches
                            </button>
                        </div>

                        {activeTab === "coaches" && (
                            <div className="mb-6">
                                <h3 className="text-2xl font-semibold mb-4">Coaching Staff</h3>
                                {currentRoster.coaches.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {currentRoster.coaches.map(coach => (
                                            <div key={coach.id} className="border p-4 rounded shadow bg-gray-50 dark:bg-gray-700">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                        <span className="font-bold text-blue-600 dark:text-blue-300">
                                                            {coach.firstName?.[0]}{coach.lastName?.[0]}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800 dark:text-white">
                                                            {coach.firstName} {coach.lastName}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                                            {coach.position || "Coach"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                                    <p>Experience: {coach.experience || 0} years</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-400">No coaching data available.</p>
                                )}
                            </div>
                        )}

                        {activeTab === "players" && (
                            <>
                                {/* إحصائيات سريعة */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                                            {currentRoster.athletes.reduce((total, group) => total + group.players.length, 0)}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">Total Players</p>
                                    </div>
                                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                                        <p className="text-2xl font-bold text-green-600 dark:text-green-300">
                                            {currentRoster.athletes.filter(group => group.position === "QB").reduce((total, group) => total + group.players.length, 0)}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">Quarterbacks</p>
                                    </div>
                                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
                                        <p className="text-2xl font-bold text-red-600 dark:text-red-300">
                                            {currentRoster.athletes.filter(group => group.position === "WR").reduce((total, group) => total + group.players.length, 0)}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">Receivers</p>
                                    </div>
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                                            {currentRoster.athletes.filter(group => group.position === "DL").reduce((total, group) => total + group.players.length, 0)}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">Defensive Linemen</p>
                                    </div>
                                </div>

                                {/* اللاعبين حسب المركز */}
                                {currentRoster.athletes.map(group => (
                                    <div key={group.position} className="mb-6">
                                        <h3 className="text-2xl font-semibold capitalize mb-4">
                                            {group.position} ({group.players.length})
                                        </h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                                                <thead className="bg-gray-100 dark:bg-gray-600">
                                                    <tr>
                                                        <th className="py-3 px-4 text-left">Player</th>
                                                        <th className="py-3 px-4 text-left">Number</th>
                                                        <th className="py-3 px-4 text-left">Height</th>
                                                        <th className="py-3 px-4 text-left">Weight</th>
                                                        <th className="py-3 px-4 text-left">Age</th>
                                                        <th className="py-3 px-4 text-left">College</th>
                                                        <th className="py-3 px-4 text-left">Experience</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {group.players.map((player, index) => (
                                                        <tr key={player.id} className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-700"}>
                                                            <td className="py-3 px-4">
                                                                <Link
                                                                    href={`/event/${eventId}/player/${currentTeam.id}/${player.id}?sport=${league.abbreviation.toLowerCase()}`}
                                                                    className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-300"
                                                                >
                                                                    {player.headshot?.href && (
                                                                        <Image
                                                                            src={player.headshot.href}
                                                                            alt={player.displayName}
                                                                            width={40}
                                                                            height={40}
                                                                            className="rounded-full"
                                                                        />
                                                                    )}
                                                                    <span className="font-medium">{player.displayName}</span>
                                                                </Link>
                                                            </td>
                                                            <td className="py-3 px-4">#{player.jersey || "N/A"}</td>
                                                            <td className="py-3 px-4">{player.displayHeight || "N/A"}</td>
                                                            <td className="py-3 px-4">{player.displayWeight || "N/A"}</td>
                                                            <td className="py-3 px-4">{player.age || "N/A"}</td>
                                                            <td className="py-3 px-4">{player.college?.name || "N/A"}</td>
                                                            <td className="py-3 px-4">{player.experience?.years || "N/A"} yrs</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}