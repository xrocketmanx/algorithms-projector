export function readLines(onEnd) {
  const allLines = [];

  process.stdin.on("data", data => {
    const lines = data.toString().trim().split("\n");
    for (const line of lines) {
      if (line.trim()) {
        allLines.push(line.trim().split(" "))
      }
    }
  });
  
  process.stdin.on("end", () => {
    onEnd(allLines);
  });
}

export function readInput(onEnd, regexp) {
  let input = "";

  process.stdin.on("data", data => {
    input += data.toString();
    if (input.match(regexp)) {
      onEnd(input);
      process.stdin.destroy();
    }
  });
}
