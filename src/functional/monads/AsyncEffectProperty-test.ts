import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { AsyncEffect } from './AsyncEffect.ts';
import { Err, Ok } from './Result.ts';

describe('AsyncEffect (Property-Based Tests)', () => {
    it('should always return Ok for resolved promises', async () => {
        await fc.assert(
            fc.asyncProperty(fc.anything(), async (value) => {
                const effect = AsyncEffect(() => Promise.resolve(value));
                const result = await effect.run();
                expect(result).toBeInstanceOf(Ok);
                expect(result.unwrapOr(null)).toBe(value);
            }),
        );
    });

    it('should always return Err for rejected promises', async () => {
        await fc.assert(
            fc.asyncProperty(fc.string(), async (errorMessage) => {
                const effect = AsyncEffect<string, string>(() => Promise.reject(errorMessage));
                const result = await effect.run();
                expect(result).toBeInstanceOf(Err);
                expect(result.unwrapOr('Recovered')).toBe('Recovered');
            }),
        );
    });

    it('should map() correctly', async () => {
        await fc.assert(
            fc.asyncProperty(fc.integer(), async (value) => {
                const effect = AsyncEffect(() => Promise.resolve(value)).map((x) => x * 2);
                const result = await effect.run();
                expect(result).toBeInstanceOf(Ok);
                expect(result.unwrapOr(0)).toBe(value * 2);
            }),
        );
    });

    it('should flatMap() correctly', async () => {
        await fc.assert(
            fc.asyncProperty(fc.integer(), async (value) => {
                const effect = AsyncEffect(() => Promise.resolve(value))
                    .flatMap((x) => AsyncEffect(() => Promise.resolve(x + 1)))
                    .flatMap((x) => AsyncEffect(() => Promise.resolve(x * 2)));

                const result = await effect.run();
                expect(result).toBeInstanceOf(Ok);
                expect(result.unwrapOr(0)).toBe((value + 1) * 2);
            }),
        );
    });

    it('should recover() from errors', async () => {
        await fc.assert(
            fc.asyncProperty(fc.string(), async (errorMessage) => {
                const effect = AsyncEffect(() => Promise.reject(errorMessage)).recover(
                    () => 'Recovered',
                );
                const result = await effect.run();
                expect(result).toBeInstanceOf(Ok);
                expect(result.unwrapOr('')).toBe('Recovered');
            }),
        );
    });
});
