import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { compose, pipe } from './Composition.ts';

describe('Functional Composition', () => {
    const trim = (s: string): string => s.trim();
    const toUpperCase = (s: string): string => s.toUpperCase();
    const exclaim = (s: string): string => `${s}!`;

    // Identity Law: compose(id) and pipe(id) should be equivalent to identity function
    it('should satisfy composition identity property', () => {
        fc.assert(
            fc.property(fc.string(), (input) => {
                const id = (x: string) => x;
                expect(compose(id)(input)).toBe(input);
                expect(pipe(id)(input)).toBe(input);
            }),
        );
    });

    // Associativity: compose(f, compose(g, h)) === compose(compose(f, g), h)
    it('should be associative', () => {
        fc.assert(
            fc.property(fc.string(), (input) => {
                const f = trim;
                const g = toUpperCase;
                const h = exclaim;

                // Associativity Law
                expect(compose(f, compose(g, h))(input)).toBe(compose(compose(f, g), h)(input));
                expect(pipe(pipe(f, g), h)(input)).toBe(pipe(f, pipe(g, h))(input));
            }),
        );
    });

    // Idempotency: If a function is idempotent (f(f(x)) === f(x)), compose(f, f) should be equivalent to f
    it('should satisfy idempotency for idempotent functions', () => {
        fc.assert(
            fc.property(fc.string(), (input) => {
                const idempotentTrim = (s: string) => s.trim();
                expect(compose(idempotentTrim, idempotentTrim)(input)).toBe(idempotentTrim(input));
                expect(pipe(idempotentTrim, idempotentTrim)(input)).toBe(idempotentTrim(input));
            }),
        );
    });

    // Composition with multiple transformations should be equivalent to applying them individually
    it('should maintain transformation consistency', () => {
        fc.assert(
            fc.property(fc.string(), (input) => {
                const transformedDirectly = exclaim(toUpperCase(trim(input)));
                const transformedViaCompose = compose(exclaim, toUpperCase, trim)(input);
                const transformedViaPipe = pipe(trim, toUpperCase, exclaim)(input);

                expect(transformedViaCompose).toBe(transformedDirectly);
                expect(transformedViaPipe).toBe(transformedDirectly);
            }),
        );
    });

    // Length Preservation: If functions do not change length, compose(f, g) should preserve the input length
    it('should preserve string length if transformations do not add/remove characters', () => {
        fc.assert(
            fc.property(fc.string(), (input) => {
                const f = (s: string) => s.replace(/\s/g, '_'); // Replace spaces with underscores (preserves length)
                const g = (s: string) => s.toLowerCase(); // Does not change length
                const transformed = compose(f, g)(input);
                expect(transformed.length).toBe(input.length);
            }),
        );
    });

    // Involution: If a function is its own inverse (f(f(x)) = x), then compose(f, f) should return the original input
    it('should satisfy involution for inverse functions', () => {
        fc.assert(
            fc.property(fc.string(), (input) => {
                const reverse = (s: string) => s.split('').reverse().join('');
                expect(compose(reverse, reverse)(input)).toBe(input);
                expect(pipe(reverse, reverse)(input)).toBe(input);
            }),
        );
    });
});
