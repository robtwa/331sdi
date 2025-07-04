import React, { Component, ChangeEvent, FormEvent } from "react";
import {ServerResponse} from "./lib";

type PollEditorProps = {
  backFunc:  () => void;            // The function back to the poll list
};

type PollEditorState = {
  name: string;                     // Poll name
  minutes?: number | string;        // Voting duration
  options: string;                  // Voting options
  createdAt?:Date;                  // Poll's created date and time
  msg?: string | undefined;         // The message
}

// Displays the editor of the poll.
export class PollEditor extends Component<PollEditorProps, PollEditorState> {
  constructor(props: PollEditorProps) {
    super(props);

    // Default values
    this.state = {
      name: "",
      options: "",
      minutes: 10,      // Default to 10 minutes
    };
  }

  // Render the editor UI
  render = (): JSX.Element => {
    return (<div>
      <form onSubmit={this.doSubmitPollClick}>
        <h1>New Poll</h1>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={this.state.name} required={true}
                 onChange={this.doNameChange}></input>
        </div>
        <div>
          <label htmlFor="minutes">Minutes:</label>
          <input type="number" id="minutes" value={this.state.minutes}
                 min={0} required={true}
                 onChange={this.doMinutesChange}></input>
        </div>
        <div>
          <label htmlFor="options">Options (one per line, minimum 2 lines):</label>
          <br/>
          <textarea id="textbox" rows={6} cols={20} value={this.state.options}
                    required={true}
                    onChange ={this.doOptionsChange}></ textarea >
        </div>
        <div className="buttonArea">
          <button type="submit" className="button">Create</button>
          <button type="button" onClick={this.props.backFunc} className="button">Back</button>
        </div>
      </form>

      {this.renderMessage()}
    </div>);
  };

  // Render the message
  renderMessage = (): JSX.Element => {
    if (this.state.msg === "") {
      return <div key={"div_empty"} ></div>;
    } else {
      return <p key="p_message" className={"message"}>{this.state.msg}</p>;
    }
  };

  // Handle the event for the name change.
  doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({name: evt.target.value});
  };

  // Handle the event for the minutes change.
  doMinutesChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    if (evt.target.value === "") {
      this.setState({minutes: evt.target.value });
    }
    else {
      this.setState({minutes: parseInt(evt.target.value) });
    }
  };

  // Handle the event for the options change.
  doOptionsChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({options: evt.target.value});
  };

  /**
   * Handle the event for submitting the poll form.
   * @param _evt
   */
  doSubmitPollClick = (_evt: FormEvent): void => {
    _evt.preventDefault();  // to prevent default behavior

    // Note: Let the server do the data integrity checks.
    // Have all such checks done in one place, and the server is a safe place
    // to perform such checks.

    // the payload
    const payload = {
      name: this.state.name,
      minutes: this.state.minutes,
      options: this.state.options,
    }

    // call the server
    fetch("/api/save",
      {method: "POST",
        body: JSON.stringify(payload),
        headers: {"Content-Type": "application/json"}})
      .then(this.doSaveResp)
      .catch(()=>this.doSaveError("failed to connect to server"));
  };

  // Called when the server responds to the save poll request.
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

  // Called when parsing the JSON is complete.
  doSaveJson = (_: ServerResponse): void => {
    this.props.backFunc();  // Back to the poll list after poll saved
  };

  // Called if an error occurs trying to save file
  doSaveError = (msg: string): void => {
    this.setState({msg: `Error fetching /api/save: ${msg}`});
  };
}
