// types.ts
export interface Event {
    id: string
    homeTeam: string
    awayTeam: string
    intHomeScore: number | null
    intAwayScore: number | null
    status: string
    isLive: boolean
    league: string
    date: string
    venue?: string
    source?: string
}
