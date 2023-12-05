import React, { Component } from "react";
import {addMinutesFunc, diffTimeFunc, VoteResult} from "./lib";



type VoteProps = {
  backFunc:  () => void;          // The function that back to the poll list
  name: string;                   // The name of the poll
};

type VoteState = {
  dataLoaded: boolean;            // Indicates the state of data loading
  name?: string;                  // Poll name
  minutes?: number;               // Voting duration
  options?: string[];             // Voting options
  createdAt?:Date;                // Poll's created date and time

  result?: Map<string, number>;   // The result data
  totalVotes?: number;            // How many votes
  msg?: string | undefined;       // The message
}

// Displays the results of a poll.
export class PollResult extends Component<VoteProps, VoteState> {
  constructor(props: VoteProps) {
    super(props);
    this.state = {dataLoaded:false};
  }

  /**
   * When a component is mounted
   */
  componentDidMount = ():void => {
    this.doRefreshClick()
  }

  // Render the UI of the voting results
  render = (): JSX.Element | JSX.Element[] => {
    if(!this.state.dataLoaded){  // Loading data from the server
      // In a commercial project, this can be an animation process
      return <div key={"div_data_loading"} >Data loading...</div>;
    }
    else {  // Data is loaded from the server
      const retEles: JSX.Element[] = [];
      if (this.state.minutes === undefined) {
        retEles.push(<p key={"p_corrupted_data"} >
          Corrupted data: Mission poll's minutes.</p>);
      }
      else if (this.state.options === undefined) {
        retEles.push(<p key={"p_corrupted_data"} >
          Corrupted data: Mission poll's options.</p>);
      }
      else if (this.state.createdAt === undefined) {
        retEles.push(<p key={"p_corrupted_data"} >
          Corrupted data: Mission poll's creation time.</p>);
      }
      else {
        const end = addMinutesFunc(this.state.minutes, this.state.createdAt);
        const remainMinutes = diffTimeFunc(end, new Date());

        retEles.push(<h1 key="h1_vote">{this.state.name}</h1>);

        if (remainMinutes > 0) {  // Poll is open
          retEles.push(<p key="p_vote_open" >Closes in {Math.abs(remainMinutes)
            .toFixed(2)} minutes</p>);
        }
        else {  // Poll is closed
          retEles.push(<p key="p_vote_closed">Closed {Math.abs(remainMinutes)
            .toFixed(2)} minutes ago</p>);
        }

        if (this.state.result!==undefined) {
          const list: JSX.Element[] = [];
          for (const [option, votes] of this.state.result) {
            if (this.state.totalVotes !== undefined
              && this.state.totalVotes !== 0) {
              list.push(<li key={`li_option_${encodeURIComponent(option)}`}>
                {Math.abs((votes / this.state.totalVotes) * 100)
                  .toFixed(0) }% - {option}</li>)
            }
            else {
              list.push(<li key={`li_option_${encodeURIComponent(option)}`}>
                0% - {option}</li>)
            }
          }
          retEles.push(<ul key={"ul_voting_options"} >{list}</ul>)
        }
        retEles.push(<p key={"p_total_votes"}>
          {`Total number of votes: ${this.state.totalVotes}`}</p>)
        retEles.push(<div key="div_btnarea_vote" className="buttonArea">
          <button type="button" key="btn_back" onClick={this.props.backFunc}
                  className="button">Back</button>
          <button type="button" key="btn_refresh" onClick={this.doRefreshClick}
                  className="button" >Refresh</button>
        </div>);
      }
      return retEles;
    }
  };

  /**
   * Event handler for loading the voting result from the server
   */
  doRefreshClick = ():void =>{
    fetch("/api/result?name="+encodeURIComponent(this.props.name))
      .then(this.doRefreshResp)
      .catch(()=>this.doRefreshError("failed to connect to server"));
  }

  // Called when the server responds to the request.
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

  // Called when the JSON has been parsed.
  doRefreshJson = (data: VoteResult): void => {
    this.setState({
      dataLoaded: true,
      name: data.poll.name,
      minutes: data.poll.minutes,
      options: data.poll.options,
      createdAt: new Date(data.poll.createAt),
      result: new Map<string, number>(data.result),
      totalVotes: data.totalVotes,
      msg: "",
    })
  };

  // Called if an error occurs trying to get the voting result
  doRefreshError = (msg: string): void => {
    this.setState({msg: `Error fetching /api/result: ${msg}`});
  };
}
