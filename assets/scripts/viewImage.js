document.querySelectorAll('#post img').forEach(img => {
  img.addEventListener('click', clickEvent => {
    const src = clickEvent.target.src;
    window.open(src, '_self');
  });
});
