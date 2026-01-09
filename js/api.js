const API_BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram/';

const ErrorMessage = {
  LOAD_FAILED: 'Не удалось загрузить фотографии',
  UPLOAD_FAILED: 'Ошибка отправки формы'
};

const MAX_ATTEMPTS = 3;
const RETRY_WAIT_TIME = 1000;

async function fetchWithRetries(url, options = {}, attemptsLeft = MAX_ATTEMPTS) {
  try {
    const serverResponse = await fetch(url, options);

    if (!serverResponse.ok) {
      throw new Error(`HTTP ${serverResponse.status}`);
    }

    return await serverResponse.json();
  } catch (fetchError) {
    if (attemptsLeft > 0) {
      await new Promise((resolve) => {
        setTimeout(resolve, RETRY_WAIT_TIME);
      });
      return fetchWithRetries(url, options, attemptsLeft - 1);
    }
    throw fetchError;
  }
}

async function loadUserPhotos() {
  try {
    return await fetchWithRetries(`${API_BASE_URL}data`);
  } catch (loadError) {
    throw new Error(ErrorMessage.LOAD_FAILED);
  }
}

function displayUploadError() {
  const uploadOverlay = document.querySelector('.img-upload__overlay');
  if (uploadOverlay) {
    uploadOverlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }

  const errorTemplate = document.querySelector('#error');
  const errorElement = errorTemplate.content.cloneNode(true);
  const errorMessage = errorElement.querySelector('.error');
  const closeButton = errorMessage.querySelector('.error__button');

  function removeErrorMessage() {
    errorMessage.remove();
    document.removeEventListener('keydown', handleEscapeKey);
    document.removeEventListener('click', handleOutsideClick);
    if (uploadOverlay) {
      uploadOverlay.classList.remove('hidden');
      document.body.classList.add('modal-open');
    }
  }

  function handleEscapeKey(keyboardEvent) {
    if (keyboardEvent.key === 'Escape') {
      removeErrorMessage();
    }
  }

  function handleOutsideClick(clickEvent) {
    if (!errorMessage.contains(clickEvent.target)) {
      removeErrorMessage();
    }
  }

  closeButton.addEventListener('click', removeErrorMessage);
  document.addEventListener('keydown', handleEscapeKey);
  document.addEventListener('click', handleOutsideClick);

  errorMessage.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      evt.stopPropagation();
    }
  });

  document.body.append(errorElement);
}

async function uploadFormData(formData) {
  try {
    const serverResponse = await fetch(API_BASE_URL, {
      method: 'POST',
      body: formData
    });

    if (!serverResponse.ok) {
      throw new Error(ErrorMessage.UPLOAD_FAILED);
    }

    return await serverResponse.json();
  } catch (uploadError) {
    displayUploadError();
    throw new Error(ErrorMessage.UPLOAD_FAILED);
  }
}

export { loadUserPhotos as loadPhotos, uploadFormData as sendForm, displayUploadError as showErrorMessage };
