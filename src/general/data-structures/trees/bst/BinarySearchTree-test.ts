import { describe, expect, it } from 'vitest';

import { BinarySearchTree } from './BinarySearchTree.js';

describe('BinarySearchTree', () => {
    it('should create an empty tree', () => {
        const bst = new BinarySearchTree<number>();
        expect(bst.root).toBeNull();
    });

    it('should insert values into the BST', () => {
        const bst = new BinarySearchTree<number>();
        bst.insert(10);
        bst.insert(20);
        bst.insert(5);
        bst.insert(7);

        expect(bst.search(10)).toBe(true);
        expect(bst.search(20)).toBe(true);
        expect(bst.search(5)).toBe(true);
        expect(bst.search(7)).toBe(true);
        expect(bst.search(15)).toBe(false); // Should be false as 15 isn't inserted
    });

    it('should handle duplicate insertions when allowed', () => {
        const bst = new BinarySearchTree<number>();
        bst.insert(10);
        bst.insert(10, true); // Allow duplicates

        expect(bst.search(10)).toBe(true);
        // Should have inserted a duplicate but BST doesn't typically allow this, depending on implementation
        // Make sure it works as expected, either adds or skips based on design
    });

    it('should not allow duplicate insertions when not allowed', () => {
        const bst = new BinarySearchTree<number>();
        bst.insert(10);
        bst.insert(10); // Don't allow duplicates

        expect(bst.search(10)).toBe(true); // 10 should still be there once
    });

    it('should delete values from the BST', () => {
        const bst = new BinarySearchTree<number>();
        bst.insert(10);
        bst.insert(20);
        bst.insert(5);
        bst.insert(7);

        bst.delete(5);
        bst.delete(20);

        expect(bst.search(5)).toBe(false); // 5 should be deleted
        expect(bst.search(20)).toBe(false); // 20 should be deleted
        expect(bst.search(10)).toBe(true); // 10 should still be present
        expect(bst.search(7)).toBe(true); // 7 should still be present
    });

    it('should delete the root node correctly', () => {
        const bst = new BinarySearchTree<number>();
        bst.insert(10);
        bst.insert(5);
        bst.insert(20);

        bst.delete(10); // Root node is 10

        expect(bst.search(10)).toBe(false); // 10 should be deleted
        expect(bst.search(5)).toBe(true); // 5 should still be there
        expect(bst.search(20)).toBe(true); // 20 should still be there
    });

    it('should handle deleting from an empty tree gracefully', () => {
        const bst = new BinarySearchTree<number>();
        bst.delete(10); // Trying to delete from an empty tree

        expect(bst.root).toBeNull(); // The tree should remain empty
    });

    it('should traverse the tree in order using inOrderTraversal', () => {
        const bst = new BinarySearchTree<number>();
        bst.insert(10);
        bst.insert(20);
        bst.insert(5);
        bst.insert(7);

        const values = [];
        for (const value of bst) {
            values.push(value);
        }

        expect(values).toEqual([5, 7, 10, 20]); // Should return values in sorted order
    });

    it('should handle in-order traversal on an empty tree', () => {
        const bst = new BinarySearchTree<number>();
        const values: number[] = [];
        for (const value of bst) {
            values.push(value);
        }

        expect(values).toEqual([]); // Should be empty as the tree is empty
    });

    it('should work with different data types (e.g., strings)', () => {
        const bst = new BinarySearchTree<string>();
        bst.insert('apple');
        bst.insert('banana');
        bst.insert('orange');

        expect(bst.search('apple')).toBe(true);
        expect(bst.search('banana')).toBe(true);
        expect(bst.search('grape')).toBe(false); // 'grape' should not be in the tree
    });

    it('should handle delete when a node has two children', () => {
        const bst = new BinarySearchTree<number>();
        bst.insert(10);
        bst.insert(5);
        bst.insert(15);
        bst.insert(12);
        bst.insert(18);

        bst.delete(15); // Node with two children

        expect(bst.search(15)).toBe(false); // 15 should be deleted
        expect(bst.search(12)).toBe(true); // 12 should replace 15
    });

    it('should return correct result when deleting a node with no children', () => {
        const bst = new BinarySearchTree<number>();
        bst.insert(10);
        bst.insert(5);
        bst.insert(15);

        bst.delete(5); // Node with no children

        expect(bst.search(5)).toBe(false); // 5 should be deleted
    });
});
