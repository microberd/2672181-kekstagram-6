const SERVER_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const ErrorText = {
  GET_DATA: 'Не удалось загрузить фотографии',
  SEND_DATA: 'Ошибка отправки формы',
};

async function loadPhotos() {
  try {
    const response = await fetch(`${SERVER_URL}/data`);

    if (!response.ok) {
      throw new Error(ErrorText.GET_DATA);
    }

    return await response.json();
  } catch (error) {
    throw new Error(ErrorText.GET_DATA);
  }
}

async function sendForm(formData) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(ErrorText.SEND_DATA);
    }

    return await response.json();
  } catch (error) {
    showUploadErrorMessage();
    throw error;
  }
}

function showUploadErrorMessage() {
  const template = document.querySelector('#error');
  const element = template.content.cloneNode(true);
  document.body.appendChild(element);

  const messageElement = document.querySelector('.error');
  const closeButton = messageElement.querySelector('.error__button');

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

export { loadPhotos, sendForm };
