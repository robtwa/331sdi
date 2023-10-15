import {Quilt, qnil, ROUND, STRAIGHT, Square, GREEN, NW, NE, SW, SE, rcons, rnil, qcons,
      Color, RED} from "./quilt";

'./quilt';



const nw_round_green: Square = { shape: ROUND, color: GREEN, corner: NW };
const ne_round_green: Square = { shape: ROUND, color: GREEN, corner: NE };
const se_round_green: Square = { shape: ROUND, color: GREEN, corner: SE };
const sw_round_green: Square = { shape: ROUND, color: GREEN, corner: SW };
const nw_round_red: Square = { shape: ROUND, color: RED, corner: NW };
const ne_round_red: Square = { shape: ROUND, color: RED, corner: NE };
const se_round_red: Square = { shape: ROUND, color: RED, corner: SE };
const sw_round_red: Square = { shape: ROUND, color: RED, corner: SW };


const nw_straight_green: Square = { shape: STRAIGHT, color: GREEN, corner: NW };
const se_straight_green: Square = { shape: STRAIGHT, color: GREEN, corner: SE };
const nw_straight_red: Square = { shape: STRAIGHT, color: RED, corner: NW };
const se_straight_red: Square = { shape: STRAIGHT, color: RED, corner: SE };

// ************* helper  - begin ************
const err_msg_rows: string = "Invalid row number.";


// ************* helper - end ************

/** Returns a quilt in pattern "A". */
export const PatternA = (rows: number | undefined, color: Color | undefined): Quilt => {
  // Make sure rows > -1.
  if (rows === undefined || rows < 0) {
    throw new Error(err_msg_rows);
  }

  // Base case
  if (rows === 0) {
    return qnil;
  }

  // Recursive case
  if(color === RED) {
    return qcons(rcons(nw_round_red, rcons(nw_round_red, rnil)), PatternA(rows - 1, color));
  }
  return qcons(rcons(nw_round_green, rcons(nw_round_green, rnil)), PatternA(rows - 1, color));
}

/** Returns a quilt in pattern "B". */
export const PatternB = (rows: number | undefined, color: Color | undefined): Quilt => {
  // Make sure rows > -1.
  if (rows === undefined || rows < 0) {
    throw new Error(err_msg_rows);
  }

  // Base case
  if (rows === 0) {
    return qnil;
  }

  if(color === RED) {
    return qcons(rcons(se_straight_red, rcons(nw_straight_red, rnil)), PatternB(rows - 1, color));
  }

  return qcons(rcons(se_straight_green, rcons(nw_straight_green, rnil)), PatternB(rows - 1, color));
}

/** Returns a quilt in pattern "C". */
export const PatternC = (rows: number | undefined, color: Color | undefined): Quilt => {
  // Make sure rows > -1.
  if (rows === undefined || rows < 0) {
    throw new Error(err_msg_rows);
  }
  
  if (rows % 2 !== 0) {
    throw new Error("Rows must be even.");
  }

  // Base case
  if (rows === 0) {
    return qnil;
  }

  // Recursive case
  if(color === RED) {
    const row1 = rcons(se_round_red, rcons(sw_round_red, rnil));
    const row2 = rcons(ne_round_red, rcons(nw_round_red, rnil));
    return qcons(row2, qcons(row1, PatternC(rows - 2, color)));
  }

  const row1 = rcons(se_round_green, rcons(sw_round_green, rnil));
  const row2 = rcons(ne_round_green, rcons(nw_round_green, rnil));
  return qcons(row2, qcons(row1, PatternC(rows - 2, color)));
}

/** Returns a quilt in pattern "D". */
export const PatternD = (rows: number | undefined, color: Color | undefined): Quilt => {
  // Make sure rows > -1.
  if (rows === undefined || rows < 0) {
    throw new Error(err_msg_rows);
  }

  if (rows % 2 !== 0) {
    throw new Error("Rows must be even.");
  }

  // Base case
  if (rows === 0) {
    return qnil;
  }

  // Recursive case
  if(color === RED) {
    const row1 = rcons(ne_round_red, rcons(nw_round_red, rnil));
    const row2 = rcons(se_round_red, rcons(sw_round_red, rnil));
    return qcons(row2, qcons(row1, PatternD(rows - 2, color)));
  }

  const row1 = rcons(ne_round_green, rcons(nw_round_green, rnil));
  const row2 = rcons(se_round_green, rcons(sw_round_green, rnil));
  return qcons(row2, qcons(row1, PatternD(rows - 2, color)));
}

/** Returns a quilt in pattern "E". */
export const PatternE = (rows: number | undefined, color: Color | undefined): Quilt => {
  // Make sure rows > -1.
  if (rows === undefined || rows < 0) {
    throw new Error(err_msg_rows);
  }

  // Base case
  if (rows === 0) {
    // PatternE(0, c) := qnil
    return qnil;
  }

  // Base case
  if (rows === 1) {
    // PatternE(1, c) := qcons([sc, tc], qnil)
    // sc := {shape : STRAIGHT, color : c, corner : NW}
    // tc := {shape : STRAIGHT, color : c, corner : SE}
    if(color === RED) {
      const row = rcons(nw_straight_red, rcons(se_straight_red, rnil));
      return qcons(row, qnil);
    }

    const row = rcons(nw_straight_green, rcons(se_straight_green, rnil));
    return qcons(row, qnil);
  }

  // Recursive case begin - rows > 1 ; e.g.:
  // T(0) -> nil
  // T(1) -> qcons(row1, qnil)
  // T(2) -> qcons([sc, tc], qcons([uc, vc], PatternE(n, c)))

  // T(3) -> T(3 - 2) -> T(1)
  // T(4) -> T(4 - 2) -> T(2 - 2) -> T(0)
  // T(5) -> T(5 - 2) -> T(3 - 2) -> T(1)
  if(color === RED) {
    const row1 = rcons(nw_straight_red, rcons(se_straight_red, rnil));
    const row2 = rcons(se_straight_red, rcons(nw_straight_red, rnil));
    return qcons(row1, qcons(row2, PatternE(rows - 2, color)));
  }

  const row1 = rcons(nw_straight_green, rcons(se_straight_green, rnil));
  const row2 = rcons(se_straight_green, rcons(nw_straight_green, rnil));
  return qcons(row1, qcons(row2, PatternE(rows - 2, color)));
}
