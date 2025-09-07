
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const leagues = ["nba", "nfl", "mlb", "nhl", "mls"];

// جلب جميع المسارات الديناميكية
async function getDynamicPaths() {
    const allPaths = [];

    // إضافة صفحات ثابتة مثل about و privacy
    const staticPages = [
        { loc: '/about', priority: 0.7, changefreq: 'monthly' },
        { loc: '/contact', priority: 0.7, changefreq: 'monthly' },
        { loc: '/privacy', priority: 0.6, changefreq: 'yearly' },
        { loc: '/terms', priority: 0.6, changefreq: 'yearly' },
        { loc: '/sports-guide', priority: 0.8, changefreq: 'weekly' },
    ];

    allPaths.push(...staticPages.map(page => ({
        ...page,
        lastmod: new Date().toISOString(),
    })));

    // إضافة مسارات الدوريات والمباريات
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
            console.warn(`⚠️ Failed to fetch ${league} games for sitemap:`, err.message);
        }
    }

    return allPaths;
}

module.exports = {
    siteUrl: 'https://livesportsresults.vercel.app',
    generateRobotsTxt: true,
    
    robotsTxtOptions: {
        additionalSitemaps: [
            'https://livesportsresults.vercel.app/eventpages_sitemap.xml',
        ],
    },

    // دمج المسارات الديناميكية والثابتة
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
