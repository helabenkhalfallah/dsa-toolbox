/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Pattern matching function for TypeScript.
 *
 * @template T - The type of the value to be matched.
 * @param {T} value - The input value to match against patterns.
 * @param {Array<[ (value: T) => boolean, (value: T) => any ]>} patterns -
 *   An array of tuples where:
 *   - The first element is a predicate function that checks if the pattern applies.
 *   - The second element is a handler function that executes when the pattern matches.
 * @returns {any} - The result of the first matching handler function.
 * @throws {Error} If no pattern matches the input value.
 *
 * @example
 * const result = match(5, [
 *   [(n) => n === 10, () => "Exactly ten"],
 *   [(n) => n > 0, (n) => `Positive: ${n}`],
 * ]);
 * console.log(result); // Output: "Positive: 5"
 *
 * @example
 * // Matching against an Option type
 * type None = { type: "None" };
 * type Some<T> = { type: "Some"; value: T };
 * type Option<T> = Some<T> | None;
 *
 * const None: None = { type: "None" };
 * const Some = <T>(value: T): Some<T> => ({ type: "Some", value });
 *
 * const value: Option<number> = Some(15);
 * const message = match(value, [
 *   [(x) => x.type === "Some", (x) => `Some value: ${x.value}`],
 *   [(x) => x.type === "None", () => "No value"]
 * ]);
 * console.log(message); // Output: "Some value: 15"
 */
export function match<T>(value: T, patterns: [(value: T) => boolean, (value: T) => any][]): any {
    for (const [predicate, handler] of patterns) {
        if (predicate(value)) {
            return handler(value);
        }
    }
    throw new Error('No match found');
}
