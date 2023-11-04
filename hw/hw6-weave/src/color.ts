export type Color = "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "white";


/**
 * Converts a one-character letter in ROYGBP to the appropriate Color.
 * @param ch string containing one character
 * @returns the Color corresponding to the letter
 */
export const toColor = (ch: string): Color => {
  switch (ch.charAt(0).toUpperCase()) {
    case "R":  return "red";
    case "O":  return "orange";
    case "Y":  return "yellow";
    case "G":  return "green";
    case "B":  return "blue";
    case "P":  return "purple";
    case "W":  return "white";
    default:   throw Error(`invalid color code "${ch}"`)
  }
};