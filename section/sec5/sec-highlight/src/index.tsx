import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { parsePoints } from './points';
import { ShowForm, ShowPoints } from './ui';


// Parse the query parameters in the URL.
const params: URLSearchParams = new URLSearchParams(window.location.search);
const points: string|null = params.get("points");

// Find the element in which to place the UI.
const main: HTMLElement|null = document.getElementById('main');
if (main === null) {
  throw new Error("Uh oh! HTML is missing 'main' element");
}

const root: Root = createRoot(main);
try {
  // Display the points if they were provided. Otherwise, show a form asking
  // them for the point locations.
  if (points !== null) {
    const pts = parsePoints(points);
    root.render(<React.StrictMode>{ShowPoints({pts: pts})}</React.StrictMode>);
  } else {
    root.render(<React.StrictMode>{ShowForm({})}</React.StrictMode>);
  }

} catch (e: unknown) {
  if (e instanceof Error) {
    root.render(<React.StrictMode><p>Error: {e.message}</p></React.StrictMode>);
  }
}
