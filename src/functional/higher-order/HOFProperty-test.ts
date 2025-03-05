import fc from 'fast-check';
import { describe, expect, it, vi } from 'vitest';

import { once, unless, when } from './HOF.ts';

describe('Higher-Order Function Utilities (Property-Based Testing)', () => {
    describe('once', () => {
        it('should return the same result for multiple calls', () => {
            fc.assert(
                fc.property(fc.integer(), (x) => {
                    const mockFn = vi.fn((y: number) => y * 2);
                    const onceFn = once(mockFn);
                    expect(onceFn(x)).toBe(onceFn(x));
                }),
            );
        });
    });

    describe('when', () => {
        it('should execute function only when predicate is true', () => {
            const mockFn = vi.fn();
            const whenPositive = when((x: number) => x > 0, mockFn);

            fc.assert(
                fc.property(fc.integer(), (x) => {
                    whenPositive(x);
                    if (x > 0) {
                        expect(mockFn).toHaveBeenCalledWith(x);
                    }
                }),
            );
        });
    });

    describe('unless', () => {
        it('should execute function only when predicate is false', () => {
            const mockFn = vi.fn();
            const unlessPositive = unless((x: number) => x > 0, mockFn);

            fc.assert(
                fc.property(fc.integer(), (x) => {
                    unlessPositive(x);
                    if (x <= 0) {
                        expect(mockFn).toHaveBeenCalledWith(x);
                    }
                }),
            );
        });
    });
});
