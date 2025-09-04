import { useEffect } from "react";

declare global {
    interface Window {
        adsbygoogle: any;
    }
}

interface GoogleAdRelaxedProps {
    adSlot: string;
    className?: string;
}

export default function GoogleAdRelaxed({ adSlot, className }: GoogleAdRelaxedProps) {
    useEffect(() => {
        try {
            if (typeof window !== "undefined") {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, []);

    return (
        <ins
            className={`adsbygoogle ${className || ""}`}
            style={{ display: "block" }}
            data-ad-client="ca-pub-2668531109183096"
            data-ad-slot={adSlot}
            data-ad-format="autorelaxed"
        ></ins>
    );
}
