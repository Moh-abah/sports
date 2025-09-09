import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next";
const GA_MEASUREMENT_ID = "G-ECFDHY76X3"
const GA_MEASUREMENT_IDinDWH = "G-BV6MPGPYS9"



export const metadata: Metadata = {
  title: "Live Sports Results | Real-time American Sports Scores",
  description:
    "Get real-time sports scores and results for American sports including MLB, NBA, NFL, NHL, and MLS. Live updates, match details, and more.",
  keywords: "live sports, sports scores, MLB scores, NBA scores, NFL scores, NHL scores, MLS scores, American sports",
  authors: [{ name: "Live Sports Results" }],
  creator: "Live Sports Results",
  publisher: "Live Sports Results",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sports.digitalworldhorizon.com",
    title: "Live Sports Results | Real-time American Sports Scores",
    description: "Get real-time sports scores and results for American sports including MLB, NBA, NFL, NHL, and MLS.",
    siteName: "Live Sports Results",
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Sports Results | Real-time American Sports Scores",
    description: "Get real-time sports scores and results for American sports including MLB, NBA, NFL, NHL, and MLS.",
    creator: "@livesportsresults",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        
        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e40af" />
        <link rel="canonical" href="https://sports.digitalworldhorizon.com" />

        {/* Preconnect to improve performance */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
        <link rel="preconnect" href="https://tpc.googlesyndication.com" />

        <Script id="structured-data" type="application/ld+json" strategy="afterInteractive">
          {`
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://sports.digitalworldhorizon.com/#organization",
      "name": "Live Sports Results",
      "url": "https://sports.digitalworldhorizon.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sports.digitalworldhorizon.com/logo.png",
        "width": 200,
        "height": 200
      },
      
      
      "foundingDate": "2025-09-01"
    },
    {
      "@type": "WebSite",
      "@id": "https://sports.digitalworldhorizon.com/#website",
      "url": "https://sports.digitalworldhorizon.com",
      "name": "Live Sports Results",
      "publisher": {
        "@id": "https://sports.digitalworldhorizon.com/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://sports.digitalworldhorizon.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "SportsOrganization",
      "name": "Live Sports Results",
      "description": "Real-time sports scores and results for American sports",
      "url": "https://sports.digitalworldhorizon.com",
      "logo": "https://sports.digitalworldhorizon.com/logo.png",
      "sport": [
        "Baseball",
        "Basketball",
        "American Football",
        "Ice Hockey",
        "Soccer"
      ]
      
    }
  ]
}
`}
        </Script>


        {/* Google AdSense - محسن للأداء */}
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2668531109183096"
        />

        <meta name="google-site-verification" content="m8w370EfZ-39S-A37CL08wK_rBdq7hlyoUa3gfQv2_w" />
        <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_IDinDWH}`} />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_IDinDWH}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
