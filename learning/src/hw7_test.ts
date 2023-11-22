import * as assert from 'assert';
import {concat} from './hw7';


describe('hw7', function() {

  it('concat', function() {

    const array1= ["1", "2", "3"];
    const array2= ["4", "5", "6"];
    const R:string[][] = [array1, array2];

    // base case
    assert.deepEqual(concat([]), []);

    //
    assert.deepEqual(concat(R), ["1", "2", "3", "4", "5", "6"]);
  });


  it('void', function() {

    const str = "if this, then that";

    for (let i = 0; i < str.length; i++) {
      console.log("str["+i+"] = " + str[i] )
    }
  });


});
