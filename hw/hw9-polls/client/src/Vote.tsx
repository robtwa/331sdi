import React, { Component, ChangeEvent, FormEvent } from "react";
import { isRecord } from './record';
import {addMinutesFunc, diffTimeFunc, Poll, ServerResponse} from "./lib";

type VoteProps = {
  backFunc:  () => void;        // The function to back to the main UI
  name: string;                 // The name of the poll
};

type VoteState = {
  dataLoaded: boolean;          // Indicates the state of data loaded
  name?: string;                // The name of the poll
  minutes?: number;             // Voting duration
  options?: string[];           // Voting options
  createdAt?:Date;              // What date and time the poll was created

  selectedOption?:string;       // User selected voting option
  voter:string;                 // Voter's name
  msg: string | undefined;      // The message
}

export class Vote extends Component<VoteProps, VoteState> {
  constructor(props: VoteProps) {
    super(props);
    this.state = {dataLoaded:false, voter:"", msg:""};
  }

  componentDidMount = ():void => {
    this.doRefreshClick()
  }

  // Display the voting UI of a poll
  render = (): JSX.Element | JSX.Element[] => {
    if(this.state.dataLoaded){ // Data is loaded from the server
      if (this.state.createdAt === undefined) {
        return <>Corrupted data: Mission poll's creation time.</>
      }
      else if (this.state.minutes === undefined) {
        return <>Corrupted data: Mission poll's minutes.</>
      }
      else if (this.state.options === undefined) {
        return <>Corrupted data: Mission poll's options.</>
      }
      else {
        const end = addMinutesFunc(this.state.minutes, this.state.createdAt);
        const remainMinutes = diffTimeFunc(end, new Date());

        const retEles: JSX.Element[] = [];
        retEles.push(<h1 key="h1_vote">{this.state.name}</h1>);

        if (remainMinutes > 0) {  // Poll is active
          retEles.push(<p key="p_vote_active" >Closes in {Math.abs(remainMinutes).toFixed(2)} minutes</p>);
          for (const option of this.state.options) {
            retEles.push(<label key={"label_"+option} className="voteOption">
              <input type="radio"
                     name="option"
                     key={"radio_"+option}
                     value={option}
                     required
                     checked={this.state.selectedOption === option}
                     onChange={this.doOptionChange}/>{option}</label>);
          }

          retEles.push(<div key={"p_voter"}>
            <label htmlFor="voter">Voter Name:</label>
            <input type="text" id="voter" value={this.state.voter} required={true}
                   onChange={this.doVoterNameChange}></input>
          </div>);
        }
        else {  // Poll is closed
          retEles.push(<p key="p_vote_closed">Closed in {Math.abs(remainMinutes).toFixed(2)} minutes ago</p>);
        }

        retEles.push(<div key="div_btnarea_vote" className="buttonArea">
          <button type="button" key="btn_back" onClick={this.props.backFunc} className="button">Back</button>
          <button type="button" key="btn_refresh" onClick={this.doRefreshClick} className="button" >Refresh</button>
          <button type="submit" key="btn_vote" className="button">Vote</button>
        </div>);

        retEles.push(this.renderMessage());

        return <form onSubmit={this.doSubmitVoteClick} >{retEles}</form>;
      }
    }
    else {  // Loading data from the server
      return <div>Data loading...</div>
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
  /**
   * Even handler for changing the option.
   * @param evt The change event.
   */
  doOptionChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({selectedOption: evt.target.value});
  };

  /**
   * Even handler for changing the name of the voter.
   * @param evt the change event
   */
  doVoterNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({voter: evt.target.value});
  };

  /**
   * Even handler for submitting the vote form.
   * @param _evt The FormEvent
   */
  doSubmitVoteClick = (_evt: FormEvent): void => {
    _evt.preventDefault();

    // Let the backend do data integrity checks
    const payload = {
      name: this.state.name,
      option: this.state.selectedOption,
      voter: this.state.voter,
    }

    fetch("/api/vote",
      {method: "POST",
        body: JSON.stringify(payload),
        headers: {"Content-Type": "application/json"}})
      .then(this.doVoteResp)
      .catch(()=>this.doVoteError("failed to connect to server"));
  };

  // Called when the server responds to the vote request.
  doVoteResp = (res:Response):void => {
    if (res.status === 200) {
      res.json().then(this.doVoteJson)
        .catch(() => this.doVoteError("200 response is not valid JSON"));
    } else if (res.status === 400) {
      res.text().then((res:string)=>this.doVoteError(res))
        .catch(() => this.doVoteError("400 response is not text"));
    } else {
      this.doVoteError(`bad status code: ${res.status}`);
    }
  }

  // Called when the save file response JSON has been parsed.
  doVoteJson = (data: ServerResponse): void => {
    this.setState({msg: data.msg})
  };

  // Called if an error occurs trying to save file
  doVoteError = (msg: string): void => {
    this.setState({msg: `Error fetching /api/save: ${msg}`});
  };

  /**
   * Even handler for refreshing/loading the poll data
   */
  doRefreshClick = ():void =>{
    fetch("/api/load?name="+encodeURIComponent(this.props.name))
      .then(this.doRefreshResp)
      .catch(()=>this.doRefreshError("failed to connect to server"));
  }

  // Called when the server responds to the load request.
  doRefreshResp = (res:Response):void => {
    if (res.status === 200) {
      res.json().then(this.doRefreshJson)
        .catch(() => this.doRefreshError("200 response is not valid JSON"));
    } else if (res.status === 400) {
      res.text().then((res:string)=>this.doRefreshError(res))
        .catch(() => this.doRefreshError("400 response is not text"));
    } else {
      this.doRefreshError(`bad status code: ${res.status}`);
    }
  }

  // Called when the response JSON has been parsed.
  doRefreshJson = (data: Poll): void => {
    if (isRecord(data)) {
      this.setState({
        dataLoaded: true,
        name: data.name,
        minutes: data.minutes,
        options: data.options,
        createdAt: new Date(data.createAt),
      })
    }
    else {
      this.doRefreshError("Bad data. The returned data is not a json.");
    }
  };

  // Called if an error occurs trying to save file
  doRefreshError = (msg: string): void => {
    this.setState({msg: `Error fetching /api/save: ${msg}`});
  };
}
