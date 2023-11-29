import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

// Storing all files with the map data structure
const files: Map<string, unknown> = new Map();

/**
 * Returns the saved square file name.
 * If the request does not specify a file name, a 400 error is returned and
 * contains error information.
 * If the file name specified in the request does not exist, a 400 error is
 * returned and contains error information.
 * If no square data is provided or the data is empty, a 400 error and related
 * error information will be returned.
 *
 * @param req The HTTP request object
 * @param res The HTTP response object
 */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const filename = first(req.body.filename);
  const data = req.body.data;

  // validation
  if (filename === undefined) {
    // http code: 400 -> bad request
    res.status(400).send('missing "filename" parameter');
    return;
  }
  else if (filename === "") {
    res.status(400).send('The "filename" parameter must be at least ' +
      'one character');
    return;
  }
  else if (data === undefined) {
    res.status(400).send('missing "data" parameter');
    return;
  }
  else if (data === null) {
    res.status(400).send('"data" cannot be null');
    return;
  }
  else {
    // Write to file ////////////////////////////////////////////////////
    // I do not do type checking of the data because the specs said:
    // "The lack of type information should not be a problem as it should not be
    // necessary to examine the contents of the file. We simply store it in
    // save, and return it in load."
    files.set(filename, data);  // add to files
    res.send({res: `${filename}`});
  }
};


/**
 * Returns a JSON String that is an array containing the names of all saved
 * files. If there are no saved files, an empty array is returned in JSON string
 * format.
 *
 * @param _ The HTTP request object
 * @param res The HTTP response object
 */
export const list = (_: SafeRequest, res: SafeResponse): void => {
  const data = Array.from(files.keys());
  res.send(JSON.stringify(data));
};

/**
 * Returns a JSON string containing the square data for the requested file.
 * If the request does not specify a file name, a 400 error is returned and
 * contains error information.
 * If the file name specified in the request does not exist, a 400 error is
 * returned and contains error information.
 *
 * @param req The HTTP request object
 * @param res The HTTP response object
 */
export const load = (req: SafeRequest, res: SafeResponse): void => {
  const filename = first(req.query.filename);
  if (filename === undefined) {
    res.status(400).send('missing "filename" parameter');
    return;
  }
  else if (!files.has(filename)) {
    res.status(400).send('There is no file with the given name.');
    return;
  }
  const data = files.get(filename);
  res.send(JSON.stringify(data));
};

/**
 * Delete a specified square file and return a file list that does not contain
 * the deleted file.
 * If the request does not specify a file name, a 400 error is returned and
 * contains error information.
 * If the file name specified in the request does not exist, a 400 error is
 * returned and contains error information.
 *
 * @param req The HTTP request object
 * @param res The HTTP response object
 */
export const remove = (req: SafeRequest, res: SafeResponse): void => {
  const filename = first(req.query.filename);
  if (filename === undefined) {
    res.status(400).send('missing "filename" parameter');
    return;
  }
  else if (!files.has(filename)) {
    res.status(400).send('There is no file with the given name');
    return;
  }

  files.delete(filename);  // delete file
  const data = Array.from(files.keys());  // generate a new file list
  res.send(JSON.stringify(data));  // send
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
 * Helper at the end of each test to call this function to delete any
 * all files saved.
 */
export const resetForTesting  = ():void => {
  files.clear();
}