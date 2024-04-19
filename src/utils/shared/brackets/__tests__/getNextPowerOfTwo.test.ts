import { getNextPowerOfTwo } from '../getNextPowerOfTwo';

describe('getNextPowerOfTwo', () => {
  // Test for numbers that are not powers of two
  it('returns the next power of two for numbers not already a power of two', () => {
    expect(getNextPowerOfTwo(3)).toBe(4);
    expect(getNextPowerOfTwo(5)).toBe(8);
    expect(getNextPowerOfTwo(15)).toBe(16);
  });

  // Test for numbers that are powers of two
  it('returns the same number if it is already a power of two', () => {
    expect(getNextPowerOfTwo(2)).toBe(2);
    expect(getNextPowerOfTwo(16)).toBe(16);
    expect(getNextPowerOfTwo(1024)).toBe(1024);
  });

  // Edge cases
  it('handles edge cases correctly', () => {
    expect(getNextPowerOfTwo(0)).toBe(1); // Assuming we want to treat 0 as rounding up to 1
    expect(getNextPowerOfTwo(1)).toBe(1); // 1 is a power of two, so it should return itself
    expect(getNextPowerOfTwo(-1)).toBe(1); // Negative numbers round up to the smallest power of two
  });
});
