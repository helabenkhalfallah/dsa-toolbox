import { describe, expect, it } from 'vitest';

import { ternarySearch } from './TernarySearch.ts';

// Comparison function for numbers
const compareNumbers = (a: number, b: number) => a - b;

describe('ternarySearch', () => {
    it('should return the correct index when the target is in the array', () => {
        const data = [10, 20, 30, 40, 50];
        const target = 30;
        const config = { compareFn: compareNumbers, isSorted: true };
        const result = ternarySearch(data, target, 0, data.length - 1, config);
        expect(result).toBe(2); // Target 30 is at index 2
    });

    it('should return -1 when the target is not in the array', () => {
        const data = [10, 20, 30, 40, 50];
        const target = 60;
        const config = { compareFn: compareNumbers, isSorted: true };
        const result = ternarySearch(data, target, 0, data.length - 1, config);
        expect(result).toBe(-1); // Target 60 is not in the array
    });

    it('should return the index of the first occurrence in case of duplicates', () => {
        const data = [10, 20, 30, 30, 40];
        const target = 30;
        const config = { compareFn: compareNumbers, isSorted: true };
        const result = ternarySearch(data, target, 0, data.length - 1, config);
        expect(result).toBe(3);
    });

    it('should return -1 for an empty array', () => {
        const data: number[] = [];
        const target = 10;
        const config = { compareFn: compareNumbers, isSorted: true };
        const result = ternarySearch(data, target, 0, data.length - 1, config);
        expect(result).toBe(-1); // No elements in array to find
    });

    it('should sort the array if isSorted is false and return correct index', () => {
        const data = [50, 10, 40, 30, 20];
        const target = 30;
        const config = { compareFn: compareNumbers, isSorted: false };
        const result = ternarySearch(data, target, 0, data.length - 1, config);
        expect(result).toBe(2); // Target 30 is at index 2
    });

    it('should work correctly with a single-element array', () => {
        const data = [10];
        const config = { compareFn: compareNumbers, isSorted: true };
        expect(ternarySearch(data, 10, 0, data.length - 1, config)).toBe(0); // Target found at index 0
        expect(ternarySearch(data, 20, 0, data.length - 1, config)).toBe(-1); // Target not found
    });
});
