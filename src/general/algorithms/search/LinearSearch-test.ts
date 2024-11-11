import { describe, expect, it } from 'vitest';

import { linearSearch } from './LinearSearch.ts';

// Comparison function for numbers
const compareNumbers = (a: number, b: number) => a - b;

describe('linearSearch', () => {
    it('should return the correct index when the target is in the array', () => {
        const data = [10, 20, 30, 40, 50];
        const target = 30;
        const result = linearSearch(data, target, compareNumbers);
        expect(result).toBe(2); // Target 30 is at index 2
    });

    it('should return -1 when the target is not in the array', () => {
        const data = [10, 20, 30, 40, 50];
        const target = 60;
        const result = linearSearch(data, target, compareNumbers);
        expect(result).toBe(-1); // Target 60 is not in the array
    });

    it('should return the first occurrence index in case of duplicates', () => {
        const data = [10, 20, 30, 30, 40];
        const target = 30;
        const result = linearSearch(data, target, compareNumbers);
        expect(result).toBe(2); // First occurrence of 30 is at index 2
    });

    it('should return -1 for an empty array', () => {
        const data: number[] = [];
        const target = 10;
        const result = linearSearch(data, target, compareNumbers);
        expect(result).toBe(-1); // No elements in array to find
    });

    it('should work correctly for arrays with one element', () => {
        const data = [10];
        const targetInArray = 10;
        const targetNotInArray = 20;
        expect(linearSearch(data, targetInArray, compareNumbers)).toBe(0); // Target found at index 0
        expect(linearSearch(data, targetNotInArray, compareNumbers)).toBe(-1); // Target not found
    });
});
