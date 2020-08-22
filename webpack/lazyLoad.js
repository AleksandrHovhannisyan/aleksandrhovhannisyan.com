// Some credit goes to Florida Ivanne Elago for the logic here:
// https://medium.com/caspertechteam/simple-image-placeholders-for-lazy-loading-images-unknown-size-19f0866ceced
function lazyLoad(placeholderImg) {
  const pictureElement = placeholderImg.parentElement;

  // Create a new img element and add it to the picture element
  const realImg = new Image();
  pictureElement.appendChild(realImg);
  realImg.classList.add('real-image');
  realImg.src = placeholderImg.getAttribute('data-src');
  realImg.alt = placeholderImg.getAttribute('alt');

  // Update the source element to contain the true image (in WebP format)
  const sourceElement = pictureElement.querySelector('source');
  sourceElement.srcset = sourceElement.getAttribute('data-src');

  realImg.onload = function () {
    const isClickable = pictureElement.hasAttribute('data-clickable');

    if (isClickable) {
      // Open the image if it's clicked
      realImg.addEventListener('click', (clickEvent) => {
        const src = clickEvent.target.src;
        window.open(src, '_self');
      });
    }

    setTimeout(() => {
      // We don't need the placeholder anymore, so remove it after a short delay
      placeholderImg.remove();
      // Need this or else the `picture` will disappear
      realImg.style.position = 'relative';
    }, 500);
  };
}

export default lazyLoad;
