import { List, cons, nil, explode_array } from './list';


/** Represents a point by its (x,y) coordinates. */
export type Point = readonly [number, number];


/**
 * Returns the distance from the given point to (0,0)
 * @param pt Point to measure the distance from
 * @returns sqrt(x^2 + y^2) where (x,y) = pt
 */
export const distToOrigin = (pt: Point): number => {
  const [x, y] = pt;
  return Math.sqrt(x*x + y*y);
};

/**
 * Reads the list of points described in the given text, which should have one
 * point per line and spaces between the x and y parts.
 * @param text Text to parse into points
 * @throws Error if any line does not parse
 * @returns [(x1, y1), ..., (xN, yN)] for text of the form "x1 y1\n...\nxN yN"
 */
export const parsePoints = (text: string): List<Point> => {
  if (text.trim() === "") {
    return nil;
  } else {
    return parsePointLines(explode_array(text.split("\n")));
  }
};

const parsePointLines = (lines: List<string>): List<Point> => {
  if (lines === nil) {
    return nil;
  } else {
    const parts = lines.hd.trim().split(' ');
    if (parts.length !== 2)
      throw new Error(`line is not of the form "X Y": "${lines.hd}"`);

    const x = parseInt(parts[0]);
    if (isNaN(x) || x < 0 || 800 < x)
      throw new Error(`not a number in the range 0-800: "${parts[0]}`);

    const y = parseInt(parts[1]);
    if (isNaN(y) || y < 0 || 800 < y)
      throw new Error(`not a number in the range 0-800: "${parts[1]}`);

    return cons([x, y], parsePointLines(lines.tl));
  }
};

/**
 * Returns all points in the given list whose distance to the origin is at least
 * a and less than b.
 * @param pts The list to filter
 * @param a Minimum distance from the origin to allow.
 * @param b Maximum distance from the origin to allow.
 * @return The elements from pts whose dist the origin is in the range [a, b),
 *     in the same order as in the list pts.
 */
export const getPointsByDistToOrigin = (
    pts: List<Point>, a: number, b: number): List<Point> => {
  if (pts === nil) {
    return nil;
  } else if (a <= distToOrigin(pts.hd) && distToOrigin(pts.hd) < b) {
    return cons(pts.hd, getPointsByDistToOrigin(pts.tl, a, b));
  } else {
    return getPointsByDistToOrigin(pts.tl, a, b);
  }
};
