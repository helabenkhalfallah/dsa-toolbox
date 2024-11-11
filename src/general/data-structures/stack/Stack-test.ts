import { describe, expect, it } from 'vitest';

import { Stack } from './Stack.ts';

describe('Stack', () => {
    it('should initialize with a size of 0', () => {
        const stack = new Stack<number>();
        expect(stack.size).toBe(0);
        expect(stack.isEmpty()).toBe(true);
    });

    it('should add elements to the stack and update size', () => {
        const stack = new Stack<number>();
        stack.push(1);
        stack.push(2);
        expect(stack.size).toBe(2);
        expect(stack.isEmpty()).toBe(false);
    });

    it('should return elements in LIFO order on pop', () => {
        const stack = new Stack<number>();
        stack.push(1);
        stack.push(2);
        stack.push(3);

        expect(stack.pop()).toBe(3);
        expect(stack.pop()).toBe(2);
        expect(stack.pop()).toBe(1);
        expect(stack.isEmpty()).toBe(true);
    });

    it('should return undefined when pop is called on an empty stack', () => {
        const stack = new Stack<number>();
        expect(stack.pop()).toBeUndefined();
    });

    it('should allow peeking at the top element without popping', () => {
        const stack = new Stack<number>();
        stack.push(1);
        stack.push(2);
        expect(stack.peek()).toBe(2); // Peek should show the top element
        expect(stack.size).toBe(2); // Size should remain the same
    });

    it('should return undefined when peek is called on an empty stack', () => {
        const stack = new Stack<number>();
        expect(stack.peek()).toBeUndefined();
    });

    it('should clear all elements from the stack', () => {
        const stack = new Stack<number>();
        stack.push(1);
        stack.push(2);
        stack.clear();
        expect(stack.size).toBe(0);
        expect(stack.isEmpty()).toBe(true);
        expect(stack.peek()).toBeUndefined();
    });
});
