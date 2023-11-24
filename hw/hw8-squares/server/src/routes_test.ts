import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import {list, resetForTesting, save} from './routes';


describe('routes', function() {
  // TODO: add tests for your routes
  it('save', function() {
    // branch 1 ///////////////////////////////////////////////////////////
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {data: "green"}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepEqual(res1._getData(), `missing "filename" parameter`);

    // branch 2 ///////////////////////////////////////////////////////////
    const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {filename: '', data: "green"}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepEqual(res2._getData(), `The "filename" parameter must be at least one character`);

    // branch 3 ///////////////////////////////////////////////////////////
    const req3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {filename: 'test3'}});
    const res3 = httpMocks.createResponse();
    save(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepEqual(res3._getData(), `missing "data" parameter`);

    // branch 4 ///////////////////////////////////////////////////////////
    const req4 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {filename: 'test4', data: null}});
    const res4 = httpMocks.createResponse();
    save(req4, res4);
    console.log(res4._getData())
    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepEqual(res4._getData(), `"data" cannot be null`);

    // branch 5: 1st
    const req5 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {filename: 'test5', data: "green"}});
    const res5 = httpMocks.createResponse();
    save(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 200);
    assert.deepEqual(res5._getData(), {res: 'test5'});

    // branch 5: 2nd
    const req6 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {filename: 'test6', data: "[ 'green', 'green', 'green', 'green' ]"}});
    const res6 = httpMocks.createResponse();
    save(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 200);
    assert.deepEqual(res6._getData(), {res: 'test6'});

    // remove all saved files
    resetForTesting();
  });

  // After you know what to do, feel free to delete this Dummy test
  it('list', function() {
    // Feel free to copy this test structure to start your own tests, but look at these
    // comments first to understand what's going on.

    // httpMocks lets us create mock Request and Response params to pass into our route functions
    const req1 = httpMocks.createRequest(
        // query: is how we add query params. body: {} can be used to test a POST request
        {method: 'GET', url: '/api/list', query: {}});
    const res1 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    list(req1, res1);

    // check that the request was successful
    assert.strictEqual(res1._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepEqual(res1._getData(), JSON.stringify([]));
  });



});
