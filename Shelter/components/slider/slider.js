'use strict';

const COUNT_OF_CARDS = 3;

const slider = document.querySelector('.slider');
const sliderItems = slider.querySelector('.slides');
const prev = slider.querySelectorAll('.slider__prev');
const next = slider.querySelectorAll('.slider__next');

async function showSlider() {
  const petData = await getDataAboutPets();
  const visibleCards = {
    left: [],
    center: [],
    right: [],
  };

  const centralSlide = addNewSlide('center');
  sliderItems.append(centralSlide);

  const rightSlide = addNewSlide('right', visibleCards.center);
  sliderItems.append(rightSlide);

  const leftSlide = addNewSlide('left', visibleCards.center);
  sliderItems.prepend(leftSlide);

  sliderControl(slider, sliderItems, prev, next);

  function addNewSlide(place, [...excludedNumbers] = []) {
    const slide = document.createElement('div');
    slide.className = 'slide';

    for (let i = 1; i <= COUNT_OF_CARDS; i++) {
      const index = getRandomNumber(0, petData.length - 1, excludedNumbers);
      excludedNumbers.push(index);
      visibleCards[place].push(index);
      addPetCardToHtml(slide, petData[index]);
    }

    return slide;
  }

  function sliderControl(wrapper, items, prev, next) {
    let posInitial;
    let slideSize = items.querySelectorAll('.slide')[0].offsetWidth;
    let allowShift = true;

    items.addEventListener('transitionend', updateSlides);
    window.addEventListener('resize', resizePage);

    prev.forEach((btn) => {
      btn.addEventListener('click', shiftToLeft);
    });

    next.forEach((btn) => {
      btn.addEventListener('click', shiftToRight);
    });

    function shiftToRight() {
      items.classList.add('shifting');

      if (allowShift) {
        posInitial = items.offsetLeft;
        items.style.left = posInitial - slideSize + 'px';

        visibleCards.left = visibleCards.center;
        visibleCards.center = visibleCards.right;
        visibleCards.right = [];
      }

      allowShift = false;
    }

    function shiftToLeft() {
      items.classList.add('shifting');

      if (allowShift) {
        posInitial = items.offsetLeft;
        items.style.left = posInitial + slideSize + 'px';

        visibleCards.right = visibleCards.center;
        visibleCards.center = visibleCards.left;
        visibleCards.left = [];
      }

      allowShift = false;
    }

    function resizePage() {
      slideSize = items.querySelectorAll('.slide')[0].offsetWidth;
      items.style.left = -slideSize + 'px';
    }

    function updateSlides() {
      items.classList.remove('shifting');

      if (!visibleCards.left.length) {
        const leftSlide = addNewSlide('left', visibleCards.center);
        sliderItems.prepend(leftSlide);
        items.querySelector('.slide:last-child').remove();
        items.style.left = -slideSize + 'px';
      } else if (!visibleCards.right.length) {
        const rightSlide = addNewSlide('right', visibleCards.center);
        sliderItems.append(rightSlide);
        items.querySelector('.slide:first-child').remove();
        items.style.left = -slideSize + 'px';
      }

      allowShift = true;
    }
  }
}
