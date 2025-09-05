"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { fetchLeagueEvents } from "@/lib/api"
import Header from "@/components/header"
import Footer from "@/components/footer"
import LoadingState from "@/components/loading-state"
import EventCard from "@/components/event-card"

import Link from "next/link"
import Script from "next/script"

export default function LeaguePage() {
  const params = useParams()
  const leagueId = params.slug as string


  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Map league IDs to display names
  const leagueNames = {
    mlb: "Major League Baseball (MLB)",
    nba: "National Basketball Association (NBA)",
    nfl: "National Football League (NFL)",
    nhl: "National Hockey League (NHL)",
    mls: "Major League Soccer (MLS)",
  }

  const leagueName = leagueNames[leagueId.toLowerCase()] || leagueId.toUpperCase()

  useEffect(() => {
    const loadLeagueData = async () => {
      try {
        setLoading(true)
        const data = await fetchLeagueEvents(leagueId)
        console.log("Fetched events:", data) 
        setEvents(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching league data:", err)
        setError("Failed to fetch league data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadLeagueData()
    
    console.log("Params:", params)
    console.log("League ID:", leagueId)
    console.log("League Name Map:", leagueNames)

  },
   [leagueId])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
       

        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{leagueName}</h1>
          <p className="text-gray-600 dark:text-gray-400">Today's games and results</p>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-500 mr-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No games today</h3>
            <p className="text-gray-500 dark:text-gray-400">No scheduled games were found for {leagueName} today.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <div key={index}>
                <EventCard event={event} />
                {/* JSON-LD لكل مباراة */}
                <Script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "SportsEvent",
                      "name": event.name || `${event.homeTeam} vs ${event.awayTeam}`,
                      "startDate": event.startDate,
                      "endDate": event.endDate || null,
                      "location": {
                        "@type": "Place",
                        "name": event.stadium || "TBD",
                        "address": event.stadiumAddress || "Unknown"
                      },
                      "performer": [
                        { "@type": "SportsTeam", "name": event.homeTeam },
                        { "@type": "SportsTeam", "name": event.awayTeam }
                      ],
                      "description": event.description || `${event.homeTeam} vs ${event.awayTeam} in ${leagueName}`,
                      "url": event.url || window.location.href
                    })
                  }}
                />
                {/* إعلان بين المباريات - يظهر فقط إذا كان متاحاً */}
                {index === Math.floor(events.length / 2)  
                 
                   
               }
              </div>
            ))}
          </div>
        )}

       
      </main>

      <Footer />
    </div>
  )
}
