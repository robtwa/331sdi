import React, {ChangeEvent, Component, FormEvent} from "react";
import {solid, Square, toJson} from './square';
// import { SquareElem } from './square_draw';
import {Editor} from "./Editor";

interface AppState {
  // will probably need something here
  _filename: string|undefined;
  filename: string|undefined;
  file_open: boolean;
}


export class App extends Component<{}, AppState> {

  constructor(props: {}) {
    super(props);

    this.state = {_filename:undefined, filename:undefined, file_open:false };
  }
  
  render = (): JSX.Element => {
    console.log("0. ", this.state)

    if (this.state.filename !== undefined && this.state.file_open ) {
      // If they wanted this square, then we're done!
      const sq:Square = solid("green");

      // TODO: replace this code with the commented out code below to use Editor
      // return <SquareElem width={600} height={600} square={sq}
      //           onClick={this.doSquareClick}/>;
      return <>
        <label key="label_filename">File name: {this.state.filename}</label>
        <Editor key="editor" initialState={sq} color={"green"}
                saveFileFunc={this.doSaveClick}
                closeFileFunc={this.doCloseClick}/>
      </>
    }
    else {
      // ask the user to create a new file
      return this.formNewFile();
    }
  };

  // Task: add some functions to access routes and handle state changes probably

  formNewFile = (): JSX.Element => {
    return <form onSubmit={this.doCreate} >
      <h1>Files</h1>

      <div>
        <label htmlFor="filename" >Name: </label>
        <input id="filename" required={true} onChange={this.doChange}
               className="input"/>
        <button type="submit" id="btn_create" className="button" >"Create"</button>
      </div>
    </form>;
  }

  doCreate = (_evt: FormEvent): void => {
    _evt.preventDefault();
    console.log(_evt);
    if (this.state._filename !== "") {
      this.setState({filename: this.state._filename, _filename: undefined, file_open: true})
    }
  };

  doChange = (_evt: ChangeEvent<HTMLInputElement>): void => {
    console.log(_evt);
    this.setState({_filename:_evt.target.value})
  };

  doCloseClick = (): void => {
    console.log("doCloseClick")
    this.setState({file_open:false})
  };

  doSaveClick = (tree: Square): void => {
    console.log("doSaveClick")
    console.log("tree = ", toJson(tree))
  };

}
