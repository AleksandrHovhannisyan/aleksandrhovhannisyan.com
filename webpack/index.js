import copyCode from './copyCode';
import Navbar from './navbar';
import ThemeToggle from './ThemeToggle';
import lazyLoad from './lazyLoad';

const navbar = new Navbar();

const themeToggle = new ThemeToggle({
  toggleSelector: '#theme-toggle',
  storageKey: 'theme',
  themeOwner: document.documentElement,
});

lazyLoad('.lazy-img', (img) => {
  const pictureElement = img.parentElement;
  const source = pictureElement.querySelector('.lazy-source');

  source.srcset = source.getAttribute('data-srcset');
  img.src = img.getAttribute('data-src');
});

document.querySelectorAll('.copy-code-button').forEach((copyCodeButton) => {
  copyCodeButton.addEventListener('click', copyCode);
});
