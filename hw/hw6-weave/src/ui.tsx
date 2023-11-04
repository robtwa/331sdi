import React from 'react';
import { List, nil, cons, compact_list } from './list'
import { Color } from './color';
import { weaveBalanced, weaveWarpFaced } from './weave';
import './ui.css';


/** Returns UI that displays a form asking for a description of the weave. */
export const WeaveForm = (_: {}): JSX.Element => {
  return (<div>
      <h3>Describe Your Weave</h3>

      <form action="/" method="get">
        <p>Describe the warp colors in the order they should appear with one character per color:<br/>
            R = red, O = orange, Y = yellow, G = green, B = blue, P = purple</p>
        <div>
          <label htmlFor="colors">Warp Colors:</label>
          <input type="text" id="colors" name="colors"></input>
        </div>

        <div style={{marginTop: '10px'}}>
          <label htmlFor="type">Type:</label>
          <select id="type" name="type">
              <option value="warp-faced">Warp-Faced</option>
              <option value="balanced">Balanced</option>
          </select>
        </div>

        <div style={{marginTop: '20px'}}>
          <input type="submit" value="Draw It"></input>
        </div>
      </form>
    </div>);
};


/** Properties expected for the Weave UI below. */
export type WeaveProps = {
  type: "balanced" | "warp-faced";
  colors: List<Color>;
  rows: number
};


/**
 * Returns UI that shows the weave with the given description.
 * @param props Properties describing the weave to show.
 * @returns HTML that displays the weave described
 */
export const Weave = (props: WeaveProps): JSX.Element => {
  // Calculate the colors for 20 rows of a weave with these weft colors.
  const weave = (props.type === "balanced") ?
      weaveBalanced(props.rows, props.colors, "white") :
      weaveWarpFaced(props.rows, props.colors);

  return <div>{compact_list(DrawWeave(weave, 0))}</div>;
};

/**
 * Returns a list of HTML DIV elements, one per row of the weave, showing the
 * colors in that row. Rows at even indexes are offset a bit.
 * @param weave The weave to draw.
 * @param index The index of the first row in the weave, which will be positive
 *    if it is be a suffix of some larger weave.
 * @return A list of HTML DIV elements, one per row of the weave.
 */
export const DrawWeave =
    (weave: List<List<Color>>, index: number): List<JSX.Element> => {
  // TODO: replace this with a proper recursive implementation
  if (weave === nil || weave.tl === nil || weave.tl.tl !== nil)
    throw new Error("only supports 2 rows so far ");

  return cons(DrawWeaveRow(weave.hd, true, index),
      cons(DrawWeaveRow(weave.tl.hd, false, index + 1), nil));
};

/**
 * Returns an HTML DIV element drawing a row with the given colors, after an
 * offset on the left if one is requested.
 * @param colors List of colors in the row.
 * @param offset Whether to include a span indenting the row on the left.
 * @param key Key tag to include in the root HTML element
 * @returns An HTML DIV element drawing a row with the given colors.
 */
export const DrawWeaveRow =
    (colors: List<Color>, offset: boolean, key: number): JSX.Element => {
  if (offset) {
    return (
        <div key={key}>
          <span className="offset">&nbsp;</span>
          {compact_list(DrawWeaveRowColors(colors, 0))}
        </div>);
  } else {
    return <div key={key}>{compact_list(DrawWeaveRowColors(colors, 0))}</div>
  }
};

/**
 * Returns a list of HTML span elements that will show the given colors, with
 * each being a small rectangle.
 * @param colors List of colors in the row.
 * @param key Key tag to include in the root HTML element
 * @returns A list of HTML tags drawing the individual colors in the row
 */
export const DrawWeaveRowColors =
    (colors: List<Color>, key: number): List<JSX.Element> => {
  if (colors === nil) {
    return nil;
  } else {
    return cons(
        <span className={'square color-' + colors.hd} key={key}></span>,
        DrawWeaveRowColors(colors.tl, key+1));
  }
};
