// pages/api/sitemap.xml.ts
import { NextApiRequest, NextApiResponse } from "next";
import { fetchLiveGamesData } from "@/lib/sports-apis";

const BASE_URL = "https://livesportsresults.vercel.app"; // غيّرها لدومينك
const leagues = ["nfl", "nba", "mlb", "nhl", "mls"];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const urls: { loc: string; lastmod: string; priority: number; changefreq: string }[] = [];

    for (const league of leagues) {
        // إضافة صفحة الدوري نفسها
        urls.push({
            loc: `${BASE_URL}/league/${league}`,
            lastmod: new Date().toISOString(),
            priority: 0.8,
            changefreq: 'daily'
        });

        try {
            const games = await fetchLiveGamesData(league);
            if (Array.isArray(games)) {
                games.forEach(game => {
                    const idEvent = game.idEvent || game.id;
                    const isLive = game.status === 'Live';
                    urls.push({
                        loc: `${BASE_URL}/event/${idEvent}`,
                        lastmod: isLive ? new Date().toISOString() : game.dateEvent || new Date().toISOString(),
                        priority: isLive ? 1.0 : 0.9,
                        changefreq: isLive ? 'hourly' : 'daily'
                    });
                });
            }
        } catch (err) {
            console.error(`Error fetching ${league}:`, err);
        }
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `
  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("")}
</urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();
}
