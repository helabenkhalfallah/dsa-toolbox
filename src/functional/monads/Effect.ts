import { Err, Ok, Result } from './Result.ts';

/**
 * Represents a deferred computation that can fail safely.
 * It encapsulates a lazy computation that may throw an error, allowing safe composition.
 *
 * @template T - The type of the successful value.
 * @template E - The type of the error.
 */
export type Effect<T, E = unknown> = {
    /**
     * Transforms the successful result of the effect.
     *
     * @template U - The transformed value type.
     * @param {(value: T) => U} fn - Function to apply on success.
     * @returns {Effect<U, E>} - A new Effect<U, E> with transformed data.
     *
     * @example
     * const effect = Effect(() => 10).map(x => x * 2);
     * console.log(effect.run()); // Ok(20)
     */
    map<U>(fn: (value: T) => U): Effect<U, E>;

    /**
     * Chains another effect-producing function, allowing error propagation.
     *
     * @template U - The type of the next computation's success value.
     * @template F - The type of the new error that may occur.
     * @param {(value: T) => Effect<U, F>} fn - Function returning a new Effect<U, F>.
     * @returns {Effect<U, E | F>} - A new Effect<U, E | F> propagating errors.
     *
     * @example
     * const effect = Effect(() => 10).flatMap(x => Effect(() => x + 5));
     * console.log(effect.run()); // Ok(15)
     */
    flatMap<U, F>(fn: (value: T) => Effect<U, F>): Effect<U, E | F>;

    /**
     * Runs the effect and returns a `Result<T, E>`.
     *
     * @returns {Result<T, E>} - A safe `Result`, encapsulating success (`Ok<T>`) or failure (`Err<E>`).
     *
     * @example
     * const effect = Effect(() => {
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
     * @returns {Effect<T, never>} - A new `Effect<T, never>` that ensures success.
     *
     * @example
     * const effect = Effect(() => { throw new Error("Boom!"); }).recover(() => 0);
     * console.log(effect.run()); // Ok(0)
     */
    recover<U>(fn: (error: E) => U): Effect<T | U, never>;
};

/**
 * Creates an `Effect<T, E>` that represents a computation that may fail.
 * This function **does not execute the computation immediately**, but defers execution.
 *
 * @template T - The type of the successful value.
 * @template E - The type of the error.
 * @param {() => T} fn - A function that produces a value (or throws an error).
 * @returns {Effect<T, E>} - A lazy effect that can be executed later.
 *
 * @example
 * const safeDivide = Effect(() => 10 / 2);
 * console.log(safeDivide.run()); // Ok(5)
 */
export function Effect<T, E = unknown>(fn: () => T): Effect<T, E> {
    return {
        /**
         * Transforms the successful result of the effect.
         *
         * @template U - The transformed value type.
         * @param {(value: T) => U} mapFn - Function to apply on success.
         * @returns {Effect<U, E>} - A new `Effect<U, E>` with transformed data.
         */
        map<U>(mapFn: (value: T) => U): Effect<U, E> {
            return Effect(() => {
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
         * @param {(value: T) => Effect<U, F>} mapFn - Function returning a new Effect<U, F>.
         * @returns {Effect<U, E | F>} - A new Effect<U, E | F> propagating errors.
         */
        flatMap<U, F>(mapFn: (value: T) => Effect<U, F>): Effect<U, E | F> {
            return Effect(() => {
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
         * @returns {Effect<T | U, never>} - An `Effect` that **always succeeds**.
         */
        recover<U>(recoveryFn: (error: E) => U): Effect<T | U, never> {
            return Effect(() => {
                const result = this.run();
                return result.fold(recoveryFn, (value) => value);
            });
        },
    };
}
