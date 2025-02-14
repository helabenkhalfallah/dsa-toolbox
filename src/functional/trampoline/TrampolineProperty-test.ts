import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { trampoline } from './Trampoline.ts';

const sumToZero = (n: number, acc: number = 0): number | (() => number) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    n <= 0 ? acc : () => sumToZero(n - 1, acc + n);

const trampolinedSum = trampoline<number, [number, number]>(sumToZero);

describe('trampoline - fast-check property-based tests', () => {
    it('should return the correct sum for any positive number', () => {
        fc.assert(
            fc.property(fc.integer({ min: 0, max: 100000 }), (n) => {
                const expectedSum = (n * (n + 1)) / 2; // Sum formula
                expect(trampolinedSum(n, 0)).toBe(expectedSum);
            }),
        );
    });

    it('should handle negative numbers by returning 0', () => {
        fc.assert(
            fc.property(fc.integer({ min: -100000, max: -1 }), (n) => {
                expect(trampolinedSum(n, 0)).toBe(0);
            }),
        );
    });

    it('should match the standard recursive implementation for small values', () => {
        const recursiveSum = (n: number, acc: number = 0): number =>
            n <= 0 ? acc : recursiveSum(n - 1, acc + n);

        fc.assert(
            fc.property(fc.integer({ min: 0, max: 500 }), (n) => {
                expect(trampolinedSum(n, 0)).toBe(recursiveSum(n, 0));
            }),
        );
    });

    it('should not throw stack overflow errors for large numbers', () => {
        expect(() => trampolinedSum(100000, 0)).not.toThrow();
    });
});
