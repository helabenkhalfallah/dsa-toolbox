import { describe, expect, it } from 'vitest';

import { dynamicLens, isoLens, lens, optionalLens, traversalLens } from './Lens.ts';

describe('dynamicLens', () => {
    it('should get a value from a simple object', () => {
        const obj = { name: 'Alice', age: 30 };
        const nameLens = dynamicLens(['name']);
        expect(nameLens.get(obj)).toBe('Alice');
        const ageLens = dynamicLens(['age']);
        expect(ageLens.get(obj)).toBe(30);
    });

    it('should get a value from a nested object', () => {
        const obj = { address: { city: 'New York', zip: '10001' } };
        const cityLens = dynamicLens(['address', 'city']);
        expect(cityLens.get(obj)).toBe('New York');
        const zipLens = dynamicLens(['address', 'zip']);
        expect(zipLens.get(obj)).toBe('10001');
    });

    it('should return undefined for a non-existent path', () => {
        const obj = { name: 'Bob' };
        const ageLens = dynamicLens(['age']);
        expect(ageLens.get(obj)).toBeUndefined();
        const nestedLens = dynamicLens(['address', 'city']);
        expect(nestedLens.get(obj)).toBeUndefined();
    });

    it('should set a value in a simple object', () => {
        const obj = { name: 'Charlie', age: 25 };
        const nameLens = dynamicLens(['name']);
        const updatedObj = nameLens.set('David', obj);
        expect(updatedObj).toEqual({ name: 'David', age: 25 });
    });

    it('should set a value in a nested object', () => {
        const obj = { address: { city: 'London', zip: 'WC2N 5DU' } };
        const cityLens = dynamicLens(['address', 'city']);
        const updatedObj = cityLens.set('Paris', obj);
        expect(updatedObj).toEqual({ address: { city: 'Paris', zip: 'WC2N 5DU' } });
    });

    it('should create nested objects when setting a value', () => {
        const obj = {};
        const lens = dynamicLens(['a', 'b', 'c']);
        const updatedObj = lens.set(123, obj);
        expect(updatedObj).toEqual({ a: { b: { c: 123 } } });
    });

    it('should set a value in a deeply nested object', () => {
        const obj = { a: { b: { c: { d: { e: 1 } } } } };
        const lens = dynamicLens(['a', 'b', 'c', 'd', 'e']);
        const updatedObj = lens.set(2, obj);
        expect(updatedObj).toEqual({ a: { b: { c: { d: { e: 2 } } } } });
    });

    it('should handle an empty path', () => {
        const obj = { name: 'Eve' };
        const lens = dynamicLens([]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(lens.set('test' as any, obj)).toEqual(obj); // test that the edge case is handled
        expect(lens.get(obj)).toEqual(obj);
    });

    it('should handle undefined objects in get', () => {
        const obj = undefined;
        const lens = dynamicLens(['a', 'b']);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(lens.get(obj as any)).toEqual(undefined);
    });
});

describe('Lens', () => {
    it('should get and set a property immutably', () => {
        type User = { name: string; age: number };

        const ageLens = lens<User, number>(
            (u) => u.age,
            (age, u) => ({ ...u, age }),
        );

        const user: User = { name: 'Alice', age: 25 };

        expect(ageLens.get(user)).toBe(25);

        const updatedUser = ageLens.set(30, user);
        expect(updatedUser.age).toBe(30);
        expect(user.age).toBe(25); // Original object remains unchanged
    });

    it('should compose lenses for nested properties', () => {
        type Address = { city: string; zip: string };
        type User = { name: string; address: Address };

        const addressLens = lens<User, Address>(
            (u) => u.address,
            (address, u) => ({ ...u, address }),
        );

        const cityLens = lens<Address, string>(
            (addr) => addr.city,
            (city, addr) => ({ ...addr, city }),
        );

        const userCityLens = addressLens.compose(cityLens);

        const user: User = { name: 'Alice', address: { city: 'Paris', zip: '75001' } };

        expect(userCityLens.get(user)).toBe('Paris');

        const updatedUser = userCityLens.set('London', user);
        expect(updatedUser.address.city).toBe('London');
        expect(user.address.city).toBe('Paris'); // Original object remains unchanged
    });
});

describe('TraversalLens', () => {
    it('should modify all elements in an array immutably', () => {
        const numberLens = traversalLens<number>();

        const numbers = [1, 2, 3, 4];

        const doubledNumbers = numberLens.modify((n) => n * 2, numbers);
        expect(doubledNumbers).toEqual([2, 4, 6, 8]);
        expect(numbers).toEqual([1, 2, 3, 4]); // Original array remains unchanged
    });
});

describe('OptionalLens', () => {
    it('should get and set optional properties safely', () => {
        type Profile = { username?: string };

        const usernameLens = optionalLens<Profile, string>(
            (p) => p.username ?? null,
            (username, p) => ({ ...p, username }),
        );

        const profile: Profile = {};

        expect(usernameLens.get(profile)).toBeNull();

        const updatedProfile = usernameLens.set('newUser', profile);
        expect(updatedProfile.username).toBe('newUser');
        expect(profile.username).toBeUndefined(); // Original object remains unchanged
    });
});

describe('IsoLens', () => {
    it('should convert between two equivalent representations', () => {
        const celsiusToFahrenheit = isoLens<number, number>(
            (c) => c * 1.8 + 32, // °C to °F
            (f) => (f - 32) / 1.8, // °F to °C
        );

        expect(celsiusToFahrenheit.get(0)).toBe(32);
        expect(celsiusToFahrenheit.reverseGet(32)).toBe(0);
    });
});
