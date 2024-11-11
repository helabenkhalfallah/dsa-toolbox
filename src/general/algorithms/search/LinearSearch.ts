/**
 * Performs a linear search on the data array.
 *
 * - Iterates through the array and returns the index of the first occurrence of `target`.
 * - Uses a custom comparison function to determine equality.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} data - The array in which to search for the target.
 * @param {T} target - The target value to find within the array.
 * @param {(a: T, b: T) => number} compareFn - A comparison function that compares two elements.
 *     Should return 0 if `a` and `b` are considered equal, a negative number if `a < b`,
 *     and a positive number if `a > b`.
 * @returns {number} The index of the target in the array, or -1 if the target is not found.
 *
 * @example
 * // Basic usage with an array of numbers
 * const data = [10, 20, 30, 40];
 * const index = linearSearch(data, 30, (a, b) => a - b);
 * // index would be 2
 *
 * @example
 * // Usage with an array of strings
 * const data = ['apple', 'banana', 'cherry'];
 * const index = linearSearch(data, 'banana', (a, b) => a.localeCompare(b));
 * // index would be 1
 */
export function linearSearch<T>(data: T[], target: T, compareFn: (a: T, b: T) => number): number {
    for (let i = 0; i < data.length; i++) {
        if (compareFn(data[i], target) === 0) return i;
    }
    return -1;
}
