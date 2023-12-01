const assert = require("assert");

const fs = require("fs");

const data = fs.readFileSync("01.dat").toString().trim().split("\n");

const convertToDigit = (str) => {
  return str
    .replace("one", "1")
    .replace("two", "2")
    .replace("three", "3")
    .replace("four", "4")
    .replace("five", "5")
    .replace("six", "6")
    .replace("seven", "7")
    .replace("eight", "8")
    .replace("nine", "9");
};

const firstAndLastDigits = (str, includeWords) => {
  // Originally did this with a regex, but I had trouble with overlapping matches.
  const digits = "0123456789".split("");
  const words = "one,two,three,four,five,six,seven,eight,nine".split(",");
  const lookUp = includeWords ? digits.concat(words) : digits;

  let first, last;
  for (let i = 0; i < str.length; i++) {
    const sub = str.slice(i);
    const match = lookUp.find((l) => sub.startsWith(l));
    if (match) {
      if (!first) {
        first = match;
      }
      last = match;
    }
  }

  if (includeWords) {
    first = convertToDigit(first);
    last = convertToDigit(last);
  }
  return parseInt(first + last);
};

assert.deepEqual(firstAndLastDigits("1abc2"), 12);
assert.deepEqual(firstAndLastDigits("pqr3stu8vwx"), 38);
assert.deepEqual(firstAndLastDigits("a1b2c3d4e5f"), 15);
assert.deepEqual(firstAndLastDigits("treb7uchet"), 77);

assert.deepEqual(firstAndLastDigits("two1nine", true), 29);
assert.deepEqual(firstAndLastDigits("eightwothree", true), 83);
assert.deepEqual(firstAndLastDigits("abcone2threexyz", true), 13);
assert.deepEqual(firstAndLastDigits("xtwone3four", true), 24);
assert.deepEqual(firstAndLastDigits("4nineeightseven2", true), 42);
assert.deepEqual(firstAndLastDigits("zoneight234", true), 14);
assert.deepEqual(firstAndLastDigits("7pqrstsixteen", true), 76);

const sum = (data, includeWords) =>
  data.reduce((acc, str) => {
    const digits = firstAndLastDigits(str, includeWords);
    return acc + digits;
  }, 0);

assert.equal(sum(["1abc2", "pqr3stu8vwx", "a1b2c3d4e5f", "treb7uchet"]), 142);
assert.equal(
  sum(
    [
      "two1nine",
      "eightwothree",
      "abcone2threexyz",
      "xtwone3four",
      "4nineeightseven2",
      "zoneight234",
      "7pqrstsixteen",
    ],
    true
  ),
  281
);

// Overlapping regex matches burned me here. :(
assert.equal(
  firstAndLastDigits("eightsevenvqvzlqxkbm6rqhsgqpnine7twonex", true),
  81
);

console.log("First Answer:", sum(data));

console.log("Second Answer:", sum(data, true));
