import { describe, expect, it } from 'vitest';

import { BloomFilter } from './BloomFilter.ts';

describe('BloomFilter', () => {
    it('should initialize with correct size and hash count', () => {
        const size = 1000;
        const hashCount = 3;
        const filter = new BloomFilter(size, hashCount);

        expect(filter).toBeDefined();
        expect(filter['size']).toBe(size);
        expect(filter['hashCount']).toBe(hashCount);
        expect(filter['bitArray'].length).toBe(Math.ceil(size / 8));
    });

    it('should add an item and potentially contain it', () => {
        const filter = new BloomFilter(1000, 3);
        const item = 'test-item';

        filter.add(item);
        const contains = filter.mightContain(item);

        // After adding, it should possibly contain the item
        expect(contains).toBe(true);
    });

    it('should probably not contain an unadded item', () => {
        const filter = new BloomFilter(1000, 3);
        const item = 'unadded-item';

        const contains = filter.mightContain(item);

        // Since we haven't added it, it should likely not contain it
        expect(contains).toBe(false);
    });

    it('should handle multiple items with minimal false positives', () => {
        const filter = new BloomFilter(1000, 3);
        const items = ['apple', 'banana', 'cherry'];

        // Add each item to the filter
        items.forEach((item) => filter.add(item));

        // Verify that each added item is reported as possibly in the filter
        items.forEach((item) => {
            expect(filter.mightContain(item)).toBe(true);
        });

        // Test with an item that hasn't been added
        const unaddedItem = 'grape';
        const contains = filter.mightContain(unaddedItem);

        // It may return true, but ideally, we want a low probability of this
        expect(contains).toBe(false);
    });
});
