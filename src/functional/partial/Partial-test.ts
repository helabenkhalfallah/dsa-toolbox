import { describe, expect, it } from 'vitest';

import { partial, partialRight } from './Partial.ts';

describe('partial', () => {
    it('should partially apply arguments from the left', () => {
        const multiply = (a: number, b: number, c: number) => a * b * c;
        const multiplyBy2 = partial(multiply, 2);

        expect(multiplyBy2(3, 4)).toBe(24);
        expect(multiplyBy2(5, 6)).toBe(60);
    });

    it('should work with single fixed arguments', () => {
        const greet = (greeting: string, name: string) => `${greeting}, ${name}!`;
        const sayHello = partial(greet, 'Hello');

        expect(sayHello('Alice')).toBe('Hello, Alice!');
        expect(sayHello('Bob')).toBe('Hello, Bob!');
    });

    it('should handle functions with multiple fixed arguments', () => {
        const joinStrings = (a: string, b: string, c: string) => `${a}-${b}-${c}`;
        const joinAB = partial(joinStrings, 'A', 'B');

        expect(joinAB('C')).toBe('A-B-C');
    });

    it('should correctly handle functions with different arities', () => {
        // eslint-disable-next-line max-params
        const add = (a: number, b: number, c: number, d: number) => a + b + c + d;
        const addOneAndTwo = partial(add, 1, 2);

        expect(addOneAndTwo(3, 4)).toBe(10);
        expect(addOneAndTwo(5, 6)).toBe(14);
    });
});

describe('partialRight', () => {
    it('should partially apply arguments from the right', () => {
        const formatDate = (year: number, month: number, day: number) => `${year}-${month}-${day}`;
        const formatThisYear = partialRight(formatDate, 2024);

        expect(formatThisYear(5, 12)).toBe('5-12-2024');
    });

    it('should work with single fixed arguments', () => {
        const greet = (name: string, punctuation: string) => `Hello, ${name}${punctuation}`;
        const excitedGreeting = partialRight(greet, '!');

        expect(excitedGreeting('Alice')).toBe('Hello, Alice!');
        expect(excitedGreeting('Bob')).toBe('Hello, Bob!');
    });

    it('should handle functions with multiple fixed arguments', () => {
        const wrapText = (prefix: string, text: string, suffix: string) =>
            `${prefix}${text}${suffix}`;
        const wrapWithStars = partialRight(wrapText, '*', '*');

        expect(wrapWithStars('Hello')).toBe('Hello**');
        expect(wrapWithStars('World')).toBe('World**');
    });
});
