/**
 * A HyperLogLog implementation in TypeScript for estimating the cardinality of a set.
 *
 * HyperLogLog is a probabilistic data structure used to estimate the number of
 * distinct elements in a multiset using a small, fixed amount of memory.
 *
 * This enhanced version includes options for merging HLLs, configuring accuracy,
 * and optimized zero-count and hash functions.
 *
 * @see https://en.wikipedia.org/wiki/HyperLogLog
 * @template T - The type of elements to be added to the set.
 */
export class HyperLogLog<T> {
    private readonly m: number;
    private readonly M: number[];
    private readonly alphaMM: number;

    /**
     * Creates a new HyperLogLog instance.
     *
     * @param {number} [p=4] - The log2(m) parameter, where m is the number of registers.
     *   Must be an integer between 4 and 30 (inclusive).
     */
    constructor(p = 4) {
        if (!Number.isInteger(p) || p < 4 || p > 30) {
            throw new Error('p must be an integer between 4 and 30 (inclusive)');
        }
        this.m = 1 << p;
        this.M = new Array(this.m).fill(0);
        this.alphaMM = this.computeAlphaMM(this.m);
    }

    /**
     * Adds an element to the HyperLogLog.
     *
     * @param {T} element - The element to add.
     */
    add(element: T): void {
        const hash = this.hash(element);
        const j = Number(hash & BigInt(this.m - 1));
        const w = hash >> BigInt(this.m);
        const rho = this.countLeadingZeros(w) + 1;
        this.M[j] = Math.max(this.M[j], rho);
    }

    /**
     * Estimates the cardinality of the set.
     *
     * @returns {number} The estimated cardinality.
     */
    count(): number {
        const sum = this.M.reduce((acc, r) => acc + 1 / (1 << r), 0);
        let estimate = this.alphaMM / sum;

        // Small range correction
        const zeroCount = this.M.filter((v) => v === 0).length;
        if (zeroCount > 0 && estimate <= (5 / 2) * this.m) {
            estimate = this.m * Math.log(this.m / zeroCount);
        }
        // Large range correction
        else if (estimate > (1 / 30) * Math.pow(2, 32)) {
            estimate = -Math.pow(2, 32) * Math.log(1 - estimate / Math.pow(2, 32));
        }

        return estimate;
    }

    /**
     * Merges another HyperLogLog instance into this instance.
     * Both instances must have the same number of registers.
     *
     * @param {HyperLogLog<T>} other - Another HLL instance to merge.
     */
    merge(other: HyperLogLog<T>): void {
        if (this.m !== other.m) {
            throw new Error('Cannot merge HyperLogLogs with different register counts');
        }
        for (let i = 0; i < this.m; i++) {
            this.M[i] = Math.max(this.M[i], other.M[i]);
        }
    }

    /**
     * Computes the alpha constant for bias correction based on the number of registers.
     *
     * @param {number} m - The number of registers.
     * @returns {number} The alpha constant times m squared.
     * @private
     */
    private computeAlphaMM(m: number): number {
        const alpha =
            m === 16 ? 0.673 : m === 32 ? 0.697 : m === 64 ? 0.709 : 0.7213 / (1 + 1.079 / m);
        return alpha * m * m;
    }

    /**
     * A simple 64-bit hash function based on FNV-1a.
     *
     * @param {T} element - The element to hash.
     * @returns {bigint} The 64-bit hash value.
     * @private
     */
    private hash(element: T): bigint {
        const str = JSON.stringify(element);
        let hash = BigInt('0xcbf29ce484222325');
        const prime = BigInt('0x100000001b3');
        for (let i = 0; i < str.length; i++) {
            hash ^= BigInt(str.charCodeAt(i));
            hash *= prime;
            hash &= BigInt('0xffffffffffffffff'); // Maintain 64-bit range
        }
        return hash;
    }

    /**
     * Counts the number of leading zeros in a 64-bit integer.
     *
     * @param {bigint} x - The 64-bit integer.
     * @returns {number} The number of leading zeros.
     * @private
     */
    private countLeadingZeros(x: bigint): number {
        if (x === 0n) return 64;
        let count = 0;
        for (let i = 63; i >= 0; i--) {
            if ((x >> BigInt(i)) & 1n) break;
            count++;
        }
        return count;
    }
}
