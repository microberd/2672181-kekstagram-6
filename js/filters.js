import { showPhotos } from './thumbnails.js';

const filters = document.querySelector('.img-filters');
const filterButtons = filters.querySelectorAll('.img-filters__button');

let allPhotos = [];
let currentFilter = 'default';
let timeoutId = null;

function getRandomPhotos(photos) {
  const shuffled = [...photos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10);
}

function getDiscussedPhotos(photos) {
  return [...photos].sort((a, b) => b.comments.length - a.comments.length);
}

function applyFilter() {
  let filteredPhotos = [];

  if (currentFilter === 'random') {
    filteredPhotos = getRandomPhotos(allPhotos);
  } else if (currentFilter === 'discussed') {
    filteredPhotos = getDiscussedPhotos(allPhotos);
  } else {
    filteredPhotos = allPhotos;
  }

  showPhotos(filteredPhotos);
}

function debounceFilter() {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(applyFilter, 500);
}

function onFilterClick(evt) {
  const button = evt.target;

  if (!button.classList.contains('img-filters__button')) {
    return;
  }

  filterButtons.forEach((btn) => {
    btn.classList.remove('img-filters__button--active');
  });

  button.classList.add('img-filters__button--active');

  currentFilter = button.id.replace('filter-', '');

  debounceFilter();
}

function initFilters(photos) {
  allPhotos = photos;

  filters.classList.remove('img-filters--inactive');

  filterButtons.forEach((button) => {
    button.addEventListener('click', onFilterClick);
  });
}

export { initFilters };
