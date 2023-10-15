import {Quilt, qnil, ROUND, STRAIGHT, Square, GREEN, NW, NE, SW, SE, rcons, rnil, qcons,
      Color, RED} from "./quilt";

'./quilt';


const ne_round: Square = { shape: ROUND, color: GREEN, corner: NE };
const nw_round: Square = { shape: ROUND, color: GREEN, corner: NW };
const sw_round: Square = { shape: ROUND, color: GREEN, corner: SW };
const se_round: Square = { shape: ROUND, color: GREEN, corner: SE };

const nw_straight: Square = { shape: STRAIGHT, color: GREEN, corner: NW };
const sw_straight: Square = { shape: STRAIGHT, color: GREEN, corner: SE };

/** Returns a quilt in pattern "A". */
export const PatternA = (color: Color | undefined): Quilt => {
  if(color === RED) {
    nw_round.color = RED;
  }

  const row = rcons(nw_round, rcons(nw_round, rnil));
  return qcons(row, qcons(row, qcons(row, qcons(row, qnil))));
}

/** Returns a quilt in pattern "B". */
export const PatternB = (color: Color | undefined): Quilt => {
  if(color === RED) {
    sw_straight.color = RED;
    nw_straight.color = RED;
  }

  const row = rcons(sw_straight, rcons(nw_straight, rnil));
  return qcons(row, qcons(row, qcons(row, qcons(row, qnil))));
}

/** Returns a quilt in pattern "C". */
export const PatternC = (color: Color | undefined): Quilt => {
  if(color === RED) {
    ne_round.color = RED;
    nw_round.color = RED;
    se_round.color = RED;
    sw_round.color = RED;
  }

  const row1 = rcons(ne_round, rcons(nw_round, rnil));
  const row2 = rcons(se_round, rcons(sw_round, rnil));
  return qcons(row1, qcons(row2, qcons(row1, qcons(row2, qnil))));
}

/** Returns a quilt in pattern "D". */
export const PatternD = (color: Color | undefined): Quilt => {
  if(color === RED) {
    se_round.color = RED;
    sw_round.color = RED;
    ne_round.color = RED;
    nw_round.color = RED;
  }

  const row1 = rcons(se_round, rcons(sw_round, rnil));
  const row2 = rcons(ne_round, rcons(nw_round, rnil));
  return qcons(row1, qcons(row2, qcons(row1, qcons(row2, qnil))));
}

/** Returns a quilt in pattern "E". */
export const PatternE = (color: Color | undefined): Quilt => {
  if(color === RED) {
    nw_straight.color = RED;
    sw_straight.color = RED;
    sw_straight.color = RED;
    nw_straight.color = RED;
  }

  const row1 = rcons(nw_straight, rcons(sw_straight, rnil));
  const row2 = rcons(sw_straight, rcons(nw_straight, rnil));
  return qcons(row1, qcons(row2, qcons(row1, qcons(row2, qnil))));
}
