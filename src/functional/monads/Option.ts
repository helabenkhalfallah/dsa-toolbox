/**
 * Represents an optional value (`Some<T>` for present values, `None` for absence).
 * Implements a functional-style API for safe operations without null checks.
 *
 * @template T - The type of the contained value.
 */
export abstract class Option<T> {
    /**
     * Creates an instance of `Some<T>` if a value is present, otherwise returns `None`.
     *
     * @param {T | null | undefined} value - The value to wrap.
     * @returns {Option<T>} - `Some<T>` if valid, otherwise `None`.
     */
    static from<T>(value: T | null | undefined): Option<T> {
        return value !== null && value !== undefined ? new Some(value) : None.instance;
    }

    /**
     * Checks if the `Option` contains a value.
     *
     * @returns {boolean} - `true` if `Some`, otherwise `false`.
     */
    abstract isSome(): boolean;

    /**
     * Checks if the `Option` is empty (`None`).
     *
     * @returns {boolean} - `true` if `None`, otherwise `false`.
     */
    abstract isNone(): boolean;

    /**
     * Transforms the contained value if present.
     *
     * @template U - The return type of the transformation function.
     * @param {(value: T) => U} fn - A function to apply to the value if present.
     * @returns {Option<U>} - The transformed `Option<U>`, or `None` if original was `None`.
     */
    abstract map<U>(fn: (value: T) => U): Option<U>;

    /**
     * Maps over the contained value but expects the function to return another `Option<U>`.
     *
     * @template U - The return type wrapped in an `Option<U>`.
     * @param {(value: T) => Option<U>} fn - A function returning an `Option<U>`.
     * @returns {Option<U>} - The transformed `Option<U>`, or `None` if original was `None`.
     */
    abstract flatMap<U>(fn: (value: T) => Option<U>): Option<U>;

    /**
     * Provides a default value if the `Option` is `None`.
     *
     * @param {T} defaultValue - The fallback value.
     * @returns {T} - The contained value if present, otherwise `defaultValue`.
     */
    abstract getOrElse(defaultValue: T): T;

    /**
     * Provides an alternative `Option<T>` if the original is `None`.
     *
     * @param {Option<T>} alternative - The alternative `Option<T>` to return if this is `None`.
     * @returns {Option<T>} - The original if `Some`, otherwise `alternative`.
     */
    abstract orElse(alternative: Option<T>): Option<T>;

    /**
     * Executes a function based on whether the `Option` is `Some` or `None`.
     *
     * @template U - The return type.
     * @param {() => U} ifNone - Function to call if `None`.
     * @param {(value: T) => U} ifSome - Function to call with the value if `Some`.
     * @returns {U} - The result of calling `ifNone` or `ifSome`.
     */
    abstract fold<U>(ifNone: () => U, ifSome: (value: T) => U): U;

    /**
     * Filters the `Option<T>` based on a predicate.
     *
     * @param {(value: T) => boolean} predicate - The condition to check.
     * @returns {Option<T>} - The original `Option<T>` if the condition is met, otherwise `None`.
     */
    abstract filter(predicate: (value: T) => boolean): Option<T>;
}

/**
 * Represents a value that is present (`Some<T>`).
 *
 * @template T - The type of the contained value.
 */
export class Some<T> extends Option<T> {
    /**
     * Creates an instance of `Some<T>` with a valid value.
     *
     * @param {T} value - The contained value.
     */
    constructor(private readonly value: T) {
        super();
    }

    /**
     * Checks if this is a `Some<T>`, meaning it contains a valid value.
     *
     * @returns {boolean} - Always returns `true` for `Some<T>`.
     */
    isSome(): boolean {
        return true;
    }

    /**
     * Checks if this is `None`, meaning no value is present.
     *
     * @returns {boolean} - Always returns `false` for `Some<T>`.
     */
    isNone(): boolean {
        return false;
    }

    /**
     * Transforms the contained value using the provided function.
     *
     * @template U - The return type after transformation.
     * @param {(value: T) => U} fn - The transformation function.
     * @returns {Option<U>} - A `Some<U>` containing the transformed value.
     */
    map<U>(fn: (value: T) => U): Option<U> {
        return new Some(fn(this.value));
    }

    /**
     * Transforms the contained value using a function that returns an `Option<U>`.
     *
     * @template U - The return type wrapped in an `Option<U>`.
     * @param {(value: T) => Option<U>} fn - The transformation function.
     * @returns {Option<U>} - The result of applying `fn`.
     */
    flatMap<U>(fn: (value: T) => Option<U>): Option<U> {
        return fn(this.value);
    }

    /**
     * Retrieves the contained value, ignoring the provided default.
     *
     * @param {T} _defaultValue - (Unused) A fallback value.
     * @returns {T} - The contained value.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getOrElse(_defaultValue: T): T {
        return this.value;
    }

    /**
     * Returns the current `Some<T>`, ignoring the provided alternative.
     *
     * @param {Option<T>} _alternative - (Unused) An alternative `Option<T>`.
     * @returns {Option<T>} - The same `Some<T>`.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    orElse(_alternative: Option<T>): Option<T> {
        return this;
    }

    /**
     * Executes the `ifSome` function with the contained value.
     *
     * @template U - The return type.
     * @param {() => U} _ifNone - (Unused) Function to call if `None`.
     * @param {(value: T) => U} ifSome - Function to call with the value if `Some<T>`.
     * @returns {U} - The result of calling `ifSome`.
     */
    fold<U>(_ifNone: () => U, ifSome: (value: T) => U): U {
        return ifSome(this.value);
    }

    /**
     * Returns `Some<T>` if the predicate is met, otherwise returns `None`.
     *
     * @param {(value: T) => boolean} predicate - A condition to check.
     * @returns {Option<T>} - `Some<T>` if condition is met, otherwise `None`.
     */
    filter(predicate: (value: T) => boolean): Option<T> {
        return predicate(this.value) ? this : None.instance;
    }
}

/**
 * Represents an absence of value (`None`).
 */
export class None extends Option<never> {
    /** Singleton instance of `None` for efficiency. */
    static instance = new None();

    /** Private constructor to enforce singleton pattern. */
    private constructor() {
        super();
    }

    /**
     * Checks if this is `Some<T>`, meaning it contains a value.
     *
     * @returns {boolean} - Always returns `false` for `None`.
     */
    isSome(): boolean {
        return false;
    }

    /**
     * Checks if this is `None`, meaning no value is present.
     *
     * @returns {boolean} - Always returns `true` for `None`.
     */
    isNone(): boolean {
        return true;
    }

    /**
     * Maps over the value, but since `None` has no value, it always returns `None`.
     *
     * @template U - The return type.
     * @returns {Option<U>} - Always returns `None`.
     * @param fn
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map<U>(fn: (value: never) => U): Option<U> {
        return this;
    }

    /**
     * Maps over the value expecting another `Option<U>`, but since `None` has no value, it always returns `None`.
     *
     * @template U - The return type wrapped in an `Option<U>`.
     * @returns {Option<U>} - Always returns `None`.
     * @param fn
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    flatMap<U>(fn: (value: never) => Option<U>): Option<U> {
        return this;
    }

    /**
     * Returns the provided default value since `None` contains nothing.
     *
     * @template U - The return type.
     * @param {U} defaultValue - The fallback value.
     * @returns {U} - The provided default.
     */
    getOrElse<U>(defaultValue: U): U {
        return defaultValue;
    }

    /**
     * Returns the provided alternative `Option<U>` since `None` contains nothing.
     *
     * @template U - The return type.
     * @param {Option<U>} alternative - The alternative `Option<U>` to return.
     * @returns {Option<U>} - The provided alternative.
     */
    orElse<U>(alternative: Option<U>): Option<U> {
        return alternative;
    }

    /**
     * Calls `ifNone`, since `None` contains no value.
     *
     * @template U - The return type.
     * @param {() => U} ifNone - Function to execute when `None`.
     * @param {(value: never) => U} _ifSome - (Unused) Function for `Some<T>`.
     * @returns {U} - The result of calling `ifNone`.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fold<U>(ifNone: () => U, _ifSome: (value: never) => U): U {
        return ifNone();
    }

    /**
     * Returns `None` since there is no value to filter.
     *
     * @param {(value: never) => boolean} _predicate - (Unused) A condition to check.
     * @returns {Option<never>} - Always returns `None`.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filter(_predicate: (value: never) => boolean): Option<never> {
        return this;
    }
}
