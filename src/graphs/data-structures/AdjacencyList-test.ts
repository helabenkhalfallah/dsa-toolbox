import { describe, expect, it } from 'vitest';

import { AdjacencyList } from './AdjacencyList.ts';

describe('AdjacencyList', () => {
    it('should add vertices correctly', () => {
        const graph = new AdjacencyList<string, number>();
        graph.addVertex('A');
        graph.addVertex('B');

        expect(graph.getNeighbors('A')).toEqual([]);
        expect(graph.getNeighbors('B')).toEqual([]);
    });

    it('should add edges correctly with data', () => {
        const graph = new AdjacencyList<string, number>();
        graph.addEdge('A', 'B', 10);
        graph.addEdge('B', 'C', 20);

        expect(graph.getNeighbors('A')).toEqual(['B']);
        expect(graph.getEdgeData('A', 'B')).toBe(10);
        expect(graph.getEdgeData('B', 'C')).toBe(20);
    });

    it('should remove edges correctly', () => {
        const graph = new AdjacencyList<string, number>();
        graph.addEdge('A', 'B', 10);
        graph.removeEdge('A', 'B');

        expect(graph.getNeighbors('A')).toEqual([]);
    });

    it('should remove vertices correctly', () => {
        const graph = new AdjacencyList<string, number>();
        graph.addEdge('A', 'B', 10);
        graph.addEdge('B', 'C', 20);
        graph.removeVertex('B');

        expect(graph.getNeighbors('A')).toEqual([]);
        expect(graph.getNeighbors('C')).toEqual([]);
    });
});
