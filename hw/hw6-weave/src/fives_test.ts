import * as assert from 'assert';
import { multOfFive, multOfFive10, multOfFive5, multOfFive0 } from './fives';


describe('fives', function() {

  it('multOfFive', function() {
    assert.strictEqual(multOfFive(0), 0);
    assert.strictEqual(multOfFive(4), 0);
    assert.strictEqual(multOfFive(5), 1);
    assert.strictEqual(multOfFive(9), 1);
    assert.strictEqual(multOfFive(10), 2);
  });

  it('multOfFive10', function() {
    assert.strictEqual(multOfFive10(0), 0);
    assert.strictEqual(multOfFive10(4), 0);
    assert.strictEqual(multOfFive10(5), 1);
    assert.strictEqual(multOfFive10(9), 1);
    assert.notStrictEqual(multOfFive10(10), 2);
  });

  it('multOfFive5', function() {
    assert.strictEqual(multOfFive5(0), 0);
    assert.strictEqual(multOfFive5(4), 0);
    assert.notStrictEqual(multOfFive5(5), 1);
    assert.strictEqual(multOfFive5(8), 1);
    assert.strictEqual(multOfFive5(12), 2);
  });

  it('multOfFive0', function() {
    assert.notStrictEqual(multOfFive0(0), 0);
    assert.strictEqual(multOfFive0(4), 0);
    assert.strictEqual(multOfFive0(8), 1);
    assert.strictEqual(multOfFive0(12), 2);
  });

});