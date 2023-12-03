import React, { Component, ChangeEvent, MouseEvent, FormEvent } from "react";
import { isRecord } from './record';


// TODO: When you're ready to get started, you can remove all the code below and
// start with this blank application:
//
// type PollsAppState = {
// }
// 
// /** Displays the UI of the Polls application. */
// export class PollsApp extends Component<{}, PollsAppState> {
// 
//   constructor(props: {}) {
//     super(props);
// 
//     this.state = {};
//   }
//   
//   render = (): JSX.Element => {
//     return <div></div>;
//   };
// }

type ui = "polls" | "newPoll" | "vote" | "results";  // UI view
type action = undefined| "new" | "edit" | "save" | "refresh" | "back"; // action
type poll = {
  name: string,
  minutes: number,
  options: string[],
  createAt: Date
};

type PollsAppState = {
  ui: ui                        // UI to display
  action?: action;              // Action performed by user
  polls?:poll[],                // Poll list
  name?: string;                // Poll name
  minutes?: number;             // Voting duration
  options?: string;             // Voting options
  createdAt?:Date;             // Poll's created date and time
  msg?: string;                 // Message sent from server
}

// Helper
/**
 * Return the difference between two dates in minutes
 * @param src
 * @param tar
 */
const diffTime = (src: Date, tar: Date):number =>{
  return (src.getTime() - tar.getTime()) / 1000 / 60
}

const addMinutesToDate = (date: Date, minutes: number): Date => {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
}

/** Displays the UI of the Polls application. */
export class PollsApp extends Component<{}, PollsAppState> {
  constructor(props: {}) {
    super(props);

    this.state = {ui:"polls"};
  }
  
  render = (): JSX.Element => {
    console.log("this.state = ", this.state)
    if (this.state.ui === "newPoll") {
      return this.renderNewPoll();
    }
    else if (this.state.ui === "vote") {
      return this.renderVote();
    }
    else if (this.state.ui === "results") {
      return this.renderViewPollResults();
    }
    else {  // Show the default UI
      return this.renderPolls();
    }
  };

  doBackClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.setState({ui: "polls"})
  };

  // Current Polls /////////////////////////////////////////////////////////////
  renderPolls = (): JSX.Element => {
    return (<div>
      <h1>Current Polls</h1>

      <h2>Still Open</h2>
      {this.renderPollList(true)}

      <h2>Closed</h2>
      {this.renderPollList(false)}

      <button onClick={this.doListRequestClick} className="button">Refresh</button>
      <button onClick={this.doNewPollClick} className="button">New Poll</button>
    </div>);
  };
  renderPollList = (showOpenOrClosed: boolean): JSX.Element |JSX.Element[] => {
    if (this.state.polls === undefined || this.state.polls.length < 1) {
      return <></>;
    }

    const links: JSX.Element[] = [];
    for (const poll of this.state.polls) {
      const end = addMinutesToDate(poll.createAt, poll.minutes);
      // const end = addMinutesToDate(new Date(), -2);
      const timeDiff = diffTime(end, new Date());
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
    this.setState({ui: "newPoll"})
  };

  doOpenVoteClick = (name: string): void => {
    fetch("/api/load?name="+name)
      .then((res: Response) => this.doLoadResp(res, name))
      .catch(()=>this.doLoadError("failed to connect to server", name));

    this.setState({ui: "vote", name})
  };

  // Called when the server responds with a square data.
  doLoadResp = (res:Response, name: string):void => {
    if (res.status === 200) {
      res.json().then((data:poll)=>this.doLoadJson(data))
        .catch(()=>this.doLoadError("200 response is not valid JSON", name))
    } else if (res.status === 400) {
      res.text().then((res:string)=>this.doLoadError(res, name))
        .catch(() => this.doLoadError("400 response is not text", name));
    } else {
      this.doLoadError(`bad status code: ${res.status}`, name);
    }
  }

  // Called when the response JSON has been parsed.
  doLoadJson = (data: poll): void => {
    this.setState({
      name: data.name,
      minutes: data.minutes,
      options: data.options.toString(),
      createdAt: new Date(data.createAt)
    })
  };

  // Called if an error occurs trying to get the file data
  doLoadError = (msg: string, name: string): void => {
    console.error(`Error fetching /api/load?name=${name}: ${msg}`);
  };

  doViewResultClick = (name: string): void => {
    this.setState({ui: "results", name})
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

  // New Poll /////////////////////////////////////////////////////////////////
  renderNewPoll = (): JSX.Element => {
    return (<div>
      <form onSubmit={this.doNewPollSubmit}>
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
      {this.renderMessage()}
      <div className="buttonArea">
        <button type="submit" className="button">Create</button>
        <button onClick={this.doBackClick} className="button">Back</button>
      </div>
      </form>
    </div>);
  };

  doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({name: evt.target.value});
  };

  doMinutesChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({minutes: parseInt(evt.target.value)});
  };

  doOptionsChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({options: evt.target.value});


  };

  doNewPollSubmit = (_evt: FormEvent): void => {
    _evt.preventDefault();
    console.log("doNewPollSubmit")
    // Let the backend do data integrity checks
    const payload = {
      name: this.state.name,
      minutes: this.state.minutes,
      options: this.state.options,
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
      this.setState({msg: "Poll saved"});
    }
    else {
      this.doSaveError("Bad data. The returned data is not a json.");
    }
  };

  // Called if an error occurs trying to save file
  doSaveError = (msg: string): void => {
    console.error(`Error fetching /api/save: ${msg}`);
  };

  // Vote //////////////////////////////////////////////////////////////////////
  renderVote = (): JSX.Element => {
    if (this.state.createdAt === undefined) {
        return <>Corrupted data: Mission poll's creation time.</>
    }
    else if (this.state.minutes === undefined) {
      return <>Corrupted data: Mission poll's minutes.</>
    }
    else {
      const end = addMinutesToDate(this.state.createdAt, this.state.minutes);
      const remainMinutes = diffTime(end, new Date());

      if (remainMinutes > 0) {  // Poll is active
        return (<div>
          <h1>{this.state.name}</h1>
          <p>Closes in {Math.abs(remainMinutes).toFixed(2)} minutes</p>
        </div>);
      }
      else {  // Poll is closed
        return (<div>
          <h1>{this.state.name}</h1>
          <p>Closed in {Math.abs(remainMinutes).toFixed(2)} minutes</p>
        </div>);
      }

    }


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

  doDummyClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    // const name = this.state.name.trim();
    // if (name.length > 0) {
    //   const url = "/api/dummy?name=" + encodeURIComponent(name);
    //   fetch(url).then(this.doDummyResp)
    //       .catch(() => this.doDummyError("failed to connect to server"));
    // }
  };

  doDummyResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doDummyJson)
          .catch(() => this.doDummyError("200 response is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doDummyError)
          .catch(() => this.doDummyError("400 response is not text"));
    } else {
      this.doDummyError(`bad stauts code ${res.status}`);
    }
  };

  doDummyJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("200 response is not a record", data);
      return;
    }

    if (typeof data.msg !== "string") {
      console.error("'msg' field of 200 response is not a string", data.msg);
      return;
    }

    this.setState({msg: data.msg});
  }

  doDummyError = (msg: string): void => {
    console.error(`Error fetching /api/dummy: ${msg}`);
  };

}