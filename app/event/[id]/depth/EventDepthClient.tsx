// app/event/[id]/depth/EventDepthClient.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

interface EventDepthClientProps {
    event: EventDetailsLoose;
    homeTeamRoster: TeamRoster | null;
    awayTeamRoster: TeamRoster | null;
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

export default function EventDepthClient({
    event,
    homeTeamRoster,
    awayTeamRoster,
    eventId
}: EventDepthClientProps) {
    const [selectedTeam, setSelectedTeam] = useState<"home" | "away">("home");

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

                <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Depth Chart</h1>

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

                        {/* المدربين */}
                        {currentRoster.coaches.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-2xl font-semibold mb-2">Coaches</h3>
                                <ul className="list-disc list-inside">
                                    {currentRoster.coaches.map(coach => (
                                        <li key={coach.id} className="text-gray-700 dark:text-gray-300">
                                            {coach.firstName} {coach.lastName} ({coach.experience || 0} yrs)
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* اللاعبين حسب المركز */}
                        {currentRoster.athletes.map(group => (
                            <div key={group.position} className="mb-6">
                                <h3 className="text-2xl font-semibold capitalize mb-4">{group.position}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {group.players.map(player => (
                                        <Link
                                            key={player.id}
                                            href={`/player/${currentTeam.id}/${player.id}?sport=${league.abbreviation?.toLowerCase() }`}
                                            className="border p-4 rounded shadow hover:shadow-lg transition block bg-gray-50 dark:bg-gray-700"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                {player.headshot?.href && (
                                                    <Image
                                                        src={player.headshot.href}
                                                        alt={player.displayName}
                                                        width={50}
                                                        height={50}
                                                        className="rounded-full"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-semibold text-gray-800 dark:text-white">{player.displayName}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                                        {player.position?.abbreviation || "N/A"} #{player.jersey || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                                <p>Height: {player.displayHeight || "N/A"}</p>
                                                <p>Weight: {player.displayWeight || "N/A"}</p>
                                                <p>Age: {player.age || "N/A"}</p>
                                                <p>Status: {player.status?.name || "N/A"}</p>
                                                {player.college && <p>College: {player.college.name}</p>}
                                            </div>
                                        </Link>
                                    ))}
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