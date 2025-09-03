const fetch = require('node-fetch');

const leagues = ["nba", "nfl", "mlb", "nhl", "mls"];

// جلب جميع المسارات الديناميكية
async function getDynamicPaths() {
    const allPaths = [];

    for (const league of leagues) {
        // صفحة الدوري نفسها
        allPaths.push({
            loc: `/league/${league}`,
            lastmod: new Date().toISOString(),
            priority: 0.8,
            changefreq: 'daily'
        });

        try {
            const res = await fetch(`https://livesportsresults.vercel.app/api/leagues/${league}`);
            const data = await res.json();

            if (data.games && Array.isArray(data.games)) {
                data.games.forEach((game) => {
                    if (game.idEvent) {
                        allPaths.push({
                            loc: `/event/${game.idEvent}`,
                            lastmod: game.status === 'Live' ? new Date().toISOString() : game.dateEvent,
                            priority: game.status === 'Live' ? 1.0 : 0.9,
                            changefreq: game.status === 'Live' ? 'hourly' : 'daily'
                        });
                    }
                });
            }
        } catch (err) {
            console.warn(`Failed to fetch ${league} games for sitemap:`, err);
        }
    }

    return allPaths;
}

module.exports = {
    siteUrl: 'https://livesportsresults.vercel.app',
    generateRobotsTxt: true,
    sitemapSize: 5000,
    additionalPaths: async () => {
        const dynamicPaths = await getDynamicPaths();
        return dynamicPaths.map(path => ({
            loc: path.loc,
            lastmod: path.lastmod,
            priority: path.priority,
            changefreq: path.changefreq
        }));
    },
    transform: async (config, path) => ({
        loc: path.loc,
        lastmod: path.lastmod || new Date().toISOString(),
        priority: path.priority || 0.7,
        changefreq: path.changefreq || 'daily'
    }),
};
