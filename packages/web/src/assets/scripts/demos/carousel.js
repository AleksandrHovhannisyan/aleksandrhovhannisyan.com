import Carousel from '../components/Carousel.js';

const navigationControlsTemplate = document.querySelector('#carousel-controls');

const _carousel = new Carousel({
	root: document.querySelector('#carousel'),
	navigationControls: navigationControlsTemplate.content.cloneNode(true),
});

const _slideshow = new Carousel({
	root: document.querySelector('#slideshow'),
	navigationControls: navigationControlsTemplate.content.cloneNode(true),
});
