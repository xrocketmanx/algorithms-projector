function sinx(N, terms, x, result) {
  for (let i = 0; i < N; i++) {
    let value = x[i];
    let valuePow = x[i] * x[i];
    let numer = x[i] * x[i] * x[i];
    let denom = 6; // 3!
    let sign = -1;

    for (let j = 0; j <= terms; j++) {
      value += sign * numer / denom;
      numer *= valuePow;
      denom *= (2 * j + 2) * (2 * j + 3);
      sign *= -1;
    }
    result[i] = value;
  }
}