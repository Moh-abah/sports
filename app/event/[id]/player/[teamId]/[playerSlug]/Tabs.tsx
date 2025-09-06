// app/nfl/player/[teamId]/[playerSlug]/Tabs.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Player } from "@/types/playerrr";

interface PlayerClientProps {
    player: Player;
}

export default function PlayerClient({ player }: PlayerClientProps) {
    const [activeTab, setActiveTab] = useState("overview");
    const rd = player.rawData;

    // تحويل تاريخ الميلاد إلى صيغة مقروءة
    const formatDateOfBirth = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    // حساب العمر من تاريخ الميلاد
    const calculateAge = (dateString: string) => {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    // عرض المعلومات الأساسية
    const renderOverview = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold mb-3">المعلومات الشخصية</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">الاسم الكامل:</span>
                            <span className="font-medium">{rd.fullName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">العمر:</span>
                            <span className="font-medium">{calculateAge(rd.dateOfBirth)} سنة</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">تاريخ الميلاد:</span>
                            <span className="font-medium">{formatDateOfBirth(rd.dateOfBirth)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">مكان الميلاد:</span>
                            <span className="font-medium">
                                {rd.birthPlace.city}, {rd.birthPlace.state}, {rd.birthPlace.country}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold mb-3">المعلومات الأكاديمية</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">الكلية:</span>
                            <span className="font-medium">{rd.college.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">اسم الفريق:</span>
                            <span className="font-medium">{rd.college.mascot}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold mb-3">المواصفات البدنية</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">الطول:</span>
                            <span className="font-medium">{rd.displayHeight}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">الوزن:</span>
                            <span className="font-medium">{rd.displayWeight}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold mb-3">المعلومات الاحترافية</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">الرقم:</span>
                            <span className="font-medium">#{rd.jersey}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">المركز:</span>
                            <span className="font-medium">{rd.position.displayName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">سنوات الخبرة:</span>
                            <span className="font-medium">{rd.experience.years}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">الحالة:</span>
                            <span className={`px-2 py-1 rounded text-xs ${rd.status.name === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                {rd.status.name}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // عرض الروابط الخارجية
    const renderLinks = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rd.links.map((link, index) => (
                <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors group"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-blue-800 group-hover:text-blue-900">
                                {link.text}
                            </h3>
                            <p className="text-sm text-blue-600 mt-1">{link.shortText}</p>
                        </div>
                        <svg
                            className="w-5 h-5 text-blue-500 group-hover:text-blue-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                        </svg>
                    </div>
                </a>
            ))}
        </div>
    );

    // عرض رسالة أن الإحصائيات غير متاحة
    const renderStatsMessage = () => (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <svg
                className="w-12 h-12 text-yellow-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
            </svg>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                الإحصائيات غير متاحة حالياً
            </h3>
            <p className="text-yellow-700">
                يمكنك الوصول إلى الإحصائيات التفصيلية عبر الروابط الخارجية في قسم "الروابط"
            </p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* رأس اللاعب */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 bg-white p-6 rounded-lg shadow-sm border">
                {player.photo && (
                    <Image
                        src={player.photo}
                        alt={player.name}
                        width={160}
                        height={160}
                        className="rounded-full shadow-lg border-4 border-white flex-shrink-0"
                    />
                )}
                <div className="text-center md:text-right flex-1">
                    <h1 className="text-4xl font-bold text-gray-900">
                        {rd.fullName}
                    </h1>
                    <p className="text-2xl text-gray-600 mt-2">
                        {rd.position.displayName} - {player.team}
                    </p>
                    <p className="text-xl text-gray-500 mt-1">#{rd.jersey}</p>

                    <div className="flex flex-wrap justify-center md:justify-end gap-4 mt-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {rd.displayHeight}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {rd.displayWeight}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {rd.college.name}
                        </span>
                    </div>
                </div>
            </div>

            {/* علامات التبويب */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="flex flex-wrap gap-2 md:gap-8">
                    {[
                        { id: "overview", name: "نظرة عامة" },
                        { id: "stats", name: "الإحصائيات" },
                        { id: "links", name: "الروابط" }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                                    ? "border-blue-500 text-blue-600 bg-blue-50"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* محتوى علامات التبويب */}
            <div className="mb-8">
                {activeTab === "overview" && renderOverview()}

                {activeTab === "stats" && renderStatsMessage()}

                {activeTab === "links" && (
                    <div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                            <h2 className="text-2xl font-bold mb-6">الروابط الخارجية</h2>
                            <p className="text-gray-600 mb-6">
                                انقر على أي رابط أدناه للوصول إلى المعلومات التفصيلية على ESPN
                            </p>
                            {renderLinks()}
                        </div>
                    </div>
                )}
            </div>

            {/* معلومات إضافية */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    معلومات إضافية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                        <span className="font-medium">معرف اللاعب:</span> {rd.id}
                    </div>
                    <div>
                        <span className="font-medium">الحالة:</span>{" "}
                        <span className={`px-2 py-1 rounded text-xs ${rd.status.name === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                            {rd.status.name}
                        </span>
                    </div>
                    <div>
                        <span className="font-medium">سنوات الخبرة:</span> {rd.experience.years}
                    </div>
                    <div>
                        <span className="font-medium">الاسم المختصر:</span> {rd.shortName}
                    </div>
                </div>
            </div>
        </div>
    );
}