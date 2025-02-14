/**
 * Composes multiple functions from right to left.
 *
 * @template T - The type of input and output for all functions.
 * @param {...Array<(arg: T) => T>} fns - The functions to compose.
 * @returns {(arg: T) => T} - A function that applies the composed functions from right to left.
 *
 * @example
 * const trim = (s: string): string => s.trim();
 * const toUpperCase = (s: string): string => s.toUpperCase();
 * const exclaim = (s: string): string => `${s}!`;
 *
 * const composedFn = compose(exclaim, toUpperCase, trim);
 * console.log(composedFn("  hello  ")); // "HELLO!"
 */
export function compose<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
    if (fns.some((fn) => typeof fn !== 'function')) {
        throw new Error('All arguments to compose must be functions.');
    }
    return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);
}

/**
 * Pipes multiple functions from left to right.
 *
 * @template T - The type of input and output for all functions.
 * @param {...Array<(arg: T) => T>} fns - The functions to apply sequentially.
 * @returns {(arg: T) => T} - A function that applies the piped functions from left to right.
 *
 * @example
 * const trim = (s: string): string => s.trim();
 * const toUpperCase = (s: string): string => s.toUpperCase();
 * const exclaim = (s: string): string => `${s}!`;
 *
 * const pipedFn = pipe(trim, toUpperCase, exclaim);
 * console.log(pipedFn("  hello  ")); // "HELLO!"
 */
export function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
    return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg);
}
