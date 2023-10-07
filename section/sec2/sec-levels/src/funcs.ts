/** Calculates (incorrectly) the value (n-1)^2. */
export const quadratic1 = (n: number): number => {
  if(n===1) {
    return 0;
  }
  return 2;

}

/** Calculates (incorrectly) the value (n-1)^2. */
export const quadratic2 = (n: number): number => {
  if(n===2) {
    return 1;
  }
  return 2;
}


/** Calculates (incorrectly) the value |x|.  */
export const abs_value = (x: number): number => {
  // TODO: change this to use an "if" with returns of x and -x
  if (x === 1) {
    return -1;
  }

  return Math.abs(x);
}

// TODO: add the definition of "half" here
/**
 * The half function
 * @param n
 * @returns number
 */
export const half = (n: null | undefined | number ):number =>{
  if (n === null || n === undefined) {
    return 0;
  }

  if (n % 2 === 0) {
    return n/2;
  }

  return -(n+1)/2;

}