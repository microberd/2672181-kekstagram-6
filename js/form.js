import { sendForm, showErrorMessage } from './api.js';
import { resetEffects, resetScale } from './effects.js';

const formElement = document.querySelector('.img-upload__form');
const uploadInput = document.querySelector('.img-upload__input');
const overlayElement = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('.img-upload__cancel');
const hashtagsField = formElement.querySelector('.text__hashtags');
const commentField = formElement.querySelector('.text__description');
const submitButton = formElement.querySelector('.img-upload__submit');
const previewImage = document.querySelector('.img-upload__preview img');
const effectPreviews = document.querySelectorAll('.effects__preview');
const MAX_HASHTAGS_COUNT = 5;
const MAX_COMMENT_LENGTH = 140;
const pristineValidator = new Pristine(formElement, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'form__item--invalid',
  successClass: 'form__item--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'span',
  errorTextClass: 'pristine-error'
});

function validateHashtags(value) {
  const trimmedValue = value.trim();

  if (trimmedValue === '') {
    return true;
  }

  const hashtags = trimmedValue.toLowerCase().split(' ').filter((tag) => tag);

  if (hashtags.length > MAX_HASHTAGS_COUNT) {
    return false;
  }

  const hashtagPattern = /^#[a-zа-яё0-9]{1,19}$/i;

  for (const hashtag of hashtags) {
    if (!hashtagPattern.test(hashtag)) {
      return false;
    }
  }

  const uniqueHashtags = new Set(hashtags);
  return uniqueHashtags.size === hashtags.length;
}

function validateComment(value) {
  return value.length <= MAX_COMMENT_LENGTH;
}

pristineValidator.addValidator(
  hashtagsField,
  validateHashtags,
  'Некорректные хэш-теги'
);

pristineValidator.addValidator(
  commentField,
  validateComment,
  'Комментарий не более 140 символов'
);

function disableSubmitButton() {
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';
}

function enableSubmitButton() {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
}

function showSuccessMessage() {
  const template = document.querySelector('#success');
  const messageElement = template.content.querySelector('.success').cloneNode(true);

  document.body.appendChild(messageElement);

  const successPopup = document.querySelector('.success');
  const closeButton = successPopup.querySelector('.success__button');

  function closeSuccessPopup() {
    successPopup.remove();
    document.removeEventListener('keydown', onSuccessEscapePress);
    document.removeEventListener('click', onOutsideSuccessClick);
  }

  function onSuccessEscapePress(evt) {
    if (evt.key === 'Escape') {
      closeSuccessPopup();
    }
  }

  function onOutsideSuccessClick(evt) {
    if (!successPopup.contains(evt.target)) {
      closeSuccessPopup();
    }
  }

  closeButton.addEventListener('click', closeSuccessPopup);
  document.addEventListener('keydown', onSuccessEscapePress);
  document.addEventListener('click', onOutsideSuccessClick);
}

function stopEscapePropagation(evt) {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
}

function handleFileSelection() {
  const selectedFile = uploadInput.files[0];

  if (!selectedFile) {
    return;
  }

  if (previewImage.src.startsWith('blob:')) {
    URL.revokeObjectURL(previewImage.src);
  }

  const imageUrl = URL.createObjectURL(selectedFile);
  previewImage.src = imageUrl;

  effectPreviews.forEach((preview) => {
    preview.style.backgroundImage = `url(${imageUrl})`;
  });

  overlayElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  resetScale();
  resetEffects();
}

function closeUploadForm() {
  overlayElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  formElement.reset();
  pristineValidator.reset();
  resetEffects();
  resetScale();

  if (previewImage.src.startsWith('blob:')) {
    URL.revokeObjectURL(previewImage.src);
    previewImage.src = 'img/upload-default-image.jpg';

    effectPreviews.forEach((preview) => {
      preview.style.backgroundImage = '';
    });
  }
}

function onCancelClick() {
  closeUploadForm();
}

function onFormEscapePress(evt) {
  const errorPopup = document.querySelector('.error');
  if (errorPopup) {
    return;
  }

  if (evt.key === 'Escape' &&
      !hashtagsField.matches(':focus') &&
      !commentField.matches(':focus')) {
    closeUploadForm();
  }
}

async function handleFormSubmit(evt) {
  evt.preventDefault();

  const isValid = pristineValidator.validate();

  if (!isValid) {
    return;
  }

  disableSubmitButton();

  const formData = new FormData(formElement);

  try {
    await sendForm(formData);
    closeUploadForm();
    showSuccessMessage();
  } catch (error) {
    showErrorMessage();
  } finally {
    enableSubmitButton();
  }
}

hashtagsField.addEventListener('keydown', stopEscapePropagation);
commentField.addEventListener('keydown', stopEscapePropagation);
uploadInput.addEventListener('change', handleFileSelection);
cancelButton.addEventListener('click', onCancelClick);
document.addEventListener('keydown', onFormEscapePress);
formElement.addEventListener('submit', handleFormSubmit);

export { closeUploadForm };
