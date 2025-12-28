const SERVER_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const ErrorText = {
  GET_DATA: 'Не удалось загрузить фотографии',
  SEND_DATA: 'Ошибка отправки формы'
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => {
        setTimeout(resolve, RETRY_DELAY);
      });
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

async function loadPhotos() {
  try {
    return await fetchWithRetry(`${SERVER_URL}/data`);
  } catch (error) {
    throw new Error(ErrorText.GET_DATA);
  }
}

function showUploadErrorMessage() {
  const template = document.querySelector('#error');
  const element = template.content.cloneNode(true);
  document.body.append(element);

  const message = document.querySelector('.error');
  const closeBtn = message.querySelector('.error__button');

  function closeMessage() {
    message.remove();
    document.removeEventListener('keydown', onEsc);
    document.removeEventListener('click', onClick);
  }

  function onEsc(evt) {
    if (evt.key === 'Escape') {
      closeMessage();
    }
  }

  function onClick(evt) {
    if (!message.contains(evt.target)) {
      closeMessage();
    }
  }

  closeBtn.addEventListener('click', closeMessage);
  document.addEventListener('keydown', onEsc);
  document.addEventListener('click', onClick);
}

async function sendForm(formData) {
  try {
    return await fetchWithRetry(SERVER_URL, {
      method: 'POST',
      body: formData
    });
  } catch (error) {
    showUploadErrorMessage();
    throw new Error(ErrorText.SEND_DATA);
  }
}

export { loadPhotos, sendForm };
