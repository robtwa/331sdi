import React, { Component, MouseEvent } from "react";
import {Comp, Poll, diffTimeFunc, addMinutesFunc} from './lib'
import {PollEditor} from "./PollEditor"
import {Vote} from "./Vote"
import {PollResult} from "./PollResult";

type PollsAppState = {
  comp: Comp                    // Components
  polls: Poll[],                // Poll list
  name: string;                // Poll name
  msg: string;                  // Message sent from server
}

// Enable debug mode in this class.
const DEBUG_MODE: boolean = true;

/** Displays the UI of the Polls application. */
export class PollsApp extends Component<{}, PollsAppState> {
  constructor(props: {}) {
    super(props);
    this.state = {comp:"polls", polls:[], name: "", msg:""};  // Init the state
  }

  componentDidMount = ():void => {
    // When the component is mounted, call the doListRequestClick func to get
    // a list of all polls
    this.doListRequestClick()
  }

  // Render the UI
  render = (): JSX.Element => {
    if (this.state.comp === "newPoll") {
      return <PollEditor backFunc={this.doBackClick}/>;
    }
    else if (this.state.comp === "vote" && this.state.name !== undefined) {
      return <Vote backFunc={this.doBackClick} name={this.state.name}/>;
    }
    else if (this.state.comp === "results" && this.state.name !== undefined) {
      return <PollResult backFunc={this.doBackClick} name={this.state.name}/>;
    }
    else {  // Show the default UI
      return this.renderPolls();
    }
  };

  // Render the message
  renderMessage = (): JSX.Element => {
    if (this.state.msg === "") {
      return <div></div>;
    } else {
      return <p className={"message"}>{this.state.msg}</p>;
    }
  };

  // Render the UI of all saved polls
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

      {this.renderMessage()}
    </div>);
  };

  /**
   * Render the open or closed poll list
   * @param showOpen used to render the open or closed polls; true for open
   *        polls, false for closed polls
   */
  renderPollList = (showOpen: boolean): JSX.Element |JSX.Element[] => {
    const links: JSX.Element[] = [];
    for (const poll of this.state.polls) {
      const end = addMinutesFunc(poll.minutes, poll.createAt);
      const timeDiff = diffTimeFunc(end, new Date());
      if (showOpen && timeDiff > 0) {
        // Show polls that have not been closed yet
        if (DEBUG_MODE) {
          links.push(<li key={"active_poll_"+poll.name}>
            <a href="#" onClick={()=>this.doOpenVoteClick(poll.name)} >{poll.name} </a>
            - {timeDiff.toFixed(2)} {timeDiff === 1?"minute":"minutes"} remaining
            <a href="#" onClick={()=>this.doViewResultClick(poll.name)} className={"gap"}>results</a>
          </li>)
        }
        else {
          links.push(<li key={"active_poll_"+poll.name}>
            <a href="#" onClick={()=>this.doOpenVoteClick(poll.name)} >{poll.name} </a>
            - {timeDiff.toFixed(2)} {timeDiff === 1?"minute":"minutes"} remaining
          </li>)
        }
      }

      if (!showOpen && timeDiff <= 0) {
        // Show closed polls
        links.push(<li key={"active_poll_"+poll.name}>
          <a href="#" onClick={()=>this.doViewResultClick(poll.name)} >{poll.name} </a>
          - closed {Math.abs(timeDiff).toFixed(2)} {timeDiff === 1?"minute":"minutes"} ago
        </li>)
      }
    }
    console.log(links.length)
    if (links.length < 1) {
      links.push(<p className={"gap gray"}>No data.</p>)
    }
    return links;
  };

  // Event handler for creating a new poll.
  doNewPollClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.setState({comp: "newPoll"})
  };

  // Event handler for opening a poll.
  doOpenVoteClick = (name: string): void => {
    this.setState({comp: "vote", name})
  };

  // Event handler for viewing a poll results.
  doViewResultClick = (name: string): void => {
    this.setState({comp: "results", name})
  };

  /**
   * Requests a list of all saved files from the server.
   * If the request is successful and the status code is 200 and the returned
   * data is valid, update the list to the component’s state object.
   */
  doListRequestClick = (): void => {
    // Clear previous "msg" before submitting data
    this.setState({msg:""});

    fetch("/api/list")
      .then(this.doListRequestResp)
      .catch(()=>this.doListRequestError("failed to connect to server"));
  };

  // Called when the server responds with a poll list.
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

  // Called if an error occurs trying to get the poll list
  doListRequestError = (msg: string): void => {
    this.setState({msg: `Error fetching /api/list: ${msg}`});
  };

  // Called when backing to this PollsApp UI
  doBackClick = (): void => {
    this.setState({comp:"polls", polls:[], name: "", msg:""})
    this.doListRequestClick();  // Retrieve a poll list from the server
  };
}
