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
      <p><code>{"e"}</code></p>);

    // more than 1 recursive call
    assert.deepEqual(
      ShowResult({word: "cs", algo: "cipher", op: "encode"}),
      <p><code>{"kz"}</code></p>);

    // more than 1 recursive call
    assert.deepEqual(
      ShowResult({word: "cse", algo: "cipher", op: "encode"}),
      <p><code>{"kzi"}</code></p>);

    // cipher_decode *********************************************
    // base case, nil
    assert.deepEqual(
      ShowResult({word: "", algo: "cipher", op: "decode"}),
      <p><code>You do not enter a word.</code></p>);

    // 1 recursive call
    assert.deepEqual(
      ShowResult({word: "e", algo: "cipher", op: "decode"}),
      <p><code>{"a"}</code></p>);

    // more than 1 recursive call
    assert.deepEqual(
      ShowResult({word: "kz", algo: "cipher", op: "decode"}),
      <p><code>{"cs"}</code></p>);

    // more than 1 recursive call
    assert.deepEqual(
      ShowResult({word: "kzi", algo: "cipher", op: "decode"}),
      <p><code>{"cse"}</code></p>);

    // crazy_caps_encode *********************************************
    // base case, nil
    assert.deepEqual(
      ShowResult({word: "", algo: "crazy-caps", op: "encode"}),
      <p><code>You do not enter a word.</code></p>);

    // 1 recursive call
    assert.deepEqual(
      ShowResult({word: "c", algo: "crazy-caps", op: "encode"}),
      <p><code>{"C"}</code></p>);

    // more than 1 recursive call
    assert.deepEqual(
      ShowResult({word: "cr", algo: "crazy-caps", op: "encode"}),
      <p><code>{"Cr"}</code></p>);

    // more than 1 recursive call
    assert.deepEqual(
      ShowResult({word: "crazy", algo: "crazy-caps", op: "encode"}),
      <p><code>{"CrAzY"}</code></p>);

    // crazy_caps_decode****************************************************
    // base case, nil
    assert.deepEqual(
      ShowResult({word: "", algo: "crazy-caps", op: "decode"}),
      <p><code>You do not enter a word.</code></p>);

    // 1 recursive call
    assert.deepEqual(
      ShowResult({word: "C", algo: "crazy-caps", op: "decode"}),
      <p><code>{"c"}</code></p>);

    // more than 1 recursive call
    assert.deepEqual(
      ShowResult({word: "Cr", algo: "crazy-caps", op: "decode"}),
      <p><code>{"cr"}</code></p>);

    // more than 1 recursive call
    assert.deepEqual(
      ShowResult({word: "CrAzY", algo: "crazy-caps", op: "decode"}),
      <p><code>{"crazy"}</code></p>);

    // pig_latin_encode *********************************************
    // case 1:
    // empty string, no characters
    assert.deepEqual(
      ShowResult({word: "", algo: "pig-latin", op: "encode"}),
      <p><code>You do not enter a word.</code></p>);

    // neither consonants nor vowels
    assert.deepEqual(
      ShowResult({word: "__", algo: "pig-latin", op: "encode"}),
      <p><code>{"__"}</code></p>);
    // all consonants
    assert.deepEqual(
      ShowResult({word: "str", algo: "pig-latin", op: "encode"}),
      <p><code>{"str"}</code></p>);

    // case 2: starts with a vowel
    assert.deepEqual(
      ShowResult({word: "a", algo: "pig-latin", op: "encode"}),
      <p><code>{"away"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "is", algo: "pig-latin", op: "encode"}),
      <p><code>{"isway"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "astro", algo: "pig-latin", op: "encode"}),
      <p><code>{"astroway"}</code></p>);

    // case 3: starting with consonant case
    assert.deepEqual(
      ShowResult({word: "say", algo: "pig-latin", op: "encode"}),
      <p><code>{"aysay"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "stay", algo: "pig-latin", op: "encode"}),
      <p><code>{"aystay"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "nasty", algo: "pig-latin", op: "encode"}),
      <p><code>{"astynay"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "qut", algo: "pig-latin", op: "encode"}),
      <p><code>{"utqay"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "qit", algo: "pig-latin", op: "encode"}),
      <p><code>{"itqay"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "buffalo", algo: "pig-latin", op: "encode"}),
      <p><code>{"uffalobay"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "ruins", algo: "pig-latin", op: "encode"}),
      <p><code>{"uinsray"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "suade", algo: "pig-latin", op: "encode"}),
      <p><code>{"uadesay"}</code></p>);

    // case 4: "qu" exception case
    assert.deepEqual(
      ShowResult({word: "quay", algo: "pig-latin", op: "encode"}),
      <p><code>{"ayquay"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "quail", algo: "pig-latin", op: "encode"}),
      <p><code>{"ailquay"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "shquay", algo: "pig-latin", op: "encode"}),
      <p><code>{"ayshquay"}</code></p>);

    // pig_latin_decode *********************************************
    // case 1: doesn't look like pig latin - no 'ay'
    assert.deepEqual(
      ShowResult({word: "", algo: "pig-latin", op: "decode"}),
      <p><code>You do not enter a word.</code></p>);
    assert.deepEqual(
      ShowResult({word: "y", algo: "pig-latin", op: "decode"}),
      <p><code>{"y"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "sat", algo: "pig-latin", op: "decode"}),
      <p><code>{"sat"}</code></p>);

    // case 2: doesn't look like pig latin - no consonants/vowel+consonants before 'ay'
    assert.deepEqual(
      ShowResult({word: "ay", algo: "pig-latin", op: "decode"}),
      <p><code>{"ay"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "say", algo: "pig-latin", op: "decode"}),
      <p><code>{"say"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "shtay", algo: "pig-latin", op: "decode"}),
      <p><code>{"shtay"}</code></p>);

    // case 3: 'w' before ending 'ay'
    assert.deepEqual(
      ShowResult({word: "away", algo: "pig-latin", op: "decode"}),
      <p><code>{"a"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "astroway", algo: "pig-latin", op: "decode"}),
      <p><code>{"astro"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "way", algo: "pig-latin", op: "decode"}),
      <p><code>{"way"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "sway", algo: "pig-latin", op: "decode"}),
      <p><code>{"sway"}</code></p>);

    // case 4: 'qu' before ending 'ay'
    assert.deepEqual(
      ShowResult({word: "ayquay", algo: "pig-latin", op: "decode"}),
      <p><code>{"quay"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "ailquay", algo: "pig-latin", op: "decode"}),
      <p><code>{"lquai"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "aysquay", algo: "pig-latin", op: "decode"}),
      <p><code>{"squay"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "ayshquay", algo: "pig-latin", op: "decode"}),
      <p><code>{"shquay"}</code></p>);

    // case 5: consonants before 'ay' (if 3, 4 don't apply)
    assert.deepEqual(
      ShowResult({word: "aysay", algo: "pig-latin", op: "decode"}),
      <p><code>{"say"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "aystray", algo: "pig-latin", op: "decode"}),
      <p><code>{"stray"}</code></p>);
    assert.deepEqual(
      ShowResult({word: "aysway", algo: "pig-latin", op: "decode"}),
      <p><code>{"sway"}</code></p>);
  });

});
