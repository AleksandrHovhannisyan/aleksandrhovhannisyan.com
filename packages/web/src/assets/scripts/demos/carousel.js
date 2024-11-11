import Carousel from '../components/Carousel.js';

const navigationControlsTemplate = document.querySelector('#carousel-controls');

// eslint-disable-next-line no-unused-vars
const carousel = new Carousel({
  root: document.querySelector('#carousel'),
  navigationControls: navigationControlsTemplate.content.cloneNode(true),
});

// eslint-disable-next-line no-unused-vars
const slideshow = new Carousel({
  root: document.querySelector('#slideshow'),
  navigationControls: navigationControlsTemplate.content.cloneNode(true),
});
