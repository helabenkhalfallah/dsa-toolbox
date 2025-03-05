import { Err, Ok, Result } from './Result.ts';

/**
 * Represents a deferred computation that can fail safely.
 * It encapsulates a lazy computation that may throw an error, allowing safe composition.
 *
 * @template T - The type of the successful value.
 * @template E - The type of the error.
 */
export type SyncEffect<T, E = unknown> = {
    /**
     * Transforms the successful result of the effect.
     *
     * @template U - The transformed value type.
     * @param {(value: T) => U} fn - Function to apply on success.
     * @returns {SyncEffect<U, E>} - A new SyncEffect<U, E> with transformed data.
     *
     * @example
     * const effect = SyncEffect(() => 10).map(x => x * 2);
     * console.log(effect.run()); // Ok(20)
     */
    map<U>(fn: (value: T) => U): SyncEffect<U, E>;

    /**
     * Chains another effect-producing function, allowing error propagation.
     *
     * @template U - The type of the next computation's success value.
     * @template F - The type of the new error that may occur.
     * @param {(value: T) => SyncEffect<U, F>} fn - Function returning a new SyncEffect<U, F>.
     * @returns {SyncEffect<U, E | F>} - A new SyncEffect<U, E | F> propagating errors.
     *
     * @example
     * const effect = SyncEffect(() => 10).flatMap(x => SyncEffect(() => x + 5));
     * console.log(effect.run()); // Ok(15)
     */
    flatMap<U, F>(fn: (value: T) => SyncEffect<U, F>): SyncEffect<U, E | F>;

    /**
     * Runs the effect and returns a `Result<T, E>`.
     *
     * @returns {Result<T, E>} - A safe `Result`, encapsulating success (`Ok<T>`) or failure (`Err<E>`).
     *
     * @example
     * const effect = SyncEffect(() => {
     *     if (Math.random() > 0.5) throw new Error("Failure");
     *     return 42;
     * });
     * console.log(effect.run()); // Either Ok(42) or Err(Error)
     */
    run(): Result<T, E>;

    /**
     * Recovers from errors by mapping them to a successful value.
     *
     * **Useful for handling failures gracefully.**
     *
     * @param {(error: E) => T} fn - Function to handle errors and return a fallback value.
     * @returns {SyncEffect<T, never>} - A new `SyncEffect<T, never>` that ensures success.
     *
     * @example
     * const effect = SyncEffect(() => { throw new Error("Boom!"); }).recover(() => 0);
     * console.log(effect.run()); // Ok(0)
     */
    recover<U>(fn: (error: E) => U): SyncEffect<T | U, never>;
};

/**
 * Creates an `SyncEffect<T, E>` that represents a computation that may fail.
 * This function **does not execute the computation immediately**, but defers execution.
 *
 * @template T - The type of the successful value.
 * @template E - The type of the error.
 * @param {() => T} fn - A function that produces a value (or throws an error).
 * @returns {SyncEffect<T, E>} - A lazy effect that can be executed later.
 *
 * @example
 * const safeDivide = SyncEffect(() => 10 / 2);
 * console.log(safeDivide.run()); // Ok(5)
 */
export function SyncEffect<T, E = unknown>(fn: () => T): SyncEffect<T, E> {
    return {
        /**
         * Transforms the successful result of the effect.
         *
         * @template U - The transformed value type.
         * @param {(value: T) => U} mapFn - Function to apply on success.
         * @returns {SyncEffect<U, E>} - A new `SyncEffect<U, E>` with transformed data.
         */
        map<U>(mapFn: (value: T) => U): SyncEffect<U, E> {
            return SyncEffect(() => {
                const result = fn();
                return mapFn(result);
            });
        },

        /**
         * Chains another effect-producing function.
         *
         * **Useful for sequencing dependent computations.**
         *
         * @template U - The type of the next computation's success value.
         * @template F - The new error type that may occur.
         * @param {(value: T) => SyncEffect<U, F>} mapFn - Function returning a new SyncEffect<U, F>.
         * @returns {SyncEffect<U, E | F>} - A new SyncEffect<U, E | F> propagating errors.
         */
        flatMap<U, F>(mapFn: (value: T) => SyncEffect<U, F>): SyncEffect<U, E | F> {
            return SyncEffect(() => {
                const result = fn();
                return mapFn(result).run().unwrapOrThrow();
            });
        },

        /**
         * Executes the effect and returns a `Result<T, E>`.
         *
         * @returns {Result<T, E>} - A safe `Result`, encapsulating success (`Ok<T>`) or failure (`Err<E>`).
         */
        run(): Result<T, E> {
            try {
                return new Ok(fn());
            } catch (error) {
                return new Err(error as E);
            }
        },

        /**
         * Recovers from errors by mapping them to a successful value.
         * The resulting effect **ensures** success by removing the error type.
         *
         * @template U - The new success type after recovery.
         * @param {(error: E) => U} recoveryFn - Function that handles errors and returns a fallback value.
         * @returns {SyncEffect<T | U, never>} - An `SyncEffect` that **always succeeds**.
         */
        recover<U>(recoveryFn: (error: E) => U): SyncEffect<T | U, never> {
            return SyncEffect(() => {
                const result = this.run();
                return result.fold(recoveryFn, (value) => value);
            });
        },
    };
}
