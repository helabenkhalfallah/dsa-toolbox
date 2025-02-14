import { describe, expect, it } from 'vitest';

import { None, Some } from './Option.ts';

describe('Option<T>', () => {
    describe('Some<T>', () => {
        it('should correctly identify as Some', () => {
            const some = new Some(42);
            expect(some.isSome()).toBe(true);
            expect(some.isNone()).toBe(false);
        });

        it('should correctly map values', () => {
            const some = new Some(10);
            const result = some.map((x) => x * 2);
            expect(result).toBeInstanceOf(Some);
            expect(result.getOrElse(0)).toBe(20);
        });

        it('should correctly flatMap values', () => {
            const some = new Some(10);
            const result = some.flatMap((x) => new Some(x * 2));
            expect(result).toBeInstanceOf(Some);
            expect(result.getOrElse(0)).toBe(20);
        });

        it('should return the contained value with getOrElse', () => {
            const some = new Some('Hello');
            expect(some.getOrElse('Default')).toBe('Hello');
        });

        it('should return itself in orElse', () => {
            const some = new Some(99);
            const alternative = new Some(100);
            expect(some.orElse(alternative)).toBe(some);
        });

        it('should apply fold correctly', () => {
            const some = new Some('Hello');
            const result = some.fold(
                () => 'No value',
                (value) => value.toUpperCase(),
            );
            expect(result).toBe('HELLO');
        });

        it('should correctly filter values', () => {
            const some = new Some(10);
            const filteredSome = some.filter((x) => x > 5);
            expect(filteredSome).toBeInstanceOf(Some);
            expect(filteredSome.getOrElse(0)).toBe(10);

            const filteredNone = some.filter((x) => x < 5);
            expect(filteredNone).toBeInstanceOf(None);
        });
    });

    describe('None', () => {
        it('should correctly identify as None', () => {
            const none = None.instance;
            expect(none.isSome()).toBe(false);
            expect(none.isNone()).toBe(true);
        });

        it('should return None when mapped', () => {
            const none = None.instance.map((x) => x * 2);
            expect(none).toBeInstanceOf(None);
        });

        it('should return None when flatMapped', () => {
            const none = None.instance.flatMap((x) => new Some(x * 2));
            expect(none).toBeInstanceOf(None);
        });

        it('should return default value with getOrElse', () => {
            const none = None.instance;
            expect(none.getOrElse('Default')).toBe('Default');
        });

        it('should return alternative value in orElse', () => {
            const none = None.instance;
            const alternative = new Some(99);
            expect(none.orElse(alternative)).toBe(alternative);
        });

        it('should apply fold correctly', () => {
            const none = None.instance;
            const result = none.fold(
                () => 'No value',
                (value) => (value as string).toUpperCase(),
            );
            expect(result).toBe('No value');
        });

        it('should always return None on filter', () => {
            const none = None.instance;
            const filteredNone = none.filter((x) => x > 5);
            expect(filteredNone).toBeInstanceOf(None);
        });
    });
});
