/**
 * Trampoline function to optimize tail-recursive functions by converting recursion into iteration.
 * Prevents stack overflow for deeply recursive calls.
 *
 * @template T - The return type of the function.
 * @template Args - The parameter types of the function.
 * @param {(...args: Args) => T | (() => T)} fn - The tail-recursive function that returns either a value or a thunk (function).
 * @returns {(...args: Args) => T} - A new function that safely executes without deep recursion.
 */
export const trampoline = <T, Args extends unknown[]>(
    fn: (...args: Args) => T | (() => T),
): ((...args: Args) => T) => {
    return (...args: Args): T => {
        let result: T | (() => T) = fn(...args);

        while (typeof result === 'function') {
            result = (result as () => T)(); // Explicitly asserting that result is a function before calling it
        }

        return result;
    };
};
