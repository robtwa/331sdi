import React, { Component, ChangeEvent, MouseEvent } from "react";
import {
  Square,
  Path,
  toColor,
  Color,
  toJson,
  fromJson,
} from './square';
import { SquareElem } from "./square_draw";
import {nil} from "./list";
import './index.css';

type direction = {NW: number, NE: number, SW: number, SE: number};

type EditorProps = {
  /** Initial state of the file. */
  initialState: Square;
  color: Color;
  saveFileFunc: (tree: Square) => void;
  closeFileFunc:  () => void;
  message: string | undefined;
  colorList: string[];
  dirToIdx: direction;
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
          {this.state.selected && this.renderTools()}
          <button id="btn_save" className="button"
                  onClick={this.doSaveClick} >Save</button>
          <button id="btn_close" className="button"
                  onClick={this.props.closeFileFunc}>Close</button>
        </td>
      </tr></tbody></table>;
  };

  // Returns the UI of the tool buttons
  renderTools = (): JSX.Element => {
    return <div className="buttonArea">
      <button id="btn_split" className="button"
              onClick={this.doSplitClick} >Split</button>
      <button id="btn_merge" className="button"
              onClick={this.doMergeSquaresClick} >Merge</button>
      <select onChange={this.doChangeColorClick} value="NA" className="select">
        <option key={"color_NA"} value="NA">Pick a color</option>
        {this.renderOptions()}

      </select>
    </div>;
  }

  renderOptions = ():JSX.Element[] =>{
    const options:JSX.Element[] = [];
    // Inv: options is the list of options in this.state.colorList[0:i]
    for (let i = 0; i < this.props.colorList.length; i++) {
      options.push(<option key={"color_"+i} value={this.props.colorList[i]}>{this.props.colorList[i]}</option>)
    }

    return options;
  }

  // Event handler for the save button
  // Calls the save file function with the current data.
  doSaveClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.saveFileFunc(this.state.root)
  };

  /**
   * Event handler for clicking a square
   * Update the path of the clicked square to the state object.
   * @param path a list of dir
   */
  doSquareClick = (path: Path): void => {
    this.setState({selected:path});
  }

  // Event handler for splitting a square.
  doSplitClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    // Task: implement
    const path: Path | undefined = this.state.selected;
    const tree = this.doSplitSquareClick(path, toJson(this.state.root));
    this.setState({root: fromJson(tree)})
  };

  /**
   * Returns the split square tree after splitting the selected square.
   * If no path is selected, return the root.
   * If the path is a nil, return 4 squares with the color of the selected
   *    square.
   * If the path is not a nil and the root is a valid square array,
   *    insert 4 additional squares on the selected square and return it,
   *    otherwise print an error message to the console
   * @modifies data
   * @param path the path of the target square, it is undefined if no path
   *        selected yet
   * @param root the root of the square tree
   */
  doSplitSquareClick = (path: Path | undefined, root: unknown): unknown => {
    if (path === undefined) { // No path selected yet
      return root;
    }

    if (path === nil) {  // base case
      return [root, root, root, root];
    }
    else {  // recursive case
      // Check if root is a valid square array
      if(Array.isArray(root) && root.length === 4) {
        // if root is a valid square array
        if (path.hd === "NW") {
          return [this.doSplitSquareClick(path.tl, root[0]), root[1], root[2], root[3]];
        }
        else if (path.hd === "NE") {
          return [root[0], this.doSplitSquareClick(path.tl, root[1]), root[2], root[3]];
        }
        else if (path.hd === "SW") {
          return [root[0], root[1], this.doSplitSquareClick(path.tl, root[2]), root[3]];
        }
        else {  // SE
          return [root[0], root[1], root[2], this.doSplitSquareClick(path.tl, root[3])];
        }
      }
      else {
        // root is not a valid square array
        console.error(`type ${typeof root} is not a valid square array`);
        return root;
      }
    }
  };

  // Event handler for merging squares.
  doMergeSquaresClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    const path: Path | undefined = this.state.selected;
    const tree = toJson(this.state.root);
    const data = this.doMergeClick(path, tree);
    this.setState({root: fromJson(data)})
  };

  /**
   * Returns the merged square tree after merging the selected square with its
   * siblings.
   * If the path is undefined, return the root.
   * If there is only one square, return the root.
   * If the root is a valid square array, merge other three squares with the
   *    selected square and return it, otherwise print an error message to the
   *    console
   * @param path the path of the target square, undefined for not select a path
   * @param root the root of the square tree
   */
  doMergeClick = (path: Path | undefined, root:unknown):unknown =>{
    if (path === undefined) {  // If no square is selected
      return root;
    }

    if (typeof root === "string" || path === nil) {
      // If there is only one square
      return root;
    }

    // Determine whether root is a valid square array.
    if((Array.isArray(root) && root.length === 4)) {
      if (path.tl === nil) {  // base case - If the next square is nil
        // Merging other squares with the selected square
        return root[this.props.dirToIdx[path.hd]];
      }
      else {  // recursive cases
        // Continue to find the root of the selected square according to the
        // path
        if (path.hd === "NW") {
          return [this.doMergeClick(path.tl, root[0]), root[1], root[2], root[3]];
        }
        else if (path.hd === "NE") {
          return [root[0], this.doMergeClick(path.tl, root[1]), root[2], root[3]];
        }
        else if (path.hd === "SW") {
          return [root[0], root[1], this.doMergeClick(path.tl, root[2]), root[3]];
        }
        else {  // SE
          return [root[0], root[1], root[2], this.doMergeClick(path.tl, root[3])];
        }
      }  // end if
    }
    else {
      console.error(`type ${typeof root} is not a valid square`);
      return root;
    }
  }

  /**
   * Event handler for changing color.
   * @param _evt
   */
  doChangeColorClick = (_evt: ChangeEvent<HTMLSelectElement>): void => {
    // Task: implement
    const color: Color = toColor(_evt.target.value);  // get the selected color
    const path: Path | undefined = this.state.selected;  //
    const tree = toJson(this.state.root);
    const data = this.doColorChange(color, path, tree);
    this.setState({root: fromJson(data), color: color})
  };

  /**
   * Return the square tree after changing color on the selected square.
   * If the path is a nil, return the color.
   * If the path is not a nil and the root is a valid square array,
   *    change the color on the selected square and return it.
   * If the root is not a valid square array, print out the error message
   *    to the console.
   * @param color user selected color
   * @param path the path of the target square
   * @param root the root of the square tree
   */
  doColorChange = (color: Color,
                 path: Path | undefined,
                 root:unknown ):unknown =>{
    if (path === nil) {  // base case
      return color;
    }
    else { // recursive cases
      // Check if root is a valid array
      if(Array.isArray(root) && root.length === 4) { // root is a valid array
        // Check if a path has been selected
        if (path === undefined) {  // No path selected yet
          console.error("No path selected yet");
          return root;
        }
        else {  // A path has been selected
          // Change the color of the specified square
          if (path.hd === "NW") {
            return [this.doColorChange(color, path.tl, root[0]), root[1], root[2], root[3]];
          }
          else if (path.hd === "NE") {
            return [root[0], this.doColorChange(color, path.tl, root[1]), root[2], root[3]];
          }
          else if (path.hd === "SW") {
            return [root[0], root[1], this.doColorChange(color, path.tl, root[2]), root[3]];
          }
          else {  // SE
            return [root[0], root[1], root[2], this.doColorChange(color, path.tl, root[3])];
          }
        }
      }
      else {  // root is not a valid array
        console.error(`type ${typeof root} is not a valid square`);
        return root;
      }
    }
  }
}
