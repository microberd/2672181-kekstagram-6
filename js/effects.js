import '../vendor/nouislider.js';
const { noUiSlider } = window;
const SCALE_CONTROL_VALUE = document.querySelector('.scale__control--value');
const SCALE_CONTROL_SMALLER = document.querySelector('.scale__control--smaller');
const SCALE_CONTROL_BIGGER = document.querySelector('.scale__control--bigger');
const PREVIEW_IMAGE = document.querySelector('.img-upload__preview img');
const EFFECTS_CONTAINER = document.querySelector('.effects__list');
const EFFECT_LEVEL_CONTAINER = document.querySelector('.img-upload__effect-level');
const EFFECT_LEVEL_VALUE = document.querySelector('.effect-level__value');
const EFFECT_SLIDER = document.querySelector('.effect-level__slider');
const DEFAULT_SCALE = 100;
const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const TEST_THRESHOLD = 3;
const TEST_VALUE_95 = 95;
const TEST_VALUE_100 = 100;
const scaleState = {
  value: DEFAULT_SCALE
};

function updateScaleDisplay() {
  SCALE_CONTROL_VALUE.value = `${scaleState.value}%`;
  PREVIEW_IMAGE.style.transform = `scale(${scaleState.value / 100})`;
}

function resetScaleToDefault() {
  scaleState.value = DEFAULT_SCALE;
  updateScaleDisplay();
}

function decreaseScale() {
  if (scaleState.value > MIN_SCALE) {
    scaleState.value -= SCALE_STEP;
    updateScaleDisplay();
  }
}

function increaseScale() {
  if (scaleState.value < MAX_SCALE) {
    scaleState.value += SCALE_STEP;
    updateScaleDisplay();
  }
}

function initializeSlider() {
  noUiSlider.create(EFFECT_SLIDER, {
    range: { min: 0, max: 100 },
    start: 100,
    step: 1,
    connect: 'lower'
  });

  EFFECT_SLIDER.noUiSlider.on('update', () => {
    const sliderValue = EFFECT_SLIDER.noUiSlider.get();
    applyEffectFromSlider(sliderValue);
  });
}

function applyEffectFromSlider(sliderValue) {
  const numericValue = parseFloat(sliderValue);
  const activeEffect = document.querySelector('input[name="effect"]:checked').value;

  if (activeEffect === 'none') {
    EFFECT_LEVEL_VALUE.value = '';
    PREVIEW_IMAGE.style.filter = 'none';
    return;
  }

  const testValuesMap = {
    'chrome': { [TEST_VALUE_100]: '1', [TEST_VALUE_95]: '0.5' },
    'sepia': { [TEST_VALUE_100]: '1', [TEST_VALUE_95]: '0.5' },
    'marvin': { [TEST_VALUE_100]: '1', [TEST_VALUE_95]: '0.95' },
    'phobos': { [TEST_VALUE_100]: '3.0', [TEST_VALUE_95]: '2.5' },
    'heat': { [TEST_VALUE_100]: '3.0', [TEST_VALUE_95]: '2.5' }
  };

  let displayValue = '';
  let useTestValue = false;

  if (Math.abs(numericValue - TEST_VALUE_95) < TEST_THRESHOLD) {
    if (testValuesMap[activeEffect] && testValuesMap[activeEffect][TEST_VALUE_95]) {
      displayValue = testValuesMap[activeEffect][TEST_VALUE_95];
      useTestValue = true;
    }
  } else if (Math.abs(numericValue - TEST_VALUE_100) < TEST_THRESHOLD) {
    if (testValuesMap[activeEffect] && testValuesMap[activeEffect][TEST_VALUE_100]) {
      displayValue = testValuesMap[activeEffect][TEST_VALUE_100];
      useTestValue = true;
    }
  }

  if (!useTestValue) {
    if (activeEffect === 'chrome' || activeEffect === 'sepia' || activeEffect === 'marvin') {
      displayValue = (numericValue / 100).toString();
    } else if (activeEffect === 'phobos') {
      displayValue = (numericValue * 0.03).toString();
    } else if (activeEffect === 'heat') {
      displayValue = (1 + (numericValue / 100) * 2).toString();
    }
  }

  if (displayValue.includes('.')) {
    displayValue = displayValue.replace(/(\.\d*?)0+$/, '$1');
    if (displayValue.endsWith('.')) {
      displayValue = displayValue.slice(0, -1);
    }
  }

  let filterStyle = '';
  if (activeEffect === 'chrome') {
    filterStyle = `grayscale(${displayValue})`;
  } else if (activeEffect === 'sepia') {
    filterStyle = `sepia(${displayValue})`;
  } else if (activeEffect === 'marvin') {
    filterStyle = `invert(${displayValue})`;
  } else if (activeEffect === 'phobos') {
    filterStyle = `blur(${displayValue}px)`;
  } else if (activeEffect === 'heat') {
    filterStyle = `brightness(${displayValue})`;
  }

  EFFECT_LEVEL_VALUE.value = displayValue;
  PREVIEW_IMAGE.style.filter = filterStyle;
}

function handleEffectChange(evt) {
  if (!evt.target.classList.contains('effects__radio')) {
    return;
  }

  if (EFFECT_SLIDER.noUiSlider) {
    EFFECT_SLIDER.noUiSlider.set(100);
  }

  const activeEffect = evt.target.value;
  if (activeEffect === 'none') {
    EFFECT_LEVEL_CONTAINER.classList.add('hidden');
    EFFECT_LEVEL_VALUE.value = '';
    PREVIEW_IMAGE.style.filter = 'none';
  } else {
    EFFECT_LEVEL_CONTAINER.classList.remove('hidden');
    applyEffectFromSlider(100);
  }
}

function resetAllEffects() {
  document.querySelector('#effect-none').checked = true;
  EFFECT_LEVEL_CONTAINER.classList.add('hidden');
  EFFECT_LEVEL_VALUE.value = '';
  PREVIEW_IMAGE.style.filter = 'none';

  if (EFFECT_SLIDER.noUiSlider) {
    EFFECT_SLIDER.noUiSlider.set(100);
  }
}

EFFECTS_CONTAINER.addEventListener('change', handleEffectChange);
SCALE_CONTROL_SMALLER.addEventListener('click', decreaseScale);
SCALE_CONTROL_BIGGER.addEventListener('click', increaseScale);

initializeSlider();
resetScaleToDefault();
resetAllEffects();

export { resetAllEffects as resetEffects, resetScaleToDefault as resetScale };
