/**
 * Class representing a Count-Min Sketch data structure.
 */
export class CountMinSketch {
    private readonly width: number; // Width of the sketch
    private readonly depth: number; // Depth of the sketch
    private readonly sketch: number[][]; // The sketch matrix
    private readonly hashFunctions: ((key: string) => number)[]; // Hash functions

    /**
     * Creates an instance of CountMinSketch.
     * @param {number} width - The width of the sketch (number of columns).
     * @param {number} depth - The depth of the sketch (number of hash functions).
     */
    constructor(width: number, depth: number) {
        this.width = width;
        this.depth = depth;
        this.sketch = Array.from({ length: depth }, () => Array(width).fill(0));
        this.hashFunctions = this.createHashFunctions(depth);
    }

    /**
     * Increments the count for a given key.
     * @param {string} key - The key to increment.
     */
    add(key: string): void {
        for (let i = 0; i < this.depth; i++) {
            const index = this.hashFunctions[i](key) % this.width;
            this.sketch[i][index]++;
        }
    }

    /**
     * Estimates the count for a given key.
     * @param {string} key - The key to estimate.
     * @returns {number} The estimated count for the key.
     */
    estimate(key: string): number {
        return this.hashFunctions.reduce((minCount, hashFn, i) => {
            const index = hashFn(key) % this.width;
            return Math.min(minCount, this.sketch[i][index]);
        }, Infinity);
    }

    /**
     * Creates hash functions for the Count-Min Sketch.
     * @param {number} depth - The number of hash functions to create.
     * @returns {((key: string) => number)[]} An array of hash functions.
     */
    private createHashFunctions(depth: number): ((key: string) => number)[] {
        return Array.from({ length: depth }, (_, seed) => (key) => this.simpleHash(key, seed));
    }

    /**
     * A simple hash function with seed variance for hash diversity.
     * @param {string} key - The key to hash.
     * @param {number} seed - The seed for the hash function.
     * @returns {number} The hash value.
     */
    private simpleHash(key: string, seed: number): number {
        let hash = seed;
        for (const char of key) {
            hash = Math.imul(hash ^ char.charCodeAt(0), 0x5bd1e995); // Mixes bits for more spread
            hash ^= hash >>> 13;
        }
        return hash >>> 0; // Convert to an unsigned 32-bit integer
    }
}
