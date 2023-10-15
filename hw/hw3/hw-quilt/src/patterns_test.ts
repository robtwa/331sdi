import * as assert from 'assert';
import { NW, GREEN, ROUND, Square, Row, rnil, rcons, qnil, qcons } from './quilt';
import { PatternA } from './patterns';


describe('patterns', function() {

  const nw_round_green_test: Square = {shape: ROUND, color: GREEN, corner: NW};

  it('PatternA', function() {
    const row_green: Row = rcons(nw_round_green_test, rcons(nw_round_green_test, rnil));
    assert.deepStrictEqual(PatternA(GREEN),
         qcons(row_green, qcons(row_green, qcons(row_green, qcons(row_green, qnil)))));

    // TODO: uncomment this for part (g). This checks that the function throws
    // an exception when the first argument (a function) is called.
    // assert.throws(() => PatternA(-1, GREEN), Error);
  });


});
