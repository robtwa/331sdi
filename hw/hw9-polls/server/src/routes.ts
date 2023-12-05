import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";

// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

// Type for the name of the poll
type PollName = string;

// Type for the poll
export type Poll = {
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

// Type for the voting result
export type VotingResults = {
  poll: Poll,
  result: Array<[string, number]>,
  totalVotes: number
}

// Storing all polls with the map data structure
const polls: Map<PollName, Poll> = new Map();

// Storing all votes with the map data structure
const votes: Map<PollName, Voters> = new Map();

/**
 * Save a new poll and send the corresponding http response based on the saved
 * state.
 * @param req The request object
 * @param res The response object
 */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.body.name) ;
  const minutes:string|undefined = req.body.minutes?.toString();
  const options = processOptions(req.body.options?.toString());

  // validation
  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
    return;
  }
  else if (name === "") {
    res.status(400).send('The "name" parameter cannot be empty.');
    return;
  }
  else if (polls.has(cleanString(name))) {
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

    if (parseInt(minutes) > 60 * 24 * 365) {
      res.status(400).send(`The "minutes" parameter cannot greater than ${60 * 24 * 365}.`);
      return;
    }

    // Save to the map of the polls
    polls.set(cleanString(name),
              {name, minutes: parseInt(minutes), options, createAt: new Date()});
    res.send({msg: `${name} saved.`});
  }
};

/**
 * Returns a list of all saved polls by sending a http response.
 * @param _
 * @param res The response object
 */
export const list = (_: SafeRequest, res: SafeResponse): void => {
  const data = Array.from(polls.values());
  res.send(data);
};

/**
 * Returns the data of the requested poll by sending a http response.
 * @param req The HTTP request object
 * @param res The HTTP response object
 */
export const load = (req: SafeRequest, res: SafeResponse): void => {
  const name:string | undefined = first(req.query.name);  // The poll name
  // Check if poll name is undefined.
  if (name === undefined) {  // If the poll name is undefined
    res.status(400).send('missing "name" parameter');
    return;
  }
  else {  // If the poll name is not undefined
    const nameClean = cleanString(name); // Clean the poll name
    // Check whether there is a poll with this name in the saved polls
    if (!polls.has(nameClean)) {  // If there is not
      res.status(400).send('There is no poll with the given name.');
      return;
    }

    // If there is a poll with the requested name
    const data = polls.get(nameClean);  // Get the poll's data
    res.send(data);  // Return the poll data by sending a http response.
  }
};

/**
 * Save a vote and send the corresponding http response based on the saved
 * state.
 * @param req
 * @param res
 */
export const vote = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.body.name);
  const voter = req.body.voter?.toString();
  const option = req.body.option?.toString();
  const createdAt = new Date();

  // validation
  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
    return;
  }
  else if (name === "") {
    res.status(400).send('The "name" parameter cannot be empty.');
    return;
  }
  else if (option === undefined) {
    res.status(400).send('missing "option" parameter');
    return;
  }
  else if (option === "") {
    res.status(400).send('The "option" parameter cannot be empty');
    return;
  }
  else if (voter === undefined) {
    res.status(400).send('missing "voter" parameter');
    return;
  }
  else if (voter === "") {
    res.status(400).send('The "voter" parameter cannot be empty.');
    return;
  }
  else {
    // Checks if a poll with the given name exists
    const nameClean = cleanString(name);  // Convert to a clean name
    const poll = polls.get(nameClean);
    if (poll === undefined) {
      res.status(400).send('There is no poll with the given name');
      return;
    }

    // Checks if the poll has been closed based on the time received by the
    // server
    const endDate = addMinutesFunc(poll.minutes, poll.createAt);
    const remainTime = diffTimeFunc(endDate, createdAt);
    if (remainTime <= 0) {  //  If voting closed
      res.status(400).send('Voting closed.');
      return;
    }

    // Make a map of the poll's voting options used for validation.
    const optionsMap = new Map();
    for (const key of poll.options) {
      optionsMap.set(cleanString(key), key);
    }
    // Check if the voted option is valid
    if (!optionsMap.has(cleanString(option))) {  // Invalid voting option
      res.status(400).send('Invalid voting option');
      return;
    }

    const vote: Vote = {voter, option, createdAt};  // Make a voting data
    // Get saved voter records
    const voters = votes.get(nameClean);
    if (voters === undefined)  {  // If there is no saved voter records
      const data:Voters = new Map();  // Create the data of voters
      data.set(voter, vote);  // Write the vote record
      votes.set(nameClean, data); // Write the voters data
    }
    else {  // If there are saved voter records
      voters.set(voter, vote); // Write the vote record
      votes.set(nameClean, voters)  // Write the voters data
    }


    // Send the http response
    res.send({msg: `Recorded vote of "${voter}" as "${option}"`});
  }
};

/**
 * Returns a list of all saved votes by sending a http response.
 *
 * @param req
 * @param res
 */
export const results = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);

  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
    return;
  }
  else {
    const nameClean = cleanString(name);
    const poll:Poll | undefined = polls.get(nameClean);
    let totalVotes:number = 0;
    if (poll === undefined) {
      res.status(400).send('There is no poll with the given name.');
      return;
    }

    // Init the map of the voting result
    const result:Map<string, number> = new Map();
    for (const option of poll.options) {
      result.set(cleanString(option), 0);
    }

    // Compute the voting result
    const voters = votes.get(nameClean);
    if (voters !== undefined) {
      for (const [_, vote] of voters) {
        const cleanOption = cleanString(vote.option);
        const count = result.get(cleanOption);
        if (count !== undefined) {
          result.set(cleanOption, count + 1);
        }

        totalVotes = totalVotes + 1;
      }
    }

    const data:VotingResults = {poll, result: Array.from(result), totalVotes};
    res.send(data);
  }  // end if
};

// Helper functions ***********************************************************


/**
 * Helper to return the (first) value of the parameter if any was given. (This
 * is mildly annoying because the client can also give mutiple values, in which
 * case, express puts them into an array.)
 * @param param
 */
export const first = (param: unknown): string|undefined => {
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
export const cleanString = (str: string):string =>{
  return str.trim().toLowerCase();
};

/**
 * Processing the polling options to avoid duplicates due to case differences
 * @param options The polling options in string or undefined.
 */
export const processOptions = (options:string|undefined): string[] | undefined =>{
  if (options === undefined) {
    return undefined;
  }

  const om:Map<string, string> = new Map();
  for (const option of options.trim().split("\n")) {
    om.set(cleanString(option), option);
  }

  return Array.from(om.values());
};

/**
 * Return the minute difference between two dates
 * @param src The source date for comparing
 * @param tar the target date for comparing
 */
export const diffTimeFunc = (src: Date, tar: Date):number =>{
  return (src.getTime() - tar.getTime()) / 1000 / 60
}
/**
 * Add minutes to a Date
 * @param minutes The minutes in number
 * @param date The target date to add minutes
 */
export const addMinutesFunc = (minutes: number, date: Date, ): Date => {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
}


/**
   * Helper that at the end of each test to call this function to delete all
   * saved polls.
   */
  export const resetForTesting = ():void => {
    polls.clear();
    votes.clear();
  }