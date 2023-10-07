import * as assert from 'assert';
import { quadratic1, quadratic2, abs_value } from './funcs';


describe('funcs', function() {

  it('quadratic1', function() {
    assert.strictEqual(quadratic1(1), 0);     // check that (1 - 1)^2 = 0
    assert.notStrictEqual(quadratic1(2), 1);  // check that (2 - 1)^2 = 1 fails
  });

  it('quadratic2', function() {
    assert.strictEqual(quadratic2(2), 1);     // check that (2 - 1)^2 = 1
    assert.notStrictEqual(quadratic2(1), 0);  // check that (1 - 1)^2 = 0 fails
  });

  it('abs_value', function() {
    assert.strictEqual(abs_value(-2), 2);    // check that |-2| = 2
    assert.strictEqual(abs_value(-1), 1);    // check that |-1| = 1
    assert.strictEqual(abs_value(2), 2);     // check that |2| = 2
    assert.strictEqual(abs_value(3), 3);     // check that |3| = 3
    assert.notStrictEqual(abs_value(1), 1);  // check that |1| = 1 fails
  });

// TODO: uncomment these when you have implemented and imported "half"
//  it('half', function() {
//    assert.strictEqual(half(null), 0);
//    assert.strictEqual(half(undefined), 0);
//    assert.strictEqual(half(0), 0);
//    assert.strictEqual(half(2), 1);
//    assert.strictEqual(half(4), 2);
//    assert.strictEqual(half(1), -1);
//    assert.strictEqual(half(3), -2);
//    assert.strictEqual(half(5), -3);
//  });

});
