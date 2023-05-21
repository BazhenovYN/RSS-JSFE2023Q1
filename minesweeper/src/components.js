export function createRadioButton(name, value, checked, listener) {
  const fragment = document.createDocumentFragment();

  const input = document.createElement('input');
  input.type = 'radio';
  input.name = name;
  input.checked = checked;
  input.setAttribute('value', value);
  input.addEventListener('change', listener);

  const label = document.createElement('label');
  label.htmlFor = name;
  label.textContent = value;

  const container = document.createElement('div');
  container.classList.add('radio-button');
  container.appendChild(input);
  container.appendChild(label);

  fragment.appendChild(container);

  return fragment;
}

export function createInputNumber(name, value, listener) {
  const fragment = document.createDocumentFragment();

  const input = document.createElement('input');
  input.type = 'number';
  input.name = name;
  input.min = 1;
  input.max = 999;
  input.value = value;
  input.addEventListener('change', listener);

  const container = document.createElement('div');
  container.classList.add('input-number');
  container.appendChild(input);

  fragment.appendChild(container);

  return fragment;
}

export function createWarning() {
  const fragment = document.createDocumentFragment();

  const container = document.createElement('div');
  container.classList.add('warning-restart', 'hidden');
  container.title = 'Need to create a new game';
  fragment.appendChild(container);

  return fragment;
}

export function closeAllWarnings() {
  const warnings = document.querySelectorAll('.warning-restart:not(.hidden)');
  warnings.forEach((element) => {
    element.classList.add('hidden');
  });
}
