import { NextResponse } from "next/server"



async function lastnfl() {
  try {
    const today = new Date();
    const past30Days = new Date();
    past30Days.setDate(today.getDate() - 30);

    const formatDate = (d: Date) => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}${mm}${dd}`;
    };

    const dateRange = `${formatDate(past30Days)}-${formatDate(today)}`;

    const response = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${dateRange}`,
      {
        headers: {
          'User-Agent': 'SportsPro/1.0',
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) throw new Error(`NFL API error: ${response.status}`);

    const data = await response.json();
    if (!data.events || data.events.length === 0) {
      return { name: 'NFL', league: 'NFL', games: [] };
    }

    const games = data.events.map(event => {
      const competition = event.competitions?.[0];
      if (!competition) return null;

      const homeTeam = competition.competitors?.find(c => c.homeAway === 'home');
      const awayTeam = competition.competitors?.find(c => c.homeAway === 'away');

      return {
        idEvent: `nfl_${event.id}`,
        strHomeTeam: homeTeam?.team?.displayName || 'TBD',
        strAwayTeam: awayTeam?.team?.displayName || 'TBD',
        intHomeScore: homeTeam?.score ?? 0,
        intAwayScore: awayTeam?.score ?? 0,
        status: event.status?.type?.description || 'Scheduled',
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
        period: event.status?.period || 0,
        clock: event.status?.displayClock || '',
        isLive: event.status?.type?.state === 'in'
      };
    }).filter(g => g !== null);

    // عداد الحالات
    const scheduled = games.filter(g => g.status.toLowerCase().includes('scheduled')).length;
    const live = games.filter(g => g.isLive).length;
    const finished = games.filter(g => g.status.toLowerCase().includes('final')).length;

    return {
      name: 'NFL',
      league: 'NFL',
      games,
      stats: { scheduled, live, finished }
    };

  } catch (error) {
    console.error('NFL API error:', error);
    return { name: 'NFL', league: 'NFL', games: [], error: error.message };
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
    });

    if (!response.ok) {
      throw new Error(`NFL API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.events || data.events.length === 0) {
      console.warn("⚠️ fetchNFLData: No events found");
      return null;
    }

    const today = new Date();
    const past30Days = new Date();
    past30Days.setDate(today.getDate() - 30);

    let scheduledCount = 0;
    let liveCount = 0;
    let finishedCount = 0;

    const games = data.events
      .map(event => {
        const competition = event.competitions?.[0];
        if (!competition) return null;

        const homeTeam = competition.competitors?.find(c => c.homeAway === 'home');
        const awayTeam = competition.competitors?.find(c => c.homeAway === 'away');

        const homeScore = homeTeam?.score !== undefined ? Number(homeTeam.score) : 0;
        const awayScore = awayTeam?.score !== undefined ? Number(awayTeam.score) : 0;

        const gameDate = new Date(event.date);
        const statusType = event.status?.type?.state || 'pre'; // pre, in, post

        // عدّاد حسب الحالة
        if (statusType === 'pre') scheduledCount++;
        else if (statusType === 'in') liveCount++;
        else if (statusType === 'post') finishedCount++;

        const gameObj = {
          idEvent: `nfl_${event.id}`,
          strHomeTeam: homeTeam?.team?.displayName || 'TBD',
          strAwayTeam: awayTeam?.team?.displayName || 'TBD',
          intHomeScore: homeScore,
          intAwayScore: awayScore,
          status: event.status?.type?.description || 'Scheduled',
          strVenue: competition.venue?.fullName || 'TBD',
          dateEvent: gameDate.toISOString().split('T')[0],
          strLeague: 'NFL',
          formattedTime: gameDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            timeZoneName: 'short'
          }),
          homeTeamLogo: homeTeam?.team?.logo || '',
          awayTeamLogo: awayTeam?.team?.logo || '',
          period: event.status?.period || 0,
          clock: event.status?.displayClock || '',
          isLive: statusType === 'in'
        };

        return gameObj;
      })
      .filter(game => game && new Date(game.dateEvent) >= past30Days);

    console.log(`✅ NFL games in last 30 days: ${games.length}`);
    console.log(`📅 Scheduled: ${scheduledCount}`);
    console.log(`🏃 Live: ${liveCount}`);
    console.log(`✅ Finished: ${finishedCount}`);

    return {
      name: 'NFL',
      league: 'NFL',
      games,
      summary: {
        scheduled: scheduledCount,
        live: liveCount,
        finished: finishedCount
      }
    };
  } catch (error) {
    console.error('❌ NFL API error:', error);
    return null;
  }
}


async function fetchAllNFLGames() {
  try {
    // 1️⃣ جلب المباريات المجدولة والحالية
    const currentData = await fetchNFLData();

    // 2️⃣ جلب آخر 30 يوم من المباريات المنتهية
    const finishedData = await lastnfl();

    // إذا فشل أحد الندائين
    if (!currentData && !finishedData) {
      throw new Error("❌ Both APIs failed to return data.");
    }

    // 3️⃣ دمج كل المباريات في مصفوفة واحدة
    const allGames = [
      ...(currentData?.games || []),
      ...(finishedData?.games || [])
    ];

    if (allGames.length === 0) {
      console.warn("⚠️ No NFL games found after merging.");
      return {
        name: 'NFL',
        league: 'NFL',
        games: [],
        summary: { scheduled: 0, live: 0, finished: 0 }
      };
    }

    // 4️⃣ ترتيب النتائج:
    // - Live أولاً
    // - بعدها Scheduled
    // - بعدها Finished
    allGames.sort((a, b) => {
      const stateA = a.isLive ? 'in' : (a.status.toLowerCase().includes('scheduled') ? 'pre' : 'post');
      const stateB = b.isLive ? 'in' : (b.status.toLowerCase().includes('scheduled') ? 'pre' : 'post');

      // Live قبل كل شيء
      if (stateA === 'in' && stateB !== 'in') return -1;
      if (stateB === 'in' && stateA !== 'in') return 1;

      // المجدولة الأقرب وقتًا
      if (stateA === 'pre' && stateB === 'pre') {
        return new Date(a.dateEvent).getTime() - new Date(b.dateEvent).getTime();
      }

      // Finished → الأحدث قبل الأقدم
      if (stateA === 'post' && stateB === 'post') {
        return new Date(b.dateEvent).getTime() - new Date(a.dateEvent).getTime();
      }

      // pre vs post
      if (stateA === 'pre' && stateB === 'post') return -1;
      if (stateB === 'pre' && stateA === 'post') return 1;

      return 0;
    });

    // 5️⃣ عدّاد ملخص
    const summary = {
      scheduled: allGames.filter(g => g.status.toLowerCase().includes('scheduled')).length,
      live: allGames.filter(g => g.isLive).length,
      finished: allGames.filter(g => g.status.toLowerCase().includes('final')).length
    };

    return {
      name: 'NFL',
      league: 'NFL',
      games: allGames,
      summary
    };

  } catch (error) {
    console.error("❌ fetchAllNFLGames error:", error);
    return {
      name: 'NFL',
      league: 'NFL',
      games: [],
      summary: { scheduled: 0, live: 0, finished: 0 },
      error: error.message
    };
  }
}


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
    const today = new Date();
    const past30Days = new Date();
    past30Days.setDate(today.getDate() - 30);

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
    }).filter(game => {
      const gameDate = new Date(game.dateEvent);
      return gameDate >= past30Days; // فقط المباريات ضمن آخر 30 يوم
    });

    console.log(`🟢 fetchNBAData: Processed ${games.length} games successfully`);
    return { name: 'NBA', league: 'NBA', games };

  } catch (error) {
    console.error('❌ NBA API error:', error);
    return null;
  }
}



// // Function to fetch real NFL data from ESPN
// async function fetchNFLData() {
//   try {
//     const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard', {
//       headers: {
//         'User-Agent': 'SportsPro/1.0',
//         'Accept': 'application/json'
//       }
//     })

//     if (!response.ok) {
//       throw new Error(`NFL API error: ${response.status}`)
//     }

//     const data = await response.json()

//     if (!data.events || data.events.length === 0) {
//       return null
//     }
//     const today = new Date();
//     const past30Days = new Date();
//     past30Days.setDate(today.getDate() - 30);

//     const games = data.events.map(event => {
//       const competition = event.competitions[0]
//       const homeTeam = competition.competitors.find(c => c.homeAway === 'home')
//       const awayTeam = competition.competitors.find(c => c.homeAway === 'away')

//       return {
//         idEvent: `nfl_${event.id}`,
//         strHomeTeam: homeTeam?.team?.displayName || 'TBD',
//         strAwayTeam: awayTeam?.team?.displayName || 'TBD',
//         intHomeScore: homeTeam?.score || '0',
//         intAwayScore: awayTeam?.score || '0',
//         status: event.status.type.description || 'Scheduled',
//         strVenue: competition.venue?.fullName || 'TBD',
//         dateEvent: new Date(event.date).toISOString().split('T')[0],
//         strLeague: 'NFL',
//         formattedTime: new Date(event.date).toLocaleTimeString('en-US', {
//           hour: 'numeric',
//           minute: '2-digit',
//           timeZoneName: 'short'
//         }),
//         homeTeamLogo: homeTeam?.team?.logo || '',
//         awayTeamLogo: awayTeam?.team?.logo || '',
//         period: event.status.period || 0,
//         clock: event.status.displayClock || '',
//         isLive: event.status.type.state === 'in'
//       }
//     }).filter(game => {
//       const gameDate = new Date(game.dateEvent);
//       return gameDate >= past30Days; // فقط المباريات ضمن آخر 30 يوم
//     });

//     return {
//       name: 'NFL',
//       league: 'NFL',
//       games: games
//     }
//   } catch (error) {
//     console.error('NFL API error:', error)
//     return null
//   }
// }

// 🏟️ MLB: جلب مباريات اليوم + آخر يومين + دمجهم
async function lastmlb() {
  try {
    const today = new Date();
    const past2Days = new Date();
    past2Days.setDate(today.getDate() - 2);

    const formatDate = (d: Date) => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}${mm}${dd}`;
    };

    const dateRange = `${formatDate(past2Days)}-${formatDate(today)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // ⏱️ 20 ثانية

    const response = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?dates=${dateRange}`,
      {
        cache: "no-store", // 🚫 تعطيل الكاش لتجنب خطأ 2MB
        signal: controller.signal,
        headers: {
          'User-Agent': 'SportsPro/1.0',
          'Accept': 'application/json',
        },
      }
    );

    clearTimeout(timeout);

    if (!response.ok) throw new Error(`MLB API error: ${response.status}`);

    const data = await response.json();
    if (!data.events || data.events.length === 0) {
      return { name: 'MLB', league: 'MLB', games: [] };
    }

    const games = data.events.map(event => {
      const competition = event.competitions?.[0];
      if (!competition) return null;

      const homeTeam = competition.competitors?.find(c => c.homeAway === 'home');
      const awayTeam = competition.competitors?.find(c => c.homeAway === 'away');

      return {
        idEvent: `mlb_${event.id}`,
        strHomeTeam: homeTeam?.team?.displayName || 'TBD',
        strAwayTeam: awayTeam?.team?.displayName || 'TBD',
        intHomeScore: homeTeam?.score ?? 0,
        intAwayScore: awayTeam?.score ?? 0,
        status: event.status?.type?.description || 'Scheduled',
        strVenue: competition.venue?.fullName || 'TBD',
        dateEvent: new Date(event.date).toISOString().split('T')[0],
        strLeague: 'MLB',
        formattedTime: new Date(event.date).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short',
        }),
        homeTeamLogo: homeTeam?.team?.logo || '',
        awayTeamLogo: awayTeam?.team?.logo || '',
        period: event.status?.period || 0,
        clock: event.status?.displayClock || '',
        isLive: event.status?.type?.state === 'in',
      };
    }).filter(Boolean);

    return {
      name: 'MLB',
      league: 'MLB',
      games,
    };

  } catch (error) {
    console.error('❌ MLB lastmlb error:', error);
    return { name: 'MLB', league: 'MLB', games: [], error: error.message };
  }
}

// 🏟️ MLB: جلب مباريات اليوم والمجدولة
async function fetchMLBData() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(
      'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard',
      {
        cache: "no-store",
        signal: controller.signal,
        headers: {
          'User-Agent': 'SportsPro/1.0',
          'Accept': 'application/json',
        },
      }
    );

    clearTimeout(timeout);

    if (!response.ok) throw new Error(`MLB API error: ${response.status}`);

    const data = await response.json();
    if (!data.events || data.events.length === 0) {
      return null;
    }

    const games = data.events.map(event => {
      const competition = event.competitions?.[0];
      const homeTeam = competition?.competitors?.find(c => c.homeAway === 'home');
      const awayTeam = competition?.competitors?.find(c => c.homeAway === 'away');

      return {
        idEvent: `mlb_${event.id}`,
        strHomeTeam: homeTeam?.team?.displayName || 'TBD',
        strAwayTeam: awayTeam?.team?.displayName || 'TBD',
        intHomeScore: homeTeam?.score ?? 0,
        intAwayScore: awayTeam?.score ?? 0,
        status: event.status?.type?.description || 'Scheduled',
        strVenue: competition?.venue?.fullName || 'TBD',
        dateEvent: new Date(event.date).toISOString().split('T')[0],
        strLeague: 'MLB',
        formattedTime: new Date(event.date).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short',
        }),
        homeTeamLogo: homeTeam?.team?.logo || '',
        awayTeamLogo: awayTeam?.team?.logo || '',
        period: event.status?.period || 0,
        clock: event.status?.displayClock || '',
        isLive: event.status?.type?.state === 'in',
      };
    });

    return {
      name: 'MLB',
      league: 'MLB',
      games,
    };

  } catch (error) {
    console.error('❌ MLB fetchMLBData error:', error);
    return null;
  }
}

// 🏟️ MLB: دمج جميع المباريات وترتيبها
async function fetchAllMLBGames() {
  try {
    // 1️⃣ جلب مباريات اليوم
    const currentData = await fetchMLBData();

    // 2️⃣ جلب آخر يومين من المباريات المنتهية
    const finishedData = await lastmlb();

    if (!currentData && (!finishedData || finishedData.games.length === 0)) {
      throw new Error("❌ Both APIs failed to return data.");
    }

    // 3️⃣ دمج كل المباريات
    const allGames = [
      ...(currentData?.games || []),
      ...(finishedData?.games || []),
    ];

    if (allGames.length === 0) {
      console.warn("⚠️ No MLB games found after merging.");
      return {
        name: 'MLB',
        league: 'MLB',
        games: [],
        summary: { scheduled: 0, live: 0, finished: 0 },
      };
    }

    // 4️⃣ ترتيب النتائج:
    allGames.sort((a, b) => {
      const stateA = a.isLive ? 'in' : (a.status.toLowerCase().includes('scheduled') ? 'pre' : 'post');
      const stateB = b.isLive ? 'in' : (b.status.toLowerCase().includes('scheduled') ? 'pre' : 'post');

      if (stateA === 'in' && stateB !== 'in') return -1;
      if (stateB === 'in' && stateA !== 'in') return 1;

      if (stateA === 'pre' && stateB === 'pre') {
        return new Date(a.dateEvent).getTime() - new Date(b.dateEvent).getTime();
      }

      if (stateA === 'post' && stateB === 'post') {
        return new Date(b.dateEvent).getTime() - new Date(a.dateEvent).getTime();
      }

      return stateA === 'pre' ? -1 : 1;
    });

    // 5️⃣ عدّاد ملخص
    const summary = {
      scheduled: allGames.filter(g => g.status.toLowerCase().includes('scheduled')).length,
      live: allGames.filter(g => g.isLive).length,
      finished: allGames.filter(g => g.status.toLowerCase().includes('final')).length,
    };

    return {
      name: 'MLB',
      league: 'MLB',
      games: allGames,
      summary,
    };

  } catch (error) {
    console.error("❌ fetchAllMLBGames error:", error);
    return {
      name: 'MLB',
      league: 'MLB',
      games: [],
      summary: { scheduled: 0, live: 0, finished: 0 },
      error: error.message,
    };
  }
}




// async function lastmlb() {
//   try {
//     const today = new Date();
//     const past30Days = new Date();
//     past30Days.setDate(today.getDate() - 2);

//     const formatDate = (d: Date) => {
//       const yyyy = d.getFullYear();
//       const mm = String(d.getMonth() + 1).padStart(2, '0');
//       const dd = String(d.getDate()).padStart(2, '0');
//       return `${yyyy}${mm}${dd}`;
//     };

//     const dateRange = `${formatDate(past30Days)}-${formatDate(today)}`;

//     const response = await fetch(
//       `https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?dates=${dateRange}`,
//       {
//         headers: {
//           'User-Agent': 'SportsPro/1.0',
//           'Accept': 'application/json'
//         }
//       }
//     );

//     if (!response.ok) throw new Error(`MLB API error: ${response.status}`);

//     const data = await response.json();
//     if (!data.events || data.events.length === 0) {
//       return { name: 'MLB', league: 'MLB', games: [] };
//     }

//     const games = data.events.map(event => {
//       const competition = event.competitions?.[0];
//       if (!competition) return null;

//       const homeTeam = competition.competitors?.find(c => c.homeAway === 'home');
//       const awayTeam = competition.competitors?.find(c => c.homeAway === 'away');

//       return {
//         idEvent: `mlb_${event.id}`,
//         strHomeTeam: homeTeam?.team?.displayName || 'TBD',
//         strAwayTeam: awayTeam?.team?.displayName || 'TBD',
//         intHomeScore: homeTeam?.score ?? 0,
//         intAwayScore: awayTeam?.score ?? 0,
//         status: event.status?.type?.description || 'Scheduled',
//         strVenue: competition.venue?.fullName || 'TBD',
//         dateEvent: new Date(event.date).toISOString().split('T')[0],
//         strLeague: 'MLB',
//         formattedTime: new Date(event.date).toLocaleTimeString('en-US', {
//           hour: 'numeric',
//           minute: '2-digit',
//           timeZoneName: 'short'
//         }),
//         homeTeamLogo: homeTeam?.team?.logo || '',
//         awayTeamLogo: awayTeam?.team?.logo || '',
//         period: event.status?.period || 0,
//         clock: event.status?.displayClock || '',
//         isLive: event.status?.type?.state === 'in'
//       };
//     }).filter(g => g !== null);

//     // عداد الحالات
//     const scheduled = games.filter(g => g.status.toLowerCase().includes('scheduled')).length;
//     const live = games.filter(g => g.isLive).length;
//     const finished = games.filter(g => g.status.toLowerCase().includes('final')).length;

//     return {
//       name: 'MLB',
//       league: 'MLB',
//       games,
//       stats: { scheduled, live, finished }
//     };

//   } catch (error) {
//     console.error('MLB API error:', error);
//     return { name: 'MLB', league: 'MLB', games: [], error: error.message };
//   }
// }
// // Function to fetch real MLB data from ESPN
// async function fetchMLBData() {
//   try {
//     const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard', {
//       headers: {
//         'User-Agent': 'SportsPro/1.0',
//         'Accept': 'application/json'
//       }
//     })

//     if (!response.ok) {
//       throw new Error(`MLB API error: ${response.status}`)
//     }

//     const data = await response.json()

//     if (!data.events || data.events.length === 0) {
//       return null
//     }

//     const games = data.events.map(event => {
//       const competition = event.competitions[0]
//       const homeTeam = competition.competitors.find(c => c.homeAway === 'home')
//       const awayTeam = competition.competitors.find(c => c.homeAway === 'away')

//       return {
//         idEvent: `mlb_${event.id}`,
//         strHomeTeam: homeTeam?.team?.displayName || 'TBD',
//         strAwayTeam: awayTeam?.team?.displayName || 'TBD',
//         intHomeScore: homeTeam?.score || '0',
//         intAwayScore: awayTeam?.score || '0',
//         status: event.status.type.description || 'Scheduled',
//         strVenue: competition.venue?.fullName || 'TBD',
//         dateEvent: new Date(event.date).toISOString().split('T')[0],
//         strLeague: 'MLB',
//         formattedTime: new Date(event.date).toLocaleTimeString('en-US', {
//           hour: 'numeric',
//           minute: '2-digit',
//           timeZoneName: 'short'
//         }),
//         homeTeamLogo: homeTeam?.team?.logo || '',
//         awayTeamLogo: awayTeam?.team?.logo || '',
//         period: event.status.period || 0,
//         clock: event.status.displayClock || '',
//         isLive: event.status.type.state === 'in'
//       }
//     })

//     return {
//       name: 'MLB',
//       league: 'MLB',
//       games: games
//     }
//   } catch (error) {
//     console.error('MLB API error:', error)
//     return null
//   }
// }


// async function fetchAllMLBGames() {
//   try {
//     // 1️⃣ جلب المباريات المجدولة والحالية
//     const currentData = await fetchMLBData();

//     // 2️⃣ جلب آخر 30 يوم من المباريات المنتهية
//     const finishedData = await lastmlb();

//     // إذا فشل أحد الندائين
//     if (!currentData && !finishedData) {
//       throw new Error("❌ Both APIs failed to return data.");
//     }

//     // 3️⃣ دمج كل المباريات في مصفوفة واحدة
//     const allGames = [
//       ...(currentData?.games || []),
//       ...(finishedData?.games || [])
//     ];

//     if (allGames.length === 0) {
//       console.warn("⚠️ No MLB games found after merging.");
//       return {
//         name: 'MLB',
//         league: 'MLB',
//         games: [],
//         summary: { scheduled: 0, live: 0, finished: 0 }
//       };
//     }

//     // 4️⃣ ترتيب النتائج:
//     // - Live أولاً
//     // - بعدها Scheduled
//     // - بعدها Finished
//     allGames.sort((a, b) => {
//       const stateA = a.isLive ? 'in' : (a.status.toLowerCase().includes('scheduled') ? 'pre' : 'post');
//       const stateB = b.isLive ? 'in' : (b.status.toLowerCase().includes('scheduled') ? 'pre' : 'post');

//       // Live قبل كل شيء
//       if (stateA === 'in' && stateB !== 'in') return -1;
//       if (stateB === 'in' && stateA !== 'in') return 1;

//       // المجدولة الأقرب وقتًا
//       if (stateA === 'pre' && stateB === 'pre') {
//         return new Date(a.dateEvent).getTime() - new Date(b.dateEvent).getTime();
//       }

//       // Finished → الأحدث قبل الأقدم
//       if (stateA === 'post' && stateB === 'post') {
//         return new Date(b.dateEvent).getTime() - new Date(a.dateEvent).getTime();
//       }

//       // pre vs post
//       if (stateA === 'pre' && stateB === 'post') return -1;
//       if (stateB === 'pre' && stateA === 'post') return 1;

//       return 0;
//     });

//     // 5️⃣ عدّاد ملخص
//     const summary = {
//       scheduled: allGames.filter(g => g.status.toLowerCase().includes('scheduled')).length,
//       live: allGames.filter(g => g.isLive).length,
//       finished: allGames.filter(g => g.status.toLowerCase().includes('final')).length
//     };

//     return {
//       name: 'MLB',
//       league: 'MLB',
//       games: allGames,
//       summary
//     };

//   } catch (error) {
//     console.error("❌ fetchAllMLBGames error:", error);
//     return {
//       name: 'MLB',
//       league: 'MLB',
//       games: [],
//       summary: { scheduled: 0, live: 0, finished: 0 },
//       error: error.message
//     };
//   }
// }


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
    fetchAllNFLGames(),
    
    
    fetchAllMLBGames(),
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