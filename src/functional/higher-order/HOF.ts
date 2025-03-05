/**
 * ** Executes a function only once.**
 *
 * @template T - Function arguments.
 * @template R - Function return type.
 * @param {(...args: T) => R} fn - The function to call once.
 * @returns {(...args: T) => R} - A function that runs once and caches the result.
 *
 * @example
 * const initialize = once(() => console.log("Initializing..."));
 * initialize(); // "Initializing..."
 * initialize(); // (No output)
 */
export const once = <T extends unknown[], R>(fn: (...args: T) => R) => {
    let called = false;
    let result: R;

    return (...args: T) => {
        if (!called) {
            result = fn(...args);
            called = true;
        }
        return result;
    };
};

/**
 * ** Executes a function only when a condition is met.**
 *
 * @template T - The input type.
 * @param {(value: T) => boolean} predicate - Condition to check.
 * @param {(value: T) => void} fn - Function to execute when the condition is true.
 * @returns {(value: T) => void} - A conditional function.
 *
 * @example
 * const logIfPositive = when((x: number) => x > 0, console.log);
 * logIfPositive(5); // Logs: 5
 * logIfPositive(-2); // (No output)
 */
export const when =
    <T>(predicate: (value: T) => boolean, fn: (value: T) => void) =>
    (value: T) =>
        predicate(value) && fn(value);

/**
 * ** Executes a function only when a condition is NOT met.**
 *
 * @template T - The input type.
 * @param {(value: T) => boolean} predicate - Condition to check.
 * @param {(value: T) => void} fn - Function to execute when the condition is false.
 * @returns {(value: T) => void} - A conditional function.
 *
 * @example
 * const logIfNegative = unless((x: number) => x > 0, console.log);
 * logIfNegative(-5); // Logs: -5
 * logIfNegative(2); // (No output)
 */
export const unless =
    <T>(predicate: (value: T) => boolean, fn: (value: T) => void) =>
    (value: T) =>
        !predicate(value) && fn(value);

/**
 * ** Delays function execution until a pause in events.**
 *
 * Useful for optimizing event handlers like window resizing or input typing.
 *
 * @template T - Function arguments.
 * @param {(...args: T) => void} fn - The function to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {(...args: T) => void} - A debounced function.
 *
 * @example
 * const saveInput = debounce((value) => console.log("Saved:", value), 300);
 * saveInput("Hello");
 * saveInput("Hello, world!"); // Only logs once after 300ms
 */
export const debounce = <T extends unknown[]>(fn: (...args: T) => void, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: T) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
};

/**
 * ** Limits function execution to once per interval.**
 *
 * Useful for rate-limiting frequent events like scrolling or key presses.
 *
 * @template T - Function arguments.
 * @param {(...args: T) => void} fn - The function to throttle.
 * @param {number} limit - The time limit in milliseconds.
 * @returns {(...args: T) => void} - A throttled function.
 *
 * @example
 * const logScroll = throttle(() => console.log("Scrolling..."), 500);
 * window.addEventListener("scroll", logScroll);
 */
export const throttle = <T extends unknown[]>(fn: (...args: T) => void, limit: number) => {
    let lastCall = 0;
    return (...args: T) => {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            fn(...args);
        }
    };
};
