
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

       
    }

    return allPaths;
}

module.exports = {
    siteUrl: 'https://sports.digitalworldhorizon.com',
    generateRobotsTxt: true,
    
    robotsTxtOptions: {
        additionalSitemaps: [
            'https://sports.digitalworldhorizon.com/eventpages_sitemap.xml',
            'https://sports.digitalworldhorizon.com/players_sitemap.xml',

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
