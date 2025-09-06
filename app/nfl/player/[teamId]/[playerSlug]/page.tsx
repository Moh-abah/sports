"use client";
// app/nfl/player/[teamId]/[playerSlug]/page.tsx
import { notFound } from "next/navigation";
import Head from "next/head";
import { Player } from "@/types/playerr";
import PlayerClient from "./Tabs";


/**
 * تحديد مسار نوع الرياضة بناءً على ESPN API
 */
function getSportPath(sport: string): string {
    switch (sport) {
        case "nba":
            return "basketball/nba";
        case "nfl":
            return "football/nfl";
        case "mlb":
            return "baseball/mlb";
        case "nhl":
            return "hockey/nhl";
        case "mls":
            return "soccer/usa.1"; // MLS مساره بهذا الشكل
        default:
            throw new Error(`Unsupported sport type: ${sport}`);
    }
}


async function fetchPlayerFromTeam(teamId: string, playerId: string): Promise<Player | null> {
    const res = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamId}/roster`,
        { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();

    const groups = data.athletes || [];

    for (const group of groups) {
        for (const player of group.items || []) {
            if (player.id === playerId) {
                return {
                    id: player.id,
                    name: player.displayName,
                    photo: player.headshot?.href,
                    team: data.team?.displayName,
                    position: player.position?.abbreviation,
                    stats: player.stats || {},
                    rawData: player,
                    
                };
                
            }
        }
    }
    
    return null;
}

export default async function PlayerPage({
    params,
}: {
    params: { playerSlug: string; teamId: string };
}) {
    const { playerSlug, teamId } = params;
    const player = await fetchPlayerFromTeam(teamId, playerSlug);
    if (!player) notFound();

    

    const rd = player.rawData!;
    const pageTitle = `${rd.fullName} - ${player.team} | NFL Player Profile`;
    const pageDescription = `${rd.fullName}, ${rd.position.displayName} of ${player.team}. Jersey #${rd.jersey}, Height: ${rd.displayHeight}, Weight: ${rd.displayWeight}, Age: ${rd.age}, College: ${rd.college.name}. Full stats and career info.`;

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={player.photo || ""} />
                <meta property="og:type" content="profile" />
            </Head>

            <PlayerClient player={player} />
        </>
    );
}