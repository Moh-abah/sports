import Link from "next/link";

interface EventCardProps {
  event: {
    idEvent: string;
    strHomeTeam: string;
    strAwayTeam: string;
    intHomeScore?: string;
    intAwayScore?: string;
    strTime: string;
    formattedTime: string;
    status: string;
    strVenue?: string;
    dateEvent: string;
  };
}

export default function EventCard({ event }: EventCardProps) {
  // 📝 تجهيز النصوص
  const normalizedStatus = event.status?.toLowerCase() || "";

  // 🎯 تحديد نوع الحالة
  const isLive =
    normalizedStatus.includes("in progress") ||
    normalizedStatus.includes("live") ||
    normalizedStatus.includes("playing");

  const isFinished =
    normalizedStatus.includes("final") ||
    normalizedStatus.includes("finished") ||
    normalizedStatus.includes("ft") ||
    normalizedStatus.includes("full time");

  const isScheduled =
    normalizedStatus.includes("scheduled") ||
    normalizedStatus.includes("pre") ||
    (!isLive && !isFinished); // أي حالة أخرى تعتبر Scheduled

  const eventId = event.idEvent || "unknown";

  return (
    <Link
      href={`/event/${eventId}`}
      className="block"
      onClick={() => {
        console.log(
          "Card Data for Debugging:",
          JSON.stringify(event, null, 2)
        );
      }}
    >
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full">
        <div className="p-4">
          {/* العنوان العلوي */}
          <div className="flex justify-between items-center mb-3">
            {/* الوقت */}
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {event.formattedTime}
            </div>

            {/* الحالة */}
            <div
              className={`p-2 rounded-full border-2 flex items-center justify-center
                ${isLive
                  ? "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400"
                  : isFinished
                    ? "bg-gray-100 dark:bg-gray-700 border-gray-400 text-gray-700 dark:text-gray-300"
                    : "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400"
                }`}
            >
              {isLive && (
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
              {isLive ? "LIVE" : isFinished ? "Final" : "Scheduled"}
            </div>
          </div>

          {/* الفرق والنتيجة */}
          <div className="flex justify-between items-center mb-4">
            {/* الفريق المضيف */}
            <div className="flex flex-col items-center w-5/12">
              <span className="font-semibold text-center mb-2 text-gray-800 dark:text-gray-200">
                {event.strHomeTeam}
              </span>
              {event.intHomeScore && (
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {event.intHomeScore}
                </span>
              )}
            </div>

            <div className="w-2/12 flex justify-center">
              <span className="text-gray-500 dark:text-gray-400 font-medium">
                VS
              </span>
            </div>

            {/* الفريق الضيف */}
            <div className="flex flex-col items-center w-5/12">
              <span className="font-semibold text-center mb-2 text-gray-800 dark:text-gray-200">
                {event.strAwayTeam}
              </span>
              {event.intAwayScore && (
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {event.intAwayScore}
                </span>
              )}
            </div>
          </div>

          {/* المكان */}
          {event.strVenue && (
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 justify-center mt-3 border-t border-gray-100 dark:border-gray-700 pt-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {event.strVenue}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
