import { photos } from './main.js';

function showBigPhoto(photoId) {
  const photoData = photos.find((item) => item.id === photoId);
  const bigPic = document.querySelector('.big-picture');

  bigPic.querySelector('.big-picture__img img').src = photoData.url;
  bigPic.querySelector('.big-picture__img img').alt = photoData.description;
  bigPic.querySelector('.likes-count').textContent = photoData.likes;
  bigPic.querySelector('.comments-count').textContent = photoData.comments.length;
  bigPic.querySelector('.social__caption').textContent = photoData.description;

  const commentsBox = bigPic.querySelector('.social__comments');
  commentsBox.innerHTML = '';

  photoData.comments.forEach((item) => {
    const comment = document.createElement('li');
    comment.className = 'social__comment';
    comment.innerHTML = `<img class="social__picture" src="${item.avatar}" alt="${item.name}" width="35" height="35"><p class="social__text">${item.message}</p>`;
    commentsBox.append(comment);
  });

  bigPic.querySelector('.social__comment-count').classList.add('hidden');
  bigPic.querySelector('.comments-loader').classList.add('hidden');

  bigPic.classList.remove('hidden');
  document.body.classList.add('modal-open');

  const closeBtn = bigPic.querySelector('.big-picture__cancel');
  closeBtn.onclick = () => {
    hideBigPhoto();
  };
  document.onkeydown = (evt) => {
    if (evt.key === 'Escape') {
      hideBigPhoto();
    }
  };
}

function hideBigPhoto() {
  const bigPic = document.querySelector('.big-picture');
  bigPic.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.onkeydown = null;
}

export { showBigPhoto };
