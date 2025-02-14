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
