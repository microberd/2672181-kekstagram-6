import { photos } from './main.js';

let currentComments = [];
let shownComments = 0;
const COMMENTS_PER_PAGE = 5;

function showBigPhoto(photoId) {
  const photoData = photos.find((item) => item.id === photoId);
  const bigPic = document.querySelector('.big-picture');
  bigPic.querySelector('.big-picture__img img').src = photoData.url;
  bigPic.querySelector('.big-picture__img img').alt = photoData.description;
  bigPic.querySelector('.likes-count').textContent = photoData.likes;
  bigPic.querySelector('.comments-count').textContent = photoData.comments.length;
  bigPic.querySelector('.social__caption').textContent = photoData.description;
  currentComments = photoData.comments;
  shownComments = 0;
  bigPic.querySelector('.social__comment-count').classList.remove('hidden');
  bigPic.querySelector('.comments-loader').classList.remove('hidden');
  const commentsBox = bigPic.querySelector('.social__comments');
  commentsBox.innerHTML = '';
  showMoreComments();
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

  const loadMoreBtn = bigPic.querySelector('.comments-loader');
  loadMoreBtn.onclick = showMoreComments;
}

function showMoreComments() {
  const bigPic = document.querySelector('.big-picture');
  const commentsBox = bigPic.querySelector('.social__comments');
  const commentCount = bigPic.querySelector('.social__comment-count');
  const loadMoreBtn = bigPic.querySelector('.comments-loader');
  const nextComments = currentComments.slice(shownComments, shownComments + COMMENTS_PER_PAGE);
  nextComments.forEach((item) => {
    const comment = document.createElement('li');
    comment.className = 'social__comment';
    comment.innerHTML = `<img class="social__picture" src="${item.avatar}" alt="${item.name}" width="35" height="35"><p class="social__text">${item.message}</p>`;
    commentsBox.append(comment);
  });

  shownComments += nextComments.length;
  commentCount.innerHTML = `${shownComments} из <span class="comments-count">${currentComments.length}</span> комментариев`;

  if (shownComments >= currentComments.length) {
    loadMoreBtn.classList.add('hidden');
  }
}

function hideBigPhoto() {
  const bigPic = document.querySelector('.big-picture');
  bigPic.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.onkeydown = null;
  const loadMoreBtn = bigPic.querySelector('.comments-loader');
  loadMoreBtn.onclick = null;
}

export { showBigPhoto };
