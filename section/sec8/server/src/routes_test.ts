import * as assert from 'assert';
import { len } from './list';
import { TRIVIA } from './trivia';
import * as httpMocks from 'node-mocks-http';
import { newQuestion, checkAnswer } from './routes';


describe('routes', function() {

  it('newQuestion', function() {
    const req = httpMocks.createRequest({method: 'GET', url: '/'});
    const res = httpMocks.createResponse();
    newQuestion(req, res);

    assert.strictEqual(res._getStatusCode(), 200);
    assert.ok(0 <= res._getData().index && res._getData().index < len(TRIVIA));
    assert.ok(res._getData().text.length > 0);
  });

  it('checkAnswer correct', function() {
    const req = httpMocks.createRequest({method: 'GET', url: '/',
        query: {index: "0", answer: "blue whale"}});
    const res = httpMocks.createResponse();
    checkAnswer(req, res);

    assert.strictEqual(res._getStatusCode(), 200);
    assert.strictEqual(typeof res._getData(), "object");
    assert.strictEqual(res._getData().correct, true);
  });

  it('checkAnswer incorrect', function() {
    const req = httpMocks.createRequest({method: 'GET', url: '/',
        query: {index: "0", answer: "blue snail"}});
    const res = httpMocks.createResponse();
    checkAnswer(req, res);

    assert.strictEqual(res._getStatusCode(), 200);
    assert.strictEqual(typeof res._getData(), "object");
    assert.strictEqual(res._getData().correct, false);
  });

  it('checkAnswer with wrong case', function() {
    const req = httpMocks.createRequest({method: 'GET', url: '/',
        query: {index: "1", answer: "ChEeTaH"}});
    const res = httpMocks.createResponse();
    checkAnswer(req, res);

    assert.strictEqual(res._getStatusCode(), 200);
    assert.strictEqual(typeof res._getData(), "object");
    assert.strictEqual(res._getData().correct, true);
  });

});
