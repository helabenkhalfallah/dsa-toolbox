import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { Effect } from './Effect.ts';
import { Err, Ok } from './Result.ts';

describe('Effect (Property-Based Tests)', () => {
    it('should satisfy identity law: effect.map(x => x) === effect', () => {
        fc.assert(
            fc.property(fc.anything(), (x) => {
                const effect = Effect(() => x);
                expect(effect.map((v) => v).run()).toStrictEqual(effect.run());
            }),
        );
    });

    it('should satisfy composition law: effect.map(f).map(g) === effect.map(x => g(f(x)))', () => {
        fc.assert(
            fc.property(
                fc.anything(),
                fc.func(fc.anything()),
                fc.func(fc.anything()),
                (x, f, g) => {
                    const effect = Effect(() => x);
                    const composedEffect = effect.map(f).map(g);
                    const directEffect = effect.map((v) => g(f(v)));

                    expect(composedEffect.run()).toStrictEqual(directEffect.run());
                },
            ),
        );
    });

    it('should satisfy flatMap associativity: (effect.flatMap(f)).flatMap(g) === effect.flatMap(x => f(x).flatMap(g))', () => {
        fc.assert(
            fc.property(
                fc.anything(),
                fc.func(
                    fc.constantFrom(
                        Effect(() => 1),
                        Effect(() => 2),
                    ),
                ),
                fc.func(
                    fc.constantFrom(
                        Effect(() => 3),
                        Effect(() => 4),
                    ),
                ),
                (x, f, g) => {
                    const effect = Effect(() => x);
                    const left = effect.flatMap(f).flatMap(g);
                    const right = effect.flatMap((v) => f(v).flatMap(g));

                    expect(left.run()).toStrictEqual(right.run());
                },
            ),
        );
    });

    it('should always return Err if an effect throws', () => {
        fc.assert(
            fc.property(fc.string(), (errorMessage) => {
                const effect = Effect(() => {
                    throw new Error(errorMessage);
                });

                expect(effect.run()).toStrictEqual(new Err(new Error(errorMessage)));
            }),
        );
    });

    it('should recover from errors correctly', () => {
        fc.assert(
            fc.property(fc.string(), (errorMessage) => {
                const effect = Effect(() => {
                    throw new Error(errorMessage);
                }).recover(() => 'Recovered');

                expect(effect.run()).toStrictEqual(new Ok('Recovered'));
            }),
        );
    });

    it('should execute effects safely without throwing exceptions', () => {
        fc.assert(
            fc.property(fc.anything(), (x) => {
                const effect = Effect(() => x);
                expect(() => effect.run()).not.toThrow();
            }),
        );
    });
});
