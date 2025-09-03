import { NextResponse } from "next/server"

// Real league data fetchers - NO MOCK DATA
async function fetchRealLeagueData(league: string) {
  const leagueMap: { [key: string]: string } = {
    'nba': 'basketball/nba',
    'nfl': 'football/nfl',
    'mlb': 'baseball/mlb',
    'nhl': 'hockey/nhl',
    'mls': 'soccer/usa.1'
  }

  const espnPath = leagueMap[league.toLowerCase()]
  if (!espnPath) {
    return null
  }

  try {
    const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${espnPath}/scoreboard`, {
      headers: {
        'User-Agent': 'SportsPro/1.0',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`${league.toUpperCase()} API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.events || data.events.length === 0) {
      return {
        name: league.toUpperCase(),
        league: league.toUpperCase(),
        games: [],
        message: `No ${league.toUpperCase()} games available today`
      }
    }

    const games = data.events.map((event: any) => {
      const competition = event.competitions[0]
      const homeTeam = competition.competitors.find((c: any) => c.homeAway === 'home')
      const awayTeam = competition.competitors.find((c: any) => c.homeAway === 'away')

      return {
        idEvent: `${league}_${event.id}`,
        strHomeTeam: homeTeam?.team?.displayName || 'TBD',
        strAwayTeam: awayTeam?.team?.displayName || 'TBD',
        intHomeScore: homeTeam?.score || '0',
        intAwayScore: awayTeam?.score || '0',
        status: event.status.type.description || 'Scheduled',
        strVenue: competition.venue?.fullName || 'TBD',
        dateEvent: new Date(event.date).toISOString().split('T')[0],
        strLeague: league.toUpperCase(),
        formattedTime: new Date(event.date).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short'
        }),
        homeTeamLogo: homeTeam?.team?.logo || '',
        awayTeamLogo: awayTeam?.team?.logo || '',
        period: event.status.period || 0,
        clock: event.status.displayClock || '',
        isLive: event.status.type.state === 'in',
        gameUrl: event.links?.[0]?.href || '',
        summary: event.summary || ''
      }
    })

    return {
      name: league.toUpperCase(),
      league: league.toUpperCase(),
      games: games,
      totalGames: games.length,
      liveGames: games.filter((g: { isLive: any }) => g.isLive).length
    }

  } catch (error) {
    console.error(`Error fetching real ${league.toUpperCase()} data:`, error)
    return null
  }
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json({
        error: 'League slug is required',
        availableLeagues: ['nba', 'nfl', 'mlb', 'nhl', 'mls']
      }, { status: 400 })
    }

    const validLeagues = ['nba', 'nfl', 'mlb', 'nhl', 'mls']
    if (!validLeagues.includes(slug.toLowerCase())) {
      return NextResponse.json({
        error: `Invalid league: ${slug}`,
        availableLeagues: validLeagues
      }, { status: 400 })
    }

    console.log(`Fetching real data for ${slug.toUpperCase()}...`)

    const leagueData = await fetchRealLeagueData(slug.toLowerCase())

    if (!leagueData) {
      return NextResponse.json({
        error: `Failed to fetch real data for ${slug.toUpperCase()}`,
        message: 'ESPN API is currently unavailable for this league'
      }, { status: 503 })
    }

    const response = {
      ...leagueData,
      lastUpdated: new Date().toISOString(),
      dataSource: 'ESPN Real-Time API',
      status: 'success'
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('Error in league API:', error)

    return NextResponse.json({
      error: 'Failed to fetch league data',
      message: 'Real-time sports data is currently unavailable',
      status: 'error'
    }, { status: 500 })
  }
}
