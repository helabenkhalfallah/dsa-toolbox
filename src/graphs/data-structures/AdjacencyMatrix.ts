/**
 * A class representing a graph using the adjacency matrix representation.
 *
 * The adjacency matrix is a 2D array where each cell (i, j) represents whether there is an edge between vertex i and vertex j.
 * It is efficient for dense graphs, where the number of edges is close to the number of vertices squared.
 *
 * When to Use Adjacency Matrix:
 * - Dense graphs: When you have many edges.
 * - Fixed graph structure: If you don’t need to add/remove vertices or edges frequently.
 * - Constant-time edge lookups: If you need to quickly check if there’s an edge between two vertices.
 *
 * When Not to Use Adjacency Matrix:
 * - Sparse graphs: When the number of edges is much smaller than the number of vertices, it may be inefficient.
 * - Dynamic graphs: If you frequently add or remove vertices/edges, the matrix size must be updated, which can be costly.
 *
 * **Complexity:**
 * - **Space Complexity:** O(V^2), where V is the number of vertices. The matrix requires space for every pair of vertices.
 * - **Time Complexity:**
 *   - `addVertex()`: O(V) – Adding a vertex requires resizing the matrix.
 *   - `addEdge()`: O(1) – Adding an edge is a constant-time operation.
 *   - `removeVertex()`: O(V^2) – Removing a vertex involves removing all related edges in the matrix.
 *   - `removeEdge()`: O(1) – Removing an edge is a constant-time operation.
 *   - `getNeighbors()`: O(V) – Accessing neighbors requires scanning the row for the vertex.
 *   - `printGraph()`: O(V^2) – Printing the entire graph requires printing the matrix.
 */
export class AdjacencyMatrix<T, E> {
    private adjMatrix: (E | undefined)[][]; // 2D matrix to store edge data
    private vertices: T[]; // Array to store the vertices
    private vertexIndex: Map<T, number>; // Map to associate each vertex with an index

    constructor() {
        this.adjMatrix = [];
        this.vertices = [];
        this.vertexIndex = new Map();
    }

    /**
     * Adds a vertex to the graph. If the vertex already exists, it does nothing.
     * The vertex is associated with a row and column in the adjacency matrix.
     */
    addVertex(vertex: T): void {
        if (!this.vertexIndex.has(vertex)) {
            const index = this.vertices.length;
            this.vertices.push(vertex);
            this.vertexIndex.set(vertex, index);

            // Resize the matrix to accommodate the new vertex
            this.adjMatrix.forEach((row) => row.push(undefined)); // Add column for the new vertex

            // Add a new row in the matrix for the new vertex, initialize with undefined (no edges)
            const newRow = Array(this.vertices.length).fill(undefined);
            this.adjMatrix.push(newRow);
        }
    }

    /**
     * Adds a directed edge from vertex1 to vertex2 with optional edge data.
     * If either vertex does not exist, it will be added to the graph.
     */
    addEdge(vertex1: T, vertex2: T, edgeData?: E): void {
        this.addVertex(vertex1);
        this.addVertex(vertex2);

        const index1 = this.vertexIndex.get(vertex1)!;
        const index2 = this.vertexIndex.get(vertex2)!;

        // Set the edge data at the matrix position
        this.adjMatrix[index1][index2] = edgeData;
    }

    /**
     * Removes a vertex and all its associated edges from the graph.
     * If the vertex does not exist, it does nothing.
     */
    removeVertex(vertex: T): void {
        const index = this.vertexIndex.get(vertex);
        if (index !== undefined) {
            // Remove the vertex from the vertex list and map
            this.vertices.splice(index, 1);
            this.vertexIndex.delete(vertex);

            // Remove the corresponding row and column from the adjacency matrix
            this.adjMatrix.splice(index, 1); // Remove row
            this.adjMatrix.forEach((row) => row.splice(index, 1)); // Remove column

            // Rebuild the vertex-index map and matrix after removal
            this.vertices.forEach((v, idx) => this.vertexIndex.set(v, idx));
        }
    }

    /**
     * Removes the directed edge from vertex1 to vertex2.
     * If no such edge exists, it does nothing.
     */
    removeEdge(vertex1: T, vertex2: T): void {
        const index1 = this.vertexIndex.get(vertex1)!;
        const index2 = this.vertexIndex.get(vertex2)!;
        this.adjMatrix[index1][index2] = undefined; // Remove the edge
    }

    /**
     * Returns the list of neighbors for the given vertex.
     * If the vertex does not exist, it returns an empty array.
     */
    getNeighbors(vertex: T): T[] {
        const index = this.vertexIndex.get(vertex);
        if (index !== undefined) {
            return this.adjMatrix[index]
                .map((edge, idx) => (edge !== undefined ? this.vertices[idx] : null))
                .filter((vertex) => vertex !== null) as T[];
        }
        return [];
    }

    /**
     * Returns the edge data (if any) associated with an edge from vertex1 to vertex2.
     */
    getEdgeData(vertex1: T, vertex2: T): E | undefined {
        const index1 = this.vertexIndex.get(vertex1);
        const index2 = this.vertexIndex.get(vertex2);

        // Check that both vertices exist before accessing the matrix
        if (index1 === undefined || index2 === undefined) {
            return undefined; // Return undefined if either vertex is missing
        }

        return this.adjMatrix[index1][index2];
    }

    /**
     * Prints the entire graph, showing each vertex and its associated neighbors and edge data.
     */
    printGraph(): void {
        this.vertices.forEach((vertex) => {
            const neighbors = this.getNeighbors(vertex);
            const neighborsStr = neighbors
                .map((neighbor) => {
                    const edgeData = this.getEdgeData(vertex, neighbor);
                    return `${this.stringifyVertex(neighbor)} (Edge Data: ${edgeData ?? 'None'})`;
                })
                .join(', ');
            console.log(`${this.stringifyVertex(vertex)} → ${neighborsStr}`);
        });
    }

    /**
     * Helper method to convert custom vertex objects to a string representation.
     */
    private stringifyVertex(vertex: T): string {
        if (typeof vertex === 'object' && vertex !== null) {
            return JSON.stringify(vertex);
        }
        return vertex.toString();
    }
}
