// Some credit goes to Florida Ivanne Elago for the logic here:
// https://medium.com/caspertechteam/simple-image-placeholders-for-lazy-loading-images-unknown-size-19f0866ceced
function preloadImage(placeholderImg) {
  const pictureElement = placeholderImg.parentElement;

  // Create a new img element and add it to the picture element
  const realImg = new Image();
  pictureElement.appendChild(realImg);
  realImg.classList.add('real-image');
  realImg.src = placeholderImg.getAttribute('data-src');
  realImg.alt = placeholderImg.getAttribute('alt');
  
  // Images with shadows
  if (placeholderImg.getAttribute('data-shadow')) {
    realImg.classList.add('img-with-shadow');
  }

  // Update the source element to contain the true image (in WebP format)
  const sourceElement = pictureElement.querySelector('source');
  sourceElement.srcset = sourceElement.getAttribute('data-src');
  
  realImg.onload = function() {
    // Transitions opacity from 0 to 1 smoothly
    realImg.classList.add('loaded');

    // Open the image if it's clicked
    realImg.addEventListener('click', clickEvent => {
      const src = clickEvent.target.src;
      window.open(src, '_self');
    });

    setTimeout(() => { 
      // We don't need the placeholder anymore
      placeholderImg.remove();
      // Need this or else the `picture` will disappear
      realImg.style.position = 'relative';
      // For images with shadows; set to hidden initially to prevent the placeholder
      // from showing up behind the real image
      pictureElement.style.overflow = 'visible';
    }, 800);
    
  }
}

const observer = new IntersectionObserver(function(entries, self) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      preloadImage(entry.target);
      self.unobserve(entry.target);
    }
  });
});

const imgs = document.querySelectorAll('#page-content img.placeholder');

imgs.forEach(img => {
  // Listen for any intersections to lazy-load
  observer.observe(img);
});
