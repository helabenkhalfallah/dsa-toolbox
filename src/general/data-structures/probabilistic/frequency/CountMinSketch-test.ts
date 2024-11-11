import { describe, expect, it } from 'vitest';

import { CountMinSketch } from './CountMinSketch.ts';

describe('CountMinSketch', () => {
    it('should correctly initialize the sketch with specified dimensions', () => {
        const width = 100;
        const depth = 5;
        const cms = new CountMinSketch(width, depth);

        expect(cms).toBeDefined();
        expect(cms['sketch'].length).toBe(depth);
        expect(cms['sketch'][0].length).toBe(width);
    });

    it('should increment counts for a given key', () => {
        const cms = new CountMinSketch(100, 5);
        cms.add('apple');
        cms.add('apple');

        const estimate = cms.estimate('apple');
        expect(estimate).toBeGreaterThanOrEqual(2); // Should be at least 2 due to two additions
    });

    it('should provide accurate estimates with limited over-counting', () => {
        const cms = new CountMinSketch(100, 5);
        cms.add('banana');
        cms.add('banana');
        cms.add('banana');

        // Estimate for 'banana' should be close to 3, though it might slightly overestimate
        const estimate = cms.estimate('banana');
        expect(estimate).toBeGreaterThanOrEqual(3);
        expect(estimate).toBeLessThan(5); // Allow for some margin due to hash collisions
    });

    it('should not overestimate unrelated keys excessively', () => {
        const cms = new CountMinSketch(100, 5);
        cms.add('apple');
        cms.add('orange');
        cms.add('banana');

        // Check that an unrelated key, 'grape', does not have a high estimate
        const estimate = cms.estimate('grape');
        expect(estimate).toBe(0); // Ideally, this should be 0 if no collisions occurred
    });
});
