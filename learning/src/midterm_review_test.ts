import * as assert from 'assert';
import {makeEchoCursor} from "./midterm_review";
import {cons, nil, echo} from "./list";

describe('EchoCursor', function() {

  it('values()', function() {
    // 0 time through the loop
    const list1 = cons(1, cons(2, nil));
    assert.deepStrictEqual(makeEchoCursor(list1).values(), echo(list1));

    // 0 time through the loop

    // 1 time throught the loop

    // 1 time through the loop

    // many times through the loop

    // many times through the loop

    // many times through the loop

  });

  it('at()', function() {
    // // 0 time through the loop
    // assert.deepStrictEqual(makeEchoCursor(nil).valueAt(1), undefined);
    //
    // // 1 time throught the loop
    // const list1 = cons(1, cons(1, cons(2, cons(2, nil))));
    // assert.deepStrictEqual(makeEchoCursor(list1).valueAt(1), 1);
    //
    // // 1 time through the loop
    // const list2 = cons(0, cons(0, cons(1, cons(1, nil))));
    // assert.deepStrictEqual(makeEchoCursor(list2).valueAt(1), 0);
    //
    // // many times through the loop
    // const list3 = cons(1, cons(2, cons(3, cons(4, nil))));
    // assert.strictEqual(
    //   makeEchoCursor(list3).valueAt(2),
    //   2
    // );

    // many times through the loop
    // valueAt(n) := at(n, obj) -> at(n, echo(this.vals))
    const list4 = cons(1, cons(2, cons(3, cons(4, nil))));
    assert.strictEqual(
      makeEchoCursor(list4).valueAt(6),
      4
    );


    // many times through the loop

  });
});
