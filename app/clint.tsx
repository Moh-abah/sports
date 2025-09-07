// components/home-content.tsx (Client Component)
"use client"

import { useState, useEffect } from "react"
import { fetchSportsData } from "@/lib/api"
import LeagueSection from "@/components/league-section"
import Header from "@/components/header"
import Footer from "@/components/footer"
import LoadingState from "@/components/loading-state"
import AdBanner from '@/components/AdBanner'
import Script from 'next/script'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import LiveScoresTicker from "@/components/live-scores-ticker"
import RecentGames from "@/components/recent-games"
import StandingsTable from "@/components/standings-table"
import GoogleAd from "@/components/GoogleAd"
import GoogleAdRelaxed from "@/components/GoogleAdRelaxed"

interface HomeContentProps {
    initialData: any[]
    initialLastUpdated: string
    initialError: string | null
}

export default function HomeContent({
    initialData,
    initialLastUpdated,
    initialError
}: HomeContentProps) {
    const [sportsData, setSportsData] = useState<any[]>(initialData)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(initialError)
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date(initialLastUpdated))
    const { toast } = useToast()

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                const data = await fetchSportsData()
                setSportsData(data)
                setLastUpdated(new Date())
                setError(null)

                toast({
                    title: "Data loaded successfully",
                    description: `Showing ${data.length} leagues with today's games`,
                    variant: "default",
                })
            } catch (err) {
                console.error("Error fetching sports data:", err)
                setError("Failed to fetch sports data. Using backup data instead.")
                toast({
                    title: "Connection issue",
                    description: "Using backup data while we try to reconnect to the live service.",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        // Auto-refresh only if we don't have initial data
        if (initialData.length === 0) {
            loadData()
        }

        const intervalId = setInterval(loadData, 5 * 60 * 1000)
        return () => clearInterval(intervalId)
    }, [toast, initialData])

    const handleRefresh = () => {
        toast({
            title: "Refreshing data",
            description: "Fetching the latest sports results...",
        })

        const loadData = async () => {
            try {
                setLoading(true)
                const data = await fetchSportsData()
                setSportsData(data)
                setLastUpdated(new Date())
                setError(null)
            } catch (err) {
                console.error("Error fetching sports data:", err)
                setError("Failed to fetch sports data. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Script
                id="ad-script-config"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            atOptions = {
              'key' : '1cf1dc6c544a07ec552c828cfb0c32cd',
              'format' : 'iframe',
              'height' : 60,
              'width' : 468,
              'params' : {}
            };
          `,
                }}
            />

            <Script
                id="ad-script-external"
                strategy="afterInteractive"
                src="//www.highperformanceformat.com/1cf1dc6c544a07ec552c828cfb0c32cd/invoke.js"
            />

            <Script
                id="structured-data-logo"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "url": "https://livesportsresults.vercel.app",
                        "logo": "https://livesportsresults.vercel.app/logo.png"
                    })
                }}
            />

            <Header />

            <main className="flex-grow container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                    Live Sports Scores & Real-Time Results
                </h1>

                <LiveScoresTicker />

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Today's Results</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleRefresh}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                                <path d="M3 3v5h5"></path>
                                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                                <path d="M16 21h5v-5"></path>
                            </svg>
                            Refresh
                        </button>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                    </div>
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
                ) : sportsData.length === 0 ? (
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
                        <p className="text-gray-500 dark:text-gray-400">No scheduled games were found for today.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {sportsData.map((league, index) => (
                            <div key={index}>
                                <LeagueSection league={league} />

                                {index === Math.floor(sportsData.length / 2) && (
                                    <div className="my-8">
                                        <GoogleAd adSlot="3448186493" />
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: `
                          <script type="text/javascript">
                            atOptions = {
                              'key' : '1cf1dc6c544a07ec552c828cfb0c32cd',
                              'format' : 'iframe',
                              'height' : 60,
                              'width' : 468,
                              'params' : {}
                            };
                          </script>
                          <script type="text/javascript" src="//www.highperformanceformat.com/1cf1dc6c544a07ec552c828cfb0c32cd/invoke.js"></script>
                        `,
                                            }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Current Standings</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <StandingsTable league="nfl" />
                        <StandingsTable league="nba" />
                        <StandingsTable league="mlb" />
                        <StandingsTable league="nhl" />
                    </div>
                    <StandingsTable league="mls" />
                </div>

                <div className="mt-12">
                    <GoogleAdRelaxed adSlot="3037122956" />
                </div>

                <AdBanner />
                <RecentGames />
                <div id="ad-container"></div>
            </main>

            <Footer />
            <Toaster />
        </div>
    )
}