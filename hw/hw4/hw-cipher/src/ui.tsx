import React from 'react';
import {
  cipher_encode,
  cipher_decode,
  crazy_caps_encode,
  crazy_caps_decode,
  pig_latin_encode,
  pig_latin_decode
} from "./latin_ops";
import {compact, explode} from "./char_list";


/** Returns UI that displays a form asking for encode/decode input. */
export const ShowForm = (_: {}): JSX.Element => {
    // TODO: Replace this with something fully functional.
    return (
        <form action="/" method="get">
          <div style={{paddingBottom: "1em"}}>
            Word <input type="text" id="word" name="word"></input>
          </div>

          <div style={{paddingBottom: "1em"}}>
            Algorithm
            <select id="algorithm_name" name="algo">
              <option value="cipher" selected={true} >cipher</option>
              <option value="crazy-caps">crazy-caps</option>
              <option value="pig-latin">pig-latin</option>
            </select>
          </div>

          <div style={{paddingBottom: "1em"}}>
            <input type="radio" id="op-encode" name="op"
                   value="encode" checked={true}/> Encode
          </div>

          <div style={{paddingBottom: "1em"}}>
            <input type="radio" id="op-decode" name="op"
                   value="decode" /> Decode
          </div>


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
  if (props.word === '' ) {
    return <p><code>You do not enter a word.</code></p>;
  }

  if (props.algo.toLowerCase() === "cipher") {
    if (props.op.toLowerCase() === "encode") {
      return ShowMssage(props.word, props.algo, props.op,
        compact(cipher_encode(explode(props.word))));
    }
    return ShowMssage(props.word, props.algo, props.op,
      compact(cipher_decode(explode(props.word))));
  }
  else if (props.algo.toLowerCase() === "crazy-caps") {
    if (props.op.toLowerCase() === "encode") {
      return ShowMssage(props.word, props.algo, props.op,
        compact(crazy_caps_encode(explode(props.word))));
    }
    return ShowMssage(props.word, props.algo, props.op,
      compact(crazy_caps_decode(explode(props.word))));
  }
  else {  // pig-latin
    if (props.op.toLowerCase() === "encode") {
      return ShowMssage(props.word, props.algo, props.op,
        compact(pig_latin_encode(explode(props.word))));
    }
    return ShowMssage(props.word, props.algo, props.op,
      compact(pig_latin_decode(explode(props.word))));
  }

};

export const ShowMssage = (word: string,
                           algo: string,
                           op:string,
                           result: string,
                           ): JSX.Element => {
  return <p><code>Hi there, {algo} {op}s "{word}" to "{result}".</code></p>;
};