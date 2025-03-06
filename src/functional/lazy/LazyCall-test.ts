import { describe, expect, it, vi } from 'vitest';

import { LazyCall } from './LazyCall.ts';

describe('LazyCall', () => {
    it('should evaluate the computation only once', () => {
        const spy = vi.fn(() => 42);
        const lazy = new LazyCall(spy);

        expect(spy).not.toHaveBeenCalled();

        const result1 = lazy.get();
        const result2 = lazy.get();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(result1).toBe(42);
        expect(result2).toBe(42);
    });

    it('should apply transformations using map lazily', () => {
        const spy = vi.fn(() => 10);
        const lazy = new LazyCall(spy);
        const mapped = lazy.map((x) => x * 2);

        expect(spy).not.toHaveBeenCalled(); // The computation should not run yet

        const result = mapped.get();

        expect(spy).toHaveBeenCalledTimes(1); // The original computation should run once
        expect(result).toBe(20);
    });

    it('should apply flatMap and preserve laziness', () => {
        const spy = vi.fn(() => 5);
        const lazy = new LazyCall(spy);
        const flatMapped = lazy.flatMap((x) => new LazyCall(() => x * 3));

        expect(spy).not.toHaveBeenCalled(); // Should not compute yet

        const result = flatMapped.get();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toBe(15);
    });

    it('should work with multiple transformations and only compute once', () => {
        const spy = vi.fn(() => 3);
        const lazy = new LazyCall(spy).map((x) => x + 2).map((x) => x * 10);

        expect(spy).not.toHaveBeenCalled(); // No evaluation yet

        const result = lazy.get();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toBe(50);
    });

    it('should allow chaining of flatMap with dependent computations', () => {
        const lazy = new LazyCall(() => 5)
            .flatMap((x) => new LazyCall(() => x * 2))
            .flatMap((x) => new LazyCall(() => x + 3));

        const result = lazy.get();

        expect(result).toBe(13); // (5 * 2) + 3
    });

    it('should correctly handle side effects only once', () => {
        let count = 0;
        const lazy = new LazyCall(() => {
            count++;
            return count;
        });

        expect(count).toBe(0);

        const first = lazy.get();
        const second = lazy.get();

        expect(first).toBe(1);
        expect(second).toBe(1);
        expect(count).toBe(1);
    });
});
