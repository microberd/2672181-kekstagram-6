import { photos } from './main.js';

function makePhotoElement(photo) {
  const template = document.querySelector('#picture').content;
  const element = template.cloneNode(true);
  element.querySelector('.picture__img').src = photo.url;
  element.querySelector('.picture__img').alt = photo.description;
  element.querySelector('.picture__likes').textContent = photo.likes;
  element.querySelector('.picture__comments').textContent = photo.comments.length;
  return element;
}

function showPhotos() {
  const picturesContainer = document.querySelector('.pictures');
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < photos.length; i++) {
    const photoElement = makePhotoElement(photos[i]);
    fragment.appendChild(photoElement);
  }
  picturesContainer.appendChild(fragment);
}
export { showPhotos };
