/**
 * Partially applies arguments to a function, fixing some parameters from the left.
 *
 * @template T - The tuple type of the fixed arguments.
 * @template U - The tuple type of the remaining arguments.
 * @template R - The return type of the function.
 * @param {(...args: [...T, ...U]) => R} fn - The function to partially apply.
 * @param {...T} presetArgs - The arguments to fix from the left.
 * @returns {(...remainingArgs: U) => R} - A new function that takes only the remaining arguments.
 *
 * @example
 * const multiply = (a: number, b: number, c: number) => a * b * c;
 * const multiplyBy2 = partial(multiply, 2);
 * console.log(multiplyBy2(3, 4)); // Output: 24
 */
export function partial<T extends unknown[], U extends unknown[], R>(
    fn: (...args: [...T, ...U]) => R,
    ...presetArgs: T
): (...remainingArgs: U) => R {
    return (...remainingArgs: U) => fn(...presetArgs, ...remainingArgs);
}

/**
 * Partially applies arguments to a function, fixing some parameters from the right.
 *
 * @template T - The tuple type of the remaining arguments.
 * @template U - The tuple type of the fixed arguments.
 * @template R - The return type of the function.
 * @param {(...args: [...T, ...U]) => R} fn - The function to partially apply.
 * @param {...U} presetArgs - The arguments to fix from the right.
 * @returns {(...remainingArgs: T) => R} - A new function that takes only the remaining arguments.
 *
 * @example
 * const formatDate = (year: number, month: number, day: number) => `${year}-${month}-${day}`;
 * const formatThisYear = partialRight(formatDate, 2024);
 * console.log(formatThisYear(5, 12)); // Output: "5-12-2024"
 */
export function partialRight<T extends unknown[], U extends unknown[], R>(
    fn: (...args: [...T, ...U]) => R,
    ...presetArgs: U
): (...remainingArgs: T) => R {
    return (...remainingArgs: T) => fn(...remainingArgs, ...presetArgs);
}
