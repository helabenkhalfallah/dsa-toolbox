import { describe, expect, it } from 'vitest';

import { AVLTree } from './AVLTree.ts';

describe('AVLTree', () => {
    it('should insert values and maintain AVL balancing', () => {
        const avlTree = new AVLTree<number>();

        avlTree.insert(10);
        avlTree.insert(20);
        avlTree.insert(5);
        avlTree.insert(4);
        avlTree.insert(15);

        // Check if the inserted values are searchable
        expect(avlTree.search(10)).toBe(true);
        expect(avlTree.search(20)).toBe(true);
        expect(avlTree.search(5)).toBe(true);
        expect(avlTree.search(4)).toBe(true);
        expect(avlTree.search(15)).toBe(true);

        // Check if non-existent value is not found
        expect(avlTree.search(25)).toBe(false);
    });

    it('should balance itself with rotations', () => {
        const avlTree = new AVLTree<number>();

        avlTree.insert(10);
        avlTree.insert(20);
        avlTree.insert(30); // Should cause a left rotation on 10

        // Confirm AVL balancing by searching the root node after rotations
        expect(avlTree.root?.value).toBe(20);
        expect(avlTree.root?.left?.value).toBe(10);
        expect(avlTree.root?.right?.value).toBe(30);
    });

    it('should delete a value and maintain AVL balancing', () => {
        const avlTree = new AVLTree<number>();

        avlTree.insert(10);
        avlTree.insert(20);
        avlTree.insert(30);
        avlTree.insert(40);
        avlTree.insert(50);

        avlTree.delete(20);

        // Check that the value is deleted
        expect(avlTree.search(20)).toBe(false);

        // Verify balancing
        expect(avlTree.root?.value).toBe(30);
        expect(avlTree.root?.left?.value).toBe(10);
        expect(avlTree.root?.right?.value).toBe(40);
    });

    it('should handle deletion of root node and adjust structure correctly', () => {
        const avlTree = new AVLTree<number>();

        avlTree.insert(10);
        avlTree.insert(20);
        avlTree.insert(5);

        avlTree.delete(10);

        expect(avlTree.search(10)).toBe(false);
        expect(avlTree.root?.value).toBe(20);
        expect(avlTree.root?.left?.value).toBe(5);
    });

    it('should handle deletion of leaf nodes', () => {
        const avlTree = new AVLTree<number>();

        avlTree.insert(15);
        avlTree.insert(10);
        avlTree.insert(20);
        avlTree.insert(5);

        avlTree.delete(5); // Delete leaf node

        expect(avlTree.search(5)).toBe(false);
        expect(avlTree.root?.value).toBe(15);
        expect(avlTree.root?.left?.value).toBe(10);
        expect(avlTree.root?.right?.value).toBe(20);
    });

    it('should handle deletion of node with one child', () => {
        const avlTree = new AVLTree<number>();

        avlTree.insert(10);
        avlTree.insert(5);
        avlTree.insert(1);

        avlTree.delete(5);

        expect(avlTree.search(5)).toBe(false);
        expect(avlTree.root?.value).toBe(10);
        expect(avlTree.root?.left?.value).toBe(1);
    });
});
