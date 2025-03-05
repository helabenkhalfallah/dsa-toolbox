/**
 * Functional Lenses for Immutable State Updates.
 *
 * This module provides different types of lenses for working with immutable data:
 * - `Lens<T, U>`: Get/set operations for a single property.
 * - `TraversalLens<T>`: Transform arrays immutably.
 * - `OptionalLens<T, U>`: Handle optional (nullable) properties.
 * - `IsoLens<T, U>`: Convert between two representations.
 *
 * @module Lenses
 */

/** Standard Lens for accessing and modifying a single property. */
export type Lens<T, U> = {
    /** Gets a value from an object. */
    get: (obj: T) => U;
    /** Returns a new object with the updated value. */
    set: (value: U, obj: T) => T;
    /** Composes two lenses to create a new, nested lens. */
    compose: <V>(other: Lens<U, V>) => Lens<T, V>;
};

/**
 * Creates a lens for a specific property.
 *
 * @template T - The parent object type.
 * @template U - The property type.
 * @param {(obj: T) => U} getter - Function to get the property.
 * @param {(value: U, obj: T) => T} setter - Function to set the property immutably.
 * @returns {Lens<T, U>}
 */
export const lens = <T, U>(getter: (obj: T) => U, setter: (value: U, obj: T) => T): Lens<T, U> => ({
    get: getter,
    set: setter,
    compose<V>(other: Lens<U, V>): Lens<T, V> {
        return lens(
            (obj) => other.get(this.get(obj)), // Composing getters
            (value, obj) => this.set(other.set(value, this.get(obj)), obj), // Composing setters
        );
    },
});

/** Lens for transforming all elements in an array. */
export type TraversalLens<T> = {
    /** Returns the array itself. */
    get: (arr: T[]) => T[];
    /** Returns a new array with transformed values. */
    modify: (fn: (value: T) => T, arr: T[]) => T[];
};

/**
 * Creates a traversal lens for arrays.
 *
 * @template T - The type of array elements.
 * @returns {TraversalLens<T>}
 */
export const traversalLens = <T>(): TraversalLens<T> => ({
    get: (arr) => arr,
    modify: (fn, arr) => arr.map(fn),
});

/** Lens for handling optional (nullable) properties. */
export type OptionalLens<T, U> = {
    /** Gets a value from an object, or `null` if missing. */
    get: (obj: T) => U | null;
    /** Returns a new object with the updated value. */
    set: (value: U, obj: T) => T;
};

/**
 * Creates a lens for optional properties that may be missing or null.
 *
 * @template T - The parent object type.
 * @template U - The property type.
 * @param {(obj: T) => U | null} getter - Function to get the property or return `null`.
 * @param {(value: U, obj: T) => T} setter - Function to set the property immutably.
 * @returns {OptionalLens<T, U>}
 */
export const optionalLens = <T, U>(
    getter: (obj: T) => U | null,
    setter: (value: U, obj: T) => T,
): OptionalLens<T, U> => ({
    get: getter,
    set: setter,
});

/** Lens for transforming values between two equivalent representations. */
export type IsoLens<T, U> = {
    /** Converts a value from `T` to `U`. */
    get: (value: T) => U;
    /** Converts a value from `U` back to `T`. */
    reverseGet: (value: U) => T;
};

/**
 * Creates an isomorphic lens for converting between two equivalent data representations.
 *
 * @template T - The source type.
 * @template U - The target type.
 * @param {(value: T) => U} getter - Function to convert from `T` to `U`.
 * @param {(value: U) => T} reverseGetter - Function to convert from `U` back to `T`.
 * @returns {IsoLens<T, U>}
 */
export const isoLens = <T, U>(
    getter: (value: T) => U,
    reverseGetter: (value: U) => T,
): IsoLens<T, U> => ({
    get: getter,
    reverseGet: reverseGetter,
});

type MaxDepth = 10; // Prevent excessive recursion

/**
 * ** Type Helper:** Extracts the type at a given nested path.
 *
 * @template T - The root type.
 * @template P - The path tuple (`["key1", "key2", ...]`).
 */
type DeepType<T, P extends PropertyPath<T>, D extends number[] = []> = D['length'] extends MaxDepth
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    : P extends [infer K, ...infer Rest]
      ? K extends keyof T
          ? Rest extends PropertyPath<T[K], [...D, 1]>
              ? DeepType<T[K], Rest, [...D, 1]>
              : T[K]
          : // eslint-disable-next-line @typescript-eslint/no-explicit-any
            any
      : T;
/**
 * ** Type Helper:** Recursively constructs valid property paths.
 *
 * @template T - The root type.
 */
type PropertyPath<T, D extends number[] = []> = D['length'] extends MaxDepth
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    : T extends object
      ? {
            [K in keyof T]:
                | [K]
                | (T[K] extends object ? [K, ...PropertyPath<T[K], [...D, 1]>] : never);
        }[keyof T]
      : string[] | []; // Allow string array or empty array

/**
 * A dynamic lens for accessing and modifying deeply nested properties in an immutable way.
 *
 * @template T - The root object type.
 * @template P - The property path type.
 */
export const dynamicLens = <T, P extends PropertyPath<T>>(path: P) => {
    return {
        get: (obj: T): DeepType<T, P> | undefined => {
            let current: unknown = obj;
            for (const key of path) {
                if (current === null || current === undefined || typeof current !== 'object') {
                    return undefined;
                }
                if (typeof key === 'string' && typeof current === 'object' && current !== null) {
                    current = (current as Record<string, unknown>)[key];
                } else {
                    return undefined;
                }
            }
            return current as DeepType<T, P> | undefined;
        },

        set: (value: DeepType<T, P>, obj: T): T => {
            if (path.length === 0) return obj;

            const pathArray = [...path];
            const newObj: T = { ...obj };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let target: any = newObj;

            for (let i = 0; i < pathArray.length; i++) {
                const key = pathArray[i];
                if (i === pathArray.length - 1) {
                    target[key] = value;
                } else {
                    if (
                        target[key] === undefined ||
                        target[key] === null ||
                        typeof target[key] !== 'object'
                    ) {
                        target[key] = {};
                    }
                    target[key] = { ...target[key] };
                    target = target[key];
                }
            }
            return newObj;
        },

        path,
    };
};
