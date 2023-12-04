import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";

// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

// Storing all polls with the map data structure
type pollName = string;
type poll = {
  name: string,
  minutes: number,
  options: string[],
  createAt: Date
};
const polls: Map<pollName, poll> = new Map();

// Storing all votes with the map data structure
type vote = {
  voter: string,
  option: string,
  createdAt: Date
};
type voters = Map<string, vote>;

const votes: Map<pollName, voters> = new Map();

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
    const createdAt = new Date();
    const vote: vote = {voter, option, createdAt};
    const voters = votes.get(name);
    if (voters !== undefined) {
      console.log(voters.size)
      voters.set(voter, vote);
      votes.set(name, voters)
    }
    else {
      const data:voters = new Map();
      data.set(voter, vote);
      votes.set(name, data)
    }
    console.log(votes)
    res.send({msg: `Recorded vote of "${name}" as "${option}"`});
  }
};

export const results = (req: SafeRequest, res: SafeResponse): void => {
  console.log(`result ///////////////////////////////////////`)
  const name:string | undefined = first(req.query.name);
  console.log("result: name = " + name);

  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
    return;
  }
  else {
    const poll:poll | undefined = polls.get(name);
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
    const voters = votes.get(name);
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

    console.log("result = ", result)

    res.send(JSON.stringify({poll, result: [...result], totalVotes}));


  }
};

/**
 * Create a new poll with the given list of options and closing in the given
 * number of minutes. Returns a unique ID for the poll.
 * @param req The request object
 * @param res The response object
 */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name?.toString();
  console.log("save: name = " + name);
  const minutes = parseInt(<string> req.body.minutes);
  const options = req.body.options?.toString().split("\n");

  // validation
  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
    return;
  }
  else if (name === null || name === "") {
    res.status(400).send('The "name" parameter cannot be empty.');
    return;
  }
  else if (minutes === undefined) {
    res.status(400).send('missing "minutes" parameter');
    return;
  }
  else if (minutes < 0) {
    res.status(400).send('The "minutes" parameter cannot less than 0.');
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
    res.status(400).send('The "options" parameter must contain 2 ' +
      'options');
    return;
  }
  else {
    // Add to polls
    polls.set(name, {name, minutes, options, createAt: new Date()});
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
  else if (!polls.has(name)) {
    res.status(400).send('There is no poll with the given name.');
    return;
  }
  const data = polls.get(name);
  res.send(JSON.stringify(data));
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
