let currentComments = [];
let shownComments = 0;
const COMMENTS_PER_PAGE = 5;

function createCommentElement(comment) {
  const commentElement = document.createElement('li');
  commentElement.className = 'social__comment';

  const avatar = document.createElement('img');
  avatar.className = 'social__picture';
  avatar.src = comment.avatar;
  avatar.alt = comment.name;
  avatar.width = 35;
  avatar.height = 35;

  const text = document.createElement('p');
  text.className = 'social__text';
  text.textContent = comment.message;

  commentElement.append(avatar, text);
  return commentElement;
}

function showBigPhoto(photoData) {
  const bigPicture = document.querySelector('.big-picture');
  const bigImage = bigPicture.querySelector('.big-picture__img img');
  const likesCount = bigPicture.querySelector('.likes-count');
  const commentsCount = bigPicture.querySelector('.comments-count');
  const socialCaption = bigPicture.querySelector('.social__caption');
  const commentsContainer = bigPicture.querySelector('.social__comments');
  const commentCount = bigPicture.querySelector('.social__comment-count');
  const loadMoreButton = bigPicture.querySelector('.comments-loader');
  const closeButton = bigPicture.querySelector('.big-picture__cancel');

  bigImage.src = photoData.url;
  bigImage.alt = photoData.description;
  likesCount.textContent = photoData.likes;
  commentsCount.textContent = photoData.comments.length;
  socialCaption.textContent = photoData.description;

  currentComments = photoData.comments;
  shownComments = 0;

  commentCount.classList.remove('hidden');
  loadMoreButton.classList.remove('hidden');
  commentsContainer.innerHTML = '';

  loadMoreComments();

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  function onEscPress(evt) {
    if (evt.key === 'Escape') {
      hideBigPhoto();
    }
  }

  function onCloseClick() {
    hideBigPhoto();
  }

  function onLoadMoreClick() {
    loadMoreComments();
  }

  closeButton.addEventListener('click', onCloseClick);
  loadMoreButton.addEventListener('click', onLoadMoreClick);
  document.addEventListener('keydown', onEscPress);

  function hideBigPhoto() {
    bigPicture.classList.add('hidden');
    document.body.classList.remove('modal-open');

    closeButton.removeEventListener('click', onCloseClick);
    loadMoreButton.removeEventListener('click', onLoadMoreClick);
    document.removeEventListener('keydown', onEscPress);
  }
}

function loadMoreComments() {
  const bigPicture = document.querySelector('.big-picture');
  const commentsContainer = bigPicture.querySelector('.social__comments');
  const commentCount = bigPicture.querySelector('.social__comment-count');
  const loadMoreButton = bigPicture.querySelector('.comments-loader');

  const nextComments = currentComments.slice(shownComments, shownComments + COMMENTS_PER_PAGE);

  nextComments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    commentsContainer.append(commentElement);
  });

  shownComments += nextComments.length;
  commentCount.innerHTML = `${shownComments} из <span class="comments-count">${currentComments.length}</span> комментариев`;

  if (shownComments >= currentComments.length) {
    loadMoreButton.classList.add('hidden');
  }
}

export { showBigPhoto };

