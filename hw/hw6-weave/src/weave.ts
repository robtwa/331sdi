import {List, nil, equal, cons, rev, len, compact_list} from './list';
import { Color } from './color';


////////////////////////////////////////////////////////////////
// my helper functions - begin

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
export const skip = (L: List<Color>): List<Color> => {
  // Base case
  if (L === nil) {
    return nil;
  }

  // Recursive case
  return L.tl;
};

// my helper functions - end
////////////////////////////////////////////////////////////////



/**
 * Returns the list of colors shown in the each of the odd rows (first,
 * third, fifth, etc.) by a warp-faced weave with the given warp colors.
 * @param list of all the (warp) colors in the weave
 * @return take(colors), i.e., every other color starting from the first
 */
export const weaveWarpFacedOdds = (colors: List<Color>): List<Color> => {
  // TODO(6c): detect and handle odd length lists here

  let R: List<Color> = rev(colors);   // reversed colors
  let S: List<Color> = nil;           // ghosted
  let T: List<Color> = nil;           // the returned color list

  // If the "colors" list has less than two elements
  if (len(R) < 2) {
    T = R;
    S = colors;
    R = nil;
  }

  // Inv: colors = concat(rev(R), S) and T = weaveWarpFacedOdds(S)
  while (R !== nil && R.tl !== nil) {
    if (len(R) % 2 !== 0) {  // odd
      T = cons(R.hd, T);  // take the current color
      S = cons(R.hd, S);  // ghosted list
      R = R.tl;           // the rest colors
    }
    else {  // even
      T = cons(R.tl.hd, T);               // take the next color
      S = cons(R.tl.hd, cons(R.hd, S));   // ghosted list
      R = R.tl.tl;                        // skip one
    }
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
  // TODO(6c): detect and handle odd length lists here

  let R: List<Color> = rev(colors);
  let S: List<Color> = nil;
  let T: List<Color> = nil;

  // If the "colors" list has less than two elements
  if (len(R) < 2) {
    T = nil;
    S = colors;
    R = nil;
  }

  // Inv: colors = concat(rev(R), S) and T = weaveWarpFacedEvens(S)
  while (R !== nil && R.tl !== nil) {
    if (len(R) % 2 === 0) {  // even
      T = cons(R.hd, T);  // take the current color
      S = cons(R.tl.hd, cons(R.hd, S));   // ghosted list
      R = R.tl.tl;                        // skip one
    }
    else {  // odd
      S = cons(R.hd, S);    // ghosted list
      R = R.tl;             // skip one
    }
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
export const weaveBalancedOdds
  = (colors: List<Color>, c: Color): List<Color> => {
  console.log(c)
  // TODO(6f): detect and handle odd length lists here

  let R: List<Color> = rev(colors);
  let S: List<Color> = nil;
  let T: List<Color> = nil;

  // Inv: TODO(6d): add this
  while (R !== nil && R.tl !== nil) {
    // TODO(6e): implement this
    break;  // TODO(6e): remove
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
      console.log(c);
  // TODO(6f): detect and handle odd length lists here

  let R: List<Color> = rev(colors);
  let S: List<Color> = nil;
  let T: List<Color> = nil;

  // Inv: TODO(6d): add this
  while (R !== nil && R.tl !== nil) {
    // TODO(6e): implement this
    break;  // TODO(6e): remove
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
      console.log(rows)
  // TODO: implement this with a while loop as described in 7a
  // Be sure to document your loop invariant with an Inv comment above the loop
  return cons(weaveWarpFacedEvens(colors),
      cons(weaveWarpFacedOdds(colors), nil));
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
      console.log(rows)
  // TODO: implement this with a while loop as described in 7b
  // Be sure to document your loop invariant with an Inv comment above the loop
  return cons(weaveBalancedEvens(colors, c),
      cons(weaveBalancedOdds(colors, c), nil));
};
