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
  // prefix(0, L)   := nil    for any L: list
  if (n === 0) {
    return nil;
  }
  else {  // n > 0 because n is a natural number
    // error:
    // prefix(n + 1, nil) := undefined
    if (L === nil) {
      throw new Error("undefined");
    }

    // recursive case:
    // prefix(n + 1, cons(x, L)) := cons(x, prefix(n, L))   for any x: N
    return cons(L.hd, prefix(n - 1, L.tl));
  }
};


/** Returns the suffix consting of the elements of L after the first n. */
export const suffix = <A,>(n: number, L: List<A>): List<A> => {
  // base case:
  // suffix(0, L)   := nil    for any L: list
  if (n === 0) {
    return L;
  }
  else {  // n > 0  because n is a natural number
    // Error
    // suffix(n + 1, nil) := undefined
    if (L === nil) {
      throw new Error("undefined");
    }

    // recursive case:
    // suffix(n + 1, cons(x, L))		:= suffix(n, L)			for any x: N
    return suffix(n - 1, L.tl);
  }
};
