import React, { Component, ChangeEvent, MouseEvent } from "react";
import {
  Square,
  Path,
  toColor,
  Color,
  toJson,
  fromJson
} from './square';
import { SquareElem } from "./square_draw";
import {nil} from "./list";
import './index.css';


/**
 * Convert dir to index
 */
const dirToIdx = {
  NW: 0,
  NE: 1,
  SW: 2,
  SE: 3
}

const Colors = ["white" , "red" , "orange" , "yellow" , "green" , "blue" , "purple"];


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
      <button id="btn_split" className="button"
              onClick={this.doSplitClick} >Split</button>
      <button id="btn_merge" className="button"
              onClick={this.doMergeClick} >Merge</button>
      <select onChange={this.doColorChange} value="NA" className="select">
        <option key={"color_NA"} value="NA">Pick a color</option>
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
    const tree = this.splitSq(path, toJson(this.state.root));
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
   * @param path the path of the target square, it is undefined if no path
   *        selected yet
   * @param root the root of the square tree
   */
  splitSq = (path: Path | undefined, root: unknown): unknown => {
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
        const data:unknown[] = root;
        // Split the square at the specified index by converting dir to the
        // index of the square array
        data[dirToIdx[path.hd]] = this.splitSq(path.tl,
                                                  root[dirToIdx[path.hd]]);
        return data;
      }
      else {
        // root is not a valid square array
        console.error(`type ${typeof root} is not a valid square array`);
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
  mergeSq = (path: Path | undefined, root:unknown):unknown =>{
    if (path === undefined) {
      // if no path selected yet
      return root;
    }

    if (typeof root === "string" || path === nil) {
      // If there is only one square
      return root;
    }

    // Check to see if root is a valid array for square
    if((Array.isArray(root) && root.length === 4)) {
      if (path.tl === nil) {  // base case - If the next square is nil
        return root[dirToIdx[path.hd]];
      }
      else {  // recursive cases
        // Continue to find the root of the selected square according to the
        // path
        const data:unknown[] = root;
        data[dirToIdx[path.hd]] = this.mergeSq(path.tl,
                                                root[dirToIdx[path.hd]]);
        return data;
      }
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
  doColorChange = (_evt: ChangeEvent<HTMLSelectElement>): void => {
    // Task: implement
    const color: Color = toColor(_evt.target.value);  // get the selected color
    const path: Path | undefined = this.state.selected;  //
    const tree = toJson(this.state.root);
    const data = this.changeColor(color, path, tree);
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
  changeColor = (color: Color,
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
          console.error(`No path selected yet`);
          return root;
        }
        else {  // A path has been selected
          // Assign the current root to the data array
          const data:unknown[] = root;
          // Change the color on the specified square by converting from dir to
          // array index
          data[dirToIdx[path.hd]] = this.changeColor(color, path.tl,
            root[dirToIdx[path.hd]]);
          return data;
        }
      }
      else {  // root is not a valid array
        console.error(`type ${typeof root} is not a valid square`);
        return root;
      }
    }
  }
}
