// app/sitemap.xml.ts
import { fetchSportsData } from "@/lib/api"; // دالة تجيب كل المباريات

export async function GET() {
    const events = await fetchSportsData(); // كل المباريات
    const baseUrl = "https://livesportsresults.vercel.app";

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${baseUrl}</loc>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
    ${events
            .map(
                (event: any) => `
      <url>
        <loc>${baseUrl}/event/${event.idEvent}</loc>
        <lastmod>${new Date(event.dateEvent).toISOString()}</lastmod>
        <changefreq>hourly</changefreq>
        <priority>0.9</priority>
      </url>
    `
            )
            .join("")}
  </urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
