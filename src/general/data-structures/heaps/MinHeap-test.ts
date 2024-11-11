import { beforeEach, describe, expect, it } from 'vitest';

import { MinHeap } from './MinHeap.ts';

describe('MinHeap', () => {
    let minHeap: MinHeap<number>;

    beforeEach(() => {
        minHeap = new MinHeap<number>();
    });

    it('should insert elements and maintain the min-heap property', () => {
        minHeap.insert(20);
        minHeap.insert(15);
        minHeap.insert(10);
        minHeap.insert(17);

        expect(minHeap.root).toBe(10); // Root should be the minimum element
    });

    it('should extract the minimum element and maintain the min-heap property', () => {
        minHeap.insert(20);
        minHeap.insert(15);
        minHeap.insert(10);
        minHeap.insert(17);

        expect(minHeap.extractMin()).toBe(10);
        expect(minHeap.root).toBe(15); // New root should be the next minimum
    });

    it('should return null when extracting from an empty heap', () => {
        expect(minHeap.extractMin()).toBeNull();
    });

    it('should return the correct size of the heap', () => {
        expect(minHeap.size).toBe(0);
        minHeap.insert(20);
        minHeap.insert(15);
        expect(minHeap.size).toBe(2);
    });

    it('should return true if the heap is empty and false otherwise', () => {
        expect(minHeap.isEmpty()).toBe(true);
        minHeap.insert(10);
        expect(minHeap.isEmpty()).toBe(false);
    });

    it('should handle consecutive insertions and extractions correctly', () => {
        minHeap.insert(8);
        minHeap.insert(12);
        minHeap.insert(5);
        expect(minHeap.extractMin()).toBe(5);
        minHeap.insert(3);
        minHeap.insert(1);
        expect(minHeap.extractMin()).toBe(1);
        expect(minHeap.extractMin()).toBe(3);
        expect(minHeap.extractMin()).toBe(8);
        expect(minHeap.extractMin()).toBe(12);
        expect(minHeap.isEmpty()).toBe(true);
    });

    it('should maintain the min-heap property after multiple operations', () => {
        const values = [18, 12, 5, 9, 15, 7];
        values.forEach((val) => minHeap.insert(val));

        const sortedAsc = values.sort((a, b) => a - b);
        sortedAsc.forEach((val) => {
            expect(minHeap.extractMin()).toBe(val);
        });

        expect(minHeap.isEmpty()).toBe(true);
    });

    it('should return the root element without removing it', () => {
        minHeap.insert(25);
        minHeap.insert(17);
        minHeap.insert(20);
        expect(minHeap.root).toBe(17); // Check root
        expect(minHeap.size).toBe(3); // Ensure root was not removed
    });
});
