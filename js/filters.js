import { showPhotos } from './thumbnails.js';

const RANDOM_PHOTOS_COUNT = 10;
const DEBOUNCE_DELAY = 500;

const FilterType = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed'
};

let allPhotos = [];
let currentFilter = FilterType.DEFAULT;
let timeoutId = null;

function getRandomPhotos(photos) {
  const selectedIndexes = new Set();
  const result = [];

  if (photos.length <= RANDOM_PHOTOS_COUNT) {
    return [...photos];
  }

  while (selectedIndexes.size < RANDOM_PHOTOS_COUNT) {
    const randomIndex = Math.floor(Math.random() * photos.length);
    if (!selectedIndexes.has(randomIndex)) {
      selectedIndexes.add(randomIndex);
      result.push(photos[randomIndex]);
    }
  }

  return result;
}

function getDiscussedPhotos(photos) {
  return [...photos].sort((a, b) => b.comments.length - a.comments.length);
}

function applyFilter() {
  let filteredPhotos;

  if (currentFilter === FilterType.RANDOM) {
    filteredPhotos = getRandomPhotos(allPhotos);
  } else if (currentFilter === FilterType.DISCUSSED) {
    filteredPhotos = getDiscussedPhotos(allPhotos);
  } else {
    filteredPhotos = allPhotos;
  }

  showPhotos(filteredPhotos);
}

function debounceFilter() {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    applyFilter();
    timeoutId = null;
  }, DEBOUNCE_DELAY);
}

function onFilterClick(evt) {
  const button = evt.target;

  if (!button.classList.contains('img-filters__button')) {
    return;
  }

  document.querySelectorAll('.img-filters__button').forEach((btn) => {
    btn.classList.remove('img-filters__button--active');
  });

  button.classList.add('img-filters__button--active');
  currentFilter = button.id;
  debounceFilter();
}

function initFilters(photos) {
  allPhotos = photos;

  const filters = document.querySelector('.img-filters');
  filters.classList.remove('img-filters--inactive');

  const buttons = document.querySelectorAll('.img-filters__button');
  buttons.forEach((button) => {
    button.addEventListener('click', onFilterClick);
  });
}

export { initFilters };
