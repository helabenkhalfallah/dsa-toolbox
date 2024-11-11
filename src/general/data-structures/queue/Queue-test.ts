import { describe, expect, it } from 'vitest';

import { Queue } from './Queue.ts';

describe('Queue', () => {
    it('should initialize with a size of 0', () => {
        const queue = new Queue<number>();
        expect(queue.size).toBe(0);
        expect(queue.isEmpty()).toBe(true);
    });

    it('should add elements to the queue and update size', () => {
        const queue = new Queue<number>();
        queue.enqueue(1);
        queue.enqueue(2);
        expect(queue.size).toBe(2);
        expect(queue.isEmpty()).toBe(false);
    });

    it('should return elements in FIFO order on dequeue', () => {
        const queue = new Queue<number>();
        queue.enqueue(1);
        queue.enqueue(2);
        queue.enqueue(3);

        expect(queue.dequeue()).toBe(1);
        expect(queue.dequeue()).toBe(2);
        expect(queue.dequeue()).toBe(3);
        expect(queue.isEmpty()).toBe(true);
    });

    it('should return undefined when dequeue is called on an empty queue', () => {
        const queue = new Queue<number>();
        expect(queue.dequeue()).toBeUndefined();
    });

    it('should allow peeking at the front element without dequeuing', () => {
        const queue = new Queue<number>();
        queue.enqueue(1);
        queue.enqueue(2);
        expect(queue.peek()).toBe(1); // Peek should show the first element
        expect(queue.size).toBe(2); // Size should remain the same
    });

    it('should return undefined when peek is called on an empty queue', () => {
        const queue = new Queue<number>();
        expect(queue.peek()).toBeUndefined();
    });

    it('should clear all elements from the queue', () => {
        const queue = new Queue<number>();
        queue.enqueue(1);
        queue.enqueue(2);
        queue.clear();
        expect(queue.size).toBe(0);
        expect(queue.isEmpty()).toBe(true);
        expect(queue.peek()).toBeUndefined();
    });
});
