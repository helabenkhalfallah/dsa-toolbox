import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { None, Some } from './Option.ts';

describe('Option<T> (Property-Based Tests)', () => {
    it('should satisfy map identity: map(x => x) === Option<T>', () => {
        fc.assert(
            fc.property(fc.anything(), (x) => {
                const option = new Some(x);
                expect(option.map((y) => y)).toStrictEqual(option);
            }),
        );
    });

    it('should satisfy associativity of map: map(f).map(g) === map(x => g(f(x)))', () => {
        fc.assert(
            fc.property(
                fc.anything(),
                fc.func(fc.anything()),
                fc.func(fc.anything()),
                (x, f, g) => {
                    const option = new Some(x);
                    const left = option.map(f).map(g);
                    const right = option.map((value) => g(f(value)));

                    expect(left).toStrictEqual(right);
                },
            ),
        );
    });

    it('should satisfy flatMap identity: flatMap(Some) === identity', () => {
        fc.assert(
            fc.property(fc.anything(), (x) => {
                const option = new Some(x);
                expect(option.flatMap((y) => new Some(y))).toStrictEqual(option);
            }),
        );
    });

    it('should satisfy associativity of flatMap: flatMap(f).flatMap(g) === flatMap(x => f(x).flatMap(g))', () => {
        fc.assert(
            fc.property(
                fc.anything(),
                fc.func(fc.constant(new Some(42))), // Ensures `f` returns `Option<T>`
                fc.func(fc.constant(new Some(99))), // Ensures `g` returns `Option<T>`
                (x, f, g) => {
                    const option = new Some(x);
                    const left = option.flatMap(f).flatMap(g);
                    const right = option.flatMap((value) => f(value).flatMap(g));

                    expect(left).toStrictEqual(right);
                },
            ),
        );
    });

    it('should ensure getOrElse returns value for Some and default for None', () => {
        fc.assert(
            fc.property(fc.anything(), fc.anything(), (x, defaultValue) => {
                const some = new Some(x);
                expect(some.getOrElse(defaultValue)).toBe(x);

                const none = None.instance;
                expect(none.getOrElse(defaultValue)).toBe(defaultValue);
            }),
        );
    });

    it('should return alternative value when orElse is applied to None', () => {
        fc.assert(
            fc.property(fc.anything(), (x) => {
                const alternative = new Some(x);
                expect(None.instance.orElse(alternative)).toStrictEqual(alternative);
            }),
        );
    });

    it('should ensure filter(predicate) returns None for failing conditions', () => {
        fc.assert(
            fc.property(fc.anything(), fc.func(fc.boolean()), (x, predicate) => {
                const option = new Some(x);
                const filtered = option.filter(predicate);

                if (!predicate(x)) {
                    expect(filtered).toStrictEqual(None.instance);
                }
            }),
        );
    });

    it('should ensure None behaves consistently across all operations', () => {
        fc.assert(
            fc.property(fc.func(fc.anything()), fc.anything(), (fn, defaultValue) => {
                const none = None.instance;

                expect(none.map(fn)).toStrictEqual(none);
                expect(none.flatMap(() => new Some(42))).toStrictEqual(none);
                expect(none.getOrElse(defaultValue)).toBe(defaultValue);
                expect(none.orElse(new Some(42))).toStrictEqual(new Some(42));
                expect(none.filter(() => true)).toStrictEqual(none);
            }),
        );
    });
});
