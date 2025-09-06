

import { fetchEventDetails } from "@/lib/api"
import EventPageClient from "./client"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"

interface PageProps {
  params: Promise<{ id: string }>
}


export const revalidate = 1800


export async function generateMetadata({ params }: PageProps) {
  const { id } = await params

  try {
    const event = await fetchEventDetails(id)

    if (!event) {
      return {
        title: "Event Not Found - Live Sports Results",
        description: "The requested event could not be found.",
      }
    }

    const title = `${event.awayTeam?.name || 'Away'} vs ${event.homeTeam?.name || 'Home'} - ${event.league?.name || 'Game'} Live Score & Stats`
    const description = `Follow the ${event.league?.name || 'game'} between ${event.awayTeam?.name || 'Away'} and ${event.homeTeam?.name || 'Home'}. Live scores, stats, and updates.`
    const images = event.awayTeam?.logo || event.homeTeam?.logo ?
      [event.awayTeam?.logo, event.homeTeam?.logo].filter(Boolean) as string[] :
      []

    return {
      title,
      description,
      keywords: `${event.awayTeam?.name}, ${event.homeTeam?.name}, ${event.league?.name}, live scores, sports results, game stats`,
      openGraph: {
        title,
        description,
        type: 'website',
        locale: 'en_US',
        url: `https://livesportsresults.vercel.app/event/${id}`,
        siteName: 'Live Sports Results',
        images: images.map(url => ({
          url,
          width: 300,
          height: 300,
          alt: `${event.awayTeam?.name} vs ${event.homeTeam?.name}`,
        })),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: images.length > 0 ? images[0] : undefined,
      },
      alternates: {
        canonical: `https://livesportsresults.vercel.app/event/${id}`,
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Event - Live Sports Results",
      description: "Live sports scores and results",
    }
  }
}

// Structured Data (JSON-LD) للمحتوى الغني
function generateStructuredData(event: any, eventId: string) {
  if (!event) return null

  const homeTeam = event.homeTeam || {}
  const awayTeam = event.awayTeam || {}
  const status = event.status || {}
  const venue = event.venue || {}
  const league = event.league || {}

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "@id": `https://livesportsresults.vercel.app/event/${eventId}#sportsevent`,
    name: `${awayTeam.name || "Away Team"} vs ${homeTeam.name || "Home Team"}`,
    description: `Live ${league.name || "sports"} event between ${awayTeam.name || "Away Team"} and ${homeTeam.name || "Home Team"}`,
    startDate: event.dateEvent,
    endDate: event.dateEvent ? new Date(new Date(event.dateEvent).getTime() + 2 * 60 * 60 * 1000).toISOString() : undefined,
    eventStatus: status.isLive ?
      "https://schema.org/EventLive" :
      (status.state === "post" ?
        "https://schema.org/EventCompleted" :
        "https://schema.org/EventScheduled"),
    location: {
      "@type": "Place",
      name: venue.name || "TBD",
      address: {
        "@type": "PostalAddress",
        addressLocality: venue.city || "",
        addressCountry: venue.country || ""
      }
    },
    organizer: {
      "@type": "SportsOrganization",
      name: league.name || "",
      alternateName: league.abbreviation || ""
    },
    homeTeam: {
      "@type": "SportsTeam",
      name: homeTeam.name || "Home Team",
      logo: homeTeam.logo || undefined
    },
    awayTeam: {
      "@type": "SportsTeam",
      name: awayTeam.name || "Away Team",
      logo: awayTeam.logo || undefined
    },
    offers: {
      "@type": "Offer",
      url: `https://livesportsresults.vercel.app/event/${eventId}`,
      availability: "https://schema.org/InStock",
      price: "0",
      priceCurrency: "USD",
    }
  }

  return structuredData
}

export default async function EventPage({ params }: PageProps) {
  const { id } = await params

  try {
    const initialEvent = await fetchEventDetails(id)
    const structuredData = generateStructuredData(initialEvent, id)

    return (
      <>
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        )}
        <EventPageClient initialEvent={initialEvent} eventId={id} />
      </>
    )
  } catch (error) {
    console.error("Error fetching event details:", error)

    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700 dark:text-red-300">
              Failed to load event details. Please try again later.
            </p>
          </div>
          <div className="mt-6">
            <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }
}