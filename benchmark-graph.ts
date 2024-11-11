import { AdjacencyList, AdjacencyMatrix, EdgeList } from './src/index.ts';

console.log('---------------- AdjacencyList (number) ------------------');

// First Example: Using Simple Strings as Vertices and Numbers as Edge Data
const adjacencyList = new AdjacencyList<string, number>(); // Specify types for vertices (string) and edge data (number)

// Adding vertices
adjacencyList.addVertex('A');
adjacencyList.addVertex('B');
adjacencyList.addVertex('C');

// Adding edges with optional edge data (e.g., weights for edges)
adjacencyList.addEdge('A', 'B', 10); // Edge A -> B with weight 10
adjacencyList.addEdge('A', 'C', 15); // Edge A -> C with weight 15
adjacencyList.addEdge('B', 'C', 5); // Edge B -> C with weight 5

// Print the adjacencyList to see the current state
adjacencyList.printGraph();
// Output: A → B (Edge Data: 10), C (Edge Data: 15) | B → C (Edge Data: 5) | C →

// Removing an edge: A -> C
adjacencyList.removeEdge('A', 'C');
adjacencyList.printGraph();
// Output: A → B (Edge Data: 10) | B → C (Edge Data: 5) | C →

// Removing vertex C (this also removes its associated edges)
adjacencyList.removeVertex('C');
adjacencyList.printGraph();
// Output: A → B (Edge Data: 10) | B →

// Second Example: Using Custom Objects as Vertices
console.log('---------------- AdjacencyList (Object) ------------------');

// Define a custom object type for vertices
interface MyObject {
    id: number;
    name: string;
}

// Create custom object vertices
const obj1: MyObject = { id: 1, name: 'Node 1' };
const obj2: MyObject = { id: 2, name: 'Node 2' };
const obj3: MyObject = { id: 3, name: 'Node 3' };

// Example usage with custom objects as vertices
const adjacencyListObject = new AdjacencyList<MyObject, number>(); // Using MyObject as vertices and number as edge data

// Adding edges between custom objects with edge data
adjacencyListObject.addEdge(obj1, obj2, 10); // Edge between obj1 and obj2 with weight 10
adjacencyListObject.addEdge(obj2, obj3, 5); // Edge between obj2 and obj3 with weight 5

// Print the adjacencyList to see the custom object vertices and their relationships
adjacencyListObject.printGraph();
// Output:
// {"id":1,"name":"Node 1"} → {"id":2,"name":"Node 2"}
// {"id":2,"name":"Node 2"} → {"id":3,"name":"Node 3"}

console.log('---------------- AdjacencyMatrix ------------------');

const adjacencyMatrix = new AdjacencyMatrix<MyObject, number>(); // Using MyObject as vertices and number as edge data

adjacencyMatrix.addEdge(obj1, obj2, 10); // Edge between obj1 and obj2 with weight 10
adjacencyMatrix.addEdge(obj2, obj3, 5); // Edge between obj2 and obj3 with weight 5

adjacencyMatrix.printGraph();
// Output:
// {"id":1,"name":"Node 1"} → {"id":2,"name":"Node 2"} (Edge Data: 10)
// {"id":2,"name":"Node 2"} → {"id":3,"name":"Node 3"} (Edge Data: 5)

console.log('---------------- EdgeList ------------------');

const edgeList = new EdgeList<MyObject, number>(); // Using MyObject as vertices and number as edge data

// Adding edges between custom objects with edge data (e.g., weight)
edgeList.addEdge(obj1, obj2, 10); // Edge between obj1 and obj2 with weight 10
edgeList.addEdge(obj2, obj3, 5); // Edge between obj2 and obj3 with weight 5

// Print the graph to see the custom object vertices and their relationships
edgeList.printGraph();
// Output:
// {"id":1,"name":"Node 1"} → {"id":2,"name":"Node 2"} (Edge Data: 10)
// {"id":2,"name":"Node 2"} → {"id":3,"name":"Node 3"} (Edge Data: 5)
