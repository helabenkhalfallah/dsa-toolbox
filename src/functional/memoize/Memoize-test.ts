import { describe, expect, it, vi } from 'vitest';

import { memoize } from './Memoize.ts';

describe('memoize', () => {
    it('should cache results for primitive arguments', () => {
        const mockFn = vi.fn((a: number, b: number) => a + b);
        const memoizedFn = memoize(mockFn);

        // First call, should compute
        expect(memoizedFn(2, 3)).toBe(5);
        expect(mockFn).toHaveBeenCalledTimes(1);

        // Second call with same arguments, should use cache
        expect(memoizedFn(2, 3)).toBe(5);
        expect(mockFn).toHaveBeenCalledTimes(1);

        // Call with different arguments, should compute again
        expect(memoizedFn(4, 5)).toBe(9);
        expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should cache results for object arguments', () => {
        const mockFn = vi.fn((obj: { a: number }) => obj.a + 1);
        const memoizedFn = memoize(mockFn);

        const obj1 = { a: 1 };
        const obj2 = { a: 2 };

        // First call, should compute
        expect(memoizedFn(obj1)).toBe(2);
        expect(mockFn).toHaveBeenCalledTimes(1);

        // Second call with same object, should use cache
        expect(memoizedFn(obj1)).toBe(2);
        expect(mockFn).toHaveBeenCalledTimes(1);

        // Call with a different object, should compute again
        expect(memoizedFn(obj2)).toBe(3);
        expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should handle functions with no arguments', () => {
        const mockFn = vi.fn(() => 42);
        const memoizedFn = memoize(mockFn);

        // First call, should compute
        expect(memoizedFn()).toBe(42);
        expect(mockFn).toHaveBeenCalledTimes(1);

        // Second call, should use cache
        expect(memoizedFn()).toBe(42);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should handle functions with mixed primitive and object arguments', () => {
        const mockFn = vi.fn((a: number, obj: { b: number }) => a + obj.b);
        const memoizedFn = memoize(mockFn);

        const obj1 = { b: 2 };
        const obj2 = { b: 3 };

        // First call, should compute
        expect(memoizedFn(1, obj1)).toBe(3);
        expect(mockFn).toHaveBeenCalledTimes(1);

        // Second call with same arguments, should use cache
        expect(memoizedFn(1, obj1)).toBe(3);
        expect(mockFn).toHaveBeenCalledTimes(1);

        // Call with different object, should compute again
        expect(memoizedFn(1, obj2)).toBe(4);
        expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should handle functions with array arguments', () => {
        const mockFn = vi.fn((arr: number[]) => arr.reduce((sum, num) => sum + num, 0));
        const memoizedFn = memoize(mockFn);

        const arr1 = [1, 2, 3];
        const arr2 = [4, 5, 6];

        // First call, should compute
        expect(memoizedFn(arr1)).toBe(6);
        expect(mockFn).toHaveBeenCalledTimes(1);

        // Second call with same array, should use cache
        expect(memoizedFn(arr1)).toBe(6);
        expect(mockFn).toHaveBeenCalledTimes(1);

        // Call with a different array, should compute again
        expect(memoizedFn(arr2)).toBe(15);
        expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should handle functions with complex nested arguments', () => {
        const mockFn = vi.fn((obj: { a: { b: number } }) => obj.a.b + 1);
        const memoizedFn = memoize(mockFn);

        const obj1 = { a: { b: 1 } };
        const obj2 = { a: { b: 2 } };

        // First call, should compute
        expect(memoizedFn(obj1)).toBe(2);
        expect(mockFn).toHaveBeenCalledTimes(1);

        // Second call with same object, should use cache
        expect(memoizedFn(obj1)).toBe(2);
        expect(mockFn).toHaveBeenCalledTimes(1);

        // Call with a different object, should compute again
        expect(memoizedFn(obj2)).toBe(3);
        expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should handle functions with undefined or null arguments', () => {
        const mockFn = vi.fn((a: number | undefined, b: number | null) => (a ?? 0) + (b ?? 0));
        const memoizedFn = memoize(mockFn);

        // First call, should compute
        expect(memoizedFn(undefined, null)).toBe(0);
        expect(mockFn).toHaveBeenCalledTimes(1);

        // Second call with same arguments, should use cache
        expect(memoizedFn(undefined, null)).toBe(0);
        expect(mockFn).toHaveBeenCalledTimes(1);

        // Call with different arguments, should compute again
        expect(memoizedFn(1, null)).toBe(1);
        expect(mockFn).toHaveBeenCalledTimes(2);
    });
});
