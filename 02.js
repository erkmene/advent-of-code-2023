const assert = require("assert");

const fs = require("fs");
const { get } = require("http");

const parseData = (file) =>
  fs
    .readFileSync(file)
    .toString()
    .trim()
    .split("\n")
    .map((str) => {
      const [id, list] = str.split(": ");
      const turns = list.split("; ");
      return turns.map((turn) => {
        const cubes = {
          red: 0,
          green: 0,
          blue: 0,
        };
        turn.split(", ").forEach((cube) => {
          const [num, color] = cube.split(" ");
          cubes[color] = parseInt(num);
        });
        return cubes;
      });
    });

const data = parseData("02.dat");
const testData = parseData("02.test.dat");

const getPossibleGameIds = (
  games,
  limits = { red: 12, green: 13, blue: 14 }
) => {
  const possibleGameIds = [];
  games.forEach((game, index) => {
    const isPossible = game.reduce((acc, cur) => {
      return (
        acc &&
        cur.red <= limits.red &&
        cur.green <= limits.green &&
        cur.blue <= limits.blue
      );
    }, true);
    if (isPossible) possibleGameIds.push(index + 1);
  });
  return possibleGameIds;
};

assert.deepEqual(getPossibleGameIds(testData), [1, 2, 5]);

const getMinimumNumberOfCubes = (games) =>
  games.map((game, index) => {
    const min = { red: 0, green: 0, blue: 0 };
    game.forEach((hand) => {
      ["red", "green", "blue"].forEach((color) => {
        min[color] = Math.max(min[color], hand[color]);
      });
    });
    return min;
  });

assert.deepEqual(getMinimumNumberOfCubes(testData), [
  { red: 4, green: 2, blue: 6 },
  { red: 1, green: 3, blue: 4 },
  { red: 20, green: 13, blue: 6 },
  { red: 14, green: 3, blue: 15 },
  { red: 6, green: 3, blue: 2 },
]);

console.log(
  "First answer:",
  getPossibleGameIds(data).reduce((acc, cur) => acc + cur, 0)
);

console.log(
  "Second answer:",
  getMinimumNumberOfCubes(data).reduce(
    (acc, cur) => acc + cur.red * cur.green * cur.blue,
    0
  )
);
