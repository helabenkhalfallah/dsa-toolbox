import { describe, expect, it } from 'vitest';

import { BTree } from './BTree.ts';

describe('BTree', () => {
    it('should create an empty B-Tree', () => {
        const tree = new BTree<number>(2, (a, b) => a - b);
        expect(tree.print()).toBe('');
    });

    it('should insert keys into the B-Tree', () => {
        const tree = new BTree<number>(2, (a, b) => a - b);
        tree.insert(5);
        tree.insert(10);
        tree.insert(15);
        tree.insert(20);
        tree.insert(25);
        tree.insert(30);
        tree.insert(35);

        expect(tree.print()).toBe(
            `Level 0: 10, 20\n  Level 1: 5\n  Level 1: 15\n  Level 1: 25, 30, 35\n`,
        );
    });

    it('should delete keys from the B-Tree', () => {
        const tree = new BTree<number>(2, (a, b) => a - b);
        tree.insert(5);
        tree.insert(10);
        tree.insert(15);
        tree.insert(20);
        tree.insert(25);
        tree.insert(30);
        tree.insert(35);

        tree.delete(20);
        tree.delete(10);

        expect(tree.print()).toBe(`Level 0: 25\n  Level 1: 5, 15\n  Level 1: 30, 35\n`);
    });

    it('should search for keys in the B-Tree', () => {
        const tree = new BTree<number>(2, (a, b) => a - b);
        tree.insert(5);
        tree.insert(10);
        tree.insert(15);

        expect(tree.search(10)).not.toBeNull();
        expect(tree.search(20)).toBeNull();
    });

    it('should handle duplicate keys (if allowed)', () => {
        const tree = new BTree<number>(2, (a, b) => a - b);
        tree.insert(10);
        tree.insert(10); // Inserting a duplicate

        expect(tree.search(10)).not.toBeNull();
    });

    it('should handle edge cases', () => {
        const tree = new BTree<number>(2, (a, b) => a - b);

        tree.delete(5);
        expect(tree.print()).toBe('');

        tree.insert(10);
        tree.delete(10);
        expect(tree.print()).toBe('');
    });

    it('should work with different data types', () => {
        const stringTree = new BTree<string>(2, (a, b) => a.localeCompare(b));
        stringTree.insert('apple');
        stringTree.insert('banana');
        expect(stringTree.search('banana')).not.toBeNull();
    });
});
