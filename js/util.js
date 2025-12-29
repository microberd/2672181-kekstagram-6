function generateRandomInteger(minValue, maxValue) {
  const lowerBound = Math.ceil(Math.min(Math.abs(minValue), Math.abs(maxValue)));
  const upperBound = Math.floor(Math.max(Math.abs(minValue), Math.abs(maxValue)));
  return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
}

function createIdGenerator() {
  let lastGeneratedId = 0;
  return function generateNextId() {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
}

function getRandomElement(array) {
  return array[generateRandomInteger(0, array.length - 1)];
}

export { generateRandomInteger, createIdGenerator, getRandomElement };
