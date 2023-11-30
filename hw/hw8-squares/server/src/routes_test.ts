import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import {list, resetForTesting, save, load, remove} from './routes';


describe('routes', function() {
  // Test the save service that save square to server
  it('save', function() {
    // branch 1 ///////////////////////////////////////////////////////////
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {data: "green"}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepEqual(res1._getData(), 'missing "filename" parameter');

    // branch 2 ///////////////////////////////////////////////////////////
    const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {filename: '', data: "green"}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepEqual(res2._getData(), 'The "filename" parameter must be at least one character');

    // branch 3 ///////////////////////////////////////////////////////////
    const req3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {filename: 'test3'}});
    const res3 = httpMocks.createResponse();
    save(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepEqual(res3._getData(), 'missing "data" parameter');

    // branch 4 ///////////////////////////////////////////////////////////
    const req4 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {filename: 'test4', data: null}});
    const res4 = httpMocks.createResponse();
    save(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepEqual(res4._getData(), '"data" cannot be null');

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
  });

  // Test the list service that get a list of all saved files
  it('list', function() {
    // remove all saved files
    resetForTesting();

    // save the 1st file ////////////////////////////////////////////////
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {filename: 'fil1', data: "green"}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);

    // get the saved file list
    let req = httpMocks.createRequest(
      {method: 'GET', url: '/api/list', query: {}});
    let res = httpMocks.createResponse();
    list(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepEqual(JSON.parse(res._getData()), ["fil1"]);


    // save the 2nd file ////////////////////////////////////////////////
    const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {filename: 'fil2', data: "[ 'green', 'green', 'green', 'green' ]"}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    // get the saved file list
    req = httpMocks.createRequest(
      {method: 'GET', url: '/api/list', query: {}});
    res = httpMocks.createResponse();
    list(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepEqual(JSON.parse(res._getData()), ["fil1", "fil2"]);
  });

  // Test the load service that loading any square from server
  it('load', function() {
    // remove all saved files
    resetForTesting();

    // 1st branch /////////////////////////////////////////////////////////////
    let req = httpMocks.createRequest(
      {method: 'GET', url: '/api/load', query: {}});
    let res = httpMocks.createResponse();
    load(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepEqual(res._getData(), 'missing "filename" parameter');

    // 2nd branch /////////////////////////////////////////////////////////////
    req = httpMocks.createRequest(
      {method: 'GET', url: '/api/load', query: {filename: 'donotexist'}});
    res = httpMocks.createResponse();
    load(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepEqual(res._getData(), 'There is no file with the given name.');

    // the bottom branch //////////////////////////////////////////////////////
    // save the 1st file
    let filename = "file1";
    let data = "green";
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {filename: filename, data: data}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);

    // get the saved file list
    req = httpMocks.createRequest(
      {method: 'GET', url: '/api/load', query: {filename: filename}});
    res = httpMocks.createResponse();
    load(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepEqual(JSON.parse(res._getData()), data);

    // save the 2nd file
    filename = "file2";
    data = "[ 'green', 'green', 'green', 'green' ]"
    const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {filename: filename,
          data: data}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    // get the saved file list
    req = httpMocks.createRequest(
      {method: 'GET', url: '/api/load', query: {filename: filename}});
    res = httpMocks.createResponse();
    load(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepEqual(JSON.parse(res._getData()), data);
  });

  // Extra credit
  // Test the remove service that removing any square from server
  it('remove', function() {
    // remove all saved files
    resetForTesting();

    // 1st branch /////////////////////////////////////////////////////////////
    let req = httpMocks.createRequest(
      {method: 'POST', url: '/api/delete', body: {}});
    let res = httpMocks.createResponse();
    remove(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepEqual(res._getData(), 'missing "filename" parameter');

    // 2nd branch /////////////////////////////////////////////////////////////
    req = httpMocks.createRequest(
      {method: 'GET', url: '/api/delete', body: {filename: 'donotexist'}});
    res = httpMocks.createResponse();
    remove(req, res);
    assert.strictEqual(res._getStatusCode(), 400);
    assert.deepEqual(res._getData(), 'There is no file with the given name');

    // the bottom branch //////////////////////////////////////////////////////
    // save the 1st file
    let filename = "file1";
    let data = "green";
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {filename: filename, data: data}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);

    // delete the 1st saved file
    req = httpMocks.createRequest(
      {method: 'GET', url: '/api/delete', body: {filename: filename}});
    res = httpMocks.createResponse();
    remove(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepEqual(JSON.parse(res._getData()), []);

    // save two more files
    const filename1 = "file1";
    const data1 = "[ 'green', 'green', 'green', 'green' ]"
    const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {filename: filename1,
          data: data1}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    filename = "file2";
    data = "green";
    const req3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {filename: filename,
          data: data}});
    const res3 = httpMocks.createResponse();
    save(req3, res3);

    // delete the 2nd saved file
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/delete', body: {filename: filename}});
    res = httpMocks.createResponse();
    remove(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepEqual(JSON.parse(res._getData()), [filename1] );

    // additional test for testing filename is an array
    // delete the 1st saved file
    req = httpMocks.createRequest(
      {method: 'POST', url: '/api/delete', body: {filename: [filename1, filename]}});
    res = httpMocks.createResponse();
    remove(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepEqual(JSON.parse(res._getData()), [] );

  });

});
