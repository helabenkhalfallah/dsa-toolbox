/**
 * A class representing a graph using the adjacency list representation.
 *
 * The adjacency list is a collection of nodes where each node stores a list of its neighbors.
 * It is a space-efficient way to store graphs, especially sparse graphs, where the number of edges is much smaller than the number of vertices.
 *
 * When to Use Adjacency List:
 * - Sparse graphs: When you have many vertices but relatively few edges.
 * - Dynamic graphs: Where you may frequently add/remove vertices and edges.
 * - Frequent neighbor queries: If you need to often query which vertices are connected to a given vertex.
 *
 * When Not to Use Adjacency List:
 * - Dense graphs: When there are many edges, Adjacency Matrices may be more efficient because they allow for constant-time edge lookups.
 * - Edge existence queries: If you often need to check whether an edge exists between two vertices without needing to traverse neighbors, an Adjacency Matrix might be more efficient.
 *
 * **Complexity:**
 * - **Space Complexity:** O(V + E), where V is the number of vertices and E is the number of edges. Each vertex is stored with its list of neighbors.
 * - **Time Complexity:**
 *   - `addVertex()`: O(1) – Adding a vertex to the graph is a constant-time operation.
 *   - `addEdge()`: O(1) – Adding an edge is also a constant-time operation.
 *   - `removeVertex()`: O(V + E) – In the worst case, removing a vertex may involve checking all edges in the graph.
 *   - `removeEdge()`: O(E) – In the worst case, removing an edge requires scanning the list of neighbors.
 *   - `getNeighbors()`: O(1) – Accessing the neighbors of a vertex is a constant-time operation.
 *   - `printGraph()`: O(V + E) – Printing the entire graph requires traversing all vertices and their neighbors.
 */
export class AdjacencyList<T, E> {
    private adjList: Map<T, { neighbors: T[]; edgeData: Map<T, E> }>;

    constructor() {
        // Initialize an empty adjacency list using a Map
        this.adjList = new Map();
    }

    /**
     * Adds a vertex to the graph.
     * If the vertex already exists, it does nothing.
     *
     * @param {T} vertex - The vertex to be added.
     */
    addVertex(vertex: T): void {
        if (!this.adjList.has(vertex)) {
            this.adjList.set(vertex, { neighbors: [], edgeData: new Map() });
        }
    }

    /**
     * Adds a directed edge from vertex1 to vertex2 with optional edge data.
     * If either vertex does not exist, it will be added to the graph.
     *
     * @param {T} vertex1 - The starting vertex of the edge.
     * @param {T} vertex2 - The ending vertex of the edge.
     * @param {E} edgeData - Optional edge data (e.g., weight, label).
     */
    addEdge(vertex1: T, vertex2: T, edgeData?: E): void {
        this.addVertex(vertex1);
        this.addVertex(vertex2);

        // Add the edge to the neighbors list of vertex1
        const vertex1Data = this.adjList.get(vertex1);
        if (vertex1Data) {
            vertex1Data.neighbors.push(vertex2);
            if (edgeData !== undefined) {
                vertex1Data.edgeData.set(vertex2, edgeData); // Store the edge data
            }
        }
    }

    /**
     * Removes a vertex and all its associated edges from the graph.
     * If the vertex does not exist, it does nothing.
     *
     * @param {T} vertex - The vertex to be removed.
     */
    removeVertex(vertex: T): void {
        if (this.adjList.has(vertex)) {
            // Remove the vertex from the adjacency list
            this.adjList.delete(vertex);

            // Remove all edges pointing to this vertex
            this.adjList.forEach((data) => {
                const index = data.neighbors.indexOf(vertex);
                if (index !== -1) {
                    data.neighbors.splice(index, 1);
                    data.edgeData.delete(vertex); // Remove any associated edge data
                }
            });
        }
    }

    /**
     * Removes the directed edge from vertex1 to vertex2.
     * If no such edge exists, it does nothing.
     *
     * @param {T} vertex1 - The starting vertex of the edge.
     * @param {T} vertex2 - The ending vertex of the edge.
     */
    removeEdge(vertex1: T, vertex2: T): void {
        const vertex1Data = this.adjList.get(vertex1);
        if (vertex1Data) {
            const index = vertex1Data.neighbors.indexOf(vertex2);
            if (index !== -1) {
                vertex1Data.neighbors.splice(index, 1); // Remove the neighbor
                vertex1Data.edgeData.delete(vertex2); // Remove the edge data
            }
        }
    }

    /**
     * Returns the list of neighbors for the given vertex.
     * If the vertex does not exist, it returns an empty array.
     *
     * @param {T} vertex - The vertex whose neighbors are to be returned.
     * @returns {T[]} - The list of neighbors of the vertex.
     */
    getNeighbors(vertex: T): T[] {
        return this.adjList.get(vertex)?.neighbors || [];
    }

    /**
     * Returns the edge data (if any) associated with an edge from vertex1 to vertex2.
     *
     * @param {T} vertex1 - The starting vertex of the edge.
     * @param {T} vertex2 - The ending vertex of the edge.
     * @returns {E | undefined} - The edge data (e.g., weight) or undefined if no edge exists.
     */
    getEdgeData(vertex1: T, vertex2: T): E | undefined {
        return this.adjList.get(vertex1)?.edgeData.get(vertex2);
    }

    /**
     * Prints the entire graph, showing each vertex and its associated neighbors and edge data.
     */
    printGraph(): void {
        this.adjList.forEach((data, vertex) => {
            const vertexStr = this.stringifyVertex(vertex); // Convert the vertex to a readable string
            const neighborsStr = data.neighbors
                .map((neighbor) => {
                    const edgeInfo = data.edgeData.get(neighbor);
                    return `${this.stringifyVertex(neighbor)} (Edge Data: ${edgeInfo ?? 'None'})`;
                })
                .join(', ');

            console.log(`${vertexStr} → ${neighborsStr}`);
        });
    }

    /**
     * Helper method to convert custom vertex objects to a string representation
     * @param vertex
     * @private
     */
    private stringifyVertex(vertex: T): string {
        if (typeof vertex === 'object' && vertex !== null) {
            // If the vertex is an object, return a readable string (based on properties)
            return JSON.stringify(vertex);
        }
        // If it's a primitive type (e.g., string, number), return it as is
        return vertex.toString();
    }
}
