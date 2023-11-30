import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { listItems, addItem, completeItem } from './routes';

describe('routes', function() {

  it('end-to-end', function() {
    const req1 = httpMocks.createRequest({method: 'GET', url: '/api/list'});
    const res1 = httpMocks.createResponse();
    listItems(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {items: []});

    const req2 = httpMocks.createRequest({method: 'POST', url: '/api/add',
        body: {name: "laundry"}});
    const res2 = httpMocks.createResponse();
    addItem(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(), {added: true, name: "laundry"});

    // Try to create it again.
    const req3 = httpMocks.createRequest({method: 'POST', url: '/api/add',
        body: {name: "laundry"}});
    const res3 = httpMocks.createResponse();
    addItem(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(), {added: false, name: "laundry"});

    const req4 = httpMocks.createRequest({method: 'POST', url: '/api/add',
        body: {name: "wash dog"}});
    const res4 = httpMocks.createResponse();
    addItem(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {added: true, name: "wash dog"});

    const req5 = httpMocks.createRequest({method: 'GET', url: '/api/list'});
    const res5 = httpMocks.createResponse();
    listItems(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), {items: [
      {name: "laundry", completed: false},
      {name: "wash dog", completed: false},
    ]});

    const req6 = httpMocks.createRequest({method: 'POST', url: '/api/complete',
        body: {name: "wash dog"}});
    const res6 = httpMocks.createResponse();
    completeItem(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 200);
    assert.deepStrictEqual(res6._getData(), {completed: true});

    const req7 = httpMocks.createRequest({method: 'GET', url: '/api/list'});
    const res7 = httpMocks.createResponse();
    listItems(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 200);
    assert.deepStrictEqual(res7._getData(), {items: [
      {name: "laundry", completed: false},
      {name: "wash dog", completed: true},
    ]});
  });

});
