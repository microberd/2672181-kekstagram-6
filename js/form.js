import { sendForm } from './api.js';
import { resetEffects, resetScale } from './effects.js';

const FORM_ELEMENT = document.querySelector('.img-upload__form');
const UPLOAD_INPUT = document.querySelector('.img-upload__input');
const OVERLAY_ELEMENT = document.querySelector('.img-upload__overlay');
const CANCEL_BUTTON = document.querySelector('.img-upload__cancel');
const HASHTAGS_FIELD = FORM_ELEMENT.querySelector('.text__hashtags');
const COMMENT_FIELD = FORM_ELEMENT.querySelector('.text__description');
const SUBMIT_BUTTON = FORM_ELEMENT.querySelector('.img-upload__submit');
const PREVIEW_IMAGE = document.querySelector('.img-upload__preview img');
const EFFECT_PREVIEWS = document.querySelectorAll('.effects__preview');
const MAX_HASHTAGS_COUNT = 5;
const MAX_COMMENT_LENGTH = 140;
const pristineValidator = new Pristine(FORM_ELEMENT, {
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
  HASHTAGS_FIELD,
  validateHashtags,
  'Некорректные хэш-теги'
);

pristineValidator.addValidator(
  COMMENT_FIELD,
  validateComment,
  'Комментарий не более 140 символов'
);

function disableSubmitButton() {
  SUBMIT_BUTTON.disabled = true;
  SUBMIT_BUTTON.textContent = 'Публикую...';
}

function enableSubmitButton() {
  SUBMIT_BUTTON.disabled = false;
  SUBMIT_BUTTON.textContent = 'Опубликовать';
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
  const selectedFile = UPLOAD_INPUT.files[0];

  if (!selectedFile) {
    return;
  }

  if (PREVIEW_IMAGE.src.startsWith('blob:')) {
    URL.revokeObjectURL(PREVIEW_IMAGE.src);
  }

  const imageUrl = URL.createObjectURL(selectedFile);
  PREVIEW_IMAGE.src = imageUrl;

  EFFECT_PREVIEWS.forEach((preview) => {
    preview.style.backgroundImage = `url(${imageUrl})`;
  });

  OVERLAY_ELEMENT.classList.remove('hidden');
  document.body.classList.add('modal-open');
  resetScale();
  resetEffects();
}

function closeUploadForm() {
  OVERLAY_ELEMENT.classList.add('hidden');
  document.body.classList.remove('modal-open');
  FORM_ELEMENT.reset();
  pristineValidator.reset();
  resetEffects();
  resetScale();

  if (PREVIEW_IMAGE.src.startsWith('blob:')) {
    URL.revokeObjectURL(PREVIEW_IMAGE.src);
    PREVIEW_IMAGE.src = 'img/upload-default-image.jpg';

    EFFECT_PREVIEWS.forEach((preview) => {
      preview.style.backgroundImage = '';
    });
  }
}

function onCancelClick() {
  closeUploadForm();
}

function onFormEscapePress(evt) {
  if (evt.key === 'Escape' &&
      !HASHTAGS_FIELD.matches(':focus') &&
      !COMMENT_FIELD.matches(':focus')) {
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

  const formData = new FormData(FORM_ELEMENT);

  try {
    await sendForm(formData);
    closeUploadForm();
    showSuccessMessage();
  } catch (error) {
    // Всё уже в api.js
  } finally {
    enableSubmitButton();
  }
}

HASHTAGS_FIELD.addEventListener('keydown', stopEscapePropagation);
COMMENT_FIELD.addEventListener('keydown', stopEscapePropagation);
UPLOAD_INPUT.addEventListener('change', handleFileSelection);
CANCEL_BUTTON.addEventListener('click', onCancelClick);
document.addEventListener('keydown', onFormEscapePress);
FORM_ELEMENT.addEventListener('submit', handleFormSubmit);

export { closeUploadForm };
