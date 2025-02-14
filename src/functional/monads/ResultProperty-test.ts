import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { Err, Ok, Result } from './Result.ts';

describe('Result (Property-based Tests)', () => {
    it('should preserve identity under map', () => {
        fc.assert(
            fc.property(fc.integer(), (x) => {
                expect(new Ok(x).map((v) => v)).toStrictEqual(new Ok(x));
            }),
        );
    });

    it('should preserve identity under flatMap', () => {
        fc.assert(
            fc.property(fc.integer(), (x) => {
                expect(new Ok(x).flatMap((v) => new Ok(v))).toStrictEqual(new Ok(x));
            }),
        );
    });

    it('should not change Err values under map', () => {
        fc.assert(
            fc.property(fc.string(), fc.integer(), (error, x) => {
                expect(new Err(error).map(() => x)).toStrictEqual(new Err(error));
            }),
        );
    });

    it('should not change Ok values under mapError', () => {
        fc.assert(
            fc.property(fc.integer(), fc.string(), (x, error) => {
                expect(new Ok(x).mapError(() => error)).toStrictEqual(new Ok(x));
            }),
        );
    });

    it('unwrapOr should return the default value for Err', () => {
        fc.assert(
            fc.property(fc.string(), fc.integer(), (error, defaultValue) => {
                expect(new Err(error).unwrapOr(defaultValue)).toBe(defaultValue);
            }),
        );
    });

    it('should satisfy function composition associativity under map', () => {
        fc.assert(
            fc.property(fc.integer(), (x) => {
                const f = (v: number) => v + 1;
                const g = (v: number) => v * 2;
                expect(new Ok(x).map(f).map(g)).toStrictEqual(new Ok(g(f(x))));
            }),
        );
    });

    it('should correctly apply flatMap chaining', () => {
        fc.assert(
            fc.property(fc.integer(), (x) => {
                const double = (v: number) => new Ok(v * 2);
                expect(new Ok(x).flatMap(double)).toStrictEqual(new Ok(x * 2));
            }),
        );
    });

    it('fold should always resolve to a value', () => {
        fc.assert(
            fc.property(fc.integer(), fc.string(), (x, error) => {
                expect(
                    new Ok(x).fold(
                        () => 'Error',
                        (v) => String(v),
                    ),
                ).toBe(String(x)); // Ensure consistent return type
                expect(
                    new Err(error).fold(
                        () => 'Error',
                        (v) => v,
                    ),
                ).toBe('Error');
            }),
        );
    });

    it('should respect Err propagation in flatMap', () => {
        fc.assert(
            fc.property(fc.string(), (error) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const failingFn = (_: number): Result<number, string> => new Err(error);
                expect(new Ok(42).flatMap(failingFn)).toStrictEqual(new Err(error));
            }),
        );
    });
});
