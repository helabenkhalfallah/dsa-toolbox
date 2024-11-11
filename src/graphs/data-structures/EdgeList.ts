/**
 * A class representing a graph using the edge list representation.
 *
 * The edge list is a collection of edges where each edge is represented as a pair (or tuple) of vertices,
 * optionally with some edge data (e.g., weight, label).
 * It is efficient for sparse graphs and is often used when you only need to store the edges without worrying about neighbors.
 *
 * When to Use Edge List:
 * - Sparse graphs: When you have relatively few edges compared to the number of vertices.
 * - Simple graph structure: When you just want to store edges without needing fast neighbor queries.
 *
 * When Not to Use Edge List:
 * - Dense graphs: When there are many edges, an adjacency matrix or list might be more efficient.
 * - Frequent neighbor queries: Edge lists are not efficient for quickly looking up all neighbors of a vertex.
 *
 * **Complexity:**
 * - **Space Complexity:** O(E), where E is the number of edges.
 * - **Time Complexity:**
 *   - `addEdge()`: O(1) – Adding an edge is a constant-time operation.
 *   - `removeEdge()`: O(E) – Removing an edge requires scanning the list of edges.
 *   - `getNeighbors()`: O(E) – Accessing the neighbors of a vertex requires scanning the entire edge list.
 *   - `printGraph()`: O(E) – Printing the entire graph requires traversing all edges.
 */
export class EdgeList<T, E> {
    private edges: Array<{ vertex1: T; vertex2: T; edgeData?: E }>; // Array of edges, each with optional data

    constructor() {
        this.edges = [];
    }

    /**
     * Adds an edge between vertex1 and vertex2 with optional edge data (e.g., weight).
     *
     * @param {T} vertex1 - The starting vertex of the edge.
     * @param {T} vertex2 - The ending vertex of the edge.
     * @param {E} edgeData - Optional edge data (e.g., weight, label).
     */
    addEdge(vertex1: T, vertex2: T, edgeData?: E): void {
        this.edges.push({ vertex1, vertex2, edgeData });
    }

    /**
     * Removes an edge between vertex1 and vertex2.
     * If no such edge exists, it does nothing.
     *
     * @param {T} vertex1 - The starting vertex of the edge.
     * @param {T} vertex2 - The ending vertex of the edge.
     */
    removeEdge(vertex1: T, vertex2: T): void {
        this.edges = this.edges.filter(
            (edge) => !(edge.vertex1 === vertex1 && edge.vertex2 === vertex2),
        );
    }

    /**
     * Returns a list of neighbors for the given vertex.
     * If the vertex does not exist, it returns an empty array.
     *
     * @param {T} vertex - The vertex whose neighbors are to be returned.
     * @returns {T[]} - The list of neighbors of the vertex.
     */
    getNeighbors(vertex: T): T[] {
        const neighbors: T[] = [];
        this.edges.forEach((edge) => {
            if (edge.vertex1 === vertex) {
                neighbors.push(edge.vertex2);
            }
            if (edge.vertex2 === vertex) {
                neighbors.push(edge.vertex1);
            }
        });
        return neighbors;
    }

    /**
     * Returns the edge data (if any) associated with an edge between vertex1 and vertex2.
     *
     * @param {T} vertex1 - The starting vertex of the edge.
     * @param {T} vertex2 - The ending vertex of the edge.
     * @returns {E | undefined} - The edge data (e.g., weight) or undefined if no edge exists.
     */
    getEdgeData(vertex1: T, vertex2: T): E | undefined {
        const edge = this.edges.find(
            (edge) =>
                (edge.vertex1 === vertex1 && edge.vertex2 === vertex2) ||
                (edge.vertex1 === vertex2 && edge.vertex2 === vertex1),
        );
        return edge?.edgeData;
    }

    /**
     * Prints the entire graph, showing each edge and its associated data.
     */
    printGraph(): void {
        this.edges.forEach((edge) => {
            const edgeData = edge.edgeData ? ` (Edge Data: ${edge.edgeData})` : '';
            console.log(
                `${this.stringifyVertex(edge.vertex1)} → ${this.stringifyVertex(edge.vertex2)}${edgeData}`,
            );
        });
    }

    /**
     * Helper method to convert custom vertex objects to a string representation
     * @param vertex
     * @private
     */
    private stringifyVertex(vertex: T): string {
        if (typeof vertex === 'object' && vertex !== null) {
            return JSON.stringify(vertex); // If the vertex is an object, return a readable string
        }
        return vertex.toString(); // Otherwise, return the string representation
    }
}
