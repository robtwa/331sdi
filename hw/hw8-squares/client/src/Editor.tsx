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
  message: string | undefined;
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
    this.state = { root: props.initialState, color: props.color };
  }

  render = (): JSX.Element => {
    // Task: add some editing tools here
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

  // Returns the UI of the tool buttons
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

  // Event handler for the save button
  // Calls the save file function with the current data.
  doSaveClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.saveFileFunc(this.state.root)
  };

  // Event handler for clicking a square
  // Update the path of the clicked square to the state object.
  doSquareClick = (path: Path): void => {
    this.setState({selected:path});
  }

  // Event handler for splitting a square.
  doSplitClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    // Task: implement
    const path: Path | undefined = this.state.selected;
    const tree = this.splitSq(path, toJson(this.state.root));
    this.setState({root: fromJson(tree)})
  };

  /**
   * Splitting function of the square.
   * If the path is nil, return 4 squares with the current color
   * If the path is valid and is not nil and the root is an array of length 4,
   * insert 4 additional squares on the selected square and return it, otherwise
   * print an error message to the console
   *
   * @param path the path of the target square
   * @param root the root of the square tree
   */
  splitSq = (path: Path | undefined, root: unknown): unknown => {
    if (path === nil) {
      return [this.state.color, this.state.color,
              this.state.color, this.state.color];
    }
    else {
      if(Array.isArray(root) && root.length === 4 && path?.hd !== undefined) {
        let data = [root[0], root[1], root[2], root[3]];
        data[dirToIdx[path.hd]] = this.splitSq(path.tl, root[dirToIdx[path.hd]]);
        return data;
      }
      else {
        console.error(`type ${typeof root} is not a valid square`);
        return root;
      }
    }
  };

  // Event handler for merging squares.
  doMergeClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    const path: Path | undefined = this.state.selected;
    const tree = toJson(this.state.root);
    const data = this.mergeSq(path, tree);
    this.setState({root: fromJson(data)})
  };

  /**
   * Merge function of squares
   * If the path is nil, return the root.
   * If the path is valid and is not nil and the root is an array of length 4,
   * merge other squares with the selected square and return it, otherwise print
   * an error message to the console
   * @param path the path of the target square
   * @param root the root of the square tree
   */
  mergeSq = (path: Path | undefined, root:unknown):unknown =>{
    if (path === nil) {
      return root;
    }
    else {
      if(Array.isArray(root) && root.length === 4 && path?.hd !== undefined) {
        if (path?.tl === nil) {
          return root[dirToIdx[path.hd]];
        }
        else {
          let data = [root[0], root[1], root[2], root[3]];
          data[dirToIdx[path.hd]] = this.mergeSq(path.tl, root[dirToIdx[path.hd]]);
          return data;
        }
      }
      else {
        console.error(`type ${typeof root} is not a valid square`);
        return root;
      }
    }
  }

  /**
   * Event handler for changing color.
   * @param _evt
   */
  doColorChange = (_evt: ChangeEvent<HTMLSelectElement>): void => {
    // Task: implement
    const color: Color = toColor(_evt.target.value);
    const path: Path | undefined = this.state.selected;
    const tree = toJson(this.state.root);
    const data = this.changeColor(color, path, tree);
    this.setState({root: fromJson(data), color: color})
  };

  /**
   * Function for changing a square's color.
   * If the path is nil, return the color.
   * If the path is valid and is not nil and the root is an array of length 4,
   * change the color the selected square and return it, otherwise print an
   * error message to the console
   *
   * @param color user selected color
   * @param path the path of the target square
   * @param root the root of the square tree
   */
  changeColor = (color: Color, path: Path | undefined, root:unknown ):unknown =>{
    if (path === nil) {
      return color;
    }
    else {
      if(Array.isArray(root) && root.length === 4 && path?.hd !== undefined) {
        let data = [root[0], root[1], root[2], root[3]];
        data[dirToIdx[path.hd]] = this.changeColor(color, path.tl, root[dirToIdx[path.hd]]);
        return data;
      }
      else {
        console.error(`type ${typeof root} is not a valid square`);
        return root;
      }
    }
  }
}
