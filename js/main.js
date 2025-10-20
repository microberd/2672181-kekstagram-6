const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const createIdGenerator = () => {
  let lastGeneratedId = 0;
  return () => {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
};
const generateCommentId = createIdGenerator();

const DESCRIPTIONS = [
  'Отличный день на море!', 'Закат в горах просто волшебный', 'Кофе утром - лучший старт дня',
  'Прогулка по осеннему парку', 'Мой пушистый друг', 'Городские огни ночью', 'Сказочное Бали',
  'Вкусный ужин в хорошей компании', 'Уютный вечер с книгой', 'Природа в ее лучшем проявлении',
  'Архитектурный шедевр', 'Мои спортивные достижения', 'Творческий процесс', 'Семейные моменты',
  'Музыка вдохновляет', 'Уличное искусство', 'Кулинарные эксперименты', 'Рассвет нового дня',
  'Исторические места', 'Технологии будущего', 'Романтический вечер с моей альтернативной личностью', 'Рабочие будни',
  'Отдых на природе', 'Городская жизнь', 'Редкие моменты счастья после получения стипухи'
];

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const NAMES = [
  'Иван', 'Мария', 'Алексей', 'Элой', 'Давид', 'Анна', 'Т-34', 'Матильда','Святозар', 'Коломбина', 'Михаил', 'Виктория', 'Андрей', 'Григорий', 'Зена королева воинов'
];

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

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
const photos = generatePhotos();

