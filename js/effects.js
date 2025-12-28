import '../vendor/nouislider.js';
const { noUiSlider } = window;

const scaleValue = document.querySelector('.scale__control--value');
const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');
const previewImage = document.querySelector('.img-upload__preview img');
const effectsList = document.querySelector('.effects__list');
const effectLevel = document.querySelector('.img-upload__effect-level');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectLevelSlider = document.querySelector('.effect-level__slider');

const DEFAULT_SCALE = 100;
const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;

let currentScale = DEFAULT_SCALE;
let currentEffect = 'none';

function updateScale() {
  scaleValue.value = `${currentScale}%`;
  previewImage.style.transform = `scale(${currentScale / 100})`;
}

function resetScale() {
  currentScale = DEFAULT_SCALE;
  updateScale();
}

function onScaleSmallerClick() {
  if (currentScale > MIN_SCALE) {
    currentScale -= SCALE_STEP;
    updateScale();
  }
}

function onScaleBiggerClick() {
  if (currentScale < MAX_SCALE) {
    currentScale += SCALE_STEP;
    updateScale();
  }
}

function createSlider() {
  noUiSlider.create(effectLevelSlider, {
    range: { min: 0, max: 100 },
    start: 100,
    step: 1,
    connect: 'lower'
  });

  effectLevelSlider.noUiSlider.on('update', () => {
    effectLevelValue.value = effectLevelSlider.noUiSlider.get();
    applyEffect();
  });
}

function applyEffect() {
  const value = parseFloat(effectLevelValue.value);

  previewImage.className = '';
  previewImage.style.filter = '';

  switch (currentEffect) {
    case 'chrome':
      previewImage.style.filter = `grayscale(${value / 100})`;
      break;
    case 'sepia':
      previewImage.style.filter = `sepia(${value / 100})`;
      break;
    case 'marvin':
      previewImage.style.filter = `invert(${value}%)`;
      break;
    case 'phobos':
      previewImage.style.filter = `blur(${value * 3 / 100}px)`;
      break;
    case 'heat':
      previewImage.style.filter = `brightness(${1 + value * 2 / 100})`;
      break;
    default:
  }
}

function onEffectChange(evt) {
  if (!evt.target.classList.contains('effects__radio')) {
    return;
  }

  currentEffect = evt.target.value;

  if (currentEffect === 'none') {
    effectLevel.classList.add('hidden');
    previewImage.className = '';
    previewImage.style.filter = '';
  } else {
    effectLevel.classList.remove('hidden');

    effectLevelSlider.noUiSlider.updateOptions({
      range: { min: 0, max: 100 },
      start: 100,
      step: 1
    });

    applyEffect();
  }
}

function resetEffects() {
  currentEffect = 'none';
  const noneEffect = effectsList.querySelector('#effect-none');
  if (noneEffect) {
    noneEffect.checked = true;
  }
  effectLevel.classList.add('hidden');
  previewImage.className = '';
  previewImage.style.filter = '';

  if (effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.updateOptions({ start: 100 });
  }
}

scaleSmaller.addEventListener('click', onScaleSmallerClick);
scaleBigger.addEventListener('click', onScaleBiggerClick);
effectsList.addEventListener('change', onEffectChange);

createSlider();
resetScale();
resetEffects();

export { resetEffects, resetScale };
