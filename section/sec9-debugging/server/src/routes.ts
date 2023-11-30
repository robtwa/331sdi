import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check


// Description of an individual item in the list.
type Item = {
  name: string,
  completedAt: number  // < 0 if not completed
};


// Map from item name to item. (Note that item names must be unique.)
const items: Map<string, Item> = new Map();


/**
 * Returns a list of all items that are uncompleted or were completed less than
 * 5 seconds ago.
 * @param _req the request
 * @param res the response
 */
export const listItems = (_req: SafeRequest, res: SafeResponse): void => {
  const now = Date.now();
  const remaining: {name: string, completed: boolean}[] = [];
  for (const item of items.values()) {
    if (item.completedAt < 0) {
      remaining.push({name: item.name, completed: false});
    } else if (now - item.completedAt <= 5000) {
      remaining.push({name: item.name, completed: true});
    } else {
      // skip this because it was completed too long ago
    }
  }
  res.send({items: remaining});
}


/**
 * Add the item to the list.
 * @param req the request
 * @param res the response
 */
export const addItem = (req: SafeRequest, res: SafeResponse):void => {
  const name = req.body.name;
  if (typeof name !== 'string') {
    res.status(400).send(`name is not a string: ${name}`);
    return;
  }

  // If the item does not already exist, then add it. Notify the client of
  // whether we had to add the item.
  const item = items.get(name);
  if (item === undefined) {
    items.set(name, {name, completedAt: -1});
    res.send({name, added: true});
  } else if (item.completedAt >= 0) {
    item.completedAt = -1;  // no longer removed
    res.send({name, added: true});
  } else {
    res.send({name, added: false});
  }
}


/**
 * Marks the given item as completed.
 * @param req the request
 * @param res the response
 */
export const completeItem = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (typeof name !== 'string') {
    res.status(400).send("name is not a string: ${name}");
    return;
  }

  const item = items.get(name);
  if (item === undefined) {
    res.status(400).send(`no item called "${name}"`);
    return;
  } else if (item.completedAt >= 0) {
    res.status(400).send(`item called "${name}" is already completed`);
    return;
  }

  item.completedAt = Date.now();
  res.send({completed: true});
}
