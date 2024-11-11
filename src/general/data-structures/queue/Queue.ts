/**
 * Represents a node in the Queue.
 * Each node holds a value and a pointer to the next node.
 *
 * @template T - The type of value stored in the node.
 */
class QueueNode<T> {
    /** The value stored in the node */
    value: T;

    /** Pointer to the next node in the queue, or null if none */
    next: QueueNode<T> | null = null;

    /**
     * Creates a new QueueNode.
     * @param {T} value - The value of the node.
     */
    constructor(value: T) {
        this.value = value;
    }
}

/**
 * Queue data structure implemented with a linked list for efficient O(1) enqueue and dequeue operations.
 * Supports standard queue operations such as enqueue, dequeue, and peek.
 *
 * @template T - The type of elements held in the queue.
 */
export class Queue<T> {
    /** The head (front) node of the queue, or null if the queue is empty */
    private head: QueueNode<T> | null = null;

    /** The tail (back) node of the queue, or null if the queue is empty */
    private tail: QueueNode<T> | null = null;

    /** The current number of elements in the queue */
    private _size = 0;

    /**
     * Gets the number of elements in the queue.
     * @returns {number} The size of the queue.
     */
    get size(): number {
        return this._size;
    }

    /**
     * Checks if the queue is empty.
     * @returns {boolean} True if the queue is empty, otherwise false.
     */
    isEmpty(): boolean {
        return this._size === 0;
    }

    /**
     * Adds an element to the end of the queue.
     * @param {T} value - The value to add.
     */
    enqueue(value: T): void {
        const newNode = new QueueNode(value);
        if (this.tail) {
            this.tail.next = newNode;
        } else {
            this.head = newNode; // Set head if the queue was empty
        }
        this.tail = newNode;
        this._size++;
    }

    /**
     * Removes and returns the element at the front of the queue.
     * @returns {T | undefined} The value of the dequeued element, or undefined if the queue is empty.
     */
    dequeue(): T | undefined {
        if (!this.head) return undefined;
        const dequeuedValue = this.head.value;
        this.head = this.head.next;
        if (!this.head) {
            this.tail = null; // Reset tail if the queue becomes empty
        }
        this._size--;
        return dequeuedValue;
    }

    /**
     * Returns the element at the front of the queue without removing it.
     * @returns {T | undefined} The value at the front, or undefined if the queue is empty.
     */
    peek(): T | undefined {
        return this.head?.value;
    }

    /**
     * Clears all elements from the queue, resetting it to an empty state.
     */
    clear(): void {
        this.head = null;
        this.tail = null;
        this._size = 0;
    }
}
