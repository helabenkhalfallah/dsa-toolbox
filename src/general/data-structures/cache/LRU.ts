/**
 * Class representing a node in the doubly linked list used by the LRU Cache.
 * Each node contains a key, a value, and pointers to the previous and next nodes.
 *
 * @template T - The type of value stored in the node.
 */
class LRUNode<T> {
    key: number;
    value: T;
    prev: LRUNode<T> | null;
    next: LRUNode<T> | null;

    /**
     * Creates an LRUNode.
     * @param {number} key - The unique key associated with this node.
     * @param {T} value - The value associated with this node.
     */
    constructor(key: number, value: T) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

/**
 * Class representing an LRU (Least Recently Used) Cache.
 * The cache evicts the least recently used items when the maximum capacity is reached.
 *
 * @template T - The type of values stored in the cache.
 *
 * @example
 * const cache = new LRUCache<number>(2); // Cache with capacity for 2 items
 * cache.put(1, 100);
 * cache.put(2, 200);
 * console.log(cache.get(1)); // Outputs: 100
 * cache.put(3, 300); // Evicts key 2 as it is the least recently used
 * console.log(cache.get(2)); // Outputs: null
 */
export class LRUCache<T> {
    private capacity: number;
    private cache: Map<number, LRUNode<T>>;
    private head: LRUNode<T>;
    private tail: LRUNode<T>;

    /**
     * Creates an instance of LRUCache.
     * @param {number} capacity - The maximum number of items the cache can hold.
     */
    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map<number, LRUNode<T>>();
        this.head = new LRUNode(0, null!); // Dummy head node
        this.tail = new LRUNode(0, null!); // Dummy tail node
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    /**
     * Retrieves the value associated with the specified key.
     * If the key exists, the node is moved to the head (most recently used).
     *
     * @param {number} key - The key to look up.
     * @returns {T | null} - The value associated with the key, or null if not found.
     */
    get(key: number): T | null {
        const node = this.cache.get(key);
        if (!node) return null;

        this.moveToHead(node);
        return node.value;
    }

    /**
     * Inserts or updates the value associated with the specified key.
     * If the key exists, it updates the value and moves the node to the head.
     * If the key is new, it adds the key-value pair and evicts the LRU item if over capacity.
     *
     * @param {number} key - The key to insert or update.
     * @param {T} value - The value to associate with the key.
     */
    put(key: number, value: T): void {
        const node = this.cache.get(key);
        if (node) {
            node.value = value;
            this.moveToHead(node);
        } else {
            const newNode = new LRUNode(key, value);
            this.cache.set(key, newNode);
            this.addNode(newNode);

            if (this.cache.size > this.capacity) {
                this.removeLRU();
            }
        }
    }

    /**
     * Moves an existing node to the head of the linked list, marking it as most recently used.
     *
     * @param {LRUNode<T>} node - The node to move.
     * @private
     */
    private moveToHead(node: LRUNode<T>): void {
        this.removeNode(node);
        this.addNode(node);
    }

    /**
     * Adds a node right after the head, marking it as most recently used.
     *
     * @param {LRUNode<T>} node - The node to add.
     * @private
     */
    private addNode(node: LRUNode<T>): void {
        node.prev = this.head;
        node.next = this.head.next;
        this.head.next!.prev = node;
        this.head.next = node;
    }

    /**
     * Removes a node from the doubly linked list.
     *
     * @param {LRUNode<T>} node - The node to remove.
     * @private
     */
    private removeNode(node: LRUNode<T>): void {
        const prevNode = node.prev;
        const nextNode = node.next;

        if (prevNode) prevNode.next = nextNode;
        if (nextNode) nextNode.prev = prevNode;
    }

    /**
     * Removes the least recently used node from the cache, which is the node right before the tail.
     *
     * @private
     */
    private removeLRU(): void {
        const lruNode = this.tail.prev!;
        this.removeNode(lruNode);
        this.cache.delete(lruNode.key);
    }
}
