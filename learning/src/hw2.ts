type Color = "red" | "green" | "blue";
export const f1 = (color?: Color): number => {
  switch (color) {
    case "red":
      return 1;
    case "green":
      return 2;
    case "blue":
      return 3;
    default:
      return 0;
  }
}

export const f2 = (color: Color, x: number): number => {
  switch (color) {
    case "red":
      return x;
    case "green":
      return -x;
    case "blue":
      return 0;
  }
}

export const f3 = (color1: Color, color2: Color): number => {
  return f2(color1, 5) + f2(color2, 7);
}

export const f4 = (A: number[]): number => {
  if (A.length === 0) {
    return 0;
  } else {
    return A[0] + f4(A.slice(1));
  }
}

export const f5 = (n: number): number => {
  if (n <= 0) {
    return 0;
  } else {
    return f5(n - 1) + 2 * n - 1;
  }
}

export const f6 = (n: number): number => {
  if (n === 0) {
    return 0;
  } else if (n % 3 === 0) { // n > 0 is a multiple of 3
    return f6(n - 3) + 1;
  } else if (n % 3 === 1) { // n - 1 is a multiple of 3
    return f6(n - 1);
  } else { // n - 2 is a multiple of 3
    return f6(n - 2);
  }
}
