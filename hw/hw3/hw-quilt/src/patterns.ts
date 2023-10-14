import {Quilt, qnil, ROUND, STRAIGHT, Square, NW, SE, rcons, rnil, qcons} from "./quilt";

'./quilt';




/** Returns a quilt in pattern "A". */
export const PatternA = (): Quilt => {
  // TODO: replace
  const squareNWRound: Square = { shape: ROUND, color: "GREEN", corner: NW };
  const row = rcons(squareNWRound, rcons(squareNWRound, rnil));
  return qcons(row, qcons(row, qcons(row, qcons(row, qnil))));
}

/** Returns a quilt in pattern "B". */
export const PatternB = (): Quilt => {
  // TODO: replace
  const squareNWStraight: Square = { shape: STRAIGHT, color: "GREEN", corner: NW };
  const squareSEStraight: Square = { shape: STRAIGHT, color: "GREEN", corner: SE };

  const row = rcons(squareSEStraight, rcons(squareNWStraight, rnil));
  return qcons(row, qcons(row, qcons(row, qcons(row, qnil))));
}

/** Returns a quilt in pattern "C". */
export const PatternC = (): Quilt => {
  return qnil;  // TODO: replace
}

/** Returns a quilt in pattern "D". */
export const PatternD = (): Quilt => {
  return qnil;  // TODO: replace
}

/** Returns a quilt in pattern "E". */
export const PatternE = (): Quilt => {
  return qnil;  // TODO: replace
}
