import * as assert from 'assert';
import { nil, cons } from './list';
import { findMatchingNames, getColorCss } from './color_list';


describe('color_list', function() {

  it('findMatchingNames', function() {
    assert.deepEqual(findMatchingNames("doesnotexist"), nil);
    assert.deepEqual(findMatchingNames("notacolor"), nil);
    assert.deepEqual(findMatchingNames("indigo"), cons("indigo", nil));
    assert.deepEqual(findMatchingNames("azure"), cons("azure", nil));
    assert.deepEqual(findMatchingNames("lavender"),
        cons("lavender", cons("lavenderblush", nil)));
    assert.deepEqual(findMatchingNames("pink"),
        cons("deeppink", cons("hotpink", cons("lightpink", cons("pink", nil)))));
  });

  it('getColorCss', function() {
    assert.deepEqual(getColorCss("lavender"), ['#E6E6FA', '#101010']);
    assert.deepEqual(getColorCss("indigo"), ['#4B0082', '#F0F0F0']);
  });
});