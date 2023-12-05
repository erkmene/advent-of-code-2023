const assert = require("assert");

const fs = require("fs");

const parseData = (file) => {
  const rows = fs.readFileSync(file).toString().trim().split("\n");
  const chars = [...rows].map((line) => line.split(""));
  const width = chars[0].length;
  const height = chars.length;
  return { rows, chars, width, height };
};

const data = parseData("03.dat");
const testData = parseData("03.test.dat");

const findNumbers = (data) => {
  const numbers = [];
  data.rows.forEach((row, y) => {
    const regex = /[0-9]+/g;
    while ((matches = regex.exec(row)) !== null) {
      numbers.push({
        id: matches[0],
        xStart: matches.index,
        xEnd: matches.index + matches[0].length - 1,
        y,
      });
    }
  });
  return numbers;
};

assert.deepEqual(findNumbers(testData), [
  { id: "467", xStart: 0, xEnd: 2, y: 0 },
  { id: "114", xStart: 5, xEnd: 7, y: 0 },
  { id: "35", xStart: 2, xEnd: 3, y: 2 },
  { id: "633", xStart: 6, xEnd: 8, y: 2 },
  { id: "617", xStart: 0, xEnd: 2, y: 4 },
  { id: "58", xStart: 7, xEnd: 8, y: 5 },
  { id: "592", xStart: 2, xEnd: 4, y: 6 },
  { id: "755", xStart: 6, xEnd: 8, y: 7 },
  { id: "664", xStart: 1, xEnd: 3, y: 9 },
  { id: "598", xStart: 5, xEnd: 7, y: 9 },
]);

const getBoundingRect = (xStart, xEnd, yStart, yEnd, width, height) => {
  return {
    xStart: xStart - 1 < 0 ? 0 : xStart - 1,
    yStart: yStart - 1 < 0 ? 0 : yStart - 1,
    xEnd: xEnd + 1 >= width ? width - 1 : xEnd + 1,
    yEnd: yEnd + 1 >= height ? height - 1 : yEnd + 1,
  };
};

const findPartNumbers = (data) =>
  findNumbers(data).reduce((acc, cur) => {
    const { xStart, xEnd, yStart, yEnd } = getBoundingRect(
      cur.xStart,
      cur.xEnd,
      cur.y,
      cur.y,
      data.width,
      data.height
    );
    let isPartNumber = false;
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        if (data.chars[y][x].match(/[^0-9\.]/)) {
          isPartNumber = true;
        }
      }
    }
    if (isPartNumber) {
      acc.push(cur.id);
    }
    return acc;
  }, []);

const arraySum = (arr) => arr.reduce((acc, cur) => acc + parseInt(cur), 0);

assert.equal(arraySum(findPartNumbers(testData)), 4361);

const findPartsAroundGear = (data, x, y) => {
  const { xStart, xEnd, yStart, yEnd } = getBoundingRect(
    x,
    y,
    x,
    y,
    data.width,
    data.height
  );
  for (let y = yStart; y <= yEnd; y++) {
    for (let x = xStart; x <= xEnd; x++) {
      if (data.chars[y][x].match(/[^0-9\.]/)) {
        isPartNumber = true;
      }
    }
  }
};

const findGearRatios = (data) => {
  const numbers = findNumbers(data);
  const ratios = [];
  data.chars.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] === "*") {
        const gears = [];
        const bounds = getBoundingRect(x, x, y, y, data.width, data.height);
        for (let y = bounds.yStart; y <= bounds.yEnd; y++) {
          for (let x = bounds.xStart; x <= bounds.xEnd; x++) {
            const number = numbers.find(
              (n) => n.xStart <= x && n.xEnd >= x && n.y === y
            );
            if (
              number &&
              gears.filter(
                (g) => g.xStart === number.xStart && g.y === number.y
              ).length === 0
            ) {
              gears.push(number);
            }
          }
        }
        if (gears.length == 2) {
          ratios.push(parseInt(gears[0].id) * parseInt(gears[1].id));
        }
      }
    }
  });
  return ratios;
};

assert.equal(arraySum(findGearRatios(testData)), 467835);

console.log("First Answer", arraySum(findPartNumbers(data)));
console.log("Second Answer", arraySum(findGearRatios(data)));
