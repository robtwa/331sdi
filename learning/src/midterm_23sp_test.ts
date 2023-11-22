import * as assert from 'assert';
import {findIndex} from "./midterm_23sp";


describe('midterm_23sp', function() {
  const arr = ["mouse", "dog", "dog", "cat"];

  it('findIndex', function() {
    // 0 time through the loop
    assert.strictEqual(findIndex([], "zebra"), 0);

    // 0 time through the loop
    assert.strictEqual(findIndex(arr, "zebra"), 0);

    // 1 time throught the loop
    assert.strictEqual(findIndex(["mouse"], "cat"), 1);

    // 1 time through the loop
    assert.deepStrictEqual(findIndex(["mouse", "cat"], "dog"), 1);

    // many times through the loop
    assert.deepStrictEqual(
      findIndex(["m", "d", "c", "b"], "c"),
      2);

    // many times through the loop
    assert.deepStrictEqual(
    findIndex(["mouse", "dog", "cat", "bat"], "aardvark"),
    4);

    // many times through the loop
    assert.deepStrictEqual(
    findIndex(["mouse", "mouse", "dog", "cat"], "cat"),
    3);


    assert.strictEqual(findIndex(arr, "dog"), 1);
    assert.strictEqual(findIndex(arr, "cat"), 3);
    assert.strictEqual(findIndex(arr, "bat"), 4);
    assert.strictEqual(findIndex(arr, "kangaroo"), 1);
  });

});
