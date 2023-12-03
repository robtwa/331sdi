import React, { Component, MouseEvent } from "react";
import {model, action, poll, diffTimeFunc, addMinutesFunc} from './lib'
import {PollEditor} from "./PollEditor"
import {Vote} from "./Vote"



type PollsAppState = {
  model: model                        // UI to display
  action?: action;              // Action performed by user
  polls?:poll[],                // Poll list
  name?: string;                // Poll name
  minutes?: number;             // Voting duration
  options?: string;             // Voting options
  createdAt?:Date;             // Poll's created date and time
  msg?: string;                 // Message sent from server
}

/** Displays the UI of the Polls application. */
export class PollsApp extends Component<{}, PollsAppState> {
  constructor(props: {}) {
    super(props);

    this.state = {model:"polls"};
  }

  componentDidMount() {
    console.log("App: componentDidMount(")
    this.doListRequestClick()
  }


  render = (): JSX.Element => {
    console.log("this.state = ", this.state)
    if (this.state.model === "newPoll") {
      return <PollEditor backFunc={this.doBackClick}/>;
    }
    else if (this.state.model === "vote" && this.state.name !== undefined) {
      return <Vote backFunc={this.doBackClick} name={this.state.name}/>;
    }
    else if (this.state.model === "results") {
      return this.renderViewPollResults();
    }
    else {  // Show the default UI
      return this.renderPolls();
    }
  };

  doBackClick = (): void => {
    this.setState({model: "polls"})
    // this.doListRequestClick()
  };

  // Current Polls /////////////////////////////////////////////////////////////
  renderPolls = (): JSX.Element => {
    return (<div>
      <h1>Current Polls</h1>

      <h2>Still Open</h2>
      {this.renderPollList(true)}

      <h2>Closed</h2>
      {this.renderPollList(false)}

      <div className="buttonArea">
        <button onClick={this.doListRequestClick} className="button">Refresh</button>
        <button onClick={this.doNewPollClick} className="button">New Poll</button>
      </div>
    </div>);
  };
  renderPollList = (showOpenOrClosed: boolean): JSX.Element |JSX.Element[] => {
    if (this.state.polls === undefined || this.state.polls.length < 1) {
      return <></>;
    }

    const links: JSX.Element[] = [];
    for (const poll of this.state.polls) {
      const end = addMinutesFunc(poll.minutes, poll.createAt);
      // const end = addMinutesFunc(new Date(), -2);
      const timeDiff = diffTimeFunc(end, new Date());
      // Show polls still active
      if (showOpenOrClosed && timeDiff > 0) {
        links.push(<li key={"active_poll_"+poll.name}>
          <a href="#" onClick={()=>this.doOpenVoteClick(poll.name)} >{poll.name} </a>
          - {timeDiff.toFixed(2)} {timeDiff === 1?"minute":"minutes"} remaining
        </li>)
      }
      // Show polls closed
      if (!showOpenOrClosed && timeDiff <= 0) {
        links.push(<li key={"active_poll_"+poll.name}>
          <a href="#" onClick={()=>this.doViewResultClick(poll.name)} >{poll.name} </a>
          - closed {Math.abs(timeDiff).toFixed(2)} {timeDiff === 1?"minute":"minutes"} ago
        </li>)
      }
    }
    return links;
  };

  doNewPollClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.setState({model: "newPoll"})
  };

  doOpenVoteClick = (name: string): void => {
    this.setState({model: "vote", name})
  };

  doViewResultClick = (name: string): void => {
    this.setState({model: "results", name})
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
      this.setState({polls: data})
    }
    else {
      this.doListRequestError("Bad data. The returned data is invalid.");
    }
  };

  // Called if an error occurs trying to get the file list
  doListRequestError = (msg: string): void => {
    console.error(`Error fetching /api/list: ${msg}`);
  };


  renderViewPollResults = (): JSX.Element => {
    return (<div>
      <h1>Poll Results</h1>
    </div>);
  };

  renderMessage = (): JSX.Element => {
    if (this.state.msg === "") {
      return <div></div>;
    } else {
      return <p>Server says: {this.state.msg}</p>;
    }
  };






}