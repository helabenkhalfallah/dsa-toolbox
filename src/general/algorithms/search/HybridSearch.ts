import { ComparableNode } from '../../commons/ComparableNode.ts';
import { RedBlackTree } from '../../data-structures/index.ts';
import { timSort } from '../sort/TimSort.ts';
import { binarySearch } from './BinarySearch.ts';
import { linearSearch } from './LinearSearch.ts';

/**
 * Configuration options for the hybrid search algorithm.
 *
 * @template T - The type of elements in the data array.
 */
interface HybridSearchConfig<T> {
    /**
     * Threshold for using linear search.
     * If the data array length is less than this threshold, linear search will be used.
     *
     * @default 100
     */
    linearSearchThreshold?: number;

    /**
     * Threshold for using binary search.
     * If the data array length is greater than or equal to `linearSearchThreshold`
     * but less than this threshold, binary search will be used.
     *
     * @default 10000
     */
    binarySearchThreshold?: number;

    /**
     * Indicates whether the data array is already sorted.
     * If `false`, the array will be sorted using TimSort before binary search.
     *
     * @default false
     */
    isSorted?: boolean;

    /**
     * Custom comparison function to define the sorting order.
     * Should return a negative number if `a < b`, zero if `a === b`, or a positive number if `a > b`.
     *
     * @param {T} a - The first element to compare.
     * @param {T} b - The second element to compare.
     * @returns {number} Comparison result.
     */
    compareFn: (a: T, b: T) => number;
}

/**
 * Hybrid search that adapts to the data length and configuration for optimal performance.
 *
 * - For small datasets (less than `linearSearchThreshold`), linear search is used.
 * - For mid-sized datasets (between `linearSearchThreshold` and `binarySearchThreshold`), binary search is applied.
 * - For large datasets (greater than or equal to `binarySearchThreshold`), a Red-Black Tree is constructed,
 *   and the search is performed within the tree.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} data - The array of data in which to search for the target.
 * @param {T} target - The target element to search for within the data array.
 * @param {HybridSearchConfig<T>} config - Configuration for the hybrid search algorithm, which includes:
 *    - `linearSearchThreshold`: Length threshold for linear search (default: 100).
 *    - `binarySearchThreshold`: Length threshold for binary search (default: 10000).
 *    - `isSorted`: Whether the data array is already sorted (default: false).
 *    - `compareFn`: Comparison function defining the element order.
 * @returns {number | boolean} - The index of the target in the array or -1 if not found (for array searches).
 *                               For Red-Black Tree search, returns `true` if found, `false` if not.
 *
 * @example
 * // Using hybrid search on a small dataset (linear search)
 * const data = [3, 1, 4, 1, 5];
 * const config = { compareFn: (a, b) => a - b };
 * const index = hybridSearch(data, 4, config);
 * // index would be 2
 *
 * @example
 * // Using hybrid search on a large dataset (Red-Black Tree search)
 * const largeData = Array.from({ length: 100000 }, (_, i) => i);
 * const config = { compareFn: (a, b) => a - b, isSorted: true };
 * const found = hybridSearch(largeData, 99999, config);
 * // found would be true
 */
export function hybridSearch<T>(
    data: T[],
    target: T,
    config: HybridSearchConfig<T>,
): number | boolean {
    const {
        linearSearchThreshold = 100,
        binarySearchThreshold = 10000,
        isSorted = false,
        compareFn,
    } = config;

    const length = data.length;

    // Case 1: Use linear search for small datasets
    if (length < linearSearchThreshold) {
        return linearSearch(data, target, compareFn);
    }

    // Case 2: Use binary search for mid-sized datasets
    if (length >= linearSearchThreshold && length < binarySearchThreshold) {
        const sortedData = isSorted ? data : timSort([...data], compareFn); // Avoid mutating the original array
        return binarySearch(sortedData, target, { isSorted: true, compareFn });
    }

    // Case 3: Use Red-Black Tree for large datasets
    if (length >= binarySearchThreshold) {
        const tree = new RedBlackTree<ComparableNode<T>>();
        const wrappedTarget = new ComparableNode(target, compareFn);

        // Insert all items into the Red-Black Tree
        for (const item of data) {
            tree.insert(new ComparableNode(item, compareFn));
        }

        // Perform search on Red-Black Tree
        return tree.search(wrappedTarget);
    }

    return -1; // Target not found
}
