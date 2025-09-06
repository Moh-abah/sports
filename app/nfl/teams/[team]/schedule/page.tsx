// E:\sport\app\nfl\teams\[team]\schedule\page.tsx

export default function SchedulePage({ params }: { params: { team: string } }) {
    return (
        <div className="p-6">
            <h1 className="text-xl font-bold">Schedule for {params.team}</h1>
            <p>Coming soon: schedule API integration...</p>
        </div>
    );
}
