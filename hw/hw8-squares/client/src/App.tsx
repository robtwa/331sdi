import React, { Component } from "react";
import { solid, split, Path } from './square';
import { SquareElem } from './square_draw';


interface AppState {
  // will probably need something here
}


export class App extends Component<{}, AppState> {

  constructor(props: {}) {
    super(props);

    this.state = {};
  }
  
  render = (): JSX.Element => {
    // If they wanted this square, then we're done!
    const sq = split(solid("blue"), solid("orange"), solid("purple"), solid("red"));

    // TODO: replace this code with the commented out code below to use Editor
    return <SquareElem width={600} height={600} square={sq}
              onClick={this.doSquareClick}/>;

    // return <Editor initialState={sq}/>
  };

  doSquareClick = (path: Path): void => {
    console.log(path);
    alert("Stop that!");
  };

  // TODO: add some functions to access routes and handle state changes probably

}
