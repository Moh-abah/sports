import { Loader2, Wifi, Database, Clock } from "lucide-react"

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      {/* Main loading spinner */}
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-blue-600/20"></div>
      </div>

      {/* Loading text */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Loading Real Sports Data
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          Fetching live scores and real-time updates from ESPN and other official sources
        </p>
      </div>

      {/* Loading steps indicator */}
      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <Wifi className="h-4 w-4 animate-pulse text-green-500" />
          <span>Connecting to ESPN API</span>
        </div>
        <div className="flex items-center space-x-2">
          <Database className="h-4 w-4 animate-pulse text-blue-500" />
          <span>Fetching Live Data</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 animate-pulse text-orange-500" />
          <span>Real-Time Updates</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
      </div>

      {/* Data source indicator */}
      <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
        <p>🏆 Powered by ESPN Real-Time Sports API</p>
        <p>✅ 100% Authentic Sports Data - No Mock Content</p>
      </div>
    </div>
  )
}
