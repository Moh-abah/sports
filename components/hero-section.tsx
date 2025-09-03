"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Play, 
  TrendingUp, 
  Users, 
  Calendar,
  ArrowRight,
  Zap,
  Trophy,
  Target
} from "lucide-react"

interface FeaturedGame {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore?: number
  awayScore?: number
  status: "LIVE" | "UPCOMING" | "FINISHED"
  league: string
  time: string
  stadium: string
  importance: "high" | "medium" | "low"
}

interface Stat {
  label: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
}

export default function HeroSection() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [featuredGames] = useState<FeaturedGame[]>([
    {
      id: "1",
      homeTeam: "Lakers",
      awayTeam: "Warriors", 
      homeScore: 108,
      awayScore: 112,
      status: "LIVE",
      league: "NBA",
      time: "Q4 2:45",
      stadium: "Crypto.com Arena",
      importance: "high"
    },
    {
      id: "2",
      homeTeam: "Chiefs",
      awayTeam: "Bills",
      status: "UPCOMING",
      league: "NFL",
      time: "8:20 PM ET",
      stadium: "Arrowhead Stadium",
      importance: "high"
    },
    {
      id: "3",
      homeTeam: "Yankees",
      awayTeam: "Red Sox",
      homeScore: 7,
      awayScore: 4,
      status: "LIVE",
      league: "MLB", 
      time: "Bot 8th",
      stadium: "Yankee Stadium",
      importance: "medium"
    }
  ])

  const [stats] = useState<Stat[]>([
    { label: "Live Games", value: "12", change: "+3", trend: "up" },
    { label: "Active Users", value: "2.4M", change: "+12%", trend: "up" },
    { label: "Today's Games", value: "47", change: "+8", trend: "up" },
    { label: "Leagues Covered", value: "15", change: "0", trend: "neutral" }
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "LIVE": return "bg-red-500 animate-pulse"
      case "UPCOMING": return "bg-blue-500"
      case "FINISHED": return "bg-gray-500"
      default: return "bg-gray-500"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-3 w-3 text-green-500" />
      case "down": return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
      default: return <Target className="h-3 w-3 text-gray-500" />
    }
  }

  return (
    <section className="relative min-h-[80vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30">
                <Zap className="h-3 w-3 mr-1" />
                Live Sports Coverage
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Your Ultimate
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Sports Hub
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                Experience real-time sports action with live scores, instant updates, 
                and comprehensive coverage of all major leagues worldwide.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-gray-300">{stat.label}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(stat.trend)}
                        <span className={`text-xs ${
                          stat.trend === 'up' ? 'text-green-400' : 
                          stat.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white group">
                <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Live Games
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Calendar className="h-5 w-5 mr-2" />
                View Schedule
              </Button>
            </div>

            {/* Live Time */}
            <div className="flex items-center space-x-2 text-gray-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">
                Live • {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Right Content - Featured Games */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
                Featured Games
              </h3>
              <Button variant="ghost" className="text-blue-400 hover:text-blue-300">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="space-y-4">
              {featuredGames.map((game, index) => (
                <Card 
                  key={game.id} 
                  className={`bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group ${
                    game.importance === 'high' ? 'ring-2 ring-yellow-500/50' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={`${getStatusColor(game.status)} text-white border-0`}>
                        {game.status}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="border-gray-500 text-gray-300">
                          {game.league}
                        </Badge>
                        {game.importance === 'high' && (
                          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-semibold text-white">{game.homeTeam}</p>
                            {game.homeScore !== undefined && (
                              <p className="text-2xl font-bold text-white">{game.homeScore}</p>
                            )}
                          </div>
                          
                          <div className="text-center px-4">
                            <p className="text-gray-400 text-sm">VS</p>
                          </div>
                          
                          <div className="text-left">
                            <p className="font-semibold text-white">{game.awayTeam}</p>
                            {game.awayScore !== undefined && (
                              <p className="text-2xl font-bold text-white">{game.awayScore}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-300">
                        <span>{game.time}</span>
                        <span>{game.stadium}</span>
                      </div>
                    </div>

                    {game.status === "LIVE" && (
                      <div className="mt-4 flex items-center justify-center">
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white group-hover:scale-105 transition-transform">
                          <Play className="h-4 w-4 mr-1" />
                          Watch Live
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 h-16">
                <Users className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <p className="font-semibold">Fantasy</p>
                  <p className="text-xs opacity-70">Manage Teams</p>
                </div>
              </Button>
              
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 h-16">
                <TrendingUp className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <p className="font-semibold">Analytics</p>
                  <p className="text-xs opacity-70">Player Stats</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

