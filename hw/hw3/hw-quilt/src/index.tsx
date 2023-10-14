import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Color, RED, GREEN, Quilt } from './quilt';
import { PatternA, PatternB, PatternC, PatternD, PatternE } from './patterns';
import { QuiltElem } from './quilt_draw';


// Returns the pattern number, which must be A-E, or undefined if it was not
// provided or is not in the valid range.
const getPattern = (params: URLSearchParams): string|undefined => {
  if (!params.has("pattern"))
    return undefined;

  switch (params.get("pattern")) {
    case "A": return "A";
    case "B": return "B";
    case "C": return "C";
    case "D": return "D";
    case "E": return "E";
    default:  return undefined;
  }
}


// Returns the color requested or undefined if none was specified.
const getColor = (params: URLSearchParams): Color|undefined => {
  const colorStr = params.get("color");
  if (colorStr === null) {
    return undefined;
  } else {
    const color = colorStr.toLowerCase();
    if (color === "red") {
      return RED; 
    } else if (color === "green") {
      return GREEN;
    } else {
      return undefined;
    }
  }
}


// Returns the number of rows, which must be a natural number. Defaults to 4.
const getRows = (params: URLSearchParams): number => {
  const rowStr = params.get("rows");
  if (rowStr === null) {
    return 4;
  } else {
    const rows = parseInt(rowStr);
    return !isNaN(rows) ? rows : 4;
  }
};


// Returns the quilt with the given pattern.
// Throws an exception if the pattern is not A-E.
const getQuilt = (pattern: string): Quilt => {
  switch (pattern) {
    case "A": return PatternA();
    case "B": return PatternB();
    case "C": return PatternC();
    case "D": return PatternD();
    case "E": return PatternE();
    default:  throw new Error('impossible');
  }
};


// Parse the arguments to the page, which can indicate the color and number of
// rows in the quilt.
const params: URLSearchParams = new URLSearchParams(window.location.search);
getColor(params);  // not used yet
getRows(params);   // not used yet

// Create a root in which to show the quilt.
const main: HTMLElement|null = document.getElementById('main');
if (main === null)
  throw new Error('missing main element');
const root: Root = createRoot(main);

// Invoke the function for the pattern given in the query params.
const pattern: string|undefined = getPattern(params);
if (pattern === undefined) {
  window.location.replace("/?pattern=A");  // redirect with default pattern

} else {
  // Display the quilt in the page.
  try {
    const result = getQuilt(pattern);
    root.render(
      <React.StrictMode><QuiltElem quilt={result}/></React.StrictMode>);
  } catch (e: unknown) {
    if (e instanceof Error) {
      root.render(<p><b>Error</b>: {e.message}</p>);
    } else {
      throw e;
    }
  }
}
