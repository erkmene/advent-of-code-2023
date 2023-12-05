const assert = require("assert");

const fs = require("fs");

const parseData = (file) =>
  fs
    .readFileSync(file)
    .toString()
    .trim()
    .split("\n")
    .map((str) => {
      let [id, list] = str.split(": ");
      id = id.match(/[0-9]+/)[0];

      const [winning, chosen] = list.split(" | ");
      return {
        id: parseInt(id),
        winning: winning
          .split(" ")
          .filter((x) => x !== "")
          .map((x) => parseInt(x)),
        chosen: chosen
          .split(" ")
          .filter((x) => x !== "")
          .map((x) => parseInt(x)),
      };
    });

const data = parseData("04.dat");
const testData = parseData("04.test.dat");

const winningNumbers = (data) => {
  const numbers = [];
  data.forEach((card) => {
    const intersection = card.winning.filter((x) => card.chosen.includes(x));
    numbers.push(intersection);
  });
  return numbers;
};

assert.deepEqual(winningNumbers(testData), [
  [48, 83, 86, 17],
  [32, 61],
  [1, 21],
  [84],
  [],
  [],
]);

const sumOfPowers = (winningNumbers) =>
  winningNumbers.reduce((acc, card) => {
    if (card.length === 0) {
      return acc;
    } else {
      acc += Math.pow(2, card.length - 1);
      return acc;
    }
  }, 0);

assert.equal(sumOfPowers(winningNumbers(testData)), 13);

const processCard = (card, cards) => {
  const intersection = card.winning.filter((x) => card.chosen.includes(x));
  let nextCards;
  if (intersection.length === 0) {
    nextCards = [];
  } else {
    nextCards = cards.slice(card.id, card.id + intersection.length);
  }
  const cardIds = nextCards.map((card) => card.id);
  return cardIds;
};

const processCards = (cards) => {
  const lookup = {};
  const counts = {};

  cards.forEach((card) => {
    lookup[card.id] = card;
    counts[card.id] = 1;
  });

  let index = 0;

  while (cards[index]) {
    const cardId = cards[index]?.id;
    const count = counts[cardId];

    const result = processCard(lookup[cardId], cards);
    result.forEach((id) => {
      counts[id] += count;
    });

    index++;
  }

  let sum = 0;
  sum += Object.keys(counts).reduce((acc, cur) => acc + counts[cur], 0);

  return { counts, sum };
};

assert.equal(processCards(testData).sum, 30);

console.log("First Answer", sumOfPowers(winningNumbers(data)));
console.log("Second Answer", processCards(data).sum);
