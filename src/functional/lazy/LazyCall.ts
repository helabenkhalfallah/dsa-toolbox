/**
 * LazyCall Evaluation Wrapper.
 *
 * Allows delayed computation with functional transformations.
 *
 * @template T - The type of the computed value.
 */
export class LazyCall<T> {
    private computed: T | undefined;
    private isEvaluated = false;

    /**
     * Constructs a new LazyCall instance with a computation.
     *
     * @param {() => T} computation - The function to compute the value lazily.
     */
    constructor(private readonly computation: () => T) {}

    /**
     * Computes the value **only once** and caches the result.
     *
     * @returns {T} The computed value.
     */
    get(): T {
        if (!this.isEvaluated) {
            this.computed = this.computation(); // Compute and store the result
            this.isEvaluated = true; // Mark as evaluated to prevent re-execution
        }
        return this.computed!;
    }

    /**
     * Transforms the stored value **without evaluating** it immediately.
     *
     * @template U - The new transformed type.
     * @param {(value: T) => U} fn - The transformation function.
     * @returns {LazyCall<U>} A new lazy instance with the transformation applied.
     */
    map<U>(fn: (value: T) => U): LazyCall<U> {
        return new LazyCall(() => fn(this.get()));
    }

    /**
     * Chains computations that return another LazyCall instance.
     *
     * @template U - The transformed type.
     * @param {(value: T) => LazyCall<U>} fn - The function returning a new LazyCall instance.
     * @returns {LazyCall<U>} A new lazy instance.
     */
    flatMap<U>(fn: (value: T) => LazyCall<U>): LazyCall<U> {
        return new LazyCall(() => fn(this.get()).get());
    }
}
