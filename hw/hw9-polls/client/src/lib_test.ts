import * as assert from 'assert';
import {addMinutesFunc, diffTimeFunc} from "./lib";


describe('routes', function() {
  it('diffTimeFunc', function() {
    // test 1: dateLeft and dateRight have the same date and time
    const dateLeft = new Date();
    const dateRight = dateLeft;
    assert.strictEqual(diffTimeFunc(dateLeft, dateRight), 0);

    // test 2: dateLeft2 is 10 minutes behind dateRight2
    const dateLeft2 = new Date();
    const dateRight2 = addMinutesFunc(10, dateLeft2);
    assert.strictEqual(diffTimeFunc(dateLeft2, dateRight2), -10);

    // test 3: dateLeft3 is 10 minutes ahead dateRight3
    const dateRight3 = new Date();
    const dateLeft3 = addMinutesFunc(10, dateRight3);
    assert.strictEqual(diffTimeFunc(dateLeft3, dateRight3), 10);

  });

  it('addMinutesFunc', function() {
    // test 1: add 0 minutes to dateRight
    const dateLeft = new Date();
    const dateRight = addMinutesFunc(0, dateLeft);
    assert.strictEqual(diffTimeFunc(dateLeft, dateRight), 0);

    // test 2: add 10 minutes to dateRight2
    const dateLeft2 = new Date();
    const dateRight2 = addMinutesFunc(10, dateLeft2);
    assert.strictEqual(diffTimeFunc(dateLeft2, dateRight2), -10);

    // test 2: add -10 minutes to dateRight3
    const dateLeft3 = new Date();
    const dateRight3 = addMinutesFunc(-10, dateLeft3);
    assert.strictEqual(diffTimeFunc(dateLeft3, dateRight3), 10);
  });

});
