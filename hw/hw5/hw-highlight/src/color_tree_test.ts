import * as assert from 'assert';
import { empty, node } from './color_node';
import { makeBst, lookup} from "./color_tree";
import { explode_array } from "./list";

describe('color_tree', function() {

    // TODO: Uncomment given example tests and add more test cases

    it('make_bst', function() {
        // 0-1-many heuristic: base case
        assert.deepEqual(makeBst(explode_array([])), empty);

        // 0-1-many heuristic: 1 recursive call
        assert.deepEqual(makeBst(explode_array([
            ['blue', '#0000FF', true],
          ])), node(['blue', '#0000FF', true], empty, empty));

        // 0-1-many heuristic: more than 1 recursive call (1st)
        assert.deepEqual(makeBst(explode_array([
            ['blue', '#0000FF', true],
            ['blueviolet', '#8A2BE2', true],
        ])), node(['blueviolet', '#8A2BE2', true],
                node(['blue', '#0000FF', true], empty, empty),
             empty));

        // 0-1-many heuristic: more than 1 recursive call (2nd)
        assert.deepEqual(makeBst(explode_array([
            ['blue', '#0000FF', true],
            ['blueviolet', '#8A2BE2', true],
            ['brown', '#A52A2A', true],
        ])), node(['blueviolet', '#8A2BE2', true],
          node(['blue', '#0000FF', true], empty, empty),
          node(['brown', '#A52A2A', true], empty, empty)));

        // 0-1-many heuristic: more than 1 recursive call (3rd)
        assert.deepEqual(makeBst(explode_array([
            ['blanchedalmond', '#FFEBCD', false],
            ['blue', '#0000FF', true],
            ['blueviolet', '#8A2BE2', true],
            ['brown', '#A52A2A', true],
        ])), node(['blueviolet', '#8A2BE2', true],
          node(['blue', '#0000FF', true],
            node(['blanchedalmond', '#FFEBCD', false], empty, empty), empty),
          node(['brown', '#A52A2A', true], empty, empty)));

        // 0-1-many heuristic: more than 1 recursive call (4th)
        assert.deepEqual(makeBst(explode_array([
            ['blanchedalmond', '#FFEBCD', false],
            ['blue', '#0000FF', true],
            ['blueviolet', '#8A2BE2', true],
            ['brown', '#A52A2A', true],
            ['burlywood', '#DEB887', false],
        ])), node(['blueviolet', '#8A2BE2', true],
          node(['blue', '#0000FF', true],
            node(['blanchedalmond', '#FFEBCD', false], empty, empty), empty),
          node(['burlywood', '#DEB887', false],
            node(['brown', '#A52A2A', true], empty, empty), empty,
            )));

        // 0-1-many heuristic: more than 1 recursive call (5th)
        assert.deepEqual(makeBst(explode_array([
            ['black', '#000000', true],
            ['blanchedalmond', '#FFEBCD', false],
            ['blue', '#0000FF', true],
            ['blueviolet', '#8A2BE2', true],
            ['brown', '#A52A2A', true],
            ['burlywood', '#DEB887', false],
        ])), node(['blueviolet', '#8A2BE2', true],
          node(['blanchedalmond', '#FFEBCD', false],
            node(['black', '#000000', true], empty, empty), node(['blue', '#0000FF', true], empty, empty)),
          node(['burlywood', '#DEB887', false],
            node(['brown', '#A52A2A', true], empty, empty), empty,
          )));
    });

    it('lookup', function() {
        // base case
        // assert.deepEqual(lookup('yellow', empty), undefined);

        assert.deepEqual(lookup(
                          'yellow',
                            node(['yellow', '#FFFF00', false], empty, empty)
                          ),
                ['yellow', '#FFFF00', false]);
    });

    // TODO: copy some tests over here
});