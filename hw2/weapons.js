function readInput(onEnd, regexp) {
  let input = "";

  process.stdin.on("data", data => {
    input += data.toString();
    if (input.match(regexp)) {
      onEnd(input);
      process.stdin.destroy();
    }
  });
}

const inputRegexp = /(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/;
function parseInput(input) {
  const matches = input.match(inputRegexp);

  return { X: Number(matches[1]), Y: Number(matches[2]), Z: Number(matches[3]), W: Number(matches[4]) };
}

readInput((input) => {
  const parameters = parseInput(input);

  const W = parameters.W;
  // Lightest weapon in the most inner loop will give us max optimization, because we will save max of iterations using % technique
  const [X, Y, Z] = [parameters.X, parameters.Y, parameters.Z].sort((a, b) => b - a); // This is JS assignment technique X will be now largest, Z is smallest

  const XMax = Math.floor(W / X);

  let count = 0;
  for (let x = 0; x <= XMax; x++) {
    const spaceLeft1 = W - x * X;
    const YMax = Math.floor(spaceLeft1 / Y);

    for (let y = 0; y <= YMax; y++) {
      const spaceLeft2 = spaceLeft1 - y * Y;

      // Instead of brute force we just check if some number of Z will give us desired W
      if (spaceLeft2 % Z === 0) {
        count += 1;
      }
    }
  }
  
  console.log(count);
}, inputRegexp);
