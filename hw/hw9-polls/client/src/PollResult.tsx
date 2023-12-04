import React, { Component } from "react";
import {addMinutesFunc, diffTimeFunc, voteResult} from "./lib";



type VoteProps = {
  backFunc:  () => void;
  name: string;             // The name of the poll
};

type VoteState = {
  dataLoaded: boolean;          // Indicates the state of data loading
  name?: string;                // Poll name
  minutes?: number;             // Voting duration
  options?: string[];             // Voting options
  createdAt?:Date;             // Poll's created date and time

  result?: Map<string, number>;
  totalVotes?: number;
  msg?: string | undefined;
}

export class PollResult extends Component<VoteProps, VoteState> {
  constructor(props: VoteProps) {
    super(props);
    this.state = {dataLoaded:false};
  }

  componentDidMount() {
    console.log("PollResult ///////////////////////////////////")
    this.doRefreshClick()
  }

  // New Poll /////////////////////////////////////////////////////////////////
  render = (): JSX.Element | JSX.Element[] => {
    console.log(this.state)
    if(!this.state.dataLoaded){  // Loading data from the server
      // In a commercial project, this can be an animation process
      return <div>Data loading...</div>;
    }
    else {  // Data is loaded from the server
      const retEles: JSX.Element[] = [];
      if (this.state.createdAt === undefined) {
        retEles.push(<>Corrupted data: Mission poll's creation time.</>);
      }
      else if (this.state.minutes === undefined) {
        retEles.push(<>Corrupted data: Mission poll's minutes.</>);
      }
      else if (this.state.options === undefined) {
        retEles.push(<>Corrupted data: Mission poll's options.</>);
      }
      else {
        const end = addMinutesFunc(this.state.minutes, this.state.createdAt);
        const remainMinutes = diffTimeFunc(end, new Date());


        retEles.push(<h1 key="h1_vote">{this.state.name}</h1>);

        if (remainMinutes > 0) {  // Poll is active
          retEles.push(<p key="p_vote_active" >Closes in {Math.abs(remainMinutes).toFixed(2)} minutes</p>);
        }
        else {  // Poll is closed
          retEles.push(<p key="p_vote_closed">Closed {Math.abs(remainMinutes).toFixed(2)} minutes ago</p>);
        }

        if (this.state.result!==undefined) {
          const list: JSX.Element[] = [];
          for (const [option, votes] of this.state.result) {
            if (this.state.totalVotes !== undefined && this.state.totalVotes !== 0) {
              list.push(<li>{Math.abs((votes / this.state.totalVotes) * 100).toFixed(0) }% - {option}</li>)
            }
            else {
              list.push(<li>0 - {option}</li>)
            }
          }
          retEles.push(<ul>{list}</ul>)
        }

        retEles.push(<p>{`Total number of voters: ${this.state.totalVotes}`}</p>)



        retEles.push(<div key="div_btnarea_vote" className="buttonArea">
          <button type="button" key="btn_back" onClick={this.props.backFunc} className="button">Back</button>
          <button type="button" key="btn_refresh" onClick={this.doRefreshClick} className="button" >Refresh</button>
        </div>);

      }
      return retEles;
    }

  };

  // Refresh //////////////////////////////////////////////////////////////////
  // Send a request to the server to loads the poll data
  doRefreshClick = ():void =>{
    fetch("/api/result?name="+encodeURIComponent(this.props.name))
      .then(this.doRefreshResp)
      .catch(()=>this.doRefreshError("failed to connect to server"));
  }

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

  // Called when the save file response JSON has been parsed.
  doRefreshJson = (data: voteResult): void => {
    console.log("data = ", data)
    this.setState({
      dataLoaded: true,
      name: data.poll.name,
      minutes: data.poll.minutes,
      options: data.poll.options,
      createdAt: new Date(data.poll.createAt),
      result: new Map<string, number>(data.result),
      totalVotes: data.totalVotes
    })
  };

  // Called if an error occurs trying to save file
  doRefreshError = (msg: string): void => {
    console.error(`Error fetching /api/save: ${msg}`);
  };


}