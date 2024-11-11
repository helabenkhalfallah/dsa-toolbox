import { describe, expect, it } from 'vitest';

import { timSort } from './TimSort.ts';

// Comparison function for sorting numbers in ascending order
const compareNumbers = (a: number, b: number) => a - b;

describe('TimSort', () => {
    it('should sort an array of numbers in ascending order', () => {
        const arr = [4, 2, 7, 1, 9, 3];
        const sortedArr = timSort(arr, compareNumbers);
        expect(sortedArr).toEqual([1, 2, 3, 4, 7, 9]);
    });

    it('should handle an empty array', () => {
        const arr: number[] = [];
        const sortedArr = timSort(arr, compareNumbers);
        expect(sortedArr).toEqual([]);
    });

    it('should handle an array with a single element', () => {
        const arr = [42];
        const sortedArr = timSort(arr, compareNumbers);
        expect(sortedArr).toEqual([42]);
    });

    it('should handle an already sorted array', () => {
        const arr = [1, 2, 3, 4, 5];
        const sortedArr = timSort(arr, compareNumbers);
        expect(sortedArr).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle a reverse sorted array', () => {
        const arr = [9, 7, 5, 3, 1];
        const sortedArr = timSort(arr, compareNumbers);
        expect(sortedArr).toEqual([1, 3, 5, 7, 9]);
    });

    it('should handle duplicate elements', () => {
        const arr = [5, 3, 8, 3, 2, 8, 1];
        const sortedArr = timSort(arr, compareNumbers);
        expect(sortedArr).toEqual([1, 2, 3, 3, 5, 8, 8]);
    });

    it('should sort a smaller random array for easier debugging', () => {
        const arr = Array.from({ length: 15 }, () => Math.floor(Math.random() * 100));
        const sortedArr = timSort([...arr], compareNumbers);
        expect(sortedArr).toEqual([...arr].sort(compareNumbers));
    });

    it('should sort an array with large number of elements', () => {
        const arr = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 1000));
        const sortedArr = timSort([...arr], compareNumbers);
        expect(sortedArr).toEqual([...arr].sort(compareNumbers));
    });

    it('should use custom minRunLength and minGallop configuration', () => {
        const arr = [10, 30, 20, 50, 40];
        const config = { minRunLength: 2, minGallop: 5 };
        const sortedArr = timSort(arr, compareNumbers, config);
        expect(sortedArr).toEqual([10, 20, 30, 40, 50]);
    });
});
