function lazyLoad(img) {
  const pictureElement = img.parentElement;
  const source = pictureElement.querySelector('.lazy-source');

  source.srcset = source.getAttribute('data-srcset');
  img.src = img.getAttribute('data-src');
}

export default lazyLoad;
