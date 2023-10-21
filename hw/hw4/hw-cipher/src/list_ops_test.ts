import * as assert from 'assert';
import { nil } from './list';
import { explode } from './char_list';
import { last } from './list_ops';


describe('list_ops', function() {

  it('last', function() {
    // Error case branch
    assert.throws(() => last(nil), Error);

    // 0-1-many: base case
    assert.deepEqual(last(explode("a")), "a".charCodeAt(0));
    assert.deepEqual(last(explode("_")), "_".charCodeAt(0));

    // 0-1-many: one recursive call
    assert.deepEqual(last(explode("hm")), "m".charCodeAt(0));
    assert.deepEqual(last(explode("hu")), "u".charCodeAt(0));

    // 0-1-many: many recursive calls
    assert.deepEqual(last(explode("hub")), "b".charCodeAt(0));
    assert.deepEqual(last(explode("stray")), "y".charCodeAt(0));
    assert.deepEqual(last(explode("shrug")), "g".charCodeAt(0));
  });

  it('prefix', function() {
    // TODO: add tests
  });

  it('suffix', function() {
    // TODO: add tests
  });

});
