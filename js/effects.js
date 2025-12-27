import '../vendor/nouislider.js';

const scaleValue = document.querySelector('.scale__control--value');
const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');
const previewImage = document.querySelector('.img-upload__preview img');
const effectsList = document.querySelector('.effects__list');
const effectLevel = document.querySelector('.img-upload__effect-level');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectLevelSlider = document.querySelector('.effect-level__slider');
let currentScale = 100;
let currentEffect = 'none';

function updateScale() {
  scaleValue.value = `${currentScale}%`;
  previewImage.style.transform = `scale(${currentScale / 100})`;
}

function resetScale() {
  currentScale = 100;
  updateScale();
}

function onScaleSmallerClick() {
  if (currentScale > 25) {
    currentScale -= 25;
    updateScale();
  }
}

function onScaleBiggerClick() {
  if (currentScale < 100) {
    currentScale += 25;
    updateScale();
  }
}

function createSlider() {
  noUiSlider.create(effectLevelSlider, {
    range: {
      min: 0,
      max: 100
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
      to: function (value) {
        return value.toFixed(0);
      },
      from: function (value) {
        return parseFloat(value);
      }
    }
  });

  effectLevelSlider.noUiSlider.on('update', (values, handle) => {
    effectLevelValue.value = values[handle];
    applyEffect();
  });
}

function applyEffect() {
  const value = parseInt(effectLevelValue.value, 10);

  previewImage.className = '';
  previewImage.style.filter = '';

  switch (currentEffect) {
    case 'chrome':
      previewImage.style.filter = `grayscale(${value / 100})`;
      previewImage.classList.add('effects__preview--chrome');
      break;
    case 'sepia':
      previewImage.style.filter = `sepia(${value / 100})`;
      previewImage.classList.add('effects__preview--sepia');
      break;
    case 'marvin':
      previewImage.style.filter = `invert(${value}%)`;
      previewImage.classList.add('effects__preview--marvin');
      break;
    case 'phobos':
      previewImage.style.filter = `blur(${value * 3 / 100}px)`;
      previewImage.classList.add('effects__preview--phobos');
      break;
    case 'heat':
      previewImage.style.filter = `brightness(${1 + value * 2 / 100})`;
      previewImage.classList.add('effects__preview--heat');
      break;
    default:
      previewImage.className = '';
      previewImage.style.filter = '';
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
      range: {
        min: 0,
        max: 100
      },
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
    effectLevelSlider.noUiSlider.updateOptions({
      start: 100
    });
  }
}

scaleSmaller.addEventListener('click', onScaleSmallerClick);
scaleBigger.addEventListener('click', onScaleBiggerClick);
effectsList.addEventListener('change', onEffectChange);

createSlider();
resetScale();
resetEffects();

export { resetEffects, updateScale, resetScale };
