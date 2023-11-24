import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

// files
const files: Map<string, object> = new Map();

/** Returns a list of all the named save files. */
export const list = (req: SafeRequest, res: SafeResponse): void => {
  console.log("list")
  console.log(req.query)

  const data = Array.from(files.keys());
  console.log(data)
  res.send(JSON.stringify(data));
};

export const load = (req: SafeRequest, res: SafeResponse): void => {
  console.log("load ////////////////// ")
  const name = first(req.query.name);
  console.log("name = " + name)

  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
    return;
  }
  const data = files.get(name);
  console.log("data = ", data)
  res.send(JSON.stringify(data));
};

export const deleteSq = (req: SafeRequest, res: SafeResponse): void => {
  console.log("deleteSq ////////////////// ")
  const name = first(req.query.name);
  console.log("name = " + name)

  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
    return;
  }

  files.delete(name);
  const data = Array.from(files.keys());
  console.log(data)
  res.send(JSON.stringify(data));
};

export const save = (req: SafeRequest, res: SafeResponse): void => {
  console.log("save //////////////////////////")
  const name = req.body?.name;
  const data = req.body?.data;
  console.log("data = ", data)

  // validation
  if (name === undefined) {
    // http code: 400 -> bad request
    res.status(400).send('missing "name" parameter');
    return;
  }
  if (name === "") {
    res.status(400).send('The "name" parameter must be at least one character');
    return;
  }
  else if (typeof name !== "string") {
    res.status(400).send('The "name" parameter must be a string');
    return;
  }
  else if (data === undefined || data === null) {
    res.status(400).send('missing "data" parameter');
    return;
  }
  else if (typeof name !== "string") {
    res.status(400).send('The "name" parameter must be a string');
    return;
  }
  else {
    // Write to file ////////////////////////////////////////////////////
    // I do not do type checking of the data because the specs said:
    // "The lack of type information should not be a problem as it should not be
    // necessary to examine the contents of the file. We simply store it in
    // save, and return it in load."
    files.set(name, data);  // add to files
    console.log("files = ", files)
    res.send({res: `${name}`});
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
