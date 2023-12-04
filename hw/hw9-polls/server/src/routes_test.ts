import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import {results, save, vote} from './routes';


describe('routes', function() {
  it('save', function() {
    // Branch 1
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

    // Branch 2
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

    // Branch 4
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

    // Branch 5
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

    // Branch 6
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

    // Branch 7
    payloadBad = {
      name: 'Lunch?',
      minutes: 0,
      options: "Dim Sum\nPizza",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payloadBad });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.strictEqual(res._getData(), 'The "minutes" parameter cannot less than 1.');

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
      minutes: 1,
      options: "Dim Sum\nPizza\nPha\nBurgers",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payload });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), {msg: `${payload.name} saved.`});
  });


  it('vote', function() {
    const payload = {
      name: 'What do I eat for dinner?',
      voter: "voter1",
      option: "Dim Sum",
    };
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payload });
    const res1 = httpMocks.createResponse();
    vote(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {msg: `Recorded vote of "${payload.name}" as "${payload.option}"`});
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
  });

});
