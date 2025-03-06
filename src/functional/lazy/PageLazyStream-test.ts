import { describe, expect, it, vi } from 'vitest';

import { PageLazyStream } from './PageLazyStream.ts';

async function* asyncPageGenerator<T>(pages: T[][]) {
    for (const page of pages) {
        await new Promise((resolve) => setTimeout(resolve, 5)); // Simulated async delay
        yield page;
    }
}

describe('PageLazyStream - Unit Tests', () => {
    it('should collect pages correctly using toArray()', async () => {
        const pages = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
        ];
        const lazyStream = PageLazyStream.from(() => asyncPageGenerator(pages));

        const result = await lazyStream.toArray();
        expect(result).toStrictEqual(pages);
    });

    it('map should behave like Array.prototype.map() but at the page level', async () => {
        const pages = [
            [1, 2],
            [3, 4],
            [5, 6],
        ];
        const doublePage = (page: number[]) => page.map((num) => num * 2);

        const lazyStream = PageLazyStream.from(() => asyncPageGenerator(pages)).map(doublePage);
        const result = await lazyStream.toArray();

        expect(result).toStrictEqual(pages.map(doublePage));
    });

    it('filter should behave like Array.prototype.filter() but at the page level', async () => {
        const pages = [
            [1, 2, 3],
            [4, 5],
            [6, 7, 8],
        ];
        const onlyBigPages = (page: number[]) => page.length > 2;

        const lazyStream = PageLazyStream.from(() => asyncPageGenerator(pages)).filter(
            onlyBigPages,
        );
        const result = await lazyStream.toArray();

        expect(result).toStrictEqual(pages.filter(onlyBigPages));
    });

    it('take(n) should return at most n pages', async () => {
        const pages = [[1], [2], [3], [4], [5]];
        const n = 3;

        const lazyStream = PageLazyStream.from(() => asyncPageGenerator(pages)).take(n);
        const result = await lazyStream.toArray();

        expect(result.length).toBe(n);
        expect(result).toStrictEqual(pages.slice(0, n));
    });

    it('should not evaluate elements unless toArray() is called', async () => {
        const pages = [
            [1, 2],
            [3, 4],
            [5, 6],
        ];
        const spy = vi.fn();

        const lazyStream = PageLazyStream.from(async function* () {
            for (const page of pages) {
                spy();
                yield page;
            }
        });

        expect(spy).not.toHaveBeenCalled();
        await lazyStream.toArray();
        expect(spy).toHaveBeenCalledTimes(pages.length);
    });

    it('should correctly compose filter() and take()', async () => {
        const pages = [
            [1, 2, 3],
            [4, 5],
            [6, 7, 8],
            [9, 10],
            [11, 12, 13],
        ];
        const isLargePage = (page: number[]) => page.length > 2;
        const n = 2;

        const expected = pages.filter(isLargePage).slice(0, n);
        const lazyStream = PageLazyStream.from(() => asyncPageGenerator(pages))
            .filter(isLargePage)
            .take(n);

        const result = await lazyStream.toArray();
        expect(result).toStrictEqual(expected);
    });

    it('should correctly process transformations on paginated API responses', async () => {
        const apiPages = [
            [
                { id: 1, name: 'Alice' },
                { id: 2, name: 'Bob' },
            ],
            [
                { id: 3, name: 'Charlie' },
                { id: 4, name: 'David' },
            ],
        ];
        const toUpperCase = (page: { id: number; name: string }[]) =>
            page.map((user) => ({ ...user, name: user.name.toUpperCase() }));

        const lazyStream = PageLazyStream.from(() => asyncPageGenerator(apiPages)).map(toUpperCase);
        const result = await lazyStream.toArray();

        expect(result).toStrictEqual(apiPages.map(toUpperCase));
    });
});
