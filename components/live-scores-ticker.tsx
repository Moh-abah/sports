"use client"

import { useState, useEffect } from "react"
import { fetchLiveGamesData } from "@/lib/sports-apis"

export default function LiveScoresTicker() {
  const [liveGames, setLiveGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        setError(null)
        const leagues = ["nfl", "nba", "mlb", "nhl", "mls"]
        const allGames = []

        for (const league of leagues) {
          try {
            const games = await fetchLiveGamesData(league)
            if (Array.isArray(games) && games.length > 0) {
              // Only add live games to ticker
              const liveGamesOnly = games.filter((game) => game.isLive)
              if (liveGamesOnly.length > 0) {
                allGames.push(...liveGamesOnly)
              }
            }
          } catch (leagueError) {
            console.warn(`Failed to fetch ${league} for ticker:`, leagueError.message)
          }
        }

        console.log(`Live ticker found ${allGames.length} live games`)
        setLiveGames(allGames)
      } catch (error) {
        console.error("Live scores ticker error:", error)
        setError("Unable to load live scores")
      } finally {
        setLoading(false)
      }
    }

    fetchLiveData()

    // Update every 30 seconds for live games
    const interval = setInterval(fetchLiveData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-blue-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <div className="animate-pulse flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
              <span className="text-sm font-medium">Loading live scores...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-yellow-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
            <span className="text-sm">{error} - Check back shortly</span>
          </div>
        </div>
      </div>
    )
  }

  if (liveGames.length === 0) {
    return (
      <div className="bg-gray-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
            <span className="text-sm">No live games currently in progress</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <div className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </div>
            <span className="text-sm font-bold">LIVE</span>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="animate-scroll flex space-x-8">
              {liveGames.map((game, index) => (
                <div key={game.id || index} className="flex items-center space-x-2 whitespace-nowrap">
                  <span className="text-sm font-medium">
                    {game.awayTeam} {game.awayScore} - {game.homeScore} {game.homeTeam}
                  </span>
                  <span className="text-xs bg-white text-red-600 px-2 py-1 rounded">{game.league}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
