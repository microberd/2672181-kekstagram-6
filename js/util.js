const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const createIdGenerator = () => {
  let lastGeneratedId = 0;
  return () => {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

export { getRandomInteger, createIdGenerator, getRandomArrayElement };

