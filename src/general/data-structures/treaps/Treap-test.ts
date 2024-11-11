import { describe, expect, it } from 'vitest';

import { Treap } from './Treap.ts';

describe('Treap', () => {
    it('should insert values while maintaining BST and heap properties', () => {
        const treap = new Treap<number>();

        treap.insert(10, 20);
        treap.insert(5, 30);
        treap.insert(15, 10);
        treap.insert(7, 25);

        expect(treap.search(10)).toBe(true);
        expect(treap.search(5)).toBe(true);
        expect(treap.search(15)).toBe(true);
        expect(treap.search(7)).toBe(true);

        // In-order traversal to confirm BST property
        const values = treap.inOrderTraversal();
        expect(values).toEqual([5, 7, 10, 15]);
    });

    it('should return false when searching for a non-existent value', () => {
        const treap = new Treap<number>();

        treap.insert(10, 20);
        expect(treap.search(20)).toBe(false);
    });

    it('should delete a value and maintain the Treap structure', () => {
        const treap = new Treap<number>();

        treap.insert(10, 20);
        treap.insert(5, 30);
        treap.insert(15, 10);
        treap.insert(7, 25);

        expect(treap.delete(7)).toBe(true);
        expect(treap.search(7)).toBe(false);

        // Verify in-order traversal after deletion
        const values = treap.inOrderTraversal();
        expect(values).toEqual([5, 10, 15]);
    });

    it('should handle deletion of root node and adjust structure accordingly', () => {
        const treap = new Treap<number>();

        treap.insert(10, 20);
        treap.insert(5, 30);
        treap.insert(15, 10);

        expect(treap.delete(10)).toBe(true);
        expect(treap.search(10)).toBe(false);

        const values = treap.inOrderTraversal();
        expect(values).toEqual([5, 15]);
    });

    it('should return false when trying to delete a non-existent value', () => {
        const treap = new Treap<number>();

        treap.insert(10, 20);
        expect(treap.delete(20)).toBe(false);
    });

    it('should perform in-order traversal correctly', () => {
        const treap = new Treap<number>();

        treap.insert(30, 15);
        treap.insert(20, 25);
        treap.insert(40, 10);

        const values = treap.inOrderTraversal();
        expect(values).toEqual([20, 30, 40]);
    });
});
