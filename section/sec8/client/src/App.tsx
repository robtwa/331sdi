import React, { Component } from "react";
import { isRecord } from "./record";
import './App.css';


// Arguments pass to create the app UI. (None currently.)
type AppProps = {};

// Data we need to store to draw the screen.
type AppState = {
  loading: boolean;  // we're getting the question from the server
  checking: boolean; // we're checking the answer

  // Question being shown. Invariant: either present or both missing
  text?: string;
  index?: number;

  // Text the user has typed into the answer box.
  answer?: string;

  // Whether the answer was correct.
  correct?: boolean;

  // Tell the user about something bad that happened.
  error?: string;
};


/** Displays the trivia UI. */
export class App extends Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);

    this.state = { loading: true, checking: false };
  }

  componentDidMount = (): void => {
    this.doNewQuestionClick();
  };

  // Display the UI described by the current state.
  render = (): JSX.Element => {
    return (<div>
      <h3>Animal Trivia</h3>
      <div>{this.renderQuestion()}</div>
      <div>{this.renderCorrectness()}</div>
      <div>{this.renderError()}</div>
    </div>);
  };

  // Returns the UI that shows whether the user's answer was correct (if they / have submitted any yet).
  renderCorrectness = (): JSX.Element => {
    if (this.state.checking) {
      return <p>Checking answer...</p>
    } else if (this.state.correct !== undefined) {
      if (this.state.correct) {
        return (<div>
          <p><b>Congratulations!</b> You are correct.</p>
          <div style={{ marginTop: '15px' }} >
            <button type="button" onClick={this.doNewQuestionClick}>New Question</button>
          </div>
        </div >);
      } else {
        return (<div>
          <p>Sorry, your answer was incorrect.</p> <div style={{ marginTop: '15px' }}>
            <button type="button" onClick={this.doNewQuestionClick}>New Question</button>
          </div></div>);
      }
    } else {
      return <span></span>; // show nothing
    }
  }

  // Returns the UI that shows the question and lets the user enter an asnwer.
  renderQuestion = (): JSX.Element => {
    if (this.state.loading) {
      return <p>Loading new question...</p>;
    } else if (this.state.text) {
      return (<div>
        <div>
          <label>Question</label>
          <span>{this.state.text}</span>
        </div>
        <div>
          <label htmlFor="answer">Answer</label>
          <input type="text" value={this.state.answer || ''}
            id="answer" onChange={this.doAnswerChange}></input>
        </div>
        <div style={{ marginTop: '15px' }}>
          <button type="button" onClick={this.doCheckAnswerClick}>Submit</button>
        </div>
      </div>);
    } else {
      return <div></div>;  // show nothing
    }
  };

  // Returns UI that shows an error message (if any).
  renderError = (): JSX.Element => {
    if (this.state.error) {
      return <p><b>Error:</b> {this.state.error}</p>;
    } else {
      return <span></span>;  // show nothing
    }
  };

  // Requests a new question from the server.
  doNewQuestionClick = (): void => {
    fetch("/api/new")
      .then(this.doNewQuestionResp)
      .catch(() => this.doNewQuestionError("failed to connect to server"));
  };

  // Called when the server responds with a new question.
  doNewQuestionResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doNewQuestionJson)
        .catch(() => this.doNewQuestionError("200 response is not valid JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doNewQuestionError)
        .catch(() => this.doNewQuestionError("400 response is not text"));
    } else {
      this.doNewQuestionError(`bad status code: ${res.status}`);
    }
  };

  // Called when the new question response JSON has been parsed.
  doNewQuestionJson = (val: unknown): void => {
    if (isRecord(val) && typeof val.text === 'string' &&
      typeof val.index === 'number') {
      this.setState({
        loading: false, text: val.text, index: val.index,
        error: undefined, answer: undefined, correct: undefined
      });
    } else {
      console.error('Invalid JSON from /api/new', val);
    }
  };

  // Called if an error occurs trying to get a new question.
  doNewQuestionError = (msg: string): void => {
    console.error(`Error fetching /api/new: ${msg}`);
  };

  // Called when the user changes the text in the answer box.
  doAnswerChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ answer: evt.target.value });
  };

  // Asks the server to check the answer.
  doCheckAnswerClick = (): void => {
    if (!this.state.answer)
      return;  // user hasn't typed an answer

    if (this.state.index === undefined)
      throw new Error('should be impossible');

    const url = "/api/check" +
      "?index=" + encodeURIComponent(this.state.index) +
      "&answer=" + encodeURIComponent(this.state.answer);
    fetch(url)
      .then(this.doCheckAnswerResp)
      .catch(() => this.doCheckAnswerError("failed to connect to server"));
  };

  // Called when the server responds with an answer check response.
  doCheckAnswerResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doCheckAnswerJson)
        .catch(() => this.doCheckAnswerError("200 response is not valid JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doCheckAnswerError)
        .catch(() => this.doCheckAnswerError("400 response is not text"));
    } else {
      this.doCheckAnswerError(`bad status code: ${res.status}`);
    }
  };

  // Called when the check answer JSON has been parsed
  doCheckAnswerJson = (val: unknown): void => {
    if (isRecord(val) && typeof val.correct === 'boolean') {
      this.setState({ checking: false, correct: val.correct, error: undefined });
    } else {
      console.error('Invalid JSON from /api/check', val);
    }
  };

  // Called if an error occurs trying to check correctness
  doCheckAnswerError = (msg: string): void => {
    console.error(`Error fetching /api/check: ${msg}`);
  };

}
