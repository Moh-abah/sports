// app/nfl/matches/[teamA]/[teamB]/[date]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Params = {
    teamA: string;
    teamB: string;
    date: string;
};

export default async function MatchPage({ params }: { params: Params }) {
    const { teamA, teamB, date } = params;

    // جلب السكوربورد
    const res = await fetch(
        "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
        { cache: "no-store" }
    );
    if (!res.ok) notFound();
    const data = await res.json();

    const targetDate = decodeURIComponent(date);

    const isSameGame = (event: any) => {
        const comp = event?.competitions?.[0];
        if (!comp) return false;
        const abbrs = comp.competitors.map((c: any) => c.team.abbreviation?.toUpperCase());
        const hasTeams = abbrs.includes(teamA.toUpperCase()) && abbrs.includes(teamB.toUpperCase());
        const sameDate = String(event.date).startsWith(targetDate) || new Date(event.date).toISOString().startsWith(targetDate);
        return hasTeams && sameDate;
    };

    const match = (data?.events || []).find(isSameGame);
    if (!match) notFound();

    const comp = match.competitions[0];
    const home = comp.competitors.find((c: any) => c.homeAway === "home");
    const away = comp.competitors.find((c: any) => c.homeAway === "away");

    // جلب قائمة اللاعبين لكل فريق
    const [homeRosterRes, awayRosterRes] = await Promise.all([
        fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${home.team.id}/roster`),
        fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${away.team.id}/roster`),
    ]);

    const [homeRosterData, awayRosterData] = await Promise.all([
        homeRosterRes.json(),
        awayRosterRes.json()
    ]);

    console.log("Home Roster Data:", homeRosterData);
    console.log("Away Roster Data:", awayRosterData);

    const homePlayers = homeRosterData.athletes
        .map((group: any) => group.items)
        .flat();

    const awayPlayers = awayRosterData.athletes
        .map((group: any) => group.items)
        .flat();

    console.log("Home Players:", homePlayers);
    console.log("Away Players:", awayPlayers);


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">{home.team.displayName} vs {away.team.displayName}</h1>
            <p>Date: {match.date}</p>
            <p>Venue: {comp.venue?.fullName || "TBD"}</p>
            <p>Status: {match.status.type.description}</p>
            <p>Score: {home.score ?? "-"} - {away.score ?? "-"}</p>

            <div className="mt-6">
                <h2 className="text-xl font-bold mb-2">{home.team.displayName} Players</h2>
                <ul>
                    {homePlayers.map((player: any) => (
                        <li key={player.id}>
                            <Link href={`/nfl/player/${home.team.id}/${player.id}`} className="text-blue-500 hover:underline">
                                {player.displayName} ({player.position?.abbreviation})
                            </Link>

                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-6">
                <h2 className="text-xl font-bold mb-2">{away.team.displayName} Players</h2>
                <ul>
                    {awayPlayers.map((player: any) => (
                        <Link href={`/nfl/player/${away.team.id}/${player.id}`} className="text-blue-500 hover:underline">
                            {player.displayName} ({player.position?.abbreviation})
                        </Link>

                    ))}
                </ul>
            </div>

            <div className="mt-6 flex gap-4">
                <Link href={`/nfl/teams/${home.team.abbreviation}/depth-chart`} className="text-blue-500 hover:underline">{home.team.displayName} Depth Chart</Link>
                <Link href={`/nfl/teams/${home.team.abbreviation}/roster`} className="text-blue-500 hover:underline">{home.team.displayName} Roster</Link>
                <Link href={`/nfl/teams/${home.team.abbreviation}/schedule`} className="text-blue-500 hover:underline">{home.team.displayName} Schedule</Link>
            </div>

            <div className="mt-6 flex gap-4">
                <Link href={`/nfl/teams/${away.team.abbreviation}/depth-chart`} className="text-blue-500 hover:underline">{away.team.displayName} Depth Chart</Link>
                <Link href={`/nfl/teams/${away.team.abbreviation}/roster`} className="text-blue-500 hover:underline">{away.team.displayName} Roster</Link>
                <Link href={`/nfl/teams/${away.team.abbreviation}/schedule`} className="text-blue-500 hover:underline">{away.team.displayName} Schedule</Link>
            </div>
        </div>
    );
}
