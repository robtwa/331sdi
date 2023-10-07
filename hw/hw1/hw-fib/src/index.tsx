import React, { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { ageAndFib } from './fib';
import './index.css';


const main: HTMLElement | null = document.getElementById('main');
if (main === null) {
  console.log('Uh oh! no "main" element!');
} else {
  const root = createRoot(main);
  const params: URLSearchParams = new URLSearchParams(window.location.search);

  if (params.has('firstName') || params.has('age')) {
    const firstName: string | null = params.get('firstName');
    const ageStr: string | null = params.get('age');
    const goBackLink: ReactNode = <a href="/" className='startOver'>Go Back</a>;
    const startOverLink: ReactNode = <a href="/" className='startOver'>Start Over</a>;

    if (firstName === null || firstName === '') {
      root.render(<p>Oops, you forgot to provide your first name. {goBackLink}</p >);
    }
    else if (!ageStr) {
      root.render(<p>Oops, you forgot to provide your age. {goBackLink}</p>);
    }
    else {
      const age: number = parseInt(ageStr);
      if (age < 0) {
        root.render(<p>Age cannot be negative. {startOverLink}</p>);
      }
      else {
        root.render(<p>Hi, {firstName}! Your age({age}) {ageAndFib(age)}  {startOverLink}</p>);
      }
    }
  }
  else {
    root.render(
      <form action="/" className='fibForm'>
        <h1>Hi there! Please enter the following information:</h1>
        <p className='title'>Your first name:</p>
        <input type="text" name="firstName"></input>
        <p className='title'>Your age:</p>
        <input type="number" name="age" min="0"></input>
        <div className='buttonArea'>
          <input type="submit" value="Submit" className='button' />
        </div>
      </form>
    );
  }
}
