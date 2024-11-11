/**
 * Merges two sorted arrays into a single sorted array.
 * - Assumes both input arrays are sorted according to `compareFn`.
 * - Combines elements from both arrays in sorted order.
 *
 * @template T - The type of elements in the arrays.
 * @param {T[]} left - The first sorted array.
 * @param {T[]} right - The second sorted array.
 * @param {(a: T, b: T) => number} compareFn - A comparison function that defines the sorting order.
 *     Should return a positive number if `a > b`, 0 if `a === b`, and a negative number if `a < b`.
 * @returns {T[]} The merged sorted array.
 *
 * @example
 * // Merging two sorted arrays of numbers
 * const left = [1, 3, 5];
 * const right = [2, 4, 6];
 * const merged = merge(left, right, (a, b) => a - b);
 * console.log(merged); // [1, 2, 3, 4, 5, 6]
 *
 * @example
 * // Merging two sorted arrays of strings
 * const left = ['apple', 'orange'];
 * const right = ['banana', 'peach'];
 * const merged = merge(left, right, (a, b) => a.localeCompare(b));
 * console.log(merged); // ['apple', 'banana', 'orange', 'peach']
 */
function merge<T>(left: T[], right: T[], compareFn: (a: T, b: T) => number): T[] {
    const result: T[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
        if (compareFn(left[i], right[j]) <= 0) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }

    return [...result, ...left.slice(i), ...right.slice(j)];
}

/**
 * Sorts an array using the Merge Sort algorithm.
 * - Recursively divides the array into halves, sorts each half, and merges them.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} arr - The array to be sorted.
 * @param {(a: T, b: T) => number} compareFn - A comparison function that defines the sorting order.
 *     Should return a positive number if `a > b`, 0 if `a === b`, and a negative number if `a < b`.
 * @returns {T[]} The sorted array.
 *
 * @example
 * // Sorting an array of numbers
 * const arr = [3, 1, 4, 1, 5];
 * const sortedArr = mergeSort(arr, (a, b) => a - b);
 * console.log(sortedArr); // [1, 1, 3, 4, 5]
 *
 * @example
 * // Sorting an array of strings
 * const arr = ['banana', 'apple', 'cherry'];
 * const sortedArr = mergeSort(arr, (a, b) => a.localeCompare(b));
 * console.log(sortedArr); // ['apple', 'banana', 'cherry']
 */
export function mergeSort<T>(arr: T[], compareFn: (a: T, b: T) => number): T[] {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid), compareFn);
    const right = mergeSort(arr.slice(mid), compareFn);

    return merge(left, right, compareFn);
}
