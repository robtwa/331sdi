/** Calculates (incorrectly) the value (n-1)^2. */
export const quadratic3 = (n: number): number => {
  if(n < 3) {
    return (n - 1) * (n - 1);
  }
  return  1;
}

/** Calculates (incorrectly) the value |x|.  */
export const abs_value3 = (x: number): number => {
  if(x < -1) {
    return -x;
  }
  return x;
}

/** Calculates (incorrectly) the value |x|.  */
export const abs_value4 = (x: number): number|undefined => {
  if (x === 0) {
    return undefined;
  }
  return (x < 0)?-x:x;
}

/**
 * Returns the number of pairs we can get from n items, where n is a
 * non-negative integer.
 */
export const count_pairs = (n: number): number => {
  if (n < 1 ) {
    return 0;
  }
  if (n % 2 === 0) {
    return count_pairs(n - 2) + 1;
  }
  return count_pairs(n - 2);
}

/**
 * Returns the number of pairs we can get from n items, where n is a
 * non-negative integer.
 */
export const count_pairs2 = (n: number): number => {
  if (n <= 1 ) { // base case
    return 0;
  }
  return count_pairs(n - 2) + 1; // even and odd #
}


// TODO: add the definition of "u" here
export const u = (input: {b: boolean, n: number}): number => {
  if (input.n === 0) {
    return 0;
  }
  if (input.b) {
    return input.n;
  }
  return -(input.n);
}


// TODO: add the definition of "v" here
export const v = (input: number | [boolean, number]): number => {
  if (typeof input === "number") {
    return input;
  }
  if (input[1] === 0) {
    return 1;
  }
  return input[1];
}


// TODO: add the definition of "w" here
export const w = (input: [number, {b: boolean, n: number}]): number => {
  if (input[1].b) {
    return  input[0] + input[1].n;
  }
  return  input[0] - input[1].n;
}
