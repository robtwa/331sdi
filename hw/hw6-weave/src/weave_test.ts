import * as assert from 'assert';
import { List, nil, cons, explode_array } from './list';
import { Color } from './color';
import { weaveWarpFacedOdds, weaveWarpFacedEvens, weaveBalancedOdds,
         weaveBalancedEvens, weaveWarpFaced, weaveBalanced } from './weave';


describe('weave', function() {

  it('weaveWarpFacedOdds - even length', function() {
    assert.deepEqual(weaveWarpFacedOdds(nil), nil);
    assert.deepEqual(weaveWarpFacedOdds(cons("red", cons("green", nil))),
        cons("red", nil));
    assert.deepEqual(weaveWarpFacedOdds(cons("blue", cons("green", nil))),
        cons("blue", nil));
    assert.deepEqual(
        weaveWarpFacedOdds(cons("red", cons("green", cons("blue", cons("yellow", nil))))),
        cons("red", cons("blue", nil)));
    assert.deepEqual(
        weaveWarpFacedOdds(cons("green", cons("red", cons("yellow", cons("blue", nil))))),
        cons("green", cons("yellow", nil)));
  });

  it('weaveWarpFacedEvens - even length', function() {
    assert.deepEqual(weaveWarpFacedEvens(nil), nil);
    assert.deepEqual(weaveWarpFacedEvens(cons("red", cons("green", nil))),
        cons("green", nil));
    assert.deepEqual(weaveWarpFacedEvens(cons("blue", cons("yellow", nil))),
        cons("yellow", nil));
    assert.deepEqual(
        weaveWarpFacedEvens(cons("red", cons("green", cons("blue", cons("yellow", nil))))),
        cons("green", cons("yellow", nil)));
    assert.deepEqual(
        weaveWarpFacedEvens(cons("green", cons("red", cons("yellow", cons("blue", nil))))),
        cons("red", cons("blue", nil)));
  });

  it('weaveWarpFacedOdds - odd length', function() {
    assert.deepEqual(weaveWarpFacedOdds(cons("red", nil)),
        cons("red", nil));
    assert.deepEqual(weaveWarpFacedOdds(cons("blue", nil)),
        cons("blue", nil));
    assert.deepEqual(
        weaveWarpFacedOdds(cons("blue", cons("green", cons("yellow", nil)))),
        cons("blue", cons("yellow", nil)));
    assert.deepEqual(
        weaveWarpFacedOdds(cons("red", cons("orange", cons("yellow", nil)))),
        cons("red", cons("yellow", nil)));
    assert.deepEqual(
        weaveWarpFacedOdds(cons("red", cons("green", cons("blue", cons("yellow", cons("purple", nil)))))),
        cons("red", cons("blue", cons("purple", nil))));
    assert.deepEqual(
        weaveWarpFacedOdds(cons("red", cons("orange", cons("yellow", cons("green", cons("blue", nil)))))),
        cons("red", cons("yellow", cons("blue", nil))));
  });

  it('weaveWarpFacedEvens - odd length', function() {
    assert.deepEqual(weaveWarpFacedEvens(cons("red", nil)), nil);
    assert.deepEqual(weaveWarpFacedEvens(cons("yellow", nil)), nil);
    assert.deepEqual(
        weaveWarpFacedEvens(cons("blue", cons("red", cons("yellow", nil)))),
        cons("red", nil));
    assert.deepEqual(
        weaveWarpFacedEvens(cons("yellow", cons("blue", cons("yellow", nil)))),
        cons("blue", nil));
    assert.deepEqual(
        weaveWarpFacedEvens(cons("red", cons("green", cons("blue", cons("yellow", cons("purple", nil)))))),
        cons("green", cons("yellow", nil)));
    assert.deepEqual(
        weaveWarpFacedEvens(cons("red", cons("green", cons("yellow", cons("green", cons("yellow", nil)))))),
        cons("green", cons("green", nil)));
  });

  it('weaveBalancedOdds - even length', function() {
    assert.deepEqual(weaveBalancedOdds(nil, "red"), nil);
    assert.deepEqual(weaveBalancedOdds(cons("red", cons("green", nil)), "purple"),
        cons("red", cons("purple", nil)));
    assert.deepEqual(weaveBalancedOdds(cons("blue", cons("yellow", nil)), "purple"),
        cons("blue", cons("purple", nil)));
    assert.deepEqual(
        weaveBalancedOdds(cons("red", cons("green", cons("blue", cons("yellow", nil)))), "orange"),
        cons("red", cons("orange", cons("blue", cons("orange", nil)))));
    assert.deepEqual(
        weaveBalancedOdds(cons("green", cons("red", cons("yellow", cons("blue", nil)))), "orange"),
        cons("green", cons("orange", cons("yellow", cons("orange", nil)))));
  });

  it('weaveBalancedEvens - even length', function() {
    assert.deepEqual(weaveBalancedEvens(nil, "red"), nil);
    assert.deepEqual(weaveBalancedEvens(cons("red", cons("green", nil)), "purple"),
        cons("purple", cons("green", nil)));
    assert.deepEqual(weaveBalancedEvens(cons("blue", cons("green", nil)), "purple"),
        cons("purple", cons("green", nil)));
    assert.deepEqual(
        weaveBalancedEvens(cons("red", cons("green", cons("blue", cons("yellow", nil)))), "purple"),
        cons("purple", cons("green", cons("purple", cons("yellow", nil)))));
    assert.deepEqual(
        weaveBalancedEvens(cons("green", cons("red", cons("yellow", cons("blue", nil)))), "orange"),
        cons("orange", cons("red", cons("orange", cons("blue", nil)))));
  });

  it('weaveBalancedOdds - odd length', function() {
    assert.deepEqual(
        weaveBalancedOdds(cons("red", nil), "purple"),
        cons("red", nil));
    assert.deepEqual(
        weaveBalancedOdds(cons("green", nil), "red"),
        cons("green", nil));
    assert.deepEqual(
        weaveBalancedOdds(cons("blue", cons("red", cons("yellow", nil))), "purple"),
        cons("blue", cons("purple", cons("yellow", nil))));
    assert.deepEqual(
        weaveBalancedOdds(cons("green", cons("red", cons("orange", nil))), "orange"),
        cons("green", cons("orange", cons("orange", nil))));
    assert.deepEqual(
        weaveBalancedOdds(cons("green", cons("green", cons("blue", cons("green", cons("green", nil))))), "blue"),
        cons("green", cons("blue", cons("blue", cons("blue", cons("green", nil))))));
    assert.deepEqual(
        weaveBalancedOdds(cons("red", cons("green", cons("blue", cons("yellow", cons("purple", nil))))), "orange"),
        cons("red", cons("orange", cons("blue", cons("orange", cons("purple", nil))))));
  });

  it('weaveBalancedEvens - odd length', function() {
    assert.deepEqual(weaveBalancedEvens(cons("red", nil), "orange"),
        cons("orange", nil));
    assert.deepEqual(weaveBalancedEvens(cons("orange", nil), "purple"),
        cons("purple", nil));
    assert.deepEqual(
        weaveBalancedEvens(cons("blue", cons("green", cons("yellow", nil))), "purple"),
        cons("purple", cons("green", cons("purple", nil))));
    assert.deepEqual(
        weaveBalancedEvens(cons("blue", cons("blue", cons("yellow", nil))), "yellow"),
        cons("yellow", cons("blue", cons("yellow", nil))));
    assert.deepEqual(
        weaveBalancedEvens(cons("red", cons("green", cons("blue", cons("yellow", cons("purple", nil))))), "orange"),
        cons("orange", cons("green", cons("orange", cons("yellow", cons("orange", nil))))));
    assert.deepEqual(
        weaveBalancedEvens(cons("red", cons("orange", cons("yellow", cons("green", cons("blue", nil))))), "purple"),
        cons("purple", cons("orange", cons("purple", cons("green", cons("purple", nil))))));
  });

  it('weaveWarpFaced', function() {
    const colors: List<Color> = cons("red", cons("orange", cons("yellow", nil)));
    const colors2: List<Color> = cons("purple", cons("blue", cons("green", cons("blue", nil))));
    assert.deepEqual(weaveWarpFaced(0, colors), nil);
    assert.deepEqual(weaveWarpFaced(1, colors), explode_array([
        cons("orange", nil),
      ]));
    assert.deepEqual(weaveWarpFaced(1, colors2), explode_array([
        cons("blue", cons("blue", nil)),
      ]));
    assert.deepEqual(weaveWarpFaced(2, colors), explode_array([
        cons("orange", nil),
        cons("red", cons("yellow", nil)),
      ]));
    assert.deepEqual(weaveWarpFaced(2, colors2), explode_array([
        cons("blue", cons("blue", nil)),
        cons("purple", cons("green", nil)),
      ]));
    assert.deepEqual(weaveWarpFaced(3, colors), explode_array([
        cons("orange", nil),
        cons("red", cons("yellow", nil)),
        cons("orange", nil),
      ]));
    assert.deepEqual(weaveWarpFaced(3, colors2), explode_array([
        cons("blue", cons("blue", nil)),
        cons("purple", cons("green", nil)),
        cons("blue", cons("blue", nil)),
      ]));
  });

  it('weaveBalanced', function() {
    const colors: List<Color> = cons("red", cons("orange", cons("yellow", nil)));
    const colors2: List<Color> = cons("purple", cons("blue", cons("green", cons("blue", nil))));
    assert.deepEqual(weaveBalanced(0, colors, "purple"), nil);
    assert.deepEqual(weaveBalanced(1, colors, "purple"), explode_array([
        cons("purple", cons("orange", cons("purple", nil)))
      ]));
    assert.deepEqual(weaveBalanced(1, colors2, "red"), explode_array([
        cons("red", cons("blue", cons("red", cons("blue", nil))))
      ]));
    assert.deepEqual(weaveBalanced(2, colors, "purple"), explode_array([
        cons("purple", cons("orange", cons("purple", nil))),
        cons("red", cons("purple", cons("yellow", nil)))
      ]));
    assert.deepEqual(weaveBalanced(2, colors2, "red"), explode_array([
        cons("red", cons("blue", cons("red", cons("blue", nil)))),
        cons("purple", cons("red", cons("green", cons("red", nil))))
      ]));
    assert.deepEqual(weaveBalanced(3, colors, "purple"), explode_array([
        cons("purple", cons("orange", cons("purple", nil))),
        cons("red", cons("purple", cons("yellow", nil))),
        cons("purple", cons("orange", cons("purple", nil)))
      ]));
    assert.deepEqual(weaveBalanced(3, colors2, "green"), explode_array([
        cons("green", cons("blue", cons("green", cons("blue", nil)))),
        cons("purple", cons("green", cons("green", cons("green", nil)))),
        cons("green", cons("blue", cons("green", cons("blue", nil)))),
      ]));
  });

});