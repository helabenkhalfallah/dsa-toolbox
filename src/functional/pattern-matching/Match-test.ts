import { describe, expect, it } from 'vitest';

import { match } from './Match.ts';

describe('match function', () => {
    it('should return the correct result for number matching', () => {
        const result = match(5, [
            [(n) => n === 10, () => 'Exactly ten'],
            [(n) => n === 0, () => 'Zero'],
            [(n) => n > 10, (n) => `Greater than 10: ${n}`],
            [(n) => n > 0, (n) => `Positive: ${n}`],
        ]);

        expect(result).toBe('Positive: 5');
    });

    it('should return the correct result for string matching', () => {
        const result = match('hello', [
            [(s) => s === 'world', () => 'Matched world'],
            [(s) => s === 'hello', () => 'Matched hello'],
        ]);

        expect(result).toBe('Matched hello');
    });

    it('should return the correct result for object matching', () => {
        const user = { name: 'Alice', age: 25 };

        const result = match(user, [
            [(u) => u.age > 30, () => 'Older than 30'],
            [(u) => u.age >= 25, () => 'Adult'],
        ]);

        expect(result).toBe('Adult');
    });

    it('should return the correct result for tuple matching', () => {
        const point: [number, number] = [3, 4];

        const result = match(point, [
            [(p) => p[0] === 0 && p[1] === 0, () => 'Origin'],
            [(p) => p[0] === 0, () => 'On Y-axis'],
            [(p) => p[1] === 0, () => 'On X-axis'],
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            [(_) => true, () => 'Somewhere else'],
        ]);

        expect(result).toBe('Somewhere else');
    });

    it('should throw an error if no match is found', () => {
        expect(() =>
            match(100, [
                [(n) => n === 10, () => 'Exactly ten'],
                [(n) => n === 0, () => 'Zero'],
            ]),
        ).toThrowError('No match found');
    });
});
