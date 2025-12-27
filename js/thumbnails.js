import { showBigPhoto } from './fullscreen.js';

function createPhotoElement(data) {
  const template = document.querySelector('#picture').content;
  const element = template.cloneNode(true);

  element.querySelector('.picture__img').src = data.url;
  element.querySelector('.picture__img').alt = data.description;
  element.querySelector('.picture__likes').textContent = data.likes;
  element.querySelector('.picture__comments').textContent = data.comments.length;

  element.querySelector('.picture').addEventListener('click', () => {
    showBigPhoto(data);
  });

  return element;
}

function displayPhotos(photosData) {
  const container = document.querySelector('.pictures');
  const fragment = document.createDocumentFragment();

  const existingPictures = container.querySelectorAll('.picture');
  existingPictures.forEach((picture) => picture.remove());

  photosData.forEach((item) => {
    fragment.appendChild(createPhotoElement(item));
  });

  container.appendChild(fragment);
}

export { displayPhotos };
