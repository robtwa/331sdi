import { List, nil, split, len } from './list';
import { ColorInfo, COLORS } from './colors';
import { ColorNode, empty, node } from './color_node';
import { ColorList, findMatchingNamesIn } from './color_list';

// TODO: Uncomment and complete
// TODO: add interfaces, classes, functions here
/**
 * Returns the ColorNode, which is a BST type for colors
 *
 * @param L List of ColorNode that is a BST type for colors
 * @throws Error if the split function returns an empty list S.
 * @returns ColorNode a BST converted from the given list of ColorInfo.
 */
export const makeBst = (L: List<ColorInfo>): ColorNode => {
  if (L === nil) {  // base case
    return empty;
  }
  else {  // recursive case
    const M = Math.floor(len(L)/2);
    const [P, S] = split(M, L);
    if (S === nil) {
      throw new Error("split() returns an empty S.");
    }

    if (P !== nil && P.hd > S.hd) {
      return node(P.hd, makeBst(S), makeBst(P.tl));
    }

    return node(S.hd, makeBst(P), makeBst(S.tl));
  }
};

/**
 * Returns the found ColorInfo if the specified color name is found in the BST,
 * otherwise returns undefined.
 *
 * @param y Text used to find colors in the ColorNode BST.
 * @param root ColorNode, the root of the given ColorNode BST.
 * @returns ColorInfo of the found color text
 *          undefined if the color text is not in the ColorNode BST
 */
export const lookup = (y: string, root: ColorNode): ColorInfo | undefined => {
  // base case
  if (root === empty) {
    return undefined;
  }

  const [color, _css, _foreground] = root.info;
  if (y.toLowerCase() === color.toLowerCase()) {  // base case
    return root.info;
  }
  else if (y.toLowerCase() < color.toLowerCase()) { // recursive cases: y < color
    return lookup(y, root.before);
  }
  else {  // recursive cases: color < y
    return lookup(y, root.after);
  }
};

// Implementation of the color tree.
// Invariants are already part of the node definition and
// do not need to be repeated in the class.
class ColorTree implements ColorList {
  // AF: obj = this.bst
  readonly colors: List<ColorInfo>;
  readonly bst: ColorNode;

  // Creates an instance of BST with the given colors.
  constructor(colors: List<ColorInfo>) {
    this.bst = makeBst(colors);
    this.colors = colors;
  }

  findMatchingNames = (text: string): List<string> => {
    return findMatchingNamesIn(text, this.colors);
  };

  // Returns the colors from the (first) BST with this color name. Throws
  // an Error none is found (i.e., we hit the end of the tree).
  // @param name The name in question.
  // @throws Error if no item in colors has the given name.
  // @throws Error If the color name found is different from the given color name.
  // @return The first item in colors whose name matches the given name.
  getColorCss(name: string): readonly [string, string] {
    const res:ColorInfo | undefined = lookup(name, this.bst);
    if (res === undefined) {
      throw new Error(`no color called "${name}"`);
    }
    const [color, css, foreground] = res;
    if (color === name) {
      return [css, foreground ? '#F0F0F0' : '#101010'];
    } else {
      throw new Error(`Incorrect color name "${name}"`);
    }
  }
}

// Creates an instance of ColorTree with the “singleton” pattern
const instanceOfCT: ColorTree = new ColorTree(COLORS);
/**
 * Returns the same instance of ColorTree.
 */
export const makeColorTree = (): ColorTree => {
  return instanceOfCT;
}