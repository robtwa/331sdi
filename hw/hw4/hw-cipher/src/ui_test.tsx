import React from 'react';
import * as assert from 'assert';
import { ShowResult } from './ui';


describe('ui', function() {

  it('ShowResult', function() {
    assert.deepEqual(
        ShowResult({word: "cray", algo: "crazy-caps", op: "encode"}),
        <p><code>Hi there</code></p>);
    
    // TODO: fix this test ^ and add more here!
  });

});
