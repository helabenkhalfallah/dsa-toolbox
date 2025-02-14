import { describe, expect, it } from 'vitest';

import { Err, Ok, Result } from './Result.ts';

describe('Result', () => {
    describe('Ok', () => {
        it('should be identified as Ok', () => {
            const result = new Ok(42);
            expect(result.isOk()).toBe(true);
            expect(result.isErr()).toBe(false);
        });

        it('should map the value correctly', () => {
            const result = new Ok(5).map((x) => x * 2);
            expect(result.unwrapOr(-1)).toBe(10);
        });

        it('should flatMap correctly', () => {
            const result = new Ok(3).flatMap((x) => new Ok(x + 1));
            expect(result.unwrapOr(-1)).toBe(4);
        });

        it('should return the contained value with unwrapOr', () => {
            const result = new Ok(7);
            expect(result.unwrapOr(0)).toBe(7);
        });

        it('should ignore alternative in orElse', () => {
            const result = new Ok(100);
            expect(result.orElse(new Err('Error')).unwrapOr(-1)).toBe(100);
        });

        it('should not modify on mapError', () => {
            const result = new Ok(200).mapError(() => 'new error');
            expect(result.unwrapOr(-1)).toBe(200);
        });

        it('should execute fold correctly', () => {
            const result = new Ok('Success').fold(
                () => 'Failure',
                (value) => `Processed: ${value}`,
            );
            expect(result).toBe('Processed: Success');
        });
    });

    describe('Err', () => {
        it('should be identified as Err', () => {
            const result = new Err('Something went wrong');
            expect(result.isOk()).toBe(false);
            expect(result.isErr()).toBe(true);
        });

        it('should return default value on unwrapOr', () => {
            const result = new Err('Error');
            expect(result.unwrapOr(99)).toBe(99);
        });

        it('should throw error on unwrapOrThrow', () => {
            const result = new Err('Critical failure');
            expect(() => result.unwrapOrThrow()).toThrowError('Critical failure');
        });

        it('should return alternative on orElse', () => {
            const result = new Err('Error').orElse(new Ok(500));
            expect(result.unwrapOr(-1)).toBe(500);
        });

        it('should map the error correctly', () => {
            const result = new Err('Oops').mapError((err) => `Fixed: ${err}`);
            expect(
                result.fold(
                    (err) => err,
                    () => 'Unexpected',
                ),
            ).toBe('Fixed: Oops');
        });

        it('should return itself on map', () => {
            const result = new Err('Nope').map((x) => (x as number) * 2);
            expect(result.isErr()).toBe(true);
        });

        it('should return itself on flatMap', () => {
            const result = new Err('Still nope').flatMap(() => new Ok(10));
            expect(result.isErr()).toBe(true);
        });

        it('should execute fold correctly', () => {
            const result = new Err('Failure').fold(
                (error) => `Handled: ${error}`,
                () => 'Unexpected',
            );
            expect(result).toBe('Handled: Failure');
        });
    });

    describe('Chaining', () => {
        it('should handle success case in chaining', () => {
            const divide = (a: number, b: number): Result<number, string> =>
                b === 0 ? new Err('Division by zero') : new Ok(a / b);

            const result = divide(10, 2)
                .map((x) => x * 2)
                .flatMap((x) => new Ok(x + 1))
                .unwrapOr(-1);

            expect(result).toBe(11);
        });

        it('should short-circuit on error in chaining', () => {
            const divide = (a: number, b: number): Result<number, string> =>
                b === 0 ? new Err('Division by zero') : new Ok(a / b);

            const result = divide(10, 0)
                .map((x) => x * 2)
                .flatMap((x) => new Ok(x + 1))
                .unwrapOr(-1);

            expect(result).toBe(-1);
        });
    });
});
