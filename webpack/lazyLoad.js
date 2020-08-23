// Some credit goes to Florida Ivanne Elago for the logic here:
// https://medium.com/caspertechteam/simple-image-placeholders-for-lazy-loading-images-unknown-size-19f0866ceced
function lazyLoad(placeholderImg) {
  const pictureElement = placeholderImg.parentElement;

  // Replace fuzzy placeholder with the real image
  const realImg = new Image();
  pictureElement.appendChild(realImg);
  realImg.classList.add('real-image');
  realImg.src = placeholderImg.getAttribute('data-src');
  realImg.alt = placeholderImg.getAttribute('alt');

  // Replace fuzzy placeholder's webp source with the real image's WebP variant
  const sourceElement = pictureElement.querySelector('source');
  sourceElement.srcset = sourceElement.getAttribute('data-src');

  realImg.onload = function () {
    setTimeout(() => {
      placeholderImg.remove();
      realImg.style.position = 'relative';
    }, 500);
  };
}

export default lazyLoad;
