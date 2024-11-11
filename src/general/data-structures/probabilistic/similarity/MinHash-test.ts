import { describe, expect, it } from 'vitest';

import { MinHash } from './MinHash.ts';

// Adjust this import based on your file structure

describe('MinHash', () => {
    it('should initialize with Infinity hashes', () => {
        const numHashes = 10;
        const minHash = new MinHash(numHashes);

        expect(minHash.size()).toBe(numHashes);
        for (let i = 0; i < numHashes; i++) {
            expect(minHash['hashes'][i]).toBe(Infinity);
        }
    });

    it('should update hashes when elements are added', () => {
        const minHash = new MinHash(10);
        const elements = new Set(['a', 'b', 'c']);

        minHash.add(elements);

        // Check if hashes were updated from Infinity
        for (let i = 0; i < minHash.size(); i++) {
            expect(minHash['hashes'][i]).not.toBe(Infinity);
        }
    });

    it('should estimate Jaccard similarity accurately for identical sets', () => {
        const minHash1 = new MinHash(10);
        const minHash2 = new MinHash(10);
        const elements = new Set(['a', 'b', 'c']);

        minHash1.add(elements);
        minHash2.add(elements);

        const similarity = minHash1.jaccardSimilarity(minHash2);
        expect(similarity).toBeCloseTo(1, 1);
    });

    it('should estimate Jaccard similarity for different sets', () => {
        const minHash1 = new MinHash(10);
        const minHash2 = new MinHash(10);

        minHash1.add(new Set(['a', 'b', 'c']));
        minHash2.add(new Set(['d', 'e', 'f']));

        const similarity = minHash1.jaccardSimilarity(minHash2);
        expect(similarity).toBeCloseTo(0, 1);
    });

    it('should handle different number of hash functions in jaccardSimilarity', () => {
        const minHash1 = new MinHash(10);
        const minHash2 = new MinHash(5); // Different number of hash functions

        expect(() => minHash1.jaccardSimilarity(minHash2)).toThrowError(
            'Both MinHash instances must have the same number of hash functions.',
        );
    });
});
