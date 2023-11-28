import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { len, at } from './list';
import { TRIVIA } from './trivia';


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check


/** Returns a new trivia question for the user. */
export const newQuestion = (_: SafeRequest, res: SafeResponse): void => {
  const index = Math.floor(Math.random() * len(TRIVIA));
  const qna = at(index, TRIVIA);
  res.send({index: index, text: qna.question});
};

/** Tells the user whether their answer was correct. */
export const checkAnswer = (req: SafeRequest, res: SafeResponse): void => {
  const answer = first(req.query.answer);
  if (answer === undefined) {
    res.status(500).send('missing "answer" parameter');
    return;
  }

  const indexStr = first(req.query.index);
  if (indexStr === undefined) {
    res.status(500).send('missing "index" parameter');
    return;
  }

  const index = parseInt(indexStr);
  if (isNaN(index) || index < 0 || len(TRIVIA) <= index) {
    res.status(500).send('invalid "index" parameter');
    return;
  }

  const qna = at(index, TRIVIA);
  const correct = qna.answer === answer.toLowerCase();
  res.send({correct: correct});
};


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param) && param.length > 0) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
