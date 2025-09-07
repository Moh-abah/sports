

"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { fetchEventDetails } from "@/lib/api"
import Script from "next/script"
import EventNavbar from "./navbar"
import { useNews } from "./news/contaxt"

// Types (نقلنا الأنواع هنا)
type Maybe<T> = T | null | undefined

interface TeamShort {
    id?: string
    name?: string
    displayName?: string
    abbreviation?: string
    logo?: string
    score?: number
    record?: any[]
}

interface BoxTeam {
    team?: { displayName?: string; name?: string }
    score?: number
    linescores?: any[]
    statistics?: any[]
    record?: any[]
}

interface NewsItem { headline?: string; title?: string; description?: string; published?: string; images?: Array<{ url: string; name?: string }>; links?: any }
interface EventDetailsLoose {
    id?: string
    league?: { id?: string; name?: string; abbreviation?: string; slug?: string; links?: any[] }
    homeTeam?: TeamShort
    awayTeam?: TeamShort
    status?: { description?: string; state?: string; period?: number; displayClock?: string; isLive?: boolean }
    dateEvent?: string
    venue?: { id?: string; name?: string; city?: string; country?: string; capacity?: number | null; indoor?: boolean }
    season?: { year?: number; type?: number; name?: string }
    description?: string
    highlights?: any[]
    news?: NewsItem[] | { articles?: NewsItem[] }
    boxscore?: { teams?: BoxTeam[]; players?: any[] }
    competitors?: any[]
    playByPlay?: any[]
    links?: { web?: string; mobile?: string; tickets?: any[] }
    gameType?: string
    seriesSummary?: string
}

// Utilities (نقلنا الدوال المساعدة هنا)
const safeNumber = (v: any, fallback = 0) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : fallback
}
const safeString = (v: any, fallback = "") => (v == null ? fallback : String(v))
const formatDateTime = (iso?: string) => {
    if (!iso) return { date: "TBA", time: "TBA" }
    try {
        const d = new Date(iso)
        const date = new Intl.DateTimeFormat("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Aden" }).format(d)
        const time = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Aden" }).format(d)
        return { date, time }
    } catch (e) { return { date: "TBA", time: "TBA" } }
}

function matchTeam(a: any, b: any) {
    if (!a || !b) return false
    const aid = safeString(a.id || a.teamId || a.uid || a.team?.id || a.team?.uid, "").toLowerCase()
    const bid = safeString(b.id || b.teamId || b.uid || b.team?.id || b.team?.uid, "").toLowerCase()
    if (aid && bid && aid === bid) return true
    const aname = safeString(a.name || a.displayName || a.team?.displayName || a.team?.name, "").toLowerCase()
    const bname = safeString(b.name || b.displayName || b.team?.displayName || b.team?.name, "").toLowerCase()
    if (aname && bname && (aname === bname || aname.includes(bname) || bname.includes(aname))) return true
    const aabbr = safeString(a.abbreviation || a.team?.abbreviation, "").toLowerCase()
    const babbr = safeString(b.abbreviation || b.team?.abbreviation, "").toLowerCase()
    if (aabbr && babbr && aabbr === babbr) return true
    return false
}

function resolveScoresFromEvent(ev: EventDetailsLoose) {
    const homeScoreFromEvent = ev?.homeTeam?.score
    const awayScoreFromEvent = ev?.awayTeam?.score

    if (homeScoreFromEvent != null || awayScoreFromEvent != null) {
        return {
            homeScore: safeNumber(homeScoreFromEvent, 0),
            awayScore: safeNumber(awayScoreFromEvent, 0),
            source: "eventTeams"
        }
    }

    const box = ev?.boxscore?.teams
    if (Array.isArray(box) && box.length > 0) {
        const homeCandidate = box.find((b: any) => matchTeam(b.team || b, ev.homeTeam || {}))
        const awayCandidate = box.find((b: any) => matchTeam(b.team || b, ev.awayTeam || {}))

        if (homeCandidate || awayCandidate) {
            return {
                homeScore: safeNumber(homeCandidate?.score ?? homeCandidate?.team?.score ?? 0, 0),
                awayScore: safeNumber(awayCandidate?.score ?? awayCandidate?.team?.score ?? 0, 0),
                source: "boxMatched"
            }
        }

        if (box.length >= 2) {
            return {
                homeScore: safeNumber(box[0]?.score ?? box[0]?.team?.score ?? 0, 0),
                awayScore: safeNumber(box[1]?.score ?? box[1]?.team?.score ?? 0, 0),
                source: "boxIndexFallback"
            }
        }
    }

    if (Array.isArray(ev.competitors) && ev.competitors.length >= 2) {
        const homeCompetitor = ev.competitors.find((c: any) => c.homeAway === 'home' || matchTeam(c, ev.homeTeam))
        const awayCompetitor = ev.competitors.find((c: any) => c.homeAway === 'away' || matchTeam(c, ev.awayTeam))

        if (homeCompetitor || awayCompetitor) {
            return {
                homeScore: safeNumber(homeCompetitor?.score ?? 0, 0),
                awayScore: safeNumber(awayCompetitor?.score ?? 0, 0),
                source: "competitors"
            }
        }
    }

    return { homeScore: 0, awayScore: 0, source: "none" }
}

function buildStatRows(boxTeams: BoxTeam[], sportType?: string) {
    const rows: { key: string; label: string; home?: any; away?: any }[] = []
    const home = boxTeams[0] || {}
    const away = boxTeams[1] || {}

    const homeStats = Array.isArray((home as any).statistics) ? (home as any).statistics : []
    const awayStats = Array.isArray((away as any).statistics) ? (away as any).statistics : []

    function flatten(statGroups: any[]) {
        const map = new Map<string, any>()
        for (const sg of statGroups) {
            if (!Array.isArray(sg.stats)) continue
            for (const s of sg.stats) {
                const key = String(s.name || s.displayName || s.statId || s.abbreviation || JSON.stringify(s)).slice(0, 80)
                map.set(key, s)
            }
        }
        return map
    }

    const hMap = flatten(homeStats)
    const aMap = flatten(awayStats)

    const keys = new Set<string>([...hMap.keys(), ...aMap.keys()])
    for (const k of keys) {
        const h = hMap.get(k)
        const a = aMap.get(k)

        let label = h?.displayName || h?.name || a?.displayName || a?.name || k

        if (sportType === 'basketball') {
            if (k.includes('fieldGoal')) label = 'FG%'
            else if (k.includes('threePoint')) label = '3PT%'
            else if (k.includes('freeThrow')) label = 'FT%'
            else if (k.includes('rebound')) label = 'REB'
        } else if (sportType === 'football') {
            if (k.includes('totalYards')) label = 'Total Yards'
            else if (k.includes('passingYards')) label = 'Pass Yards'
            else if (k.includes('rushingYards')) label = 'Rush Yards'
        } else if (sportType === 'hockey') {
            if (k.includes('powerPlay')) label = 'Power Play'
            else if (k.includes('faceOff')) label = 'Faceoff %'
        } else if (sportType === 'baseball') {
            if (k.includes('hits')) label = 'Hits'
            else if (k.includes('earnedRun')) label = 'ERA'
            else if (k.includes('strikeout')) label = 'SO'
        }

        rows.push({ key: k, label, home: h, away: a })
    }

    return rows
}

const getSportType = (leagueAbbr?: string) => {
    if (!leagueAbbr) return 'generic'
    const abbr = leagueAbbr.toLowerCase()

    if (abbr === 'nba') return 'basketball'
    if (abbr === 'nfl') return 'football'
    if (abbr === 'nhl') return 'hockey'
    if (abbr === 'mlb') return 'baseball'
    if (abbr === 'mls') return 'soccer'

    return 'generic'
}

const TeamCard: React.FC<{ team?: TeamShort; flash?: "green" | "red" | null; sportType?: string }> = ({ team, flash, sportType }) => {
    const ringClass =
        flash === "green"
            ? "ring-4 ring-green-300 ring-opacity-60 animate-pulse"
            : flash === "red"
                ? "ring-4 ring-red-300 ring-opacity-60 animate-pulse"
                : ""

    return (
        <div className="flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full bg-white p-2 flex items-center justify-center shadow ${ringClass}`}>
                {team?.logo ? (
                    <Image
                        src={team.logo}
                        alt={team.name || "Team logo"}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                        loading="lazy"
                    />
                ) : (
                    <div className="text-sm font-bold text-gray-500">{team?.abbreviation || "N/A"}</div>
                )}
            </div>
            <div className="mt-2 text-center font-semibold">{team?.name}</div>
            <div className={`text-3xl font-extrabold mt-1 ${flash === "green" ? "text-green-600 transition-colors duration-700" : flash === "red" ? "text-red-600 transition-colors duration-700" : ""}`}>
                {safeNumber(team?.score)}
            </div>
        </div>
    )
}

interface EventPageClientProps {
    initialEvent: EventDetailsLoose | null
    eventId: string
}

export default function EventPageClient({ initialEvent, eventId }: EventPageClientProps) {
    const { setNews } = useNews();

    const [event, setEvent] = useState<EventDetailsLoose | null>(initialEvent)
    const [loading, setLoading] = useState<boolean>(!initialEvent)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<"details">("details")

    const [flashHome, setFlashHome] = useState<"green" | "red" | null>(null)
    const [flashAway, setFlashAway] = useState<"green" | "red" | null>(null)

    const mountedRef = useRef(true)
    const pollTimeoutRef = useRef<number | null>(null)
    const lastPayloadHashRef = useRef<string | null>(null)
    const lastHashRef = useRef<string | null>(null)
    const lastResolvedScoresRef = useRef<{ homeScore: number; awayScore: number } | null>(null)

    const POLL_LIVE = 5000
    const POLL_IDLE = 30000

    const payloadHash = (d: EventDetailsLoose | null) => {
        if (!d) return "null"
        const resolved = resolveScoresFromEvent(d)
        const sdesc = safeString(d?.status?.description || d?.status?.state || "")
        const clock = safeString(d?.status?.displayClock || "")
        return JSON.stringify({ h: resolved.homeScore, a: resolved.awayScore, s: sdesc, c: clock })
    }

    const handleScoreDiff = (oldScores: { homeScore: number; awayScore: number } | null, newScores: { homeScore: number; awayScore: number }) => {
        if (!oldScores) return
        if (newScores.homeScore > oldScores.homeScore) {
            setFlashHome("green"); setFlashAway("red"); setTimeout(() => { setFlashHome(null); setFlashAway(null) }, 1200)
        } else if (newScores.awayScore > oldScores.awayScore) {
            setFlashAway("green"); setFlashHome("red"); setTimeout(() => { setFlashAway(null); setFlashHome(null) }, 1200)
        }
    }

    const fetchAndApply = async (opts?: { manual?: boolean }) => {
        if (!eventId) return
        if (!opts?.manual) setLoading(true)
        setError(null)
        try {
            const data = await fetchEventDetails(eventId)
            if (!mountedRef.current) return
            if (!data) { setError("No data returned from API"); return }

            const resolved = resolveScoresFromEvent(data)
            const newHash = payloadHash(data)
            const changed = newHash !== lastHashRef.current

            if (changed) {
                handleScoreDiff(lastResolvedScoresRef.current, { homeScore: resolved.homeScore, awayScore: resolved.awayScore })
                lastResolvedScoresRef.current = { homeScore: resolved.homeScore, awayScore: resolved.awayScore }
                lastHashRef.current = newHash
                setEvent(data)
            } else if (opts?.manual) {
                setEvent((prev) => prev ? ({ ...prev }) : prev)
            }
        } catch (e: any) {
            console.error(e)
            setError(e?.message || "Failed to fetch event")
        } finally {
            if (!opts?.manual) setLoading(false)
        }
    }

    const NewsItem = useMemo(() => {
        if (!event?.news) return [];
        if (Array.isArray(event.news)) return event.news;
        if (Array.isArray((event.news as any).articles)) return (event.news as any).articles;
        return [];
    }, [event?.news])

    useEffect(() => {
        setNews(NewsItem);
    }, [NewsItem, setNews]);

    useEffect(() => {
        mountedRef.current = true
        let cancelled = false

        const tick = async () => {
            if (cancelled) return
            await fetchAndApply()
            if (cancelled) return
            const isLive = !!(event?.status?.isLive)
            const delay = isLive ? POLL_LIVE : POLL_IDLE
            pollTimeoutRef.current = window.setTimeout(tick, 10000)
        }

        (async () => {
            await fetchAndApply()
            if (!cancelled) {
                const isLive = !!(event?.status?.isLive)
                const delay = isLive ? POLL_LIVE : POLL_IDLE
                pollTimeoutRef.current = window.setTimeout(tick, delay)
            }
        })()

        return () => {
            cancelled = true
            mountedRef.current = false
            if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current)
        }
    }, [eventId])

    const handleManualRefresh = async () => { await fetchAndApply({ manual: true }) }

    const boxTeams = event?.boxscore?.teams && Array.isArray(event.boxscore.teams) ? event.boxscore.teams : []
    const plays = Array.isArray(event?.playByPlay) ? (event as any).playByPlay : []
    const newsList = useMemo(() => {
        if (!event?.news) return []
        if (Array.isArray(event.news)) return event.news
        if (Array.isArray((event.news as any).articles)) return (event.news as any).articles
        return []
    }, [event?.news])

    const sportType = getSportType(event?.league?.abbreviation)
    const statRows = useMemo(() => buildStatRows(boxTeams as BoxTeam[], sportType), [boxTeams, sportType])
    const { date, time } = formatDateTime(event?.dateEvent)
    const resolvedScores = event ? resolveScoresFromEvent(event) : { homeScore: 0, awayScore: 0 }

    const pageTitle = `${event?.awayTeam?.name || 'Away'} vs ${event?.homeTeam?.name || 'Home'} - ${event?.league?.name || 'Game'} Live Score & Stats`
    const pageDescription = `Follow the ${event?.league?.name || 'game'} between ${event?.awayTeam?.name || 'Away'} and ${event?.homeTeam?.name || 'Home'}. Live scores, stats, and updates.`
    const canonicalUrl = `https://livesportsresults.vercel.app/event/${eventId}`

    if (loading && !event) return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading event details...</p>
                </div>
            </main>
            <Footer />
        </div>
    )

    if (error && !event) return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md">
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
                <div className="mt-6">
                    <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Back to Home</Link>
                </div>
            </main>
            <Footer />
        </div>
    )

    const home = event?.homeTeam ?? {}
    const away = event?.awayTeam ?? {}
    const status = event?.status ?? {}
    const venue = event?.venue ?? {}
    const league = event?.league ?? {}
    const season = event?.season ?? {}

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Header />

            <link rel="canonical" href={canonicalUrl} />

            <Script
                id="event-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SportsEvent",
                        "name": `${away?.name || "Away Team"} vs ${home?.name || "Home Team"}`,
                        "description": pageDescription,
                        "startDate": event?.dateEvent,
                        "endDate": event?.dateEvent ? new Date(new Date(event.dateEvent).getTime() + 2 * 60 * 60 * 1000).toISOString() : undefined,
                        "eventStatus": status?.isLive ?
                            "https://schema.org/EventLive" :
                            (status?.state === "post" ?
                                "https://schema.org/EventCompleted" :
                                "https://schema.org/EventScheduled"),
                        "location": {
                            "@type": "Place",
                            "name": venue?.name || "TBD",
                            "address": {
                                "@type": "PostalAddress",
                                "addressLocality": venue?.city || "",
                                "addressCountry": venue?.country || ""
                            }
                        },
                        "organizer": {
                            "@type": "SportsOrganization",
                            "name": league?.name || "",
                            "alternateName": league?.abbreviation || ""
                        },
                        "homeTeam": {
                            "@type": "SportsTeam",
                            "name": home?.name || "Home Team",
                            "logo": home?.logo || undefined
                        },
                        "awayTeam": {
                            "@type": "SportsTeam",
                            "name": away?.name || "Away Team",
                            "logo": away?.logo || undefined
                        },
                        "score": resolvedScores ? {
                            "@type": "SportsEventResult",
                            "homeScore": resolvedScores.homeScore,
                            "awayScore": resolvedScores.awayScore
                        } : undefined
                    })
                }}
            />

            <EventNavbar eventId={event?.id} />

            <main className="flex-grow container mx-auto px-4 py-8">
                <h1 className="sr-only">{pageTitle}</h1>

                <div className="mb-6 flex justify-between items-start">
                    <div>
                        <div className="flex items-center mb-2">
                            {league?.abbreviation && (
                                <div className="mr-3 w-10 h-10 relative">
                                    <Image
                                        src={`/logos/${league.abbreviation.toLowerCase()}.png`}
                                        alt={league.name || "League logo"}
                                        fill
                                        className="object-contain"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none'
                                        }}
                                    />
                                </div>
                            )}
                            <div>
                                <h2 className="text-2xl font-bold">{league.name} <span className="text-sm opacity-70">({league.abbreviation})</span></h2>
                                <div className="text-sm text-gray-600">{season.year ? `${season.year} Season` : (season.name || "Current Season")}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={handleManualRefresh} className="px-3 py-2 bg-white border rounded text-sm hover:bg-gray-50">Refresh</button>
                        <Link href={event?.links?.web || "#"} target="_blank" className="text-sm text-blue-600">Open source</Link>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <div className="text-sm mb-1">{date} • {time}</div>
                                <div className="text-sm mb-1">{venue.name || "TBD"} {venue.city ? `• ${venue.city}` : ''}</div>
                                <div className="mt-3">
                                    <div className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full ${status.isLive ? 'bg-red-500' : 'bg-gray-200 text-gray-900'}`}>
                                        {status.isLive ? (
                                            <>
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                                </span>
                                                LIVE
                                            </>
                                        ) : (
                                            safeString(status.description || 'Scheduled')
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 md:gap-16 justify-center w-full md:w-auto">
                                <TeamCard team={away} flash={flashAway} sportType={sportType} />
                                <div className="text-center">
                                    <div className="text-xl font-bold bg-white inline-block px-4 py-2 rounded-lg text-blue-800">VS</div>
                                    <div className="text-2xl font-bold mt-2">
                                        {resolvedScores.awayScore} - {resolvedScores.homeScore}
                                    </div>
                                </div>
                                <TeamCard team={home} flash={flashHome} sportType={sportType} />
                            </div>
                        </div>

                        {status.isLive && (
                            <div className="mt-4 text-center">
                                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                    {status.period ? `Period ${status.period}` : ''} {status.displayClock || ''}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex -mb-px">
                            <TabButton active={activeTab === 'details'} onClick={() => setActiveTab('details')}>Details</TabButton>
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'details' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Match Details</h2>
                                    <div className="space-y-3">
                                        <InfoRow label="Venue" value={venue.name || 'TBD'} />
                                        <InfoRow label="Location" value={venue.city && venue.country ? `${venue.city}, ${venue.country}` : (venue.city || venue.country || 'Not specified')} />
                                        <InfoRow label="Capacity" value={venue.capacity ? venue.capacity.toLocaleString() : 'Not specified'} />
                                        <InfoRow label="League" value={league.name || '—'} />
                                        <InfoRow label="Season" value={season.year ? `${season.year} Season` : (season.name || 'Current')} />
                                        <InfoRow label="Status" value={status.description || 'Scheduled'} />
                                        <InfoRow label="Stadium Type" value={venue.indoor === undefined ? 'Unknown' : (venue.indoor ? 'Indoor' : 'Outdoor')} />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Match Summary</h2>
                                    <p className="text-gray-700 dark:text-gray-300">{event?.description || 'No description available for this event.'}</p>
                                    {event?.competitors && event.competitors.length > 0 && (
                                        <div className="mt-4">
                                            <h3 className="text-lg font-semibold mb-2">Team Records</h3>
                                            <div className="space-y-2">
                                                {event.competitors.map((c: any, idx: number) => (
                                                    <div key={idx} className="flex justify-between">
                                                        <span className="text-gray-600">{c.team?.abbreviation || c.team?.displayName}</span>
                                                        <span className="font-medium">{c.record?.[0]?.summary || 'No record'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children?: React.ReactNode }> = ({ active, onClick, children }) => (
    <button onClick={onClick} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${active ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
        {children}
    </button>
)

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium text-gray-800 dark:text-gray-200">{value}</span>
    </div>
)