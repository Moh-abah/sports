// lib/cache.ts
interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

const eventCache: Record<string, CacheEntry<any>> = {};

export function getCachedEvent(eventId: string) {
    const entry = eventCache[eventId];
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        delete eventCache[eventId];
        return null;
    }
    return entry.data;
}

export function setCachedEvent(eventId: string, data: any, ttlSeconds: number) {
    eventCache[eventId] = {
        data,
        expiresAt: Date.now() + ttlSeconds * 1000,
    };
}
