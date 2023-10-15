import * as assert from 'assert';
import {NW, GREEN, RED, ROUND, Square, Row, rnil, rcons, qnil, qcons, STRAIGHT, SE, SW, NE} from './quilt';
import { PatternA, PatternB, PatternC, PatternD } from './patterns';


describe('patterns', function() {

  const nw_round_green_test: Square = {shape: ROUND, color: GREEN, corner: NW};
  const nw_round_red_test: Square = {shape: ROUND, color: RED, corner: NW};

  const se_round_green_test: Square = {shape: ROUND, color: GREEN, corner: SE};
  const se_round_red_test: Square = {shape: ROUND, color: RED, corner: SE};

  const sw_round_green_test: Square = {shape: ROUND, color: GREEN, corner: SW};
  const sw_round_red_test: Square = {shape: ROUND, color: RED, corner: SW};

  const ne_round_green_test: Square = {shape: ROUND, color: GREEN, corner: NE};
  const ne_round_red_test: Square = {shape: ROUND, color: RED, corner: NE};

  const nw_straight_green_test: Square = { shape: STRAIGHT, color: GREEN, corner: NW };
  const se_straight_green_test: Square = { shape: STRAIGHT, color: GREEN, corner: SE };

  const nw_straight_red_test: Square = { shape: STRAIGHT, color: RED, corner: NW };
  const se_straight_red_test: Square = { shape: STRAIGHT, color: RED, corner: SE };

  it('PatternA - Green', function() {
    const row_green: Row = rcons(nw_round_green_test, rcons(nw_round_green_test, rnil));

    // throw an error if rows === undefined
    assert.throws(() => PatternA(undefined, GREEN), Error);

    // throw an error if rows < 0
    assert.throws(() => PatternA(-1, GREEN), Error);

    // 0-1-many heuristic: base case
    assert.deepStrictEqual(PatternA(0, GREEN), qnil);

    // 0-1-many heuristic: 1 recursive call
    assert.deepStrictEqual(PatternA(1, GREEN), qcons(row_green, qnil));

    // 0-1-many heuristic: more than 1 recursive call (1st)
    assert.deepStrictEqual(PatternA(2, GREEN), qcons(row_green, qcons(row_green, qnil)));

    // 0-1-many heuristic: more than 1 recursive call (2nd)
    assert.deepStrictEqual(PatternA(3, GREEN),
      qcons(row_green, qcons(row_green, qcons(row_green, qnil))));

    // 0-1-many heuristic: more than 1 recursive call (3rd)
    assert.deepStrictEqual(PatternA(4, GREEN),
      qcons(row_green, qcons(row_green, qcons(row_green, qcons(row_green, qnil)))));
  });

  it('PatternA - Red', function() {
    const row_red: Row = rcons(nw_round_red_test, rcons(nw_round_red_test, rnil));

    // throw an error if rows === undefined
    assert.throws(() => PatternA(undefined, RED), Error);

    // throw an error if rows < 0
    assert.throws(() => PatternA(-1, RED), Error);

    // 0-1-many heuristic: base case
    assert.deepStrictEqual(PatternA(0, RED), qnil);

    // 0-1-many heuristic: 1 recursive call
    assert.deepStrictEqual(PatternA(1, RED), qcons(row_red, qnil));

    // 0-1-many heuristic: more than 1 recursive call (1st)
    assert.deepStrictEqual(PatternA(2, RED), qcons(row_red, qcons(row_red, qnil)));

    // 0-1-many heuristic: more than 1 recursive call (2nd)
    assert.deepStrictEqual(PatternA(3, RED),
      qcons(row_red, qcons(row_red, qcons(row_red, qnil))));

    // 0-1-many heuristic: more than 1 recursive call (3rd)
    assert.deepStrictEqual(PatternA(4, RED),
      qcons(row_red, qcons(row_red, qcons(row_red, qcons(row_red, qnil)))));

  });

  it('PatternA - default to Green', function() {
    const row_green: Row = rcons(nw_round_green_test, rcons(nw_round_green_test, rnil));

    // throw an error if rows === undefined
    assert.throws(() => PatternA(undefined, undefined), Error);

    // throw an error if rows < 0
    assert.throws(() => PatternA(-1, undefined), Error);

    // 0-1-many heuristic: base case
    assert.deepStrictEqual(PatternA(0, undefined), qnil);

    // 0-1-many heuristic: 1 recursive call
    assert.deepStrictEqual(PatternA(1, undefined), qcons(row_green, qnil));

    // 0-1-many heuristic: more than 1 recursive call (1st)
    assert.deepStrictEqual(PatternA(2, undefined), qcons(row_green, qcons(row_green, qnil)));

    // 0-1-many heuristic: more than 1 recursive call (2nd)
    assert.deepStrictEqual(PatternA(3, undefined),
      qcons(row_green, qcons(row_green, qcons(row_green, qnil))));

    // 0-1-many heuristic: more than 1 recursive call (3rd)
    assert.deepStrictEqual(PatternA(4, undefined),
      qcons(row_green, qcons(row_green, qcons(row_green, qcons(row_green, qnil)))));
  });

  it('PatternB - Green', function() {
    const row_green: Row = rcons(se_straight_green_test, rcons(nw_straight_green_test, rnil));

    // throw an error if rows === undefined
    assert.throws(() => PatternB(undefined, GREEN), Error);

    // throw an error if rows < 0
    assert.throws(() => PatternB(-1, GREEN), Error);

    // 0-1-many heuristic: base case
    assert.deepStrictEqual(PatternB(0, GREEN), qnil);

    // 0-1-many heuristic: 1 recursive call
    assert.deepStrictEqual(PatternB(1, GREEN), qcons(row_green, qnil));

    // 0-1-many heuristic: more than 1 recursive call (1st)
    assert.deepStrictEqual(PatternB(2, GREEN), qcons(row_green, qcons(row_green, qnil)));

    // 0-1-many heuristic: more than 1 recursive call (2nd)
    assert.deepStrictEqual(PatternB(3, GREEN),
      qcons(row_green, qcons(row_green, qcons(row_green, qnil))));

    // 0-1-many heuristic: more than 1 recursive call (3rd)
    assert.deepStrictEqual(PatternB(4, GREEN),
      qcons(row_green, qcons(row_green, qcons(row_green, qcons(row_green, qnil)))));
  });

  it('PatternB - Red', function() {
    const row_red: Row = rcons(se_straight_red_test, rcons(nw_straight_red_test, rnil));

    // throw an error if rows === undefined
    assert.throws(() => PatternB(undefined, RED), Error);

    // throw an error if rows < 0
    assert.throws(() => PatternB(-1, RED), Error);

    // 0-1-many heuristic: base case
    assert.deepStrictEqual(PatternB(0, RED), qnil);

    // 0-1-many heuristic: 1 recursive call
    assert.deepStrictEqual(PatternB(1, RED), qcons(row_red, qnil));

    // 0-1-many heuristic: more than 1 recursive call (1st)
    assert.deepStrictEqual(PatternB(2, RED), qcons(row_red, qcons(row_red, qnil)));

    // 0-1-many heuristic: more than 1 recursive call (2nd)
    assert.deepStrictEqual(PatternB(3, RED),
      qcons(row_red, qcons(row_red, qcons(row_red, qnil))));

    // 0-1-many heuristic: more than 1 recursive call (3rd)
    assert.deepStrictEqual(PatternB(4, RED),
      qcons(row_red, qcons(row_red, qcons(row_red, qcons(row_red, qnil)))));
  });

  it('PatternB - Default to Green', function() {
    const row_green: Row = rcons(se_straight_green_test, rcons(nw_straight_green_test, rnil));

    // throw an error if rows === undefined
    assert.throws(() => PatternB(undefined, undefined), Error);

    // throw an error if rows < 0
    assert.throws(() => PatternB(-1, undefined), Error);

    // 0-1-many heuristic: base case
    assert.deepStrictEqual(PatternB(0, undefined), qnil);

    // 0-1-many heuristic: 1 recursive call
    assert.deepStrictEqual(PatternB(1, undefined), qcons(row_green, qnil));

    // 0-1-many heuristic: more than 1 recursive call (1st)
    assert.deepStrictEqual(PatternB(2, undefined), qcons(row_green, qcons(row_green, qnil)));

    // 0-1-many heuristic: more than 1 recursive call (2nd)
    assert.deepStrictEqual(PatternB(3, undefined),
      qcons(row_green, qcons(row_green, qcons(row_green, qnil))));

    // 0-1-many heuristic: more than 1 recursive call (3rd)
    assert.deepStrictEqual(PatternB(4, undefined),
      qcons(row_green, qcons(row_green, qcons(row_green, qcons(row_green, qnil)))));
  });

  it('PatternC - Green', function() {
    const row1: Row = rcons(se_round_green_test, rcons(sw_round_green_test, rnil));
    const row2: Row = rcons(ne_round_green_test, rcons(nw_round_green_test, rnil));

    // throw an error if rows === undefined
    assert.throws(() => PatternC(undefined, GREEN), Error);

    // throw an error if rows < 0
    assert.throws(() => PatternC(-1, GREEN), Error);

    // throw an error if rows is not even.
    assert.throws(() => PatternC(1, GREEN), Error);
    assert.throws(() => PatternC(3, GREEN), Error);

    // 0-1-many heuristic: base case
    assert.deepStrictEqual(PatternC(0, GREEN), qnil);

    // 0-1-many heuristic: 1 recursive call
    assert.deepStrictEqual(PatternC(2, GREEN),
      qcons(row2, qcons(row1, qnil)));

    // 0-1-many heuristic: more than 1 recursive call (1st)
    assert.deepStrictEqual(PatternC(4, GREEN),
      qcons(row2, qcons(row1,
        qcons(row2, qcons(row1, qnil)))));

    // 0-1-many heuristic: more than 1 recursive call (2nd)
    assert.deepStrictEqual(PatternC(6, GREEN),
      qcons(row2, qcons(row1,
        qcons(row2, qcons(row1,
          qcons(row2, qcons(row1, qnil)))))));

  });

  it('PatternC - Red', function() {
    const row1: Row = rcons(se_round_red_test, rcons(sw_round_red_test, rnil));
    const row2: Row = rcons(ne_round_red_test, rcons(nw_round_red_test, rnil));

    // throw an error if rows === undefined
    assert.throws(() => PatternC(undefined, RED), Error);

    // throw an error if rows < 0
    assert.throws(() => PatternC(-1, RED), Error);

    // throw an error if rows is not even.
    assert.throws(() => PatternC(1, RED), Error);
    assert.throws(() => PatternC(3, RED), Error);

    // 0-1-many heuristic: base case
    assert.deepStrictEqual(PatternC(0, RED), qnil);

    // 0-1-many heuristic: 1 recursive call
    assert.deepStrictEqual(PatternC(2, RED),
      qcons(row2, qcons(row1, qnil)));

    // 0-1-many heuristic: more than 1 recursive call (1st)
    assert.deepStrictEqual(PatternC(4, RED),
      qcons(row2, qcons(row1,
        qcons(row2, qcons(row1, qnil)))));

    // 0-1-many heuristic: more than 1 recursive call (2nd)
    assert.deepStrictEqual(PatternC(6, RED),
      qcons(row2, qcons(row1,
        qcons(row2, qcons(row1,
          qcons(row2, qcons(row1, qnil)))))));

  });

  it('PatternC - Default to Green', function() {
    const row1: Row = rcons(se_round_green_test, rcons(sw_round_green_test, rnil));
    const row2: Row = rcons(ne_round_green_test, rcons(nw_round_green_test, rnil));

    // throw an error if rows === undefined
    assert.throws(() => PatternC(undefined, undefined), Error);

    // throw an error if rows < 0
    assert.throws(() => PatternC(-1, undefined), Error);

    // throw an error if rows is not even.
    assert.throws(() => PatternC(1, undefined), Error);
    assert.throws(() => PatternC(3, undefined), Error);

    // 0-1-many heuristic: base case
    assert.deepStrictEqual(PatternC(0, undefined), qnil);

    // 0-1-many heuristic: 1 recursive call
    assert.deepStrictEqual(PatternC(2, undefined),
      qcons(row2, qcons(row1, qnil)));

    // 0-1-many heuristic: more than 1 recursive call (1st)
    assert.deepStrictEqual(PatternC(4, undefined),
      qcons(row2, qcons(row1,
        qcons(row2, qcons(row1, qnil)))));

    // 0-1-many heuristic: more than 1 recursive call (2nd)
    assert.deepStrictEqual(PatternC(6, undefined),
      qcons(row2, qcons(row1,
        qcons(row2, qcons(row1,
          qcons(row2, qcons(row1, qnil)))))));

  });

  it('PatternD - Green', function() {
    const row1 = rcons(ne_round_green_test, rcons(nw_round_green_test, rnil));
    const row2 = rcons(se_round_green_test, rcons(sw_round_green_test, rnil));

    // throw an error if rows === undefined
    assert.throws(() => PatternD(undefined, GREEN), Error);

    // throw an error if rows < 0
    assert.throws(() => PatternD(-1, GREEN), Error);

    // throw an error if rows is not even.
    assert.throws(() => PatternD(1, GREEN), Error);
    assert.throws(() => PatternD(3, GREEN), Error);

    // 0-1-many heuristic: base case
    assert.deepStrictEqual(PatternD(0, GREEN), qnil);

    // 0-1-many heuristic: 1 recursive call
    assert.deepStrictEqual(PatternD(2, GREEN),
      qcons(row2, qcons(row1, qnil)));

    // 0-1-many heuristic: more than 1 recursive call (1st)
    assert.deepStrictEqual(PatternD(4, GREEN),
      qcons(row2, qcons(row1,
        qcons(row2, qcons(row1, qnil)))));

    // 0-1-many heuristic: more than 1 recursive call (2nd)
    assert.deepStrictEqual(PatternD(6, GREEN),
      qcons(row2, qcons(row1,
        qcons(row2, qcons(row1,
          qcons(row2, qcons(row1, qnil)))))));
  });

  it('PatternD - Red', function() {
    const row1 = rcons(ne_round_red_test, rcons(nw_round_red_test, rnil));
    const row2 = rcons(se_round_red_test, rcons(sw_round_red_test, rnil));

    // throw an error if rows === undefined
    assert.throws(() => PatternD(undefined, RED), Error);

    // throw an error if rows < 0
    assert.throws(() => PatternD(-1, RED), Error);

    // throw an error if rows is not even.
    assert.throws(() => PatternD(1, RED), Error);
    assert.throws(() => PatternD(3, RED), Error);

    // 0-1-many heuristic: base case
    assert.deepStrictEqual(PatternD(0, RED), qnil);

    // 0-1-many heuristic: 1 recursive call
    assert.deepStrictEqual(PatternD(2, RED),
      qcons(row2, qcons(row1, qnil)));

    // 0-1-many heuristic: more than 1 recursive call (1st)
    assert.deepStrictEqual(PatternD(4, RED),
      qcons(row2, qcons(row1,
        qcons(row2, qcons(row1, qnil)))));

    // 0-1-many heuristic: more than 1 recursive call (2nd)
    assert.deepStrictEqual(PatternD(6, RED),
      qcons(row2, qcons(row1,
        qcons(row2, qcons(row1,
          qcons(row2, qcons(row1, qnil)))))));
  });

  it('PatternD - Default to Green', function() {
    const row1 = rcons(ne_round_green_test, rcons(nw_round_green_test, rnil));
    const row2 = rcons(se_round_green_test, rcons(sw_round_green_test, rnil));

    // throw an error if rows === undefined
    assert.throws(() => PatternD(undefined, undefined), Error);

    // throw an error if rows < 0
    assert.throws(() => PatternD(-1, undefined), Error);

    // throw an error if rows is not even.
    assert.throws(() => PatternD(1, undefined), Error);
    assert.throws(() => PatternD(3, undefined), Error);

    // 0-1-many heuristic: base case
    assert.deepStrictEqual(PatternD(0, undefined), qnil);

    // 0-1-many heuristic: 1 recursive call
    assert.deepStrictEqual(PatternD(2, undefined),
      qcons(row2, qcons(row1, qnil)));

    // 0-1-many heuristic: more than 1 recursive call (1st)
    assert.deepStrictEqual(PatternD(4, undefined),
      qcons(row2, qcons(row1,
        qcons(row2, qcons(row1, qnil)))));

    // 0-1-many heuristic: more than 1 recursive call (2nd)
    assert.deepStrictEqual(PatternD(6, undefined),
      qcons(row2, qcons(row1,
        qcons(row2, qcons(row1,
          qcons(row2, qcons(row1, qnil)))))));
  });
});















