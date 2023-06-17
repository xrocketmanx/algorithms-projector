function sinx(N, terms, x, result) {
  for (let i = 0; i < N; i++) {
    let value = x[i];
    let numer = x[i] * x[i] * x[i];
    let denom = 6; // 3!
    let sign = -1;

    for (let j = 0; j <= terms; j++) {
      value += sign * numer / denom;
      numer *= x[i] * x[i];
      denom *= (2 * j + 2) * (2 * j + 3);
      sign *= -1;
    }
    result[i] = value;
  }
}

const denoms = new Array(101);
let denom = 6;
for (let j = 0; j <= 100; j++) {
  denoms[j] = denom;
  denom *= ((2 * j + 2) * (2 * j + 3));
}

function sinxOptimized(N, terms, x, result) {
  for (let i = 0; i < N; i++) {
    let value = x[i];
    let valueQuad = value * value;
    let numer = valueQuad * value;
    let valuePow4 = numer * value;

    for (let j = 0; j < terms; j += 2) {
      value = value - numer / denoms[j] + (numer * valueQuad) / denoms[j + 1];
      numer *= valuePow4;
    }
    result[i] = value;
  }
}

const N = 100000;
const terms = 100;
const x = [];
for (let i = 0; i < N; i++) {
  x.push(Math.random() * 100);
}

const time1 = performance.now();
const res1 = [];
sinx(N, terms, x, res1)
// console.log(res1);
console.log(`Original: ${performance.now() - time1}`);

const time2 = performance.now();
const res2 = [];
sinxOptimized(N, terms, x, res2)
// console.log(res2);
console.log(`Optimized: ${performance.now() - time2}`);