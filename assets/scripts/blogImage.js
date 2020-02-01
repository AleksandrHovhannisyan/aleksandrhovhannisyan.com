function preloadImage(img) {
  img.src = img.getAttribute('data-src');
  // Reminder: We're using the WebP format in a source element, with the img serving as a fail-safe
  // for browsers that don't yet support WebP. Thus, we need to query the source element so we can
  // replace the placeholder with the .webp image. Note that there's only one source element per picture.
  const sourceElement = img.parentElement.querySelector('source');
  sourceElement.srcset = sourceElement.getAttribute('data-src');
}

// Intersect 40px in advance so the image load is almost imperceptible
const intersectionConfig = {
  rootMargin: '40px'
};

const observer = new IntersectionObserver(function(entries, self) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      preloadImage(entry.target);
      self.unobserve(entry.target);
    }
  });
}, intersectionConfig);

const imgs = document.querySelectorAll('#page-content img[data-src]');

imgs.forEach(img => {
  // Listen for any intersections to lazy-load
  observer.observe(img);
  // Open the image file itself if it's clicked
  img.addEventListener('click', clickEvent => {
    const src = clickEvent.target.src;
    window.open(src, '_self');
  });
});
