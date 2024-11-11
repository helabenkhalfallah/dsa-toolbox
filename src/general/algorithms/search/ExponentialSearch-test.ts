import { describe, expect, it } from 'vitest';

import { exponentialSearch } from './ExponentialSearch.ts';

// Define a basic comparison function for numbers
const compareNumbers = (a: number, b: number) => a - b;

describe('exponentialSearch', () => {
    it('should return the correct index when the target is found in a sorted array', () => {
        const data = [1, 2, 3, 4, 5];
        const target = 3;
        const config = { compareFn: compareNumbers, isSorted: true };
        const result = exponentialSearch(data, target, config);
        expect(result).toBe(2); // 3 is at index 2
    });

    it('should return the correct index when the target is found in an unsorted array', () => {
        const data = [5, 3, 1, 4, 2];
        const target = 3;
        const config = { compareFn: compareNumbers, isSorted: false };
        const result = exponentialSearch(data, target, config);
        expect(result).toBe(2);
    });

    it('should return -1 when the target is not found', () => {
        const data = [1, 2, 3, 4, 5];
        const target = 6;
        const config = { compareFn: compareNumbers, isSorted: true };
        const result = exponentialSearch(data, target, config);
        expect(result).toBe(-1); // 6 is not in the array
    });

    it('should handle an empty array', () => {
        const data: number[] = [];
        const target = 1;
        const config = { compareFn: compareNumbers, isSorted: true };
        const result = exponentialSearch(data, target, config);
        expect(result).toBe(-1); // Target is not found in an empty array
    });

    it('should not modify the original array', () => {
        const data = [5, 3, 1, 4, 2];
        const target = 3;
        const config = { compareFn: compareNumbers, isSorted: false };
        exponentialSearch(data, target, config);
        expect(data).toEqual([5, 3, 1, 4, 2]); // Ensure the array has not been mutated
    });

    it('should return the first occurrence when multiple elements are equal to the target', () => {
        const data = [1, 2, 3, 3, 3, 4, 5];
        const target = 3;
        const config = { compareFn: compareNumbers, isSorted: true };
        const result = exponentialSearch(data, target, config);
        expect(result).toBe(4);
    });
});
