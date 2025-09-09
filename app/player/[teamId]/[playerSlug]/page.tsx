// app/event/[id]/player/[teamId]/[playerSlug]/page.tsx (Server Component)
import { notFound } from "next/navigation";
import Head from "next/head";
import { Player } from "@/types/playerr";

import PlayerClient from "./PlayerClient";



export const revalidate = 864000; 
// تعريف الأنواع
interface PlayerPageProps {
    params: Promise<{
        id: string;
        teamId: string;
        playerSlug: string
    }>;
    searchParams: Promise<{ sport?: string }>;
}

function getSportPath(sport: string): string {
    switch (sport.toLowerCase()) {
        case "nba": return "basketball/nba";
        case "nfl": return "football/nfl";
        case "mlb": return "baseball/mlb";
        case "nhl": return "hockey/nhl";
        case "mls": return "soccer/usa.1";
        default: return "football/nfl";
    }
}

async function fetchPlayerFromTeam(teamId: string, playerId: string, sportPath: string): Promise<Player | null> {
    try {
        const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${sportPath}/teams/${teamId}/roster`, {
            cache: "no-store"
        });

        if (!res.ok) return null;

        const data = await res.json();
        const groups = data.athletes || [];

        for (const group of groups) {
            for (const player of group.items || []) {
                if (player.id === playerId) {
                    return {
                        id: player.id,
                        name: player.displayName,
                        fullName: player.fullName,
                        photo: player.headshot?.href,
                        team: data.team?.displayName,
                        teamLogo: data.team?.logo,
                        position: player.position?.abbreviation,
                        positionName: player.position?.displayName,
                        jersey: player.jersey,
                        stats: player.stats || {},
                        rawData: player,
                    };
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Error fetching player:", error);
        return null;
    }
}

export default async function PlayerPage({ params, searchParams }: PlayerPageProps) {
    const { id, teamId, playerSlug } = await params;
    const { sport = "nfl" } = await searchParams;
    const sportPath = getSportPath(sport);

    const player = await fetchPlayerFromTeam(teamId, playerSlug, sportPath);

    if (!player) {
        notFound();
    }
    const canonicalUrl = `https://sports.digitalworldhorizon.com/player/${teamId}/${player.id}?sport=${encodeURIComponent(sport)}`;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": player.fullName,
        "image": player.photo,
        "url": `https://sports.digitalworldhorizon.com/player/${teamId}/${playerSlug}`,
        "jobTitle": player.position,
        "memberOf": {
            "@type": "SportsTeam",
            "name": player.team,
            "logo": player.teamLogo
        },
        "identifier": player.id,
        "additionalProperty": [
            { "@type": "PropertyValue", "name": "Jersey Number", "value": player.jersey },
            { "@type": "PropertyValue", "name": "Position", "value": player.position },
            { "@type": "PropertyValue", "name": "Team", "value": player.team },
        ]
    };
    

    const metaTitle = `${player.fullName} - ${player.team} | ${sport.toUpperCase()} Player Profile`;
    const metaDescription = `Profile, stats, and news for ${player.fullName}, ${player.position} of ${player.team}.`;

    const additionalProperty: any[] = [];
    if (player.jersey) additionalProperty.push({ "@type": "PropertyValue", name: "Jersey Number", value: String(player.jersey) });
    if (player.position?.abbreviation) additionalProperty.push({ "@type": "PropertyValue", name: "Position", value: player.position.abbreviation });
    if (player.team) additionalProperty.push({ "@type": "PropertyValue", name: "Team", value: player.team });
    if (player.dateOfBirth) additionalProperty.push({ "@type": "PropertyValue", name: "BirthDate", value: player.dateOfBirth });
    if (player.displayHeight) additionalProperty.push({ "@type": "PropertyValue", name: "Height", value: player.displayHeight });
    if (player.displayWeight) additionalProperty.push({ "@type": "PropertyValue", name: "Weight", value: player.displayWeight });
    if (player.college?.name) additionalProperty.push({ "@type": "PropertyValue", name: "College", value: player.college.name });
    if (typeof player.experience?.years === "number") additionalProperty.push({ "@type": "PropertyValue", name: "ExperienceYears", value: String(player.experience.years) });

    if (additionalProperty.length) jsonLd.additionalProperty = additionalProperty;

    // mainEntityOfPage helpful for Google
    jsonLd.mainEntityOfPage = canonicalUrl;

    // GOOGLEBOT log (مفيد أثناء التطوير/بناء)
    try {
        console.log("===== GOOGLEBOT VIEW =====");
        console.log("META TITLE:", metaTitle);
        console.log("META DESCRIPTION:", metaDescription);
        console.log("CANONICAL:", canonicalUrl);
        console.log("JSON-LD:", JSON.stringify(jsonLd, null, 2));
        console.log("===========================");
    } catch (e) {
        // ignore logging issues
    }

    
    
    return (
        <>
            <Head>
                <title>{metaTitle}</title>
                
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content={`${player.fullName}, ${player.team}, ${player.position}, ${sport.toUpperCase()} player, stats, news`} />

                <link rel="canonical" href={canonicalUrl} />

                <meta property="og:type" content="profile" />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:site_name" content="Live Sports Results" />
                <meta property="og:url" content={canonicalUrl} />
                {player.headshot?.href && <meta property="og:image" content={player.headshot.href} />}

                {/* Twitter */}
                <meta name="twitter:card" content={player.headshot?.href ? "summary_large_image" : "summary"} />
                <meta name="twitter:title" content={metaTitle} />
                <meta name="twitter:description" content={metaDescription} />
                {player.headshot?.href && <meta name="twitter:image" content={player.headshot.href} />}

                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            
            </Head>
            

            <PlayerClient
                player={player}
                sport={sport}
                eventId={id}
                teamId={teamId}
                playerSlug={playerSlug}
            />
        </>
    );
}




































