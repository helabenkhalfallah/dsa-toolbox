/**
 * Memorizes a function for primitive arguments using a `Map`.
 *
 * @template Args - The function arguments.
 * @template Result - The function return type.
 * @param {(...args: Args) => Result} fn - The function to memoize.
 * @returns {(...args: Args) => Result} - The memoized function.
 */
export const memoize = <Args extends unknown[], Return>(
    fn: (...args: Args) => Return,
): ((...args: Args) => Return) => {
    const cache = new Map<string, Return>();

    return (...args: Args) => {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key)!;
        }

        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
};
