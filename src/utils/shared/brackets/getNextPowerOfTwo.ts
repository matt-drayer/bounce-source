export const getNextPowerOfTwo = (n: number): number => {
  if (n < 1) {
    return 1;
  }

  // Check if n is already a power of two
  const isPowerOfTwo = (n & (n - 1)) === 0;

  if (isPowerOfTwo) {
    return n; // Return the current power if it already is one
  }

  // Calculate the next power of two for numbers not a power of two
  return Math.pow(2, Math.ceil(Math.log(n) / Math.log(2)));
};