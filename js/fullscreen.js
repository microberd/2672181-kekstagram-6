const COMMENTS_PER_LOAD = 5;
const AVATAR_SIZE = 35;

let currentComments = [];
let displayedCommentsCount = 0;

function createCommentElement(commentData) {
  const commentElement = document.createElement('li');
  commentElement.className = 'social__comment';

  const avatarImage = document.createElement('img');
  avatarImage.className = 'social__picture';
  avatarImage.src = commentData.avatar;
  avatarImage.alt = commentData.name;
  avatarImage.width = AVATAR_SIZE;
  avatarImage.height = AVATAR_SIZE;

  const commentText = document.createElement('p');
  commentText.className = 'social__text';
  commentText.textContent = commentData.message;
  commentElement.append(avatarImage, commentText);
  return commentElement;
}

function showBigPhoto(photoData) {
  const bigPictureElement = document.querySelector('.big-picture');

  if (!bigPictureElement) {
    return;
  }

  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');

  const bigImage = bigPictureElement.querySelector('.big-picture__img img');
  const likesCounter = bigPictureElement.querySelector('.likes-count');
  const photoDescription = bigPictureElement.querySelector('.social__caption');
  const commentsList = bigPictureElement.querySelector('.social__comments');
  const commentsCounter = bigPictureElement.querySelector('.social__comment-count');
  const loadMoreButton = bigPictureElement.querySelector('.comments-loader');
  const closeButton = bigPictureElement.querySelector('.big-picture__cancel');

  if (!bigImage || !likesCounter || !photoDescription ||
      !commentsList || !commentsCounter || !loadMoreButton || !closeButton) {
    return;
  }

  bigImage.src = photoData.url;
  bigImage.alt = photoData.description;
  likesCounter.textContent = photoData.likes;
  photoDescription.textContent = photoData.description;
  currentComments = photoData.comments;
  displayedCommentsCount = 0;

  commentsCounter.classList.remove('hidden');
  loadMoreButton.classList.remove('hidden');
  commentsList.innerHTML = '';

  const initialComments = currentComments.slice(0, COMMENTS_PER_LOAD);
  initialComments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    commentsList.append(commentElement);
  });
  displayedCommentsCount = initialComments.length;

  commentsCounter.innerHTML = `${displayedCommentsCount} из <span class="social__comment-total-count">${currentComments.length}</span> комментариев`;

  if (displayedCommentsCount >= currentComments.length) {
    loadMoreButton.classList.add('hidden');
  }

  function handleEscapePress(evt) {
    if (evt.key === 'Escape') {
      closePhoto();
    }
  }

  function handleLoadMoreClick() {
    const additionalComments = currentComments.slice(displayedCommentsCount, displayedCommentsCount + COMMENTS_PER_LOAD);

    additionalComments.forEach((comment) => {
      const commentElement = createCommentElement(comment);
      commentsList.append(commentElement);
    });

    displayedCommentsCount += additionalComments.length;
    commentsCounter.innerHTML = `${displayedCommentsCount} из <span class="social__comment-total-count">${currentComments.length}</span> комментариев`;

    if (displayedCommentsCount >= currentComments.length) {
      loadMoreButton.classList.add('hidden');
    }
  }

  function closePhoto() {
    bigPictureElement.classList.add('hidden');
    document.body.classList.remove('modal-open');

    closeButton.removeEventListener('click', closePhoto);
    loadMoreButton.removeEventListener('click', handleLoadMoreClick);
    document.removeEventListener('keydown', handleEscapePress);

    currentComments = [];
    displayedCommentsCount = 0;
  }

  closeButton.addEventListener('click', closePhoto);
  loadMoreButton.addEventListener('click', handleLoadMoreClick);
  document.addEventListener('keydown', handleEscapePress);
}

export { showBigPhoto };
