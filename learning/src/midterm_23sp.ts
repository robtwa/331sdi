
export const findIndex = (A: string[], x: string): number => {
  let k: number = A.length;

  // Px is using forward reasoning
  // {{ P1 : k = n }}
  // {{ Inv: x ≥ A[j] for any k ≤ j < n and k ≥ 0 }}
  while (k !== 0 && x >= A[k - 1]) {
    // {{ P2 : x ≥ A[j]     for any k ≤ j < n
    //    and k ≥ 0
    //    and k 6 = 0
    //    and x ≥ A[k − 1] }}
    checkInv(A, k, x);

    // {{ Q2 : x ≥ A[j] for any k − 1 ≤ j < n and k − 1 ≥ 0 }}
    k = k - 1;
    // {{ x ≥ A[j] for any k ≤ j < n and k ≥ 0 }}
  }
  // {{ P3 : x ≥ A[j]     for any k ≤ j < n
  //         and k ≥ 0 and (k = 0 or A[k − 1] > x) }}

  // Qx is using backward reasoning
  // {{ Q3 : A[j] > x       for any 0 ≤ j < k
  //         and x ≥ A[j]   for any k ≤ j < n }}
  return k;
}

const checkInv = (A: string[], k: number, x: string) => {

  if(!(k >= 0)){
    throw new Error("broken, k = " + k + " >= " + 0)
  }

  const j = k-1;
  if (!(x >= A[j])) {
    throw new Error("broken, x = " + x + " >= A[j] = " + A[j])
  }
}


