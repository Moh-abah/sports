/** @type {import('next').NextConfig} */
const nextConfig = {
  // إزالة optimizeCss التجريبي الذي يسبب مشاكل
  experimental: {
    // optimizeCss: true, // تم إزالته
  },

  // تحسين الصور
  images: {
    domains: ["www.thesportsdb.com", "thesportsdb.com"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true,
  },

  // تحسين الأداء
  compress: true,

  // تحسين timeout للبناء
  staticPageGenerationTimeout: 60, // تقليل الوقت من 120 إلى 60

  // Headers للأمان والأداء
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ]
  },

  // تجاهل الأخطاء أثناء البناء
  eslint: {
    ignoreDuringBuilds: true,
  },

  // تجاهل الأخطاء في TypeScript أثناء البناء
  typescript: {
    ignoreBuildErrors: true,
  },

  // تحسين البناء
  swcMinify: true,

  // تحسين الـ output
  output: "standalone",
}

module.exports = nextConfig
