import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { curry, uncurry } from './Curry.ts';

describe('Functional Programming: curry & uncurry', () => {
    it('should satisfy curry(uncurry(fn)) === fn', () => {
        fc.assert(
            fc.property(
                fc.func(fc.integer()), // Generates random functions returning integers
                (fn) => {
                    const curriedFn = curry(fn);
                    const uncurriedFn = uncurry(curriedFn);
                    return fc.assert(
                        fc.property(fc.integer(), (x) => {
                            expect(uncurriedFn(x)).toBe(fn(x));
                        }),
                    );
                },
            ),
        );
    });

    it('should be associative (partial application order should not affect result)', () => {
        fc.assert(
            fc.property(fc.integer(), fc.integer(), (a, b) => {
                const add = (x: number, y: number) => x + y;
                const curriedAdd = curry(add);

                expect(curriedAdd(a)(b)).toBe(add(a, b));
            }),
        );
    });

    it('should satisfy uncurry(curry(fn)) === fn for multi-argument functions', () => {
        fc.assert(
            fc.property(
                fc.func<[number, number], number>(fc.integer()), // Generates valid functions
                (fn) => {
                    //  Ensure that we only test functions that are fully applicable when curried
                    const wrappedFn = (a: number, b: number) => fn(a, b);

                    const curriedFn = curry(wrappedFn);
                    const uncurriedFn = uncurry(curriedFn);

                    fc.assert(
                        fc.property(fc.integer(), fc.integer(), (x, y) => {
                            expect(typeof uncurriedFn).toBe('function'); //  Ensures correctness
                            expect(uncurriedFn(x, y)).toBe(wrappedFn(x, y)); //  Ensures full applicability
                        }),
                    );
                },
            ),
        );
    });

    it('should return the correct output when uncurry is applied to a deeply nested function', () => {
        fc.assert(
            fc.property(fc.integer(), fc.integer(), fc.integer(), (a, b, c) => {
                const curriedAdd = (x: number) => (y: number) => (z: number) => x + y + z;
                const uncurriedAdd = uncurry(curriedAdd);

                expect(uncurriedAdd(a, b, c)).toBe(a + b + c);
            }),
        );
    });

    it('should correctly handle different arities', () => {
        fc.assert(
            fc.property(fc.string(), fc.string(), fc.string(), (a, b, c) => {
                const curriedConcat = (x: string) => (y: string) => (z: string) => `${x}-${y}-${z}`;
                const uncurriedConcat = uncurry(curriedConcat);

                expect(uncurriedConcat(a, b, c)).toBe(`${a}-${b}-${c}`);
            }),
        );
    });
});
