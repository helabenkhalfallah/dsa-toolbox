import { performance } from 'perf_hooks';

import {
    CanApply,
    Effect,
    Ok,
    Option,
    compose,
    curry,
    partial,
    partialRight,
    pipe,
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

// Function Composition
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

// Currying & Partial Application
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

// Functors: CanApply
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

// Monads: Option, Result, and Effect
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
            Effect(() => 5 * 2).run();
        },
        'Effect',
        'Effect Execution',
    ),
);

console.table(benchmarks);
