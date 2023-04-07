'use strict';

const body = document.body;

function getRandomNumber(min, max, excludedNumbers = []) {
  let randomNumber = 0;

  do {
    randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (excludedNumbers.includes(randomNumber));

  return randomNumber;
}

async function getJsonFile(fileName) {
  const response = await fetch(fileName);
  const data = await response.json();
  return data;
}

async function getDataAboutPets() {
  try {
    return await getJsonFile('../../assets/data/pets.json');
  } catch (err) {
    console.log(err);
    return [];
  }
}

function addPetCardToHtml(container, data) {
  const img = document.createElement('img');
  img.className = 'pet-card__image';
  img.src = data.img;
  img.alt = data.name;

  const title = document.createElement('div');
  title.className = 'pet-card__title';
  title.innerText = data.name;

  const button = document.createElement('button');
  button.className = 'pet-card__button secondary-button';
  button.innerText = 'Learn more';

  const petCard = document.createElement('div');
  petCard.className = 'pet-card';
  petCard.addEventListener('click', () => {
    showPopup(data);
  });
  petCard.append(img, title, button);

  container.append(petCard);
}
