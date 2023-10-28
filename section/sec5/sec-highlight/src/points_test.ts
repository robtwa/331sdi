import * as assert from 'assert';
import { List, nil, cons, compact_list } from './list';
import { Point, parsePoints, distToOrigin, getPointsByDistToOrigin } from './points';


// Returns the point with the given coordinates (using parsePoint).
const makePoint = (x: number, y: number): Point => {
  const L = parsePoints(x + " " + y);
  if (L === nil || L.tl !== nil)
    throw new Error('uh oh');
  return L.hd;
};

// Returns a string that will parse to the given list of points.
const unparsePoints = (pts: List<Point>): string => {
  return compact_list(makeLines(pts)).join("\n");
};

// Turns a list of points into a list of lines describing those points.
const makeLines = (pts: List<Point>): List<string> => {
  if (pts === nil) {
    return nil;
  } else {
    return cons(pts.hd[0] + " " + pts.hd[1], makeLines(pts.tl));
  }
};


describe('points', function() {

  it('parsePoints', function() {
    assert.deepEqual(parsePoints(""), nil);

    assert.throws(() => parsePoints("0"), Error);
    assert.throws(() => parsePoints("1 2 3"), Error);
    assert.throws(() => parsePoints("0 801"), Error);
    assert.throws(() => parsePoints("1000 0"), Error);
    assert.throws(() => parsePoints("800 -500"), Error);
    assert.throws(() => parsePoints("-1 800"), Error);

    assert.strictEqual(unparsePoints(parsePoints("0 0")), "0 0");
    assert.strictEqual(unparsePoints(parsePoints("568 347")), "568 347");
    
    assert.strictEqual(unparsePoints(parsePoints("0 0\n1 1\n 2 2")),
        "0 0\n1 1\n2 2");
    assert.strictEqual(unparsePoints(parsePoints("568 347\n 0 0\n 800 800\n 261 409")),
        "568 347\n0 0\n800 800\n261 409");
  });

  it('distToOrigin', function() {
    assert.ok(Math.abs(distToOrigin(makePoint(3, 4)) - 5) < 1e-3);
    assert.ok(Math.abs(distToOrigin(makePoint(100, 100)) - 141.4213) < 1e-3);
  });

  it('distToOrigin', function() {
    assert.strictEqual(getPointsByDistToOrigin(nil, 0, 100), nil);

    const L1: List<Point> = parsePoints("3 4");
    assert.strictEqual(unparsePoints(getPointsByDistToOrigin(L1, 0, 10)), "3 4");
    assert.strictEqual(unparsePoints(getPointsByDistToOrigin(L1, 0, 4)), "");
    assert.strictEqual(unparsePoints(getPointsByDistToOrigin(L1, 6, 10)), "");

    const L3: List<Point> = parsePoints("0 0\n1 1\n3 4");
    assert.strictEqual(unparsePoints(getPointsByDistToOrigin(L3, 0, 10)),
        "0 0\n1 1\n3 4");
    assert.strictEqual(unparsePoints(getPointsByDistToOrigin(L3, 0, 1)), "0 0");
    assert.strictEqual(unparsePoints(getPointsByDistToOrigin(L3, 4, 6)), "3 4");
    assert.strictEqual(unparsePoints(getPointsByDistToOrigin(L3, 6, 10)), "");
  });

});
