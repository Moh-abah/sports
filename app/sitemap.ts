// app/sitemap.xml/route.ts
import { fetchLiveGamesData } from "@/lib/sports-apis";

const BASE_URL = "https://livesportsresults.vercel.app";

export async function GET() {
    const leagues = ["nfl", "nba", "mlb", "nhl", "mls"];
    let urls: string[] = [];

    for (const league of leagues) {
        try {
            const games = await fetchLiveGamesData(league);
            if (Array.isArray(games)) {
                games.forEach((game) => {
                    const id = game.id;
                    urls.push(`${BASE_URL}/event/${league}_${id}`);
                });
            }
        } catch (err) {
            console.error(`Error fetching ${league}:`, err);
        }
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
            .map(
                (url) => `
  <url>
    <loc>${url}</loc>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>`
            )
            .join("")}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
