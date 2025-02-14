import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import {
    composeTransducers,
    filterTransducer,
    mapTransducer,
    takeTransducer,
} from './Transducers.ts';

describe('Transducers', () => {
    it('should satisfy transducer laws (identity, composition)', () => {
        fc.assert(
            fc.property(fc.array(fc.integer()), (numbers) => {
                const identity = <T>(x: T) => x;

                const identityTransducer = composeTransducers(mapTransducer(identity));

                // Identity Law: Mapping with identity function should not change array
                expect(
                    numbers.reduce(
                        identityTransducer((acc, val) => [...acc, val]),
                        [],
                    ),
                ).toEqual(numbers);
            }),
        );
    });

    it('should correctly apply transducers on large randomized data', () => {
        fc.assert(
            fc.property(fc.array(fc.integer({ min: -1000, max: 1000 })), (numbers) => {
                const transducer = composeTransducers(
                    filterTransducer((x) => x % 2 === 0), // Keep evens
                    mapTransducer((x) => x * 2), // Double them
                    takeTransducer(5), // Take first 5
                );

                const result = numbers.reduce(
                    transducer((acc, val) => [...acc, val]),
                    [],
                );

                expect(result.length).toBeLessThanOrEqual(5);
            }),
        );
    });
});
