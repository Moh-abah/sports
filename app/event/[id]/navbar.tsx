"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const EventNavbar = ({ eventId }: { eventId: string }) => {
    const pathname = usePathname() || "";

    const tabs = [
        { name: "Summary", path: `/event/${eventId}` },
        { name: "Roster", path: `/event/${eventId}/roster` },
        { name: "Depth Chart", path: `/event/${eventId}/depth` },
        { name: "News", path: `/event/${eventId}/news` },
        
    ];

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 py-3 flex gap-4">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.path;
                    return (
                        <Link
                            key={tab.name}
                            href={tab.path}
                            className={`px-3 py-2 rounded-md font-medium ${isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                }`}
                        >
                            {tab.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default EventNavbar;
