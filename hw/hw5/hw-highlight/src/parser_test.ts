import * as assert from 'assert';
import { explode} from './char_list';
import {explode_array, nil} from './list';
import {
  findHighlights,
  getNextHighlight,
  parseHighlightLines,
  parseHighlightText
} from './parser';


describe('parser', function() {

  it('parseHighlightLines', function() {
    assert.deepEqual(parseHighlightLines(""), explode_array([]));
    assert.deepEqual(
      parseHighlightLines("Red hi there"),
      explode_array([
        {color: 'red', text: 'hi there'},
      ]));
    assert.deepEqual(
      parseHighlightLines("Red hi there\nGreen more text"),
      explode_array([
        {color: 'red', text: 'hi there'},
        {color: 'green', text: 'more text'},
      ]));
    assert.deepEqual(
      parseHighlightLines("Red hi there\nGreen more text\nBlue really? more?"),
      explode_array([
        {color: 'red', text: 'hi there'},
        {color: 'green', text: 'more text'},
        {color: 'blue', text: 'really? more?'},
      ]));
  });

  it('getNextHighlight', function() {
    // first branch
    assert.strictEqual(getNextHighlight(explode("")), undefined);

    // second branch
    assert.strictEqual(getNextHighlight(explode("ab")), undefined);
    assert.strictEqual(getNextHighlight(explode("abc")), undefined);

    // third branch
    assert.strictEqual(getNextHighlight(explode("ab[red")), undefined);
    assert.strictEqual(getNextHighlight(explode("[red")), undefined);

    // fourth branch
    assert.strictEqual(getNextHighlight(explode("abc[red|")), undefined);
    assert.strictEqual(getNextHighlight(explode("abc[red|def")), undefined);

    // fifth branch
    assert.deepStrictEqual(getNextHighlight(explode("my [red|ball] is great")),
        ["my ", {color: "red", text: "ball"}, explode(" is great")]);
    assert.deepStrictEqual(getNextHighlight(explode("grass is [green|itchy]")),
        ["grass is ", {color: "green", text: "itchy"}, explode("")]);

    console.log(getNextHighlight(explode("[red|ball]")));
  });

  it('findHighlights', function() {
    // TODO: Add tests here
    // 0-1-many: base case
    assert.deepEqual(findHighlights(explode("")), nil);
    assert.deepEqual(findHighlights(explode("my book")),
      explode_array([{color: 'white', text: 'my book'}]));

    // 0-1-many: 1 recursive call (1st)
    assert.deepEqual(
      findHighlights(explode("my [green|green] book")),
      explode_array([
        {color: 'white', text: 'my '},
        {color: 'green', text: 'green'},
        {color: 'white', text: ' book'},
      ]));
    // 0-1-many: 1 recursive call (2nd)
    assert.deepEqual(
      findHighlights(explode("[green|green] book")),
      explode_array([
        {color: 'green', text: 'green'},
        {color: 'white', text: ' book'},
      ]));
    // 0-1-many: 1 recursive call (3rd)
    assert.deepEqual(
      findHighlights(explode("[green|green]")),
      explode_array([
        {color: 'green', text: 'green'},
      ]));

    // 0-1-many: more than 1 recursive call (1st)
    assert.deepEqual(
      findHighlights(explode("my [green|green] [blue|story] book")),
      explode_array([
        {color: 'white', text: 'my '},
        {color: 'green', text: 'green'},
        {color: 'white', text: ' '},
        {color: 'blue', text: 'story'},
        {color: 'white', text: ' book'},
      ]));
    // 0-1-many: more than 1 recursive call (2nd)
    assert.deepEqual(
      findHighlights(explode("[green|green] [blue|story] book")),
      explode_array([
        {color: 'green', text: 'green'},
        {color: 'white', text: ' '},
        {color: 'blue', text: 'story'},
        {color: 'white', text: ' book'},
      ]));
    // 0-1-many: more than 1 recursive call (3rd)
    assert.deepEqual(
      findHighlights(explode("my [green|green] [blue|story]")),
      explode_array([
        {color: 'white', text: 'my '},
        {color: 'green', text: 'green'},
        {color: 'white', text: ' '},
        {color: 'blue', text: 'story'},
      ]));
    // 0-1-many: more than 1 recursive call (4th)
    assert.deepEqual(
      findHighlights(explode("[green|green] [blue|story]")),
      explode_array([
        {color: 'green', text: 'green'},
        {color: 'white', text: ' '},
        {color: 'blue', text: 'story'},
      ]));
    // 0-1-many: more than 1 recursive call (5th)
    assert.deepEqual(
      findHighlights(explode("[green|green] [blue|story] [red|book]")),
      explode_array([
        {color: 'green', text: 'green'},
        {color: 'white', text: ' '},
        {color: 'blue', text: 'story'},
        {color: 'white', text: ' '},
        {color: 'red', text: 'book'},
      ]));
  });

  // TODO: Uncomment to test
 it('parseHighlightText', function() {
   assert.deepEqual(parseHighlightText(""), explode_array([]));

   assert.deepEqual(parseHighlightText("my book"), explode_array([{color: 'white', text: 'my book'}]));

   assert.deepEqual(
     parseHighlightText("my [red|favorite] book"),
     explode_array([
       {color: 'white', text: 'my '},
       {color: 'red', text: 'favorite'},
       {color: 'white', text: ' book'},
     ]));

   assert.deepEqual(
     parseHighlightText("[red|one][blue|two]"),
     explode_array([
       {color: 'red', text: 'one'},
       {color: 'blue', text: 'two'},
     ]));

   assert.deepEqual(
     parseHighlightText("[red|one][blue|two][green|three]"),
     explode_array([
       {color: 'red', text: 'one'},
       {color: 'blue', text: 'two'},
       {color: 'green', text: 'three'},
     ]));
 });

});
