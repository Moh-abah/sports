// scripts/generate-event-sitemaps.js
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const DOMAIN = 'https://sports.digitalworldhorizon.com';
const OUT_DIR = path.join(process.cwd(), 'public');
const OUT_FILE = path.join(OUT_DIR, 'eventpages_sitemap.xml');

async function fetchAllEventUrls() {
  try {
    const res = await fetch(`${DOMAIN}/api/sports`);
    if (!res.ok) throw new Error(`API responded with status: ${res.status}`);
    const data = await res.json();
    if (!data.data || !Array.isArray(data.data)) return [];

    const urls = [];
    for (const league of data.data) {
      if (!Array.isArray(league.games)) continue;
      for (const g of league.games) {
        if (!g.idEvent) continue;
        urls.push({
          loc: `${DOMAIN}/event/${g.idEvent}`,
          lastmod: g.dateEvent || new Date().toISOString(),
          priority: 1.0, // ثابت لكل الصفحات
          changefreq: 'daily', // ثابت لكل الصفحات
        });
      }
    }

    return urls;
  } catch (err) {
    console.error('Error fetching events:', err);
    return [];
  }
}

function buildXml(urls) {
  const header = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  const body = urls.map(u => `
  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('');

  const footer = `\n</urlset>`;
  return header + body + footer;
}

(async () => {
  try {
    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

    const urls = await fetchAllEventUrls();
    if (!urls.length) console.warn('No event URLs fetched — writing empty sitemap anyway');

    const xml = buildXml(urls);
    fs.writeFileSync(OUT_FILE, xml, 'utf8');
    console.log('Wrote', OUT_FILE, 'with', urls.length, 'entries');


  } catch (err) {
    console.error('Error generating sitemap:', err);
    process.exit(1);
  }
})();
