import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check


type poll = {name: string, minutes: number, options: string[], createAt: Date};
// Storing all polls with the map data structure
const files: Map<string, poll> = new Map();

/**
 * Create a new poll with the given list of options and closing in the given
 * number of minutes. Returns a unique ID for the poll.
 * @param req The request object
 * @param res The response object
 */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name?.toString();
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
    files.set(name, {name, minutes, options, createAt: new Date()});
    res.send({res: `${name}`});
  }
};

/**
 * Sends a http response containing the names of all saved files in JSON string
 * format. If there are no saved files, send an empty array in JSON string
 * format.
 * @param _ The HTTP request object
 * @param res The HTTP response object
 */
export const list = (_: SafeRequest, res: SafeResponse): void => {
  const data = Array.from(files.values());
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
  else if (!files.has(name)) {
    res.status(400).send('There is no poll with the given name.');
    return;
  }
  const data = files.get(name);
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
