// app/sitemap.xml.js
import { fetchSportsData } from "@/lib/api";

export async function GET() {
    const leagues = await fetchSportsData(); // كل الدوريات والمباريات
    const baseUrl = "https://livesportsresults.vercel.app";

    // نجمع كل المباريات من جميع الدوريات
    const events = leagues.flatMap(league => league.events || []);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${baseUrl}</loc>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
    ${events
            .map(event => `
      <url>
        <loc>${baseUrl}/event/${event.idEvent}</loc>
        <lastmod>${event.dateEvent ? new Date(event.dateEvent).toISOString() : new Date().toISOString()}</lastmod>
        <changefreq>hourly</changefreq>
        <priority>0.9</priority>
      </url>
    `).join("")}
  </urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
