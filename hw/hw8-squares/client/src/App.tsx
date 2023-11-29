import React, {ChangeEvent, Component, FormEvent} from "react";
import {fromJson, solid, Square, toJson} from './square';
// import { SquareElem } from './square_draw';
import {Editor} from "./Editor";
import {isRecord} from "./record";
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
      message: undefined,
    };
  }

  /**
   * When the component is mounted on the screen, call the doListRequestClick
   * function to get a list of all saved files from the server.
   */
  componentDidMount = ():void => {
    this.doListRequestClick();
  }

  // Render UI
  render = (): JSX.Element => {
    // Determines whether to render the UI of editor or creation
    if (this.state.filename !== undefined && this.state.file_open) {
      // Render the UI the square Editor
      return <>
        <Editor key="editor"
                initialState={this.state.sq}
                color={"green"}
                saveFileFunc={this.doSaveClick}
                closeFileFunc={this.doCloseClick}
                colorList={["white" , "red" , "orange" , "yellow" , "green" ,
                            "blue" , "purple"]}
                dirToIdx={{NW: 0, NE: 1, SW: 2, SE: 3}}
                message={this.state.message}/>
        <label key="label_filename"><b>File name</b>: {this.state.filename}</label>
      </>
    }
    else {
      // Render the UI for creating a new square.
      return <>
        <h1>Files</h1>
        <ul>
          {this.renderFileList()}
        </ul>
        <div>
          <form onSubmit={this.doCreateClick} >
            <label htmlFor="filename" >Name: </label>
            <input id="filename" required={true} onChange={this.doChange}
                   className="input"/>
            <button type="submit" id="btn_create" className="button" >Create</button>
          </form>
        </div>
      </>;
    }
  };

  // Render the saved file list
  renderFileList = (): JSX.Element[] => {
    const links: JSX.Element[] = [];
    // Inv: links is the list of the links in this.state.file_list[0:i]
    for (const name of this.state.file_list) {
      links.push(<li key={"file_list_"+name}>
            <a href="#" onClick={()=>this.doLoadClick(name)} >{name}</a>
            <a href="#" className="delete"
                onClick={()=>this.doDeleteClick(name)}>Delete</a></li>)
    }

    return links;
  }


  // Event handler for creating a new file.
  doCreateClick = (_evt: FormEvent): void => {
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
  doChange = (_evt: ChangeEvent<HTMLInputElement>): void => {
    // Update the filename to the state object.
    this.setState({_filename:_evt.target.value})
  };

  // Event handler for closing a file.
  doCloseClick = (): void => {
    // Update the state object
    this.setState({
      filename: undefined,
      _filename: undefined,
      file_open: false,
      sq: solid("green")
    })

    // Requests a new list of all saved files.
    this.doListRequestClick();
  };

  /**
   * Saves the content of the currently edited file to the server.
   * If the request is successful, update the saved message to the state object.
   * If any errors occur, print a short error info to the console.
   *
   * @param tree the square tree
   */
  doSaveClick = (tree: Square): void => {
    const payload = {
      filename: this.state.filename,
      data: toJson(tree)
    }

    fetch("/api/save",
      {method: "POST",
        body: JSON.stringify(payload),
        headers: {"Content-Type": "application/json"}})
      .then(this.doSaveResp)
      .catch(()=>this.doSaveError("failed to connect to server"));
  };

  // Called when the server responds to the save file request.
  doSaveResp = (res:Response):void => {
    if (res.status === 200) {
      res.json().then(this.doSaveJson)
        .catch(() => this.doSaveError("200 response is not valid JSON"));
    } else if (res.status === 400) {
      res.text().then((res:string)=>this.doSaveError(res))
        .catch(() => this.doSaveError("400 response is not text"));
    } else {
      this.doSaveError(`bad status code: ${res.status}`);
    }
  }

  // Called when the save file response JSON has been parsed.
  doSaveJson = (data: unknown): void => {
    if (isRecord(data)) {
      this.setState({message: "File saved"});
    }
    else {
      this.doSaveError("Bad data. The returned data is not a json.");
    }
  };

  // Called if an error occurs trying to save file
  doSaveError = (msg: string): void => {
    console.error(`Error fetching /api/save: ${msg}`);
  };

  /**
   * Requests a list of all saved files from the server.
   * If the request is successful and the status code is 200 and the returned
   * data is valid, update the list to the component’s state object.
   */
  doListRequestClick = (): void => {
    fetch("/api/list")
      .then(this.doListRequestResp)
      .catch(()=>this.doListRequestError("failed to connect to server"));
  };

  // Called when the server responds with a file list.
  doListRequestResp = (res:Response):void => {
    if (res.status === 200) {
      res.json().then(this.doListRequestJson)
        .catch(()=>this.doListRequestError("200 response is not valid JSON"))
    } else if (res.status === 400) {
      res.text().then((res:string)=>this.doListRequestError(res))
        .catch(() => this.doListRequestError("400 response is not text"));
    } else {
      this.doListRequestError(`bad status code: ${res.status}`);
    }
  }

  // Called when the response JSON has been parsed.
  doListRequestJson = (data: unknown): void => {
    if (Array.isArray(data)) {
      this.setState({file_list: data})
    }
    else {
      this.doListRequestError("Bad data. The returned data is invalid.");
    }
  };

  // Called if an error occurs trying to get the file list
  doListRequestError = (msg: string): void => {
    console.error(`Error fetching /api/list: ${msg}`);
  };

  /**
   * Request a specified file data from the server.
   * If the requested file exists and the status code is 200 and the data
   *  returned is a valid square, then updated the data to the state object.
   * If any errors occur, print a short error info to the console.
   *
   * @param filename The string file name
   */
  doLoadClick = (filename:string): void => {
    fetch("/api/load?filename="+filename)
      .then((res: Response) => this.doLoadResp(res, filename))
      .catch(()=>this.doLoadError("failed to connect to server", filename));
  };

  // Called when the server responds with a square data.
  doLoadResp = (res:Response, filename: string):void => {
    if (res.status === 200) {
      res.json().then((data:unknown)=>this.doLoadJson(data, filename))
        .catch(()=>this.doLoadError("200 response is not valid JSON", filename))
    } else if (res.status === 400) {
      res.text().then((res:string)=>this.doLoadError(res, filename))
        .catch(() => this.doLoadError("400 response is not text", filename));
    } else {
      this.doLoadError(`bad status code: ${res.status}`, filename);
    }
  }

  // Called when the response JSON has been parsed.
  doLoadJson = (data: unknown, filename: string): void => {
    // Prevent program from terminating due to exception
    try {
      // try to convert the json data to squares
      const sq = fromJson(data);
      if (isRecord(sq)) {  // If the data is a valid square or squares
        this.setState({
          filename: filename,
          file_open: true,
          sq: sq})
      }
      else {
        this.doLoadError("Bad data. The returned data is invalid.", filename);
      }
    }
    catch (e:unknown){
      // Capture exceptions that may occur during data conversion
      if (e instanceof Error) {
        this.doLoadError(e.message, filename);
      }
      else if (typeof e === "string") {
        this.doLoadError(e, filename);
      }
    }
  };

  // Called if an error occurs trying to get the file data
  doLoadError = (msg: string, filename: string): void => {
    console.error(`Error fetching /api/load?filename=${filename}: ${msg}`);
  };

  // Extra credit. ////////////////////////////////////////////////////////////
  // New feature: delete a file

  /**
   * Request the server to delete a specified file and return a new list of
   * remaining files.
   * If the request is successful, delete the file from the file list.
   * If any errors occur, print a short error info to the console.
   *
   * @param filename The string filename
   */
  doDeleteClick = (filename:string): void => {
    fetch("/api/delete?filename="+filename)
      .then((res: Response) => this.doDeleteResp(res, filename))
      .catch(()=>this.doDeleteError("failed to connect to server", filename));
  };

  // Called when the server response to the request of deleting a file.
  doDeleteResp = (res:Response, filename: string):void => {
    if (res.status === 200) {
      res.json().then((data:unknown)=>this.doDeleteJson(data, filename))
        .catch(()=>this.doDeleteError("200 response is not valid JSON", filename))
    } else if (res.status === 400) {
      res.text().then((res:string)=>this.doDeleteError(res, filename))
        .catch(() => this.doDeleteError("400 response is not text", filename));
    } else {
      this.doDeleteError(`bad status code: ${res.status}`, filename);
    }
  }

  // Called when the response JSON has been parsed.
  doDeleteJson = (data: unknown, filename: string): void => {
    if (Array.isArray(data)) {
      this.setState({file_list: data})
    }
    else {
      this.doDeleteError("Bad data. The returned data is invalid", filename);
    }
  };

  // Called if an error occurs trying to delete a file.
  doDeleteError = (msg: string, filename: string): void => {
    console.error(`Error fetching /api/delete?filename=${filename}: ${msg}`);
  };

}
