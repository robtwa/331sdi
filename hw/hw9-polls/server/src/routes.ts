import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";

// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

// Type for the name of the poll
type PollName = string;

// Type for the poll
type Poll = {
  name: string,
  minutes: number,
  options: string[],
  createAt: Date
};

// Type for the vote
type Vote = {
  voter: string,
  option: string,
  createdAt: Date
};

// Type for the voters
type Voters = Map<string, Vote>;

// Storing all polls with the map data structure
const polls: Map<PollName, Poll> = new Map();

// Storing all votes with the map data structure
const votes: Map<PollName, Voters> = new Map();

/**
 * Create a new poll with the given list of options and closing in the given
 * number of minutes. Returns a unique ID for the poll.
 * @param req The request object
 * @param res The response object
 */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name?.toString();
  const minutes:string|undefined = req.body.minutes?.toString();
  const options = processOptions(req.body.options?.toString());

  // validation
  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
    return;
  }
  else if (name === null || name === "") {
    res.status(400).send('The "name" parameter cannot be empty.');
    return;
  }
  else if (polls.has(recognizableStr(name))) {
    res.status(400).send('A poll with the same "name" already exists.');
    return;
  }
  else if (minutes === undefined) {
    res.status(400).send('missing "minutes" parameter');
    return;
  }
  else if (options === undefined) {
    res.status(400).send('missing "options" parameter');
    return;
  }
  else if (options === null) {
    res.status(400).send('The "options" parameter cannot be null');
    return;
  }
  else if (options.length < 2) {
    res.status(400).send('The "options" parameter must contain at ' +
      'least 2 different options');
    return;
  }
  else {
    if (parseInt(minutes) < 0) {
      res.status(400).send('The "minutes" parameter cannot less than 0.');
      return;
    }

    // Add to polls
    polls.set(name.trim().toLowerCase(),
              {name, minutes: parseInt(minutes), options, createAt: new Date()});
    res.send({msg: `${name} saved.`});
  }
};

/**
 * Sends a http response containing the names of all saved polls in JSON string
 * format. If there are no saved polls, send an empty array in JSON string
 * format.
 * @param _ The HTTP request object
 * @param res The HTTP response object
 */
export const list = (_: SafeRequest, res: SafeResponse): void => {
  const data = Array.from(polls.values());
  res.send(JSON.stringify(data));
};

/**
 * Sends a http response with the data of the requested square file a JSON
 * string containing.
 * If the request does not specify a filename, send a 400 error with a short
 * error information.
 * If the request file does not exist, send a 400 error with a short error
 * information.
 * @param req The HTTP request object
 * @param res The HTTP response object
 */
export const load = (req: SafeRequest, res: SafeResponse): void => {
  const name:string | undefined = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
    return;
  }
  else {
    const nameClean = recognizableStr(name);
    if (!polls.has(nameClean)) {
      res.status(400).send('There is no poll with the given name.');
      return;
    }
    const data = polls.get(nameClean);
    res.send(JSON.stringify(data));
  }
};

/**
 * Save a vote sent by a client.
 * @param req
 * @param res
 */
export const vote = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name?.toString();
  const voter = req.body.voter?.toString();
  const option = req.body.option?.toString();

  // validation
  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
    return;
  }
  else if (name === null || name === "") {
    res.status(400).send('The "name" parameter cannot be empty.');
    return;
  }
  else if (voter === undefined) {
    res.status(400).send('missing "voter" parameter');
    return;
  }
  else if (voter === null || voter === "") {
    res.status(400).send('The "voter" parameter cannot be empty.');
    return;
  }
  else if (option === undefined) {
    res.status(400).send('missing "option" parameter');
    return;
  }
  else if (option === null) {
    res.status(400).send('The "option" parameter cannot be null');
    return;
  }
  else {
    // Todo: Check if the poll has closed
    const nameClean = recognizableStr(name);
    const createdAt = new Date();
    const vote: Vote = {voter, option, createdAt};
    const voters = votes.get(nameClean);
    if (voters !== undefined) {
      console.log(voters.size)
      voters.set(voter, vote);
      votes.set(nameClean, voters)
    }
    else {
      const data:Voters = new Map();
      data.set(voter, vote);
      votes.set(nameClean, data)
    }
    res.send({msg: `Recorded vote of "${voter}" as "${option}"`});
  }
};
/**
 * Sends a http response containing the results of the saved results of a poll
 * in JSON string format. If there are no saved result, send an empty array in
 * JSON string format.
 *
 * @param req
 * @param res
 */
export const results = (req: SafeRequest, res: SafeResponse): void => {
  const name:string | undefined = first(req.query.name);

  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
    return;
  }
  else {
    const nameClean = recognizableStr(name);
    const poll:Poll | undefined = polls.get(nameClean);
    let totalVotes:number = 0;
    if (poll === undefined) {
      res.status(400).send('There is no poll with the given name.');
      return;
    }

    // Init the map of the voting result
    const result:Map<string, number> = new Map();
    for (const option of poll.options) {
      result.set(option, 0);
    }
    console.log("result = ", result)

    // Compute the voting result
    const voters = votes.get(nameClean);
    if (voters !== undefined) {
      console.log(voters.size)
      for (const [_, vote] of voters) {
        console.log("vote.option = " + vote.option)
        const count = result.get(vote.option);
        console.log("count = " + count)
        if (count !== undefined) {
          result.set(vote.option, count + 1);
        }

        totalVotes = totalVotes + 1;
      }
    }

    res.send(JSON.stringify({poll, result: Array.from(result), totalVotes}));
  }
};


// Helper functions ***********************************************************

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};

/**
 * Returns a trimmed string in lowercase.
 * @param str The input string.
 */
const recognizableStr = (str: string):string =>{
  return str.trim().toLowerCase();
}

/**
 * Processing the polling options to avoid duplicates due to case differences
 * @param options The polling options in string or undefined.
 */
const processOptions = (options:string|undefined):string[]|undefined =>{
  if (options === undefined) {
    return undefined;
  }

  const om:Map<string, string> = new Map();
  for (const option of options.split("\n")) {
    om.set(recognizableStr(option), option);
  }

  return Array.from(om.values());
}
