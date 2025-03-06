/**
 * **LazyStream:** Handles asynchronous data lazily.
 *
 * This class enables **lazy, on-demand processing** of async data sources,
 * such as paginated API responses or infinite streams.
 *
 * Features:
 * - **Lazy Evaluation**: Data is only processed when requested.
 * - **Functional API**: Supports chaining with `map()`, `filter()`, and `take()`.
 * - **Async Generators**: Works with async data sources seamlessly.
 *
 * @template T - The type of elements processed by the stream.
 */
export class LazyStream<T> {
    /**
     * The generator function producing async values.
     * @private
     */
    private generatorFn: () => AsyncGenerator<T, void, unknown>;

    /**
     * Creates a new `LazyStream` instance.
     *
     * @param {() => AsyncGenerator<T, void, unknown>} generatorFn - An async generator function.
     */
    constructor(generatorFn: () => AsyncGenerator<T, void, unknown>) {
        this.generatorFn = generatorFn;
    }

    /**
     * Creates a `LazyStream` from an async generator function.
     *
     * @template T - The type of elements produced.
     * @param {() => AsyncGenerator<T, void, unknown>} fn - The generator function.
     * @returns {LazyStream<T>} - A new `LazyStream` instance.
     *
     * @example
     * async function* numbers() {
     *     let i = 1;
     *     while (true) yield i++;
     * }
     * const stream = LazyStream.from(numbers);
     */
    static from<T>(fn: () => AsyncGenerator<T, void, unknown>): LazyStream<T> {
        return new LazyStream(fn);
    }

    /**
     * Creates a fresh generator instance for iteration.
     *
     * @private
     * @returns {AsyncGenerator<T, void, unknown>}
     */
    private createGenerator(): AsyncGenerator<T, void, unknown> {
        return this.generatorFn();
    }

    /**
     * Lazily applies a transformation function to each element.
     *
     * @template U - The transformed type.
     * @param {(value: T) => U | Promise<U>} fn - Transformation function.
     * @returns {LazyStream<U>} - A new `LazyStream` instance.
     *
     * @example
     * const doubled = stream.map(x => x * 2);
     */
    map<U>(fn: (value: T) => U | Promise<U>): LazyStream<U> {
        return new LazyStream<U>(
            async function* () {
                for await (const value of this.createGenerator()) {
                    yield fn(value);
                }
            }.bind(this),
        );
    }

    /**
     * Lazily filters elements based on a predicate function.
     *
     * @param {(value: T) => boolean | Promise<boolean>} predicate - The filtering function.
     * @returns {LazyStream<T>} - A new filtered `LazyStream`.
     *
     * @example
     * const evens = stream.filter(x => x % 2 === 0);
     */
    filter(predicate: (value: T) => boolean | Promise<boolean>): LazyStream<T> {
        return new LazyStream<T>(
            async function* () {
                for await (const value of this.createGenerator()) {
                    if (await predicate(value)) yield value;
                }
            }.bind(this),
        );
    }

    /**
     * Lazily takes the first `n` elements.
     *
     * @param {number} n - Number of elements to take.
     * @returns {LazyStream<T>} - A new `LazyStream` instance.
     *
     * @example
     * const firstFive = stream.take(5);
     */
    take(n: number): LazyStream<T> {
        return new LazyStream<T>(
            async function* () {
                let count = 0;
                for await (const value of this.createGenerator()) {
                    if (count++ >= n) break;
                    yield value;
                }
            }.bind(this),
        );
    }

    /**
     * Collects the stream into an array.
     *
     * **Note:** This forces evaluation of all elements (breaking laziness).
     *
     * @returns {Promise<T[]>} - A promise resolving to an array of values.
     *
     * @example
     * const values = await stream.toArray();
     */
    async toArray(): Promise<T[]> {
        const result: T[] = [];
        for await (const value of this.createGenerator()) {
            result.push(value);
        }
        return result;
    }
}
