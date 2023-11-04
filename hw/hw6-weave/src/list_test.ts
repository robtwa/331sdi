import * as assert from 'assert';
import { nil, cons, len, equal, concat, rev, compact_list, explode_array } from './list';


describe('list', function() {

  it('len', function() {
    // 0-1-many: base case, 0 recursive calls (only 1 possible input)
    assert.deepEqual(len(nil), 0);
    // 0-1-many: 1 recursive call
    assert.deepEqual(len(cons(1, nil)), 1);
    assert.deepEqual(len(cons(2, nil)), 1);
    // 0-1-many: 2+ recursive calls
    assert.deepEqual(len(cons(1, cons(2, nil))), 2);
    assert.deepEqual(len(cons(3, cons(2, cons(1, cons(0, nil))))), 4);
  });

  it('equal', function() {
    // 0-1-many: 0 recursive calls - first branch
    assert.deepStrictEqual(equal(nil, nil), true);
    assert.deepStrictEqual(equal(nil, cons(1, nil)), false);
    // 0-1-many: 0 recursive calls - second branch
    assert.deepStrictEqual(equal(cons(1, nil), nil), false);
    assert.deepStrictEqual(equal(cons(1, cons(2, nil)), nil), false);
    // 0-1-many: 0 recursive calls - third branch
    assert.deepStrictEqual(equal(cons(1, nil), cons(2, nil)), false);
    assert.deepStrictEqual(equal(cons(2, nil), cons(1, cons(2, nil))), false);

    // 0-1-many: 1 recursive call - first branch
    assert.deepStrictEqual(equal(cons(3, nil), cons(3, nil)), true);
    assert.deepStrictEqual(equal(cons(3, nil), cons(3, cons(1, nil))), false);
    // 0-1-many: 1 recursive call - second branch
    assert.deepStrictEqual(equal(cons(4, cons(1, nil)), cons(4, nil)), false);
    assert.deepStrictEqual(
        equal(cons(4, cons(1, cons(2, nil))), cons(4, nil)), false);
    // 0-1-many: 1 recursive call - third branch
    assert.deepStrictEqual(
        equal(cons(5, cons(1, nil)), cons(5, cons(2, nil))), false);
    assert.deepStrictEqual(
        equal(cons(5, cons(2, nil)), cons(5, cons(1, cons(2, nil)))), false);

    // 0-1-many: 2 recursive calls - first branch
    assert.deepStrictEqual(
        equal(cons(4, cons(3, nil)), cons(4, cons(3, nil))), true);
    assert.deepStrictEqual(
        equal(cons(4, cons(3, nil)), cons(4, cons(3, cons(1, nil)))), false);
    // 0-1-many: 2 recursive calls - second branch
    assert.deepStrictEqual(
        equal(cons(4, cons(3, cons(1, nil))), cons(4, cons(3, nil))), false);
    assert.deepStrictEqual(
        equal(cons(4, cons(3, cons(1, cons(2, nil)))), cons(4, cons(3, nil))), false);
    // 0-1-many: 2 recursive calls - third branch
    assert.deepStrictEqual(
        equal(cons(4, cons(3, cons(1, nil))), cons(4, cons(3, cons(2, nil)))), false);
    assert.deepStrictEqual(
        equal(cons(4, cons(3, cons(2, nil))), cons(4, cons(3, cons(1, cons(2, nil))))), false);
  });

  it('concat', function() {
    // 0-1-many: base case, 0 recursive calls
    assert.deepEqual(concat(nil, nil), nil);
    assert.deepEqual(concat(nil, cons(1, nil)), cons(1, nil));
    assert.deepEqual(concat(nil, cons(1, cons(2, nil))), cons(1, cons(2, nil)));
    // 0-1-many: 1 recursive call
    assert.deepEqual(concat(cons(1, nil), nil), cons(1, nil));
    assert.deepEqual(concat(cons(1, nil), cons(2, nil)), cons(1, cons(2, nil)));
    assert.deepEqual(concat(cons(1, nil), cons(2, cons(3, nil))),
        cons(1, cons(2, cons(3, nil))));
    // 0-1-many: 2+ recursive call
    assert.deepEqual(concat(cons(1, cons(2, nil)), nil), cons(1, cons(2, nil)));
    assert.deepEqual(concat(cons(1, cons(2, nil)), cons(3, nil)),
        cons(1, cons(2, cons(3, nil))));
    assert.deepEqual(concat(cons(1, cons(2, nil)), cons(3, cons(4, nil))),
        cons(1, cons(2, cons(3, cons(4, nil)))));
  });

  it('rev', function() {
    // 0-1-many: base case (only 1 possible)
    assert.deepEqual(rev(nil), nil);
    // 0-1-many: 1 recursive call
    assert.deepEqual(rev(cons(1, nil)), cons(1, nil));
    assert.deepEqual(rev(cons(2, nil)), cons(2, nil));
    // 0-1-many: 2+ recursive calls
    assert.deepEqual(rev(cons(1, cons(2, nil))), cons(2, cons(1, nil)));
    assert.deepEqual(rev(cons(1, cons(2, cons(3, nil)))),
        cons(3, cons(2, cons(1, nil))));
  });

  it('compact_list', function() {
    // 0-1-many: base case (only 1 possible)
    assert.deepEqual(compact_list(nil), []);
    // 0-1-many: 1 recursive call
    assert.deepEqual(compact_list(cons(1, nil)), [1]);
    assert.deepEqual(compact_list(cons(8, nil)), [8]);
    // 0-1-many: 2+ recursive calls
    assert.deepEqual(compact_list(cons(1, cons(2, nil))), [1, 2]);
    assert.deepEqual(compact_list(cons(3, cons(2, cons(1, nil)))), [3, 2, 1]);
  });

  it('explode_array', function() {
    // 0-1-many: base case (only 1 possible)
    assert.deepEqual(explode_array([]), nil);
    // 0-1-many: 1 recursive call
    assert.deepEqual(explode_array([1]), cons(1, nil));
    assert.deepEqual(explode_array([8]), cons(8, nil));
    // 0-1-many: 2+ recursive calls
    assert.deepEqual(explode_array([1, 2]), cons(1, cons(2, nil)));
    assert.deepEqual(explode_array([1, 2, 3]), cons(1, cons(2, cons(3, nil))));
  });

});