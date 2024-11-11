import { describe, expect, it } from 'vitest';

import { EdgeList } from './EdgeList.ts';

describe('EdgeList', () => {
    it('should add edges correctly', () => {
        const graph = new EdgeList<string, number>();
        graph.addEdge('A', 'B', 10);
        graph.addEdge('B', 'C', 20);

        expect(graph.getEdgeData('A', 'B')).toBe(10);
        expect(graph.getEdgeData('B', 'C')).toBe(20);
    });

    it('should return neighbors correctly', () => {
        const graph = new EdgeList<string, number>();
        graph.addEdge('A', 'B', 10);
        graph.addEdge('B', 'C', 20);

        expect(graph.getNeighbors('A')).toEqual(['B']);
        expect(graph.getNeighbors('B')).toEqual(['A', 'C']);
    });

    it('should remove edges correctly', () => {
        const graph = new EdgeList<string, number>();
        graph.addEdge('A', 'B', 10);
        graph.removeEdge('A', 'B');

        expect(graph.getEdgeData('A', 'B')).toBeUndefined();
    });

    it('should remove vertices correctly', () => {
        const graph = new EdgeList<string, number>();
        graph.addEdge('A', 'B', 10);
        graph.addEdge('B', 'C', 20);
        graph.removeEdge('A', 'B');
        graph.removeEdge('B', 'C');

        expect(graph.getNeighbors('A')).toEqual([]);
        expect(graph.getNeighbors('B')).toEqual([]);
    });
});
