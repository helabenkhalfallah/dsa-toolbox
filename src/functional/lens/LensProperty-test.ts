import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { isoLens, lens, optionalLens, traversalLens } from './Lens.ts';

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
        expect(user.age).toBe(25); // Ensure immutability
        expect(updatedUser).not.toBe(user); // Ensure it's a new object
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
        expect(user.address.city).toBe('Paris'); // Ensure original remains unchanged
        expect(updatedUser).not.toBe(user); // Ensure new object
    });

    it('should preserve structure and immutability in deeply nested updates', () => {
        type DeepUser = { profile: { contact: { email: string } } };

        const contactLens = lens<DeepUser, DeepUser['profile']['contact']>(
            (u) => u.profile.contact,
            (contact, u) => ({ ...u, profile: { ...u.profile, contact } }),
        );

        const emailLens = lens<DeepUser['profile']['contact'], string>(
            (contact) => contact.email,
            (email, contact) => ({ ...contact, email }),
        );

        const deepEmailLens = contactLens.compose(emailLens);

        const user: DeepUser = { profile: { contact: { email: 'alice@example.com' } } };

        expect(deepEmailLens.get(user)).toBe('alice@example.com');

        const updatedUser = deepEmailLens.set('new@example.com', user);
        expect(updatedUser.profile.contact.email).toBe('new@example.com');
        expect(user.profile.contact.email).toBe('alice@example.com'); // Original remains unchanged
        expect(updatedUser).not.toBe(user);
    });

    it('should satisfy the Lens laws', () => {
        fc.assert(
            fc.property(fc.object(), (obj) => {
                const idLens = lens<typeof obj, typeof obj>(
                    (o) => o,
                    (_, o) => o, // Identity setter: returns the same object
                );

                // Get-Set Law: Setting a value retrieved by `get` should result in the same value
                expect(idLens.set(idLens.get(obj), obj)).toEqual(obj);

                // Set-Get Law: Getting a value just set should return the set value
                const modified = idLens.set(obj, obj); // Instead of `{}`, we use `obj`
                expect(idLens.get(modified)).toEqual(obj);
            }),
        );
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

    it('should maintain lens laws under traversal', () => {
        fc.assert(
            fc.property(fc.array(fc.integer()), (arr) => {
                const arrLens = traversalLens<number>();

                // Mapping with identity function should not change the array
                expect(arrLens.modify((x) => x, arr)).toEqual(arr);

                // Double map f(f(x)) should be same as mapping g(x) = f(f(x))
                const f = (x: number) => x * 2;
                expect(arrLens.modify(f, arrLens.modify(f, arr))).toEqual(
                    arrLens.modify((x) => f(f(x)), arr),
                );
            }),
        );
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
        expect(profile.username).toBeUndefined(); // Original remains unchanged
    });

    it('should satisfy OptionalLens properties', () => {
        fc.assert(
            fc.property(fc.object(), (obj) => {
                const optLens = optionalLens<typeof obj, typeof obj>(
                    (o) => o ?? null,
                    (_, o) => o,
                );

                // Get-Set Law
                expect(optLens.set(optLens.get(obj)!, obj)).toEqual(obj);
            }),
        );
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

    it('should satisfy isomorphism laws', () => {
        fc.assert(
            fc.property(fc.integer(), (x) => {
                const identityLens = isoLens<number, number>(
                    (n) => n,
                    (n) => n,
                );

                // `get(reverseGet(x))` should return x
                expect(identityLens.get(identityLens.reverseGet(x))).toBe(x);

                // `reverseGet(get(x))` should return x
                expect(identityLens.reverseGet(identityLens.get(x))).toBe(x);
            }),
        );
    });
});
