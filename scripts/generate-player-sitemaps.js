// scripts/generate-players-sitemap.js
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const DOMAIN = 'https://sports.digitalworldhorizon.com';
const OUT_DIR = path.join(process.cwd(), 'public');
const OUT_FILE = path.join(OUT_DIR, 'players_sitemap.xml');

// قائمة الرياضات والبطولات المدعومة
const SPORTS_LEAGUES = [
    { sport: 'nfl', path: 'football/nfl' },
    { sport: 'nba', path: 'basketball/nba' },
    { sport: 'mlb', path: 'baseball/mlb' },
    { sport: 'nhl', path: 'hockey/nhl' },
    { sport: 'mls', path: 'soccer/usa.1' }
];

// دالة لجلب قائمة الفرق لرياضة معينة
async function fetchTeams(sportPath) {
    try {
        const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${sportPath}/teams`);
        if (!res.ok) {
            console.error(`Failed to fetch teams for ${sportPath}: ${res.status}`);
            return [];
        }

        const data = await res.json();
        return data.sports?.[0]?.leagues?.[0]?.teams || [];
    } catch (error) {
        console.error(`Error fetching teams for ${sportPath}:`, error.message);
        return [];
    }
}

// دالة لجلب قائمة اللاعبين لفريق معين
async function fetchTeamRoster(teamId, sportPath) {
    try {
        const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${sportPath}/teams/${teamId}/roster`);
        if (!res.ok) {
            console.error(`Failed to fetch roster for team ${teamId}: ${res.status}`);
            return [];
        }

        const data = await res.json();
        return data.athletes || [];
    } catch (error) {
        console.error(`Error fetching roster for team ${teamId}:`, error.message);
        return [];
    }
}

// الدالة الرئيسية لجمع جميع اللاعبين
async function fetchAllPlayers() {
    const urlsSet = new Set();
    const players = [];

    for (const { sport, path: sportPath } of SPORTS_LEAGUES) {
        try {
            console.log(`Processing ${sport.toUpperCase()}...`);

            // جلب جميع الفرق لهذه الرياضة
            const teams = await fetchTeams(sportPath);
            console.log(`Found ${teams.length} teams for ${sport}`);

            for (const teamData of teams) {
                const team = teamData.team;
                if (!team?.id) continue;

                console.log(`Fetching players for ${team.displayName}...`);

                // جلب قائمة اللاعبين للفريق
                const roster = await fetchTeamRoster(team.id, sportPath);

                for (const positionGroup of roster) {
                    for (const player of positionGroup.items || []) {
                        if (!player?.id) continue;

                        // إنشاء رابط فريد للاعب
                        const url = `${DOMAIN}/player/${team.id}/${player.id}?sport=${sport}`;

                        // تجنب التكرار
                        if (!urlsSet.has(url)) {
                            urlsSet.add(url);
                            players.push({
                                url,
                                lastmod: new Date().toISOString().split('T')[0],
                                changefreq: 'weekly',
                                priority: '0.7'
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`Error processing ${sport}:`, error.message);
        }
    }

    return players;
}

// بناء ملف XML
function buildXml(players) {
    const header = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    const body = players.map(player => `
  <url>
    <loc>${player.url}</loc>
    <lastmod>${player.lastmod}</lastmod>
    <changefreq>${player.changefreq}</changefreq>
    <priority>${player.priority}</priority>
  </url>`).join('');

    const footer = `\n</urlset>`;

    return header + body + footer;
}

// التنفيذ الرئيسي
(async () => {
    try {
        console.log('Starting players sitemap generation...');

        if (!fs.existsSync(OUT_DIR)) {
            fs.mkdirSync(OUT_DIR, { recursive: true });
        }

        const players = await fetchAllPlayers();

        if (players.length === 0) {
            console.warn('No players found. Generating empty sitemap.');
        } else {
            console.log(`Found ${players.length} unique player URLs`);
        }

        const xml = buildXml(players);
        fs.writeFileSync(OUT_FILE, xml, 'utf8');

        console.log(`Successfully generated sitemap with ${players.length} entries: ${OUT_FILE}`);

    } catch (error) {
        console.error('Error generating players sitemap:', error);
        process.exit(1);
    }
})();