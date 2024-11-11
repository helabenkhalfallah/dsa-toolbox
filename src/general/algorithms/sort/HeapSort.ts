/**
 * Recursively heapifies a subtree rooted at the specified index in an array.
 * - Ensures the subtree satisfies the heap property, where the root is larger (or smaller for a min-heap)
 *   than its children.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} arr - The array representing the heap.
 * @param {number} n - The total size of the heap.
 * @param {number} i - The index of the root element in the current subtree.
 * @param {(a: T, b: T) => number} compareFn - A comparison function that defines the heap order.
 *     Should return a positive number if `a > b`, 0 if `a === b`, and a negative number if `a < b`.
 *
 * @example
 * // Internal usage in heapSort
 * const arr = [3, 9, 2, 1, 4, 5];
 * const compareFn = (a, b) => a - b;
 * heapify(arr, arr.length, 0, compareFn);
 * // Result may vary based on the array state but ensures heap property at index 0
 */
// eslint-disable-next-line max-params
function heapify<T>(arr: T[], n: number, i: number, compareFn: (a: T, b: T) => number): void {
    let largest = i; // Initialize largest as root
    const left = 2 * i + 1; // left = 2*i + 1
    const right = 2 * i + 2; // right = 2*i + 2

    // If left child is larger than root
    if (left < n && compareFn(arr[left], arr[largest]) > 0) {
        largest = left;
    }

    // If right child is larger than largest so far
    if (right < n && compareFn(arr[right], arr[largest]) > 0) {
        largest = right;
    }

    // If largest is not root
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]]; // Swap

        // Recursively heapify the affected subtree
        heapify(arr, n, largest, compareFn);
    }
}

/**
 * Sorts an array using the HeapSort algorithm.
 *
 * - Converts the array into a max-heap or min-heap based on the `compareFn`.
 * - Repeatedly extracts the root of the heap to produce a sorted array.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} arr - The array to be sorted.
 * @param {(a: T, b: T) => number} compareFn - A comparison function that defines the sort order.
 *     Should return a positive number if `a > b`, 0 if `a === b`, and a negative number if `a < b`.
 * @returns {T[]} The sorted array, in-place.
 *
 * @example
 * // Basic usage with numbers
 * const arr = [3, 9, 2, 1, 4, 5];
 * const sortedArr = heapSort(arr, (a, b) => a - b);
 * console.log(sortedArr); // [1, 2, 3, 4, 5, 9]
 *
 * @example
 * // Usage with strings
 * const arr = ['banana', 'apple', 'cherry'];
 * const sortedArr = heapSort(arr, (a, b) => a.localeCompare(b));
 * console.log(sortedArr); // ['apple', 'banana', 'cherry']
 */
export function heapSort<T>(arr: T[], compareFn: (a: T, b: T) => number): T[] {
    const n = arr.length;

    // Build heap (rearrange the array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i, compareFn);
    }

    // One by one extract elements from the heap
    for (let i = n - 1; i > 0; i--) {
        // Move current root to end
        [arr[0], arr[i]] = [arr[i], arr[0]]; // Swap

        // Call max heapify on the reduced heap
        heapify(arr, i, 0, compareFn);
    }

    return arr;
}
