import React, {ChangeEvent, Component, FormEvent} from "react";
import {fromJson, solid, Square, toJson} from './square';
// import { SquareElem } from './square_draw';
import {Editor} from "./Editor";
import './index.css';

type AppState = {
  _filename: string|undefined;    // temp var for entering a filename
  filename: string|undefined;     // The name of the file currently being edited
  file_open: boolean;             // Status of whether the file is open or not
  file_list: string[];            // List of all files
  sq:Square                       // The square currently being edited
  message: string|undefined;      // String message
}

export class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    // The initial state
    this.state = {
      _filename:undefined,
      filename:undefined,
      file_open:false,
      file_list:[],
      sq:solid("green"),
      message: undefined
    };
  }

  /**
   * When the component is mounted on the screen, call the doListRequest
   * function to get a list of all saved files from the backend server
   */
  componentDidMount = ():void => {
    this.doListRequest();
  }

  render = (): JSX.Element => {
    // Determines whether to display the file creation UI or the editor UI
    // based on the current state.
    if (this.state.filename !== undefined && this.state.file_open) {
      // Show the Editor UI
      return <>
        <Editor key="editor" initialState={this.state.sq} color={"green"}
                saveFileFunc={this.onSave}
                closeFileFunc={this.onClose}
                message={this.state.message}/>
        <label key="label_filename"><b>File name</b>: {this.state.filename}</label>
      </>
    }
    else {
      // Show the UI for creating a new square.
      return <>
        <h1>Files</h1>
        <ul>
          {}
          {this.state.file_list.map((name)=>(
            <li key={"file_list_"+name}><a href="#" onClick={()=>this.doLoadRequest(name)} >{name}</a>
            <a href="#" className="delete"
               onClick={()=>this.doDeleteRequest(name)}>Delete</a></li>))}
        </ul>
        <div>
          <form onSubmit={this.doCreate} >
            <label htmlFor="filename" >Name: </label>
            <input id="filename" required={true} onChange={this.doChange}
                   className="input"/>
            <button type="submit" id="btn_create" className="button" >Create</button>
          </form>
        </div>
      </>;
    }
  };


  /**
   * Requests the name of all currently saved files from the server
   * If the request is successful, the status code is 200 and the the returned
   * data is an array, then update the received filenames to this component’s
   * state object.
   */
  doListRequest = (): void => {
    fetch("/api/list")
      .then((res: Response): void => {
        if (res.status === 200) {
          res.json().then((data:unknown) =>{
            if (Array.isArray(data)) {
              this.setState({file_list: data})
            }
            else {
              console.error("Bad data. The returned list of " +
                "filenames is not an array");
              this.setState({message: "Bad data. The returned list of " +
                  "filenames is not an array"})
            }
          }).catch(error => {
            // The error can be long, so do not update it to the state object.
            // Print it to the console.
            console.error(error);
          })
        } else {
          console.error(`bad status code: ${res.status}`);
          this.setState({message: `bad status code: ${res.status}`})
        }
      })
      .catch((error) => {
        // The error can be long, so do not update it to the state object.
        // Print it to the console.
        console.error(error);
      });
  };

  /**
   * Request the specified file data from the server and load it into the
   * editor.
   * If the requested file exists, the status code is 200 and the data returned
   * is valid, then updated the data to the state object.
   * If any errors occur, display a short error to the UI, and print the long
   * error to the console.
   *
   * @param name The string file name
   */
  doLoadRequest = (filename:string): void => {
    fetch("/api/load?filename="+filename)
      .then((res: Response): void => {
        if (res.status === 200) {
          res.json().then((data:unknown) =>{
            try {
              this.setState({
                filename: filename,
                file_open: true,
                sq:fromJson(data)})
            }
            catch (error){
              // The error can be long, so do not update it to the state object.
              // Print it to the console.
              console.error(error);
            }
          }).catch(error =>{
            // The error can be long, so do not update it to the state object.
            // Print it to the console.
            console.error(error);
          })
        } else {
          console.error(`bad status code: ${res.status}`);
          this.setState({message: `bad status code: ${res.status}`})
        }
      })
      .catch((error) => {
        // The error can be long, so do not update it to the state object.
        // Print it to the console.
        console.error(error);
      });
  };

  /**
   * Extra credit.
   *
   * Request the server to delete the specified file and return a new list of
   * remaining files.
   * If the request is successful, update the data to the editor.
   * If any errors occur, display the short error to the UI, and print the long
   * error to the console.
   *
   * @param filename The string filename
   */
  doDeleteRequest = (filename:string): void => {
    fetch("/api/delete?filename="+filename)
      .then((res: Response): void => {
        if (res.status === 200) {
          res.json().then((data:unknown) =>{
            if (Array.isArray(data)) {
              this.setState({file_list: data})
            }
            else {
              console.error("Bad data. The returned list of " +
                "filenames is not an array");
              this.setState({message: "Bad data. The returned list of " +
                  "filenames is not an array"})
            }
          })
        } else {
          console.error(`bad status code: ${res.status}`);
          this.setState({message: `bad status code: ${res.status}`})
        }
      })
      .catch((error) => {
        // The error can be long, so do not update it to the state object.
        // Print it to the console.
        console.error(error);
      });
  };

  // Event handler for creating a new file.
  doCreate = (_evt: FormEvent): void => {
    _evt.preventDefault();
    if (this.state._filename !== "") {
      this.setState({
        filename: this.state._filename,
        _filename: undefined,
        file_open: true,
        sq: solid("green")
      })
    }
  };

  // Event handler for entering a file name.
  // Update the filename to the state object.
  doChange = (_evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({_filename:_evt.target.value})
  };

  // Event handler for closing a file.
  // Update the state object and call the function that updates the file list.
  onClose = (): void => {
    this.setState({
      filename: undefined,
      _filename: undefined,
      file_open: false,
      sq: solid("green")
    })
    this.doListRequest();
  };

  /**
   * Saves the contents of the currently edited file to the server.
   * If the request is successful, update the message to the state object.
   * If any errors occur, display the short error to the UI, and print the long
   * error to the console.
   *
   * @param tree the square tree
   */
  onSave = (tree: Square): void => {
    const payload = {
      filename: this.state.filename,
      data: toJson(tree)
    }

    fetch("/api/save",
      {method: "POST",
           body: JSON.stringify(payload),
           headers: {"Content-Type": "application/json"}})
      .then((res: Response): void => {
        if (res.status === 200) {
          this.setState({message: `File saved`})
        } else {
          console.error(`bad status code: ${res.status}`);
          this.setState({message: `bad status code: ${res.status}`})
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
}
