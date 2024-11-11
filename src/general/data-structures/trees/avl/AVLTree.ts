/**
 * Class representing a node in an AVL Tree.
 * Stores a value and maintains height information for balancing.
 * @template T - The type of the value stored in the node.
 */
export class AVLTreeNode<T> {
    /** The value stored in the node. */
    value: T;

    /** The height of the node, used to maintain AVL balance. */
    height: number = 1;

    /** Pointer to the left child node. */
    left: AVLTreeNode<T> | null = null;

    /** Pointer to the right child node. */
    right: AVLTreeNode<T> | null = null;

    /**
     * Creates an instance of AVLTreeNode.
     * @param {T} value - The value to store in the node.
     */
    constructor(value: T) {
        this.value = value;
    }
}

/**
 * Class representing an AVL Tree, a self-balancing binary search tree.
 * Ensures that the tree remains balanced after every insertion or deletion, maintaining efficient search, insertion, and deletion.
 * @template T - The type of values stored in the tree.
 */
export class AVLTree<T> {
    /** The root node of the AVL tree. */
    root: AVLTreeNode<T> | null = null;

    /**
     * Gets the height of a given node.
     * @param {AVLTreeNode<T> | null} node - The node to get the height of.
     * @returns {number} The height of the node, or 0 if null.
     * @private
     */
    private getHeight(node: AVLTreeNode<T> | null): number {
        return node ? node.height : 0;
    }

    /**
     * Performs a right rotation on the subtree rooted at the given node.
     * @param {AVLTreeNode<T>} y - The root of the subtree to rotate.
     * @returns {AVLTreeNode<T>} The new root after rotation.
     * @private
     */
    private rotateRight(y: AVLTreeNode<T>): AVLTreeNode<T> {
        const x = y.left!;
        const T2 = x.right;

        x.right = y;
        y.left = T2;

        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

        return x;
    }

    /**
     * Performs a left rotation on the subtree rooted at the given node.
     * @param {AVLTreeNode<T>} x - The root of the subtree to rotate.
     * @returns {AVLTreeNode<T>} The new root after rotation.
     * @private
     */
    private rotateLeft(x: AVLTreeNode<T>): AVLTreeNode<T> {
        const y = x.right!;
        const T2 = y.left;

        y.left = x;
        x.right = T2;

        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

        return y;
    }

    /**
     * Calculates the balance factor of a node to determine if rebalancing is needed.
     * @param {AVLTreeNode<T> | null} node - The node to calculate the balance factor for.
     * @returns {number} The balance factor (left height - right height).
     * @private
     */
    private getBalance(node: AVLTreeNode<T> | null): number {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }

    /**
     * Inserts a value into the AVL tree, maintaining balance.
     * @param {T} value - The value to insert.
     */
    insert(value: T): void {
        this.root = this._insert(this.root, value);
    }

    /**
     * Helper method to recursively insert a value, balancing the tree as necessary.
     * @param {AVLTreeNode<T> | null} node - The current node in the traversal.
     * @param {T} value - The value to insert.
     * @returns {AVLTreeNode<T>} The updated node after insertion and rebalancing.
     * @private
     */
    private _insert(node: AVLTreeNode<T> | null, value: T): AVLTreeNode<T> {
        if (!node) return new AVLTreeNode(value);

        if (value < node.value) {
            node.left = this._insert(node.left, value);
        } else if (value > node.value) {
            node.right = this._insert(node.right, value);
        } else {
            return node; // Duplicate values are not allowed
        }

        return this.rebalance(node);
    }

    /**
     * Searches for a value in the AVL tree.
     * @param {T} value - The value to search for.
     * @returns {boolean} True if the value is found, false otherwise.
     */
    search(value: T): boolean {
        return this._search(this.root, value);
    }

    /**
     * Helper method to recursively search for a value in the tree.
     * @param {AVLTreeNode<T> | null} node - The current node in the tree.
     * @param {T} value - The value to search for.
     * @returns {boolean} True if the value is found, false otherwise.
     * @private
     */
    private _search(node: AVLTreeNode<T> | null, value: T): boolean {
        if (!node) return false;
        if (value === node.value) return true;
        return value < node.value
            ? this._search(node.left, value)
            : this._search(node.right, value);
    }

    /**
     * Deletes a value from the AVL tree, maintaining balance.
     * @param {T} value - The value to delete.
     */
    delete(value: T): void {
        this.root = this._delete(this.root, value);
    }

    /**
     * Helper method to recursively delete a value, balancing the tree as needed.
     * @param {AVLTreeNode<T> | null} node - The current node in the tree.
     * @param {T} value - The value to delete.
     * @returns {AVLTreeNode<T> | null} The updated node after deletion and rebalancing.
     * @private
     */
    private _delete(node: AVLTreeNode<T> | null, value: T): AVLTreeNode<T> | null {
        if (!node) return null;

        if (value < node.value) {
            node.left = this._delete(node.left, value);
        } else if (value > node.value) {
            node.right = this._delete(node.right, value);
        } else {
            if (!node.left || !node.right) {
                node = node.left || node.right;
            } else {
                let successor = node.right;
                while (successor.left !== null) successor = successor.left;
                node.value = successor.value;
                node.right = this._delete(node.right, successor.value);
            }
        }

        return node ? this.rebalance(node) : null;
    }

    /**
     * Rebalances the subtree rooted at the specified node if it becomes unbalanced.
     * @param {AVLTreeNode<T>} node - The root of the subtree to rebalance.
     * @returns {AVLTreeNode<T>} The new root of the balanced subtree.
     * @private
     */
    private rebalance(node: AVLTreeNode<T>): AVLTreeNode<T> {
        node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
        const balance = this.getBalance(node);

        if (balance > 1 && this.getBalance(node.left) >= 0) return this.rotateRight(node);
        if (balance > 1 && this.getBalance(node.left) < 0) {
            node.left = this.rotateLeft(node.left!);
            return this.rotateRight(node);
        }
        if (balance < -1 && this.getBalance(node.right) <= 0) return this.rotateLeft(node);
        if (balance < -1 && this.getBalance(node.right) > 0) {
            node.right = this.rotateRight(node.right!);
            return this.rotateLeft(node);
        }

        return node;
    }
}
