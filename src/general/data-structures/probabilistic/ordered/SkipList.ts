/**
 * Node class representing each element in the Skip List.
 */
class SkipListNode<T> {
    value: T | null; // The value stored in the node
    forward: Array<SkipListNode<T> | null>; // Array of forward pointers

    /**
     * Creates a new SkipListNode.
     * @param {T | null} value - The value to be stored in the node (can be null for head node).
     * @param {number} level - The level of the node.
     */
    constructor(value: T | null, level: number) {
        this.value = value;
        this.forward = Array(level + 1).fill(null);
    }
}

/**
 * Class representing a Skip List data structure.
 */
export class SkipList<T> {
    private head: SkipListNode<T>; // Head node of the Skip List
    private maxLevel: number; // Maximum level of the Skip List
    private level: number; // Current highest level of nodes in the Skip List
    private readonly p: number; // Probability factor for level generation

    /**
     * Creates a new SkipList.
     * @param {number} maxLevel - The maximum level of the Skip List.
     * @param {number} [p=0.5] - Probability factor for level generation (default is 0.5).
     */
    constructor(maxLevel = 16, p = 0.5) {
        this.head = new SkipListNode<T>(null, maxLevel); // Initialize head node
        this.maxLevel = maxLevel;
        this.p = p;
        this.level = 0; // Initially, the skip list is empty
    }

    /**
     * Inserts a value into the Skip List.
     * @param {T} value - The value to insert.
     */
    insert(value: T): void {
        const update: Array<SkipListNode<T> | null> = Array(this.maxLevel + 1).fill(null);
        let current = this.head;

        // Find position to insert the new node
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] && current.forward[i]!.value! < value) {
                current = current.forward[i]!;
            }
            update[i] = current;
        }

        current = current.forward[0];

        // Insert the new node if the value is not already present
        if (!current || current.value !== value) {
            const newLevel = this.randomLevel();
            if (newLevel > this.level) {
                for (let i = this.level + 1; i <= newLevel; i++) {
                    update[i] = this.head;
                }
                this.level = newLevel;
            }

            const newNode = new SkipListNode(value, newLevel);
            for (let i = 0; i <= newLevel; i++) {
                newNode.forward[i] = update[i]!.forward[i];
                update[i]!.forward[i] = newNode;
            }
        }
    }

    /**
     * Deletes a value from the Skip List.
     * @param {T} value - The value to delete.
     */
    delete(value: T): void {
        const update: Array<SkipListNode<T> | null> = Array(this.maxLevel + 1).fill(null);
        let current = this.head;

        // Locate nodes that need their forward pointers updated after deletion
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] && current.forward[i]!.value! < value) {
                current = current.forward[i]!;
            }
            update[i] = current;
        }

        current = current.forward[0];

        // If found, remove the node and adjust levels if necessary
        if (current && current.value === value) {
            for (let i = 0; i <= this.level; i++) {
                if (update[i]!.forward[i] !== current) break;
                update[i]!.forward[i] = current.forward[i];
            }

            while (this.level > 0 && !this.head.forward[this.level]) {
                this.level--;
            }
        }
    }

    /**
     * Searches for a value in the Skip List.
     * @param {T} value - The value to search for.
     * @returns {boolean} True if the value is found, false otherwise.
     */
    find(value: T): boolean {
        let current = this.head;

        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] && current.forward[i]!.value! < value) {
                current = current.forward[i]!;
            }
        }

        current = current.forward[0];
        return !!current && current.value === value;
    }

    /**
     * Retrieves the minimum value in the Skip List.
     * @returns {T | null} The minimum value or null if the list is empty.
     */
    min(): T | null {
        return this.head.forward[0]?.value || null;
    }

    /**
     * Retrieves the maximum value in the Skip List.
     * @returns {T | null} The maximum value or null if the list is empty.
     */
    max(): T | null {
        let current = this.head;
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i]) {
                current = current.forward[i]!;
            }
        }
        return current.value;
    }

    /**
     * Generates a random level for a new node based on probability p.
     * @returns {number} The generated level.
     */
    private randomLevel(): number {
        let lvl = 0;
        while (Math.random() < this.p && lvl < this.maxLevel) {
            lvl++;
        }
        return lvl;
    }
}
