"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ModeToggle } from "./mode-toggle"

export default function Header() {
  const [date, setDate] = useState(new Date())
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date())
    }, 1000)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      clearInterval(timer)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const popularLeagues = [
    { name: "MLB", path: "/league/mlb" },
    { name: "NBA", path: "/league/nba" },
    { name: "NFL", path: "/league/nfl" },
    { name: "NHL", path: "/league/nhl" },
    { name: "MLS", path: "/league/mls" },
  ]

  return (
    <header
      className={`bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md sticky top-0 z-50 transition-all ${
        isScrolled ? "py-2" : "py-6"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mr-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L3 9l9 7 9-7-9-7z"></path>
              <path d="M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"></path>
              <path d="M12 18v-7"></path>
            </svg>
            <Link href="/" className="text-2xl md:text-3xl font-bold hover:text-blue-100 transition-colors">
              Live Sports Results
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex space-x-4">
              {popularLeagues.map((league) => (
                <Link
                  key={league.name}
                  href={league.path}
                  className="text-white hover:text-blue-200 transition-colors font-medium"
                >
                  {league.name}
                </Link>
              ))}
            </div>
            <ModeToggle />
            <div className="text-sm md:text-base">
              <div className="font-medium">
                {date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
              </div>
              <div className="text-xs md:text-sm opacity-80">{date.toLocaleTimeString("en-US")}</div>
            </div>
          </div>
        </div>

        <div className="md:hidden flex overflow-x-auto space-x-4 py-3 -mx-4 px-4 mt-2">
          {popularLeagues.map((league) => (
            <Link
              key={league.name}
              href={league.path}
              className="text-white hover:text-blue-200 transition-colors font-medium whitespace-nowrap"
            >
              {league.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
