class Centroid {
    mean: number;
    count: number;

    /**
     * Creates a new Centroid instance.
     * @param {number} mean - The mean value of the centroid.
     * @param {number} count - The count of values represented by this centroid.
     */
    constructor(mean: number, count: number) {
        this.mean = mean;
        this.count = count;
    }

    /**
     * Updates the centroid with a new value and weight.
     * @param {number} value - The new value.
     * @param {number} weight - The weight of the new value.
     */
    update(value: number, weight: number): void {
        this.count += weight;
        this.mean += (weight * (value - this.mean)) / this.count;
    }
}

/**
 * Class representing a t-Digest for approximate quantile estimation.
 */
export class TDigest {
    private centroids: Centroid[] = [];
    private totalCount = 0;
    private compression: number;
    private delta: number;

    /**
     * Creates a new TDigest instance.
     * @param {number} [delta=0.01] - The compression parameter affecting quantile accuracy.
     * @param {number} [compression=100] - The maximum number of centroids before compression.
     */
    constructor(delta = 0.01, compression = 100) {
        this.delta = delta;
        this.compression = compression;
    }

    /**
     * Adds a value to the t-Digest.
     * @param {number} value - The value to add.
     * @param {number} [weight=1] - The weight of the value.
     */
    add(value: number, weight = 1): void {
        this.totalCount += weight;

        if (this.centroids.length === 0) {
            this.centroids.push(new Centroid(value, weight));
            return;
        }

        const closestCentroid = this.findClosestCentroid(value);

        if (closestCentroid && closestCentroid.count + weight <= this.threshold(closestCentroid)) {
            closestCentroid.update(value, weight);
        } else {
            this.centroids.push(new Centroid(value, weight));
            this.compress();
        }
    }

    /**
     * Estimates the value at a given quantile.
     * @param {number} q - The quantile to estimate (between 0 and 1).
     * @returns {number} The estimated value at the given quantile.
     */
    quantile(q: number): number {
        if (q < 0 || q > 1) return NaN;
        const rank = q * this.totalCount;
        let cumulativeCount = 0;

        for (const centroid of this.centroids) {
            cumulativeCount += centroid.count;
            if (cumulativeCount >= rank) {
                return centroid.mean;
            }
        }

        return this.centroids[this.centroids.length - 1].mean;
    }

    /**
     * Calculates the cumulative distribution function (CDF) for a given value.
     * @param {number} value - The value to calculate the CDF for.
     * @returns {number} The estimated probability of being less than or equal to the value.
     */
    cdf(value: number): number {
        let cumulativeCount = 0;

        for (const centroid of this.centroids) {
            if (value < centroid.mean) break;
            cumulativeCount += centroid.count;
        }

        return cumulativeCount / this.totalCount;
    }

    /**
     * Finds the closest centroid to a given value.
     * @param {number} value - The value to find the closest centroid for.
     * @returns {Centroid | null} The closest centroid or null if none are found.
     */
    private findClosestCentroid(value: number): Centroid | null {
        let closestCentroid = null;
        let minDistance = Infinity;

        for (const centroid of this.centroids) {
            const distance = Math.abs(centroid.mean - value);
            if (distance < minDistance) {
                minDistance = distance;
                closestCentroid = centroid;
            }
        }

        return closestCentroid;
    }

    /**
     * Computes the threshold for merging centroids based on quantile.
     * @param {Centroid} centroid - The centroid to calculate the threshold for.
     * @returns {number} The threshold value.
     */
    private threshold(centroid: Centroid): number {
        const q = this.computeQuantile(centroid);
        return 4 * this.totalCount * this.delta * q * (1 - q);
    }

    /**
     * Computes the quantile of a given centroid based on its position.
     * @param {Centroid} centroid - The centroid to compute the quantile for.
     * @returns {number} The quantile of the centroid.
     */
    private computeQuantile(centroid: Centroid): number {
        let cumulativeCount = 0;
        for (const c of this.centroids) {
            if (c === centroid) break;
            cumulativeCount += c.count;
        }
        return (cumulativeCount + centroid.count / 2) / this.totalCount;
    }

    /**
     * Compresses the centroids by merging close centroids together.
     */
    private compress(): void {
        if (this.centroids.length <= this.compression) return;

        const newCentroids: Centroid[] = [];
        let current = this.centroids[0];

        for (let i = 1; i < this.centroids.length; i++) {
            const next = this.centroids[i];
            if (current.count + next.count <= this.threshold(current)) {
                current.update(next.mean, next.count);
            } else {
                newCentroids.push(current);
                current = next;
            }
        }
        newCentroids.push(current);
        this.centroids = newCentroids;
    }

    /**
     * Returns the current number of centroids in the t-Digest.
     * @returns {number} The number of centroids.
     */
    getCentroidsCount(): number {
        return this.centroids.length;
    }
}
