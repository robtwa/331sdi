// Given function definitions

// func concat([])               := []
//      concat(R ⧺ [[]])         := concat(R)
//      concat(R ⧺ [A ⧺ [w]])    := concat(R ⧺ [A]) ⧺ [w]
// •	n = R.length
// •	m = A.length
export const concat = (R: string[][] ): string[] => {
  let S: string[] = [];
  let j: number = 0;
  // {{ P1 : S = [] and j = 0 }}
  // {{ Inv1: S = concat(R[0 .. j − 1]) }}
  while (j !== R.length) {
    const A: string[] = R[j];
    let k: number = 0;
    // {{ P2: S = [] and Inv1 and j = 0 ↔ j ≠ n and n > 0 and A = R[j] and k = 0 }}
    // {{ Inv2: S = concat(R[0 .. j − 1]) ++ A[0 .. k − 1] }}
    while (k !== A.length) {
      // {{ S = [] and j = 0 ↔ j ≠ n and n > 0 and A = R[j] and Inv2 and k < m ↔ k ≤ m - 1 ↔  k ≠ m and m > 0 }}
      S.push(A[k]);
      // {{ j = 0 ↔ j ≠ n and n > 0 and A = R[j] and Inv2 and k < m ↔ k ≠ m and m > 0 and S = [] ⧺ A[0.. m - 1] }}
      k = k + 1;
      // {{ P3 : j = 0 ↔ j ≠ n and n > 0 and A = R[j] and Inv2 and m > 0 and S = [] ⧺ A[0 .. m - 1] and k ≤ m}}
    }
    // {{ P4 : Inv1 and j = 0 ↔ j ≠ n and n > 0 and A = R[j] and S = [] ⧺ A[0 .. j - 1]}}
    // {{ Q : Inv1 and n > 0 and j + 1 ≤ n }} // backward reasoning
    j = j + 1;
  }
  // {{ P5 : Inv1 and j = n }}
  // {{ Post: S = concat(R) }}

  return S;
}

// Sum of an Array
// func sum([]) :=	0
//      sum(A	⧺	[y]) :=	sum(A)	+	y   for	any	y	:	ℤ	and	A	:	Arrayℤ
export const sum = (A: number[]) =>{
  let j: number = 0;
  let s: number = 0;
  // {{	Inv:	s	=	sum(A[0	..	j	– 1])	and	0	≤	j	≤	A.length }}
  while (j < A.length) {
    s = s + A[j];
    j = j + 1;
  }
  // {{	s	=	sum(A)	}}
  return s;
}

