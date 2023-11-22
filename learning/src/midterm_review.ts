import {List, cons, nil, rev, echo, concat} from "./list";

/** A cursor is a list of integers. */
export interface IntCursor {
  /** @returns obj */
  values: () => List<number>;
  /** @returns at(n, obj) */
  valueAt: (n: number) => number | undefined;
}

class EchoCursor implements IntCursor {
// AF: obj = echo(this.vals)
  readonly vals: List<number>; // list before echo-ing
  constructor(vals: List<number>) {
    this.vals = vals;
  }
// ... methods implemented later ...
  values = ( ): List<number> => {
    let R: List<number> = this.vals;
    let S: List<number> = nil;
    // {{ }}
    //this.checkInv1(S, R);
    // {{ Inv: echo(this.vals) = concat(rev(S), echo(R)) }}
    while (R !== nil) {
      // {{ }}
      S = cons(R.hd, cons(R.hd, S));
      // {{ }}
      R = R.tl;
    }
    // {{ echo(this.vals) = rev(S) }}
    return rev(S);
  };

  checkInv1 = (S: List<number>, R: List<number>):void => {
    if(!(echo(this.vals) === concat(rev(S), echo(R)))) {
      console.log("echo(this.vals) = ", echo(this.vals))
      console.log("concat(rev(S), echo(R)) = ", concat(rev(S), echo(R)))
      throw new Error("Broken inv1.")
    }
  }

  // @returns at(n, obj) -> at(n, echo(this.vals))
  valueAt = (n: number): number |undefined => {
    const m = Math.floor(n/2);
    return at(m, this.vals);

    //return at(n, echo(this.vals));
  };
}

/** @returns a cursor representing the list echo(vals) */
export const makeEchoCursor = (vals: List<number>): IntCursor => {
  return new EchoCursor(vals);
};

// helper functions

// func at(n, nil)            := undefined        for any n : N
//      at(0, cons(x, L))     := x                for any x : Z and L : List
//      at(n + 1, cons(x, L)) := at(n, L)         for any n : N, x : Z and L : List

export const at = (n:number, l: List<number>): number | undefined => {
  // console.log("******************************");
  // console.log("n = ", n);
  // console.log("l = ", l);

  if (l === nil) {
    return undefined;
  }
  else {  // l !== nil
    if (n === 0) {
      return l.hd;
    }
    else {  // n !== 0
      return at(n - 1, l.tl);
    }
  }


}
