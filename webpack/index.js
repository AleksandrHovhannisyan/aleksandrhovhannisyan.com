import { Navbar, ThemeToggle } from 'components';
import { lazyLoad, copyToClipboard } from 'utils';

// eslint-disable-next-line no-unused-vars
const navbar = new Navbar();

// eslint-disable-next-line no-unused-vars
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
  pictureElement.classList.add('loaded');
});

document.querySelectorAll('.copy-code-button').forEach((copyCodeButton) => {
  copyCodeButton.addEventListener('click', () => {
    const code = copyCodeButton.getAttribute('data-code');
    copyToClipboard(code);
    copyCodeButton.classList.add('copied');

    setTimeout(() => {
      copyCodeButton.classList.remove('copied');
    }, 2000);
  });
});
