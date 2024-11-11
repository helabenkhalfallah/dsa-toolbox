import { beforeEach, describe, expect, it } from 'vitest';

import { DoublyLinkedList } from './DoublyLinkedList.ts';

describe('DoublyLinkedList', () => {
    let list: DoublyLinkedList<number>;

    beforeEach(() => {
        list = new DoublyLinkedList<number>();
    });

    it('should insert values into the list and maintain order', () => {
        list.insert(10);
        list.insert(20);
        list.insert(30);
        expect(list.toArray()).toEqual([10, 20, 30]);
        expect(list.size()).toBe(3);
    });

    it('should retrieve values by index', () => {
        list.insert(10);
        list.insert(20);
        list.insert(30);
        expect(list.getAt(0)).toBe(10);
        expect(list.getAt(1)).toBe(20);
        expect(list.getAt(2)).toBe(30);
        expect(list.getAt(3)).toBeNull(); // Out of bounds
    });

    it('should return null when retrieving an out-of-bounds index', () => {
        list.insert(10);
        expect(list.getAt(-1)).toBeNull();
        expect(list.getAt(1)).toBeNull();
    });

    it('should search for values in the list', () => {
        list.insert(10);
        list.insert(20);
        list.insert(30);
        expect(list.search(20)).toBe(true);
        expect(list.search(40)).toBe(false);
    });

    it('should delete values from the list', () => {
        list.insert(10);
        list.insert(20);
        list.insert(30);
        list.delete(20);
        expect(list.toArray()).toEqual([10, 30]);
        expect(list.size()).toBe(2);
    });

    it('should handle deletion of the head node', () => {
        list.insert(10);
        list.insert(20);
        list.delete(10);
        expect(list.toArray()).toEqual([20]);
        expect(list.size()).toBe(1);
        expect(list.getAt(0)).toBe(20);
    });

    it('should handle deletion of the tail node', () => {
        list.insert(10);
        list.insert(20);
        list.delete(20);
        expect(list.toArray()).toEqual([10]);
        expect(list.size()).toBe(1);
        expect(list.getAt(0)).toBe(10);
    });

    it('should handle deletion of a non-existent value gracefully', () => {
        list.insert(10);
        list.insert(20);
        list.delete(30); // No error, no change
        expect(list.toArray()).toEqual([10, 20]);
        expect(list.size()).toBe(2);
    });

    it('should clear the list', () => {
        list.insert(10);
        list.insert(20);
        list.insert(30);
        list.clear();
        expect(list.toArray()).toEqual([]);
        expect(list.size()).toBe(0);
    });

    it('should return size of list correctly after multiple operations', () => {
        expect(list.size()).toBe(0);
        list.insert(5);
        list.insert(10);
        expect(list.size()).toBe(2);
        list.delete(5);
        expect(list.size()).toBe(1);
        list.clear();
        expect(list.size()).toBe(0);
    });
});
