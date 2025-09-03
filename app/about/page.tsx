import Header from "@/components/header"
import Footer from "@/components/footer"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us | Live Sports Results - Your Premier Sports Destination",
  description:
    "Learn about Live Sports Results, the leading platform for real-time American sports scores, statistics, and comprehensive coverage of MLB, NBA, NFL, NHL, and MLS games.",
  keywords: "about live sports results, sports platform, real-time scores, sports coverage, American sports",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">About Live Sports Results</h1>
          <p className="text-xl opacity-90">
            Your premier destination for real-time American sports scores, statistics, and comprehensive game coverage.
          </p>
        </div>

        {/* Ad Section */}
        

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Our Mission */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              At Live Sports Results, we are dedicated to providing sports enthusiasts with the most accurate,
              up-to-date, and comprehensive coverage of American professional sports. Our mission is to be the go-to
              platform for fans who want instant access to live scores, detailed statistics, and in-depth game analysis.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              We believe that every sports moment matters, from the opening pitch to the final buzzer. That's why we've
              built a platform that delivers real-time updates, ensuring you never miss a crucial play or game-changing
              moment.
            </p>
          </div>

          {/* What We Cover */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Sports We Cover</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">MLB</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Major League Baseball</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Complete coverage of all 30 teams</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-orange-600 dark:text-orange-400 font-bold">NBA</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">National Basketball Association</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Live scores and player statistics</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-green-600 dark:text-green-400 font-bold">NFL</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">National Football League</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Weekly games and playoff coverage</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-red-600 dark:text-red-400 font-bold">NHL</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">National Hockey League</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Fast-paced hockey action</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">MLS</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Major League Soccer</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Growing soccer league coverage</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Why Choose Live Sports Results?
          </h2>
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
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Real-Time Updates</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get instant notifications and live score updates as games unfold. Never miss a crucial moment with our
                real-time data feed that updates every few seconds during active games.
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
                  <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h4l3 3V8l-3 3z"></path>
                  <path d="M22 9l-6 6"></path>
                  <path d="M16 9l6 6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Comprehensive Coverage</h3>
              <p className="text-gray-600 dark:text-gray-300">
                From regular season games to playoffs and championships, we cover every major American sports league
                with detailed statistics, player information, and game analysis.
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
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">User-Friendly Interface</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our clean, intuitive design makes it easy to find the information you need. Whether you're on desktop or
                mobile, enjoy a seamless experience across all devices.
              </p>
            </div>
          </div>
        </div>

      

        {/* Our Story */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
            <p className="mb-4">
              Live Sports Results was founded in 2024 with a simple yet ambitious goal: to create the most reliable and
              comprehensive sports information platform for American sports fans. Our team of sports enthusiasts and
              technology experts recognized the need for a centralized hub where fans could access real-time scores,
              detailed statistics, and in-depth analysis all in one place.
            </p>
            <p className="mb-4">
              What started as a passion project has evolved into a trusted resource for thousands of sports fans across
              the country. We've built partnerships with leading sports data providers to ensure our information is
              always accurate and up-to-date. Our commitment to quality and reliability has made us a go-to destination
              for sports enthusiasts who demand the best.
            </p>
            <p className="mb-4">
              Today, Live Sports Results serves fans of Major League Baseball, the National Basketball Association, the
              National Football League, the National Hockey League, and Major League Soccer. We're constantly expanding
              our coverage and improving our platform to better serve our growing community of users.
            </p>
            <p>
              As we look to the future, we remain committed to our core mission: providing sports fans with the most
              comprehensive, accurate, and timely sports information available. Whether you're checking scores on your
              morning commute or following your favorite team through the playoffs, Live Sports Results is here to keep
              you connected to the sports you love.
            </p>
          </div>
        </div>

        {/* Team Values */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Accuracy First</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We understand that sports fans rely on accurate information to stay connected with their favorite teams
                and players. That's why we've invested in the best data sources and verification systems to ensure every
                score, statistic, and update is correct.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Speed Matters</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                In the fast-paced world of sports, every second counts. Our platform is optimized for speed, delivering
                real-time updates and ensuring you're always the first to know when something significant happens in
                your favorite games.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">User Experience</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We believe that accessing sports information should be simple and enjoyable. Our user-friendly interface
                is designed with fans in mind, making it easy to find exactly what you're looking for without
                unnecessary complexity.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Community Focus</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Sports bring people together, and we're proud to be part of that community. We're committed to serving
                sports fans with respect, reliability, and the passion that makes following sports so rewarding.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
