import { use } from "react";

async function fetchRoster(team: string) {
    const res = await fetch(`/api/nfl/team/${team}/depth-chart`);
    const data = await res.json();
    return data.depthChart;
}

export default function RosterPage({ params }: { params: { team: string } }) {
    const roster = use(fetchRoster(params.team));
    return (
        <div>
            <h1>{params.team.toUpperCase()} Roster</h1>
            <pre>{JSON.stringify(roster, null, 2)}</pre>
        </div>
    );
}
