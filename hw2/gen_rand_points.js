import { readArgs } from "./read_args.js";
import { writeFileSync } from "fs";

const args = readArgs();
const num = parseInt(args["n"]);

function randNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const points = [];
for (let i = 0; i < num; i++) {
  points.push([randNumber(0, 1000), randNumber(0, 1000)]);
}

const content = `${points.length}\n${points.map((point) => `${point[0]} ${point[1]}`).join("\n")}`
writeFileSync("./points.txt", content);