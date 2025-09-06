// app/nfl/teams/[team]/depth-chart/page.tsx
import { fetchTeamRoster } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

export default async function DepthChartPage({ params }: { params: { team: string } }) {
    const data = await fetchTeamRoster(params.team);
    if (!data) return <div>Roster not found</div>;

    return (
        <div className="p-6">
            {/* Header الفريق */}
            <div className="flex items-center gap-4 mb-6">
                <Image src={data.team.logo} alt={data.team.displayName} width={100} height={100} />
                <div>
                    <h1 className="text-3xl font-bold">{data.team.displayName} Roster</h1>
                    <p className="text-sm text-gray-500">{data.team.standingSummary || data.team.recordSummary}</p>
                </div>
            </div>

            {/* المدربين */}
            {data.coaches.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Coaches</h2>
                    <ul className="list-disc list-inside">
                        {data.coaches.map(coach => (
                            <li key={coach.id}>
                                {coach.firstName} {coach.lastName} ({coach.experience || 0} yrs)
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* اللاعبين حسب المركز */}
            {data.athletes.map(group => (
                <div key={group.position} className="mb-6">
                    <h2 className="text-2xl font-semibold capitalize mb-4">{group.position}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {group.players.map(player => (
                            <Link
                                key={player.id}
                                href={`/nfl/player/${data.team.id}/${player.id}`}
                                className="border p-4 rounded shadow hover:shadow-lg transition block"
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
                                        <p className="font-semibold">{player.displayName}</p>
                                        <p className="text-sm">{player.position?.abbreviation || "N/A"} #{player.jersey || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">
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
    );
}
