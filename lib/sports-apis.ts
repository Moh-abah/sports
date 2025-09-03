

type Sport = "nfl" | "nba" | "mlb" | "nhl" | "mls";

interface Team {
  name: string;
  score: number | null;
}

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  time: string;
  venue: string;
  league: string;
  date: string;
  isLive: boolean;
  source: string;
  formattedTime: string;
}

// ---------------- ESPN ----------------
export async function fetchESPNData(sport: Sport): Promise<any | null> {
  const sportMap: Record<Sport, string> = {
    nfl: "football/nfl",
    nba: "basketball/nba",
    mlb: "baseball/mlb",
    nhl: "hockey/nhl",
    mls: "soccer/usa.1",
  };

  try {
    const response = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/${sportMap[sport]}/scoreboard`,
      {
        next: { revalidate: 300 },
        headers: { "User-Agent": "LiveSportsResults/1.0" },
      }
    );

    if (!response.ok) {
      console.warn(`ESPN API returned ${response.status} for ${sport}`);
      return null;
    }

    return await response.json();
  } catch (error: any) {
    console.warn("ESPN API Error:", error.message);
    return null;
  }
}

// ---------------- TheSportsDB ----------------
export async function fetchTheSportsDBData(sport: Sport): Promise<any | null> {
  const API_KEY = process.env.THESPORTSDB_API_KEY || "3";
  const today = getTodayDate();

  const leagueMap: Record<Sport, string> = {
    nfl: "NFL",
    nba: "NBA",
    mlb: "MLB",
    nhl: "NHL",
    mls: "MLS",
  };

  try {
    const response = await fetch(
      `https://www.thesportsdb.com/api/v1/json/${API_KEY}/eventsday.php?d=${today}&l=${leagueMap[sport]}`,
      {
        next: { revalidate: 300 },
        headers: { "User-Agent": "LiveSportsResults/1.0" },
      }
    );

    if (!response.ok) {
      throw new Error(`TheSportsDB returned ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.warn("TheSportsDB Error:", error.message);
    return null;
  }
}

// ---------------- Normalize ESPN Data ----------------
function normalizeESPNData(data: any, sport: Sport): Game[] {
  if (!data.events || !Array.isArray(data.events)) return [];

  return data.events.map((event: any) => {
    const competition = event.competitions?.[0];
    const competitors = competition?.competitors || [];
    const homeTeam = competitors.find((c: any) => c.homeAway === "home");
    const awayTeam = competitors.find((c: any) => c.homeAway === "away");

    return {
      id: event.id || `espn-${Date.now()}-${Math.random()}`,
      homeTeam: homeTeam?.team?.displayName || "Home Team",
      awayTeam: awayTeam?.team?.displayName || "Away Team",
      homeScore: homeTeam?.score ?? null,
      awayScore: awayTeam?.score ?? null,
      status: event.status?.type?.description || "Scheduled",
      time: event.date ? new Date(event.date).toLocaleTimeString() : "TBD",
      venue: competition?.venue?.fullName || "TBD",
      league: sport.toUpperCase(),
      date: event.date ? event.date.split("T")[0] : getTodayDate(),
      isLive: event.status?.type?.state === "in" || false,
      source: "ESPN",
      formattedTime: event.date ? new Date(event.date).toLocaleTimeString() : "TBD",
    };
  });
}

// ---------------- Normalize TheSportsDB Data ----------------
function normalizeTheSportsDBData(data: any, sport: Sport): Game[] {
  if (!data.events || !Array.isArray(data.events)) return [];

  return data.events.map((event: any) => ({
    id: event.idEvent || `sportsdb-${Date.now()}-${Math.random()}`,
    homeTeam: event.strHomeTeam || "Home Team",
    awayTeam: event.strAwayTeam || "Away Team",
    homeScore: event.intHomeScore ?? null,
    awayScore: event.intAwayScore ?? null,
    status: determineGameStatus(event),
    time: event.strTime || "TBD",
    venue: event.strVenue || "TBD",
    league: event.strLeague || sport.toUpperCase(),
    date: event.dateEvent || getTodayDate(),
    isLive: isGameLive(event),
    source: "TheSportsDB",
    formattedTime: formatTime(event.strTime),
  }));
}

// ---------------- Helper Functions ----------------
function determineGameStatus(event: any): string {
  if (event.strStatus) {
    const status = event.strStatus.toLowerCase();
    if (status.includes("live") || status.includes("in progress")) return "Live";
    if (status.includes("finished") || status.includes("final")) return "Final";
    if (status.includes("postponed")) return "Postponed";
    if (status.includes("cancelled")) return "Cancelled";
  }
  if (event.intHomeScore && event.intAwayScore) return "Final";
  return "Scheduled";
}

function isGameLive(event: any): boolean {
  const status = event.strStatus?.toLowerCase() || "";
  return (
    status.includes("live") ||
    status.includes("in progress") ||
    status.includes("1st") ||
    status.includes("2nd") ||
    status.includes("3rd") ||
    status.includes("4th")
  );
}

function formatTime(timeStr?: string): string {
  if (!timeStr) return "TBD";
  try {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  } catch {
    return timeStr;
  }
}

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

// ---------------- Mock Data ----------------
function getRealisticMockData(sport: Sport): Game[] {
  const mockData: Record<Sport, Game[]> = {
    nfl: [
      {
        id: "mock-nfl-1",
        homeTeam: "Kansas City Chiefs",
        awayTeam: "Buffalo Bills",
        homeScore: 24,
        awayScore: 20,
        status: "Final",
        time: "4:25 PM",
        venue: "Arrowhead Stadium",
        league: "NFL",
        date: getTodayDate(),
        isLive: false,
        source: "Mock Data",
        formattedTime: "4:25 PM",
      },
      {
        id: "mock-nfl-2",
        homeTeam: "Dallas Cowboys",
        awayTeam: "Philadelphia Eagles",
        homeScore: 14,
        awayScore: 21,
        status: "Live",
        time: "8:20 PM",
        venue: "AT&T Stadium",
        league: "NFL",
        date: getTodayDate(),
        isLive: true,
        source: "Mock Data",
        formattedTime: "8:20 PM",
      },
    ],
    nba: [
      {
        id: "mock-nba-1",
        homeTeam: "Los Angeles Lakers",
        awayTeam: "Boston Celtics",
        homeScore: 108,
        awayScore: 112,
        status: "Final",
        time: "10:00 PM",
        venue: "Crypto.com Arena",
        league: "NBA",
        date: getTodayDate(),
        isLive: false,
        source: "Mock Data",
        formattedTime: "10:00 PM",
      },
    ],
    mlb: [
      {
        id: "mock-mlb-1",
        homeTeam: "New York Yankees",
        awayTeam: "Boston Red Sox",
        homeScore: 7,
        awayScore: 4,
        status: "Final",
        time: "7:05 PM",
        venue: "Yankee Stadium",
        league: "MLB",
        date: getTodayDate(),
        isLive: false,
        source: "Mock Data",
        formattedTime: "7:05 PM",
      },
    ],
    nhl: [
      {
        id: "mock-nhl-1",
        homeTeam: "Toronto Maple Leafs",
        awayTeam: "Montreal Canadiens",
        homeScore: 3,
        awayScore: 2,
        status: "Final",
        time: "7:00 PM",
        venue: "Scotiabank Arena",
        league: "NHL",
        date: getTodayDate(),
        isLive: false,
        source: "Mock Data",
        formattedTime: "7:00 PM",
      },
    ],
    mls: [
      {
        id: "mock-mls-1",
        homeTeam: "LA Galaxy",
        awayTeam: "Seattle Sounders",
        homeScore: 2,
        awayScore: 1,
        status: "Final",
        time: "10:30 PM",
        venue: "Dignity Health Sports Park",
        league: "MLS",
        date: getTodayDate(),
        isLive: false,
        source: "Mock Data",
        formattedTime: "10:30 PM",
      },
    ],
  };

  return mockData[sport] || [];
}

// ---------------- Aggregate Function ----------------
export async function fetchLiveGamesData(sport: Sport): Promise<Game[]> {
  console.log(`Fetching data for ${sport}...`);

  // Try ESPN first
  const espnData = await fetchESPNData(sport);
  if (espnData && espnData.events && espnData.events.length > 0) {
    console.log(`ESPN data found for ${sport}: ${espnData.events.length} games`);
    return normalizeESPNData(espnData, sport);
  }

  // Fallback TheSportsDB
  const sportsDBData = await fetchTheSportsDBData(sport);
  if (sportsDBData && sportsDBData.events && sportsDBData.events.length > 0) {
    console.log(`TheSportsDB data found for ${sport}: ${sportsDBData.events.length} games`);
    return normalizeTheSportsDBData(sportsDBData, sport);
  }

  // All failed, return mock
  console.log(`All APIs failed for ${sport}, using mock data`);
  return getRealisticMockData(sport);
}
