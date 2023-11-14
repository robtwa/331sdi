import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { splitWords, joinWords } from './words';
import { PATTERNS } from "./patterns";
import { chatResponse } from "./chatbot";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check


// Keep track of the most recently used response for each pattern.
const lastUsed: Map<string, number> = new Map<string, number>();

// Keep track of possible responses for when we run out of things to say.
const memory: string[][] = [];

// (6a): declare a Map to record transcripts
const transcripts: Map<string, unknown> = new Map<string, unknown>();

/**
 * Handles request for /chat, with a message included as a query parameter,
 * by getting the next chat response.
 */
export const chat = (req: SafeRequest, res: SafeResponse): void => {
  const msg = first(req.query.message);
  if (msg === undefined) {
    res.status(400).send('required argument "message" was missing');
    return;
  }

  const words = splitWords(msg);
  const result = chatResponse(words, lastUsed, memory, PATTERNS);
  res.send({response: joinWords(result)});
}

/** Handles request for /save by storing the given transcript. */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  const value = req.body.value;
  if (value === undefined) {
    res.status(400).send('required argument "value" was missing');
    return;
  }

  // (6a): implement this part
  //  - store the passed in value in the map under the given name
  //  - return a record indicating whether that replaced an existing transcript
  const replaced:boolean = transcripts.has(name);
  transcripts.set(name, value);
  res.send({replaced: replaced});  // (6a): replace
}

/** Handles request for /load by returning the transcript requested. */
export const load = (req: SafeRequest, res: SafeResponse): void => {
  // (6b): implement this function
  const name = first(req.query.name);
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  if (transcripts.has(name)) {
    res.send({
      name: name,
      value: transcripts.get(name)});
  }
  else {
    res.status(400).send('The queried transcript does not exist');
  }

}


/** Used in tests to set the transcripts map back to empty. */
export const resetTranscriptsForTesting = (): void => {
  // (6a): remove all saved transcripts from the map
  transcripts.clear();
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
}
