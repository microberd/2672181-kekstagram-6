const scaleValue = document.querySelector('.scale__control--value');
const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');
const previewImage = document.querySelector('.img-upload__preview img');
const effectLevel = document.querySelector('.effect-level__value');
const effectLevelContainer = document.querySelector('.img-upload__effect-level');
const effectsList = document.querySelector('.effects__list');

let currentScale = 100;
let currentEffect = 'none';

function updateScale() {
  scaleValue.value = `${currentScale}%`;
  previewImage.style.transform = `scale(${currentScale / 100})`;
}

scaleSmaller.addEventListener('click', () => {
  if (currentScale > 25) {
    currentScale -= 25;
    updateScale();
  }
});

scaleBigger.addEventListener('click', () => {
  if (currentScale < 100) {
    currentScale += 25;
    updateScale();
  }
});

const effects = {
  none: {
    filter: '',
    unit: '',
    options: { min: 0, max: 0, step: 0 }
  },
  chrome: {
    filter: 'grayscale',
    unit: '',
    options: { min: 0, max: 1, step: 0.1 }
  },
  sepia: {
    filter: 'sepia',
    unit: '',
    options: { min: 0, max: 1, step: 0.1 }
  },
  marvin: {
    filter: 'invert',
    unit: '%',
    options: { min: 0, max: 100, step: 1 }
  },
  phobos: {
    filter: 'blur',
    unit: 'px',
    options: { min: 0, max: 3, step: 0.1 }
  },
  heat: {
    filter: 'brightness',
    unit: '',
    options: { min: 1, max: 3, step: 0.1 }
  }
};

let slider = null;

function initSlider() {
  currentEffect = 'none';
  const originalEffect = document.querySelector('#effect-none');
  if (originalEffect) {
    originalEffect.checked = true;
  }

  if (slider) {
    slider.destroy();
  }

  effectLevelContainer.classList.add('hidden');
  previewImage.style.filter = '';
  effectLevel.value = '';
}

function resetEffects() {
  initSlider();
}

effectsList.addEventListener('change', (evt) => {
  if (evt.target.name === 'effect') {
    currentEffect = evt.target.value;

    if (slider) {
      slider.destroy();
    }

    if (currentEffect === 'none') {
      effectLevelContainer.classList.add('hidden');
      previewImage.style.filter = '';
      effectLevel.value = '';
      return;
    }

    effectLevelContainer.classList.remove('hidden');

    slider = noUiSlider.create(document.querySelector('.effect-level__slider'), {
      range: {
        min: effects[currentEffect].options.min,
        max: effects[currentEffect].options.max
      },
      start: effects[currentEffect].options.max,
      step: effects[currentEffect].options.step,
      connect: 'lower'
    });

    slider.on('update', (values) => {
      const value = values[0];
      effectLevel.value = value;

      const effect = effects[currentEffect];
      if (effect.filter) {
        previewImage.style.filter = `${effect.filter}(${value}${effect.unit})`;
      }
    });
  }
});

updateScale();
initSlider();

export { updateScale, resetEffects };
