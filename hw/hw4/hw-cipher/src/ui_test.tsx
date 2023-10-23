import React from 'react';
import * as assert from 'assert';
import { ShowResult} from './ui';


describe('ui', function() {

  it('ShowResult', function() {
    // cipher_encode *********************************************
    // base case, nil
    assert.deepEqual(
      ShowResult({word: "", algo: "cipher", op: "encode"}),
      <p><code>You do not enter a word.</code></p>);

    // 1 recursive call
    assert.deepEqual(
      ShowResult({word: "a", algo: "cipher", op: "encode"}),
      <p><code>Hi there, {"cipher"} {"encode"}s "{"a"}" to "{"e"}".
      </code></p>);

    // more than 1 recursive call
    assert.deepEqual(
      ShowResult({word: "cs", algo: "cipher", op: "encode"}),
      <p><code>Hi there, {"cipher"} {"encode"}s "{"cs"}" to "{"kz"}".
      </code></p>);

    // more than 1 recursive call
    assert.deepEqual(
      ShowResult({word: "cse", algo: "cipher", op: "encode"}),
      <p><code>Hi there, {"cipher"} {"encode"}s "{"cse"}" to "{"kzi"}".
      </code></p>);

    // cipher_decode *********************************************
    // base case, nil
    assert.deepEqual(
      ShowResult({word: "", algo: "cipher", op: "decode"}),
      <p><code>You do not enter a word.</code></p>);

    // 1 recursive call
    assert.deepEqual(
      ShowResult({word: "e", algo: "cipher", op: "decode"}),
      <p><code>Hi there, {"cipher"} {"decode"}s "{"e"}" to "{"a"}".
      </code></p>);

    // more than 1 recursive call
    assert.deepEqual(
      ShowResult({word: "kz", algo: "cipher", op: "decode"}),
      <p><code>Hi there, {"cipher"} {"decode"}s "{"kz"}" to "{"cs"}".
      </code></p>);

    // more than 1 recursive call
    assert.deepEqual(
      ShowResult({word: "kzi", algo: "cipher", op: "decode"}),
      <p><code>Hi there, {"cipher"} {"decode"}s "{"kzi"}" to "{"cse"}".
      </code></p>);

    // crazy_caps_encode *********************************************
    // base case, nil
    assert.deepEqual(
      ShowResult({word: "", algo: "crazy-caps", op: "encode"}),
      <p><code>You do not enter a word.</code></p>);

    // 1 recursive call
    assert.deepEqual(
      ShowResult({word: "c", algo: "crazy-caps", op: "encode"}),
      <p><code>Hi there, {"crazy-caps"} {"encode"}s "{"c"}" to "{"C"}".
      </code></p>);

    // more than 1 recursive call
    assert.deepEqual(
      ShowResult({word: "cr", algo: "crazy-caps", op: "encode"}),
      <p><code>Hi there, {"crazy-caps"} {"encode"}s "{"cr"}" to "{"Cr"}".
      </code></p>);

    // more than 1 recursive call
    assert.deepEqual(
      ShowResult({word: "crazy", algo: "crazy-caps", op: "encode"}),
      <p><code>Hi there, {"crazy-caps"} {"encode"}s "{"crazy"}" to "{"CrAzY"}".
      </code></p>);

    // crazy_caps_decode****************************************************
    // base case, nil
    assert.deepEqual(
      ShowResult({word: "", algo: "crazy-caps", op: "decode"}),
      <p><code>You do not enter a word.</code></p>);

    // 1 recursive call
    assert.deepEqual(
      ShowResult({word: "C", algo: "crazy-caps", op: "decode"}),
      <p><code>Hi there, {"crazy-caps"} {"decode"}s "{"C"}" to "{"c"}".
      </code></p>);

    // more than 1 recursive call
    assert.deepEqual(
      ShowResult({word: "Cr", algo: "crazy-caps", op: "decode"}),
      <p><code>Hi there, {"crazy-caps"} {"decode"}s "{"Cr"}" to "{"cr"}".
      </code></p>);

    // more than 1 recursive call
    assert.deepEqual(
      ShowResult({word: "CrAzY", algo: "crazy-caps", op: "decode"}),
      <p><code>Hi there, {"crazy-caps"} {"decode"}s "{"CrAzY"}" to "{"crazy"}".
      </code></p>);

    // pig_latin_encode *********************************************
    // case 1:
    // empty string, no characters
    assert.deepEqual(
      ShowResult({word: "", algo: "pig-latin", op: "encode"}),
      <p><code>You do not enter a word.</code></p>);
    // neither consonants nor vowels
    assert.deepEqual(
      ShowResult({word: "__", algo: "pig-latin", op: "encode"}),
      <p><code>Hi there, {"pig-latin"} {"encode"}s "{"__"}" to "{"__"}".
      </code></p>);
    // all consonants
    assert.deepEqual(
      ShowResult({word: "str", algo: "pig-latin", op: "encode"}),
      <p><code>Hi there, {"pig-latin"} {"encode"}s "{"str"}" to "{"str"}".
      </code></p>);

    // case 2: starts with a vowel
    assert.deepEqual(
      ShowResult({word: "a", algo: "pig-latin", op: "encode"}),
      <p><code>Hi there, {"pig-latin"} {"encode"}s "{"a"}" to "{"away"}".
      </code></p>);
    assert.deepEqual(
      ShowResult({word: "is", algo: "pig-latin", op: "encode"}),
      <p><code>Hi there, {"pig-latin"} {"encode"}s "{"is"}" to "{"isway"}".
      </code></p>);
    assert.deepEqual(
      ShowResult({word: "astro", algo: "pig-latin", op: "encode"}),
      <p><code>Hi there, {"pig-latin"} {"encode"}s "{"astro"}" to "{"astroway"}".
      </code></p>);

    // case 3: starting with consonant case
    assert.deepEqual(
      ShowResult({word: "say", algo: "pig-latin", op: "encode"}),
      <p><code>Hi there, {"pig-latin"} {"encode"}s "{"say"}" to "{"aysay"}".
      </code></p>);
    assert.deepEqual(
      ShowResult({word: "stay", algo: "pig-latin", op: "encode"}),
      <p><code>Hi there, {"pig-latin"} {"encode"}s "{"stay"}" to "{"aystay"}".
      </code></p>);
    assert.deepEqual(
      ShowResult({word: "nasty", algo: "pig-latin", op: "encode"}),
      <p><code>Hi there, {"pig-latin"} {"encode"}s "{"nasty"}" to "{"astynay"}".
      </code></p>);
    assert.deepEqual(
      ShowResult({word: "qut", algo: "pig-latin", op: "encode"}),
      <p><code>Hi there, {"pig-latin"} {"encode"}s "{"qut"}" to "{"utqay"}".
      </code></p>);
    assert.deepEqual(
      ShowResult({word: "qit", algo: "pig-latin", op: "encode"}),
      <p><code>Hi there, {"pig-latin"} {"encode"}s "{"qit"}" to "{"itqay"}".
      </code></p>);
    assert.deepEqual(
      ShowResult({word: "buffalo", algo: "pig-latin", op: "encode"}),
      <p><code>Hi there, {"pig-latin"} {"encode"}s "{"buffalo"}" to
        "{"uffalobay"}".</code></p>);
    assert.deepEqual(
      ShowResult({word: "ruins", algo: "pig-latin", op: "encode"}),
      <p><code>Hi there, {"pig-latin"} {"encode"}s "{"ruins"}" to "{"uinsray"}".
      </code></p>);
    assert.deepEqual(
      ShowResult({word: "suade", algo: "pig-latin", op: "encode"}),
      <p><code>Hi there, {"pig-latin"} {"encode"}s "{"suade"}" to "{"uadesay"}".
      </code></p>);

    // case 4: "qu" exception case
    assert.deepEqual(
      ShowResult({word: "quay", algo: "pig-latin", op: "encode"}),
      <p><code>Hi there, {"pig-latin"} {"encode"}s "{"quay"}" to "{"ayquay"}".
      </code></p>);
    assert.deepEqual(
      ShowResult({word: "quail", algo: "pig-latin", op: "encode"}),
      <p><code>Hi there, {"pig-latin"} {"encode"}s "{"quail"}" to "{"ailquay"}".
      </code></p>);
    assert.deepEqual(
      ShowResult({word: "shquay", algo: "pig-latin", op: "encode"}),
      <p><code>Hi there, {"pig-latin"} {"encode"}s "{"shquay"}" to
        "{"ayshquay"}".</code></p>);

    // pig_latin_decode *********************************************
    // case 1: doesn't look like pig latin - no 'ay'
    assert.deepEqual(
      ShowResult({word: "", algo: "pig-latin", op: "decode"}),
      <p><code>You do not enter a word.</code></p>);
    assert.deepEqual(
      ShowResult({word: "y", algo: "pig-latin", op: "decode"}),
      <p><code>Hi there, {"pig-latin"} {"decode"}s "{"y"}" to "{"y"}".
      </code></p>);
    assert.deepEqual(
      ShowResult({word: "sat", algo: "pig-latin", op: "decode"}),
      <p><code>Hi there, {"pig-latin"} {"decode"}s "{"sat"}" to "{"sat"}".
      </code></p>);

    // case 2: doesn't look like pig latin - no consonants/vowel+consonants before 'ay'
    assert.deepEqual(
      ShowResult({word: "ay", algo: "pig-latin", op: "decode"}),
      <p><code>Hi there, {"pig-latin"} {"decode"}s "{"ay"}" to "{"ay"}".
      </code></p>);
    assert.deepEqual(
      ShowResult({word: "say", algo: "pig-latin", op: "decode"}),
      <p><code>Hi there, {"pig-latin"} {"decode"}s "{"say"}" to "{"say"}".
      </code></p>);
    assert.deepEqual(
      ShowResult({word: "shtay", algo: "pig-latin", op: "decode"}),
      <p><code>Hi there, {"pig-latin"} {"decode"}s "{"shtay"}" to "{"shtay"}".
      </code></p>);

    // case 3: 'w' before ending 'ay'
    assert.deepEqual(
      ShowResult({word: "away", algo: "pig-latin", op: "decode"}),
      <p><code>Hi there, {"pig-latin"} {"decode"}s "{"away"}" to "{"a"}".
      </code></p>);
    assert.deepEqual(
      ShowResult({word: "astroway", algo: "pig-latin", op: "decode"}),
      <p><code>Hi there, {"pig-latin"} {"decode"}s "{"astroway"}" to "{"astro"}".
      </code></p>);
    assert.deepEqual(
      ShowResult({word: "way", algo: "pig-latin", op: "decode"}),
      <p><code>Hi there, {"pig-latin"} {"decode"}s "{"way"}" to "{"way"}".
      </code></p>);
    assert.deepEqual(
      ShowResult({word: "sway", algo: "pig-latin", op: "decode"}),
      <p><code>Hi there, {"pig-latin"} {"decode"}s "{"sway"}" to "{"sway"}".
      </code></p>);

    // case 4: 'qu' before ending 'ay'
    assert.deepEqual(
      ShowResult({word: "ayquay", algo: "pig-latin", op: "decode"}),
      <p><code>Hi there, {"pig-latin"} {"decode"}s "{"ayquay"}" to "{"quay"}".
      </code></p>);
    assert.deepEqual(
      ShowResult({word: "ailquay", algo: "pig-latin", op: "decode"}),
      <p><code>Hi there, {"pig-latin"} {"decode"}s "{"ailquay"}" to "{"lquai"}".
      </code></p>);
    assert.deepEqual(
      ShowResult({word: "aysquay", algo: "pig-latin", op: "decode"}),
      <p><code>Hi there, {"pig-latin"} {"decode"}s "{"aysquay"}" to "{"squay"}".
      </code></p>);
    assert.deepEqual(
      ShowResult({word: "ayshquay", algo: "pig-latin", op: "decode"}),
      <p><code>Hi there, {"pig-latin"} {"decode"}s "{"ayshquay"}" to "{"shquay"}".
      </code></p>);

    // case 5: consonants before 'ay' (if 3, 4 don't apply)
    assert.deepEqual(
      ShowResult({word: "aysay", algo: "pig-latin", op: "decode"}),
      <p><code>Hi there, {"pig-latin"} {"decode"}s "{"aysay"}" to "{"say"}".
      </code></p>);
    assert.deepEqual(
      ShowResult({word: "aystray", algo: "pig-latin", op: "decode"}),
      <p><code>Hi there, {"pig-latin"} {"decode"}s "{"aystray"}" to "{"stray"}".
      </code></p>);
    assert.deepEqual(
      ShowResult({word: "aysway", algo: "pig-latin", op: "decode"}),
      <p><code>Hi there, {"pig-latin"} {"decode"}s "{"aysway"}" to "{"sway"}".
      </code></p>);
  });

});
