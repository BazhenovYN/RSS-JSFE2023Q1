'use strict';

const popup = document.querySelector('.popup');
const closeButton = document.querySelector('.popup__button-close');

popup.addEventListener('click', (event) => {
  if (event.target === popup) {
    closePopup();
  }
});

closeButton.addEventListener('click', () => {
  closePopup();
});

function showPopup(data) {
  generatePopup(data);
  
  popup.classList.add('open');
  body.classList.add('noscroll');
}

function generatePopup(data) {
  const petImage = popup.querySelector('.pet__image');
  petImage.src = data.imgFull;
  petImage.alt = data.name;

  const petName = popup.querySelector('.pet__name');
  petName.innerText = data.name;

  const petBreed = popup.querySelector('.pet__breed');
  petBreed.innerText = `${data.type} - ${data.breed}`;

  const petDescription = popup.querySelector('.pet__description');
  petDescription.innerText = data.description;
  
  const petAge = popup.querySelector('.pet-info__age');
  petAge.innerText = data.age;

  const petInoculations = popup.querySelector('.pet-info__inoculations');
  petInoculations.innerText = data.inoculations;

  const petDiseases = popup.querySelector('.pet-info__diseases');
  petDiseases.innerText = data.diseases;

  const petParasites = popup.querySelector('.pet-info__parasites');
  petParasites.innerText = data.parasites;
}

function closePopup() {
  popup.classList.remove('open');
  body.classList.remove('noscroll');
}
