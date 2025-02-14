/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Functional Transducers for Efficient Data Processing.
 *
 * Transducers allow transformation pipelines (map, filter, etc.) without creating intermediate collections.
 *
 * @module Transducers
 */

/**
 * A Transducer is a higher-order function that takes a reducing function
 * and returns an enhanced reducing function.
 *
 * @template T - The input type.
 * @template U - The output type.
 */
export type Transducer<T, U> = (
    reducer: (acc: U[], value: U) => U[],
) => (acc: U[], value: T) => U[];

/**
 * Creates a transducer that applies a mapping function to each element.
 *
 * @template T - The input type.
 * @template U - The output type after transformation.
 * @param {(x: T) => U} fn - The transformation function.
 * @returns {Transducer<T, U>} - A transducer that applies `fn` to each value.
 */
export const mapTransducer =
    <T, U>(fn: (x: T) => U): Transducer<T, U> =>
    (reducer: (acc: U[], value: U) => U[]) =>
    (acc: U[], value: T): U[] =>
        reducer(acc, fn(value));

/**
 * Creates a transducer that filters values based on a predicate function.
 *
 * @template T - The type of elements.
 * @param {(x: T) => boolean} predicate - Function to determine if a value should be kept.
 * @returns {Transducer<T, T>} - A transducer that filters elements.
 */
export const filterTransducer =
    <T>(predicate: (x: T) => boolean): Transducer<T, T> =>
    (reducer: (acc: T[], value: T) => T[]) =>
    (acc: T[], value: T): T[] =>
        predicate(value) ? reducer(acc, value) : acc;

/**
 * Composes multiple transducers into a single transformation pipeline.
 *
 * @template A - The input type.
 * @template Z - The final output type.
 * @param {...Transducer<A, Z>[]} transducers - The transducers to compose.
 * @returns {Transducer<A, Z>} - A transducer that applies all transformations in sequence.
 */
export const composeTransducers =
    <A, Z>(...transducers: Array<Transducer<any, any>>): Transducer<A, Z> =>
    (reducer: (acc: Z[], value: Z) => Z[]) =>
        transducers.reduceRight(
            (acc, transducer) => transducer(acc),
            reducer as (acc: any[], value: any) => any[],
        );

/**
 * Limits the number of values processed by the transducer.
 *
 * @template T - The type of elements.
 * @param {number} count - The maximum number of elements to process.
 * @returns {Transducer<T, T>} - A transducer that stops after `count` elements.
 */
export const takeTransducer =
    <T>(count: number): Transducer<T, T> =>
    (reducer: (acc: T[], value: T) => T[]) => {
        let taken = 0;
        return (acc: T[], value: T): T[] => (taken++ < count ? reducer(acc, value) : acc);
    };
