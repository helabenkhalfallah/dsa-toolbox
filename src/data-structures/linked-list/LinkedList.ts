/**
 * Class representing a node in a singly linked list.
 * @template T - The type of value stored in the node.
 */
class LinkedListNode<T> {
    /** The value stored in the node */
    value: T;

    /** Pointer to the next node in the list */
    next: LinkedListNode<T> | null = null;

    /**
     * Creates an instance of a LinkedListNode.
     * @param {T} value - The value to store in the node.
     */
    constructor(value: T) {
        this.value = value;
    }
}

/**
 * Class representing a singly linked list.
 * @template T - The type of values stored in the list.
 */
export class LinkedList<T> {
    /** The head node of the list */
    private head: LinkedListNode<T> | null = null;

    /** The tail node of the list */
    private tail: LinkedListNode<T> | null = null;

    /** The current size of the list */
    private _size: number = 0;

    /**
     * Inserts a new value at the end of the list.
     * @param {T} value - The value to insert.
     */
    insert(value: T): void {
        const newNode = new LinkedListNode(value);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail!.next = newNode;
            this.tail = newNode;
        }
        this._size++;
    }

    /**
     * Retrieves the value at a specified index.
     * @param {number} index - The index of the value to retrieve.
     * @returns {T | null} - The value at the specified index or null if out of bounds.
     */
    getAt(index: number): T | null {
        if (index < 0 || index >= this._size) return null;

        let current = this.head;
        let currentIndex = 0;

        while (current) {
            if (currentIndex === index) return current.value;
            current = current.next;
            currentIndex++;
        }
        return null;
    }

    /**
     * Searches for a value in the list.
     * @param {T} value - The value to search for.
     * @returns {boolean} - True if the value is found, otherwise false.
     */
    search(value: T): boolean {
        let current = this.head;
        while (current) {
            if (current.value === value) return true;
            current = current.next;
        }
        return false;
    }

    /**
     * Deletes a value from the list.
     * Removes the first occurrence of the specified value.
     * @param {T} value - The value to delete.
     */
    delete(value: T): void {
        if (!this.head) return;

        // Special case if the value is at the head
        if (this.head.value === value) {
            this.head = this.head.next;
            if (!this.head) this.tail = null;
            this._size--;
            return;
        }

        let current = this.head;
        while (current.next && current.next.value !== value) {
            current = current.next;
        }

        // If the node with the value was found, update the pointers
        if (current.next) {
            current.next = current.next.next;
            if (!current.next) this.tail = current; // Update tail if the last node was deleted
            this._size--;
        }
    }

    /**
     * Gets the current size of the list.
     * @returns {number} - The number of nodes in the list.
     */
    size(): number {
        return this._size;
    }

    /**
     * Converts the list to an array for easy visualization.
     * @returns {T[]} - An array containing all values in the list.
     */
    toArray(): T[] {
        const result: T[] = [];
        let current = this.head;
        while (current) {
            result.push(current.value);
            current = current.next;
        }
        return result;
    }

    /**
     * Clears all nodes from the list, resetting it to an empty state.
     */
    clear(): void {
        this.head = null;
        this.tail = null;
        this._size = 0;
    }
}
