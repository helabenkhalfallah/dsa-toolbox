import { describe, expect, it } from 'vitest';

import { hybridSearch } from './HybridSearch.ts';

// Define a basic comparison function for numbers
const compareNumbers = (a: number, b: number) => a - b;

describe('hybridSearch', () => {
    it('should use linear search for small datasets', () => {
        const data = [5, 3, 1, 4, 2];
        const target = 3;
        const config = {
            linearSearchThreshold: 10,
            binarySearchThreshold: 100,
            compareFn: compareNumbers,
        };
        const result = hybridSearch(data, target, config);
        expect(result).toBe(1); // 3 is at index 1 with linear search
    });

    it('should use binary search for mid-sized datasets', () => {
        const data = [5, 3, 1, 4, 2];
        const target = 4;
        const config = {
            linearSearchThreshold: 2,
            binarySearchThreshold: 10,
            compareFn: compareNumbers,
            isSorted: false,
        };
        const result = hybridSearch(data, target, config);
        expect(result).toBe(3); // After sorting, 4 is at index 3
    });

    it('should use Red-Black Tree for large datasets', () => {
        const data = Array.from({ length: 15000 }, (_, i) => i + 1);
        const target = 5000;
        const config = {
            linearSearchThreshold: 100,
            binarySearchThreshold: 10000,
            compareFn: compareNumbers,
        };
        const result = hybridSearch(data, target, config);
        expect(result).toBe(true); // Now explicitly expects `true` if found
    });

    it('should return -1 if the target is not found in small dataset (linear search)', () => {
        const data = [5, 3, 1, 4, 2];
        const target = 6;
        const config = {
            linearSearchThreshold: 10,
            binarySearchThreshold: 100,
            compareFn: compareNumbers,
        };
        const result = hybridSearch(data, target, config);
        expect(result).toBe(-1); // Target not found
    });

    it('should return -1 if the target is not found in mid-sized dataset (binary search)', () => {
        const data = [10, 20, 30, 40, 50];
        const target = 25;
        const config = {
            linearSearchThreshold: 2,
            binarySearchThreshold: 10,
            compareFn: compareNumbers,
            isSorted: true,
        };
        const result = hybridSearch(data, target, config);
        expect(result).toBe(-1); // Target not found in binary search
    });

    it('should return false if the target is not found in large dataset (Red-Black Tree)', () => {
        const data = Array.from({ length: 15000 }, (_, i) => i + 1);
        const target = 15001;
        const config = {
            linearSearchThreshold: 100,
            binarySearchThreshold: 10000,
            compareFn: compareNumbers,
        };
        const result = hybridSearch(data, target, config);
        expect(result).toBe(false); // Target not found in Red-Black Tree
    });
});
