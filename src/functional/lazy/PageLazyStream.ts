/**
 * **PageLazyStream:** Processes entire pages lazily (instead of single items).
 *
 * This class enables **lazy, on-demand processing** of paginated data sources.
 * Instead of processing individual elements, it **operates on entire pages**,
 * which is useful for efficient batch processing.
 *
 * Features:
 * - **Lazy Pagination:** Fetches pages only when needed.
 * - **Functional API:** Supports `map()`, `filter()`, and `take()` at the page level.
 * - **Async Generators:** Works with API pagination or batch-processing tasks.
 *
 * @template T - The type of elements contained in each page.
 */
export class PageLazyStream<T> {
    /**
     * The generator function producing async pages of values.
     * @private
     */
    private generatorFn: () => AsyncGenerator<T[], void, unknown>;

    /**
     * Creates a new `PageLazyStream` instance.
     *
     * @param {() => AsyncGenerator<T[], void, unknown>} generatorFn - An async generator function producing pages.
     */
    constructor(generatorFn: () => AsyncGenerator<T[], void, unknown>) {
        this.generatorFn = generatorFn;
    }

    /**
     * Creates a `PageLazyStream` from an async generator function.
     *
     * @template T - The type of elements in each page.
     * @param {() => AsyncGenerator<T[], void, unknown>} fn - The generator function.
     * @returns {PageLazyStream<T>} - A new `PageLazyStream` instance.
     *
     * @example
     * async function* fetchPages() {
     *     let page = 1;
     *     while (page <= 5) {
     *         yield [`Item ${page}-1`, `Item ${page}-2`, `Item ${page}-3`];
     *         page++;
     *     }
     * }
     * const pageStream = PageLazyStream.from(fetchPages);
     */
    static from<T>(fn: () => AsyncGenerator<T[], void, unknown>): PageLazyStream<T> {
        return new PageLazyStream(fn);
    }

    /**
     * Creates a fresh generator instance for iteration.
     *
     * @private
     * @returns {AsyncGenerator<T[], void, unknown>}
     */
    private createGenerator(): AsyncGenerator<T[], void, unknown> {
        return this.generatorFn();
    }

    /**
     * Lazily filters **entire pages** instead of filtering each individual item.
     *
     * @param {(page: T[]) => boolean | Promise<boolean>} predicate - The filtering function for pages.
     * @returns {PageLazyStream<T>} - A new filtered `PageLazyStream`.
     *
     * @example
     * const filteredPages = pageStream.filter(page => page.length > 2);
     */
    filter(predicate: (page: T[]) => boolean | Promise<boolean>): PageLazyStream<T> {
        return new PageLazyStream<T>(
            async function* () {
                for await (const page of this.createGenerator()) {
                    if (await predicate(page)) yield page;
                }
            }.bind(this),
        );
    }

    /**
     * Lazily applies a transformation function to **entire pages** instead of individual items.
     *
     * @template U - The transformed type.
     * @param {(page: T[]) => U[]} fn - Transformation function applied to pages.
     * @returns {PageLazyStream<U>} - A new `PageLazyStream` instance.
     *
     * @example
     * const mappedPages = pageStream.map(page => page.map(item => item.toUpperCase()));
     */
    map<U>(fn: (page: T[]) => U[]): PageLazyStream<U> {
        return new PageLazyStream<U>(
            async function* () {
                for await (const page of this.createGenerator()) {
                    yield fn(page);
                }
            }.bind(this),
        );
    }

    /**
     * Lazily takes the first `n` pages.
     *
     * @param {number} n - Number of pages to take.
     * @returns {PageLazyStream<T>} - A new `PageLazyStream` instance.
     *
     * @example
     * const firstThreePages = pageStream.take(3);
     */
    take(n: number): PageLazyStream<T> {
        return new PageLazyStream<T>(
            async function* () {
                let count = 0;
                for await (const page of this.createGenerator()) {
                    if (count++ >= n) break;
                    yield page;
                }
            }.bind(this),
        );
    }

    /**
     * Collects all pages into a single array.
     *
     * **Note:** This forces evaluation of all elements (breaking laziness).
     *
     * @returns {Promise<T[][]>} - A promise resolving to an array of pages.
     *
     * @example
     * const allPages = await pageStream.toArray();
     */
    async toArray(): Promise<T[][]> {
        const result: T[][] = [];
        for await (const page of this.createGenerator()) {
            result.push(page);
        }
        return result;
    }
}
