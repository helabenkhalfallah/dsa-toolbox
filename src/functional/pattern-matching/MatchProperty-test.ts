/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { match } from './Match.ts';

describe('match function - property-based testing', () => {
    it('should return the expected result for positive numbers', () => {
        fc.assert(
            fc.property(fc.integer({ min: 1 }), (n) => {
                const result = match(n, [[(x) => x > 0, (x) => `Positive: ${x}`]]);
                expect(result).toBe(`Positive: ${n}`);
            }),
        );
    });

    it('should correctly match string patterns', () => {
        fc.assert(
            fc.property(fc.string(), (s) => {
                const result = match(s, [
                    [(x) => x.startsWith('A'), () => 'Starts with A'],
                    [(x) => x.endsWith('Z'), () => 'Ends with Z'],
                    [(x) => x.length === 0, () => 'Empty string'],
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    [(_) => true, () => 'Fallback'],
                ]);

                // Property: The result should be a known output
                expect(['Starts with A', 'Ends with Z', 'Empty string', 'Fallback']).toContain(
                    result,
                );
            }),
        );
    });

    it('should correctly match objects', () => {
        fc.assert(
            fc.property(
                fc.record({
                    age: fc.integer({ min: 0, max: 120 }),
                    name: fc.string(),
                }),
                (user) => {
                    const result = match(user, [
                        [(u) => u.age < 18, () => 'Minor'],
                        [(u) => u.age >= 18, () => 'Adult'],
                    ]);

                    expect(['Minor', 'Adult']).toContain(result);
                },
            ),
        );
    });

    it('should always return a value from the match cases', () => {
        fc.assert(
            fc.property(fc.anything(), (randomValue) => {
                try {
                    match(randomValue, [
                        [(x) => typeof x === 'number', (x) => `Number: ${x}`],
                        [(x) => typeof x === 'string', (x) => `String: ${x}`],
                    ]);
                } catch (e) {
                    expect(e).toBeInstanceOf(Error);
                }
            }),
        );
    });

    it('should throw an error when no match is found', () => {
        fc.assert(
            fc.property(fc.anything(), (randomValue) => {
                expect(() =>
                    match(randomValue, [
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        [(x) => false, () => 'This never matches'], // Always false, so match() should always fail
                    ]),
                ).toThrowError('No match found');
            }),
        );
    });

    it('should throw an error when no match is found', () => {
        fc.assert(
            fc.property(fc.anything(), (randomValue) => {
                const patterns: [(value: any) => boolean, (value: any) => any][] = [
                    [(x) => typeof x === 'number', () => "It's a number"],
                    [(x) => typeof x === 'string', () => "It's a string"],
                ];

                // Check if any predicate matches
                const hasMatch = patterns.some(([predicate]) => predicate(randomValue));

                if (!hasMatch) {
                    expect(() => match(randomValue, patterns)).toThrowError('No match found');
                }
            }),
        );
    });
});
