import { showBigPhoto } from './fullscreen.js';

const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content;

function createPhotoElement(photo) {
  const element = pictureTemplate.cloneNode(true);
  const image = element.querySelector('.picture__img');
  const likes = element.querySelector('.picture__likes');
  const comments = element.querySelector('.picture__comments');

  image.src = photo.url;
  image.alt = photo.description;
  likes.textContent = photo.likes;
  comments.textContent = photo.comments.length;

  const pictureElement = element.querySelector('.picture');
  pictureElement.addEventListener('click', () => {
    showBigPhoto(photo);
  });

  return element;
}

function clearPhotos() {
  const pictures = picturesContainer.querySelectorAll('.picture');
  pictures.forEach((picture) => {
    picture.remove();
  });
}

function showPhotos(photos) {
  clearPhotos();

  const fragment = document.createDocumentFragment();
  photos.forEach((photo) => {
    fragment.appendChild(createPhotoElement(photo));
  });

  picturesContainer.appendChild(fragment);
}

function displayPhotos(photos) {
  showPhotos(photos);
}

export { displayPhotos, showPhotos };
