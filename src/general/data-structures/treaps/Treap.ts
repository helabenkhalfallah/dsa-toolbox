/**
 * Class representing a node in the Treap, combining a value with a priority.
 * Used as the building block for the Treap data structure.
 *
 * @template T - The type of value stored in the node.
 */
class TreapNode<T> {
    /** The value stored in the node. */
    value: T;

    /** The priority of the node, used to maintain the heap property in the Treap. */
    priority: number;

    /** Pointer to the left child node. */
    left: TreapNode<T> | null;

    /** Pointer to the right child node. */
    right: TreapNode<T> | null;

    /**
     * Creates a new TreapNode.
     * @param {T} value - The value stored in the node.
     * @param {number} priority - The priority of the node.
     */
    constructor(value: T, priority: number) {
        this.value = value;
        this.priority = priority;
        this.left = null;
        this.right = null;
    }
}

/**
 * Treap data structure combining properties of a Binary Search Tree and a Max Heap.
 * Each node satisfies both the BST property (left < root < right) and the heap property based on priority.
 *
 * @template T - The type of values stored in the Treap.
 */
export class Treap<T> {
    /** The root node of the Treap. */
    private root: TreapNode<T> | null = null;

    /** Comparison function for values in the Treap, allowing custom sorting logic. */
    private compareFn: (a: T, b: T) => number;

    /**
     * Creates a new Treap.
     * @param {(a: T, b: T) => number} [compareFn] - Optional comparison function for custom types.
     */
    constructor(compareFn?: (a: T, b: T) => number) {
        this.compareFn = compareFn || ((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    }

    /**
     * Inserts a value into the Treap with a specified priority.
     * @param {T} value - The value to insert.
     * @param {number} priority - The priority of the value.
     * @returns {boolean} - Always returns true as insertion is successful.
     */
    insert(value: T, priority: number): boolean {
        this.root = this._insert(this.root, value, priority);
        return true;
    }

    /**
     * Recursively inserts a value into the Treap, rebalancing as needed.
     * @param {TreapNode<T> | null} node - The current node in the recursive traversal.
     * @param {T} value - The value to insert.
     * @param {number} priority - The priority of the value.
     * @returns {TreapNode<T>} - The updated subtree with the inserted value.
     * @private
     */
    private _insert(node: TreapNode<T> | null, value: T, priority: number): TreapNode<T> {
        if (!node) return new TreapNode(value, priority);

        if (this.compareFn(value, node.value) < 0) {
            node.left = this._insert(node.left, value, priority);
            if (node.left && node.left.priority > node.priority) {
                node = this.rotateRight(node);
            }
        } else {
            node.right = this._insert(node.right, value, priority);
            if (node.right && node.right.priority > node.priority) {
                node = this.rotateLeft(node);
            }
        }

        return node;
    }

    /**
     * Rotates the subtree to the right, promoting the left child.
     * @param {TreapNode<T>} node - The root of the subtree to rotate.
     * @returns {TreapNode<T>} - The new root of the rotated subtree.
     * @private
     */
    private rotateRight(node: TreapNode<T>): TreapNode<T> {
        const newRoot = node.left!;
        node.left = newRoot.right;
        newRoot.right = node;
        return newRoot;
    }

    /**
     * Rotates the subtree to the left, promoting the right child.
     * @param {TreapNode<T>} node - The root of the subtree to rotate.
     * @returns {TreapNode<T>} - The new root of the rotated subtree.
     * @private
     */
    private rotateLeft(node: TreapNode<T>): TreapNode<T> {
        const newRoot = node.right!;
        node.right = newRoot.left;
        newRoot.left = node;
        return newRoot;
    }

    /**
     * Searches for a value in the Treap.
     * @param {T} value - The value to search for.
     * @returns {boolean} - True if the value is found, false otherwise.
     */
    search(value: T): boolean {
        return this._search(this.root, value);
    }

    /**
     * Recursively searches for a value in the Treap.
     * @param {TreapNode<T> | null} node - The current node in the recursive search.
     * @param {T} value - The value to search for.
     * @returns {boolean} - True if the value is found, false otherwise.
     * @private
     */
    private _search(node: TreapNode<T> | null, value: T): boolean {
        if (!node) return false;
        if (node.value === value) return true;
        return this.compareFn(value, node.value) < 0
            ? this._search(node.left, value)
            : this._search(node.right, value);
    }

    /**
     * Deletes a value from the Treap.
     * @param {T} value - The value to delete.
     * @returns {boolean} - True if the deletion was successful, false if the value was not found.
     */
    delete(value: T): boolean {
        if (!this.search(value)) return false; // Early exit if value not found
        this.root = this._delete(this.root, value);
        return true;
    }

    /**
     * Recursively deletes a value from the Treap, rebalancing as needed.
     * @param {TreapNode<T> | null} node - The current node in the recursive traversal.
     * @param {T} value - The value to delete.
     * @returns {TreapNode<T> | null} - The updated subtree with the value removed.
     * @private
     */
    private _delete(node: TreapNode<T> | null, value: T): TreapNode<T> | null {
        if (!node) return null;

        if (this.compareFn(value, node.value) < 0) {
            node.left = this._delete(node.left, value);
        } else if (this.compareFn(value, node.value) > 0) {
            node.right = this._delete(node.right, value);
        } else {
            if (!node.left) return node.right;
            if (!node.right) return node.left;

            if (node.left.priority > node.right.priority) {
                node = this.rotateRight(node);
                node.right = this._delete(node.right, value);
            } else {
                node = this.rotateLeft(node);
                node.left = this._delete(node.left, value);
            }
        }
        return node;
    }

    /**
     * Performs an in-order traversal of the Treap for testing or debugging purposes.
     * @param {TreapNode<T> | null} [node=this.root] - The starting node (default is root).
     * @param {Array<T>} [result=[]] - Accumulator for traversal result.
     * @returns {Array<T>} - The in-order traversal of the Treap values.
     */
    inOrderTraversal(node: TreapNode<T> | null = this.root, result: Array<T> = []): Array<T> {
        if (!node) return result;
        this.inOrderTraversal(node.left, result);
        result.push(node.value);
        this.inOrderTraversal(node.right, result);
        return result;
    }
}
