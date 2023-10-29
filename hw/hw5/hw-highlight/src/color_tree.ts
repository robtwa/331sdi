import { List, nil, split, len } from './list';
import { ColorInfo } from './colors';
import { ColorNode, empty, node } from './color_node';

// TODO: Uncomment and complete

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

// TODO: add interfaces, classes, functions here
