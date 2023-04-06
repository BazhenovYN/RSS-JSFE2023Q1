'use strict';

const popup = document.querySelector('.popup');
const petCard = document.querySelectorAll('.pet-card');
const closeButton = document.querySelector('.popup__button-close');

popup.addEventListener('click', (event) => {
  if (event.target === popup) {
    closePopup();
  }
});

closeButton.addEventListener('click', () => {
  closePopup();
});

petCard.forEach((card) => {
  card.addEventListener('click', () => {
    showPopup();
  });
});

function showPopup() {
  popup.classList.add('open');
  body.classList.add('noscroll');
}

function closePopup() {
  popup.classList.remove('open');
  body.classList.remove('noscroll');
}
