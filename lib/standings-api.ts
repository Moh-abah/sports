/**
 * Fetch current league standings with improved error handling
 */

export async function fetchLeagueStandings(league: string) {
  console.log(`Fetching standings for ${league}...`)

  try {
    // Try ESPN first with better error handling
    const espnData = await fetchESPNStandings(league)
    if (espnData && espnData.length > 0) {
      console.log(`ESPN standings found for ${league}`)
      return espnData
    }
  } catch (error) {
    console.warn(`ESPN standings failed for ${league}:`, error.message)
  }

  try {
    // Try TheSportsDB as fallback
    const sportsDBData = await fetchTheSportsDBStandings(league)
    if (sportsDBData && sportsDBData.length > 0) {
      console.log(`TheSportsDB standings found for ${league}`)
      return sportsDBData
    }
  } catch (error) {
    console.warn(`TheSportsDB standings failed for ${league}:`, error.message)
  }

  // Return current season standings as fallback
  console.log(`All APIs failed for ${league} standings, using current season data`)
  return getCurrentSeasonStandings(league)
}

async function fetchESPNStandings(league: string) {
  try {
    const leagueMap = {
      nfl: "football/nfl",
      nba: "basketball/nba",
      mlb: "baseball/mlb",
      nhl: "hockey/nhl",
      mls: "soccer/usa.1",
    }

    if (!leagueMap[league]) {
      console.warn(`League ${league} not supported by ESPN API`)
      return null
    }

    const response = await fetch(`https://site.api.espn.com/apis/v2/sports/${leagueMap[league]}/standings`, {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent": "LiveSportsResults/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`ESPN API returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return normalizeESPNStandingsData(data, league)
  } catch (error) {
    console.warn("ESPN Standings Error:", error.message)
    return null
  }
}

async function fetchTheSportsDBStandings(league: string) {
  try {
    const API_KEY = process.env.THESPORTSDB_API_KEY || "3"
    const leagueMap = {
      nfl: "NFL",
      nba: "NBA",
      mlb: "MLB",
      nhl: "NHL",
      mls: "MLS",
    }

    if (!leagueMap[league]) {
      console.warn(`League ${league} not supported by TheSportsDB`)
      return null
    }

    const response = await fetch(
      `https://www.thesportsdb.com/api/v1/json/${API_KEY}/lookuptable.php?l=${leagueMap[league]}&s=${getCurrentSeason()}`,
      {
        next: { revalidate: 3600 },
        headers: {
          "User-Agent": "LiveSportsResults/1.0",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`TheSportsDB API returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return normalizeTheSportsDBStandingsData(data, league)
  } catch (error) {
    console.warn("TheSportsDB Standings Error:", error.message)
    return null
  }
}

function normalizeESPNStandingsData(data: any, league: string) {
  try {
    if (!data || !data.children || !Array.isArray(data.children)) {
      console.warn("Invalid ESPN standings data structure")
      return null
    }

    return data.children.map((conference) => ({
      conferenceName: conference.name || "Conference",
      divisions:
        conference.children?.map((division) => ({
          divisionName: division.name || "Division",
          teams:
            division.standings?.entries?.map((entry) => ({
              team: entry.team?.displayName || "Unknown Team",
              wins: entry.stats?.find((s) => s.name === "wins")?.value || 0,
              losses: entry.stats?.find((s) => s.name === "losses")?.value || 0,
              winPercentage: entry.stats?.find((s) => s.name === "winPercent")?.value || 0,
              gamesBack: entry.stats?.find((s) => s.name === "gamesBehind")?.value || 0,
              streak: entry.stats?.find((s) => s.name === "streak")?.displayValue || "",
              logo: entry.team?.logos?.[0]?.href || null,
            })) || [],
        })) || [],
    }))
  } catch (error) {
    console.warn("Error normalizing ESPN standings:", error.message)
    return null
  }
}

function normalizeTheSportsDBStandingsData(data: any, league: string) {
  try {
    if (!data || !data.table || !Array.isArray(data.table)) {
      console.warn("Invalid TheSportsDB standings data structure")
      return null
    }

    // Group teams by division/conference if available
    const teams = data.table.map((team) => ({
      team: team.strTeam || "Unknown Team",
      wins: Number.parseInt(team.intWin) || 0,
      losses: Number.parseInt(team.intLoss) || 0,
      winPercentage:
        Number.parseFloat(team.intWin) / (Number.parseFloat(team.intWin) + Number.parseFloat(team.intLoss)) || 0,
      gamesBack: Number.parseInt(team.intGB) || 0,
      streak: team.strForm || "",
      logo: team.strTeamBadge || null,
    }))

    return [
      {
        conferenceName: `${league.toUpperCase()} Standings`,
        divisions: [
          {
            divisionName: "League",
            teams: teams,
          },
        ],
      },
    ]
  } catch (error) {
    console.warn("Error normalizing TheSportsDB standings:", error.message)
    return null
  }
}

function getCurrentSeason() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  // Adjust season year based on sport calendar
  if (month >= 8) return year // Sept-Dec = current year
  return year - 1 // Jan-Aug = previous year for most sports
}
