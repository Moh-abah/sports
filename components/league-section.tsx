// import EventCard from "./event-card"
// import Link from "next/link"

// interface LeagueSectionProps {
//   league: {
//     league: string
//     events: any[]
//   }
// }

// export default function LeagueSection({ league }: LeagueSectionProps) {
//   // Determine the appropriate league icon
//   const getLeagueIcon = (leagueName: string) => {
//     if (leagueName.includes("MLB") || leagueName.includes("Baseball")) {
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-6 w-6"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <circle cx="12" cy="12" r="10"></circle>
//           <path d="M5.3 13.8c1.2 0 2.4-.4 3.3-1.2.9.8 2.1 1.2 3.3 1.2s2.4-.4 3.3-1.2c.9.8 2.1 1.2 3.3 1.2"></path>
//           <path d="M16.7 16.8c-1.2 0-2.4-.4-3.3-1.2-.9.8-2.1 1.2-3.3 1.2s-2.4-.4-3.3-1.2c-.9.8-2.1 1.2-3.3 1.2"></path>
//           <path d="M5.3 10.8c1.2 0 2.4-.4 3.3-1.2.9.8 2.1 1.2 3.3 1.2s2.4-.4 3.3-1.2c.9.8 2.1 1.2 3.3 1.2"></path>
//           <path d="M16.7 7.8c-1.2 0-2.4-.4-3.3-1.2-.9.8-2.1 1.2-3.3 1.2s-2.4-.4-3.3-1.2c-.9.8-2.1 1.2-3.3 1.2"></path>
//         </svg>
//       )
//     } else if (leagueName.includes("NBA") || leagueName.includes("Basketball")) {
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-6 w-6"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <circle cx="12" cy="12" r="10"></circle>
//           <path d="M4.93 4.93l4.24 4.24"></path>
//           <path d="M14.83 9.17l4.24-4.24"></path>
//           <path d="M14.83 14.83l4.24 4.24"></path>
//           <path d="M9.17 14.83l-4.24 4.24"></path>
//           <circle cx="12" cy="12" r="4"></circle>
//         </svg>
//       )
//     } else if (leagueName.includes("NHL") || leagueName.includes("Hockey")) {
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-6 w-6"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="M12 2v20"></path>
//           <path d="M2 12h20"></path>
//           <path d="M20 16H4a8 8 0 0 1 8-8 8 8 0 0 1 8 8Z"></path>
//         </svg>
//       )
//     } else if (leagueName.includes("NFL") || leagueName.includes("Football")) {
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-6 w-6"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <ellipse cx="12" cy="12" rx="10" ry="7"></ellipse>
//           <path d="M5 9h14"></path>
//           <path d="M5 15h14"></path>
//           <path d="M12 3v18"></path>
//         </svg>
//       )
//     } else if (leagueName.includes("Soccer") || leagueName.includes("MLS")) {
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-6 w-6"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <circle cx="12" cy="12" r="10"></circle>
//           <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
//           <path d="M2 12h20"></path>
//         </svg>
//       )
//     } else {
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-6 w-6"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="M6 4v16"></path>
//           <path d="M18 4v16"></path>
//           <path d="M4 20h16"></path>
//           <path d="M4 4h16"></path>
//           <path d="M4 12h16"></path>
//           <path d="M12 4v16"></path>
//         </svg>
//       )
//     }
//   }

//   // Get league slug for link
//   const getLeagueSlug = (leagueName: string) => {
//     if (leagueName.includes("MLB")) return "mlb"
//     if (leagueName.includes("NBA")) return "nba"
//     if (leagueName.includes("NFL")) return "nfl"
//     if (leagueName.includes("NHL")) return "nhl"
//     if (leagueName.includes("MLS")) return "mls"
//     return leagueName.toLowerCase().replace(/\s+/g, "-")
//   }

//   return (
//     <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
//       <div className="bg-gray-100 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
//             {getLeagueIcon(league.league)}
//             {league.league}
//             <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
//               ({league.events.length} games)
//             </span>
//           </h2>
//           <Link
//             href={`/league/${getLeagueSlug(league.league)}`}
//             className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center"
//             onClick={(e) => {
//               console.log("getLeagueSlug dataaaaagetLeagueSluggetLeagueSluggetLeagueSlug:", getLeagueSlug)
//             }}
// >
//             View All
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-4 w-4 ml-1"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M9 18l6-6-6-6"></path>
//             </svg>
//           </Link>
//         </div>
//       </div>

//       <div className="p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {league.events.map((event, index) => (
//             <EventCard key={index} event={event} />
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }


import EventCard from "./event-card"
import Link from "next/link"

interface LeagueSectionProps {
  league: {
    league: string
    events: any[]
  }
}

export default function LeagueSection({ league }: LeagueSectionProps) {
  // Determine the appropriate league icon
  const getLeagueIcon = (leagueName: string) => {
    if (leagueName.includes("MLB") || leagueName.includes("Baseball")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M5.3 13.8c1.2 0 2.4-.4 3.3-1.2.9.8 2.1 1.2 3.3 1.2s2.4-.4 3.3-1.2c.9.8 2.1 1.2 3.3 1.2"></path>
          <path d="M16.7 16.8c-1.2 0-2.4-.4-3.3-1.2-.9.8-2.1 1.2-3.3 1.2s-2.4-.4-3.3-1.2c-.9.8-2.1 1.2-3.3 1.2"></path>
          <path d="M5.3 10.8c1.2 0 2.4-.4 3.3-1.2.9.8 2.1 1.2 3.3 1.2s2.4-.4 3.3-1.2c.9.8 2.1 1.2 3.3 1.2"></path>
          <path d="M16.7 7.8c-1.2 0-2.4-.4-3.3-1.2-.9.8-2.1 1.2-3.3 1.2s-2.4-.4-3.3-1.2c-.9.8-2.1 1.2-3.3 1.2"></path>
        </svg>
      )
    } else if (leagueName.includes("NBA") || leagueName.includes("Basketball")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M4.93 4.93l4.24 4.24"></path>
          <path d="M14.83 9.17l4.24-4.24"></path>
          <path d="M14.83 14.83l4.24 4.24"></path>
          <path d="M9.17 14.83l-4.24 4.24"></path>
          <circle cx="12" cy="12" r="4"></circle>
        </svg>
      )
    } else if (leagueName.includes("NHL") || leagueName.includes("Hockey")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v20"></path>
          <path d="M2 12h20"></path>
          <path d="M20 16H4a8 8 0 0 1 8-8 8 8 0 0 1 8 8Z"></path>
        </svg>
      )
    } else if (leagueName.includes("NFL") || leagueName.includes("Football")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <ellipse cx="12" cy="12" rx="10" ry="7"></ellipse>
          <path d="M5 9h14"></path>
          <path d="M5 15h14"></path>
          <path d="M12 3v18"></path>
        </svg>
      )
    } else if (leagueName.includes("Soccer") || leagueName.includes("MLS")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          <path d="M2 12h20"></path>
        </svg>
      )
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 4v16"></path>
          <path d="M18 4v16"></path>
          <path d="M4 20h16"></path>
          <path d="M4 4h16"></path>
          <path d="M4 12h16"></path>
          <path d="M12 4v16"></path>
        </svg>
      )
    }
  }

  // Get league slug for link
  const getLeagueSlug = (leagueName: string) => {
    if (leagueName.includes("MLB")) return "mlb"
    if (leagueName.includes("NBA")) return "nba"
    if (leagueName.includes("NFL")) return "nfl"
    if (leagueName.includes("NHL")) return "nhl"
    if (leagueName.includes("MLS")) return "mls"
    return leagueName.toLowerCase().replace(/\s+/g, "-")
  }

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            {getLeagueIcon(league.league)}
            {league.league}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
              ({league.games?.length || league.events?.length || 0} games)
            </span>
          </h2>
          <Link
            href={`/league/${getLeagueSlug(league.league)}`}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center"
          >
            View All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6"></path>
            </svg>
          </Link>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* {(league.games || league.events || []).map((event, index) => (
            <EventCard key={index} event={event} />
          ))} */}


{(league.games || []).map((event, index) => (
  <EventCard key={index} event={event} />
))}        </div>
      </div>
    </section>
  )
}
