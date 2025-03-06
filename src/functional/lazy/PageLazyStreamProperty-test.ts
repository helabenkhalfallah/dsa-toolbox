import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { PageLazyStream } from './PageLazyStream.ts';

async function* asyncPageGenerator<T>(pages: T[][]) {
    for (const page of pages) {
        await new Promise((resolve) => setTimeout(resolve, 5)); // Simulate async delay
        yield page;
    }
}

describe('PageLazyStream - Property-Based Tests (Fast-Check)', () => {
    it('should return all pages correctly with toArray()', async () => {
        await fc.assert(
            fc.asyncProperty(fc.array(fc.array(fc.anything())), async (pages) => {
                const lazyStream = PageLazyStream.from(() => asyncPageGenerator(pages));
                const result = await lazyStream.toArray();

                expect(result).toStrictEqual(pages);
            }),
        );
    });

    it('map should behave like Array.prototype.map() but at the page level', async () => {
        await fc.assert(
            fc.asyncProperty(fc.array(fc.array(fc.integer())), async (pages) => {
                const doublePage = (page: number[]) => page.map((num) => num * 2);

                const lazyStream = PageLazyStream.from(() => asyncPageGenerator(pages)).map(
                    doublePage,
                );
                const result = await lazyStream.toArray();

                expect(result).toStrictEqual(pages.map(doublePage));
            }),
        );
    });

    it('filter should behave like Array.prototype.filter() but at the page level', async () => {
        await fc.assert(
            fc.asyncProperty(fc.array(fc.array(fc.integer())), async (pages) => {
                const onlyBigPages = (page: number[]) => page.length > 2;

                const lazyStream = PageLazyStream.from(() => asyncPageGenerator(pages)).filter(
                    onlyBigPages,
                );
                const result = await lazyStream.toArray();

                expect(result).toStrictEqual(pages.filter(onlyBigPages));
            }),
        );
    });

    it('take(n) should return at most n pages', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.array(fc.array(fc.anything())),
                fc.integer({ min: 0, max: 10 }),
                async (pages, n) => {
                    const lazyStream = PageLazyStream.from(() => asyncPageGenerator(pages)).take(n);
                    const result = await lazyStream.toArray();

                    expect(result.length).toBeLessThanOrEqual(n);
                    expect(result).toStrictEqual(pages.slice(0, n));
                },
            ),
        );
    });

    it('should correctly compose filter() and take()', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.array(fc.array(fc.integer())),
                fc.integer({ min: 1, max: 5 }),
                async (pages, n) => {
                    const isLargePage = (page: number[]) => page.length > 2;
                    const expected = pages.filter(isLargePage).slice(0, n);

                    const lazyStream = PageLazyStream.from(() => asyncPageGenerator(pages))
                        .filter(isLargePage)
                        .take(n);
                    const result = await lazyStream.toArray();

                    expect(result).toStrictEqual(expected);
                },
            ),
        );
    });

    it('should process API-like responses lazily', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.array(fc.array(fc.record({ id: fc.integer(), name: fc.string() }))),
                async (pages) => {
                    const toUpperCase = (page: { id: number; name: string }[]) =>
                        page.map((user) => ({ ...user, name: user.name.toUpperCase() }));

                    const lazyStream = PageLazyStream.from(() => asyncPageGenerator(pages)).map(
                        toUpperCase,
                    );
                    const result = await lazyStream.toArray();

                    expect(result).toStrictEqual(pages.map(toUpperCase));
                },
            ),
        );
    });

    it('should handle empty pages gracefully', async () => {
        await fc.assert(
            fc.asyncProperty(fc.constant([]), async (pages) => {
                const lazyStream = PageLazyStream.from(() => asyncPageGenerator(pages));
                const result = await lazyStream.toArray();

                expect(result).toStrictEqual([]);
            }),
        );
    });
});
