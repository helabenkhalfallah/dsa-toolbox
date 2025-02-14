type CanApply<T> = {
    map: <U>(fn: (value: T) => U) => CanApply<U | null>;
    getValue: () => T | null;
};

/**
 * A functor that safely applies transformations to a value, preventing errors while allowing type changes.
 *
 * @param value - The initial value.
 * @returns A `CanApply<T>` instance.
 *
 * @example
 * const result = CanApply(5)
 *     .map(x => x * 2)        // 10
 *     .map(x => x.toString()) // "10"
 *     .getValue();
 * console.log(result); // "10"
 */
export function CanApply<T>(value: T) {
    return {
        map: <U>(fn: (x: T) => U) => {
            try {
                const result = fn(value);
                return CanApply(result !== undefined ? result : null);
            } catch {
                return CanApply(null);
            }
        },
        getValue: () => (value !== undefined ? value : null),
    };
}
