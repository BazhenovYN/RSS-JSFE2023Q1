'use strict';

const TOTAL_DATA_LENGTH = 48;
const DESCTOP_WIDTH = 1280;
const TABLET_WIDTH = 600;

async function showTable() {
  const container = document.querySelector('.our-friends__cards');
  const start = document.querySelector('.pagination__start');
  const prev = document.querySelector('.pagination__prev');
  const next = document.querySelector('.pagination__next');
  const end = document.querySelector('.pagination__end');
  const pageNumber = document.querySelector('.pagination__page');

  let currentPage = 1;
  let cardsOnPage = getNumberOfCardsOnThePage();
  let fistIndex;
  const data = await getData();

  showPage();

  start.addEventListener('click', startPage);
  next.addEventListener('click', nextPage);
  prev.addEventListener('click', prevPage);
  end.addEventListener('click', endPage);

  window.addEventListener('resize', resizePage);

  function showPage() {
    container.querySelectorAll('div').forEach((element) => {
      element.remove();
    });
    pageNumber.innerText = currentPage;
    fistIndex = cardsOnPage * currentPage - cardsOnPage;
    const lastIndex = cardsOnPage * currentPage - 1;
    for (let i = fistIndex; i <= lastIndex; i++) {
      addPetCardToHtml(container, data[i]);
    }
    updatePagination();
  }

  async function getData() {
    const jsonData = await getDataAboutPets();
    const data = [];
    let set8Pets = [];
    let set6Pets = [];
    while (data.length < TOTAL_DATA_LENGTH) {
      const randomPet = getRandomNumber(0, jsonData.length - 1);
      if (!set8Pets.includes(randomPet) && !set6Pets.includes(randomPet)) {
        data.push(jsonData[randomPet])
        set6Pets.push(randomPet);
        set8Pets.push(randomPet);
        if (set6Pets.length === 6) {
          set6Pets = [];
        }

        if (set8Pets.length === 8) {
          set8Pets = [];
        }
      }
    }
    return data;
  }

  function getNumberOfCardsOnThePage() {
    const clientWidth = document.documentElement.clientWidth;
    if (clientWidth < TABLET_WIDTH) {
      return 3;
    } else if (clientWidth < DESCTOP_WIDTH) {
      return 6;
    } else {
      return 8;
    }
  }

  function startPage() {
    currentPage = 1;
    showPage();
  }

  function prevPage() {
    currentPage -= 1;
    showPage();
  }

  function nextPage() {
    currentPage += 1;
    showPage();
  }

  function endPage() {
    currentPage = Math.floor(data.length / cardsOnPage);
    showPage();
  }

  function updatePagination() {
    if (currentPage === 1) {
      start.setAttribute('disabled', '');
      prev.setAttribute('disabled', '');
    } else {
      start.removeAttribute('disabled');
      prev.removeAttribute('disabled');
    }

    if (cardsOnPage * currentPage >= data.length) {
      next.setAttribute('disabled', '');
      end.setAttribute('disabled', '');
    } else {
      next.removeAttribute('disabled');
      end.removeAttribute('disabled');
    }
  }

  function resizePage() {
    const cardsOnPageNow = getNumberOfCardsOnThePage();
    if (cardsOnPage === cardsOnPageNow) {
      return;
    }
    cardsOnPage = cardsOnPageNow;
    currentPage = Math.ceil((fistIndex + 1) / cardsOnPage);
    showPage();
  }
}

showTable();
