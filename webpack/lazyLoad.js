export default function lazyLoad(targets, onIntersection) {
  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        onIntersection(entry.target);
        self.unobserve(entry.target);
      }
    });
  });

  document.querySelectorAll(targets).forEach((target) => observer.observe(target));
  return observer;
}
