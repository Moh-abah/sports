// E:\sport\app\nfl\page.tsx

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchScoreboard } from "@/lib/api";

export default function NFLHub() {
    const [matches, setMatches] = useState<any[]>([]);

    useEffect(() => {
        async function loadMatches() {
            const data = await fetchScoreboard();
            setMatches(data.events || []);
        }
        loadMatches();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">🏈 NFL Hub</h1>
            <div className="mb-6">
                <h2 className="text-xl mb-2">Today's Matches</h2>
                <ul className="space-y-2">
                    {matches.map((match) => {
                        const comp = match.competitions[0];
                        const home = comp.competitors.find((c: any) => c.homeAway === "home");
                        const away = comp.competitors.find((c: any) => c.homeAway === "away");
                        return (
                            <li key={match.id}>
                                <Link
                                    className="text-blue-600 hover:underline"
                                    href={`/nfl/matches/${home.team.abbreviation}/${away.team.abbreviation}/${match.date}`}
                                >
                                    {home.team.displayName} vs {away.team.displayName}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div>
                <Link href="/nfl/who-won" className="text-green-600 font-medium">
                    Check Who Won Today
                </Link>
            </div>
        </div>
    );
}
