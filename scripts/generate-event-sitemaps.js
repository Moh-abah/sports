

// scripts/generate-event-sitemaps.js
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const DOMAIN = 'https://sports.digitalworldhorizon.com';
const OUT_DIR = path.join(process.cwd(), 'public');
const OUT_FILE = path.join(OUT_DIR, 'eventpages_sitemap.xml');

function safeEventId(g) {
  return g.idEvent || g.id || (g.uid && typeof g.uid === 'string' && g.uid.split(':').pop()) || null;
}

async function fetchAllEventUrls() {
  try {
    const res = await fetch(`${DOMAIN}/api/sports`);
    if (!res.ok) throw new Error(`API responded with status: ${res.status}`);
    const data = await res.json();
    if (!data.data || !Array.isArray(data.data)) return [];

    const urlSet = new Set();
    const urls = [];

    for (const league of data.data) {
      if (!Array.isArray(league.games)) continue;

      for (const g of league.games) {
        const eventId = safeEventId(g);
        if (!eventId) continue;

        const lastmod = (g.dateEvent || g.date || new Date().toISOString()).split('T')[0];

        // صفحات الحدث المطلوبة: base, /news, /depth
        const pages = [
          { loc: `${DOMAIN}/event/${eventId}`, lastmod, changefreq: 'daily', priority: 1.0 },
          { loc: `${DOMAIN}/event/${eventId}/news`, lastmod, changefreq: 'daily', priority: 0.9 },
          { loc: `${DOMAIN}/event/${eventId}/depth`, lastmod, changefreq: 'weekly', priority: 0.8 },
          { loc: `${DOMAIN}/event/${eventId}/roster`, lastmod, changefreq: 'weekly', priority: 0.7 },
        ];

        for (const p of pages) {
          if (!urlSet.has(p.loc)) {
            urlSet.add(p.loc);
            urls.push(p);
          } // else duplicate ignored
        }
      }
    }

    return urls;
  } catch (err) {
    console.error('Error fetching events:', err && err.message ? err.message : err);
    return [];
  }
}

function buildXml(urls) {
  const header = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  const body = urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n');

  const footer = `\n</urlset>`;
  return header + body + footer;
}

(async () => {
  try {
    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

    console.log('Fetching events from internal API...');
    const urls = await fetchAllEventUrls();

    if (!urls.length) {
      console.warn('No event URLs fetched — writing empty sitemap anyway');
    } else {
      console.log(`Found ${urls.length} unique URLs (event, /news, /depth).`);
    }

    const xml = buildXml(urls);
    fs.writeFileSync(OUT_FILE, xml, 'utf8');
    console.log('Wrote', OUT_FILE, 'with', urls.length, 'entries');

  } catch (err) {
    console.error('Error generating sitemap:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
