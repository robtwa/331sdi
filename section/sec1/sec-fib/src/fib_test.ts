import * as assert from 'assert';
import { fib } from './fib';


describe('fib', function() {

  it('fib', function() {
    assert.strictEqual(fib(0), 0);
    assert.strictEqual(fib(1), 1);
    assert.strictEqual(fib(2), 1);
    assert.strictEqual(fib(3), 2);
    assert.strictEqual(fib(11), 89);
  });

});