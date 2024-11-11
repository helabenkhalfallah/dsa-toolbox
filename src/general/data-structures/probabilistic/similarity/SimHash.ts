/**
 * Class representing a SimHash for similarity detection.
 */
export class SimHash {
    private hash: number;

    /**
     * Creates a SimHash instance.
     */
    constructor() {
        this.hash = 0;
    }

    /**
     * Adds a set of elements to the SimHash, updating the hash value.
     * @param {Set<string>} elements - The set of elements to add.
     */
    add(elements: Set<string>): void {
        const hashVectors = Array(64).fill(0); // 64-bit hash vector

        elements.forEach((element) => {
            const hashValue = this.computeHash(element);
            for (let i = 0; i < 64; i++) {
                hashVectors[i] += hashValue & (1 << i) ? 1 : -1;
            }
        });

        this.hash = this.calculateHashFromVector(hashVectors);
    }

    /**
     * Computes a simple hash value for a given element using polynomial hashing.
     * @param {string} element - The element to hash.
     * @returns {number} The hash value.
     */
    private computeHash(element: string): number {
        let hash = 0;
        for (const char of element) {
            hash = Math.imul(hash, 31) + char.charCodeAt(0);
            hash |= 0; // Convert to 32-bit integer
        }
        return hash >>> 0; // Return as an unsigned 32-bit integer
    }

    /**
     * Calculates the final 64-bit SimHash from the weighted hash vector.
     * @param {number[]} hashVectors - Array representing weighted positions in the hash.
     * @returns {number} The final SimHash value.
     */
    private calculateHashFromVector(hashVectors: number[]): number {
        return hashVectors.reduce((acc, weight, i) => acc | ((weight > 0 ? 1 : 0) << i), 0);
    }

    /**
     * Computes the Hamming distance between this SimHash and another.
     * @param {SimHash} other - The other SimHash instance.
     * @returns {number} The Hamming distance.
     */
    hammingDistance(other: SimHash): number {
        return this.countBits(this.hash ^ other.hash);
    }

    /**
     * Counts the number of bits set to 1 in a number (Hamming weight).
     * @param {number} value - The value to count bits in.
     * @returns {number} The count of bits set to 1.
     */
    private countBits(value: number): number {
        let count = 0;
        while (value) {
            value &= value - 1; // Clears the least significant bit set
            count++;
        }
        return count;
    }

    /**
     * Retrieves the computed hash value.
     * @returns {number} The computed hash value.
     */
    getHash(): number {
        return this.hash;
    }
}
