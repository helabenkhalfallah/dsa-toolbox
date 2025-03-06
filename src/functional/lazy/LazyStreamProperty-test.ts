import fc from 'fast-check';
import { describe, expect, it, vi } from 'vitest';

import { LazyStream } from './LazyStream.ts';

async function* asyncGenerator<T>(arr: T[]) {
    for (const item of arr) {
        await new Promise((resolve) => setTimeout(resolve, 5)); // Simulated async delay
        yield item;
    }
}

describe('LazyStream - Property-Based Testing', () => {
    it('map should behave like Array.prototype.map()', async () => {
        await fc.assert(
            fc.asyncProperty(fc.array(fc.integer()), async (numbers) => {
                const double = (x: number) => x * 2;
                const expected = numbers.map(double);

                const lazyStream = LazyStream.from(() => asyncGenerator(numbers)).map(double);
                const result = await lazyStream.toArray();

                expect(result).toStrictEqual(expected);
            }),
        );
    });

    it('filter should behave like Array.prototype.filter()', async () => {
        await fc.assert(
            fc.asyncProperty(fc.array(fc.integer()), async (numbers) => {
                const isEven = (x: number) => x % 2 === 0;
                const expected = numbers.filter(isEven);

                const lazyStream = LazyStream.from(() => asyncGenerator(numbers)).filter(isEven);
                const result = await lazyStream.toArray();

                expect(result).toStrictEqual(expected);
            }),
        );
    });

    it('take(n) should return at most n elements', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.array(fc.integer(), { minLength: 1, maxLength: 100 }),
                fc.integer({ min: 1, max: 10 }),
                async (numbers, n) => {
                    const lazyStream = LazyStream.from(() => asyncGenerator(numbers)).take(n);
                    const result = await lazyStream.toArray();

                    expect(result.length).toBeLessThanOrEqual(n);
                    expect(result).toStrictEqual(numbers.slice(0, n));
                },
            ),
        );
    });

    it('should return an empty array when transforming an empty stream', async () => {
        await fc.assert(
            fc.asyncProperty(fc.constant([]), async (emptyArray) => {
                const lazyStream = LazyStream.from(() => asyncGenerator(emptyArray))
                    .map((x) => x * 2)
                    .filter((x) => x > 0)
                    .take(5);

                const result = await lazyStream.toArray();
                expect(result).toStrictEqual([]);
            }),
        );
    });

    it('should maintain order when applying multiple transformations', async () => {
        await fc.assert(
            fc.asyncProperty(fc.array(fc.integer()), async (numbers) => {
                const fn1 = (x: number) => x * 2;
                const fn2 = (x: number) => x + 3;

                const expected = numbers.map(fn1).map(fn2);
                const lazyStream = LazyStream.from(() => asyncGenerator(numbers))
                    .map(fn1)
                    .map(fn2);

                const result = await lazyStream.toArray();
                expect(result).toStrictEqual(expected);
            }),
        );
    });

    it('should not evaluate elements unless toArray() is called', async () => {
        await fc.assert(
            fc.asyncProperty(fc.array(fc.integer(), { minLength: 1 }), async (numbers) => {
                const spy = vi.fn();
                const lazyStream = LazyStream.from(async function* () {
                    for (const num of numbers) {
                        spy();
                        yield num;
                    }
                });

                expect(spy).not.toHaveBeenCalled();
                await lazyStream.toArray();
                expect(spy).toHaveBeenCalledTimes(numbers.length);
            }),
        );
    });

    it('should correctly compose filter() and take()', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.array(fc.integer(), { minLength: 10, maxLength: 50 }),
                fc.integer({ min: 1, max: 10 }),
                async (numbers, n) => {
                    const isOdd = (x: number) => x % 2 !== 0;

                    const expected = numbers.filter(isOdd).slice(0, n);
                    const lazyStream = LazyStream.from(() => asyncGenerator(numbers))
                        .filter(isOdd)
                        .take(n);

                    const result = await lazyStream.toArray();
                    expect(result).toStrictEqual(expected);
                },
            ),
        );
    });
});
