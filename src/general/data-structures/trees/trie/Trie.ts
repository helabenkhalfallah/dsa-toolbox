/**
 * Class representing a node in the Trie.
 */
class TrieNode {
    /** Children nodes mapped by character */
    children: Map<string, TrieNode>;

    /** Indicates if the node marks the end of a word */
    isEndOfWord: boolean;

    /**
     * Creates a new TrieNode.
     */
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
    }
}

/**
 * Class representing a Trie (Prefix Tree) data structure.
 * Provides efficient insert, search, delete, and prefix search functionalities.
 */
export class Trie {
    /** The root node of the Trie */
    private root: TrieNode;

    /**
     * Creates a new Trie.
     */
    constructor() {
        this.root = new TrieNode();
    }

    /**
     * Inserts a word into the Trie.
     * @param {string} word - The word to insert.
     */
    insert(word: string): void {
        let currentNode = this.root;

        for (const char of word) {
            if (!currentNode.children.has(char)) {
                currentNode.children.set(char, new TrieNode());
            }
            currentNode = currentNode.children.get(char)!;
        }
        currentNode.isEndOfWord = true;
    }

    /**
     * Searches for a word in the Trie.
     * @param {string} word - The word to search for.
     * @returns {boolean} True if the word exists in the Trie, false otherwise.
     */
    search(word: string): boolean {
        const node = this.searchPrefix(word);
        return node !== null && node.isEndOfWord;
    }

    /**
     * Checks if there is any word in the Trie that starts with the given prefix.
     * @param {string} prefix - The prefix to search for.
     * @returns {boolean} True if there is any word with the prefix, false otherwise.
     */
    startsWith(prefix: string): boolean {
        return this.searchPrefix(prefix) !== null;
    }

    /**
     * Deletes a word from the Trie.
     * @param {string} word - The word to delete.
     * @returns {boolean} True if the word was successfully deleted, false if the word was not found.
     */
    delete(word: string): boolean {
        return this.deleteRecursively(this.root, word, 0);
    }

    /**
     * Helper method for recursive deletion.
     * @param {TrieNode} node - The current node.
     * @param {string} word - The word to delete.
     * @param {number} index - The current index in the word.
     * @returns {boolean} True if the node can be deleted, false otherwise.
     * @private
     */
    private deleteRecursively(node: TrieNode, word: string, index: number): boolean {
        if (index === word.length) {
            if (!node.isEndOfWord) return false; // Word not found.
            node.isEndOfWord = false; // Unmark end of word.
            return node.children.size === 0; // Return true if the node has no children.
        }

        const char = word[index];
        const nextNode = node.children.get(char);
        if (!nextNode) return false; // Character not found, word doesn't exist.

        const shouldDeleteCurrentNode = this.deleteRecursively(nextNode, word, index + 1);

        // Remove the reference to the child node if necessary.
        if (shouldDeleteCurrentNode) {
            node.children.delete(char);
            return node.children.size === 0 && !node.isEndOfWord;
        }
        return false;
    }

    /**
     * Searches for a node representing a prefix in the Trie.
     * @param {string} prefix - The prefix to search for.
     * @returns {TrieNode | null} The node representing the prefix, or null if not found.
     * @private
     */
    private searchPrefix(prefix: string): TrieNode | null {
        let currentNode = this.root;

        for (const char of prefix) {
            if (!currentNode.children.has(char)) {
                return null;
            }
            currentNode = currentNode.children.get(char)!;
        }
        return currentNode;
    }
}
