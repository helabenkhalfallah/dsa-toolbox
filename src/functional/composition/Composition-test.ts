import { describe, expect, it } from 'vitest';

import { compose, pipe } from './Composition.ts';

describe('Functional Composition', () => {
    const trim = (s: string): string => s.trim();
    const toUpperCase = (s: string): string => s.toUpperCase();
    const exclaim = (s: string): string => `${s}!`;

    it('should compose functions from right to left', () => {
        const composedFn = compose(exclaim, toUpperCase, trim);
        expect(composedFn('  hello  ')).toBe('HELLO!');
    });

    it('should pipe functions from left to right', () => {
        const pipedFn = pipe(trim, toUpperCase, exclaim);
        expect(pipedFn('  hello  ')).toBe('HELLO!');
    });

    it('should return the same value when no functions are passed', () => {
        expect(compose()(5)).toBe(5);
        expect(pipe()(5)).toBe(5);
    });
});

describe('Edge Cases', () => {
    it('should return the same value when no functions are passed', () => {
        expect(compose()(5)).toBe(5);
        expect(pipe()(5)).toBe(5);
    });

    it('should handle single function cases correctly', () => {
        const identity = (x: number) => x;
        expect(compose(identity)(5)).toBe(5);
        expect(pipe(identity)(5)).toBe(5);
    });

    it('should not mutate input', () => {
        const obj = { value: 'hello' };

        // Pure function that creates a new object
        const cloneAndModify = (o: { value: string }) => ({ ...o, modified: true });

        const result = compose(cloneAndModify)(obj);

        expect(result).toEqual({ value: 'hello', modified: true }); // Same values
        expect(result).not.toBe(obj); // Different object (immutability check)
    });

    it('should handle large number of functions', () => {
        const functions = Array(1000).fill((x: number) => x + 1);
        expect(compose(...functions)(0)).toBe(1000);
        expect(pipe(...functions)(0)).toBe(1000);
    });
});

describe('Purity Tests', () => {
    it('should not have side effects', () => {
        const sideEffect = 0;

        // Pure function (does not modify external state)
        const pureFunction = (x: number) => x + 1;

        // Ensure pure functions do not modify external state
        const composedPure = compose(pureFunction, pureFunction);

        // Track sideEffect before execution
        const before = sideEffect;

        // Execute composed function
        composedPure(5);

        // Track sideEffect after execution
        const after = sideEffect;

        // Ensure external state is unchanged
        expect(after).toBe(before);
    });

    it('should detect impure functions', () => {
        let sideEffect = 0;

        // Impure function (modifies external state)
        const impureFunction = (x: number) => {
            sideEffect += 1; // Side effect occurs
            return x + 1;
        };

        const pureFunction = (x: number) => x + 1;

        // Track sideEffect before execution
        const before = sideEffect;

        // Run an impure function inside compose
        compose(pureFunction, impureFunction)(5);

        // Track sideEffect after execution
        const after = sideEffect;

        // Side effect must have changed (which means impurity was detected)
        expect(after).not.toBe(before);
    });
});
