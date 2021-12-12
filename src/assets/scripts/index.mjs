import ThemeToggle from './components/ThemeToggle/index.mjs';
import lazyLoad from './utils/lazyLoad/index.mjs';

// eslint-disable-next-line no-unused-vars
const themeToggle = new ThemeToggle({
  themeOwner: document.documentElement,
  toggleElement: document.getElementById('theme-toggle'),
  storageKey: 'theme',
  defaultTheme: 'light',
  themeMap: {
    light: 'dark',
    dark: 'light',
  },
});

const lazyImages = document.querySelectorAll('.lazy-picture');
lazyLoad(lazyImages, (pictureElement) => {
  const img = pictureElement.querySelector('.lazy-img');
  const sources = pictureElement.querySelectorAll('source');
  img.onload = () => {
    pictureElement.classList.add('loaded');
    img.removeAttribute('data-src');
  };
  img.onerror = () => {
    pictureElement.classList.add('failed-to-load');
  };
  sources.forEach((source) => {
    source.sizes = source.dataset.sizes;
    source.srcset = source.dataset.srcset;
    source.removeAttribute('data-srcset');
    source.removeAttribute('data-sizes');
  });
  img.src = img.dataset.src;
});

const copyableCodeBlocks = document.querySelectorAll('.code-header.with-copy-button + pre[class*="language-"]');
const copyCodeButtons = document.querySelectorAll('.copy-code-button');

copyCodeButtons.forEach((copyCodeButton, index) => {
  const code = copyableCodeBlocks[index].innerText;

  copyCodeButton.addEventListener('click', () => {
    window.navigator.clipboard.writeText(code);
    copyCodeButton.classList.add('copied');

    setTimeout(() => {
      copyCodeButton.classList.remove('copied');
    }, 2000);
  });
});
