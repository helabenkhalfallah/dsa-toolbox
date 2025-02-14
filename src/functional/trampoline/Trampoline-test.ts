import { describe, expect, it } from 'vitest';

import { trampoline } from './Trampoline.ts';

const sumToZero = (n: number, acc: number = 0): number | (() => number) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    n <= 0 ? acc : () => sumToZero(n - 1, acc + n);

const trampolinedSum = trampoline<number, [number, number]>(sumToZero);

describe('trampoline - Deeply Nested Sum', () => {
    it('should correctly compute sum from 5 to 0', () => {
        expect(trampolinedSum(5, 0)).toBe(15); // 5 + 4 + 3 + 2 + 1 + 0 = 15
    });

    it('should handle very large numbers without stack overflow', () => {
        expect(trampolinedSum(100000, 0)).toBe(5000050000); // Sum of first 100000 numbers
    });

    it('should return 0 when starting from 0', () => {
        expect(trampolinedSum(0, 0)).toBe(0);
    });

    it('should return 0 when n is negative (acts as identity)', () => {
        expect(trampolinedSum(-5, 0)).toBe(0); // Should not sum negative numbers
    });
});
