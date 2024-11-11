import { describe, expect, it } from 'vitest';

import { SimHash } from './SimHash.ts';

describe('SimHash', () => {
    it('should initialize with a hash value of 0', () => {
        const simHash = new SimHash();
        expect(simHash.getHash()).toBe(0);
    });

    it('should calculate a non-zero hash for a set of elements', () => {
        const simHash = new SimHash();
        const elements = new Set(['apple', 'banana', 'cherry']);
        simHash.add(elements);
        expect(simHash.getHash()).not.toBe(0);
    });

    it('should produce the same hash for identical sets', () => {
        const simHash1 = new SimHash();
        const simHash2 = new SimHash();
        const elements = new Set(['apple', 'banana', 'cherry']);

        simHash1.add(elements);
        simHash2.add(elements);

        expect(simHash1.getHash()).toBe(simHash2.getHash());
    });

    it('should produce different hashes for different sets', () => {
        const simHash1 = new SimHash();
        const simHash2 = new SimHash();
        const elements1 = new Set(['apple', 'banana', 'cherry']);
        const elements2 = new Set(['apple', 'banana', 'orange']);

        simHash1.add(elements1);
        simHash2.add(elements2);

        expect(simHash1.getHash()).not.toBe(simHash2.getHash());
    });

    it('should calculate the correct Hamming distance between two SimHashes', () => {
        const simHash1 = new SimHash();
        const simHash2 = new SimHash();
        const elements1 = new Set(['apple', 'banana', 'cherry']);
        const elements2 = new Set(['apple', 'banana', 'cherry', 'date']);

        simHash1.add(elements1);
        simHash2.add(elements2);

        const hammingDistance = simHash1.hammingDistance(simHash2);
        expect(hammingDistance).toBeGreaterThan(0);
    });

    it('should return a hamming distance of 0 for identical SimHashes', () => {
        const simHash1 = new SimHash();
        const simHash2 = new SimHash();
        const elements = new Set(['apple', 'banana', 'cherry']);

        simHash1.add(elements);
        simHash2.add(elements);

        expect(simHash1.hammingDistance(simHash2)).toBe(0);
    });
});
