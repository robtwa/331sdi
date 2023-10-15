import {Quilt, qnil, ROUND, STRAIGHT, Square, GREEN, NW, NE, SW, SE, rcons, rnil, qcons,
      Color, RED} from "./quilt";

'./quilt';


const ne_round: Square = { shape: ROUND, color: GREEN, corner: NE };
const nw_round: Square = { shape: ROUND, color: GREEN, corner: NW };
const sw_round: Square = { shape: ROUND, color: GREEN, corner: SW };
const se_round: Square = { shape: ROUND, color: GREEN, corner: SE };

const nw_straight: Square = { shape: STRAIGHT, color: GREEN, corner: NW };
const se_straight: Square = { shape: STRAIGHT, color: GREEN, corner: SE };

// ************* helper  - begin ************
const err_msg_rows: string = "Invalid row number.";


// ************* helper - end ************

/** Returns a quilt in pattern "A". */
export const PatternA = (rows: number | undefined, color: Color | undefined): Quilt => {
  // Make sure rows > -1.
  if (rows === undefined || isNaN(rows) || rows < 0) {
    throw new Error(err_msg_rows);
  }

  // Base case
  if (rows === 0) {
    return qnil;
  }

  // Recursive case
  if(color === RED) {
    nw_round.color = RED;
  }
  // @ts-ignore
  return qcons(rcons(nw_round, rcons(nw_round, rnil)), PatternA(rows - 1, color));
}

/** Returns a quilt in pattern "B". */
export const PatternB = (rows: number | undefined, color: Color | undefined): Quilt => {
  // Make sure rows > -1.
  if (rows === undefined || isNaN(rows) || rows < 0) {
    throw new Error(err_msg_rows);
  }

  // Base case
  if (rows === 0) {
    return qnil;
  }

  if(color === RED) {
    se_straight.color = RED;
    nw_straight.color = RED;
  }

  return qcons(rcons(se_straight, rcons(nw_straight, rnil)), PatternB(rows - 1, color));
}

/** Returns a quilt in pattern "C". */
export const PatternC = (rows: number | undefined, color: Color | undefined): Quilt => {
  // Make sure rows > -1.
  if (rows === undefined || isNaN(rows) || rows < 0) {
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
    ne_round.color = RED;
    nw_round.color = RED;
    se_round.color = RED;
    sw_round.color = RED;
  }

  const row1 = rcons(se_round, rcons(sw_round, rnil));
  const row2 = rcons(ne_round, rcons(nw_round, rnil));
  return qcons(row2, qcons(row1, PatternC(rows - 2, color)));
}

/** Returns a quilt in pattern "D". */
export const PatternD = (rows: number | undefined, color: Color | undefined): Quilt => {
  // Make sure rows > -1.
  if (rows === undefined || isNaN(rows) || rows < 0) {
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
    se_round.color = RED;
    sw_round.color = RED;
    ne_round.color = RED;
    nw_round.color = RED;
  }

  const row2 = rcons(se_round, rcons(sw_round, rnil));
  const row1 = rcons(ne_round, rcons(nw_round, rnil));
  return qcons(row2, qcons(row1, PatternD(rows - 2, color)));
}

/** Returns a quilt in pattern "E". */
export const PatternE = (rows: number | undefined, color: Color | undefined): Quilt => {
  // Make sure rows > -1.
  if (rows === undefined || isNaN(rows) || rows < 0) {
    throw new Error(err_msg_rows);
  }

  if(color === RED) {
    nw_straight.color = RED;
    se_straight.color = RED;
  }

  const row1 = rcons(nw_straight, rcons(se_straight, rnil));
  const row2 = rcons(se_straight, rcons(nw_straight, rnil));


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
    return qcons(row1, qnil);
  }

  // Recursive case begin - rows > 1 ; e.g.:
  // T(2 - 2) -> T(0)
  // T(3 - 2) -> T(1)
  // T(4 - 2) -> T(2 - 2) -> T(0)
  // T(5 - 2) -> T(3 - 2) -> T(1)
  // T(6 - 2) -> T(4 - 2) -> T(2) -> T(0)
  // T(7 - 2) -> T(5 - 2) -> T(3) -> T(1)
  return qcons(row1, qcons(row2, PatternE(rows - 2, color)));
}
