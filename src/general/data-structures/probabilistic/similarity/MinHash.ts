/**
 * Class representing a MinHash for estimating Jaccard similarity.
 */
export class MinHash {
    private readonly hashes: number[]; // Array of minimum hash values
    private readonly numHashes: number; // Number of hash functions

    /**
     * Creates a MinHash instance.
     * @param {number} numHashes - The number of hash functions to use.
     */
    constructor(numHashes: number) {
        this.numHashes = numHashes;
        this.hashes = Array(numHashes).fill(Infinity); // Initialize all hash values with Infinity
    }

    /**
     * Adds a set of elements to the MinHash.
     * @param {Set<string>} elements - The set of elements to add.
     */
    add(elements: Set<string>): void {
        elements.forEach((element) => {
            for (let i = 0; i < this.numHashes; i++) {
                const hashValue = this.computeHash(element, i);
                this.hashes[i] = Math.min(this.hashes[i], hashValue); // Update minimum hash
            }
        });
    }

    /**
     * Computes the hash for a given element using a seed for variation.
     * @param {string} element - The element to hash.
     * @param {number} seed - A seed value for the hash function.
     * @returns {number} The hash value.
     */
    private computeHash(element: string, seed: number): number {
        let hash = 0;
        for (const char of element) {
            hash = Math.imul(hash, 31) + char.charCodeAt(0) + seed; // Incorporate seed for unique hash
            hash |= 0; // Convert to 32-bit integer
        }
        return hash >>> 0; // Return an unsigned 32-bit integer
    }

    /**
     * Estimates the Jaccard similarity with another MinHash instance.
     * @param {MinHash} other - The other MinHash instance.
     * @returns {number} The estimated Jaccard similarity, or NaN if hash counts differ.
     */
    jaccardSimilarity(other: MinHash): number {
        if (this.numHashes !== other.numHashes) {
            throw new Error('Both MinHash instances must have the same number of hash functions.');
        }

        let matchCount = 0;
        for (let i = 0; i < this.numHashes; i++) {
            if (this.hashes[i] === other.hashes[i]) {
                matchCount++;
            }
        }
        return matchCount / this.numHashes; // Ratio of matching hashes to total hashes
    }

    /**
     * Returns the current number of unique hash values in the MinHash.
     * @returns {number} The number of unique hash values.
     */
    size(): number {
        return this.hashes.length;
    }
}
