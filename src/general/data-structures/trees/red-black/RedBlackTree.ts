import { ComparableNode } from '../../../commons/ComparableNode.ts';

/**
 * Enum representing the color of a Red-Black Tree node.
 */
export enum Color {
    /** Red color */
    RED,
    /** Black color */
    BLACK,
}

/**
 * Class representing a node in a Red-Black Tree.
 * @template T - The type of value stored in the node.
 */
export class RedBlackTreeNode<T> {
    /** The value of the node */
    value: T;

    /** The color of the node (either RED or BLACK) */
    color: Color;

    /** The left child of the node */
    left: RedBlackTreeNode<T> | null = null;

    /** The right child of the node */
    right: RedBlackTreeNode<T> | null = null;

    /** The parent node */
    parent: RedBlackTreeNode<T> | null = null;

    /** The size of the node */
    size: number = 1;

    /**
     * Creates an instance of a RedBlackTreeNode.
     * @param {T} value - The value to store in the node.
     * @param {Color} color - The color of the node (default is RED).
     */
    constructor(value: T, color: Color = Color.RED) {
        this.value = value;
        this.color = color;
    }
}

/**
 * Class representing a Red-Black Tree data structure.
 * @template T - The type of values stored in the tree.
 */
export class RedBlackTree<T> {
    /** The root node of the Red-Black Tree */
    private root: RedBlackTreeNode<T> | null = null;

    /**
     * Gets the size of a node's subtree.
     * @param {RedBlackTreeNode<T> | null} node - The node to get the size of.
     * @returns {number} - The size of the subtree, or 0 if the node is null.
     * @private
     */
    private getSize(node: RedBlackTreeNode<T> | null): number {
        return node ? node.size : 0;
    }

    /**
     * Updates the size of a node based on the sizes of its children.
     * @param {RedBlackTreeNode<T>} node - The node to update the size of.
     * @private
     */
    private updateSize(node: RedBlackTreeNode<T>): void {
        node.size = 1 + this.getSize(node.left) + this.getSize(node.right);
    }

    /**
     * Updates the sizes of nodes up the tree, starting from a specified node.
     * This method is called after insertions or deletions to ensure that the
     * size values are correct.
     * @param {RedBlackTreeNode<T>} node - The starting node.
     * @private
     */
    private updateSizeUpwards(node: RedBlackTreeNode<T>): void {
        while (node) {
            this.updateSize(node);
            node = node.parent;
        }
    }

    /**
     * Retrieves the size of the entire tree.
     * @returns {number} - The size of the tree.
     */
    size(): number {
        return this.getSize(this.root);
    }

    /**
     * Compares two nodes in the tree.
     * @param {T} a - The first value to compare.
     * @param {T} b - The second value to compare.
     * @returns {number} - A negative number if a < b, 0 if a == b, and a positive number if a > b.
     * @private
     */
    private compareNodes(a: T, b: T): number {
        if (a instanceof ComparableNode && b instanceof ComparableNode) {
            return a.compare(b);
        } else if (typeof a === 'number' && typeof b === 'number') {
            return a - b;
        } else if (typeof a === 'string' && typeof b === 'string') {
            return a.localeCompare(b);
        } else {
            throw new Error(
                'Cannot compare nodes. Expected either ComparableNode instances or comparable primitive types.',
            );
        }
    }

    /**
     * Recursive function to search for a value in the tree.
     * @param {RedBlackTreeNode<T> | null} node - The current node.
     * @param {T} value - The value to search for.
     * @returns {boolean} - Whether the value is found.
     * @private
     */
    private _search(node: RedBlackTreeNode<T> | null, value: T): boolean {
        if (node === null) {
            return false;
        }

        if (this.compareNodes(value, node.value) === 0) {
            return true; // Value found!
        }

        if (node.left && this.compareNodes(value, node.left.value) === 0) {
            return true; // Value found in left child!
        }

        if (node.right && this.compareNodes(value, node.right.value) === 0) {
            return true; // Value found in right child!
        }

        return this.compareNodes(value, node.value) < 0
            ? this._search(node.left, value)
            : this._search(node.right, value);
    }

    /**
     * Searches for a value in the Red-Black Tree.
     * @param {T} value - The value to search for.
     * @returns {boolean} - Returns true if the value is found, otherwise false.
     */
    search(value: T): boolean {
        return this._search(this.root, value);
    }

    /**
     * Deletes a value from the Red-Black Tree.
     * @param {T} value - The value to delete.
     */
    delete(value: T): void {
        const nodeToDelete = this.findNode(value);
        if (!nodeToDelete) return;

        this.deleteNode(nodeToDelete);

        // Update the size of the tree after deletion
        if (this.root) {
            this.updateSizeUpwards(this.root);
        }
    }

    /**
     * Helper function to insert a node into the tree recursively.
     * @param {RedBlackTreeNode<T> | null} node - The current node in the tree.
     * @param {RedBlackTreeNode<T>} newNode - The new node to insert.
     * @returns {RedBlackTreeNode<T> | null} - The root node after insertion.
     * @private
     */
    private _insert(
        node: RedBlackTreeNode<T> | null,
        newNode: RedBlackTreeNode<T>,
    ): RedBlackTreeNode<T> | null {
        if (node === null) return newNode;

        const comparison = this.compareNodes(newNode.value, node.value);

        if (comparison < 0) {
            node.left = this._insert(node.left, newNode);
            if (node.left) node.left.parent = node;
        } else if (comparison > 0) {
            node.right = this._insert(node.right, newNode);
            if (node.right) node.right.parent = node;
        }
        return node;
    }

    /**
     * Fixes the Red-Black Tree properties after insertion.
     * @param {RedBlackTreeNode<T>} node - The node to start the fix from.
     */
    private fixInsert(node: RedBlackTreeNode<T>): void {
        while (node !== this.root && node.parent?.color === Color.RED) {
            const parent = node.parent!;
            const grandparent = parent.parent;

            if (!grandparent) break; // Ensure grandparent is not null

            if (parent === grandparent.left) {
                const uncle = grandparent.right;
                if (uncle && uncle.color === Color.RED) {
                    parent.color = Color.BLACK;
                    uncle.color = Color.BLACK;
                    grandparent.color = Color.RED;
                    node = grandparent;
                } else {
                    if (node === parent.right) {
                        node = parent;
                        this.rotateLeft(node);
                    }
                    parent.color = Color.BLACK;
                    grandparent.color = Color.RED;
                    this.rotateRight(grandparent);
                }
            } else {
                const uncle = grandparent.left;
                if (uncle && uncle.color === Color.RED) {
                    parent.color = Color.BLACK;
                    uncle.color = Color.BLACK;
                    grandparent.color = Color.RED;
                    node = grandparent;
                } else {
                    if (node === parent.left) {
                        node = parent;
                        this.rotateRight(node);
                    }
                    parent.color = Color.BLACK;
                    grandparent.color = Color.RED;
                    this.rotateLeft(grandparent);
                }
            }
        }
        this.root!.color = Color.BLACK;
    }

    /**
     * Left rotation operation for balancing the tree.
     * @param {RedBlackTreeNode<T>} x - The node to rotate.
     */
    private rotateLeft(x: RedBlackTreeNode<T>): void {
        const y = x.right!;
        x.right = y.left;
        if (y.left) y.left.parent = x;
        y.parent = x.parent;
        if (!x.parent) {
            this.root = y;
        } else if (x === x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }
        y.left = x;
        x.parent = y;
    }

    /**
     * Right rotation operation for balancing the tree.
     * @param {RedBlackTreeNode<T>} x - The node to rotate.
     */
    private rotateRight(x: RedBlackTreeNode<T>): void {
        const y = x.left!;
        x.left = y.right;
        if (y.right) y.right.parent = x;
        y.parent = x.parent;
        if (!x.parent) {
            this.root = y;
        } else if (x === x.parent.right) {
            x.parent.right = y;
        } else {
            x.parent.left = y;
        }
        y.right = x;
        x.parent = y;
    }

    /**
     * Inserts a value into the Red-Black Tree.
     * @param {T} value - The value to insert.
     */
    insert(value: T): void {
        const newNode = new RedBlackTreeNode(value);
        this.root = this._insert(this.root, newNode);
        this.fixInsert(newNode);
        this.updateSizeUpwards(newNode);
    }

    /**
     * Finds a node with the specified value.
     * @param {T} value - The value to search for.
     * @returns {RedBlackTreeNode<T> | null} - The found node, or null if not found.
     * @private
     */
    private findNode(value: T): RedBlackTreeNode<T> | null {
        let node = this.root;
        while (node) {
            if (this.compareNodes(value, node.value) === 0) return node;
            node = this.compareNodes(value, node.value) < 0 ? node.left : node.right;
        }
        return null;
    }

    /**
     * Fixes the Red-Black Tree properties after deletion.
     * @param {RedBlackTreeNode<T> | null} x - The node to fix from.
     * @private
     */
    private fixDelete(x: RedBlackTreeNode<T> | null): void {
        while (x !== this.root && (!x || x.color === Color.BLACK)) {
            if (x && x.parent && x === x.parent.left) {
                let sibling = x.parent.right;
                if (sibling && sibling.color === Color.RED) {
                    sibling.color = Color.BLACK;
                    x.parent.color = Color.RED;
                    this.rotateLeft(x.parent);
                    sibling = x.parent.right;
                }
                if (
                    sibling &&
                    (!sibling.left || sibling.left.color === Color.BLACK) &&
                    (!sibling.right || sibling.right.color === Color.BLACK)
                ) {
                    sibling.color = Color.RED;
                    x = x.parent;
                } else if (sibling) {
                    if (!sibling.right || sibling.right.color === Color.BLACK) {
                        if (sibling.left) sibling.left.color = Color.BLACK;
                        sibling.color = Color.RED;
                        this.rotateRight(sibling);
                        sibling = x.parent.right;
                    }
                    sibling.color = x.parent.color;
                    x.parent.color = Color.BLACK;
                    if (sibling.right) sibling.right.color = Color.BLACK;
                    this.rotateLeft(x.parent);
                    x = this.root;
                }
            } else if (x && x.parent) {
                // Symmetric case for x being a right child
                let sibling = x.parent.left;
                if (sibling && sibling.color === Color.RED) {
                    sibling.color = Color.BLACK;
                    x.parent.color = Color.RED;
                    this.rotateRight(x.parent);
                    sibling = x.parent.left;
                }
                if (
                    sibling &&
                    (!sibling.right || sibling.right.color === Color.BLACK) &&
                    (!sibling.left || sibling.left.color === Color.BLACK)
                ) {
                    sibling.color = Color.RED;
                    x = x.parent;
                } else if (sibling) {
                    if (!sibling.left || sibling.left.color === Color.BLACK) {
                        if (sibling.right) sibling.right.color = Color.BLACK;
                        sibling.color = Color.RED;
                        this.rotateLeft(sibling);
                        sibling = x.parent.left;
                    }
                    sibling.color = x.parent.color;
                    x.parent.color = Color.BLACK;
                    if (sibling.left) sibling.left.color = Color.BLACK;
                    this.rotateRight(x.parent);
                    x = this.root;
                }
            } else {
                break; // Exit the loop if x becomes null or x.parent becomes null
            }

            // Move x up the tree
            x = x?.parent;
        }
        if (x) x.color = Color.BLACK;
    }

    /**
     * Deletes a specified node from the tree and fixes tree properties.
     * @param {RedBlackTreeNode<T>} node - The node to delete.
     * @private
     */
    private deleteNode(node: RedBlackTreeNode<T>): void {
        let y: RedBlackTreeNode<T> = node;
        let originalColor = y.color;
        let x: RedBlackTreeNode<T> | null = null;

        if (!node.left) {
            x = node.right;
            this.transplant(node, node.right);
        } else if (!node.right) {
            x = node.left;
            this.transplant(node, node.left);
        } else {
            y = this.minimum(node.right);
            originalColor = y.color;
            x = y.right;

            if (y.parent === node) {
                if (x) x.parent = y;
            } else {
                this.transplant(y, y.right);
                y.right = node.right;
                if (y.right) y.right.parent = y;
            }

            this.transplant(node, y);
            y.left = node.left;
            if (y.left) y.left.parent = y;
            y.color = node.color;

            // Update the size of 'y'
            this.updateSize(y);

            // Update the size of y.right (crucial!)
            if (y.right) this.updateSize(y.right);
        }

        if (originalColor === Color.BLACK) {
            this.fixDelete(x);
        }
    }

    /**
     * Transplants one subtree in place of another.
     * @param {RedBlackTreeNode<T>} u - The node to be replaced.
     * @param {RedBlackTreeNode<T> | null} v - The replacement node.
     * @private
     */
    private transplant(u: RedBlackTreeNode<T>, v: RedBlackTreeNode<T> | null): void {
        if (!u.parent) {
            this.root = v;
        } else if (u === u.parent.left) {
            u.parent.left = v;
        } else {
            u.parent.right = v;
        }
        if (v) v.parent = u.parent;
    }

    /**
     * Finds the minimum node starting from a given node.
     * @param {RedBlackTreeNode<T>} node - The node to start from.
     * @returns {RedBlackTreeNode<T>} - The minimum node.
     * @private
     */
    private minimum(node: RedBlackTreeNode<T>): RedBlackTreeNode<T> {
        while (node.left) {
            node = node.left;
        }
        return node;
    }

    /**
     * Helper method for recursively performing in-order traversal.
     * @param {RedBlackTreeNode<T> | null} node - The current node.
     * @param {(value: T) => void} callback - A callback function to apply to each node's value.
     * @private
     */
    private _inOrderTraverse(node: RedBlackTreeNode<T> | null, callback: (value: T) => void): void {
        if (node !== null) {
            this._inOrderTraverse(node.left, callback);
            callback(node.value);
            this._inOrderTraverse(node.right, callback);
        }
    }

    /**
     * Performs an in-order traversal of the Red-Black Tree.
     * @param {(value: T) => void} callback - A callback function to apply to each node's value.
     */
    inOrderTraverse(callback: (value: T) => void): void {
        this._inOrderTraverse(this.root, callback);
    }

    /**
     * Gets the root node of the Red-Black Tree.
     * @returns {RedBlackTreeNode<T> | null} The root node, or null if the tree is empty.
     */
    getRoot(): RedBlackTreeNode<T> | null {
        return this.root;
    }
}
