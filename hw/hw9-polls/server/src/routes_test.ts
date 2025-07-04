import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import {
  list,
  resetForTesting,
  results,
  save,
  vote,
  Poll,
  VotingResults,
  load,
  addMinutesFunc,
  diffTimeFunc, first, cleanString, processOptions,

} from './routes';


describe('routes', function() {
  it('save', function() {
    // Delete all saved polls and votes.
    resetForTesting();

    // Separate domain for each branch:

    // Branch 1: 'missing "name" parameter'
    let payloadBad = {
      minutes: 10,
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
    let payloadBad2 = {
      name: "",
      minutes: 10,
      options: "Dim Sum\nPizza\nPha",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payloadBad2 });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'The "name" parameter cannot be empty.');

    // Successfully save a poll first
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
    let payloadBad9 = {
      name: 'wHat do I eat for dInNeR?',
      minutes: 10,
      options: "Dim Sum\nPizza\nPha",
    };

    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payloadBad9 });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'A poll with the same "name" already exists.');

    // Branch 4: 'missing "minutes" parameter'
    let payloadBad3 = {
      name: "Lunch",
      options: "Dim Sum\nPizza\nPha",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payloadBad3 });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'missing "minutes" parameter');

    // Branch 5: 'missing "options" parameter'
    let payloadBad4 = {
      name: "Lunch",
      minutes: 10,
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payloadBad4 });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'missing "options" parameter');

    // Branch 6: 'The "options" parameter must contain at least 2 different options'
    const payloadBad5 = {
      name: 'Lunch?',
      minutes: 10,
      options: "Dim Sum\nDim Sum\nDiM SuM",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payloadBad5 });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.strictEqual(res._getData(), 'The "options" parameter must ' +
      'contain at least 2 different options');

    // Branch 7: 'The "minutes" parameter must be an integer.'
    const payloadBad6a = {
      name: 'Lunch?',
      minutes: "",
      options: "Dim Sum\nPizza",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payloadBad6a });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.strictEqual(res._getData(), 'The "minutes" parameter must be an integer.');

    // Branch 8: 'The "minutes" parameter cannot less than 0.'
    const payloadBad6 = {
      name: 'Lunch?',
      minutes: -1,
      options: "Dim Sum\nPizza",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payloadBad6 });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.strictEqual(res._getData(), 'The "minutes" parameter cannot less than 0.');

    // Branch 9: The "minutes" parameter cannot greater than ${60 * 24 * 365}.
    const payloadBad7 = {
      name: 'Lunch?',
      minutes: 60 * 24 * 365 + 1,
      options: "Dim Sum\nPizza",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payloadBad7 });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.strictEqual(res._getData(), `The "minutes" parameter cannot greater than ${60 * 24 * 365}.`);

    // branch 10 - correctly add: 1st
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

    // branch 10 - correctly add: 2nd
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

    // branch 10 - correctly add: 3rd
    let payloadBad10 = {
      name: ["dinner", "lunch"],
      minutes: 10,
      options: "Dim Sum\nPizza\nPha",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save',
        body: payloadBad10 });
    res = httpMocks.createResponse();
    save(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), {msg: "dinner saved."});
  });

  it('list', function() {
    // Delete all saved polls and votes.
    resetForTesting();

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

  });

  it('load', function() {
    // Delete all saved polls and votes.
    resetForTesting();

    // branch 1: 'missing "name" parameter'
    let req = httpMocks.createRequest(
      {method: 'GET', url: '/api/load'});
    let res = httpMocks.createResponse();
    load(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'missing "name" parameter');

    // create a poll
    let payload = {
      name: 'dinner',
      minutes: 10,
      options: "Dim Sum\nPizza\nPha",
    };
    let req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: payload });
    let res1 = httpMocks.createResponse();
    save(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {msg: `${payload.name} saved.`});

    // branch 2: There is no poll with the given name.
    req = httpMocks.createRequest(
      {method: 'GET', url: '/api/load?name=lunch'});
    res = httpMocks.createResponse();
    load(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'There is no poll with the given name.');

    // branch 3: 1st
    req = httpMocks.createRequest(
      {method: 'GET', url: '/api/load?name=dinner'});
    res = httpMocks.createResponse();
    load(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    const data:Poll = res._getData();
    assert.strictEqual(data.name, 'dinner');
    assert.strictEqual(data.minutes, 10);
    assert.deepStrictEqual(data.options, [ 'Dim Sum', 'Pizza', 'Pha' ]);
    assert.strictEqual(data.createAt instanceof Date, true);

    // create the second poll
    let payload2 = {
      name: 'What do I eat for dinner?',
      minutes: 30,
      options: "Dim Sum1\nPizza1\nPho1",
    };
    req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: payload2 });
    res1 = httpMocks.createResponse();
    save(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {msg: `${payload2.name} saved.`});


    // branch 3: 2nd
    req = httpMocks.createRequest(
      {method: 'GET', url: '/api/load?name='+encodeURIComponent(payload2.name)});
    res = httpMocks.createResponse();
    load(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    const data2:Poll = res._getData();
    assert.strictEqual(data2.name, payload2.name);
    assert.strictEqual(data2.minutes, 30);
    assert.deepStrictEqual(data2.options, [ 'Dim Sum1', 'Pizza1', 'Pho1' ]);
    assert.strictEqual(data2.createAt instanceof Date, true);

  });

  it('vote', function() {
    // Delete all saved polls and votes.
    resetForTesting();

    // Branch 1: missing "name" parameter
    const payloadBad1 = {
        voter: "voter1",
        option: "Dim Sum",
    };
    let req = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payloadBad1 });
    let res = httpMocks.createResponse();
    vote(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'missing "name" parameter');

    // Branch 2: The "name" parameter cannot be empty.
    const payloadBad2 = {
      name: "",
      voter: "voter1",
      option: "Dim Sum",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payloadBad2 });
    res = httpMocks.createResponse();
    vote(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'The "name" parameter cannot be empty.');

    // Branch 3: missing "option" parameter
    const payloadBad3 = {
      name: "lunch",
      voter: "voter1",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payloadBad3 });
    res = httpMocks.createResponse();
    vote(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'missing "option" parameter');

    // Branch 4: 'The "option" parameter cannot be empty'
    const payloadBad4 = {
      name: "lunch",
      voter: "voter1",
      option: "",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payloadBad4 });
    res = httpMocks.createResponse();
    vote(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'The "option" parameter cannot be empty');

    // Branch 5: 'missing "voter" parameter'
    const payloadBad5 = {
      name: "lunch",
      option: "Dim Sum",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payloadBad5 });
    res = httpMocks.createResponse();
    vote(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'missing "voter" parameter');

    // Branch 6: 'The "voter" parameter cannot be empty.'
    const payloadBad6 = {
      name: "lunch",
      option: "Dim Sum",
      voter: "",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payloadBad6 });
    res = httpMocks.createResponse();
    vote(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'The "voter" parameter cannot be empty.');


    // Create a poll first ////////////////////////////////////////////////////
    let payloadPoll = {
      name: 'dinner1',
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
    const payloadBad7 = {
      name: "lunch",
      option: "Dim Sum",
      voter: "voter1",
    };
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payloadBad7 });
    res = httpMocks.createResponse();
    vote(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'There is no poll with the given name');


    // Branch 8: 'Voting closed.'
    let payload = {
      name: 'dinner1',
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
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(),
      {msg: `Recorded vote of "${payload.voter}" as "${payload.option}"`});

  });

  it('result', function() {
    // Delete all saved polls and votes.
    resetForTesting();

    // Branch 1: missing "name" parameter
    let payloadBad = {
    };
    let req = httpMocks.createRequest(
      {method: 'POST', url: '/api/results',
        body: payloadBad });
    let res = httpMocks.createResponse();
    results(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'missing "name" parameter');

    // create a poll
    let payload = {
      name: 'dinner',
      minutes: 10,
      options: "Dim Sum\nPizza\nPha",
    };
    let req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: payload });
    let res1 = httpMocks.createResponse();
    save(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {msg: `${payload.name} saved.`});

    // Branch 2: 'There is no poll with the given name.'
    req = httpMocks.createRequest(
      {method: 'POST', url: "/api/results?name=lunch"});
    res = httpMocks.createResponse();
    results(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'There is no poll with the given name.');

    // Bottom Branch: no votes
    req = httpMocks.createRequest(
      {method: 'POST', url: "/api/results?name=dinner"});
    res = httpMocks.createResponse();
    results(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    let data: VotingResults = res._getData();
    assert.strictEqual(data.totalVotes, 0);

    // Test branch 3 that has votes: 1st
    // create another poll
    payload = {
      name: 'lunch2',
      minutes: 10,
      options: "Dim Sum\nPizza\nPho",
    };
    req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: payload });
    res1 = httpMocks.createResponse();
    save(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {msg: `${payload.name} saved.`});

    // Make the first vote
    let payload2 = {
      name: "lunch2",
      option: "Dim Sum",
      voter: "voter1",
    };
    let req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payload2 });
    let res2 = httpMocks.createResponse();
    vote(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(),
      {msg: `Recorded vote of "${payload2.voter}" as "${payload2.option}"`});

    // Branch 3: has 1 vote
    let req3 = httpMocks.createRequest(
      {method: 'GET', url: `/api/vote?name=${encodeURIComponent("lunch2")}` });
    let res3 = httpMocks.createResponse();
    results(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 200);
    data = res3._getData();
    let resultMap = new Map(data.result);
    assert.strictEqual(data.poll.name, "lunch2");
    assert.strictEqual(data.poll.minutes, 10);
    assert.deepStrictEqual(data.poll.options, [ 'Dim Sum', 'Pizza', 'Pho' ]);
    assert.strictEqual(data.totalVotes, 1);
    assert.strictEqual(resultMap.get("dim sum"), 1);
    assert.strictEqual(resultMap.get("pizza"), 0);
    assert.strictEqual(resultMap.get("pho"), 0);

    // Test branch 3 that has votes: 2nd //////////////////////////////////////
    // Make the second vote that the voting option in an irregular case
    payload2 = {
      name: "lunch2",
      option: "dIm sUm",
      voter: "voter2",
    };
    req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payload2 });
    res2 = httpMocks.createResponse();
    vote(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(),
      {msg: `Recorded vote of "${payload2.voter}" as "${payload2.option}"`});

    // Branch 3: has 2 votes
    req3 = httpMocks.createRequest(
      {method: 'GET', url: `/api/vote?name=${encodeURIComponent("lunch2")}` });
    res3 = httpMocks.createResponse();
    results(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 200);
    data = res3._getData();
    resultMap = new Map(data.result);
    assert.strictEqual(data.poll.name, "lunch2");
    assert.strictEqual(data.poll.minutes, 10);
    assert.deepStrictEqual(data.poll.options, [ 'Dim Sum', 'Pizza', 'Pho' ]);
    assert.strictEqual(data.totalVotes, 2);
    assert.strictEqual(resultMap.get("dim sum"), 2);
    assert.strictEqual(resultMap.get("pizza"), 0);
    assert.strictEqual(resultMap.get("pho"), 0);

    // Test branch 3 that has votes: 3rd //////////////////////////////////////
    // Make the 3rd vote
    payload2 = {
      name: "lunch2",
      option: "pizza",
      voter: "voter3",
    };
    req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payload2 });
    res2 = httpMocks.createResponse();
    vote(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(),
      {msg: `Recorded vote of "${payload2.voter}" as "${payload2.option}"`});

    // Branch 3: has 3 votes
    req3 = httpMocks.createRequest(
      {method: 'GET', url: `/api/vote?name=${encodeURIComponent("lunch2")}` });
    res3 = httpMocks.createResponse();
    results(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 200);
    data = res3._getData();
    resultMap = new Map(data.result);
    assert.strictEqual(data.poll.name, "lunch2");
    assert.strictEqual(data.poll.minutes, 10);
    assert.deepStrictEqual(data.poll.options, [ 'Dim Sum', 'Pizza', 'Pho' ]);
    assert.strictEqual(data.totalVotes, 3);
    assert.strictEqual(resultMap.get("dim sum"), 2);
    assert.strictEqual(resultMap.get("pizza"), 1);
    assert.strictEqual(resultMap.get("pho"), 0);

    // Test branch 3 that has votes: 4th //////////////////////////////////////
    // Make the 4th vote
    payload2 = {
      name: "lunch2",
      option: "pho",
      voter: "voter4",
    };
    req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payload2 });
    res2 = httpMocks.createResponse();
    vote(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(),
      {msg: `Recorded vote of "${payload2.voter}" as "${payload2.option}"`});

    // Branch 3: has 4 votes
    req3 = httpMocks.createRequest(
      {method: 'GET', url: `/api/vote?name=${encodeURIComponent("lunch2")}` });
    res3 = httpMocks.createResponse();
    results(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 200);
    data = res3._getData();
    resultMap = new Map(data.result);
    assert.strictEqual(data.poll.name, "lunch2");
    assert.strictEqual(data.poll.minutes, 10);
    assert.deepStrictEqual(data.poll.options, [ 'Dim Sum', 'Pizza', 'Pho' ]);
    assert.strictEqual(data.totalVotes, 4);
    assert.strictEqual(resultMap.get("dim sum"), 2);
    assert.strictEqual(resultMap.get("pizza"), 1);
    assert.strictEqual(resultMap.get("pho"), 1);

    // Test branch 3 that has votes: 5th //////////////////////////////////////
    // Make the 4th vote - a voter change mind
    payload2 = {
      name: "lunch2",
      option: "pizza",
      voter: "voter4",
    };
    req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
        body: payload2 });
    res2 = httpMocks.createResponse();
    vote(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(),
      {msg: `Recorded vote of "${payload2.voter}" as "${payload2.option}"`});

    // Branch 3: has 4 votes
    req3 = httpMocks.createRequest(
      {method: 'GET', url: `/api/vote?name=${encodeURIComponent("lunch2")}` });
    res3 = httpMocks.createResponse();
    results(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 200);
    data = res3._getData();
    resultMap = new Map(data.result);
    assert.strictEqual(data.poll.name, "lunch2");
    assert.strictEqual(data.poll.minutes, 10);
    assert.deepStrictEqual(data.poll.options, [ 'Dim Sum', 'Pizza', 'Pho' ]);
    assert.strictEqual(data.totalVotes, 4);
    assert.strictEqual(resultMap.get("dim sum"), 2);
    assert.strictEqual(resultMap.get("pizza"), 2);
    assert.strictEqual(resultMap.get("pho"), 0);

  });

  // Test the helper functions
  it('first', function() {
    // test 1: input is a string array
    assert.strictEqual(first(['str1', 'str2']), 'str1');

    // test 2: input is a string
    assert.strictEqual(first('str2'), 'str2');

    // test 3: input is undefined
    assert.strictEqual(first(undefined), undefined);
  });

  it('cleanString', function() {
    // 1st test
    assert.strictEqual(cleanString("AbCdEfG "), "abcdefg");

    // 2nd test
    assert.strictEqual(cleanString(" AbCdEfG "), "abcdefg");

    // 3rd test
    assert.strictEqual(cleanString(" AbCd EfG "), "abcd efg");
  });

  it('processOptions', function() {
    // 1st test
    let input:string = "pizza\nPizza"
    let output:string[] = ["Pizza"]
    assert.deepStrictEqual(processOptions(input), output);

    // 2nd test
    input = "pizza\nPizza\nDim Sum"
    output = ["Pizza", "Dim Sum"]
    assert.deepStrictEqual(processOptions(input), output);

    // 3rd test
    input = "pizza\nPizza\n \nDim Sum"
    output = ["Pizza", "Dim Sum"]
    assert.deepStrictEqual(processOptions(input), output);

    // 4th test
    input = "pizza\nPizza\n \ndim sum\ndIm suM\nDim Sum\n"
    output = ["Pizza", "Dim Sum"]
    assert.deepStrictEqual(processOptions(input), output);
  });

  it('diffTimeFunc', function() {
    // test 1: dateLeft and dateRight have the same date and time
    const dateLeft = new Date();
    const dateRight = dateLeft;
    assert.strictEqual(diffTimeFunc(dateLeft, dateRight), 0);

    // test 2: dateLeft2 is 10 minutes behind dateRight2
    const dateLeft2 = new Date();
    const dateRight2 = addMinutesFunc(10, dateLeft2);
    assert.strictEqual(diffTimeFunc(dateLeft2, dateRight2), -10);

    // test 3: dateLeft3 is 10 minutes ahead dateRight3
    const dateRight3 = new Date();
    const dateLeft3 = addMinutesFunc(10, dateRight3);
    assert.strictEqual(diffTimeFunc(dateLeft3, dateRight3), 10);

  });

  it('addMinutesFunc', function() {
    // test 1: add 0 minutes to dateRight
    const dateLeft = new Date();
    const dateRight = addMinutesFunc(0, dateLeft);
    assert.strictEqual(diffTimeFunc(dateLeft, dateRight), 0);

    // test 2: add 10 minutes to dateRight2
    const dateLeft2 = new Date();
    const dateRight2 = addMinutesFunc(10, dateLeft2);
    assert.strictEqual(diffTimeFunc(dateLeft2, dateRight2), -10);

    // test 2: add -10 minutes to dateRight3
    const dateLeft3 = new Date();
    const dateRight3 = addMinutesFunc(-10, dateLeft3);
    assert.strictEqual(diffTimeFunc(dateLeft3, dateRight3), 10);
  });
});
