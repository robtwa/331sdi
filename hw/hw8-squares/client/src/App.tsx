import React, {ChangeEvent, Component, FormEvent} from "react";
import {fromJson, solid, Square, toJson} from './square';
// import { SquareElem } from './square_draw';
import {Editor} from "./Editor";

const initSq = solid("green");

interface AppState {
  // will probably need something here
  _filename: string|undefined;
  filename: string|undefined;
  file_open: boolean;
  file_list: string[];
  sq:Square
}

export class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      _filename:undefined,
      filename:undefined,
      file_open:false,
      file_list:[],
      sq:initSq
    };
  }

  componentDidMount() {
    this.doListRequest();
  }

  render = (): JSX.Element => {
    console.log("0. ", this.state)

    if (this.state.filename !== undefined && this.state.file_open ) {
      // If they wanted this square, then we're done!

      // TODO: replace this code with the commented out code below to use Editor
      // return <SquareElem width={600} height={600} square={sq}
      //           onClick={this.doSquareClick}/>;
      return <>
        <label key="label_filename">File name: {this.state.filename}</label>
        <Editor key="editor" initialState={this.state.sq} color={"green"}
                saveFileFunc={this.onSave}
                closeFileFunc={this.onClose}/>
      </>
    }
    else {
      // ask the user to create a new file
      return this.formNewFile(this.state.file_list);
    }
  };

  // Task: add some functions to access routes and handle state changes probably

  formNewFile = (files:string[]): JSX.Element => {
    return <>
      <h1>Files</h1>
      <ul>
        {files.map((name)=>(<li key={"file_list_"+name}><a href="#"
           onClick={()=>this.doLoadRequest(name)} >{name}</a>
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

  doListRequest = (): void => {
    fetch("/api/list")
      .then((res: Response): void => {
        console.log(res.status)
        if (res.status === 200) {
          res.json().then((data:unknown) =>{
            if (Array.isArray(data)) {
              console.log("data is array ")
              this.setState({file_list: data})
            }
            console.log("data = ", data)
          })
        } else if (res.status === 400) {
          console.log(res.json())
        } else {
          console.log(`bad status code: ${res.status}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  doLoadRequest = (name:string): void => {
    console.log("doLoadRequest /////////////////////////")
    fetch("/api/load?name="+name)
      .then((res: Response): void => {
        console.log(res.status)
        if (res.status === 200) {
          res.json().then((data:unknown) =>{
            console.log("data = ", data)
            this.setState({filename: name, file_open: true, sq:fromJson(data)})
          })
        } else if (res.status === 400) {
          console.log(res.json())
        } else {
          console.log(`bad status code: ${res.status}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  doDeleteRequest = (name:string): void => {
    console.log("doDeleteRequest /////////////////////////")
    fetch("/api/delete?name="+name)
      .then((res: Response): void => {
        console.log(res.status)
        if (res.status === 200) {
          res.json().then((data:unknown) =>{
            console.log("data = ", data)
            if (Array.isArray(data)) {
              console.log("data is array ")
              this.setState({file_list: data})
            }
          })
        } else if (res.status === 400) {
          console.log(res.json())
        } else {
          console.log(`bad status code: ${res.status}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  doCreate = (_evt: FormEvent): void => {
    _evt.preventDefault();
    console.log(_evt);
    if (this.state._filename !== "") {
      this.setState({
        filename: this.state._filename,
        _filename: undefined,
        file_open: true,
        sq: initSq
      })
    }
  };

  doChange = (_evt: ChangeEvent<HTMLInputElement>): void => {
    console.log(_evt);
    this.setState({_filename:_evt.target.value})
  };

  onClose = (): void => {
    console.log("doCloseClick")
    this.setState({
      filename: undefined,
      _filename: undefined,
      file_open: false,
      sq: initSq
    })
    this.doListRequest();
  };

  onSave = (tree: Square): void => {
    console.log("doSaveClick")
    console.log("tree = ", toJson(tree))

    const payload = {
      name: this.state.filename,
      data: toJson(tree)
    }

    fetch("/api/save",
      {method: "POST",
           body: JSON.stringify(payload),
           headers: {"Content-Type": "application/json"}})
      .then(this.doSaveResp)
      .catch((error) => {
        console.error(error);
      });
  };

  doSaveResp = (res: Response): void => {
    if (res.status === 200) {
      console.log(res.json())
    } else if (res.status === 400) {
      console.log(res.json())
    } else {
      console.log(`bad status code: ${res.status}`);
    }
  };


}
