// Note that img is either a source or img tag
function preloadImage(img) {
  if (img.tagName.toLowerCase() === 'source') {
    img.srcset = img.getAttribute('data-src');
  } else {
    img.src = img.getAttribute('data-src');
  }
}

const intersectionConfig = {
  rootMargin: '200px 0px 0px 0px',
  threshold: 0
};

const observer = new IntersectionObserver(function(entries, self) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      preloadImage(entry.target);
      self.unobserve(entry.target);
    }
  });
}, intersectionConfig);

const imgs = document.querySelectorAll('#page-content [data-src]');

imgs.forEach(img => {
  // Listen for any intersections to lazy-load
  observer.observe(img);
  // Open the image file itself if it's clicked
  img.addEventListener('click', clickEvent => {
    const src = clickEvent.target.src;
    window.open(src, '_self');
  });
});
