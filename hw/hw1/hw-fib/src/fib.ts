/**
 * Returns the n-th Fibonacci number
 * @param n a non-negative integer, indicating which Fibonacci number to return
 * @returns 0 if n = 0, 1 if n = 1, and the sum of the previous two Fibonacci
 *    numbers otherwise
 */
export const fib = (n: number): number => {
  // console.log('fib: n = '+ n);
  if (n < 0) {
    throw new Error('n must be non-negative');
  } else if (n === 0) {
    return 0;
  } else if (n === 1) {
    return 1;
  } else {
    const res: FibPair = fastFib(n-1);
    return res.curFib + res.prevFib;
  }
};


/** Type that stores not just one Fibonacci number but the previous one also. */
export type FibPair = {curFib: number, prevFib: number};

/**
 * Returns the n-th Fibonacci number
 * @param n a positive integer, indicating which Fibonacci number to return
 * @returns a FibPair containing fib(n) (and also fib(n-1))
 */
export const fastFib = (n: number): FibPair => {
  // TODO: implement this in problem 1
  // console.log('fastFib: n = '+ n);
  if(n < 1) {
    throw new Error('n cannot less than 1.');
  }

  if(n === 1) {
    return {curFib: 1, prevFib: 0};
  }

  if(n === 2) {
    return {curFib: 1, prevFib: 1};
  }

  const res: FibPair = fastFib(n-1);
  return {curFib: res.curFib + res.prevFib, prevFib: res.curFib};
};


/** Type for storing (fib(n-1), fib(n)) for some n. */
export type FibPair2 = [number, number];

/**
 * Returns the n-th Fibonacci number
 * @param n a positive integer, indicating which Fibonacci number to return
 * @returns the pair containing fib(n)
 */
export const fastFib2 = (n: number): FibPair2 => {
  // TODO: implement this in problem 3
  // console.log('fastFib2: n = '+ n);
  if(n < 1) {
    throw new Error('n cannot less than 1.');
  }

  if(n === 1) {
    return [0, 1];
  }

  if(n === 2) {
    return [1, 1];
  }

  const [prevFib, curFib] = fastFib2(n-1);
  return [curFib, curFib + prevFib]
};


/**
 * Returns the smallest Fibonacci number that is greater than or equal to m.
 * @param m a non-negative integer
 * @returns the smallest Fibonacci number greater than or equal to m
 */
export const nextFib = (m: number): number => {
  if (m < 0) {
    throw new Error('m must be non-negative');
  } else if (m === 0) {
    return 0;
  } else {
    return nextFibHelper(0, 1, m);
  }
};

/**
 * Returns the smallest Fibonacci number that is greater than or equal to m.
 * @param prevFib the Fibonacci number before curFib
 * @param curFib the current Fibonacci number (working up to m)
 * @param m the lower bound on the Fibonacci number
 * @returns the smallest Fibonacci number greater than or equal to m
 */
const nextFibHelper = (prevFib: number, curFib: number, m: number): number => {
  // TODO: implement this in problem 4
  //console.log(`nextFibHelper: prevFib=${prevFib}, curFib=${curFib}, m=${m}`);

  if(curFib < m) {
    return nextFibHelper(curFib, prevFib+curFib, m);
  }

  return curFib;
};

/**
 * Returns whether the input number is a Fibonacci number or the difference
 * between the input number and the next Fibonacci number.
 * @param age the input number
 * @returns string message
 */
export const ageAndFib = (age: number): string => {
  const ageFib = nextFib(age);

  if(ageFib === age) {
    return "is a Fibonacci number!";
  }

  return `will be a Fibonacci number in ${ageFib - age} years.`;
}