/**
 * Class representing a node in a Binary Search Tree (BST).
 * Each node contains a value and pointers to its left and right children.
 * @template T - The type of value stored in the node.
 */
export class BinarySearchTreeNode<T> {
    /** The value stored in the node. */
    value: T;

    /** The left child of the node, or null if no left child exists. */
    left: BinarySearchTreeNode<T> | null = null;

    /** The right child of the node, or null if no right child exists. */
    right: BinarySearchTreeNode<T> | null = null;

    /**
     * Creates a new BinarySearchTreeNode.
     * @param {T} value - The value to store in the node.
     */
    constructor(value: T) {
        this.value = value;
    }
}

/**
 * Class representing a Binary Search Tree (BST).
 * A BST is a binary tree where each node has up to two children, and all nodes in the left subtree
 * have values less than the node’s value, while nodes in the right subtree have values greater.
 * @template T - The type of values stored in the tree nodes.
 */
export class BinarySearchTree<T> {
    /** Root node of the binary search tree, or null if the tree is empty. */
    root: BinarySearchTreeNode<T> | null = null;

    /**
     * Inserts a value into the binary search tree. By default, does not allow duplicate values.
     * @param {T} value - The value to be inserted.
     * @param {boolean} [allowDuplicates=false] - Flag to allow or disallow duplicate values.
     */
    insert(value: T, allowDuplicates: boolean = false): void {
        this.root = this._insert(this.root, value, allowDuplicates);
    }

    /**
     * Recursive helper function for inserting a value into the tree.
     * Creates a new node if the current node is null.
     * @private
     * @param {BinarySearchTreeNode<T> | null} node - The current node in the tree.
     * @param {T} value - The value to be inserted.
     * @param {boolean} allowDuplicates - Flag to allow or disallow duplicate values.
     * @returns {BinarySearchTreeNode<T>} - The updated node after insertion.
     */
    private _insert(
        node: BinarySearchTreeNode<T> | null,
        value: T,
        allowDuplicates: boolean,
    ): BinarySearchTreeNode<T> {
        if (node === null) {
            return new BinarySearchTreeNode(value);
        }
        if (this.comparator(value, node.value) < 0) {
            node.left = this._insert(node.left, value, allowDuplicates);
        } else if (this.comparator(value, node.value) > 0) {
            node.right = this._insert(node.right, value, allowDuplicates);
        } else if (allowDuplicates) {
            node.right = this._insert(node.right, value, allowDuplicates);
        }
        return node;
    }

    /**
     * Searches for a value in the binary search tree.
     * @param {T} value - The value to search for.
     * @returns {boolean} - True if the value is found, otherwise false.
     */
    search(value: T): boolean {
        return this._search(this.root, value);
    }

    /**
     * Recursive helper function for searching a value in the tree.
     * @private
     * @param {BinarySearchTreeNode<T> | null} node - The current node in the tree.
     * @param {T} value - The value to search for.
     * @returns {boolean} - True if the value is found, otherwise false.
     */
    private _search(node: BinarySearchTreeNode<T> | null, value: T): boolean {
        if (node === null) return false;
        if (value === node.value) return true;
        return this.comparator(value, node.value) < 0
            ? this._search(node.left, value)
            : this._search(node.right, value);
    }

    /**
     * Deletes a value from the binary search tree, if it exists.
     * @param {T} value - The value to be deleted.
     * @returns {boolean} - True if the value was deleted, otherwise false.
     */
    delete(value: T): boolean {
        const initialRoot = this.root;
        this.root = this._delete(this.root, value);
        return initialRoot !== this.root;
    }

    /**
     * Recursive helper function for deleting a value from the tree.
     * Adjusts the tree to maintain the BST properties after deletion.
     * @private
     * @param {BinarySearchTreeNode<T> | null} node - The current node in the tree.
     * @param {T} value - The value to be deleted.
     * @returns {BinarySearchTreeNode<T> | null} - The updated node after deletion.
     */
    private _delete(
        node: BinarySearchTreeNode<T> | null,
        value: T,
    ): BinarySearchTreeNode<T> | null {
        if (node === null) return null;

        if (this.comparator(value, node.value) < 0) {
            node.left = this._delete(node.left, value);
        } else if (this.comparator(value, node.value) > 0) {
            node.right = this._delete(node.right, value);
        } else {
            if (node.left === null) return node.right;
            if (node.right === null) return node.left;

            // Node with two children: Find the inorder successor (smallest in the right subtree)
            let successorParent = node;
            let successor = node.right;
            while (successor.left !== null) {
                successorParent = successor;
                successor = successor.left;
            }

            if (successorParent !== node) {
                successorParent.left = successor.right;
                successor.right = node.right;
            }

            successor.left = node.left;
            return successor;
        }
        return node;
    }

    /**
     * Generator function for in-order traversal of the tree.
     * Yields each node's value in ascending sorted order.
     * @returns {Generator<T>} - An iterator for the tree.
     */
    *inOrderTraversal(): Generator<T> {
        function* traverse(node: BinarySearchTreeNode<T> | null): Generator<T> {
            if (node) {
                yield* traverse(node.left);
                yield node.value;
                yield* traverse(node.right);
            }
        }
        yield* traverse(this.root);
    }

    /**
     * Enables in-order traversal with the `for...of` syntax.
     * @returns {Generator<T>} - An iterator for the tree values.
     */
    [Symbol.iterator](): Generator<T> {
        return this.inOrderTraversal();
    }

    /**
     * Comparator function to compare two values in the BST.
     * @param {T} a - The first value.
     * @param {T} b - The second value.
     * @returns {number} - Returns a negative number if a < b, a positive number if a > b, and 0 if they are equal.
     */
    private comparator(a: T, b: T): number {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }
}
