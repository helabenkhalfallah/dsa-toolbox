/**
 * Class representing a node in the B-Tree.
 * Each node contains a list of keys and a list of child nodes, forming the structure of the B-Tree.
 * @template T - The type of keys stored in the node.
 */
export class BTreeNode<T> {
    /** Array of keys in the node. */
    keys: T[] = [];

    /** Array of child nodes. */
    children: BTreeNode<T>[] = [];

    /** Indicates whether the node is a leaf. */
    leaf: boolean;

    /**
     * Creates an instance of BTreeNode.
     * @param {boolean} leaf - Indicates whether the node is a leaf.
     */
    constructor(leaf: boolean) {
        this.leaf = leaf;
    }
}

/**
 * Class representing a B-Tree, a balanced tree structure for efficient insertion, deletion, and search operations.
 * Each node can have a variable number of keys and child nodes, based on the minimum degree.
 * @template T - The type of keys stored in the tree.
 */
export class BTree<T> {
    private root: BTreeNode<T> | null = null;
    private readonly t: number; // Minimum degree (defines the range for the number of keys in nodes)
    private _version = 0;
    private comparator: (a: T, b: T) => number;

    /**
     * Creates an instance of BTree.
     * @param {number} t - Minimum degree (defines the range for the number of keys in nodes).
     * @param comparator - A comparator function for comparing keys.
     */
    constructor(t: number, comparator: (a: T, b: T) => number) {
        if (t < 2) throw new Error('Minimum degree must be at least 2');
        this.t = t;
        this.comparator = comparator;
    }

    /**
     * Searches for a key in the B-Tree, starting from the root or a specified node.
     * @param {T} key - The key to search for.
     * @param {BTreeNode<T> | null} [node=this.root] - The node to start the search from.
     * @returns {BTreeNode<T> | null} - The node containing the key, or null if not found.
     */
    search(key: T, node: BTreeNode<T> | null = this.root): BTreeNode<T> | null {
        if (!node) return null;

        let i = 0;
        while (i < node.keys.length && this.comparator(key, node.keys[i]) > 0) {
            i++;
        }

        if (i < node.keys.length && this.comparator(key, node.keys[i]) === 0) {
            return node;
        }

        if (node.leaf) return null;

        return this.search(key, node.children[i]);
    }

    /**
     * Inserts a key into the B-Tree, balancing nodes as needed.
     * @param {T} key - The key to insert.
     */
    insert(key: T): void {
        if (!this.root) {
            this.root = new BTreeNode<T>(true);
            this.root.keys.push(key);
        } else {
            if (this.root.keys.length === 2 * this.t - 1) {
                const newRoot = new BTreeNode<T>(false);
                newRoot.children.push(this.root);
                this.splitChild(newRoot, 0, this.root);
                this.root = newRoot;
            }
            this.insertNonFull(this.root, key);
        }
    }

    /**
     * Deletes a key from the B-Tree, adjusting nodes to maintain the B-Tree properties.
     * @param {T} key - The key to delete.
     */
    delete(key: T): void {
        if (!this.root) return;

        this.deleteFromNode(this.root, key);

        if (this.root.keys.length === 0) {
            this.root = this.root.leaf ? null : this.root.children[0];
        }
    }

    /**
     * Inserts a key into a non-full node, maintaining the sorted order of keys within the node.
     * @param {BTreeNode<T>} node - The node to insert into.
     * @param {T} key - The key to insert.
     * @private
     */
    private insertNonFull(node: BTreeNode<T>, key: T): void {
        let i = node.keys.length - 1;

        if (node.leaf) {
            while (i >= 0 && this.comparator(key, node.keys[i]) < 0) {
                i--;
            }
            node.keys.splice(i + 1, 0, key);
        } else {
            while (i >= 0 && this.comparator(key, node.keys[i]) < 0) {
                i--;
            }
            i++;

            if (node.children[i].keys.length === 2 * this.t - 1) {
                this.splitChild(node, i, node.children[i]);
                if (this.comparator(key, node.keys[i]) > 0) {
                    i++;
                }
            }
            this.insertNonFull(node.children[i], key);
        }
    }

    /**
     * Splits a child node of a parent node when it exceeds the maximum number of keys.
     * @param {BTreeNode<T>} parent - The parent node.
     * @param {number} i - The index of the child to split.
     * @param {BTreeNode<T>} child - The child node to split.
     * @private
     */
    private splitChild(parent: BTreeNode<T>, i: number, child: BTreeNode<T>): void {
        const t = this.t;
        const newNode = new BTreeNode<T>(child.leaf);

        newNode.keys = child.keys.splice(t, t - 1);
        if (!child.leaf) {
            newNode.children = child.children.splice(t);
        }

        parent.children.splice(i + 1, 0, newNode);
        parent.keys.splice(i, 0, child.keys.pop()!);
    }

    /**
     * Deletes a key from a specific node, adjusting the tree as necessary.
     * @param {BTreeNode<T>} node - The node to delete from.
     * @param {T} key - The key to delete.
     * @private
     */
    private deleteFromNode(node: BTreeNode<T>, key: T): void {
        if (!node) return;

        const i = node.keys.findIndex((k) => this.comparator(k, key) === 0);

        if (i !== -1) {
            if (node.leaf) {
                node.keys.splice(i, 1);
            } else {
                if (node.children[i].keys.length >= this.t) {
                    const pred = this.getPredecessor(node, i);
                    node.keys[i] = pred;
                    this.deleteFromNode(node.children[i], pred);
                } else if (node.children[i + 1].keys.length >= this.t) {
                    const succ = this.getSuccessor(node, i);
                    node.keys[i] = succ;
                    this.deleteFromNode(node.children[i + 1], succ);
                } else {
                    this.merge(node, i);
                    this.deleteFromNode(node.children[i], key);
                }
            }
        } else {
            if (node.leaf) return;

            let childIndex = node.keys.findIndex((k) => this.comparator(key, k) < 0);
            if (childIndex === -1) childIndex = node.children.length - 1;

            if (node.children[childIndex].keys.length < this.t) {
                this.fill(node, childIndex);
            }

            this.deleteFromNode(node.children[childIndex], key);
        }
    }

    /**
     * Gets the predecessor key of a specified key within a node.
     * @param {BTreeNode<T>} node - The node.
     * @param {number} idx - The index of the key.
     * @returns {T} - The predecessor key.
     * @private
     */
    private getPredecessor(node: BTreeNode<T>, idx: number): T {
        let current = node.children[idx];
        while (!current.leaf) {
            current = current.children[current.keys.length];
        }
        return current.keys[current.keys.length - 1];
    }

    /**
     * Gets the successor key of a specified key within a node.
     * @param {BTreeNode<T>} node - The node.
     * @param {number} idx - The index of the key.
     * @returns {T} - The successor key.
     * @private
     */
    private getSuccessor(node: BTreeNode<T>, idx: number): T {
        let current = node.children[idx + 1];
        while (!current.leaf) {
            current = current.children[0];
        }
        return current.keys[0];
    }

    /**
     * Ensures a child node has at least the minimum number of keys by borrowing or merging nodes.
     * @param {BTreeNode<T>} node - The parent node.
     * @param {number} i - The index of the child node.
     * @private
     */
    private fill(node: BTreeNode<T>, i: number): void {
        if (i > 0 && node.children[i - 1].keys.length >= this.t) {
            this.borrowFromPrev(node, i);
        } else if (i < node.keys.length && node.children[i + 1].keys.length >= this.t) {
            this.borrowFromNext(node, i);
        } else {
            if (i < node.keys.length) {
                this.merge(node, i);
            } else {
                this.merge(node, i - 1);
            }
        }
    }

    /**
     * Borrows a key from the previous sibling of a specified child.
     * @param {BTreeNode<T>} node - The parent node.
     * @param {number} i - The index of the child to borrow into.
     * @private
     */
    private borrowFromPrev(node: BTreeNode<T>, i: number): void {
        const child = node.children[i];
        const sibling = node.children[i - 1];

        child.keys.unshift(node.keys[i - 1]);
        node.keys[i - 1] = sibling.keys.pop()!;

        if (!child.leaf) {
            child.children.unshift(sibling.children.pop()!);
        }
    }

    /**
     * Borrows a key from the next sibling of a specified child.
     * @param {BTreeNode<T>} node - The parent node.
     * @param {number} i - The index of the child to borrow into.
     * @private
     */
    private borrowFromNext(node: BTreeNode<T>, i: number): void {
        const child = node.children[i];
        const sibling = node.children[i + 1];

        child.keys.push(node.keys[i]);
        node.keys[i] = sibling.keys.shift()!;

        if (!child.leaf) {
            child.children.push(sibling.children.shift()!);
        }
    }

    /**
     * Merges a child with its next sibling and adjusts the parent's keys and children.
     * @param {BTreeNode<T>} node - The parent node.
     * @param {number} i - The index of the child to merge.
     * @private
     */
    private merge(node: BTreeNode<T>, i: number): void {
        const child = node.children[i];
        const sibling = node.children[i + 1];

        child.keys.push(node.keys[i]);
        child.keys.push(...sibling.keys);
        if (!child.leaf) {
            child.children.push(...sibling.children);
        }

        node.keys.splice(i, 1);
        node.children.splice(i + 1, 1);
    }

    /**
     * Prints the B-Tree structure for visualization, showing levels and keys at each node.
     * @param node - The node to print (default is the root).
     * @param depth - The current level of the node.
     * @returns {string} - The string representation of the tree.
     */
    print(node: BTreeNode<T> = this.root, depth: number = 0): string {
        if (!node) return '';
        let result = '  '.repeat(depth) + `Level ${depth}: ${node.keys.join(', ')}\n`;
        if (!node.leaf) {
            node.children.forEach((child) => {
                result += this.print(child, depth + 1);
            });
        }
        return result;
    }
}
