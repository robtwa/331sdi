import {
  List,
  nil,
  equal,
  cons,
  rev,
  len,
} from './list';
import {Color} from './color';
// import * as assert from 'assert';

/**
 * Returns the list of colors shown in the each of the odd rows (first,
 * third, fifth, etc.) by a warp-faced weave with the given warp colors.
 * @param list of all the (warp) colors in the weave
 * @return take(colors), i.e., every other color starting from the first
 */
export const weaveWarpFacedOdds = (colors: List<Color>): List<Color> => {
  if (colors !== nil && len(colors) % 2 !== 0) { // odds
    return cons(colors.hd, weaveWarpFacedEvens(colors.tl));
  }

  let R: List<Color> = rev(colors);   // reversed colors
  let S: List<Color> = nil;           // ghosted
  let T: List<Color> = nil;           // the returned color list

  // Inv: colors = concat(rev(R), S) and T = weaveWarpFacedOdds(S)
  while (R !== nil && R.tl !== nil) {
    T = cons(R.tl.hd, T);               // take the next color
    S = cons(R.tl.hd, cons(R.hd, S));   // ghosted list
    R = R.tl.tl;                        // skip one
  }

  if (!equal(S, colors)) {  // defensive programming
    throw new Error("uh oh! S != colors... we made a mistake somewhere!");
  }

  if (R === nil) {
    return T;  // We have S = colors, so T = take(S) = take(colors).
  } else {
    throw new Error("uh oh! the list length wasn't even");
  }
};

/**
 * Returns the list of colors shown in the each of the even rows (second,
 * fourth, etc.) by a warp-faced weave with the given warp colors.
 * @param list of all the (warp) colors in the weave
 * @return skip(colors), i.e., every other color starting from the second
 */
export const weaveWarpFacedEvens = (colors: List<Color>): List<Color> => {
  if (colors !== nil && len(colors) % 2 !== 0) { // odds
    return weaveWarpFacedOdds(colors.tl);
  }

  let R: List<Color> = rev(colors);
  let S: List<Color> = nil;
  let T: List<Color> = nil;

  // Inv: colors = concat(rev(R), S) and T = weaveWarpFacedEvens(S)
  while (R !== nil && R.tl !== nil) {
    T = cons(R.hd, T);  // take the current color
    S = cons(R.tl.hd, cons(R.hd, S));   // ghosted list
    R = R.tl.tl;                        // skip one
  }

  if (!equal(S, colors)) {  // defensive programming
    throw new Error("uh oh! S != colors... we made a mistake somewhere!");
  }

  if (R === nil) {
    return T;  // We have S = colors, so T = skip(S) = skip(colors).
  } else {
    throw new Error("uh oh! the list length wasn't even");
  }
};

/**
 * Returns the list of colors shown in the each of the odd rows (first, third,
 * fifth, etc.) by a balanced weave with the given warp and weft colors.
 * @param list of all the (warp) colors in the weave
 * @param c (weft) color to replace with
 * @return leave(colors, c)
 */
export const weaveBalancedOdds =
  (colors: List<Color>, c: Color): List<Color> => {
    if (colors !== nil && len(colors) % 2 !== 0) { // odd length
      return cons(colors.hd, weaveBalancedEvens(colors.tl, c));
    }

    let R: List<Color> = rev(colors);
    let S: List<Color> = nil;   // ghosted
    let T: List<Color> = nil;   // the returned list

    // Inv: colors = concat(rev(R), s) and T = weaveBalancedOdds(S)
    while (R !== nil && R.tl !== nil) {
      T = cons(R.tl.hd, cons(c, T));      // Take the next color
      S = cons(R.tl.hd, cons(R.hd, S));   // cons("red", cons("green", ...))
      R = R.tl.tl;     // The rest of the color list for the next iteration
    }

    if (!equal(S, colors)) {  // defensive programming
      throw new Error("uh oh! S != colors... we made a mistake somewhere!");
    }

    if (R === nil) {
      return T;  // We have S = colors, so T = leave(S, c) = leave(colors, c).
    } else {
      throw new Error("uh oh! the list length wasn't even");
    }
  };

/**
 * Returns the list of colors shown in the each of the even rows (second,
 * fourth, etc.) by a balanced weave with the given warp and weft colors.
 * @param list of all the (warp) colors in the weave
 * @param c (weft) color to replace with
 * @return replace(colors, c)
 */
export const weaveBalancedEvens =
  (colors: List<Color>, c: Color): List<Color> => {
  if (colors !== nil && len(colors) % 2 !== 0) {
    return cons(c, weaveBalancedOdds(colors.tl, c));
  }

  let R: List<Color> = rev(colors);
  let S: List<Color> = nil;
  let T: List<Color> = nil;

  // Inv: colors = concat(rev(R), s) and T = weaveBalancedEvens(colors)
  while (R !== nil && R.tl !== nil) {
    T = cons(c, cons(R.hd, T));
    S = cons(R.tl.hd, cons(R.hd, S));
    R = R.tl.tl;
  }

  if (!equal(S, colors)) {  // defensive programming
    throw new Error("uh oh! S != colors... we made a mistake somewhere!");
  }

  if (R === nil) {
    return T;  // We have S = colors, so T = replace(S, c) = replace(colors, c)
  } else {
    throw new Error("uh oh! the list length wasn't even");
  }
};

/**
 * Returns the given number of rows of a weave with the given colors
 * @param rows the (natural) number of rows in the weave
 * @param colors the weft colors in each row
 * @returns list of the given length where the odd values are the colors of
 *      weaveWarpFacedOdds and the even values are the colors of
 *      weaveWarpFacedEvens.
 * @returns the function defined recursively (on rows) by
 *   - weaveWarpFaced(0, colors) = nil
 *   - weaveWarpFaced(1, colors) = cons(weaveWarpFacedEvens(colors), nil)
 *   - weaveWarpFaced(n+2, colors) =
 *         cons(weaveWarpFacedEvens(colors),
 *             cons(weaveWarpFacedOdds(colors), weaveWarpFaced(n, colors)))
 */
export const weaveWarpFaced =
                    (rows: number, colors: List<Color>): List<List<Color>> => {
  let I: number = (rows % 2 === 0) ? 0 : 1;
  let S: List<List<Color>> = (I === 0) ?
    nil : cons(weaveWarpFacedEvens(colors), nil);
  // Inv: S = weaveWarpFaced(I, colors)
  while (I != rows) {
    // checks for invariant
    // assert.deepEqual(S, weaveWarpFaced(I, colors));
    S = cons(weaveWarpFacedEvens(colors),
          cons(weaveWarpFacedOdds(colors), S));
    I = I + 2;
  }
  return S;
};

/**
 * Returns the given number of rows of a balanced weave with the given colors
 * @param rows the (natural) number of rows in the weave
 * @param colors the warp colors in each row
 * @param c the weft color
 * @returns the function defined recursively (on rows) by
 *   - weaveBalanced(0, colors, c) = nil
 *   - weaveBalanced(1, colors, c) = cons(weaveBalancedEvens(colors, c), nil)
 *   - weaveBalanced(n+2, colors) =
 *         cons(weaveBalancedEvens(colors, c),
 *             cons(weaveBalancedOdds(colors, c), weaveBalanced(n, colors, c)))
 */
export const weaveBalanced =
  (rows: number, colors: List<Color>, c: Color): List<List<Color>> => {
    let I: number = (rows % 2 === 0) ? 0 : 1;
    let S: List<List<Color>> = (I === 0) ?
      nil : cons(weaveBalancedEvens(colors, c), nil);
    // Inv: S = weaveWarpFaced(I, colors)
    while (I != rows) {
      // checks for invariant
      // assert.deepEqual(S, weaveBalanced(I, colors, c));
      S = cons(weaveBalancedEvens(colors, c),
            cons(weaveBalancedOdds(colors, c), S));
      I = I + 2;
    }
    return S;
  };

////////////////////////////////////////////////////////////////////////////////
// Graders, do not read this part
// This is just to show myself what the recursive versions look like
//
// recursive versions - begin
/**
 * My recursive version of weaveWarpFacedOdds
 * @param colors
 */
export const weaveWarpFacedOdds1 = (colors: List<Color>): List<Color> => {
  // base case
  if (colors === nil) {
    return nil;
  }
  // recursive case
  return cons(colors.hd, weaveWarpFacedOdds(skip(colors.tl)));
}

// func skip(nil) 		    := nil
//      skip(cons(a, L)) 	:= L 			for any a : Color and L : List
/**
 * Skip
 * @param L
 */
export const skip = (L: List<Color>): List<Color> => {
  // Base case
  if (L === nil) {
    return nil;
  }

  // Recursive case
  return L.tl;
};

// func leave(nil,c)	      := nil	                 for any c : Z
//      leave(cons(a,L),c)	:= cons(a,replace(L,c)) for any a,c : Z and L : List
/**
 * The recursive version for weaveBalancedOdds
 * @param L
 * @param c
 */
export const weaveBalancedOdds1 = (L: List<string>, c: string): List<string> => {
  if (L === nil) {  // base case
    return nil;
  } else {  // recursive case
    return cons(L.hd, weaveBalancedEvens1(L.tl, c));
  }
}

// func replace(nil,c)	      := nil	              for any c : Z
//      replace(cons(a,L),c)	:= cons(c,leave(L,c)) for any a,c : Z and L : List
/**
 * The recursive version for weaveBalancedEvens
 * @param L
 * @param c
 */
export const weaveBalancedEvens1 = (L: List<string>, c: string): List<string> => {
  if (L === nil) {  // base case
    return nil;
  } else {  // recursive case
    return cons(c, weaveBalancedOdds1(L.tl, c));
  }
}

//
// func weaveBal(0, colors, c) 		  := nil
//      weaveBal(1, colors, c) 		  := evens
//      weaveBal(n + 2, colors, c) 	:= cons(evens,
//                                        cons(odds,weaveBal(n, colors)))
//                                                                for any n : N
//            where evens := weaveBalancedEvens(colors, c)
//               and odds := weaveBalancedOdds(colors, c)
/**
 * Recursive version for weaveBalanced
 * @param rows
 * @param colors
 * @param c
 */
export const weaveBalanced2 =
  (rows: number, colors: List<Color>, c: Color): List<List<Color>> => {
    if (rows === 0) {  // base case
      return nil;
    } else if (rows === 1) {
      return cons(weaveBalancedEvens(colors, c), nil);
    } else {  // recursive case
      return cons(weaveBalancedEvens(colors, c),
        cons(weaveBalancedOdds(colors, c),
          weaveBalanced2(rows - 2, colors, c)));
    }
}

//
// func weave(0, colors) 	    := nil
//      weave(1, colors) 	    := evens
//      weave(n + 2, colors) 	:= cons(evens,
//                                cons(odds,weave(n,colors))) for any n : N
//          where evens := weaveWarpFacedEvens(colors)
//            and odds := weaveWarpFacedOdds(colors)
/**
 * Recursive version for weaveWarpFaced
 * @param rows
 * @param colors
 */
export const weaveWarpFaced2 =
  (rows: number, colors: List<Color>): List<List<Color>> => {
  if (rows === 0) {  // base case
    return nil;
  } else if (rows === 1) {
    return cons(weaveWarpFacedEvens(colors), nil);
  } else {  // recursive case
    return cons(weaveWarpFacedEvens(colors),
      cons(weaveWarpFacedOdds(colors),
        weaveWarpFaced2(rows - 2, colors)));
  }
}

// recursive versions - end
////////////////////////////////////////////////////////////////
