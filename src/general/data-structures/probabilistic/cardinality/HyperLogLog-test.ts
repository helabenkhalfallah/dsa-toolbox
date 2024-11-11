import { describe, expect, it } from 'vitest';

import { HyperLogLog } from './HyperLogLog.ts';

describe('HyperLogLog', () => {
    it('should initialize with correct number of registers', () => {
        const hll = new HyperLogLog(4);
        expect(hll).toBeDefined();
        expect(hll['M'].length).toBe(1 << 4); // 2^4 registers
    });

    it('should add elements without errors', () => {
        const hll = new HyperLogLog();
        expect(() => hll.add('test')).not.toThrow();
    });

    it('should estimate count close to actual number of distinct elements', () => {
        const hll = new HyperLogLog(10);
        const count = 1000;

        // Adding unique elements
        for (let i = 0; i < count; i++) {
            hll.add(`element-${i}`);
        }

        const estimate = hll.count();
        expect(estimate).toBeGreaterThan(count * 0.9);
        expect(estimate).toBeLessThan(count * 1.1);
    });

    it('should handle duplicate elements correctly by maintaining accurate estimate', () => {
        const hll = new HyperLogLog(10);
        const uniqueCount = 500;

        // Adding duplicate elements
        for (let i = 0; i < uniqueCount; i++) {
            hll.add(`element-${i}`);
            hll.add(`element-${i}`); // Duplicate
        }

        const estimate = hll.count();
        expect(estimate).toBeGreaterThan(uniqueCount * 0.9);
        expect(estimate).toBeLessThan(uniqueCount * 1.1);
    });

    it('should provide low estimates for very few elements', () => {
        const hll = new HyperLogLog(8);

        hll.add('a');
        hll.add('b');
        const estimate = hll.count();
        expect(estimate).toBeLessThan(10); // Expect a low estimate with very few elements
    });

    it('should give high estimates for a large number of elements', () => {
        const hll = new HyperLogLog(12);
        const largeCount = 10000;

        for (let i = 0; i < largeCount; i++) {
            hll.add(`element-${i}`);
        }

        const estimate = hll.count(); // Pass largeCount to apply dynamic cap
        expect(estimate).toBeGreaterThan(largeCount * 0.9);
        expect(estimate).toBeLessThan(largeCount * 1.1);
    });

    it('should handle empty registers with an initial count of zero', () => {
        const hll = new HyperLogLog();
        expect(hll.count()).toBe(0); // No elements added, should return zero
    });

    it('should throw an error if p is out of bounds', () => {
        expect(() => new HyperLogLog(3)).toThrowError(
            'p must be an integer between 4 and 30 (inclusive)',
        );
        expect(() => new HyperLogLog(31)).toThrowError(
            'p must be an integer between 4 and 30 (inclusive)',
        );
    });
});
