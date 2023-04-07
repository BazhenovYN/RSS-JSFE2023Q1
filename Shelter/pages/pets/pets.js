'use strict';

const container = document.querySelector('.our-friends__cards');
const countOfCards = {
  desktop: 8,
  tablet: 6,
  mobile: 3,
};

async function showTable() {
  const petData = await getDataAboutPets();
  const excludedNumbers = [];
  for (let i = 0; i < countOfCards.desktop; i++) {
    const index = getRandomNumber(0, petData.length - 1, excludedNumbers);
    excludedNumbers.push(index);
    addPetCardToHtml(container, petData[index]);
  }
}

showTable();
