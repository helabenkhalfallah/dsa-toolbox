import { describe, expect, it } from 'vitest';

import { heapSort } from './HeapSort.ts';

// Comparison function for numbers
const compareNumbers = (a: number, b: number) => a - b;

describe('heapSort', () => {
    it('should sort an array of numbers in ascending order', () => {
        const data = [10, 3, 2, 8, 15, 1];
        const result = heapSort(data, compareNumbers);
        expect(result).toEqual([1, 2, 3, 8, 10, 15]);
    });

    it('should handle an already sorted array', () => {
        const data = [1, 2, 3, 4, 5];
        const result = heapSort(data, compareNumbers);
        expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle an array sorted in descending order', () => {
        const data = [5, 4, 3, 2, 1];
        const result = heapSort(data, compareNumbers);
        expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle an array with duplicate values', () => {
        const data = [4, 1, 3, 3, 2, 4, 5];
        const result = heapSort(data, compareNumbers);
        expect(result).toEqual([1, 2, 3, 3, 4, 4, 5]);
    });

    it('should handle an empty array', () => {
        const data: number[] = [];
        const result = heapSort(data, compareNumbers);
        expect(result).toEqual([]);
    });

    it('should handle a single-element array', () => {
        const data = [10];
        const result = heapSort(data, compareNumbers);
        expect(result).toEqual([10]);
    });
});
