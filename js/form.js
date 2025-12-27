import { sendForm } from './api.js';
import { resetEffects, resetScale } from './effects.js';

const form = document.querySelector('.img-upload__form');
const uploadInput = document.querySelector('.img-upload__input');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('.img-upload__cancel');
const hashtagsInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');
const previewImage = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'form__item--invalid',
  successClass: 'form__item--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'span',
  errorTextClass: 'form__error'
});

pristine.addValidator(hashtagsInput, validateHashtags, 'Некорректные хэш-теги');
pristine.addValidator(commentInput, validateComment, 'Комментарий не более 140 символов');

function blockSubmitButton() {
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';
}

function unblockSubmitButton() {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
}

function showSuccessMessage() {
  const template = document.querySelector('#success');
  const element = template.content.cloneNode(true);
  document.body.appendChild(element);

  const messageElement = document.querySelector('.success');
  const closeButton = messageElement.querySelector('.success__button');

  function closeMessage() {
    messageElement.remove();
    document.removeEventListener('keydown', onEscPress);
    document.removeEventListener('click', onClickOutside);
  }

  function onEscPress(evt) {
    if (evt.key === 'Escape') {
      closeMessage();
    }
  }

  function onClickOutside(evt) {
    if (!messageElement.contains(evt.target)) {
      closeMessage();
    }
  }

  closeButton.addEventListener('click', closeMessage);
  document.addEventListener('keydown', onEscPress);
  document.addEventListener('click', onClickOutside);
}

function handleFormSubmit(evt) {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (isValid) {
    blockSubmitButton();

    const formData = new FormData(form);

    sendForm(formData)
      .then(() => {
        closeForm();
        showSuccessMessage();
      })
      .catch(() => {})
      .finally(() => {
        unblockSubmitButton();
      });
  }
}

[hashtagsInput, commentInput].forEach((input) => {
  input.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      evt.stopPropagation();
    }
  });
});

uploadInput.addEventListener('change', () => {
  const file = uploadInput.files[0];

  if (file) {
    if (previewImage.src.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage.src);
    }

    const imageUrl = URL.createObjectURL(file);
    previewImage.src = imageUrl;

    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url(${imageUrl})`;
    });
  }

  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  resetScale();
  resetEffects();
});

function closeForm() {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  form.reset();
  pristine.reset();
  resetEffects();
  resetScale();

  if (previewImage.src.startsWith('blob:')) {
    URL.revokeObjectURL(previewImage.src);
    previewImage.src = 'img/upload-default-image.jpg';

    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = '';
    });
  }
}

cancelButton.addEventListener('click', closeForm);
document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape' && !hashtagsInput.matches(':focus') && !commentInput.matches(':focus')) {
    closeForm();
  }
});

function validateHashtags(value) {
  if (value === '') {
    return true;
  }

  const hashtags = value.toLowerCase().split(' ').filter((tag) => tag !== '');

  if (hashtags.length > 5) {
    return false;
  }

  for (const tag of hashtags) {
    if (!tag.startsWith('#')) {
      return false;
    }
    if (tag === '#') {
      return false;
    }
    if (tag.length > 20) {
      return false;
    }
    if (!/^#[a-zа-яё0-9]+$/i.test(tag)) {
      return false;
    }
    if (hashtags.indexOf(tag) !== hashtags.lastIndexOf(tag)) {
      return false;
    }
  }

  return true;
}

function validateComment(value) {
  return value.length <= 140;
}

form.addEventListener('submit', handleFormSubmit);

export { closeForm, validateHashtags, validateComment };
