// app/page.tsx (Server Component)
import { fetchSportsData } from "@/lib/api"
import HomeContent from "./clint"
import { Metadata } from "next"

export const revalidate = 1800 // 30 دقيقة

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Live Sports Results | Real-time MLB, NBA, NFL, NHL, MLS Scores",
    description: "Get live sports scores and results for MLB, NBA, NFL, NHL, and MLS. Real-time updates, match details, and stats.",
    keywords: "MLB, NBA, NFL, NHL, MLS, live sports, sports scores, American sports",
    openGraph: {
      title: "Live Sports Results",
      description: "Real-time sports scores for MLB, NBA, NFL, NHL, and MLS",
      url: "https://sports.digitalworldhorizon.com",
      siteName: "Live Sports Results",
      images: [
        {
          url: "https://sports.digitalworldhorizon.com/logo.png",
          width: 1200,
          height: 630,
          alt: "Live Sports Results",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Live Sports Results",
      description: "Real-time sports scores for MLB, NBA, NFL, NHL, and MLS",
      images: ["https://sports.digitalworldhorizon.com/logo.png"],
    },
  }
}

export default async function HomePage() {
  try {
    const initialData = await fetchSportsData()
    console.log("Fetched Sports Data:", initialData)
    const lastUpdated = new Date()

    return (
      <>
        {/* Structured Data للصفحة الرئيسية */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsOrganization",
              "name": "Live Sports Results",
              "url": "https://sports.digitalworldhorizon.com",
              "logo": "https://sports.digitalworldhorizon.com/logo.png",
              "sport": ["Baseball", "Basketball", "American Football", "Ice Hockey", "Soccer"],
            }),
          }}
        />
        <HomeContent
          initialData={initialData}
          
          initialLastUpdated={lastUpdated.toISOString()}
          initialError={null}
        />
        
      </>
    )
  } catch (error) {
    return (
      <HomeContent
        initialData={[]}
        initialLastUpdated={new Date().toISOString()}
        initialError="Failed to fetch initial data"
      />
    )
  }
}