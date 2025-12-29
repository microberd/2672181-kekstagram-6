import { displayPhotoCollection } from './thumbnails.js';

const RANDOM_PHOTOS_LIMIT = 10;
const FILTER_DELAY = 500;
const FilterType = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed'
};

let allUserPhotos = [];
let activeFilter = FilterType.DEFAULT;
let filterTimeout = null;

function selectRandomPhotos(photos) {
  const photoIndices = new Set();
  const selectedPhotos = [];

  if (photos.length <= RANDOM_PHOTOS_LIMIT) {
    return [...photos];
  }

  while (photoIndices.size < RANDOM_PHOTOS_LIMIT) {
    const randomIndex = Math.floor(Math.random() * photos.length);
    if (!photoIndices.has(randomIndex)) {
      photoIndices.add(randomIndex);
      selectedPhotos.push(photos[randomIndex]);
    }
  }

  return selectedPhotos;
}

function sortByComments(photos) {
  return [...photos].sort((firstPhoto, secondPhoto) =>
    secondPhoto.comments.length - firstPhoto.comments.length
  );
}

function applyActiveFilter() {
  let filteredResults;

  if (activeFilter === FilterType.RANDOM) {
    filteredResults = selectRandomPhotos(allUserPhotos);
  } else if (activeFilter === FilterType.DISCUSSED) {
    filteredResults = sortByComments(allUserPhotos);
  } else {
    filteredResults = allUserPhotos;
  }

  displayPhotoCollection(filteredResults);
}

function delayFilterUpdate() {
  if (filterTimeout) {
    clearTimeout(filterTimeout);
  }

  filterTimeout = setTimeout(() => {
    applyActiveFilter();
    filterTimeout = null;
  }, FILTER_DELAY);
}

function handleFilterButtonClick(clickEvent) {
  const clickedButton = clickEvent.target;

  if (!clickedButton.classList.contains('img-filters__button')) {
    return;
  }

  document.querySelectorAll('.img-filters__button').forEach((button) => {
    button.classList.remove('img-filters__button--active');
  });

  clickedButton.classList.add('img-filters__button--active');
  activeFilter = clickedButton.id;
  delayFilterUpdate();
}

function initializePhotoFilters(photos) {
  allUserPhotos = photos;

  const filterSection = document.querySelector('.img-filters');
  filterSection.classList.remove('img-filters--inactive');

  const filterButtons = document.querySelectorAll('.img-filters__button');
  filterButtons.forEach((button) => {
    button.addEventListener('click', handleFilterButtonClick);
  });
}

export { initializePhotoFilters };
