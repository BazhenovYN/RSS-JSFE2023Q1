'use strict';

const container = document.querySelector('.slider__items');
const countOfCards = {
  desktop: 3,
  tablet: 2,
  mobile: 1,
};

async function showSlider() {
  const petData = await getDataAboutPets();
  const excludedNumbers = [];
  for (let i = 0; i < countOfCards.desktop; i++) {
    const index = getRandomNumber(0, petData.length - 1, excludedNumbers);
    excludedNumbers.push(index);
    addPetCardToHtml(container, petData[index]);
  }
}
