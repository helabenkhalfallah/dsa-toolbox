
# DSA Toolbox 📚

Welcome to **DSA Toolbox**, a comprehensive library of **data structures** and **algorithms** designed to streamline your development process! This library is built for **JavaScript** and **TypeScript**, offering both fundamental and advanced data structures, search algorithms, sort algorithms, and more.

Whether you're building a lightweight application or handling large datasets, **DSA Toolbox** provides an optimized library to make your coding journey efficient and fun.

## ✨ Features

**DSA Toolbox** offers a variety of powerful toolbox:

### 🔎 **Search Algorithms**
- Binary Search
- Exponential Search
- Hybrid Search
- Linear Search
- Ternary Search

### 🧮 **Sort Algorithms**
- HeapSort
- MergeSort
- TimSort

### 🔄 **Cache Algorithms**
- LFU (Least Frequently Used)
- LRU (Least Recently Used)

### 🏗️ **Data Structures**
- **Heaps**: MaxHeap, MinHeap
- **Linked Lists**: Singly Linked List, Doubly Linked List
- **Queues & Stacks**
- **Treaps** (Binary Search Tree with heap properties)
- **Trees**: AVL Tree, Red-Black Tree, Binary Search Tree, B-Tree, Trie
- **Probabilistic Structures**: Bloom Filter, HyperLogLog, CountMinSketch, SkipList, MinHash, SimHash, TDigest

### 📊 Functional Programming (FP)

- **Composition**: Function composition for declarative programming
- **Currying**: Transforming functions into unary functions
- **Functors**: CanApply for safe function application
- **Monads**:
  - **Option<T>**: Safe handling of optional values (Some, None)
  - **Result<T, E>**: Error handling without exceptions (Ok, Err)
  - **Effect<T, E>**: Deferred computations with error safety

---

## Benchmarks

### Data Structures Benchmarks

| (index) | dataStructure        | operation         | size    | time (ms)          |
|---------|----------------------|-------------------|---------|--------------------|
| 0       | Native Array         | Insert            | 1000    | 0.0042             |
| 1       | Native Array         | Search            | 1000    | 0.0015             |
| 2       | Native Array         | Delete            | 1000    | 0.0008             |
| 3       | Queue                | Insert (Enqueue)  | 1000    | 0.1306             |
| 4       | Queue                | Delete (Dequeue)  | 1000    | 0.1355             |
| 5       | Stack                | Insert (Push)     | 1000    | 0.1216             |
| 6       | Stack                | Delete (Pop)      | 1000    | 0.1128             |
| 7       | Binary Search Tree   | Insert            | 1000    | 0.3302             |
| 8       | Binary Search Tree   | Search            | 1000    | 0.0431             |
| 9       | Binary Search Tree   | Delete            | 1000    | 0.0308             |
| 10      | Red-Black Tree       | Insert            | 1000    | 0.8018             |
| 11      | Red-Black Tree       | Search            | 1000    | 0.0202             |
| 12      | Red-Black Tree       | Delete            | 1000    | 0.0791             |
| 13      | AVL Tree             | Insert            | 1000    | 0.6278             |
| 14      | AVL Tree             | Search            | 1000    | 0.0117             |
| 15      | AVL Tree             | Delete            | 1000    | 0.0189             |
| 16      | Trie                 | Insert            | 1000    | 0.3451             |
| 17      | Trie                 | Search            | 1000    | 0.0157             |
| 18      | Trie                 | Delete            | 1000    | 0.0184             |
| 19      | Min Heap             | Insert            | 1000    | 0.1854             |
| 20      | Min Heap             | Extract           | 1000    | 0.3252             |
| 21      | Max Heap             | Insert            | 1000    | 0.1810             |
| 22      | Max Heap             | Extract           | 1000    | 0.3187             |
| 23      | B-Tree               | Insert            | 1000    | 0.4755             |
| 24      | B-Tree               | Search            | 1000    | 0.0155             |
| 25      | B-Tree               | Delete            | 1000    | 0.0783             |
| 26      | Native Array         | Insert            | 10000   | 0.1975             |
| 27      | Native Array         | Search            | 10000   | 0.0025             |
| 28      | Native Array         | Delete            | 10000   | 0.0007             |
| 29      | Queue                | Insert (Enqueue)  | 10000   | 0.2820             |
| 30      | Queue                | Delete (Dequeue)  | 10000   | 0.1872             |
| 31      | Stack                | Insert (Push)     | 10000   | 0.1817             |
| 32      | Stack                | Delete (Pop)      | 10000   | 0.1647             |
| 33      | Binary Search Tree   | Insert            | 10000   | 1.6758             |
| 34      | Binary Search Tree   | Search            | 10000   | 0.0039             |
| 35      | Binary Search Tree   | Delete            | 10000   | 0.0036             |
| 36      | Red-Black Tree       | Insert            | 10000   | 3.0843             |
| 37      | Red-Black Tree       | Search            | 10000   | 0.0051             |
| 38      | Red-Black Tree       | Delete            | 10000   | 0.0178             |
| 39      | AVL Tree             | Insert            | 10000   | 1.7637             |
| 40      | AVL Tree             | Search            | 10000   | 0.0028             |
| 41      | AVL Tree             | Delete            | 10000   | 0.0040             |
| 42      | Trie                 | Insert            | 10000   | 1.2017             |
| 43      | Trie                 | Search            | 10000   | 0.0059             |
| 44      | Trie                 | Delete            | 10000   | 0.0045             |
| 45      | Min Heap             | Insert            | 10000   | 0.4538             |
| 46      | Min Heap             | Extract           | 10000   | 0.8098             |
| 47      | Max Heap             | Insert            | 10000   | 0.3135             |
| 48      | Max Heap             | Extract           | 10000   | 0.7455             |
| 49      | B-Tree               | Insert            | 10000   | 2.5483             |
| 50      | B-Tree               | Search            | 10000   | 0.0098             |
| 51      | B-Tree               | Delete            | 10000   | 0.0772             |
| 52      | Native Array         | Insert            | 100000  | 0.1380             |
| 53      | Native Array         | Search            | 100000  | 0.0166             |
| 54      | Native Array         | Delete            | 100000  | 0.0010             |
| 55      | Queue                | Insert (Enqueue)  | 100000  | 1.9742             |
| 56      | Queue                | Delete (Dequeue)  | 100000  | 0.3029             |
| 57      | Stack                | Insert (Push)     | 100000  | 0.7822             |
| 58      | Stack                | Delete (Pop)      | 100000  | 0.1848             |
| 59      | Binary Search Tree   | Insert            | 100000  | 20.2091            |
| 60      | Binary Search Tree   | Search            | 100000  | 0.0126             |
| 61      | Binary Search Tree   | Delete            | 100000  | 0.0031             |
| 62      | Red-Black Tree       | Insert            | 100000  | 95.1039            |
| 63      | Red-Black Tree       | Search            | 100000  | 0.0193             |
| 64      | Red-Black Tree       | Delete            | 100000  | 0.0112             |
| 65      | AVL Tree             | Insert            | 100000  | 29.1355            |
| 66      | AVL Tree             | Search            | 100000  | 0.0110             |
| 67      | AVL Tree             | Delete            | 100000  | 0.0036             |
| 68      | Trie                 | Insert            | 100000  | 33.3004            |
| 69      | Trie                 | Search            | 100000  | 0.0455             |
| 70      | Trie                 | Delete            | 100000  | 0.0880             |
| 71      | Min Heap             | Insert            | 100000  | 4.6971             |
| 72      | Min Heap             | Extract           | 100000  | 9.8937             |
| 73      | Max Heap             | Insert            | 100000  | 3.2794             |
| 74      | Max Heap             | Extract           | 100000  | 9.2720             |
| 75      | B-Tree               | Insert            | 100000  | 50.4755            |
| 76      | B-Tree               | Search            | 100000  | 0.0125             |
| 77      | B-Tree               | Delete            | 100000  | 0.0196             |
| 78      | Native Array         | Insert            | 1000000 | 2.0249             |
| 79      | Native Array         | Search            | 1000000 | 0.1391             |
| 80      | Native Array         | Delete            | 1000000 | 0.000              |

**Suggested Applications:**
- Small Data: For datasets around 1,000 elements, Native Arrays, Queues, and Stacks provide excellent performance.
- Medium Data: Up to 10,000 elements, use AVL Tree for balanced tree operations and Min/Max Heap for priority-based insert/extract operations.
- Large Data: At 100,000 elements, consider using B-Trees or Red-Black Trees for optimized insertion and search performance.
- Extra Large Data: Beyond 1,000,000 elements, B-Trees, with their balanced and efficient nature, are superior for handling large datasets, especially for search and delete operations.

### Algorithms Benchmarks

| (index) | algorithm            | operation | size     | time (ms)     |
|---------|----------------------|-----------|----------|---------------|
| 0       | Heap Sort            | Sort      | 1000     | 1.1344        |
| 1       | Merge Sort           | Sort      | 1000     | 0.6770        |
| 2       | Tim Sort             | Sort      | 1000     | 0.5847        |
| 3       | Native Sort          | Sort      | 1000     | 0.1421        |
| 4       | Binary Search        | Search    | 1000     | 0.0278        |
| 5       | Exponential Search   | Search    | 1000     | 0.0265        |
| 6       | Hybrid Search        | Search    | 1000     | 0.0377        |
| 7       | Linear Search        | Search    | 1000     | 0.0218        |
| 8       | Ternary Search       | Search    | 1000     | 0.0259        |
| 9       | Heap Sort            | Sort      | 10000    | 2.6921        |
| 10      | Merge Sort           | Sort      | 10000    | 3.4185        |
| 11      | Tim Sort             | Sort      | 10000    | 2.1583        |
| 12      | Native Sort          | Sort      | 10000    | 1.2181        |
| 13      | Binary Search        | Search    | 10000    | 0.0050        |
| 14      | Exponential Search   | Search    | 10000    | 0.0062        |
| 15      | Hybrid Search        | Search    | 10000    | 3.5105        |
| 16      | Linear Search        | Search    | 10000    | 0.0740        |
| 17      | Ternary Search       | Search    | 10000    | 0.0067        |
| 18      | Heap Sort            | Sort      | 100000   | 18.3146       |
| 19      | Merge Sort           | Sort      | 100000   | 24.6636       |
| 20      | Tim Sort             | Sort      | 100000   | 12.3915       |
| 21      | Native Sort          | Sort      | 100000   | 15.6272       |
| 22      | Binary Search        | Search    | 100000   | 0.0200        |
| 23      | Exponential Search   | Search    | 100000   | 0.1084        |
| 24      | Hybrid Search        | Search    | 100000   | 30.4123       |
| 25      | Linear Search        | Search    | 100000   | 0.6435        |
| 26      | Ternary Search       | Search    | 100000   | 0.0108        |
| 27      | Heap Sort            | Sort      | 1000000  | 272.6623      |
| 28      | Merge Sort           | Sort      | 1000000  | 246.9195      |
| 29      | Tim Sort             | Sort      | 1000000  | 140.5443      |
| 30      | Native Sort          | Sort      | 1000000  | 184.8578      |
| 31      | Binary Search        | Search    | 1000000  | 0.0271        |
| 32      | Exponential Search   | Search    | 1000000  | 0.7834        |
| 33      | Hybrid Search        | Search    | 1000000  | 375.9163      |
| 34      | Linear Search        | Search    | 1000000  | 0.6445        |
| 35      | Ternary Search       | Search    | 1000000  | 0.0094        |

**Sorting Algorithms:**
- Heap Sort: Ideal for priority queues and constrained memory environments.
- Merge Sort: Best for linked lists and large datasets on disk where stable sorting is needed.
- Tim Sort: Great for real-time systems and partially sorted data, widely used in production environments.
- Native Sort: Versatile for general-purpose sorting with built-in optimization.

**Searching Algorithms:**
- Binary Search: Perfect for quick lookups in large, sorted datasets (e.g., databases).
- Exponential Search: Useful for unbounded or sparse datasets to find a starting range for binary search.
- Hybrid Search: Adapts well to changing dataset sizes, ideal for large applications and databases.
- Linear Search: Suited for small, unsorted datasets where search is infrequent.
- Ternary Search: Good for distinct, ordered data ranges, often in optimization or game algorithms.

## 🏎️ Functional Programming (FP) Benchmarks

Functional programming utilities are designed for **safe, composable, and efficient** function transformations. 

| **Function**      | **Operation**                   | **Time (ms)**        |
|------------------|--------------------------------|----------------------|
| `compose`       | Function composition           | 0.0565               |
| `pipe`          | Function piping                | 0.0371               |
| `curry`         | Currying                        | 0.0508               |
| `partial`       | Partial Application            | 0.0302               |
| `partialRight`  | Partial Right Application      | 0.0352               |
| `uncurry`       | Uncurrying                     | 0.0591               |
| `CanApply`      | Functor Mapping                | 0.0694               |
| `Option`        | Option Mapping (Monad)         | 0.0767               |
| `Result`        | Result Mapping (Monad)         | 0.0649               |
| `Effect`        | Effect Execution (Monad)       | 0.0578               |

- **Function composition (`compose`, `pipe`) is highly efficient**, enabling declarative and reusable transformations.
- **Currying (`curry`, `uncurry`) and partial application (`partial`, `partialRight`) improve function modularity** while maintaining performance.
- **Functors and Monads (`CanApply`, `Option`, `Result`, `Effect`) ensure safety and composability**, with reasonable execution times.
- **Effect handling (`Effect`) provides error resilience**, making it ideal for managing side effects safely.

---

## 🛠️ Usage

To install the DSA Toolbox:
```bash
pnpm add dsa-toolbox 
```

Then you can import the Data Structure or the Algorithm you want to use:

```typescript
import {
  binarySearch,
  exponentialSearch,
  hybridSearch,
  linearSearch,
  ternarySearch,
  heapSort,
  mergeSort,
  timSort,
  LFUCache,
  LRUCache,
  MaxHeap,
  MinHeap,
  DoublyLinkedList,
  LinkedList,
  HyperLogLog,
  CountMinSketch,
  BloomFilter,
  SkipList,
  TDigest,
  MinHash,
  SimHash,
  Queue,
  Stack,
  Treap,
  AVLTree,
  BTree,
  BinarySearchTree,
  RedBlackTree,
  Trie,
  Option,
  Effect,
  compose,
  curry,
  CanApply
} from 'dsa-toolbox';

binarySearch(sortedData, target, { compareFn: (a, b) => a - b, isSorted: true });
ternarySearch(data, target, 0, sortedData.length - 1, {
        compareFn: (a, b) => a - b,
        isSorted: false,
    });

const queue = new Queue<number>();
data.forEach((item) => queue.enqueue(item));

const avlTree = new AVLTree<number>();
avlTree.insert(10);
avlTree.insert(20);
avlTree.insert(5);
avlTree.insert(4);
avlTree.insert(15);
avlTree.search(10);


const double = (x: number) => x * 2;
const increment = (x: number) => x + 1;
const doubleThenIncrement = compose(increment, double);
console.log(doubleThenIncrement(3)); // 7

const safeValue = CanApply(10)
        .map((x) => x * 2)
        .map((x) => `Result: ${x}`)
        .getValue();

console.log(safeValue); // "Result: 20"
```

More usage examples can be found here:
- https://github.com/helabenkhalfallah/dsa-toolbox/blob/main/benchmark-algo.ts
- https://github.com/helabenkhalfallah/dsa-toolbox/blob/main/benchmark-ds.ts
- In tests files, for example:
  - https://github.com/helabenkhalfallah/dsa-toolbox/blob/main/src/data-structures/trees/avl/AVLTree-test.ts
  - https://github.com/helabenkhalfallah/dsa-toolbox/blob/main/src/data-structures/trees/b-tree/BTree-test.ts

---

## 📚 Documentation & References

For detailed explanations of each data structure and algorithm, please visit:

- [Trees in Data Structures: More than Just Wood](https://helabenkhalfallah.com/2024/10/11/trees-in-data-structures-more-than-just-wood/)
- [Heaps: Beyond First-Come-First-Served Queue Wizard](https://helabenkhalfallah.com/2024/10/14/heaps-beyond-first-come-first-served-queue-wizard/)
- [Yet Another Way to Balance BSTs: The Treaps Approach](https://helabenkhalfallah.com/2024/10/28/yet-another-way-to-balance-bsts-the-treaps-approach/)
- [The Secret Life of Caches: A Deep Dive into LRU and LFU](https://helabenkhalfallah.com/2024/11/01/the-secret-life-of-caches-a-deep-dive-into-lru-and-lfu/)
- [Probabilistic Data Structures for Large Data Challenges](https://helabenkhalfallah.com/2024/11/03/probabilistic-data-structures-for-large-data-challenges/)

---

## Code coverage

| **Metric**  | **Coverage**  |
|------------|-------------|
| **Statements** | 91.38% |
| **Branches**   | 91.11% |
| **Functions**  | 96.03% |
| **Lines**      | 91.38% |


| **File/Module**                       | **% Stmts** | **% Branch** | **% Funcs** | **% Lines** | **Uncovered Line #s** |
|--------------------------------------|------------|-------------|------------|------------|----------------------|
| **All files**                         | 91.38      | 91.11       | 96.03      | 91.38      |                      |
| **Algorithms / Search**               | 96.9       | 92.85       | 100        | 96.9       |                      |
| `BinarySearch.ts`                     | 100        | 100         | 100        | 100        |                      |
| `ExponentialSearch.ts`                 | 100        | 87.5        | 100        | 100        | 70                   |
| `HybridSearch.ts`                      | 93.33      | 87.5        | 100        | 93.33      | 121-122              |
| `LinearSearch.ts`                      | 100        | 100         | 100        | 100        |                      |
| `TernarySearch.ts`                     | 96         | 92.3        | 100        | 96         | 82                   |
| **Algorithms / Sort**                  | 99.44      | 95.23       | 100        | 99.44      |                      |
| `HeapSort.ts`                           | 100        | 100         | 100        | 100        |                      |
| `MergeSort.ts`                          | 100        | 100         | 100        | 100        |                      |
| `TimSort.ts`                            | 99.24      | 93.47       | 100        | 99.24      | 128                  |
| **Common Utilities**                    | 85.71      | 100         | 75         | 85.71      |                      |
| `ComparableNode.ts`                     | 85.71      | 100         | 75         | 85.71      | 50-51                |
| **Data Structures / Caching**           | 100        | 94.59       | 100        | 100        |                      |
| `LFU.ts`                                | 100        | 90.9        | 100        | 100        | 75,148               |
| `LRU.ts`                                | 100        | 100         | 100        | 100        |                      |
| **Data Structures / Heaps**             | 97.14      | 93.87       | 88.88      | 97.14      |                      |
| `MaxHeap.ts`                            | 97.14      | 96          | 88.88      | 97.14      | 138-139              |
| `MinHeap.ts`                            | 97.14      | 91.66       | 88.88      | 97.14      | 139-140              |
| **Data Structures / Linked Lists**      | 97.04      | 89.06       | 100        | 97.04      |                      |
| `DoublyLinkedList.ts`                   | 95.65      | 88.57       | 100        | 95.65      | 87-89,91             |
| `LinkedList.ts`                         | 98.7       | 89.65       | 100        | 98.7       | 75                   |
| **Functional Programming (FP)**         | **96.38**  | **100**     | **93.61**  | **96.38**  |                      |
| `Composition.ts`                        | 77.77      | 87.5        | 100        | 77.77      | 18-19                |
| `Curry.ts`                              | 91.3       | 88.88       | 100        | 91.3       | 49-50                |
| `CanApply.ts`                           | 100        | 85.71       | 100        | 100        | 29                   |
| `Effect.ts`                             | 100        | 100         | 100        | 100        |                      |
| `Option.ts`                             | 96.87      | 100         | 95         | 96.87      | 15-16                |
| `Result.ts`                             | 94.44      | 100         | 90.9       | 94.44      | 16-17,26-27          |
| `Partial.ts`                            | 100        | 100         | 100        | 100        |                      |

---

## 🚀 Contributing

For contributions, we invite you to read our [Contributing Guide](https://github.com/helabenkhalfallah/dsa-toolbox/wiki/Contributing-to-DSA-Toolbox) to get started and ensure a smooth process.

---

Happy coding with the DSA Toolbox! 🎉
