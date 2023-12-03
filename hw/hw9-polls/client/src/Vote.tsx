import React, { Component } from "react";
import { isRecord } from './record';
import {addMinutesFunc, diffTimeFunc, poll} from "./lib";

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
  msg?: string | undefined;
}

export class Vote extends Component<VoteProps, VoteState> {
  constructor(props: VoteProps) {
    super(props);
    this.state = {dataLoaded:false};
  }

  componentDidMount() {
    console.log("Vote")
    this.doRefreshClick()
  }

  // New Poll /////////////////////////////////////////////////////////////////
  render = (): JSX.Element | JSX.Element[] => {
    console.log(this.state)
    if(this.state.dataLoaded){ // Data is loaded from the server

      if (this.state.createdAt === undefined) {
        return <>Corrupted data: Mission poll's creation time.</>
      }
      else if (this.state.minutes === undefined) {
        return <>Corrupted data: Mission poll's minutes.</>
      }
      else if (this.state.minutes === undefined) {
        return <>Corrupted data: Mission poll's minutes.</>
      }
      else {
        const end = addMinutesFunc(this.state.minutes, this.state.createdAt);
        const remainMinutes = diffTimeFunc(end, new Date());

        const retEles: JSX.Element[] = [];
        if (remainMinutes > 0) {  // Poll is active
          retEles.push(<div>
            <h1>{this.state.name}</h1>
            <p>Closes in {Math.abs(remainMinutes).toFixed(2)} minutes</p>
          </div>);
        }
        else {  // Poll is closed
          retEles.push(<div>
            <h1>{this.state.name}</h1>
            <p>Closed in {Math.abs(remainMinutes).toFixed(2)} minutes</p>
          </div>);
        }

        retEles.push(<div className="buttonArea">
          <button type="button" onClick={this.props.backFunc} className="button">Back</button>
          <button type="button" onClick={this.doRefreshClick} className="button" >Refresh</button>
          <button type="button" onClick={this.props.backFunc} className="button">Vote</button>
        </div>);
        return retEles;
      }
    }
    else {  // Loading data from the server
      return <div>Data loading...</div>
    }

  };



  // doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
  //   this.setState({name: evt.target.value});
  // };
  //
  // doMinutesChange = (evt: ChangeEvent<HTMLInputElement>): void => {
  //   this.setState({minutes: parseInt(evt.target.value)});
  // };
  //
  // doOptionsChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
  //   this.setState({options: evt.target.value});
  // };
  //
  // doNewPollSubmit = (_evt: FormEvent): void => {
  //   _evt.preventDefault();
  //   console.log("doNewPollSubmit")
  //
  // };
  //


  // Send a request to the server to loads the poll data
  doRefreshClick = ():void =>{
    fetch("/api/load?name="+this.props.name)
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
  doRefreshJson = (data: poll): void => {
    if (isRecord(data)) {
      console.log("data = ", data)
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
    console.error(`Error fetching /api/save: ${msg}`);
  };


}