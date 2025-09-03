
/**
 * Fetches REAL sports data from ESPN APIs - NO MOCK DATA
 * @returns {Promise<Array>} Array of real sports events grouped by league
 */
export async function fetchSportsData() {
  try {
    const response = await fetch("/api/sports", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const result = await response.json()

    // Only return real data, never mock data
    if (result.status === 'success' && result.data && result.data.length > 0) {
      return result.data
    } else {
      // If no real data available, return empty array instead of mock data
      console.log('No real sports data available at this time')
      return []
    }
  } catch (error) {
    console.error("Error fetching real sports data:", error)
    // Return empty array instead of mock data when API fails
    return []
  }
}
















export async function fetchEventDetails(eventId: string) {
  console.group(`🔵 fetchEventDetails called for: ${eventId}`);
  try {
    console.log("Step 1: Sending fetch request to /api/events/...");
    const response = await fetch(`/api/events/${eventId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const rawText = await response.clone().text();
    console.log("📝 Raw API response text (trim):", rawText.substring(0, 2000));
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Step 2: JSON parsed (raw):", !!data);

    // helpers
    const isPlayEvent = (obj: any) =>
      obj && (obj.sequenceNumber || obj.atBatId || (obj.type && obj.type.text));
    const stripUnbalancedBraces = (s: string) =>
      typeof s === "string" ? s.replace(/\{[^}]*\}/g, "").trim() : s;

    // deep sanitize for stats arrays (remove accidental play-by-play inside stats,
    // strip broken brace fragments, and coerce numeric scores)
    const sanitizedBoxscore: any = { teams: [], players: [] };
    const collectedPlays: any[] = [];

    if (data.boxscore?.teams && Array.isArray(data.boxscore.teams)) {
      for (const team of data.boxscore.teams) {
        const newTeam: any = { ...team };
        if (Array.isArray(team.statistics)) {
          newTeam.statistics = team.statistics.map((statGroup: any) => {
            if (!Array.isArray(statGroup.stats)) return { ...statGroup, stats: [] };
            const kept: any[] = [];
            for (const s of statGroup.stats) {
              // if this entry looks like a play, move it to playByPlay
              if (isPlayEvent(s)) {
                collectedPlays.push(s);
                continue;
              }
              // sanitize string fields inside stat entries
              if (typeof s === "object" && s !== null) {
                const cleaned: any = {};
                for (const k of Object.keys(s)) {
                  cleaned[k] = typeof s[k] === "string" ? stripUnbalancedBraces(s[k]) : s[k];
                }
                kept.push(cleaned);
              } else if (typeof s === "string") {
                kept.push(stripUnbalancedBraces(s));
              } else {
                kept.push(s);
              }
            }
            return { ...statGroup, stats: kept };
          });
        }
        sanitizedBoxscore.teams.push(newTeam);
      }
    } else if (data.boxscore) {
      // if boxscore exists but malformed, try to keep top-level
      sanitizedBoxscore.teams = data.boxscore.teams || [];
    }

    sanitizedBoxscore.players = data.boxscore?.players || [];

    // normalize competitors <-> homeTeam/awayTeam records & scores
    const competitors = data.competitors || [];
    const findCompetitor = (id: any) => competitors.find((c: any) => `${c.id}` === `${id}`);

    const readScore = (obj: any) => {
      if (obj == null) return 0;
      const n = Number(obj.score ?? obj.displayValue ?? obj);
      return Number.isFinite(n) ? n : 0;
    };

    // normalized top-level object
    const normalizedData: any = {
      id: data.id || eventId,
      league: {
        id: data.league?.id ?? "",
        name: data.league?.name ?? "",
        abbreviation: data.league?.abbreviation ?? "",
        links: data.league?.links ?? [],
      },
      homeTeam: {
        id: data.homeTeam?.id ?? "",
        name: data.homeTeam?.name ?? "Home Team",
        abbreviation: data.homeTeam?.abbreviation ?? "",
        shortName: data.homeTeam?.shortName ?? data.homeTeam?.displayName ?? "",
        color: data.homeTeam?.color ?? "",
        alternateColor: data.homeTeam?.alternateColor ?? "",
        logo: data.homeTeam?.logo ?? "",
        score: readScore(data.homeTeam) || readScore(findCompetitor(data.homeTeam?.id)),
        record: data.homeTeam?.record?.length ? data.homeTeam.record : (findCompetitor(data.homeTeam?.id)?.record || []),
        stats: data.homeTeam?.stats || [],
        links: data.homeTeam?.links || [],
      },
      awayTeam: {
        id: data.awayTeam?.id ?? "",
        name: data.awayTeam?.name ?? "Away Team",
        abbreviation: data.awayTeam?.abbreviation ?? "",
        shortName: data.awayTeam?.shortName ?? data.awayTeam?.displayName ?? "",
        color: data.awayTeam?.color ?? "",
        alternateColor: data.awayTeam?.alternateColor ?? "",
        logo: data.awayTeam?.logo ?? "",
        score: readScore(data.awayTeam) || readScore(findCompetitor(data.awayTeam?.id)),
        record: data.awayTeam?.record?.length ? data.awayTeam.record : (findCompetitor(data.awayTeam?.id)?.record || []),
        stats: data.awayTeam?.stats || [],
        links: data.awayTeam?.links || [],
      },
      status: {
        description: (data.status?.description || "").toString(),
        state: data.status?.state || "",
        period: data.status?.period ?? 0,
        displayClock: data.status?.displayClock || "",
        isLive: !!data.status?.isLive,
      },
      dateEvent: data.dateEvent || data.date || "",
      venue: {
        id: data.venue?.id ?? "",
        name: data.venue?.name ?? "TBD",
        city: data.venue?.city ?? "",
        country: data.venue?.country ?? "",
        capacity: data.venue?.capacity > 0 ? data.venue.capacity : null,
        indoor: !!data.venue?.indoor,
      },
      season: data.season || {},
      description: data.description || "",
      highlights: data.highlights || [],
      news: data.news || {},
      boxscore: sanitizedBoxscore,
      playByPlay: Array.isArray(data.playByPlay) ? data.playByPlay.concat(collectedPlays) : collectedPlays,
      competitors: competitors,
      links: {
        web: data.links?.web || (data.boxscore?.links?.web ?? ""),
        mobile: data.links?.mobile || (data.boxscore?.links?.mobile ?? ""),
        tickets: data.links?.tickets || [],
      },
    };

    // reconcile status: if there are scores but status says Scheduled -> flip to In Progress
    const totalScore = Number(normalizedData.homeTeam.score) + Number(normalizedData.awayTeam.score);
    if (totalScore > 0) {
      const desc = (normalizedData.status.description || "").toLowerCase();
      if (desc.includes("sched") || desc === "" || desc === "scheduled") {
        normalizedData.status.description = "In Progress";
        normalizedData.status.isLive = true;
      }
    }

    // if there are linescores showing End, mark final
    const anyLinescores = (data.boxscore?.teams || []).some((t: any) =>
      Array.isArray(t.linescores) && t.linescores.some((ls: any) => ls.displayValue === "End")
    );
    if (anyLinescores && totalScore > 0) {
      normalizedData.status.description = "Final";
      normalizedData.status.isLive = false;
    }

    // final safety: ensure numeric values for scores
    normalizedData.homeTeam.score = Number(normalizedData.homeTeam.score) || 0;
    normalizedData.awayTeam.score = Number(normalizedData.awayTeam.score) || 0;

    console.log("Step 3: Normalized event data:");
    console.log(JSON.stringify(normalizedData, null, 2));

    console.groupEnd();
    return normalizedData;
  } catch (error) {
    console.error("Step 4: Error fetching/normalizing event details:", error);
    console.groupEnd();
    return null;
  }
}













/**
 * Fetches REAL events for a specific league - NO MOCK DATA
 * @param {string} leagueId - The ID or slug of the league to fetch
 * @returns {Promise<Array>} Array of real events for the league
 */
export async function fetchLeagueEvents(leagueId: string) {
  console.log("=== fetchLeagueEvents START ===")
  console.log("League ID:", leagueId)

  try {
    const response = await fetch(`/api/leagues/${leagueId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    console.log("Response status:", response.status)
    if (!response.ok) throw new Error(`API responded with status: ${response.status}`)

    const data = await response.json()
    console.log("Raw API data received:", data)

    if (data && Array.isArray(data.games)) {
      console.log("Returning data.games array with length:", data.games.length)
      return data.games
    } else {
      console.log("No games array found in API data, returning empty array")
      return []
    }

  } catch (error) {
    console.error("Error fetching real league events:", error)
    return []
  } finally {
    console.log("=== fetchLeagueEvents END ===")
  }
}


// Cache mechanism for real data only - NO MOCK DATA CACHING
const realDataCache = {
  data: null as any,
  timestamp: 0,
  CACHE_DURATION: 2 * 60 * 1000, // 2 minutes cache for real-time sports data
}

/**
 * Fetches REAL sports data with caching - NO MOCK DATA
 * @returns {Promise<Array>} Array of real sports events
 */
export async function fetchSportsDataWithCache() {
  const now = Date.now()

  // Check if cached data is still valid and is real data
  if (realDataCache.data &&
    realDataCache.data.length > 0 &&
    now - realDataCache.timestamp < realDataCache.CACHE_DURATION) {
    console.log('Returning cached real sports data')
    return realDataCache.data
  }

  // Fetch fresh real data
  console.log('Fetching fresh real sports data')
  const freshRealData = await fetchSportsData()

  // Only cache if we have real data
  if (freshRealData && freshRealData.length > 0) {
    realDataCache.data = freshRealData
    realDataCache.timestamp = now
    console.log(`Cached ${freshRealData.length} real leagues`)
  }

  return freshRealData
}

/**
 * Validates that data is real and not mock
 * @param {any} data - Data to validate
 * @returns {boolean} True if data appears to be real
 */
export function validateRealData(data: any): boolean {
  if (!data || !Array.isArray(data)) {
    return false
  }

  // Check if data has real characteristics
  for (const league of data) {
    if (!league.games || !Array.isArray(league.games)) {
      continue
    }

    for (const game of league.games) {
      // Real games should have proper IDs from ESPN or other real sources
      if (!game.idEvent || !game.idEvent.includes('_')) {
        return false
      }

      // Real games should have proper team names and venues
      if (!game.strHomeTeam || !game.strAwayTeam || !game.strVenue) {
        return false
      }

      // Real games should have proper dates
      if (!game.dateEvent || !Date.parse(game.dateEvent)) {
        return false
      }
    }
  }

  return true
}

/**
 * Get real-time sports statistics - NO MOCK DATA
 * @returns {Promise<Object>} Real sports statistics
 */
export async function getRealSportsStats() {
  try {
    const realData = await fetchSportsDataWithCache()

    if (!realData || realData.length === 0) {
      return {
        totalGames: 0,
        liveGames: 0,
        leagues: 0,
        lastUpdated: new Date().toISOString(),
        dataSource: 'No real data available'
      }
    }

    const totalGames = realData.reduce((sum, league) => sum + (league.games?.length || 0), 0)
    const liveGames = realData.reduce((sum, league) => {
      return sum + (league.games?.filter(game => game.isLive || game.status === 'Live')?.length || 0)
    }, 0)

    return {
      totalGames,
      liveGames,
      leagues: realData.length,
      lastUpdated: new Date().toISOString(),
      dataSource: 'ESPN Real-Time APIs'
    }
  } catch (error) {
    console.error('Error getting real sports stats:', error)
    return {
      totalGames: 0,
      liveGames: 0,
      leagues: 0,
      lastUpdated: new Date().toISOString(),
      dataSource: 'Error fetching real data'
    }
  }
}
