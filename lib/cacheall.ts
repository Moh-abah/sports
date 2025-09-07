interface CacheItem<T> {
    value: T;
    expiry: number;
}

const cache = new Map<string, CacheItem<any>>();

/**
 * جلب بيانات من الكاش
 */
export function getCache<T>(key: string): T | null {
    const item = cache.get(key);

    if (!item) return null;

    // إذا انتهت صلاحية الكاش نحذفه
    if (Date.now() > item.expiry) {
        cache.delete(key);
        return null;
    }

    return item.value as T;
}

/**
 * تخزين بيانات في الكاش
 */
export function setCache<T>(key: string, value: T, ttlSeconds: number): void {
    cache.set(key, {
        value,
        expiry: Date.now() + ttlSeconds * 1000
    });
}
