/**
 * Wrapper class for storing values with a custom comparator function.
 * Used to facilitate comparison-based data structures by providing a standardized comparison interface.
 *
 * @template T - The type of the value stored in the node.
 */
export class ComparableNode<T> {
    /** The value of the node. */
    value: T;

    /** Custom comparison function to compare this node's value with another. */
    compareFn: (a: T, b: T) => number;

    /**
     * Constructs a new `ComparableNode`.
     *
     * @param {T} value - The value to store in the node.
     * @param {(a: T, b: T) => number} compareFn - Custom comparison function to define sort order.
     */
    constructor(value: T, compareFn: (a: T, b: T) => number) {
        this.value = value;
        this.compareFn = compareFn;
    }

    /**
     * Compares this node to another `ComparableNode` using the custom comparator.
     *
     * @param {ComparableNode<T>} other - The other node to compare with.
     * @returns {number} A negative number if this node is less than the other, zero if equal, and a positive number if greater.
     *
     * @example
     * const nodeA = new ComparableNode(5, (a, b) => a - b);
     * const nodeB = new ComparableNode(10, (a, b) => a - b);
     * console.log(nodeA.compare(nodeB)); // Output: -5 (since 5 < 10)
     */
    compare(other: ComparableNode<T>): number {
        return this.compareFn(this.value, other?.value);
    }

    /**
     * Returns a string representation of the node, useful for debugging.
     *
     * @returns {string} String representation of the node, showing its value.
     *
     * @example
     * const node = new ComparableNode(42, (a, b) => a - b);
     * console.log(node.toString()); // Output: ComparableNode(value: 42)
     */
    toString(): string {
        return `ComparableNode(value: ${this.value})`;
    }
}
