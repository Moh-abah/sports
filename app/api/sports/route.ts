import { NextResponse } from "next/server"
async function fetchNBAData() {
  try {
    console.log("🟢 fetchNBAData: Fetching NBA scoreboard...");

    const response = await fetch(
      'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard',
      {
        headers: {
          'User-Agent': 'SportsPro/1.0',
          'Accept': 'application/json'
        }
      }
    );

    console.log(`🟢 fetchNBAData: Response status: ${response.status}`);

    if (!response.ok) {
      throw new Error(`NBA API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("🟢 fetchNBAData: Raw JSON data received:", data);

    if (!data.events || data.events.length === 0) {
      console.warn("⚠️ fetchNBAData: No events found in the response");
      return null;
    }

    const games = data.events.map(event => {
      const competition = event.competitions?.[0];
      if (!competition) return null;

      const homeTeam = competition.competitors?.find(c => c.homeAway === 'home');
      const awayTeam = competition.competitors?.find(c => c.homeAway === 'away');

      const getScore = (team) => {
        if (!team) return 0;
        if (team.score !== null && team.score !== undefined) return Number(team.score);
        if (team.linescores?.length) return team.linescores.reduce((sum, ls) => sum + (ls.value || 0), 0);
        return 0;
      };

      const statusType = event.status?.type?.state || 'pre';
      let displayStatus = event.status?.type?.description || 'Scheduled';
      let isLive = false;
      let homeScore = getScore(homeTeam);
      let awayScore = getScore(awayTeam);

      // تحديث الحالة والنتائج حسب نوع المباراة
      if (statusType === 'in') {
        isLive = true;
        displayStatus = 'Live';
      } else if (statusType === 'post') {
        displayStatus = 'Final';
      } else {
        // المباراة لم تبدأ
        homeScore = 0;
        awayScore = 0;
      }

      return {
        idEvent: `nba_${event.id}`,
        strHomeTeam: homeTeam?.team?.displayName || 'TBD',
        strAwayTeam: awayTeam?.team?.displayName || 'TBD',
        intHomeScore: homeScore,
        intAwayScore: awayScore,
        status: displayStatus,
        strVenue: competition.venue?.fullName || 'TBD',
        dateEvent: new Date(event.date).toISOString().split('T')[0],
        strLeague: 'NBA',
        formattedTime: new Date(event.date).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short'
        }),
        homeTeamLogo: homeTeam?.team?.logo || '',
        awayTeamLogo: awayTeam?.team?.logo || '',
        period: event.status?.period || 0,
        clock: event.status?.displayClock || '',
        isLive
      };
    }).filter(Boolean);

    console.log(`🟢 fetchNBAData: Processed ${games.length} games successfully`);
    return { name: 'NBA', league: 'NBA', games };

  } catch (error) {
    console.error('❌ NBA API error:', error);
    return null;
  }
}



// Function to fetch real NFL data from ESPN
async function fetchNFLData() {
  try {
    const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard', {
      headers: {
        'User-Agent': 'SportsPro/1.0',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`NFL API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.events || data.events.length === 0) {
      return null
    }

    const games = data.events.map(event => {
      const competition = event.competitions[0]
      const homeTeam = competition.competitors.find(c => c.homeAway === 'home')
      const awayTeam = competition.competitors.find(c => c.homeAway === 'away')

      return {
        idEvent: `nfl_${event.id}`,
        strHomeTeam: homeTeam?.team?.displayName || 'TBD',
        strAwayTeam: awayTeam?.team?.displayName || 'TBD',
        intHomeScore: homeTeam?.score || '0',
        intAwayScore: awayTeam?.score || '0',
        status: event.status.type.description || 'Scheduled',
        strVenue: competition.venue?.fullName || 'TBD',
        dateEvent: new Date(event.date).toISOString().split('T')[0],
        strLeague: 'NFL',
        formattedTime: new Date(event.date).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short'
        }),
        homeTeamLogo: homeTeam?.team?.logo || '',
        awayTeamLogo: awayTeam?.team?.logo || '',
        period: event.status.period || 0,
        clock: event.status.displayClock || '',
        isLive: event.status.type.state === 'in'
      }
    })

    return {
      name: 'NFL',
      league: 'NFL',
      games: games
    }
  } catch (error) {
    console.error('NFL API error:', error)
    return null
  }
}

// Function to fetch real MLB data from ESPN
async function fetchMLBData() {
  try {
    const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard', {
      headers: {
        'User-Agent': 'SportsPro/1.0',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`MLB API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.events || data.events.length === 0) {
      return null
    }

    const games = data.events.map(event => {
      const competition = event.competitions[0]
      const homeTeam = competition.competitors.find(c => c.homeAway === 'home')
      const awayTeam = competition.competitors.find(c => c.homeAway === 'away')

      return {
        idEvent: `mlb_${event.id}`,
        strHomeTeam: homeTeam?.team?.displayName || 'TBD',
        strAwayTeam: awayTeam?.team?.displayName || 'TBD',
        intHomeScore: homeTeam?.score || '0',
        intAwayScore: awayTeam?.score || '0',
        status: event.status.type.description || 'Scheduled',
        strVenue: competition.venue?.fullName || 'TBD',
        dateEvent: new Date(event.date).toISOString().split('T')[0],
        strLeague: 'MLB',
        formattedTime: new Date(event.date).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short'
        }),
        homeTeamLogo: homeTeam?.team?.logo || '',
        awayTeamLogo: awayTeam?.team?.logo || '',
        period: event.status.period || 0,
        clock: event.status.displayClock || '',
        isLive: event.status.type.state === 'in'
      }
    })

    return {
      name: 'MLB',
      league: 'MLB',
      games: games
    }
  } catch (error) {
    console.error('MLB API error:', error)
    return null
  }
}

// Function to fetch real NHL data from ESPN
async function fetchNHLData() {
  try {
    const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard', {
      headers: {
        'User-Agent': 'SportsPro/1.0',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`NHL API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.events || data.events.length === 0) {
      return null
    }

    const games = data.events.map((event: { competitions: any[]; id: any; status: { type: { description: any; state: string }; period: any; displayClock: any }; date: string | number | Date }) => {
      const competition = event.competitions[0]
      const homeTeam = competition.competitors.find(c => c.homeAway === 'home')
      const awayTeam = competition.competitors.find(c => c.homeAway === 'away')

      return {
        idEvent: `nhl_${event.id}`,
        strHomeTeam: homeTeam?.team?.displayName || 'TBD',
        strAwayTeam: awayTeam?.team?.displayName || 'TBD',
        intHomeScore: homeTeam?.score || '0',
        intAwayScore: awayTeam?.score || '0',
        status: event.status.type.description || 'Scheduled',
        strVenue: competition.venue?.fullName || 'TBD',
        dateEvent: new Date(event.date).toISOString().split('T')[0],
        strLeague: 'NHL',
        formattedTime: new Date(event.date).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short'
        }),
        homeTeamLogo: homeTeam?.team?.logo || '',
        awayTeamLogo: awayTeam?.team?.logo || '',
        period: event.status.period || 0,
        clock: event.status.displayClock || '',
        isLive: event.status.type.state === 'in'
      }
    })

    return {
      name: 'NHL',
      league: 'NHL',
      games: games
    }
  } catch (error) {
    console.error('NHL API error:', error)
    return null
  }
}

// Function to fetch real MLS data from ESPN
async function fetchMLSData() {
  try {
    const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard', {
      headers: {
        'User-Agent': 'SportsPro/1.0',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`MLS API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.events || data.events.length === 0) {
      return null
    }

    const games = data.events.map(event => {
      const competition = event.competitions[0]
      const homeTeam = competition.competitors.find(c => c.homeAway === 'home')
      const awayTeam = competition.competitors.find(c => c.homeAway === 'away')

      return {
        idEvent: `mls_${event.id}`,
        strHomeTeam: homeTeam?.team?.displayName || 'TBD',
        strAwayTeam: awayTeam?.team?.displayName || 'TBD',
        intHomeScore: homeTeam?.score || '0',
        intAwayScore: awayTeam?.score || '0',
        status: event.status.type.description || 'Scheduled',
        strVenue: competition.venue?.fullName || 'TBD',
        dateEvent: new Date(event.date).toISOString().split('T')[0],
        strLeague: 'MLS',
        formattedTime: new Date(event.date).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short'
        }),
        homeTeamLogo: homeTeam?.team?.logo || '',
        awayTeamLogo: awayTeam?.team?.logo || '',
        period: event.status.period || 0,
        clock: event.status.displayClock || '',
        isLive: event.status.type.state === 'in'
      }
    })

    return {
      name: 'MLS',
      league: 'MLS',
      games: games
    }
  } catch (error) {
    console.error('MLS API error:', error)
    return null
  }
}

// Main function to fetch all real sports data
async function fetchAllRealSportsData() {
  const promises = [
    fetchNBAData(),
    fetchNFLData(),
    fetchMLBData(),
    fetchNHLData(),
    fetchMLSData()
  ]

  const results = await Promise.allSettled(promises)
  const validResults = results
    .map(result => result.status === 'fulfilled' ? result.value : null)
    .filter(data => data !== null)

  return validResults
}

export async function GET() {
  try {
    // Set cache headers for better performance
    const headers = {
      'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    }

    console.log('Fetching real sports data...')

    // Fetch all real sports data
    const sportsData = await fetchAllRealSportsData()

    if (sportsData.length === 0) {
      return NextResponse.json({
        data: [],
        lastUpdated: new Date().toISOString(),
        date: new Date().toISOString().split("T")[0],
        totalGames: 0,
        leagues: 0,
        status: 'no_data',
        message: 'No games available today or all APIs are currently unavailable'
      }, {
        headers,
        status: 200
      })
    }

    // Calculate totals
    const totalGames = sportsData.reduce((sum, league) => sum + (league.games?.length || 0), 0)

    const response = {
      data: sportsData,
      lastUpdated: new Date().toISOString(),
      date: new Date().toISOString().split("T")[0],
      totalGames: totalGames,
      leagues: sportsData.length,
      status: 'success',
      message: `Successfully loaded ${totalGames} games from ${sportsData.length} leagues`
    }

    console.log(`Successfully fetched ${totalGames} games from ${sportsData.length} leagues`)

    return NextResponse.json(response, { headers })

  } catch (error) {
    console.error("Critical error in sports API:", error)

    return NextResponse.json({
      data: [],
      lastUpdated: new Date().toISOString(),
      date: new Date().toISOString().split("T")[0],
      totalGames: 0,
      leagues: 0,
      status: 'error',
      error: 'Failed to fetch sports data',
      message: 'All sports data sources are currently unavailable. Please try again later.'
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'Content-Type': 'application/json'
      },
      status: 503
    })
  }
}