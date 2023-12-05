import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import {list, resetForTesting, results, save, vote, Poll} from './routes';


describe('routes', function() {
  it('save', function() {
    // Branch 1: 'missing "name" parameter'
    let payloadBad:object = {
      minute: 10,
      options: "Dim Sum\nPizza\nPha",
    };
    let req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payloadBad });
    let res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'missing "name" parameter');

    // Branch 2: 'The "name" parameter cannot be empty.'
    payloadBad = {
      name: "",
      minute: 10,
      options: "Dim Sum\nPizza\nPha",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payloadBad });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'The "name" parameter cannot be empty.');

    // Successfully save a poll
    let payload = {
      name: 'What do I eat for dinner?',
      minutes: 10,
      options: "Dim Sum\nPizza\nPha",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payload });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), {msg: `${payload.name} saved.`});

    // Branch 3 - A poll with the same "name" already exists.
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payload });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'A poll with the same "name" already exists.');

    // Branch 4: 'missing "minutes" parameter'
    payloadBad = {
      name: "Lunch",
      options: "Dim Sum\nPizza\nPha",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payloadBad });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'missing "minutes" parameter');

    // Branch 5: 'missing "options" parameter'
    payloadBad = {
      name: "Lunch",
      minutes: 10,
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payloadBad });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'missing "options" parameter');

    // Branch 6: 'The "options" parameter must contain at least 2 different options'
    payloadBad = {
      name: 'Lunch?',
      minutes: 10,
      options: "Dim Sum\nDim Sum\nDiM SuM",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payloadBad });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.strictEqual(res._getData(), 'The "options" parameter must ' +
      'contain at least 2 different options');

    // Branch 7: 'The "minutes" parameter cannot less than 0.'
    payloadBad = {
      name: 'Lunch?',
      minutes: -1,
      options: "Dim Sum\nPizza",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payloadBad });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.strictEqual(res._getData(), 'The "minutes" parameter cannot less than 0.');

    // Branch 8
    payloadBad = {
      name: 'Lunch?',
      minutes: 60 * 24 * 365 + 1,
      options: "Dim Sum\nPizza",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payloadBad });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.strictEqual(res._getData(), `The "minutes" parameter cannot greater than ${60 * 24 * 365}.`);

    // branch 9 - 1st
    payload = {
      name: 'What do I eat for lunch?',
      minutes: 60 * 24 * 365,
      options: "Dim Sum\nPizza\nPha",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payload });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), {msg: `${payload.name} saved.`});

    // branch 9 - 2nd
    payload = {
      name: 'What do I eat for breakfast?',
      minutes: 0,
      options: "Dim Sum\nPizza\nPha\nBurgers",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payload });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), {msg: `${payload.name} saved.`});

    // Delete all saved polls and votes.
    resetForTesting();
  });

  it('list', function() {
    // Gets an empty list of saved polls ///////////////////////////////////////
    let req = httpMocks.createRequest(
      {method: 'GET', url: '/api/list'});
    let res = httpMocks.createResponse();
    list(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), []);

    // Get a nonempty list of saved polls: 1st /////////////////////////////////
    // 1. Save a new poll
    const payload = {
      name: 'What do I eat for dinner?',
      minutes: 10,
      options: "Dim Sum\nPizza\nPha",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payload });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), {msg: `${payload.name} saved.`});

    // 2. Get the list
    req = httpMocks.createRequest(
      {method: 'GET', url: '/api/list'});
    res = httpMocks.createResponse();
    list(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    let data:Poll[] = res._getData();
    assert.strictEqual(data.length, 1);
    assert.strictEqual(data[0].name, payload.name);
    assert.strictEqual(data[0].minutes, payload.minutes);
    assert.deepStrictEqual(data[0].options, ['Dim Sum', 'Pizza', 'Pha']);
    assert.deepStrictEqual(data[0].createAt instanceof Date, true);

    // Get a nonempty list of saved polls: 2nd /////////////////////////////////
    // 1. Save a new poll
    const payload2 = {
      name: 'What do I eat for lunch?',
      minutes: 10,
      options: "Noddles\nBurgers",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payload2 });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), {msg: `${payload2.name} saved.`});

    // 2. Get the list
    req = httpMocks.createRequest(
      {method: 'GET', url: '/api/list'});
    res = httpMocks.createResponse();
    list(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    data = res._getData();
    assert.strictEqual(data.length, 2);
    assert.strictEqual(data[1].name, payload2.name);
    assert.strictEqual(data[1].minutes, payload2.minutes);
    assert.deepStrictEqual(data[1].options, ['Noddles', 'Burgers']);
    assert.deepStrictEqual(data[1].createAt instanceof Date, true);

    // Delete all saved polls and votes.
    resetForTesting();
  });

  it('vote', function() {
    // Branch 1: missing "name" parameter
    let payloadBad:object = {
        voter: "voter1",
        option: "Dim Sum",
    };
    let req = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payloadBad });
    let res = httpMocks.createResponse();
    vote(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'missing "name" parameter');

    // Branch 2: The "name" parameter cannot be empty.
    payloadBad = {
      name: "",
      voter: "voter1",
      option: "Dim Sum",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payloadBad });
    res = httpMocks.createResponse();
    vote(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'The "name" parameter cannot be empty.');

    // Branch 3: missing "option" parameter
    payloadBad = {
      name: "lunch",
      voter: "voter1",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payloadBad });
    res = httpMocks.createResponse();
    vote(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'missing "option" parameter');

    // Branch 4: 'The "option" parameter cannot be empty'
    payloadBad = {
      name: "lunch",
      voter: "voter1",
      option: "",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payloadBad });
    res = httpMocks.createResponse();
    vote(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'The "option" parameter cannot be empty');

    // Branch 5: 'missing "voter" parameter'
    payloadBad = {
      name: "lunch",
      option: "Dim Sum",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payloadBad });
    res = httpMocks.createResponse();
    vote(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'missing "voter" parameter');

    // Branch 6: 'The "voter" parameter cannot be empty.'
    payloadBad = {
      name: "lunch",
      option: "Dim Sum",
      voter: "",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payloadBad });
    res = httpMocks.createResponse();
    vote(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'The "voter" parameter cannot be empty.');


    // Create a poll first ////////////////////////////////////////////////////
    let payloadPoll = {
      name: 'dinner',
      minutes: 0,
      options: "Dim Sum\nPizza\nBurgers\nPho",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payloadPoll });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepEqual(res._getData(), {msg: `${payloadPoll.name} saved.`});

    // Branch 7: 'There is no poll with the given name'
    payloadBad = {
      name: "lunch",
      option: "Dim Sum",
      voter: "voter1",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payloadBad });
    res = httpMocks.createResponse();
    vote(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'There is no poll with the given name');


    // Branch 8: 'Voting closed.'
    let payload = {
      name: 'dinner',
      voter: "voter1",
      option: "Dim Sum",
    };
    let req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payload });
    let res1 = httpMocks.createResponse();
    vote(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), "Voting closed.");

    // Create another poll ////////////////////////////////////////////////////
    payloadPoll = {
      name: 'What do I eat for lunch?',
      minutes: 10,
      options: "Dim Sum\nPizza\nBurgers\nPho",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payloadPoll });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepEqual(res._getData(), {msg: `${payloadPoll.name} saved.`});

    // Branch 9: 'Invalid voting option'
    payload = {
      name: 'What do I eat for lunch?',
      voter: "voter1",
      option: "Steak",
    };
    req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payload });
    res1 = httpMocks.createResponse();
    vote(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), "Invalid voting option");

    // Branch 10: 1st valid vote
    payload = {
      name: 'What do I eat for lunch?',
      voter: "voter1",
      option: "Dim Sum",
    };
    req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payload });
    res1 = httpMocks.createResponse();
    vote(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(),
      {msg: `Recorded vote of "${payload.voter}" as "${payload.option}"`});

    // Branch 10: 2nd valid vote
    payload = {
      name: 'What do I eat for lunch?',
      voter: "voter2",
      option: "Pizza",
    };
    req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payload });
    res1 = httpMocks.createResponse();
    vote(req1, res1);
    console.log(res1._getData())
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(),
      {msg: `Recorded vote of "${payload.voter}" as "${payload.option}"`});


    // Delete all saved polls and votes.
    resetForTesting();
  });

  it('result', function() {
    // create a poll
    const payload = {
      name: 'What do I eat for dinner?',
      minute: 10,
      options: "Dim Sum\nPizza\nPha",
    };
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: payload });
    const res1 = httpMocks.createResponse();
    save(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {msg: `${payload.name} saved.`});

    // Make a vote
    const payload2 = {
      name: payload.name,
      voter: "voter1",
      option: "Dim Sum",
    };
    let req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payload2 });
    let res2 = httpMocks.createResponse();
    vote(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(), {msg: `Recorded vote of "${payload2.name}" as "${payload2.option}"`});

    // Get the voting result
    const req3 = httpMocks.createRequest(
      {method: 'GET', url: `/api/vote?name=${encodeURIComponent(payload.name)}` });
    const res3 = httpMocks.createResponse();
    results(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 200);
    //assert.deepStrictEqual(res3._getData(), {msg: `Recorded vote of "${payload.name}" as "${payload.option}"`});

    // Delete all saved polls and votes.
    resetForTesting();
  });

});
