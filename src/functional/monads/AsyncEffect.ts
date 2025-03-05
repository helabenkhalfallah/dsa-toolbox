import { Err, Ok, Result } from './Result.ts';

/**
 * Represents an asynchronous effect, encapsulating a deferred computation
 * that may fail safely. It supports functional composition via `map`, `flatMap`,
 * and error recovery through `recover`.
 *
 * @template T - The type of the successful value.
 * @template E - The type of the error.
 */
export type AsyncEffect<T, E = unknown> = {
    /**
     * Transforms the successful result of the effect.
     *
     * @template U - The transformed value type.
     * @param {(value: T) => U | Promise<U>} fn - Function applied on success.
     * @returns {AsyncEffect<U, E>} - A new `AsyncEffect<U, E>` with transformed data.
     *
     * @example
     * const effect = AsyncEffect(() => Promise.resolve(10)).map(x => x * 2);
     * effect.run().then(console.log); // Ok(20)
     */
    map<U>(fn: (value: T) => U | Promise<U>): AsyncEffect<U, E>;

    /**
     * Chains another effect-producing function, allowing error propagation.
     *
     * @template U - The type of the next computation's success value.
     * @template F - The type of the new error that may occur.
     * @param {(value: T) => AsyncEffect<U, F>} fn - Function returning a new `AsyncEffect<U, F>`.
     * @returns {AsyncEffect<U, E | F>} - A new `AsyncEffect<U, E | F>` propagating errors.
     *
     * @example
     * const effect = AsyncEffect(() => Promise.resolve(10))
     *     .flatMap(x => AsyncEffect(() => Promise.resolve(x + 5)));
     * effect.run().then(console.log); // Ok(15)
     */
    flatMap<U, F>(fn: (value: T) => AsyncEffect<U, F>): AsyncEffect<U, E | F>;

    /**
     * Runs the effect and returns a `Result<T, E>` wrapped in a `Promise`.
     *
     * @returns {Promise<Result<T, E>>} - A safe `Result`, encapsulating success (`Ok<T>`) or failure (`Err<E>`).
     *
     * @example
     * const effect = AsyncEffect(() => {
     *     if (Math.random() > 0.5) throw new Error("Failure");
     *     return Promise.resolve(42);
     * });
     * effect.run().then(console.log); // Either Ok(42) or Err(Error)
     */
    run(): Promise<Result<T, E>>;

    /**
     * Recovers from errors by mapping them to a successful value.
     *
     * **Useful for handling failures gracefully.**
     *
     * @template U - The new success type after recovery.
     * @param {(error: E) => U | Promise<U>} fn - Function to handle errors and return a fallback value.
     * @returns {AsyncEffect<T | U, never>} - A new `AsyncEffect<T | U, never>` that ensures success.
     *
     * @example
     * const effect = AsyncEffect(() => Promise.reject("Boom!")).recover(() => 0);
     * effect.run().then(console.log); // Ok(0)
     */
    recover<U>(fn: (error: E) => U | Promise<U>): AsyncEffect<T | U, never>;
};

/**
 * Creates an `AsyncEffect<T, E>` that represents a computation that may fail.
 * This function **does not execute the computation immediately**, but defers execution.
 *
 * @template T - The type of the successful value.
 * @template E - The type of the error.
 * @param {() => Promise<T>} fn - A function that produces a value (or throws an error).
 * @returns {AsyncEffect<T, E>} - A lazy effect that can be executed later.
 *
 * @example
 * const safeFetch = AsyncEffect(() => fetch("https://example.com"));
 * safeFetch.run().then(console.log); // Ok(Response) or Err(Error)
 */
export function AsyncEffect<T, E = unknown>(fn: () => Promise<T>): AsyncEffect<T, E> {
    return {
        /**
         * Transforms the successful result of the effect.
         *
         * @template U - The transformed value type.
         * @param {(value: T) => U | Promise<U>} mapFn - Function applied on success.
         * @returns {AsyncEffect<U, E>} - A new `AsyncEffect<U, E>` with transformed data.
         */
        map<U>(mapFn: (value: T) => U | Promise<U>): AsyncEffect<U, E> {
            return AsyncEffect(async () => {
                const result = await fn();
                return mapFn(result);
            });
        },

        /**
         * Chains another effect-producing function, allowing error propagation.
         *
         * **Useful for sequencing dependent computations.**
         *
         * @template U - The type of the next computation's success value.
         * @template F - The new error type that may occur.
         * @param {(value: T) => AsyncEffect<U, F>} mapFn - Function returning a new `AsyncEffect<U, F>`.
         * @returns {AsyncEffect<U, E | F>} - A new `AsyncEffect<U, E | F>` propagating errors.
         */
        flatMap<U, F>(mapFn: (value: T) => AsyncEffect<U, F>): AsyncEffect<U, E | F> {
            return AsyncEffect(async () => {
                const result = await fn();
                return mapFn(result)
                    .run()
                    .then((res) => res.unwrapOrThrow());
            });
        },

        /**
         * Executes the effect and returns a `Result<T, E>` wrapped in a `Promise`.
         *
         * @returns {Promise<Result<T, E>>} - A safe `Result`, encapsulating success (`Ok<T>`) or failure (`Err<E>`).
         */
        async run(): Promise<Result<T, E>> {
            try {
                return new Ok(await fn());
            } catch (error) {
                return new Err(error as E);
            }
        },

        /**
         * Recovers from errors by mapping them to a successful value.
         * The resulting effect **ensures** success by removing the error type.
         *
         * @template U - The new success type after recovery.
         * @param {(error: E) => U | Promise<U>} recoveryFn - Function that handles errors and returns a fallback value.
         * @returns {AsyncEffect<T | U, never>} - An `AsyncEffect` that **always succeeds**.
         */
        recover<U>(recoveryFn: (error: E) => U | Promise<U>): AsyncEffect<T | U, never> {
            return AsyncEffect(async () => {
                const result = await this.run();
                return result.fold(recoveryFn, (value) => value);
            });
        },
    };
}
