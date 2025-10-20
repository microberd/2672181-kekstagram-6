import { getRandomInteger, createIdGenerator, getRandomArrayElement } from './util.js';
import { DESCRIPTIONS, MESSAGES, NAMES } from './data.js';

const generateCommentId = createIdGenerator();

const createComment = () => ({
  id: generateCommentId(),
  avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
  message: getRandomArrayElement(MESSAGES),
  name: getRandomArrayElement(NAMES)
});

const createComments = () => {
  const commentsCount = getRandomInteger(0, 30);
  return Array.from({length: commentsCount}, createComment);
};

const createPhoto = (index) => ({
  id: index + 1,
  url: `photos/${index + 1}.jpg`,
  description: DESCRIPTIONS[index],
  likes: getRandomInteger(15, 200),
  comments: createComments()
});

const generatePhotos = () => Array.from({length: 25}, (_, index) => createPhoto(index));
export const photos = generatePhotos();

