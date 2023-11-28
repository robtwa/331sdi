import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { App } from './App';


// Find the element in which to render the UI.
const main: HTMLElement|null = document.getElementById('main');
if (main === null)
  throw new Error('Uh oh! Could not find the "main" element.')

// Show the App UI in that element.
const root: Root = createRoot(main);
root.render(<App/>);
