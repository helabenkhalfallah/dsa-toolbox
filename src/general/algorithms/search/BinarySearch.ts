import { timSort } from '../sort/TimSort.ts';

/**
 * Configuration options for the binary search algorithm.
 *
 * @template T - The type of elements in the array.
 */
interface BinarySearchConfig<T> {
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
     * If false, the array will be sorted using TimSort before performing the search.
     *
     * @default false
     */
    isSorted?: boolean;
}

/**
 * Performs a binary search on an array with a custom comparison function.
 *
 * - If `isSorted` is `false`, the array will be sorted using TimSort.
 * - Assumes that the array (or sorted copy) contains comparable elements
 *   as per the specified `compareFn`.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} data - The array in which to search for the target.
 * @param {T} target - The element to search for within the array.
 * @param {BinarySearchConfig<T>} config - Configuration object, which includes:
 *    - `compareFn`: A comparison function to determine the order.
 *    - `isSorted`: Whether the array is pre-sorted (defaults to `false`).
 * @returns {number} The index of the target in the array, or -1 if not found.
 *
 * @example
 * // Basic usage with an array of numbers
 * const data = [4, 2, 7, 1];
 * const config = { compareFn: (a, b) => a - b, isSorted: false };
 * const index = binarySearch(data, 7, config);
 * // index would be 3 after sorting
 *
 * @example
 * // Usage with strings in alphabetical order
 * const data = ['apple', 'banana', 'cherry'];
 * const config = { compareFn: (a, b) => a.localeCompare(b), isSorted: true };
 * const index = binarySearch(data, 'banana', config);
 * // index would be 1
 */
export function binarySearch<T>(data: T[], target: T, config: BinarySearchConfig<T>): number {
    const { compareFn, isSorted = false } = config;

    // Step 1: Sort the array if it is not sorted
    const sortedData = isSorted ? data : timSort([...data], compareFn); // Use spread operator to avoid mutating original data

    // Step 2: Perform binary search
    let left = 0;
    let right = sortedData.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const comparison = compareFn(sortedData[mid], target);

        if (comparison === 0) {
            return mid; // Target found
        } else if (comparison < 0) {
            left = mid + 1; // Search in the right half
        } else {
            right = mid - 1; // Search in the left half
        }
    }

    return -1; // Target not found
}
