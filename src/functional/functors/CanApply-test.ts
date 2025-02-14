import { describe, expect, it } from 'vitest';

import { CanApply } from './CanApply.ts';

describe('CanApply Functor', () => {
    it('should apply valid operations safely', () => {
        const result = CanApply(5)
            .map((x) => x * 2)
            .map((x) => x + 3)
            .getValue();

        expect(result).toBe(13); //  5 → 10 → 13
    });

    it('should transform type (number → string)', () => {
        const result = CanApply(42)
            .map((x) => x.toString())
            .map((x) => x + '!')
            .getValue();

        expect(result).toBe('42!'); //  Converts number → string
    });

    it('should transform object → array', () => {
        const result = CanApply({ name: 'Alice', age: 25 })
            .map(Object.entries) //  Convert object → array
            .getValue();

        expect(result).toEqual([
            ['name', 'Alice'],
            ['age', 25],
        ]);
    });

    it('should handle implicit coercion correctly', () => {
        const result = CanApply(5)
            .map((x) => x + '!') // JavaScript coerces `5` into `"5"`
            .getValue();

        expect(result).toBe('5!'); // Expected: `"5!"`, NOT `null`
    });

    it('should handle JSON parsing safely', () => {
        const validJSON = CanApply('{"valid": true}')
            .map(JSON.parse)
            .map((obj) => obj.valid)
            .getValue();

        expect(validJSON).toBe(true); //  Parsed successfully

        const invalidJSON = CanApply('{"invalid"') // Broken JSON
            .map(JSON.parse) //  Fails safely
            .getValue();

        expect(invalidJSON).toBe(null);
    });

    it('should satisfy functor identity law', () => {
        const value = 10;
        const result = CanApply(value)
            .map((x) => x) // Identity function
            .getValue();

        expect(result).toBe(value); //  Identity: CanApply(x).map(id) === CanApply(x)
    });

    it('should satisfy functor composition law', () => {
        const f = (x: number) => x * 2;
        const g = (x: number) => x + 3;

        const composed = CanApply(5)
            .map((x) => g(f(x))) //  Direct composition
            .getValue();

        const separateMapping = CanApply(5)
            .map(f)
            .map(g) //  Separate function application
            .getValue();

        expect(composed).toBe(separateMapping); //  Functor law holds: map(f ∘ g) ≡ map(f) ∘ map(g)
    });
});
