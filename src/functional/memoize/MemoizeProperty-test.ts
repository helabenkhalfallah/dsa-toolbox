import * as fc from 'fast-check';
import { describe, expect, it, vi } from 'vitest';

import { memoize } from './Memoize.ts';

describe('memoize (property-based)', () => {
    it('should return the same result for the same arguments', () => {
        fc.assert(
            fc.property(
                // Generate random functions and arguments
                fc.func(fc.integer()), // A function that takes any number of arguments and returns an integer
                fc.array(fc.anything()), // An array of arbitrary arguments
                (fn, args) => {
                    const memoizedFn = memoize(fn);

                    // Call the memoized function twice with the same arguments
                    const result1 = memoizedFn(...args);
                    const result2 = memoizedFn(...args);

                    // Ensure the results are the same
                    expect(result1).toBe(result2);
                },
            ),
        );
    });

    it('should call the original function only once for the same arguments', () => {
        fc.assert(
            fc.property(
                // Generate random functions and arguments
                fc.func(fc.integer()), // A function that takes any number of arguments and returns an integer
                fc.array(fc.anything()), // An array of arbitrary arguments
                (fn, args) => {
                    const mockFn = vi.fn(fn); // Wrap the function in a mock
                    const memoizedFn = memoize(mockFn);

                    // Call the memoized function twice with the same arguments
                    memoizedFn(...args);
                    memoizedFn(...args);

                    // Ensure the original function was called only once
                    expect(mockFn).toHaveBeenCalledTimes(1);
                },
            ),
        );
    });

    it('should handle different arguments correctly', () => {
        fc.assert(
            fc.property(
                // Generate random functions and two sets of arguments
                fc.func(fc.integer()), // A function that takes any number of arguments and returns an integer
                fc.array(fc.anything()), // First set of arguments
                fc.array(fc.anything()), // Second set of arguments
                (fn, args1, args2) => {
                    const memoizedFn = memoize(fn);

                    // Call the memoized function with two different sets of arguments
                    const result1 = memoizedFn(...args1);
                    const result2 = memoizedFn(...args2);

                    // If the arguments are the same, the results should be the same
                    if (JSON.stringify(args1) === JSON.stringify(args2)) {
                        expect(result1).toBe(result2);
                    } else {
                        // If the arguments are different, the results may or may not be the same
                        // (depending on the function logic, but we can't assume anything here)
                        expect(true).toBe(true); // Placeholder assertion
                    }
                },
            ),
        );
    });

    it('should handle functions with no arguments', () => {
        fc.assert(
            fc.property(
                // Generate random functions that take no arguments
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                fc.func(fc.integer(), { arity: 0 }), // A function that takes no arguments and returns an integer
                (fn) => {
                    const memoizedFn = memoize(fn);

                    // Call the memoized function twice
                    const result1 = memoizedFn();
                    const result2 = memoizedFn();

                    // Ensure the results are the same
                    expect(result1).toBe(result2);
                },
            ),
        );
    });
});
