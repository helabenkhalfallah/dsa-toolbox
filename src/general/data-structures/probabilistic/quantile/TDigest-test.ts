import { describe, expect, it } from 'vitest';

import { TDigest } from './TDigest.ts';

describe('TDigest', () => {
    it('should correctly estimate quantiles for sequential data', () => {
        const digest = new TDigest(0.01, 100);

        for (let i = 1; i <= 100; i++) {
            digest.add(i);
        }

        expect(digest.quantile(0)).toBeCloseTo(1, 1);
        expect(digest.quantile(0.5)).toBeCloseTo(50, 1);
        expect(digest.quantile(1)).toBeCloseTo(100, 1);
    });

    it('should calculate the CDF correctly for middle, min, and max values', () => {
        const digest = new TDigest(0.01, 100);

        for (let i = 1; i <= 10; i++) {
            digest.add(i);
        }

        expect(digest.cdf(0)).toBeCloseTo(0, 1); // Below min value
        expect(digest.cdf(5)).toBeCloseTo(0.5, 1); // Midpoint
        expect(digest.cdf(10)).toBeCloseTo(1, 1); // Max value
        expect(digest.cdf(11)).toBeCloseTo(1, 1); // Beyond max value
    });

    it('should handle multiple compressions gracefully', () => {
        const digest = new TDigest(0.1, 20); // Higher delta for better compression

        for (let i = 1; i <= 1000; i++) {
            digest.add(i);
        }

        // Confirm that centroids are compressed below a reasonable threshold
        expect(digest.getCentroidsCount()).toBeLessThanOrEqual(50);

        // Check the median (500) is close within an acceptable absolute range
        const median = digest.quantile(0.5);
        expect(median).toBeGreaterThanOrEqual(495);
        expect(median).toBeLessThanOrEqual(505);

        // Check 75th percentile (750) is close within an acceptable absolute range
        const percentile75 = digest.quantile(0.75);
        expect(percentile75).toBeGreaterThanOrEqual(735);
        expect(percentile75).toBeLessThanOrEqual(770);
    });

    it('should handle repeated values correctly', () => {
        const digest = new TDigest(0.01, 50);

        for (let i = 0; i < 50; i++) {
            digest.add(5);
        }

        expect(digest.quantile(0)).toBeCloseTo(5, 0);
        expect(digest.quantile(1)).toBeCloseTo(5, 0);
        expect(digest.cdf(5)).toBeCloseTo(1, 0); // All values are the same
    });

    it('should estimate quantiles for non-uniform distributions', () => {
        const digest = new TDigest(0.01, 100);

        for (let i = 1; i <= 100; i++) {
            digest.add(i ** 2); // Non-linear distribution
        }

        expect(digest.quantile(0.5)).toBeCloseTo(2500, 150); // Adjusted for non-linear spread
    });
});
