//import Pristine from '/vendor/pristine/pristine.min.js';

const form = document.querySelector('.img-upload__form');
const uploadInput = document.querySelector('.img-upload__input');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('.img-upload__cancel');
const hashtagsInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');

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

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (isValid) {
    //console.log('Форма валидна, можно отправлять');
  }
});

[hashtagsInput, commentInput].forEach((input) => {
  input.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      evt.stopPropagation();
    }
  });
});

uploadInput.addEventListener('change', () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
});

function closeForm() {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  form.reset();
  pristine.reset();
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

export { closeForm, validateHashtags, validateComment };
