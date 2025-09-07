// E:\sport\lib\api.ts

export const API_BASE = "/api/nfl";
import { Player, Coach, Team } from "@/types/playerr";
import { getCachedEvent, setCachedEvent } from "./cache";
export async function fetchTeams() {
  const res = await fetch(`${API_BASE}/teams`);
  if (!res.ok) throw new Error("Failed to fetch teams");
  return res.json();
}

export async function fetchTeamDepthChart(slug: string) {
  const res = await fetch(`${API_BASE}/team/${slug}/depth-chart`);
  if (!res.ok) throw new Error("Failed to fetch depth chart");
  return res.json();
}

export async function fetchPlayer(slug: string) {
  const res = await fetch(`${API_BASE}/player/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch player data");
  return res.json();
}

export async function fetchMatchById(id: string) {
  const res = await fetch(`${API_BASE}/matches/${id}`);
  if (!res.ok) throw new Error("Failed to fetch match data");
  return res.json();
}

export async function fetchScoreboard() {
  const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`);
  if (!res.ok) throw new Error("Failed to fetch scoreboard");
  return res.json();
}




// lib/api.ts
export async function fetchAllEvents() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sports`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 1800 } // ISR - تحديث كل 30 دقيقة
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch events: ${res.status}`)
    }

    const data = await res.json()

    // لو ما فيه بيانات
    if (!data?.data || data.data.length === 0) {
      return []
    }

    // استخراج جميع الأحداث من جميع البطولات
    const allEvents = data.data.flatMap((league: any) => league.games || [])

    // تجهيز البيانات للسايت ماب
    return allEvents.map((event: any) => ({
      id: event.idEvent,
      dateEvent: event.dateEvent || new Date().toISOString()
    }))
  } catch (error) {
    console.error("Error fetching all events:", error)
    return []
  }
}










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
  // console.group(`🔵 fetchEventDetails called for: ${eventId}`);
  const cached = getCachedEvent(eventId);
  if (cached) {
    console.log("✅ Returning cached event");
    console.groupEnd();
    return cached;
  }
  try {
    const [league, espnEventId] = eventId.split("_");
    if (!league || !espnEventId) throw new Error("Invalid event ID format");

    // تحديد نوع الرياضة حسب الـ league
    const leagueMap: { [key: string]: string } = {
      nba: "basketball/nba",
      nfl: "football/nfl",
      mlb: "baseball/mlb",
      nhl: "hockey/nhl",
      mls: "soccer/usa.1",
    };

    const espnPath = leagueMap[league.toLowerCase()];
    if (!espnPath) throw new Error(`Unsupported league: ${league}`);


    const summaryResponse = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/${espnPath}/summary?event=${espnEventId}`,
      {
        headers: { "User-Agent": "SportsPro/1.0", Accept: "application/json" },
      }
    );

    if (!summaryResponse.ok)
      throw new Error(`ESPN API error: ${summaryResponse.status}`);

    const summaryData = await summaryResponse.json();


    if (!summaryData.header) throw new Error("Event not found");

    const event = summaryData.header;
    const competition = event.competitions?.[0];
    if (!competition) throw new Error("No competition data found");

    const homeTeam = competition.competitors?.find(
      (c: any) => c.homeAway === "home"
    );
    const awayTeam = competition.competitors?.find(
      (c: any) => c.homeAway === "away"
    );

    // تطبيع بيانات الملعب - مع fallback لو البيانات ناقصة
    const venueData = competition?.venue || summaryData?.gameInfo?.venue || {};

    // تجهيز بيانات اللاعبين إذا كانت متاحة
    const playerStats = summaryData?.boxscore?.players || [];

    // تجهيز البيانات النهائية
    const normalized = {
      id: eventId,
      league: {
        id: event.league?.id || "",
        name: event.league?.name || league.toUpperCase(),
        abbreviation: event.league?.abbreviation || "",
        links: event.league?.links || [],
      },

      // بيانات الفريق المستضيف
      homeTeam: {
        id: homeTeam?.team?.id || "",
        name: homeTeam?.team?.displayName || "Home",
        abbreviation: homeTeam?.team?.abbreviation || "",
        shortName: homeTeam?.team?.shortDisplayName || "",
        color: homeTeam?.team?.color || "",
        alternateColor: homeTeam?.team?.alternateColor || "",
        logo: homeTeam?.team?.logos?.[0]?.href || "",
        score: Number(homeTeam?.score) || 0,
        record: homeTeam?.records || [],
        stats: homeTeam?.statistics || [],
        links: homeTeam?.team?.links || [],
      },

      // بيانات الفريق الضيف
      awayTeam: {
        id: awayTeam?.team?.id || "",
        name: awayTeam?.team?.displayName || "Away",
        abbreviation: awayTeam?.team?.abbreviation || "",
        shortName: awayTeam?.team?.shortDisplayName || "",
        color: awayTeam?.team?.color || "",
        alternateColor: awayTeam?.team?.alternateColor || "",
        logo: awayTeam?.team?.logos?.[0]?.href || "",
        score: Number(awayTeam?.score) || 0,
        record: awayTeam?.records || [],
        stats: awayTeam?.statistics || [],
        links: awayTeam?.team?.links || [],
      },

      // حالة المباراة
      status: {
        description: event.status?.type?.description || "Scheduled",
        state: event.status?.type?.state || "",
        period: event.status?.period || 0,
        displayClock: event.status?.displayClock || "",
        isLive: event.status?.type?.state === "in",
      },

      dateEvent: event.date,

      // بيانات الملعب
      venue: {
        id: venueData?.id || "",
        name: venueData?.fullName || "TBD",
        city: venueData?.address?.city || "",
        country: venueData?.address?.country || "",
        capacity: venueData?.capacity || 0,
        indoor: venueData?.indoor || false,
      },

      // بيانات الموسم
      season: event.season || {},

      // وصف عام للمباراة
      description: event.description || "",

      // بيانات الفيديو والهايلايت
      highlights: summaryData.highlights || [],

      // الأخبار المتعلقة
      news: summaryData.news || [],

      // Boxscore كامل
      boxscore: {
        teams: summaryData?.boxscore?.teams || [],
        players: playerStats,
      },

      // Play-by-Play إذا كان موجود
      playByPlay: summaryData?.plays || [],

      // Competitors الخام
      competitors: competition.competitors || [],

      // روابط المشاركة
      links: {
        web: event.links?.[0]?.href || "",
        mobile: event.links?.[1]?.href || "",
        tickets: event.tickets || [],
      },
    };

    // console.log(
    //   "✅ Normalized event sent to front-end:",
    //   JSON.stringify(normalized, null, 2)
    // );
    // console.log(`=== END fetchRealEventDetails ===\n`);

    return normalized;
  
    //  const [league, espnEventId] = eventId.split("_");
    //  if (!league || !espnEventId) throw new Error("Invalid event ID format");

    //  // تحديد نوع الرياضة حسب الـ league
    //  const leagueMap: { [key: string]: string } = {
    //    nba: "basketball/nba",
    //    nfl: "football/nfl",
    //    mlb: "baseball/mlb",
    //    nhl: "hockey/nhl",
    //    mls: "soccer/usa.1",
    //  };

    //  const espnPath = leagueMap[league.toLowerCase()];
    //  if (!espnPath) throw new Error(`Unsupported league: ${league}`);


     
     
    //  const response = await fetch(
    //    `https://site.api.espn.com/apis/site/v2/sports/${espnPath}/summary?event=${espnEventId}`,
    //    {
    //      cache: "force-cache",
    //      next: { revalidate: 1800 },
    //      headers: {
    //        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    //        "Accept": "application/json",
    //      },
    //    }
    //  );
    
    // if (!response.ok) {
    //   throw new Error(`API responded with status: ${response.status}`);
    // }

    

    // const data = await response.json();
    // // تحديد TTL حسب حالة المباراة
    // let ttl = 400; // 10 دقائق افتراضي
    // if (data.status?.isLive) ttl = 20; // حية: 20 ثانية
    // else if (data.status?.description?.toLowerCase() === "final") ttl = 86400; // منتهية: 24 ساعة
    // // مجدولة تبقى 10 دقائق (TTL الافتراضي)

    // setCachedEvent(eventId, data, ttl);
    // // console.log("Step 2: JSON parsed (raw):", !!data);

    // // helpers
    // const isPlayEvent = (obj: any) =>
    //   obj && (obj.sequenceNumber || obj.atBatId || (obj.type && obj.type.text));
    // const stripUnbalancedBraces = (s: string) =>
    //   typeof s === "string" ? s.replace(/\{[^}]*\}/g, "").trim() : s;

    // // deep sanitize for stats arrays (remove accidental play-by-play inside stats,
    // // strip broken brace fragments, and coerce numeric scores)
    // const sanitizedBoxscore: any = { teams: [], players: [] };
    // const collectedPlays: any[] = [];

    // if (data.boxscore?.teams && Array.isArray(data.boxscore.teams)) {
    //   for (const team of data.boxscore.teams) {
    //     const newTeam: any = { ...team };
    //     if (Array.isArray(team.statistics)) {
    //       newTeam.statistics = team.statistics.map((statGroup: any) => {
    //         if (!Array.isArray(statGroup.stats)) return { ...statGroup, stats: [] };
    //         const kept: any[] = [];
    //         for (const s of statGroup.stats) {
    //           // if this entry looks like a play, move it to playByPlay
    //           if (isPlayEvent(s)) {
    //             collectedPlays.push(s);
    //             continue;
    //           }
    //           // sanitize string fields inside stat entries
    //           if (typeof s === "object" && s !== null) {
    //             const cleaned: any = {};
    //             for (const k of Object.keys(s)) {
    //               cleaned[k] = typeof s[k] === "string" ? stripUnbalancedBraces(s[k]) : s[k];
    //             }
    //             kept.push(cleaned);
    //           } else if (typeof s === "string") {
    //             kept.push(stripUnbalancedBraces(s));
    //           } else {
    //             kept.push(s);
    //           }
    //         }
    //         return { ...statGroup, stats: kept };
    //       });
    //     }
    //     sanitizedBoxscore.teams.push(newTeam);
    //   }
    // } else if (data.boxscore) {
    //   // if boxscore exists but malformed, try to keep top-level
    //   sanitizedBoxscore.teams = data.boxscore.teams || [];
    // }

    // sanitizedBoxscore.players = data.boxscore?.players || [];

    // // normalize competitors <-> homeTeam/awayTeam records & scores
    // const competitors = data.competitors || [];
    // const findCompetitor = (id: any) => competitors.find((c: any) => `${c.id}` === `${id}`);

    // const readScore = (obj: any) => {
    //   if (obj == null) return 0;
    //   const n = Number(obj.score ?? obj.displayValue ?? obj);
    //   return Number.isFinite(n) ? n : 0;
    // };

    // // normalized top-level object
    // const normalizedData: any = {
    //   id: data.id || eventId,
    //   league: {
    //     id: data.league?.id ?? "",
    //     name: data.league?.name ?? "",
    //     abbreviation: data.league?.abbreviation ?? "",
    //     links: data.league?.links ?? [],
    //   },
    //   homeTeam: {
    //     id: data.homeTeam?.id ?? "",
    //     name: data.homeTeam?.name ?? "Home Team",
    //     abbreviation: data.homeTeam?.abbreviation ?? "",
    //     shortName: data.homeTeam?.shortName ?? data.homeTeam?.displayName ?? "",
    //     color: data.homeTeam?.color ?? "",
    //     alternateColor: data.homeTeam?.alternateColor ?? "",
    //     logo: data.homeTeam?.logo ?? "",
    //     score: readScore(data.homeTeam) || readScore(findCompetitor(data.homeTeam?.id)),
    //     record: data.homeTeam?.record?.length ? data.homeTeam.record : (findCompetitor(data.homeTeam?.id)?.record || []),
    //     stats: data.homeTeam?.stats || [],
    //     links: data.homeTeam?.links || [],
    //   },
    //   awayTeam: {
    //     id: data.awayTeam?.id ?? "",
    //     name: data.awayTeam?.name ?? "Away Team",
    //     abbreviation: data.awayTeam?.abbreviation ?? "",
    //     shortName: data.awayTeam?.shortName ?? data.awayTeam?.displayName ?? "",
    //     color: data.awayTeam?.color ?? "",
    //     alternateColor: data.awayTeam?.alternateColor ?? "",
    //     logo: data.awayTeam?.logo ?? "",
    //     score: readScore(data.awayTeam) || readScore(findCompetitor(data.awayTeam?.id)),
    //     record: data.awayTeam?.record?.length ? data.awayTeam.record : (findCompetitor(data.awayTeam?.id)?.record || []),
    //     stats: data.awayTeam?.stats || [],
    //     links: data.awayTeam?.links || [],
    //   },
    //   status: {
    //     description: (data.status?.description || "").toString(),
    //     state: data.status?.state || "",
    //     period: data.status?.period ?? 0,
    //     displayClock: data.status?.displayClock || "",
    //     isLive: !!data.status?.isLive,
    //   },
    //   dateEvent: data.dateEvent || data.date || "",
    //   venue: {
    //     id: data.venue?.id ?? "",
    //     name: data.venue?.name ?? "TBD",
    //     city: data.venue?.city ?? "",
    //     country: data.venue?.country ?? "",
    //     capacity: data.venue?.capacity > 0 ? data.venue.capacity : null,
    //     indoor: !!data.venue?.indoor,
    //   },
    //   season: data.season || {},
    //   description: data.description || "",
    //   highlights: data.highlights || [],
    //   news: data.news || {},
    //   boxscore: sanitizedBoxscore,
    //   playByPlay: Array.isArray(data.playByPlay) ? data.playByPlay.concat(collectedPlays) : collectedPlays,
    //   competitors: competitors,
    //   links: {
    //     web: data.links?.web || (data.boxscore?.links?.web ?? ""),
    //     mobile: data.links?.mobile || (data.boxscore?.links?.mobile ?? ""),
    //     tickets: data.links?.tickets || [],
    //   },
    // };

    // // reconcile status: if there are scores but status says Scheduled -> flip to In Progress
    // const totalScore = Number(normalizedData.homeTeam.score) + Number(normalizedData.awayTeam.score);
    // if (totalScore > 0) {
    //   const desc = (normalizedData.status.description || "").toLowerCase();
    //   if (desc.includes("sched") || desc === "" || desc === "scheduled") {
    //     normalizedData.status.description = "In Progress";
    //     normalizedData.status.isLive = true;
    //   }
    // }

    // // if there are linescores showing End, mark final
    // const anyLinescores = (data.boxscore?.teams || []).some((t: any) =>
    //   Array.isArray(t.linescores) && t.linescores.some((ls: any) => ls.displayValue === "End")
    // );
    // if (anyLinescores && totalScore > 0) {
    //   normalizedData.status.description = "Final";
    //   normalizedData.status.isLive = false;
    // }

    // // final safety: ensure numeric values for scores
    // normalizedData.homeTeam.score = Number(normalizedData.homeTeam.score) || 0;
    // normalizedData.awayTeam.score = Number(normalizedData.awayTeam.score) || 0;

    // // console.log("Step 3: Normalized event data:");
    // // console.log(JSON.stringify(normalizedData, null, 2));

    // console.groupEnd();
    // return normalizedData;
  } catch (error) {
    // console.error("Step 4: Error fetching/normalizing event details:", error);
    console.groupEnd();
    return null;
  }
}







// lib/api.ts


export async function fetchTeamRoster(teamId: string, sport: string) {
  try {
    const res = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/${sport}/teams/${teamId}/roster`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;

    const data = await res.json();

    // تحويل كل اللاعبين لمصفوفة منظمة
    const athletes = data.athletes.map((group: any) => ({
      position: group.position,
      players: group.items.map((player: any) => ({
        id: player.id,
        displayName: player.displayName,
        firstName: player.firstName,
        lastName: player.lastName,
        fullName: player.fullName,
        shortName: player.shortName,
        headshot: player.headshot,
        position: player.position,
        jersey: player.jersey,
        height: player.height,
        displayHeight: player.displayHeight,
        weight: player.weight,
        displayWeight: player.displayWeight,
        age: player.age,
        dateOfBirth: player.dateOfBirth,
        experience: player.experience,
        status: player.status,
        college: player.college,
        injuries: player.injuries,
        rawData: player,
      })),
    }));

    const coaches: Coach[] = data.coach || [];
    const team: Team = data.team;

    return { team, season: data.season, athletes, coaches };
  } catch (error) {
    console.error("Error fetching team roster:", error);
    return null;
  }
}



// lib/api.ts
/**
 * جلب بيانات لاعب معين بناءً على معرف اللاعب ونوع الرياضة
 * @param playerId معرف اللاعب
 * @param eventId معرف الحدث (يحتوي نوع الرياضة مثل nba_401812481)
 * @returns بيانات اللاعب أو null في حالة الخطأ
 */
export const fetchPlayerDetails = async (
  playerId: string,
  eventId: string
): Promise<PlayerDetails | null> => {
  try {
    // استخراج نوع الرياضة من eventId
    const sport = getSportFromEventId(eventId);
    console.log("Sport detected:", sport);

    // إنشاء رابط الـ fetch النهائي
    const finalUrl = `https://site.api.espn.com/apis/site/v2/sports/${getSportPath(sport)}/athletes/${playerId}`;

    console.log("Final Fetch URL:", finalUrl);

    // تنفيذ الطلب
    const response = await fetch(finalUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    console.log("Response status:", response.status);

    // إذا لم يكن الطلب ناجحًا
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // قراءة البيانات
    const data = await response.json();
    console.log("Raw API Data:", JSON.stringify(data, null, 2));

    // إذا البيانات فارغة
    if (!data || Object.keys(data).length === 0) {
      console.warn("API returned empty data!");
      return null;
    }

    // تحويل البيانات إلى الهيكل المطلوب
    const transformed = transformPlayerData(data.athlete || data);
    console.log("Transformed Player Data:", transformed);

    return transformed;
  } catch (error) {
    console.error("Error fetching player details:", error);
    return null;
  }
};

/**
 * تحديد مسار نوع الرياضة بناءً على ESPN API
 */
function getSportPath(sport: string): string {
  switch (sport) {
    case "nba":
      return "basketball/nba";
    case "nfl":
      return "football/nfl";
    case "mlb":
      return "baseball/mlb";
    case "nhl":
      return "hockey/nhl";
    case "mls":
      return "soccer/usa.1"; // MLS مساره بهذا الشكل
    default:
      throw new Error(`Unsupported sport type: ${sport}`);
  }
}

/**
 * استخراج نوع الرياضة من eventId
 * مثال: nba_401812481 → nba
 */
function getSportFromEventId(eventId: string): string {
  return eventId.split("_")[0].toLowerCase();
}

/**
 * تحويل بيانات اللاعب من API إلى هيكل PlayerDetails
 */
const transformPlayerData = (data: any): PlayerDetails => {
  return {
    id: data.id || data.athlete?.id || "",
    displayName: data.fullName || data.displayName || data.athlete?.fullName || "",
    firstName: data.firstName || data.athlete?.firstName || "",
    lastName: data.lastName || data.athlete?.lastName || "",
    position: {
      abbreviation: data.position?.abbreviation || data.athlete?.position?.abbreviation,
      name: data.position?.name || data.athlete?.position?.name,
    },
    jersey: data.jerseyNumber || data.athlete?.jersey || data.uniformNumber,
    headshot: {
      href: data.headshot?.href || data.athlete?.headshot?.href || data.imageUrl,
    },
    displayHeight: data.height || data.athlete?.height,
    displayWeight: data.weight || data.athlete?.weight,
    age: data.age || data.athlete?.age,
    status: {
      name: data.status || data.athlete?.status,
    },
    college: {
      name: data.college || data.collegeName || data.athlete?.college,
    },
    experience: {
      years: data.experience || data.yearsOfExperience || data.athlete?.experience,
    },
    dateOfBirth: data.dateOfBirth || data.birthDate || data.athlete?.dateOfBirth,
    birthPlace: data.birthPlace || data.birthCity || data.athlete?.birthPlace,
    draft: data.draft
      ? {
        year: data.draft.year,
        round: data.draft.round,
        pick: data.draft.pick,
      }
      : undefined,
    contract: data.contract
      ? {
        value: data.contract.value,
        years: data.contract.years,
      }
      : undefined,
    stats: data.stats || data.statistics,
    awards: data.awards || data.honors,
    socialMedia: data.socialMedia || data.socialNetworks,
    team: data.team
      ? {
        id: data.team.id,
        name: data.team.name,
        displayName: data.team.displayName,
        logo: data.team.logo,
      }
      : undefined,
  };
};

/**
 * تعريف نوع PlayerDetails
 */
export interface PlayerDetails {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  position?: {
    abbreviation?: string;
    name?: string;
  };
  jersey?: string;
  headshot?: {
    href: string;
  };
  displayHeight?: string;
  displayWeight?: string;
  age?: number;
  status?: {
    name?: string;
  };
  college?: {
    name?: string;
  };
  experience?: {
    years?: number;
  };
  dateOfBirth?: string;
  birthPlace?: string;
  draft?: {
    year?: number;
    round?: number;
    pick?: number;
  };
  contract?: {
    value?: string;
    years?: number;
  };
  stats?: any[];
  awards?: any[];
  socialMedia?: {
    platform: string;
    handle: string;
  }[];
  team?: {
    id: string;
    name: string;
    displayName: string;
    logo: string;
  };
}




/**
 * Fetches REAL events for a specific league - NO MOCK DATA
 * @param {string} leagueId - The ID or slug of the league to fetch
 * @returns {Promise<Array>} Array of real events for the league
 */
export async function fetchLeagueEvents(leagueId: string) {
  // console.log("=== fetchLeagueEvents START ===")
  // console.log("League ID:", leagueId)

  try {
    const response = await fetch(`/api/leagues/${leagueId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    // console.log("Response status:", response.status)
    if (!response.ok) throw new Error(`API responded with status: ${response.status}`)

    const data = await response.json()
    // console.log("Raw API data received:", data)

    if (data && Array.isArray(data.games)) {
      // console.log("Returning data.games array with length:", data.games.length)
      return data.games
    } else {
      // console.log("No games array found in API data, returning empty array")
      return []
    }

  } catch (error) {
    // console.error("Error fetching real league events:", error)
    return []
  } finally {
    // console.log("=== fetchLeagueEvents END ===")
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
    // console.log('Returning cached real sports data')
    return realDataCache.data
  }

  // Fetch fresh real data
  // console.log('Fetching fresh real sports data')
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
    // console.error('Error getting real sports stats:', error)
    return {
      totalGames: 0,
      liveGames: 0,
      leagues: 0,
      lastUpdated: new Date().toISOString(),
      dataSource: 'Error fetching real data'
    }
  }
}
