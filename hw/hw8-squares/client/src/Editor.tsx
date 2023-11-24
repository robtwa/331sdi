import React, { Component, ChangeEvent, MouseEvent } from "react";
import {
  Square,
  Path,
  Colors,
  toColor,
  Color,
  toJson,
  fromJson, dirToIdx
} from './square';
import { SquareElem } from "./square_draw";
import {nil} from "./list";


type EditorProps = {
  /** Initial state of the file. */
  initialState: Square;
  color: Color;
  saveFileFunc: (tree: Square) => void;
  closeFileFunc:  () => void;
};


type EditorState = {
  /** The root square of all squares in the design */
  root: Square;

  /** Path to the square that is currently clicked on, if any */
  selected?: Path;

  color?: Color;
};


/** UI for editing the image. */
export class Editor extends Component<EditorProps, EditorState> {

  constructor(props: EditorProps) {
    super(props);

    console.log("1. Editor: props.initialState = ", props.initialState)
    console.log("1. Editor: props = ", props)

    this.state = { root: props.initialState, color: props.color };
  }

  render = (): JSX.Element => {
    // Task: add some editing tools here
    console.log("2. Editor: this.props = ", this.props)
    return <table ><tbody><tr>
        <td>
          <SquareElem width={600} height={600}
                      square={this.state.root}
                      selected={this.state.selected}
                      onClick={this.doSquareClick}></SquareElem>
        </td>
        <td style={{paddingLeft: "20px"}}>
          <p style={{fontWeight:"bold"}}>Tools:</p>
          {this.state.selected && this.tools()}
          <button id="btn_save" className="button"
                  onClick={this.doSaveClick} >Save</button>
          <button id="btn_close" className="button"
                  onClick={this.props.closeFileFunc}>Close</button>
        </td>
      </tr></tbody></table>;
  };

  tools = (): JSX.Element => {
    return <div className="buttonArea">
      <button id="btn_split" className="button" onClick={this.doSplitClick} >Split</button>
      <button id="btn_merge" className="button" onClick={this.doMergeClick} >Merge</button>
      <select onChange={this.doColorChange} value={this.state.color || ""} className="select">
        {Colors.map((color, index)=>(
          <option key={"color_"+index} value={color}>{color}</option>
        ))}
      </select>
    </div>;
  }

  doSaveClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.saveFileFunc(this.state.root)
  };

  doSquareClick = (path: Path): void => {
    // Task: remove this code, do something with the path to the selected square
    console.log("6. doSquareClick()")
    console.log("path = ", path);
    console.log("this.state = ", this.state)
    this.setState({selected:path});
  }

  doSplitClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    console.log("/".repeat(70))
    console.log("9. doSplitClick")

    // Task: implement
    const path: Path | undefined = this.state.selected;
    const tree = this.splitSq(path, toJson(this.state.root), 0);
    console.log("9.1 tree = ", tree)
    this.setState({root: fromJson(tree)})
  };

  splitSq = (path: Path | undefined, root: unknown, times: number): unknown => {
    console.log("\t".repeat(times) + "10. root = ", root)
    if (path === nil) {
      return [this.state.color, this.state.color,
              this.state.color, this.state.color];
    }
    else {
      if(Array.isArray(root) && path?.hd !== undefined) {
        let data = [root[0], root[1], root[2], root[3]];
        data[dirToIdx[path.hd]] = this.splitSq(path.tl, root[dirToIdx[path.hd]], times + 1);
        return data;
      }
      else {
        throw new Error(`type ${typeof root} is not a valid square`);
      }
    }
  };


  doMergeClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    // TODO: implement
    console.log("/".repeat(60))
    console.log("11. doMergeClick() ")
    const path: Path | undefined = this.state.selected;
    const tree = toJson(this.state.root);
    console.log("path = ", path)
    console.log("tree = ", tree)
    const data = this.mergeSq(path, tree);
    console.log("11.2 data = ", data)
    this.setState({root: fromJson(data)})
  };

  mergeSq = (path: Path | undefined, root:unknown ):unknown =>{
    console.log("12. root = ", root)

    if (path === nil) {
      console.log("12.1")
      return root;
    }
    else {
      if(Array.isArray(root) && path?.hd !== undefined) {
        if (path?.tl === nil) {
          console.log("12.2 root[dirToIdx[path.hd]] = ", root[dirToIdx[path.hd]])
          return root[dirToIdx[path.hd]];
        }
        else {
          console.log("12.3")
          let data = [root[0], root[1], root[2], root[3]];
          data[dirToIdx[path.hd]] = this.mergeSq(path.tl, root[dirToIdx[path.hd]]);
          return data;
        }
      }
      else {
        throw new Error(`type ${typeof root} is not a valid square`);
      }
    }
  }

  doColorChange = (_evt: ChangeEvent<HTMLSelectElement>): void => {
    console.log("/".repeat(60))
    console.log("7.1 doColorChange() ")
    console.log("_evt.target.value = " + _evt.target.value)
    // TODO: implement
    const color: Color = toColor(_evt.target.value);
    const path: Path | undefined = this.state.selected;
    const tree = toJson(this.state.root);
    const data = this.changeColor(color, path, tree);
    this.setState({root: fromJson(data), color: color})
  };

  changeColor = (color: Color, path: Path | undefined, root:unknown ):unknown =>{
    console.log("8. root = ", root)
    console.log(color, path, root)

    if (path === nil) {
      return color;
    }
    else {
      if(Array.isArray(root) && path?.hd !== undefined) {
        let data = [root[0], root[1], root[2], root[3]];
        data[dirToIdx[path.hd]] = this.changeColor(color, path.tl, root[dirToIdx[path.hd]]);
        return data;
      }
      else {
        throw new Error(`type ${typeof root} is not a valid square`);
      }
    }
  }
}
