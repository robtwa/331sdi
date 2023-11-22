import React, { Component, ChangeEvent, MouseEvent } from "react";
import { Square, Path  } from './square';
import { SquareElem } from "./square_draw";


type EditorProps = {
  /** Initial state of the file. */
  initialState: Square;
};


type EditorState = {
  /** The root square of all squares in the design */
  root: Square;

  /** Path to the square that is currently clicked on, if any */
  selected?: Path;
};


/** UI for editing the image. */
export class Editor extends Component<EditorProps, EditorState> {

  constructor(props: EditorProps) {
    super(props);

    this.state = { root: props.initialState };
  }

  render = (): JSX.Element => {
    // TODO: add some editing tools here
    return <SquareElem width={600} height={600}
                      square={this.state.root} selected={this.state.selected}
                      onClick={this.doSquareClick}></SquareElem>;
  };

  doSquareClick = (path: Path): void => {
    // TODO: remove this code, do something with the path to the selected square
    console.log(path);
    alert("Stop that!");
  }

  doSplitClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    // TODO: implement
  };

  doMergeClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    // TODO: implement
  };

  doColorChange = (_evt: ChangeEvent<HTMLSelectElement>): void => {
    // TODO: implement
  };
}
