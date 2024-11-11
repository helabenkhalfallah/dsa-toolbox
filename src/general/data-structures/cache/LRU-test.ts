import { beforeEach, describe, expect, it } from 'vitest';

import { LRUCache } from './LRU.ts';

describe('LRUCache', () => {
    let cache: LRUCache<string>;

    beforeEach(() => {
        cache = new LRUCache(3); // Initialize cache with a capacity of 3 for each test
    });

    it('should retrieve a value by key', () => {
        cache.put(1, 'one');
        expect(cache.get(1)).toBe('one');
    });

    it('should return null for non-existent keys', () => {
        expect(cache.get(2)).toBeNull();
    });

    it('should update a value if the key already exists', () => {
        cache.put(1, 'one');
        cache.put(1, 'updated-one');
        expect(cache.get(1)).toBe('updated-one');
    });

    it('should evict the least recently used item when capacity is exceeded', () => {
        cache.put(1, 'one');
        cache.put(2, 'two');
        cache.put(3, 'three');
        cache.get(1); // Access key 1, making it the most recently used
        cache.put(4, 'four'); // Cache is full; should evict key 2 (least recently used)

        expect(cache.get(2)).toBeNull(); // key 2 should be evicted
        expect(cache.get(1)).toBe('one'); // key 1 should still be available
        expect(cache.get(3)).toBe('three'); // key 3 should still be available
        expect(cache.get(4)).toBe('four'); // key 4 should be in the cache
    });

    it('should update the order of keys on access', () => {
        cache.put(1, 'one');
        cache.put(2, 'two');
        cache.put(3, 'three');
        cache.get(1); // Access key 1, making it most recently used
        cache.put(4, 'four'); // Evicts least recently used (key 2)

        expect(cache.get(2)).toBeNull(); // key 2 should be evicted
        expect(cache.get(1)).toBe('one'); // key 1 should still be available
        expect(cache.get(3)).toBe('three'); // key 3 should still be available
        expect(cache.get(4)).toBe('four'); // key 4 should be in the cache
    });

    it('should handle eviction correctly when multiple items reach capacity', () => {
        cache.put(1, 'one');
        cache.put(2, 'two');
        cache.put(3, 'three');
        cache.put(4, 'four'); // Evicts key 1, the least recently used

        expect(cache.get(1)).toBeNull(); // key 1 should be evicted
        expect(cache.get(2)).toBe('two'); // key 2 should still be available
        expect(cache.get(3)).toBe('three'); // key 3 should still be available
        expect(cache.get(4)).toBe('four'); // key 4 should be in the cache
    });

    it('should not exceed capacity', () => {
        cache.put(1, 'one');
        cache.put(2, 'two');
        cache.put(3, 'three');
        cache.put(4, 'four'); // Evicts key 1 due to capacity

        expect(cache.get(1)).toBeNull(); // key 1 should be evicted
        expect(cache.get(2)).toBe('two');
        expect(cache.get(3)).toBe('three');
        expect(cache.get(4)).toBe('four');
    });

    it('should work correctly with a cache of capacity 1', () => {
        cache = new LRUCache(1);
        cache.put(1, 'one');
        expect(cache.get(1)).toBe('one');

        cache.put(2, 'two'); // Evicts key 1 because capacity is 1
        expect(cache.get(1)).toBeNull();
        expect(cache.get(2)).toBe('two');
    });
});
