import { beforeEach, describe, expect, it } from 'vitest';

import { MaxHeap } from './MaxHeap.ts';

describe('MaxHeap', () => {
    let maxHeap: MaxHeap<number>;

    beforeEach(() => {
        maxHeap = new MaxHeap<number>();
    });

    it('should insert elements and maintain the max-heap property', () => {
        maxHeap.insert(10);
        maxHeap.insert(15);
        maxHeap.insert(20);
        maxHeap.insert(17);

        expect(maxHeap.root).toBe(20); // Root should be the maximum element
    });

    it('should extract the maximum element and maintain the max-heap property', () => {
        maxHeap.insert(10);
        maxHeap.insert(15);
        maxHeap.insert(20);
        maxHeap.insert(17);

        expect(maxHeap.extractMax()).toBe(20);
        expect(maxHeap.root).toBe(17); // New root should be the next maximum
    });

    it('should return null when extracting from an empty heap', () => {
        expect(maxHeap.extractMax()).toBeNull();
    });

    it('should return the correct size of the heap', () => {
        expect(maxHeap.size).toBe(0);
        maxHeap.insert(10);
        maxHeap.insert(15);
        expect(maxHeap.size).toBe(2);
    });

    it('should return true if the heap is empty and false otherwise', () => {
        expect(maxHeap.isEmpty()).toBe(true);
        maxHeap.insert(5);
        expect(maxHeap.isEmpty()).toBe(false);
    });

    it('should handle consecutive insertions and extractions correctly', () => {
        maxHeap.insert(5);
        maxHeap.insert(10);
        maxHeap.insert(15);
        expect(maxHeap.extractMax()).toBe(15);
        maxHeap.insert(7);
        maxHeap.insert(20);
        expect(maxHeap.extractMax()).toBe(20);
        expect(maxHeap.extractMax()).toBe(10);
        expect(maxHeap.extractMax()).toBe(7);
        expect(maxHeap.extractMax()).toBe(5);
        expect(maxHeap.isEmpty()).toBe(true);
    });

    it('should maintain the max-heap property after multiple operations', () => {
        const values = [3, 8, 10, 1, 6, 14, 9];
        values.forEach((val) => maxHeap.insert(val));

        const sortedDesc = values.sort((a, b) => b - a);
        sortedDesc.forEach((val) => {
            expect(maxHeap.extractMax()).toBe(val);
        });

        expect(maxHeap.isEmpty()).toBe(true);
    });

    it('should return the root element without removing it', () => {
        maxHeap.insert(30);
        maxHeap.insert(20);
        maxHeap.insert(25);
        expect(maxHeap.root).toBe(30); // Check root
        expect(maxHeap.size).toBe(3); // Ensure root was not removed
    });
});
