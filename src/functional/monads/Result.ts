/**
 * Represents a result that can either be a success (`Ok<T>`) or an error (`Err<E>`).
 * Provides functional methods for safe computations without exceptions.
 *
 * @template T - The type of the successful value.
 * @template E - The type of the error.
 */
export abstract class Result<T, E> {
    /**
     * Creates a success (`Ok<T>`) result.
     *
     * @param {T} value - The value to wrap.
     * @returns {Result<T, never>} An `Ok` instance containing the value.
     */
    static ok<T>(value: T): Result<T, never> {
        return new Ok(value);
    }

    /**
     * Creates an error (`Err<E>`) result.
     *
     * @param {E} error - The error to wrap.
     * @returns {Result<never, E>} An `Err` instance containing the error.
     */
    static err<E>(error: E): Result<never, E> {
        return new Err(error);
    }

    /**
     * Determines if the result is `Ok<T>`.
     *
     * @returns {boolean} `true` if this is `Ok<T>`, otherwise `false`.
     */
    abstract isOk(): boolean;

    /**
     * Determines if the result is `Err<E>`.
     *
     * @returns {boolean} `true` if this is `Err<E>`, otherwise `false`.
     */
    abstract isErr(): boolean;

    /**
     * Maps the successful value using the given function.
     *
     * @template U - The transformed success type.
     * @param {(value: T) => U} fn - The function to apply.
     * @returns {Result<U, E>} A new `Result<U, E>`.
     */
    abstract map<U>(fn: (value: T) => U): Result<U, E>;

    /**
     * Maps the error using the given function.
     *
     * @template F - The transformed error type.
     * @param {(error: E) => F} fn - The function to apply.
     * @returns {Result<T, F>} A new `Result<T, F>`.
     */
    abstract mapError<F>(fn: (error: E) => F): Result<T, F>;

    /**
     * Maps the successful value to another `Result<U, E>`, allowing chaining.
     *
     * @template U - The transformed success type.
     * @param {(value: T) => Result<U, E>} fn - The function returning a `Result<U, E>`.
     * @returns {Result<U, E>} A new `Result<U, E>`.
     */
    abstract flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E>;

    /**
     * Retrieves the success value if `Ok<T>`, otherwise returns a default.
     *
     * @param {T} defaultValue - The default value if `Err<E>`.
     * @returns {T} The contained value or `defaultValue`.
     */
    abstract unwrapOr(defaultValue: T): T;

    /**
     * Retrieves the success value if `Ok<T>`, otherwise throws an error.
     *
     * @returns {T} The contained value if `Ok<T>`.
     * @throws {Error} Throws an error if `Err<E>`.
     */
    abstract unwrapOrThrow(): T;

    /**
     * Returns an alternative `Result<T, E>` if this is `Err<E>`.
     *
     * @param {Result<T, E>} alternative - The alternative `Result<T, E>`.
     * @returns {Result<T, E>} The original `Result<T, E>` if `Ok<T>`, otherwise `alternative`.
     */
    abstract orElse(alternative: Result<T, E>): Result<T, E>;

    /**
     * Folds the result into a single value by applying one of two functions.
     *
     * @template U - The return type.
     * @param {(error: E) => U} ifErr - Function applied to `Err<E>`.
     * @param {(value: T) => U} ifOk - Function applied to `Ok<T>`.
     * @returns {U} The computed value.
     */
    abstract fold<U>(ifErr: (error: E) => U, ifOk: (value: T) => U): U;
}

/**
 * Represents a successful result (`Ok<T>`), encapsulating a valid value.
 *
 * @template T - The type of the successful value.
 */
export class Ok<T> extends Result<T, never> {
    /**
     * Constructs an `Ok<T>` instance with a successful value.
     *
     * @param {T} value - The valid value to wrap.
     */
    constructor(private readonly value: T) {
        super();
    }

    /**
     * Checks if this is an `Ok<T>`, meaning it contains a valid value.
     *
     * @returns {boolean} - Always returns `true` for `Ok<T>`.
     */
    isOk(): boolean {
        return true;
    }

    /**
     * Checks if this is an `Err<E>`, meaning it contains an error.
     *
     * @returns {boolean} - Always returns `false` for `Ok<T>`.
     */
    isErr(): boolean {
        return false;
    }

    /**
     * Transforms the contained value using a function.
     *
     * @template U - The return type after transformation.
     * @param {(value: T) => U} fn - The function to apply.
     * @returns {Ok<U>} - A new `Ok<U>` containing the transformed value.
     */
    map<U>(fn: (value: T) => U): Result<U, never> {
        return new Ok(fn(this.value));
    }

    /**
     * Maps the error, but since this is `Ok<T>`, it remains unchanged.
     *
     * @template F - The new error type.
     * @param {(_error: never) => F} _fn - Unused error mapping function.
     * @returns {Ok<T>} - Returns itself, as `Ok<T>` has no error.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mapError<F>(_fn: (error: never) => F): Result<T, F> {
        return this;
    }

    /**
     * Maps the contained value to another `Result<U, never>`, allowing chaining.
     *
     * @template U - The transformed success type.
     * @param {(value: T) => Result<U, never>} fn - The function returning a `Result<U, never>`.
     * @returns {Result<U, never>} - The transformed `Result<U, never>`.
     */
    flatMap<U, E>(fn: (value: T) => Result<U, E>): Result<U, E> {
        return fn(this.value);
    }

    /**
     * Retrieves the contained value, ignoring the provided default.
     *
     * @param {T} _defaultValue - (Unused) A fallback value.
     * @returns {T} - The contained value.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unwrapOr(_defaultValue: T): T {
        return this.value;
    }

    /**
     * Retrieves the contained value, or throws an error if it is `Err<E>`.
     *
     * @returns {T} - The contained value.
     * @throws {Error} Never throws, as this is always `Ok<T>`.
     */
    unwrapOrThrow(): T {
        return this.value;
    }

    /**
     * Returns the current `Ok<T>`, ignoring the provided alternative.
     *
     * @param {Result<T, never>} _alternative - (Unused) An alternative `Result<T>`.
     * @returns {Ok<T>} - Returns itself.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    orElse<E>(_alternative: Result<T, E>): Result<T, E> {
        return this;
    }

    /**
     * Executes the `ifOk` function with the contained value.
     *
     * @template U - The return type.
     * @param {(error: never) => U} _ifErr - (Unused) Function for `Err<E>`.
     * @param {(value: T) => U} ifOk - Function to apply to the value.
     * @returns {U} - The result of `ifOk(value)`.
     */
    fold<U>(_ifErr: (error: never) => U, ifOk: (value: T) => U): U {
        return ifOk(this.value);
    }
}

/**
 * Represents a failure result (`Err<E>`), encapsulating an error.
 *
 * @template E - The type of the error.
 */
export class Err<E> extends Result<never, E> {
    /**
     * Constructs an `Err<E>` instance with an error value.
     *
     * @param {E} error - The error to wrap.
     */
    constructor(private readonly error: E) {
        super();
    }

    /**
     * Checks if this is an `Ok<T>`, meaning it contains a valid value.
     *
     * @returns {boolean} - Always returns `false` for `Err<E>`.
     */
    isOk(): boolean {
        return false;
    }

    /**
     * Checks if this is an `Err<E>`, meaning it contains an error.
     *
     * @returns {boolean} - Always returns `true` for `Err<E>`.
     */
    isErr(): boolean {
        return true;
    }

    /**
     * Maps the successful value, but since this is `Err<E>`, it remains unchanged.
     *
     * @template U - The transformed success type.
     * @param {(_value: never) => U} _fn - Unused transformation function.
     * @returns {Err<E>} - Returns itself.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map<U>(_fn: (value: never) => U): Result<U, E> {
        return this;
    }

    /**
     * Maps the error to another error type.
     *
     * @template F - The transformed error type.
     * @param {(error: E) => F} fn - The function to transform the error.
     * @returns {Err<F>} - A new `Err<F>` with the transformed error.
     */
    mapError<F>(fn: (error: E) => F): Result<never, F> {
        return new Err(fn(this.error));
    }

    /**
     * Maps the contained value to another `Result<U, E>`, allowing chaining.
     *
     * @template U - The transformed success type.
     * @param {(_value: never) => Result<U, E>} _fn - Unused transformation function.
     * @returns {Err<E>} - Returns itself.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    flatMap<U>(_fn: (value: never) => Result<U, E>): Result<U, E> {
        return this;
    }

    /**
     * Retrieves the provided default value since `Err<E>` contains nothing.
     *
     * @template T - The success type.
     * @param {T} defaultValue - The fallback value.
     * @returns {T} - The provided default value.
     */
    unwrapOr<T>(defaultValue: T): T {
        return defaultValue;
    }

    /**
     * Throws the contained error.
     *
     * @throws {Error} Throws the contained error.
     */
    unwrapOrThrow(): never {
        throw new Error(String(this.error));
    }

    /**
     * Returns the provided alternative `Result<T, E>` since `Err<E>` contains nothing.
     *
     * @template T - The success type.
     * @param {Result<T, E>} alternative - The alternative `Result<T, E>`.
     * @returns {Result<T, E>} - The provided alternative.
     */
    orElse<T>(alternative: Result<T, E>): Result<T, E> {
        return alternative;
    }

    /**
     * Executes the `ifErr` function with the contained error.
     *
     * @template U - The return type.
     * @param {(error: E) => U} ifErr - Function applied to the error.
     * @param {(_value: never) => U} _ifOk - (Unused) Function for `Ok<T>`.
     * @returns {U} - The result of `ifErr(error)`.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fold<U>(ifErr: (error: E) => U, _ifOk: (value: never) => U): U {
        return ifErr(this.error);
    }
}
