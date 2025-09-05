import Header from "@/components/header"
import Footer from "@/components/footer"

import Link from "next/link"
import type { Metadata } from "next"
import Script from "next/script"

export const metadata: Metadata = {
  title: "American Sports Guide | Understanding MLB, NBA, NFL, NHL & MLS",
  description:
    "Complete guide to American sports including MLB, NBA, NFL, NHL, and MLS. Learn rules, seasons, playoffs, and how to follow your favorite teams.",
  keywords:
    "american sports guide, MLB guide, NBA guide, NFL guide, NHL guide, MLS guide, sports rules, sports seasons",
}

export default function SportsGuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Script
        id="structured-data-mlb"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsOrganization",
            "name": "MLB - Major League Baseball",
            "url": "https://livesportsresults.vercel.app/league/mlb",
            "logo": "https://livesportsresults.vercel.app/logo.png",
            "sport": "Baseball"
          })
        }}
      />

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">American Sports Guide</h1>
          <p className="text-xl opacity-90">
            Your complete guide to understanding and following America's major professional sports leagues: MLB, NBA,
            NFL, NHL, and MLS.
          </p>
        </div>

      

        {/* MLB Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">MLB</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Major League Baseball</h2>
              <p className="text-gray-600 dark:text-gray-300">America's Pastime</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Season Overview</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  • <strong>Season:</strong> April - October (162 games)
                </li>
                <li>
                  • <strong>Teams:</strong> 30 teams in 2 leagues (AL & NL)
                </li>
                <li>
                  • <strong>Playoffs:</strong> Wild Card, Division Series, Championship Series, World Series
                </li>
                <li>
                  • <strong>Game Length:</strong> 9 innings (no time limit)
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Key Statistics</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  • <strong>Batting Average:</strong> Hits divided by at-bats
                </li>
                <li>
                  • <strong>Home Runs:</strong> Ball hit over the fence
                </li>
                <li>
                  • <strong>RBIs:</strong> Runs Batted In
                </li>
                <li>
                  • <strong>ERA:</strong> Earned Run Average (pitching)
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/league/mlb"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View MLB Scores & Standings
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6"></path>
              </svg>
            </Link>
          </div>
        </div>

        {/* NBA Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-4">
              <span className="text-orange-600 dark:text-orange-400 font-bold text-xl">NBA</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">National Basketball Association</h2>
              <p className="text-gray-600 dark:text-gray-300">Fast-Paced Professional Basketball</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Season Overview</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  • <strong>Season:</strong> October - June (82 games)
                </li>
                <li>
                  • <strong>Teams:</strong> 30 teams in 2 conferences
                </li>
                <li>
                  • <strong>Playoffs:</strong> 16 teams, best-of-7 series
                </li>
                <li>
                  • <strong>Game Length:</strong> 4 quarters (12 minutes each)
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Key Statistics</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  • <strong>Points Per Game:</strong> Average scoring
                </li>
                <li>
                  • <strong>Assists:</strong> Passes leading to scores
                </li>
                <li>
                  • <strong>Rebounds:</strong> Recovering missed shots
                </li>
                <li>
                  • <strong>Field Goal %:</strong> Shooting accuracy
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/league/nba"
              className="inline-flex items-center bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              View NBA Scores & Standings
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6"></path>
              </svg>
            </Link>
          </div>
        </div>

        {/* NFL Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
              <span className="text-green-600 dark:text-green-400 font-bold text-xl">NFL</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">National Football League</h2>
              <p className="text-gray-600 dark:text-gray-300">America's Most Popular Sport</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Season Overview</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  • <strong>Season:</strong> September - February (17 games)
                </li>
                <li>
                  • <strong>Teams:</strong> 32 teams in 2 conferences
                </li>
                <li>
                  • <strong>Playoffs:</strong> 14 teams, single elimination
                </li>
                <li>
                  • <strong>Game Length:</strong> 4 quarters (15 minutes each)
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Key Statistics</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  • <strong>Passing Yards:</strong> Quarterback throwing distance
                </li>
                <li>
                  • <strong>Rushing Yards:</strong> Running with the ball
                </li>
                <li>
                  • <strong>Touchdowns:</strong> 6-point scores
                </li>
                <li>
                  • <strong>Sacks:</strong> Tackling QB behind line
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/league/nfl"
              className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              View NFL Scores & Standings
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6"></path>
              </svg>
            </Link>
          </div>
        </div>

        {/* NHL Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-4">
              <span className="text-red-600 dark:text-red-400 font-bold text-xl">NHL</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">National Hockey League</h2>
              <p className="text-gray-600 dark:text-gray-300">Fast-Paced Ice Hockey Action</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Season Overview</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  • <strong>Season:</strong> October - June (82 games)
                </li>
                <li>
                  • <strong>Teams:</strong> 32 teams in 2 conferences
                </li>
                <li>
                  • <strong>Playoffs:</strong> 16 teams, best-of-7 series
                </li>
                <li>
                  • <strong>Game Length:</strong> 3 periods (20 minutes each)
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Key Statistics</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  • <strong>Goals:</strong> Puck in the net
                </li>
                <li>
                  • <strong>Assists:</strong> Passes leading to goals
                </li>
                <li>
                  • <strong>Points:</strong> Goals + Assists
                </li>
                <li>
                  • <strong>Save %:</strong> Goaltender success rate
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/league/nhl"
              className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              View NHL Scores & Standings
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6"></path>
              </svg>
            </Link>
          </div>
        </div>

        {/* MLS Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
              <span className="text-purple-600 dark:text-purple-400 font-bold text-xl">MLS</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Major League Soccer</h2>
              <p className="text-gray-600 dark:text-gray-300">Growing American Soccer League</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Season Overview</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  • <strong>Season:</strong> February - November (34 games)
                </li>
                <li>
                  • <strong>Teams:</strong> 30 teams in 2 conferences
                </li>
                <li>
                  • <strong>Playoffs:</strong> MLS Cup Playoffs
                </li>
                <li>
                  • <strong>Game Length:</strong> 2 halves (45 minutes each)
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Key Statistics</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  • <strong>Goals:</strong> Ball in the net
                </li>
                <li>
                  • <strong>Assists:</strong> Passes leading to goals
                </li>
                <li>
                  • <strong>Shots on Goal:</strong> Attempts on target
                </li>
                <li>
                  • <strong>Clean Sheets:</strong> Games without conceding
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/league/mls"
              className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              View MLS Scores & Standings
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6"></path>
              </svg>
            </Link>
          </div>
        </div>


        {/* How to Follow Sports */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">How to Follow American Sports</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600 dark:text-blue-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Live Scores</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Follow real-time scores and updates during games. Our platform provides instant notifications when your
                favorite teams are playing.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600 dark:text-green-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 3v18h18"></path>
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Standings & Stats</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track team standings, player statistics, and season progress. Understand playoff races and championship
                implications.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-600 dark:text-purple-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Game Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get detailed game breakdowns, key player performances, and insights into what makes teams successful in
                each sport.
              </p>
            </div>
          </div>
        </div>

        {/* Understanding Playoffs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Understanding Playoffs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Single Elimination</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>NFL:</strong> One loss and you're out. Every game is crucial, making for intense, high-stakes
                matchups throughout the playoffs.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Wild Card Round (6 games)</li>
                <li>• Divisional Round (4 games)</li>
                <li>• Conference Championships (2 games)</li>
                <li>• Super Bowl (1 game)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Best-of-Seven Series</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>NBA, NHL, MLB:</strong> First team to win 4 games advances. Allows for comebacks and strategic
                adjustments.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• First Round (8 series)</li>
                <li>• Second Round (4 series)</li>
                <li>• Conference Finals (2 series)</li>
                <li>• Championship (1 series)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Start Following Your Favorite Sports</h2>
          <p className="text-xl opacity-90 mb-6">
            Now that you understand the basics of American sports, dive into live scores, statistics, and game coverage
            on Live Sports Results. Stay updated with real-time information for all major leagues.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/league/mlb"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Follow MLB
            </Link>
            <Link
              href="/league/nba"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Follow NBA
            </Link>
            <Link
              href="/league/nfl"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Follow NFL
            </Link>
            <Link
              href="/league/nhl"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Follow NHL
            </Link>
            <Link
              href="/league/mls"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Follow MLS
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
