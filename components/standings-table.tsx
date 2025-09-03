"use client"

import { useState, useEffect } from "react"
import { fetchLeagueStandings } from "@/lib/standings-api"

interface StandingsTableProps {
  league: string
  leagueName?: string
}

export default function StandingsTable({ league, leagueName }: StandingsTableProps) {
  const [standings, setStandings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Map league codes to display names
  const leagueDisplayNames = {
    nfl: "NFL",
    nba: "NBA",
    mlb: "MLB",
    nhl: "NHL",
    mls: "MLS",
  }

  const displayName = leagueName || leagueDisplayNames[league] || league.toUpperCase()

  useEffect(() => {
    const loadStandings = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log(`Loading standings for ${league}`)

        const data = await fetchLeagueStandings(league)
        console.log(`Received standings data:`, data?.length || 0, "conferences")

        setStandings(Array.isArray(data) ? data : [])
        setLastUpdated(new Date())
      } catch (err) {
        console.error("Standings error:", err)
        setError("Unable to load standings. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (league) {
      loadStandings()
    }
  }, [league])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-500 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!standings || standings.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="text-center py-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <p className="text-gray-500 dark:text-gray-400">No standings available for {displayName}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Check back later for updates</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">{displayName} Standings</h3>
          <span className="text-sm opacity-75">Updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="p-6">
        {standings.map((conference, confIndex) => (
          <div key={confIndex} className="mb-8 last:mb-0">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{conference.conferenceName}</h4>

            {conference.divisions &&
              conference.divisions.map((division, divIndex) => (
                <div key={divIndex} className="mb-6 last:mb-0">
                  {conference.divisions.length > 1 && (
                    <h5 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
                      {division.divisionName}
                    </h5>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-2 font-medium text-gray-600 dark:text-gray-400">Team</th>
                          <th className="text-center py-2 font-medium text-gray-600 dark:text-gray-400">W</th>
                          <th className="text-center py-2 font-medium text-gray-600 dark:text-gray-400">L</th>
                          <th className="text-center py-2 font-medium text-gray-600 dark:text-gray-400">PCT</th>
                          <th className="text-center py-2 font-medium text-gray-600 dark:text-gray-400">GB</th>
                          <th className="text-center py-2 font-medium text-gray-600 dark:text-gray-400">STRK</th>
                        </tr>
                      </thead>
                      <tbody>
                        {division.teams &&
                          division.teams.map((team, teamIndex) => (
                            <tr
                              key={teamIndex}
                              className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <td className="py-3 font-medium text-gray-800 dark:text-white">
                                <div className="flex items-center">
                                  {team.logo && (
                                    <img
                                      src={team.logo || "/placeholder.svg"}
                                      alt={team.team}
                                      className="w-6 h-6 mr-2"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none"
                                      }}
                                    />
                                  )}
                                  {team.team}
                                </div>
                              </td>
                              <td className="text-center py-3 text-gray-600 dark:text-gray-300">{team.wins}</td>
                              <td className="text-center py-3 text-gray-600 dark:text-gray-300">{team.losses}</td>
                              <td className="text-center py-3 text-gray-600 dark:text-gray-300">
                                {team.winPercentage.toFixed(3)}
                              </td>
                              <td className="text-center py-3 text-gray-600 dark:text-gray-300">
                                {team.gamesBack === 0 ? "-" : team.gamesBack}
                              </td>
                              <td className="text-center py-3">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    team.streak.startsWith("W")
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                      : team.streak.startsWith("L")
                                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                  }`}
                                >
                                  {team.streak || "-"}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}
