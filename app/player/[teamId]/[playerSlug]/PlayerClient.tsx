// app/event/[id]/player/[teamId]/[playerSlug]/PlayerClient.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Player } from "@/types/playerr";

interface PlayerClientProps {
    player: Player;
    sport: string;
    eventId: string;
    teamId: string;
    playerSlug: string;
}

function getSportColors(sport: string) {
    switch (sport.toLowerCase()) {
        case "nba": return { primary: "bg-orange-600", secondary: "bg-blue-600", accent: "bg-orange-500" };
        case "nfl": return { primary: "bg-red-700", secondary: "bg-blue-900", accent: "bg-red-600" };
        case "mlb": return { primary: "bg-blue-800", secondary: "bg-red-600", accent: "bg-blue-700" };
        case "nhl": return { primary: "bg-gray-800", secondary: "bg-red-700", accent: "bg-gray-700" };
        case "mls": return { primary: "bg-green-700", secondary: "bg-blue-500", accent: "bg-green-600" };
        default: return { primary: "bg-blue-800", secondary: "bg-blue-600", accent: "bg-blue-700" };
    }
}

function getSportSpecificStats(sport: string, stats: any) {
    const sportStats: Record<string, { label: string; value: any }[]> = {
        nfl: [
            { label: "Passing Yards", value: stats?.passingYards || "N/A" },
            { label: "Rushing Yards", value: stats?.rushingYards || "N/A" },
            { label: "Touchdowns", value: stats?.touchdowns || "N/A" },
            { label: "Receptions", value: stats?.receptions || "N/A" },
            { label: "Tackles", value: stats?.tackles || "N/A" },
            { label: "Interceptions", value: stats?.interceptions || "N/A" }
        ],
        nba: [
            { label: "Points Per Game", value: stats?.pointsPerGame || "N/A" },
            { label: "Rebounds Per Game", value: stats?.reboundsPerGame || "N/A" },
            { label: "Assists Per Game", value: stats?.assistsPerGame || "N/A" },
            { label: "Field Goal %", value: stats?.fieldGoalPercentage ? `${stats.fieldGoalPercentage}%` : "N/A" },
            { label: "3-Point %", value: stats?.threePointPercentage ? `${stats.threePointPercentage}%` : "N/A" },
            { label: "Free Throw %", value: stats?.freeThrowPercentage ? `${stats.freeThrowPercentage}%` : "N/A" }
        ],
        mlb: [
            { label: "Batting Average", value: stats?.battingAverage || "N/A" },
            { label: "Home Runs", value: stats?.homeRuns || "N/A" },
            { label: "RBI", value: stats?.rbi || "N/A" },
            { label: "ERA", value: stats?.era || "N/A" },
            { label: "Strikeouts", value: stats?.strikeouts || "N/A" },
            { label: "Wins", value: stats?.wins || "N/A" }
        ],
        nhl: [
            { label: "Goals", value: stats?.goals || "N/A" },
            { label: "Assists", value: stats?.assists || "N/A" },
            { label: "Points", value: stats?.points || "N/A" },
            { label: "Plus/Minus", value: stats?.plusMinus || "N/A" },
            { label: "Save Percentage", value: stats?.savePercentage ? `${stats.savePercentage}%` : "N/A" },
            { label: "Goals Against Average", value: stats?.goalsAgainstAverage || "N/A" }
        ],
        mls: [
            { label: "Goals", value: stats?.goals || "N/A" },
            { label: "Assists", value: stats?.assists || "N/A" },
            { label: "Shots", value: stats?.shots || "N/A" },
            { label: "Shot Accuracy", value: stats?.shotAccuracy ? `${stats.shotAccuracy}%` : "N/A" },
            { label: "Pass Accuracy", value: stats?.passAccuracy ? `${stats.passAccuracy}%` : "N/A" },
            { label: "Tackles", value: stats?.tackles || "N/A" }
        ]
    };

    return sportStats[sport.toLowerCase()] || [];
}

const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between py-3 border-b border-gray-100 last:border-b-0">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{value}</span>
    </div>
);

const StatsTable = ({ stats, sport }: { stats: any, sport: string }) => {
    const sportSpecificStats = getSportSpecificStats(sport, stats);

    if (!stats || Object.keys(stats).length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No statistics available for this season.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statistic</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {sportSpecificStats.map((stat, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {stat.label}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {String(stat.value)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default function PlayerClient({ player, sport, eventId, teamId, playerSlug }: PlayerClientProps) {
    const [activeTab, setActiveTab] = useState("overview");
    const sportColors = getSportColors(sport);
    const rd = player.rawData;

    return (
        <>
            <Header />

            <main className="min-h-screen bg-gray-50">
                {/* Player Header Section */}
                <div className={`${sportColors.primary} text-white py-8`}>
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative">
                                {player.photo ? (
                                    <Image
                                        src={player.photo}
                                        alt={player.name}
                                        width={150}
                                        height={150}
                                        className="rounded-full border-4 border-white shadow-lg"
                                    />
                                ) : (
                                    <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center">
                                        <span className="text-4xl font-bold text-gray-600">
                                            {player.name?.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 ${sportColors.secondary} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                                    #{rd?.jersey || "00"}
                                </div>
                            </div>

                            <div className="text-center md:text-left">
                                <h1 className="text-4xl font-bold">{player.fullName}</h1>
                                <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                                    <span className={`${sportColors.secondary} px-3 py-1 rounded-full`}>{player.positionName}</span>
                                    <span className="flex items-center gap-2">
                                        {player.teamLogo && (
                                            <Image src={player.teamLogo} alt={player.team || ""} width={24} height={24} />
                                        )}
                                        {player.team}
                                    </span>
                                </div>

                                <div className="mt-4 grid grid-cols-2 md:flex md:flex-wrap gap-4 text-sm">
                                    <div>
                                        <div className="font-semibold">Height</div>
                                        <div>{rd?.displayHeight || "N/A"}</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold">Weight</div>
                                        <div>{rd?.displayWeight || "N/A"}</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold">Age</div>
                                        <div>{rd?.age || "N/A"}</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold">Experience</div>
                                        <div>{rd?.experience?.years ? `${rd.experience.years} years` : "N/A"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="container mx-auto px-4 -mt-6">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="border-b border-gray-200">
                            <nav className="flex overflow-x-auto">
                                {[
                                    { id: "overview", label: "Overview" },
                                    { id: "stats", label: "Statistics" },
                                    { id: "bio", label: "Biography" },
                                    { id: "news", label: "News" },
                                    { id: "gamelog", label: "Game Log" }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-6 py-4 font-medium text-sm whitespace-nowrap ${activeTab === tab.id ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === "overview" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h2 className="text-xl font-bold mb-4 text-gray-800">Personal Information</h2>
                                        <div className="space-y-3">
                                            <InfoRow label="Full Name" value={rd?.fullName || "N/A"} />
                                            <InfoRow label="Position" value={rd?.position?.displayName || "N/A"} />
                                            <InfoRow label="Jersey Number" value={rd?.jersey ? `#${rd.jersey}` : "N/A"} />
                                            <InfoRow label="Height" value={rd?.displayHeight || "N/A"} />
                                            <InfoRow label="Weight" value={rd?.displayWeight || "N/A"} />
                                            <InfoRow label="Age" value={rd?.age ? `${rd.age} years` : "N/A"} />
                                            {rd?.dateOfBirth && (
                                                <InfoRow label="Date of Birth" value={new Date(rd.dateOfBirth).toLocaleDateString('en-US')} />
                                            )}
                                            <InfoRow label="Birthplace" value={rd?.birthPlace ? `${rd.birthPlace.city}, ${rd.birthPlace.state}, ${rd.birthPlace.country}` : "N/A"} />
                                            <InfoRow label="College" value={rd?.college?.name || "N/A"} />
                                            <InfoRow label="Experience" value={rd?.experience?.years ? `${rd.experience.years} years` : "N/A"} />
                                            <InfoRow label="Status" value={rd?.status?.name || "N/A"} />
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold mb-4 text-gray-800">Team & Links</h2>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-3 mb-4">
                                                {player.teamLogo && (
                                                    <Image src={player.teamLogo} alt={player.team || ""} width={40} height={40} />
                                                )}
                                                <span className="font-semibold text-gray-800">{player.team}</span>
                                            </div>

                                            <h3 className="font-semibold mb-2 text-gray-700">Official Links</h3>
                                            <div className="grid grid-cols-1 gap-2">
                                                {rd?.links?.slice(0, 5).map((link, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={link.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50 transition"
                                                    >
                                                        <span className="text-gray-700">{link.text}</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "stats" && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4 text-gray-800">Season Statistics</h2>
                                    <StatsTable stats={player.stats} sport={sport} />
                                </div>
                            )}

                            {activeTab === "bio" && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4 text-gray-800">Biography</h2>
                                    <div className="prose max-w-none">
                                        <p className="text-gray-700">
                                            {rd?.fullName} is a professional {sport.toUpperCase()} player who plays as a {rd?.position?.displayName} for the {player.team}.
                                            {rd?.college?.name ? ` He attended ${rd.college.name} and` : ""}
                                            was born in {rd?.birthPlace ? `${rd.birthPlace.city}, ${rd.birthPlace.state}` : "an unknown location"}.
                                        </p>

                                        <h3 className="font-semibold mt-6 mb-3 text-gray-800">Career Highlights</h3>
                                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                            <li>{rd?.experience?.years || "Several"} years of professional experience</li>
                                            <li>Consistent performance with a track record of achievements</li>
                                            <li>Key player for the {player.team}</li>
                                            {rd?.draft && <li>Drafted in round {rd.draft.round} of the {rd.draft.year} draft</li>}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {activeTab === "news" && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4 text-gray-800">Latest News</h2>
                                    <div className="space-y-4">
                                        <div className="p-4 border rounded-lg hover:bg-gray-50 transition">
                                            <h3 className="font-semibold text-gray-800">{player.fullName} Continues to Shine This Season</h3>
                                            <p className="text-sm text-gray-600 mt-1">October 15, 2023</p>
                                            <p className="mt-2 text-gray-700">The player continues to excel with his team, delivering outstanding performances in recent games.</p>
                                            <a href="#" className="text-blue-600 hover:underline text-sm mt-2 inline-block">Read more</a>
                                        </div>
                                        <div className="p-4 border rounded-lg hover:bg-gray-50 transition">
                                            <h3 className="font-semibold text-gray-800">Exclusive Interview with {player.fullName}</h3>
                                            <p className="text-sm text-gray-600 mt-1">October 10, 2023</p>
                                            <p className="mt-2 text-gray-700">A special conversation with the player about his goals and aspirations with the team this season.</p>
                                            <a href="#" className="text-blue-600 hover:underline text-sm mt-2 inline-block">Read more</a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "gamelog" && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4 text-gray-800">Game Log</h2>
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                                        <p className="text-yellow-700">Game log data is currently unavailable. We're working on updating this feature.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}