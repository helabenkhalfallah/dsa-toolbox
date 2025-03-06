import { describe, expect, it } from 'vitest';

import { LazyStream } from './LazyStream.ts';

async function* asyncNumbers(start = 1, count = 10, delay = 10) {
    for (let i = start; i < start + count; i++) {
        await new Promise((resolve) => setTimeout(resolve, delay)); // Simulate async delay
        yield i;
    }
}

describe('LazyStream', () => {
    it('should lazily generate values and collect them in an array', async () => {
        const stream = LazyStream.from(() => asyncNumbers(1, 5));

        const result = await stream.toArray();
        expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should apply map lazily', async () => {
        const stream = LazyStream.from(() => asyncNumbers(1, 5)).map((x) => x * 2);

        const result = await stream.toArray();
        expect(result).toEqual([2, 4, 6, 8, 10]);
    });

    it('should apply filter lazily', async () => {
        const stream = LazyStream.from(() => asyncNumbers(1, 10)).filter((x) => x % 2 === 0);

        const result = await stream.toArray();
        expect(result).toEqual([2, 4, 6, 8, 10]);
    });

    it('should apply take lazily and stop after n elements', async () => {
        const stream = LazyStream.from(() => asyncNumbers(1, 10)).take(3);

        const result = await stream.toArray();
        expect(result).toEqual([1, 2, 3]);
    });

    it('should correctly chain map, filter, and take', async () => {
        const stream = LazyStream.from(() => asyncNumbers(1, 20))
            .map((x) => x * 2)
            .filter((x) => x % 3 === 0)
            .take(4);

        const result = await stream.toArray();
        expect(result).toEqual([6, 12, 18, 24]); // Doubled and divisible by 3
    });

    it('should not evaluate values until toArray is called', async () => {
        let evaluated = false;
        const stream = LazyStream.from(async function* () {
            evaluated = true;
            yield 42;
        });

        expect(evaluated).toBe(false); // Should not have evaluated yet
        await stream.toArray();
        expect(evaluated).toBe(true); // Should evaluate after calling toArray
    });

    it('should handle empty streams gracefully', async () => {
        const emptyStream = LazyStream.from(async function* () {});

        const result = await emptyStream.toArray();
        expect(result).toEqual([]);
    });

    it('should work with asynchronous transformations', async () => {
        const stream = LazyStream.from(() => asyncNumbers(1, 5)).map(
            async (x) => x * 2 + 1, // Async transformation
        );

        const result = await stream.toArray();
        expect(result).toEqual([3, 5, 7, 9, 11]);
    });

    it('should handle multiple independent consumers without interfering', async () => {
        const stream = LazyStream.from(() => asyncNumbers(1, 5));

        const firstResult = await stream.take(2).toArray();
        const secondResult = await stream.toArray(); // Should be independent

        expect(firstResult).toEqual([1, 2]);
        expect(secondResult).toEqual([1, 2, 3, 4, 5]); // Full result
    });

    it('should respect order of operations (take before filter)', async () => {
        const stream = LazyStream.from(() => asyncNumbers(1, 10))
            .take(3)
            .filter((x) => x % 2 === 0);

        const result = await stream.toArray();
        expect(result).toEqual([2]); // Only 2 remains after first 3 elements
    });

    it('should respect order of operations (filter before take)', async () => {
        const stream = LazyStream.from(() => asyncNumbers(1, 10))
            .filter((x) => x % 2 === 0)
            .take(3);

        const result = await stream.toArray();
        expect(result).toEqual([2, 4, 6]); // First three even numbers
    });
});
