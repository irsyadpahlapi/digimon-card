import { ProfileRepository } from '../profile';

describe('ProfileRepository', () => {
  describe('ProfileRepository Interface', () => {
    it('should have correct structure for ProfileRepository interface', () => {
      const mockProfile: ProfileRepository = {
        id: 1,
        name: 'TestUser',
        coin: 100,
      };

      expect(mockProfile.id).toBe(1);
      expect(mockProfile.name).toBe('TestUser');
      expect(mockProfile.coin).toBe(100);

      // Type validation
      expect(typeof mockProfile.id).toBe('number');
      expect(typeof mockProfile.name).toBe('string');
      expect(typeof mockProfile.coin).toBe('number');
    });

    it('should validate all required properties exist', () => {
      const profile: ProfileRepository = {
        id: 123,
        name: 'ExampleUser',
        coin: 500,
      };

      expect(profile).toHaveProperty('id');
      expect(profile).toHaveProperty('name');
      expect(profile).toHaveProperty('coin');
    });

    it('should validate property types correctly', () => {
      const profile: ProfileRepository = {
        id: 42,
        name: 'TypeTestUser',
        coin: 250,
      };

      expect(typeof profile.id).toBe('number');
      expect(typeof profile.name).toBe('string');
      expect(typeof profile.coin).toBe('number');

      expect(Number.isInteger(profile.id)).toBe(true);
      expect(Number.isInteger(profile.coin)).toBe(true);
    });

    it('should validate ID is positive and unique', () => {
      const profiles: ProfileRepository[] = [
        { id: 1, name: 'User1', coin: 10 },
        { id: 2, name: 'User2', coin: 20 },
        { id: 3, name: 'User3', coin: 30 },
        { id: 100, name: 'User100', coin: 1000 },
      ];

      profiles.forEach((profile) => {
        expect(profile.id).toBeGreaterThan(0);
        expect(Number.isInteger(profile.id)).toBe(true);
      });

      const ids = profiles.map((p) => p.id);
      const uniqueIds = [...new Set(ids)];
      expect(uniqueIds).toHaveLength(ids.length); // All IDs should be unique
    });

    it('should validate name is not empty string', () => {
      const validNames = ['Alice', 'Bob', 'Charlie123', 'User_Name', 'test-user'];

      validNames.forEach((name) => {
        const profile: ProfileRepository = {
          id: 1,
          name: name,
          coin: 50,
        };

        expect(profile.name.length).toBeGreaterThan(0);
        expect(profile.name.trim()).toBe(profile.name); // No leading/trailing spaces
        expect(typeof profile.name).toBe('string');
      });
    });

    it('should validate coin value constraints', () => {
      const validCoinValues = [0, 1, 50, 100, 1000, 9999];

      validCoinValues.forEach((coinValue) => {
        const profile: ProfileRepository = {
          id: 1,
          name: 'TestUser',
          coin: coinValue,
        };

        expect(profile.coin).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(profile.coin)).toBe(true);
        expect(typeof profile.coin).toBe('number');
      });
    });

    it('should handle zero coin balance', () => {
      const poorProfile: ProfileRepository = {
        id: 1,
        name: 'PoorUser',
        coin: 0,
      };

      expect(poorProfile.coin).toBe(0);
      expect(poorProfile.coin).toBeGreaterThanOrEqual(0);
    });

    it('should handle large coin balances', () => {
      const richProfile: ProfileRepository = {
        id: 1,
        name: 'RichUser',
        coin: 999999,
      };

      expect(richProfile.coin).toBe(999999);
      expect(richProfile.coin).toBeGreaterThan(0);
      expect(Number.isInteger(richProfile.coin)).toBe(true);
    });

    it('should validate name with various character sets', () => {
      const validNames = [
        'SimpleUser',
        'User123',
        'user_name',
        'user-name',
        'UserName',
        'A',
        'VeryLongUserNameThatShouldStillBeValid',
      ];

      validNames.forEach((name) => {
        const profile: ProfileRepository = {
          id: 1,
          name: name,
          coin: 100,
        };

        expect(profile.name).toBe(name);
        expect(profile.name.length).toBeGreaterThan(0);
        expect(typeof profile.name).toBe('string');
      });
    });

    it('should maintain data consistency for profile operations', () => {
      // Simulate profile after buying something
      const initialProfile: ProfileRepository = {
        id: 1,
        name: 'Buyer',
        coin: 100,
      };

      const afterPurchase: ProfileRepository = {
        ...initialProfile,
        coin: initialProfile.coin - 20, // Bought something for 20 coins
      };

      expect(afterPurchase.coin).toBe(80);
      expect(afterPurchase.id).toBe(initialProfile.id);
      expect(afterPurchase.name).toBe(initialProfile.name);
    });

    it('should maintain data consistency for profile after earning coins', () => {
      const beforeEarning: ProfileRepository = {
        id: 1,
        name: 'Earner',
        coin: 50,
      };

      const afterEarning: ProfileRepository = {
        ...beforeEarning,
        coin: beforeEarning.coin + 30, // Earned 30 coins
      };

      expect(afterEarning.coin).toBe(80);
      expect(afterEarning.id).toBe(beforeEarning.id);
      expect(afterEarning.name).toBe(beforeEarning.name);
    });

    it('should be suitable for localStorage serialization', () => {
      const profile: ProfileRepository = {
        id: 42,
        name: 'SerializableUser',
        coin: 150,
      };

      // Test JSON serialization/deserialization
      const serialized = JSON.stringify(profile);
      const deserialized = JSON.parse(serialized) as ProfileRepository;

      expect(deserialized.id).toBe(profile.id);
      expect(deserialized.name).toBe(profile.name);
      expect(deserialized.coin).toBe(profile.coin);
      expect(typeof deserialized.id).toBe('number');
      expect(typeof deserialized.name).toBe('string');
      expect(typeof deserialized.coin).toBe('number');
    });

    it('should work with React component state', () => {
      const defaultProfile: ProfileRepository = {
        id: 0,
        name: '',
        coin: 0,
      };

      const userProfile: ProfileRepository = {
        id: 1,
        name: 'ReactUser',
        coin: 200,
      };

      // Simulate state update
      const updatedProfile = { ...defaultProfile, ...userProfile };

      expect(updatedProfile.id).toBe(1);
      expect(updatedProfile.name).toBe('ReactUser');
      expect(updatedProfile.coin).toBe(200);
    });

    it('should validate interface completeness', () => {
      const profile: ProfileRepository = {
        id: 999,
        name: 'CompleteUser',
        coin: 777,
      };

      // Ensure all expected properties are present
      const requiredKeys = ['id', 'name', 'coin'];
      const profileKeys = Object.keys(profile);

      requiredKeys.forEach((key) => {
        expect(profileKeys).toContain(key);
      });

      expect(profileKeys).toHaveLength(requiredKeys.length);
    });

    it('should handle profile comparison operations', () => {
      const profile1: ProfileRepository = {
        id: 1,
        name: 'User1',
        coin: 100,
      };

      const profile2: ProfileRepository = {
        id: 2,
        name: 'User2',
        coin: 150,
      };

      const profile1Copy: ProfileRepository = {
        id: 1,
        name: 'User1',
        coin: 100,
      };

      // Different profiles
      expect(profile1.id).not.toBe(profile2.id);
      expect(profile1.coin).toBeLessThan(profile2.coin);

      // Same profile data
      expect(profile1.id).toBe(profile1Copy.id);
      expect(profile1.name).toBe(profile1Copy.name);
      expect(profile1.coin).toBe(profile1Copy.coin);
    });
  });
});
