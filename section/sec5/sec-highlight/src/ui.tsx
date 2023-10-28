import React from 'react';
import { List, cons, nil, compact_list } from './list';
import { Point, getPointsByDistToOrigin } from './points';


/** Returns HTML asking the user for locations of points to show. */
export const ShowForm = (_: {}): JSX.Element => {
  return (
    <form action="/" method="get">
      <p>Type in the points to display, one per line with the X and Y
         coordinates on each line separated by a space. Coordinates should
         all be in the range 0-800.</p>

      <textarea name="points" rows={10} cols={40}></textarea>

      <div style={{marginTop: '10px'}}>
        <input type="submit" value="Draw Points"></input>
      </div>
    </form>);
};

/** Return HTML showing points drawn on a canvas. */
export const ShowPoints = (props: {pts: List<Point>}): JSX.Element => {
  const pts1 = getPointsByDistToOrigin(props.pts, 0, 200);
  const pts2 = getPointsByDistToOrigin(props.pts, 200, 400);
  const pts3 = getPointsByDistToOrigin(props.pts, 400, 600);
  const pts4 = getPointsByDistToOrigin(props.pts, 600, 800);
  const pts5 = getPointsByDistToOrigin(props.pts, 800, 1000);
  const pts6 = getPointsByDistToOrigin(props.pts, 1000, 1200);

  return (
    <svg version="1.1" width="800" height="800" xmlns="http://www.w3.org/2000/svg">
      <circle cx="0" cy="0" r="1200" fill="#FFEDCC" stroke="lightgrey" />
      <circle cx="0" cy="0" r="1000" fill="#E6E6E6" stroke="lightgrey" />
      <circle cx="0" cy="0" r="800" fill="#FFEDCC" stroke="lightgrey" />
      <circle cx="0" cy="0" r="600" fill="#E6E6E6" stroke="lightgrey" />
      <circle cx="0" cy="0" r="400" fill="#FFEDCC" stroke="lightgrey" />
      <circle cx="0" cy="0" r="200" fill="#E6E6E6" stroke="lightgrey" />

      {compact_list(makeCircles(pts1, '#FD9BAF'))}
      {compact_list(makeCircles(pts2, '#A7B9F1'))}
      {compact_list(makeCircles(pts3, '#FD9BAF'))}
      {compact_list(makeCircles(pts4, '#A7B9F1'))}
      {compact_list(makeCircles(pts5, '#FD9BAF'))}
      {compact_list(makeCircles(pts6, '#A7B9F1'))}

      <rect width="800" height="800" stroke="#101010" stroke-width="5" fill="none" />
    </svg>);
};

// Maps a list of points into a list of circles with the given color.
const makeCircles = (pts: List<Point>, color: string): List<JSX.Element> => {
  if (pts === nil) {
    return nil;
  } else {
    return cons(
      <circle cx={pts.hd[0]} cy={pts.hd[1]} r="10" fill={color} />,
      makeCircles(pts.tl, color));
  }
};
