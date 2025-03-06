import { performance } from 'perf_hooks';

import {
    CanApply,
    LazyCall,
    LazyStream,
    Ok,
    Option,
    PageLazyStream,
    SyncEffect,
    compose,
    composeTransducers,
    curry,
    debounce,
    filterTransducer,
    mapTransducer,
    partial,
    partialRight,
    pipe,
    takeTransducer,
    throttle,
    uncurry,
} from './src/index.ts';

type BenchmarkResult = {
    function: string;
    operation: string;
    time: number;
};

function benchmark<T>(fn: () => T, label: string, operation: string): BenchmarkResult {
    const start = performance.now();
    fn();
    const time = performance.now() - start;
    return { function: label, operation, time };
}

const benchmarks: BenchmarkResult[] = [];

//  ** Test Dataset: 100,000 Numbers **
const numbers = Array.from({ length: 100_000 }, (_, i) => i + 1);
const double = (x: number) => x * 2;
const isEven = (x: number) => x % 2 === 0;
const takeLimit = 5000;

//  ** Traditional Array Transformation (map -> filter -> slice) **
benchmarks.push(
    benchmark(
        () => {
            numbers
                .filter(isEven) // Keep even numbers
                .map(double) // Double them
                .slice(0, takeLimit); // Take first `takeLimit` results
        },
        'Traditional Array Transformation',
        'map().filter().slice()',
    ),
);

//  ** Transducer-Based Transformation (reduce) **
const transducer = composeTransducers(
    filterTransducer(isEven), // Filter evens
    mapTransducer(double), // Double values
    takeTransducer(takeLimit), // Take first `takeLimit`
);

benchmarks.push(
    benchmark(
        () => {
            numbers.reduce(
                transducer((acc, val) => [...acc, val]),
                [],
            );
        },
        'Transducer Approach',
        'reduce() with transducers',
    ),
);

benchmarks.push(
    benchmark(
        () => {
            const result: number[] = [];
            numbers.reduce(
                transducer((acc, val) => {
                    acc.push(val); // Mutate instead of spreading
                    return acc;
                }),
                result,
            );
        },
        'Transducer Optimized',
        'reduce() with transducers (optimized)',
    ),
);

//  ** Display Benchmark Results **
console.table(benchmarks);

//  **Existing Function Composition Benchmarks**
benchmarks.push(
    benchmark(
        () => {
            const add = (a: number) => a + 2;
            const multiply = (a: number) => a * 3;
            const composed = compose(multiply, add);
            composed(5);
        },
        'compose',
        'Function composition',
    ),
);

benchmarks.push(
    benchmark(
        () => {
            const add = (a: number) => a + 2;
            const multiply = (a: number) => a * 3;
            const piped = pipe(add, multiply);
            piped(5);
        },
        'pipe',
        'Function piping',
    ),
);

//  **Currying & Partial Application**
benchmarks.push(
    benchmark(
        () => {
            const add = (a: number, b: number) => a + b;
            const curriedAdd = curry(add);
            curriedAdd(3)(5);
        },
        'curry',
        'Currying',
    ),
);

benchmarks.push(
    benchmark(
        () => {
            const subtract = (a: number, b: number) => a - b;
            const partiallyApplied = partial(subtract, 10);
            partiallyApplied(3);
        },
        'partial',
        'Partial Application',
    ),
);

benchmarks.push(
    benchmark(
        () => {
            const subtract = (a: number, b: number) => a - b;
            const partiallyAppliedRight = partialRight(subtract, 3);
            partiallyAppliedRight(10);
        },
        'partialRight',
        'Partial Right Application',
    ),
);

benchmarks.push(
    benchmark(
        () => {
            const add = (a: number, b: number) => a + b;
            const curriedAdd = curry(add);
            const uncurriedAdd = uncurry(curriedAdd);
            uncurriedAdd(3, 5);
        },
        'uncurry',
        'Uncurrying',
    ),
);

//  **Functors: CanApply**
benchmarks.push(
    benchmark(
        () => {
            CanApply(5)
                .map((x) => x * 2)
                .map((x) => x + 10)
                .getValue();
        },
        'CanApply',
        'Functor Mapping',
    ),
);

//  **Monads: Option, Result, and SyncEffect**
benchmarks.push(
    benchmark(
        () => {
            Option.from(5)
                .map((x) => x * 2)
                .getOrElse(0);
        },
        'Option',
        'Option Mapping',
    ),
);

benchmarks.push(
    benchmark(
        () => {
            new Ok(5).map((x) => x * 2).unwrapOr(0);
        },
        'Result',
        'Result Mapping',
    ),
);

benchmarks.push(
    benchmark(
        () => {
            SyncEffect(() => 5 * 2).run();
        },
        'SyncEffect',
        'SyncEffect Execution',
    ),
);

// Simulated event triggering 1000 times in 1 second
const eventCount = 1000;
const durationMs = 1000;

// ** Benchmark for Debounce **
benchmarks.push(
    benchmark(
        () => {
            let callCount = 0;
            const debouncedFn = debounce(() => callCount++, 50);

            for (let i = 0; i < eventCount; i++) {
                debouncedFn();
            }

            // Simulate waiting for execution
            const start = performance.now();
            while (performance.now() - start < 60) {
                // Do nothing
            } // Wait a little over debounce delay

            return callCount;
        },
        'debounce',
        `Debouncing ${eventCount} calls over ${durationMs}ms`,
    ),
);

// ** Benchmark for Throttle **
benchmarks.push(
    benchmark(
        () => {
            let callCount = 0;
            const throttledFn = throttle(() => callCount++, 50);

            for (let i = 0; i < eventCount; i++) {
                throttledFn();
            }

            return callCount;
        },
        'throttle',
        `Throttling ${eventCount} calls over ${durationMs}ms`,
    ),
);

//  **Display Benchmark Results**
console.table(benchmarks);

// ** Benchmark for Lazy Evaluation **
async function runBenchmarks() {
    const benchmarks: BenchmarkResult[] = [];

    // ** Benchmark LazyCall **
    const lazyComputation = new LazyCall(() => {
        for (let i = 0; i < 1e7; i++) {
            // Do nothing
        } // Simulated heavy computation
        return 42;
    });

    benchmarks.push(benchmark(() => lazyComputation.get(), 'LazyCall', 'First Evaluation'));

    benchmarks.push(benchmark(() => lazyComputation.get(), 'LazyCall', 'Cached Evaluation'));

    // ** Benchmark LazyStream **
    async function* asyncNumbers(start = 1) {
        let num = start;
        while (num <= 10000) {
            yield num++;
        }
    }

    const stream = LazyStream.from(() => asyncNumbers())
        .map((x) => x * 2)
        .filter((x) => x % 3 === 0)
        .take(1000);

    benchmarks.push(
        await benchmark(() => stream.toArray(), 'LazyStream', 'Lazy Mapping + Filtering + Taking'),
    );

    // ** Benchmark PageLazyStream (Paginated API simulation) **
    async function* paginatedNumbers() {
        for (let i = 1; i <= 100; i++) {
            await new Promise((resolve) => setTimeout(resolve, 10)); // Simulate API delay
            yield Array.from({ length: 10 }, (_, j) => i * 10 + j);
        }
    }

    const pageStream = PageLazyStream.from(() => paginatedNumbers())
        .map((page) => page.map((x) => x * 2))
        .filter((page) => page.some((x) => x % 5 === 0))
        .take(5);

    benchmarks.push(
        await benchmark(() => pageStream.toArray(), 'PageLazyStream', 'Lazy Paginated Processing'),
    );

    // ** Display Benchmark Results **
    console.table(benchmarks);
}

// Run benchmarks
runBenchmarks();
