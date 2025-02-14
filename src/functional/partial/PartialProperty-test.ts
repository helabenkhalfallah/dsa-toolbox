import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { partial, partialRight } from './Partial.ts';

describe('partial (Property-based Tests)', () => {
    it('should behave as expected when partially applying arguments from the left', () => {
        fc.assert(
            fc.property(
                fc.func<[number, number], number>(fc.integer()), // Generates (a, b) => number
                fc.integer(),
                fc.integer(),
                (fn, x, y) => {
                    const partiallyApplied = partial(fn, x);
                    expect(partiallyApplied(y)).toBe(fn(x, y)); //  Expected behavior
                },
            ),
        );
    });

    it('should satisfy partial(partial(fn, x), y) === partial(fn, x, y)', () => {
        fc.assert(
            fc.property(
                fc.func<[number, number, number], number>(fc.integer()), // Generates (a, b, c) => number
                fc.integer(),
                fc.integer(),
                fc.integer(),
                // eslint-disable-next-line max-params
                (fn, x, y, z) => {
                    const partiallyApplied1 = partial(partial(fn, x), y);
                    const partiallyApplied2 = partial(fn, x, y);

                    //  Instead of comparing functions, compare outputs
                    expect(partiallyApplied1(z)).toBe(partiallyApplied2(z));
                },
            ),
        );
    });
});

describe('partialRight (Property-based Tests)', () => {
    it('should behave as expected when partially applying arguments from the right', () => {
        fc.assert(
            fc.property(
                fc.func<[number, number], number>(fc.integer()), // Generates (a, b) => number
                fc.integer(),
                fc.integer(),
                (fn, x, y) => {
                    const partiallyApplied = partialRight(fn, y);
                    expect(partiallyApplied(x)).toBe(fn(x, y)); //  Expected behavior
                },
            ),
        );
    });

    it('should satisfy partialRight(partialRight(fn, y), x) === partialRight(fn, x, y)', () => {
        fc.assert(
            fc.property(
                fc.func<[number, number, number], number>(fc.integer()), // Generates (a, b, c) => number
                fc.integer(),
                fc.integer(),
                fc.integer(),
                // eslint-disable-next-line max-params
                (fn, x, y, z) => {
                    const partiallyApplied1 = partialRight(partialRight(fn, y), x);
                    const partiallyApplied2 = partialRight(fn, x, y);

                    //  Instead of comparing functions, compare outputs
                    expect(partiallyApplied1(z)).toBe(partiallyApplied2(z));
                },
            ),
        );
    });
});
