import { loadPhotos } from './api.js';
import { displayPhotos } from './thumbnails.js';
import { initializePhotoFilters } from './filters.js';

function displayLoadingError(errorText) {
  const errorContainer = document.createElement('div');
  errorContainer.className = 'data-error';
  errorContainer.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ff4d4d;
    color: white;
    padding: 20px 30px;
    border-radius: 10px;
    text-align: center;
    z-index: 9999;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    font-family: 'Open Sans', Arial, sans-serif;
  `;

  const errorMessage = document.createElement('p');
  errorMessage.textContent = errorText;
  errorMessage.style.margin = '0 0 15px 0';
  errorMessage.style.fontSize = '18px';

  const reloadButton = document.createElement('button');
  reloadButton.textContent = 'Обновить страницу';
  reloadButton.style.cssText = `
    background: white;
    color: #ff4d4d;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    font-size: 16px;
    transition: background 0.3s;
  `;

  reloadButton.addEventListener('mouseenter', () => {
    reloadButton.style.background = '#f0f0f0';
  });

  reloadButton.addEventListener('mouseleave', () => {
    reloadButton.style.background = 'white';
  });

  reloadButton.addEventListener('click', () => {
    location.reload();
  });

  errorContainer.append(errorMessage, reloadButton);
  document.body.append(errorContainer);
}

async function initializeApplication() {
  try {
    const userPhotos = await loadPhotos();
    displayPhotos(userPhotos);
    initializePhotoFilters(userPhotos);
  } catch (loadingError) {
    displayLoadingError(loadingError.message);
  }
}

initializeApplication();
