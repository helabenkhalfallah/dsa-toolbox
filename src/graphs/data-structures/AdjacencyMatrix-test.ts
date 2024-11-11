import { describe, expect, it } from 'vitest';

import { AdjacencyMatrix } from './AdjacencyMatrix.ts';

describe('AdjacencyMatrix', () => {
    it('should add vertices and edges correctly', () => {
        const graph = new AdjacencyMatrix<string, number>();
        graph.addEdge('A', 'B', 10);
        graph.addEdge('B', 'C', 20);

        expect(graph.getEdgeData('A', 'B')).toBe(10);
        expect(graph.getEdgeData('B', 'C')).toBe(20);
    });

    it('should return neighbors correctly', () => {
        const graph = new AdjacencyMatrix<string, number>();
        graph.addEdge('A', 'B', 10);
        graph.addEdge('B', 'C', 20);

        expect(graph.getNeighbors('A')).toEqual(['B']);
        expect(graph.getNeighbors('B')).toEqual(['C']);
    });

    it('should remove edges correctly', () => {
        const graph = new AdjacencyMatrix<string, number>();
        graph.addEdge('A', 'B', 10);
        graph.removeEdge('A', 'B');

        expect(graph.getEdgeData('A', 'B')).toBeUndefined();
    });

    it('should remove vertices correctly', () => {
        const graph = new AdjacencyMatrix<string, number>();
        graph.addEdge('A', 'B', 10);
        graph.addEdge('B', 'C', 20);

        // Remove vertex 'B'
        graph.removeVertex('B');

        // After removing 'B', check that the edges involving 'B' are undefined
        expect(graph.getEdgeData('A', 'B')).toBeUndefined(); // Edge 'A' -> 'B' should be removed
        expect(graph.getEdgeData('B', 'C')).toBeUndefined(); // Edge 'B' -> 'C' should be removed
    });
});
