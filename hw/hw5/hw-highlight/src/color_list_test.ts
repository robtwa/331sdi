import * as assert from 'assert';
import { nil, cons } from './list';
import { makeSimpleColorList } from './color_list';


describe('color_list', function() {
  it('findMatchingNames', function() {
    assert.deepEqual(makeSimpleColorList().findMatchingNames("doesnotexist"), nil);
    assert.deepEqual(makeSimpleColorList().findMatchingNames("notacolor"), nil);
    assert.deepEqual(makeSimpleColorList().findMatchingNames("indigo"), cons("indigo", nil));
    assert.deepEqual(makeSimpleColorList().findMatchingNames("azure"), cons("azure", nil));
    assert.deepEqual(makeSimpleColorList().findMatchingNames("lavender"),
        cons("lavender", cons("lavenderblush", nil)));
    assert.deepEqual(makeSimpleColorList().findMatchingNames("pink"),
        cons("deeppink", cons("hotpink", cons("lightpink", cons("pink", nil)))));
  });

  it('getColorCss', function() {
    assert.deepEqual(makeSimpleColorList().getColorCss("lavender"), ['#E6E6FA', '#101010']);
    assert.deepEqual(makeSimpleColorList().getColorCss("indigo"), ['#4B0082', '#F0F0F0']);
  });
});