import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import {results, save, vote} from './routes';


describe('routes', function() {
  it('save', function() {

    // Additional test 1
    let payload = {
      name: 'What do I eat for dinner?',
      minute: 10,
      options: "Dim Sum\nPizza\nPha",
    };
    let req = httpMocks.createRequest(
        {method: 'POST', url: '/api/save',
          body: payload });
    let res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), {msg: `${payload.name} saved.`});

    // Additional test 2
    payload = {
      name: 'Lunch?',
      minute: 10,
      options: "Dim Sum\nDim Sum\nDiM SuM",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payload });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.strictEqual(res._getData(), 'The "options" parameter must ' +
      'contain at least 2 different options');

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
    console.log(res1._getData())
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
    const data = JSON.parse(res3._getData());
    console.log("data = ", data)
    assert.strictEqual(res3._getStatusCode(), 200);
    const result = new Map(data.result);
    console.log("result = ", result)

    // assert.deepStrictEqual(res3._getData(), {msg: `Recorded vote of "${payload.name}" as "${payload.option}"`});
  });

});
