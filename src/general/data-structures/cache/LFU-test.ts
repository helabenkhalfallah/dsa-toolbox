import { beforeEach, describe, expect, it } from 'vitest';

import { LFUCache } from './LFU.ts';

describe('LFUCache', () => {
    let cache: LFUCache<number, string>;

    beforeEach(() => {
        cache = new LFUCache(3); // Initialize cache with a capacity of 3 for each test
    });

    it('should retrieve a value by key', () => {
        cache.put(1, 'one');
        expect(cache.get(1)).toBe('one');
    });

    it('should return null for non-existent keys', () => {
        expect(cache.get(1)).toBeNull();
    });

    it('should update a value and frequency for an existing key', () => {
        cache.put(1, 'one');
        cache.put(1, 'updated-one');
        expect(cache.get(1)).toBe('updated-one');
    });

    it('should evict the least frequently used item when capacity is exceeded', () => {
        cache.put(1, 'one');
        cache.put(2, 'two');
        cache.put(3, 'three');
        cache.get(1); // Increase frequency of key 1
        cache.put(4, 'four'); // Cache is full; should evict key 2 (least frequently used)

        expect(cache.get(2)).toBeNull(); // key 2 should be evicted
        expect(cache.get(1)).toBe('one'); // key 1 should still be available
        expect(cache.get(3)).toBe('three'); // key 3 should still be available
        expect(cache.get(4)).toBe('four'); // key 4 should be in the cache
    });

    it('should increase the frequency of a key when accessed', () => {
        cache.put(1, 'one');
        cache.put(2, 'two');
        cache.get(1); // Access key 1, increasing its frequency
        cache.put(3, 'three');
        cache.put(4, 'four'); // Evicts least frequently used (key 2)

        expect(cache.get(1)).toBe('one'); // key 1 should still be available
        expect(cache.get(2)).toBeNull(); // key 2 should be evicted
        expect(cache.get(3)).toBe('three'); // key 3 should still be available
        expect(cache.get(4)).toBe('four'); // key 4 should be in the cache
    });

    it('should handle eviction when multiple items have the same frequency', () => {
        cache.put(1, 'one');
        cache.put(2, 'two');
        cache.put(3, 'three');
        cache.put(4, 'four'); // Evicts key 1, as it was the least recently used with the lowest frequency

        expect(cache.get(1)).toBeNull(); // key 1 should be evicted
        expect(cache.get(2)).toBe('two'); // key 2 should still be available
        expect(cache.get(3)).toBe('three'); // key 3 should still be available
        expect(cache.get(4)).toBe('four'); // key 4 should be in the cache
    });

    it('should not exceed capacity when putting items', () => {
        cache.put(1, 'one');
        cache.put(2, 'two');
        cache.put(3, 'three');
        cache.put(4, 'four'); // Should evict key 1 due to capacity

        expect(cache.get(1)).toBeNull(); // key 1 should be evicted
        expect(cache.get(2)).toBe('two');
        expect(cache.get(3)).toBe('three');
        expect(cache.get(4)).toBe('four');
    });

    it('should work correctly with a cache of capacity 1', () => {
        cache = new LFUCache(1);
        cache.put(1, 'one');
        expect(cache.get(1)).toBe('one');

        cache.put(2, 'two'); // Evicts key 1 because capacity is 1
        expect(cache.get(1)).toBeNull();
        expect(cache.get(2)).toBe('two');
    });
});
