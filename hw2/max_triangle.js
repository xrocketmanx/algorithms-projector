function readLines(onEnd) {
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

function parseInput(lines) {
  const pointsCount = parseInt(lines[0][0]);
  const points = lines.slice(1).map(([x, y]) => [parseInt(x), parseInt(y)]);

  return { pointsCount, points };
}

readLines((lines) => {
  const { pointsCount, points } = parseInput(lines);

  console.log(solveConvexHull(pointsCount, points));
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

// I found this when I looked how to find "edge" points of a points set
// We get convex hull verticles. We can skip all other points when looking for biggest triangles. 
// This reduces complexity a lot for randomly distributed points.
function solveConvexHull(pointsCount, points) {
  const hull = convexHull(pointsCount, points);
  return solveBrute(hull.length, hull);
}

// Points that create smallest polygon that wraps all other points
// Jarvis algorithm - we choose left point and go counterclockwise
function convexHull(pointsCount, points)
{     
  const hull = [];
    
  // Find the leftmost point
  let left = 0;
  for (let i = 1; i < pointsCount; i++) {
    if (points[i][0] < points[left][0]) {
      left = i;
    }
  }
    
  // We move counter clockwise starting from left point
  let current = left;
  let candidate;
  do {
    hull.push(points[current]);
  
    // Search for a point 'q' such that 
    // orientation(p, q, x) is counterclockwise 
    // for all points 'x'.
    candidate = (current + 1) % pointsCount;
        
    for (let i = 0; i < pointsCount; i++)
    {
      // If i is more counterclockwise than 
      // candidate we need to update candidate
      if (orientation(points[current], points[i], points[candidate]) == 2) {
        candidate = i;
      }
    }
  
    // Move to the next convex hull point
    current = candidate;
    
  } while (current !== left);  // Moving until reach starting point

  return hull;
}

// https://www.geeksforgeeks.org/orientation-3-ordered-points/
function orientation(p, q, r)
{
  const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);      
  if (val == 0) return 0;  // collinear
  return val > 0 ? 1 : 2; // clock or counterclock wise
}

// Faster solution failed attempt 2. N^2 often gives correct answer, but occasionally only close to correct
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