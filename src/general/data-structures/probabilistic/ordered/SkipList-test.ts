import { beforeEach, describe, expect, it } from 'vitest';

import { SkipList } from './SkipList.ts';

describe('SkipList', () => {
    let skipList: SkipList<number>;

    beforeEach(() => {
        skipList = new SkipList<number>();
    });

    it('should insert elements and retrieve them correctly', () => {
        skipList.insert(10);
        skipList.insert(5);
        skipList.insert(20);
        expect(skipList.find(10)).toBe(true);
        expect(skipList.find(5)).toBe(true);
        expect(skipList.find(20)).toBe(true);
    });

    it('should return false for non-existent elements', () => {
        skipList.insert(10);
        expect(skipList.find(30)).toBe(false);
        expect(skipList.find(0)).toBe(false);
    });

    it('should delete elements correctly', () => {
        skipList.insert(15);
        skipList.insert(10);
        skipList.insert(5);
        skipList.delete(10);
        expect(skipList.find(10)).toBe(false);
        expect(skipList.find(5)).toBe(true);
        expect(skipList.find(15)).toBe(true);
    });

    it('should handle deleting non-existent elements gracefully', () => {
        skipList.insert(10);
        skipList.delete(20);
        expect(skipList.find(10)).toBe(true);
    });

    it('should find the minimum and maximum elements', () => {
        skipList.insert(10);
        skipList.insert(20);
        skipList.insert(5);
        expect(skipList.min()).toBe(5);
        expect(skipList.max()).toBe(20);
    });

    it('should return null for min and max on an empty list', () => {
        expect(skipList.min()).toBeNull();
        expect(skipList.max()).toBeNull();
    });

    it('should update min and max correctly after deletions', () => {
        skipList.insert(10);
        skipList.insert(20);
        skipList.insert(5);
        skipList.delete(5);
        expect(skipList.min()).toBe(10);
        skipList.delete(20);
        expect(skipList.max()).toBe(10);
    });
});
