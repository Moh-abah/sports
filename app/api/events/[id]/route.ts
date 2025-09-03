
import { NextResponse } from "next/server";

// Function to fetch real event details from ESPN - NO MOCK DATA
async function fetchRealEventDetails(eventId: string) {
  try {
    console.log(`\n=== START fetchRealEventDetails ===`);
    // console.log(`Event ID received: ${eventId}`);

    // تقسيم eventId إلى league و espnEventId
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

    // استدعاء API الخاص بـ ESPN
    const summaryResponse = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/${espnPath}/summary?event=${espnEventId}`,
      {
        headers: { "User-Agent": "SportsPro/1.0", Accept: "application/json" },
      }
    );

    if (!summaryResponse.ok)
      throw new Error(`ESPN API error: ${summaryResponse.status}`);

    const summaryData = await summaryResponse.json();

    // طباعة بيانات ESPN الخام للديباجينج
    // console.log("RAW ESPN DATA:", JSON.stringify(summaryData, null, 2));

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

    console.log(
      "✅ Normalized event sent to front-end:",
      JSON.stringify(normalized, null, 2)
    );
    console.log(`=== END fetchRealEventDetails ===\n`);

    return normalized;
  } catch (error) {
    console.error(`Error fetching real event details for ${eventId}:`, error);
    return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const eventDetails = await fetchRealEventDetails(eventId);

    if (!eventDetails) {
      return NextResponse.json(
        {
          error: `Real event not found: ${eventId}`,
          message:
            "This event may not exist in ESPN database or API is currently unavailable",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(eventDetails);
  } catch (error) {
    console.error("Error in real event details API:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch real event details",
        message:
          "Real-time event data is currently unavailable from ESPN",
      },
      { status: 500 }
    );
  }
}

