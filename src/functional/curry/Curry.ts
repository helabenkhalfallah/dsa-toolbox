type Curried<T extends unknown[], R> = T extends [infer A, ...infer Rest] // Extract first argument (A) and remaining (Rest)
    ? Rest extends [] // If no remaining args, return (A) => R
        ? (a: A) => R
        : (a: A, ...rest: Partial<Rest>) => Curried<Rest, R> // Allows multiple arguments in each call
    : never;

/**
 * Converts a function that takes multiple arguments into a curried function.
 *
 * @template T - The tuple type of the function's arguments.
 * @template R - The return type of the function.
 * @param {(...args: T) => R} fn - The function to curry.
 * @returns {Curried<T, R>} - A curried version of the function.
 *
 * @example
 * const add = (a: number, b: number, c: number) => a + b + c;
 * const curriedAdd = curry(add);
 * console.log(curriedAdd(1)(2)(3)); // Output: 6
 * console.log(curriedAdd(1, 2)(3)); // Output: 6
 * console.log(curriedAdd(1)(2, 3)); // Output: 6
 * console.log(curriedAdd(1, 2, 3)); // Output: 6
 */
export function curry<T extends unknown[], R>(fn: (...args: T) => R): Curried<T, R> {
    return function curried(...args: unknown[]): unknown {
        if (args.length >= fn.length) {
            return fn(...(args as T)); //  Return the result when all arguments are collected
        }

        return (...nextArgs: unknown[]) => curried(...args, ...nextArgs); //  Partial application
    } as Curried<T, R>;
}

/**
 * Transforms a curried function into a function that accepts all its arguments at once.
 * Works by iteratively applying arguments to the provided curried function.
 *
 * @param fn The curried function to be transformed. Should accept a sequence of functions eventually producing a result.
 * @return A function that takes all the arguments expected by the curried function at once and returns the final result.
 */
export function uncurry<T extends unknown[], R>(
    fn: (...args: unknown[]) => unknown, // Allows TypeScript to infer function structure
): (...args: T) => R {
    return (...args: T) => {
        let result: unknown = fn;
        for (const arg of args) {
            if (typeof result === 'function') {
                result = result(arg);
            } else {
                throw new Error('Unexpected function application in uncurry.');
            }
        }
        return result as R;
    };
}
