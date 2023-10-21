import React from 'react';


/** Returns UI that displays a form asking for encode/decode input. */
export const ShowForm = (_: {}): JSX.Element => {
    // TODO: Replace this with something fully functional.
    return (
        <form action="/" method="get">
          <input type="text" id="word" name="word"></input>

          <select id="" name="">
            {/* Add options to select here: */}
            {/* <option value=""></option> */}
          </select>

          <input type="radio" id="" name="" value=""></input>
          <input type="radio" id="" name="" value=""></input>

          <input type="submit" value="Submit"></input>
        </form>);
};


/** Properties expected for the ShowResult UI below. */
export type ShowResultProps = {
    word: string;
    algo: "cipher" | "crazy-caps" | "pig-latin";
    op: "encode" | "decode";
};

/**
 * Returns UI that shows the result of applying the specified operation to the
 * given word.
 */
export const ShowResult = (props: ShowResultProps): JSX.Element => {
    props;  // TODO: remove this (just making the compiler happy)
    return <p><code>Hi there</code></p>;  // TODO: Replace this
};
