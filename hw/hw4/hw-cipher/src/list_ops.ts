import {cons, List, nil} from './list';


/** Returns the last element in the given list. */
export const last = <A,>(L: List<A>): A => {
    if (L === nil) {
        throw new Error("empty list has no last element");
    } else if (L.tl === nil) {
        return L.hd;
    } else {
        return last(L.tl);
    }
};


/** Returns the prefix consting of the first n elements of L. */
export const prefix = <A,>(n: number, L: List<A>): List<A> => {
  // base case:
  // prefix(n + 1, nil) := undefined
  if (L === nil && n > 0) {
      throw new Error("undefined");
  }
  // base case:
  // prefix(0, L)   := nil    for any L: list
  // prefix(n, nil) := nil    for any n
  if (n === 0 || L === nil) {
    return nil;
  }

  // recursive case:
  // prefix(n + 1, cons(x, L)) := prefix(n, cons(x, L))
  return cons(L.hd, prefix(n - 1, L.tl));
};


/** Returns the suffix consting of the elements of L after the first n. */
export const suffix = <A,>(n: number, L: List<A>): List<A> => {
  n;  // TODO: remove this (just making the compiler happy)
  return L;  // TODO: replace
};
