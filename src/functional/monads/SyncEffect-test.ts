import { describe, expect, it } from 'vitest';

import { Err, Ok } from './Result.ts';
import { SyncEffect } from './SyncEffect.ts';

describe('SyncEffect', () => {
    it('should execute a successful effect', () => {
        const effect = SyncEffect(() => 42);
        expect(effect.run()).toStrictEqual(new Ok(42));
    });

    it('should catch errors and return Err', () => {
        const effect = SyncEffect(() => {
            throw new Error('Boom!');
        });
        expect(effect.run()).toStrictEqual(new Err(new Error('Boom!')));
    });

    it('should transform the result with map', () => {
        const effect = SyncEffect(() => 10).map((x) => x * 2);
        expect(effect.run()).toStrictEqual(new Ok(20));
    });

    it('should chain effects with flatMap', () => {
        const effect = SyncEffect(() => 5).flatMap((x) => SyncEffect(() => x + 10));
        expect(effect.run()).toStrictEqual(new Ok(15));
    });

    it('should recover from errors with recover', () => {
        const effect = SyncEffect(() => {
            throw new Error('Failure');
        }).recover(() => 0);

        expect(effect.run()).toStrictEqual(new Ok(0)); //  Now TypeScript is happy!
    });

    it('should not modify success values in recover', () => {
        const effect = SyncEffect(() => 42).recover(() => 0);
        expect(effect.run()).toStrictEqual(new Ok(42));
    });

    it('should work with side effects', () => {
        let value = 0;
        const effect = SyncEffect(() => {
            value = 100;
            return value;
        });

        expect(effect.run()).toStrictEqual(new Ok(100));
        expect(value).toBe(100);
    });

    it('should correctly handle empty effect', () => {
        const effect = SyncEffect(() => undefined);
        expect(effect.run()).toStrictEqual(new Ok(undefined));
    });
});
