import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats event data from TheSportsDB API
 * @param {Object} event - Raw event data from API
 * @returns {Object} Formatted event data
 */
export function formatEventData(event) {
  // Parse the event time
  let eventTime = "TBD"
  let status = "Upcoming"

  if (event.strTime) {
    const [hours, minutes] = event.strTime.split(":")
    const eventDate = new Date()
    eventDate.setHours(Number.parseInt(hours, 10))
    eventDate.setMinutes(Number.parseInt(minutes, 10))

    // Format to local time (12-hour format)
    eventTime = eventDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

    // Determine status based on current time
    const now = new Date()
    if (now > eventDate) {
      status = event.strStatus || "In Progress"
    }
  }

  return {
    ...event,
    formattedTime: eventTime,
    status: determineEventStatus(event, status),
  }
}

/**
 * Determines the status of an event based on scores and time
 * @param {Object} event - Event data
 * @param {string} defaultStatus - Default status
 * @returns {string} Event status
 */
function determineEventStatus(event, defaultStatus) {
  // If the event has a status, use it
  if (event.strStatus) {
    if (
      event.strStatus.toLowerCase().includes("finished") ||
      event.strStatus.toLowerCase().includes("ft") ||
      event.strStatus.toLowerCase().includes("final")
    ) {
      return "Finished"
    }

    if (
      event.strStatus.toLowerCase().includes("live") ||
      event.strStatus.toLowerCase().includes("in progress") ||
      event.strStatus.toLowerCase().includes("halftime") ||
      event.strStatus.toLowerCase().includes("1h") ||
      event.strStatus.toLowerCase().includes("2h")
    ) {
      return "In Progress"
    }

    return event.strStatus
  }

  // If both teams have scores, it's likely in progress or finished
  if (event.intHomeScore && event.intAwayScore) {
    const eventDate = new Date(`${event.dateEvent}T${event.strTime || "00:00:00"}`)
    const now = new Date()

    // If the event date is in the past, it's likely finished
    if (now.getTime() - eventDate.getTime() > 4 * 60 * 60 * 1000) {
      // 4 hours
      return "Finished"
    }

    return "In Progress"
  }

  return defaultStatus
}
