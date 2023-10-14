import {Quilt, qnil, ROUND, STRAIGHT, Square, NW, NE, SW, SE, rcons, rnil, qcons} from "./quilt";

'./quilt';


const squareNERound: Square = { shape: ROUND, color: "GREEN", corner: NE };
const squareNWRound: Square = { shape: ROUND, color: "GREEN", corner: NW };
const squareSWRound: Square = { shape: ROUND, color: "GREEN", corner: SW };
const squareSERound: Square = { shape: ROUND, color: "GREEN", corner: SE };

const squareNWStraight: Square = { shape: STRAIGHT, color: "GREEN", corner: NW };
// const squareNEStraight: Square = { shape: STRAIGHT, color: "GREEN", corner: NE };
const squareSEStraight: Square = { shape: STRAIGHT, color: "GREEN", corner: SE };
// const squareSWStraight: Square = { shape: STRAIGHT, color: "GREEN", corner: SW };

/** Returns a quilt in pattern "A". */
export const PatternA = (): Quilt => {
  const row = rcons(squareNWRound, rcons(squareNWRound, rnil));
  return qcons(row, qcons(row, qcons(row, qcons(row, qnil))));
}

/** Returns a quilt in pattern "B". */
export const PatternB = (): Quilt => {
  const row = rcons(squareSEStraight, rcons(squareNWStraight, rnil));
  return qcons(row, qcons(row, qcons(row, qcons(row, qnil))));
}

/** Returns a quilt in pattern "C". */
export const PatternC = (): Quilt => {
  const row1 = rcons(squareNERound, rcons(squareNWRound, rnil));
  const row2 = rcons(squareSERound, rcons(squareSWRound, rnil));
  return qcons(row1, qcons(row2, qcons(row1, qcons(row2, qnil))));
}

/** Returns a quilt in pattern "D". */
export const PatternD = (): Quilt => {
  const row1 = rcons(squareSERound, rcons(squareSWRound, rnil));
  const row2 = rcons(squareNERound, rcons(squareNWRound, rnil));
  return qcons(row1, qcons(row2, qcons(row1, qcons(row2, qnil))));
}

/** Returns a quilt in pattern "E". */
export const PatternE = (): Quilt => {
  const row1 = rcons(squareNWStraight, rcons(squareSEStraight, rnil));
  const row2 = rcons(squareSEStraight, rcons(squareNWStraight, rnil));
  return qcons(row1, qcons(row2, qcons(row1, qcons(row2, qnil))));
}
