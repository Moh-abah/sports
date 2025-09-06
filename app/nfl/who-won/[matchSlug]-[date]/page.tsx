// E:\sport\app\nfl\who-won\page.tsx

import { fetchScoreboard } from "@/lib/api";

export default async function WhoWonPage() {
    const data = await fetchScoreboard();

    const winners = data.events
        .map((match: any) => {
            const competition = match.competitions[0];
            const winner = competition.competitors.find((c: any) => c.winner === true);
            return winner?.team?.displayName;
        })
        .filter(Boolean);

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Today's Winners</h1>
            <ul className="space-y-2">
                {winners.map((team: string, i: number) => (
                    <li key={i} className="text-green-600">
                        {team}
                    </li>
                ))}
            </ul>
        </div>
    );
}
