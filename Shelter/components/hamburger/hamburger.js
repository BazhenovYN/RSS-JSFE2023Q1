'use strict';

const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu__list');
const overlay = document.querySelector('.overlay');
let isMenuOpen = false;

hamburger.addEventListener('click', () => {
  isMenuOpen = !isMenuOpen;

  hamburger.classList.toggle('hamburger_active');
  menu.classList.toggle('menu__list_active');
  overlay.classList.toggle('show');
  body.classList.toggle('noscroll');

  if (isMenuOpen) {
    document.addEventListener('click', outsideEventListener);
  }
});

function outsideEventListener(event) {
  if (
    event.target === menu ||
    event.target === hamburger ||
    hamburger.contains(event.target)
  ) {
    return;
  }
  closeMenu();
}

function closeMenu() {
  hamburger.classList.remove('hamburger_active');
  menu.classList.remove('menu__list_active');
  overlay.classList.remove('show');
  body.classList.remove('noscroll');

  isMenuOpen = false;
  document.removeEventListener('click', outsideEventListener);
}
