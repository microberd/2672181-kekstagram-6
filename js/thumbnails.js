import { showBigPhoto } from './fullscreen.js';

const photosContainer = document.querySelector('.pictures');
const photoTemplate = document.querySelector('#picture').content;

function createPhotoThumbnail(photoInfo) {
  const thumbnailElement = photoTemplate.cloneNode(true);
  const thumbnailImage = thumbnailElement.querySelector('.picture__img');
  const likesElement = thumbnailElement.querySelector('.picture__likes');
  const commentsElement = thumbnailElement.querySelector('.picture__comments');

  thumbnailImage.src = photoInfo.url;
  thumbnailImage.alt = photoInfo.description;
  likesElement.textContent = photoInfo.likes;
  commentsElement.textContent = photoInfo.comments.length;

  const photoLink = thumbnailElement.querySelector('.picture');
  photoLink.addEventListener('click', (event) => {
    event.preventDefault();
    showBigPhoto(photoInfo);
  });

  return thumbnailElement;
}

function removeExistingThumbnails() {
  const existingThumbnails = photosContainer.querySelectorAll('.picture');
  existingThumbnails.forEach((thumbnail) => {
    thumbnail.remove();
  });
}

function renderPhotoThumbnails(photosArray) {
  removeExistingThumbnails();

  const thumbnailsFragment = document.createDocumentFragment();
  photosArray.forEach((photo) => {
    thumbnailsFragment.appendChild(createPhotoThumbnail(photo));
  });

  photosContainer.appendChild(thumbnailsFragment);
}

function displayPhotoCollection(photosArray) {
  renderPhotoThumbnails(photosArray);
}

export { renderPhotoThumbnails as displayPhotos, displayPhotoCollection };
