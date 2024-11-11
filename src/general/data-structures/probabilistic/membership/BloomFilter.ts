/**
 * Class representing a Bloom Filter data structure.
 */
export class BloomFilter {
    private readonly bitArray: Uint8Array; // Array of bits for the filter
    private readonly size: number; // Size of the bit array
    private readonly hashCount: number; // Number of hash functions

    /**
     * Creates an instance of BloomFilter.
     * @param {number} size - The size of the bit array.
     * @param {number} hashCount - The number of hash functions to use.
     */
    constructor(size: number, hashCount: number) {
        this.size = size;
        this.hashCount = hashCount;
        this.bitArray = new Uint8Array(Math.ceil(size / 8)); // Initialize the bit array
    }

    /**
     * Adds an item to the Bloom Filter.
     * @param {string} item - The item to add.
     */
    add(item: string): void {
        for (const index of this.getHashIndices(item)) {
            this.setBit(index);
        }
    }

    /**
     * Checks if an item is possibly in the Bloom Filter.
     * @param {string} item - The item to check.
     * @returns {boolean} True if the item is possibly in the filter, false if definitely not.
     */
    mightContain(item: string): boolean {
        for (const index of this.getHashIndices(item)) {
            if (!this.getBit(index)) return false;
        }
        return true;
    }

    /**
     * Sets a bit in the bit array.
     * @param {number} index - The index of the bit to set.
     */
    private setBit(index: number): void {
        this.bitArray[index >> 3] |= 1 << (index & 7); // Optimized bitwise division and modulus
    }

    /**
     * Gets the value of a bit in the bit array.
     * @param {number} index - The index of the bit to get.
     * @returns {boolean} True if the bit is set, false otherwise.
     */
    private getBit(index: number): boolean {
        return (this.bitArray[index >> 3] & (1 << (index & 7))) !== 0;
    }

    /**
     * Generates hash indices for a given item.
     * @param {string} item - The item to hash.
     * @returns {number[]} An array of hash indices.
     */
    private getHashIndices(item: string): number[] {
        return Array.from({ length: this.hashCount }, (_, i) => this.hash(item, i) % this.size);
    }

    /**
     * A hash function with a seed for creating multiple hashes.
     * @param {string} item - The item to hash.
     * @param {number} seed - Seed to vary the hash function.
     * @returns {number} The hash value.
     */
    private hash(item: string, seed: number): number {
        let hash = seed;
        for (const char of item) {
            hash = Math.imul(hash ^ char.charCodeAt(0), 0x5bd1e995);
            hash ^= hash >>> 13;
        }
        return hash >>> 0; // Convert to unsigned 32-bit integer
    }
}
