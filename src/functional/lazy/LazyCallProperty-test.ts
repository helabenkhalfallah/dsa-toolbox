import fc from 'fast-check';
import { describe, expect, it, vi } from 'vitest';

import { LazyCall } from './LazyCall.ts';

describe('LazyCall - Property-Based Testing', () => {
    it('should always return the same value for the same computation', () => {
        fc.assert(
            fc.property(fc.integer(), (num) => {
                const lazy = new LazyCall(() => num);

                expect(lazy.get()).toBe(num);
                expect(lazy.get()).toBe(num); // Ensure memoization
            }),
        );
    });

    it('should only evaluate once regardless of how many times get() is called', () => {
        fc.assert(
            fc.property(fc.integer(), (num) => {
                const spy = vi.fn(() => num);
                const lazy = new LazyCall(spy);

                lazy.get();
                lazy.get();
                lazy.get();

                expect(spy).toHaveBeenCalledTimes(1);
            }),
        );
    });

    it('should correctly apply map transformations', () => {
        fc.assert(
            fc.property(fc.integer(), fc.func(fc.integer()), (num, transformFn) => {
                const lazy = new LazyCall(() => num).map(transformFn);

                expect(lazy.get()).toBe(transformFn(num));
            }),
        );
    });

    it('should correctly apply flatMap transformations', () => {
        fc.assert(
            fc.property(fc.integer(), fc.func(fc.integer()), (num, transformFn) => {
                const lazy = new LazyCall(() => num).flatMap(
                    (x) => new LazyCall(() => transformFn(x)),
                );

                expect(lazy.get()).toBe(transformFn(num));
            }),
        );
    });

    it('should preserve memoization after mapping', () => {
        fc.assert(
            fc.property(fc.integer(), fc.func(fc.integer()), (num, transformFn) => {
                const spy = vi.fn(() => num);
                const lazy = new LazyCall(spy).map(transformFn);

                const result1 = lazy.get();
                const result2 = lazy.get();

                expect(spy).toHaveBeenCalledTimes(1);
                expect(result1).toBe(result2);
            }),
        );
    });

    it('should preserve memoization after flatMapping', () => {
        fc.assert(
            fc.property(fc.integer(), fc.func(fc.integer()), (num, transformFn) => {
                const spy = vi.fn(() => num);
                const lazy = new LazyCall(spy).flatMap((x) => new LazyCall(() => transformFn(x)));

                const result1 = lazy.get();
                const result2 = lazy.get();

                expect(spy).toHaveBeenCalledTimes(1);
                expect(result1).toBe(result2);
            }),
        );
    });

    it('should chain multiple maps correctly', () => {
        fc.assert(
            fc.property(
                fc.integer(),
                fc.func(fc.integer()),
                fc.func(fc.integer()),
                (num, fn1, fn2) => {
                    const lazy = new LazyCall(() => num).map(fn1).map(fn2);

                    expect(lazy.get()).toBe(fn2(fn1(num)));
                },
            ),
        );
    });

    it('should chain multiple flatMaps correctly', () => {
        fc.assert(
            fc.property(
                fc.integer(),
                fc.func(fc.integer()),
                fc.func(fc.integer()),
                (num, fn1, fn2) => {
                    const lazy = new LazyCall(() => num)
                        .flatMap((x) => new LazyCall(() => fn1(x)))
                        .flatMap((x) => new LazyCall(() => fn2(x)));

                    expect(lazy.get()).toBe(fn2(fn1(num)));
                },
            ),
        );
    });
});
