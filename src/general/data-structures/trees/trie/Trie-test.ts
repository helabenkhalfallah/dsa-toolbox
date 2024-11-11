import { describe, expect, it } from 'vitest';

import { Trie } from './Trie.js';

describe('Trie', () => {
    it('should insert and search for a word', () => {
        const trie = new Trie();
        trie.insert('hello');
        expect(trie.search('hello')).toBe(true); // Should find the word
        expect(trie.search('hell')).toBe(false); // Should not find an incomplete word
        expect(trie.search('helloo')).toBe(false); // Should not find a non-existent word
    });

    it('should check for prefixes correctly', () => {
        const trie = new Trie();
        trie.insert('hello');
        expect(trie.startsWith('hell')).toBe(true); // 'hell' is a prefix of 'hello'
        expect(trie.startsWith('hello')).toBe(true); // 'hello' is a valid word, so it's also a prefix
        expect(trie.startsWith('he')).toBe(true); // 'he' is also a prefix
        expect(trie.startsWith('world')).toBe(false); // 'world' does not exist in the Trie
    });

    it('should delete a word and handle empty nodes', () => {
        const trie = new Trie();
        trie.insert('hello');
        trie.insert('hell');
        trie.insert('helium');

        expect(trie.search('hello')).toBe(true);
        expect(trie.search('hell')).toBe(true);
        expect(trie.search('helium')).toBe(true);

        trie.delete('hello');
        expect(trie.search('hello')).toBe(false); // 'hello' should be deleted
        expect(trie.search('hell')).toBe(true); // 'hell' should still exist
        expect(trie.search('helium')).toBe(true); // 'helium' should still exist

        trie.delete('hell');
        expect(trie.search('hell')).toBe(false); // 'hell' should be deleted now
        expect(trie.startsWith('hel')).toBe(true); // 'hel' is a prefix for 'helium'

        trie.delete('helium');
        expect(trie.search('helium')).toBe(false); // 'helium' should be deleted
        expect(trie.startsWith('hel')).toBe(false); // Trie should now be empty for 'hel' prefix
    });

    it('should handle words with overlapping prefixes correctly', () => {
        const trie = new Trie();
        trie.insert('app');
        trie.insert('apple');
        trie.insert('application');

        expect(trie.search('app')).toBe(true);
        expect(trie.search('apple')).toBe(true);
        expect(trie.search('application')).toBe(true);

        trie.delete('apple');
        expect(trie.search('apple')).toBe(false); // 'apple' should be deleted
        expect(trie.search('app')).toBe(true); // 'app' should still exist
        expect(trie.search('application')).toBe(true); // 'application' should still exist
    });

    it('should return false when deleting a non-existent word', () => {
        const trie = new Trie();
        trie.insert('hello');
        const result = trie.delete('world');
        expect(result).toBe(false); // 'world' does not exist, so deletion should return false
    });
});
