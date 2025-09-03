"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { fetchLiveGamesData } from "@/lib/sports-apis"

interface Game {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore?: number | null
  awayScore?: number | null
  status: string
  isLive: boolean
  league: string
  date: string
  venue?: string
  source?: string
}

interface RecentGamesProps {
  league?: string
  limit?: number
}

export default function RecentGames({ league, limit = 10 }: RecentGamesProps) {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadRecentGames = async () => {
      try {
        setLoading(true)
        setError(null)

        let allGames: Game[] = []

        if (league) {
          const data = await fetchLiveGamesData(league)
          if (Array.isArray(data)) allGames = data as Game[]
        } else {
          const leagues = ["nfl", "nba", "mlb", "nhl", "mls"]
          for (const lg of leagues) {
            try {
              const data = await fetchLiveGamesData(lg)
              if (Array.isArray(data)) allGames.push(...(data as Game[]))
            } catch (lgError) {
              console.warn(`Failed to load ${lg}:`, lgError)
            }
          }
        }

        const sortedGames = allGames
          .sort((a, b) => {
            if (a.isLive && !b.isLive) return -1
            if (!a.isLive && b.isLive) return 1
            return new Date(b.date).getTime() - new Date(a.date).getTime()
          })
          .slice(0, limit)

        setGames(sortedGames)
      } catch (err) {
        console.error("Recent games error:", err)
        setError("Unable to load recent games. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadRecentGames()
    const interval = setInterval(loadRecentGames, 120000) // تحديث كل دقيقتين
    return () => clearInterval(interval)
  }, [league, limit])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">No recent games available.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {league ? `Recent ${league.toUpperCase()} Games` : "Recent Games"}
        </h3>
      </div>

      <div className="p-6 space-y-4">
        {games.map((game) => {
          const leaguePrefix = game.league?.toLowerCase() || "unknown"
          const eventUrl = `${leaguePrefix}_${game.id}`

          return (
            <Link
              key={game.id}
              href={`/event/${eventUrl}`}
              className="block hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-3 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {game.awayTeam} @ {game.homeTeam}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${game.isLive
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          : game.status.toLowerCase() === "final"
                            ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        }`}
                    >
                      {game.isLive ? "LIVE" : game.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {game.homeScore != null && game.awayScore != null && (
                        <span className="text-lg font-bold text-gray-800 dark:text-white">
                          {game.awayScore} - {game.homeScore}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">{game.league}</span>
                      {game.source && <span className="text-xs text-gray-400 dark:text-gray-500">via {game.source}</span>}
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(game.date).toLocaleDateString()}
                      </div>
                      {game.venue && <div className="text-xs text-gray-400 dark:text-gray-500">{game.venue}</div>}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
