import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Live Sports Results</h3>
            <p className="text-gray-300 mb-4">
              Your premier destination for real-time American sports scores, statistics, and comprehensive coverage of
              MLB, NBA, NFL, NHL, and MLS games. Stay connected with the sports you love through accurate, up-to-date
              information and in-depth analysis.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Facebook">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Twitter">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Instagram">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Sports Leagues</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/league/mlb" className="text-gray-300 hover:text-white transition-colors">
                  Major League Baseball (MLB)
                </Link>
              </li>
              <li>
                <Link href="/league/nba" className="text-gray-300 hover:text-white transition-colors">
                  National Basketball Association (NBA)
                </Link>
              </li>
              <li>
                <Link href="/league/nfl" className="text-gray-300 hover:text-white transition-colors">
                  National Football League (NFL)
                </Link>
              </li>
              <li>
                <Link href="/league/nhl" className="text-gray-300 hover:text-white transition-colors">
                  National Hockey League (NHL)
                </Link>
              </li>
              <li>
                <Link href="/league/mls" className="text-gray-300 hover:text-white transition-colors">
                  Major League Soccer (MLS)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/sports-guide" className="text-gray-300 hover:text-white transition-colors">
                  Sports Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Live Sports Results. All Rights Reserved. Sports data provided by TheSportsDB and
              other trusted sources.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              
              <span className="text-gray-400">Made with Live Sports Results for Sports Fans</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
