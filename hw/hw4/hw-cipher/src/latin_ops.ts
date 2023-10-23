import {List, nil, cons, concat} from './list';
import {explode} from "./char_list";
import {prefix, suffix} from "./list_ops";

/** Determines whether the given character is a vowel. */
const is_latin_vowel = (c: number): boolean => {
    const ch = String.fromCharCode(c).toLowerCase();
    return "aeiouy".indexOf(ch) >= 0;
};

/** Determines whether the given character is a Latin consonant. */
const is_latin_consonant = (c: number): boolean => {
    const ch = String.fromCharCode(c).toLowerCase();
    return "bcdfghjklmnpqrstvwxz".indexOf(ch) >= 0;
};

/** Changes most Latin alphabetic characters to different ones. */
export const next_latin_char = (c: number): number => {
    switch (String.fromCharCode(c)) {
        case "a": return "e".charCodeAt(0);
        case "e": return "i".charCodeAt(0);
        case "i": return "o".charCodeAt(0);
        case "o": return "u".charCodeAt(0);
        case "u": return "y".charCodeAt(0);
        case "y": return "a".charCodeAt(0);

        case "b": return "p".charCodeAt(0);
        case "p": return "j".charCodeAt(0);
        case "j": return "g".charCodeAt(0);
        case "g": return "d".charCodeAt(0);
        case "d": return "t".charCodeAt(0);
        case "t": return "b".charCodeAt(0);

        case "c": return "k".charCodeAt(0);
        case "k": return "s".charCodeAt(0);
        case "s": return "z".charCodeAt(0);
        case "z": return "c".charCodeAt(0);

        case "f": return "v".charCodeAt(0);
        case "v": return "w".charCodeAt(0);
        case "w": return "f".charCodeAt(0);

        case "h": return "l".charCodeAt(0);
        case "l": return "r".charCodeAt(0);
        case "r": return "h".charCodeAt(0);

        case "m": return "n".charCodeAt(0);
        case "n": return "m".charCodeAt(0);

        case "q": return "x".charCodeAt(0);
        case "x": return "q".charCodeAt(0);

        default: return c;
    }
};

/** Inverse of next_char. */
export const prev_latin_char = (c: number): number => {
    switch (String.fromCharCode(c)) {
        case "a": return "y".charCodeAt(0);
        case "e": return "a".charCodeAt(0);
        case "i": return "e".charCodeAt(0);
        case "o": return "i".charCodeAt(0);
        case "u": return "o".charCodeAt(0);
        case "y": return "u".charCodeAt(0);

        case "b": return "t".charCodeAt(0);
        case "p": return "b".charCodeAt(0);
        case "j": return "p".charCodeAt(0);
        case "g": return "j".charCodeAt(0);
        case "d": return "g".charCodeAt(0);
        case "t": return "d".charCodeAt(0);

        case "c": return "z".charCodeAt(0);
        case "k": return "c".charCodeAt(0);
        case "s": return "k".charCodeAt(0);
        case "z": return "s".charCodeAt(0);

        case "f": return "w".charCodeAt(0);
        case "v": return "f".charCodeAt(0);
        case "w": return "v".charCodeAt(0);

        case "h": return "r".charCodeAt(0);
        case "l": return "h".charCodeAt(0);
        case "r": return "l".charCodeAt(0);

        case "m": return "n".charCodeAt(0);
        case "n": return "m".charCodeAt(0);

        case "q": return "x".charCodeAt(0);
        case "x": return "q".charCodeAt(0);

        default: return c;
    }
};

// Note: count_consonants() and AY are provided to help you implement
// pig_latin_encode and pig_latin_decode

/** Returns the number of consonants at the start of the given string */
export const count_consonants = (L: List<number>): number|undefined => {
    if (L === nil) {
        return undefined;
    } else if (is_latin_vowel(L.hd)) {
        return 0;
    } else if (is_latin_consonant(L.hd)) {
        const n = count_consonants(L.tl);
        if (n === undefined) {
            return undefined;
        } else {
            return n + 1;
        }
    } else {
        return undefined;
    }
};

// TODO: uncomment to use
// List containing the character codes for the string "AY".
// const AY: List<number> = cons("a".charCodeAt(0), cons("y".charCodeAt(0), nil));


// TODO: add your function declarations in this file for: 
// cipher_encode, cipher_decode crazy_caps_encode, crazy_caps_decode,
// pig_latin_encode, pig_latin_decode
export const pig_latin_encode = (L: List<number>): List<number> => {
    if (L === nil) {
        return nil;
    }

    const N = count_consonants(L);
    if(N === undefined) { // neither consonants nor vowels
        return L;
    }
    if (N === 0) {  // starts with a vowel
        return concat(L, explode("way"));
    }
    else {  // starting with consonant case
        if(is_qu_case(L, N)) { // is the "qu" exception case
            return concat(concat(suffix(N+1, L), prefix(N+1, L)), explode("ay"));
        }
        else { // is not the "qu" exception case
            return concat(concat(suffix(N, L), prefix(N, L)), explode("ay"));
        }
    }
};

/**
 *  if the last of the n ≥ 1 consonant is a “q”,
 *      and the first vowel is a “u”,
 *      and the “u” is followed by another vowel,
 *
 *  then move the “u” with the consonants as well,
 *  e.g., “quay” becomes “ayquay”, not “uayqay”.
 */
const is_qu_case = (L: List<number>, N: number): boolean => {
    // is_q_the_last_conso
    const seg1 = prefix(N, L);
    if (!is_q_the_last_conso(seg1, N)) {
        return false;
    }

    const seg2 = suffix(N, L);
    // is_u_the_first_vowel
    if(!is_u_the_first_vowel(seg2)){
        return false;
    }

    // is_u_followed_a_vowel
    return is_u_followed_a_vowel(seg2);

}

const is_q_the_last_conso = (L: List<number>, N: number): boolean => {
    // check
    if (L === nil) {
        return false;
    }

    // base case
    if (N === 1) {
        return L.hd === "q".charCodeAt(0);
    }

    // recursive case
    return is_q_the_last_conso(L.tl, N - 1);
}

const is_u_the_first_vowel = (L: List<number>): boolean => {
    // check
    if (L === nil) {
        return false;
    }

    return L.hd === "u".charCodeAt(0);
}

const is_u_followed_a_vowel = (L: List<number>): boolean => {
    // check
    if (L === nil) {
        return false;
    }

    if (L.tl === nil) {
        return false;
    }

    return is_latin_vowel(L.tl.hd);
}

/**
 * returns a list of the same length but with each character replaced by the
 * ‘next’ Latin character.
 */
export const cipher_encode = (L: List<number>): List<number> => {
    // Base case
    if (L === nil) {
        return nil;
    }

    // Recursive case
    return cons(next_latin_char(L.hd), cipher_encode(L.tl));
};

/**
 * returns a list of the same length but with each character replaced by the
 * ‘previous’ Latin character
 */
export const cipher_decode = (L: List<number>): List<number> => {
    // Base case
    if (L === nil) {
        return nil;
    }

    // Recursive case
    return cons(prev_latin_char(L.hd), cipher_decode(L.tl));
};

/**
 * returns a list of the same length but with every other character,
 * starting with the first, made upper case
 */
export const crazy_caps_encode = (L: List<number>): List<number> => {
    // Base case
    if (L === nil) {
        return nil;
    }
    // Recursive case
    // Calling the helper function.
    return cons(String.fromCharCode(L.hd).toUpperCase().charCodeAt(0),
      encode_skip(L.tl));
};

/**
 * Helper function for crazy_caps_encode()
 * Return a list to crazy_caps_encode() after skipping one character;
 */
export const encode_skip = (L: List<number>): List<number> => {
    // Base case
    if (L === nil) {
        return nil;
    }

    // Recursive case
    return cons(L.hd, crazy_caps_encode(L.tl));
};

/**
 * returns a list of the same length but with every other character,
 * starting with the first, made lower case
 */
export const crazy_caps_decode = (L: List<number>): List<number> => {
    // Base case
    if (L === nil) {
        return nil;
    }

    // Recursive case
    return cons(String.fromCharCode(L.hd).toLowerCase().charCodeAt(0),
      decode_skip(L.tl));
};

/**
 * Helper function for crazy_caps_decode()
 * Return a list to crazy_caps_decode() after skipping one character;
 */
export const decode_skip = (L: List<number>): List<number> => {
    // Base case
    if (L === nil) {
        return nil;
    }

    // Recursive case
    return cons(L.hd, crazy_caps_decode(L.tl));
};
