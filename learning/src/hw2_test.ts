import * as assert from 'assert';
import {f1, f2, f3, f4, f5, f6} from './hw2';


describe('hw2', function() {

  it('f1', function() {
    assert.strictEqual(f1("red"), 1);
    assert.strictEqual(f1("green"), 2);
    assert.strictEqual(f1("blue"), 3);
    assert.strictEqual(f1(undefined), 0);
  });

  it('f2', function() {
    assert.strictEqual(f2("red", 10), 10);
    assert.strictEqual(f2("red", -10), -10);

    assert.strictEqual(f2("green", 10), -10);
    assert.strictEqual(f2("green", -10), 10);

    assert.strictEqual(f2("blue", 10), 0);
    assert.strictEqual(f2("blue", -10), 0);
  });

  it('f3', function() {
    assert.strictEqual(f3("red", "red"), 12);
    assert.strictEqual(f3("red", "green"), -2);
    assert.strictEqual(f3("red", "blue"), 5);

    assert.strictEqual(f3("green", "red"), 2);
    assert.strictEqual(f3("green", "green"), -12);
    assert.strictEqual(f3("green", "blue"), -5);

    assert.strictEqual(f3("blue", "red"), 7);
    assert.strictEqual(f3("blue", "green"), -7);
    assert.strictEqual(f3("blue", "blue"), 0);

  });

  it('f4', function() {
    assert.strictEqual(f4([]), 0);

    assert.strictEqual(f4([1]), 1);
    assert.strictEqual(f4([1,2,3,4,5,6,7,8,9]), 45);
  });

  it('f5', function() {
    assert.strictEqual(f5(0), 0);     // Boundary case for the top branch.
    assert.strictEqual(f5(-1), 0);    // Boundary case for the top branch.
    assert.strictEqual(f5(-100), 0);  // Another case for the top branch.

    assert.strictEqual(f5(1), 1);
    assert.strictEqual(f5(9), 81);

  });

  it('f6', function() {
    assert.strictEqual(f6(0), 0);

    assert.strictEqual(f6(3), 1);
    assert.strictEqual(f6(30), 10);

    assert.strictEqual(f6(4), 1);
    assert.strictEqual(f6(34), 11);

    assert.strictEqual(f6(2), 0);
    assert.strictEqual(f6(5), 1);
  });
});
