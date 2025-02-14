import { describe, expect, it } from 'vitest';

import { ComparableNode } from '../../../commons/ComparableNode.ts';
import { Color, RedBlackTree } from './RedBlackTree.ts';

describe('RedBlackTree', () => {
    it('should create an empty Red-Black Tree', () => {
        const tree = new RedBlackTree<number>();
        expect(tree.size()).toBe(0);
        expect(tree.search(5)).toBe(false);
    });

    it('should insert values and maintain Red-Black Tree properties', () => {
        const tree = new RedBlackTree<ComparableNode<number>>();

        // Helper function to create ComparableNode instances
        const createNode = (value: number) => new ComparableNode(value, (a, b) => a - b);

        tree.insert(createNode(10));
        tree.insert(createNode(5));
        tree.insert(createNode(15));
        tree.insert(createNode(3));
        tree.insert(createNode(7));
        tree.insert(createNode(12));
        tree.insert(createNode(18));

        expect(tree.size()).toBe(7);

        // Check if the tree structure and colors are valid (this might require helper functions)
        // For example:
        expect(tree.getRoot()?.value.value).toBe(10); // Root should be 10
        expect(tree.getRoot()?.color).toBe(Color.BLACK); // Root should be black
    });

    it('should delete values from the Red-Black Tree', () => {
        const tree = new RedBlackTree<ComparableNode<number>>();
        const createNode = (value: number) => new ComparableNode(value, (a, b) => a - b);

        tree.insert(createNode(10));
        tree.insert(createNode(5));
        tree.insert(createNode(15));
        tree.insert(createNode(3));
        tree.insert(createNode(7));
        tree.insert(createNode(12));
        tree.insert(createNode(18));

        tree.delete(createNode(10));

        expect(tree.size()).toBe(6);
        expect(tree.search(createNode(10))).toBe(false);

        tree.delete(createNode(5));
        expect(tree.size()).toBe(5);
        expect(tree.search(createNode(5))).toBe(false);
    });

    it('should delete the root node and re-balance the tree', () => {
        const tree = new RedBlackTree<ComparableNode<number>>();
        const createNode = (value: number) => new ComparableNode(value, (a, b) => a - b);

        tree.insert(createNode(10));
        tree.insert(createNode(5));
        tree.insert(createNode(15));
        tree.insert(createNode(3));

        // Deleting root node (10) and checking if the tree is rebalanced
        tree.delete(createNode(10));
        expect(tree.search(createNode(10))).toBe(false);
        expect(tree.size()).toBe(3); // Size should be 3 after deletion
    });

    it('should delete a node with two children and re-balance', () => {
        const tree = new RedBlackTree<ComparableNode<number>>();
        const createNode = (value: number) => new ComparableNode(value, (a, b) => a - b);

        tree.insert(createNode(10));
        tree.insert(createNode(5));
        tree.insert(createNode(15));
        tree.insert(createNode(3));
        tree.insert(createNode(7));

        // Deleting a node with two children (node 5)
        tree.delete(createNode(5));
        expect(tree.search(createNode(5))).toBe(false);
        expect(tree.size()).toBe(4); // Size should be 4 after deletion
    });

    it('should trigger rotation to maintain balance', () => {
        const tree = new RedBlackTree<ComparableNode<number>>();
        const createNode = (value: number) => new ComparableNode(value, (a, b) => a - b);

        tree.insert(createNode(10));
        tree.insert(createNode(18));
        tree.insert(createNode(7));
        tree.insert(createNode(15)); // This should cause a rotation
        tree.insert(createNode(16)); // Follow-up rotation

        expect(tree.getRoot()?.value.value).toBe(15); // Expected root after rotations
    });

    it('should delete from an empty tree without errors', () => {
        const tree = new RedBlackTree<ComparableNode<number>>();
        const createNode = (value: number) => new ComparableNode(value, (a, b) => a - b);

        // Deleting from an empty tree should not cause any errors
        tree.delete(createNode(10));
        expect(tree.size()).toBe(0);
    });

    it('should perform in-order traversal correctly', () => {
        const tree = new RedBlackTree<ComparableNode<number>>();
        const createNode = (value: number) => new ComparableNode(value, (a, b) => a - b);

        const valuesToInsert = [5, 3, 7, 1, 4];
        valuesToInsert.forEach((value) => tree.insert(createNode(value)));

        const traversedValues: number[] = [];
        tree.inOrderTraverse((node) => traversedValues.push(node.value));

        expect(traversedValues).toEqual([1, 3, 4, 5, 7]);
    });

    it('should work with different comparable data types', () => {
        const stringTree = new RedBlackTree<ComparableNode<string>>();
        stringTree.insert(new ComparableNode('apple', (a, b) => a.localeCompare(b)));
        stringTree.insert(new ComparableNode('banana', (a, b) => a.localeCompare(b)));

        expect(stringTree.search(new ComparableNode('banana', (a, b) => a.localeCompare(b)))).toBe(
            true,
        );
    });

    it('should handle duplicate values (if allowed)', () => {
        const tree = new RedBlackTree<ComparableNode<number>>();
        const createNode = (value: number) => new ComparableNode(value, (a, b) => a - b);

        tree.insert(createNode(10));
        tree.insert(createNode(10)); // Inserting a duplicate

        // If duplicates are not allowed, the size should remain 1.
        expect(tree.size()).toBe(1);
    });

    it('should handle edge cases with large numbers', () => {
        const tree = new RedBlackTree<ComparableNode<number>>();
        const createNode = (value: number) => new ComparableNode(value, (a, b) => a - b);

        tree.insert(createNode(Number.MAX_SAFE_INTEGER));
        tree.insert(createNode(Number.MIN_SAFE_INTEGER));

        expect(tree.search(createNode(Number.MAX_SAFE_INTEGER))).toBe(true);
        expect(tree.search(createNode(Number.MIN_SAFE_INTEGER))).toBe(true);
    });

    it('should handle boundary conditions with strings', () => {
        const tree = new RedBlackTree<ComparableNode<string>>();
        const createNode = (value: string) =>
            new ComparableNode(value, (a, b) => a.localeCompare(b));

        tree.insert(createNode('z'));
        tree.insert(createNode('a'));

        expect(tree.search(createNode('z'))).toBe(true);
        expect(tree.search(createNode('a'))).toBe(true);
    });
});
