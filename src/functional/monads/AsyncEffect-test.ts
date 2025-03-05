import { describe, expect, it } from 'vitest';

import { AsyncEffect } from './AsyncEffect.ts';
import { Err, Ok } from './Result.ts';

describe('AsyncEffect', () => {
    it('should resolve to Ok(value) when successful', async () => {
        const effect = AsyncEffect(() => Promise.resolve(42));
        const result = await effect.run();
        expect(result).toBeInstanceOf(Ok);
        expect(result.unwrapOrThrow()).toBe(42);
    });

    it('should return Err(error) when failing', async () => {
        const effect = AsyncEffect<string, string>(() => Promise.reject('Boom!'));
        const result = await effect.run();
        expect(result).toBeInstanceOf(Err);
        expect(result.unwrapOr('Default')).toBe('Default');
    });

    it('should transform value with map()', async () => {
        const effect = AsyncEffect(() => Promise.resolve(10)).map((x) => x * 2);
        const result = await effect.run();
        expect(result).toBeInstanceOf(Ok);
        expect(result.unwrapOrThrow()).toBe(20);
    });

    it('should chain computations with flatMap()', async () => {
        const effect = AsyncEffect(() => Promise.resolve(5))
            .flatMap((x) => AsyncEffect(() => Promise.resolve(x * 2)))
            .flatMap((y) => AsyncEffect(() => Promise.resolve(y + 3)));

        const result = await effect.run();
        expect(result).toBeInstanceOf(Ok);
        expect(result.unwrapOrThrow()).toBe(13);
    });

    it('should propagate errors through flatMap()', async () => {
        const effect = AsyncEffect<number, string>(() => Promise.resolve(5)) // Explicit types
            .flatMap((x) =>
                x === 5
                    ? AsyncEffect<number, string>(() => Promise.reject('Intentional error'))
                    : AsyncEffect<number, string>(() => Promise.resolve(x)),
            );

        const result = await effect.run();
        expect(result).toBeInstanceOf(Err);
        expect(result.unwrapOr(0)).toBe(0);
    });

    it('should recover from errors with recover()', async () => {
        const effect = AsyncEffect(() => Promise.reject('Network error')).recover(
            () => 'Fallback value',
        );

        const result = await effect.run();
        expect(result).toBeInstanceOf(Ok);
        expect(result.unwrapOrThrow()).toBe('Fallback value');
    });

    it('should handle async operations correctly', async () => {
        const asyncOp = AsyncEffect(async () => {
            await new Promise((res) => setTimeout(res, 50)); // Simulate delay
            return 100;
        });

        const result = await asyncOp.run();
        expect(result).toBeInstanceOf(Ok);
        expect(result.unwrapOrThrow()).toBe(100);
    });
});
