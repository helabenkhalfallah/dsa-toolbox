/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { CanApply } from './CanApply.ts';

describe('CanApply (Property-based Tests)', () => {
    it('should satisfy identity law', () => {
        fc.assert(
            fc.property(fc.anything(), (x) => {
                const identity = (v: unknown) => v;
                expect(CanApply(x).map(identity).getValue()).toStrictEqual(CanApply(x).getValue());
            }),
        );
    });

    it('should satisfy composition law', () => {
        fc.assert(
            fc.property(fc.integer(), (x) => {
                const f = (n: number) => n * 2;
                const g = (n: number) => n + 10;

                const left = CanApply(x).map(f).map(g).getValue();
                const right = CanApply(x)
                    .map((y) => g(f(y)))
                    .getValue();

                expect(left).toStrictEqual(right);
            }),
        );
    });

    it('should not throw errors on invalid operations', () => {
        fc.assert(
            fc.property(fc.anything(), (x) => {
                const result = CanApply(x)
                    .map((y) => {
                        if (typeof y === 'number') return (y as any).nonExistentMethod();
                        if (typeof y === 'object') return (y as any).invalidAccess;
                        return y;
                    })
                    .getValue();

                if (
                    x === null ||
                    x === undefined ||
                    (typeof x === 'number' && !(x as any).nonExistentMethod) || // Error case
                    (typeof x === 'object' && (x as any).invalidAccess === undefined) // Error case
                ) {
                    expect(result).toBe(null);
                } else {
                    expect(result).toStrictEqual(x);
                }
            }),
        );
    });

    it('should preserve type transformations', () => {
        fc.assert(
            fc.property(fc.integer(), (x) => {
                const result = CanApply(x)
                    .map((n) => n.toString()) // Convert number to string
                    .map((s) => s + '!') // Append exclamation
                    .getValue();

                expect(typeof result).toBe('string');
                expect(result).toStrictEqual(`${x}!`);
            }),
        );
    });

    it('should correctly apply functions only when valid', () => {
        fc.assert(
            fc.property(fc.oneof(fc.integer(), fc.string(), fc.boolean()), (x) => {
                const result = CanApply(x)
                    .map((y) => (typeof y === 'number' ? y * 2 : y)) // Multiply only numbers
                    .getValue();

                if (typeof x === 'number') {
                    expect(result).toStrictEqual(x * 2);
                } else {
                    expect(result).toStrictEqual(x); // Other types remain unchanged
                }
            }),
        );
    });
});
