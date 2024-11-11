interface HybridTimSortConfig {
    minGallop?: number; // Minimum galloping threshold; default is 5.
    minRunLength?: number; // Minimum run length for large data segments.
}

/**
 * Computes an adaptive minimum run length for the TimSort algorithm based on the array size.
 * A smaller run length is used for large arrays to improve performance.
 *
 * @param {number} n - The size of the array.
 * @returns {number} The calculated minimum run length.
 */
function computeAdaptiveMinRunLength(n: number): number {
    let r = 0;
    while (n >= 64) {
        r |= n & 1;
        n >>= 1;
    }
    return n + r;
}

/**
 * Detects a run within the array and automatically reverses it if found to be in descending order.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} arr - The array to be sorted.
 * @param {number} low - The starting index for run detection.
 * @param {number} high - The end index for detection.
 * @param {(a: T, b: T) => number} compareFn - Function to compare elements.
 * @returns {number} The length of the detected run.
 */
// eslint-disable-next-line max-params
function detectRun<T>(
    arr: T[],
    low: number,
    high: number,
    compareFn: (a: T, b: T) => number,
): number {
    if (low >= high - 1) return 1;

    let runLength = 2;
    const isAscending = compareFn(arr[low], arr[low + 1]) <= 0;
    for (let i = low + 2; i < high; ++i) {
        const order = compareFn(arr[i - 1], arr[i]);
        if ((isAscending && order > 0) || (!isAscending && order < 0)) break;
        runLength++;
    }
    if (!isAscending) reverseRange(arr, low, low + runLength);
    return runLength;
}

/**
 * Sorts a portion of the array using binary insertion sort, ideal for smaller segments.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} arr - The array to be sorted.
 * @param {number} low - Starting index of the section.
 * @param {number} start - Starting point for insertion.
 * @param {number} high - Ending index.
 * @param {(a: T, b: T) => number} compareFn - Comparison function.
 */
// eslint-disable-next-line max-params
function binaryInsertionSort<T>(
    arr: T[],
    low: number,
    start: number,
    high: number,
    compareFn: (a: T, b: T) => number,
): void {
    for (let i = start; i < high; i++) {
        const temp = arr[i];
        let left = low,
            right = i;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (compareFn(temp, arr[mid]) < 0) right = mid;
            else left = mid + 1;
        }
        for (let j = i; j > left; j--) arr[j] = arr[j - 1];
        arr[left] = temp;
    }
}

/**
 * Reverses a specified portion of the array in place.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} arr - The array containing the section to reverse.
 * @param {number} start - The starting index of the section.
 * @param {number} end - The ending index of the section (exclusive).
 */
function reverseRange<T>(arr: T[], start: number, end: number): void {
    let left = start,
        right = end - 1;
    while (left < right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++;
        right--;
    }
}

/**
 * Manages and merges pending runs in the array to maintain TimSort invariants.
 *
 * @template T - The type of elements in the array.
 * @param {Array<{ base: number; length: number }>} pendingRuns - Stack of pending runs.
 * @param {T[]} arr - The array to be sorted.
 * @param {number} minGallop - Minimum threshold for galloping.
 * @param {(a: T, b: T) => number} compareFn - Comparison function.
 */
// eslint-disable-next-line max-params
function managePendingRuns<T>(
    pendingRuns: { base: number; length: number }[],
    arr: T[],
    minGallop: number,
    compareFn: (a: T, b: T) => number,
): void {
    while (pendingRuns.length > 1) {
        const n = pendingRuns.length - 2;
        if (
            (n > 0 && pendingRuns[n - 1].length <= pendingRuns[n + 1].length) ||
            pendingRuns[n].length <= pendingRuns[n + 1].length
        ) {
            if (n > 0 && pendingRuns[n - 1].length < pendingRuns[n + 1].length)
                mergeAt(pendingRuns, arr, n - 1, minGallop, compareFn);
            else mergeAt(pendingRuns, arr, n, minGallop, compareFn);
        } else if (n > 0 && pendingRuns[n - 1].length <= pendingRuns[n].length) {
            mergeAt(pendingRuns, arr, n - 1, minGallop, compareFn);
        } else break;
    }
}

/**
 * Merges two adjacent runs in the array.
 *
 * @template T - The type of elements in the array.
 * @param {Array<{ base: number; length: number }>} pendingRuns - Stack of pending runs.
 * @param {T[]} arr - The array to be sorted.
 * @param {number} i - The index of the first run in the pending stack.
 * @param {number} minGallop - Minimum galloping threshold.
 * @param {(a: T, b: T) => number} compareFn - Comparison function.
 */
// eslint-disable-next-line max-params
function mergeAt<T>(
    pendingRuns: { base: number; length: number }[],
    arr: T[],
    i: number,
    minGallop: number,
    compareFn: (a: T, b: T) => number,
): void {
    const baseA = pendingRuns[i].base,
        lengthA = pendingRuns[i].length;
    const baseB = pendingRuns[i + 1].base,
        lengthB = pendingRuns[i + 1].length;
    pendingRuns[i].length = lengthA + lengthB;
    if (i === pendingRuns.length - 3) pendingRuns[i + 1] = pendingRuns[i + 2];
    pendingRuns.pop();

    const temp = arr.slice(baseA, baseA + lengthA);
    let cursorA = 0,
        cursorB = baseB,
        dest = baseA;

    while (cursorA < lengthA && cursorB < baseB + lengthB) {
        arr[dest++] =
            compareFn(temp[cursorA], arr[cursorB]) <= 0 ? temp[cursorA++] : arr[cursorB++];
    }
    while (cursorA < lengthA) arr[dest++] = temp[cursorA++];
}

/**
 * Fully merges remaining runs in the pending stack to produce a completely sorted array.
 *
 * @template T - The type of elements in the array.
 * @param {Array<{ base: number; length: number }>} pendingRuns - Stack of pending runs.
 * @param {T[]} arr - The array to be sorted.
 * @param {number} minGallop - Minimum galloping threshold.
 * @param {(a: T, b: T) => number} compareFn - Comparison function.
 */
// eslint-disable-next-line max-params
function collapsePendingRuns<T>(
    pendingRuns: { base: number; length: number }[],
    arr: T[],
    minGallop: number,
    compareFn: (a: T, b: T) => number,
): void {
    while (pendingRuns.length > 1) {
        mergeAt(pendingRuns, arr, pendingRuns.length - 2, minGallop, compareFn);
    }
}

/**
 * Sorts an array using the Hybrid TimSort algorithm with adaptive run detection and memory optimization.
 * - Utilizes a combination of merge sort and insertion sort.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} arr - The array to be sorted.
 * @param {(a: T, b: T) => number} compareFn - Comparison function to determine sort order.
 * @param {HybridTimSortConfig} [config] - Configuration options, such as `minGallop` and `minRunLength`.
 * @returns {T[]} The sorted array.
 *
 * @example
 * // Sorting an array of numbers
 * const arr = [3, 1, 4, 1, 5];
 * const sortedArr = timSort(arr, (a, b) => a - b);
 * console.log(sortedArr); // [1, 1, 3, 4, 5]
 *
 * @example
 * // Sorting an array of strings
 * const arr = ['banana', 'apple', 'cherry'];
 * const sortedArr = timSort(arr, (a, b) => a.localeCompare(b));
 * console.log(sortedArr); // ['apple', 'banana', 'cherry']
 */
export function timSort<T>(
    arr: T[],
    compareFn: (a: T, b: T) => number,
    config: HybridTimSortConfig = {},
): T[] {
    const minGallop = config.minGallop ?? 5;
    const minRunLength = config.minRunLength ?? computeAdaptiveMinRunLength(arr.length);

    const pendingRuns: { base: number; length: number }[] = [];
    let remaining = arr.length;
    let low = 0;

    while (remaining > 0) {
        let runLength = detectRun(arr, low, low + remaining, compareFn);
        if (runLength < minRunLength) {
            const forcedRunLength = Math.min(minRunLength, remaining);
            binaryInsertionSort(arr, low, low + runLength, low + forcedRunLength, compareFn);
            runLength = forcedRunLength;
        }

        pendingRuns.push({ base: low, length: runLength });
        managePendingRuns(pendingRuns, arr, minGallop, compareFn);

        low += runLength;
        remaining -= runLength;
    }

    collapsePendingRuns(pendingRuns, arr, minGallop, compareFn);

    return arr;
}
