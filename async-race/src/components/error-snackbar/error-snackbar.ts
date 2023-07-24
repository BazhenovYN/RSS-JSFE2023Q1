import createDomElement from 'utils/element-creator';
import './_error-snackbar.scss';

const ANIMATION_DURATION = 4000;

export function showError(error: unknown): void {
  let message = 'Oops... ';
  if (error instanceof Error) {
    message += error.message;
  } else {
    message += 'Unknown error occurred';
  }

  const snackbar = createDomElement({
    tag: 'div',
    className: 'snackbar',
    textContent: message,
  });

  document.body.appendChild(snackbar);
  setTimeout(() => document.body.removeChild(snackbar), ANIMATION_DURATION);
}
