const N = 4096;

function isDark(image) {
  let count = 0;
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      if (image[i][j] >= 128) {
        count += 1;
      }
    }
  }

  return count < N * N / 2;
}

function isDarkOptimized(image) {
  let count = 0;

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      count += image[i][j] >> 7; // Works because we work with bytes 0 - 255
    }
  }

  return count < N * N / 2;
}

function randNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const image = [];
for (let i = 0; i < N; i++) {
  image.push([]);
  for (let j = 0; j < N; j++) {
    image[i].push(randNumber(0, 255));
  }
}

const time1 = performance.now();
isDark(image);
console.log(`Original: ${performance.now() - time1}`);

const time2 = performance.now();
isDarkOptimized(image);
console.log(`Optimized: ${performance.now() - time2}`);