import { readLines } from "./read_input.js";

function parseInput(lines) {
  const pointsCount = parseInt(lines[0][0]);
  const points = lines.slice(1).map(([x, y]) => [parseInt(x), parseInt(y)]);

  return { pointsCount, points };
}

readLines((lines) => {
  const { pointsCount, points } = parseInput(lines);

  console.log(solveBrute(pointsCount, points));
});

// Try every combination of 3 points, n^3
function solveBrute(pointsCount, points) {
  let maxPerimeter = 0;

  for (let i = 0; i < pointsCount; i++) {
    for (let j = i + 1; j < pointsCount; j++) {
      for (let k = j + 1; k < pointsCount; k++) {
        const perimeter = trianglePerimeter(points[i], points[j], points[k]);
        if (perimeter > maxPerimeter) {
          maxPerimeter = perimeter;
        }
      }
    }
  }
  
  return maxPerimeter;
}

function trianglePerimeter(pointA, pointB, pointC) {
  return distance(pointA, pointB) + distance(pointB, pointC) + distance(pointC, pointA);
}

function distance(pointA, pointB) {
  return Math.hypot(pointB[0] - pointA[0], pointB[1] - pointA[1]);
}

// Faster solution attempt 2. N^2 often gives correct answer, but occasionally only close to correct
function solveLongestLine(points) {
  let longestLine = [points[0], points[1]];
  let longestDistance = 0;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const d = distance(points[i], points[j]);
      if (d > longestDistance) {
        longestDistance = d;
        longestLine = [points[i], points[j]];
      }
    }
  }

  let maxPerimeter = 0;
  for (let i = 0; i < points.length; i++) {
    const perimeter = trianglePerimeter(longestLine[0], longestLine[1], points[i]);
    if (perimeter > maxPerimeter) {
      maxPerimeter = perimeter;
    }
  }

  return maxPerimeter;
}

// This it a failed attempt to find solution which works fast, it works only for some cases. For other cases it give answers close to correct
// Linear complexity: N to find K extreme points, brute force to solve for K points = C
function solveExtremePoints(pointsCount, points) {
  // If find points at extreme coordinates we can get triangles with longest edges
  let maxXYWithLessX = points[0];
  let maxXYWithLessY = points[0];
  let minXYWithLessX = points[0];
  let minXYWithLessY = points[0];
  let maxX = points[0];
  let maxY = points[0];
  let minX = points[0];
  let minY = points[0];
  let closestLeftTop = points[0];
  let closetsRightTop = points[0];
  let closestRightBottom = points[0];
  let closestLeftBottom = points[0];

  for (let i = 1; i < pointsCount; i++) {
    if (points[i][0] <= points[i][1] && pointValue(points[i]) > pointValue(maxXYWithLessX)) {
      maxXYWithLessX = points[i];
    }
    if (points[i][1] <= points[i][0] && pointValue(points[i]) > pointValue(maxXYWithLessY)) {
      maxXYWithLessY = points[i];
    }
    if (points[i][0] <= points[i][1] && pointValue(points[i]) < pointValue(minXYWithLessX)) {
      minXYWithLessX = points[i];
    }
    if (points[i][1] <= points[i][0] && pointValue(points[i]) < pointValue(minXYWithLessY)) {
      minXYWithLessY = points[i];
    }
    if (points[i][0] > maxX[0]) {
      maxX = points[i];
    }
    if (points[i][1] > maxY[1]) {
      maxY = points[i];
    }
    if (points[i][0] < minX[0]) {
      minX = points[i];
    }
    if (points[i][1] < minY[1]) {
      minY = points[i];
    }
    if (distance([0, 0], points[i]) < distance([0, 0], closestLeftTop)) {
      closestLeftTop = points[i];
    }
    if (distance([1000, 0], points[i]) < distance([1000, 0], closetsRightTop)) {
      closetsRightTop = points[i];
    }
    if (distance([1000, 1000], points[i]) < distance([1000, 1000], closestRightBottom)) {
      closestRightBottom = points[i];
    }
    if (distance([1000, 0], points[i]) < distance([1000, 0], closestLeftBottom)) {
      closestLeftBottom = points[i];
    }
  }
  
  return solveBrute(12, [
    maxXYWithLessX, 
    maxXYWithLessY, 
    minXYWithLessX,
    minXYWithLessY,
    maxX,
    maxY, 
    minX, 
    minY, 
    closestLeftTop, 
    closetsRightTop, 
    closestRightBottom, 
    closestLeftBottom
  ]);
}

function pointValue(point) {
  return point[0] + point[1];
}