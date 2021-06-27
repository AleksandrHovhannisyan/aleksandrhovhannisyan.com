export default function lazyLoad(targets, onIntersection, Observer = IntersectionObserver) {
  const observer = new Observer((entries, self) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        onIntersection(entry.target);
        self.unobserve(entry.target);
      }
    });
  });

  targets.forEach((target) => observer.observe(target));
  return observer;
}
