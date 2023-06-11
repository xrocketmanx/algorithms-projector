const N = 4096;

function isDark(image) {
  let count = 0;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (image[i][j] >= 128) {
        count += 1;
      }
    }
  }

  return count < N * N / 2
}

// Restructured to break early
function isDarkOptimized(image) {
  const threshold =  N * N / 2;
  let count = 0;

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j += 2) {
      if (image[i][j] >= 128) {
        count++;

        if (count >= threshold) {
          return false;
        }
      }
    }
  }

  return true;
}

function randNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const image = [];
const colorsMax = 255 * 255 * 255;
for (let i = 0; i < N; i++) {
  image.push([]);
  for (let j = 0; j < N; j++) {
    image[i].push(randNumber(0, colorsMax));
  }
}

const time1 = performance.now();
isDark(image);
console.log(`Original: ${performance.now() - time1}`);

const time2 = performance.now();
isDarkOptimized(image);
console.log(`Optimized: ${performance.now() - time2}`);