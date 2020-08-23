import toggleColorTheme from './theme';
import { rehighlightActiveNavLink, toggleMobileNavbarVisibility, onNavLinkHovered } from './navbar';
import lazyLoad from './lazyLoad';
import copyCode from './copyCode';

const themeSwitch = document.getElementById('theme-switch');
themeSwitch.addEventListener('click', toggleColorTheme);

const navbar = document.querySelector('.navbar');

const navMenu = navbar.querySelector('.navbar-menu');
navMenu.addEventListener('click', toggleMobileNavbarVisibility);

const navLinks = navMenu.querySelector('.navbar-links');
navLinks.addEventListener('click', (clickEvent) => clickEvent.stopPropagation());

const mobileNavbarToggle = navbar.querySelector('#navbar-toggle');
mobileNavbarToggle.addEventListener('click', toggleMobileNavbarVisibility);

// Manually listen to these events to ensure that we never underline two different links
// simultaneously. For example, if we're on Experience but hovering over Blog, we don't want
// both links to have a focus style. See onNavLinkHovered for how that's handled.
navLinks.querySelectorAll('.navbar-link').forEach((anchor) => {
  anchor.addEventListener('focusin', onNavLinkHovered);
  anchor.addEventListener('mouseenter', onNavLinkHovered);
  anchor.addEventListener('focusout', rehighlightActiveNavLink);
  anchor.addEventListener('mouseleave', rehighlightActiveNavLink);
});

const imgObserver = new IntersectionObserver(function (entries, self) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      lazyLoad(entry.target);
      self.unobserve(entry.target);
    }
  });
});

document.querySelectorAll('#page-content img.placeholder').forEach((img) => {
  imgObserver.observe(img);
});

document.querySelectorAll('.copy-code-button').forEach((copyCodeButton) => {
  copyCodeButton.addEventListener('click', copyCode);
});

// Katex/Latex blog posts
document.querySelectorAll("script[type='math/tex']").forEach((inlineLatex) => {
  const inlineEquationElement = document.createElement('span');
  inlineEquationElement.className = 'inline-equation';
  inlineEquationElement.innerHTML = katex.renderToString(inlineLatex.textContent);
  inlineLatex.replaceWith(inlineEquationElement);
});

document.querySelectorAll("script[type='math/tex; mode=display']").forEach((blockLatex) => {
  const blockEquationElement = document.createElement('div');
  blockEquationElement.className = 'block-equation';
  blockEquationElement.innerHTML = katex.renderToString('\\displaystyle ' + blockLatex.textContent);
  blockLatex.replaceWith(blockEquationElement);
});
