import React from 'react';
import { Root, createRoot } from 'react-dom/client';
import { fib } from "./fib";

console.log('**************** cse 331 *****************');
console.log(`The current time is ${new Date()}`);

const params: URLSearchParams = new URLSearchParams(window.location.search);
const nString: string | null = params.get("n");


const ele: HTMLElement | null = document.getElementById('main');
if (ele === null) {
    console.error('There is no element with the ID “main” in the html file.');
}
else {
    if (nString === null || nString === undefined || nString === '') {
        console.error('The argument "n" was not provided.');
    }
    else {
        const root: Root = createRoot(ele);
        const n: number = parseInt(nString, 10);
        const linkPrev: string = `/?n=${n - 1}`;
        const linkNext: string = `/?n=${n + 1}`;

        if (n <= 0) {
            console.error("The value of n is a negative number.");
            root.render(
                <div>
                    <p>Fibonacci number of {n} is {fib(n)}.</p>
                    <p><a href={linkNext}>Next</a></p>
                </div>
            );
        }
        else {
            root.render(
                <div>
                    <p>Fibonacci number of {n} is {fib(n)}.</p>
                    <p><a href={linkPrev}>Prev</a> <a href={linkNext}>Next</a></p>
                </div>
            );
        }
    }
}