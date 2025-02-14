import { describe, expect, it } from 'vitest';

import {
    composeTransducers,
    filterTransducer,
    mapTransducer,
    takeTransducer,
} from './Transducers.ts';

describe('Transducers', () => {
    it('should correctly apply mapTransducer', () => {
        const double = (x: number) => x * 2;
        const numbers = [1, 2, 3, 4];

        const transducer = mapTransducer(double);
        const result = numbers.reduce(
            transducer((acc, val) => [...acc, val]),
            [],
        );

        expect(result).toEqual([2, 4, 6, 8]);
    });

    it('should correctly apply filterTransducer', () => {
        const isEven = (x: number) => x % 2 === 0;
        const numbers = [1, 2, 3, 4, 5, 6];

        const transducer = filterTransducer(isEven);
        const result = numbers.reduce(
            transducer((acc, val) => [...acc, val]),
            [],
        );

        expect(result).toEqual([2, 4, 6]);
    });

    it('should correctly apply takeTransducer', () => {
        const numbers = [1, 2, 3, 4, 5];

        const transducer = takeTransducer(3);
        const result = numbers.reduce(
            transducer((acc, val) => [...acc, val]),
            [],
        );

        expect(result).toEqual([1, 2, 3]);
    });

    it('should compose multiple transducers correctly', () => {
        const double = (x: number) => x * 2;
        const isEven = (x: number) => x % 2 === 0;

        const numbers = [1, 2, 3, 4, 5, 6];

        const transducer = composeTransducers(
            filterTransducer(isEven), // Keep even numbers
            mapTransducer(double), // Double them
            takeTransducer(2), // Take first 2 results
        );

        const result = numbers.reduce(
            transducer((acc, val) => [...acc, val]),
            [],
        );

        expect(result).toEqual([4, 8]); // [2*2, 4*2] (first two even numbers doubled)
    });

    it('should work with an empty array', () => {
        const double = (x: number) => x * 2;
        const numbers: number[] = [];

        const transducer = composeTransducers(mapTransducer(double));
        const result = numbers.reduce(
            transducer((acc, val) => [...acc, val]),
            [],
        );

        expect(result).toEqual([]);
    });

    it('should correctly process large datasets', () => {
        const numbers = Array.from({ length: 1000 }, (_, i) => i + 1);

        const transducer = composeTransducers(
            filterTransducer((x) => x % 3 === 0), // Keep multiples of 3
            mapTransducer((x) => x * 2), // Double them
            takeTransducer(10), // Take first 10 results
        );

        const result = numbers.reduce(
            transducer((acc, val) => [...acc, val]),
            [],
        );

        expect(result.length).toBe(10);
        expect(result).toEqual([6, 12, 18, 24, 30, 36, 42, 48, 54, 60]);
    });
});
