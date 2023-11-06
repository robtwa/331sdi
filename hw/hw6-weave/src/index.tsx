import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Color, toColor } from './color';
import { List, nil, cons } from './list';
import { Weave, WeaveForm } from './ui';


type WeaveType = "balanced"|"warp-faced"|undefined;

// Return the type of weave requested or undefined if not requested.
const GetWeaveType = (params: URLSearchParams): WeaveType => {
  let val = params.get("type");
  if (val === null)
    return undefined;

  val = val.toLowerCase();
  if (val === "balanced" || val === "warp-faced") {
    return val;
  } else {
    return undefined;
  }
};

// Returns the list of weft colors requested or undefined if not requested.
const GetWeftColors = (params: URLSearchParams): List<Color>|undefined => {
  let colorStr = params.get("colors");
  if (colorStr === null)
    return undefined;

  // Convert the color string into a list of Colors (via toColor on each char).
  let colors: List<Color> = nil;
  // Inv: colors = [colorStr[i], ..., colorStr[n-1]], where n = colorStr.length
  for (let i = colorStr.length - 1 ; i >= 0; i--) {
    colors = cons(toColor(colorStr.charAt(i)), colors);
  }
  return colors;
};


// Find the element in which to render the UI.
const main: HTMLElement|null = document.getElementById('main');
if (main === null)
  throw new Error('Uh oh! Could not find the "main" element.')

// Parse the arguments to the page
const params: URLSearchParams = new URLSearchParams(window.location.search);
const type: WeaveType = GetWeaveType(params);
const colors: List<Color>|undefined = GetWeftColors(params);

// If both parameters were provided (and valid), show the weave. Otherwise, show
// a form asking them for the parameters.
const root: Root = createRoot(main);
if ((type !== undefined) && (colors !== undefined)) {
  root.render(
    <React.StrictMode><Weave type={type} colors={colors} rows={20}/></React.StrictMode>);
} else {
  root.render(
    <React.StrictMode><WeaveForm/></React.StrictMode>);
}
