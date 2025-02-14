import { describe, expect, it } from 'vitest';

import { curry, uncurry } from './Curry.ts';

describe('curry', () => {
    it('should correctly curry a function', () => {
        const add = (a: number, b: number, c: number) => a + b + c;
        const curriedAdd = curry(add);

        expect(curriedAdd(1)(2)(3)).toBe(6);
        expect(curriedAdd(1, 2)(3)).toBe(6);
        expect(curriedAdd(1)(2, 3)).toBe(6);
        expect(curriedAdd(1, 2, 3)).toBe(6);
    });

    it('should handle single-argument functions correctly', () => {
        const identity = (x: number) => x;
        const curriedIdentity = curry(identity);
        expect(curriedIdentity(5)).toBe(5);
    });

    it('should allow partial application', () => {
        const multiply = (a: number, b: number) => a * b;
        const curriedMultiply = curry(multiply);

        const multiplyBy2 = curriedMultiply(2);
        expect(multiplyBy2(3)).toBe(6);
        expect(multiplyBy2(4)).toBe(8);
    });
});

describe('uncurry', () => {
    it('should correctly uncurry a curried function', () => {
        const curriedAdd = (a: number) => (b: number) => (c: number) => a + b + c;
        const uncurriedAdd = uncurry(curriedAdd);

        expect(uncurriedAdd(1, 2, 3)).toBe(6);
    });

    it('should correctly uncurry a single-argument function', () => {
        const curriedIdentity = (x: number) => x;
        const uncurriedIdentity = uncurry(curriedIdentity);

        expect(uncurriedIdentity(5)).toBe(5);
    });

    it('should correctly handle functions with different arities', () => {
        const curriedConcat = (a: string) => (b: string) => (c: string) => `${a}-${b}-${c}`;
        const uncurriedConcat = uncurry(curriedConcat);

        expect(uncurriedConcat('A', 'B', 'C')).toBe('A-B-C');
    });
});
