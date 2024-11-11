import { timSort } from '../sort/TimSort.ts';

/**
 * Configuration options for the ternary search algorithm.
 *
 * @template T - The type of elements in the array.
 */
interface TernarySearchConfig<T> {
    /**
     * Custom comparison function to define the sorting order.
     * Should return 0 if `a` and `b` are considered equal, a negative number if `a < b`,
     * and a positive number if `a > b`.
     *
     * @param {T} a - The first element to compare.
     * @param {T} b - The second element to compare.
     * @returns {number} Comparison result.
     */
    compareFn: (a: T, b: T) => number;

    /**
     * Indicates whether the array is already sorted.
     * If `false`, the array will be sorted using TimSort before performing the search.
     *
     * @default false
     */
    isSorted?: boolean;
}

/**
 * Performs a ternary search on an array with a custom comparison function.
 *
 * - Ternary search divides the array into three segments for efficient searching.
 * - If `isSorted` is `false`, the array will first be sorted using TimSort.
 * - The search operates recursively, refining the search range into thirds.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} data - The array in which to search for the target.
 * @param {T} target - The target element to find within the array.
 * @param {number} [left=0] - The left index of the current search range.
 * @param {number} [right=data.length - 1] - The right index of the current search range.
 * @param {TernarySearchConfig<T>} config - Configuration object containing:
 *    - `compareFn`: Comparison function defining the element order.
 *    - `isSorted`: Whether the data array is pre-sorted (defaults to `false`).
 * @returns {number} The index of the target in the array, or -1 if the target is not found.
 *
 * @example
 * // Using ternary search on a numeric array
 * const data = [3, 5, 7, 9, 11];
 * const config = { compareFn: (a, b) => a - b, isSorted: true };
 * const index = ternarySearch(data, 9, 0, data.length - 1, config);
 * // index would be 3
 *
 * @example
 * // Using ternary search on an unsorted string array
 * const data = ['banana', 'apple', 'cherry'];
 * const config = { compareFn: (a, b) => a.localeCompare(b), isSorted: false };
 * const index = ternarySearch(data, 'apple', 0, data.length - 1, config);
 * // index would be 0 after sorting
 */
// eslint-disable-next-line max-params
export function ternarySearch<T>(
    data: T[],
    target: T,
    left: number = 0,
    right: number = data.length - 1,
    config: TernarySearchConfig<T>,
): number {
    const { compareFn, isSorted = false } = config;

    // Sort the array if it is not sorted
    const sortedData = isSorted ? data : timSort([...data], compareFn); // Avoid mutating the original array

    // Search for the target
    if (right >= left) {
        const mid1 = left + Math.floor((right - left) / 3);
        const mid2 = right - Math.floor((right - left) / 3);

        if (compareFn(sortedData[mid1], target) === 0) return mid1; // Target found
        if (compareFn(sortedData[mid2], target) === 0) return mid2; // Target found

        if (compareFn(target, sortedData[mid1]) < 0) {
            return ternarySearch(sortedData, target, left, mid1 - 1, config); // Search in the left third
        } else if (compareFn(target, sortedData[mid2]) > 0) {
            return ternarySearch(sortedData, target, mid2 + 1, right, config); // Search in the right third
        } else {
            return ternarySearch(sortedData, target, mid1 + 1, mid2 - 1, config); // Search in the middle third
        }
    }

    return -1; // Target not found
}
