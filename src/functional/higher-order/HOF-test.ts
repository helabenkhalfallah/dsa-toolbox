import { describe, expect, it, vi } from 'vitest';

import { debounce, once, throttle, unless, when } from './HOF.ts';

describe('Higher-Order Function Utilities', () => {
    describe('once', () => {
        it('should only execute the function once', () => {
            const mockFn = vi.fn(() => 'called');
            const onceFn = once(mockFn);

            expect(onceFn()).toBe('called');
            expect(onceFn()).toBe('called');
            expect(mockFn).toHaveBeenCalledTimes(1);
        });
    });

    describe('debounce', () => {
        it('should delay execution until pause', async () => {
            vi.useFakeTimers();
            const mockFn = vi.fn();
            const debounced = debounce(mockFn, 500);

            debounced();
            debounced();
            debounced();

            expect(mockFn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(500);

            expect(mockFn).toHaveBeenCalledTimes(1);
            vi.useRealTimers();
        });
    });

    describe('throttle', () => {
        it('should execute at most once per time interval', async () => {
            vi.useFakeTimers();
            const mockFn = vi.fn();
            const throttled = throttle(mockFn, 500);

            throttled();
            throttled();
            throttled();

            expect(mockFn).toHaveBeenCalledTimes(1);

            vi.advanceTimersByTime(500);
            throttled();

            expect(mockFn).toHaveBeenCalledTimes(2);
            vi.useRealTimers();
        });
    });

    describe('when', () => {
        it('should execute the function when predicate is true', () => {
            const mockFn = vi.fn();
            const whenPositive = when((x: number) => x > 0, mockFn);

            whenPositive(5);
            whenPositive(-3);

            expect(mockFn).toHaveBeenCalledTimes(1);
            expect(mockFn).toHaveBeenCalledWith(5);
        });
    });

    describe('unless', () => {
        it('should execute the function when predicate is false', () => {
            const mockFn = vi.fn();
            const unlessPositive = unless((x: number) => x > 0, mockFn);

            unlessPositive(-5);
            unlessPositive(3);

            expect(mockFn).toHaveBeenCalledTimes(1);
            expect(mockFn).toHaveBeenCalledWith(-5);
        });
    });
});
