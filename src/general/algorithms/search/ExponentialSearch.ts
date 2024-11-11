import { timSort } from '../sort/TimSort.ts';
import { binarySearch } from './BinarySearch.ts';

/**
 * Configuration options for the exponential search algorithm.
 *
 * @template T - The type of elements in the array.
 */
interface ExponentialSearchConfig<T> {
    /**
     * Custom comparison function that defines the sorting order.
     * Should return a negative number if `a < b`, zero if `a === b`,
     * or a positive number if `a > b`.
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
 * Performs an exponential search on an array using a custom comparison function.
 *
 * - If `isSorted` is `false`, the array will first be sorted using TimSort.
 * - Uses exponential search to quickly narrow down the range, followed by binary search
 *   within the identified range.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} data - The array in which to search for the target.
 * @param {T} target - The element to search for within the array.
 * @param {ExponentialSearchConfig<T>} config - Configuration object containing:
 *    - `compareFn`: Comparison function defining the element order.
 *    - `isSorted`: Whether the array is pre-sorted (defaults to `false`).
 * @returns {number} The index of the target in the array, or -1 if not found.
 *
 * @example
 * // Basic usage with an array of numbers
 * const data = [5, 2, 9, 1];
 * const config = { compareFn: (a, b) => a - b, isSorted: false };
 * const index = exponentialSearch(data, 9, config);
 * // index would be 3 after sorting
 *
 * @example
 * // Usage with strings in alphabetical order
 * const data = ['apple', 'banana', 'cherry'];
 * const config = { compareFn: (a, b) => a.localeCompare(b), isSorted: true };
 * const index = exponentialSearch(data, 'banana', config);
 * // index would be 1
 */
export function exponentialSearch<T>(
    data: T[],
    target: T,
    config: ExponentialSearchConfig<T>,
): number {
    const { compareFn, isSorted = false } = config;

    // Sort the array if it is not sorted
    const sortedData = isSorted ? data : timSort([...data], compareFn);

    // Check the first element
    if (compareFn(sortedData[0], target) === 0) return 0;

    let i = 1;
    while (i < sortedData.length && compareFn(sortedData[i], target) <= 0) {
        i *= 2; // Exponentially increase the range
    }

    // Perform binary search on the found range
    const slicedData = sortedData.slice(Math.floor(i / 2), Math.min(i, sortedData.length));
    const resultIndex = binarySearch(slicedData, target, { compareFn, isSorted: true });

    // Adjust resultIndex to account for the sliced array offset
    return resultIndex === -1 ? -1 : Math.floor(i / 2) + resultIndex;
}
