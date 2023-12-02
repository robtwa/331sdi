import React, { Component, MouseEvent, ChangeEvent } from 'react';
import { isRecord } from './record';

// Represents one item in the todo list.
type Item = {
  name: string;
  completed: boolean;
};

// State of the app is the list of items and the text that the user is typing
// into the new item field.
type TodoState = {
  items: Item[] | undefined;  // to-do items or undefined if still loading
  newName: string;            // mirrors text in the field to add a new name
  message: string;            // an information message to show (if not "")
};

// Ensure that this is an array of items.
// Returns it with that type or throws an exception if it is invalid.
const itemsFromJson = (val: unknown): Item[] => {
  if (!Array.isArray(val)) {
    throw new Error(`value is not an array: ${typeof val}`);
  }

  const items: Item[] = [];
  for (const item of val) {
    if (!isRecord(item)) {
      throw new Error(`item is not a record: ${typeof item}`)
    } else if (typeof item.name !== 'string') {
      throw new Error(
          `item.name is missing or not a string: ${typeof item.name}`);
    } else if (typeof item.completed !== 'boolean') {
      throw new Error(
          `item.completed is missing or not a boolean: ${typeof item.name}`);
    } else {
      items.push({name: item.name, completed: item.completed});
    }
  }
  return items;
};

// Enable debug logging of events in this class.
const DEBUG: boolean = false;

// Top-level application that lets the user pick a quarter and then pick
// classes within that quarter.
export class TodoApp extends Component<{}, TodoState> {

  constructor(props: {}) {
    super(props);
    this.state = {items: undefined, newName: "", message: ""};
  }

  componentDidMount = (): void => {
    this.doRefreshTimeout();  // initiate a fetch to update our list of items
  };

  render = (): JSX.Element => {
    if (DEBUG) console.debug("rendering")

    // Return a UI with all the items and elements that allow them to add a new
    // item with a name of their choice.
    return (
      <div>
        <h2>To-Do List</h2>
        {this.renderItems()}
        {this.renderMessage()}
        <p className="instructions">Check the item to mark it completed.</p>
        <p className="more-instructions">New item:
          <input type="text" className="new-item"
              value={this.state.newName}
              onChange={this.doNewNameChange} />
          <button type="button" className="btn btn-link"
              onClick={this.doAddClick}>Add</button>
        </p>
      </div>);
  }

  // Returns a div for each item in the todo list, with each div containing a
  // label with the name of the item and a checkbox for marking it completed.
  renderItems = (): JSX.Element => {
    if (this.state.items === undefined) {
      return <p>Loading To-Do list...</p>;
    } else {
      const items : JSX.Element[] = [];
      for (const [index, item] of this.state.items.entries()) {
        if (item.completed) {
          items.push(
            <div className="form-check" key={index}>
              <input className="form-check-input" type="checkbox"
                  id={"check" + index} checked={true} readOnly={true} />
              <label className="form-check-label completed" htmlFor={"check" + index}>
                {item.name}
              </label>
            </div>);
        } else {
          items.push(
            <div className="form-check" key={index}>
              <input className="form-check-input" type="checkbox"
                  id={"check" + index} checked={false}
                  onChange={evt => this.doItemClick(evt, index)} />
              <label className="form-check-label" htmlFor={"check" + index}>
                {item.name}
              </label>
            </div>);
        }
      }
      return <div>{items}</div>;
    }
  };

  // Returns a paragraph showing the information message if there is one.
  // Otherwise, this returns an empty div.
  renderMessage = (): JSX.Element => {
    if (this.state.message === "") {
      return <div></div>;
    } else {
      return <p>{this.state.message}</p>;
    }
  };

  // Called to refresh our list of items from the server.
  // Todo 1
  doRefreshTimeout = (): void => {
    fetch("/api/list")
        .then(this.doListResp)
        .catch(() => this.doListError("failed to connect to server"));
  };

  // Called with the response from a request to /api/list
  doListResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doListJson)
         .catch(() => this.doListError("200 response is not valid JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doListError)
         .catch(() => this.doListError("400 response is not text"));
    } else {
      this.doListError(`bad status code ${res.status}`);
    }
  };

  // Called with the JSON response from /api/list
  doListJson = (val: unknown): void => {
    if (!isRecord(val)) {
      console.error("bad data from /list: not a record", val)
      return;
    }

    if (DEBUG) console.log("updating list from fetch response");

    const items = itemsFromJson(val.items);
    this.setState({items: items, message: ""});
  };

  // Called when we fail trying to refresh the items from the server.
  doListError = (msg: string): void => {
    console.error(`Error fetching /list: ${msg}`);
  };

  // Called when the user checks the box next to an uncompleted item. The
  // second parameter is the index of that item in the list.
  doItemClick = (_: ChangeEvent<HTMLInputElement>, index: number): void => {
    if (this.state.items === undefined)
      throw new Error('impossible: items is undefined');

    const item = this.state.items[index];
    if (DEBUG) console.log(`marking item ${item.name} as completed`);

    const body = {name: item.name};  // Todo 3
    fetch("/api/complete", {
        method: "POST", body: JSON.stringify(body),
        headers: {"Content-Type": "application/json"} })
      .then((res) => this.doCompleteResp(res, index))
      .catch(() => this.doCompleteError("failed to connect to server"))
  };

  // Called when the server confirms that the item was completed.
  doCompleteResp = (res: Response, index: number): void => {
    if (res.status === 200) {
      res.json().then((data) => this.doCompleteJson(data, index))
         .catch(() => this.doCompleteError("200 response is not valid JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doCompleteError)
         .catch(() => this.doCompleteError("400 response is not text"));
    } else {
      this.doCompleteError(`bad status code ${res.status}`);
    }
  };

  // Called with the JSON response from /api/complete
  doCompleteJson = (data: unknown, index: number): void => {
    if (!isRecord(data)) {
      console.error("bad data from /complete: not a record", data)
      return;
    }

    // Nothing useful in the response itself...

    if (this.state.items === undefined)
      throw new Error('impossible: items is undefined');

    // Note: we cannot mutate the list. We must create a new one.
    const item = this.state.items[index];
    const items = this.state.items.slice(0, index)    // 0 .. index-1
        .concat([{name: item.name, completed: true}])
        .concat(this.state.items.slice(index + 1));   // index+1 ..
    this.setState({items: items});

    // Refresh our list after this item has been removed.
    // Todo 4
    setTimeout(this.doRefreshTimeout, 5100);
  };

  // Called when we fail trying to complete an item
  doCompleteError = (msg: string): void => {
    console.error(`Error fetching /complete: ${msg}`);
  };

  // Called when the user clicks on the button to add the new item.
  doAddClick = (_: MouseEvent<HTMLButtonElement>): void => {
    // Ignore the request if the user hasn't entered a name.
    // (Would be better to disable the button in this case.)
    const name = this.state.newName.trim();
    if (name.length == 0)
      return;

    fetch("/api/add", {
        method: "POST", body: JSON.stringify({name}),
        headers: {"Content-Type": "application/json"} })
      .then(this.doAddResp)
      .catch(() => this.doAddError("failed to connect to server"));
  };

  // Called when the server confirms that the item was added.
  doAddResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doAddJson)
         .catch(() => this.doAddError("200 response is not valid JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doAddError)
         .catch(() => this.doAddError("400 response is not text"));
    } else {
      this.doAddError(`bad status code ${res.status}`);
    }
  };

  // Called with the JSON response from /api/add
  doAddJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /add: not a record", data);
      return;
    }

    if (typeof data.name !== 'string') {
      console.error("bad data from /add: name is not a string", data);
      return;
    }

    if (DEBUG) console.log(`added new item ${data.name}`);

    // Todo 2
    if (this.state.items === undefined) {
      throw Error('impossible: items is undefined');
    }
    const items = this.state.items.concat([ {name: data.name, completed: false} ]);
    this.setState({items: items, newName: ""});

    // Todo 5
    // Add a message about the added item.
    this.setState({message: `Added ${data.name} List now contains ${items.length} items.`});
  };

  // Called when we fail trying to add an item
  doAddError = (msg: string): void => {
    console.error(`Error fetching /add: ${msg}`);
  };

  // Called each time the text in the new item name field is changed.
  doNewNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    if (DEBUG) console.log(`changeing new name to ${evt.target.value}`);
    this.setState({newName: evt.target.value});
  };
}
